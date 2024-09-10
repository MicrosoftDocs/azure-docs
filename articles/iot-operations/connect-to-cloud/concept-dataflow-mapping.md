---
title: Map data by using dataflows
description: Learn about the dataflow mapping language for transforming data in Azure IoT Operations.
author: PatAltimore
ms.author: patricka
ms.subservice: azure-data-flows
ms.topic: concept-article
ms.date: 08/03/2024

#CustomerIntent: As an operator, I want to understand how to use the dataflow mapping language to transform data.
---

# Map data by using dataflows

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

Use the dataflow mapping language to transform data in Azure IoT Operations. The syntax is a simple, yet powerful, way to define mappings that transform data from one format to another. This article provides an overview of the dataflow mapping language and key concepts.

Mapping allows you to transform data from one format to another. Consider the following input record:

```json
{
  "Name": "Grace Owens",
  "Place of birth": "London, TX",
  "Birth Date": "19840202",
  "Start Date": "20180812",
  "Position": "Analyst",
  "Office": "Kent, WA"
}
```

Compare it with the output record:

```json
{
  "Employee": {
    "Name": "Grace Owens",
    "Date of Birth": "19840202"
  },
  "Employment": {
    "Start Date": "20180812",
    "Position": "Analyst, Kent, WA",
    "Base Salary": 78000
  }
}
```

In the output record, the following changes are made to the input record data:

* **Fields renamed**: The `Birth Date` field is now `Date of Birth`.
* **Fields restructured**: Both `Name` and `Date of Birth` are grouped under the new `Employee` category.
* **Field deleted**: The `Place of birth` field is removed because it isn't present in the output.
* **Field added**: The `Base Salary` field is a new field in the `Employment` category.
* **Field values changed or merged**: The `Position` field in the output combines the `Position` and `Office` fields from the input.

The transformations are achieved through *mapping*, which typically involves:

* **Input definition**: Identifying the fields in the input records that are used.
* **Output definition**: Specifying where and how the input fields are organized in the output records.
* **Conversion (optional)**: Modifying the input fields to fit into the output fields. Conversion is required when multiple input fields are combined into a single output field.

The following mapping is an example:

```yaml
- inputs:
  - BirthDate
  output: Employee.DateOfBirth

- inputs:
  - Position # - - - $1
  - Office # - - - - $2
  output: Employment.Position
  expression: $1 + ", " + $2

- inputs:
  - $context(position).BaseSalary
  output: Employment.BaseSalary
```

The example maps:

* **One-to-one mapping**: `BirthDate` is directly mapped to `Employee.DateOfBirth` without conversion.
* **Many-to-one mapping**: Combines `Position` and `Office` into a single `Employment.Position` field. The conversion formula (`$1 + ", " + $2`) merges these fields into a formatted string.
* **Contextual data**: `BaseSalary` is added from a contextual dataset named `position`.

## Field references

Field references show how to specify paths in the input and output by using dot notation like `Employee.DateOfBirth` or accessing data from a contextual dataset via `$context(position)`.

## Contextualization dataset selectors

These selectors allow mappings to integrate extra data from external databases, which are referred to as *contextualization datasets*.

## Record filtering

Record filtering involves setting conditions to select which records should be processed or dropped.

## Dot notation

Dot notation is widely used in computer science to reference fields, even recursively. In programming, field names typically consist of letters and numbers. A standard dot-notation sample might look like this example:

```yaml
- inputs:
  - Person.Address.Street.Number
```

In a dataflow, a path described by dot notation might include strings and some special characters without needing escaping:

```yaml
- inputs:
  - Person.Date of Birth
```

In other cases, escaping is necessary:

```yaml
- inputs:
  - nsu=http://opcfoundation.org/UA/Plc/Applications;s=RandomSignedInt32
```

The previous example, among other special characters, contains dots within the field name. Without escaping, the field name would serve as a separator in the dot notation itself.

While a dataflow parses a path, it treats only two characters as special:

* Dots (`.`) act as field separators.
* Single quotation marks, when placed at the beginning or the end of a segment, start an escaped section where dots aren't treated as field separators.

Any other characters are treated as part of the field name. This flexibility is useful in formats like JSON, where field names can be arbitrary strings.

The path definition must also adhere to the rules of YAML. When a character with special meaning is included in the path, proper quoting is required in the configuration. Consult the YAML documentation for precise rules. Here are some examples that demonstrate the need for careful formatting:

```yaml
- inputs:
  - ':Person:.:name:'   # ':' cannot be used as the first character without single quotation marks
  - '100 celsius.hot'   # numbers followed by text would not be interpreted as a string without single quotation marks
```

## Escaping

The primary function of escaping in a dot-notated path is to accommodate the use of dots that are part of field names rather than separators:

```yaml
- inputs:
  - 'Payload."Tag.10".Value'
```

In the previous example, the path consists of three segments: `Payload`, `Tag.10`, and `Value`. The outer single quotation marks (`'`) are necessary because of YAML syntax rules, which allow the inclusion of double quotation marks within the string.

### Escaping rules in dot notation

* **Escape each segment separately:** If multiple segments contain dots, those segments must be enclosed in double quotation marks. Other segments can also be quoted, but it doesn't affect the path interpretation:
  
    ```yaml
    - inputs:
      - 'Payload."Tag.10".Measurements."Vibration.$12".Value'
    ```
    
* **Proper use of double quotation marks:** Double quotation marks must open and close an escaped segment. Any quotation marks in the middle of the segment are considered part of the field name:
  
    ```yaml
    - inputs:
      - 'Payload.He said: "Hello", and waved'
    ```

    This example defines two fields in `dataDestination`: `Payload` and `He said: "Hello", and waved`. When a dot appears under these circumstances, it continues to serve as a separator:
    
    ```yaml
    - inputs:
      - 'Payload.He said: "No. It's done"'
    ```
    
    In this case, the path is split into the segments `Payload`, `He said: "No`, and `It's done"` (starting with a space).
    
### Segmentation algorithm

* If the first character of a segment is a quotation mark, the parser searches for the next quotation mark. The string enclosed between these quotation marks is considered a single segment.
* If the segment doesn't start with a quotation mark, the parser identifies segments by searching for the next dot or the end of the path.

## Wildcard

In many scenarios, the output record closely resembles the input record, with only minor modifications required. When you deal with records that contain numerous fields, manually specifying mappings for each field can become tedious. Wildcards simplify this process by allowing for generalized mappings that can automatically apply to multiple fields.

Let's consider a basic scenario to understand the use of asterisks in mappings:

```yaml
- inputs:
  - *
  output: *
```

Here's how the asterisk (`*`) operates in this context:

* **Pattern matching**: The asterisk can match a single segment or multiple segments of a path. It serves as a placeholder for any segments in the path.
* **Field matching**: During the mapping process, the algorithm evaluates each field in the input record against the pattern specified in the `inputs`. The asterisk in the previous example matches all possible paths, effectively fitting every individual field in the input.
* **Captured segment**: The portion of the path that the asterisk matches is referred to as the `captured segment`.
* **Output mapping**: In the output configuration, the `captured segment` is placed where the asterisk appears. This means that the structure of the input is preserved in the output, with the `captured segment` filling the placeholder provided by the asterisk.

This configuration demonstrates the most generic form of mapping, where every field in the input is directly mapped to a corresponding field in the output without modification.

Another example illustrates how wildcards can be used to match subsections and move them together. This example effectively flattens nested structures within a JSON object.

Original JSON:

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

Mapping configuration that uses wildcards:

```yaml
- inputs:
  - ColorProperties.*
  output: *

- inputs:
  - TextureProperties.*
  output: *
```

Resulting JSON:

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

### Wildcard placement

When you place a wildcard, you must follow these rules:

* **Single asterisk per dataDestination:** Only one asterisk (`*`) is allowed within a single path.
* **Full segment matching:** The asterisk must always match an entire segment of the path. It can't be used to match only a part of a segment, such as `path1.partial*.path3`.
* **Positioning:** The asterisk can be positioned in various parts of `dataDestination`:
  * **At the beginning:** `*.path2.path3` - Here, the asterisk matches any segment that leads up to `path2.path3`.
  * **In the middle:** `path1.*.path3` - In this configuration, the asterisk matches any segment between `path1` and `path3`.
  * **At the end:** `path1.path2.*` - The asterisk at the end matches any segment that follows after `path1.path2`.

### Multi-input wildcards

Original JSON:

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

Mapping configuration that uses wildcards:

```yaml
- inputs:
  - *.Max   # - $1
  - *.Min   # - $2
  output: ColorProperties.*
  conversion: ($1 + $2) / 2
```

Resulting JSON:

```json
{
  "ColorProperties" : {
    "Saturation": 0.54,
    "Brightness": 0.85,
    "Opacity": 0.89 
  }    
}
```

If you use multi-input wildcards, the asterisk (`*`) must consistently represent the same `Captured Segment` across every input. For example, when `*` captures `Saturation` in the pattern `*.Max`, the mapping algorithm expects the corresponding `Saturation.Min` to match with the pattern `*.Min`. Here, `*` is substituted by the `Captured Segment` from the first input, guiding the matching for subsequent inputs.

Consider this detailed example:

Original JSON:

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

Initial mapping configuration that uses wildcards:

```yaml
- inputs:
  - *.Max    # - $1
  - *.Min    # - $2
  - *.Avg    # - $3
  - *.Mean   # - $4
  output: ColorProperties.*
  expression: ($1, $2, $3, $4)
```

This initial mapping tries to build an array (for example, for `Opacity`: `[0.88, 0.91, 0.89, 0.89]`). This configuration fails because:

* The first input `*.Max` captures a segment like `Saturation`.
* The mapping expects the subsequent inputs to be present at the same level:
  * `Saturation.Max`
  * `Saturation.Min`
  * `Saturation.Avg`
  * `Saturation.Mean`

Because `Avg` and `Mean` are nested within `Mid`, the asterisk in the initial mapping doesn't correctly capture these paths.

Corrected mapping configuration:

```yaml
- inputs:
  - *.Max        # - $1
  - *.Min        # - $2
  - *.Mid.Avg    # - $3
  - *.Mid.Mean   # - $4
  output: ColorProperties.*
  expression: ($1, $2, $3, $4)
```

This revised mapping accurately captures the necessary fields. It correctly specifies the paths to include the nested `Mid` object, which ensures that the asterisks work effectively across different levels of the JSON structure.

### Second rule vs. specialization

When you use the previous example from multi-input wildcards, consider the following mappings that generate two derived values for each property:

```yaml
- inputs:
  - *.Max   # - $1
  - *.Min   # - $2
  output: ColorProperties.*.Avg
  expression: ($1 + $2) / 2

- inputs:
  - *.Max   # - $1
  - *.Min   # - $2
  output: ColorProperties.*.Diff
  expression: abs($1 - $2)
```

This mapping is intended to create two separate calculations (`Avg` and `Diff`) for each property under `ColorProperties`. This example shows the result:

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

Here, the second mapping definition on the same inputs acts as a *second rule* for mapping.

Now, consider a scenario where a specific field needs a different calculation:

```yaml
- inputs:
  - *.Max   # - $1
  - *.Min   # - $2
  output: ColorProperties.*
  expression: ($1 + $2) / 2

- inputs:
  - Opacity.Max   # - $1
  - Opacity.Min   # - $2
  output: ColorProperties.OpacityAdjusted
  expression: ($1 + $2 + 1.32) / 2  
```

In this case, the `Opacity` field has a unique calculation. Two options to handle this overlapping scenario are:

- Include both mappings for `Opacity`. Because the output fields are different in this example, they wouldn't override each other.
- Use the more specific rule for `Opacity` and remove the more generic one.

Consider a special case for the same fields to help decide the right action:

```yaml
- inputs:
  - *.Max   # - $1
  - *.Min   # - $2
  output: ColorProperties.*
  expression: ($1 + $2) / 2

- inputs:
  - Opacity.Max
  - Opacity.Min
  output:   
```

An empty `output` field in the second definition implies not writing the fields in the output record (effectively removing `Opacity`). This setup is more of a `Specialization` than a `Second Rule`.

Resolution of overlapping mappings by dataflows:

* The evaluation progresses from the top rule in the mapping definition.
* If a new mapping resolves to the same fields as a previous rule, the following conditions apply:
  * A `Rank` is calculated for each resolved input based on the number of segments the wildcard captures. For instance, if the `Captured Segments` are `Properties.Opacity`, the `Rank` is 2. If it's only `Opacity`, the `Rank` is 1. A mapping without wildcards has a `Rank` of 0.
  * If the `Rank` of the latter rule is equal to or higher than the previous rule, a dataflow treats it as a `Second Rule`.
  * Otherwise, the dataflow treats the configuration as a `Specialization`.

For example, the mapping that directs `Opacity.Max` and `Opacity.Min` to an empty output has a `Rank` of 0. Because the second rule has a lower `Rank` than the previous one, it's considered a specialization and overrides the previous rule, which would calculate a value for `Opacity`.

### Wildcards in contextualization datasets

Now, let's see how contextualization datasets can be used with wildcards through an example. Consider a dataset named `position` that contains the following record:

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

This mapping copies `BaseSalary` from the context dataset directly into the `Employment` section of the output record. If you want to automate the process and include all fields from the `position` dataset into the `Employment` section, you can use wildcards:

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

