---
title: Copy or move data to Storage with AzCopy on Linux | Microsoft Docs
description: Use the AzCopy on Linux utility to move or copy data to or from blob, table, and file content. Copy data to Azure Storage from local files, or copy data within or between storage accounts. Easily migrate your data to Azure Storage.
services: storage
documentationcenter: ''
author: seguler
manager: jahogg
editor: tysonn

ms.assetid: aa155738-7c69-4a83-94f8-b97af4461274
ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/11/2017
ms.author: seguler

---
# Transfer data with the AzCopy Command-Line Utility on Linux
## Overview
AzCopy is a command-line utility designed for copying data to and from Microsoft Azure Blob, File, and Table storage using simple commands with optimal performance. You can copy data from one object to another within your storage account, or between storage accounts.

There are two versions of AzCopy that you can download. AzCopy on Windows is built with .NET Framework, and offers Windows style command-line options. AzCopy on Linux is built with .NET Core Framework, which targets Linux platforms offering POSIX style command-line options. In this article, you will learn about AzCopy on Linux.

## Download and install AzCopy
### AzCopy on Linux
#### Installation on Linux

AzCopy on Linux requires .NET Core framework on the platform. See the installation instructions on the [.NET Core] (https://www.microsoft.com/net/core#linuxredhat) page.

As an example, let's install .NET Core on Ubuntu 16.10:

```bash
sudo sh -c 'echo "deb [arch=amd64] https://apt-mo.trafficmanager.net/repos/dotnet-release/ yakkety main" > /etc/apt/sources.list.d/dotnetdev.list' 
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 417A0893
sudo apt-get update
sudo apt-get install dotnet-dev-1.0.4
```

Once you have installed .NET Core, download and install AzCopy.

##### Ubuntu

```bash
sudo apt-get install azcopy
```

##### Other Linux distributions

```bash
wget -O azcopy.tar.gz https://aka.ms/downloadazcopyprlinux
tar -xf azcopy.tar.gz
sudo ./install.sh
```

You can remove the extracted files once AzCopy on Linux is installed. Alternatively if you do not have superuser privileges, you can also run AzCopy using the shell script 'azcopy' in the extracted folder. 

## Writing your first AzCopy command
The basic syntax for AzCopy commands is:

```azcopy
azcopy --source <source> --destination <destination> [Options]
```

The following examples demonstrate various scenarios for copying data to and from Microsoft Azure Blobs, Files, and Tables. Refer to the [AzCopy Parameters](#azcopy-parameters) section for a detailed explanation of the parameters used in each sample.

## Blob: Download
### Download single blob

```azcopy
azcopy --source https://myaccount.blob.core.windows.net/mycontainer --destination /mnt/myfiles --source-key <key> --include "abc.txt"
```

Note that if the folder `/mnt/myfiles` does not exist, AzCopy will create it and download `abc.txt ` into the new folder.

### Download single blob from secondary region

```azcopy
azcopy --source https://myaccount-secondary.blob.core.windows.net/mynewcontainer --destination /mnt/myfiles --source-key <key> --include "abc.txt"
```

Note that you must have read-access geo-redundant storage enabled.

### Download all blobs

```azcopy
azcopy --source https://myaccount.blob.core.windows.net/mycontainer --destination /mnt/myfiles --source-key <key> --recursive
```

Assume the following blobs reside in the specified container:  

    abc.txt
    abc1.txt
    abc2.txt
    vd1/a.txt
    vd1/abcd.txt

After the download operation, the directory `/mnt/myfiles` will include the following files:

    /mnt/myfiles/abc.txt
    /mnt/myfiles/abc1.txt
    /mnt/myfiles/abc2.txt
    /mnt/myfiles/vd1/a.txt
    /mnt/myfiles/vd1/abcd.txt

If you do not specify option `--recursive`, no blobs will be downloaded.

### Download blobs with specified prefix

```azcopy
azcopy --source https://myaccount.blob.core.windows.net/mycontainer --destination /mnt/myfiles --source-key <key> --include "a" --recursive
```

Assume the following blobs reside in the specified container. All blobs beginning with the prefix `a` will be downloaded.

    abc.txt
    abc1.txt
    abc2.txt
    xyz.txt
    vd1\a.txt
    vd1\abcd.txt

After the download operation, the folder `/mnt/myfiles` will include the following files:

    /mnt/myfiles/abc.txt
    /mnt/myfiles/abc1.txt
    /mnt/myfiles/abc2.txt

The prefix applies to the virtual directory, which forms the first part of the blob name. In the example shown above, the virtual directory does not match the specified prefix, so it is not downloaded. In addition, if the option `--recursive` is not specified, AzCopy will not download any blobs.

### Set the last-modified time of exported files to be same as the source blobs

```azcopy
azcopy --source https://myaccount.blob.core.windows.net/mycontainer --destination "/mnt/myfiles" --source-key <key> --preserve-last-modified-time
```

You can also exclude blobs from the download operation based on their last-modified time. For example, if you want to exclude blobs whose last modified time is the same or newer than the destination file, add the `--exclude-newer` option:

```azcopy
azcopy --source https://myaccount.blob.core.windows.net/mycontainer --destination /mnt/myfiles --source-key <key> --preserve-last-modified-time --exclude-newer
```

Or if you want to exclude blobs whose last modified time is the same or older than the destination file, add the `--exclude-older` option:

```azcopy
azcopy --source https://myaccount.blob.core.windows.net/mycontainer --destination /mnt/myfiles --source-key <key> --preserve-last-modified-time --exclude-older
```

## Blob: Upload
### Upload single file

```azcopy
azcopy --source /mnt/myfiles --destination https://myaccount.blob.core.windows.net/mycontainer --dest-key <key> --include "abc.txt"
```

If the specified destination container does not exist, AzCopy will create it and upload the file into it.

### Upload single file to virtual directory

```azcopy
azcopy --source /mnt/myfiles --destination https://myaccount.blob.core.windows.net/mycontainer --dest-key <key> --include "abc.txt"
```

If the specified virtual directory does not exist, AzCopy will upload the file to include the virtual directory in its name (*e.g.*, `vd/abc.txt` in the example above).

### Upload all files

```azcopy
azcopy --source /mnt/myfiles --destination https://myaccount.blob.core.windows.net/mycontainer --dest-key <key> --recursive
```

Specifying option `--recursive` uploads the contents of the specified directory to Blob storage recursively, meaning that all subfolders and their files will be uploaded as well. For instance, assume the following files reside in folder `/mnt/myfiles`:

    /mnt/myfiles/abc.txt
    /mnt/myfiles/abc1.txt
    /mnt/myfiles/abc2.txt
    /mnt/myfiles/subfolder/a.txt
    /mnt/myfiles/subfolder/abcd.txt

After the upload operation, the container will include the following files:

    abc.txt
    abc1.txt
    abc2.txt
    subfolder/a.txt
    subfolder/abcd.txt

If you do not specify option `--recursive`, AzCopy will not upload recursively. After the upload operation, the container will include the following files:

    abc.txt
    abc1.txt
    abc2.txt

### Upload files matching specified pattern

```azcopy
azcopy --source /mnt/myfiles --destination https://myaccount.blob.core.windows.net/mycontainer --dest-key <key> --include "a*" --recursive
```

Assume the following files reside in folder `/mnt/myfiles`:

    /mnt/myfiles/abc.txt
    /mnt/myfiles/abc1.txt
    /mnt/myfiles/abc2.txt
    /mnt/myfiles/xyz.txt
    /mnt/myfiles/subfolder/a.txt
    /mnt/myfiles/subfolder/abcd.txt

After the upload operation, the container will include the following files:

    abc.txt
    abc1.txt
    abc2.txt
    subfolder/a.txt
    subfolder/abcd.txt

If you do not specify option `--recursive`, AzCopy will only upload blobs that don't reside in a virtual directory:

    /mnt/myfiles/abc.txt
    /mnt/myfiles/abc1.txt
    /mnt/myfiles/abc2.txt

### Specify the MIME content type of a destination blob
By default, AzCopy sets the content type of a destination blob to `application/octet-stream`. Beginning with version 3.1.0, you can explicitly specify the content type via the option `--recursiveetContentType:[content-type]`. This syntax sets the content type for all blobs in an upload operation.

```azcopy
azcopy --source /mnt/myfiles --destination https://myaccount.blob.core.windows.net/myContainer/ --dest-key key --include ab --recursiveetContentType:video/mp4
```

If you specify `--recursiveetContentType` without a value, then AzCopy will set each blob or file's content type according to its file extension.

```azcopy
azcopy --source /mnt/myfiles --destination https://myaccount.blob.core.windows.net/myContainer/ --dest-key <key> --include "ab" --set-content-type
```

## Blob: Copy
### Copy single blob within Storage account

```azcopy
azcopy --source https://myaccount.blob.core.windows.net/mycontainer1 --destination https://myaccount.blob.core.windows.net/mycontainer2 --source-key <key> --dest-key <key> --include "abc.txt"
```

When you copy a blob within a Storage account, a [server-side copy](http://blogs.msdn.com/b/windowsazurestorage/archive/2012/06/12/introducing-asynchronous-cross-account-copy-blob.aspx) operation is performed.

### Copy single blob across Storage accounts

```azcopy
azcopy --source https://sourceaccount.blob.core.windows.net/mycontainer1 --destination https://destaccount.blob.core.windows.net/mycontainer2 --source-key <key1> --dest-key <key2> --include "abc.txt"
```

When you copy a blob across Storage accounts, a [server-side copy](http://blogs.msdn.com/b/windowsazurestorage/archive/2012/06/12/introducing-asynchronous-cross-account-copy-blob.aspx) operation is performed.

### Copy single blob from secondary region to primary region

```azcopy
azcopy --source https://myaccount1-secondary.blob.core.windows.net/mynewcontainer1 --destination https://myaccount2.blob.core.windows.net/mynewcontainer2 --source-key <key1> --dest-key <key2> --include "abc.txt"
```

Note that you must have read-access geo-redundant storage enabled.

### Copy single blob and its snapshots across Storage accounts

```azcopy
azcopy --source https://sourceaccount.blob.core.windows.net/mycontainer1 --destination https://destaccount.blob.core.windows.net/mycontainer2 --source-key <key1> --dest-key <key2> --include "abc.txt" --include-snapshot
```

After the copy operation, the target container will include the blob and its snapshots. Assuming the blob in the example above has two snapshots, the container will include the following blob and snapshots:

    abc.txt
    abc (2013-02-25 080757).txt
    abc (2014-02-21 150331).txt

### Synchronously copy blobs across Storage accounts
AzCopy by default copies data between two storage endpoints asynchronously. Therefore, the copy operation will run in the background using spare bandwidth capacity that has no SLA in terms of how fast a blob will be copied, and AzCopy will periodically check the copy status until the copying is completed or failed.

The `--sync-copy` option ensures that the copy operation will get consistent speed. AzCopy performs the synchronous copy by downloading the blobs to copy from the specified source to local memory, and then uploading them to the Blob storage destination.

```azcopy
azcopy --source https://myaccount1.blob.core.windows.net/myContainer/ --destination https://myaccount2.blob.core.windows.net/myContainer/ --source-key <key1> --dest-key <key2> --include "ab" --sync-copy
```

`--sync-copy` might generate additional egress cost compared to asynchronous copy, the recommended approach is to use this option in an Azure VM that is in the same region as your source storage account to avoid egress cost.

## File: Download
### Download single file

```azcopy
azcopy --source https://myaccount.file.core.windows.net/myfileshare/myfolder1/ --destination /mnt/myfiles --source-key <key> --include "abc.txt"
```

If the specified source is an Azure file share, then you must either specify the exact file name, (*e.g.* `abc.txt`) to download a single file, or specify option `--recursive` to download all files in the share recursively. Attempting to specify both a file pattern and option `--recursive` together will result in an error.

### Download all files

```azcopy
azcopy --source https://myaccount.file.core.windows.net/myfileshare/ --destination /mnt/myfiles --source-key <key> --recursive
```

Note that any empty folders will not be downloaded.

## File: Upload
### Upload single file

```azcopy
azcopy --source /mnt/myfiles --destination https://myaccount.file.core.windows.net/myfileshare/ --dest-key <key> --include abc.txt
```

### Upload all files

```azcopy
azcopy --source /mnt/myfiles --destination https://myaccount.file.core.windows.net/myfileshare/ --dest-key <key> --recursive
```

Note that any empty folders will not be uploaded.

### Upload files matching specified pattern

```azcopy
azcopy --source /mnt/myfiles --destination https://myaccount.file.core.windows.net/myfileshare/ --dest-key <key> --include ab* --recursive
```

## File: Copy
### Copy across file shares

```azcopy
azcopy --source https://myaccount1.file.core.windows.net/myfileshare1/ --destination https://myaccount2.file.core.windows.net/myfileshare2/ --source-key <key1> --dest-key <key2> --recursive
```
When you copy a file across file shares, a [server-side copy](http://blogs.msdn.com/b/windowsazurestorage/archive/2012/06/12/introducing-asynchronous-cross-account-copy-blob.aspx) operation is performed.

### Copy from file share to blob

```azcopy
azcopy --source https://myaccount1.file.core.windows.net/myfileshare/ --destination https://myaccount2.blob.core.windows.net/mycontainer/ --source-key <key1> --dest-key <key2> --recursive
```
When you copy a file from file share to blob, a [server-side copy](http://blogs.msdn.com/b/windowsazurestorage/archive/2012/06/12/introducing-asynchronous-cross-account-copy-blob.aspx) operation is performed.


### Copy from blob to file share

```azcopy
azcopy --source https://myaccount1.blob.core.windows.net/mycontainer/ --destination https://myaccount2.file.core.windows.net/myfileshare/ --source-key <key1> --dest-key <key2> --recursive
```
When you copy a file from blob to file share, a [server-side copy](http://blogs.msdn.com/b/windowsazurestorage/archive/2012/06/12/introducing-asynchronous-cross-account-copy-blob.aspx) operation is performed.

### Synchronously copy files
You can specify the `--sync-copy` option to copy data from File Storage to File Storage, from File Storage to Blob Storage and from Blob Storage to File Storage synchronously, AzCopy does this by downloading the source data to local memory and upload it again to destination. Standard egress cost will apply.

```azcopy
azcopy --source https://myaccount1.file.core.windows.net/myfileshare1/ --destination https://myaccount2.file.core.windows.net/myfileshare2/ --source-key <key1> --dest-key <key2> --recursive --sync-copy
```

When copying from File Storage to Blob Storage, the default blob type is block blob, user can specify option `/BlobType:page` to change the destination blob type.

Note that `--sync-copy` might generate additional egress cost comparing to asynchronous copy, the recommended approach is to use this option in the Azure VM which is in the same region as your source storage account to avoid egress cost.

## Other AzCopy features
### Only copy data that doesn't exist in the destination
The `--exclude-older` and `--exclude-newer` parameters allow you to exclude older or newer source resources from being copied, respectively. If you only want to copy source resources that don't exist in the destination, you can specify both parameters in the AzCopy command:

    --source http://myaccount.blob.core.windows.net/mycontainer --destination /mnt/myfiles --source-key <sourcekey> --recursive --exclude-older --exclude-newer

    --source /mnt/myfiles --destination http://myaccount.file.core.windows.net/myfileshare --dest-key <destkey> --recursive --exclude-older --exclude-newer

    --source http://myaccount.blob.core.windows.net/mycontainer --destination http://myaccount.blob.core.windows.net/mycontainer1 --source-key <sourcekey> --dest-key <destkey> --recursive --exclude-older --exclude-newer

### Use a configuration file to specify command-line parameters

```azcopy
azcopy --config-file "azcopy-config.ini"
```

You can include any AzCopy command-line parameters in a configuration file. AzCopy processes the parameters in the file as if they had been specified on the command line, performing a direct substitution with the contents of the file.

Assume a configuration file named `copyoperation`, that contains the following lines. Each AzCopy parameter can be specified on a single line

    --source http://myaccount.blob.core.windows.net/mycontainer --destination /mnt/myfiles --source-key <sourcekey> --recursive --quiet

or on separate lines:

    --source http://myaccount.blob.core.windows.net/mycontainer
    --destination /mnt/myfiles
    --source-key<sourcekey>
    --recursive
    --quiet

AzCopy will fail if you split the parameter across two lines, as shown here for the `/sourcekey` parameter:

    http://myaccount.blob.core.windows.net/mycontainer
    /mnt/myfiles
    --sourcekey
    <sourcekey>
    --recursive
    --quiet

### Use multiple configuration files to specify command-line parameters
Assume a configuration file named `source.txt` that specifies a source container:

    --source http://myaccount.blob.core.windows.net/mycontainer

And a configuration file named `dest.txt` that specifies a destination folder in the file system:

    --destination /mnt/myfiles

And a configuration file named `options.txt` that specifies options for AzCopy:

    --recursive --quiet

To call AzCopy with these configuration files, all of which reside in the user's home directory `~`, use this command:

```azcopy
azcopy --config-file "~/source.txt" --config-file "~/dest.txt" --source-key <sourcekey> --config-file "~/options.txt"   
```

AzCopy processes this command just as it would if you included all of the individual parameters on the command line:

```azcopy
azcopy --source http://myaccount.blob.core.windows.net/mycontainer --destination /mnt/myfiles --source-key <sourcekey> --recursive --quiet
```

### Specify a shared access signature (SAS)

```azcopy
azcopy --source https://myaccount.blob.core.windows.net/mycontainer1 --destination https://myaccount.blob.core.windows.net/mycontainer2 --source-sas <SAS1> --dest-sas <SAS2> --include abc.txt
```

You can also specify a SAS on the container URI:

```azcopy
azcopy --source https://myaccount.blob.core.windows.net/mycontainer1/?SourceSASToken --destination /mnt/myfiles --recursive
```

### Journal file folder
Each time you issue a command to AzCopy, it checks whether a journal file exists in the default folder, or whether it exists in a folder that you specified via this option. If the journal file does not exist in either place, AzCopy treats the operation as new and generates a new journal file.

If the journal file does exist, AzCopy will check whether the command line that you input matches the command line in the journal file. If the two command lines match, AzCopy resumes the incomplete operation. If they do not match, you will be prompted to either overwrite the journal file to start a new operation, or to cancel the current operation.

If you want to use the default location for the journal file:

```azcopy
azcopy --source /mnt/myfiles --destination https://myaccount.blob.core.windows.net/mycontainer --dest-key <key> --resume
```

If you omit option `--resume`, or specify option `--resume` without the folder path, as shown above, AzCopy creates the journal file in the default location, which is `~\Microsoft\Azure\AzCopy`. If the journal file already exists, then AzCopy resumes the operation based on the journal file.

If you want to specify a custom location for the journal file:

```azcopy
azcopy --source /mnt/myfiles --destination https://myaccount.blob.core.windows.net/mycontainer --dest-key key --resume "~"
```

This example creates the journal file if it does not already exist. If it does exist, then AzCopy resumes the operation based on the journal file.

If you want to resume an AzCopy operation:

```azcopy
azcopy --resume "~"
```

This example resumes the last operation, which may have failed to complete.

### Output verbose logs

```azcopy
azcopy --source /mnt/myfiles --destination https://myaccount.blob.core.windows.net/mycontainer --dest-key <key> --verbose
```

### Specify the number of concurrent operations to start
Option `--parallel-level` specifies the number of concurrent copy operations. By default, AzCopy starts a certain number of concurrent operations to increase the data transfer throughput. For Table operations, the number of concurrent operations is equal to the number of processors you have. For Blob and File operations, the number of concurrent operations is equal 8 times the number of processors you have. If you are running AzCopy across a low-bandwidth network, you can specify a lower number for --parallel-level to avoid failure caused by resource competition.

## AzCopy Parameters
Parameters for AzCopy are described below. You can also type one of the following commands from the command line for help in using AzCopy:

* For detailed command-line help for AzCopy: `AzCopy --help`
* For detailed help with any AzCopy parameter: `AzCopy --source-key --help`

### --source "source"
Specifies the source data from which to copy. The source can be a file system directory, a blob container, a blob virtual directory, a storage file share, a storage file directory, or an Azure table.

### --destination "destination"
Specifies the destination to copy to. The destination can be a file system directory, a blob container, a blob virtual directory, a storage file share, a storage file directory, or an Azure table.

### --include "file-pattern"
Specifies a file pattern that indicates which files to copy. The behavior of the /Pattern parameter is determined by the location of the source data, and the presence of the recursive mode option. Recursive mode is specified via option --recursive.

If the specified source is a directory in the file system, then standard wildcards are in effect, and the file pattern provided is matched against files within the directory. If option --recursive is specified, then AzCopy also matches the specified pattern against all files in any subfolders beneath the directory.

If the specified source is a blob container or virtual directory, then wildcards are not applied. If option --recursive is specified, then AzCopy interprets the specified file pattern as a blob prefix. If option --recursive is not specified, then AzCopy matches the file pattern against exact blob names.

If the specified source is an Azure file share, then you must either specify the exact file name, (e.g. abc.txt) to copy a single file, or specify option --recursive to copy all files in the share recursively. Attempting to specify both a file pattern and option --recursive together will result in an error.

AzCopy uses case-sensitive matching when the --source is a blob container or blob virtual directory, and uses case-insensitive matching in all the other cases.

The default file pattern used when no file pattern is specified is *.* for a file system location or an empty prefix for an Azure Storage location. Specifying multiple file patterns is not supported.

### --dest-key "storage-key"
Specifies the storage account key for the destination resource.

### --dest-sas "sas-token"
Specifies a Shared Access Signature (SAS) with READ and WRITE permissions for the destination (if applicable). Surround the SAS with double quotes, as it may contain special command-line characters.

If the destination resource is a blob container, file share or table, you can either specify this option followed by the SAS token, or you can specify the SAS as part of the destination blob container, file share or table's URI, without this option.

If the source and destination are both blobs, then the destination blob must reside within the same storage account as the source blob.

### --source-key "storage-key"
Specifies the storage account key for the source resource.

### --source-sas "sas-token"
Specifies a Shared Access Signature with READ and LIST permissions for the source (if applicable). Surround the SAS with double quotes, as it may contains special command-line characters.

If the source resource is a blob container, and neither a key nor a SAS is provided, then the blob container will be read via anonymous access.

If the source is a file share or table, a key or a SAS must be provided.

### --recursive
Specifies recursive mode for copy operations. In recursive mode, AzCopy will copy all blobs or files that match the specified file pattern, including those in subfolders.

### --blob-type "block" | "page" | "append"
Specifies whether the destination blob is a block blob, a page blob, or an append blob. This option is applicable only when you are uploading a blob. Otherwise, an error is generated. If the destination is a blob and this option is not specified, by default, AzCopy creates a block blob.

### --check-md5
Calculates an MD5 hash for downloaded data and verifies that the MD5 hash stored in the blob or file's Content-MD5 property matches the calculated hash. The MD5 check is turned off by default, so you must specify this option to perform the MD5 check when downloading data.

Note that Azure Storage doesn't guarantee that the MD5 hash stored for the blob or file is up-to-date. It is client's responsibility to update the MD5 whenever the blob or file is modified.

AzCopy always sets the Content-MD5 property for an Azure blob or file after uploading it to the service.  

### --include-snapshot
Indicates whether to transfer snapshots. This option is only valid when the source is a blob.

The transferred blob snapshots are renamed in this format: blob-name (snapshot-time).extension

By default, snapshots are not copied.

### --verbose
Outputs verbose status messages.

### --resume [journal-file-folder]
Specifies a journal file folder for resuming an operation.

AzCopy always supports resuming if an operation has been interrupted.

If this option is not specified, or it is specified without a folder path, then AzCopy will create the journal file in the default location, which is ~/Microsoft/Azure/AzCopy.

Each time you issue a command to AzCopy, it checks whether a journal file exists in the default folder, or whether it exists in a folder that you specified via this option. If the journal file does not exist in either place, AzCopy treats the operation as new and generates a new journal file.

If the journal file does exist, AzCopy will check whether the command line that you input matches the command line in the journal file. If the two command lines match, AzCopy resumes the incomplete operation. If they do not match, you will be prompted to either overwrite the journal file to start a new operation, or to cancel the current operation.

The journal file is deleted upon successful completion of the operation.

Note that resuming an operation from a journal file created by a previous version of AzCopy is not supported.

### --config-file "parameter-file"
Specifies a file that contains parameters. AzCopy processes the parameters in the file just as if they had been specified on the command line.

In a configuration file, you can either specify multiple parameters on a single line, or specify each parameter on its own line. Note that an individual parameter cannot span multiple lines.

Configuration files can include comment lines that begin with the # symbol.

You can specify multiple configuration files. However, note that AzCopy does not support nested configuration files.

### --quiet
Suppresses all AzCopy confirmation prompts.

### --dry-run
Specifies a listing operation only; no data is copied.

AzCopy will interpret the using of this option as a simulation for running the command line without this option --dry-run and count how many objects will be copied, you can specify option --verbose at the same time to check which objects will be copied in the verbose log.

The behavior of this option is also determined by the location of the source data and the presence of the recursive mode option --recursive and file pattern option --include.

AzCopy requires LIST and READ permission of this source location when using this option.

### --preserve-last-modified-time
Sets the downloaded file's last-modified time to be the same as the source blob or file's.

### --exclude-newer
Excludes a newer source resource. The resource will not be copied if the last modified time of the source is the same or newer than destination.

### --exclude-older
Excludes an older source resource. The resource will not be copied if the last modified time of the source is the same or older than destination.

### --delimiter "delimiter"
Indicates the delimiter character used to delimit virtual directories in a blob name.

By default, AzCopy uses / as the delimiter character. However, AzCopy supports using any common character (such as @, #, or %) as a delimiter. If you need to include one of these special characters on the command line, enclose the file name with double quotes.

This option is only applicable for downloading blobs.

### --parallel-level "number-of-concurrent-operations"
Specifies the number of concurrent operations.

AzCopy by default starts a certain number of concurrent operations to increase the data transfer throughput. Note that large number of concurrent operations in a low-bandwidth environment may overwhelm the network connection and prevent the operations from fully completing. Throttle concurrent operations based on actual available network bandwidth.

The upper limit for concurrent operations is 512. By default, this value is set to 8 times the number of cores you have on your client.

### --sync-copy
Indicates whether to synchronously copy blobs or files between two Azure Storage endpoints.

AzCopy by default uses server-side asynchronous copy. Specify this option to perform a synchronous copy, which downloads blobs or files to local memory and then uploads them to Azure Storage.

You can use this option when copying files within Blob storage, within File storage, or from Blob storage to File storage or vice versa.

### --set-content-type "content-type"
Specifies the MIME content type for destination blobs or files.

AzCopy sets the content type for a blob or file to application/octet-stream by default. You can set the content type for all blobs or files by explicitly specifying a value for this option.

If you specify this option without a value, then AzCopy will set each blob or file's content type according to its file extension.

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

For property "AzureStorageUseV1MD5"
• True - The default value, AzCopy will use .NET MD5 implementation.
• False – AzCopy will use FIPS compliant MD5 algorithm.

Note that FIPS compliant algorithms are disabled by default on your Windows machine, you can type secpol.msc in your Run window and check this switch at Security Setting->Local Policy->Security Options->System cryptography: Use FIPS compliant algorithms for encryption, hashing and signing.

## Next steps
For more information about Azure Storage and AzCopy, refer to the following resources.

### Azure Storage documentation:
* [Introduction to Azure Storage](storage-introduction.md)
* [How to use Blob storage from .NET](storage-dotnet-how-to-use-blobs.md)
* [How to use File storage from .NET](storage-dotnet-how-to-use-files.md)
* [How to use Table storage from .NET](storage-dotnet-how-to-use-tables.md)
* [How to create, manage, or delete a storage account](storage-create-storage-account.md)

### Azure Storage blog posts:
* [Introducing Azure Storage Data Movement Library Preview](https://azure.microsoft.com/blog/introducing-azure-storage-data-movement-library-preview-2/)
* [AzCopy: Introducing synchronous copy and customized content type](http://blogs.msdn.com/b/windowsazurestorage/archive/2015/01/13/azcopy-introducing-synchronous-copy-and-customized-content-type.aspx)
* [AzCopy: Announcing General Availability of AzCopy 3.0 plus preview release of AzCopy 4.0 with Table and File support](http://blogs.msdn.com/b/windowsazurestorage/archive/2014/10/29/azcopy-announcing-general-availability-of-azcopy-3-0-plus-preview-release-of-azcopy-4-0-with-table-and-file-support.aspx)
* [AzCopy: Optimized for Large-Scale Copy Scenarios](http://go.microsoft.com/fwlink/?LinkId=507682)
* [AzCopy: Support for read-access geo-redundant storage](http://blogs.msdn.com/b/windowsazurestorage/archive/2014/04/07/azcopy-support-for-read-access-geo-redundant-account.aspx)
* [AzCopy: Transfer data with re-startable mode and SAS token](http://blogs.msdn.com/b/windowsazurestorage/archive/2013/09/07/azcopy-transfer-data-with-re-startable-mode-and-sas-token.aspx)
* [AzCopy: Using cross-account Copy Blob](http://blogs.msdn.com/b/windowsazurestorage/archive/2013/04/01/azcopy-using-cross-account-copy-blob.aspx)
* [AzCopy: Uploading/downloading files for Azure Blobs](http://blogs.msdn.com/b/windowsazurestorage/archive/2012/12/03/azcopy-uploading-downloading-files-for-windows-azure-blobs.aspx)

