---
title: Dataflow language design
description: Learn about the dataflow language design.
author: PatAltimore
ms.author: patricka
ms.subservice: azure-mqtt-broker
ms.topic: conceptual
ms.date: 07/23/2024

#CustomerIntent: As an operator, I want to understand how to I can use Dataflows to .
---

# Dataflow language design

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

## Map data

Consider the following input record:

```json
{
  "Name": "John Doe",
  "Place of birth": "London, TX",
  "Birth Date": "19840202",
  "Start Date": "20180812",
  "Position": "Analyst",
  "Office": "Kent, WA"
}
```

And compare it with the output record:

```json
{
  "Employee": {
    "Name": "John Doe",
    "Date of Birth": "19840202"
  },
  "Employment": {
    "Start Date": "20180812",
    "Position": "Analyst, Kent, WA",
    "Base Salary": 78000
  }
}
```

In the output record:

* **Fields renamed:** `Birth Date` is now `Date of Birth`.
* **Fields restructured:** Both `Name` and `Date of Birth` are grouped under the new `Employee` category.
* **Field deleted:** `Place of birth` is removed, as it is not present in the output.
* **Field added:** `Base Salary` is a new field in the `Employment` category.
* **Field values changed/merged:** The `Position` field in the output combines the `Position` and `Office` fields from the input.

These transformations are achieved through `mapping`, which typically involves:

* **Input definition**: Identifying the fields in the input records that are used.
* **Output definition**: Specifying where and how the input fields should be organized in the output records.
* **Conversion (optional)**: Modifying the input fields to fit into the output fields. This is required when multiple input fields are combined into a single output field.

## Example Mappings

```yaml
- inputs:
  - BirthDate
  output: Employee.DateOfBirth

- inputs:
  - Position # - - - $1
  - Office # - - - - $2
  output: Employment.Position
  conversion: $1 + ", " + $2

- inputs:
  - $context(position).BaseSalary
  output: Employment.BaseSalary
```

This example illustrates:

* **One-to-one mapping**: The `BirthDate` is directly mapped to `Employee.DateOfBirth` without conversion.
* **Many-to-one mapping**: Combines `Position` and `Office` into a single `Employment.Position` field. The conversion formula (`$1 + ", " + $2`) merges these fields into a formatted string.
* **Using contextual data**: The `BaseSalary` is added from a contextual dataset named `position`.

## Key concepts

## Field References

Field references show how to specify paths in the input and output, using dot notation like `Employee.DateOfBirth` or accessing data from a contextual dataset via `$context(position)`.

## Contextualization Dataset Selectors

These selectors allow mappings to integrate additional data from external databases, referred to as *Contextualization Datasets*.

## Record Filtering

Although not previously mentioned, record filtering involves setting conditions to select which records should be processed or dropped.

## Dot-notation

Dot-notation is widely used in computer science to reference fields, even recursively. In programming, field names typically consist of letters and numbers, so a standard dot-notation might look like this:

```yaml
- inputs:
  - Person.Address.Street.Number
```

However, in dataflow a path described by dot-notation might include strings and some special characters without needing escaping:

```yaml
- inputs:
  - Person.Date of Birth
```

However, in other cases, escaping is necessary:

```yaml
- inputs:
  - nsu=http://opcfoundation.org/UA/Plc/Applications;s=RandomSignedInt32
```

The previous example, among other special characters, contains dots within the field name, which, without escaping, would serve as a separator in the dot-notation itself.

While dataflow parses a path, it treats only two characters as special:

* Dots ('.') act as field separators.
* Quotes, when placed at the beginning or the end of a segment, start an escaped section where dots aren't treated as field separators.

Any other characters are treated as part of the field name. This flexibility is useful in formats like JSON, where field names can be arbitrary strings.

Note, however, that the path definition must also adhere to the rules of YAML: once a character with special meaning is included in the path, proper quoting is required in the configuration. Consult the YAML documentation for precise rules. Here are some examples that demonstrate the need for careful formatting:

```yaml
- inputs:
  - ':Person:.:name:'   # ':' cannot be used as the first character without quotes
  - '100 celsius.hot'   # numbers followed by text would not be interpreted as a string without quotes
```

## Escaping

The primary function of escaping in a dot-notated path is to accommodate the use of dots that are part of field names rather than separators:

```yaml
- inputs:
  - 'Payload."Tag.10".Value'
```

In the previous example, the path consists of three segments: `Payload`, `Tag.10`, and `Value`. The outer single quotes (`'`) are necessary because of YAML syntax rules, allowing the inclusion of double quotes within the string.

**Escaping Rules in Dot-Notation:**

* **Escape Each Segment Separately**: If multiple segments contain dots, those segments must be enclosed in quotes. Other segments can also be quoted, but it doesn't affect the path interpretation:
  
```yaml
- inputs:
  - 'Payload."Tag.10".Measurements."Vibration.$12".Value'
```

* **Proper Use of Double Quotes**: A double quote must open and close an escaped segment; any quotes in the middle of the segment are considered part of the field name:
  
```yaml
- inputs:
  - 'Payload.He said: "Hello", and waved'
```

This example defines two fields in the dataDestination: `Payload` and `He said: "Hello", and waved`. When a dot appears under these circumstances, it continues to serve as a separator, as follows:

```yaml
- inputs:
  - 'Payload.He said: "No. It's done"'
```

In this case, the path is split into the segments `Payload`, `He said: "No`, and `It's done"` (starting with a space).

**Segmentation Algorithm**:

* If the first character of a segment is a quote, the parser searches for the next quote. The string enclosed between these quotes is considered a single segment.
* If the segment doesn't start with a quote, the parser identifies segments by searching for the next dot or the end of the path.

## Wildcard (`*`)

In many scenarios, the output record closely resembles the input record, with only minor modifications required. When dealing with records that contain numerous fields, manually specifying mappings for each field can become tedious. Wildcards simplify this process by allowing for generalized mappings that can automatically apply to multiple fields.

Let's consider a basic scenario to understand the use of asterisks in mappings:

```yaml
- inputs:
  - *
  output: *
```

Here's how the asterisk (`*`) operates in this context:

* **Pattern Matching**: The asterisk can match a single or multiple segments of a path. It serves as a placeholder for any segments in the path.
* **Field Matching**: During the mapping process, the algorithm evaluates each field in the input record against the pattern specified in the `inputs`. The asterisk in the previous example matches all possible paths, effectively fitting every individual field in the input.
* **Captured Segment**: The portion of the path that the asterisk matches is referred to as the `captured segment`.
* **Output Mapping**: In the output configuration, the `captured segment` is placed where the asterisk appears. This means that the structure of the input is preserved in the output, with the `captured segment` filling the placeholder provided by the asterisk.

This configuration demonstrates the most generic form of mapping, where every field in the input is directly mapped to a corresponding field in the output without modification.

Another example illustrates how wildcards can be used to match sub-sections and move them together. This example effectively flattens nested structures within a JSON object:

*Original JSON:*

```json
{
  "ColorProperties": {
    "Hue": "blue",
    "Saturation": "90%",
    "Brightness": "50%",
    "Opacity": "0.8"
  },
  "TextureProperties": {
    "type": "fabric",
    "SurfaceFeel": "soft",
    "SurfaceAppearance": "matte",
    "Pattern": "knitted"
  }
}
```

*Mapping Configuration Using Wildcards:*

```yaml
- inputs:
  - ColorProperties.*
  output: *

- inputs:
  - TextureProperties.*
  output: *
```

*Resulting JSON:*

```json
{
  "Hue": "blue",
  "Saturation": "90%",
  "Brightness": "50%",
  "Opacity": "0.8",
  "type": "fabric",
  "SurfaceFeel": "soft",
  "SurfaceAppearance": "matte",
  "Pattern": "knitted"
}
```

### Wildcard Placement

When placing a wildcard, the following rules must be followed:

* **Single Asterisk per dataDestination:** Only one asterisk (`*`) is allowed within a single path.
* **Full Segment Matching:** The asterisk must always match an entire segment of the path. It can't be used to match only a part of a segment, such as `path1.partial*.path3`.
* **Positioning:** The asterisk can be positioned in various parts of the dataDestination:
  * **At the Beginning:** `*.path2.path3` - Here, the asterisk matches any segment that leads up to `path2.path3`.
  * **In the Middle:** `path1.*.path3` - In this configuration, the asterisk matches any segment between `path1` and `path3`.
  * **At the End:** `path1.path2.*` - The asterisk at the end matches any segment that follows after `path1.path2`.

### Multi-Input Wildcards

*Original JSON:*

```json
{
  "Saturation": {
    "Max": 0.42,
    "Min": 0.67,
  },
  "Brightness": {
    "Max": 0.78,
    "Min": 0.93,
  },
  "Opacity": {
    "Max": 0.88,
    "Min": 0.91,
  }
}
```

*Mapping Configuration Using Wildcards:*

```yaml
- inputs:
  - *.Max   # - $1
  - *.Min   # - $2
  output: ColorProperties.*
  conversion: ($1 + $2) / 2
```

*Resulting JSON:*

```json
{
  "ColorProperties" : {
    "Saturation": 0.54,
    "Brightness": 0.85,
    "Opacity": 0.89 
  }    
}
```

If multi-input wildcards, the asterisk (`*`) must consistently represent the same `Captured Segment` across every input. For example, when `*` captures `Saturation` in the pattern `*.Max`, the mapping algorithm expects the corresponding `Saturation.Min` to match with the pattern `*.Min`. Here, `*` is substituted by the `Captured Segment` from the first input, guiding the matching for subsequent inputs.

Consider this detailed example:

**Original JSON:**

```json
{
  "Saturation": {
    "Max": 0.42,
    "Min": 0.67,
    "Mid": {
      "Avg": 0.51,
      "Mean": 0.56
    }
  },
  "Brightness": {
    "Max": 0.78,
    "Min": 0.93,
    "Mid": {
      "Avg": 0.81,
      "Mean": 0.82
    }
  },
  "Opacity": {
    "Max": 0.88,
    "Min": 0.91,
    "Mid": {
      "Avg": 0.89,
      "Mean": 0.89
    }
  }
}
```

**Initial Mapping Configuration Using Wildcards:**

```yaml
- inputs:
  - *.Max    # - $1
  - *.Min    # - $2
  - *.Avg    # - $3
  - *.Mean   # - $4
  output: ColorProperties.*
  conversion: ($1, $2, $3, $4)
```

This initial mapping tries to build an array (For example, for `Opacity`: `[0.88, 0.91, 0.89, 0.89]`). However, this configuration fails because:

* The first input `*.Max` captures a segment like `Saturation`.
* The mapping expects the subsequent inputs to be present at the same level:
  * `Saturation.Max`
  * `Saturation.Min`
  * `Saturation.Avg`
  * `Saturation.Mean`

Since `Avg` and `Mean` are nested within `Mid`, the asterisk in the initial mapping doesn't correctly capture these paths.

**Corrected Mapping Configuration:**

```yaml
- inputs:
  - *.Max        # - $1
  - *.Min        # - $2
  - *.Mid.Avg    # - $3
  - *.Mid.Mean   # - $4
  output: ColorProperties.*
  conversion: ($1, $2, $3, $4)
```

This revised mapping accurately captures the necessary fields by correctly specifying the paths to include the nested `Mid` object, ensuring that the asterisks work effectively across different levels of the JSON structure.

### Second Rule vs. Specialization

Using the example from Multi-Input Wildcards, consider the following mappings that generate two derived values for each property:

```yaml
- inputs:
  - *.Max   # - $1
  - *.Min   # - $2
  output: ColorProperties.*.Avg
  conversion: ($1 + $2) / 2

- inputs:
  - *.Max   # - $1
  - *.Min   # - $2
  output: ColorProperties.*.Diff
  conversion: abs($1 - $2)
```

This mapping is intended to create two separate calculations (`Avg` and `Diff`) for each property under `ColorProperties`. The result is as follows:

```json
{
  "ColorProperties": {
    "Saturation": {
      "Avg": 0.54,
      "Diff": 0.25
    },
    "Brightness": {
      "Avg": 0.85,
      "Diff": 0.15
    },
    "Opacity": {
      "Avg": 0.89,
      "Diff": 0.03
    }
  }
}
```

Here, the second mapping definition on the same inputs acts as a `Second Rule` for mapping.

Now, consider a scenario where a specific field needs a different calculation:

```yaml
- inputs:
  - *.Max   # - $1
  - *.Min   # - $2
  output: ColorProperties.*
  conversion: ($1 + $2) / 2

- inputs:
  - Opacity.Max   # - $1
  - Opacity.Min   # - $2
  output: ColorProperties.OpacityAdjusted
  conversion: ($1 + $2 + 1.32) / 2  
```

In this case, the `Opacity` field has a unique calculation. Two options to handle this overlapping scenario are:

1. Include both mappings for `Opacity`. Since the output fields are different in this example, they wouldn't override each other.
2. Use the more specific rule for `Opacity` and remove the more generic one.

Consider a special case for the same fields to help deciding the right action:

```yaml
- inputs:
  - *.Max   # - $1
  - *.Min   # - $2
  output: ColorProperties.*
  conversion: ($1 + $2) / 2

- inputs:
  - Opacity.Max
  - Opacity.Min
  output:   
```

An empty `output` field in the second definition implies not writing the fields in the output record (effectively removing `Opacity`). This setup is more of a `Specialization` than a `Second Rule`.

**Resolution of Overlapping Mappings by dataflow:**

* The evaluation progresses from the top rule in the mapping definition.
* If a new mapping resolves to the same fields as a previous rule, the following applies:
  * A `Rank` is calculated for each resolved input based on the number of segments the wildcard captures. For instance, if the `Captured Segments` are `Properties.Opacity`, the `Rank` is 2. If only `Opacity`, the `Rank` is 1. A mapping without wildcards has a `Rank` of 0.
  * If the `Rank` of the latter rule is equal to or higher than the previous rule, dataflow treats it as a `Second Rule`.
  * Otherwise, it treats the configuration as a `Specialization`.

For example, the mapping that directs `Opacity.Max` and `Opacity.Min` to an empty output has a `Rank` of zero. Since the second rule has a lower `Rank` than the previous, it's considered a specialization and overrides the previous rule, which would calculate a value for `Opacity`

### Wildcards in contextualization datasets

While a detailed explanation of Contextualization Datasets will follow later, let's see now how they can be used with wildcards through an example. Consider a dataset named `position` that contains the following record:

```json
{
  "Position": "Analyst",
  "BaseSalary": 70000,
  "WorkingHours": "Regular"
}
```

In an earlier example, we used a specific field from this dataset:

```yaml
- inputs:
  - $context(position).BaseSalary
  output: Employment.BaseSalary
```

This mapping copies the `BaseSalary` from the context dataset directly into the `Employment` section of the output record. However, if you want to automate the process and include all fields from the `position` dataset into the `Employment` section, you can utilize wildcards:

```yaml
- inputs:
  - $context(position).*
  output: Employment.*
```

This configuration allows for a dynamic mapping where every field within the `position` dataset is copied into the `Employment` section of the output record:

```json
{
    "Employment": {      
      "Position": "Analyst",
      "BaseSalary": 70000,
      "WorkingHours": "Regular"
    }
}
```

## Conversions

In previous examples, we've seen the `conversion` element used to compute values for output fields:

```yaml
- inputs:
  - *.Max   # - $1
  - *.Min   # - $2
  output: ColorProperties.*
  conversion: ($1 + $2) / 2
```

When discussing conversions, several aspects need to be clarified:

* **Reference to Input Fields**: Understanding how to correctly reference values from input fields in the conversion formula.
* **Available Operations**: Identifying which operations (such as addition, subtraction, multiplication, and division) can be utilized in conversions.
* **Data Types**: The types of data (e.g., integer, floating-point, string) that the formula can process and manipulate.
* **Type Conversions**: How data types are converted between the input field values, the formula evaluation, and the output fields.

This section will explore each of these aspects.

## Reference to Input Fields

In conversions, formulas can operate on static values (For example, a number like `25`) or parameters derived from input fields. A mapping defines these input fields, which the formula can access. Each field is referenced according to its order in the input list:

```yaml
- inputs:
  - *.Max        # - $1
  - *.Min        # - $2
  - *.Mid.Avg    # - $3
  - *.Mid.Mean   # - $4
  output: ColorProperties.*
  conversion: ($1, $2, $3, $4)
```

In this example, the conversion results in an array containing the values of `[Max, Min, Mid.Avg, Mid.Mean]`. Comments in the YAML file (e.g., `# - $1`, `# - $2`) are optional but help clarify the connection between each field property and its role in the conversion formula.

## Available Operations

Conversions use simple math formulas similar to those learned in middle school. Basic operators such as addition (`+`) and multiplication (`*`) are included, each following specific rules of precedence (e.g., `*` is performed before `+`), which can be modified using parentheses.

For more complex calculations, functions like `sqrt` (which finds the square root of a number) are also available.

**Available arithmetic, comparison, and boolean operators grouped by precedence:**

| Operator | Description |
|----------|-------------|
| ^        | Exponentiation: $1 ^ 3 |

Since `Exponentiation` has the highest precedence, it's executed first unless parentheses override this order:

* `$1 * 2 ^ 3` is interpreted as `$1 * 8` because the `2 ^ 3` part is executed first, before multiplication.
* `($1 * 2) ^ 3` processes the multiplication before exponentiation.

| Operator | Description |
|----------|-------------|
| -        | Negation |
| !        | Logical not |

`Negation` and `Logical not` have high precedence, so they always stick to their immediate neighbor, except when exponentiation is involved:

* `-$1 * 2` negates $1 first, then multiplies.
* `-($1 * 2)` multiplies, then negates the result

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

`Addition` and `Subtraction` are considered weaker operations compared to those in the previous group:

* `$1 + 2 * 3` results in `$1 + 6`, as `2 * 3` is executed first due to the higher precedence of `Multiplication`.
* `($1 + 2) * 3` prioritizes the `addition` before `multiplication`.

| Operator | Description |
|----------|-------------|
| <        | Less than |
| >        | Greater than |
| <=       | Less than or equal to |
| >=       | Greater than or equal to |
| ==       | Equal to |
| !=       | Not equal to |

`Comparisons` operate on numeric, boolean, and string values. Since they have lower precedence than arithmetic operators, no parentheses are needed to compare results effectively:

* `$1 * 2 <= $2` is equivalent to `($1 * 2) <= $2`.

| Operator | Description |
|----------|-------------|
| \|\|     | Logical OR |
| &&       | Logical AND |

Logical operators are used to chain conditions:

* `$1 > 100 && $2 > 200`

## Data Types

Different serialization formats support various data types. For instance, JSON offers a few primitive types: string, number, boolean, and null, along with arrays of these primitive types.

In contrast, other serialization formats like Avro have a more complex type system, including integers with multiple bit field lengths and timestamps with different resolutions (milliseconds and microseconds).

When the mapper reads an input property, it converts it into an internal type. This conversion is necessary for holding the data in memory until it's written out into an output field, regardless of whether the input and output serialization formats are the same.

The internal representation utilizes the following data types:

| Type        | Description                               |
|-------------|-------------------------------------------|
| bool        | Logical true/false                        |
| integer     | Stored as 128-bit signed integer          |
| float       | Stored as 64-bit floating point number    |
| string      | A UTF-8 string                            |
| bytes       | Binary data, a string of 8-bit unsigned values |
| date time   | UTC or local time with nanosecond resolution |
| time        | Time of day with nanosecond resolution    |
| duration    | A duration with nanosecond resolution     |
| array       | An array of any types listed above        |
| map         | A vector of (key, value) pairs of any types listed above |

### Reading Input Record Fields

When an input record field is read, its underlying type is converted into one of these internal type variants. The internal representation is versatile enough to handle most input types with minimal or no conversion. However, some input types require conversion or are unsupported. Some examples:

* **Avro's `UUID` type** is converted to a `string`, as there is no specific `UUID` type in the internal representation.
* **Avro's `Decimal` type** is not supported by the mapper, thus fields of this type can't be included in mappings.
* **Avro's `Duration` type** varies; if the `months` field is set, it's unsupported. If only `days` and `milliseconds` are set, it's converted to the internal `duration` representation.

For some formats, surrogate types are used. For example, JSON doesn't have a datetime type and instead stores datetime values as strings formatted according to ISO8601. When the mapper reads such a field, the internal representation remains a string.

### Writing Output Record Fields

The mapper is designed to be flexible, converting internal types into output types to accommodate scenarios where data comes from a serialization format with a limited type system. Here are some examples of how conversions are handled:

* **Numeric Types**: These can be converted to other representations, even if it means losing precision. For example, a 64-bit floating-point number (`f64`) can be converted into a 32-bit integer (`i32`).
* **Strings to Numbers**: If the incoming record contains a string like "123" and the output field is a 32-bit integer, the mapper will convert and write out the value as a number.
* **Strings to Other Types**:
  * If the output field is a datetime, the mapper attempts to parse the string as an ISO8601 formatted datetime.
  * If the output field is binary/bytes, the mapper tries to deserialize the string from a base64 encoded string.
* **Boolean Values**:
  * Converted to 0/1 if the output field is numerical.
  * Converted to "true"/"false" if the output field is string.

### Explicit Type Conversions

While the automatic conversions generally operate as one might expect, based on common implementation practices, there are instances where the right conversion cannot be determined automatically, resulting in an `unsupported` error. To address these situations, several conversion functions are available to explicitly define how data should be transformed. These functions provide more control over how data is converted and ensure that data integrity is maintained even when automatic methods fall short.

**[FIXME - actually we don't have functions, need a list of what they usually want]**

### Using conversion formula with types

In mappings, an optional formula can specify how data from the input is processed before being written to the output field. If no formula is specified, the mapper simply copies the input field to the output using the internal type and conversion rules.

If a formula is specified, the data types available for use in formulas are limited to:

* Integers
* Floating-point numbers
* Strings
* Booleans
* Arrays of the above types
* Missing value

`Map` and `Byte` cannot participate in formulas in any way.

Types related to time (`date time`, `time`, and `duration`) are converted into integer values representing time in seconds. After formula evaluation, results are stored in the internal representation and not converted back; for example, a datetime converted to seconds remains an integer. If the value is to be used in date-time fields, an explicit conversion method must applied, for example, to convert the value into an ISO8601 string, which will then automatically converted to the date-time type of the output serialization format. **[FIXME as of today, no such functions are available]**

### Using irregular types

Special considerations apply to types like arrays and the `Missing Value`:

### Arrays

Arrays can be processed using aggregation functions to compute a single value from multiple elements. For example using the input record:

```json
{
    "Measurements": [2.34, 12.3, 32.4]
}
```

With the mapping:

```yaml
- inputs:
  - Measurements # - $1
  output: Measurement
  conversion: min($1)
```

This configuration selects the smallest value from the `Measurements` array for the output field.

It is also possible to use functions that result a new array: **[FIXME: this is not available today]**

```yaml
- inputs:
  - Measurements # - $1
  output: Measurements
  conversion: take($1, 10)  # taking at max 10 items
```

Arrays can also be created from multiple single values:

```yaml
- inputs:
  - minimum  # - - $1
  - maximum  # - - $2
  - average  # - - $3
  - mean     # - - $4
  output: stats
  conversion: ($1, $2, $3, $4)
```

This mapping creates an array containing the minimum, maximum, average, and mean.

### Missing Value

`Missing Value` is a special type used in scenarios such as:

* Handling missing fields in the input by providing an alternative value.
* Conditionally removing a field based on its presence.

Example mapping using `Missing Value`:

```json
{
    "Employment": {      
      "Position": "Analyst",
      "BaseSalary": 75000,
      "WorkingHours": "Regular"
    }
}
```

The input record contains `BaseSalary` field, but possibly that is optional. Let's say that if the field is missing, a value must be added from a contextualization dataset:

```json
{
  "Position": "Analyst",
  "BaseSalary": 70000,
  "WorkingHours": "Regular"
}
```

Now a mapping can be created that checks if the field is present in the input record. If so, the output receives that existing value, otherwise the value from the context dataset:

```yaml
- inputs:
  - BaseSalary  # - - - - - - - - - - $1
  - $context(position).BaseSalary #  - $2 
  output: BaseSalary
  conversion: if($1 == (), $2, $1)
```

The `conversion` uses the `if` function that has three parameters

* the first parameter is a condition. In the example it checks if the `BaseSalary` field of the input field (aliased as `$1`) is `Missing Value`.
* the second parameter is the result of the function in case the condition in the first parameter is true. In this example, this is the `BaseSalary` field of the contextualization dataset (aliased as `$2`)
* the third parameter is the value for the case the condition in the first parameter is false

## Available Functions

In the previous examples some functions already have been used:

* `min` to select a single item from an array
* `if` to select between values

There are numerous other functions available in different categories:

* string manipulation (for example, `uppercase()`)
* explicit conversion (for example, `ISO8601_datetime`)
* aggregation (for example, `avg()`)
* **[FIXME we actually don't have much methods, need a list about what to implement]**

## Enrich data from contextualization datasets

`Contextualization Datasets` function much like database tables integrated into the data mapping process. When processing incoming records, these datasets can be queried based on conditions that relate to the fields of the incoming record. This capability allows for dynamic interactions where data from these datasets can be used not only to supplement information in the output fields but also to participate in complex calculations during the mapping process.

Consider the following dataset with a few records, represented as JSON records:

```json
{
  "Position": "Analyst",
  "BaseSalary": 70000,
  "WorkingHours": "Regular"
},
{
  "Position": "Receptionist",
  "BaseSalary": 43000,
  "WorkingHours": "Regular"
}
```

This dataset can be accessed by the mapper through the Distributed State Store (DSS) using a key value based on a `condition` specified in the mapping configuration:

```yaml
enrich:
- dataset: position
  condition: $source.Position == $context.Position
```

This is how the dataset is used, when a new record is being processed:

* **Data Request**: The mapper sends a request to the DSS to retrieve the dataset stored under the key `position`.
* **Record Matching**: The mapper then queries this dataset to find the first record where the `Position` field in the dataset matches the `Position` field of the incoming record.

```yaml
- inputs:
  - $context(position).WorkingHours #  - $1 
  output: WorkingHours

- inputs:
  - BaseSalary   # - - - - - - - - - - - $1
  - $context(position).BaseSalary #  - - $2 
  output: BaseSalary
  conversion: if($1 == (), $2, $1)
```

In this example the `WorkingHours` field is added to the output record, while the `BaseSalary` is used conditionally: only when the incoming record doesn't contain `BaseSalary` field (or the value is `null` in case of nullable a field)

Note, that the request for the contextualization data does not happen with every incoming record: the mapper requests the dataset at the beginning and then it receives notifications from DSS about the changes, while it uses a cached version of the dataset.

It is possible to use multiple datasets:

```yaml
enrich:
- dataset: position
  condition: $source.Position == $context.Position

- dataset: permissions
  condition: $source.Position == $context.Position
```

and then use the references mixed:

```yaml
- inputs:
  - $context(position).WorkingHours  #    - - $1
  - $context(permission).NightShift  #    - - $2
```

The input references use the key of the dataset like `position` or `permission`. In case the key in DSS is inconvenient to use, an alias can be defined:

```yaml
enrich:
  - dataset: datasets.parag10.rule42 as position
    condition: $source.Position == $context.Position
```

Which configuration renames the dataset with key `datasets.parag10.rule42` to `position`

