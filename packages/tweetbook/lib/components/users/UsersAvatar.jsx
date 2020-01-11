import { registerComponent } from 'meteor/vulcan:core';
import React from 'react';
import PropTypes from 'prop-types';
import Users from 'meteor/vulcan:users';
import { Link } from 'react-router';
import classNames from 'classnames';

const UsersAvatar = ({className, user, size, link}) => {

  const avatarUrl = user.avatarUrl || Users.avatar.getUrl(user);
  var avheight = "50px"; 
  var avwidth = "50px";
  switch(size){
    case "small": avheight = "25px";  avwidth = "25px"; break;
    case "medium":  avheight = "50px";  avwidth = "50px"; break;
    case "large":  avheight = "75px"; avwidth  = "75px"; break;
                  
  } 
  const img = <img alt={Users.getDisplayName(user)} className="avatar-image" src={avatarUrl} title={user.username} style={{height: avheight, width: avwidth}}/>;
  const initials = <span className="avatar-initials"><span>{Users.avatar.getInitials(user)}</span></span>;

  const avatar = avatarUrl ? img : initials;

  return (
    <div className={classNames('avatar', className)}>
      {link ? 
        <Link to={Users.getProfileUrl(user)}>
          <span>{avatar}</span>
        </Link> 
        : <span>{avatar}</span>
      }
    </div>
  );

}

UsersAvatar.propTypes = {
  user: PropTypes.object.isRequired,
  size: PropTypes.string,
  link: PropTypes.bool
}

UsersAvatar.defaultProps = {
  size: 'medium',
  link: true
}

UsersAvatar.displayName = 'UsersAvatar';

registerComponent({ name: 'UsersAvatar', component: UsersAvatar });
