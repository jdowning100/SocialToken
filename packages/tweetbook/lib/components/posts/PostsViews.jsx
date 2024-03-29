import { Components, registerComponent, withCurrentUser, Utils } from 'meteor/vulcan:core';
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import Users from 'meteor/vulcan:users';

const PostsViews = (props, context) => {
  let views = ['top', 'new', 'best'];
  const adminViews = ['pending', 'rejected', 'scheduled'];

  if (Users.canDo(props.currentUser, 'posts.edit.all')) {
    views = views.concat(adminViews);
  }

  const query = _.clone(props.router.location.query);

  return (
    <div className="posts-views">
      <Components.Dropdown
        variant="default"
        id="views-dropdown"
        className="views btn-secondary"
        labelId={'posts.view'}
        menuItems={[
          ...views.map(view => ({
            to: { pathname: Utils.getRoutePath('posts.list'), query: { ...query, view: view } },
            labelId: `posts.${view}`,
          })),
          {
            to: `/daily`,
            labelId: `posts.daily`,
          },
        ]}
      />
    </div>
  );
};

PostsViews.propTypes = {
  currentUser: PropTypes.object,
  defaultView: PropTypes.string,
};

PostsViews.defaultProps = {
  defaultView: 'new',
};

PostsViews.contextTypes = {
  currentRoute: PropTypes.object,
};

PostsViews.displayName = 'PostsViews';

registerComponent({ name: 'PostsViews', component: PostsViews, hocs: [withCurrentUser, withRouter] });
