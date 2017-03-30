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

# Mount the file share from a machine running macOS
Azure File storage is a service that offers file shares in the cloud using the standard Server Message Block (SMB) Protocol. Both SMB 2.1 and SMB 3.0 are supported. 

On macOS, mounting is possible from the machines located at local datacenter or on-premises provided the [prereqisites](#prereq) below are met. UI mounting differs slightly in each OS. We will go over mounting Azure File Share form El Capitan UI.



* [Prerequisites](#prereq)
* [Mount Azure File Share using File Explorer on El Capitan](#elcapitan)
* [Mount Azure file share using sudo mount command](#sudomount)
* [Mount file share using command line on El Capitan](#sudomount)
* [Troubleshooting  Azure file share issues on macOS](#tsg)


# Prerequisites for mounting Azure File on macOS

## Azure File Share URL
In the portal, find the URL to the share in the Connect pane – just the
    \\\\computer\\share part.

![](media/storage-file/portal_netuse_connect.PNG)
## Storage Account Key
You will need access to your subscription in Azure Portal or your primary or secondary storage account name and key. SAS key is not supported for mounting.

## Open SMB over TCP port 445
If you are connecting to a Azure FIle Share, check to see if your firewall is not blocking TCP ports 445 from client machine.

## Operating support for SMB 2.1 or 3.0
SMB 3.0 is supported starting macOS Sierra. There are known bugs affecting macOS performance over SMB.

<a id="elcapitan"/></a>
## Mount Azure File Share using File Explorer on El Capitan

* Open finder, and in the Go menu, click Connect to Server… in it, you’re going to
    type “smb://” and reverse the direction of your slashes from backslashes
    (windows) to forward slashes (all other sane systems) like the following:

    ![](./media/storage-file/mac_mount_azure_file.png)


* When you click connect, you will be prompted for the username (which is
    autopopulated with your Mac logged on username) and password. Here you enter
    the fileshare name and the storage account key
    will be your password. You will have the option of placing the
    username/password in your keychain. Then you have it mounted. You can start using the file share and drag and drop will works fine.

    ![](./media/storage-file/1_mac_mount_azure_file.png)


<a id="sudomount"/></a>
## Mount file share using command line on El Capitan

* **Step 1**: [Turn off packet signing for SMB 2 and SMB 3 connections](https://support.apple.com/en-us/HT205926)

```
sudo -s
echo "[default]" >> /etc/nsmb.conf
echo "signing_required=no" >> /etc/nsmb.conf
exit
```
* **Step 2**: Replace \<storage-account-name\> with the name of your storage
account. Provide Storage Account Key as password when prompted. 

```
mount_smbfs //<storage-account-name\>@<storage-account-name\>.file.core.windows.net/sharename [mount point] -o vers=3.0
```

* **Step 3**: 
Browse the Azure File Share using mountpoint.
    ![](./media/storage-file/1_mac_mount_azure_file_commandline1.png)

<a id="tsg"/></a>
## Troubleshooting  Azure file share issues on macOS

* **Q.** Azure File Storage is very slow on macOS
    When you use an SMB 2 or SMB 3 connection, packet signing is turned on by default. You might want to turn off packet signing if:
    Performance decreases when you connect to a third-party server.

    Follow the instructions to [turn off packet signing for SMB 2 and SMB 3 connections](https://support.apple.com/en-us/HT205926) published by Apple Support.
    

## Also See
* [Apple Support Article - How to connect with File Sharing on your Mac](https://support.apple.com/en-us/HT204445)
