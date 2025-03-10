---
title: Tutorial for Azure Stack Edge Pro FPGA data transfer to shares
description: In this tutorial, learn how to add and connect to shares on your Azure Stack Edge Pro FPGA device, so that Azure Stack Edge Pro FPGA can transfer data to Azure.
services: databox
author: alkohli

ms.service: azure-stack-edge
ms.topic: tutorial
ms.date: 02/27/2024
ms.author: alkohli
# Customer intent: As an IT admin, I need to understand how to add and connect to shares on Azure Stack Edge Pro FPGA so I can use it to transfer data to Azure.
---
# Tutorial: Transfer data with Azure Stack Edge Pro FPGA

[!INCLUDE [Azure Stack Edge Pro FPGA end-of-life](../../includes/azure-stack-edge-fpga-eol.md)]

This tutorial describes how to add and connect to shares on your Azure Stack Edge Pro FPGA device. After you've added the shares, Azure Stack Edge Pro FPGA can transfer data to Azure.

This procedure can take around 10 minutes to complete.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Add a share
> * Connect to the share

 
## Prerequisites

Before you add shares to Azure Stack Edge Pro FPGA, make sure that:

- You've installed your physical device as described in [Install Azure Stack Edge Pro FPGA](azure-stack-edge-deploy-install.md).

- You've activated the physical device as described in [Connect, set up, and activate Azure Stack Edge Pro FPGA](azure-stack-edge-deploy-connect-setup-activate.md).


## Add a share

To create a share, do the following procedure:

1. In the [Azure portal](https://portal.azure.com/), select your Azure Stack Edge resource and then go to the **Overview**. Your device should be online. Select **Cloud storage gateway**.

   ![Device online](./media/azure-stack-edge-deploy-add-shares/device-online-1.png)

2. Select **+ Add share** on the device command bar.

   ![Add a share](./media/azure-stack-edge-deploy-add-shares/select-add-share-1.png)

3. In the **Add share** pane, do the following procedure:

    a. In the **Name** box, provide a unique name for your share.  
    The share name can have only lowercase letters, numerals, and hyphens. It must have between 3 to 63 characters and begin with a letter or a numeral. Hyphens must be preceded and followed by a letter or a numeral.
    
    b. Select a **Type** for the share.  
    The type can be **SMB** or **NFS**, with SMB being the default. SMB is the standard for Windows clients, and NFS is used for Linux clients.  
    Depending upon whether you choose SMB or NFS shares, the rest of the options vary slightly. 

    c. Provide a storage account where the share will reside. 

    > [!IMPORTANT]
    > Make sure that the Azure Storage account that you use does not have immutability policies set on it if you are using it with a Azure Stack Edge Pro FPGA or Data Box Gateway device. For more information, see [Set and manage immutability policies for blob storage](../storage/blobs/immutable-policy-configure-version-scope.md).
    
    d. In the **Storage service** drop-down list, select **Block Blob**, **Page Blob**, or **Files**.  
    The type of service you select depends on which format you want the data to use in Azure. In this example, because we want to store the data as block blobs in Azure, we select **Block Blob**. If you select **Page Blob**, make sure that your data is 512 bytes aligned. For example, a VHDX is always 512 bytes aligned.

    e. Create a new blob container or use an existing one from the dropdown list. If creating a blob container, provide a container name. If a container doesn't already exist, it's created in the storage account with the newly created share name.
   
    f. Depending on whether you've created an SMB share or an NFS share, do one of the following steps: 
     
    - **SMB share**: Under **All privilege local user**, select **Create new** or **Use existing**. If you create a new local user, enter a username and password, and then confirm the password. This action assigns permissions to the local user. After you've assigned the permissions here, you can use File Explorer to modify them.

        If you select the **Allow only read operations** check box for this share data, you can specify read-only users.

        ![Add SMB share](./media/azure-stack-edge-deploy-add-shares/add-share-smb-1.png)
   
    - **NFS share**: Enter the IP addresses of allowed clients that can access the share.

        ![Add NFS share](./media/azure-stack-edge-deploy-add-shares/add-share-nfs-1.png)
   
4. Select **Create** to create the share.
    
    You're notified that the share creation is in progress. After the share is created with the specified settings, the **Shares** tile updates to reflect the new share.
    

## Connect to the share

You can now connect to one or more of the shares that you created in the last step. Depending upon whether you have an SMB or an NFS share, the steps can vary.

### Connect to an SMB share

On your Windows Server client connected to your Azure Stack Edge Pro FPGA device, connect to an SMB share by entering the commands:


1. In a command window, type:

    `net use \\<IP address of the device>\<share name>  /u:<user name for the share>`

2. When you're prompted to do so, enter the password for the share.  
   The sample output of this command is presented here.

    ```powershell
    Microsoft Windows [Version 10.0.16299.192)
    (c) 2017 Microsoft Corporation. All rights reserved.
    
    C: \Users\DataBoxEdgeUser>net use \\10.10.10.60\newtestuser /u:Tota11yNewUser
    Enter the password for 'TotallyNewUser' to connect to '10.10.10.60':
    The command completed successfully.
    
    C: \Users\DataBoxEdgeUser>
    ```   


3. On your keyboard, select Windows + R.

4. In the **Run** window, specify the `\\<device IP address>`, and then select **OK**.  
   File Explorer opens. You should now be able to view the shares that you created as folders. In File Explorer, double-click a share (folder) to view the content.
 
    ![Connect to SMB share](./media/azure-stack-edge-deploy-add-shares/connect-to-share2.png)

    The data is written to these shares as it is generated and the device pushes the data to cloud.

### Connect to an NFS share

On your Linux client connected to your Azure Stack Edge Pro FPGA device, do the following procedure:

1. Make sure that the client has NFSv4 client installed. To install NFS client, use the following command:

   `sudo apt-get install nfs-common`

    For more information, go to [Install NFSv4 client](https://help.ubuntu.com/community/SettingUpNFSHowTo#NFSv4_client).

2. After the NFS client is installed, mount the NFS share that you created on your Azure Stack Edge Pro FPGA device by using the following command:

   `sudo mount -t nfs -o sec=sys,resvport <device IP>:/<NFS shares on device> /home/username/<Folder on local Linux computer>`

    > [!IMPORTANT]
    > Use of `sync` option when mounting shares improves the transfer rates of large files.
    > Before you mount the share, make sure that the directories that will act as mountpoints on your local computer are already created. These directories should not contain any files or subfolders.

    The following example shows how to connect via NFS to a share on your Azure Stack Edge Pro FPGA device. The device IP is `10.10.10.60`. The share `mylinuxshare2` is mounted on the ubuntuVM. The share mount point is `/home/databoxubuntuhost/edge`.

    `sudo mount -t nfs -o sec=sys,resvport 10.10.10.60:/mylinuxshare2 /home/databoxubuntuhost/Edge`

> [!NOTE] 
> The following caveats are applicable to this release:
> - After a file is created in the share, renaming of the file isn't supported. 
> - Deleting a file from a share does not delete the entry in the storage account.

## Next steps

In this tutorial, you learned about the following Azure Stack Edge Pro FPGA topics:

> [!div class="checklist"]
> * Add a share
> * Connect to share

To learn how to transform your data by using Azure Stack Edge Pro FPGA, advance to the next tutorial:

> [!div class="nextstepaction"]
> [Transform data with Azure Stack Edge Pro FPGA](./azure-stack-edge-deploy-configure-compute.md)