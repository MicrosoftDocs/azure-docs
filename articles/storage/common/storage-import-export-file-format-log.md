---
title: Azure Import/Export log file format | Microsoft Docs
description: Learn about the format of the log files created when steps are executed for an Import/Export service job.
author: muralikk
services: storage
ms.service: storage
ms.topic: article
ms.date: 01/23/2017
ms.author: muralikk
ms.subservice: common
---
# Azure Import/Export service log file format
When the Microsoft Azure Import/Export service performs an action on a drive as part of an import job or an export job, logs are written to block blobs in the storage account associated with that job.  
  
There are two logs that may be written by the Import/Export service:  
  
-   The error log is always generated in the event of an error.  
  
-   The verbose log is not enabled by default, but may be enabled by setting the `EnableVerboseLog` property on a [Put Job](/rest/api/storageimportexport/jobs) or [Update Job Properties](/rest/api/storageimportexport/jobs) operation.  
  
## Log file location  
The logs are written to block blobs in the container or virtual directory specified by the `ImportExportStatesPath` setting, which you can set on a `Put Job` operation. The location to which the logs are written depends on how authentication is specified for the job, together with the value specified for `ImportExportStatesPath`. Authentication for the job may be specified via a storage account key, or a container SAS (shared access signature).  
  
The name of the container or virtual directory may either be the default name of `waimportexport`, or another container or virtual directory name that you specify.  
  
The table below shows the possible options:  
  
|Authentication Method|Value of `ImportExportStatesPath`Element|Location of Log Blobs|  
|---------------------------|----------------------------------------------|---------------------------|  
|Storage account key|Default value|A container named `waimportexport`, which is the default container. For example:<br /><br /> `https://myaccount.blob.core.windows.net/waimportexport`|  
|Storage account key|User-specified value|A container named by the user. For example:<br /><br /> `https://myaccount.blob.core.windows.net/mylogcontainer`|  
|Container SAS|Default value|A virtual directory named `waimportexport`, which is the default name, beneath the container specified in the SAS.<br /><br /> For example, if the SAS specified for the job is  `https://myaccount.blob.core.windows.net/mylogcontainer?sv=2012-02-12&se=2015-05-22T06%3A54%3A55Z&sr=c&sp=wl&sig=sigvalue`, then the log location would be `https://myaccount.blob.core.windows.net/mylogcontainer/waimportexport`|  
|Container SAS|User-specified value|A virtual directory named by the user, beneath the container specified in the SAS.<br /><br /> For example, if the SAS specified for the job is  `https://myaccount.blob.core.windows.net/mylogcontainer?sv=2012-02-12&se=2015-05-22T06%3A54%3A55Z&sr=c&sp=wl&sig=sigvalue`, and the specified virtual directory is named `mylogblobs`, then the log location would be `https://myaccount.blob.core.windows.net/mylogcontainer/waimportexport/mylogblobs`.|  
  
You can retrieve the URL for the error and verbose logs by calling the [Get Job](/rest/api/storageimportexport/jobs) operation. The logs are available after processing of the drive is complete.  
  
## Log file format  
The format for both logs is the same: a blob containing XML descriptions of the events that occurred while copying blobs between the hard drive and the customer's account.  
  
The verbose log contains complete information about the status of the copy operation for every blob (for an import job) or file (for an export job), whereas the error log contains only the information for blobs or files that encountered errors during the import or export job.  
  
The verbose log format is shown below. The error log has the same structure, but filters out successful operations.  

```xml
<DriveLog Version="2014-11-01">  
  <DriveId>drive-id</DriveId>  
  [<Blob Status="blob-status">  
   <BlobPath>blob-path</BlobPath>  
   <FilePath>file-path</FilePath>  
   [<Snapshot>snapshot</Snapshot>]  
   <Length>length</Length>  
   [<LastModified>last-modified</LastModified>]  
   [<ImportDisposition Status="import-disposition-status">import-disposition</ImportDisposition>]  
   [page-range-list-or-block-list]  
   [metadata-status]  
   [properties-status]  
  </Blob>]  
  [<Blob>  
    . . .  
  </Blob>]  
  <Status>drive-status</Status>  
</DriveLog>  
  
page-range-list-or-block-list ::= 
  page-range-list | block-list  
  
page-range-list ::=   
<PageRangeList>  
      [<PageRange Offset="page-range-offset" Length="page-range-length"   
       [Hash="md5-hash"] Status="page-range-status"/>]  
      [<PageRange Offset="page-range-offset" Length="page-range-length"   
       [Hash="md5-hash"] Status="page-range-status"/>]  
</PageRangeList>  
  
block-list ::=  
<BlockList>  
      [<Block Offset="block-offset" Length="block-length" [Id="block-id"]  
       [Hash="md5-hash"] Status="block-status"/>]  
      [<Block Offset="block-offset" Length="block-length" [Id="block-id"]   
       [Hash="md5-hash"] Status="block-status"/>]  
</BlockList>  
  
metadata-status ::=  
<Metadata Status="metadata-status">  
   [<GlobalPath Hash="md5-hash">global-metadata-file-path</GlobalPath>]  
   [<Path Hash="md5-hash">metadata-file-path</Path>]  
</Metadata>  
  
properties-status ::=  
<Properties Status="properties-status">  
   [<GlobalPath Hash="md5-hash">global-properties-file-path</GlobalPath>]  
   [<Path Hash="md5-hash">properties-file-path</Path>]  
</Properties>  
```

The following table describes the elements of the log file.  
  
|XML Element|Type|Description|  
|-----------------|----------|-----------------|  
|`DriveLog`|XML Element|Represents a drive log.|  
|`Version`|Attribute, String|The version of the log format.|  
|`DriveId`|String|The drive's hardware serial number.|  
|`Status`|String|Status of the drive processing. See the `Drive Status Codes` table below for more information.|  
|`Blob`|Nested XML element|Represents a blob.|  
|`Blob/BlobPath`|String|The URI of the blob.|  
|`Blob/FilePath`|String|The relative path to the file on the drive.|  
|`Blob/Snapshot`|DateTime|The snapshot version of the blob, for an export job only.|  
|`Blob/Length`|Integer|The total length of the blob in bytes.|  
|`Blob/LastModified`|DateTime|The date/time that the blob was last modified, for an export job only.|  
|`Blob/ImportDisposition`|String|The import disposition of the blob, for an import job only.|  
|`Blob/ImportDisposition/@Status`|Attribute, String|The status of the import disposition.|  
|`PageRangeList`|Nested XML element|Represents a list of page ranges for a page blob.|  
|`PageRange`|XML element|Represents a page range.|  
|`PageRange/@Offset`|Attribute, Integer|Starting offset of the page range in the blob.|  
|`PageRange/@Length`|Attribute, Integer|Length in bytes of the page range.|  
|`PageRange/@Hash`|Attribute, String|Base16-encoded MD5 hash of the page range.|  
|`PageRange/@Status`|Attribute, String|Status of processing the page range.|  
|`BlockList`|Nested XML element|Represents a list of blocks for a block blob.|  
|`Block`|XML element|Represents a block.|  
|`Block/@Offset`|Attribute, Integer|Starting offset of the block in the blob.|  
|`Block/@Length`|Attribute, Integer|Length in bytes of the block.|  
|`Block/@Id`|Attribute, String|The block ID.|  
|`Block/@Hash`|Attribute, String|Base16-encoded MD5 hash of the block.|  
|`Block/@Status`|Attribute, String|Status of processing the block.|  
|`Metadata`|Nested XML element|Represents the blob's metadata.|  
|`Metadata/@Status`|Attribute, String|Status of processing of the blob metadata.|  
|`Metadata/GlobalPath`|String|Relative path to the global metadata file.|  
|`Metadata/GlobalPath/@Hash`|Attribute, String|Base16-encoded MD5 hash of the global metadata file.|  
|`Metadata/Path`|String|Relative path to the metadata file.|  
|`Metadata/Path/@Hash`|Attribute, String|Base16-encoded MD5 hash of the metadata file.|  
|`Properties`|Nested XML element|Represents the blob properties.|  
|`Properties/@Status`|Attribute, String|Status of processing the blob properties, e.g. file not found, completed.|  
|`Properties/GlobalPath`|String|Relative path to the global properties file.|  
|`Properties/GlobalPath/@Hash`|Attribute, String|Base16-encoded MD5 hash of the global properties file.|  
|`Properties/Path`|String|Relative path to the properties file.|  
|`Properties/Path/@Hash`|Attribute, String|Base16-encoded MD5 hash of the properties file.|  
|`Blob/Status`|String|Status of processing the blob.|  
  
## Drive status codes  
The following table lists the status codes for processing a drive.  
  
|Status code|Description|  
|-----------------|-----------------|  
|`Completed`|The drive has finished processing without any errors.|  
|`CompletedWithWarnings`|The drive has finished processing with warnings in one or more blobs per the import dispositions specified for the blobs.|  
|`CompletedWithErrors`|The drive has finished with errors in one or more blobs or chunks.|  
|`DiskNotFound`|No disk is found on the drive.|  
|`VolumeNotNtfs`|The first data volume on the disk is not in NTFS format.|  
|`DiskOperationFailed`|An unknown failure occurred when performing operations on the drive.|  
|`BitLockerVolumeNotFound`|No BitLocker encryptable volume is found.|  
|`BitLockerNotActivated`|BitLocker is not enabled on the volume.|  
|`BitLockerProtectorNotFound`|The numerical password key protector does not exist on the volume.|  
|`BitLockerKeyInvalid`|The numerical password provided cannot unlock the volume.|  
|`BitLockerUnlockVolumeFailed`|Unknown failure has happened when trying to unlock the volume.|  
|`BitLockerFailed`|An unknown failure occurred while performing BitLocker operations.|  
|`ManifestNameInvalid`|The manifest file name is invalid.|  
|`ManifestNameTooLong`|The manifest file name is too long.|  
|`ManifestNotFound`|The manifest file is not found.|  
|`ManifestAccessDenied`|Access to the manifest file is denied.|  
|`ManifestCorrupted`|The manifest file is corrupted (the content does not match its hash).|  
|`ManifestFormatInvalid`|The manifest content does not conform to the required format.|  
|`ManifestDriveIdMismatch`|The drive ID in the manifest file does not match the one read from the drive.|  
|`ReadManifestFailed`|A disk I/O failure occurred while reading from the manifest.|  
|`BlobListFormatInvalid`|The export blob list blob does not conform to the required format.|  
|`BlobRequestForbidden`|Access to the blobs in the storage account is forbidden. This might be due to invalid storage account key or container SAS.|  
|`InternalError`|And internal error occurred while processing the drive.|  
  
## Blob status codes  
The following table lists the status codes for processing a blob.  
  
|Status code|Description|  
|-----------------|-----------------|  
|`Completed`|The blob has finished processing without errors.|  
|`CompletedWithErrors`|The blob has finished processing with errors in one or more page ranges or blocks, metadata, or properties.|  
|`FileNameInvalid`|The file name is invalid.|  
|`FileNameTooLong`|The file name is too long.|  
|`FileNotFound`|The file is not found.|  
|`FileAccessDenied`|Access to the file is denied.|  
|`BlobRequestFailed`|The Blob service request to access the blob has failed.|  
|`BlobRequestForbidden`|The Blob service request to access the blob is forbidden. This might be due to invalid storage account key or container SAS.|  
|`RenameFailed`|Failed to rename the blob (for an import job) or the file (for an export job).|  
|`BlobUnexpectedChange`|An unexpected change has occurred with the blob (for an export job).|  
|`LeasePresent`|There is a lease present on the blob.|  
|`IOFailed`|A disk or network I/O failure occurred while processing the blob.|  
|`Failed`|An unknown failure occurred while processing the blob.|  
  
## Import disposition status codes  
The following table lists the status codes for resolving an import disposition.  
  
|Status code|Description|  
|-----------------|-----------------|  
|`Created`|The blob has been created.|  
|`Renamed`|The blob has been renamed per rename import disposition. The `Blob/BlobPath` element contains the URI for the renamed blob.|  
|`Skipped`|The blob has been skipped per `no-overwrite` import disposition.|  
|`Overwritten`|The blob has overwritten an existing blob per `overwrite` import disposition.|  
|`Cancelled`|A prior failure has stopped further processing of the import disposition.|  
  
## Page range/block status codes  
The following table lists the status codes for processing a page range or a block.  
  
|Status code|Description|  
|-----------------|-----------------|  
|`Completed`|The page range or block has finished processing without any errors.|  
|`Committed`|The block has been committed,  but not in the full block list because other blocks have failed, or put full block list itself has failed.|  
|`Uncommitted`|The block is uploaded but not committed.|  
|`Corrupted`|The page range or block is corrupted (the content does not match its hash).|  
|`FileUnexpectedEnd`|An unexpected end of file has been encountered.|  
|`BlobUnexpectedEnd`|An unexpected end of blob has been encountered.|  
|`BlobRequestFailed`|The Blob service request to access the page range or block has failed.|  
|`IOFailed`|A disk or network I/O failure occurred while processing the page range or block.|  
|`Failed`|An unknown failure occurred while processing the page range or block.|  
|`Cancelled`|A prior failure has stopped further processing of the page range or block.|  
  
## Metadata status codes  
The following table lists the status codes for processing blob metadata.  
  
|Status code|Description|  
|-----------------|-----------------|  
|`Completed`|The metadata has finished processing without errors.|  
|`FileNameInvalid`|The metadata file name is invalid.|  
|`FileNameTooLong`|The metadata file name is too long.|  
|`FileNotFound`|The metadata file is not found.|  
|`FileAccessDenied`|Access to the metadata file is denied.|  
|`Corrupted`|The metadata file is corrupted (the content does not match its hash).|  
|`XmlReadFailed`|The metadata content does not conform to the required format.|  
|`XmlWriteFailed`|Writing the metadata XML has failed.|  
|`BlobRequestFailed`|The Blob service request to access the metadata has failed.|  
|`IOFailed`|A disk or network I/O failure occurred while processing the metadata.|  
|`Failed`|An unknown failure occurred while processing the metadata.|  
|`Cancelled`|A prior failure has stopped further processing of the metadata.|  
  
## Properties status codes  
The following table lists the status codes for processing blob properties.  
  
|Status code|Description|  
|-----------------|-----------------|  
|`Completed`|The properties have finished processing without any errors.|  
|`FileNameInvalid`|The properties file name is invalid.|  
|`FileNameTooLong`|The properties file name is too long.|  
|`FileNotFound`|The properties file is not found.|  
|`FileAccessDenied`|Access to the properties file is denied.|  
|`Corrupted`|The properties file is corrupted (the content does not match its hash).|  
|`XmlReadFailed`|The properties content does not conform to the required format.|  
|`XmlWriteFailed`|Writing the properties XML has failed.|  
|`BlobRequestFailed`|The Blob service request to access the properties has failed.|  
|`IOFailed`|A disk or network I/O failure occurred while processing the properties.|  
|`Failed`|An unknown failure occurred while processing the properties.|  
|`Cancelled`|A prior failure has stopped further processing of the properties.|  
  
## Sample logs  
The following is an example of verbose log.  
  
```xml
<?xml version="1.0" encoding="UTF-8"?>  
<DriveLog Version="2014-11-01">  
    <DriveId>WD-WMATV123456</DriveId>  
    <Blob Status="Completed">  
       <BlobPath>pictures/bob/wild/desert.jpg</BlobPath>  
       <FilePath>\Users\bob\Pictures\wild\desert.jpg</FilePath>  
       <Length>98304</Length>  
       <ImportDisposition Status="Created">overwrite</ImportDisposition>  
       <BlockList>  
          <Block Offset="0" Length="65536" Id="AAAAAA==" Hash=" 9C8AE14A55241F98533C4D80D85CDC68" Status="Completed"/>  
          <Block Offset="65536" Length="32768" Id="AQAAAA==" Hash=" DF54C531C9B3CA2570FDDDB3BCD0E27D" Status="Completed"/>  
       </BlockList>  
       <Metadata Status="Completed">  
          <GlobalPath Hash=" E34F54B7086BCF4EC1601D056F4C7E37">\Users\bob\Pictures\wild\metadata.xml</GlobalPath>  
       </Metadata>  
    </Blob>  
    <Blob Status="CompletedWithErrors">  
       <BlobPath>pictures/bob/animals/koala.jpg</BlobPath>  
       <FilePath>\Users\bob\Pictures\animals\koala.jpg</FilePath>  
       <Length>163840</Length>  
       <ImportDisposition Status="Overwritten">overwrite</ImportDisposition>  
       <PageRangeList>  
          <PageRange Offset="0" Length="65536" Hash="19701B8877418393CB3CB567F53EE225" Status="Completed"/>  
          <PageRange Offset="65536" Length="65536" Hash="AA2585F6F6FD01C4AD4256E018240CD4" Status="Corrupted"/>  
          <PageRange Offset="131072" Length="4096" Hash="9BA552E1C3EEAFFC91B42B979900A996" Status="Completed"/>  
       </PageRangeList>  
       <Properties Status="Completed">  
          <Path Hash="38D7AE80653F47F63C0222FEE90EC4E7">\Users\bob\Pictures\animals\koala.jpg.properties</Path>  
       </Properties>  
    </Blob>  
    <Status>CompletedWithErrors</Status>  
</DriveLog>  
```  
  
The corresponding error log is shown below.  
  
```xml
<?xml version="1.0" encoding="UTF-8"?>  
<DriveLog Version="2014-11-01">  
    <DriveId>WD-WMATV6965824</DriveId>  
    <Blob Status="CompletedWithErrors">  
       <BlobPath>pictures/bob/animals/koala.jpg</BlobPath>  
       <FilePath>\Users\bob\Pictures\animals\koala.jpg</FilePath>  
       <Length>163840</Length>  
       <ImportDisposition Status="Overwritten">overwrite</ImportDisposition>  
       <PageRangeList>  
          <PageRange Offset="65536" Length="65536" Hash="AA2585F6F6FD01C4AD4256E018240CD4" Status="Corrupted"/>  
       </PageRangeList>  
    </Blob>  
    <Status>CompletedWithErrors</Status>  
</DriveLog>  
```

 The follow error log for an import job contains an error about a file not found on the import drive. Note that the status of subsequent components is `Cancelled`.  
  
```xml
<?xml version="1.0" encoding="utf-8"?>  
<DriveLog Version="2014-11-01">  
  <DriveId>9WM35C2V</DriveId>  
  <Blob Status="FileNotFound">  
    <BlobPath>pictures/animals/koala.jpg</BlobPath>  
    <FilePath>\animals\koala.jpg</FilePath>  
    <Length>30310</Length>  
    <ImportDisposition Status="Cancelled">rename</ImportDisposition>  
    <BlockList>  
      <Block Offset="0" Length="6062" Id="MD5/cAzn4h7VVSWXf696qp5Uaw==" Hash="700CE7E21ED55525977FAF7AAA9E546B" Status="Cancelled" />  
      <Block Offset="6062" Length="6062" Id="MD5/PEnGwYOI8LPLNYdfKr7kAg==" Hash="3C49C6C18388F0B3CB35875F2ABEE402" Status="Cancelled" />  
      <Block Offset="12124" Length="6062" Id="MD5/FG4WxqfZKuUWZ2nGTU2qVA==" Hash="146E16C6A7D92AE5166769C64D4DAA54" Status="Cancelled" />  
      <Block Offset="18186" Length="6062" Id="MD5/ZzibNDzr3IRBQENRyegeXQ==" Hash="67389B343CEBDC8441404351C9E81E5D" Status="Cancelled" />  
      <Block Offset="24248" Length="6062" Id="MD5/ZzibNDzr3IRBQENRyegeXQ==" Hash="67389B343CEBDC8441404351C9E81E5D" Status="Cancelled" />  
    </BlockList>  
  </Blob>  
  <Status>CompletedWithErrors</Status>  
</DriveLog>  
```

The following error log for an export job indicates that the blob content has been successfully written to the drive, but that an error occurred while exporting the blob's properties.  
  
```xml
<?xml version="1.0" encoding="utf-8"?>  
<DriveLog Version="2014-11-01">  
  <DriveId>9WM35C3U</DriveId>  
  <Blob Status="CompletedWithErrors">  
    <BlobPath>pictures/wild/canyon.jpg</BlobPath>  
    <FilePath>\pictures\wild\canyon.jpg</FilePath>  
    <LastModified>2012-09-18T23:47:08Z</LastModified>  
    <Length>163840</Length>  
    <BlockList />  
    <Properties Status="Failed" />  
  </Blob>  
  <Status>CompletedWithErrors</Status>  
</DriveLog>  
```
  
## Next steps
 
* [Storage Import/Export REST API](/rest/api/storageimportexport/)
