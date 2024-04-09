---
title: azcopy
description: This article provides reference information for the azcopy command.
author: normesta
ms.service: azure-storage
ms.topic: reference
ms.date: 07/21/2022
ms.author: normesta
ms.subservice: storage-common-concepts
ms.reviewer: zezha-msft
---

# azcopy

AzCopy is a command-line tool that moves data into and out of Azure Storage. See the [Get started with AzCopy](storage-use-azcopy-v10.md) article to download AzCopy and learn about the ways that you can provide authorization credentials to the storage service.

## Synopsis

The general format of the commands is: `azcopy [command] [arguments] --[flag-name]=[flag-value]`.

To report issues or to learn more about the tool, see [https://github.com/Azure/azure-storage-azcopy](https://github.com/Azure/azure-storage-azcopy).

## Related conceptual articles

- [Get started with AzCopy](storage-use-azcopy-v10.md)
- [Tutorial: Migrate on-premises data to cloud storage with AzCopy](storage-use-azcopy-migrate-on-premises-data.md)
- [Transfer data with AzCopy and Blob storage](./storage-use-azcopy-v10.md#transfer-data)
- [Transfer data with AzCopy and file storage](storage-use-azcopy-files.md)

## Options

`--cap-mbps`    (float)    Caps the transfer rate, in megabits per second. Moment-by-moment throughput might vary slightly from the cap. If this option is set to zero, or it is omitted, the throughput isn't capped.

`-h`, `--help`    help for azcopy

`--output-type`    (string)    Format of the command's output. The choices include: text, json. The default value is 'text'. (default "text")

`--trusted-microsoft-suffixes`    (string)    Specifies additional domain suffixes where Microsoft Entra login tokens may be sent.  The default is '*.core.windows.net;*.core.chinacloudapi.cn;*.core.cloudapi.de;*.core.usgovcloudapi.net;*.storage.azure.net'. Any listed here are added to the default. For security, you should only put Microsoft Azure domains here. Separate multiple entries with semi-colons.

## See also

- [Get started with AzCopy](storage-use-azcopy-v10.md)
- [azcopy bench](storage-ref-azcopy-bench.md)
- [azcopy copy](storage-ref-azcopy-copy.md)
- [azcopy doc](storage-ref-azcopy-doc.md)
- [azcopy env](storage-ref-azcopy-env.md)
- [azcopy jobs](storage-ref-azcopy-jobs.md)
- [azcopy jobs clean](storage-ref-azcopy-jobs-clean.md)
- [azcopy jobs list](storage-ref-azcopy-jobs-list.md)
- [azcopy jobs remove](storage-ref-azcopy-jobs-remove.md)
- [azcopy jobs resume](storage-ref-azcopy-jobs-resume.md)
- [azcopy jobs show](storage-ref-azcopy-jobs-show.md)
- [azcopy list](storage-ref-azcopy-list.md)
- [azcopy login](storage-ref-azcopy-login.md)
- [azcopy login status](storage-ref-azcopy-login-status.md)
- [azcopy logout](storage-ref-azcopy-logout.md)
- [azcopy make](storage-ref-azcopy-make.md)
- [azcopy remove](storage-ref-azcopy-remove.md)
- [azcopy sync](storage-ref-azcopy-sync.md)
- [azcopy set-properties](storage-ref-azcopy-set-properties.md)
