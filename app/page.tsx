'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

type Todo = {
  id: number;
  text: string;
};

const fetchTodos = async (): Promise<Todo[]> => {
  const response = await axios.get('/api/todos');
  return response.data;
};

const addTodo = async (newTodo: string): Promise<Todo> => {
  const response = await axios.post('/api/todos', { text: newTodo });
  return response.data;
};

const deleteTodo = async (id: number): Promise<number> => {
  await axios.delete('/api/todos', { data: { id } });
  return id;
};

export default function Todos() {
  const [newTodo, setNewTodo] = useState('');
  const queryClient = useQueryClient();

  // Fetch todos
  const { data: todos, isLoading, isError } = useQuery<Todo[], Error>({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  });

  // Mutation to add a todo
  const addTodoMutation = useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  // Mutation to delete a todo
  const deleteTodoMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const handleAddTodo = () => {
    if (newTodo) {
      addTodoMutation.mutate(newTodo);
      setNewTodo('');
    }
  };

  const handleDeleteTodo = (id: number) => {
    deleteTodoMutation.mutate(id);
  };

  if (isLoading) return <div className="text-center text-xl">Loading...</div>;
  if (isError) return <div className="text-center text-xl text-red-500">Error fetching todos</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-3xl font-semibold text-center mb-6">Todo List</h1>

      {/* Input Area */}
      <div className="flex mb-4">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task"
          className="w-full px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={handleAddTodo}
          className="px-4 py-2 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Add
        </button>
      </div>

      {/* Todo List */}
      <ul className="space-y-4">
        {todos?.map((todo) => (
          <li key={todo.id} className="flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow-sm">
            <span className="text-lg">{todo.text}</span>
            <button
              onClick={() => handleDeleteTodo(todo.id)}
              className="ml-4 text-red-500 hover:text-red-700 focus:outline-none"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
