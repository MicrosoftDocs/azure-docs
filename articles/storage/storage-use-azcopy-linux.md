---
title: Copy or move data to Azure Storage with AzCopy on Linux | Microsoft Docs
description: Use the AzCopy on Linux utility to move or copy data to or from blob and file content. Copy data to Azure Storage from local files, or copy data within or between storage accounts. Easily migrate your data to Azure Storage.
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
# Transfer data with AzCopy on Linux
AzCopy on Linux is a command-line utility designed for copying data to and from Microsoft Azure Blob and File storage using simple commands with optimal performance. You can copy data from one object to another within your storage account, or between storage accounts.

There are two versions of AzCopy that you can download. AzCopy on Linux is built with .NET Core Framework, which targets Linux platforms offering POSIX style command-line options. [AzCopy on Windows](storage-use-azcopy.md) is built with .NET Framework, and offers Windows style command-line options. This article covers AzCopy on Linux.

## Download and install AzCopy
### Installation on Linux

AzCopy on Linux requires .NET Core framework on the platform. See the installation instructions on the [.NET Core](https://www.microsoft.com/net/core#linuxubuntu) page.

As an example, let's install .NET Core on Ubuntu 16.10. For the latest installation guide, visit [.NET Core on Linux](https://www.microsoft.com/net/core#linuxubuntu) installation page.


```bash
sudo sh -c 'echo "deb [arch=amd64] https://apt-mo.trafficmanager.net/repos/dotnet-release/ yakkety main" > /etc/apt/sources.list.d/dotnetdev.list' 
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 417A0893
sudo apt-get update
sudo apt-get install dotnet-dev-1.0.3
```

Once you have installed .NET Core, download and install AzCopy.

```bash
wget -O azcopy.tar.gz https://aka.ms/downloadazcopyprlinux
tar -xf azcopy.tar.gz
sudo ./install.sh
```

You can remove the extracted files once AzCopy on Linux is installed. Alternatively if you do not have superuser privileges, you can also run AzCopy using the shell script 'azcopy' in the extracted folder. 

### Alternative Installation on Ubuntu

**Ubuntu 14.04**

Add apt source for .Net Core:

```bash
sudo sh -c 'echo "deb [arch=amd64] https://apt-mo.trafficmanager.net/repos/dotnet-release/ trusty main" > /etc/apt/sources.list.d/dotnetdev.list' 
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 417A0893
```

Add apt source for Microsoft Linux product repository and install AzCopy:

```bash
curl https://packages.microsoft.com/config/ubuntu/14.04/prod.list > ./microsoft-prod.list
sudo cp ./microsoft-prod.list /etc/apt/sources.list.d/
curl https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.gpg
sudo cp ./microsoft.gpg /etc/apt/trusted.gpg.d/
```

```bash
sudo apt-get update
sudo apt-get install azcopy
```

**Ubuntu 16.04**

Add apt source for .Net Core:

```bash
sudo sh -c 'echo "deb [arch=amd64] https://apt-mo.trafficmanager.net/repos/dotnet-release/ xenial main" > /etc/apt/sources.list.d/dotnetdev.list' 
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 417A0893
```

Add apt source for Microsoft Linux product repository and install AzCopy:

```bash
curl https://packages.microsoft.com/config/ubuntu/16.04/prod.list > ./microsoft-prod.list
sudo cp ./microsoft-prod.list /etc/apt/sources.list.d/
curl https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.gpg
sudo cp ./microsoft.gpg /etc/apt/trusted.gpg.d/
```

```bash
sudo apt-get update
sudo apt-get install azcopy
```

**Ubuntu 16.10**

Add apt source for .Net Core:

```bash
sudo sh -c 'echo "deb [arch=amd64] https://apt-mo.trafficmanager.net/repos/dotnet-release/ yakkety main" > /etc/apt/sources.list.d/dotnetdev.list' 
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 417A0893
```

Add apt source for Microsoft Linux product repository and install AzCopy:

```bash
curl https://packages.microsoft.com/config/ubuntu/16.10/prod.list > ./microsoft-prod.list
sudo cp ./microsoft-prod.list /etc/apt/sources.list.d/
curl https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.gpg
sudo cp ./microsoft.gpg /etc/apt/trusted.gpg.d/
```

```bash
sudo apt-get update
sudo apt-get install azcopy
```

## Writing your first AzCopy command
The basic syntax for AzCopy commands is:

```azcopy
azcopy --source <source> --destination <destination> [Options]
```

The following examples demonstrate various scenarios for copying data to and from Microsoft Azure Blobs and Files. Refer to the `azcopy --help` menu for a detailed explanation of the parameters used in each sample.

## Blob: Download
### Download single blob

```azcopy
azcopy \
	--source https://myaccount.blob.core.windows.net/mycontainer \
	--destination /mnt/myfiles \
	--source-key <key> \
	--include "abc.txt"
```

If the folder `/mnt/myfiles` does not exist, AzCopy creates it and downloads `abc.txt ` into the new folder.

### Download single blob from secondary region

```azcopy
azcopy \
	--source https://myaccount-secondary.blob.core.windows.net/mynewcontainer \
	--destination /mnt/myfiles \
	--source-key <key> \
	--include "abc.txt"
```

Note that you must have read-access geo-redundant storage enabled.

### Download all blobs

```azcopy
azcopy \
	--source https://myaccount.blob.core.windows.net/mycontainer \
	--destination /mnt/myfiles \
	--source-key <key> \
	--recursive
```

Assume the following blobs reside in the specified container:  

```
abc.txt
abc1.txt
abc2.txt
vd1/a.txt
vd1/abcd.txt
```

After the download operation, the directory `/mnt/myfiles` includes the following files:

```
/mnt/myfiles/abc.txt
/mnt/myfiles/abc1.txt
/mnt/myfiles/abc2.txt
/mnt/myfiles/vd1/a.txt
/mnt/myfiles/vd1/abcd.txt
```

If you do not specify option `--recursive`, no blob will be downloaded.

### Download blobs with specified prefix

```azcopy
azcopy \
	--source https://myaccount.blob.core.windows.net/mycontainer \
	--destination /mnt/myfiles \
	--source-key <key> \
	--include "a" \
	--recursive
```

Assume the following blobs reside in the specified container. All blobs beginning with the prefix `a` are downloaded.

```
abc.txt
abc1.txt
abc2.txt
xyz.txt
vd1\a.txt
vd1\abcd.txt
```

After the download operation, the folder `/mnt/myfiles` includes the following files:

```
/mnt/myfiles/abc.txt
/mnt/myfiles/abc1.txt
/mnt/myfiles/abc2.txt
```

The prefix applies to the virtual directory, which forms the first part of the blob name. In the example shown above, the virtual directory does not match the specified prefix, so no blob is downloaded. In addition, if the option `--recursive` is not specified, AzCopy does not download any blobs.

### Set the last-modified time of exported files to be same as the source blobs

```azcopy
azcopy \
	--source https://myaccount.blob.core.windows.net/mycontainer \
	--destination "/mnt/myfiles" \
	--source-key <key> \
	--preserve-last-modified-time
```

You can also exclude blobs from the download operation based on their last-modified time. For example, if you want to exclude blobs whose last modified time is the same or newer than the destination file, add the `--exclude-newer` option:

```azcopy
azcopy \
	--source https://myaccount.blob.core.windows.net/mycontainer \
	--destination /mnt/myfiles \
	--source-key <key> \
	--preserve-last-modified-time \
	--exclude-newer
```

Or if you want to exclude blobs whose last modified time is the same or older than the destination file, add the `--exclude-older` option:

```azcopy
azcopy \
	--source https://myaccount.blob.core.windows.net/mycontainer \
	--destination /mnt/myfiles \
	--source-key <key> \
	--preserve-last-modified-time \
	--exclude-older
```

## Blob: Upload
### Upload single file

```azcopy
azcopy \
	--source /mnt/myfiles \
	--destination https://myaccount.blob.core.windows.net/mycontainer \
	--dest-key <key> \
	--include "abc.txt"
```

If the specified destination container does not exist, AzCopy creates it and uploads the file into it.

### Upload single file to virtual directory

```azcopy
azcopy \
	--source /mnt/myfiles \
	--destination https://myaccount.blob.core.windows.net/mycontainer \
	--dest-key <key> \
	--include "abc.txt"
```

If the specified virtual directory does not exist, AzCopy uploads the file to include the virtual directory in the blob name (*e.g.*, `vd/abc.txt` in the example above).

### Upload all files

```azcopy
azcopy \
	--source /mnt/myfiles \
	--destination https://myaccount.blob.core.windows.net/mycontainer \
	--dest-key <key> \
	--recursive
```

Specifying option `--recursive` uploads the contents of the specified directory to Blob storage recursively, meaning that all subfolders and their files are uploaded as well. For instance, assume the following files reside in folder `/mnt/myfiles`:

```
/mnt/myfiles/abc.txt
/mnt/myfiles/abc1.txt
/mnt/myfiles/abc2.txt
/mnt/myfiles/subfolder/a.txt
/mnt/myfiles/subfolder/abcd.txt
```

After the upload operation, the container includes the following files:

```
abc.txt
abc1.txt
abc2.txt
subfolder/a.txt
subfolder/abcd.txt
```

When the option `--recursive` is not specified, only the following three files are uploaded:

```
abc.txt
abc1.txt
abc2.txt
```

### Upload files matching specified pattern

```azcopy
azcopy \
	--source /mnt/myfiles \
	--destination https://myaccount.blob.core.windows.net/mycontainer \
	--dest-key <key> \
	--include "a*" \
	--recursive
```

Assume the following files reside in folder `/mnt/myfiles`:

```
/mnt/myfiles/abc.txt
/mnt/myfiles/abc1.txt
/mnt/myfiles/abc2.txt
/mnt/myfiles/xyz.txt
/mnt/myfiles/subfolder/a.txt
/mnt/myfiles/subfolder/abcd.txt
```

After the upload operation, the container includes the following files:

```
abc.txt
abc1.txt
abc2.txt
subfolder/a.txt
subfolder/abcd.txt
```

When the option `--recursive` is not specified, AzCopy skips files that are in sub-directories:

```
abc.txt
abc1.txt
abc2.txt
```

### Specify the MIME content type of a destination blob
By default, AzCopy sets the content type of a destination blob to `application/octet-stream`. However, you can explicitly specify the content type via the option `--set-content-type [content-type]`. This syntax sets the content type for all blobs in an upload operation.

```azcopy
azcopy \
	--source /mnt/myfiles \
	--destination https://myaccount.blob.core.windows.net/myContainer/ \
	--dest-key <key> \
	--include "ab" \
	--set-content-type "video/mp4"
```

If the option `--set-content-type` is specified without a value, then AzCopy sets each blob or file's content type according to its file extension.

```azcopy
azcopy \
	--source /mnt/myfiles \
	--destination https://myaccount.blob.core.windows.net/myContainer/ \
	--dest-key <key> \
	--include "ab" \
	--set-content-type
```

## Blob: Copy
### Copy single blob within Storage account

```azcopy
azcopy \
	--source https://myaccount.blob.core.windows.net/mycontainer1 \
	--destination https://myaccount.blob.core.windows.net/mycontainer2 \
	--source-key <key> \
	--dest-key <key> \
	--include "abc.txt"
```

When you copy a blob without --sync-copy option, a [server-side copy](http://blogs.msdn.com/b/windowsazurestorage/archive/2012/06/12/introducing-asynchronous-cross-account-copy-blob.aspx) operation is performed.

### Copy single blob across Storage accounts

```azcopy
azcopy \
	--source https://sourceaccount.blob.core.windows.net/mycontainer1 \
	--destination https://destaccount.blob.core.windows.net/mycontainer2 \
	--source-key <key1> \
	--dest-key <key2> \
	--include "abc.txt"
```

When you copy a blob without --sync-copy option, a [server-side copy](http://blogs.msdn.com/b/windowsazurestorage/archive/2012/06/12/introducing-asynchronous-cross-account-copy-blob.aspx) operation is performed.

### Copy single blob from secondary region to primary region

```azcopy
azcopy \
	--source https://myaccount1-secondary.blob.core.windows.net/mynewcontainer1 \
	--destination https://myaccount2.blob.core.windows.net/mynewcontainer2 \
	--source-key <key1> \
	--dest-key <key2> \
	--include "abc.txt"
```

Note that you must have read-access geo-redundant storage enabled.

### Copy single blob and its snapshots across Storage accounts

```azcopy
azcopy \
	--source https://sourceaccount.blob.core.windows.net/mycontainer1 \
	--destination https://destaccount.blob.core.windows.net/mycontainer2 \
	--source-key <key1> \
	--dest-key <key2> \
	--include "abc.txt" \
	--include-snapshot
```

After the copy operation, the target container includes the blob and its snapshots. The container includes the following blob and its snapshots:

```
abc.txt
abc (2013-02-25 080757).txt
abc (2014-02-21 150331).txt
```

### Synchronously copy blobs across Storage accounts
AzCopy by default copies data between two storage endpoints asynchronously. Therefore, the copy operation runs in the background using spare bandwidth capacity that has no SLA in terms of how fast a blob is copied. 

The `--sync-copy` option ensures that the copy operation gets consistent speed. AzCopy performs the synchronous copy by downloading the blobs to copy from the specified source to local memory, and then uploading them to the Blob storage destination.

```azcopy
azcopy \
	--source https://myaccount1.blob.core.windows.net/myContainer/ \
	--destination https://myaccount2.blob.core.windows.net/myContainer/ \
	--source-key <key1> \
	--dest-key <key2> \
	--include "ab" \
	--sync-copy
```

`--sync-copy` might generate additional egress cost compared to asynchronous copy. The recommended approach is to use this option in an Azure VM, that is in the same region as your source storage account to avoid egress cost.

## File: Download
### Download single file

```azcopy
azcopy \
	--source https://myaccount.file.core.windows.net/myfileshare/myfolder1/ \
	--destination /mnt/myfiles \
	--source-key <key> \
	--include "abc.txt"
```

If the specified source is an Azure file share, then you must either specify the exact file name, (*e.g.* `abc.txt`) to download a single file, or specify option `--recursive` to download all files in the share recursively. Attempting to specify both a file pattern and option `--recursive` together results in an error.

### Download all files

```azcopy
azcopy \
	--source https://myaccount.file.core.windows.net/myfileshare/ \
	--destination /mnt/myfiles \
	--source-key <key> \
	--recursive
```

Note that any empty folders are not downloaded.

## File: Upload
### Upload single file

```azcopy
azcopy \
	--source /mnt/myfiles \
	--destination https://myaccount.file.core.windows.net/myfileshare/ \
	--dest-key <key> \
	--include abc.txt
```

### Upload all files

```azcopy
azcopy \
	--source /mnt/myfiles \
	--destination https://myaccount.file.core.windows.net/myfileshare/ \
	--dest-key <key> \
	--recursive
```

Note that any empty folders are not uploaded.

### Upload files matching specified pattern

```azcopy
azcopy \
	--source /mnt/myfiles \
	--destination https://myaccount.file.core.windows.net/myfileshare/ \
	--dest-key <key> \
	--include "ab*" \
	--recursive
```

## File: Copy
### Copy across file shares

```azcopy
azcopy \
	--source https://myaccount1.file.core.windows.net/myfileshare1/ \
	--destination https://myaccount2.file.core.windows.net/myfileshare2/ \
	--source-key <key1> \
	--dest-key <key2> \
	--recursive
```
When you copy a file across file shares, a [server-side copy](http://blogs.msdn.com/b/windowsazurestorage/archive/2012/06/12/introducing-asynchronous-cross-account-copy-blob.aspx) operation is performed.

### Copy from file share to blob

```azcopy
azcopy \ 
	--source https://myaccount1.file.core.windows.net/myfileshare/ \
	--destination https://myaccount2.blob.core.windows.net/mycontainer/ \
	--source-key <key1> \
	--dest-key <key2> \
	--recursive
```
When you copy a file from file share to blob, a [server-side copy](http://blogs.msdn.com/b/windowsazurestorage/archive/2012/06/12/introducing-asynchronous-cross-account-copy-blob.aspx) operation is performed.

### Copy from blob to file share

```azcopy
azcopy \
	--source https://myaccount1.blob.core.windows.net/mycontainer/ \
	--destination https://myaccount2.file.core.windows.net/myfileshare/ \
	--source-key <key1> \
	--dest-key <key2> \
	--recursive
```
When you copy a file from blob to file share, a [server-side copy](http://blogs.msdn.com/b/windowsazurestorage/archive/2012/06/12/introducing-asynchronous-cross-account-copy-blob.aspx) operation is performed.

### Synchronously copy files
You can specify the `--sync-copy` option to copy data from File Storage to File Storage, from File Storage to Blob Storage and from Blob Storage to File Storage synchronously. AzCopy runs this operation by downloading the source data to local memory, and then uploading it to destination. In this case, standard egress cost applies.

```azcopy
azcopy \
	--source https://myaccount1.file.core.windows.net/myfileshare1/ \
	--destination https://myaccount2.file.core.windows.net/myfileshare2/ \
	--source-key <key1> \
	--dest-key <key2> \
	--recursive \
	--sync-copy
```

When copying from File Storage to Blob Storage, the default blob type is block blob, user can specify option `/BlobType:page` to change the destination blob type.

Note that `--sync-copy` might generate additional egress cost comparing to asynchronous copy. The recommended approach is to use this option in an Azure VM, that is in the same region as your source storage account to avoid egress cost.

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

Assume a configuration file named `copyoperation`, that contains the following lines. Each AzCopy parameter can be specified on a single line.

    --source http://myaccount.blob.core.windows.net/mycontainer --destination /mnt/myfiles --source-key <sourcekey> --recursive --quiet

or on separate lines:

    --source http://myaccount.blob.core.windows.net/mycontainer
    --destination /mnt/myfiles
    --source-key<sourcekey>
    --recursive
    --quiet

AzCopy fails if you split the parameter across two lines, as shown here for the `--source-key` parameter:

    http://myaccount.blob.core.windows.net/mycontainer
    /mnt/myfiles
    --sourcekey
    <sourcekey>
    --recursive
    --quiet

### Specify a shared access signature (SAS)

```azcopy
azcopy \
	--source https://myaccount.blob.core.windows.net/mycontainer1 \
	--destination https://myaccount.blob.core.windows.net/mycontainer2 \
	--source-sas <SAS1> \
	--dest-sas <SAS2> \
	--include abc.txt
```

You can also specify a SAS on the container URI:

```azcopy
azcopy \
	--source https://myaccount.blob.core.windows.net/mycontainer1/?SourceSASToken \
	--destination /mnt/myfiles \
	--recursive
```

Note that AzCopy currently only supports the [Account SAS](https://docs.microsoft.com/en-us/azure/storage/storage-dotnet-shared-access-signature-part-1).

### Journal file folder
Each time you issue a command to AzCopy, it checks whether a journal file exists in the default folder, or whether it exists in a folder that you specified via this option. If the journal file does not exist in either place, AzCopy treats the operation as new and generates a new journal file.

If the journal file does exist, AzCopy checks whether the command line that you input matches the command line in the journal file. If the two command lines match, AzCopy resumes the incomplete operation. If they do not match, AzCopy prompts user to either overwrite the journal file to start a new operation, or to cancel the current operation.

If you want to use the default location for the journal file:

```azcopy
azcopy \
	--source /mnt/myfiles \
	--destination https://myaccount.blob.core.windows.net/mycontainer \
	--dest-key <key> \
	--resume
```

If you omit option `--resume`, or specify option `--resume` without the folder path, as shown above, AzCopy creates the journal file in the default location, which is `~\Microsoft\Azure\AzCopy`. If the journal file already exists, then AzCopy resumes the operation based on the journal file.

If you want to specify a custom location for the journal file:

```azcopy
azcopy \
	--source /mnt/myfiles \
	--destination https://myaccount.blob.core.windows.net/mycontainer \
	--dest-key key \
	--resume "/mnt/myjournal"
```

This example creates the journal file if it does not already exist. If it does exist, then AzCopy resumes the operation based on the journal file.

If you want to resume an AzCopy operation, repeat the same command. AzCopy on Linux then will prompt for confirmation:

```azcopy
Incomplete operation with same command line detected at the journal directory "/home/myaccount/Microsoft/Azure/AzCopy", do you want to resume the operation? Choose Yes to resume, choose No to overwrite the journal to start a new operation. (Yes/No)
```

### Output verbose logs

```azcopy
azcopy \
	--source /mnt/myfiles \
	--destination https://myaccount.blob.core.windows.net/mycontainer \
	--dest-key <key> \
	--verbose
```

### Specify the number of concurrent operations to start
Option `--parallel-level` specifies the number of concurrent copy operations. By default, AzCopy starts a certain number of concurrent operations to increase the data transfer throughput. The number of concurrent operations is equal eight times the number of processors you have. If you are running AzCopy across a low-bandwidth network, you can specify a lower number for --parallel-level to avoid failure caused by resource competition.

[!TIP]
>To view the complete list of AzCopy parameters, check out 'azcopy --help' menu.

## Known issues and best practices
### Error: .NET Core is not found in the system.
If you encounter an error stating that .NET Core is not installed in the system, the PATH to the .NET Core binary `dotnet` may be missing.

In order to address this issue, find the .NET Core binary in the system:
```bash
sudo find / -name dotnet
```

This returns the path to the dotnet binary. 

	/opt/rh/rh-dotnetcore11/root/usr/bin/dotnet
	/opt/rh/rh-dotnetcore11/root/usr/lib64/dotnetcore/dotnet
	/opt/rh/rh-dotnetcore11/root/usr/lib64/dotnetcore/shared/Microsoft.NETCore.App/1.1.2/dotnet

Now add this path to the PATH variable. For sudo, edit secure_path to contain the path to the dotnet binary:
```bash 
sudo visudo
### Append the path found in the preceding example to 'secure_path' variable
```

In this example, secure_path variable reads as:

```
secure_path = /sbin:/bin:/usr/sbin:/usr/bin:/opt/rh/rh-dotnetcore11/root/usr/bin/
```

For the current user, edit .bash_profile/.profile to include the path to the dotnet binary in PATH variable 
```bash
vi ~/.bash_profile
### Append the path found in the preceding example to 'PATH' variable
```

Verify that .NET Core is now in PATH:
```bash
which dotnet
sudo which dotnet
```

### Error Installing AzCopy
If you encounter issues with AzCopy installation, you may try to run AzCopy using the bash script in the extracted `azcopy` folder.

```bash
cd azcopy
./azcopy
```

### Limit concurrent writes while copying data
When you copy blobs or files with AzCopy, keep in mind that another application may be modifying the data while you are copying it. If possible, ensure that the data you are copying is not being modified during the copy operation. For example, when copying a VHD associated with an Azure virtual machine, make sure that no other applications are currently writing to the VHD. A good way to do this is by leasing the resource to be copied. Alternately, you can create a snapshot of the VHD first and then copy the snapshot.

If you cannot prevent other applications from writing to blobs or files while they are being copied, then keep in mind that by the time the job finishes, the copied resources may no longer have full parity with the source resources.

### Run one AzCopy instance on one machine.
AzCopy is designed to maximize the utilization of your machine resource to accelerate the data transfer, we recommend you run only one AzCopy instance on one machine, and specify the option `--parallel-level` if you need more concurrent operations. For more details, type `AzCopy --help parallel-level` at the command line.

## Next steps
For more information about Azure Storage and AzCopy, see the following resources:

### Azure Storage documentation:
* [Introduction to Azure Storage](storage-introduction.md)
* [Create a storage account](storage-create-storage-account.md)
* [Manage blobs with Storage Explorer](https://docs.microsoft.com/en-us/azure/vs-azure-tools-storage-explorer-blobs)
* [Using the Azure CLI 2.0 with Azure Storage](storage-azure-cli.md)
* [How to use Blob storage from C++](storage-c-plus-plus-how-to-use-blobs.md)
* [How to use Blob storage from Java](storage-java-how-to-use-blob-storage.md)
* [How to use Blob storage from Node.js](storage-nodejs-how-to-use-blob-storage.md)
* [How to use Blob storage from Python](storage-python-how-to-use-blob-storage.md)

### Azure Storage blog posts:
* [Announcing AzCopy on Linux Preview](https://azure.microsoft.com/en-in/blog/announcing-azcopy-on-linux-preview/)
* [Introducing Azure Storage Data Movement Library Preview](https://azure.microsoft.com/blog/introducing-azure-storage-data-movement-library-preview-2/)
* [AzCopy: Introducing synchronous copy and customized content type](http://blogs.msdn.com/b/windowsazurestorage/archive/2015/01/13/azcopy-introducing-synchronous-copy-and-customized-content-type.aspx)
* [AzCopy: Announcing General Availability of AzCopy 3.0 plus preview release of AzCopy 4.0 with Table and File support](http://blogs.msdn.com/b/windowsazurestorage/archive/2014/10/29/azcopy-announcing-general-availability-of-azcopy-3-0-plus-preview-release-of-azcopy-4-0-with-table-and-file-support.aspx)
* [AzCopy: Optimized for Large-Scale Copy Scenarios](http://go.microsoft.com/fwlink/?LinkId=507682)
* [AzCopy: Support for read-access geo-redundant storage](http://blogs.msdn.com/b/windowsazurestorage/archive/2014/04/07/azcopy-support-for-read-access-geo-redundant-account.aspx)
* [AzCopy: Transfer data with restartable mode and SAS token](http://blogs.msdn.com/b/windowsazurestorage/archive/2013/09/07/azcopy-transfer-data-with-re-startable-mode-and-sas-token.aspx)
* [AzCopy: Using cross-account Copy Blob](http://blogs.msdn.com/b/windowsazurestorage/archive/2013/04/01/azcopy-using-cross-account-copy-blob.aspx)
* [AzCopy: Uploading/downloading files for Azure Blobs](http://blogs.msdn.com/b/windowsazurestorage/archive/2012/12/03/azcopy-uploading-downloading-files-for-windows-azure-blobs.aspx)

