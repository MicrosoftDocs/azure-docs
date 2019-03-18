---
title: Previewing drive usage for an Azure Import/Export export job - v1 | Microsoft Docs
description: Learn how to preview the list of blobs you've selected for an export job in the Azure Import/Export service.
author: muralikk
services: storage
ms.service: storage
ms.topic: article
ms.date: 01/15/2017
ms.author: muralikk
ms.subservice: common
---

# Previewing drive usage for an export job
Before you create an export job, you need to choose a set of blobs to be exported. The Microsoft Azure Import/Export service allows you to use a list of blob paths or blob prefixes to represent the blobs you've selected.  
  
Next, you need to determine how many drives you need to send. The Import/Export Tool provides the `PreviewExport` command to preview drive usage for the blobs you selected, based on the size of the drives you are going to use.

## Command-line parameters

You can use the following parameters when using the `PreviewExport` command of the Import/Export Tool.

|Command-line parameter|Description|  
|--------------------------|-----------------|  
|**/logdir:**<LogDirectory\>|Optional. The log directory. Verbose log files will be written to this directory. If no log directory is specified, the current directory will be used as the log directory.|  
|**/sn:**<StorageAccountName\>|Required. The name of the storage account for the export job.|  
|**/sk:**<StorageAccountKey\>|Required if and only if a container SAS is not specified. The account key for the storage account for the export job.|  
|**/csas:**<ContainerSas\>|Required if and only if a storage account key is not specified. The container SAS for listing the blobs to be exported in the export job.|  
|**/ExportBlobListFile:**<ExportBlobListFile\>|Required. Path to the XML file containing list of blob paths or blob path prefixes for the blobs to be exported. The file format used in the `BlobListBlobPath` element in the [Put Job](/rest/api/storageimportexport/jobs) operation of the Import/Export service REST API.|  
|**/DriveSize:**<DriveSize\>|Required. The size of drives to use for an export job, *e.g.*, 500GB, 1.5TB.|  

## Command-line example

The following example demonstrates the `PreviewExport` command:  
  
```  
WAImportExport.exe PreviewExport /sn:bobmediaaccount /sk:VkGbrUqBWLYJ6zg1m29VOTrxpBgdNOlp+kp0C9MEdx3GELxmBw4hK94f7KysbbeKLDksg7VoN1W/a5UuM2zNgQ== /ExportBlobListFile:C:\WAImportExport\mybloblist.xml /DriveSize:500GB    
```  
  
The export blob list file may contain blob names and blob prefixes, as shown here:  
  
```xml 
<?xml version="1.0" encoding="utf-8"?>  
<BlobList>  
<BlobPath>pictures/animals/koala.jpg</BlobPath>  
<BlobPathPrefix>/vhds/</BlobPathPrefix>  
<BlobPathPrefix>/movies/</BlobPathPrefix>  
</BlobList>  
```

The Azure Import/Export Tool lists all blobs to be exported and calculates how to pack them into drives of the specified size, taking into account any necessary overhead, then estimates the number of drives needed to hold the blobs and drive usage information.  
  
Here is an example of the output, with informational logs omitted:  
  
```  
Number of unique blob paths/prefixes:   3  
Number of duplicate blob paths/prefixes:        0  
Number of nonexistent blob paths/prefixes:      1  
  
Drive size:     500.00 GB  
Number of blobs that can be exported:   6  
Number of blobs that cannot be exported:        2  
Number of drives needed:        3  
        Drive #1:       blobs = 1, occupied space = 454.74 GB  
        Drive #2:       blobs = 3, occupied space = 441.37 GB  
        Drive #3:       blobs = 2, occupied space = 131.28 GB    
```  
  
## Next steps

* [Azure Import/Export Tool reference](../storage-import-export-tool-how-to-v1.md)
