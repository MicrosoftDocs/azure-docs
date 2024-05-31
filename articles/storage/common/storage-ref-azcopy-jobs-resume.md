---
title: azcopy jobs resume
description: This article provides reference information for the azcopy jobs resume command.
author: normesta
ms.service: azure-storage
ms.topic: reference
ms.date: 05/26/2022
ms.author: normesta
ms.subservice: storage-common-concepts
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
- [Transfer data with AzCopy and Blob storage](./storage-use-azcopy-v10.md#transfer-data)
- [Transfer data with AzCopy and file storage](storage-use-azcopy-files.md)

### Options

`--destination-sas`    (string)    destination SAS token of the destination for a given Job ID.

`--exclude`    (string)    Filter: exclude these failed transfer(s) when resuming the job. Files should be separated by ';'.

`-h`, `--help`    help for resume

`--include`    (string)    Filter: only include these failed transfer(s) when resuming the job. Files should be separated by ';'.

`--source-sas`    (string)    Source SAS token of the source for a given Job ID.

### Options inherited from parent commands

`--cap-mbps`    (float)    Caps the transfer rate, in megabits per second. Moment-by-moment throughput might vary slightly from the cap. If this option is set to zero, or it is omitted, the throughput isn't capped.

`--output-type`    (string)    Format of the command's output. The choices include: text, json. The default value is 'text'. (default "text")

`--trusted-microsoft-suffixes`    (string)    Specifies additional domain suffixes where Microsoft Entra login tokens may be sent.  The default is '*.core.windows.net;*.core.chinacloudapi.cn;*.core.cloudapi.de;*.core.usgovcloudapi.net;*.storage.azure.net'. Any listed here are added to the default. For security, you should only put Microsoft Azure domains here. Separate multiple entries with semi-colons.

## See also

- [azcopy jobs](storage-ref-azcopy-jobs.md)
