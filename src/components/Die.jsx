import React from 'react'

export default function Die(props) {

  return (
    <div onClick={props.holdDice}
      className={`die-face ${props.isHeld ? "isHeld" : ""}`}>
      <img className="die-value" src={`./images/dice${props.value}.svg`} alt="" />
    </div>
  )
}


