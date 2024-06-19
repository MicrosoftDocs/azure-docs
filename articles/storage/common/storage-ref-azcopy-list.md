---
title: azcopy list
description: This article provides reference information for the azcopy list command.
author: normesta
ms.service: azure-storage
ms.topic: reference
ms.date: 05/31/2024
ms.author: normesta
ms.subservice: storage-common-concepts
ms.reviewer: zezha-msft
---

# azcopy list

This command lists accounts, containers, and directories. Blob Storage, Azure Data Lake Storage Gen2, and File Storage are supported. OAuth for Files is currently not supported; please use SAS to authenticate for Files.

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

`--location`  Optionally specifies the location. For Example: `Blob`,`File`, `BlobFS`.

`--machine-readable`    False by default.  Lists file sizes in bytes.

`--mega-units`    False by default. Displays units in orders of 1000, not 1024.

`--properties`     Properties to be displayed in list output. Possible properties include: `LastModifiedTime`, `VersionId`, `BlobType`, `BlobAccessTier`, `ContentType`, `ContentEncoding`, `ContentMD5`, `LeaseState`, `LeaseDuration`, `LeaseStatus`, `ArchiveStatus`. Delimiter (;) should be used to separate multiple values of properties (For example: 'LastModifiedTime;VersionId;BlobType').

`--running-tally`    False by default. Counts the total number of files and their sizes.

`--trailing-dot`  Enabled by default to treat file share related operations in a safe manner. Available options: `Enable`, `Disable`. Choose `Disable` to go back to legacy (potentially unsafe) treatment of trailing dot files where the file service will trim any trailing dots in paths. This can result in potential data corruption if the transfer contains two paths that differ only by a trailing dot (For example `mypath` and `mypath.`). If this flag is set to `Disable` and AzCopy encounters a trailing dot file, it will warn customers in the scanning log but will not attempt to abort the operation. If the destination does not support trailing dot files (Windows or Blob Storage), AzCopy will fail if the trailing dot file is the root of the transfer and skip any trailing dot paths encountered during enumeration.

## Options inherited from parent commands

`--cap-mbps`    (float)    Caps the transfer rate, in megabits per second. Moment-by-moment throughput might vary slightly from the cap. If this option is set to zero, or it's omitted, the throughput isn't capped.

`--output-type`    (string)    Format of the command's output. The choices include: text, json. The default value is 'text'. (default "text")

`--trusted-microsoft-suffixes`    (string)    Specifies additional domain suffixes where Microsoft Entra login tokens may be sent.  The default is '*.core.windows.net;*.core.chinacloudapi.cn;*.core.cloudapi.de;*.core.usgovcloudapi.net;*.storage.azure.net'. Any listed here are added to the default. For security, you should only put Microsoft Azure domains here. Separate multiple entries with semi-colons.

## See also

- [azcopy](storage-ref-azcopy.md)
