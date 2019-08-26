---
title: azcopy sync | Microsoft Docs
description: This article provides reference information for the azcopy sync command.
author: normesta
ms.service: storage
ms.topic: reference
ms.date: 08/26/2019
ms.author: normesta
ms.subservice: common
ms.reviewer: zezha-msft
---

# azcopy sync

Replicate source to the destination location

## Synopsis

Replicate a source to a destination location. The last modified times are used for comparison, the file is skipped if the last modified time in the destination is more recent. The supported pairs are:
  - local <-> Azure Blob (either SAS or OAuth authentication can be used)

Please note that the sync command differs from the copy command in several ways:
  0. The recursive flag is on by default.
  1. The source and destination should not contain patterns(such as * or ?).
  2. The include/exclude flags can be a list of patterns matching to the file names. Please refer to the example section for illustration.
  3. If there are files/blobs at the destination that are not present at the source, the user will be prompted to delete them. This prompt can be silenced by using the corresponding flags to automatically answer the deletion question.

Advanced:
Please note that AzCopy automatically detects the Content Type of the files when uploading from the local disk, based on the file extension or content (if no extension is specified).

The built-in lookup table is small but on Unix it is augmented by the local system's mime.types file(s) if available under one or more of these names:
  - /etc/mime.types
  - /etc/apache2/mime.types
  - /etc/apache/mime.types

On Windows, MIME types are extracted from the registry.


```azcopy
azcopy sync [flags]
```

## Examples

Sync a single file:

```azcopy
azcopy sync "/path/to/file.txt" "https://[account].blob.core.windows.net/[container]/[path/to/blob]"
```

Same as above, but this time also compute MD5 hash of the file content and save it as the blob's Content-MD5 property. 

```azcopy
azcopy sync "/path/to/file.txt" "https://[account].blob.core.windows.net/[container]/[path/to/blob]" --put-md5
```

Sync an entire directory including its sub-directories (note that recursive is by default on):

```azcopy
azcopy sync "/path/to/dir" "https://[account].blob.core.windows.net/[container]/[path/to/virtual/dir]"
```

or

```azcopy
azcopy sync "/path/to/dir" "https://[account].blob.core.windows.net/[container]/[path/to/virtual/dir]" --put-md5
```

Sync only the top files inside a directory but not its sub-directories:

```azcopy
azcopy sync "/path/to/dir" "https://[account].blob.core.windows.net/[container]/[path/to/virtual/dir]" --recursive=false
```

Sync a subset of files in a directory (ex: only jpg and pdf files, or if the file name is "exactName"):

```azcopy
azcopy sync "/path/to/dir" "https://[account].blob.core.windows.net/[container]/[path/to/virtual/dir]" --include="*.jpg;*.pdf;exactName"
```

Sync an entire directory but exclude certain files from the scope (ex: every file that starts with foo or ends with bar):

```azcopy
azcopy sync "/path/to/dir" "https://[account].blob.core.windows.net/[container]/[path/to/virtual/dir]" --exclude="foo*;*bar"
```

> [!NOTE]
> if include/exclude flags are used together, only files matching the include patterns would be looked at, but those matching the exclude patterns would be always be ignored.

## Options

|Option|Description|
|--|--|
|--block-size-mb float|Use this block size (specified in MiB) when uploading to/downloading from Azure Storage. Default is automatically calculated based on file size. Decimal fractions are allowed - e.g. 0.25|
|--check-md5 string|Specifies how strictly MD5 hashes should be validated when downloading. Only available when downloading. Available options: NoCheck, LogOnly, FailIfDifferent, FailIfDifferentOrMissing. (default "FailIfDifferent")|
|--delete-destination string|defines whether to delete extra files from the destination that are not present at the source. Could be set to true, false, or prompt. If set to prompt, user will be asked a question before scheduling files/blobs for deletion. (default "false")|
|--exclude string|exclude files whose name matches the pattern list. Example: *.jpg;*.pdf;exactName|
|-h, --help|help for sync|
|--include string|only include files whose name matches the pattern list. Example: *.jpg;*.pdf;exactName|
|--log-level string|define the log verbosity for the log file, available levels: INFO(all requests/responses), WARNING(slow responses), ERROR(only failed requests), and NONE(no output logs). (default "INFO")|
|--put-md5|create an MD5 hash of each file, and save the hash as the Content-MD5 property of the destination blob/file. (By default the hash is NOT created.) Only available when uploading.|
|--recursive|true by default, look into sub-directories recursively when syncing between directories. (default true)|

## Options inherited from parent commands

|Option|Description|
|--|--|
|--cap-mbps uint32|Caps the transfer rate, in Mega bits per second. Moment-by-moment throughput may vary slightly from the cap. If zero or omitted, throughput is not capped.|
|--output-type string|Format of the command's output, the choices include: text, json. (default "text").|

## See also

- [azcopy](azcopy.md)
