---
title: azcopy set-properties
description: This article provides reference information for the azcopy set-properties command.
author: normesta
ms.service: azure-storage
ms.topic: reference
ms.date: 07/21/2022
ms.author: normesta
ms.subservice: storage-common-concepts
ms.reviewer: zezha-msft
---

# azcopy set-properties (preview)

Given a location, change all the valid system properties of that storage (blob or file).

## Synopsis

```azcopy
azcopy set-properties [resourceURL] [flags]
```

Sets properties of Blob and File storage. The properties currently supported by this command are:

- Blobs -> Tier, Metadata, Tags
- Data Lake Storage Gen2 -> Tier, Metadata, Tags
- Files -> Metadata

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

While setting tags on the blobs, there are other permissions('t' for tags) with SAS. Without those tags, the service will return an authorization error.

Clear all existing blob-tags of blob:

`azcopy set-properties "https://[account].blob.core.windows.net/[container]/[path/to/blob]" --blob-tags=clear`

While setting tags on the blobs, there are other permissions('t' for tags) with SAS. Without those tags, the service will return an authorization error.

## Options

`--blob-tags` string            Set tags on blobs to categorize data in your storage account (separated by '&')

`--block-blob-tier` string      Changes the access tier of the blobs to the given tier (default "None")

`--dry-run`                     Prints the file paths that would be affected by this command. This flag doesn't affect the actual files.

`--exclude-path` string         Exclude these paths when removing. This option doesn't support wildcard characters (*). Checks relative path prefix. For example: myFolder;myFolder/subDirName/file.pdf

`--exclude-pattern` string      Exclude files where the name matches the pattern list. For example: *.jpg;*.pdf;exactName

`--from-to` string              Optionally specifies the source destination combination. Valid values: BlobNone, FileNone, BlobFSNone

`-h`, `--help`                        help for set-properties

`--include-path` string         Include only these paths when setting property. This option doesn't support wildcard characters (*). Checks relative path prefix. For example: `myFolder;myFolder/subDirName/file.pdf`

`--include-pattern` string      Include only files where the name matches the pattern list. For example: *.jpg;*.pdf;exactName

`--list-of-files` string        Defines the location of the text file that has the list of files to be copied.

`--metadata` string             Set the given location with these key-value pairs (separated by ';') as metadata.

`--page-blob-tier` string       Upload page blob to Azure Storage using this blob tier. (default 'None'). (default "None")

`--recursive`                   Look into subdirectories recursively when uploading from local file system.

`--rehydrate-priority` string   Optional flag that sets rehydrate priority for rehydration. Valid values: Standard, High. Default- standard (default "Standard")


## Options inherited from parent commands

`--cap-mbps float`    Caps the transfer rate, in megabits per second. Moment-by-moment throughput might vary slightly from the cap. If this option is set to zero, or it's omitted, the throughput isn't capped.

`--log-level`      (string)    Define the log verbosity for the log file, available levels: INFO(all requests/responses), WARNING(slow responses), ERROR(only failed requests), and NONE(no output logs). (default 'INFO'). (default "INFO")

`--output-type`    (string)    Format of the command's output. The choices include: text, json. The default value is 'text'. (default "text")

`--output-level`  (string)     Define the output verbosity. Available levels: essential, quiet. (default "default")

`--trusted-microsoft-suffixes`    (string)    Specifies other domain suffixes where Microsoft Entra ID log in tokens may be sent.  The default is '*.core.windows.net;*.core.chinacloudapi.cn;*.core.cloudapi.de;*.core.usgovcloudapi.net;*.storage.azure.net'. Any listed here are added to the default. For security, you should only put Microsoft Azure domains here. Separate multiple entries with semi-colons.

## See also

- [azcopy](storage-ref-azcopy.md)
