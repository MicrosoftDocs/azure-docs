---
title: azcopy jobs list | Microsoft Docs
description: This article provides reference information for the azcopy jobs list command.
author: normesta
ms.service: storage
ms.topic: reference
ms.date: 08/26/2019
ms.author: normesta
ms.subservice: common
ms.reviewer: zezha-msft
---

# azcopy jobs list

Display information on all jobs

## Synopsis

Display information on all jobs.

```azcopy
azcopy jobs list [flags]
```

## Options

|Option|Description|
|--|--|
|-h, --help|help for list|

## Options inherited from parent commands

|Option|Description|
|--|--|
|--cap-mbps uint32|caps the transfer rate, in Mega bits per second. Moment-by-moment throughput may vary slightly from the cap. If zero or omitted, throughput is not capped.|
|--output-type string|format of the command's output, the choices include: text, json. (default "text")|

## See also

- [azcopy jobs](storage-ref-azcopy-jobs.md)
