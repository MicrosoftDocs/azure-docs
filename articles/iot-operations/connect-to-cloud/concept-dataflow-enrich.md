---
title: Enrich data by using dataflows
description: Use contextualization datasets to enrich data in Azure IoT Operations dataflows.
author: PatAltimore
ms.author: patricka
ms.subservice: azure-data-flows
ms.topic: concept-article
ms.date: 11/13/2024

#CustomerIntent: As an operator, I want to understand how to create a dataflow to enrich data sent to endpoints.
ms.service: azure-iot-operations
---

# Enrich data by using dataflows

[!INCLUDE [kubernetes-management-preview-note](../includes/kubernetes-management-preview-note.md)]

You can enrich data by using the *contextualization datasets* function. When incoming records are processed, you can query these datasets based on conditions that relate to the fields of the incoming record. This capability allows for dynamic interactions. Data from these datasets can be used to supplement information in the output fields and participate in complex calculations during the mapping process.

To load sample data into the state store, use the [state store CLI](https://github.com/Azure-Samples/explore-iot-operations/tree/main/tools/statestore-cli).

For example, consider the following dataset with a few records, represented as JSON records:

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

The mapper accesses the reference dataset stored in the Azure IoT Operations [state store](../create-edge-apps/concept-about-state-store-protocol.md) by using a key value based on a *condition* specified in the mapping configuration. Key names in the state store correspond to a dataset in the dataflow configuration.

# [Bicep](#tab/bicep)

```bicep
datasets: [
  {
    key: 'position',
    inputs: [
      '$source.Position' //  - $1
      '$context.Position' // - $2
    ],
    expression: '$1 == $2'
  }
]
```

# [Kubernetes (preview)](#tab/kubernetes)

```yaml
datasets:
- key: position
  inputs:
    - $source.Position #  - $1
    - $context.Position # - $2
  expression: $1 == $2
```

---

When a new record is being processed, the mapper performs the following steps:

* **Data request:** The mapper sends a request to the state store to retrieve the dataset stored under the key `Position`.
* **Record matching:** The mapper then queries this dataset to find the first record where the `Position` field in the dataset matches the `Position` field of the incoming record.

# [Bicep](#tab/bicep)

```bicep
{
  inputs: [
    '$context(position).WorkingHours' //  - $1 
  ]
  output: 'WorkingHours'
}
{
  inputs: [
    'BaseSalary' // - - - - - - - - - - - - $1
    '$context(position).BaseSalary' //  - - $2
  ]
  output: 'BaseSalary'
  expression: 'if($1 == (), $2, $1)'
}
```

# [Kubernetes (preview)](#tab/kubernetes)

```yaml
- inputs:
  - $context(position).WorkingHours #  - $1 
  output: WorkingHours

- inputs:
  - BaseSalary   # - - - - - - - - - - - $1
  - $context(position).BaseSalary #  - - $2 
  output: BaseSalary
  expression: if($1 == (), $2, $1)
```

---

In this example, the `WorkingHours` field is added to the output record, while the `BaseSalary` is used conditionally only when the incoming record doesn't contain the `BaseSalary` field (or the value is `null` if it's a nullable field). The request for the contextualization data doesn't happen with every incoming record. The mapper requests the dataset and then it receives notifications from the state store about the changes, while it uses a cached version of the dataset.

It's possible to use multiple datasets:

# [Bicep](#tab/bicep)

```bicep
datasets: [
  {
    key: 'position'
    inputs: [
      '$source.Position'  // - $1
      '$context.Position' // - $2
    ],
    expression: '$1 == $2'
  }
  {
    key: 'permissions'
    inputs: [
      '$source.Position'  // - $1
      '$context.Position' // - $2
    ],
    expression: '$1 == $2'
  }
]
```

# [Kubernetes (preview)](#tab/kubernetes)

```yaml
datasets:
- key: position
  inputs:
    - $source.Position  # - $1
    - $context.Position # - $2
  expression: $1 == $2

- key: permissions
  inputs:
    - $source.Position  # - $1
    - $context.Position # - $2
  expression: $1 == $2
```

---

Then use the references mixed:

# [Bicep](#tab/bicep)

```bicep
inputs: [
  '$context(position).WorkingHours'  // - $1
  '$context(permissions).NightShift' // - $2
]
```

# [Kubernetes (preview)](#tab/kubernetes)

```yaml
- inputs:
  - $context(position).WorkingHours  #    - - $1
  - $context(permission).NightShift  #    - - $2
```

---

The input references use the key of the dataset like `position` or `permission`. If the key in state store is inconvenient to use, you can define an alias:

# [Bicep](#tab/bicep)

```bicep
datasets: [
  {
    key: 'datasets.parag10.rule42 as position'
    inputs: [
      '$source.Position'  // - $1
      '$context.Position' // - $2
    ],
    expression: '$1 == $2'
  }
]
```

# [Kubernetes (preview)](#tab/kubernetes)

```yaml
datasets:
  - key: datasets.parag10.rule42 as position
    inputs:
      - $source.Position  # - $1
      - $context.Position # - $2
    expression: $1 == $2
```

---

The configuration renames the dataset with the key `datasets.parag10.rule42` to `position`.
