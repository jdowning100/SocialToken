import { makeVoteable } from 'meteor/vulcan:voting';
import { Posts } from './posts/index.js';
import { Comments } from './comments/index.js';
import { addVoteType } from 'meteor/vulcan:voting';

addVoteType('star', {power: 1, exclusive: true});
addVoteType('removestar', {power: -1, exclusive: true});
makeVoteable(Posts);
makeVoteable(Comments);