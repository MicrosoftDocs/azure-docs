---
title: Map data by using data flows
description: Learn about the data flow mapping language for transforming data in Azure IoT Operations.
author: sethmanheim
ms.author: sethm
ms.subservice: azure-data-flows
ms.topic: concept-article
ms.date: 03/26/2026
ai-usage: ai-assisted

#CustomerIntent: As an operator, I want to understand how to use the data flow mapping language to transform data.
ms.service: azure-iot-operations
---

# Map data by using data flows

[!INCLUDE [kubernetes-management-preview-note](../includes/kubernetes-management-preview-note.md)]

> [!TIP]
> Data flow graphs offer an expanded mapping language with additional functions, composable transforms, and features like conditional routing and time-based aggregation. For new projects that use MQTT, Kafka, or OpenTelemetry endpoints, see [Transform data with map in data flow graphs](howto-dataflow-graphs-map.md).

Use the data flow mapping language to transform data in Azure IoT Operations. The syntax is a simple, yet powerful, way to define mappings that transform data from one format to another. This article provides an overview of the data flow mapping language and key concepts.

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
* **Conversion (optional)**: Modifying the input fields to fit into the output fields. `expression` is required when multiple input fields are combined into a single output field.

The following mapping is an example:

# [Bicep](#tab/bicep)

```bicep
{
  inputs: [
    'BirthDate'
  ]
  output: 'Employee.DateOfBirth'
}
{
  inputs: [
    'Position'  // - - - - $1
    'Office'    // - - - - $2
  ]
  output: 'Employment.Position'
  expression: '$1 + ", " + $2'
}
{
  inputs: [
    '$context(position).BaseSalary'
  ]
  output: 'Employment.BaseSalary'
}
```

# [Kubernetes (preview)](#tab/kubernetes)

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

---

The example maps:

* **One-to-one mapping**: `BirthDate` is directly mapped to `Employee.DateOfBirth` without conversion.
* **Many-to-one mapping**: Combines `Position` and `Office` into a single `Employment.Position` field. The conversion formula (`$1 + ", " + $2`) merges these fields into a formatted string.
* **Contextual data**: `BaseSalary` is added from a contextual dataset named `position`.

## Field references

Field references show how to specify paths in the input and output by using dot notation like `Employee.DateOfBirth` or accessing data from a contextual dataset via `$context(position)`.

### Metadata properties

When you use MQTT or Kafka as a source or destination, you can access metadata properties like topics, user properties, and headers in your mappings. For full syntax details and examples, see [Metadata fields](concept-dataflow-graphs-expressions.md#metadata-fields) in the expressions reference.

## Contextualization dataset selectors

These selectors allow mappings to integrate extra data from external databases, which are referred to as *contextualization datasets*. For details, see [Contextualization datasets](concept-dataflow-graphs-expressions.md#contextualization-datasets) in the expressions reference and [Enrich data by using data flows](concept-dataflow-enrich.md).

## Record filtering

Record filtering involves setting conditions to select which records should be processed or dropped.

## Dot notation

Data flow field paths use dot notation to reference nested fields, with escaping for special characters. For full syntax rules and examples, see [Dot notation and escaping](concept-dataflow-graphs-expressions.md#dot-notation-and-escaping) in the expressions reference.

## Escaping

For rules on escaping dots and special characters in field paths, see [Dot notation and escaping](concept-dataflow-graphs-expressions.md#dot-notation-and-escaping) in the expressions reference.

## Wildcards

Wildcards use the asterisk (`*`) to match multiple fields at once, which simplifies mappings when the output closely resembles the input. For full wildcard syntax, placement rules, multi-input wildcards, and specialization behavior, see [Wildcards](concept-dataflow-graphs-expressions.md#wildcards) in the expressions reference.

## Last known value

You can track the last known value of a property. Suffix the input field with `? $last` to capture the last known value of the field. When a property is missing a value in a subsequent input payload, the last known value is mapped to the output payload.

For example, consider the following mapping:

# [Bicep](#tab/bicep)

```bicep
inputs: [
  'Temperature ? $last'
]
output: 'Thermostat.Temperature'
```

# [Kubernetes (preview)](#tab/kubernetes)

```yaml
- inputs:
  - Temperature ? $last
  output: Thermostat.Temperature
```

---

In this example, the last known value of `Temperature` is tracked. If a subsequent input payload doesn't contain a `Temperature` value, the last known value is used in the output.

## Related content

- [Expressions reference](concept-dataflow-graphs-expressions.md) - Operators, functions, data types, and type conversion rules for all data flow transforms.
- [Filter data in a data flow](howto-dataflow-filter.md)
- [Enrich data by using data flows](concept-dataflow-enrich.md)
- [Create a data flow](howto-create-dataflow.md)
