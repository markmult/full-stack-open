const Header = ({name}) => {
  return (
    <h1>{name}</h1>
  )
}

const Part = ({name, exercise}) => {
  return (
    <p>{name} {exercise}</p>
  )
}

const Content = ({parts}) => {
  return (
    <div>
      {parts.map((part, i) =>
        <Part key={i} name={part.name} exercise={part.exercises}/>
      )}
    </div>
  )
}

const Total = ({parts}) => {
  const initial = 0
  const sum = parts.reduce((s, p) => s + p.exercises, initial)
  return (
    <b>total of {sum} exercises</b>
  )
}

const Course = ({name, parts}) => {
  return (
    <div>
      <Header name={name} />
      <Content parts={parts} />
      <Total parts={parts} />
    </div>
  )
}

export default Course
