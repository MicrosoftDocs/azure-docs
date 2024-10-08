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

This article describes the operations that you can use in a storage task. To learn how to define conditions and operations, see [Define storage task conditions and operations](storage-task-conditions-operations-edit.md).

> [!IMPORTANT]
> Azure Storage Actions is currently in PREVIEW and is available these [regions](../overview.md#supported-regions).
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Operation format

An operation is a blah in a JSON document. The following sample JSON shows a complete operation.

```json
{
Put Json here
}
```

An operation is a blah, as described in the following table:

| Parameter name | Parameter type | Notes |
|----------------|----------------|-------|
| `field name here`        | Type description | Explanation here.|

## Operation example

Here is an example.

```json
{
Put Json here
}
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

## Example 1

Example here.

```json
{
Put Json here
}
```

## Example 3

Example here.

```json
{
Put Json here
}
```

## See also

- [Define conditions and operations](storage-task-conditions-operations-edit.md)
