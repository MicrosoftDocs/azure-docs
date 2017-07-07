---
title: How to use storage Explorer to delete object | Microsoft Docs
description: Shows how to use storage Explorer to delete object which prevents deletion of the storage account
services: storage
documentationcenter: ''
author: genlin
manager: willchen
editor: na
tags: storage

ms.service: storage
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/28/2017
ms.author: genli

---
# How to use Storage Explorer to delete object

You might cannot delete a storage account because of a VHD which prevents deletion of the storage account. This article shows how to delete the VHD by using Microsoft Azure Storage Explorer (Preview).

To delete the object, please follow these steps:

## Step 1 Identity the VHD and VM that prevent deletion of the storage account

1. When you delete the storage  account, you will receive a message dialog such as the following: 

    ![message when deleting the storage account](media/storage-use-storage-explorer-to-delete-object/delete-storage-error.png) 

2. Copy the disk name from the disk url. For following example, the disk name is "Coslab-SCCM2012-2015-08-28.vhd".

        https://portalvhds73fmhrw5xkp43.blob.core.windows.net/vhds/Coslab-SCCM2012-2015-08-28.vhd


## Step 2 Delete the VDH by using Azure Storage Explorer

1. Download and Install the latest version of [Azure Storage Explorer](http://storageexplorer.com/). This tool is a standalone app from Microsoft that allows you to easily work with Azure Storage data on Windows, macOS and Linux.
2. Open Azure Storage Explorer, select ![account icon](media/storage-use-storage-explorer-to-delete-object/account.png) on the left bar, select your Azure environment, and then sign in.

3. Select all subscriptions or the subscription that contains the storage account you want to delete.

    ![add subscription](media/storage-use-storage-explorer-to-delete-object/addsub.png)

4. Go to the storage account, select the Blob Containers > vhds and search for the VHD that prevents you delete the storage account.
5. If the VHD is found, right-click the VHD, select **Break Lease** and then select Delete.
