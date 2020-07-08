---
title: azcopy jobs remove | Microsoft Docs
description: This article provides reference information for the azcopy jobs remove command.
author: normesta
ms.service: storage
ms.topic: reference
ms.date: 10/16/2019
ms.author: normesta
ms.subservice: common
ms.reviewer: zezha-msft
---

# azcopy jobs remove

Remove all files associated with the given job ID.

> [!NOTE] 
> You can customize the location where log and plan files are saved. See the [azcopy env](storage-ref-azcopy-env.md) command to learn more.

```
azcopy jobs remove [jobID] [flags]
```

## Related conceptual articles

- [Get started with AzCopy](storage-use-azcopy-v10.md)
- [Transfer data with AzCopy and Blob storage](storage-use-azcopy-blobs.md)
- [Transfer data with AzCopy and file storage](storage-use-azcopy-files.md)
- [Configure, optimize, and troubleshoot AzCopy](storage-use-azcopy-configure.md)

## Examples

```
  azcopy jobs rm e52247de-0323-b14d-4cc8-76e0be2e2d44
```

## Options

**-h, --help**                Help for remove.

## Options inherited from parent commands

**--cap-mbps uint32**      Caps the transfer rate, in megabits per second. Moment-by-moment throughput might vary slightly from the cap. If this option is set to zero, or it is omitted, the throughput isn't capped.

**--output-type** string   Format of the command's output. The choices include: text, json. The default value is 'text'. (default "text")

**--trusted-microsoft-suffixes** string   Specifies additional domain suffixes where Azure Active Directory login tokens may be sent.  The default is '*.core.windows.net;*.core.chinacloudapi.cn;*.core.cloudapi.de;*.core.usgovcloudapi.net'. Any listed here are added to the default. For security, you should only put Microsoft Azure domains here. Separate multiple entries with semi-colons.

## See also

- [azcopy jobs](storage-ref-azcopy-jobs.md)
