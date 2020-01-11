import { Components, registerComponent, getFragment } from 'meteor/vulcan:core';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'meteor/vulcan:i18n';
import { Link } from 'react-router';
import { Posts } from '../../modules/posts/index.js';
import { Comments } from '../../modules/comments/index.js';
import moment from 'moment';

class PostsItem extends PureComponent {

  renderCategories() {
    return this.props.post.categories && this.props.post.categories.length > 0 ? <Components.PostsCategories post={this.props.post} /> : "";
  }

  renderCommenters() {
    return this.props.post.commenters && this.props.post.commenters.length > 0 ? <Components.PostsCommenters post={this.props.post}/> : "";
  }

  renderActions() {
    return (
      <div className="posts-actions">
        <Components.ModalTrigger title="Edit Post" component={<a className="posts-action-edit"><FormattedMessage id="posts.edit"/></a>}>
          <Components.PostsEditForm post={this.props.post} />
        </Components.ModalTrigger>
      </div>
    )
  }
  
  render() {

    const {post} = this.props;

    let postClass = "posts-item";
    if (post.sticky) postClass += " posts-sticky";

    return (

      <div className="tweet">
        <div className="row">
          <div className="col-1">
            {post.user? <Components.UsersAvatar user={post.user} size="medium"/> : <img src="https://secure.gravatar.com/avatar/660b9d070b8f4857d89032bdf766e4b7?size=200&default=mm" className="avatar-image" style={{height: '50px', width: '50px'}}/>}
          </div>
          <div className="col-11 tweet__description">
            <span className="tweet__username-date">
              <div className="tweet__username">
                {post.user? post.url? <a href={post.url}>{post.user.displayName}</a> : <Components.UsersName user={post.user}/> : <a href={post.url}>{post.author}</a>}
              </div>
              <div className="tweet__date">
                {post.postedAt ? moment(new Date(post.postedAt)).fromNow() : <FormattedMessage id="posts.dateNotDefined"/>} 
              </div>
              
            
            </span>
            <br/>
            <p className="tweet__content">{post.body}</p>
            {/*<Link to={Posts.getPageUrl(post)}>
                {!post.commentCount || post.commentCount === 0 ? <FormattedMessage id="comments.count_0"/> : 
                  post.commentCount === 1 ? <FormattedMessage id="comments.count_1" /> :
                    <FormattedMessage id="comments.count_2" values={{count: post.commentCount}}/>
                }
              </Link>
              {this.renderCommenters()} */}
            <div className="tweet__form">
            
            { Posts.options.mutations.edit.check(this.props.currentUser, post) ? <button className="btn tweet__edit" style={{float:'right'}}>
              {this.renderActions()}
              </button> : null }
              <Components.Vote collection={Posts} document={post} currentUser={this.props.currentUser} />
              
              
            </div>
          </div>
          
          <div className="col-12 tweet__comments">           
            <Components.PostsCommentsThread terms={{postId: post._id, view: 'postComments'}} />         
          </div>
        </div>
      </div>

    /*  <div className={postClass}>

        <div className="posts-item-vote">
          <Components.Vote collection={Posts} document={post} currentUser={this.props.currentUser} />
        </div>

        {post.thumbnailUrl ? <Components.PostsThumbnail post={post}/> : null}

        <div className="posts-item-content">

          <h3 className="posts-item-title">
            <Link to={Posts.getLink(post)} className="posts-item-title-link" target={Posts.getLinkTarget(post)}>
              {post.title}
            </Link>
            {this.renderCategories()}
          </h3>

          <div className="posts-item-meta">
            {post.user? <div className="posts-item-user"><Components.UsersAvatar user={post.user} size="small"/><Components.UsersName user={post.user}/></div> : null}
            <div className="posts-item-date">{post.postedAt ? moment(new Date(post.postedAt)).fromNow() : <FormattedMessage id="posts.dateNotDefined"/>}</div>
            <div className="posts-item-comments">
              <Link to={Posts.getPageUrl(post)}>
                {!post.commentCount || post.commentCount === 0 ? <FormattedMessage id="comments.count_0"/> : 
                  post.commentCount === 1 ? <FormattedMessage id="comments.count_1" /> :
                    <FormattedMessage id="comments.count_2" values={{count: post.commentCount}}/>
                }
              </Link>
            </div>
            {this.props.currentUser && this.props.currentUser.isAdmin ? <Components.PostsStats post={post} /> : null}
            {Posts.options.mutations.edit.check(this.props.currentUser, post) && this.renderActions()}
          </div>

        </div>

        {this.renderCommenters()}

      </div>*/
    )
  }
}

PostsItem.propTypes = {
  currentUser: PropTypes.object,
  post: PropTypes.object.isRequired,
  terms: PropTypes.object,
};

registerComponent({ name: 'PostsItem', component: PostsItem });
