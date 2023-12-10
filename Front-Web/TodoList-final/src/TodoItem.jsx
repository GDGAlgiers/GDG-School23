export default function TodoItem({ completed, id, title, toggleTodo, deleteTodo }) {
    return (
        <li key={id}>
            <label >
                <input
                    onChange={e => toggleTodo(id, e.target.checked)}
                    type="checkbox"
                    checked={completed} />
                {title}
            </label>
            <button className='btn btn-danger'
                onClick={() => deleteTodo(id)}
            >Delete</button>
        </li>
    )
}
