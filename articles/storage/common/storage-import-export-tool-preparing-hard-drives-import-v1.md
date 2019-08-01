---
title: Preparing hard drives for an Azure Import/Export import job - v1 | Microsoft Docs
description: Learn how to prepare hard drives using the WAImportExport v1 tool to create an import job for the Azure Import/Export service.
author: muralikk
services: storage
ms.service: storage
ms.topic: article
ms.date: 01/15/2017
ms.author: muralikk
ms.subservice: common
---

# Preparing hard drives for an import job
To prepare one or more hard drives for an import job, follow these steps:

- Identify the data to import into the Blob service

- Identify target virtual directories and blobs in the Blob service

- Determine how many drives you'll need

- Copy the data to each of your hard drives

  For a sample workflow, see [Sample Workflow to Prepare Hard Drives for an Import Job](storage-import-export-tool-sample-preparing-hard-drives-import-job-workflow-v1.md).

## Identify the data to be imported
 The first step to creating an import job is to determine which directories and files you are going to import. This can be a list of directories, a list of unique files, or a combination of those two. When a directory is included, all files in the directory and its subdirectories will be part of the import job.

> [!NOTE]
>  Since subdirectories are included recursively when a parent directory is included, specify only the parent directory. Do not also specify any of its subdirectories.
>
>  Currently, the Microsoft Azure Import/Export Tool has the following limitation: if a directory contains more data than a hard drive can contain, then the directory needs to be broken into smaller directories. For example, if a directory contains 2.5TB of data and the hard drive's capacity is only 2TB, then you need to break the 2.5TB directory into smaller directories. This limitation will be addressed in a later version of the tool.

## Identify the destination locations in the blob service
 For each directory or file that will be imported, you need to identify a destination virtual directory or blob in the Azure Blob service. You will use these targets as inputs to the Azure Import/Export Tool. Note that directories should be delimited with the forward slash character "/".

 The following table shows some examples of blob targets:

|Source file or directory|Destination blob or virtual directory|
|------------------------------|-------------------------------------------|
|H:\Video|https:\//mystorageaccount.blob.core.windows.net/video|
|H:\Photo|https:\//mystorageaccount.blob.core.windows.net/photo|
|K:\Temp\FavoriteVideo.ISO|https:\//mystorageaccount.blob.core.windows.net/favorite/FavoriteVideo.ISO|
|\\\myshare\john\music|https:\//mystorageaccount.blob.core.windows.net/music|

## Determine how many drives are needed
 Next, you need to determine:

- The number of hard drives needed to store the data.

- The directories and/or standalone files that will be copied to each of your hard drive.

  Ensure that you have the number of hard drives you will need to store the data you are transferring.

## Copy data to your hard drive
 This section describes how to call the Azure Import/Export Tool to copy your data to one or more hard drives. Each time you call the Azure Import/Export Tool, you create a new *copy session*. You create at least one copy session for each drive to which you copy data; in some cases, you may need more than one copy session to copy all of your data to single drive. Here are some reasons that you may need multiple copy sessions:

-   You must create a separate copy session for each drive that you copy to.

-   A copy session can copy either a single directory or a single blob to the drive. If you are copying multiple directories, multiple blobs, or a combination of both, you'll need to create multiple copy sessions.

-   You can specify properties and metadata that will be set on the blobs imported as part of an import job. The properties or metadata that you specify for a copy session will apply to all blobs specified by that copy session. If you want to specify different properties or metadata for some blobs, you'll need to create a separate copy session. See [Setting Properties and Metadata during the Import Process](storage-import-export-tool-setting-properties-metadata-import-v1.md)for more information.

> [!NOTE]
>  If you have multiple machines that meet the requirements outlined in [Setting Up the Azure Import/Export Tool](storage-import-export-tool-setup-v1.md), you can copy data to multiple hard drives in parallel by running an instance of this tool on each machine.

 For each hard drive that you prepare with the Azure Import/Export Tool, the tool will create a single journal file. You will need the journal files from all of your drives to create the import job. The journal file can also be used to resume drive preparation if the tool is interrupted.

### Azure Import/Export Tool syntax for an import job
 To prepare drives for an import job, call the Azure Import/Export Tool with the **PrepImport** command. Which parameters you include depends on whether this is the first copy session, or a subsequent copy session.

 The first copy session for a drive requires some additional parameters to specify the storage account key; the target drive letter; whether the drive must be formatted; whether the drive must be encrypted and if so, the BitLocker key; and the log directory. Here is the syntax for an initial copy session to copy a directory or a single file:

 **First copy session to copy a single directory**

 `WAImportExport PrepImport /sk:<StorageAccountKey> /csas:<ContainerSas> /t: <TargetDriveLetter> [/format] [/silentmode] [/encrypt] [/bk:<BitLockerKey>] [/logdir:<LogDirectory>] /j:<JournalFile> /id:<SessionId> /srcdir:<SourceDirectory> /dstdir:<DestinationBlobVirtualDirectory> [/Disposition:<Disposition>] [/BlobType:<BlockBlob|PageBlob>] [/PropertyFile:<PropertyFile>] [/MetadataFile:<MetadataFile>]`

 **First copy session to copy a single file**

 `WAImportExport PrepImport /sk:<StorageAccountKey> /csas:<ContainerSas> /t: <TargetDriveLetter> [/format] [/silentmode] [/encrypt] [/bk:<BitLockerKey>] [/logdir:<LogDirectory>] /j:<JournalFile> /id:<SessionId> /srcfile:<SourceFile> /dstblob:<DestinationBlobPath> [/Disposition:<Disposition>] [/BlobType:<BlockBlob|PageBlob>] [/PropertyFile:<PropertyFile>] [/MetadataFile:<MetadataFile>]`

 In subsequent copy sessions, you do not need to specify the initial parameters. Here is the syntax for a subsequent copy session to copy a directory or a single file:

 **Subsequent copy sessions to copy a single directory**

 `WAImportExport PrepImport /j:<JournalFile> /id:<SessionId> /srcdir:<SourceDirectory> /dstdir:<DestinationBlobVirtualDirectory> [/Disposition:<Disposition>] [/BlobType:<BlockBlob|PageBlob>] [/PropertyFile:<PropertyFile>] [/MetadataFile:<MetadataFile>]`

 **Subsequent copy sessions to copy a single file**

 `WAImportExport PrepImport /j:<JournalFile> /id:<SessionId> /srcfile:<SourceFile> /dstblob:<DestinationBlobPath> [/Disposition:<Disposition>] [/BlobType:<BlockBlob|PageBlob>] [/PropertyFile:<PropertyFile>] [/MetadataFile:<MetadataFile>]`

### Parameters for the first copy session for a hard drive
 Each time you run the Azure Import/Export Tool to copy files to the hard drive, the tool creates a copy session. Each copy session copies a single directory or a single file to a hard drive. The state of the copy session is written to the journal file. If a copy session is interrupted (for example, due to a system power loss), it can be resumed by running the tool again and specifying the journal file on the command line.

> [!WARNING]
>  If you specify the **/format** parameter for the first copy session, the drive will be formatted and all data on the drive will be erased. It's recommended that you use blank drives only for your copy session.

 The command used for the first copy session for each drive requires different parameters than the commands for subsequent copy sessions. The following table lists the additional parameters that are available for the first copy session:

|Command-line parameter|Description|
|-----------------------------|-----------------|
|**/sk:**<StorageAccountKey\>|`Optional.` The storage account key for the storage account to which the data will be imported. You must include either **/sk:**<StorageAccountKey\> or **/csas:**<ContainerSas\> in the command.|
|**/csas:**<ContainerSas\>|`Optional`. The container SAS to use to import data to the storage account. You must include either **/sk:**<StorageAccountKey\> or **/csas:**<ContainerSas\> in the command.<br /><br /> The value for this parameter must begin with the container name, followed by a question mark (?) and the SAS token. For example:<br /><br /> `mycontainer?sv=2014-02-14&sr=c&si=abcde&sig=LiqEmV%2Fs1LF4loC%2FJs9ZM91%2FkqfqHKhnz0JM6bqIqN0%3D&se=2014-11-20T23%3A54%3A14Z&sp=rwdl`<br /><br /> The permissions, whether specified on the URL or in a stored access policy, must include Read, Write, and Delete for import jobs, and Read, Write and List for export jobs.<br /><br /> When this parameter is specified, all blobs to be imported or exported must be within the container specified in the shared access signature.|
|**/t:**<TargetDriveLetter\>|`Required.` The drive letter of the target hard drive for the current copy session, without the trailing colon.|
|**/format**|`Optional.` Specify this parameter when the drive needs to be formatted; otherwise, omit it. Before the tool formats the drive, it will prompt for a confirmation from console. To suppress the confirmation, specify the /silentmode parameter.|
|**/silentmode**|`Optional.` Specify this parameter to suppress the confirmation for formatting the target drive.|
|**/encrypt**|`Optional.` Specified this parameter when the drive has not yet been encrypted with BitLocker and needs to be encrypted by the tool. If the drive has already been encrypted with BitLocker, then omit this parameter and specify the `/bk` parameter, providing the existing BitLocker key.<br /><br /> If you specify the `/format` parameter, then you must also specify the `/encrypt` parameter.|
|**/bk:**<BitLockerKey\>|`Optional.` If `/encrypt` is specified, omit this parameter. If `/encrypt` is omitted, you need to have already have encrypted the drive with BitLocker. Use this parameter to specify the BitLocker key. BitLocker encryption is required for all hard drives for import jobs.|
|**/logdir:**<LogDirectory\>|`Optional.` The log directory specifies a directory to be used to store verbose logs as well as temporary manifest files. If not specified, the current directory will be used as the log directory.|

### Parameters required for all copy sessions
 The journal file contains the status for all copy sessions for a hard drive. It also contains the information needed to create the import job. You must always specify a journal file when running the Azure Import/Export Tool, as well as a copy session ID:

|||
|-|-|
|Command line parameter|Description|
|**/j:**<JournalFile\>|`Required.` The path to the journal file. Each drive must have exactly one journal file. Note that the journal file must not reside on the target drive. The journal file extension is `.jrn`.|
|**/id:**<SessionId\>|`Required.` The session ID identifies a copy session. It is used to ensure accurate recovery of an interrupted copy session. Files that are copied in a copy session are stored in a directory named after the session ID on the target drive.|

### Parameters for copying a single directory
 When copying a single directory, the following required and optional parameters apply:

|Command line parameter|Description|
|----------------------------|-----------------|
|**/srcdir:**<SourceDirectory\>|`Required.` The source directory that contains files to be copied to the target drive. The directory path must be an absolute path (not a relative path).|
|**/dstdir:**<DestinationBlobVirtualDirectory\>|`Required.` The path to the destination virtual directory in your Windows Azure storage account. The virtual directory may or may not already exist.<br /><br /> You can specify a container, or a blob prefix like `music/70s/`. The destination directory must begin with the container name, followed by a forward slash "/", and optionally may include a virtual blob directory that ends with "/".<br /><br /> When the destination container is the root container, you must explicitly specify the root container, including the forward slash, as `$root/`. Since blobs under the root container cannot include "/" in their names, any subdirectories in the source directory will not be copied when the destination directory is the root container.<br /><br /> Be sure to use valid container names when specifying destination virtual directories or blobs. Keep in mind that container names must be lowercase. For container naming rules, see [Naming and Referencing Containers, Blobs, and Metadata](/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata).|
|**/Disposition:**<rename&#124;no-overwrite&#124;overwrite>|`Optional.` Specifies the behavior when a blob with the specified address already exists. Valid values for this parameter are: `rename`, `no-overwrite` and `overwrite`. Note that these values are case-sensitive. If no value is specified, the default is `rename`.<br /><br /> The value specified for this parameter affects all the files in the directory specified by the `/srcdir` parameter.|
|**/BlobType:**<BlockBlob&#124;PageBlob>|`Optional.` Specifies the blob type for the destination blobs. Valid values are: `BlockBlob` and `PageBlob`. Note that these values are case-sensitive. If no value is specified, the default is `BlockBlob`.<br /><br /> In most cases, `BlockBlob` is recommended. If you specify `PageBlob`, the length of each file in the directory must be a multiple of 512, the size of a page for page blobs.|
|**/PropertyFile:**<PropertyFile\>|`Optional.` Path to the property file for the destination blobs. See [Import/Export service Metadata and Properties File Format](../storage-import-export-file-format-metadata-and-properties.md) for more information.|
|**/MetadataFile:**<MetadataFile\>|`Optional.` Path to the metadata file for the destination blobs. See [Import/Export service Metadata and Properties File Format](../storage-import-export-file-format-metadata-and-properties.md) for more information.|

### Parameters for copying a single file
 When copying a single file, the following required and optional parameters apply:

|Command line parameter|Description|
|----------------------------|-----------------|
|**/srcfile:**<SourceFile\>|`Required.` The full path to the file to be copied. The directory path must be an absolute path (not a relative path).|
|**/dstblob:**<DestinationBlobPath\>|`Required.` The path to the destination blob in your Windows Azure storage account. The blob may or may not already exist.<br /><br /> Specify the blob name beginning with the container name. The blob name cannot start with "/" or the storage account name. For blob naming rules, see [Naming and Referencing Containers, Blobs, and Metadata](/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata).<br /><br /> When the destination container is the root container, you must explicitly specify `$root` as the container, such as `$root/sample.txt`. Note that blobs under the root container cannot include "/" in their names.|
|**/Disposition:**<rename&#124;no-overwrite&#124;overwrite>|`Optional.` Specifies the behavior when a blob with the specified address already exists. Valid values for this parameter are: `rename`, `no-overwrite` and `overwrite`. Note that these values are case-sensitive. If no value is specified, the default is `rename`.|
|**/BlobType:**<BlockBlob&#124;PageBlob>|`Optional.` Specifies the blob type for the destination blobs. Valid values are: `BlockBlob` and `PageBlob`. Note that these values are case-sensitive. If no value is specified, the default is `BlockBlob`.<br /><br /> In most cases, `BlockBlob` is recommended. If you specify `PageBlob`, the length of each file in the directory must be a multiple of 512, the size of a page for page blobs.|
|**/PropertyFile:**<PropertyFile\>|`Optional.` Path to the property file for the destination blobs. See [Import/Export service Metadata and Properties File Format](../storage-import-export-file-format-metadata-and-properties.md) for more information.|
|**/MetadataFile:**<MetadataFile\>|`Optional.` Path to the metadata file for the destination blobs. See [Import/Export service Metadata and Properties File Format](../storage-import-export-file-format-metadata-and-properties.md) for more information.|

### Resuming an interrupted copy session
 If a copy session is interrupted for any reason, you can resume it by running the tool with only the journal file specified:

```
WAImportExport.exe PrepImport /j:<JournalFile> /id:<SessionId> /ResumeSession
```

 Only the most recent copy session, if terminated abnormally, can be resumed.

> [!IMPORTANT]
>  When you resume a copy session, do not modify the source data files and directories by adding or removing files.

### Aborting an interrupted copy session
 If a copy session is interrupted and it is not possible to resume (for example, if a source directory proved inaccessible), you must abort the current session so that it can be rolled back and new copy sessions can be started:

```
WAImportExport.exe PrepImport /j:<JournalFile> /id:<SessionId> /AbortSession
```

 Only the last copy session, if terminated abnormally, can be aborted. Note that you cannot abort the first copy session for a drive. Instead you must restart the copy session with a new journal file.

## Next steps

* [Setting Up the Azure Import/Export Tool](storage-import-export-tool-setup-v1.md)
* [Setting properties and metadata during the import process](storage-import-export-tool-setting-properties-metadata-import-v1.md)
* [Sample workflow to prepare hard drives for an import job](storage-import-export-tool-sample-preparing-hard-drives-import-job-workflow-v1.md)
* [Quick reference for frequently used commands](storage-import-export-tool-quick-reference-v1.md) 
* [Reviewing job status with copy log files](storage-import-export-tool-reviewing-job-status-v1.md)
* [Repairing an import job](storage-import-export-tool-repairing-an-import-job-v1.md)
* [Repairing an export job](storage-import-export-tool-repairing-an-export-job-v1.md)
* [Troubleshooting the Azure Import/Export Tool](storage-import-export-tool-troubleshooting-v1.md)
