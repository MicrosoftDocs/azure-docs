---
title: Use Azure marketplace image to create VM image for Azure Stack Edge Pro GPU device
description: Describes how to use an Azure marketplace image to create a VM image to use on your Azure Stack Edge Pro GPU device.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 06/02/2021
ms.author: alkohli
#Customer intent: As an IT admin, I need to understand how to create and upload Azure VM images that I can use with my Azure Stack Edge Pro device so that I can deploy VMs on the device.
---

# Use Azure Marketplace image to create VM image for your Azure Stack Edge Pro GPU

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

To deploy VMs on your Azure Stack Edge Pro device, you need to be able to create a VM image that you can use to create VMs. This article describes the steps that are required to create a VM image starting from an Azure Marketplace image. You can then use this VM image to deploy VMs on your Azure Stack Edge Pro GPU device.

## VM image workflow

The following steps describe the VM image workflow using an Azure Marketplace workflow:

1.	Connect to the Azure Cloud Shell or a client with Azure CLI installed.
2.	Search the Azure Marketplace and identify your preferred image.
3.	Create a new managed disk from the Marketplace image.
4.	Export a VHD from the managed disk to Azure Storage account.
5.	Clean up the managed disk.


For more information, go to [Deploy a VM on your Azure Stack Edge Pro device using Azure PowerShell](azure-stack-edge-gpu-deploy-virtual-machine-powershell.md).

## Prerequisites

Before you can use Azure Marketplace images for Azure Stack Edge, make sure that you are connected to Azure in either of the following ways.

1.	Using the Azure Cloud Shell terminal available on the Azure portal. 
2.	Using a client machine with Azure CLI and Azure PowerShell installed. If you have previously connected to an Azure Stack Edge device via the Azure Resource Manager from this client, run the `Disconnect-AzureRmAccount` command before you proceed.


## Connect to Azure

[!INCLUDE [azure-cli-prepare-your-environment](../../includes/azure-cli-prepare-your-environment.md)]

### Using Azure Cloud Shell
Click the button in the Azure Portal toolbar to launch Azure Cloud Shell in PowerShell mode.
 

### Using Azure CLI
With Azure CLI installed on your client machine, run the command az login. This will open a browser window where you will log in to your Azure account.

## Search for Azure Marketplace images

You will now identify a specific Azure Marketplace image which you wish to use. Azure Marketplace hosts thousands of VM images. We will provide some examples to find some of the most common.

To find some of the most common Marketplace images that match your search criteria, run the following command.  

```azurecli
az vm image list --all [--publisher <Publisher>] [--offer <Offer>] [--sku <SKU>]
```
The last three flags are optional but excluding them returns a very long list.

Some example queries are:

```azurecli
#Returns all images of type “Windows Server”
az vm image list --all --publisher "MicrosoftWindowsserver" --offer "WindowsServer" 

#Returns all Windows Server 2019 Datacenter images
az vm image list --all --publisher "MicrosoftWindowsserver" --offer "WindowsServer" --sku "2019-Datacenter" 

#Returns all VM images from publisher 
az vm image list --all --publisher "Canonical" 
```

>[!IMPORTANT]
> Use only the Gen 1 images. Any images specified as Gen 2, do not work on Azure Stack Edge.

In this example, we will select Windows Server 2019 Datacenter Core, version 2019.0.20190410. We will identify this image by its Universal Resource Number (“URN”). 
 


Below is a list of URNs for some of the most common images. If you just want the latest version of a particular OS, the version number can be replaced with “latest” in the URN. For example “MicrosoftWindowsServer:WindowsServer:2019-Datacenter:Latest”. 


| OS              | SKU                                     | Version               | URN                                                                                       |
|-----------------|-----------------------------------------|-----------------------|-------------------------------------------------------------------------------------------|
| Windows Server  | 2019 Datacenter                         | 17763.1879.2104091832 | MicrosoftWindowsServer:WindowsServer:2019-Datacenter:17763.1879.2104091832                |
| Windows Server  | 2019 Datacenter (30 GB small disk)      | 17763.1879.2104091832 | MicrosoftWindowsServer:WindowsServer:2019-Datacenter-smalldisk:17763.1879.2104091832      |
| Windows Server  | 2019 Datacenter Core                    | 17763.1879.2104091832 | MicrosoftWindowsServer:WindowsServer:2019-Datacenter-Core:17763.1879.2104091832           |
| Windows Server  | 2019 Datacenter Core (30 GB small disk) | 17763.1879.2104091832 | MicrosoftWindowsServer:WindowsServer:2019-Datacenter-Core-smalldisk:17763.1879.2104091832 |
| Windows Desktop | Windows 10 20H2 Pro                     | 19042.928.2104091209  | MicrosoftWindowsDesktop:Windows-10:20h2-pro:19042.928.2104091209                          |
| Ubuntu Server   | Canonical Ubuntu Server 18.04 LTS       | 18.04.202002180       | Canonical:UbuntuServer:18.04-LTS:18.04.202002180                                          |
| Ubuntu Server   | Canonical Ubuntu Server 16.04 LTS       | 16.04.202104160       | Canonical:UbuntuServer:16.04-LTS:16.04.202104160                                          |
| CentOS          | CentOS 8.1                              | 8.1.2020062400        | OpenLogic:CentOS:8_1:8.1.2020062400                                                       |
| CentOS          | CentOS 7.7                              | 7.7.2020062400        | OpenLogic:CentOS:7.7:7.7.2020062400                                                       |



## Create a new managed disk from the Marketplace image

Create an Azure Managed Disk from your chosen Marketplace image. 

1. Set some parameters.

    ```azurecli
    $urn = <URN of the Marketplace image> #Example: “MicrosoftWindowsServer:WindowsServer:2019-Datacenter:Latest”
    $diskName = <disk name> #Name for new disk to be created
    $diskRG = <resource group> #Resource group that contains the new disk
    ```


1. Create the disk and generate a SAS access URL.

    ```azurecli
    az disk create -g $diskRG -n $diskName --image-reference $urn
    $sas = az disk grant-access --duration-in-seconds 36000 --access-level Read --name $diskName --resource-group $diskRG
    $diskAccessSAS = ($sas | ConvertFrom-Json)[0].accessSas 
    ```

## Export a VHD from the managed disk to a cloud storage account

This step will export a VHD from the managed disk to your preferred Azure blob storage account. This VHD can then be used to create VM images on Azure Stack Edge.

1. Set the destination storage account where the VHD will be copied.
    
    ```azurecli
    $storageAccountName = <destination storage account name>
    $containerName = <destination container name>
    $destBlobName = <blobname.vhd> #Blob that will be created, including .vhd extension
    $storageAccountKey = <storage account key>
    ```

1. Copy the VHD to the destination storage account.

    ```azurecli
    $destContext = New-AzureStorageContext -StorageAccountName $storageAccountName -StorageAccountKey $storageAccountKey
    Start-AzureStorageBlobCopy -AbsoluteUri $diskAccessSAS -DestContainer $containerName -DestContext $destContext -DestBlob $destBlobName
    ```

    The VHD copy will take several minutes to complete. Ensure the copy has completed before proceeding by running the following command. The status field will show “Success” when complete.
    
    ```azurecli
    Get-AzureStorageBlobCopyState –Container $containerName –Context $destContext -Blob $destBlobName 
    ```

## Clean up the managed disk

To delete the managed disk you created, follow these steps:

```azurecli
az disk revoke-access --name $diskName --resource-group $diskRG 
az disk delete --name $diskName --resource-group $diskRG --yes 
```


## Next steps

[Deploy VMs on your Azure Stack Edge Pro GPU device](azure-stack-edge-gpu-deploy-virtual-machine-portal.md).