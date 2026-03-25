---
title: Expressions reference for data flows
description: Reference for the expression language used in data flow and data flow graph transforms in Azure IoT Operations. Covers operators, functions, data types, metadata, and conditionals.
author: sethmanheim
ms.author: sethm
ms.service: azure-iot-operations
ms.subservice: azure-data-flows
ms.topic: reference
ms.date: 03/19/2026
ai-usage: ai-assisted

---

# Expressions reference for data flows

[!INCLUDE [kubernetes-management-preview-note](../includes/kubernetes-management-preview-note.md)]

This reference applies to both [data flows](overview-dataflow.md) and [data flow graphs](concept-dataflow-graphs.md). Both use the same expression language for map, filter, and enrichment transforms. Data flow graphs also support branch and window (accumulate) transforms, which are noted where applicable.

## Positional variables

Each rule's `inputs` array determines the variables available in the `expression`. The first input becomes `$1`, the second becomes `$2`, and so on.

| Inputs | Expression | Result |
|--------|-----------|--------|
| `Position`, `Office` | `$1 + ", " + $2` | Concatenates Position and Office with a comma |
| `temperature` | `cToF($1)` | Converts Celsius to Fahrenheit |
| `temperature`, `humidity` | `$1 * $2 < 100000` | Checks a threshold against two fields |

If only one input is specified and no expression is provided, the value at that input is copied directly to the output.

## Operators

Expressions support the following operators, listed from highest to lowest precedence:

| Precedence | Operators | Description |
|------------|-----------|-------------|
| 1 | `!` | Logical NOT (unary) |
| 2 | `^` | Exponentiation |
| 3 | `*`, `/`, `%` | Multiplication, division, modulo |
| 4 | `+`, `-` | Addition / string concatenation, subtraction |
| 5 | `<`, `>`, `<=`, `>=` | Comparison |
| 6 | `==`, `!=` | Equality, inequality |
| 7 | `&&` | Logical AND |
| 8 | `\|\|` | Logical OR |

The `+` operator concatenates strings when at least one operand is a string. Use parentheses to override default precedence.

Examples:

| Expression | Description |
|-----------|-------------|
| `$1 * 2 ^ 3` | Exponentiation first: `$1 * 8` |
| `($1 * 2) ^ 3` | Parentheses override: multiply first |
| `-$1 * 2` | Negation first, then multiply |
| `$1 > 100 && $2 > 200` | Chain conditions with logical AND |

## Built-in functions

### Unit conversion functions

These functions accept a single numeric value and return a float.

| Function | Conversion | Formula |
|----------|-----------|---------|
| `cToF(value)` | Celsius to Fahrenheit | F = (C × 9/5) + 32 |
| `fToC(value)` | Fahrenheit to Celsius | C = (F - 32) × 5/9 |
| `psiToBar(value)` | PSI to bar | bar = PSI × 0.0689476 |
| `barToPsi(value)` | Bar to PSI | PSI = bar / 0.0689476 |
| `inToCm(value)` | Inches to centimeters | cm = in × 2.54 |
| `cmToIn(value)` | Centimeters to inches | in = cm / 2.54 |
| `ftToM(value)` | Feet to meters | m = ft × 0.3048 |
| `mToFt(value)` | Meters to feet | ft = m / 0.3048 |
| `lbToKg(value)` | Pounds to kilograms | kg = lb × 0.453592 |
| `kgToLb(value)` | Kilograms to pounds | lb = kg / 0.453592 |
| `galToL(value)` | US gallons to liters | L = gal × 3.78541 |
| `lToGal(value)` | Liters to US gallons | gal = L / 3.78541 |

### Scaling and rounding functions

| Function | Description |
|----------|-------------|
| `scale(value, srcLo, srcHi, dstLo, dstHi)` | Linearly scales `value` from the source range to the destination range. All five arguments must be numeric. |
| `round_n(value, decimals)` | Rounds a float to the specified number of decimal places (0 to 15). |

### Math functions

These functions come from the built-in math library.

| Function | Description |
|----------|-------------|
| `floor(value)` | Largest integer less than or equal to a number |
| `round(value)` | Nearest integer, rounding half-way cases away from 0.0 |
| `ceil(value)` | Smallest integer greater than or equal to a number |
| `math::abs(value)` | Absolute value |
| `math::sqrt(value)` | Square root (returns NaN for negative numbers) |
| `math::cbrt(value)` | Cube root |
| `math::ln(value)` | Natural logarithm |
| `math::log2(value)` | Base-2 logarithm |
| `math::log10(value)` | Base-10 logarithm |
| `math::log(value, base)` | Logarithm with arbitrary base |
| `math::exp(value)` | e raised to the power of value |
| `math::exp2(value)` | 2 raised to the power of value |
| `math::pow(base, exp)` | Raises base to the power of exp |
| `math::cos(value)` | Cosine (radians) |
| `math::sin(value)` | Sine (radians) |
| `math::tan(value)` | Tangent (radians) |
| `math::acos(value)` | Arccosine (returns radians) |
| `math::asin(value)` | Arcsine (returns radians) |
| `math::atan(value)` | Arctangent (returns radians) |
| `math::atan2(y, x)` | Four-quadrant arctangent (returns radians) |
| `math::hypot(a, b)` | Length of the hypotenuse from sides a and b |

### String functions

| Function | Description |
|----------|-------------|
| `len(string)` | Character length of a string, or element count of a tuple |
| `str::to_lowercase(string)` | Converts to lowercase |
| `str::to_uppercase(string)` | Converts to uppercase |
| `str::trim(string)` | Removes leading and trailing whitespace |
| `str::from(value)` | Converts a value to its string representation |
| `str::substring(string, start, end)` | Extracts a substring by character index |
| `str::regex_matches(string, pattern)` | Returns true if the string matches the regex pattern. Available in data flow graphs only. |
| `str::regex_replace(string, pattern, replacement)` | Replaces all regex matches with the replacement string. Available in data flow graphs only. |

### Conditional and collection functions

| Function | Description |
|----------|-------------|
| `if(condition, trueVal, falseVal)` | Returns `trueVal` when condition is true, otherwise `falseVal` |
| `min(values)` | Minimum of one or more numeric values or an array |
| `max(values)` | Maximum of one or more numeric values or an array |
| `contains(tuple, value)` | Returns true if the tuple contains the value |
| `contains_any(tuple, candidates)` | Returns true if the tuple contains any value from the candidates tuple |
| `typeof(value)` | Returns the type as a string: `"string"`, `"float"`, `"int"`, `"boolean"`, `"tuple"`, or `"empty"` |

### Aggregation functions (window transforms only)

These functions are available only in accumulation rules within window transforms. Each takes a single positional variable.

| Function | Returns | Empty window behavior |
|----------|---------|-----------------------|
| `average($n)` | Mean of numeric values | Error |
| `sum($n)` | Sum of numeric values | 0.0 |
| `min($n)` | Minimum numeric value | Error |
| `max($n)` | Maximum numeric value | Error |
| `count($n)` | Count of messages where the field exists | 0 |
| `first($n)` | First value in the window | Error |
| `last($n)` | Last value in the window | Error |

For details on using aggregation functions, see [Aggregate data over time](howto-dataflow-graphs-window.md).

## Conditional logic

Use the `if` function to branch logic within an expression:

| Expression | Description |
|-----------|-------------|
| `if($1 > 100, "high", "normal")` | Returns "high" when temperature exceeds 100 |
| `if($2 == (), $1, $1 * $2)` | Falls back to $1 when $2 is missing |
| `if($1 > 5, true, false)` | Returns a boolean based on a threshold |

Use `()` (the empty value) in comparisons to detect missing fields.

> [!TIP]
> If you only need a static fallback for a missing field, the `?? <default>` syntax is simpler. See [Default values](#default-values). Reserve `if` for cases where you need to choose between computed values.

## Metadata fields

Read from and write to message metadata by using the `$metadata.` prefix in the `inputs` or `output` fields of a rule. Metadata references go in the field path, not in the expression itself.

| Field | Description |
|-------|-------------|
| `$metadata.topic` | The MQTT topic of the message |
| `$metadata.user_property.<key>` | A user property on the message, identified by key |
| `$metadata.system_property.content_type` | The content type system property |

### Read from metadata

To reference the source topic and a user property in an expression, list them as inputs:

| Input | Variable |
|-------|----------|
| `$metadata.topic` | `$1` |
| `$metadata.user_property.device_id` | `$2` |

Expression: `$1 + "/" + $2`

### Write to metadata

To set a user property on the output message, use `$metadata.user_property.<key>` as the output field.

Setting a metadata field to an empty value (`()`) removes it. For user properties, duplicate keys are allowed.

Metadata fields are supported in map, filter, and branch rules. They aren't available in window (accumulate) rules.

## Last known value

Use the `? $last` suffix on an input to tell the runtime to remember the most recent value for that field. If the field is missing in the current message, the last known value is used instead.

| Input | Behavior |
|-------|----------|
| `temperature ? $last` | Uses the last known temperature if the current message has no `temperature` field |

The `? $last` directive is case-insensitive and supports flexible whitespace.

> [!IMPORTANT]
> Last known values are stored in memory only. They're lost when the pod restarts and aren't shared across replicas.

Last known value is supported in map, filter, and branch rules. It isn't available in window (accumulate) rules.

## Default values

Use the `?? <default>` suffix on an input to provide a fallback value when the field is missing and no last known value is available. Supported default types: integer, float, boolean, string, and null.

| Input | Fallback |
|-------|----------|
| `temperature ?? 0` | Integer 0 |
| `status ?? "unknown"` | String "unknown" |
| `threshold ?? 98.6` | Float 98.6 |
| `enabled ?? true` | Boolean true |

### Combine last known value and default

You can combine `? $last` and `?? <default>`. The runtime checks the current message first, then the last known value, then the default.

| Input | Evaluation order |
|-------|-----------------|
| `temperature ? $last ?? 0` | Current value, then last known, then 0 |

Default values are supported in map, filter, and branch rules. They aren't available in window (accumulate) rules.

## Data types

| Type | Description | Example |
|------|-------------|---------|
| Int | 64-bit signed integer | `42`, `-7` |
| Float | 64-bit floating point | `3.14`, `-0.5` |
| String | UTF-8 text | `"hello"` |
| Bool | Boolean | `true`, `false` |
| Tuple | Array of primitive values | `(1, 2, 3)` |
| Empty | Missing or null value | `()` |
| JSON | JSON object passed through | (can't be used in expressions) |

JSON objects and arrays are preserved as-is when fields are copied without an expression, but they can't be used as inputs to expression evaluation.

## Feature support by transform type

| Feature | Map | Filter | Branch | Window (accumulate) |
|---------|-----|--------|--------|---------------------|
| Positional variables | Yes | Yes | Yes | Yes |
| Operators | Yes | Yes | Yes | Yes |
| Built-in functions | Yes | Yes | Yes | Yes |
| Aggregation functions | No | No | No | Yes |
| `$metadata` access | Yes | Yes | Yes | No |
| `$context` enrichment | Yes | Yes | Yes | No |
| `? $last` | Yes | Yes | Yes | No |
| `?? <default>` | Yes | Yes | Yes | No |
| Wildcards | Yes | No | No | No |

## Related content

- [Map data by using data flows](concept-dataflow-mapping.md)
- [Filter data in a data flow](howto-dataflow-filter.md)
- [Transform data with map in data flow graphs](howto-dataflow-graphs-map.md)
- [Filter and route data in data flow graphs](howto-dataflow-graphs-filter-route.md)
- [Aggregate data over time](howto-dataflow-graphs-window.md)
- [Enrich with external data](howto-dataflow-graphs-enrich.md)
