---
title: Enrich data by using dataflows
description: Use contextualization datasets to enrich data in Azure IoT Operations dataflows.
author: PatAltimore
ms.author: patricka
ms.subservice: azure-data-flows
ms.topic: concept-article
ms.date: 08/13/2024

#CustomerIntent: As an operator, I want to understand how to create a dataflow to enrich data sent to endpoints.
---

# Enrich data by using dataflows

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

You can enrich data by using the *contextualization datasets* function. When incoming records are processed, these datasets can be queried based on conditions that relate to the fields of the incoming record. This capability allows for dynamic interactions. Data from these datasets can be used to supplement information in the output fields and participate in complex calculations during the mapping process.

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

<<<<<<< HEAD
The mapper accesses this dataset through the *distributed state store* (DSS) by using a key value based on a *condition* specified in the mapping configuration.
=======


The mapper accesses the reference dataset stored in Azure IoT Operations's [distributed state store (DSS)](../create-edge-apps/concept-about-state-store-protocol.md) using a key value based on a *condition* specified in the mapping configuration. Key names in the distributed state store correspond to a dataset in the dataflow configuration.
>>>>>>> e0872c6a6e915d4a5b604d04c53d1e53ee848ffa

```yaml
datasets:
- key: position
  inputs:
    - $source.Position # - $1
    - $context.Position # -$2
  expression: $1 == $2
```

When a new record is being processed, the mapper performs the following steps:

* **Data request:** The mapper sends a request to the DSS to retrieve the dataset stored under the key `Position`.
* **Record matching:** The mapper then queries this dataset to find the first record where the `Position` field in the dataset matches the `Position` field of the incoming record.

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

In this example, the `WorkingHours` field is added to the output record, while the `BaseSalary` is used conditionally only when the incoming record doesn't contain the `BaseSalary` field (or the value is `null` if it's a nullable field). The request for the contextualization data doesn't happen with every incoming record. The mapper requests the dataset and then it receives notifications from DSS about the changes, while it uses a cached version of the dataset.

It's possible to use multiple datasets:

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

Then use the references mixed:

```yaml
- inputs:
  - $context(position).WorkingHours  #    - - $1
  - $context(permission).NightShift  #    - - $2
```

The input references use the key of the dataset like `position` or `permission`. If the key in DSS is inconvenient to use, an alias can be defined:

```yaml
datasets:
  - key: datasets.parag10.rule42 as position
    inputs:
      - $source.Position  # - $1
      - $context.Position # - $2
    expression: $1 == $2
```

Which configuration renames the dataset with key `datasets.parag10.rule42` to `position`.
