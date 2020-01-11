import { registerFragment } from 'meteor/vulcan:core';
import { extendFragment } from 'meteor/vulcan:lib';
// ------------------------------ Vote ------------------------------ //

// note: fragment used by default on the UsersProfile fragment
registerFragment(/* GraphQL */`
  fragment VotedItem on Vote {
    # vulcan:voting
    documentId
    power
    votedAt
  }
`);

// ------------------------------ Users ------------------------------ //

// note: fragment used by default on UsersProfile, PostsList & CommentsList fragments
registerFragment(/* GraphQL */`
  fragment UsersMinimumInfo on User {
    # vulcan:users
    _id
    slug
    postCount
    username
    displayName
    emailHash
    avatarUrl
    pageUrl
    address
    followers
  }
`);

registerFragment(/* GraphQL */`
  fragment UsersProfile on User {
    # vulcan:users
    ...UsersMinimumInfo
    createdAt
    isAdmin
    bio
    htmlBio
    twitterUsername
    website
    groups
    # vulcan:posts
    postCount
    # vulcan:comments
    commentCount
    balance
    following
  }
`);


extendFragment(
  'UsersCurrent',
  `
  address
  followers
  following
  balance
  postCount
`
);

