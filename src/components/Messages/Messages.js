import React from "react";
import { Segment, Comment } from "semantic-ui-react";
import firebase from "../../firebase";

import MessagesHeader from "./MessagesHeader";
import MessagesForm from "./MessagesForm";
import Message from './Message';

export default class Messages extends React.Component {
  state = {
    messagesRef: firebase.database().ref("messages"),
    channel: this.props.currentChannel,
    messages: [],
    messagesLoading: true,
  };

  componentDidMount() {
    const { currentChannel: channel, currentUser: user } = this.props;

    if (user && channel) {
      this.addListeners(channel.id);
    }
  }

  addListeners = channelId => {
    this.addMessageListener(channelId);
  };

  addMessageListener = channelId => {
    let loadedMessages = [];
    this.state.messagesRef.child(channelId).on("child_added", snap => {
      loadedMessages.push( snap.val() );
      this.setState( {
        messages: loadedMessages,
        messagesLoading: false,
      })
    });
  };

  displayMessages = messages => (
    messages.length > 0 && messages.map( message => (
      <Message
        key={ message.timestamp }
        message={ message }
        user={this.props.currentUser}
      />
    ))
  )

  render() {
    const { messagesRef, messages, channel } = this.state;

    return (
      <React.Fragment>
        <MessagesHeader />
        <Segment>
          <Comment.Group className="messages">
            { this.displayMessages(messages) }
          </Comment.Group>{ " " }
        </Segment>{" "}
        <MessagesForm
          messagesRef={messagesRef}
          currentChannel={channel}
          user={this.props.currentUser}
        />{" "}
      </React.Fragment>
    );
  }
}
