const SimpleCli = require('./lib/cli')

const additionalOptions = [
  {
    name: 'bar',
    alias: 'b',
    type: String,
    description: 'Bar',
    typeLabel: '[underline]{=}'
  },
  {
    name: 'mark',
    alias: 'm',
    type: String,
    description: 'Mark',
    typeLabel: '[underline]{|}'
  },
  {
    name: 'width',
    alias: 'w',
    type: Number,
    description: 'Width',
    typeLabel: '[underline]{100}'
  },
  {
    name: 'padding',
    alias: 'p',
    type: Number,
    description: 'Padding',
    typeLabel: '[underline]{15}'
  },
  {
    name: 'factor',
    alias: 'x',
    type: Number,
    description: 'Factor',
    typeLabel: '[underline]{10}' // TODO: Number in range? show min/max validations?
  },
  {
    name: 'duration',
    alias: 'd',
    type: Number,
    description: 'Duration',
    typeLabel: '[underline]{500}'
  }
]

const myCli = new SimpleCli({
  name: 'My CLI script name',
  description: 'A description of this script',
  helpHeader: 'Available Options',
  optionDefinitions: additionalOptions,
  logging: {
    test: {
      verbose: true, // Consider this debug, only show when verbose
      throws: false, // Should this log type throw an Error?
      stamp: true, // Also prefix log output with a timestamp
      prefix: 'Test', // Prefix string to show before each log msg
      color: 'blue' // Color of output text (FG only)
    }
  }
})

// Object.keys(myCli.settings.logging).forEach(type => {
//   myCli[type](`This is a(n) ${type} message!`)
//   myCli[type](`Called using: myCli.${type}('message')`)
// })

// additionalOptions.forEach(option => {
//   const name = option.name
//   const value = myCli.options[name]

//   myCli.log(`Option '${name}' = '${value}'`)
// })

// let percentage = 0;

// const duration = parseInt(Math.random() * (Math.random() * 100 + 100))

// const loadPercent = (percent = 0) => {
//   if (percent > 100) percent = 100

//   // TODO: Formatting? cols, etc?
//   myCli.replace(`${percent}%`)

//   const factor = parseInt(Math.random() * 2) + 1

//   if (percent < 100) {
//     setTimeout(() => {
//       loadPercent(percent + factor)
//     }, 5 * factor)
//   } else {
//     myCli.reset()
//     myCli.success('Finished')
//   }
// }

// loadPercent()

const MAX_WIDTH = process.stdout.columns || 100
const MIN_FACTOR = 1
const MIN_PADDING = 15
const MIN_DURATION = 100

let width = myCli.options.width || parseInt(Math.random() * 100)
let padding = myCli.options.padding || (parseInt(Math.random() * 10) + MIN_PADDING)
let factor = myCli.options.factor || (parseInt(Math.random() * 15) + MIN_FACTOR)
let duration = myCli.options.duration || (parseInt(Math.random() * 2000) + MIN_DURATION)

if (padding < MIN_PADDING) padding = MIN_PADDING
if (width > (MAX_WIDTH - padding)) width = (MAX_WIDTH - padding)

// myCli.debug({
//   width,
//   padding,
//   constants: {
//     MAX_WIDTH,
//     MIN_PADDING
//   }
// })

const loadPercentBar = (percent = 0) => {
  if (percent > 100) percent = 100

  const { bar, mark, empty } = myCli.options

  const noChar = empty || ' '
  const barChar = bar || '='
  const curChar = percent < 100 ? (mark || '|') : barChar

  const current = Math.floor((percent / 100) * width)
  const missing = width - current;
  const biggest = Math.max(noChar.length, barChar.length, curChar.length)
  const minStep = biggest > 1 ? Math.max(1, current / biggest) : 1

  const filled = current > minStep ? (current - minStep) : 0

  // TODO: Formatting? cols, etc?
  // myCli.replace(`${percent}%`)
  const line = `[${barChar.repeat(filled)}${curChar}${noChar.repeat(missing)}] (${percent}%) `

  myCli.replace(line)

  const step = parseInt(Math.random() * factor) + minStep
  const timeout = duration * step

  myCli.debug({
    noChar,
    barChar,
    curChar,
    current,
    missing,
    filled,
    total: line.length,
    percent,
    timeout,
    step,
    minStep
  })

  if (percent < 100) {
    setTimeout(() => {
      loadPercentBar(percent + step)
    }, timeout)
  } else {
    myCli.reset()
    myCli.success('Finished')
  }
}

loadPercentBar()

// const username = myCli.prompt('Username: ')

// if (myCli.confirm(`Allow user: '${username}' to process file: ${myCli.options.src}?`)) {
//   myCli.success(`File: ${myCli.options.src} processed by user: '${username}'`)
// } else {
//   myCli.warn(`User: '${username}' not allowed to process file: ${myCli.options.src}`)
// }
