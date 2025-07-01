---
title: Special Parsing for Parameters
description: Read about special parsing for parameters. Azure CycleCloud is able to resolve parameter values and perform logical evaluation of functions.
author: mvrequa
ms.date: 06/30/2025
ms.author: mirequa
---

# CycleCloud Cluster Template File Parsing

CycleCloud resolves parameter values and performs logical evaluation of functions.

## Parameter Types

CycleCloud handles several basic types of parameters. In most cases, it handles them as expected:

```ini
Attribute = foo      # string
Attribute = 1        # integer
Attribute = 1.1      # double
Attribute = false    # boolean
Attribute = foo, bar # string[]
```

To be more explicit, string values can be surrounded by double quotes (for example, `Attribute = "foo"`). This syntax is useful when a value looks like a number but should be interpreted as a string, such as version numbers. Set Boolean values to the bare tokens `true` or `false` (case-insensitive). CycleCloud interprets comma-separated values as lists, and it interprets elements using the same rules as previously described.

## Parameter Value Evaluation

CycleCloud directly interprets parameter values that use the `$` or `${}` notation.

```ini
MyAttribute = $MyParameter
MyAttribute2 = ${MyParameter2}
MyAttributeList = $Param1, $Param2
```

## Functions that use parameters

The CycleCloud template parser can do math and ternary logic analysis, as shown in the following example.

```ini
MaxCoreCount = ${HyperthreadedCoreCount/2}
SubnetId = ${ifThenElse($Autoscale, $BurstSubnet, $FixedSubnet)}
JetpackPlatform = ${imageselect == "windows" ? "windows" : "centos-7"}
```

## Available functions

> [!NOTE]
> This list isn't comprehensive, but it covers some of the most commonly used functions.

### ifThenElse

Acts as a ternary operator. Returns one of two values given an expression that evaluates to true or false.

Syntax:

`ifThenElse(predicate, trueValue, falseValue)`

Arguments:

| Name            | Required | Description |
| --------------- | -------- | ----------- |
| predicate       | yes      | An expression that evaluates to true or false.
| trueValue       | yes      | The value to use when `predicate` evaluates to true.
| falseValue      | yes      | The value to use when `predicate` evaluates to false.

### ifUndefined

If the result of evaluating a given expression is undefined, returns a different value. Otherwise, it simply returns the result.

Syntax:

`ifUndefined(expression, value)`

Arguments:

| Name            | Required | Description |
| --------------- | -------- | ----------- |
| expression      | yes      | The expression to evaluate.
| value  | yes      | The value to return when `expression` evaluates to undefined.

### regexp

Performs a regular expression match on the given string. Returns true if there's a match, and false otherwise.

Syntax:

`regexp(pattern, target, [options])`

Arguments:

| Name            | Required | Description |
| --------------- | -------- | ----------- |
| pattern         | yes      | A Java-style regular expression.
| target          | yes      | The input string.
| options         | no       | Options to use when evaluating the regular expression. For more details, see Java's regular expression flags on `java.util.regex.Pattern`.

### regexps

Performs regular expression substitution on the given string and returns the new string.

Syntax:

`regexps(pattern, target, substitution, [options])`

Arguments:

| Name            | Required | Description |
| --------------- | -------- | ----------- |
| pattern         | yes      | A Java-style regular expression that matches the string to substitute.
| target          | yes      | The input string.
| substitution    | yes      | The new string to substitute in place of the part of `target` that matches the regular expression.
| options         | no       | Options to use when evaluating the regular expression. For more details, see Java's regular expression flags on `java.util.regex.Pattern`.

### size

Returns the length of a given string.

Syntax:

`size(string)`

Arguments:

| Name            | Required | Description |
| --------------- | -------- | ----------- |
| string          | yes      | The string to check.

### strjoin

Concatenates multiple strings together with a separator.

Syntax:

`strjoin(separator, strings)`

Arguments:

| Name            | Required | Description |
| --------------- | -------- | ----------- |
| separator       | yes      | A string separator to put between strings.
| strings         | yes      | A list of strings to concatenate. You can also provide the strings as separate arguments: `strjoin(separator, string1, string2, string3...)`

### substr

Returns part of a string from the start index to the end index (or the end of the string if you don't provide an end index).

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

The `${ClusterName}` variable always exists. CycleCloud evaluates this variable to the name of the CycleCloud cluster.

```ini
EmailAddress = ${strcat("myuser", "@", ClusterName)}
ResourceId = ${ClusterName}-00-resource
```

## Relative Time

CycleCloud interprets back-ticks around time duration as relative time. It supports seconds, minutes, and days.

```ini
ThrottleCapacityTime=`10m` 
Attribute1=`30s`
Attribute2=`7d`
```

