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

Copies source data to a destination location.

## Synopsis

The supported directions are:

- local <-> Azure Blob (SAS or OAuth authentication)
- local <-> Azure File (Share/directory SAS authentication)
- local <-> ADLS Gen 2 (SAS, OAuth, or SharedKey authentication)
- Azure Blob (SAS or public) <-> Azure Blob (SAS or OAuth authentication)
- Azure File (SAS) -> Azure Block Blob (SAS or OAuth authentication)
- AWS S3 (Access Key) -> Azure Block Blob (SAS or OAuth authentication)

Please refer to the examples for more information.

### Advanced

AzCopy automatically detects the content type of the files when uploading from the local disk, based on the file extension or content (if no extension is specified).

The built-in lookup table is small, but on Unix, it is augmented by the local system's mime.types file(s) if available under one or more of these names:

- /etc/mime.types
- /etc/apache2/mime.types
- /etc/apache/mime.types

On Windows, MIME types are extracted from the registry. This feature can be turned off with the help of a flag. Please refer to the flag section.

> [!IMPORTANT]
> If you set an environment variable by using the command line, that variable will be readable in your command line history. Consider clearing variables that contain credentials from your command line history. To keep variables from appearing in your history, you can use a script to prompt the user for their credentials, and to set the environment variable.

```azcopy
azcopy copy [source] [destination] [flags]
```

## Examples

Upload a single file using OAuth authentication.

If you have not yet logged into AzCopy, please use `azcopy login` command before you run the following command.

```azcopy
azcopy cp "/path/to/file.txt" "https://[account].blob.core.windows.net/[container]/[path/to/blob]"
```

Same as above, but this time also compute MD5 hash of the file content and save it as the blob's Content-MD5 property:

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

Download a single file using OAuth authentication.

If you have not yet logged into AzCopy, please use `azcopy login` command before you run the following command.

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

Copy a single blob with SAS to another blob with OAuth token.

If you have not yet logged into AzCopy, please use `azcopy login` command before you run the following command. The OAuth token is used to access the destination storage account.

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

```azcopy
azcopy cp "https://s3.amazonaws.com/[bucket]/[folder]" "https://[destaccount].blob.core.windows.net/[container]/[path/to/directory]?[SAS]" --recursive=true
```

See https://docs.aws.amazon.com/AmazonS3/latest/user-guide/using-folders.html to learn about what [folder] means for S3. Set environment variable AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY for S3 source.

Copy all buckets in S3 service with access key to blob account with SAS:

Set environment variable AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY for S3 source.

```azcopy
azcopy cp "https://s3.amazonaws.com/" "https://[destaccount].blob.core.windows.net?[SAS]" --recursive=true
```

Copy all buckets in a S3 region with access key to blob account with SAS:

```azcopy
azcopy cp "https://s3-[region].amazonaws.com/" "https://[destaccount].blob.core.windows.net?[SAS]" --recursive=true
```

Set environment variable AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY for S3 source.

## Options

|Option|Description|
|--|--|
|--blob-type string|Defines the type of blob at the destination. This is used for uploading blobs and when copying between accounts (default "None").|
|--block-blob-tier string|Upload block blob to Azure Storage using this blob tier. (default "None").|
|--block-size-mb float |Use this block size (specified in MiB) when uploading to Azure Storage, and downloading from Azure Storage. The default value is automatically calculated based on file size. Decimal fractions are allowed (For example: 0.25).|
|--cache-control string|Set the cache-control header. Returned on download.|
|--check-md5 string|Specifies how strictly MD5 hashes should be validated when downloading. Only available when downloading. Available options: NoCheck, LogOnly, FailIfDifferent, FailIfDifferentOrMissing. (default "FailIfDifferent")|
|--content-disposition string|Set the content-disposition header. Returned on download.|
|--content-encoding string|Set the content-encoding header. Returned on download.|
|--content-language string|Set the content-language header. Returned on download.|
|--content-type string |Specifies the content type of the file. Implies no-guess-mime-type. Returned on download.|
|--exclude string|Exclude these files when copying. Support use of *.|
|--exclude-blob-type string|Optionally specifies the type of blob (BlockBlob/ PageBlob/ AppendBlob) to exclude when copying blobs from the container or the account. Use of this flag is not applicable for copying data from non azure-service to service. More than one blob should be separated by ';'.|
|--follow-symlinks|Follow symbolic links when uploading from local file system.|
|--from-to string|Optionally specifies the source destination combination. For Example: LocalBlob, BlobLocal, LocalBlobFS.|
|-h, --help|Shows help content for the copy command. |
|--log-level string|Define the log verbosity for the log file, available levels: INFO(all requests/responses), WARNING(slow responses), ERROR(only failed requests), and NONE(no output logs). (default "INFO").|
|--metadata string|Upload to Azure Storage with these key-value pairs as metadata.|
|--no-guess-mime-type|Prevents AzCopy from detecting the content-type based on the extension or content of the file.|
|--overwrite|Overwrite the conflicting files/blobs at the destination if this flag is set to true. (default true).|
|--page-blob-tier string |Upload page blob to Azure Storage using this blob tier. (default "None").|
|--preserve-last-modified-time|Only available when destination is file system.|
|--put-md5|create an MD5 hash of each file, and save the hash as the Content-MD5 property of the destination blob or file. (By default the hash is NOT created.) Only available when uploading.|
|--recursive|Look into sub-directories recursively when uploading from local file system.|
|--s2s-detect-source-changed|Check if source has changed after enumerating. For S2S copy, as source is a remote resource, validating whether source has changed need additional request costs.|
|--s2s-handle-invalid-metadata string |Specifies how invalid metadata keys are handled. Available options: ExcludeIfInvalid, FailIfInvalid, RenameIfInvalid. (default "ExcludeIfInvalid").|
|--s2s-preserve-access-tier|Preserve access tier during service to service copy. Please refer to [Azure Blob storage: hot, cool, and archive access tiers](../blobs/storage-blob-storage-tiers.md) to ensure destination storage account supports setting access tier. In the cases that setting access tier is not supported, please use s2sPreserveAccessTier=false to bypass copying access tier.  (default true).|
|--s2s-preserve-properties|Preserve full properties during service to service copy. For S3 and Azure File non-single file source, as list operation doesn't return full properties of objects and files, to preserve full properties AzCopy needs to send one additional request per object and file. (default true).|

## Options inherited from parent commands

|Option|Description|
|---|---|
|--cap-mbps uint32|Caps the transfer rate, in megabits per second. Moment-by-moment throughput might vary slightly from the cap. If this option is set to zero, or it is omitted, the throughput isn't capped.|
|--output-type string|Format of the command's output. The choices include: text, json. The default value is "text".|

## See also

- [azcopy](storage-ref-azcopy.md)
