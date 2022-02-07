const config = {
  // PROGRAMERS NOTICE: intital your own Object/array according to your functions in the code above
  password: {
    passwordStrengthOptions: [
      {
        id: 0,
        value: 'Weak',
        minDiversity: 1,
        minLength: 8,
      },
      {
        id: 1,
        value: 'Strong',
        minDiversity: 2,
        minLength: 8,
      },
      {
        id: 2,
        value: 'Very Strong',
        minDiversity: 4,
        minLength: 10,
      },
    ],
    characterLen: 8,
    upperCase: 1,
    lowerCase: 1,
    num: 1,
    symbol: '#?!@$%^&*-',
  },
  URL: {
    pathIncluded: true,
    domainOnly: false,
  },
  phones: {},
  tags: {
    specialChars: ['.', '*', '?', '$', '^', '(', ')'],
  },
  numsFormater: {
    overallDigitLimit: 100,
    decimalDigitLimit: 100,
  },
}

const setConfig = (configName, parameters) => {
  /**
   * ! PROGRAMERS NOTICE: intital your own configuration according to your functions in the code above
   */
  switch (configName) {
    case 'password':
      config.password = {
        characterLen: parameters.charLen === null || parameters.charLen === undefined || parameters.charLen === 0 ? undefined : parameters.charLen,
        upperCase: parameters.upperCase === null || parameters.upperCase === undefined || parameters.upperCase === 0 ? undefined : parameters.upperCase,
        lowerCase: parameters.lowerCase === null || parameters.lowerCase === undefined || parameters.lowerCase === 0 ? undefined : parameters.lowerCase,
        num: parameters.num === null || parameters.num === undefined || parameters.num === 0 ? undefined : parameters.num,
        symbol: parameters.symbol === null || parameters.symbol === undefined || parameters.symbol === '' ? undefined : parameters.symbol,
      }
      break

    case 'formatter':
      config.numsFormater.overallDigitLimit = parameters.overallDigitLimit
      config.numsFormater.decimalDigitLimit = parameters.decimalDigitLimit
      break
    case 'URL':
      config.URL.domainOnly = parameters.domainOnly
      config.URL.pathIncluded = parameters.pathIncluded
      break
    case 'tags':
      config.tags.specialChars = parameters.specialChars
      break
  }
}

module.exports = { config, setConfig }
