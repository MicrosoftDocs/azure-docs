---
title: azcopy jobs resume | Microsoft Docs
description: This article provides reference information for the azcopy jobs resume command.
author: normesta
ms.service: storage
ms.topic: reference
ms.date: 10/16/2019
ms.author: normesta
ms.subservice: common
ms.reviewer: zezha-msft
---

# azcopy jobs resume

Resumes the existing job with the given job ID.

## Synopsis

```azcopy
azcopy jobs resume [jobID] [flags]
```

## Related conceptual articles

- [Get started with AzCopy](storage-use-azcopy-v10.md)
- [Transfer data with AzCopy and Blob storage](storage-use-azcopy-blobs.md)
- [Transfer data with AzCopy and file storage](storage-use-azcopy-files.md)
- [Configure, optimize, and troubleshoot AzCopy](storage-use-azcopy-configure.md)

## Options

|Option|Description|
|--|--|
|--destination-sas string|Destination SAS of the destination for given JobId.|
|--exclude string|Filter: Exclude these failed transfer(s) when resuming the job. Files should be separated by ';'.|
|-h, --help|Show help content for the resume command.|
|--include string|Filter: only include these failed transfer(s) when resuming the job. Files should be separated by ';'.|
|--source-sas string |source SAS of the source for given JobId.|

## Options inherited from parent commands

|Option|Description|
|---|---|
|--cap-mbps uint32|Caps the transfer rate, in megabits per second. Moment-by-moment throughput might vary slightly from the cap. If this option is set to zero, or it is omitted, the throughput isn't capped.|
|--output-type string|Format of the command's output. The choices include: text, json. The default value is "text".|
|--trusted-microsoft-suffixes string   |Specifies additional domain suffixes where Azure Active Directory login tokens may be sent.  The default is '*.core.windows.net;*.core.chinacloudapi.cn;*.core.cloudapi.de;*.core.usgovcloudapi.net'. Any listed here are added to the default. For security, you should only put Microsoft Azure domains here. Separate multiple entries with semi-colons.|

## See also

- [azcopy jobs](storage-ref-azcopy-jobs.md)
