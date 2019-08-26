---
title: azcopy list | Microsoft Docs
description: This article provides reference information for the azcopy list command.
author: normesta
ms.service: storage
ms.topic: reference
ms.date: 08/26/2019
ms.author: normesta
ms.subservice: common
ms.reviewer: zezha-msft
---

# azcopy list

List the entities in a given resource

## Synopsis

List the entities in a given resource. Only Blob containers are supported at the moment.

```azcopy
azcopy list [containerURL] [flags]
```

## Examples

```azcopy
azcopy list [containerURL]
```

## Options

|Option|Description|
|--|--|
|-h, --help|help for list|
|--machine-readable|Lists file sizes in bytes|
|--mega-units|Displays units in orders of 1000, not 1024|
|--running-tally|Counts the total number of files & their sizes|

## Options inherited from parent commands

|Option|Description|
|--|--|
|--cap-mbps uint32|caps the transfer rate, in Mega bits per second. Moment-by-moment throughput may vary slightly from the cap. If zero or omitted, throughput is not capped.|
|--output-type string|format of the command's output, the choices include: text, json. (default "text")|

## See also

- [azcopy](azcopy.md)
