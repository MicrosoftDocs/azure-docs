---
title: azcopy remove | Microsoft Docs
description: This article provides reference information for the azcopy remove command.
author: normesta
ms.service: storage
ms.topic: reference
ms.date: 08/26/2019
ms.author: normesta
ms.subservice: common
ms.reviewer: zezha-msft
---

# azcopy remove

Delete entities from Azure Storage Blob/File/Azure Data Lake Storage Gen2

## Synopsis

Delete entities from Azure Storage Blob/File/Azure Data Lake Storage Gen2.

```azcopy
azcopy remove [resourceURL] [flags]
```

## Examples

Remove a single blob with SAS:

```azcopy
azcopy rm "https://[account].blob.core.windows.net/[container]/[path/to/blob]?[SAS]"
```

Remove an entire virtual directory with a SAS:

```azcopy
azcopy rm "https://[account].blob.core.windows.net/[container]/[path/to/directory]?[SAS]" --recursive=true
```

Remove only the top blobs inside a virtual directory but not its sub-directories:

```azcopy
azcopy rm "https://[account].blob.core.windows.net/[container]/[path/to/virtual/dir]" --recursive=false
```

Remove a subset of blobs in a virtual directory (ex: only jpg and pdf files, or if the blob name is "exactName"):

```azcopy
azcopy rm "https://[account].blob.core.windows.net/[container]/[path/to/directory]?[SAS]" --recursive=true --include="*.jpg;*.pdf;exactName"
```

Remove an entire virtual directory but exclude certain blobs from the scope (ex: every blob that starts with foo or ends with bar):

```azcopy
azcopy rm "https://[account].blob.core.windows.net/[container]/[path/to/directory]?[SAS]" --recursive=true --exclude="foo*;*bar"
```

Remove a single file from ADLS Gen2 (include/exclude not supported):

```azcopy
azcopy rm "https://[account].dfs.core.windows.net/[container]/[path/to/file]?[SAS]"
```

Remove a single directory from ADLS Gen2 (include/exclude not supported):

```azcopy
azcopy rm "https://[account].dfs.core.windows.net/[container]/[path/to/directory]?[SAS]"
```

## Options

|Option|Description|
|--|--|
|--exclude string|exclude files whose name matches the pattern list. Example: *.jpg;*.pdf;exactName|
|-h, --help|help for remove|
|--include string|only include files whose name matches the pattern list. Example: *.jpg;*.pdf;exactName|
|--log-level string|define the log verbosity for the log file, available levels: INFO(all requests/responses), WARNING(slow responses), ERROR(only failed requests), and NONE(no output logs). (default "INFO")|
|--recursive|look into sub-directories recursively when syncing between directories.|

## Options inherited from parent commands

|Option|Description|
|--|--|
|--cap-mbps uint32|caps the transfer rate, in Mega bits per second. Moment-by-moment throughput may vary slightly from the cap. If zero or omitted, throughput is not capped.|
|--output-type string|format of the command's output, the choices include: text, json. (default "text")|

## See also

- [azcopy](azcopy.md)
