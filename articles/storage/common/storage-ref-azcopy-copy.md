---
title: azcopy copy| Microsoft Docs
description: This article provides reference information for the azcopy copy command.
author: normesta
ms.service: storage
ms.topic: reference
ms.date: 08/26/2019
ms.author: normesta
ms.subservice: common
ms.reviewer: zezha-msft
---

# azcopy copy

Copies source data to a destination location

## Synopsis

Copies source data to a destination location. The supported directions are:
  - local <-> Azure Blob (SAS or OAuth authentication)
  - local <-> Azure File (Share/directory SAS authentication)
  - local <-> ADLS Gen 2 (SAS, OAuth, or SharedKey authentication)
  - Azure Blob (SAS or public) <-> Azure Blob (SAS or OAuth authentication)
  - Azure File (SAS) -> Azure Block Blob (SAS or OAuth authentication)
  - AWS S3 (Access Key) -> Azure Block Blob (SAS or OAuth authentication)

Please refer to the examples for more information.

Advanced:
Please note that AzCopy automatically detects the Content Type of the files when uploading from the local disk, based on the file extension or content (if no extension is specified).

The built-in lookup table is small but on Unix it is augmented by the local system's mime.types file(s) if available under one or more of these names:
  - /etc/mime.types
  - /etc/apache2/mime.types
  - /etc/apache/mime.types

On Windows, MIME types are extracted from the registry. This feature can be turned off with the help of a flag. Please refer to the flag section.

(NOTICE FOR SETTING ENVIRONMENT VARIABLES: Bear in mind that setting an environment variable from the command line will be readable in your command line history. For variables that contain credentials, consider clearing these entries from your history or using a small script of sorts to prompt for and set these variables.)

```azcopy
azcopy copy [source] [destination] [flags]
```

## Examples

Upload a single file using OAuth authentication. Please use 'azcopy login' command first if you aren't logged in yet:

```azcopy
azcopy cp "/path/to/file.txt" "https://[account].blob.core.windows.net/[container]/[path/to/blob]"
```

Same as above, but this time also compute MD5 hash of the file content and save it as the blob's Content-MD5 property. 

```azcopy
azcopy cp "/path/to/file.txt" "https://[account].blob.core.windows.net/[container]/[path/to/blob]" --put-md5
```

Upload a single file with a SAS:

```azcopy
azcopy cp "/path/to/file.txt" "https://[account].blob.core.windows.net/[container]/[path/to/blob]?[SAS]"
```

Upload a single file with a SAS using piping (block blobs only):

```azcopy
cat "/path/to/file.txt" | azcopy cp "https://[account].blob.core.windows.net/[container]/[path/to/blob]?[SAS]"
```

Upload an entire directory with a SAS:

```azcopy
azcopy cp "/path/to/dir" "https://[account].blob.core.windows.net/[container]/[path/to/directory]?[SAS]" --recursive=true
```

or

```azcopy
azcopy cp "/path/to/dir" "https://[account].blob.core.windows.net/[container]/[path/to/directory]?[SAS]" --recursive=true --put-md5
```

Upload a set of files with a SAS using wildcards:

```azcopy
azcopy cp "/path/*foo/*bar/*.pdf" "https://[account].blob.core.windows.net/[container]/[path/to/directory]?[SAS]"
```

Upload files and directories with a SAS using wildcards:

```azcopy
azcopy cp "/path/*foo/*bar*" "https://[account].blob.core.windows.net/[container]/[path/to/directory]?[SAS]" --recursive=true
```

Download a single file using OAuth authentication. Please use 'azcopy login' command first if you aren't logged in yet:

```azcopy
azcopy cp "https://[account].blob.core.windows.net/[container]/[path/to/blob]" "/path/to/file.txt"
```

Download a single file with a SAS:

```azcopy
azcopy cp "https://[account].blob.core.windows.net/[container]/[path/to/blob]?[SAS]" "/path/to/file.txt"
```

Download a single file with a SAS using piping (block blobs only):

```azcopy
azcopy cp "https://[account].blob.core.windows.net/[container]/[path/to/blob]?[SAS]" > "/path/to/file.txt"
```

Download an entire directory with a SAS:

```azcopy
azcopy cp "https://[account].blob.core.windows.net/[container]/[path/to/directory]?[SAS]" "/path/to/dir" --recursive=true
```

Download a set of files with a SAS using wildcards:

```azcopy
azcopy cp "https://[account].blob.core.windows.net/[container]/foo*?[SAS]" "/path/to/dir"
```

Download files and directories with a SAS using wildcards:

```azcopy
azcopy cp "https://[account].blob.core.windows.net/[container]/foo*?[SAS]" "/path/to/dir" --recursive=true
```

Copy a single blob with SAS to another blob with SAS:

```azcopy
azcopy cp "https://[srcaccount].blob.core.windows.net/[container]/[path/to/blob]?[SAS]" "https://[destaccount].blob.core.windows.net/[container]/[path/to/blob]?[SAS]"
```

Copy a single blob with SAS to another blob with OAuth token. Please use 'azcopy login' command first if you aren't logged in yet. 
Note that the OAuth token is used to access the destination storage account:

```azcopy
azcopy cp "https://[srcaccount].blob.core.windows.net/[container]/[path/to/blob]?[SAS]" "https://[destaccount].blob.core.windows.net/[container]/[path/to/blob]"
```

Copy an entire directory from blob virtual directory with SAS to another blob virtual directory with SAS:

```azcopy
azcopy cp "https://[srcaccount].blob.core.windows.net/[container]/[path/to/directory]?[SAS]" "https://[destaccount].blob.core.windows.net/[container]/[path/to/directory]?[SAS]" --recursive=true
```

Copy an entire account data from blob account with SAS to another blob account with SAS:

```azcopy
azcopy cp "https://[srcaccount].blob.core.windows.net?[SAS]" "https://[destaccount].blob.core.windows.net?[SAS]" --recursive=true
```

Copy a single object from S3 with access key to blob with SAS:

Set environment variable AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY for S3 source.

```azcopy
azcopy cp "https://s3.amazonaws.com/[bucket]/[object]" "https://[destaccount].blob.core.windows.net/[container]/[path/to/blob]?[SAS]"
```

Copy an entire directory from S3 with access key to blob virtual directory with SAS:

Set environment variable AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY for S3 source.

```azcopy
azcopy cp "https://s3.amazonaws.com/[bucket]/[folder]" "https://[destaccount].blob.core.windows.net/[container]/[path/to/directory]?[SAS]" --recursive=true
```

Please refer to https://docs.aws.amazon.com/AmazonS3/latest/user-guide/using-folders.html for what [folder] means for S3.

Copy all buckets in S3 service with access key to blob account with SAS:

Set environment variable AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY for S3 source.

```azcopy
azcopy cp "https://s3.amazonaws.com/" "https://[destaccount].blob.core.windows.net?[SAS]" --recursive=true
```

Copy all buckets in a S3 region with access key to blob account with SAS:

Set environment variable AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY for S3 source.

```azcopy
azcopy cp "https://s3-[region].amazonaws.com/" "https://[destaccount].blob.core.windows.net?[SAS]" --recursive=true
```

## Options

|Option|Description|
|--|--|
|--blob-type string|defines the type of blob at the destination. This is used in case of upload / account to account copy (default "None")|
|--block-blob-tier string|upload block blob to Azure Storage using this blob tier. (default "None")|
|--block-size-mb float |use this block size (specified in MiB) when uploading to/downloading from Azure Storage. Default is automatically calculated based on file size. Decimal fractions are allowed - e.g. 0.25|
|--cache-control string|set the cache-control header. Returned on download.|
|--check-md5 string|specifies how strictly MD5 hashes should be validated when downloading. Only available when downloading. Available options: NoCheck, LogOnly, FailIfDifferent, FailIfDifferentOrMissing. (default "FailIfDifferent")|
|--content-disposition string|set the content-disposition header. Returned on download.|
|--content-encoding string|set the content-encoding header. Returned on download.|
|--content-language string|set the content-language header. Returned on download.|
|--content-type string |specifies content type of the file. Implies no-guess-mime-type. Returned on download.|
|--exclude string|exclude these files when copying. Support use of *.|
|--exclude-blob-type string|optionally specifies the type of blob (BlockBlob/ PageBlob/ AppendBlob) to exclude when copying blobs from Container / Account. Use of this flag is not applicable for copying data from non azure-service to service. More than one blob should be separated by ';'|
|--follow-symlinks|follow symbolic links when uploading from local file system.|
|--from-to string|optionally specifies the source destination combination. For Example: LocalBlob, BlobLocal, LocalBlobFS.|
|-h, --help|help for copy|
|--log-level string|define the log verbosity for the log file, available levels: INFO(all requests/responses), WARNING(slow responses), ERROR(only failed requests), and NONE(no output logs). (default "INFO")|
|--metadata string|upload to Azure Storage with these key-value pairs as metadata.|
|--no-guess-mime-type|prevents AzCopy from detecting the content-type based on the extension/content of the file.|
|--overwrite|overwrite the conflicting files/blobs at the destination if this flag is set to true. (default true)|
|--page-blob-tier string |upload page blob to Azure Storage using this blob tier. (default "None")|
|--preserve-last-modified-time|only available when destination is file system.|
|--put-md5|create an MD5 hash of each file, and save the hash as the Content-MD5 property of the destination blob/file. (By default the hash is NOT created.) Only available when uploading.|
|--recursive|look into sub-directories recursively when uploading from local file system.|
|--s2s-detect-source-changed|check if source has changed after enumerating. For S2S copy, as source is a remote resource, validating whether source has changed need additional request costs.|
|--s2s-handle-invalid-metadata string |specifies how invalid metadata keys are handled. AvailabeOptions: ExcludeIfInvalid, FailIfInvalid, RenameIfInvalid. (default "ExcludeIfInvalid")|
|--s2s-preserve-access-tier|preserve access tier during service to service copy. please refer to https://docs.microsoft.com/en-us/azure/storage/blobs/storage-blob-storage-tiers to ensure destination storage account supports setting access tier. In the cases that setting access tier is not supported, please use s2sPreserveAccessTier=false to bypass copying access tier.  (default true)|
|--s2s-preserve-properties|preserve full properties during service to service copy. For S3 and Azure File non-single file source, as list operation doesn't return full properties of objects/files, to preserve full properties AzCopy needs to send one additional request per object/file. (default true)|

## Options inherited from parent commands

|Option|Description|
|--|--|
|--cap-mbps uint32|caps the transfer rate, in Mega bits per second. Moment-by-moment throughput may vary slightly from the cap. If zero or omitted, throughput is not capped.|
|--output-type string|format of the command's output, the choices include: text, json. (default "text")|

## See also

- [azcopy](storage-ref-azcopy.md)
