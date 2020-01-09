#!/usr/bin/env node
'use strict'

const inquirer = require('inquirer')
const chalk = require('chalk')
const states = require('./states.json')

const display = (text, color = 'green') => {
  console.log(chalk.bold[color](text))
}

const displaySeparator = (color = 'green') => {
  display('---------------------', color)
}

const displayLines = (lines, lineColor = 'blue', separatorColor = 'green') => {
  displaySeparator(separatorColor)
  lines.forEach((line, index) => display(line, !index ? separatorColor : lineColor))
  displaySeparator(separatorColor)
}

const promptTemplate = {
  type: 'list',
  name: 'state',
  message: 'What do you want more details about?'
}

const main = () => {
  display('Hi there, and welcome to my resume!')
  stateHandler()
}

const promptBackOrExit = async (selectedState, previousState) => {
  const { choice } = await inquirer.prompt({
    type: 'list',
    name: 'choice',
    message: 'Go Back or Exit?',
    choices: ['Back', 'Exit']
  })
  if (choice === 'Back') {
    stateHandler(selectedState, previousState)
  }
}

const stateHandler = async (selectedState, previousState) => {
  if (!selectedState) { // Main screen
    displaySeparator()
    const { state } = await inquirer.prompt({
      ...promptTemplate,
      message: 'What do you want to know about me?',
      choices: [
        ...Object.keys(states),
        new inquirer.Separator(),
        'Exit'
      ]
    })
    if (state === 'Exit') {
      return
    }
    stateHandler(states[state])
  } else {
    if (Array.isArray(selectedState)) {
      displayLines(selectedState)
      promptBackOrExit(previousState)
    } else {
      displaySeparator()
      const { state } = await inquirer.prompt({
        ...promptTemplate,
        choices: [
          ...Object.keys(selectedState).map((key) => ({
            key,
            name: selectedState[key].name,
            value: key
          })),
          new inquirer.Separator(),
          'Back'
        ]
      })
      if (state === 'Back') {
        displaySeparator()
        stateHandler(previousState)
      } else {
        displayLines(selectedState[state].text)
        promptBackOrExit(selectedState, previousState)
      }
    }
  }
}

main()
