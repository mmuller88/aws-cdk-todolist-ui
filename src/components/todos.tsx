import { useState } from 'react';
import { Auth } from '@aws-amplify/auth';
import { useMutation } from 'react-query';

// import { useListPostsQuery, CreatePostDocument, CreatePostInput, Post } from '../lib/api';
import { TodoItem, useTodoListQuery, TodoAddDocument } from '../lib/api';
import { API } from '../lib/fetcher';

const initialState = { todoItem: '', username: ''  };

export function Todos() {
  const [todo, setTodo] = useState(initialState);
  const { todoItem } = todo;

  const { data, isLoading, refetch } = useTodoListQuery(null, {
    refetchOnWindowFocus: false
  });

  // useCreatePostMutation isn't working correctly right now
  const [createTodo] = useMutation(async (input: any) => {
    const result = await API.getInstance().query(TodoAddDocument, { ...input });
    return result.data?.createTodo as TodoItem;
  });

  const onChange = (e) => {
    setTodo(() => ({ ...todo, [e.target.name]: e.target.value }))
  }

  const createNewTodo = async () => {
    if (!todoItem) return

    const userData = await Auth.currentAuthenticatedUser();

    const input = {
      ...todo,
      username: userData.username
    };

    const createResult = await createTodo(input);
    if (createResult) {
      refetch();
    }
  }

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div>
        <h2>Todos:</h2>
        {
          data?.todoList
            ? data?.todoList?.map(todo => {
              return (
                <div>
                  <h4>Id: {todo.id}</h4>
                  <h4>Username: {todo.username}</h4>
                  <h5>Body: {todo.body}</h5>
                </div>
              )
            })
            : <h4>No todos found</h4>
        }
      </div>
      <br />
      <br />
      <div>
        <h3>Create Todo:</h3>
        <div>
          <textarea onChange={onChange} name="body" placeholder="Body" />
        </div>
        <div>
          <button onClick={createNewTodo}>Create Todo</button>
        </div>
      </div>
    </div>
  );
}
