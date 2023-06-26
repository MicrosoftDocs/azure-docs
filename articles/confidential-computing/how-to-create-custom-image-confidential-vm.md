---
title: Create a custom image for Azure confidential VMs
description: Learn how to use the Azure CLI to create a Confidential VM custom image from a vhd.
author: simranparkhe
ms.service: virtual-machines
mms.subservice: confidential-computing
ms.topic: how-to
ms.workload: infrastructure
ms.date: 6/09/2023
ms.author: corsini
ms.custom: devx-track-azurecli
---

# How to create a custom image for Azure confidential VMs

**Applies to:** :heavy_check_mark: Linux VMs

This "how to" shows you how to use the Azure Command-Line Interface (Azure CLI) to create a custom image for your confidential virtual machine (confidential VM) in Azure. The Azure CLI is used to create and manage Azure resources via either the command line or scripts.

Creating a custom image allows you to preconfigure your confidential VM with specific software, settings, and security measures that meet your requirements. If you want to bring an Ubuntu image that is not [confidential VM compatible](/azure/confidential-computing/confidential-vm-overview#os-support), you can follow the steps below to see what the minimum requirements are for your image.

## Prerequisites

If you don't have an Azure subscription, [create a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

### Launch Azure Cloud Shell

Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account.

To open the Cloud Shell, just select **Try it** from the upper right corner of a code block. You can also open Cloud Shell in a separate browser tab by going to [https://shell.azure.com/bash](https://shell.azure.com/bash). Select **Copy** to copy the blocks of code, paste it into the Cloud Shell, and select **Enter** to run it.

If you prefer to install and use the CLI locally, this quickstart requires Azure CLI version 2.0.30 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

### Create a resource group

Create a resource group with the [az group create](/cli/azure/group) command. An Azure resource group is a logical container into which Azure resources are deployed and managed.
> [!NOTE]
> Confidential VMs are not available in all locations. For currently supported locations, see which [VM products are available by Azure region](https://azure.microsoft.com/global-infrastructure/services/?products=virtual-machines).
```azurecli - interactive
az group create --name $resourceGroupName --location eastus
```
## Create custom image for Azure confidential VMs

1. [Create a virtual machine](/azure/virtual-machines/linux/quick-create-cli) with an Ubuntu image of choice from the list of [Azure supported images.](/azure/virtual-machines/linux/cli-ps-findimage)

2. Ensure the kernel version is at least 5.15.0-1037-azure. You can use "uname -r" after connecting to the VM to check the kernel version. Here you can add any changes to the image as you see fit. 

3. Deallocate your virtual machine.
    ```azurecli
    az vm deallocate --name $vmname --resource-group $resourceGroupName
    ```
3. Create a shared access token (SAS token) for the OS disk and store it in a variable. Note this OS disk doesn't have to be in the same resource group as the confidential VM.
    ```azurecli
    disk_name=$(az vm show --name $vmname --resource-group $resourceGroupName | jq -r .storageProfile.osDisk.name)
    disk_url=$(az disk grant-access --duration-in-seconds 3600 --name $disk_name --resource-group $resourceGroupName | jq -r .accessSas)
    ```

#### Create a storage account to store the exported disk

1. Create a storage account.
    ```azurecli
    az storage account create --resource-group ${resourceGroupName} --name ${storageAccountName} --location $region --sku "Standard_LRS"
    ```
2. Create a container within the storage account.
    ```azurecli
    az storage container create --name $storageContainerName --account-name $storageAccountName --resource-group $resourceGroupName
    ```
3. Generate a read shared access token (SAS token) to the [storage container](/cli/azure/storage/container) and save it in a variable. 
    ```azurecli
    container_sas=$(az storage container generate-sas --name $storageContainerName --account-name $storageAccountName --auth-mode key --expiry 2024-01-01 --https-only --permissions dlrw -o tsv)
    ```
4. Using azcopy, copy the OS disk to the storage container.
    ```azurecli
     blob_url="https://${storageAccountName}.blob.core.windows.net/$storageContainerName/$referenceVHD"
     azcopy copy "$disk_url" "${blob_url}?${container_sas}"
    ```

#### Create a confidential supported image

1. Create a Shared Image Gallery.
   ```azurecli
    az sig create --resource-group $resourceGroupName --gallery-name $galleryName
    ```
2. Create a [shared image gallery (SIG) definition](/cli/azure/sig/image-definition) confidential VM supported. Set new names for gallery image definition, SIG publisher, and SKU.  
   ```azurecli
    az sig image-definition create --resource-group  $resourceGroupName --location $region --gallery-name $galleryName --gallery-image-definition $imageDefinitionName --publisher $sigPublisherName --offer ubuntu --sku $sigSkuName --os-type Linux --os-state specialized --hyper-v-generation V2  --features SecurityType=ConfidentialVMSupported
    ```
3. Get the storage account ID.
   ```azurecli
    storageAccountId=$(az storage account show --name $storageAccountName --resource-group $resourceGroupName | jq -r .id)
    ```
4. Create a SIG image version.
   ```azurecli
    az sig image-version create --resource-group $resourceGroupName --gallery-name $galleryName --gallery-image-definition $imageDefinitionName --gallery-image-version $galleryImageVersion --os-vhd-storage-account $storageAccountId --os-vhd-uri $blob_url
    ```
5. Store the ID of the SIG image version created in the previous step.
   ```azurecli
    galleryImageId=$(az sig image-version show --gallery-image-definition $imageDefinitionName --gallery-image-version $galleryImageVersion --gallery-name $galleryName --resource-group $resourceGroupName | jq -r .id)
    ```
#### Create a confidential VM

1. Create a VM with the [az vm create](/cli/azure/vm) command. For more information, see [secure boot and vTPM](/azure/virtual-machines/trusted-launch). For more information on disk encryption, see [confidential OS disk encryption](confidential-vm-overview.md). Currently confidential VMs support the [DC series](/azure/virtual-machines/dcasv5-dcadsv5-series) and [EC series](/azure/virtual-machines/ecasv5-ecadsv5-series) VM sizes.
    ```azurecli-interactive
    az vm create \
    --resource-group $resourceGroupName \
    --name $cvmname \
    --size Standard_DC4as_v5 \
    --enable-vtpm true \
    --enable-secure-boot true \
    --image $galleryImageId \
    --public-ip-sku Standard \
    --security-type ConfidentialVM \
    --os-disk-security-encryption-type VMGuestStateOnly \
    --specialized
    ```
## Next Steps
> [!div class="nextstepaction"]
> [Connect and attest the CVM through Microsoft Azure Attestation Sample App](quick-create-confidential-vm-azure-cli-amd.md)
