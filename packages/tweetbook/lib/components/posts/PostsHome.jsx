import { Components, registerComponent } from 'meteor/vulcan:core';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

const PostsHome = (props, context) => {
  const terms = _.isEmpty(props.location && props.location.query) ? {view: 'new'}: props.location.query;
  return <Components.PostsList terms={terms}/>
};

PostsHome.displayName = "PostsHome";

registerComponent({ name: 'PostsHome', component: PostsHome });
