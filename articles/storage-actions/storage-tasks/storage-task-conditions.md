---
title: Storage task conditions
titleSuffix: Azure Storage Actions Preview
description: Learn about the elements of a storage task condition.
services: storage
author: normesta

ms.service: azure-storage-actions
ms.topic: conceptual
ms.date: 10/07/2024
ms.author: normesta

---

# Storage task conditions

This article describes the format of a storage task and the properties, operators, and operations that you can use to compose each storage task condition. To learn how to define conditions and operations, see [Define storage task conditions and operations](storage-task-conditions-operations-edit.md).

> [!IMPORTANT]
> Azure Storage Actions is currently in PREVIEW and is available these [regions](../overview.md#supported-regions).
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

A storage task contains a set of conditions and operations in a JSON document. A _condition_ a collection of one or more _clauses_. An _operation_ is an action taken on each object that meets the conditions defined in the task. This article describes the format of conditions. To learn more about operations, see [Storage task operations](storage-task-operations.md).

```json
"action": {
    "if": {
        "condition": "<clause>",
        "operations": [
            {
                "name": "<operation name>",
                "onSuccess": "continue",
                "onFailure": "break"
            }
        ]
    }
}
```
## Condition format

Each clause clause in a condition contains a _property_, a _value_, and an _operator_. When the storage task runs, it uses the operator to compare a property with a value to determine whether a clause is met by the target object. In a clause, the operator always appears first followed by the property, and then the value. The clause defined in the following JSON allows operations only on Microsoft Word documents. The clause identifies all documents that end with the file extension `.docx`. Therefore, the operator is `endsWith`, the property is `Name`, the value is `.docx`. 

```json
"action": {
    "if": {
        "condition": "[[[endsWith(Name, '.docx')]]",
        "operations": [..]
    }
}
```

## Supported properties and operators in a clause

The following table shows the properties that you can use to compose each clause of a condition. A clause can contain string, boolean, numeric, as well as date and time properties.

| String                         | Date and time<sup>3</sup> | Numeric        | Boolean          |
|--------------------------------|---------------------------|----------------|------------------|
| AccessTier<sup>1</sup>         | AccessTierChangeTime      | Content-Length | Deleted          |
| Metadata.Value                 | Creation-Time             | TagCount       | IsCurrentVersion |
| Name                           | DeletedTime               |                |                  |
| BlobType<sup>2</sup>           | LastAccessTime            |                |                  |
| Container.Metadata.Value[Name] | Last-Modified             |                |                  |
| Container.Name                 |                           |                |                  |
| Container.Metadata.Value[Name] |                           |                |                  |
| Container.Name                 |                           |                |                  |
| Tags.Value[Name]               |                           |                |                  |
| VersionId                      |                           |                |                  |

<sup>1</sup>    Allowed values are `Hot`, `Cool`, or `Archive`.

<sup>2</sup>    Allowed values are `BlockBlob`, `PageBlob`, or `AppendBlob`

<sup>3</sup>    Can be set to a specific time or to a metadata value dynamically obtained from objects. See [Reference a value from object metadata](storage-task-conditions-operations-edit.md#reference-a-value-from-object-metadata).

## Supported operators in a clause

The following table shows the operators that you can use in a clause to evaluate the value of each type of property.

| String | Date and time | Numeric | Boolean |
|---|---|---|---|
| contains | equals |equals | equals |
| empty | greater | greater | not |
| equals | greaterOrEquals |greaterOrEquals ||
| endWith | less | less ||
| length | lessOrEquals | lessOrEquals ||
| startsWith | addToTime | ||
| Matches |  | ||


## Multiple clauses in a condition

A condition can contain multiple clauses separated by a comma along with either the string `and` or `or`. The string `and` targets objects that meet the criteria in all clauses in the condition while `or` targets objects that meet the criterion in any of the clauses in the condition. The following JSON include two clauses along with the `and` string.

```json
"action": {
    "if": {
        "condition": "[[[and(endsWith(Name, '.docx'), equals(Tags.Value[readyForLegalHold], 'Yes'))]]",
        "operations": [..]
    }
}
```

## See also

- [Define conditions and operations](storage-task-conditions-operations-edit.md)
