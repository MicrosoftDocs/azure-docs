<properties linkid="storage-use-azcopy" urlDisplayName="AZCopy" pageTitle="How to use AZCopy with Microsoft Azure Storage" metaKeywords="Get started Azure AZCopy   Azure unstructured data   Azure unstructured storage   Azure blob   Azure blob storage   Azure file   Azure file storage   Azure file share   AZCopy" description="Learn how to use the AZCopy utility to upload, download, and copy blob and file content." metaCanonical="" disqusComments="1" umbracoNaviHide="1" services="storage" documentationCenter="" title="How to use AZCopy with Microsoft Azure Storage" authors="tamram" manager="mbaldwin" editor="cgronlun" />

# Getting Started with the AZCopy Command-Line Utility

AzCopy is a command-line utility for uploading, downloading, and copying data in Microsoft Azure Blob and File storage. This guide provides an overview for using AZCopy.

## Download and install AZCopy

1. Download the latest version from aka.ms/azcopy, or from the Microsoft Download Center (Click ‘Download’ button and choose “WindowsAzureStorageTools.MSI”).
2. Run the installation. By default, AZCopy is installed to `C:\Program Files (x86)\Microsoft SDKs\Azure\AzCopy`.

## Explore the AZCopy command-line syntax

Next, open a Windows Azure PowerShell window, and navigate to the AZCopy installation directory on your computer, as shown above.

AZCopy commands follow this pattern:

	AzCopy <source> <destination> [filepattern [filepattern]] [options]

- The `<source>` parameter specifies the source data from which to copy. The source can be a local directory, a blob container, a blob virtual directory, or a storage file share.

- The `<destination>` parameter specifies the destination to copy to. The destination can be a local directory, a blob container, a blob virtual directory, or a storage file share.

- The behavior of the optional `filepattern` parameter is determined by the location of the source data, and the presence of the recursive mode option. Recursive mode is specified via option `/S`. 
	
	If the specified source is a directory in the local file system, then standard wildcards are in effect, and the patterns provided are matched against files within the directory. If option `/S` is specified, then AZCopy also matches the specified patterns against all files in any subfolders beneath the directory.
	
	If the specified source is a blob container or virtual directory, then wildcards are not applied. If option `/S ` is specified, then AZCopy interprets any file patterns as prefixes. If option `/S` is not specified, then AZCopy matches file patterns against exact blob names.
	
	If the specified source is an Azure file share, then you must either specify the exact file name, (e.g. "abc.txt") to copy a single file, or specify option `/s` to copy all files in the share (recursively???). Attempting to specify both a file pattern and option `/s` together will result in an error.
	
	The default file pattern used when no file pattern is specified is `*.*` for a local directory, or an empty prefix for an Azure Blob or File storage resource.

	You can specify multiple file patterns on the AZCopy command line, and objects matching any of those file pattern will be transferred.

- The available `options` are described in the table below. Type `.\AZCopy.exe` from the command line for additional help with options.

| Option Name                | Description                                                                                                                                                     | Applicable to Blob Storage (Y/N) | Applicable to File Storage (Y/N) |
|----------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------|---------------------------|
| **/DestKey:<storage-key>**     | Specifies the storage key for the destination resource.                                                                                                                    | Y                         | Y                         |
| **/DestSAS:<container-SAS>**   | Specifies a Shared Access Signature for the destination container (if applicable).                                                                                | Y                         | N                         |
| **/SourceKey:<storage-key>**   | Specifies the storage key for the source.                                                                                                                         | Y                         | Y                         |
| **/SourceSAS:<container-SAS>** | Specifies a Shared Access Signature for the source container (if applicable).                                                                                     | Y                         | N                         |
| **/S**                         | Specifies recursive mode for copy operations. In recursive mode, AzCopy will copy all blobs or files that match the specified file patterns, including those in subfolders.                                                                                                                                                  | Y                         | Y                         
| **/BlobType:<page&#124;block>**     | Specifies that the destination is a block blob or a page blob.                                                                                    | Y                         | N                         |
| **/CheckMd5**                  | Calculates an MD5 hash for downloaded data and verifies that the MD5 hash stored for the blob or file matches.                                                 | Y                         | Y                         |
| **/Snapshot**                  | Indicates whether to transfer snapshots.                                                                                                                  | Y                         | N                         |
| **/V:[verbose log-file]**      | Outputs verbose status messages into a log file.                                                                                                          | Y                         | Y                         |
| **/Z:[journal-file]**          | Specifies restartable mode.                                                                                                                                                | Y                         | Y                         |
| **/@:response-file**           | Specifies a file that contains parameters. AZCopy processes the parameters in the file just as if they had been specified on the command line. | Y                         | Y                         |
| **/Y**                         | Suppresses confirmation prompts when overwriting an existing destination blob or file.                                                                         | Y                         | Y                         |
| **/L**                         | Specifies a listing operation only; no data is copied.                                                                                                                                          | Y                         | Y                         |
| **/Mov**                       | **Deprecated.** Moves blobs or files and deletes the source after the it has been transferred.                                                          | Y                         | Y                         |
| **/MT**                        | Sets the downloaded file's last modified time to be the same as the source blob or file's.                                                                            | Y                         | Y                         |
| **/XN**                        | Excludes a newer source file. The file will not be copied if the source file is newer than destination.                                                                                                   | Y                         | Y                         |
| **/XO**                        | Excludes an older source file. The file will not be copied if the source file is older than destination.                                                                                                   | Y                         | Y                         |
| **/A**                         | Copies only blobs or files that have the Archive attribute set.                                                                                                         | Y                         | Y                         |
| **/IA:[RASHCNETOI]**           | Includes only blobs or files with any of the specified attributes set.                                                                                                   | Y                         | Y                         |
| **/XA:[RASHCNETOI]**           | Excludes blobs or files with any of the specified attributes set.                                                                                                        | Y                         | Y                         |
| **/Delimiter:<delimiter>**     | Indicates the delimiter character used to delimit virtual directories in a blob name.                                                                                          | Y                         | N                         |
| **/NC**                        | Specifies the number of concurrent threads.                                                                                                                                    | Y                         | Y                         |
| **/SourceType:Blob**           | Specifies that the source is a blob available in the local development environment, running in the storage emulator.                                                    | Y                         | N                         |
| **/DestType:Blob**             | Specifies that the destination is a blob available in the local development environment, running in the storage emulator.                                               | Y                         | N                         |


## Copying blobs with AZCopy

The examples below show a variety of scenarios for copying blobs with AZCopy.

### Copy a single blob.

Copy from your local file system to Blob storage:
	
	AzCopy C:\test\ https://myaccount.blob.core.windows.net/mycontainer/ /destkey:key abc.txt

Copy from Blob storage to your local file system:

	AzCopy https://myaccount.blob.core.windows.net/mycontainer/ C:\test\ /sourcekey:key abc.txt

Copy a blob within a storage account:

	AzCopy https://myaccount.blob.core.windows.net/mycontainer/mycontainer1/ https://myaccount.blob.core.windows.net/mycontainer2/ /sourcekey:key /destkey:key abc.txt

Copy across storage accounts:

	AzCopy https://sourceaccount.blob.core.windows.net/mycontainer/mycontainer1/ https://destaccount.blob.core.windows.net/mycontainer2/ /sourcekey:key1 /destkey:key2 abc.txt
 
### Copy a blob from the secondary location 

Geo-Redundant account’s data in secondary region. (For Read access Geo-Redundant account storage, please check details at here)