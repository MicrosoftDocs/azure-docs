---
title: Special Parsing for Parameters
description: Read about special parsing for parameters. Azure CycleCloud is able to resolve parameter values and perform logical evaluation of functions.
author: mvrequa
ms.date: 07/15/2024
ms.author: mirequa
---

# CycleCloud Cluster Template File Parsing

CycleCloud is able to resolve parameter values and perform logical evaluation of functions.

## Parameter Types

CycleCloud handles several basic types of parameters. In most cases, it will handle them as expected:

```ini
Attribute = foo      # string
Attribute = 1        # integer
Attribute = 1.1      # double
Attribute = false    # boolean
Attribute = foo, bar # string[]
```

To be more explicit, string values can be surrounded by double quotes (for example, `Attribute = "foo"`). This may be useful in the case where a value looks like a number but should be interpreted as a string (version numbers, for example). Boolean values can be set to the bare tokens `true` or `false` (case-insensitive). Comma-separated values are interpreted as lists, and elements are in turn interpreted using the same rules as above.

## Parameter Value Evaluation

CycleCloud directly interprets parameter values which use the `$` or `${}` notation.

```ini
MyAttribute = $MyParameter
MyAttribute2 = ${MyParameter2}
MyAttributeList = $Param1, $Param2
```

## Functions using Parameters

The CycleCloud template parser is able to perform math and do ternary logic analysis as seen below.

```ini
MaxCoreCount = ${HyperthreadedCoreCount/2}
SubnetId = ${ifThenElse($Autoscale, $BurstSubnet, $FixedSubnet)}
JetpackPlatform = ${imageselect == "windows" ? "windows" : "centos-7"}
```

## Available functions:

> [!NOTE] 
> This list is not comprehensive, but covers some of the most commonly-used functions.

### ifThenElse

Acts as a ternary operator. Returns one of two values given an expression which evaluates to true or false.

Syntax:

`ifThenElse(predicate, trueValue, falseValue)`

Arguments:

| Name            | Required | Description |
| --------------- | -------- | ----------- |
| predicate       | yes      | An expression which evaluates to true or false.
| trueValue       | yes      | The value to use when `predicate` evaluates to true.
| falseValue      | yes      | The value to use when `predicate` evaluates to false.

### ifUndefined

If the result of evaluating a given expression is undefined, returns a different value instead. Otherwise simply returns the result.

Syntax:

`ifUndefined(expression, value)`

Arguments:

| Name            | Required | Description |
| --------------- | -------- | ----------- |
| expression      | yes      | The expression to evaluate.
| value  | yes      | The value to return when `expression` evaluates to undefined.

### regexp

Performs a regular expression match on the given string and returns true if there was a match, false otherwise.

Syntax:

`regexp(pattern, target, [options])`

Arguments:

| Name            | Required | Description |
| --------------- | -------- | ----------- |
| pattern         | yes      | A Java-style regular expression.
| target          | yes      | The input string.
| options         | no       | Options to use when evaluating the regular expression. See Java's regular expression flags on `java.util.regex.Pattern` for more details.

### regexps

Performs regular expression substitution on the given string and returns the new string.

Syntax:

`regexps(pattern, target, substitution, [options])`

Arguments:

| Name            | Required | Description |
| --------------- | -------- | ----------- |
| pattern         | yes      | A Java-style regular expression which matches the string to substitute.
| target          | yes      | The input string.
| substitution    | yes      | The new string to substitute in place of the part of `target` which matches the regular expression.
| options         | no       | Options to use when evaluating the regular expression. See Java's regular expression flags on `java.util.regex.Pattern` for more details.

### size

Returns the length of a given string.

Syntax:

`size(string)`

Arguments:

| Name            | Required | Description |
| --------------- | -------- | ----------- |
| string          | yes      | The string to check.

### strjoin

Concatenates multiple strings together using a separator.

Syntax:

`strjoin(separator, strings)`

Arguments:

| Name            | Required | Description |
| --------------- | -------- | ----------- |
| separator       | yes      | A string separator to append between strings.
| strings         | yes      | A list of strings to concatenate. May also be specified as a variable number of function arguments: `strjoin(separator, string1, string2, string3...)`

### substr

Returns part of a string from the start index to the end index (or the end of the string if no end index is given).

Syntax:

`substr(string, startIndex, [endIndex])`

Arguments:

| Name            | Required | Description |
| --------------- | -------- | ----------- |
| string          | yes      | The input string.
| startIndex      | yes      | The start index to use.
| endIndex        | no       | An optional end index.

### trim

Removes all whitespace characters from the start and end of a string and returns the result.

Syntax:

`trim(string)`

Arguments:

| Name            | Required | Description |
| --------------- | -------- | ----------- |
| string          | yes      | The string to trim.

## Available operators

| Operator | Definition |
| -------- | ---------- |
| -, +, /, * | arithmetic |
| <, <=, >=, > | comparators |
| ==, != | equality evaluators |
| &&, \|\| | compound boolean operators |

## Special ClusterName Variable

One variable always provided is `${ClusterName}`. This is evaluated to the name of the CycleCloud cluster.

```ini
EmailAddress = ${strcat("myuser", "@", ClusterName)}
ResourceId = ${ClusterName}-00-resource
```

## Relative Time

CycleCloud interprets back-ticks around time duration as relative time;
supporting second, minute and day.

```ini
ThrottleCapacityTime=`10m` 
Attribute1=`30s`
Attribute2=`7d`
```

