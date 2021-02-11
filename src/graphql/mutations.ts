/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const todoAdd = /* GraphQL */ `
  mutation TodoAdd($body: String!, $username: String!) {
    todoAdd(body: $body, username: $username) {
      id
      body
      username
    }
  }
`;
export const todoRemove = /* GraphQL */ `
  mutation TodoRemove($id: String!) {
    todoRemove(id: $id) {
      id
      body
      username
    }
  }
`;
