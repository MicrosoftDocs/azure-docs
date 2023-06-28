---
title: Storage task conditions & operations
titleSuffix: Azure Storage
description: Description of Azure Storage Tasks conditions goes here.
services: storage
author: normesta

ms.service: storage-tasks
ms.topic: conceptual
ms.date: 05/10/2023
ms.author: normesta

---

# Storage task conditions and operations

Put something here.

> [!IMPORTANT]
> Azure Storage Tasks is currently in PREVIEW and is available in the following regions: \<List regions here\>.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
> To enroll, see \<sign-up form link here\>.

To learn how to add and edit Storage Tasks conditions, see [Define conditions](storage-task-conditions-operations-edit.md).

## Conditions

Any conceptual information about conditions goes here.
Describe constraints such as the number of conditions allowed.

A condition contains a property, a value, and an operator that is used to compare the property with the value.

### Blob properties

The following table shows the available properties, the data type of each property, and any constraints on allowed values.

#### Boolean properties

These property values must be either `True` or `False`.

- IsCurrentVersion

You can evaluate property these values by using the `equals` or the `not` operator.

#### Date time properties

These property values must be a valid DateTime.

- AccessTierChangeTime
- Creation-Time
- LastAccessTime
- Last-Modified

You can evaluate property these values by using the following operators: `equals`, `greater`, `greaterOrEquals`, `less`, `lessOrEquals`, and `addToTime`. 

#### Numeric properties

These property values must be a valid number.

- Content-Length
- TagCount

You can evaluate property these values by using the following operators: `equals`, `greater`, `greaterOrEquals`, `less`, and `lessOrEquals`.

#### String properties

These property values must be a string.

- AccessTier (either `Hot`, `Cool`, or `Archive`)
- Metadata.Value
- Name
- BlobType (either `BlockBlob`, `PageBlob`, or `AppendBlob`
- Container.Metadata.Value[Name]
- Container.Name
- Tags.Value[Name]

You can evaluate these property values by using the following operators: `contains`, `empty`, `equals`, `endsWith`, `length`, and `startsWith`.

#### String matching in property values

Explain matching and wild card patterns.

## Operations

Any conceptual information about operations goes here. Includes constraints, limits on the number of conditions etc.

### Supported operations

Supported operations, operation parameters, and parameter values appear in the table below:

| Operation | Parameters | Values |
|---|---|---|
| Set Blob Tier | Tier | Hot \| Cold \| Archive |
| Delete Blob | None | None |
| Undelete Blob | None | None |
| Set Blob Tags | TagSet | A fixed collection of up to 10 key-value pairs |
| Set Blob Immutability Policy | Need parameter names | Need value names|
| Set Blob Legal Hold | Need parameter names | Need parameter names |

### Ordering operations

- The order of operations and what order means to users.

- Include information here about onSucceed and onFailure if those capabilities make into the public preview.



## Preview

(Use an include file to share this section with the assignment article)

Describe the experience and the benefit.

It can be used to try things out. Then, you can debug issues. For example, tags value and count apply only to accounts that do not have a hierarchical namespace enabled.

## See also

- [Define conditions and operations](storage-task-conditions-operations-edit.md)
- [Storage task assignments](storage-task-assignment.md)
