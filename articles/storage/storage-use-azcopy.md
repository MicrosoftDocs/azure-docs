<properties
	pageTitle="Copy or move data to Storage with AzCopy | Microsoft Azure"
	description="Use the AzCopy utility to move or copy data to or from blob, table, and file content. Copy data to Azure Storage from local files, or copy data within or between storage accounts. Easily migrate your data to Azure Storage."
	services="storage"
	documentationCenter=""
	authors="micurd"
	manager="jahogg"
	editor="tysonn"/>

<tags
	ms.service="storage"
	ms.workload="storage"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="06/14/2016"
	ms.author="micurd"/>

# Transfer data with the AzCopy Command-Line Utility

## Overview

AzCopy is a Windows command-line utility designed for copying data to and from Microsoft Azure Blob, File, and Table storage using simple commands with optimal performance. You can copy data from one object to another within your storage account, or between storage accounts.

> [AZURE.NOTE] This guide assumes that you are already familiar with [Azure Storage](https://azure.microsoft.com/services/storage/). If not, reading the [Introduction to Azure Storage](storage-introduction.md) documentation will be helpful. Most importantly, you will need to [create a Storage account](storage-create-storage-account.md#create-a-storage-account) in order to start using AzCopy.

## Download and install AzCopy

### Windows

Download the [latest version of AzCopy](http://aka.ms/downloadazcopy).

### Mac/Linux

AzCopy is not available for Mac/Linux OSs. However, Azure CLI is a suitable alternative for copying data to and from Azure Storage. Read [Using the Azure CLI with Azure Storage](storage-azure-cli.md) to learn more.

## Writing your first AzCopy command

The basic syntax for AzCopy commands is:

	AzCopy /Source:<source> /Dest:<destination> [Options]

Open a command window and navigate to the AzCopy installation directory on your computer - where the `AzCopy.exe` executable is located. If desired, you can add the AzCopy installation location to your system path. By default, AzCopy is installed to `%ProgramFiles(x86)%\Microsoft SDKs\Azure\AzCopy` (64-bit Windows) or `%ProgramFiles%\Microsoft SDKs\Azure\AzCopy` (32-bit Windows).

The following examples demonstrate a variety of scenarios for copying data to and from Microsoft Azure Blobs, Files, and Tables. Refer to the [AzCopy Parameters](#azcopy-parameters) section for a detailed explanation of the parameters used in each sample.

## Blob: Download

### Download single blob

	AzCopy /Source:https://myaccount.blob.core.windows.net/mycontainer /Dest:C:\myfolder /SourceKey:key /Pattern:"abc.txt"

Note that if the folder `C:\myfolder` does not exist, AzCopy will create it and download `abc.txt ` into the new folder.

### Download single blob from secondary region

	AzCopy /Source:https://myaccount-secondary.blob.core.windows.net/mynewcontainer /Dest:C:\myfolder /SourceKey:key /Pattern:abc.txt

Note that you must have read-access geo-redundant storage enabled.

### Download all blobs

	AzCopy /Source:https://myaccount.blob.core.windows.net/mycontainer /Dest:C:\myfolder /SourceKey:key /S

Assume the following blobs reside in the specified container:  

	abc.txt
	abc1.txt
	abc2.txt
	vd1\a.txt
	vd1\abcd.txt

After the download operation, the directory `C:\myfolder` will include the following files:

	C:\myfolder\abc.txt
	C:\myfolder\abc1.txt
	C:\myfolder\abc2.txt
	C:\myfolder\vd1\a.txt
	C:\myfolder\vd1\abcd.txt

If you do not specify option `/S`, no blobs will be downloaded.

### Download blobs with specified prefix

	AzCopy /Source:https://myaccount.blob.core.windows.net/mycontainer /Dest:C:\myfolder /SourceKey:key /Pattern:a /S

Assume the following blobs reside in the specified container. All blobs beginning with the prefix `a` will be downloaded:

	abc.txt
	abc1.txt
	abc2.txt
	xyz.txt
	vd1\a.txt
	vd1\abcd.txt

After the download operation, the folder `C:\myfolder` will include the following files:

	C:\myfolder\abc.txt
	C:\myfolder\abc1.txt
	C:\myfolder\abc2.txt

The prefix applies to the virtual directory, which forms the first part of the blob name. In the example shown above, the virtual directory does not match the specified prefix, so it is not downloaded. In addition, if the option `\S` is not specified, AzCopy will not download any blobs.

### Set the last-modified time of exported files to be same as the source blobs

	AzCopy /Source:https://myaccount.blob.core.windows.net/mycontainer /Dest:C:\myfolder /SourceKey:key /MT

You can also exclude blobs from the download operation based on their last-modified time. For example, if you want to exclude blobs whose last modified time is the same or newer than the destination file, add the `/XN` option:

	AzCopy /Source:https://myaccount.blob.core.windows.net/mycontainer /Dest:C:\myfolder /SourceKey:key /MT /XN

Or if you want to exclude blobs whose last modified time is the same or older than the destination file, add the `/XO` option:

	AzCopy /Source:https://myaccount.blob.core.windows.net/mycontainer /Dest:C:\myfolder /SourceKey:key /MT /XO

## Blob: Upload

### Upload single file

	AzCopy /Source:C:\myfolder /Dest:https://myaccount.blob.core.windows.net/mycontainer /DestKey:key /Pattern:"abc.txt"

If the specified destination container does not exist, AzCopy will create it and upload the file into it.

### Upload single file to virtual directory

	AzCopy /Source:C:\myfolder /Dest:https://myaccount.blob.core.windows.net/mycontainer/vd /DestKey:key /Pattern:abc.txt

If the specified virtual directory does not exist, AzCopy will upload the file to include the virtual directory in its name (*e.g.*, `vd/abc.txt` in the example above).

### Upload all files

	AzCopy /Source:C:\myfolder /Dest:https://myaccount.blob.core.windows.net/mycontainer /DestKey:key /S

Specifying option `/S` uploads the contents of the specified directory to Blob storage recursively, meaning that all subfolders and their files will be uploaded as well. For instance, assume the following files reside in folder `C:\myfolder`:

	C:\myfolder\abc.txt
	C:\myfolder\abc1.txt
	C:\myfolder\abc2.txt
	C:\myfolder\subfolder\a.txt
	C:\myfolder\subfolder\abcd.txt

After the upload operation, the container will include the following files:

  	abc.txt
	abc1.txt
	abc2.txt
	subfolder\a.txt
	subfolder\abcd.txt

If you do not specify option `/S`, AzCopy will not upload recursively. After the upload operation, the container will include the following files:

	abc.txt
	abc1.txt
	abc2.txt

### Upload files matching specified pattern

	AzCopy /Source:C:\myfolder /Dest:https://myaccount.blob.core.windows.net/mycontainer /DestKey:key /Pattern:a* /S

Assume the following files reside in folder `C:\myfolder`:

	C:\myfolder\abc.txt
	C:\myfolder\abc1.txt
	C:\myfolder\abc2.txt
	C:\myfolder\xyz.txt
	C:\myfolder\subfolder\a.txt
	C:\myfolder\subfolder\abcd.txt

After the upload operation, the container will include the following files:

	abc.txt
	abc1.txt
	abc2.txt
	subfolder\a.txt
	subfolder\abcd.txt

If you do not specify option `/S`, AzCopy will only upload blobs that don't reside in a virtual directory:

	C:\myfolder\abc.txt
	C:\myfolder\abc1.txt
	C:\myfolder\abc2.txt

### Specify the MIME content type of a destination blob

By default, AzCopy sets the content type of a destination blob to `application/octet-stream`. Beginning with version 3.1.0, you can explicitly specify the content type via the option `/SetContentType:[content-type]`. This syntax sets the content type for all blobs in an upload operation.

	AzCopy /Source:C:\myfolder\ /Dest:https://myaccount.blob.core.windows.net/myContainer/ /DestKey:key /Pattern:ab /SetContentType:video/mp4

If you specify `/SetContentType` without a value, then AzCopy will set each blob or file's content type according to its file extension.

	AzCopy /Source:C:\myfolder\ /Dest:https://myaccount.blob.core.windows.net/myContainer/ /DestKey:key /Pattern:ab /SetContentType

## Blob: Copy

### Copy single blob within Storage account

	AzCopy /Source:https://myaccount.blob.core.windows.net/mycontainer1 /Dest:https://myaccount.blob.core.windows.net/mycontainer2 /SourceKey:key /DestKey:key /Pattern:abc.txt

When you copy a blob within a Storage account, a [server-side copy](http://blogs.msdn.com/b/windowsazurestorage/archive/2012/06/12/introducing-asynchronous-cross-account-copy-blob.aspx) operation is performed.

### Copy single blob across Storage accounts

	AzCopy /Source:https://sourceaccount.blob.core.windows.net/mycontainer1 /Dest:https://destaccount.blob.core.windows.net/mycontainer2 /SourceKey:key1 /DestKey:key2 /Pattern:abc.txt

When you copy a blob across Storage accounts, a [server-side copy](http://blogs.msdn.com/b/windowsazurestorage/archive/2012/06/12/introducing-asynchronous-cross-account-copy-blob.aspx) operation is performed.

### Copy single blob from secondary region to primary region

	AzCopy /Source:https://myaccount1-secondary.blob.core.windows.net/mynewcontainer1 /Dest:https://myaccount2.blob.core.windows.net/mynewcontainer2 /SourceKey:key1 /DestKey:key2 /Pattern:abc.txt

Note that you must have read-access geo-redundant storage enabled.

### Copy single blob and its snapshots across Storage accounts

	AzCopy /Source:https://sourceaccount.blob.core.windows.net/mycontainer1 /Dest:https://destaccount.blob.core.windows.net/mycontainer2 /SourceKey:key1 /DestKey:key2 /Pattern:abc.txt /Snapshot

After the copy operation, the target container will include the blob and its snapshots. Assuming the blob in the example above has two snapshots, the container will include the following blob and snapshots:

	abc.txt
	abc (2013-02-25 080757).txt
	abc (2014-02-21 150331).txt

### Synchronously copy blobs across Storage accounts

AzCopy by default copies data between two storage endpoints asynchronously. Therefore, the copy operation will run in the background using spare bandwidth capacity that has no SLA in terms of how fast a blob will be copied, and AzCopy will periodically check the copy status until the copying is completed or failed.

The `/SyncCopy` option ensures that the copy operation will get consistent speed. AzCopy performs the synchronous copy by downloading the blobs to copy from the specified source to local memory, and then uploading them to the Blob storage destination.

	AzCopy /Source:https://myaccount1.blob.core.windows.net/myContainer/ /Dest:https://myaccount2.blob.core.windows.net/myContainer/ /SourceKey:key1 /DestKey:key2 /Pattern:ab /SyncCopy

`/SyncCopy` might generate additional egress cost compared to asynchronous copy, the recommended approach is to use this option in an Azure VM that is in the same region as your source storage account to avoid egress cost.

## File: Download

### Download single file

	AzCopy /Source:https://myaccount.file.core.windows.net/myfileshare/myfolder1/ /Dest:C:\myfolder /SourceKey:key /Pattern:abc.txt

If the specified source is an Azure file share, then you must either specify the exact file name, (*e.g.* `abc.txt`) to download a single file, or specify option `/S` to download all files in the share recursively. Attempting to specify both a file pattern and option `/S` together will result in an error.

### Download all files

	AzCopy /Source:https://myaccount.file.core.windows.net/myfileshare/ /Dest:C:\myfolder /SourceKey:key /S

Note that any empty folders will not be downloaded.

## File: Upload

### Upload single file

	AzCopy /Source:C:\myfolder /Dest:https://myaccount.file.core.windows.net/myfileshare/ /DestKey:key /Pattern:abc.txt

### Upload all files

	AzCopy /Source:C:\myfolder /Dest:https://myaccount.file.core.windows.net/myfileshare/ /DestKey:key /S

Note that any empty folders will not be uploaded.

### Upload files matching specified pattern

	AzCopy /Source:C:\myfolder /Dest:https://myaccount.file.core.windows.net/myfileshare/ /DestKey:key /Pattern:ab* /S

## File: Copy

### Copy across file shares

	AzCopy /Source:https://myaccount1.file.core.windows.net/myfileshare1/ /Dest:https://myaccount2.file.core.windows.net/myfileshare2/ /SourceKey:key1 /DestKey:key2 /S

### Copy from file share to blob

	AzCopy /Source:https://myaccount1.file.core.windows.net/myfileshare/ /Dest:https://myaccount2.blob.core.windows.net/mycontainer/ /SourceKey:key1 /DestKey:key2 /S

Note that asynchronous copying from File Storage to Page Blob is not supported.

### Copy from blob to file share

	AzCopy /Source:https://myaccount1.blob.core.windows.net/mycontainer/ /Dest:https://myaccount2.file.core.windows.net/myfileshare/ /SourceKey:key1 /DestKey:key2 /S

### Synchronously copy files

You can specify the `/SyncCopy` option to copy data from File Storage to File Storage, from File Storage to Blob Storage and from Blob Storage to File Storage synchronously, AzCopy does this by downloading the source data to local memory and upload it again to destination.

	AzCopy /Source:https://myaccount1.file.core.windows.net/myfileshare1/ /Dest:https://myaccount2.file.core.windows.net/myfileshare2/ /SourceKey:key1 /DestKey:key2 /S /SyncCopy

When copying from File Storage to Blob Storage, the default blob type is block blob, user can specify option `/BlobType:page` to change the destination blob type.

Note that `/SyncCopy` might generate additional egress cost comparing to asynchronous copy, the recommended approach is to use this option in the Azure VM which is in the same region as your source storage account to avoid egress cost.

## Table: Export

### Export table

	AzCopy /Source:https://myaccount.table.core.windows.net/myTable/ /Dest:C:\myfolder\ /SourceKey:key

AzCopy writes a manifest file to the specified destination folder. The manifest file is used in the import process to locate the necessary data files and perform data validation. The manifest file uses the following naming convention by default:

	<account name>_<table name>_<timestamp>.manifest

User can also specify the option `/Manifest:<manifest file name>` to set the manifest file name.

	AzCopy /Source:https://myaccount.table.core.windows.net/myTable/ /Dest:C:\myfolder\ /SourceKey:key /Manifest:abc.manifest

### Split export into multiple files

	AzCopy /Source:https://myaccount.table.core.windows.net/mytable/ /Dest:C:\myfolder /SourceKey:key /S /SplitSize:100

AzCopy uses a *volume index* in the split data file names to distinguish multiple files. The volume index consists of two parts, a *partition key range index* and a *split file index*. Both indexes are zero-based.

The partition key range index will be 0 if user does not specify option `/PKRS`.

For instance, suppose AzCopy generates two data files after the user specifies option `/SplitSize`. The resulting data file names might be:

	myaccount_mytable_20140903T051850.8128447Z_0_0_C3040FE8.json
	myaccount_mytable_20140903T051850.8128447Z_0_1_0AB9AC20.json

Note that the minimum possible value for option `/SplitSize` is 32MB. If the specified destination is Blob storage, AzCopy will split the data file once its sizes reaches the blob size limitation (200GB), regardless of whether option `/SplitSize` has been specified by the user.

### Export table to JSON or CSV data file format

AzCopy by default exports tables to JSON data files. You can specify the option `/PayloadFormat:JSON|CSV` to export the tables as JSON or CSV.

	AzCopy /Source:https://myaccount.table.core.windows.net/myTable/ /Dest:C:\myfolder\ /SourceKey:key /PayloadFormat:CSV

When specifying the CSV payload format, AzCopy will also generate a schema file with file extension `.schema.csv` for each data file.

### Export table entities concurrently

	AzCopy /Source:https://myaccount.table.core.windows.net/myTable/ /Dest:C:\myfolder\ /SourceKey:key /PKRS:"aa#bb"

AzCopy will start concurrent operations to export entities when the user specifies option `/PKRS`. Each operation exports one partition key range.

Note that the number of concurrent operations is also controlled by option `/NC`. AzCopy uses the number of core processors as the default value of `/NC` when copying table entities, even if `/NC` was not specified. When the user specifies option `/PKRS`, AzCopy uses the smaller of the two values - partition key ranges versus implicitly or explicitly specified concurrent operations - to determine the number of concurrent operations to start. For more details, type `AzCopy /?:NC` at the command line.

### Export table to blob

	AzCopy /Source:https://myaccount.table.core.windows.net/myTable/ /Dest:https://myaccount.blob.core.windows.net/mycontainer/ /SourceKey:key1 /Destkey:key2

AzCopy will generate a JSON data file into the blob container with following naming convention:

	<account name>_<table name>_<timestamp>_<volume index>_<CRC>.json

The generated JSON data file follows the payload format for minimal metadata. For details on this payload format, see [Payload Format for Table Service Operations](http://msdn.microsoft.com/library/azure/dn535600.aspx).

Note that when exporting tables to blobs, AzCopy will download the Table entities to local temporary data files and then upload those entities to the blob. These temporary data files are put into the journal file folder with the default path “<code>%LocalAppData%\Microsoft\Azure\AzCopy</code>”, you can specify option /Z:[journal-file-folder] to change the journal file folder location and thus change the temporary data files location. The temporary data files’ size is decided by your table entities’ size and the size you specified with the option /SplitSize, although the temporary data file in local disk will be deleted instantly once it has been uploaded to the blob, please make sure you have enough local disk space to store these temporary data files before they are deleted.

## Table: Import

### Import table

	AzCopy /Source:C:\myfolder\ /Dest:https://myaccount.table.core.windows.net/mytable1/ /DestKey:key /Manifest:"myaccount_mytable_20140103T112020.manifest" /EntityOperation:InsertOrReplace

The option `/EntityOperation` indicates how to insert entities into the table. Possible values are:

- `InsertOrSkip`: Skips an existing entity or inserts a new entity if it does not exist in the table.
- `InsertOrMerge`: Merges an existing entity or inserts a new entity if it does not exist in the table.
- `InsertOrReplace`: Replaces an existing entity or inserts a new entity if it does not exist in the table.

Note that you cannot specify option `/PKRS` in the import scenario. Unlike the export scenario, in which you must specify option `/PKRS` to start concurrent operations, AzCopy will by default start concurrent operations when you import a table. The default number of concurrent operations started is equal to the number of core processors; however, you can specify a different number of concurrent with option `/NC`. For more details, type `AzCopy /?:NC` at the command line.

Note that AzCopy only supports importing for JSON, not CSV. AzCopy does not support table imports from user-created JSON and manifest files. Both of these files must come from an AzCopy table export. To avoid errors, please do not modify the exported JSON or manifest file. 

### Import entities to table using blobs

Assume a Blob container contains the following: A JSON file representing an Azure Table and its accompanying manifest file.

	myaccount_mytable_20140103T112020.manifest
	myaccount_mytable_20140103T112020_0_0_0AF395F1DC42E952.json

You can run the following command to import entities into a table using the manifest file in that blob container:

	AzCopy /Source:https://myaccount.blob.core.windows.net/mycontainer /Dest:https://myaccount.table.core.windows.net/mytable /SourceKey:key1 /DestKey:key2 /Manifest:"myaccount_mytable_20140103T112020.manifest" /EntityOperation:"InsertOrReplace"

## Other AzCopy features

### Only copy data that doesn't exist in the destination

The `/XO` and `/XN` parameters allow you to exclude older or newer source resources from being copied, respectively. If you only want to copy source resources that don't exist in the destination, you can specify both parameters in the AzCopy command:

	/Source:http://myaccount.blob.core.windows.net/mycontainer /Dest:C:\myfolder /SourceKey:<sourcekey> /S /XO /XN

	/Source:C:\myfolder /Dest:http://myaccount.file.core.windows.net/myfileshare /DestKey:<destkey> /S /XO /XN

	/Source:http://myaccount.blob.core.windows.net/mycontainer /Dest:http://myaccount.blob.core.windows.net/mycontainer1 /SourceKey:<sourcekey> /DestKey:<destkey> /S /XO /XN

Note: This is not supported when either the source or destination is a table.

### Use a response file to specify command-line parameters

	AzCopy /@:"C:\responsefiles\copyoperation.txt"

You can include any AzCopy command-line parameters in a response file. AzCopy processes the parameters in the file as if they had been specified on the command line, performing a direct substitution with the contents of the file.

Assume a response file named `copyoperation.txt`, that contains the following lines. Each AzCopy parameter can be specified on a single line

	/Source:http://myaccount.blob.core.windows.net/mycontainer /Dest:C:\myfolder /SourceKey:<sourcekey> /S /Y

or on separate lines:

	/Source:http://myaccount.blob.core.windows.net/mycontainer
	/Dest:C:\myfolder
	/SourceKey:<sourcekey>
	/S
	/Y

AzCopy will fail if you split the parameter across two lines, as shown here for the `/sourcekey` parameter:

	http://myaccount.blob.core.windows.net/mycontainer
 	C:\myfolder
	/sourcekey:
	<sourcekey>
	/S
	/Y

### Use multiple response files to specify command-line parameters

Assume a response file named `source.txt` that specifies a source container:

	/Source:http://myaccount.blob.core.windows.net/mycontainer

And a response file named `dest.txt` that specifies a destination folder in the file system:

	/Dest:C:\myfolder

And a response file named `options.txt` that specifies options for AzCopy:

	/S /Y

To call AzCopy with these response files, all of which reside in a directory `C:\responsefiles`, use this command:

	AzCopy /@:"C:\responsefiles\source.txt" /@:"C:\responsefiles\dest.txt" /SourceKey:<sourcekey> /@:"C:\responsefiles\options.txt"   

AzCopy processes this command just as it would if you included all of the individual parameters on the command line:

	AzCopy /Source:http://myaccount.blob.core.windows.net/mycontainer /Dest:C:\myfolder /SourceKey:<sourcekey> /S /Y

### Specify a shared access signature (SAS)

	AzCopy /Source:https://myaccount.blob.core.windows.net/mycontainer1 /Dest:https://myaccount.blob.core.windows.net/mycontainer2 /SourceSAS:SAS1 /DestSAS:SAS2 /Pattern:abc.txt

You can also specify a SAS on the container URI:

	AzCopy /Source:https://myaccount.blob.core.windows.net/mycontainer1/?SourceSASToken /Dest:C:\myfolder /S

### Journal file folder

Each time you issue a command to AzCopy, it checks whether a journal file exists in the default folder, or whether it exists in a folder that you specified via this option. If the journal file does not exist in either place, AzCopy treats the operation as new and generates a new journal file.

If the journal file does exist, AzCopy will check whether the command line that you input matches the command line in the journal file. If the two command lines match, AzCopy resumes the incomplete operation. If they do not match, you will be prompted to either overwrite the journal file to start a new operation, or to cancel the current operation.

If you want to use the default location for the journal file:

	AzCopy /Source:C:\myfolder /Dest:https://myaccount.blob.core.windows.net/mycontainer /DestKey:key /Z

If you omit option `/Z`, or specify option `/Z` without the folder path, as shown above, AzCopy creates the journal file in the default location, which is `%SystemDrive%\Users\%username%\AppData\Local\Microsoft\Azure\AzCopy`. If the journal file already exists, then AzCopy resumes the operation based on the journal file.

If you want to specify a custom location for the journal file:

	AzCopy /Source:C:\myfolder /Dest:https://myaccount.blob.core.windows.net/mycontainer /DestKey:key /Z:C:\journalfolder\

This example creates the journal file if it does not already exist. If it does exist, then AzCopy resumes the operation based on the journal file.

If you want to resume an AzCopy operation:

	AzCopy /Z:C:\journalfolder\

This example resumes the last operation, which may have failed to complete.

### Generate a log file

	AzCopy /Source:C:\myfolder /Dest:https://myaccount.blob.core.windows.net/mycontainer /DestKey:key /V

If you specify option `/V` without providing a file path to the verbose log, then AzCopy creates the log file in the default location, which is `%SystemDrive%\Users\%username%\AppData\Local\Microsoft\Azure\AzCopy`.

Otherwise, you can create an log file in a custom location:

	AzCopy /Source:C:\myfolder /Dest:https://myaccount.blob.core.windows.net/mycontainer /DestKey:key /V:C:\myfolder\azcopy1.log

Note that if you specify a relative path following option `/V`, such as `/V:test/azcopy1.log`, then the verbose log is created in the current working directory within a subfolder named `test`.

### Specify the number of concurrent operations to start

Option `/NC` specifies the number of concurrent copy operations. By default, AzCopy starts a certain number of concurrent operations to increase the data transfer throughput. For Table operations, the number of concurrent operations is equal to the number of processors you have. For Blob and File operations, the number of concurrent operations is equal 8 times the number of processors you have. If you are running AzCopy across a low-bandwidth network, you can specify a lower number for /NC to avoid failure caused by resource competition.

### Run AzCopy against Azure Storage Emulator

You can run AzCopy against the [Azure Storage Emulator](storage-use-emulator.md) for Blobs:

	AzCopy /Source:https://127.0.0.1:10000/myaccount/mycontainer/ /Dest:C:\myfolder /SourceKey:key /SourceType:Blob /S

and Tables:

	AzCopy /Source:https://127.0.0.1:10002/myaccount/mytable/ /Dest:C:\myfolder /SourceKey:key /SourceType:Table

## AzCopy Parameters

Parameters for AzCopy are described below. You can also type one of the following commands from the command line for help in using AzCopy:

- For detailed command-line help for AzCopy: `AzCopy /?`
- For detailed help with any AzCopy parameter: `AzCopy /?:SourceKey`
- For command-line examples: `AzCopy /?:Samples`

### /Source:"source"

Specifies the source data from which to copy. The source can be a file system directory, a blob container, a blob virtual directory, a storage file share, a storage file directory, or an Azure table.

**Applicable to:** Blobs, Files, Tables

### /Dest:"destination"

Specifies the destination to copy to. The destination can be a file system directory, a blob container, a blob virtual directory, a storage file share, a storage file directory, or an Azure table.

**Applicable to:** Blobs, Files, Tables

### /Pattern:"file-pattern"

Specifies a file pattern that indicates which files to copy. The behavior of the /Pattern parameter is determined by the location of the source data, and the presence of the recursive mode option. Recursive mode is specified via option /S.

If the specified source is a directory in the file system, then standard wildcards are in effect, and the file pattern provided is matched against files within the directory. If option /S is specified, then AzCopy also matches the specified pattern against all files in any subfolders beneath the directory.

If the specified source is a blob container or virtual directory, then wildcards are not applied. If option /S is specified, then AzCopy interprets the specified file pattern as a blob prefix. If option /S is not specified, then AzCopy matches the file pattern against exact blob names.

If the specified source is an Azure file share, then you must either specify the exact file name, (e.g. abc.txt) to copy a single file, or specify option /S to copy all files in the share recursively. Attempting to specify both a file pattern and option /S together will result in an error.

AzCopy uses case-sensitive matching when the /Source is a blob container or blob virtual directory, and uses case-insensitive matching in all the other cases.

The default file pattern used when no file pattern is specified is *.* for a file system location or an empty prefix for an Azure Storage location. Specifying multiple file patterns is not supported.

**Applicable to:** Blobs, Files

### /DestKey:"storage-key"

Specifies the storage account key for the destination resource.

**Applicable to:** Blobs, Files, Tables

### /DestSAS:"sas-token"

Specifies a Shared Access Signature (SAS) with READ and WRITE permissions for the destination (if applicable). Surround the SAS with double quotes, as it may contains special command-line characters.

If the destination resource is a blob container, file share or table, you can either specify this option followed by the SAS token, or you can specify the SAS as part of the destination blob container, file share or table's URI, without this option.

If the source and destination are both blobs, then the destination blob must reside within the same storage account as the source blob.

**Applicable to:** Blobs, Files, Tables

### /SourceKey:"storage-key"

Specifies the storage account key for the source resource.

**Applicable to:** Blobs, Files, Tables

### /SourceSAS:"sas-token"

Specifies a Shared Access Signature with READ and LIST permissions for the source (if applicable). Surround the SAS with double quotes, as it may contains special command-line characters.

If the source resource is a blob container, and neither a key nor a SAS is provided, then the blob container will be read via anonymous access.

If the source is a file share or table, a key or a SAS must be provided.

**Applicable to:** Blobs, Files, Tables

### /S

Specifies recursive mode for copy operations. In recursive mode, AzCopy will copy all blobs or files that match the specified file pattern, including those in subfolders.

**Applicable to:** Blobs, Files

### /BlobType:"block" | "page" | "append"

Specifies whether the destination blob is a block blob, a page blob, or an append blob. This option is applicable only when you are uploading a blob. Otherwise, an error is generated. If the destination is a blob and this option is not specified, by default, AzCopy creates a block blob.

**Applicable to:** Blobs

### /CheckMD5

Calculates an MD5 hash for downloaded data and verifies that the MD5 hash stored in the blob or file's Content-MD5 property matches the calculated hash. The MD5 check is turned off by default, so you must specify this option to perform the MD5 check when downloading data.

Note that Azure Storage doesn't guarantee that the MD5 hash stored for the blob or file is up-to-date. It is client's responsibility to update the MD5 whenever the blob or file is modified.

AzCopy always sets the Content-MD5 property for an Azure blob or file after uploading it to the service.  

**Applicable to:** Blobs, Files

### /Snapshot

Indicates whether to transfer snapshots. This option is only valid when the source is a blob.

The transferred blob snapshots are renamed in this format: blob-name (snapshot-time).extension

By default, snapshots are not copied.

**Applicable to:** Blobs

### /V:[verbose-log-file]

Outputs verbose status messages into a log file.

By default, the verbose log file is named AzCopyVerbose.log in `%LocalAppData%\Microsoft\Azure\AzCopy`. If you specify an existing file location for this option, the verbose log will be appended to that file.  

**Applicable to:** Blobs, Files, Tables

### /Z:[journal-file-folder]

Specifies a journal file folder for resuming an operation.

AzCopy always supports resuming if an operation has been interrupted.

If this option is not specified, or it is specified without a folder path, then AzCopy will create the journal file in the default location, which is %LocalAppData%\Microsoft\Azure\AzCopy.

Each time you issue a command to AzCopy, it checks whether a journal file exists in the default folder, or whether it exists in a folder that you specified via this option. If the journal file does not exist in either place, AzCopy treats the operation as new and generates a new journal file.

If the journal file does exist, AzCopy will check whether the command line that you input matches the command line in the journal file. If the two command lines match, AzCopy resumes the incomplete operation. If they do not match, you will be prompted to either overwrite the journal file to start a new operation, or to cancel the current operation.

The journal file is deleted upon successful completion of the operation.

Note that resuming an operation from a journal file created by a previous version of AzCopy is not supported.

**Applicable to:** Blobs, Files, Tables

### /@:"parameter-file"

Specifies a file that contains parameters. AzCopy processes the parameters in the file just as if they had been specified on the command line.

In a response file, you can either specify multiple parameters on a single line, or specify each parameter on its own line. Note that an individual parameter cannot span multiple lines.

Response files can include comments lines that begin with the # symbol.

You can specify multiple response files. However, note that AzCopy does not support nested response files.

**Applicable to:** Blobs, Files, Tables

### /Y

Suppresses all AzCopy confirmation prompts.

**Applicable to:** Blobs, Files, Tables

### /L

Specifies a listing operation only; no data is copied.

AzCopy will interpret the using of this option as a simulation for running the command line without this option /L and count how many objects will be copied, you can specify option /V at the same time to check which objects will be copied in the verbose log.

The behavior of this option is also determined by the location of the source data and the presence of the recursive mode option /S and file pattern option /Pattern.

AzCopy requires LIST and READ permission of this source location when using this option.

**Applicable to:** Blobs, Files

### /MT

Sets the downloaded file's last-modified time to be the same as the source blob or file's.

**Applicable to:** Blobs, Files

### /XN

Excludes a newer source resource. The resource will not be copied if the last modified time of the source is the same or newer than destination.

**Applicable to:** Blobs, Files

### /XO

Excludes an older source resource. The resource will not be copied if the last modified time of the source is the same or older than destination.

**Applicable to:** Blobs, Files

### /A

Uploads only files that have the Archive attribute set.

**Applicable to:** Blobs, Files

### /IA:[RASHCNETOI]

Uploads only files that have any of the specified attributes set.

Available attributes include:

- R = Read-only files
- A = Files ready for archiving
- S = System files
- H = Hidden files
- C = Compressed files
- N = Normal files
- E = Encrypted files
- T = Temporary files
- O = Offline files
- I = Non-indexed files

**Applicable to:** Blobs, Files

### /XA:[RASHCNETOI]

Excludes files that have any of the specified attributes set.

Available attributes include:

- R = Read-only files
- A = Files ready for archiving
- S = System files
- H = Hidden files
- C = Compressed files
- N = Normal files
- E = Encrypted files
- T = Temporary files
- O = Offline files
- I = Non-indexed files

**Applicable to:** Blobs, Files

### /Delimiter:"delimiter"

Indicates the delimiter character used to delimit virtual directories in a blob name.

By default, AzCopy uses / as the delimiter character. However, AzCopy supports using any common character (such as @, #, or %) as a delimiter. If you need to include one of these special characters on the command line, enclose the file name with double quotes.

This option is only applicable for downloading blobs.

**Applicable to:** Blobs

### /NC:"number-of-concurrent-operations"

Specifies the number of concurrent operations.

AzCopy by default starts a certain number of concurrent operations to increase the data transfer throughput. Note that large number of concurrent operations in a low-bandwidth environment may overwhelm the network connection and prevent the operations from fully completing. Throttle concurrent operations based on actual available network bandwidth.

The upper limit for concurrent operations is 512.

**Applicable to:** Blobs, Files, Tables

### /SourceType:"Blob" | "Table"

Specifies that the `source` resource is a blob available in the local development environment, running in the storage emulator.

**Applicable to:** Blobs, Tables

### /DestType:"Blob" | "Table"

Specifies that the `destination` resource is a blob available in the local development environment, running in the storage emulator.

**Applicable to:** Blobs, Tables

### /PKRS:"key1#key2#key3#..."

Splits the partition key range to enable exporting table data in parallel, which increases the speed of the export operation.

If this option is not specified, then AzCopy uses a single thread to export table entities. For example, if the user specifies /PKRS:"aa#bb", then AzCopy starts three concurrent operations.

Each operation exports one of three partition key ranges, as shown below:

  [first-partition-key, aa)

  [aa, bb)

  [bb, last-partition-key]

**Applicable to:** Tables

### /SplitSize:"file-size"

Specifies the exported file split size in MB, the minimal value allowed is 32.

If this option is not specified, AzCopy will export table data to single file.

If the table data is exported to a blob, and the exported file size reaches the 200 GB limit for blob size, then AzCopy will split the exported file, even if this option is not specified.

**Applicable to:** Tables

### /EntityOperation:"InsertOrSkip" | "InsertOrMerge" | "InsertOrReplace"

Specifies the table data import behavior.

- InsertOrSkip - Skips an existing entity or inserts a new entity if it does not exist in the table.

- InsertOrMerge - Merges an existing entity or inserts a new entity if it does not exist in the table.

- InsertOrReplace - Replaces an existing entity or inserts a new entity if it does not exist in the table.

**Applicable to:** Tables

### /Manifest:"manifest-file"

Specifies the manifest file for the table export and import operation.

This option is optional during the export operation, AzCopy will generate a manifest file with predefined name if this option is not specified.

This option is required during the import operation for locating the data files.

**Applicable to:** Tables

### /SyncCopy

Indicates whether to synchronously copy blobs or files between two Azure Storage endpoints.

AzCopy by default uses server-side asynchronous copy. Specify this option to perform a synchronous copy, which downloads blobs or files to local memory and then uploads them to Azure Storage.

You can use this option when copying files within Blob storage, within File storage, or from Blob storage to File storage or vice versa.

**Applicable to:** Blobs, Files

### /SetContentType:"content-type"

Specifies the MIME content type for destination blobs or files.

AzCopy sets the content type for a blob or file to application/octet-stream by default. You can set the content type for all blobs or files by explicitly specifying a value for this option.

If you specify this option without a value, then AzCopy will set each blob or file's content type according to its file extension.

**Applicable to:** Blobs, Files

### /PayloadFormat:"JSON" | "CSV"

Specifies the format of the table exported data file.

If this option is not specified, by default AzCopy exports table data file in JSON format.

**Applicable to:** Tables

## Known Issues and Best Practices

### Limit concurrent writes while copying data

When you copy blobs or files with AzCopy, keep in mind that another application may be modifying the data while you are copying it. If possible, ensure that the data you are copying is not being modified during the copy operation. For example, when copying a VHD associated with an Azure virtual machine, make sure that no other applications are currently writing to the VHD. A good way to do this is by leasing the resource to be copied. Alternately, you can create a snapshot of the VHD first and then copy the snapshot.

If you cannot prevent other applications from writing to blobs or files while they are being copied, then keep in mind that by the time the job finishes, the copied resources may no longer have full parity with the source resources.

### Run one AzCopy instance on one machine.
AzCopy is designed to maximize the utilization of your machine resource to accelerate the data transfer, we recommend you run only one AzCopy instance on one machine, and specify the option `/NC` if you need more concurrent operations. For more details, type `AzCopy /?:NC` at the command line.

### Enable FIPS compliant MD5 algorithms for AzCopy when you "Use FIPS compliant algorithms for encryption, hashing and signing".
AzCopy by default uses .NET MD5 implementation to calculate the MD5 when copying objects, but there are some security requirements that need AzCopy to enable FIPS compliant MD5 setting.

You can create an app.config file `AzCopy.exe.config` with property `AzureStorageUseV1MD5` and put it aside with AzCopy.exe.

	<?xml version="1.0" encoding="utf-8" ?>
	<configuration>
	  <appSettings>
	    <add key="AzureStorageUseV1MD5" value="false"/>
	  </appSettings>
	</configuration>

For property “AzureStorageUseV1MD5”
• True - The default value, AzCopy will use .NET MD5 implementation.
• False – AzCopy will use FIPS compliant MD5 algorithm.

Note that FIPS compliant algorithms is disabled by default on your Windows machine, you can type secpol.msc in your Run window and check this switch at Security Setting->Local Policy->Security Options->System cryptography: Use FIPS compliant algorithms for encryption, hashing and signing.

## Next steps

For more information about Azure Storage and AzCopy, refer to the following resources.

### Azure Storage documentation:

- [Introduction to Azure Storage](storage-introduction.md)
- [How to use Blob storage from .NET](storage-dotnet-how-to-use-blobs.md)
- [How to use File storage from .NET](storage-dotnet-how-to-use-files.md)
- [How to use Table storage from .NET](storage-dotnet-how-to-use-tables.md)
- [How to create, manage, or delete a storage account](storage-create-storage-account.md)

### Azure Storage blog posts:
- [Introducing Azure Storage Data Movement Library Preview](https://azure.microsoft.com/blog/introducing-azure-storage-data-movement-library-preview-2/)
- [AzCopy: Introducing synchronous copy and customized content type](http://blogs.msdn.com/b/windowsazurestorage/archive/2015/01/13/azcopy-introducing-synchronous-copy-and-customized-content-type.aspx)
- [AzCopy: Announcing General Availability of AzCopy 3.0 plus preview release of AzCopy 4.0 with Table and File support](http://blogs.msdn.com/b/windowsazurestorage/archive/2014/10/29/azcopy-announcing-general-availability-of-azcopy-3-0-plus-preview-release-of-azcopy-4-0-with-table-and-file-support.aspx)
- [AzCopy: Optimized for Large-Scale Copy Scenarios](http://go.microsoft.com/fwlink/?LinkId=507682)
- [AzCopy: Support for read-access geo-redundant storage](http://blogs.msdn.com/b/windowsazurestorage/archive/2014/04/07/azcopy-support-for-read-access-geo-redundant-account.aspx)
- [AzCopy: Transfer data with re-startable mode and SAS token](http://blogs.msdn.com/b/windowsazurestorage/archive/2013/09/07/azcopy-transfer-data-with-re-startable-mode-and-sas-token.aspx)
- [AzCopy: Using cross-account Copy Blob](http://blogs.msdn.com/b/windowsazurestorage/archive/2013/04/01/azcopy-using-cross-account-copy-blob.aspx)
- [AzCopy: Uploading/downloading files for Azure Blobs](http://blogs.msdn.com/b/windowsazurestorage/archive/2012/12/03/azcopy-uploading-downloading-files-for-windows-azure-blobs.aspx)
