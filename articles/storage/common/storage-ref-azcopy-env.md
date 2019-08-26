---
title: azcopy env | Microsoft Docs
description: This article provides reference information for the azcopy env command.
author: normesta
ms.service: storage
ms.topic: reference
ms.date: 08/26/2019
ms.author: normesta
ms.subservice: common
ms.reviewer: zezha-msft
---

# azcopy env

Shows the environment variables that can configure AzCopy's behavior

## Synopsis

Shows the environment variables that can configure AzCopy's behavior.

(NOTICE FOR SETTING ENVIRONMENT VARIABLES: Bear in mind that setting an environment variable from the command line will be readable in your command line history. For variables that contain credentials, consider clearing these entries from your history or using a small script of sorts to prompt for and set these variables.)

```azcopy
azcopy env [flags]
```

## Options

|Option|Description|
|--|--|
|-h, --help|help for env|
|--show-sensitive|Show sensitive/secret environment variables|

## Options inherited from parent commands

|Option|Description|
|--|--|
|--cap-mbps uint32|caps the transfer rate, in Mega bits per second. Moment-by-moment throughput may vary slightly from the cap. If zero or omitted, throughput is not capped.|
|--output-type string|format of the command's output, the choices include: text, json. (default "text")|

## See also

- [azcopy](storage-ref-azcopy.md)
