---
title: Create an Azure virtual machine offer (VM) from an approved base, Azure Marketplace
description: Learn how to create a virtual machine (VM) offer from an approved base.
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
author: emuench
ms.author: krsh
ms.date: 10/15/2020
---

# Create a virtual machine from an approved base

This article describes how to use Azure to create a virtual machine (VM) containing a pre-configured, endorsed operating system. If this isn't compatible with your solution, it's possible to [create and configure an on-premises VM](azure-vm-create-using-own-image.md) using an approved operating system, then configure and prepare it for upload as described in [Prepare a Windows VHD or VHDX to upload to Azure](../virtual-machines/windows/prepare-for-upload-vhd-image.md).

## Select an approved base Image

Select one of the following Windows or Linux Images as your base.

### Windows

- [Windows Server](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/microsoftwindowsserver.windowsserver?tab=Overview)
- SQL Server [2019](https://azuremarketplace.microsoft.com/marketplace/apps/microsoftsqlserver.sql2019-ws2019?tab=Overview), [2014](https://azuremarketplace.microsoft.com/marketplace/apps/microsoftsqlserver.sql2014sp3-ws2012r2?tab=Overview), [2012](https://azuremarketplace.microsoft.com/marketplace/apps/microsoftsqlserver.sql2012sp4-ws2012r2?tab=Overview)

### Linux

Azure offers a range of approved Linux distributions. For a current list, see [Linux on distributions endorsed by Azure](https://docs.microsoft.com/azure/virtual-machines/linux/endorsed-distros).

## Create VM on the Azure portal

Follow these steps to create the base VM image on the [Azure portal](https://ms.portal.azure.com/):

1. Sign in to the [Azure portal](https://ms.portal.azure.com/).
2. Select **Virtual machines**.
3. Select **+ Add** to open the **Create a virtual machine** screen.
4. Select the image from the dropdown list or select **Browse all public and private images**  to search or browse all available virtual machine images.
5. To create a **Gen 2** VM, go to the **Advanced** tab and select the **Gen 2** option.

    :::image type="content" source="media/create-vm/vm-gen-option.png" alt-text="Select Gen 1 or Gen 2.":::

6. Select the size of the VM to deploy.

    :::image type="content" source="media/create-vm/create-virtual-machine-sizes.png" alt-text="Select a recommended VM size for the selected image.":::

7. Provide the other required details to create the VM.
8. Select **Review + create** to review your choices. When the **Validation passed** message appears, select  **Create**.

Azure begins provisioning the virtual machine you specified. Track its progress by selecting the **Virtual Machines** tab in the left menu. After it's created, the status of Virtual Machine changes to **Running**.

## Connect to your VM

Connect to your [Windows](../virtual-machines/windows/connect-logon.md) or [Linux](../virtual-machines/linux/ssh-from-windows.md#connect-to-your-vm) VM.

## Configure the VM

This section describes how to size, update, and generalize an Azure VM. These steps are necessary to prepare your VM to be deployed on Azure Marketplace.

## Install the most current updates

[!INCLUDE [Discussion of most current updates](includes/most-current-updates.md)]

## Perform additional security checks

[!INCLUDE [Discussion of addition security checks](includes/additional-security-checks.md)]

## Perform custom configuration and scheduled tasks

[!INCLUDE [Discussion of custom configuration and scheduled tasks](includes/custom-config.md)]

## Generalize the image

All images in the Azure Marketplace must be reusable in a generic fashion. To achieve this, the operating system VHD must be generalized, an operation that removes all instance-specific identifiers and software drivers from a VM.

### For Windows

Windows OS disks are generalized with the [sysprep](https://docs.microsoft.com/windows-hardware/manufacture/desktop/sysprep--system-preparation--overview) tool. If you later update or reconfigure the OS, you must run sysprep again.

> [!WARNING]
> After you run sysprep, turn the VM off until it's deployed because updates may run automatically. This shutdown will avoid subsequent updates from making instance-specific changes to the operating system or installed services. For more information about running sysprep, see [Steps to generalize a VHD](../virtual-machines/windows/capture-image-resource.md#generalize-the-windows-vm-using-sysprep).

### For Linux

The following process generalizes a Linux VM and redeploys it as a separate VM. For details, see [How to create an image of a virtual machine or VHD](../virtual-machines/linux/capture-image.md). You can stop when you reach the section called "Create a VM from the captured image".

1. Remove the Azure Linux agent

    1. Connect to your Linux VM using an SSH client
    2. In the SSH window, enter the following command: `sudo waagent –deprovision+user`.
    3. Type Y to continue (you can add the -force parameter to the previous command to avoid the confirmation step).
    4. After the command completes, type Exit to close the SSH client.

2. Stop virtual machine

    1. In the Azure portal, select your resource group (RG) and de-allocate the VM.
    2. Your VHD is now generalized and you can create a new VM using this VM disk.

## Take a snapshot of the VM disk

1. Sign in to the [Azure portal](https://ms.portal.azure.com/).
2. Starting at the upper-left, select **Create a resource**, then search for and select **Snapshot**.
3. In the Snapshot blade, select  **Create**.
4. Enter a **Name** for the snapshot.
5. Select an existing resource group or enter the name for a new one.
6. For **Source disk**, select the managed disk to snapshot.
7. Select the **Account type** to use to store the snapshot. Use **Standard HDD** unless you need it stored on a high performing SSD.
8. Select **Create**.

## Extract the VHD

Use the following script to export the snapshot into a VHD in your storage account.

```JSON
#Provide the subscription Id where the snapshot is created
subscriptionId=yourSubscriptionId

#Provide the name of your resource group where the snapshot is created
resourceGroupName=myResourceGroupName

#Provide the snapshot name
snapshotName=mySnapshot

#Provide Shared Access Signature (SAS) expiry duration in seconds (such as 3600)
#Know more about SAS here: https://docs.microsoft.com/en-us/azure/storage/storage-dotnet-shared-access-signature-part-1
sasExpiryDuration=3600

#Provide storage account name where you want to copy the underlying VHD file. 
storageAccountName=mystorageaccountname

#Name of the storage container where the downloaded VHD will be stored.
storageContainerName=mystoragecontainername

#Provide the key of the storage account where you want to copy the VHD 
storageAccountKey=mystorageaccountkey

#Give a name to the destination VHD file to which the VHD will be copied.
destinationVHDFileName=myvhdfilename.vhd

az account set --subscription $subscriptionId

sas=$(az snapshot grant-access --resource-group $resourceGroupName --name $ snapshotName --duration-in-seconds $sasExpiryDuration --query [accessSas] -o tsv)

az storage blob copy start --destination-blob $destinationVHDFileName --destination-container $storageContainerName --account-name $storageAccountName --account-key $storageAccountKey --source-uri $sas
```

### Script explanation

This script uses following commands to generate the SAS URI for a snapshot and copies the underlying VHD to a storage account using the SAS URI. Each command in the table links to command specific documentation.

| Command | Notes |
| --- | --- |
| az disk grant-access | Generates read-only SAS that is used to copy the underlying VHD file to a storage account or download it to on-premises
| az storage blob copy start | Copies a blob asynchronously from one storage account to another. Use `az storage blob show` to check the status of the new blob. |
|

## Next steps

- [Test and publish a virtual machine offer](azure-vm-create-test-publish.md) to ensure it meets Azure Marketplace publishing requirements.
- If you encountered difficulty creating your new Azure-based VHD, see [VM FAQ for Azure Marketplace](azure-vm-create-faq.md).
