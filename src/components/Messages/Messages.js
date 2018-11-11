import React from 'react';
import { Segment, Comment } from 'semantic-ui-react';
import firebase from '../../firebase';

import MessagesHeader from './MessagesHeader';
import MessagesForm from './MessagesForm';

export default class Messages extends React.Component {

  state = {
    messagesRef: firebase.database().ref( 'messages' ),
    channel: this.props.currentChannel,
  }

  render() {

    const { messagesRef, channel } = this.state;
    
    return (
      <React.Fragment>
        <MessagesHeader />

        <Segment>
          <Comment.Group className="messages" >
            {/* messages */}
          </Comment.Group>
        </Segment>
        <MessagesForm
          messagesRef={ messagesRef }
          currentChannel={ channel }
          user={ this.props.currentUser }
        />
      </React.Fragment>
    )
  }
}