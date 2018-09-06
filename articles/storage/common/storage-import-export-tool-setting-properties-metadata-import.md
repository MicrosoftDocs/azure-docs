---
title: Setting properties and metadata using Azure Import/Export | Microsoft Docs
description: Learn how to specify properties and metadata to be set on the destination blobs when running the Azure Import/Export Tool to prepare your drives.
author: muralikk
services: storage
ms.service: storage
ms.topic: article
ms.date: 01/23/2017
ms.author: muralikk
ms.component: common
---

# Setting properties and metadata during the import process

When you run the Microsoft Azure Import/Export Tool to prepare your drives, you can specify properties and metadata to be set on the destination blobs. Follow these steps:

1.  To set blob properties, create a text file on your local computer that specifies property names and values.
2.  To set blob metadata, create a text file on your local computer that specifies metadata names and values.
3.  Pass the full path to one or both of these files to the Azure Import/Export Tool as part of the `PrepImport` operation.

> [!NOTE]
>  When you specify a properties or metadata file as part of a copy session, those properties or metadata are set for every blob that is imported as part of that copy session. If you want to specify a different set of properties or metadata for some of the blobs being imported, you'll need to create a separate copy session with different properties or metadata files.

## Specify blob properties in a text file

To specify blob properties, create a local text file, and include XML that specifies property names as elements, and property values as values. Here's an example that specifies some property values:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Properties>
    <Content-Type>application/octet-stream</Content-Type>
    <Content-MD5>Q2hlY2sgSW50ZWdyaXR5IQ==</Content-MD5>
    <Cache-Control>no-cache</Cache-Control>
</Properties>
```

Save the file to a local location like `C:\WAImportExport\ImportProperties.txt`.

## Specify blob metadata in a text file

Similarly, to specify blob metadata, create a local text file that specifies metadata names as elements, and metadata values as values. Here's an example that specifies some metadata values:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Metadata>
    <UploadMethod>Windows Azure Import/Export service</UploadMethod>
    <DataSetName>SampleData</DataSetName>
    <CreationDate>10/1/2013</CreationDate>
</Metadata>
```

Save the file to a local location like `C:\WAImportExport\ImportMetadata.txt`.

## Add the path to properties and metadata files in dataset.csv

```
BasePath,DstBlobPathOrPrefix,BlobType,Disposition,MetadataFile,PropertiesFile
H:\Video\,https://mystorageaccount.blob.core.windows.net/video/,BlockBlob,rename,None,H:\mydirectory\properties.xml
H:\Photo\,https://mystorageaccount.blob.core.windows.net/photo/,BlockBlob,rename,None,H:\mydirectory\properties.xml
K:\Temp\FavoriteVideo.ISO,https://mystorageaccount.blob.core.windows.net/favorite/FavoriteVideo.ISO,BlockBlob,rename,None,H:\mydirectory\properties.xml
\\myshare\john\music\,https://mystorageaccount.blob.core.windows.net/music/,BlockBlob,rename,None,H:\mydirectory\properties.xml
```

## Next steps

* [Import/Export service metadata and properties file format](../storage-import-export-file-format-metadata-and-properties.md)
