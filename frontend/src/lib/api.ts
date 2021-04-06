import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions
} from "react-query";
import { amplifyFetcher } from "../lib/fetcher";
export type Maybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  AWSDate: any;
  AWSDateTime: any;
  AWSEmail: any;
  AWSIPAddress: any;
  AWSJSON: any;
  AWSPhone: any;
  AWSTime: any;
  AWSTimestamp: any;
  AWSURL: any;
  BigInt: any;
  Double: any;
};

export type Mutation = {
  __typename?: "Mutation";
  todoAdd?: Maybe<TodoItem>;
  todoRemove?: Maybe<TodoItem>;
};

export type MutationTodoAddArgs = {
  body: Scalars["String"];
  username: Scalars["String"];
};

export type MutationTodoRemoveArgs = {
  id: Scalars["String"];
};

export type Query = {
  __typename?: "Query";
  todoList?: Maybe<Array<Maybe<TodoItem>>>;
};

export type TodoItem = {
  __typename?: "todoItem";
  id: Scalars["String"];
  body: Scalars["String"];
  username: Scalars["String"];
};

export type TodoAddMutationVariables = Exact<{
  body: Scalars["String"];
  username: Scalars["String"];
}>;

export type TodoAddMutation = { __typename?: "Mutation" } & {
  todoAdd?: Maybe<
    { __typename?: "todoItem" } & Pick<TodoItem, "id" | "body" | "username">
  >;
};

export type TodoRemoveMutationVariables = Exact<{
  id: Scalars["String"];
}>;

export type TodoRemoveMutation = { __typename?: "Mutation" } & {
  todoRemove?: Maybe<
    { __typename?: "todoItem" } & Pick<TodoItem, "id" | "body" | "username">
  >;
};

export type TodoListQueryVariables = Exact<{ [key: string]: never }>;

export type TodoListQuery = { __typename?: "Query" } & {
  todoList?: Maybe<
    Array<
      Maybe<
        { __typename?: "todoItem" } & Pick<TodoItem, "id" | "body" | "username">
      >
    >
  >;
};

export const TodoAddDocument = `
    mutation TodoAdd($body: String!, $username: String!) {
  todoAdd(body: $body, username: $username) {
    id
    body
    username
  }
}
    `;
export const useTodoAddMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    TodoAddMutation,
    TError,
    TodoAddMutationVariables,
    TContext
  >
) =>
  useMutation<TodoAddMutation, TError, TodoAddMutationVariables, TContext>(
    (variables?: TodoAddMutationVariables) =>
      amplifyFetcher<TodoAddMutation, TodoAddMutationVariables>(
        TodoAddDocument,
        variables
      )(),
    options
  );
export const TodoRemoveDocument = `
    mutation TodoRemove($id: String!) {
  todoRemove(id: $id) {
    id
    body
    username
  }
}
    `;
export const useTodoRemoveMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    TodoRemoveMutation,
    TError,
    TodoRemoveMutationVariables,
    TContext
  >
) =>
  useMutation<
    TodoRemoveMutation,
    TError,
    TodoRemoveMutationVariables,
    TContext
  >(
    (variables?: TodoRemoveMutationVariables) =>
      amplifyFetcher<TodoRemoveMutation, TodoRemoveMutationVariables>(
        TodoRemoveDocument,
        variables
      )(),
    options
  );
export const TodoListDocument = `
    query TodoList {
  todoList {
    id
    body
    username
  }
}
    `;
export const useTodoListQuery = <TData = TodoListQuery, TError = unknown>(
  variables?: TodoListQueryVariables,
  options?: UseQueryOptions<TodoListQuery, TError, TData>
) =>
  useQuery<TodoListQuery, TError, TData>(
    ["TodoList", variables],
    amplifyFetcher<TodoListQuery, TodoListQueryVariables>(
      TodoListDocument,
      variables
    ),
    options
  );
