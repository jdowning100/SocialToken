import { registerFragment } from 'meteor/vulcan:core';

registerFragment(/* GraphQL */`
  fragment PostsList on Post {
    # posts
    _id
    #title
    url
    slug
    postedAt
    createdAt
    sticky
    status
    excerpt
    viewCount
    clickCount
    body
    htmlBody
    # users
    userId
    author
    user {
      ...UsersMinimumInfo
    }
    # embedly
    thumbnailUrl
    # comments
    commentCount
    commenters {
      ...UsersMinimumInfo
    }
    # voting
    currentUserVotes{
      ...VoteFragment
    }
    baseScore
    score
  }
`);

registerFragment(/* GraphQL */`
  fragment PostsPage on Post {
    ...PostsList
    body
    htmlBody
  }
`);

