const { config } = require('../config')

/**
 * Tags separator for tags string
 * @param string string tags
 * @param separators array indicator for format options, contains all special chars by default
 * @returns array
 */
const tagsSeparator = (string, separators) => {
  let inferredSeparator = ''
  let options = []

  if (separators?.length) {
    const reg = /\W/

    //separators.forEach((separator) => {
    // Check separators validity
    for (const separator of separators) {
      if (separator.length > 1) {
        //"Error: Separators may only include one character each."
        return undefined
      }

      if (!reg.test(separator)) {
        //"Error: Separators may only include special characters.";
        return undefined
      }
    }

    // Check items length
    if (separators.length === 1) {
      inferredSeparator = separators[0]
    } else {
      options = [...separators]
    }
  }

  if (!separators || separators.length > 1) {
    // No separator supllied
    const regSeparatorCandidates = /\W/g

    // Capturing special characers- these are the candidates for the separator (with dupicate
    let specialChars = [...string.matchAll(regSeparatorCandidates)].map((item) => item[0])

    if (separators?.length > 1) {
      // If user supplied legit array of separtor options (more than 1) - the candidates for selected separator will only include user options
      specialChars = specialChars.filter((char) => options.includes(char))
      if (specialChars.length === 0) {
        // If the separators passed by user do not exist in the passed string, push the first user separator anyway to specialChars
        //This way, the string will not be splitted later - as should happen.
        specialChars.push(options[0])
      }
    }

    // Counting frequncy for each candidate
    const count = specialChars.reduce((accumulator, current) => {
      accumulator[current] = accumulator[current] ? (accumulator[current] += 1) : (accumulator[current] = 1)
      return accumulator
    }, {})

    const countsArr = Object.entries(count)

    if (countsArr.length > 1) {
      // If there are several candidates for separators - sort according to count
      countsArr.sort((a, b) => b[1] - a[1])
    }
    // Saving either the only candidate or the candidate with highest count
    inferredSeparator = countsArr[0]?.[0]
  }

  // Moving from the separator as a string to a regex that represents it correctly
  const specialChars = config.tags.specialChars
  let inferredReg

  if (inferredSeparator === ' ') {
    inferredReg = /\s/
  } else if (specialChars.includes(inferredSeparator)) {
    // Add backslash
    inferredReg = new RegExp(`\\${inferredSeparator}`)
  } else {
    inferredReg = new RegExp(inferredSeparator)
  }

  const tags = string.split(inferredReg)

  return tags
}

const magnitudeUnits = {
  1: 'K',
  2: 'M',
  3: 'G',
}

/**
 * Number formatter for numbers
 * @param numToFormat string
 * @returns string
 */
const numFormatter = (numToFormat) => {
  const { overallDigitLimit, decimalDigitLimit } = config.numsFormater
  const isFloatingPoint = String(numToFormat).includes('.') ? 1 : 0
  let processedNumber

  //!floating point cutting
  if (isFloatingPoint) processedNumber = decimalHandler(numToFormat, decimalDigitLimit)

  processedNumber = String(processedNumber)

  let unitSuffix
  if (processedNumber.length - isFloatingPoint > overallDigitLimit) {
    //!main numer formatting
    overallHandlement = overallHandler(processedNumber, overallDigitLimit, isFloatingPoint)

    processedNumber = overallHandlement.num
    unitSuffix = overallHandlement.unitSuffix
  }

  //!adding commas

  const [left, right] = processedNumber.split('.')

  return left.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (right ? '.' + right : '') + (unitSuffix ?? '')
}

// DECIMAL LIMITER
const decimalHandler = (numToFormat, decimalDigitLimit) => {
  //!DONE WITH
  return numToFormat.toFixed(decimalDigitLimit)
}

// OVERALL LIMITER - MATH BASED
const overallHandler = (num, limit, isFloatingPoint) => {
  //!slice away right of point
  while (num.length - isFloatingPoint > limit) {
    num = num.substring(0, num.length - 1)

    if (num.length - isFloatingPoint === limit) {
      return { num } //!probably need to get rid of floating point
    }
    if (num.charAt(num.length - 1) === '.') {
      num = num.substring(0, num.length - 1)
      break
    }
  }

  // //!check if meets requirement - then return

  let thousandsSliced = 0,
    remainder
  //!keep slicing away left of point - by block of 3's
  while (num.length > limit) {
    remainder = num.substring(num.length - 3)
    num = num.substring(0, num.length - 3)

    thousandsSliced++
  }

  return {
    num: num + (limit - num.length ? '.' : '') + remainder.substring(0, limit - num.length),
    unitSuffix: magnitudeUnits[thousandsSliced],
  }
}

// The function phoneNumberFormatter validates the phone number it receives and returns it in a certain format.
// It expects 1-3 arguments:
// 1. Phone numer as a string (mandatory)
// 2. Format as a string(e.g."3-3-4-2"). The format must match in length to the phone no. length and contain country code prefix".
//    The default format is "3-2-3-4".
// 3. isInternational is a boolean that indicates whether the returned number should be in an inernational format or not.
//     The default is true (international format).

const phoneNumberFormatter = (number, format = config.phones.format, isInternational = config.phones.isInternational) => {
  // const regexFormat = /^([\+]?[\(]?[0-9]{1,3}[\)]?[\s.-]?[0-9]{1,12})([\s.-]?[0-9]{1,6}?)([\s.-]?[0-9]{1,4})$/

  const arr = format.split('-').map((str) => +str)
  const sum = arr.reduce((acc, item) => acc + item)
  const cleanNumber = number.replace(/[^0-9]/g, '')

  if (sum !== cleanNumber.length) {
    return `Format: ${format} does not match phone number: ${number}`
  }

  if (cleanNumber.length >= 7 && cleanNumber.length <= 15) {
    let formatedNumber = ''
    let count = 0
    // let a

    for (let i = 0; i < arr.length; i++) {
      if (i === 0) {
        formatedNumber = cleanNumber.slice(0, arr[i])
        count += +arr[i]
      } else {
        formatedNumber = formatedNumber.concat('-' + cleanNumber.slice(count, count + arr[i]))
        count += +arr[i]
      }
    }

    if (!isInternational) {
      return formatedNumber.slice(arr[0] + 1)
    }

    return formatedNumber
  }
}

//example for input
// const formatted = phoneNumberFormatter("0800 563 5553 1113", "4-3-4-4" );
// console.log(formatted);

module.exports = {
  numFormatter,
  tagsSeparator,
  phoneNumberFormatter,
}
