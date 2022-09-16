import React, { useState } from 'react'
import { useEffect } from 'react'
import Die from "./components/Die"
import { nanoid } from "nanoid"
import Confetti from 'react-confetti'
import { useStopwatch } from 'react-timer-hook';
import './App.css'

export default function App() {

  const [dice, setDice] = useState(allNewDice())
  const [tenzies, setTenzies] = useState(false)

  const bestTime = JSON.parse(localStorage.getItem("bestTime"))
  // const {timeMin, timeSec } = 
  //   ,
  //   JSON.parse(localStorage.getItem("seconds")) || []]
  const bestMins = Math.floor(bestTime / 60)
  const bestSec = bestTime % 60

  const {
      seconds,
      minutes,
      hours,
      days,
      isRunning,
      start,
      pause,
      reset,
    } = useStopwatch({ autoStart: false });
  
  useEffect(() => {
    const allHeld = dice.every(die => die.isHeld === true)
    const firstValue = dice[0].value
    const allValues = dice.every(die => die.value === firstValue)
    if (allValues && allHeld) {
      setTenzies(true)
      pause()
      if (minutes*60 + seconds < bestTime) {
        localStorage.setItem("bestTime", JSON.stringify(minutes * 60 + seconds))
        alert('NEW RECORD!')
      }
    } else {
      setTenzies(false)
    }
  }, [dice])

  function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }

  function allNewDice() {
    const newDice = []
    for (let i = 0; i < 10; i++) {
      newDice.push(
        generateNewDie()
      )
    }
    return newDice
  }

  function rollDice() {
    if (seconds === 0 && minutes === 0) {
      start()
    }
    if (!tenzies) {
      setDice(saveDice => saveDice.map(die => {
        return die.isHeld ? die : generateNewDie()
      }))
      setCountRolls(prev => prev + 1)
    } else {
      setTenzies(false)
      setDice(allNewDice())
      setCountRolls(0)
      reset()
    }
  }

  function holdDice(id) {
    if (seconds === 0 && minutes === 0) {
      start()
    }
    setDice(oldDice => oldDice.map(die => {
      return die.id === id ? {...die, isHeld: !die.isHeld} : die
    }))
  }
  
  const diceElements = dice.map(die => <Die holdDice={() => holdDice(die.id) } key={die.id} value={die.value} isHeld={die.isHeld} />)
  

  const [countRolls, setCountRolls] = useState(0)
  

  return (
    <main className="container">
      {tenzies && <Confetti />}
      <h1 className="main-header">Tenzies</h1>
      <p className="main-description">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
      <div className='die-container'>
        {diceElements}
      </div>
      <button onClick={rollDice} className="roll-btn"> {tenzies ? 'New Game' : 'Roll'}</button>
      <p className="number-rolls">Number of Rolls: {countRolls}</p>
      <p className="solve-timer">Your Time: <span>0{minutes}</span>:{seconds < 10 ? <span>0{seconds}</span> : <span>{seconds}</span>} </p>
      <p className="bestTime">Your Best Time: <br></br> {bestMins === 0 ? '' : `${bestMins} minute${bestMins >= 2 ? 's' : ''}`} {bestSec} seconds</p>
    </main>
  )
}
