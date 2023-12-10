import { lazy, useEffect, useState } from 'react'
import './styles.css'
import NewTodoForm from './NewTodoForm'
import TodoList from './TodoList'


function App() {
  const [todos, setTodos] = useState(() => {
    const localValue = localStorage.getItem("ITEMS")
    if (localValue == null) return []
    return JSON.parse(localValue)
  })

  useEffect(() => {
    localStorage.setItem("ITEMS", JSON.stringify(todos))
  }, [todos]
  )

  function addTodo(title) {
    setTodos(currentTodos => {
      return [
        ...currentTodos,
        { id: crypto.randomUUID(), title, completed: false },

      ]
    }
    )
  }

  function deleteTodo(id) {
    setTodos(currentTodos => {
      return currentTodos.filter(todo => todo.id !== id)
    }
    )
  }

  function toggleTodo(id, completed) {
    setTodos(currentTodos => {
      return currentTodos.map(todo => {
        if (todo.id === id) {
          return { ...todo, completed }
        }
        return todo
      })
    }

    )
  }


  //console.log(todos)
  return (

    <>
      <NewTodoForm onSubmit={addTodo} />

      <h1 className='header'>Todo List</h1>

      <TodoList todos={todos} deleteTodo={deleteTodo} toggleTodo={toggleTodo} />

    </>


  )

}

export default App
