---
title: azcopy sync | Microsoft Docs
description: This article provides reference information for the azcopy sync command.
author: normesta
ms.service: storage
ms.topic: reference
ms.date: 07/24/2020
ms.author: normesta
ms.subservice: common
ms.reviewer: zezha-msft
---

# azcopy sync

Replicates the source location to the destination location.

## Synopsis

The last modified times are used for comparison. The file is skipped if the last modified time in the destination is more recent.

The supported pairs are:

- local <-> Azure Blob (either SAS or OAuth authentication can be used)
- Azure Blob <-> Azure Blob (Source must include a SAS or is publicly accessible; either SAS or OAuth authentication can be used for destination)
- Azure File <-> Azure File (Source must include a SAS or is publicly accessible; SAS authentication should be used for destination)

The sync command differs from the copy command in several ways:

1. By default, the recursive flag is true and sync copies all subdirectories. Sync only copies the top-level files inside a directory if the recursive flag is false.
2. When syncing between virtual directories, add a trailing slash to the path (refer to examples) if there's a blob with the same name as one of the virtual directories.
3. If the `deleteDestination` flag is set to true or prompt, then sync will delete files and blobs at the destination that are not present at the source.

## Related conceptual articles

- [Get started with AzCopy](storage-use-azcopy-v10.md)
- [Transfer data with AzCopy and Blob storage](storage-use-azcopy-blobs.md)
- [Transfer data with AzCopy and file storage](storage-use-azcopy-files.md)
- [Configure, optimize, and troubleshoot AzCopy](storage-use-azcopy-configure.md)

### Advanced

If you don't specify a file extension, AzCopy automatically detects the content type of the files when uploading from the local disk, based on the file extension or content (if no extension is specified).

The built-in lookup table is small, but on Unix, it's augmented by the local system's mime.types file(s) if available under one or more of these names:

- /etc/mime.types
- /etc/apache2/mime.types
- /etc/apache/mime.types

On Windows, MIME types are extracted from the registry.

```azcopy
azcopy sync <source> <destination> [flags]
```

## Examples

Sync a single file:

```azcopy
azcopy sync "/path/to/file.txt" "https://[account].blob.core.windows.net/[container]/[path/to/blob]"
```

Same as above, but also compute an MD5 hash of the file content, and then save that MD5 hash as the blob's Content-MD5 property. 

```azcopy
azcopy sync "/path/to/file.txt" "https://[account].blob.core.windows.net/[container]/[path/to/blob]" --put-md5
```

Sync an entire directory including its subdirectories (note that recursive is by default on):

```azcopy
azcopy sync "/path/to/dir" "https://[account].blob.core.windows.net/[container]/[path/to/virtual/dir]"
```

or

```azcopy
azcopy sync "/path/to/dir" "https://[account].blob.core.windows.net/[container]/[path/to/virtual/dir]" --put-md5
```

Sync only the files inside of a directory but not subdirectories or the files inside of subdirectories:

```azcopy
azcopy sync "/path/to/dir" "https://[account].blob.core.windows.net/[container]/[path/to/virtual/dir]" --recursive=false
```

Sync a subset of files in a directory (For example: only jpg and pdf files, or if the file name is `exactName`):

```azcopy
azcopy sync "/path/to/dir" "https://[account].blob.core.windows.net/[container]/[path/to/virtual/dir]" --include-pattern="*.jpg;*.pdf;exactName"
```

Sync an entire directory but exclude certain files from the scope (For example: every file that starts with foo or ends with bar):

```azcopy
azcopy sync "/path/to/dir" "https://[account].blob.core.windows.net/[container]/[path/to/virtual/dir]" --exclude-pattern="foo*;*bar"
```

Sync a single blob:

```azcopy
azcopy sync "https://[account].blob.core.windows.net/[container]/[path/to/blob]?[SAS]" "https://[account].blob.core.windows.net/[container]/[path/to/blob]"
```

Sync a virtual directory:

```azcopy
azcopy sync "https://[account].blob.core.windows.net/[container]/[path/to/virtual/dir]?[SAS]" "https://[account].blob.core.windows.net/[container]/[path/to/virtual/dir]" --recursive=true
```

Sync a virtual directory that has the same name as a blob (add a trailing slash to the path in order to disambiguate):

```azcopy
azcopy sync "https://[account].blob.core.windows.net/[container]/[path/to/virtual/dir]/?[SAS]" "https://[account].blob.core.windows.net/[container]/[path/to/virtual/dir]/" --recursive=true
```

Sync an Azure File directory (same syntax as Blob):

```azcopy
azcopy sync "https://[account].file.core.windows.net/[share]/[path/to/dir]?[SAS]" "https://[account].file.core.windows.net/[share]/[path/to/dir]" --recursive=true
```

> [!NOTE]
> If include/exclude flags are used together, only files matching the include patterns would be looked at, but those matching the exclude patterns would be always be ignored.

## Options

**--block-size-mb** float    Use this block size (specified in MiB) when uploading to Azure Storage or downloading from Azure Storage. Default is automatically calculated based on file size. Decimal fractions are allowed (For example: `0.25`).

**--check-md5** string   Specifies how strictly MD5 hashes should be validated when downloading. This option is only available when downloading. Available values include: `NoCheck`, `LogOnly`, `FailIfDifferent`, `FailIfDifferentOrMissing`. (default `FailIfDifferent`). (default `FailIfDifferent`)

**--delete-destination** string   Defines whether to delete extra files from the destination that are not present at the source. Could be set to `true`, `false`, or `prompt`. If set to `prompt`, the user will be asked a question before scheduling files and blobs for deletion. (default `false`). (default `false`)

**--exclude-attributes** string   (Windows only) Excludes files whose attributes match the attribute list. For example: `A;S;R`

**--exclude-path** string    Exclude these paths when comparing the source against the destination. This option does not support wildcard characters (*). Checks relative path prefix(For example: `myFolder;myFolder/subDirName/file.pdf`).

**--exclude-pattern** string   Exclude files where the name matches the pattern list. For example: `*.jpg;*.pdf;exactName`

**--help**    help for sync.

**--include-attributes** string   (Windows only) Includes only files whose attributes match the attribute list. For example: `A;S;R`

**--include-pattern** string   Include only files where the name matches the pattern list. For example: `*.jpg;*.pdf;exactName`

**--log-level** string     Define the log verbosity for the log file, available levels: `INFO`(all requests and responses), `WARNING`(slow responses), `ERROR`(only failed requests), and `NONE`(no output logs). (default `INFO`). 

**--preserve-smb-info**   False by default. Preserves SMB property info (last write time, creation time, attribute bits) between SMB-aware resources (Windows and Azure Files). This flag applies to both files and folders, unless a file-only filter is specified (for example, include-pattern). The info transferred for folders is the same as that for files, except for Last Write Time that is not preserved for folders.

**--preserve-smb-permissions**   False by default. Preserves SMB ACLs between aware resources (Windows and Azure Files). This flag applies to both files and folders, unless a file-only filter is specified (for example, `include-pattern`).

**--put-md5**     Create an MD5 hash of each file, and save the hash as the Content-MD5 property of the destination blob or file. (By default the hash is NOT created.) Only available when uploading.

**--recursive**    `True` by default, look into subdirectories recursively when syncing between directories. (default `True`). 

**--s2s-preserve-access-tier**  Preserve access tier during service to service copy. Refer to [Azure Blob storage: hot, cool, and archive access tiers](https://docs.microsoft.com/azure/storage/blobs/storage-blob-storage-tiers) to ensure destination storage account supports setting access tier. In the cases that setting access tier is not supported, please use s2sPreserveAccessTier=false to bypass copying access tier. (default `true`). 

## Options inherited from parent commands

|Option|Description|
|---|---|
|--cap-mbps uint32|Caps the transfer rate, in megabits per second. Moment-by-moment throughput might vary slightly from the cap. If this option is set to zero, or it is omitted, the throughput isn't capped.|
|--output-type string|Format of the command's output. The choices include: text, json. The default value is "text".|
|--trusted-microsoft-suffixes string   |Specifies additional domain suffixes where Azure Active Directory login tokens may be sent.  The default is '*.core.windows.net;*.core.chinacloudapi.cn;*.core.cloudapi.de;*.core.usgovcloudapi.net'. Any listed here are added to the default. For security, you should only put Microsoft Azure domains here. Separate multiple entries with semi-colons.|

## See also

- [azcopy](storage-ref-azcopy.md)
