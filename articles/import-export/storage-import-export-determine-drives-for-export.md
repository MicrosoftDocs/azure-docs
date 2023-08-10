---
title: Check number of drives needed for an export with Azure Import/Export | Microsoft Docs
description: Find out how many drives you need for an export using Azure Import/Export service.
author: alkohli
services: storage
ms.service: azure-import-export
ms.topic: how-to
ms.date: 03/15/2022
ms.author: alkohli
---

# Check number of drives needed for an export with Azure Import/Export 

This article describes how to determine how many physical drives to provide for your Azure Import/Export export order. You'll use the Azure Import/Export tool. The article explains how to install and use the tool.

The Azure Import/Export version 1 tool lists all blobs to be exported, and calculates how to pack them into drives of the specified size, taking into account any necessary overhead, then estimates the number of drives needed to hold the blobs and drive usage information.

You can use 2.5" SSDs, 2.5" HDDs, or 3.5" HDDs with your export order. For more information, see [Supported disks](storage-import-export-requirements.md#supported-disks).


## Prerequisite

* You'll need to use the tool on a Windows system running a [Supported OS version](storage-import-export-requirements.md#supported-operating-systems).

## Determine how many drives you need

To find out how many physical disks you need for your export order, do these steps:

1. Download the current release of the Azure Import/Export version 1 tool (WAImportExportV1.zip), for blobs, on the Windows system.
  1. [Download WAImportExport version 1](https://www.microsoft.com/download/details.aspx?id=42659). The current version is 1.5.0.300.
  1. Unzip to the default folder `waimportexportv1`. For example, `C:\WaImportExportV1`.

2. Open a PowerShell or command-line window with administrative privileges. To change directory to the unzipped folder, run the following command:

   `cd C:\WaImportExportV1`

3. To check the number of disks required for the selected blobs, run the following command:

   `WAImportExport.exe PreviewExport /ExportBlobListFile:<Path to XML blob list file> /DriveSize:<Size of drives used>`

    The parameters are described in the following table:

    |Command-line parameter|Description|
    |--------------------------|-----------------|
    |**/logdir:**|Optional. The log directory. Verbose log files are written to this directory. If not specified, the current directory is used as the log directory.|
    |**/ExportBlobListFile:**|Required. Path to the XML file containing list of blob paths or blob path prefixes for the blobs to be exported. The file format used in the `BlobListBlobPath` element in the [Put Job](/rest/api/storageimportexport/jobs) operation of the Import/Export service REST API.|
    |**/DriveSize:**|Required. The size of drives to use for an export job, *for example*, 500 GB, 1.5 TB.|

    See an [Example of the PreviewExport command](#example-of-previewexport-command).

4. Check that you can read/write to the drives that will be shipped for the export job.

## Example of PreviewExport command

The following example demonstrates the `PreviewExport` command:

```powershell
    WAImportExport.exe PreviewExport /ExportBlobListFile:C:\WAImportExport\mybloblist.xml /DriveSize:500GB /Cloud:Public
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

### Examples of valid blob paths

The following table shows examples of valid blob paths and blob path prefixes to use with the &lt;BlobPath&gt; and &lt;BlobPathPrefix&gt; tags in  your blob list file.

* A *path* selects and filters to a single blob or file.
* A *prefix* selects and filters to multiple blobs or multiple files.

   | Selector | Blob Path/Prefix | Description |
   | --- | --- | --- |
   | Starts With |/ |Exports all blobs in the storage account |
   | Starts With |/$root/ |Exports all blobs in the root container |
   | Starts With |/book |Exports all blobs in any container that begins with prefix **book** |
   | Starts With |/music/ |Exports all blobs in container **music** |
   | Starts With |/music/love |Exports all blobs in container **music** that begin with prefix **love** |
   | Equal To |$root/logo.bmp |Exports blob **logo.bmp** in the root container |
   | Equal To |videos/story.mp4 |Exports blob **story.mp4** in container **videos** |


### Sample output

Here is an example of the output, with informational logs omitted:

```powershell
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

- [Export blobs from Azure Blob storage](storage-import-export-data-from-blobs.md)
