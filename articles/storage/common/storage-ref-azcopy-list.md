---
title: azcopy list
description: This article provides reference information for the azcopy list command.
author: normesta
ms.service: azure-storage
ms.topic: reference
ms.date: 05/26/2022
ms.author: normesta
ms.subservice: storage-common-concepts
ms.reviewer: zezha-msft
---

# azcopy list

Lists the entities in a given resource.

## Synopsis

Only Blob containers are supported in the current release.

```azcopy
azcopy list [containerURL] [flags]
```

## Related conceptual articles

- [Get started with AzCopy](storage-use-azcopy-v10.md)
- [Transfer data with AzCopy and Blob storage](./storage-use-azcopy-v10.md#transfer-data)
- [Transfer data with AzCopy and file storage](storage-use-azcopy-files.md)

## Examples

```azcopy
azcopy list [containerURL] --properties [semicolon(;) separated list of attributes (LastModifiedTime, VersionId, BlobType, BlobAccessTier, ContentType, ContentEncoding, LeaseState, LeaseDuration, LeaseStatus) enclosed in double quotes (")]
```

## Options

`-h`, `--help`    Help for list

`--machine-readable`    Lists file sizes in bytes.

`--mega-units`    Displays units in orders of 1000, not 1024.

`--properties`    (string)    delimiter (;) separated values of properties required in list output.

`--running-tally`    Counts the total number of files and their sizes.

## Options inherited from parent commands

`--cap-mbps`    (float)    Caps the transfer rate, in megabits per second. Moment-by-moment throughput might vary slightly from the cap. If this option is set to zero, or it's omitted, the throughput isn't capped.

`--output-type`    (string)    Format of the command's output. The choices include: text, json. The default value is 'text'. (default "text")

`--trusted-microsoft-suffixes`    (string)    Specifies additional domain suffixes where Microsoft Entra login tokens may be sent.  The default is '*.core.windows.net;*.core.chinacloudapi.cn;*.core.cloudapi.de;*.core.usgovcloudapi.net;*.storage.azure.net'. Any listed here are added to the default. For security, you should only put Microsoft Azure domains here. Separate multiple entries with semi-colons.

## See also

- [azcopy](storage-ref-azcopy.md)
