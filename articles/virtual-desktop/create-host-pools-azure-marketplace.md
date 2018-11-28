---
title: Create a Windows Virtual Desktop host pool with Azure Marketplace - Azure
description: How to create a Windows Virtual Desktop host pool with Azure Marketplace.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: how-to
ms.date: 11/21/2018
ms.author: helohr
---
# Create a host pool with Azure Marketplace

Host pools are a collection of one or more identical virtual machines within Windows Virtual Desktop tenant environments. Each host pool can contain an app group that users can interact with as they would on a physical desktop.

Use this article's instructions to create a host pool within a Windows Virtual Desktop tenant using a Microsoft Azure Marketplace offering. This includes creating a host pool in Windows Virtual Desktop, creating a resource group with VMs in an Azure subscription, joining those VMs to the Active Directory domain, and registering the VMs with Windows Virtual Desktop.

## Copy Windows 10 Enterprise multi-session images to your storage account

To use the provided Windows 10 Enterprise multi-session image for your session host pool:

1. Sign in to the tenant’s Azure subscription where you want to copy the Windows 10 Enterprise multi-session image.
2. Create a new storage account.
    1. Select the **+** or **+ Create a resource** icon in the left navigation pane.
    2. Search for and select **Storage account – blob, file, table, queue**.
    3. Select **Create**.
    4. Enter a unique value for **Name** and select the same **Location** as the virtual network you want to use.
    5. Select the appropriate **Subscription**, then select the **Create new** option under **Resource group** and enter a resource group name.
    6. Select **Create**.
3. Create a container in the storage account.
    1. In the Azure portal, navigate to the storage account you just created.
    2. In the Storage account view, select **Blobs**.
    3. In the top ribbon, select **+ Container**, enter a **Name**, select **Private** as the Public access level, then select **OK**.
4. Copy the full path to the container you created.
    1. In the created container, select **Properties**.
    2. Copy down the URL field, which should be in the format of `https://<storageaccountname>.blob.core.windows.net/<containername>/`. For example, `https://rdsstorage.blob.core.windows.net/vhds/`.
5. Copy the access key for the storage account.
    1. Navigate back to the storage account you created.
    2. Select **Access keys** on the left-hand pane and copy down the "key1" key for your records.
6. Use Azure’s AzCopy tool to copy the Windows 10 Enterprise multi-session images into your storage account.
    1. [Download and install the latest stable version of AzCopy](https://aka.ms/downloadazcopy).
    2. Run the following AzCopy command with the following format:
        ```azcopy
        AzCopy /Source:”https://rdmipreview.blob.core.windows.net/vhds?< Windows-10-Enterprise-multi-session-SaS-Key>” /Dest:<url-to-container> /DestKey:<your-key> /S
        ```
    3. Replace `<url-to-container>` with the URL from step 4, `<Windows-10-Enterprise-multi-session-SaS-Key>` with the Windows 10 Enterprise multi-session account key you should have received during the initial whitelisting, and `<your-key>` with the key from step 5.

Now that you have the Windows 10 Enterprise multi-session.vhd files in your storage account, you can carry out the instructions in the following section.

### Run the Azure Marketplace offering to provision a new host pool

>[!NOTE]
>The Windows Virtual Desktop Marketplace offerings are hidden by default. You must send your subscription ID to Microsoft to whitelist your subscription before you can complete this section’s instructions.

To run the Azure Marketplace offering to provision a new host pool:

1. Sign in to the tenant’s Azure subscription where you want to create the virtual machines for the host pool.
2. Select **+** or **+ Create a resource**.
3. Enter **Windows Virtual Desktop** in the Marketplace search window.
4. Select **Windows Virtual Desktop: Provision a host pool (Staged)**, then select **Create**.
5. On the Windows **Virtual Desktop: Provision a host pool (Staged)** blades, enter the required information based on the following guidelines:
    1. For the **Basics** blade:
        1. Enter a name for the host pool that’s unique within the Windows Virtual Desktop tenant.
        2. Enter the broker URL.
        3. Select Create new and provide a name for the Resource group.
        4. For **Location**, select where the AD server is located.
    2. For the **Configure virtual machines** blade:
        1. Either accept the defaults or customize the number and size of the VMs.
    3. For the **Virtual machine settings** blade:
        1. Enter the URL for the image you created in step 12.a of Create a VM image for automated deployment.
        2. Select either **HDD** or **SSD**.
        3. Enter the user principal name and password for the admin account that will join the VMs to the AD domain.
        4. Enter the storage account where the VHD image is located.
        5. Select the Virtual network and subnet of the AD server.
    4. For the **Windows Virtual Desktop tenant information** blade:
        1. Enter the name of the Windows Virtual Desktop tenant under which this host pool will be created.
        2. Enter the user principal name and password for the admin account that has been assigned either RDS Owner or RDS Contributor role on the Windows Virtual Desktop tenant.
    5. For the **Summary** blade:
        1. Review the information on the Summary blade. If you need to change something, go back to the appropriate blade and make your change before continuing. If the information looks correct, select **OK**.
    6. For the **Buy** blade:
        1. Select **Create**.

Depending on how many VMs you’re creating, this process can take an hour or more to complete.