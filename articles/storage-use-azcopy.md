<properties linkid="storage-use-azcopy" urlDisplayName="AZCopy" pageTitle="How to use AZCopy with Microsoft Azure Storage" metaKeywords="Get started Azure AZCopy   Azure unstructured data   Azure unstructured storage   Azure blob   Azure blob storage   Azure file   Azure file storage   Azure file share   AZCopy" description="Learn how to use the AZCopy utility to upload, download, and copy blob and file content." metaCanonical="" disqusComments="1" umbracoNaviHide="1" services="storage" documentationCenter="" title="How to use AZCopy with Microsoft Azure Storage" authors="tamram" manager="mbaldwin" editor="cgronlun" />

# Getting Started with the AZCopy Command-Line Utility

AzCopy is a command-line utility designed for high-performance uploading, downloading, and copying data to and from Microsoft Azure Blob and File storage. This guide provides an overview for using AZCopy.

> [WACOM.NOTE] This guide assumes that you have installed AZCopy 2.5 or later.

## Download and install AZCopy

1. Download the [latest version of AZCopy](http://az635501.vo.msecnd.net/azcopy-2-5-0/MicrosoftAzureStorageTools.msi).
2. Run the installation. By default, AZCopy is installed to `C:\Program Files (x86)\Microsoft SDKs\Azure\AzCopy`. However, you can change the installation path from the setup wizard.

## Explore the AZCopy command-line syntax

Next, open a command window, and navigate to the AZCopy installation directory on your computer, where the `AzCopy.exe` executable is located. By default the installation directory is `C:\Program Files (x86)\Microsoft SDKs\Azure\AzCopy`.

The basic syntax for AZCopy commands is:

	AzCopy <source> <destination> [filepattern] [options]

- The `<source>` parameter specifies the source data from which to copy. The source can be a local directory, a blob container, a blob virtual directory, or a storage file share.

- The `<destination>` parameter specifies the destination to copy to. The destination can be a local directory, a blob container, a blob virtual directory, or a storage file share.

- The behavior of the optional `filepattern` parameter is determined by the location of the source data, and the presence of the recursive mode option. Recursive mode is specified via option `/S`. 
	
	If the specified source is a directory in the local file system, then standard wildcards are in effect, and the file pattern provided is matched against files within the directory. If option `/S` is specified, then AZCopy also matches the specified pattern against all files in any subfolders beneath the directory.
	
	If the specified source is a blob container or virtual directory, then wildcards are not applied. If option `/S ` is specified, then AZCopy interprets the specified file pattern as a blob prefix. If option `/S` is not specified, then AZCopy matches the file pattern against exact blob names.
	
	If the specified source is an Azure file share, then you must either specify the exact file name, (e.g. "abc.txt") to copy a single file, or specify option `/s` to copy all files in the share. Attempting to specify both a file pattern and option `/s` together will result in an error.
	
	The default file pattern used when no file pattern is specified is `*.*` for a local directory, or an empty prefix for an Azure Blob or File storage resource.

	> [WACOM.NOTE] Due to performance considerations, AZCopy version 2.5 no longer supports multiple file patterns in a single command. You must now issue multiple commands, each with a single file pattern, to address the scenario of multiple file patterns.

- The available `options` are described in the table below. You can also type `.\AZCopy.exe` from the command line for help with options.

| Option Name                | Description                                                                                                                                                     | Applicable to Blob Storage (Y/N) | Applicable to File Storage (Y/N) |
|----------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------|---------------------------|
| **/DestKey:<storage-key>**     | Specifies the storage key for the destination resource.                                                                                                                    | Y                         | Y                         |
| **/DestSAS:<container-SAS>**   | Specifies a Shared Access Signature (SAS) for the destination container (if applicable). Surround the SAS with double quotes, as it may contains special command-line characters. This option is not valid for copying a blob. If the destination resource is a blob, you must provide for this option exactly one account access key, or a SAS for the command-line option or in destination location URI. This option is applicable only for Blob storage.                                                                               | Y                         | N                         |
| **/SourceKey:<storage-key>**   | Specifies the storage key for the source.                                                                                                                         | Y                         | Y                         |
| **/SourceSAS:<container-SAS>** | Specifies a Shared Access Signature for the source container (if applicable). Surround the SAS with double quotation marks, as it may contains special command-line characters. If the source is a blob resource, and neither a key nor a SAS is provided, then the container will be read via anonymous access. This option is applicable only for Blob storage.                                                                                    | Y                         | N                         |
| **/S**                         | Specifies recursive mode for copy operations. In recursive mode, AzCopy will copy all blobs or files that match the specified file pattern, including those in subfolders.                                                                                                                                                  | Y                         | Y                         
| **/BlobType:<page&#124;block>**     | Specifies that the destination is a block blob or a page blob. This option is applicable only when the destination is a blob resource; otherwise, an error is generated. If the destination is a blob resource and the `BlobType` parameter is not specified, then by default AZCopy will assume that a block blob is desired.                                                                                    | Y                         | N                         |
| **/CheckMd5**                  | Calculates an MD5 hash for downloaded data and verifies that the MD5 hash stored on the server for the blob or file matches. The MD5 check is turned off by default. Note that Azure Storage doesn't guarantee that the MD5 hash stored on the server for the blob or file is up to date. It is client's responsibility to update the MD5 whenever the blob or file is modified. AzCopy always sets the latest MD5 hash to the blob or file's property after finishing uploading a blob or file.                                                | Y                         | Y                         |
| **/Snapshot**                  | Indicates whether to transfer snapshots. This option is only valid when the source is a blob resource. By default, snapshots are not copied. The transferred blob snapshots are renamed in this format: [blob-name] (snapshot-time)[extension].                                                                                                                 | Y                         | N                         |
| **/V:[verbose log-file]**      | Outputs verbose status messages into a log file. By default, the verbose log file is named `AzCopyVerbose.log` in the `%localAppData%` folder, `%SystemDrive%\Users\%username%\AppData\Local\Microsoft\Azure\AzCopy`. If you specify an existing file location for this option, the verbose log will be appended to that file.                                                                                                        | Y                         | Y                         |
| **/Z:[journal-file-folder]**          | Specifies a journal file folder for resuming. AzCopy always supports resume mode. | Y                         | Y                         |
| **/@:response-file**           | Specifies a file that contains parameters. AZCopy processes the parameters in the file just as if they had been specified on the command line. In a response file, multiple parameters can appear on one line. A single parameter must appear on one line; it cannot span multiple lines. Response files can include comments lines that begin with the `#` symbol. You can specify multiple response files. However, note that AzCopy does not support nested response files. | Y                         | Y                         |
| **/Y**                         | Suppresses all AZCopy confirmation prompts.                                                                         | Y                         | Y                         |
| **/L**                         | Specifies a listing operation only; no data is copied.                                                                                                                                          | Y                         | Y                         |
| **/Mov**                       | **Deprecated.** Moves blobs or files and deletes the source after it has been transferred.                                                          | Y                         | Y                         |
| **/MT**                        | Sets the downloaded file's last-modified time to be the same as the source blob or file's.                                                                            | Y                         | Y                         |
| **/XN**                        | Excludes a newer source file. The file will not be copied if the source file is newer than destination.                                                                                                   | Y                         | Y                         |
| **/XO**                        | Excludes an older source file. The file will not be copied if the source file is older than destination.                                                                                                   | Y                         | Y                         |
| **/A**                         | Copies only blobs or files that have the Archive attribute set.                                                                                                         | Y                         | Y                         |
| **/IA:[RASHCNETOI]**           | Includes only blobs or files with any of the specified attributes set.                                                                                                   | Y                         | Y                         |
| **/XA:[RASHCNETOI]**           | Excludes blobs or files with any of the specified attributes set.                                                                                                        | Y                         | Y                         |
| **/Delimiter:<delimiter>**     | Indicates the delimiter character used to delimit virtual directories in a blob name.                                                                                          | Y                         | N                         |
| **/NC**                        | Specifies the number of concurrent threads.                                                                                                                                    | Y                         | Y                         |
| **/SourceType:Blob**           | Specifies that the source is a blob available in the local development environment, running in the storage emulator.                                                    | Y                         | N                         |
| **/DestType:Blob**             | Specifies that the destination is a blob available in the local development environment, running in the storage emulator.                                               | Y                         | N                         |
<br/>

## Copying blobs with AZCopy

The examples below demonstrate a variety of scenarios for copying blobs with AZCopy.

### Copy a single blob.

**Copy from your local file system to Blob storage:**
	
	AzCopy C:\test\ https://myaccount.blob.core.windows.net/mycontainer/ /destkey:key abc.txt

**Copy from Blob storage to your local file system:**

	AzCopy https://myaccount.blob.core.windows.net/mycontainer/ C:\test\ /sourcekey:key abc.txt

**Copy a blob within a storage account:**

	AzCopy https://myaccount.blob.core.windows.net/mycontainer/mycontainer1/ https://myaccount.blob.core.windows.net/mycontainer2/ /sourcekey:key /destkey:key abc.txt

**Copy across storage accounts:**

	AzCopy https://sourceaccount.blob.core.windows.net/mycontainer/mycontainer1/ https://destaccount.blob.core.windows.net/mycontainer2/ /sourcekey:key1 /destkey:key2 abc.txt
 
### Copy a blob from the secondary region 

If your storage account has read-access geo-redundant storage enabled, then you can copy data from the secondary region. 

**Copy to the primary account:**

	AzCopy https://myaccount-secondary.blob.core.windows.net/mynewcontainer/ https://myaccount.blob.core.windows.net/mynewcontainer/ /sourcekey:key /destkey:key abc.txt

**Download to a local file:**

	AzCopy https://myaccount-secondary.blob.core.windows.net/mynewcontainer/ d:\test\ /sourcekey:key abc.txt

### Copy from a local file to a non-existent blob container or virtual directory

**Upload a file to blob container that may not exist yet:**

	AzCopy D:\test\ https://myaccount.blob.core.windows.net/mynewcontainer/ /destkey:key abc.txt

Note that if the specified destination container does not exist, AzCopy will create it and upload the file into it.

**Upload a file to blob virtual directory that may not exist yet:**

	AzCopy D:\test\ https://myaccount.blob.core.windows.net/mycontainer/vd /destkey:key abc.txt

Note that if the specified virtual directory does not exist, AzCopy will upload the file to include the virtual directory in its name (*e.g.*, `vd/abc.txt` in the example above).

### Copy a blob to a folder that may not exist yet

	AzCopy https://myaccount.blob.core.windows.net/mycontainer/ D:\test\ /sourcekey:key abc.txt

If the local folder `D:\test` does not yet exist, AzCopy will create this folder on the local file system and download `abc.txt `into it.

### Copy all files from a local directory recursively to a blob container.

	AzCopy D:\test\ https://myaccount.blob.core.windows.net/mycontainer/ /destkey:key /s

Specifying option `/s` copies the specified directory to Blob storage recursively, meaning that all subfolders and their files will be copied as well. For instance, assume the following files reside in folder `D:\test`:

	D:\test\abc.txt
	D:\test\abc1.txt
	D:\test\abc2.txt
	D:\test\subfolder\a.txt
	D:\test\subfolder\abcd.txt

After the copy operation, the blob container will include the following files:

    abc.txt
    abc1.txt
    abc2.txt
    subfolder\a.txt
    subfolder\abcd.txt









## AZCopy Versions

| Version | What's New                                                                                      				|
|---------|-----------------------------------------------------------------------------------------------------------------|
| V2.5.0  | Optimizes performance for large-scale copy scenarios, and introduces several important usability improvements.	
| V2.4.0  | Supports uploading and downloading files for Azure File storage.                       				                              
| V2.3.0  | Supports read-access geo-redundant storage accounts.                                                  			|
| V2.2.2  | Upgraded to use Azure storage client library version 3.0.3.                                            				                    
| V2.2.1  | Fixed performance issue when copying large amount files within same storage account.            				                                                
| V2.2    | Supports setting the virtual directory delimiter for blob names. Supports specifying the journal file path.		|
| V2.1    | Provides more than 20 options to support blob upload, download, and copy operations in an efficient way.		|


                                                        