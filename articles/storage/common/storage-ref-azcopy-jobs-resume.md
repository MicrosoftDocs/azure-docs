---
title: azcopy jobs resume | Microsoft Docs
description: This article provides reference information for the azcopy jobs resume command.
author: normesta
ms.service: storage
ms.topic: reference
ms.date: 08/26/2019
ms.author: normesta
ms.subservice: common
ms.reviewer: zezha-msft
---

# azcopy jobs resume

Resume the existing job with the given job ID

## Synopsis

Resume the existing job with the given job ID.

```azcopy
azcopy jobs resume [jobID] [flags]
```

## Options

|Option|Description|
|--|--|
|--destination-sas string|destination sas of the destination for given JobId|
|--exclude string|Filter: exclude these failed transfer(s) when resuming the job. Files should be separated by ';'.|
|-h, --help|help for resume|
|--include string|Filter: only include these failed transfer(s) when resuming the job. Files should be separated by ';'.|
|--source-sas string |source sas of the source for given JobId|

## Options inherited from parent commands

|Option|Description|
|--|--|
|--cap-mbps uint32|caps the transfer rate, in Mega bits per second. Moment-by-moment throughput may vary slightly from the cap. If zero or omitted, throughput is not capped.|
|--output-type string|format of the command's output, the choices include: text, json. (default "text")|

## See also

- [azcopy jobs](storage-ref-azcopy-jobs.md)
