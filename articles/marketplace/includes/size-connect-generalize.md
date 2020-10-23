---
title: include file
description: file
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: include
author: mingshen-ms
ms.author: krsh
ms.date: 10/20/2020
---

## Generalize the image

All images in the Azure Marketplace must be reusable in a generic fashion. To achieve this, the operating system VHD must be generalized, an operation that removes all instance-specific identifiers and software drivers from a VM.

### For Windows

Windows OS disks are generalized with the [sysprep](https://docs.microsoft.com/windows-hardware/manufacture/desktop/sysprep--system-preparation--overview) tool. If you later update or reconfigure the OS, you must run sysprep again.

> [!WARNING]
> After you run sysprep, turn the VM off until it's deployed because updates may run automatically. This shutdown will avoid subsequent updates from making instance-specific changes to the operating system or installed services. For more information about running sysprep, see [Steps to generalize a VHD](../../virtual-machines/windows/capture-image-resource.md#generalize-the-windows-vm-using-sysprep).

### For Linux

The following process generalizes a Linux VM and redeploys it as a separate VM. For details, see [How to create an image of a virtual machine or VHD](../../virtual-machines/linux/capture-image.md). You can stop when you reach the section called "Create a VM from the captured image".

1. Remove the Azure Linux agent.
    1. Connect to your Linux VM using an SSH client.
    2. In the SSH window, enter this command: `sudo waagent –deprovision+user`.
    3. Type Y to continue (you can add the -force parameter to the previous command to avoid the confirmation step).
    4. After the command completes, enter **Exit** to close the SSH client.
2. Stop virtual machine.
    1. In the Azure portal, select your resource group (RG) and de-allocate the VM.
    2. Your VM is now generalized and you can create a new VM using this VM disk.

### Take a snapshot of the VM disk

1. Sign in to the [Azure portal](https://ms.portal.azure.com/).
2. Starting at the upper-left, select **Create a resource**, then search for and select **Snapshot**.
3. In the Snapshot blade, select  **Create**.
4. Enter a **Name** for the snapshot.
5. Select an existing resource group or enter the name for a new one.
6. For **Source disk**, select the managed disk to snapshot.
7. Select the **Account type** to use to store the snapshot. Use **Standard HDD** unless you need it stored on a high performing SSD.
8. Select **Create**.

#### Extract the VHD

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

#### Script explanation

This script uses following commands to generate the SAS URI for a snapshot and copies the underlying VHD to a storage account using the SAS URI. Each command in the table links to command specific documentation.

| Command | Notes |
| --- | --- |
| az disk grant-access | Generates read-only SAS that is used to copy the underlying VHD file to a storage account or download it to on-premises
| az storage blob copy start | Copies a blob asynchronously from one storage account to another. Use `az storage blob show` to check the status of the new blob. |
|
