import React from "react";
import uuidv4 from 'uuid/v4';
import { Segment, Button, Input } from "semantic-ui-react";
import firebase from "../../firebase";

import FileModal from './FileModal';
import ProgressBar from './ProgressBar';

class MessagesForm extends React.Component {
  state = {
    errors: [],
    channel: this.props.currentChannel,
    loading: false,
    message: '',
    modal: false,
    percentUploaded: 0,
    storageRef: firebase.storage().ref(),
    uploadTask: null,
    uploadState: '',
  };

  openModal = () => this.setState( { modal: true } );

  closeModal = () => this.setState( { modal: false } );

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  createMessage = (fileUrl = null) => {
    const message = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: this.props.user.uid,
        name: this.props.user.displayName,
        avatar: this.props.user.photoURL
      },
    };
    if ( fileUrl !== null ) {
      message[ 'image' ] = fileUrl;
    } else {
      message[ 'content' ] = this.state.message;
    }
    return message;
  };

  sendMessage = () => {
    const { messagesRef } = this.props;
    const { message, channel } = this.state;

    if ( message ) {
      this.setState( { loading: true } );
      messagesRef
        .child(channel.id)
        .push()
        .set( this.createMessage() )
        .then( () => {
          this.setState( { loading: false, message: '', errors: [] })
        } )
        .catch( err => {
          console.err( err );
          this.setState( {
            loading: false,
            errors: this.state.errors.concat(err)
          })
        })
    } else {
      this.setState( {
        errors: this.state.errors.concat({ message: 'Add a message' })
      })
    }

  }

  uploadFile = ( file, metadata ) => {
    const pathToUpload = this.props.currentChannel.id;
    const ref = this.props.messagesRef;
    const filePath = `chat/public/${ uuidv4() }.jpg`;

    this.setState( {
      uploadState: 'uploading',
      uploadTask: this.state.storageRef.child( filePath ).put( file, metadata ),

    },
      () => {
        this.state.uploadTask.on( 'state_changed', snap => {
          const percentUploaded = Math.round( ( snap.bytesTransferred / snap.totalBytes ) * 100 );
          console.log(percentUploaded)
          this.setState( { percentUploaded } )
        },
          err => {
            console.error( err );
            this.setState( {
              errors: this.state.errors.concat( err ),
              uploadState: 'error',
              uploadTask: null,
            } )
          },
          () => {
            this.state.uploadTask.snapshot.ref.getDownloadURL()
              .then( downloadUrl => {
                this.sendFileMessage( downloadUrl, ref, pathToUpload )
              } )
              .catch( err => {
                console.error( err );
                this.setState( {
                  errors: this.state.errors.concat( err )
                } )
              } )
          }
        )
      }
    )
  };

  sendFileMessage = ( fileUrl, ref, pathToUpload ) => {
    ref.child( pathToUpload )
      .push()
      .set( this.createMessage(fileUrl) )
      .then( () => {
        this.setState({ uploadState: 'done'})
      } )
      .catch( err => {
        console.err( err );
        this.setState( {
          errors: this.state.errors.concat( err )
        } )
      } )
  }

  render() {
    const { errors, message, loading, modal, uploadState, percentUploaded } = this.state;

    return (
      <Segment className="message__formm">
        <Input
          fluid
          name="message"
          disabled={loading}
          style={{ marginBottom: "0.7em" }}
          label={<Button icon="add" />}
          labelPosition="left"
          placeholder="Write your message"
          onChange={ this.handleChange }
          value={ message }
          className={
            errors.some( error => error.message.includes( 'message' )) ? 'error' : ''
          }
        />

        <Button.Group icon widths="2">
          <Button
            onClick={ this.sendMessage }
            color="orange"
            content="Add Reply"
            labelPosition="left"
            icon="edit"
          />
          <Button
            color="teal"
            onClick={ this.openModal }
            content="Upload Media"
            labelPosition="right"
            icon="cloud upload"
          />
        </Button.Group>
          <FileModal
            modal={ modal }
            closeModal={ this.closeModal }
            uploadFile={ this.uploadFile }
          />
        <ProgressBar
          uploadState={ uploadState }
          percentUploaded={ percentUploaded }
        />
      </Segment>
    );
  }
}

export default MessagesForm;
