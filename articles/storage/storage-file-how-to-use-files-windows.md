---
title: Introduction to Azure File Storage | Microsoft Docs
description: An overview of Azure File Storage, Microsoft's cloud file system. Learn how to mount Azure File shares over SMB and lift classic on-premises workloads to the cloud without rewriting any code.
services: storage
documentationcenter: ''
author: RenaShahMSFT
manager: aungoo
editor: tysonn

ms.assetid: a4a1bc58-ea14-4bf5-b040-f85114edc1f1
ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 03/21/2017
ms.author: renash
---

# Mount the file share from a machine running Windows

Azure File storage is a service that offers file shares in the cloud using the standard Server Message Block (SMB) Protocol. Both SMB 2.1 and SMB 3.0 are supported. Mounting is possible from the server located at local datacenter, on-premises or in Azure provided the [prereqisites](#prereq) below are met. The instructions to mount and persist on all Windows version are the same from command line. UI mounting differs slightly in each OS. We will go over mounting Azure File Share form Windows 10 File Explorer from UI.

* [Prerequisites](#prereq)
* [Automatically reconnecting after reboot - Persisting credentials](#reconnect)
* [Mount file share using net use command](#netuse)
* [Mount Azure File Share using File Explorer on Windows 10](#win10)
* [Troubleshoot mounting in Windows](#troubleshoot)

<a id="prereq"/></a>
## Prerequisites for Mounting Azure File Share

Azure File share can be mounted on Windows machine either on-premises or in Azure VM depending on OS version. Below table illustrates the 

| Windows Version        | SMB Version |Mountable On Azure VM|Mountable On-Premise|
|------------------------|-------------|---------------------|---------------------|
| Windows 7              | SMB 2.1     | Yes                 | No                  |
| Windows Server 2008 R2 | SMB 2.1     | Yes                 | No                  |
| Windows 8              | SMB 3.0     | Yes                 | Yes                 |
| Windows Server 2012    | SMB 3.0     | Yes                 | Yes                 |
| Windows Server 2012 R2 | SMB 3.0     | Yes                 | Yes                 |
| Windows 10             | SMB 3.0     | Yes                 | Yes                 |

<a id="reconnect"/></a>
## Automatically reconnecting after reboot - Persisting credentials

Before mounting to the file share, first persist your storage account
credentials on the virtual machine. This step allows Windows to automatically
reconnect to the file share when the virtual machine reboots. To persist your
account credentials, run the cmdkey command from the PowerShell window on the
virtual machine. Replace \<storage-account-name\> with the name of your storage
account, and \<storage-account-key\> with your storage account key. Learn more about [how to find storage account and key from portal](storage-file-how-to-use-files-portal#connect)

```
cmdkey /add:\<storage-account-name\>.file.core.windows.net
/user:AZURE\\\<storage-account-name\> /pass:\<storage-account-key\>
```

Windows will now reconnect to your file share when the virtual machine reboots.
You can verify that the share has been reconnected by running the net
use command from a PowerShell window.

Note that credentials are persisted only in the context in which cmdkey runs. If
you are developing an application that runs as a service, you will need to
persist your credentials in that context as well.

Once you have a remote connection to the virtual machine, you can run the net
use command to mount the file share, using the following syntax.
Replace \<storage-account-name\> with the name of your storage account,
and \<share-name\> with the name of your File storage share.

```
net use \<drive-letter\>:
\\\\\<storage-account-name\>.file.core.windows.net\\\<share-name\>

REM example :

net use z:
[\\\\samples.file.core.windows.net\\logs](file://samples.file.core.windows.net/logs)

REM You could now use your favorite commands to write and copy data to mounted
Azure file share.

REM ipconfig \> z:\\sample0.txt

REM copy sample1.txt z:\\
```
<a id="netuse"/></a>
## Mount file share using net use command

Since you persisted your storage account credentials in the previous step, you
do not need to provide them with the net use command. If you have not already
persisted your credentials, then include them as a parameter passed to the net
use command, as shown in the following example.

```

net use \<drive-letter\>:
\\\\\<storage-account-name\>.file.core.windows.net\\\<share-name\>
/u:\<storage-account-name\> \<storage-account-key\>

REM example :

net use z: \\\\samples.file.core.windows.net\\logs /u:samples
\<storage-account-key\>
```

You can now work with the File Storage share from the virtual machine as you
would with any other drive. You can issue standard file commands from the
command prompt, or view the mounted share and its contents from File Explorer.
You can also run code within the virtual machine that accesses the file share
using standard Windows file I/O APIs, such as those provided by the [System.IO
namespaces](http://msdn.microsoft.com/library/gg145019.aspx) in the .NET
Framework.

You can also mount the file share from a role running in an Azure cloud service
by remoting into the role.


<a id="win10"/></a>
## Mount Azure File Share using File Explorer on Windows 10

* From File Explorer, select **Map Network Drive**
    
    ![](media/storage-file/1_MountOnWindows10.png)

* Select the Dive letter and enter the Share Name. Share name can be found from Azure Portal "Connect" Button. Learn more about [where to find the share name on azure portal](storage-file-how-to-use-files-portal.md/#connect)
    
    ![](media/storage-file/2_MountOnWindows10.png)

* Enter The Storage account name as user-name and Access Key as password.
    
    ![](media/storage-file/3_MountOnWindows10.png)

* And you are done. Once the Azure File Storage hare is mounted, you can see it in the explorer.
    
    ![](media/storage-file/4_MountOnWindows10.png)

## Troubleshoot mounting in Windows

** Q. Net use was successful but don't see the Azure file share mounted in Windows Explorer
Cause **

    By default, Windows Explorer does not run as Administrator. If you run net use from an Administrator command prompt, you map the network drive "As Administrator." Because mapped drives are user-centric, the user account that is logged in does not display the drives if they are mounted under a different user account. Solution is to mount the share from a non-administrator command line.

## Also See
* [Manage Azure File Share using tools and scripts](storage-file-how-to-tooling-and-scripting.md)
* [Using Azure PowerShell with Azure Storage](storage-powershell-guide-full.md)
* [How to use AzCopy with Microsoft Azure Storage](storage-use-azcopy.md)
* [Using the Azure CLI with Azure Storage](storage-azure-cli.md#create-and-manage-file-shares)
* [Troubleshooting Azure File storage problems](https://docs.microsoft.com/en-us/azure/storage/storage-troubleshoot-file-connection-problems)
