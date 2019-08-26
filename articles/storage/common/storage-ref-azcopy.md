---
title: azcopy | Microsoft Docs
description: This article provides reference information for the azcopy command.
author: normesta
ms.service: storage
ms.topic: reference
ms.date: 08/26/2019
ms.author: normesta
ms.subservice: common
ms.reviewer: zezha-msft
---

# azcopy

AzCopy is a command line tool that moves data into/out of Azure Storage.

## Synopsis

AzCopy 10.2.1.

Project URL: github.com/Azure/azure-storage-azcopy.
AzCopy is a command line tool that moves data into/out of Azure Storage.
To report issues or to learn more about the tool, go to github.com/Azure/azure-storage-azcopy.
The general format of the commands is: 'azcopy [command] [arguments] --[flag-name]=[flag-value]'.

## Options

|Option|Description|
|---|---|
|--cap-mbps uint32|Caps the transfer rate, in Mega bits per second. Moment-by-moment throughput may vary slightly from the cap. If zero or omitted, throughput is not capped.|
|-h, --help|Help for azcopy.|
|--output-type string|Format of the command's output, the choices include: text, json. (default "text").|

## See also

- [azcopy copy](azcopy_copy.md)
- [azcopy doc](azcopy_doc.md)
- [azcopy env](azcopy_env.md)
- [azcopy jobs](azcopy_jobs.md)
- [azcopy list](azcopy_list.md)
- [azcopy login](azcopy_login.md)
- [azcopy logout](azcopy_logout.md)
- [azcopy make](azcopy_make.md)
- [azcopy remove](azcopy_remove.md)
- [azcopy sync](azcopy_sync.md)
