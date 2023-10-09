---
title: azcopy copy
description: This article provides reference information for the azcopy copy command.
author: normesta
ms.service: azure-storage
ms.topic: reference
ms.date: 11/08/2022
ms.author: normesta
ms.subservice: storage-common-concepts
ms.reviewer: zezha-msft
---

# azcopy copy

Copies source data to a destination location.  


## Synopsis

Copies source data to a destination location. The supported directions are:

- local <-> Azure Blob (SAS or OAuth authentication)
- local <-> Azure Files (Share/directory SAS authentication)
- local <-> Azure Data Lake Storage Gen2 (SAS, OAuth, or SharedKey authentication)
- Azure Blob (SAS or public) -> Azure Blob (SAS or OAuth authentication)
- Azure Blob (SAS or OAuth authentication) -> Azure Blob (SAS or OAuth authentication) - See [Guidelines](./storage-use-azcopy-blobs-copy.md#guidelines).
- Azure Blob (SAS or public) -> Azure Files (SAS)
- Azure Files (SAS) -> Azure Files (SAS)
- Azure Files (SAS) -> Azure Blob (SAS or OAuth authentication)
- AWS S3 (Access Key) -> Azure Block Blob (SAS or OAuth authentication)
- Google Cloud Storage (Service Account Key) -> Azure Block Blob (SAS or OAuth authentication)

Refer to the examples for more information.

### Advanced

AzCopy automatically detects the content type of the files when uploading from the local disk, based on the file extension or content (if no extension is specified).

The built-in lookup table is small, but on Unix, it's augmented by the local system's mime.types file(s) if available under one or more of these names:

- /etc/mime.types
- /etc/apache2/mime.types
- /etc/apache/mime.types

On Windows, MIME types are extracted from the registry. This feature can be turned off with the help of a flag. Refer to the flag section.

If you set an environment variable by using the command line, that variable will be readable in your command line history. Consider clearing variables that contain credentials from your command line history.  To keep variables from appearing in your history, you can use a script to prompt the user for their credentials, and to set the environment variable.

```azcopy
azcopy copy [source] [destination] [flags]
```

## Related conceptual articles

- [Get started with AzCopy](storage-use-azcopy-v10.md)
- [Transfer data with AzCopy and Blob storage](./storage-use-azcopy-v10.md#transfer-data)
- [Transfer data with AzCopy and file storage](storage-use-azcopy-files.md)

## Examples

Upload a single file by using OAuth authentication. If you haven't yet logged into AzCopy, run the azcopy login command before you run the following command.

`azcopy cp "/path/to/file.txt" "https://[account].blob.core.windows.net/[container]/[path/to/blob]"`

Same as above, but this time also compute MD5 hash of the file content and save it as the blob's Content-MD5 property:

`azcopy cp "/path/to/file.txt" "https://[account].blob.core.windows.net/[container]/[path/to/blob]" --put-md5`

Upload a single file by using a SAS token:

`azcopy cp "/path/to/file.txt" "https://[account].blob.core.windows.net/[container]/[path/to/blob]?[SAS]"`

Upload a single file by using a SAS token and piping (block blobs only):
  
`cat "/path/to/file.txt" | azcopy cp "https://[account].blob.core.windows.net/[container]/[path/to/blob]?[SAS]" --from-to PipeBlob`

Upload a single file by using OAuth and piping (block blobs only):

`cat "/path/to/file.txt" | azcopy cp "https://[account].blob.core.windows.net/[container]/[path/to/blob]" --from-to PipeBlob`

Upload an entire directory by using a SAS token:
  
`azcopy cp "/path/to/dir" "https://[account].blob.core.windows.net/[container]/[path/to/directory]?[SAS]" --recursive=true`

or

`azcopy cp "/path/to/dir" "https://[account].blob.core.windows.net/[container]/[path/to/directory]?[SAS]" --recursive=true --put-md5`

Upload a set of files by using a SAS token and wildcard (*) characters:

`azcopy cp "/path/*foo/*bar/*.pdf" "https://[account].blob.core.windows.net/[container]/[path/to/directory]?[SAS]"`

Upload files and directories by using a SAS token and wildcard (*) characters:

`azcopy cp "/path/*foo/*bar*" "https://[account].blob.core.windows.net/[container]/[path/to/directory]?[SAS]" --recursive=true`

Upload files and directories to Azure Storage account and set the query-string encoded tags on the blob.

- To set tags {key = "bla bla", val = "foo"} and {key = "bla bla 2", val = "bar"}, use the following syntax:
- `azcopy cp "/path/*foo/*bar*" "https://[account].blob.core.windows.net/[container]/[path/to/directory]?[SAS]" --blob-tags="bla%20bla=foo&bla%20bla%202=bar"`
- Keys and values are URL encoded and the key-value pairs are separated by an ampersand('&')
- While setting tags on the blobs, there are more permissions('t' for tags) in SAS without which the service will give authorization error back.

Download a single file by using OAuth authentication. If you haven't yet logged into AzCopy, run the azcopy login command before you run the following command.

`azcopy cp "https://[account].blob.core.windows.net/[container]/[path/to/blob]" "/path/to/file.txt"`

Download a single file by using a SAS token:

`azcopy cp "https://[account].blob.core.windows.net/[container]/[path/to/blob]?[SAS]" "/path/to/file.txt"`

Download a single file by using a SAS token and then piping the output to a file (block blobs only):
  
`azcopy cp "https://[account].blob.core.windows.net/[container]/[path/to/blob]?[SAS]" --from-to BlobPipe > "/path/to/file.txt"`

Download a single file by using OAuth and then piping the output to a file (block blobs only):
  
`azcopy cp "https://[account].blob.core.windows.net/[container]/[path/to/blob]" --from-to BlobPipe > "/path/to/file.txt"`

Download an entire directory by using a SAS token:
  
`azcopy cp "https://[account].blob.core.windows.net/[container]/[path/to/directory]?[SAS]" "/path/to/dir" --recursive=true`

A note about using a wildcard character (*) in URLs:

There's only two supported ways to use a wildcard character in a URL.

- You can use one just after the final forward slash (/) of a URL. This copies all of the files in a directory directly to the destination without placing them into a subdirectory.

- You can also use one in the name of a container as long as the URL refers only to a container and not to a blob. You can use this approach to obtain files from a subset of containers.

Download the contents of a directory without copying the containing directory itself.

`azcopy cp "https://[srcaccount].blob.core.windows.net/[container]/[path/to/folder]/*?[SAS]" "/path/to/dir"`

Download an entire storage account.

`azcopy cp "https://[srcaccount].blob.core.windows.net/" "/path/to/dir" --recursive`

Download a subset of containers within a storage account by using a wildcard symbol (*) in the container name.

`azcopy cp "https://[srcaccount].blob.core.windows.net/[container*name]" "/path/to/dir" --recursive`

Download all the versions of a blob from Azure Storage to local directory. Ensure that source is a valid blob, destination is a local folder and `versionidsFile` which takes in a path to the file where each version is written on a separate line. All the specified versions will get downloaded in the destination folder specified.

`azcopy cp "https://[srcaccount].blob.core.windows.net/[containername]/[blobname]" "/path/to/dir" --list-of-versions="/another/path/to/dir/[versionidsFile]"`

Copy a single blob to another blob by using a SAS token.

`azcopy cp "https://[srcaccount].blob.core.windows.net/[container]/[path/to/blob]?[SAS]" "https://[destaccount].blob.core.windows.net/[container]/[path/to/blob]?[SAS]"`

Copy a single blob to another blob by using a SAS token and an OAuth token.

`azcopy cp "https://[srcaccount].blob.core.windows.net/[container]/[path/to/blob]" "https://[destaccount].blob.core.windows.net/[container]/[path/to/blob]"`

Copy one blob virtual directory to another by using a SAS token:

`azcopy cp "https://[srcaccount].blob.core.windows.net/[container]/[path/to/directory]?[SAS]" "https://[destaccount].blob.core.windows.net/[container]/[path/to/directory]?[SAS]" --recursive=true`

Copy all blob containers, directories, and blobs from storage account to another by using a SAS token:

`azcopy cp "https://[srcaccount].blob.core.windows.net?[SAS]" "https://[destaccount].blob.core.windows.net?[SAS]" --recursive=true`

Copy a single object to Blob Storage from Amazon Web Services (AWS) S3 by using an access key and a SAS token. First, set the environment variable AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY for AWS S3 source.
  
`azcopy cp "https://s3.amazonaws.com/[bucket]/[object]" "https://[destaccount].blob.core.windows.net/[container]/[path/to/blob]?[SAS]"`

Copy an entire directory to Blob Storage from AWS S3 by using an access key and a SAS token. First, set the environment variable AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY for AWS S3 source.

`azcopy cp "https://s3.amazonaws.com/[bucket]/[folder]" "https://[destaccount].blob.core.windows.net/[container]/[path/to/directory]?[SAS]" --recursive=true`

Refer to https://docs.aws.amazon.com/AmazonS3/latest/user-guide/using-folders.html to better understand the [folder] placeholder.

Copy all buckets to Blob Storage from Amazon Web Services (AWS) by using an access key and a SAS token. First, set the environment variable AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY for AWS S3 source.

`azcopy cp "https://s3.amazonaws.com/" "https://[destaccount].blob.core.windows.net?[SAS]" --recursive=true`

Copy all buckets to Blob Storage from an Amazon Web Services (AWS) region by using an access key and a SAS token. First, set the environment variable AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY for AWS S3 source.

`azcopy cp "https://s3-[region].amazonaws.com/" "https://[destaccount].blob.core.windows.net?[SAS]" --recursive=true`

Copy a subset of buckets by using a wildcard symbol (*) in the bucket name. Like the previous examples, you need an access key and a SAS token. Make sure to set the environment variable AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY for AWS S3 source.

`azcopy cp "https://s3.amazonaws.com/[bucket*name]/" "https://[destaccount].blob.core.windows.net?[SAS]" --recursive=true`

Copy blobs from one blob storage to another and preserve the tags from source. To preserve tags, use the following syntax:

`azcopy cp "https://[account].blob.core.windows.net/[source_container]/[path/to/directory]?[SAS]" "https://[account].blob.core.windows.net/[destination_container]/[path/to/directory]?[SAS]" --s2s-preserve-blob-tags=true`

Transfer files and directories to Azure Storage account and set the given query-string encoded tags on the blob.

- To set tags {key = "bla bla", val = "foo"} and {key = "bla bla 2", val = "bar"}, use the following syntax:

  `azcopy cp "https://[account].blob.core.windows.net/[source_container]/[path/to/directory]?[SAS]" "https://[account].blob.core.windows.net/[destination_container]/[path/to/directory]?[SAS]" --blob-tags="bla%20bla=foo&bla%20bla%202=bar"`

- Keys and values are URL encoded and the key-value pairs are separated by an ampersand('&')

- While setting tags on the blobs, there are additional permissions('t' for tags) in SAS without which the service will give authorization error back.

Copy a single object to Blob Storage from Google Cloud Storage (GCS) by using a service account key and a SAS token. First, set the environment variable GOOGLE_APPLICATION_CREDENTIALS for GCS source.
  
`azcopy cp "https://storage.cloud.google.com/[bucket]/[object]" "https://[destaccount].blob.core.windows.net/[container]/[path/to/blob]?[SAS]"`

Copy an entire directory to Blob Storage from Google Cloud Storage (GCS) by using a service account key and a SAS token. First, set the environment variable GOOGLE_APPLICATION_CREDENTIALS for GCS source.

`azcopy cp "https://storage.cloud.google.com/[bucket]/[folder]" "https://[destaccount].blob.core.windows.net/[container]/[path/to/directory]?[SAS]" --recursive=true`

Copy an entire bucket to Blob Storage from Google Cloud Storage (GCS) by using a service account key and a SAS token. First, set the environment variable GOOGLE_APPLICATION_CREDENTIALS for GCS source.

`azcopy cp "https://storage.cloud.google.com/[bucket]" "https://[destaccount].blob.core.windows.net/?[SAS]" --recursive=true`

Copy all buckets to Blob Storage from Google Cloud Storage (GCS) by using a service account key and a SAS token. First, set the environment variables GOOGLE_APPLICATION_CREDENTIALS and `GOOGLE_CLOUD_PROJECT=<project-id>` for GCS source

`azcopy cp "https://storage.cloud.google.com/" "https://[destaccount].blob.core.windows.net/?[SAS]" --recursive=true`

Copy a subset of buckets by using a wildcard symbol (*) in the bucket name from Google Cloud Storage (GCS) by using a service account key and a SAS token for destination. First, set the environment variables `GOOGLE_APPLICATION_CREDENTIALS and GOOGLE_CLOUD_PROJECT=<project-id>` for GCS source

`azcopy cp "https://storage.cloud.google.com/[bucket*name]/" "https://[destaccount].blob.core.windows.net/?[SAS]" --recursive=true`

## Options

`--as-subdir` True by default.    Places folder sources as subdirectories under the destination. (default true)

`--backup`    Activates Windows' SeBackupPrivilege for uploads, or SeRestorePrivilege for downloads, to allow AzCopy to see read all files, regardless of their file system permissions, and to restore all permissions. Requires that the account running AzCopy already has these permissions (for example, has Administrator rights or is a member of the 'Backup Operators' group). This flag activates privileges that the account already has

`--blob-tags`    (string)    Set tags on blobs to categorize data in your storage account

`--blob-type`    (string)    Defines the type of blob at the destination. This is used for uploading blobs and when copying between accounts (default 'Detect'). Valid values include 'Detect', 'BlockBlob', 'PageBlob', and 'AppendBlob'. When copying between accounts, a value of 'Detect' causes AzCopy to use the type of source blob to determine the type of the destination blob. When uploading a file, 'Detect' determines if the file is a VHD or a VHDX file based on the file extension. If the file is either a VHD or VHDX file, AzCopy treats the file as a page blob. (default "Detect")

`--block-blob-tier`    (string)    upload block blob to Azure Storage using this blob tier. (default "None")

`--block-size-mb`    (float)    Use this block size (specified in MiB) when uploading to Azure Storage, and downloading from Azure Storage. The default value is automatically calculated based on file size. Decimal fractions are allowed (For example: 0.25). When uploading or downloading, the maximum allowed block size is 0.75 * AZCOPY_BUFFER_GB. To learn more, see [Optimize memory use](storage-use-azcopy-optimize.md#optimize-memory-use).

`--cache-control`    (string)    Set the cache-control header. Returned on download.

`--check-length`    Check the length of a file on the destination after the transfer. If there's a mismatch between source and destination, the transfer is marked as failed. (default true)

`--check-md5`    (string)    Specifies how strictly MD5 hashes should be validated when downloading. Only available when downloading. Available options: NoCheck, LogOnly, FailIfDifferent, FailIfDifferentOrMissing. (default 'FailIfDifferent') (default "FailIfDifferent")

`--content-disposition`    (string)    Set the content-disposition header. Returned on download.

`--content-encoding`    (string)    Set the content-encoding header. Returned on download.

`--content-language`    (string)    Set the content-language header. Returned on download.

`--content-type`   (string)    Specifies the content type of the file. Implies no-guess-mime-type. Returned on download.

`--cpk-by-name`    (string)    Client provided key by name that gives clients making requests against Azure Blob storage an option to provide an encryption key on a per-request basis. Provided key name is fetched from Azure Key Vault and is used to encrypt the data

`--cpk-by-value`    Client provided key by name that lets clients making requests against Azure Blob storage an option to provide an encryption key on a per-request basis. Provided key and its hash is fetched from environment variables

`--decompress`    Automatically decompress files when downloading, if their content-encoding indicates that they're compressed. The supported content-encoding values are 'gzip' and 'deflate'. File extensions of '.gz'/'.gzip' or '.zz' aren't necessary, but is removed if present.

`--disable-auto-decoding`    False by default to enable automatic decoding of illegal chars on Windows. Can be set to true to disable automatic decoding.

`--dry-run`    Prints the file paths that would be copied by this command. This flag doesn't copy the actual files. The --overwrite flag has no effect. If you set the --overwrite flag to false, files in the source directory are listed even if those files exist in the destination directory.

`--exclude-attributes`    (string)    (Windows only) Exclude files whose attributes match the attribute list. For example: A;S;R

`--exclude-blob-type`    (string)    Optionally specifies the type of blob (BlockBlob/ PageBlob/ AppendBlob) to exclude when copying blobs from the container or the account. Use of this flag isn't applicable for copying data from non azure-service to service. More than one blob should be separated by ';'.

`--exclude-path`    (string)    Exclude these paths when copying. This option doesn't support wildcard characters (*). Checks relative path prefix(For example: myFolder;myFolder/subDirName/file.pdf). When used in combination with account traversal, paths don't include the container name.

`--exclude-pattern`    (string)    Exclude these files when copying. This option supports wildcard characters (*)

`--exclude-regex`    (string)    Exclude all the relative path of the files that align with regular expressions. Separate regular expressions with ';'.

`--follow-symlinks`    Follow symbolic links when uploading from local file system.

`--force-if-read-only`    When overwriting an existing file on Windows or Azure Files, force the overwrite to work even if the existing file has its read-only attribute set

`--from-to`    (string)    Optionally specifies the source destination combination. For Example: LocalBlob, BlobLocal, LocalBlobFS. Piping: BlobPipe, PipeBlob

`-h`, `--help`    help for copy

`--include-after`    (string)    Include only those files modified on or after the given date/time. The value should be in ISO8601 format. If no timezone is specified, the value is assumed to be in the local timezone of the machine running AzCopy. E.g.,  `2020-08-19T15:04:00Z` for a UTC time, or `2020-08-19` for midnight (00:00) in the local timezone. As of AzCopy 10.5, this flag applies only to files, not folders, so folder properties won't be copied when using this flag with `--preserve-smb-info` or `--preserve-smb-permissions`.

`--include-attributes`    (string)    (Windows only) Include files whose attributes match the attribute list. For example: A;S;R

`--include-before`    (string)    Include only those files modified before or on the given date/time. The value should be in ISO8601 format. If no timezone is specified, the value is assumed to be in the local timezone of the machine running AzCopy. for example, `2020-08-19T15:04:00Z` for a UTC time, or `2020-08-19` for midnight (00:00) in the local timezone. As of AzCopy 10.7, this flag applies only to files, not folders, so folder properties won't be copied when using this flag with `--preserve-smb-info` or `--preserve-smb-permissions`.

`--include-directory-stub`    False by default to ignore directory stubs. Directory stubs are blobs with metadata `hdi_isfolder:true`. Setting value to true will preserve directory stubs during transfers.

`--include-path` (string)    Include only these paths when copying. This option doesn't support wildcard characters (*). Checks relative path prefix (For example: myFolder;myFolder/subDirName/file.pdf).

`--include-pattern`    (string)    Include only these files when copying. This option supports wildcard characters (*). Separate files by using a ';'.

`--include-regex`    (string)    Include only the relative path of the files that align with regular expressions. Separate regular expressions with ';'.

`--list-of-versions`    (string)    Specifies a file where each version ID is listed on a separate line. Ensure that the source must point to a single blob and all the version IDs specified in the file using this flag must belong to the source blob only. AzCopy will download the specified versions in the destination folder provided.

`--log-level` (string)    Define the log verbosity for the log file, available levels: INFO(all requests/responses), WARNING(slow responses), ERROR(only failed requests), and NONE(no output logs). (default 'INFO'). (default "INFO")

`--metadata` (string)    Upload to Azure Storage with these key-value pairs as metadata.

`--no-guess-mime-type`    Prevents AzCopy from detecting the content-type based on the extension or content of the file.

`--overwrite`    (string)    Overwrite the conflicting files and blobs at the destination if this flag is set to true. (default 'true') Possible values include 'true', 'false', 'prompt', and 'ifSourceNewer'. For destinations that support folders, conflicting folder-level properties are overwritten if this flag is 'true' or if a positive response is provided to the prompt. (default "true")

`--page-blob-tier`    (string)    Upload page blob to Azure Storage using this blob tier. (default 'None'). (default "None")

`--preserve-last-modified-time`    Only available when destination is file system.

`--preserve-owner`    Only has an effect in downloads, and only when `--preserve-smb-permissions` is used. If true (the default), the file Owner and Group are preserved in downloads. If set to false, 

`--preserve-smb-permissions` will still preserve ACLs but Owner and Group is based on the user running AzCopy (default true)

`--preserve-permissions`    False by default. Preserves ACLs between aware resources (Windows and Azure Files, or Azure Data Lake Storage Gen2 to Azure Data Lake Storage Gen2). For Hierarchical Namespace accounts, you'll need a container SAS or OAuth token with Modify Ownership and Modify Permissions permissions. For downloads, you'll also need the `--backup` flag to restore permissions where the new Owner won't be the user running AzCopy. This flag applies to both files and folders, unless a file-only filter is specified (for example, include-pattern).

`--preserve-smb-info`    For SMB-aware locations, flag is set to true by default. Preserves SMB property info (last write time, creation time, attribute bits) between SMB-aware resources (Windows and Azure Files). Only the attribute bits supported by Azure Files are transferred; any others are ignored. This flag applies to both files and folders, unless a file-only filter is specified (for example, include-pattern). The info transferred for folders is the same as that for files, except for `Last Write Time` which is never preserved for folders. (default true)

`--put-md5`    Create an MD5 hash of each file, and save the hash as the Content-MD5 property of the destination blob or file. (By default the hash is NOT created.) Only available when uploading.

`--recursive`    Look into subdirectories recursively when uploading from local file system.

`--s2s-detect-source-changed`    Detect if the source file/blob changes while it's being read. (This parameter only applies to service-to-service copies, because the corresponding check is permanently enabled for uploads and downloads.)

`--s2s-handle-invalid-metadata`   (string)    Specifies how invalid metadata keys are handled. Available options: ExcludeIfInvalid, FailIfInvalid, RenameIfInvalid. (default 'ExcludeIfInvalid'). (default "ExcludeIfInvalid")

`--s2s-preserve-access-tier`    Preserve access tier during service to service copy. Refer to [Azure Blob storage: hot, cool, and archive access tiers](/azure/storage/blobs/storage-blob-storage-tiers) to ensure destination storage account supports setting access tier. In the cases that setting access tier isn't supported, make sure to use s2sPreserveAccessTier=false to bypass copying access tier. (default true).  (default true)

`--s2s-preserve-blob-tags`    Preserve index tags during service to service transfer from one blob storage to another

`--s2s-preserve-properties`    Preserve full properties during service to service copy. For AWS S3 and Azure File non-single file source, the list operation doesn't return full properties of objects and files. To 
preserve full properties, AzCopy needs to send one more request per object or file. (default true)

## Options inherited from parent commands

`--cap-mbps`    (float)    Caps the transfer rate, in megabits per second. Moment-by-moment throughput might vary slightly from the cap. If this option is set to zero, or it's omitted, the throughput isn't capped.

`--output-type`    (string)    Format of the command's output. The choices include: text, json. The default value is 'text'. (default "text")

`--trusted-microsoft-suffixes`    (string)    Specifies additional domain suffixes where Azure Active Directory login tokens may be sent.  The default is '*.core.windows.net;*.core.chinacloudapi.cn;*.core.cloudapi.de;*.core.usgovcloudapi.net;*.storage.azure.net'. Any listed here are added to the default. For security, you should only put Microsoft Azure domains here. Separate multiple entries with semi-colons.

## See also

- [azcopy](storage-ref-azcopy.md)
