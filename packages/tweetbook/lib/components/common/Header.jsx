import React from 'react';
import PropTypes from 'prop-types';
import { withCurrentUser, getSetting, Components, registerComponent } from 'meteor/vulcan:core';
import { Posts } from '../../modules/posts/index.js';
import Helmet from "react-helmet";
import Message from './Message.jsx'

const Header = (props) => {
  
  const logoUrl = getSetting('logoUrl');
  const siteTitle = getSetting('title', 'My App');
  const tagline = getSetting('tagline');

  return (
    <header className="navbar" role="banner">
    <Helmet>
    <script
          src="https://code.jquery.com/jquery-3.3.1.min.js"
          type="text/javascript"
        />
        <script>{`$(document).ready( () => { $('.control-label.col-sm-3').each( function(i, obj){ obj.innerText = "Comment"}) })`}</script>
    </Helmet>
        <div className="container">
        
          <div className="navbar__group navbar__group_left">
            <ul className="navbar__main-navigation">
              <li>
                <a href="/" title="Home">
                  <i aria-hidden="true" className="fas fa-home" />
                  <span>Home</span>
                </a>
              </li>
              <li>
              {!!props.currentUser ? <a href={`/users/${props.currentUser.slug}`} title="Profile">
                  <i aria-hidden="true" className="fas fa-user" />
                  <span>Profile</span>
                </a> : null }
              </li> 
              
              <li>
                
                {!!props.currentUser ? <a style={{color: "white"}}><i aria-hidden="true" className="fas fa-bell" /> Notifications</a> : null}
                  
           
              </li>
            </ul>
          </div>
          {/*<span className="navbar__logo">
            <a href="/">
              <img src="/socialtoken_notagline.png" />
            </a>
          </span>*/}
          <div className="navbar__group navbar__group_right">
            <div className="navbar__new-tweet">
            <Components.ShowIf check={Posts.options.mutations.new.check}>
              <Components.PostsNewButton/>
            </Components.ShowIf>
            </div>
            <div className="navbar__profile">
            {!!props.currentUser ? <Components.UsersMenu/> : <Components.UsersAccountMenu/>}
            </div>
            {props.currentUser != undefined ? <div className="navbar__balance" style={{color: "white"}}><span>Balance: {props.balance} SNT</span>
            <button onClick={props.refresh} style={{color: "white", backgroundColor: "#1f2e3f", border: "none"}}><i aria-hidden="true" className="fas fa-sync" /></button></div>
            : null}
          </div>
        </div>
      </header>

   /* <div className="header-wrapper">

      <header className="header">

        <div className="logo">
          <Components.Logo logoUrl={logoUrl} siteTitle={siteTitle} />
          {tagline ? <h2 className="tagline">{tagline}</h2> : "" }
        </div>
        
        <div className="nav">
          
          <div className="nav-user">
            {!!props.currentUser ? <Components.UsersMenu/> : <Components.UsersAccountMenu/>}
          </div>

          <div className="nav-new-post">
            <Components.ShowIf check={Posts.options.mutations.new.check}>
              <Components.PostsNewButton/>
            </Components.ShowIf>
          </div>

        </div>

      </header>
  </div>
*/
  )
}

Header.displayName = "Header";

Header.propTypes = {
  currentUser: PropTypes.object,
};

registerComponent({ name: 'Header', component: Header, hocs: [withCurrentUser] });
