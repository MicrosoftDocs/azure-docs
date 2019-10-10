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

Displays information on all jobs.

## Synopsis

```azcopy
azcopy jobs list [flags]
```

## Options

|Option|Description|
|--|--|
|-h, --help|Show help content for the list command.|

## Options inherited from parent commands

|Option|Description|
|---|---|
|--cap-mbps uint32|Caps the transfer rate, in megabits per second. Moment-by-moment throughput might vary slightly from the cap. If this option is set to zero, or it is omitted, the throughput isn't capped.|
|--output-type string|Format of the command's output. The choices include: text, json. The default value is "text".|

## See also

- [azcopy jobs](storage-ref-azcopy-jobs.md)
