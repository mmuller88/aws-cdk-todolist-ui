/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const todoAdd = /* GraphQL */ `
  mutation TodoAdd($todoItem: String!) {
    todoAdd(todoItem: $todoItem) {
      id
      body
    }
  }
`;
export const todoRemove = /* GraphQL */ `
  mutation TodoRemove($id: String!) {
    todoRemove(id: $id) {
      id
      body
    }
  }
`;
