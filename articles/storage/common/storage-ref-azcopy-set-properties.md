---
title: azcopy set-properties | Microsoft Docs
description: This article provides reference information for the azcopy set-properties command.
author: normesta
ms.service: storage
ms.topic: reference
ms.date: 07/13/2022
ms.author: normesta
ms.subservice: common
ms.reviewer: zezha-msft
---

# azcopy set-properties (preview)

Given a location, change all the valid system properties of that storage (blob or file).

## Synopsis

```azcopy
azcopy set-properties [resourceURL] [flags]
```

Sets properties of Blob and File storage. The properties currently supported by this command are:

Blobs -> Tier, Metadata, Tags
Data Lake Storage Gen2 -> Tier, Metadata, Tags
Files -> Metadata

> [!NOTE]
> Data Lake Storage Gen2 endpoints will be will be replaced by Blob Storage endpoints.

Refer to the examples for more information.

## Related conceptual articles

- [Get started with AzCopy](storage-use-azcopy-v10.md)
- [Replace blob properties and metadata by using AzCopy v10 (preview)](storage-use-azcopy-blobs-properties-metadata.md)


## Examples

Change tier of blob to hot:

`azcopy set-properties "https://[account].blob.core.windows.net/[container]/[path/to/blob]" --block-blob-tier=hot`

Change tier of blob from archive to cool with rehydrate priority set to high:

`azcopy set-properties "https://[account].blob.core.windows.net/[container]/[path/to/blob]" --block-blob-tier=cool --rehydrate-priority=high`

Change tier of all files in a directory to archive:

`azcopy set-properties "https://[account].blob.core.windows.net/[container]/[path/to/virtual/dir]" --block-blob-tier=archive --recursive=true`

Change metadata of blob to {key = "abc", val = "def"} and {key = "ghi", val = "jkl"}:

`azcopy set-properties "https://[account].blob.core.windows.net/[container]/[path/to/blob]" --metadata=abc=def;ghi=jkl`

Change metadata of all files in a directory to {key = "abc", val = "def"} and {key = "ghi", val = "jkl"}:

`azcopy set-properties "https://[account].blob.core.windows.net/[container]/[path/to/virtual/dir]" --metadata=abc=def;ghi=jkl --recursive=true`

Clear all existing metadata of blob:

`azcopy set-properties "https://[account].blob.core.windows.net/[container]/[path/to/blob]" --metadata=clear`

Change blob-tags of blob to {key = "abc", val = "def"} and {key = "ghi", val = "jkl"}:

`azcopy set-properties "https://[account].blob.core.windows.net/[container]/[path/to/blob]" --blob-tags=abc=def&ghi=jkl`

While setting tags on the blobs, there are other permissions('t' for tags) in SAS without which the service will give authorization error back.

Clear all existing blob-tags of blob:

`azcopy set-properties "https://[account].blob.core.windows.net/[container]/[path/to/blob]" --blob-tags=clear`

While setting tags on the blobs, there are other permissions('t' for tags) in SAS without which the service will give authorization error back.

## Options

`--metadata` string  Set the given location with these key-value pairs (separated by ';') as metadata.

`--from-to` Optionally specifies the source destination combination. Valid values: BlobNone, FileNone, BlobFSNone

`--include-pattern` Include only files where the name matches the pattern list. For example: *.jpg;*.pdf;exactName

`--include-path` Include only these paths when setting property. This option doesn't support wildcard characters (*). Checks relative path prefix. For example: myFolder;myFolder/subDirName/file.pdf

`--exclude-pattern` Exclude files where the name matches the pattern list. For example: *.jpg;*.pdf;exactName

`--exclude-path` Exclude these paths when removing. This option doesn't support wildcard characters (*). Checks relative path prefix. For example: myFolder;myFolder/subDirName/file.pdf

`--list-of-files` Defines the location of text file, which has the list of only files to be copied.

`--block-blob-tier` Changes the access tier of the blobs to the given tier

`--page-blob-tier` Upload page blob to Azure Storage using this blob tier. (default 'None').

`--recursive` Look into subdirectories recursively when uploading from local file system.

`--rehydrate-priority` Optional flag that sets rehydrate priority for rehydration. Valid values: Standard, High. Default- standard

`--dry-run` Prints the file paths that would be affected by this command. This flag doesn't affect the actual files.

`--blob-tags` Set tags on blobs to categorize data in your storage account (separated by '&').


## Options inherited from parent commands

`--cap-mbps float`    Caps the transfer rate, in megabits per second. Moment-by-moment throughput might vary slightly from the cap. If this option is set to zero, or it's omitted, the throughput isn't capped.

`--output-type`    (string)    Format of the command's output. The choices include: text, json. The default value is 'text'. (default "text")

`--trusted-microsoft-suffixes`    (string)    Specifies other domain suffixes where Azure Active Directory log in tokens may be sent.  The default is '*.core.windows.net;*.core.chinacloudapi.cn;*.core.cloudapi.de;*.core.usgovcloudapi.net;*.storage.azure.net'. Any listed here are added to the default. For security, you should only put Microsoft Azure domains here. Separate multiple entries with semi-colons.

## See also

- [azcopy](storage-ref-azcopy.md)
