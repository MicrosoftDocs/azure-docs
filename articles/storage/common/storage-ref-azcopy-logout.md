---
title: azcopy logout | Microsoft Docs
description: This article provides reference information for the azcopy logout command.
author: normesta
ms.service: storage
ms.topic: reference
ms.date: 08/26/2019
ms.author: normesta
ms.subservice: common
ms.reviewer: zezha-msft
---

# azcopy logout

Log out to terminate access to Azure Storage resources.

## Synopsis

Log out to terminate access to Azure Storage resources.
This command will remove all the cached login information for the current user.

```azcopy
azcopy logout [flags]
```

## Options

|Option|Description|
|--|--|
|-h, --help|help for logout|

## Options inherited from parent commands

|Option|Description|
|--|--|
|--cap-mbps uint32|caps the transfer rate, in Mega bits per second. Moment-by-moment throughput may vary slightly from the cap. If zero or omitted, throughput is not capped.|
|--output-type string|format of the command's output, the choices include: text, json. (default "text")|

## See also

- [azcopy](azcopy.md)
