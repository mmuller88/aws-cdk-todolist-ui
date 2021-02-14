import { useState } from 'react';
import { Auth } from '@aws-amplify/auth';
import { useMutation } from 'react-query';

import { TodoItem, useTodoListQuery, TodoAddDocument } from '../lib/api';
import { API } from '../lib/fetcher';

const initialState = { body: '', username: ''  };
declare const window: any;

export function Todos() {
  const [todo, setTodo] = useState(initialState);
  const { body } = todo;

  const { data, isLoading, refetch } = useTodoListQuery(null, {
    refetchOnWindowFocus: false
  });

  const [createTodo] = useMutation(async (input: any) => {
    const result = await API.getInstance().query(TodoAddDocument, { ...input });
    console.log(result);
    return result.data?.todoAdd as TodoItem;
  });

  const onChange = (e) => {
    setTodo(() => ({ ...todo, [e.target.name]: e.target.value }))
  }

  const createNewTodo = async () => {
    if (!body) return

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
                  <h4>Body: {todo.body}</h4>
                  {/* {window.ENV.stage === 'dev'? <h5>Id: {todo.id}</h5> : ''} */}
                  <h5>Username: {todo.username}</h5>
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
