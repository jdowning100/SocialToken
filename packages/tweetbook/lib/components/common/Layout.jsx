import { Components, registerComponent, withCurrentUser } from 'meteor/vulcan:core';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Helmet from 'react-helmet';

class Layout extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      balance: !!this.props.currentUser ? this.props.currentUser.balance : 0
    }
    this.refresh = this.refresh.bind(this)
  }
  componentDidMount(){
    if(!!this.props.currentUser && this.props.currentUser.balance == null){
      Meteor.call('getUser', this.props.currentUser._id, (err, result) => {
        this.setState({balance: result.balance})
      })
    }
    console.log(this.props.currentUser)
  }

  refresh(){
    console.log("Calling refresh")
    if(!!this.props.currentUser){
      Meteor.call('getUser', this.props.currentUser._id, (err, result) => {
        this.setState({balance: result.balance})
      })
  }
  }
  

 /* componentDidUpdate(prevProps, prevState, snapshot){
    if(!!this.props.currentUser && prevState.balance != this.props.currentUser.balance && this.props.currentUser.balance != null){
      this.setState({balance: this.props.currentUser.balance})
    }
    else if(!!this.props.currentUser && this.props.currentUser.balance != null){
      Meteor.call('getUser', this.props.currentUser._id, (err, result) => {
        if(prevState.balance != result.balance)
          this.setState({balance: result.balance})
      })
    }
  }*/

  render(){
    const {currentUser, children, currentRoute} = this.props;
    return(

  <div className={classNames('wrapper', `wrapper-${currentRoute.name.replace('.', '-')}`)} id="wrapper">

    <Helmet>
    <link
    name="bootstrap"
          href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css"
          rel="stylesheet"
        />
      <link
      name="fontawesome"
          href="https://use.fontawesome.com/releases/v5.3.1/css/all.css"
          rel="stylesheet"
        />
        <link
          href="https://a.slack-edge.com/ae7f/img/services/twitter_512.png"
          rel="shortcut icon"
        />
        <script
          src="https://code.jquery.com/jquery-3.3.1.min.js"
          type="text/javascript"
        />
    </Helmet>
   
    <Components.HeadTags />

    {currentUser ? <Components.UsersProfileCheck currentUser={currentUser} documentId={currentUser._id} /> : null}

    <Components.Header balance={this.state.balance} refresh={this.refresh}/>
  
    <div className="main" style={{padding: "2%"}}>

      <Components.FlashMessages />

      {/*<Components.Newsletter />*/}

      {children}

    </div>
  
    <Components.Footer />
  
  </div>
    )
  }
}
registerComponent({ name: 'Layout', component: Layout, hocs: [withCurrentUser] });