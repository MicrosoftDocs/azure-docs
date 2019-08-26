---
title: azcopy jobs show | Microsoft Docs
description: This article provides reference information for the azcopy jobs show command.
author: normesta
ms.service: storage
ms.topic: reference
ms.date: 08/26/2019
ms.author: normesta
ms.subservice: common
ms.reviewer: zezha-msft
---

# azcopy jobs show

Show detailed information for the given job ID

## Synopsis

Show detailed information for the given job ID: if only the job ID is supplied without a flag, then the progress summary of the job is returned.

If the with-status flag is set, then the list of transfers in the job with the given value will be shown.

```azcopy
azcopy jobs show [jobID] [flags]
```

## Options

|Option|Description|
|--|--|
|-h, --help|help for show|
|--with-status string|only list the transfers of job with this status, available values: Started, Success, Failed|

## Options inherited from parent commands

|Option|Description|
|--|--|
|--cap-mbps uint32|caps the transfer rate, in Mega bits per second. Moment-by-moment throughput may vary slightly from the cap. If zero or omitted, throughput is not capped.|
|--output-type string|format of the command's output, the choices include: text, json. (default "text")|

## See also

- [azcopy jobs](storage-ref-azcopy-jobs.md)
