---
title: Transfer data with Azure Data Box Gateway | Microsoft Docs
description: Learn how to add and connect to shares on Data Box Gateway device.
services: databox-edge
documentationcenter: NA
author: alkohli
manager: twooley
editor: ''

ms.assetid: 
ms.service: databox-edge
ms.devlang: NA
ms.topic: tutorial
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 08/31/2018
ms.author: alkohli
ms.custom: 
---
# Tutorial: Transfer data with Azure Data Box Gateway (Preview)


## Introduction

This article describes how to add and connect to shares on the Data Box Gateway. Once the shares are added, Data Box Gateway device can transfer data to Azure.

This procedure can take around 10 minutes to complete. 

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Add a share
> * Connect to share

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.


> [!IMPORTANT]
> - Data Box Gateway is in preview. Review the [Azure terms of service for preview](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) before you order and deploy this solution. 
 
## Prerequisites

Before you configure and set up your Data Box Gateway, make sure that:

* You have provisioned a virtual device and connected to it as detailed in the [Provision a Data Box Gateway in Hyper-V](data-box-gateway-deploy-provision-hyperv.md) or [Provision a Data Box Gateway in VMware](data-box-gateway-deploy-provision-vmware.md).

* You have the activation key from the Data Box Gateway service that you created to manage Data Box Gateway devices. For more information, go to [Prepare to deploy Azure Data Box Gateway](data-box-gateway-deploy-prep.md).

<!--* If this is the second or subsequent virtual device that you are registering with an existing Data Box Gateway service, you should have the service data encryption key. This key was generated when the first device was successfully activated with this service. If you have lost this key, see [Get the service data encryption key](storsimple-ova-web-ui-admin.md#get-the-service-data-encryption-key) for your Data Box Gateway.-->

## Add a share

Perform the following steps in the [Azure portal](https://portal.azure.com/) to create a share.

1. Return to the Azure portal. Go to **All resources**, and search for your Data Box Gateway service.
    
    <!--![](./media/data-box-gateway-deploy-fs-setup/searchdevicemanagerservice1.png)--> 

2. In the filtered list, select your Data Box Gateway service and and then navigate to **Overview**. You should see a notification that the device is successfully configured.
    
    <!--![Configure a file server](./media/data-box-gateway-deploy-fs-setup/deployfs2m.png)-->


3. Click **+ Add share** on the device command bar.
   
   <!--![Add a share](./media/data-box-gateway-deploy-add-shares/deployfs15m.png)-->

4. In **Add Share**, specify the share settings. Provide a unique name for your share. 

   Share names can only contain numbers, lowercase letters, and hyphens. The share name must be between 3 and 63 characters long and begin with a letter or a number. Each hyphen must be preceded and followed by a non-hyphen character.
    
5. Select a **Type** for the share. The type can be SMB or NFS, with SMB being the default. SMB is the standard for Windows clients, and NFS is used for Linux clients. Depending upon whether you choose SMB or NFS shares, options presented are slightly different. 

6. You must provide a storage account where the share will reside. A container is created in the storage account with the share name if the container already does not exist. If the container already exists, then the existing container is used. 
    
7. Choose the **Storage service** from block blob, page blob, or files. The type of the service chosen depends on which format you want the data to reside in Azure. For example, in this instance, we want the data to reside as blob blocks in Azure, hence we select Block Blob. If choosing Page Blob, you must ensure that your data is 512 bytes aligned. Note that VHDX is always 512 bytes aligned.
   
8. This step depends on whether you are creating an SMB or an NFS share. 
     
    - **If creating an SMB share** - In the Full privilege user field, choose from Create new or Use existing. If creating a new local user, provide the user name, password, and then confirm password. This assigns the permissions to the local user. After you have assigned the permissions here, you can then use File Explorer to modify these permissions.
    
    - **If creating an NFS share** - You need to supply the IP addresses of the allowed clients that can access the share.
   
9. Click **Create** to create the share. 
    
    You are notified that the share creation is in progress. After the share is created with the specified settings, the **Shares** blade updates to reflect the new share. 
     

## Connect to the share

Perform these steps on your Windows Server client connected to your Data Box Gateway to connect to shares.


1. Open a command window. At the command prompt, type:

    `net use \\<IP address of the device>\<share name>  /u:<user name for the share>`

    Enter the password for the share when prompted.

2. Press  Windows + R. In the **Run** window, specify the `\\<device IP address>`. Click **OK**. This opens File Explorer. You should now be able to see the shares that you created as folders. Select and double-click a share (folder) to view the content.
 
    <!--![Connect to SMB share](./media/data-box-gateway-deploy-add-shares/deployfs22m.png)-->

    The data is written to these shares as it is being generated and the device pushes the data to cloud.

### Connect to an NFS share

Perform these steps on your Linux client connected to your Data Box Edge.

1. Ensure that the client has NFSv4 client installed. To install NFS client, use the following command:

   `sudo apt-get install nfs-common`

    For more information, go to Install NFSv4 client.

2. After the NFS client is installed, use the following command to mount the NFS share you created on your Gateway device:

   `sudo mount <Gateway device IP>:/<NFS share on Gateway device> /home/username/<Folder on local Linux computer>`

    Prior to setting up the mounts, make sure the directories that will act as mountpoints on your local computer are already created and also do not contain any files or sub-folders.

    The following example shows how to connect via NFS to a share on Gateway device. The virtual device IP is `10.161.23.130`, the share `mylinuxshare2` is mounted on the ubuntuVM, mount point being `/home/databoxubuntuhost/gateway`.

    `sudo mount -t nfs 10.161.23.130:/mylinuxshare2 /home/databoxubuntuhost/gateway`

> [!NOTE] 
> The following caveats are applicable to the preview release:
> - After a file is created in the shares, renaming of the file isn’t supported. 
> - Deletion of a file from a share does not delete the entry in the storage account.

## Next steps

In this tutorial, you learned about  Data Box Gateway topics such as:

> [!div class="checklist"]
> * Add a share
> * Connect to share


Advance to the next tutorial to learn how to administer your Data Box Gateway.

> [!div class="nextstepaction"]
> [Use local web UI to administer a Data Box Gateway](/http://aka.ms/DBG-docs)


