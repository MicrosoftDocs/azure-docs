---
title: Properties, operators, and operations in storage task conditions
titleSuffix: Azure Storage Tasks
description: Learn about the elements of conditions and operations in a storage task.
services: storage
author: normesta

ms.service: azure-storage-actions
ms.custom: build-2023-metadata-update
ms.topic: conceptual
ms.date: 05/10/2023
ms.author: normesta

---

# Properties, operators, and operations in storage task conditions

This article describes the properties, operators, and operations that you can use to compose each Azure Storage Task condition. To learn how to define conditions and operations, see [Define storage task conditions and operations](storage-task-conditions-operations-edit.md).

> [!IMPORTANT]
> Azure Storage Tasks is currently in PREVIEW and is available these [regions](overview.md#supported-regions).
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Supported properties in a clause

The following table shows the properties that you can use to compose each clause of a condition. A clause can contain string, boolean, numeric, as well as date and time properties.

| String                         | Date and time<sup>3</sup>      | Numeric        | Boolean          |
|--------------------------------|----------------------|----------------|------------------|
| AccessTier<sup>1</sup>         | AccessTierChangeTime | Content-Length | IsCurrentVersion |
| Metadata.Value                 | Creation-Time        | TagCount       |                  |
| Name                           | LastAccessTime       |                |                  |
| BlobType<sup>2</sup>           | Last-Modified        |                |                  |
| Container.Metadata.Value[Name] |                      |                |                  |
| Container.Name                 |                      |                |                  |
| Container.Metadata.Value[Name] |                      |                |                  |
| Container.Name                 |                      |                |                  |
| Tags.Value[Name]               |                      |                |                  |

<sup>1</sup>    Allowed values are `Hot`, `Cool`, or `Archive`.

<sup>2</sup>    Allowed values are `BlockBlob`, `PageBlob`, or `AppendBlob`

<sup>3</sup>    Can be set to a specific time or to a metadata value dynamically obtained from objects. See [Reference a value from object metadata](storage-task-conditions-operations-edit.md#reference-a-value-from-object-metadata).

### Supported operators in a clause

The following table shows the operators that you can use in a clause to evaluate the value of each type of property.

| String | Date and time | Numeric | Boolean |
|---|---|---|---|
| contains | equals |equals | equals |
| empty | greater | greater | not |
| equals | greaterOrEquals |greaterOrEquals ||
| endWith | less | less ||
| length | lessOrEquals | lessOrEquals ||
| startsWith | addToTime | ||

## Supported operations

The following table shows the supported operations, parameters, and parameter values:

| Operation | Parameters | Values |
|---|---|---|
| Set Blob Tier | Tier | Hot \| Cold \| Archive |
| Delete Blob | None | None |
| Undelete Blob | None | None |
| Set Blob Tags | TagSet | A fixed collection of up to 10 key-value pairs |
| Set Blob Immutability Policy | Need parameter names | Need value names|
| Set Blob Legal Hold | Need parameter names | Need parameter names |

## See also

- [Define conditions and operations](storage-task-conditions-operations-edit.md)
