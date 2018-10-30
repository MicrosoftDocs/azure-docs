---
title: Transfer data with Azure Data Box Gateway | Microsoft Docs
description: Learn how to add and connect to shares on Data Box Gateway device.
services: databox
author: alkohli

ms.service: databox
ms.subservice: gateway
ms.topic: tutorial
ms.date: 09/24/2018
ms.author: alkohli
#Customer intent: As an IT admin, I need to understand how to add and connect to shares on Data Box Gateway so I can use it to transfer data to Azure.
---
# Tutorial: Transfer data with Azure Data Box Gateway (Preview)


## Introduction

This article describes how to add and connect to shares on the Data Box Gateway. Once the shares are added, Data Box Gateway device can transfer data to Azure.

This procedure can take around 10 minutes to complete. 

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Add a share
> * Connect to share

> [!IMPORTANT]
> - Data Box Gateway is in preview. Review the [Azure terms of service for preview](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) before you order and deploy this solution. 
 
## Prerequisites

Before you add shares to your Data Box Gateway, make sure that:

* You have provisioned a virtual device and connected to it as detailed in the [Provision a Data Box Gateway in Hyper-V](data-box-gateway-deploy-provision-hyperv.md) or [Provision a Data Box Gateway in VMware](data-box-gateway-deploy-provision-vmware.md). 

    The virtual device is activated as detailed in [Connect and activate your Azure Data Box Gateway](data-box-gateway-deploy-connect-setup-activate.md) and ready for you to create shares and transfer data.


## Add a share

Perform the following steps in the [Azure portal](https://portal.azure.com/) to create a share.

1. Return to the Azure portal. Go to **All resources**, and search for your Data Box Gateway resource.
    
2. In the filtered list of resources, select your Data Box Gateway resource and then navigate to **Overview**. Click **+ Add share** on the device command bar.
   
   ![Add a share](./media/data-box-gateway-deploy-add-shares/click-add-share.png)

4. In **Add Share**, specify the share settings. Provide a unique name for your share. 

   Share names can only contain numbers, lowercase letters, and hyphens. The share name must be between 3 and 63 characters long and begin with a letter or a number. Each hyphen must be preceded and followed by a non-hyphen character.
    
5. Select a **Type** for the share. The type can be SMB or NFS, with SMB being the default. SMB is the standard for Windows clients, and NFS is used for Linux clients. Depending upon whether you choose SMB or NFS shares, options presented are slightly different. 

6. You must provide a storage account where the share will reside. A container is created in the storage account with the share name if the container already does not exist. If the container already exists, then the existing container is used. 
    
7. Choose the **Storage service** from block blob, page blob, or files. The type of the service chosen depends on which format you want the data to reside in Azure. For example, in this instance, we want the data to reside as blob blocks in Azure, hence we select Block Blob. If choosing Page Blob, you must ensure that your data is 512 bytes aligned. Note that VHDX is always 512 bytes aligned.
   
8. This step depends on whether you are creating an SMB or an NFS share. 
     
    - **If creating an SMB share** - In the All privilege local user field, choose from **Create new** or **Use existing**. If creating a new local user, provide the **username**, **password**, and then **confirm password**. This assigns the permissions to the local user. After you have assigned the permissions here, you can then use File Explorer to modify these permissions.
    
        ![Add SMB share](./media/data-box-gateway-deploy-add-shares/add-share-smb-1.png)
        
        If you check **allow only read operations** for this share data, then you will have the option to specify read-only users.
        
    - **If creating an NFS share** - You need to supply the IP addresses of the allowed clients that can access the share.

        ![Add NFS share](./media/data-box-gateway-deploy-add-shares/add-share-nfs-1.png)
   
9. Click **Create** to create the share. 
    
    You are notified that the share creation is in progress. After the share is created with the specified settings, the **Shares** blade updates to reflect the new share. 
    
    ![Updated list of shares](./media/data-box-gateway-deploy-add-shares/updated-list-of-shares.png) 

## Connect to the share

Perform these steps on your Windows Server client connected to your Data Box Gateway to connect to shares.


1. Open a command window. At the command prompt, type:

    `net use \\<IP address of the device>\<share name>  /u:<user name for the share>`

    Enter the password for the share when prompted. The sample output of this command is presented here.

    ```powershell
    Microsoft Windows [Version 18.8.16299.192) 
    (c) 2817 microsoft Corporation. All rights reserved . 
    
    C: \Users\GatewayUser>net use \\10.10.10.60\newtestuser /u:Tota11yNewUser 
    Enter the password for 'TotallyNewUser' to connect to '10.10.10.60' • 
    The command completed successfully. 
    
    C: \Users\GatewayUser>
    ```   


2. Press  Windows + R. In the **Run** window, specify the `\\<device IP address>`. Click **OK**. This opens File Explorer. You should now be able to see the shares that you created as folders. Select and double-click a share (folder) to view the content.
 
    ![Connect to SMB share](./media/data-box-gateway-deploy-add-shares/connect-to-share2.png)-->

    The data is written to these shares as it is generated and the device pushes the data to cloud.

### Connect to an NFS share

Perform these steps on your Linux client connected to your Data Box Edge.

1. Ensure that the client has NFSv4 client installed. To install NFS client, use the following command:

   `sudo apt-get install nfs-common`

    For more information, go to [Install NFSv4 client](https://help.ubuntu.com/community/SettingUpNFSHowTo#NFSv4_client).

2. After the NFS client is installed, use the following command to mount the NFS share you created on your Data Box Gateway device:

   `sudo mount <device IP>:/<NFS share on device> /home/username/<Folder on local Linux computer>`

    Prior to setting up the mounts, make sure the directories that will act as mountpoints on your local computer are already created and also do not contain any files or sub-folders.

    The following example shows how to connect via NFS to a share on Gateway device. The virtual device IP is `10.10.10.60`, the share `mylinuxshare2` is mounted on the ubuntuVM, mount point being `/home/databoxubuntuhost/gateway`.

    `sudo mount -t nfs 10.10.10.60:/mylinuxshare2 /home/databoxubuntuhost/gateway`

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
> [Use local web UI to administer a Data Box Gateway](http://aka.ms/dbg-docs)


