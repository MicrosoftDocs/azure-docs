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

AzCopy is a command-line tool that moves data into and out of Azure Storage.

## Synopsis

The general format of the commands is: `azcopy [command] [arguments] --[flag-name]=[flag-value]`.

To report issues or to learn more about the tool, see [https://github.com/Azure/azure-storage-azcopy](https://github.com/Azure/azure-storage-azcopy).

## Options

|Option|Description|
|---|---|
|--cap-mbps uint32|Caps the transfer rate, in megabits per second. Moment-by-moment throughput might vary slightly from the cap. If this option is set to zero, or it is omitted, the throughput isn't capped.|
|-h, --help|Shows the help content for azcopy.|
|--output-type string|Format of the command's output. The choices include: text, json. The default value is "text".|

## See also

- [Get started with AzCopy](storage-use-azcopy-v10.md)
- [azcopy copy](storage-ref-azcopy-copy.md)
- [azcopy doc](storage-ref-azcopy-doc.md)
- [azcopy env](storage-ref-azcopy-env.md)
- [azcopy jobs](storage-ref-azcopy-jobs.md)
- [azcopy list](storage-ref-azcopy-list.md)
- [azcopy login](storage-ref-azcopy-login.md)
- [azcopy logout](storage-ref-azcopy-logout.md)
- [azcopy make](storage-ref-azcopy-make.md)
- [azcopy remove](storage-ref-azcopy-remove.md)
- [azcopy sync](storage-ref-azcopy-sync.md)
