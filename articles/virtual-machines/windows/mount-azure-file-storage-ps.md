---
title: Mount Azure File storage from an Azure Windows VM | Microsoft Docs
description: Store file data in the cloud with Azure File storage, and mount your cloud file share from an Azure virtual machine (VM).
documentationcenter: 
author: cynthn
manager: timlt
editor: tysonn

ms.assetid: 
ms.service: virtual-machines-windows
ms.workload: 
ms.tgt_pltfrm: 
ms.devlang: 
ms.topic: article
ms.date: 06/13/2017
ms.author: cynthn

---


# Use Azure File storage to store files from an Azure Windows VM

* Use Azure portal or PowerShell to create a new Azure File share, add a directory, upload a local file to the share, and list the files in the directory.
* Mount the file share, just as you would mount any SMB share.
* Use Azure Storage Metrics for troubleshooting

File storage is now supported for all storage accounts, so you can either use an existing storage account, or you can create a new storage account. 

## Use the Azure portal to manage a file share
The [Azure portal](https://portal.azure.com) provides a user interface for customers to manage file shares. From the portal, you can:

* Create your file share
* Upload and download files to and from your file share
* Monitor the actual usage of each file share
* Adjust the share size quota
* Get the `net use` command to use to mount the file share from a Windows client

### Create file share 
1. Sign in to the [Azure portal](https://portal.azure.com).
2. On the left menu, click **Storage accounts**.
3. Choose your storage account.
4. In the **Overview** page, under **Services**, select **Files**.
5. In the File Service page, click **+ File share** to create your first file share.\
6. Fill in the file share name. File share names can use lowercase letters, numbers and single hyphens. The name cannot start with a hyphen and you can't use multiple, consecutive hyphens. 
7. Fill in a limit on how large the file can be, up to up to 5120 GB.
8. Click **OK** to deploy the file share.
   

### Upload files
1. Sign in to the [Azure portal](https://portal.azure.com).
2. On the left menu, click **Storage accounts**.
3. Choose your storage account.
4. In the **Overview** page, under **Services**, select **Files**.
5. Select a file share.
6. Click **Upload** to open the **Upload files** page.
7. Click on the folder icon to browse your local file system for a file to upload.   
8. Click **Upload** to upload the file to the file share.

### Download files
1. Sign in to the [Azure portal](https://portal.azure.com).
2. On the left menu, click **Storage accounts**.
3. Choose your storage account.
4. In the **Overview** page, under **Services**, select **Files**.
5. Select a file share.
6. Right-click on the file and choose **Download** to download it to your local machine.
   
 
### Connect to a file share 

1. Sign in to the [Azure portal](https://portal.azure.com).
2. On the left menu, click **Storage accounts**.
3. Choose your storage account.
4. In the **Overview** page, under **Services**, select **Files**.
5. Select a file share.
6. Click **Connect** to open a page that shows the command line syntax for mounting the file share from Windows or Linux.

   > [!TIP]
   > To find the storage account access key for mounting, click **Settings** of your storage account, and then click **Access keys**.
   > 
   > 


## Use PowerShell to manage a file share
Alternatively, you can use Azure PowerShell to create and manage file shares.

### Install the PowerShell cmdlets for Azure Storage
To prepare to use PowerShell, download and install the Azure PowerShell cmdlets. See [How to install and configure Azure PowerShell](/powershell/azure/overview) for the install point and installation instructions.

Open an Azure PowerShell window by clicking **Start** and typing **Windows PowerShell**. The PowerShell window loads the Azure Powershell module for you.

### Create a context for your storage account and key
Now, create the storage account context. The context encapsulates the storage account name and account key. For instructions on copying your account key from the [Azure portal](https://portal.azure.com), see [View and copy storage access keys](../../storage/storage-create-storage-account.md#view-and-copy-storage-access-keys).

Replace `storage-account-name` and `storage-account-key` with your storage account name and key in the following example.

```powershell
# create a context for account and key
$ctx=New-AzureStorageContext storage-account-name storage-account-key
```

### Create a new file share
Next, create the new share, named `logs`.

```powershell
# create a new share
$s = New-AzureStorageShare logs -Context $ctx
```

You now have a file share in File storage. Next we'll add a directory and a file.

> [!IMPORTANT]
> The name of your file share must be all lowercase. For complete details about naming file shares and files, see [Naming and Referencing Shares, Directories, Files, and Metadata](https://msdn.microsoft.com/library/azure/dn167011.aspx).
> 
> 

### Create a directory in the file share
Next, create a directory in the share. In the following example, the directory is named `CustomLogs`.

```powershell
# create a directory in the share
New-AzureStorageDirectory -Share $s -Path CustomLogs
```

### Upload a local file to the directory
Now upload a local file to the directory. The following example uploads a file from `C:\temp\Log1.txt`. Edit the file path so that it points to a valid file on your local machine.

```powershell
# upload a local file to the new directory
Set-AzureStorageFileContent -Share $s -Source C:\temp\Log1.txt -Path CustomLogs
```

### List the files in the directory
To see the file in the directory, you can list all of the directory's files. This command returns the files and subdirectories (if there are any) in the CustomLogs directory.

```powershell
# list files in the new directory
Get-AzureStorageFile -Share $s -Path CustomLogs | Get-AzureStorageFile
```

Get-AzureStorageFile returns a list of files and directories for whatever directory object is passed in. "Get-AzureStorageFile -Share $s" returns a list of files and directories in the root directory. To get a list of files in a subdirectory, you have to pass the subdirectory to Get-AzureStorageFile. That's what this does -- the first part of the command up to the pipe returns a directory instance of the subdirectory CustomLogs. Then that is passed into Get-AzureStorageFile, which returns the files and directories in CustomLogs.

### Copy files
Beginning with version 0.9.7 of Azure PowerShell, you can copy a file to another file, a file to a blob, or a blob to a file. Below we demonstrate how to perform these copy operations using PowerShell cmdlets.

```powershell
# copy a file to the new directory
Start-AzureStorageFileCopy -SrcShareName srcshare -SrcFilePath srcdir/hello.txt -DestShareName destshare -DestFilePath destdir/hellocopy.txt -Context $srcCtx -DestContext $destCtx

# copy a blob to a file directory
Start-AzureStorageFileCopy -SrcContainerName srcctn -SrcBlobName hello2.txt -DestShareName hello -DestFilePath hellodir/hello2copy.txt -DestContext $ctx -Context $ctx
```

## Mount the file share
With support for SMB 3.0, File storage now supports encryption and persistent handles from SMB 3.0 clients. Support for encryption means that SMB 3.0 clients can mount a file share from anywhere, including from:

* An Azure virtual machine in the same region (also supported by SMB 2.1)
* An Azure virtual machine in a different region (SMB 3.0 only)
* An on-premises client application (SMB 3.0 only)

When a client accesses File storage, the SMB version used depends on the SMB version supported by the operating system. The table below provides a summary of support for Windows clients. Please refer to this blog for more details on [SMB versions](http://blogs.technet.com/b/josebda/archive/2013/10/02/windows-server-2012-r2-which-version-of-the-smb-protocol-smb-1-0-smb-2-0-smb-2-1-smb-3-0-or-smb-3-02-you-are-using.aspx).

| Windows Client | SMB Version Supported |
|:--- |:--- |
| Windows 7 |SMB 2.1 |
| Windows Server 2008 R2 |SMB 2.1 |
| Windows 8 |SMB 3.0 |
| Windows Server 2012 |SMB 3.0 |
| Windows Server 2012 R2 |SMB 3.0 |
| Windows 10 |SMB 3.0 |

### Mount the file share from an Azure virtual machine running Windows
To demonstrate how to mount an Azure file share, we'll now create an Azure virtual machine running Windows, and remote into it to mount the share.

1. First, create a new Azure virtual machine by following the instructions in [Create a Windows virtual machine in the Azure portal](quick-create-portal.md).
2. Next, remote into the virtual machine by following the instructions in [Logon to a Windows virtual machine using the Azure portal](connect-logon.md).
3. Open a PowerShell on the virtual machine.

### Persist your storage account credentials for the virtual machine

Before mounting to the file share, first persist your storage account credentials on the virtual machine. This step allows Windows to automatically reconnect to the file share when the virtual machine reboots. To persist your account credentials, run the `cmdkey` command from the PowerShell window on the virtual machine. Replace `<storage-account-name>` with the name of your storage account, and `<storage-account-key>` with your storage account key. You have to explicitly specify domain "AZURE" as in sample below. 

```
cmdkey /add:<storage-account-name>.file.core.windows.net /user:AZURE\<storage-account-name> /pass:<storage-account-key>
```

Windows will now reconnect to your file share when the virtual machine reboots. You can verify that the share has been reconnected by running the `net use` command from a PowerShell window.

Note that credentials are persisted only in the context in which `cmdkey` runs. If you are developing an application that runs as a service, you will need to persist your credentials in that context as well.

### Mount the file share using the persisted credentials
Once you have a remote connection to the virtual machine, you can run the `net use` command to mount the file share, using the following syntax. Replace `<storage-account-name>` with the name of your storage account, and `<share-name>` with the name of your File storage share.

```
net use <drive-letter>: \\<storage-account-name>.file.core.windows.net\<share-name>

example :
net use z: \\samples.file.core.windows.net\logs
```

Since you persisted your storage account credentials in the previous step, you do not need to provide them with the `net use` command. If you have not already persisted your credentials, then include them as a parameter passed to the `net use` command, as shown in the following example.

```
net use <drive-letter>: \\<storage-account-name>.file.core.windows.net\<share-name> /u:AZURE\<storage-account-name> <storage-account-key>

example :
net use z: \\samples.file.core.windows.net\logs /u:AZURE\samples <storage-account-key>
```

You can now work with the File Storage share from the virtual machine as you
would with any other drive. You can issue standard file commands from the command prompt, or view the mounted share and its contents from File Explorer. You can also run code within the virtual machine that accesses the file share using standard Windows file I/O APIs, such as those provided by the [System.IO namespaces](http://msdn.microsoft.com/library/gg145019.aspx) in the .NET Framework.

You can also mount the file share from a role running in an Azure cloud service by remoting into the role.

### Mount the file share from an on-premises client running Windows
To mount the file share from an on-premises client, you must first take these steps:

* Install a version of Windows which supports SMB 3.0. Windows will leverage SMB 3.0 encryption to securely transfer data between your on-premises client and the Azure file share in the cloud.
* Open Internet access for port 445 (TCP Outbound) in your local network, as is required by the SMB protocol.

> [!NOTE]
> Some Internet service providers may block port 445, so you may need to check with your service provider.
> 
> 

### Unmount the file share
To unmount the file share, you can use `net use` command with `/delete` option.

```
net use <drive-letter> /delete

example :
net use z: /delete
```

## Next steps

- 
