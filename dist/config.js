"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setConfig = exports.config = void 0;
const config = {
  specialCharsModifier: {
    exceptions: ''
  },
  passwordValidation: {
    strengthOptions: [{
      id: 0,
      value: 'Weak',
      minDiversity: 1,
      minLength: 8
    }, {
      id: 1,
      value: 'Strong',
      minDiversity: 2,
      minLength: 10
    }, {
      id: 2,
      value: 'Very Strong',
      minDiversity: 4,
      minLength: 12
    }],
    characterLen: 8,
    upperCase: 1,
    lowerCase: 1,
    num: 1,
    symbol: '#?!@$%^&*-'
  },
  URLValidator: {
    domainOnly: false,
    pathIncluded: true
  },
  phoneNumberFormatter: {
    format: '3-2-3-4',
    isInternational: true
  },
  tagsSeparator: {
    separators: undefined
  },
  numberFormatter: {
    overallDigitLimit: 100,
    decimalDigitLimit: 100,
    useColors: false,
    colors: {}
  },
  checkNumberPositivity: {
    zeroIncluded: false
  },
  emailDomainValidator: {
    domainList: undefined
  }
};
exports.config = config;

const setConfig = (configName, parameters) => {
  switch (configName) {
    case 'password':
      config.passwordValidation = {
        characterLen: parameters.characterLen === null || parameters.characterLen === undefined || parameters.characterLen === 0 ? undefined : parameters.characterLen,
        upperCase: parameters.upperCase === null || parameters.upperCase === undefined || parameters.upperCase === 0 ? undefined : parameters.upperCase,
        lowerCase: parameters.lowerCase === null || parameters.lowerCase === undefined || parameters.lowerCase === 0 ? undefined : parameters.lowerCase,
        num: parameters.num === null || parameters.num === undefined || parameters.num === 0 ? undefined : parameters.num,
        symbol: parameters.symbol === null || parameters.symbol === undefined || parameters.symbol === '' ? undefined : parameters.symbol,
        strengthOptions: parameters.strengthOptions ? parameters.strengthOptions.map((opt, index) => ({ ...opt,
          id: index
        })) : config.passwordValidation.strengthOptions.map((opt, index) => ({ ...opt,
          id: index,
          minLength: parameters.characterLen + (index === 0 ? 0 : index *= 2)
        }))
      };
      break;

    case 'numberFormatter':
      if (parameters.overallDigitLimit !== undefined) config.numberFormatter.overallDigitLimit = parameters.overallDigitLimit;
      if (parameters.decimalDigitLimit !== undefined) config.numberFormatter.decimalDigitLimit = parameters.decimalDigitLimit;

      if (parameters.useColors) {
        config.numberFormatter.useColors = true;
        config.numberFormatter.colors.positive = parameters.colors.positive;
        config.numberFormatter.colors.negative = parameters.colors.negative;
      } else {
        config.numberFormatter.useColors = false;
        config.numberFormatter.colors = {};
      }

      break;

    case 'URLValidator' || 'urlValidator':
      if (parameters.domainOnly !== undefined) config.URLValidator.domainOnly = parameters.domainOnly;
      if (parameters.pathIncluded !== undefined) config.URLValidator.pathIncluded = parameters.pathIncluded;
      break;

    case 'phoneNumberFormatter':
      if (parameters.format !== undefined) config.phoneNumberFormatter.format = parameters.format;
      if (parameters.isInternational !== undefined) config.phoneNumberFormatter.isInternational = parameters.isInternational;
      break;

    case 'tagsSeparator':
      config.tagsSeparator.separators = parameters.separators;
      break;

    case 'emailDomainValidator':
      if (parameters.domainList !== undefined) config.emailDomainValidator.domainList = parameters.domainList;

    case 'specialCharsModifier':
      config.specialCharsModifier.exceptions = parameters.exceptions;
      break;
  }
};

exports.setConfig = setConfig;