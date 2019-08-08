---
title: Sample workflow to prep hard drives for an Azure Import/Export import job - v1 | Microsoft Docs
description: See a walkthrough for the complete process of preparing drives for an import job in the Azure Import/Export service.
author: muralikk
services: storage
ms.service: storage
ms.topic: article
ms.date: 01/23/2017
ms.author: muralikk
ms.subservice: common
---

# Sample workflow to prepare hard drives for an import job
This topic walks you through the complete process of preparing drives for an import job.  
  
This example imports the following data into a Window Azure storage account named `mystorageaccount`:  
  
|Location|Description|  
|--------------|-----------------|  
|H:\Video|A collection of videos, 5 TB in total.|  
|H:\Photo|A collection of photos, 30 GB in total.|  
|K:\Temp\FavoriteMovie.ISO|A Blu-Ray™ disk image, 25 GB.|  
|\\\bigshare\john\music|A collection of music files on a network share, 10 GB in total.|  
  
The import job imports this data into the following destinations in the storage account:  
  
|Source|Destination virtual directory or blob|  
|------------|-------------------------------------------|  
|H:\Video|https:\//mystorageaccount.blob.core.windows.net/video|  
|H:\Photo|https:\//mystorageaccount.blob.core.windows.net/photo|  
|K:\Temp\FavoriteMovie.ISO|https:\//mystorageaccount.blob.core.windows.net/favorite/FavoriteMovies.ISO|  
|\\\bigshare\john\music|https:\//mystorageaccount.blob.core.windows.net/music|  
  
With this mapping, the file `H:\Video\Drama\GreatMovie.mov` is imported to the blob https:\//mystorageaccount.blob.core.windows.net/video/Drama/GreatMovie.mov.  
  
Next, to determine how many hard drives are needed, compute the size of the data:  
  
`5TB + 30GB + 25GB + 10GB = 5TB + 65GB`  
  
For this example, two 3-TB hard drives should be sufficient. However, since the source directory `H:\Video` has 5 TB of data and your single hard drive's capacity is only 3 TB, it's necessary to break `H:\Video` into two smaller directories: `H:\Video1` and `H:\Video2`, before running the Microsoft Azure Import/Export Tool. This step yields the following source directories:  
  
|Location|Size|Destination virtual directory or blob|  
|--------------|----------|-------------------------------------------|  
|H:\Video1|2.5 TB|https:\//mystorageaccount.blob.core.windows.net/video|  
|H:\Video2|2.5 TB|https:\//mystorageaccount.blob.core.windows.net/video|  
|H:\Photo|30 GB|https:\//mystorageaccount.blob.core.windows.net/photo|  
|K:\Temp\FavoriteMovies.ISO|25 GB|https:\//mystorageaccount.blob.core.windows.net/favorite/FavoriteMovies.ISO|  
|\\\bigshare\john\music|10 GB|https:\//mystorageaccount.blob.core.windows.net/music|  
  
 Even though the `H:\Video`directory has been split to two directories, they point to the same destination virtual directory in the storage account. This way, all video files are maintained under a single `video` container in the storage account.  
  
 Next, the previous source directories are evenly distributed to the two hard drives:  
  
||||  
|-|-|-|  
|Hard drive|Source directories|Total size|  
|First Drive|H:\Video1|2.5 TB + 30 GB|  
||H:\Photo||  
|Second Drive|H:\Video2|2.5 TB + 35 GB|  
||K:\Temp\BlueRay.ISO||  
||\\\bigshare\john\music||  
  
In addition, you can set the following metadata for all files:  
  
-   **UploadMethod:** Windows Azure Import/Export service  
  
-   **DataSetName:** SampleData  
  
-   **CreationDate:** 10/1/2013  
  
To set metadata for the imported files, create a text file, `c:\WAImportExport\SampleMetadata.txt`, with the following content:  
  
```xml
<?xml version="1.0" encoding="UTF-8"?>  
<Metadata>  
    <UploadMethod>Windows Azure Import/Export service</UploadMethod>  
    <DataSetName>SampleData</DataSetName>  
    <CreationDate>10/1/2013</CreationDate>  
</Metadata>  
```
  
You can also set some properties for the `FavoriteMovie.ISO` blob:  
  
-   **Content-Type:** application/octet-stream  
  
-   **Content-MD5:** Q2hlY2sgSW50ZWdyaXR5IQ==  
  
-   **Cache-Control:** no-cache  
  
To set these properties, create a text file, `c:\WAImportExport\SampleProperties.txt`:  
  
```xml
<?xml version="1.0" encoding="UTF-8"?>  
<Properties>  
    <Content-Type>application/octet-stream</Content-Type>  
    <Content-MD5>Q2hlY2sgSW50ZWdyaXR5IQ==</Content-MD5>  
    <Cache-Control>no-cache</Cache-Control>  
</Properties>  
```
  
Now you are ready to run the Azure Import/Export Tool to prepare the two hard drives. Note that:  
  
-   The first drive is mounted as drive X.  
  
-   The second drive is mounted as drive Y.  
  
-   The key for the storage account `mystorageaccount` is `8ImTigJhIwvL9VEIQKB/zbqcXbxrIHbBjLIfOt0tyR98TxtFvUM/7T0KVNR6KRkJrh26u5I8hTxTLM2O1aDVqg==`.  

## Preparing disk for import when data is pre-loaded
 
 If the data to be imported is already present on the disk, use the flag /skipwrite. The value of /t and /srcdir should both point to the disk being prepared for import. If all of the data to be imported is not going to the same destination virtual directory or root of the storage account, run the same command for each destination directory separately, keeping the value of /id the same across all runs.

>[!NOTE] 
>Do not specify /format as it will wipe the data on the disk. You can specify /encrypt or /bk depending on whether the disk is already encrypted or not. 
>

```
    When data is already present on the disk for each drive run the following command.
    WAImportExport.exe PrepImport /j:FirstDrive.jrn /id:Video1 /logdir:c:\logs /sk:8ImTigJhIwvL9VEIQKB/zbqcXbxrIHbBjLIfOt0tyR98TxtFvUM/7T0KVNR6KRkJrh26u5I8hTxTLM2O1aDVqg== /t:x /format /encrypt /srcdir:x:\Video1 /dstdir:video/ /MetadataFile:c:\WAImportExport\SampleMetadata.txt /skipwrite
```

## Copy sessions - first drive

For the first drive, run the Azure Import/Export Tool twice to copy the two source directories:  

**First copy session**
  
```
WAImportExport.exe PrepImport /j:FirstDrive.jrn /id:Video1 /logdir:c:\logs /sk:8ImTigJhIwvL9VEIQKB/zbqcXbxrIHbBjLIfOt0tyR98TxtFvUM/7T0KVNR6KRkJrh26u5I8hTxTLM2O1aDVqg== /t:x /format /encrypt /srcdir:H:\Video1 /dstdir:video/ /MetadataFile:c:\WAImportExport\SampleMetadata.txt  
```

**Second copy session**

```  
WAImportExport.exe PrepImport /j:FirstDrive.jrn /id:Photo /srcdir:H:\Photo /dstdir:photo/ /MetadataFile:c:\WAImportExport\SampleMetadata.txt
```

## Copy sessions - second drive
 
For the second drive, run the Azure Import/Export Tool three times, once each for the source directories, and once for the standalone Blu-Ray™ image file):  
  
**First copy session** 

```
WAImportExport.exe PrepImport /j:SecondDrive.jrn /id:Video2 /logdir:c:\logs /sk:8ImTigJhIwvL9VEIQKB/zbqcXbxrIHbBjLIfOt0tyR98TxtFvUM/7T0KVNR6KRkJrh26u5I8hTxTLM2O1aDVqg== /t:y /format /encrypt /srcdir:H:\Video2 /dstdir:video/ /MetadataFile:c:\WAImportExport\SampleMetadata.txt  
```
  
**Second copy session**

```
WAImportExport.exe PrepImport /j:SecondDrive.jrn /id:Music /srcdir:\\bigshare\john\music /dstdir:music/ /MetadataFile:c:\WAImportExport\SampleMetadata.txt  
```  
  
**Third copy session**  

```
WAImportExport.exe PrepImport /j:SecondDrive.jrn /id:BlueRayIso /srcfile:K:\Temp\BlueRay.ISO /dstblob:favorite/BlueRay.ISO /MetadataFile:c:\WAImportExport\SampleMetadata.txt /PropertyFile:c:\WAImportExport\SampleProperties.txt  
```

## Copy session completion

Once the copy sessions have completed, you can disconnect the two drives from the copy computer and ship them to the appropriate Windows Azure data center. Upload the two journal files, `FirstDrive.jrn` and `SecondDrive.jrn`, when you create the import job in the [Azure portal](https://portal.azure.com).  
  
## Next steps

* [Preparing hard drives for an import job](../storage-import-export-tool-preparing-hard-drives-import-v1.md)   
* [Quick reference for frequently used commands](../storage-import-export-tool-quick-reference-v1.md) 
