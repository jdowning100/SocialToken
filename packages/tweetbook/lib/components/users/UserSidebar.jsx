import { Components, registerComponent } from 'meteor/vulcan:core';
import React from 'react';
import PropTypes from 'prop-types';
import Users from 'meteor/vulcan:users';
import { Link } from 'react-router';

const UserSidebar = ({currentUser, postCount, followingCount, followerCount, showFollow, onFollow, showUnfollow, onUnfollow}) => {

    return (
    <div className="user-information">
    <div className="row">
      <div className="col-4 user-information__image">
        <Components.UsersAvatar user={currentUser} size="large"/>
      </div>
      <div className="col-8 user-information__text">
        <h4>
        <Components.UsersName user={currentUser} />
        </h4>
        <div className="user-information__stats user-information__stats_small">
          <ul>
            <li>
              <span className="user-information__stat-title">
                Posts:
              </span>
              <span>
              <Link className="users-name" to={Users.getProfileUrl(currentUser)}>{postCount}</Link>
              </span>
            </li>
            <li>
              <span className="user-information__stat-title">
                Following:
              </span>
              <span>
                <a href="/users/{req.user._id}/following">
                  
                </a>
              </span>
            </li>
            <li>
              <span className="user-information__stat-title">
                Followers:
              </span>
              <span>
                <a href="/users/{req.user._id}/followers">
                  
                </a>
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div className="col-md-12 user-information__stats user-information__stats_large">
        <ul>
          <li>
            <span className="user-information__stat-title">
              Posts:
            </span>
            <span>
            <Link className="users-name" to={Users.getProfileUrl(currentUser)}>{postCount}</Link>
              
            </span>
          </li>
          <li>
          <span className="user-information__stat-title">
                Following:
              </span>
              <span>
                {followingCount}
                </span>
          </li>
          <li>
          <span className="user-information__stat-title">
                Followers:
              </span>
              <span>
                {followerCount}
              </span>
            
          </li>
        </ul>
      </div>
      {showFollow ?
      <div className="col-12" style={{textAlign: "center", marginTop: "10%"}}>
          <Components.Button variant="primary" size="large" onClick={onFollow}>Follow</Components.Button>
      </div>
      : null}
      { showUnfollow ? 
        <div className="col-12" style={{textAlign: "center", marginTop: "10%"}}>
          <Components.Button variant="primary" size="large" onClick={onUnfollow}>Unfollow</Components.Button>
      </div>
      : null}
    </div>
  </div>
  );
}

UserSidebar.propTypes = {
    currentUser: PropTypes.object.isRequired,
  }
registerComponent({ name: 'UserSidebar', component: UserSidebar });
