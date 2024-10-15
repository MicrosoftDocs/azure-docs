---
title: Storage task operations
titleSuffix: Azure Storage Actions Preview
description: Learn about the elements of a storage task operation.
services: storage
author: normesta
ms.service: azure-storage-actions
ms.topic: conceptual
ms.date: 10/07/2024
ms.author: normesta

---

# Storage task operations

An operation is an action that a storage task performs on each object that meets the defined set of conditions. This article describes the format of a storage task operation and the list of operations, operation parameters, and allowable values. To learn more about conditions, see [Storage task conditions](storage-task-conditions.md).

> [!IMPORTANT]
> Azure Storage Actions is currently in PREVIEW and is available these [regions](../overview.md#supported-regions).
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

A storage task contains a set of conditions and operations in a JSON document. The following image shows how a single condition and operation appear in a the document.  

> [!div class="mx-imgBorder"]
> ![Location of conditions and operations in a JSON snippet.](../media/storage-tasks/storage-task-operations/storage-task-operations-location-of-conditions-and-operations.png)

## Operation format 

An operation has a name along with zero, one, or multiple parameters. The following table describes each element that makes up the operation definition.

| Element | Description |
|---|--|
| `name` | The name of the operation. For a full list of names, see the [Supported operations](#supported-operations) section of this article. |
| `parameters` | A collection of one or more parameters. Each parameter has parameter name and a parameter value. For a list of parameters and parameter values, see the [Supported operations](#supported-operations) section of this article. |
| `onSuccess` | The action to take when the operation is successful for an object. `continue` is the only allowable value during the preview. |
| `onFailure` | The action to take when the operation fails for a object. `break` is the only allowable value during the preview. |

The following image shows where each element appears in the definition.

> [!div class="mx-imgBorder"]
> ![Format of an operation.](../media/storage-tasks/storage-task-operations/storage-task-operations-basic-structure.png)
 
The following operations applies applies a time-based immutability policy to the object. 

```json
{
    "operations": [
        {
            "name": "SetBlobImmutabilityPolicy",
            "parameters": {
                "untilDate": "2024-11-15T21:54:22",
                "mode": "locked"
            },
            "onSuccess": "continue",
            "onFailure": "break"
        }
    ]
}
```

### Multiple operations

Separate multiple operations by using a comma. The following image shows the position of two operations in list of operations.

> [!div class="mx-imgBorder"]
> ![Format of two operations.](../media/storage-tasks/storage-task-operations/storage-task-operations-mulitple-operations.png)

The following JSON shows two operations separate by a comma. 

```json
"operations": [
    {
        "name": "SetBlobImmutabilityPolicy",
        "parameters": {
            "untilDate": "2024-11-15T21:54:22",
            "mode": "locked"
        },
        "onSuccess": "continue",
        "onFailure": "break"
    },
    {
        "name": "SetBlobTags",
        "parameters": {
            "ImmutabilityUpdatedBy": "contosoStorageTask"
        },
        "onSuccess": "continue",
        "onFailure": "break"
    }
]
```

## Supported operations

The following table shows the supported operations, parameters, and parameter values:

| Operation                    | Parameters           | Values                                         |
|------------------------------|----------------------|------------------------------------------------|
| Set blob tier                | Tier                 | Hot \| Cold \| Archive |
| Set blob expiry              | None                 | Absolute \| Never expire \| Relative to creation time \| Relative to current time |
| Delete blob                  | None                 | None                                           |
| Undelete blob                | None                 | None                                           |
| Set blob tags                | TagSet               | A fixed collection of up to 10 key-value pairs |
| Set blob immutability policy | DateTime, string | DateTime of when policy ends, Locked \| Unlocked                                |
| Set blob legal hold          | Bool | True \| False                           |

## See also

- [Storage task conditions](storage-task-conditions.md)
- [Define conditions and operations](storage-task-conditions-operations-edit.md)
