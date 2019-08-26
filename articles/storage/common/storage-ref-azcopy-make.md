---
title: azcopy make | Microsoft Docs
description: This article provides reference information for the azcopy make command.
author: normesta
ms.service: storage
ms.topic: reference
ms.date: 08/26/2019
ms.author: normesta
ms.subservice: common
ms.reviewer: zezha-msft
---

# azcopy make

Create a container/share/filesystem

## Synopsis

Create a container/share/filesystem represented by the given resource URL.

```azcopy
azcopy make [resourceURL] [flags]
```

## Examples

```azcopy
azcopy make "https://[account-name].[blob,file,dfs].core.windows.net/[top-level-resource-name]"
```

## Options

|Option|Description|
|--|--|
|-h, --help|help for make|
|--quota-gb uint32|Specifies the maximum size of the share in gigabytes (GiB), 0 means you accept the file service's default quota.|

## Options inherited from parent commands

|Option|Description|
|--|--|
|--cap-mbps uint32|caps the transfer rate, in Mega bits per second. Moment-by-moment throughput may vary slightly from the cap. If zero or omitted, throughput is not capped.|
|--output-type string|format of the command's output, the choices include: text, json. (default "text")|

## See also

- [azcopy](storage-ref-azcopy.md)
