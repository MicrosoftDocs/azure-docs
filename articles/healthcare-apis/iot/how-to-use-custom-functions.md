---
title: How to use custom functions with the MedTech service device mapping - Azure Health Data Services
description: Learn how to use custom functions with MedTech service device mapping.
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: how-to
ms.date: 08/01/2023
ms.author: jasteppe
---

# How to use custom functions with the MedTech service device mapping

> [!NOTE]
> [Fast Healthcare Interoperability Resources (FHIR&#174;)](https://www.hl7.org/fhir/) is an open healthcare specification.

Many functions are available when using **JMESPath** as the expression language. Besides the built-in functions available as part of the [JMESPath specification](https://jmespath.org/specification.html#built-in-functions), many more custom functions may also be used. This article describes how to use the MedTech service-specific custom functions with the MedTech service [device mapping](overview-of-device-mapping.md).

> [!TIP]
> You can use the MedTech service [Mapping debugger](how-to-use-mapping-debugger.md) for assistance creating, updating, and troubleshooting the MedTech service device and FHIR destination mappings. The Mapping debugger enables you to easily view and make inline adjustments in real-time, without ever having to leave the Azure portal. The Mapping debugger can also be used for uploading test device messages to see how they'll look after being processed into normalized messages and transformed into FHIR Observations.

## Function signature

Each function has a signature that follows the JMESPath specification. This signature can be represented as:

```jmespath
return_type function_name(type $argname)
```

The signature indicates the valid types for the arguments. If an invalid type is passed in for an argument, an error occurs.

> [!IMPORTANT]
> When math-related functions are done, the end result must be able to fit within a [C# long](/dotnet/csharp/language-reference/builtin-types/integral-numeric-types#characteristics-of-the-integral-types) value. If the end result is unable to fit within a C# long value, then a mathematical error will occur.

As stated previously, these functions may only be used when specifying **JmesPath** as the expression language. By default, the expression language is **JsonPath**. The expression language can be changed when defining the expression. 

For example:

```json
"templateType": "CalculatedContent",
    "template": {
        "typeName": "heartrate",
        "patientIdExpression": {
            "value": "insertString('123', 'patient', `0`) ",
            "language": "JmesPath"
        },
        ...
    }
```

This example uses the [insertString](#insertstring) expression to generate the patient ID `patient123`.

## Literal values

Constant values may be supplied to functions.

- Numeric values should be enclosed within backticks: \`
  - Example: add(\`10\`, \`10\`)
- String values should be enclosed within single quotes: '
  - Example: insertString('mple', 'sa', \`0\`)

For more information, see the [JMESPath specification](https://jmespath.org/specification.html#built-in-functions).

## Exception handling

Exceptions may occur at various points within the device data processing lifecycle. Here are the various points where exceptions can occur:

|Action|When|Exceptions that may occur during parsing of the device mapping|Outcome|
|------|----|--------------------------------------------------------------|-------|
|**Device mapping parsing**|Each time a new batch of device messages are received, the device mapping is loaded and parsed.|Failure to parse the device mapping.|System attempts to reload and parse the latest device mapping until parsing succeeds. No new device messages are processed until parsing is successful.|
|**Device mapping parsing**|Each time a new batch of device messages are received, the device mapping is loaded and parsed.|Failure to parse any expressions.|System attempts to reload and parse the latest device mapping until parsing succeeds. No new device messages are processed until parsing is successful.|
|**Function execution**|Each time a function is executed against device data within a device message.|Input device data doesn't match that of the function signature.|System stops processing that device message. The device message isn't retried.|
|**Function execution**|Each time a function is executed against device data within a device message.|Any other exceptions listed in the description of the function.|System stops processing that device message. The device message isn't retried.|

## Mathematical functions

### add

```jmespath
number add(number $left, number $right)
```

Returns the result of adding the left argument to the right argument.

Examples:

| Given                       | Expression          | Result |
|-----------------------------|---------------------|--------|
| n/a                         | add(\`10\`, \`10\`) | 20     |
| {"left": 40, "right": 50}   | add(left, right)    | 90     |
| {"left": 0, "right": 50}    | add(left, right)    | 50     |

### divide

```jmespath
number divide(number $left, number $right)
```

Returns the result of dividing the left argument by the right argument.

Examples:

| Given                       | Expression             | Result                            |
|-----------------------------|------------------------|-----------------------------------|
| n/a                         | divide(\`10\`, \`10\`) | 1                                 |
| {"left": 40, "right": 50}   | divide(left, right)    | 0.8                               |
| {"left": 0, "right": 50}    | divide(left, right)    | 0                                 |
| {"left": 50, "right": 0}    | divide(left, right)    | mathematic error: divide by zero  |

### multiply

```jmespath
number multiply(number $left, number $right)
```

Returns the result of multiplying the left argument with the right argument.

Examples:

| Given                       | Expression               | Result |
|-----------------------------|--------------------------|--------|
| n/a                         | multiply(\`10\`, \`10\`) | 100    |
| {"left": 40, "right": 50}   | multiply(left, right)    | 2000   |
| {"left": 0, "right": 50}    | multiply(left, right)    | 0      |

### pow

```jmespath
number pow(number $left, number $right)
```

Returns the result of raising the left argument to the power of the right argument.

Examples:

| Given                         | Expression          | Result                      |
|-------------------------------|---------------------|-----------------------------|
| n/a                           | pow(\`10\`, \`10\`) | 10000000000                 |
| {"left": 40, "right": 50}     | pow(left, right)    | mathematic error: overflow  |
| {"left": 0, "right": 50}      | pow(left, right)    | 0                           |
| {"left": 100, "right": 0.5}   | pow(left, right)    | 10                          |

### subtract

```jmespath
number subtract(number $left, number $right)
```

Returns the result of subtracting the right argument from the left argument.

Examples:

| Given                       | Expression               | Result |
|-----------------------------|--------------------------|--------|
| n/a                         | subtract(\`10\`, \`10\`) | 0      |
| {"left": 40, "right": 50}   | subtract(left, right)    | -10    |
| {"left": 0, "right": 50}    | subtract(left, right)    | -50    |

## String functions

### insertString

```jmespath
string insertString(string $original, string $toInsert, number pos)
```

Produces a new string by inserting the value of `toInsert` into the string `original`. The string is inserted at position `pos` within the string `original`.

If the positional argument is zero based, the position of zero refers to the first character within the string. 

If the positional argument provided is out of range of the length of `original`, then an error occurs.

Examples:

| Given                                                     | Expression                                         | Result              |
|-----------------------------------------------------------|----------------------------------------------------|---------------------|
| n/a                                                       | insertString('mple', 'sa', `0`)                    | "sample"            |
| {"original": "mple", "toInsert": "sa", "pos": 0}          | insertString(original, toInsert, pos)              | "sample"            |
| {"original": "suess", "toInsert": "cc", "pos": 2}         | insertString(original, toInsert, pos)              | "success"           |
| {"original": "myString", "toInsert": "!!", "pos": 8}      | insertString(original, toInsert, pos)              | "myString!!"        |

## Date functions

### fromUnixTimestamp

```jmespath
string fromUnixTimestamp(number $unixTimestampInSeconds)
```

Produces an [ISO 8061](https://www.iso.org/iso-8601-date-and-time-format.html) compliant time stamp from the given Unix timestamp. The timestamp is represented as the number of seconds since the Epoch (January 1 1970).

Examples:

| Given                 | Expression              | Result                  |
|-----------------------|-------------------------|-------------------------|
| {"unix": 1625677200}  | fromUnixTimestamp(unix) | "2021-07-07T17:00:00+0" |
| {"unix": 0}           | fromUnixTimestamp(unix) | "1970-01-01T00:00:00+0" |

### fromUnixTimestampMs

```jmespath
string fromUnixTimestampMs(number $unixTimestampInMs)
```

Produces an [ISO 8061](https://www.iso.org/iso-8601-date-and-time-format.html) compliant time stamp from the given Unix timestamp. The timestamp is represented as the number of milliseconds since the Epoch (January 1 1970).

Examples:

| Given                    | Expression                | Result                  |
|--------------------------|---------------------------|-------------------------|
| {"unix": 1626799080000}  | fromUnixTimestampMs(unix) | "2021-07-20T16:38:00+0" |
| {"unix": 0}              | fromUnixTimestampMs(unix) | "1970-01-01T00:00:00+0" |

> [!TIP]
> See the MedTech service article [Troubleshoot errors using the MedTech service logs](troubleshoot-errors-logs.md) for assistance fixing errors using the MedTech service logs. 

## Next steps

In this article, you learned how to use the MedTech service custom functions within the device mapping.

For an overview of the MedTech service device mapping, see

> [!div class="nextstepaction"]
> [Overview of the MedTech service device mapping](overview-of-device-mapping.md)

For an overview of the MedTech service FHIR destination mapping, see

> [!div class="nextstepaction"]
> [Overview of the MedTech service FHIR destination mapping](overview-of-fhir-destination-mapping.md)

For an overview of the MedTech service scenario-based mappings samples, see

> [!div class="nextstepaction"]
> [Overview of the MedTech service scenario-based mappings samples](overview-of-samples.md)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
