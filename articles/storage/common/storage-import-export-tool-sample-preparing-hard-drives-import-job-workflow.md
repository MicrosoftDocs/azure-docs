---
title: Sample workflow to prep hard drives for an Azure Import/Export import job | Microsoft Docs
description: See a walkthrough for the complete process of preparing drives for an import job in the Azure Import/Export service.
author: muralikk
services: storage
ms.service: storage
ms.topic: article
ms.date: 04/07/2017
ms.author: muralikk
ms.subservice: common
---

# Sample workflow to prepare hard drives for an import job

This article walks you through the complete process of preparing drives for an import job.

## Sample data

This example imports the following data into an Azure storage account named `mystorageaccount`:

|Location|Description|Data size|
|--------------|-----------------|-----|
|H:\Video\ |A collection of videos|12 TB|
|H:\Photo\ |A collection of photos|30 GB|
|K:\Temp\FavoriteMovie.ISO|A Blu-Ray™ disk image|25 GB|
|\\\bigshare\john\music\ |A collection of music files on a network share|10 GB|

## Storage account destinations

The import job will import the data into the following destinations in the storage account:

|Source|Destination virtual directory or blob|
|------------|-------------------------------------------|
|H:\Video\ |video/|
|H:\Photo\ |photo/|
|K:\Temp\FavoriteMovie.ISO|favorite/FavoriteMovies.ISO|
|\\\bigshare\john\music\ |music|

With this mapping, the file `H:\Video\Drama\GreatMovie.mov` will be imported to the blob `https://mystorageaccount.blob.core.windows.net/video/Drama/GreatMovie.mov`.

## Determine hard drive requirements

Next, to determine how many hard drives are needed, compute the size of the data:

`12TB + 30GB + 25GB + 10GB = 12TB + 65GB`

For this example, two 8TB hard drives should be sufficient. However, since the source directory `H:\Video` has 12TB of data and your single hard drive's capacity is only 8TB, you will be able to specify this in the following way in the **driveset.csv** file:

```
DriveLetter,FormatOption,SilentOrPromptOnFormat,Encryption,ExistingBitLockerKey
X,Format,SilentMode,Encrypt,
Y,Format,SilentMode,Encrypt,
```
The tool will distribute data across two hard drives in an optimized way.

## Attach drives and configure the job
You will attach both disks to the machine and create volumes. Then author **dataset.csv** file:
```
BasePath,DstBlobPathOrPrefix,BlobType,Disposition,MetadataFile,PropertiesFile
H:\Video\,video/,BlockBlob,rename,None,H:\mydirectory\properties.xml
H:\Photo\,photo/,BlockBlob,rename,None,H:\mydirectory\properties.xml
K:\Temp\FavoriteVideo.ISO,favorite/FavoriteVideo.ISO,BlockBlob,rename,None,H:\mydirectory\properties.xml
\\myshare\john\music\,music/,BlockBlob,rename,None,H:\mydirectory\properties.xml
```

In addition, you can set the following metadata for all files:

* **UploadMethod:** Windows Azure Import/Export service
* **DataSetName:** SampleData
* **CreationDate:** 10/1/2013

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

* **Content-Type:** application/octet-stream
* **Content-MD5:** Q2hlY2sgSW50ZWdyaXR5IQ==
* **Cache-Control:** no-cache

To set these properties, create a text file, `c:\WAImportExport\SampleProperties.txt`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Properties>
    <Content-Type>application/octet-stream</Content-Type>
    <Content-MD5>Q2hlY2sgSW50ZWdyaXR5IQ==</Content-MD5>
    <Cache-Control>no-cache</Cache-Control>
</Properties>
```

## Run the Azure Import/Export Tool (WAImportExport.exe)

Now you are ready to run the Azure Import/Export Tool to prepare the two hard drives.

**For the first session:**

```
WAImportExport.exe PrepImport /j:JournalTest.jrn /id:session#1  /sk:************* /InitialDriveSet:driveset-1.csv /DataSet:dataset-1.csv /logdir:F:\logs
```

If any more data needs to be added, create another dataset file (same format as Initial dataset).

**For the second session:**

```
WAImportExport.exe PrepImport /j:JournalTest.jrn /id:session#2  /DataSet:dataset-2.csv
```

Once the copy sessions have completed, you can disconnect the two drives from the copy computer and ship them to the appropriate Azure data center. You'll upload the two journal files, `<FirstDriveSerialNumber>.xml` and `<SecondDriveSerialNumber>.xml`, when you create the import job in the Azure portal.

## Next steps

* [Preparing hard drives for an import job](../storage-import-export-tool-preparing-hard-drives-import.md)
* [Quick reference for frequently used commands](../storage-import-export-tool-quick-reference.md)
