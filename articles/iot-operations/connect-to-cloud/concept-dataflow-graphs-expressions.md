---
title: Expressions reference for data flows
description: Reference for the expression language used in data flow and data flow graph transforms in Azure IoT Operations. Covers operators, functions, data types, metadata, and conditionals.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.subservice: azure-data-flows
ms.topic: reference
ms.date: 03/26/2026
ai-usage: ai-assisted

---

# Expressions reference for data flows

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

### Metadata properties

* **Topic**: Works for both MQTT and Kafka. It contains the string where the message was published. Example: `$metadata.topic`.
* **User property**: In MQTT, this refers to the free-form key/value pairs an MQTT message can carry. For example, if the MQTT message was published with a user property with key "priority" and value "high", then the `$metadata.user_property.priority` reference holds the value "high". User property keys can be arbitrary strings and may require escaping: `$metadata.user_property."weird key"` uses the key "weird key" (with a space).
* **System property**: This term is used for every property that is not a user property. Currently, only a single system property is supported: `$metadata.system_property.content_type`, which reads the content type property of the MQTT message (if set).
* **Header**: This is the Kafka equivalent of the MQTT user property. Kafka can use any binary value for a key, but data flows support only UTF-8 string keys. Example: `$metadata.header.priority`. This functionality is similar to user properties.

| Field | Description |
|-------|-------------|
| `$metadata.topic` | The MQTT topic of the message |
| `$metadata.user_property.<key>` | A user property on the message, identified by key |
| `$metadata.system_property.content_type` | The content type system property |
| `$metadata.header.<key>` | A Kafka header value, identified by key |

### Read from metadata

To reference the source topic and a user property in an expression, list them as inputs:

| Input | Variable |
|-------|----------|
| `$metadata.topic` | `$1` |
| `$metadata.user_property.device_id` | `$2` |

Expression: `$1 + "/" + $2`

In the following example, the MQTT `topic` property is mapped to the `origin_topic` field in the output:

| Input | Output |
|-------|--------|
| `$metadata.topic` | `origin_topic` |

If the user property `priority` is present in the MQTT message, the following example demonstrates how to map it to an output field:

| Input | Output |
|-------|--------|
| `$metadata.user_property.priority` | `priority` |

### Write to metadata

To set a user property on the output message, use `$metadata.user_property.<key>` as the output field.

Setting a metadata field to an empty value (`()`) removes it. For user properties, duplicate keys are allowed.

You can also map metadata properties to an output header or user property. In the following example, the MQTT `topic` is mapped to the `origin_topic` field in the output's user property:

| Input | Output |
|-------|--------|
| `$metadata.topic` | `$metadata.user_property.origin_topic` |

If the incoming payload contains a `priority` field, the following example demonstrates how to map it to an MQTT user property:

| Input | Output |
|-------|--------|
| `priority` | `$metadata.user_property.priority` |

The same example for Kafka:

| Input | Output |
|-------|--------|
| `priority` | `$metadata.header.priority` |

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

Use the `?? <default>` suffix on an input to provide a fallback value when the field is missing. Supported default types: integer, float, boolean, string, and null.

> [!NOTE]
> The `?? <default>` syntax is available in data flow graphs only. It isn't supported in data flow `builtInTransformation` inputs.

| Input | Fallback |
|-------|----------|
| `temperature ?? 0` | Integer 0 |
| `status ?? "unknown"` | String "unknown" |
| `threshold ?? 98.6` | Float 98.6 |
| `enabled ?? true` | Boolean true |

### Combine last known value and default

You can combine `? $last` and `?? <default>`. The runtime checks the current message first, then the last known value, then the default. If you use `?? <default>` without `? $last`, the runtime checks the current message and then the default directly.

| Input | Evaluation order |
|-------|-----------------|
| `temperature ?? 0` | Current value, then default (0) |
| `temperature ? $last ?? 0` | Current value, then last known, then default (0) |

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
| `?? <default>` ¹ | Yes | Yes | Yes | No |
| `str::regex_matches` / `str::regex_replace` ¹ | Yes | Yes | Yes | No |
| Wildcards | Yes | No | No | No |

¹ Available in data flow graphs only. Not supported in data flow `builtInTransformation` inputs.

## Dot notation and escaping

Dot notation is widely used to reference nested fields. A standard dot-notation path looks like `Person.Address.Street.Number`.

In a data flow, a path described by dot notation might include strings and some special characters without needing escaping, such as `Person.Date of Birth`.

In other cases, escaping is necessary, for example: `nsu=http://opcfoundation.org/UA/Plc/Applications;s=RandomSignedInt32`. This path, among other special characters, contains dots within the field name. Without escaping, the field name would serve as a separator in the dot notation itself.

While a data flow parses a path, it treats only two characters as special:

* Dots (`.`) act as field separators.
* Single quotation marks, when placed at the beginning or the end of a segment, start an escaped section where dots aren't treated as field separators.

Any other characters are treated as part of the field name. This flexibility is useful in formats like JSON, where field names can be arbitrary strings.

The path definition must also adhere to the rules of the configuration format. When a character with special meaning is included in the path, proper quoting is required. For example, field names that start with a colon (like `:Person:.:name:`) or that begin with a number followed by text (like `100 celsius.hot`) need quoting in the configuration to be interpreted correctly as strings.

### Escaping

The primary function of escaping in a dot-notated path is to accommodate the use of dots that are part of field names rather than separators. For example, the path `Payload."Tag.10".Value` consists of three segments: `Payload`, `Tag.10`, and `Value`. The double quotation marks around `Tag.10` prevent the dot from acting as a separator.

### Escaping rules in dot notation

* **Escape each segment separately:** If multiple segments contain dots, those segments must be enclosed in double quotation marks. Other segments can also be quoted, but it doesn't affect the path interpretation. For example: `Payload."Tag.10".Measurements."Vibration.$12".Value`

    
* **Proper use of double quotation marks:** Double quotation marks must open and close an escaped segment. Any quotation marks in the middle of the segment are considered part of the field name. For example, the path `Payload.He said: "Hello", and waved` defines two fields: `Payload` and `He said: "Hello", and waved`. When a dot appears under these circumstances, it continues to serve as a separator. For example, the path `Payload.He said: "No. It is done"` is split into the segments `Payload`, `He said: "No`, and `It is done"` (starting with a space).
    
### Segmentation algorithm

* If the first character of a segment is a quotation mark, the parser searches for the next quotation mark. The string enclosed between these quotation marks is considered a single segment.
* If the segment doesn't start with a quotation mark, the parser identifies segments by searching for the next dot or the end of the path.

## Wildcards

Use a wildcard (`*`) in input and output paths to match multiple fields at once. This is useful when the output closely resembles the input, or when you need to apply the same transformation across many fields without listing each one.

### Copy all fields

To pass every field through unchanged:

| Input | Output |
|-------|--------|
| `*` | `*` |

The `*` matches each field path in the input and places it at the same path in the output. The portion of the path that `*` matches is called the **captured segment**. In the output, the captured segment replaces the `*`.

### Flatten nested fields

To move fields out of a nested object to the root level, put the prefix in the input and `*` in the output:

| Input | Output |
|-------|--------|
| `Sensors.*` | `*` |
| `Metadata.*` | `*` |

Given this input:

```json
{
  "Sensors": { "Temperature": 72.5, "Pressure": 14.7 },
  "Metadata": { "LineId": "Line-3", "Shift": "A" }
}
```

The output flattens both objects:

```json
{
  "Temperature": 72.5,
  "Pressure": 14.7,
  "LineId": "Line-3",
  "Shift": "A"
}
```

### Restructure fields

To move fields under a new parent, put `*` in the input and add a prefix in the output:

| Input | Output |
|-------|--------|
| `*` | `Telemetry.*` |

This wraps all top-level fields inside a `Telemetry` object.

### Wildcard placement rules

- Only **one** `*` is allowed per input or output path.
- The `*` must match a **complete segment** (not a partial segment like `Sensor*`).
- The `*` can appear at the beginning (`*.Value`), middle (`Sensors.*.Reading`), or end (`Sensors.*`) of a path.

### Multi-input wildcards

When a rule has multiple inputs with wildcards, the `*` must capture the **same segment** across all inputs. The runtime resolves the `*` from the first input, then looks for matching paths in the other inputs.

For example, to average the max and min readings for each sensor:

| Input | Output | Expression |
|-------|--------|------------|
| `*.Max` ($1)<br>`*.Min` ($2) | `Averaged.*` | `($1 + $2) / 2` |

Given this input:

```json
{
  "Temperature": { "Max": 85.3, "Min": 62.1 },
  "Pressure": { "Max": 15.2, "Min": 14.1 }
}
```

The `*` captures `Temperature` first, so the rule looks for both `Temperature.Max` and `Temperature.Min`. Then it captures `Pressure` and looks for `Pressure.Max` and `Pressure.Min`. The output is:

```json
{
  "Averaged": { "Temperature": 73.7, "Pressure": 14.65 }
}
```

If any input can't resolve for a captured segment (for example, `*.Mid.Avg` when the field is nested differently), that segment is skipped. Make sure the paths in all inputs reflect the actual structure of the data.

### Override a wildcard for specific fields

You can combine a wildcard rule with specific rules. Specific rules take precedence when they have a **lower coverage** (fewer segments matched by `*`). This is called **specialization**.

| Input | Output | Expression |
|-------|--------|------------|
| `*.Max` ($1)<br>`*.Min` ($2) | `Averaged.*` | `($1 + $2) / 2` |
| `Pressure.Max` ($1)<br>`Pressure.Min` ($2) | `Averaged.PressureAdj` | `($1 + $2 + 1.0) / 2` |

The first rule applies to all fields. The second rule overrides it for `Pressure` only, because `Pressure.Max` is more specific than `*.Max` (coverage 0 vs. coverage 1).

To exclude a field entirely, use an empty output:

| Input | Output |
|-------|--------|
| `Pressure.Max`, `Pressure.Min` | *(empty)* |

An empty output drops the field from the result. This overrides any wildcard rule that would otherwise include it.

### Multiple rules on the same inputs

If two rules have the same or higher coverage, both apply. This lets you compute multiple derived values from the same inputs:

| Input | Output | Expression |
|-------|--------|------------|
| `*.Max` ($1)<br>`*.Min` ($2) | `Stats.*.Avg` | `($1 + $2) / 2` |
| `*.Max` ($1)<br>`*.Min` ($2) | `Stats.*.Range` | `$1 - $2` |

Both rules execute for each captured segment, producing two output fields per sensor.

### Wildcards in contextualization datasets

You can use wildcards with `$context` references to copy all fields from a dataset:

| Input | Output |
|-------|--------|
| `$context(assetMeta).*` | `Asset.*` |

This copies every field from the `assetMeta` dataset into the `Asset` section of the output.

## Contextualization datasets

Contextualization datasets let mappings integrate extra data from external databases. Use the `$context(datasetName)` prefix to reference fields from a dataset. For example, `$context(position).BaseSalary` reads the `BaseSalary` field from a dataset named `position`.

For details on configuring contextualization datasets, see [Enrich data by using data flows](concept-dataflow-enrich.md) and [Enrich with external data in data flow graphs](howto-dataflow-graphs-enrich.md).

## Related content

- [Map data by using data flows](concept-dataflow-mapping.md)
- [Filter data in a data flow](howto-dataflow-filter.md)
- [Transform data with map in data flow graphs](howto-dataflow-graphs-map.md)
- [Filter and route data in data flow graphs](howto-dataflow-graphs-filter-route.md)
- [Aggregate data over time](howto-dataflow-graphs-window.md)
- [Enrich with external data](howto-dataflow-graphs-enrich.md)
