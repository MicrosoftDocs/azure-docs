---
title: Azure Data Box Gateway manage shares | Microsoft Docs 
description: Describes how to use the Azure portal to manage shares on your Azure Data Box Gateway.
services: databox-edge-gateway
documentationcenter: NA
author: alkohli
manager: twooley
editor: ''

ms.assetid: 
ms.service: databox
ms.devlang: NA
ms.topic: overview
ms.custom: 
ms.tgt_pltfrm: NA
ms.workload: TBD
ms.date: 09/25/2018
ms.author: alkohli
---
# Use the Azure portal to manage shares on your Azure Data Box Gateway 

This article describes how to manage shares on your Azure Data Box Gateway. 

You can manage the Azure Data Box Gateway via the Azure portal or via the local web UI. This article focuses on the tasks that you can perform using the Azure portal. Use the Azure portal to manage shares, manage users or manage bandwidth.


## About shares

To transfer data to Azure, you need to provision shares on your Azure Data Box Gateway. The shares provisioned on the Data Box Gateway device are cloud shares. The data from these shares is automatically uploaded to the cloud. All the cloud functions such as Refresh and Sync storage keys apply to these shares. Use these shares when you want the data from the device to be automatically pushed to your storage account in the cloud.

## Add a share

Perform the following steps in the Azure portal to create a share.
1. In the Azure portal go to your Data Box Gateway resource and then navigate to **Overview**. Click **+ Add share** on the command bar.
2. In **Add Share**, specify the share settings. Provide a unique name for your share.

    Share names can only contain numbers, lowercase letters, and hyphens. The share name must be between 3 and 63 characters long and begin with a letter or a number. Each hyphen must be preceded and followed by a non-hyphen character.

3. Select a Type for the share. The type can be SMB or NFS, with SMB being the default. SMB is the standard for Windows clients, and NFS is used for Linux clients. Depending upon whether you choose SMB or NFS shares, options presented are slightly different.

4. You must provide a storage account where the share will reside. A container is created in the storage account with the share name if the container already does not exist. If the container already exists, then the existing container is used.

5. Choose the Storage service from block blob, page blob, or files. The type of the service chosen depends on which format you want the data to reside in Azure. For example, in this instance, we want the data to reside as blob blocks in Azure, hence we select Block Blob. If choosing Page Blob, you must ensure that your data is 512 bytes aligned. Note that VHDX is always 512 bytes aligned.
6. This step depends on whether you are creating an SMB or an NFS share.
    - **If creating an SMB share** - In the All privilege local user field, choose from Create new or Use existing. If creating a new local user, provide the username, password, and then confirm password. This assigns the permissions to the local user. After you have assigned the permissions here, you can then use File Explorer to modify these permissions.
        If you check allow only read operations for this share data, then you will have the option to specify read-only users.
    - **If creating an NFS share** - You need to supply the IP addresses of the allowed clients that can access the share.
7. Click **Create** to create the share. You are notified that the share creation is in progress. After the share is created with the specified settings, the **Shares** blade updates to reflect the new share.
 



## Modify share

## Delete a share

## Refresh shares

You may need to cancel an order for various reasons after you have placed the order. You can only cancel the order before the order is processed. Once the order is processed and Data Box is prepared, it is not possible to cancel the order. 

Perform the following steps to cancel an order.

1.	Go to **Overview > Cancel**. 

    ![Cancel order 1](media/data-box-portal-admin/cancel-order1.png)

2.	Fill out a reason for canceling the order.  

    ![Cancel order 2](media/data-box-portal-admin/cancel-order2.png)

3.	Once the order is canceled, the portal updates the status of the order and displays it as **Canceled**. 


## Next steps

- Learn how to [Troubleshoot Data Box issues](data-box-faq.md).
