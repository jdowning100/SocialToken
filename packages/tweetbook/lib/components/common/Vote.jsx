import { Components, registerComponent, withMessages } from 'meteor/vulcan:core';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withVote, hasVotedClient } from 'meteor/vulcan:voting';
import { FormattedMessage, intlShape } from 'meteor/vulcan:i18n';

//
class Vote extends PureComponent {

  constructor() {
    super();
    this.vote = this.vote.bind(this);
    this.getActionClass = this.getActionClass.bind(this);
    this.hasVotedStar = this.hasVotedStar.bind(this);

    this.state = {class: "heart", voted: false};
  }
  componentDidMount(){
    this.setState({class: this.hasVotedStar() ? "heart-red" : "heart"})
  }

  vote(e) {

    e.preventDefault();
   
    const document = this.props.document;
    const collection = this.props.collection;
    const user = this.props.currentUser;

    if(!user){
      this.props.flash({id: 'users.please_log_in'});
    } else if(!this.hasVotedStar()){
        this.setState({class: "is_animating", voted: true});
        this.props.vote({document, voteType: 'star', collection, currentUser: this.props.currentUser});
    } 
 
    
 
  }

  hasVotedStar() {
    return hasVotedClient({document: this.props.document, voteType: 'star'})
  }


  getActionClass() {

    const actionsClass = classNames(
      'vote-button',
      {upvoted: this.hasVotedStar()},
    );

    return actionsClass;
  }

  render() {
    return (
      /*<div className={this.getActionClass()}>*/
      <span>
        <div className={this.props.currentUser ? this.state.class : "heart"} onClick={this.vote} />
        <div style={{/*float: 'left', overflow: 'hidden'*/}} className="vote-count">{this.props.document.baseScore || 0} likes</div>
      </span>
    )
  }

}

Vote.propTypes = {
  document: PropTypes.object.isRequired, // the document to upvote
  collection: PropTypes.object.isRequired, // the collection containing the document
  vote: PropTypes.func.isRequired, // mutate function with callback inside
  currentUser: PropTypes.object, // user might not be logged in, so don't make it required
};

Vote.contextTypes = {
  intl: intlShape
};

registerComponent({ name: 'Vote', component: Vote, hocs: [withMessages, withVote] });
