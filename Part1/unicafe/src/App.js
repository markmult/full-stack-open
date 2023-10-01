import { useState } from 'react'

const Header = ({headerText}) => (
  <h1>{headerText}</h1>
);

const Button =({handleClick, text}) => (
  <button onClick={handleClick}>{text}</button>
);

const Statistics = ({good, neutral, bad}) => {
  const all = good + neutral + bad
  const average = Math.round(((-1 * bad + good) / all) * 100) / 100
  const positive = Math.round(((good / all) * 10000)) / 100

  return (
    <table>
      <tbody>
        <StatisticLine text="good" value={good} />
        <StatisticLine text="neutral" value={neutral} />
        <StatisticLine text="bad" value={bad} />
        <StatisticLine text="all" value={all} />
        <StatisticLine text="average" value={average} />
        <StatisticLine text="positive" value={positive + " %"} />
      </tbody>
    </table>
  );
};

const StatisticLine = ({text, value}) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
);

const App = () => {
  const headerFeedback = 'give feedback'
  const headerStats = 'statistics'
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState(0)

  const addGood = () => {
    setGood(good + 1)
    setAll(all + 1)
  }
  const addNeutral = () => {
    setNeutral(neutral + 1)
    setAll(all + 1)
  }
  const addBad = () => {
    setBad(bad + 1)
    setAll(all + 1)
  }

  return (
    <div>
      <Header headerText={headerFeedback}/>
      <Button
        handleClick={addGood}
        text='good'
      />
      <Button
        handleClick={addNeutral}
        text='neutral'
      />     
      <Button
        handleClick={addBad}
        text='bad'
      />
      <Header headerText={headerStats}/>
      {all > 0 ?
        <Statistics good={good} neutral={neutral} bad={bad}/> :
        <p>No feedback given</p>}
    </div>
  )
}

export default App
