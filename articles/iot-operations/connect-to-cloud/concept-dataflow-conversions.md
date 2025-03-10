---
title: Convert data by using data flow conversions
description: Learn about data flow conversions for transforming data in Azure IoT Operations.
author: PatAltimore
ms.author: patricka
ms.subservice: azure-data-flows
ms.topic: concept-article
ms.date: 11/11/2024

#CustomerIntent: As an operator, I want to understand how to use data flow conversions to transform data.
ms.service: azure-iot-operations
---

# Convert data by using data flow conversions

[!INCLUDE [kubernetes-management-preview-note](../includes/kubernetes-management-preview-note.md)]

You can use data flow conversions to transform data in Azure IoT Operations. The *conversion* element in a data flow is used to compute values for output fields. You can use input fields, available operations, data types, and type conversions in data flow conversions.

The data flow conversion element is used to compute values for output fields:

# [Bicep](#tab/bicep)

```bicep
inputs: [
  '*.Max' // - $1
  '*.Min' // - $2
]
output: 'ColorProperties.*'
expression: '($1 + $2) / 2'
```

# [Kubernetes (preview)](#tab/kubernetes)

```yaml
- inputs:
  - *.Max   # - $1
  - *.Min   # - $2
  output: ColorProperties.*
  expression: ($1 + $2) / 2
```

---

There are several aspects to understand about conversions:

* **Reference to input fields:** How to reference values from input fields in the conversion formula.
* **Available operations:** Operations that can be utilized in conversions. For example, addition, subtraction, multiplication, and division.
* **Data types:** Types of data that a formula can process and manipulate. For example, integer, floating point, and string.
* **Type conversions:** How data types are converted between the input field values, the formula evaluation, and the output fields.

## Input fields

In conversions, formulas can operate on static values like a number such as *25* or parameters derived from input fields. A mapping defines these input fields that the formula can access. Each field is referenced according to its order in the input list:

# [Bicep](#tab/bicep)

```bicep
inputs: [
  '*.Max'      // - $1
  '*.Min'      // - $2
  '*.Mid.Avg'  // - $3
  '*.Mid.Mean' // - $4
]
output: 'ColorProperties.*'
expression: '($1, $2, $3, $4)'
```

# [Kubernetes (preview)](#tab/kubernetes)

```yaml
- inputs:
  - *.Max        # - $1
  - *.Min        # - $2
  - *.Mid.Avg    # - $3
  - *.Mid.Mean   # - $4
  output: ColorProperties.*
  expression: ($1, $2, $3, $4)
```

---

In this example, the conversion results in an array containing the values of `[Max, Min, Mid.Avg, Mid.Mean]`. The comments in the YAML file (`# - $1`, `# - $2`) are optional, but they help to clarify the connection between each field property and its role in the conversion formula.

## Data types

Different serialization formats support various data types. For instance, JSON offers a few primitive types: string, number, Boolean, and null. It also includes arrays of these primitive types.

When the mapper reads an input property, it converts it into an internal type. This conversion is necessary for holding the data in memory until it's written out into an output field. The conversion to an internal type happens regardless of whether the input and output serialization formats are the same.

The internal representation utilizes the following data types:

| Type          | Description                               |
|---------------|-------------------------------------------|
| `bool`        | Logical true/false.                        |
| `integer`     | Stored as 128-bit signed integer.          |
| `float`       | Stored as 64-bit floating point number.    |
| `string`      | A UTF-8 string.                            |
| `bytes`       | Binary data, a string of 8-bit unsigned values. |
| `datetime`    | UTC or local time with nanosecond resolution. |
| `time`        | Time of day with nanosecond resolution.    |
| `duration`    | A duration with nanosecond resolution.     |
| `array`       | An array of any types listed previously.        |
| `map`         | A vector of (key, value) pairs of any types listed previously. |

### Input record fields

When an input record field is read, its underlying type is converted into one of these internal type variants. The internal representation is versatile enough to handle most input types with minimal or no conversion.

For some formats, surrogate types are used. For example, JSON doesn't have a `datetime` type and instead stores `datetime` values as strings formatted according to ISO8601. When the mapper reads such a field, the internal representation remains a string.

### Output record fields

The mapper is designed to be flexible by converting internal types into output types to accommodate scenarios where data comes from a serialization format with a limited type system. The following examples show how conversions are handled:

* **Numeric types:** These types can be converted to other representations, even if it means losing precision. For example, a 64-bit floating-point number (`f64`) can be converted into a 32-bit integer (`i32`).
* **Strings to numbers:** If the incoming record contains a string like `123` and the output field is a 32-bit integer, the mapper converts and writes the value as a number.
* **Strings to other types:**
  * If the output field is `datetime`, the mapper attempts to parse the string as an ISO8601 formatted `datetime`.
  * If the output field is `binary/bytes`, the mapper tries to deserialize the string from a base64-encoded string.
* **Boolean values:**
  * Converted to `0`/`1` if the output field is numerical.
  * Converted to `true`/`false` if the output field is string.

### Use a conversion formula with types

In mappings, an optional formula can specify how data from the input is processed before being written to the output field. If no formula is specified, the mapper copies the input field to the output by using the internal type and conversion rules.

If a formula is specified, the data types available for use in formulas are limited to:

* Integers
* Floating-point numbers
* Strings
* Booleans
* Arrays of the preceding types
* Missing value

`Map` and `byte` can't participate in formulas.

Types related to time (`datetime`, `time`, and `duration`) are converted into integer values that represent time in seconds. After formula evaluation, results are stored in the internal representation and not converted back. For example, `datetime` converted to seconds remains an integer. If the value will be used in `datetime` fields, an explicit conversion method must be applied. An example is converting the value into an ISO8601 string that's automatically converted to the `datetime` type of the output serialization format.

### Use irregular types

Special considerations apply to types like arrays and *missing value*.

### Arrays

Arrays can be processed by using aggregation functions to compute a single value from multiple elements. For example, by using the input record:

```json
{
  "Measurements": [2.34, 12.3, 32.4]
}
```

With the mapping:

# [Bicep](#tab/bicep)

```bicep
inputs: [
  'Measurements' // - $1
]
output: 'Measurement'
expression: 'min($1)'
```

# [Kubernetes (preview)](#tab/kubernetes)

```yaml
- inputs:
  - Measurements # - $1
  output: Measurement
  expression: min($1)
```

---

This configuration selects the smallest value from the `Measurements` array for the output field.

Arrays can also be created from multiple single values:

# [Bicep](#tab/bicep)

```bicep
inputs: [
  'minimum' // - - $1
  'maximum' // - - $2
  'average' // - - $3
  'mean'    // - - $4
]
output: 'stats'
expression: '($1, $2, $3, $4)'
```

# [Kubernetes (preview)](#tab/kubernetes)

```yaml
- inputs:
  - minimum  # - - $1
  - maximum  # - - $2
  - average  # - - $3
  - mean     # - - $4
  output: stats
  expression: ($1, $2, $3, $4)
```

---

This mapping creates an array that contains the minimum, maximum, average, and mean.

### Missing value

Missing value is a special type used in scenarios, such as:

* Handling missing fields in the input by providing an alternative value.
* Conditionally removing a field based on its presence.

Example mapping that uses a missing value:

```json
{
  "Employment": {      
    "Position": "Analyst",
    "BaseSalary": 75000,
    "WorkingHours": "Regular"
  }
}
```

The input record contains the `BaseSalary` field, but possibly that's optional. Let's say that if the field is missing, a value must be added from a contextualization dataset:

```json
{
  "Position": "Analyst",
  "BaseSalary": 70000,
  "WorkingHours": "Regular"
}
```

A mapping can check if the field is present in the input record. If the field is found, the output receives that existing value. Otherwise, the output receives the value from the context dataset. For example:

# [Bicep](#tab/bicep)

```bicep
inputs: [
  'BaseSalary' // - - - - - - - - - - - $1
  '$context(position).BaseSalary' //  - $2
]
output: 'BaseSalary'
expression: 'if($1 == (), $2, $1)'
```

# [Kubernetes (preview)](#tab/kubernetes)

```yaml
- inputs:
  - BaseSalary  # - - - - - - - - - - $1
  - $context(position).BaseSalary # - $2
  output: BaseSalary
  expression: if($1 == (), $2, $1)
```

---

The `conversion` uses the `if` function that has three parameters:

* The first parameter is a condition. In the example, it checks if the `BaseSalary` field of the input field (aliased as `$1`) is the missing value.
* The second parameter is the result of the function if the condition in the first parameter is true. In this example, it's the `BaseSalary` field of the contextualization dataset (aliased as `$2`).
* The third parameter is the value for the condition if the first parameter is false.

## Available functions

Data flows provide a set of built-in functions that can be used in conversion formulas. These functions can be used to perform common operations like arithmetic, comparison, and string manipulation. The available functions are:

| Function | Description | Examples |
|----------|-------------|---------|
| `min`    | Return the minimum value from an array. | `min(2, 3, 1)` returns `1`, `min($1)` returns the minimum value from the array `$1` |
| `max`    | Return the maximum value from an array. | `max(2, 3, 1)` returns `3`, `max($1)` returns the maximum value from the array `$1` |
| `if`     | Return between values based on a condition. | `if($1 > 10, 'High', 'Low')` returns `'High'` if `$1` is greater than `10`, otherwise `'Low'` |
| `len`    | Return the character length of a string or the number of elements in a tuple. | `len("Azure")` returns `5`, `len(1, 2, 3)` returns `3`, `len($1)` returns the number of elements in the array `$1` |
| `floor`  | Return the largest integer less than or equal to a number. | `floor(2.9)` returns `2` |
| `round`  | Return the nearest integer to a number, rounding half-way cases away from 0.0. | `round(2.5)` returns `3` |
| `ceil`   | Return the smallest integer greater than or equal to a number. | `ceil(2.1)` returns `3` |
| `scale`  | Scale a value from one range to another. | `scale($1, 0, 10, 0, 100)` scales the input value from the range 0 to 10 to the range 0 to 100 |

### Conversion functions

Data flows provide several built-in conversion functions for common unit conversions like temperature, pressure, length, weight, and volume. Here are some examples:

| Conversion | Formula | Function name |
| --- | --- | --- |
| Celsius to Fahrenheit | F = (C * 9/5) + 32 | `cToF` |
| PSI to bar | Bar = PSI * 0.0689476 | `psiToBar` |
| Inch to cm | Cm = inch * 2.54 | `inToCm` |
| Foot to meter | Meter = foot * 0.3048 | `ftToM` |
| Lbs to kg | Kg = lbs * 0.453592 | `lbToKg` |
| Gallons to liters | Liters = gallons * 3.78541 | `galToL` |

Reverse conversions are also supported:

| Conversion | Formula | Function name |
| --- | --- | --- |
| Fahrenheit to Celsius | C = (F - 32) * 5/9 | `fToC` |
| Bar to PSI | PSI = bar / 0.0689476 | `barToPsi` |
| Cm to inch | Inch = cm / 2.54 | `cmToIn` |
| Meter to foot | Foot = meter / 0.3048 | `mToFt` |
| Kg to lbs | Lbs = kg / 0.453592 | `kgToLb` |
| Liters to gallons | Gallons = liters / 3.78541 | `lToGal` |

Additionally, you can define your own conversion functions using basic mathematical formulas. The system supports operators like addition (`+`), subtraction (`-`), multiplication (`*`), and division (`/`). These operators follow standard rules of precedence, which can be adjusted using parentheses to ensure the correct order of operations. This allows you to customize unit conversions to meet specific needs.

## Available operators by precedence

| Operator | Description |
|----------|-------------|
| ^        | Exponentiation: $1 ^ 3 |

Because `Exponentiation` has the highest precedence, it's executed first unless parentheses override this order:

* `$1 * 2 ^ 3` is interpreted as `$1 * 8` because the `2 ^ 3` part is executed first, before multiplication.
* `($1 * 2) ^ 3` processes the multiplication before exponentiation.

| Operator | Description |
|----------|-------------|
| -        | Negation |
| !        | Logical not |

`Negation` and `Logical not` have high precedence, so they always stick to their immediate neighbor, except when exponentiation is involved:

* `-$1 * 2` negates `$1` first, and then multiplies.
* `-($1 * 2)` multiplies, and then negates the result.

| Operator | Description |
|----------|-------------|
| *        | Multiplication: $1 * 10 |
| /        | Division: $1 / 25 (Result is an integer if both arguments are integers, otherwise float) |
| %        | Modulo: $1 % 25 |

`Multiplication`, `Division`, and `Modulo`, having the same precedence, are executed from left to right, unless the order is altered by parentheses.

| Operator | Description |
|----------|-------------|
| +        | Addition for numeric values, concatenation for strings |
| -        | Subtraction |

`Addition` and `Subtraction` are considered weaker operations compared to the operations in the previous group:

* `$1 + 2 * 3` results in `$1 + 6` because `2 * 3` is executed first because of the higher precedence of `multiplication`.
* `($1 + 2) * 3` prioritizes `Addition` before `Multiplication`.

| Operator | Description |
|----------|-------------|
| <        | Less than |
| >        | Greater than |
| <=       | Less than or equal to |
| >=       | Greater than or equal to |
| ==       | Equal to |
| !=       | Not equal to |

`Comparisons` operate on numeric, Boolean, and string values. Because they have lower precedence than arithmetic operators, no parentheses are needed to compare results effectively:

* `$1 * 2 <= $2` is equivalent to `($1 * 2) <= $2`.

| Operator | Description |
|----------|-------------|
| \|\|     | Logical OR |
| &&       | Logical AND |

Logical operators are used to chain conditions:

* `$1 > 100 && $2 > 200`
