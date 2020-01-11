import React from 'react';
import { withCurrentUser, getSetting, Components, registerComponent } from 'meteor/vulcan:core';


export default class Message extends React.Component{
    constructor(props){
        super(props)
        this.state = {text: "", userToSend: ""};
        
    }

    handleSubmit(event) {
        alert('A message was submitted: ' + this.state.value);
        Meteor.call('sendMessage', {userId: this.props.currentUser._id, message: this.state.text, userToSend: this.state.userToSend})
      }

    render(){
        return(
            <Components.ModalTrigger size={'large'} title={'Send Message'} component={<button aria-hidden="true" className="fas fa-comments" />}>
                <form>
                    <label>
                        Username:
                    </label>
                    <input type="text" value={this.state.userToSend} onChange={(e) => this.setState({userToSend: e.target.value})} />
                    <label>
                      Message:
                      <input type="text" value={this.state.text} onChange={(e) => this.setState({text: e.target.value})} />
                    </label>
                    <button className="fa-comments" onClick={this.handleSubmit.bind(this)}>Send</button>
                  </form>
                </Components.ModalTrigger>
        )
    }


}