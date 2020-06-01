---
title: azcopy copy| Microsoft Docs
description: This article provides reference information for the azcopy copy command.
author: normesta
ms.service: storage
ms.topic: reference
ms.date: 04/10/2020
ms.author: normesta
ms.subservice: common
ms.reviewer: zezha-msft
---

# azcopy copy

Copies source data to a destination location.

## Synopsis

Copies source data to a destination location. The supported directions are:

  - local <-> Azure Blob (SAS or OAuth authentication)
  - local <-> Azure Files (Share/directory SAS authentication)
  - local <-> ADLS Gen 2 (SAS, OAuth, or SharedKey authentication)
  - Azure Blob (SAS or public) -> Azure Blob (SAS or OAuth authentication)
  - Azure Blob (SAS or public) -> Azure Files (SAS)
  - Azure Files (SAS) -> Azure Files (SAS)
  - Azure Files (SAS) -> Azure Blob (SAS or OAuth authentication)
  - AWS S3 (Access Key) -> Azure Block Blob (SAS or OAuth authentication)

Please refer to the examples for more information.

## Related conceptual articles

- [Get started with AzCopy](storage-use-azcopy-v10.md)
- [Transfer data with AzCopy and Blob storage](storage-use-azcopy-blobs.md)
- [Transfer data with AzCopy and file storage](storage-use-azcopy-files.md)
- [Configure, optimize, and troubleshoot AzCopy](storage-use-azcopy-configure.md)

## Advanced

AzCopy automatically detects the content type of the files when uploading from the local disk, based on the file extension or content (if no extension is specified).

The built-in lookup table is small, but on Unix, it is augmented by the local system's mime.types file(s) if available under one or more of these names:

- /etc/mime.types
- /etc/apache2/mime.types
- /etc/apache/mime.types

On Windows, MIME types are extracted from the registry. This feature can be turned off with the help of a flag. Please refer to the flag section.

If you set an environment variable by using the command line, that variable will be readable in your command line history. Consider clearing variables that contain credentials from your command line history. To keep variables from appearing in your history, you can use a script to prompt the user for their credentials, and to set the environment variable.

```
azcopy copy [source] [destination] [flags]
```

## Examples

Upload a single file by using OAuth authentication. If you have not yet logged into AzCopy, please run the azcopy login command before you run the following command.

- azcopy cp "/path/to/file.txt" "https://[account].blob.core.windows.net/[container]/[path/to/blob]"

Same as above, but this time also compute MD5 hash of the file content and save it as the blob's Content-MD5 property:

- azcopy cp "/path/to/file.txt" "https://[account].blob.core.windows.net/[container]/[path/to/blob]" --put-md5

Upload a single file by using a SAS token:

- azcopy cp "/path/to/file.txt" "https://[account].blob.core.windows.net/[container]/[path/to/blob]?[SAS]"

Upload a single file by using a SAS token and piping (block blobs only):
  
- cat "/path/to/file.txt" | azcopy cp "https://[account].blob.core.windows.net/[container]/[path/to/blob]?[SAS]"

Upload an entire directory by using a SAS token:
  
- azcopy cp "/path/to/dir" "https://[account].blob.core.windows.net/[container]/[path/to/directory]?[SAS]" --recursive=true

or

- azcopy cp "/path/to/dir" "https://[account].blob.core.windows.net/[container]/[path/to/directory]?[SAS]" --recursive=true --put-md5

Upload a set of files by using a SAS token and wildcard (*) characters:

- azcopy cp "/path/*foo/*bar/*.pdf" "https://[account].blob.core.windows.net/[container]/[path/to/directory]?[SAS]"

Upload files and directories by using a SAS token and wildcard (*) characters:

- azcopy cp "/path/*foo/*bar*" "https://[account].blob.core.windows.net/[container]/[path/to/directory]?[SAS]" --recursive=true

Download a single file by using OAuth authentication. If you have not yet logged into AzCopy, please run the azcopy login command before you run the following command.

- azcopy cp "https://[account].blob.core.windows.net/[container]/[path/to/blob]" "/path/to/file.txt"

Download a single file by using a SAS token:

- azcopy cp "https://[account].blob.core.windows.net/[container]/[path/to/blob]?[SAS]" "/path/to/file.txt"

Download a single file by using a SAS token and then piping the output to a file (block blobs only):
  
- azcopy cp "https://[account].blob.core.windows.net/[container]/[path/to/blob]?[SAS]" > "/path/to/file.txt"

Download an entire directory by using a SAS token:
  
- azcopy cp "https://[account].blob.core.windows.net/[container]/[path/to/directory]?[SAS]" "/path/to/dir" --recursive=true

A note about using a wildcard character (*) in URLs:

There's only two supported ways to use a wildcard character in a URL. 

- You can use one just after the final forward slash (/) of a URL. This copies all of the files in a directory directly to the destination without placing them into a subdirectory.

- You can also use one in the name of a container as long as the URL refers only to a container and not to a blob. You can use this approach to obtain files from a subset of containers.

Download the contents of a directory without copying the containing directory itself.

- azcopy cp "https://[srcaccount].blob.core.windows.net/[container]/[path/to/folder]/*?[SAS]" "/path/to/dir"

Download an entire storage account.

- azcopy cp "https://[srcaccount].blob.core.windows.net/" "/path/to/dir" --recursive

Download a subset of containers within a storage account by using a wildcard symbol (*) in the container name.

- azcopy cp "https://[srcaccount].blob.core.windows.net/[container*name]" "/path/to/dir" --recursive

Copy a single blob to another blob by using a SAS token.

- azcopy cp "https://[srcaccount].blob.core.windows.net/[container]/[path/to/blob]?[SAS]" "https://[destaccount].blob.core.windows.net/[container]/[path/to/blob]?[SAS]"

Copy a single blob to another blob by using a SAS token and an OAuth token. You have to use a SAS token at the end of the source account URL, but the destination account doesn't need one if you log into AzCopy by using the azcopy login command. 

- azcopy cp "https://[srcaccount].blob.core.windows.net/[container]/[path/to/blob]?[SAS]" "https://[destaccount].blob.core.windows.net/[container]/[path/to/blob]"

Copy one blob virtual directory to another by using a SAS token:

- azcopy cp "https://[srcaccount].blob.core.windows.net/[container]/[path/to/directory]?[SAS]" "https://[destaccount].blob.core.windows.net/[container]/[path/to/directory]?[SAS]" --recursive=true

Copy all blob containers, directories, and blobs from storage account to another by using a SAS token:

- azcopy cp "https://[srcaccount].blob.core.windows.net?[SAS]" "https://[destaccount].blob.core.windows.net?[SAS]" --recursive=true

Copy a single object to Blob Storage from Amazon Web Services (AWS) S3 by using an access key and a SAS token. First, set the environment variable AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY for AWS S3 source.
  
- azcopy cp "https://s3.amazonaws.com/[bucket]/[object]" "https://[destaccount].blob.core.windows.net/[container]/[path/to/blob]?[SAS]"

Copy an entire directory to Blob Storage from AWS S3 by using an access key and a SAS token. First, set the environment variable AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY for AWS S3 source.

- azcopy cp "https://s3.amazonaws.com/[bucket]/[folder]" "https://[destaccount].blob.core.windows.net/[container]/[path/to/directory]?[SAS]" --recursive=true

Please refer to https://docs.aws.amazon.com/AmazonS3/latest/user-guide/using-folders.html to better understand the [folder] placeholder.

Copy all buckets to Blob Storage from Amazon Web Services (AWS) by using an access key and a SAS token. First, set the environment variable AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY for AWS S3 source.

- azcopy cp "https://s3.amazonaws.com/" "https://[destaccount].blob.core.windows.net?[SAS]" --recursive=true

Copy all buckets to Blob Storage from an Amazon Web Services (AWS) region by using an access key and a SAS token. First, set the environment variable AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY for AWS S3 source.

- azcopy cp "https://s3-[region].amazonaws.com/" "https://[destaccount].blob.core.windows.net?[SAS]" --recursive=true

Copy a subset of buckets by using a wildcard symbol (*) in the bucket name. Like the previous examples, you'll need an access key and a SAS token. Make sure to set the environment variable AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY for AWS S3 source.

- azcopy cp "https://s3.amazonaws.com/[bucket*name]/" "https://[destaccount].blob.core.windows.net?[SAS]" --recursive=true

## Options

**--backup**                               Activates Windows' SeBackupPrivilege for uploads, or SeRestorePrivilege for downloads, to allow AzCopy to see read all files, regardless of their file system permissions, and to restore all permissions. Requires that the account running AzCopy already has these permissions (e.g. has administrator rights or is a member of the 'Backup Operators' group). All this flag does is activate privileges that the account already has.

**--blob-type** string                     Defines the type of blob at the destination. This is used for uploading blobs and when copying between accounts (default 'Detect'). Valid values include 'Detect', 'BlockBlob', 'PageBlob', and 'AppendBlob'. When copying between accounts, a value of 'Detect' causes AzCopy to use the type of source blob to determine the type of the destination blob. When uploading a file, 'Detect' determines if the file is a VHD or a VHDX file based on the file extension. If the file is ether a VHD or VHDX file, AzCopy treats the file as a page blob. (default "Detect")

**--block-blob-tier** string               Upload block blobs directly to the [access tier](../blobs/storage-blob-storage-tiers.md) of your choice. (default 'None'). Valid values include 'None', 'Hot', 'Cool', and 'Archive'. If 'None' or no tier is passed, the blob will inherit the tier of the storage account.

**--block-size-mb** float                  Use this block size (specified in MiB) when uploading to Azure Storage, and downloading from Azure Storage. The default value is automatically calculated based on file size. Decimal fractions are allowed (For example: 0.25).

**--cache-control** string                 Set the cache-control header. Returned on download.

**--check-length**                         Check the length of a file on the destination after the transfer. If there is a mismatch between source and destination, the transfer is marked as failed. (default true)

**--check-md5** string                     Specifies how strictly MD5 hashes should be validated when downloading. Only available when downloading. Available options: NoCheck, LogOnly, FailIfDifferent, FailIfDifferentOrMissing. (default "FailIfDifferent")

**--content-disposition** string           Set the content-disposition header. Returned on download.

**--content-encoding** string              Set the content-encoding header. Returned on download.

**--content-language** string              Set the content-language header. Returned on download.

**--content-type** string                  Specifies the content type of the file. Implies no-guess-mime-type. Returned on download.

**--decompress**                           Automatically decompress files when downloading, if their content-encoding indicates that they are compressed. The supported content-encoding values are 'gzip' and 'deflate'. File extensions of '.gz'/'.gzip' or '.zz' aren't necessary, but will be removed if present.

**--exclude-attributes** string            (Windows only) Exclude files whose attributes match the attribute list. For example: A;S;R

**--exclude-blob-type** string             Optionally specifies the type of blob (BlockBlob/ PageBlob/ AppendBlob) to exclude when copying blobs from the container or the account. Use of this flag is not applicable for copying data from non azure-service to service. More than one blob should be separated by ';'.

**--exclude-path** string                  Exclude these paths when copying. This option does not support wildcard characters (*). Checks relative path prefix(For example: myFolder;myFolder/subDirName/file.pdf). When used in combination with account traversal, paths do not include the container name.

**--exclude-pattern** string               Exclude these files when copying. This option supports wildcard characters (*)

**--follow-symlinks**                      Follow symbolic links when uploading from local file system.

**--from-to** string                       Optionally specifies the source destination combination. For Example: LocalBlob, BlobLocal, LocalBlobFS.

**-h, --help**                                 help for copy

**--include-attributes** string            (Windows only) Include files whose attributes match the attribute list. For example: A;S;R

**--include-path** string                  Include only these paths when copying. This option does not support wildcard characters (*). Checks relative path prefix (For example: myFolder;myFolder/subDirName/file.pdf).

**--include-pattern** string               Include only these files when copying. This option supports wildcard characters (*). Separate files by using a ';'.

**--log-level** string                     Define the log verbosity for the log file, available levels: INFO(all requests/responses), WARNING(slow responses), ERROR(only failed requests), and NONE(no output logs). (default "INFO")

**--metadata** string                      Upload to Azure Storage with these key-value pairs as metadata.

**--no-guess-mime-type**                   Prevents AzCopy from detecting the content-type based on the extension or content of the file.

**--overwrite** string                     Overwrite the conflicting files and blobs at the destination if this flag is set to true. Possible values include 'true', 'false', 'ifSourceNewer', and 'prompt'. (default "true")

**--page-blob-tier** string                Upload page blob to Azure Storage using this blob tier. (default "None")

**--preserve-last-modified-time**          Only available when destination is file system.

**--preserve-smb-permissions** string      False by default. Preserves SMB ACLs between aware resources (Windows and Azure Files). For downloads, you will also need to use the `--backup` flag to restore permissions where the new Owner will not be the user that is running AzCopy. This flag applies to both files and folders, unless a file-only filter is specified (e.g. `include-pattern`).

**--preserve-smb-info** string             False by default. Preserves SMB property info (last write time, creation time, attribute bits) between SMB-aware resources (Windows and Azure Files). Only the attribute bits supported by Azure Files will be transferred; any others will be ignored. This flag applies to both files and folders, unless a file-only filter is specified (e.g. include-pattern). The information transferred for folders is the same as that for files, except for Last Write Time which is never preserved for folders.

**--preserve-owner**                       Only has an effect in when downloading data, and only when the `--preserve-smb-permissions` is used. If true (the default), the file Owner and Group are preserved in downloads. If this flag is set to false, `--preserve-smb-permissions` will still preserve ACLs but Owner and Group will be based on the user that is running AzCopy.

**--put-md5**                             Create an MD5 hash of each file, and save the hash as the Content-MD5 property of the destination blob or file. (By default the hash is NOT created.) Only available when uploading.

**--recursive**                            Look into sub-directories recursively when uploading from local file system.

**--s2s-detect-source-changed**           Check if source has changed after enumerating.

**--s2s-handle-invalid-metadata** string   Specifies how invalid metadata keys are handled. Available options: ExcludeIfInvalid, FailIfInvalid, RenameIfInvalid. (default "ExcludeIfInvalid")

**--s2s-preserve-access-tier**             Preserve access tier during service to service copy. Please refer to [Azure Blob storage: hot, cool, and archive access tiers](https://docs.microsoft.com/azure/storage/blobs/storage-blob-storage-tiers) to ensure destination storage account supports setting access tier. In the cases that setting access tier is not supported, please use s2sPreserveAccessTier=false to bypass copying access tier. (default true)

**--s2s-preserve-properties**              Preserve full properties during service to service copy. For AWS S3 and Azure File non-single file source, the list operation doesn't return full properties of objects and files. To preserve full properties, AzCopy needs to send one additional request per object or file. (default true)

## Options inherited from parent commands

**--cap-mbps uint32**      Caps the transfer rate, in megabits per second. Moment-by-moment throughput might vary slightly from the cap. If this option is set to zero, or it is omitted, the throughput isn't capped.

**--output-type** string   Format of the command's output. The choices include: text, json. The default value is 'text'. (default "text")

**--trusted-microsoft-suffixes** string   Specifies additional domain suffixes where Azure Active Directory login tokens may be sent.  The default is '*.core.windows.net;*.core.chinacloudapi.cn;*.core.cloudapi.de;*.core.usgovcloudapi.net'. Any listed here are added to the default. For security, you should only put Microsoft Azure domains here. Separate multiple entries with semi-colons.

## See also

- [azcopy](storage-ref-azcopy.md)
