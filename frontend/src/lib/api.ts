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
