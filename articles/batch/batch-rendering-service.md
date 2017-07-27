---
title:  | Microsoft Docs
description: Batch rendering service.
services: batch
author: tamram
manager: timlt

ms.service: batch
ms.topic: article
ms.date: 07/25/2017
ms.author: tamram
---

# Get started with the Batch rendering service

What is it

The Batch rendering service provides a plug-in for Autodesk Maya that makes it easy to submit rendering jobs through the Maya user interface.

The Batch rendering service currently supports the following rendering engines:

- Autodesk Maya
- Autodesk Arnold

## Load the Maya plug-in

The Maya plug-in is available on [GitHub](https://github.com/Azure/azure-batch-maya) (???is there an installer?). Download the latest plug-in release and extract the *azure_batch_maya* directory to a location of your choice. You can load the plug-in directly from the *azure_batch_maya* directory.

To load the plug-in in Maya:

1. Run Maya
2. Open Window > Settings/Preferences > Plug-in Manager
3. Click Browse
4. Navigate to and select azure_batch_maya/plug-in/AzureBatch.py.

## Prerequisites

To use the Maya plug-in, you need: both an Azure Batch account and an Azure Storage account.  

- **An Azure Batch account.** For guidance on creating a Batch account in the Azure portal, see [Create a Batch account with the Azure portal](batch-account-create-portal.md)]. 
- **An Azure Storage account.** You can create a storage account automatically when you set up your Batch account. You can also use an existing storage account. To learn more about Storage accounts, see [How to create, manage, or delete a storage account in the Azure portal](https://docs.microsoft.com/azure/storage/storage-create-storage-account).

## Authenticate access to your Azure Batch and Azure Storage accounts

To use the plug-in, you need to authenticate using your Azure Batch and Azure Storage account keys. To retrieve your account keys:

1. Display the plug-in in Maya, and select the **Config** tab.
2. Navigate to the [Azure portal](portal.azure.com).
3. Select **Batch Accounts** from the left-hand menu. If necessary, click **More Services** and filter on _Batch_.
4. Locate the desired Batch account in the list.
5. Select the **Keys** menu item to display your account name, account URL, and access keys:
    a. Paste the Batch account URL into the **Service** field in the Maya plug-in. 
    b. Paste the account name into the **Batch Account** field.
    c. Paste the primary account key into the **Batch Key** field.
5. Select Storage Accounts from the left-hand menu. If necessary, click **More Services** and filter on _Storage_.
6. Locate the desired Storage account in the list. 
7. Select the **Access Keys** menu item to display the storage account name and keys.
    a. Paste the Storage account name into the **Storage Account** field in the Maya plug-in.
    b. Paste the primary account key into the **Storage Key** field.
9. Click **Authenticate** to ensure that the plug-in can access both accounts.

Once you have successfully authenticated, the plug-in sets the status field to **Authenticated**: 

![Authenticate your Batch and Storage accounts](./media/batch-aad-auth/aad-directory-id.png)

## Submit render jobs using the Batch plug-in

Before you begin using the Batch plug-in for Maya, it's helpful to be familiar with a few Batch concepts:

- A Batch **pool** is a collection of compute nodes. Each compute node is an Azure virtual machine (VM) running either Linux or Windows. For more information about pools, see the [Pool](/batch-api-basics.md#pool) section in [Develop large-scale parallel compute solutions with Batch](batch-api-basics.md).
- A Batch **job** is a collection of tasks that run on a pool. When you submit a rendering job, Batch divides the job into tasks and distributes the tasks to the compute nodes in the pool to run.



