import { Components, registerComponent, withList, withCurrentUser, Utils } from 'meteor/vulcan:core';
import React from 'react';
import PropTypes from 'prop-types';
import { Posts } from '../../modules/posts/index.js';
import { FormattedMessage, intlShape } from 'meteor/vulcan:i18n';
import classNames from 'classnames';
import Users from 'meteor/vulcan:users';
import { renderToStringWithData } from 'react-apollo';
import { isNullOrUndefined } from 'util';
const Error = ({error}) => <Components.Alert className="flash-message" variant="danger"><FormattedMessage id={error.id} values={{value: error.value}}/>{error.message}</Components.Alert>

class PostsList extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      user: undefined,
      showUnfollow: false,
      showFollow: false
    }
    this.followUser = this.followUser.bind(this)
    this.unfollowUser = this.unfollowUser.bind(this)
  }
  componentDidMount(){
    if(this.props.terms.userId != undefined){
      
      Meteor.call('getUser', this.props.terms.userId, (err, result) => {
        if(err){
          console.log(err)
        }
        console.log(result)
        let shouldFollow = false, shouldUnfollow = false;

        if(this.props.currentUser != undefined){
          if(result.followers.includes(this.props.currentUser._id)){
              shouldUnfollow = true;
          }
          if(shouldUnfollow != true && this.props.currentUser._id != this.props.terms.userId){
              shouldFollow = true;
          }

        }
        this.setState({user: result, showUnfollow: shouldUnfollow, showFollow: shouldFollow})
        
      })

    }
    else if(this.props.currentUser != undefined){
      this.setState({user: this.props.currentUser})
    }
    

  }

  componentDidUpdate(prevProps, prevState, snapshot){
    if(this.props.terms.userId != undefined){
      Meteor.call('getUser', this.props.terms.userId, (err, result) => {
        if(err){
          console.log(err)
        }
        if(JSON.stringify(result) !== JSON.stringify(prevState.user)){
          this.setState({user: result})
        }
      })
    }
    else if(this.props.currentUser != undefined && JSON.stringify(prevState.user) !== JSON.stringify(this.props.currentUser)){
      this.setState({user: this.props.currentUser})
    }
    else if(this.props.currentUser == undefined && prevState.user != undefined){
      this.setState({user: undefined})
    }
  }

  followUser(){
    //console.log("Button clicked")
    Meteor.call('followUser', this.props.currentUser._id, this.props.terms.userId, (err) => err ? console.log(err) : this.setState({showFollow: false, showUnfollow: true}) )
  }
  unfollowUser(){
    Meteor.call('unfollowUser', this.props.currentUser._id, this.props.terms.userId, (err) => err ? console.log(err) : this.setState({showUnfollow: false, showFollow: true}) )
  }
  render(){
    const {className, results, loading, count, totalCount, loadMore, showHeader = true, showLoadMore = true, networkStatus, currentUser, error, terms} = this.props;
  const loadingMore = networkStatus === 2;
   
  if (results && results.length) {

    const hasMore = totalCount > results.length;
    
  
    return (

      <div className="row">
        <div className="col-xl-3 col-lg-4 first-column">
        {!!this.state.user ? <Components.UserSidebar currentUser={this.state.user} postCount={this.state.user.postCount} 
        followingCount={this.state.user.following ? this.state.user.following.length : 0} followerCount={this.state.user.followers ? this.state.user.followers.length : 0} 
          showFollow={this.state.showFollow} onFollow={this.followUser} showUnfollow={this.state.showUnfollow} onUnfollow={this.unfollowUser}
        /> : null}
          
        </div>
      <div className="col-xl-6 col-lg-8 second-column">
      <div className={classNames(className, 'posts-list', `posts-list-${terms.view}`)}>
        {showHeader ? <Components.PostsListHeader/> : null}
        {error ? <Error error={Utils.decodeIntlError(error)} /> : null }
        <div className="posts-list-content">
          {results.map(post => <Components.PostsItem post={post} key={post._id} currentUser={currentUser} terms={terms} />)}
        </div>
        {showLoadMore ? 
          hasMore ? 
            <Components.PostsLoadMore loading={loadingMore} loadMore={loadMore} count={count} totalCount={totalCount} /> : 
            <Components.PostsNoMore/> : 
          null
        }
      </div>
      </div>
      </div>
    )
  } else if (loading) {
    return (
      <div className={classNames(className, 'posts-list')}>
        {showHeader ? <Components.PostsListHeader /> : null}
        {error ? <Error error={Utils.decodeIntlError(error)} /> : null }
        <div className="posts-list-content">
          <Components.PostsLoading/>
        </div>
      </div>
    )
  } else {
    return (
      <div className={classNames(className, 'posts-list')}>
        {showHeader ? <Components.PostsListHeader /> : null}
        {error ? <Error error={Utils.decodeIntlError(error)} /> : null }
        <div className="posts-list-content">
          <Components.PostsNoResults/>
        </div>
      </div>
    )  
  }
}
}

PostsList.displayName = "PostsList";

PostsList.propTypes = {
  results: PropTypes.array,
  terms: PropTypes.object,
  hasMore: PropTypes.bool,
  loading: PropTypes.bool,
  count: PropTypes.number,
  totalCount: PropTypes.number,
  loadMore: PropTypes.func,
  showHeader: PropTypes.bool,
};

PostsList.contextTypes = {
  intl: intlShape
};

const options = {
  collection: Posts,
  queryName: 'postsListQuery',
  fragmentName: 'PostsList',
};

registerComponent({ name: 'PostsList', component: PostsList, hocs: [withCurrentUser, [withList, options]] });
