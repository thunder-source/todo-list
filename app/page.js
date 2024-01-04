'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     const res = await fetch('http://localhost:5000/api/v1/isAuthenticated');
  //     const data = await res.json();
  //     setIsAuthenticated(data.isAuthenticated);
  //   };
  //   checkAuth();
  // }, []);

  if (isAuthenticated) {
    return Login();
  } else {
    return main();
  }
}

function main() {
  const [todo, setTodo] = useState([]);
  const [input, setInput] = useState('');
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    const getTodo = async () => {
      const res = await fetch('http://localhost:5000/api/v1/note');
      const data = await res.json();
      setTodo(data);
    };
    getTodo();
  }, []);

  const addNote = async () => {
    if (edit?.id) {
      const res = await fetch(`http://localhost:5000/api/v1/note/${edit?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: input,
          content: 'Todo 1 content',
        }),
      });
      const data = await res.json();

      setTodo((todo) => {
        return todo.map((ele) => {
          if (ele._id === edit.id) {
            return data;
          }
          return ele;
        });
      });

      console.log('Edited note', data);
      setInput('');
      setEdit(false);
    } else {
      const res = await fetch('http://localhost:5000/api/v1/note', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: input,
          content: 'Todo 1 content',
        }),
      });
      setInput('');
      const data = await res.json();
      setTodo((todo) => {
        return [...todo, data];
      });
      console.log('Added note', data);
    }
  };

  const deleteNote = (id) => async () => {
    const res = await fetch(`http://localhost:5000/api/v1/note/${id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    setTodo((todo) => {
      return todo.filter((ele) => ele._id !== id);
    });
    console.log('Deleted note', data);
  };

  function editNote({ id, title }) {
    setEdit({ id, title });
    setInput(title);
  }

  return (
    <main className=''>
      <div className='flex'>
        <aside className='w-96 h-screen bg-yellow-100 '></aside>
        <section className='w-full'>
          <header className=' w-full'>
            <h1 className='flex justify-center text-5xl mt-7 mb-14 font-serif'>
              Todo List
            </h1>
          </header>

          <section>
            <div className='flex justify-center'>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                type='text'
                className='w-1/2 p-2 border-2 border-gray-300 rounded-md'
              />
              <button
                onClick={() => addNote()}
                className='p-2 ml-2 bg-blue-500 text-white rounded-md'>
                {edit?.id ? 'Edit' : 'Add'}
              </button>
            </div>
          </section>
          <section className=''>
            <ul className='m-auto mt-10 w-full '>
              {todo.map((ele) => {
                return (
                  <li
                    key={ele._id}
                    className='flex mx-auto w-full gap-2 max-w-[770px] justify-between p-2 border-b-2 border-gray-300'>
                    <div className=' w-full p-2'>{ele.title}</div>
                    <div className='flex gap-2'>
                      <button
                        onClick={() => {
                          editNote({ id: ele._id, title: ele.title });
                        }}
                        className='bg-green-500 text-white rounded-md p-2 px-4'>
                        Edit
                      </button>
                      <button
                        onClick={deleteNote(ele._id)}
                        className='bg-red-500 text-white rounded-md p-2 px-4'>
                        Delete
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className='w-1/2'></div>
          </section>
        </section>
      </div>
    </main>
  );
}

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic
    console.log('Login form submitted:', { email, password });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='max-w-md mx-auto mt-8 p-6 border rounded-md shadow-md'>
      <div className='mb-4'>
        <label className='block text-gray-700 mb-2' htmlFor='email'>
          Email:
        </label>
        <input
          type='email'
          id='email'
          value={email}
          onChange={handleEmailChange}
          className='w-full border rounded-md px-3 py-2'
        />
      </div>
      <div className='mb-4'>
        <label className='block text-gray-700 mb-2' htmlFor='password'>
          Password:
        </label>
        <input
          type='password'
          id='password'
          value={password}
          onChange={handlePasswordChange}
          className='w-full border rounded-md px-3 py-2'
        />
      </div>
      <button
        type='submit'
        className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'>
        Login
      </button>
    </form>
  );
};

const User = ({ userData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUserData, setEditedUserData] = useState({ ...userData });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // You can implement logic to save the edited user data here
    console.log('Saving user data:', editedUserData);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUserData({
      ...editedUserData,
      [name]: value,
    });
  };

  return (
    <div className='bg-white shadow-md rounded-md p-6 w-1/2 mx-auto mt-8'>
      <h2 className='text-2xl font-bold mb-4'>User Information</h2>
      <div className='mb-4'>
        <label
          className='block text-gray-700 text-sm font-bold mb-2'
          htmlFor='name'>
          Name
        </label>
        <input
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
            isEditing ? '' : 'bg-gray-200'
          }`}
          id='name'
          type='text'
          placeholder='Enter name'
          name='name'
          value={editedUserData.name}
          onChange={handleChange}
          readOnly={!isEditing}
        />
      </div>
      <div className='mb-6'>
        <label
          className='block text-gray-700 text-sm font-bold mb-2'
          htmlFor='email'>
          Email
        </label>
        <input
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
            isEditing ? '' : 'bg-gray-200'
          }`}
          id='email'
          type='email'
          placeholder='Enter email'
          name='email'
          value={editedUserData.email}
          onChange={handleChange}
          readOnly={!isEditing}
        />
      </div>
      <div className='flex justify-between'>
        {isEditing ? (
          <button
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
            onClick={handleSave}>
            Save
          </button>
        ) : (
          <button
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
            onClick={handleEdit}>
            Edit
          </button>
        )}
        <button
          className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
          onClick={() => console.log('Delete clicked')} // Implement delete logic
        >
          Delete
        </button>
      </div>
    </div>
  );
};
