/*

Custom fields on Posts collection

*/

import { Posts } from '../../modules/posts/index.js';
import { getCategoriesAsOptions } from './schema.js';

Posts.addField([
  {
    fieldName: 'categoriesIds',
    fieldSchema: {
      type: Array,
      input: 'checkboxgroup',
      optional: true,
      canCreate: ['admins'],
      canUpdate: ['admins'],
      canRead: ['guests'],
      options: props => {
        return getCategoriesAsOptions(props.data.categories.results);
      },
      query: `
        categories{
          results{
            _id
            name
            slug
            order
          }
        }
      `,
      resolveAs: {
        fieldName: 'categories',
        type: '[Category]',
        resolver: async (post, args, {currentUser, Users, Categories}) => {
          if (!post.categoriesIds) return [];
          const categories = _.compact(await Categories.loader.loadMany(post.categoriesIds));
          return Users.restrictViewableFields(currentUser, Categories, categories);
        },
        addOriginalField: true,
      }
    }
  },
  {
    fieldName: 'categoriesIds.$',
    fieldSchema: {
      type: String,
      optional: true
    }
  }
]);
