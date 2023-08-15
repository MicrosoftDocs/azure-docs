---
title: azcopy remove
description: This article provides reference information for the azcopy remove command.
author: normesta
ms.service: azure-storage
ms.topic: reference
ms.date: 05/26/2022
ms.author: normesta
ms.subservice: storage-common-concepts
ms.reviewer: zezha-msft
---

# azcopy remove

Delete blobs or files from an Azure storage account.

## Synopsis

```azcopy
azcopy remove [resourceURL] [flags]
```

## Related conceptual articles

- [Get started with AzCopy](storage-use-azcopy-v10.md)
- [Transfer data with AzCopy and Blob storage](./storage-use-azcopy-v10.md#transfer-data)
- [Transfer data with AzCopy and file storage](storage-use-azcopy-files.md)

## Examples

Remove a single blob by using a SAS token:

`azcopy rm "https://[account].blob.core.windows.net/[container]/[path/to/blob]?[SAS]"`

Remove an entire virtual directory by using a SAS token:

`azcopy rm "https://[account].blob.core.windows.net/[container]/[path/to/directory]?[SAS]" --recursive=true`

Remove only the blobs inside of a virtual directory, but don't remove any subdirectories or blobs within those subdirectories:

`azcopy rm "https://[account].blob.core.windows.net/[container]/[path/to/virtual/dir]" --recursive=false`

Remove a subset of blobs in a virtual directory (For example: remove only jpg and pdf files, or if the blob name is "exactName"):

`azcopy rm "https://[account].blob.core.windows.net/[container]/[path/to/directory]?[SAS]" --recursive=true --include-pattern="*.jpg;*.pdf;exactName"`

Remove an entire virtual directory but exclude certain blobs from the scope (For example: every blob that starts with foo or ends with bar):

`azcopy rm "https://[account].blob.core.windows.net/[container]/[path/to/directory]?[SAS]" --recursive=true --exclude-pattern="foo*;*bar"`

Remove specified version IDs of a blob from Azure Storage. Ensure that source is a valid blob and `versionidsfile` which takes in a path to the file where each version is written on a separate line. All the specified versions will be removed from Azure Storage.

`azcopy rm "https://[srcaccount].blob.core.windows.net/[containername]/[blobname]" "/path/to/dir" --list-of-versions="/path/to/dir/[versionidsfile]"`

Remove specific blobs and virtual directories by putting their relative paths (NOT URL-encoded) in a file:

`azcopy rm "https://[account].blob.core.windows.net/[container]/[path/to/parent/dir]" --recursive=true --list-of-files=/usr/bar/list.txt`

Remove a single file from a Blob Storage account that has a hierarchical namespace (include/exclude not supported):

`azcopy rm "https://[account].dfs.core.windows.net/[container]/[path/to/file]?[SAS]"`

Remove a single directory from a Blob Storage account that has a hierarchical namespace (include/exclude not supported):

`azcopy rm "https://[account].dfs.core.windows.net/[container]/[path/to/directory]?[SAS]"`

## Options

`--delete-snapshots`    (string)    By default, the delete operation fails if a blob has snapshots. Specify 'include' to remove the root blob and all its snapshots; alternatively specify 'only' to remove only the snapshots but keep the root blob.

`--dry-run`    Prints the path files that would be removed by the command. This flag doesn't trigger the removal of the files.

`--exclude-path`    (string)    Exclude these paths when removing. This option doesn't support wildcard characters (*). Checks relative path prefix. For example: myFolder;myFolder/subDirName/file.pdf

`--exclude-pattern`    (string)    Exclude files where the name matches the pattern list. For example: *.jpg;*.pdf;exactName

`--force-if-read-only`    When deleting an Azure Files file or folder, force the deletion to work even if the existing object has its read-only attribute set

`--from-to`    (string)    Optionally specifies the source destination combination. For Example: BlobTrash, FileTrash, BlobFSTrash

`-h`, `--help`    help for remove

`--include-path`    (string)    Include only these paths when removing. This option doesn't support wildcard characters (*). Checks relative path prefix. For example: myFolder;myFolder/subDirName/file.pdf

`--include-pattern`    (string)    Include only files where the name matches the pattern list. For example: *.jpg;*.pdf;exactName

`--list-of-files`    (string)    Defines the location of a file which contains the list of files and directories to be deleted. The relative paths should be delimited by line breaks, and the paths should NOT be URL-encoded.

`--list-of-versions`    (string)    Specifies a file where each version ID is listed on a separate line. Ensure that the source must point to a single blob and all the version IDs specified in the file using this flag must belong to the source blob only. Specified version IDs of the given blob will get deleted from Azure Storage.

`--log-level`    (string)    Define the log verbosity for the log file. Available levels include: INFO(all requests/responses), WARNING(slow responses), ERROR(only failed requests), and NONE(no output logs). (default 'INFO') (default "INFO")

`--permanent-delete`    (string)    This is a preview feature that PERMANENTLY deletes soft-deleted snapshots/versions. Possible values include 'snapshots', 'versions', 'snapshotsandversions', 'none'. (default "none")

`--recursive`    Look into subdirectories recursively when syncing between directories.

## Options inherited from parent commands

`--cap-mbps float`    Caps the transfer rate, in megabits per second. Moment-by-moment throughput might vary slightly from the cap. If this option is set to zero, or it's omitted, the throughput isn't capped.

`--output-type`    (string)    Format of the command's output. The choices include: text, json. The default value is 'text'. (default "text")

`--trusted-microsoft-suffixes`    (string)    Specifies additional domain suffixes where Azure Active Directory login tokens may be sent.  The default is '*.core.windows.net;*.core.chinacloudapi.cn;*.core.cloudapi.de;*.core.usgovcloudapi.net;*.storage.azure.net'. Any listed here are added to the default. For security, you should only put Microsoft Azure domains here. Separate multiple entries with semi-colons.

## See also

- [azcopy](storage-ref-azcopy.md)
