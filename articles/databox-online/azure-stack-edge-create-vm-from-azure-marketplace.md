---
title: Create VM image using source images from Azure Marketplace or images from your Azure Storage account.
description: Learn how to create a VM image using source images from Azure Marketplace or from your Azure Storage account.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 03/10/2023
ms.author: alkohli
# Customer intent: As an IT admin, I need to understand how to create VM images using source images from Azure Marketplace or images from an Azure Storage account.
---
# Create a VM image from Azure Marketplace or Azure storage account

[!INCLUDE [applies-to-GPU-sku](../../includes/azure-stack-edge-applies-to-gpu-sku.md)]

This article describes how to create a VM image using source images from Azure Marketplace or images from an Azure Storage account. These VM images can then be used to create a VM on your Azure Stack Edge.

The target audience for this guide is IT administrators familiar with the existing Azure Stack Edge solution. 

## Scenarios covered 

The following scenarios are described in this article:

- Add a VM image from an image in Azure Marketplace via Azure portal.  

- Add a VM image from a VHD/VHDX loaded in Azure Storage account via Azure portal. 

- View VM image properties. 

- Delete a VM image in Azure portal. 

- Add a VM. 

## Review the prerequisites  

Before you begin, make sure that:

1. You have your Microsoft account with credentials to access Azure portal.
1. Your Azure Stack Edge subscription is enabled for this feature.
1. You have access to an Azure Stack Edge device that is deployed, registered, and connected to Azure.
1. You go to the **Overview** page for your Azure Stack Edge device. **Deployed edge services** should show Virtual machines as Running.

   To enable your VM, use the steps in [Deploy VMs on your Azure Stack Edge device](azure-stack-edge-gpu-deploy-virtual-machine-portal.md#add-a-vm-image). 

   [![Screenshot showing the Deployed edge services page for an Azure Stack Edge device. The page shows VMs running as expected.](./media/azure-stack-edge-create-vm-from-azure-marketplace/azure-stack-edge-access-deployed-edge-services-vm-running-01.png)](./media/azure-stack-edge-create-vm-from-azure-marketplace/azure-stack-edge-access-deployed-edge-services-vm-running-01.png#lightbox)

   If you're using custom images, you should have a VHD loaded in your Azure Storage account. See how to [Upload a VHD image in your Azure Storage account](azure-stack-edge-gpu-create-virtual-machine-image.md?tabs=windows#copy-vhd-to-storage-account-using-azcopy).

## Add a VM image from Azure Marketplace

Use the following steps to create a VM image starting from an Azure Marketplace image. You can use the VM image to deploy VMs on your Azure Stack Edge cluster.

1. Go to the Azure Stack Edge cluster resource in Azure portal. Select **Virtual machines** > **Images** > **+ Add image**.

   [![Screenshot showing the option to add a VM image from Azure Marketplace on the Virtual machines page of an Azure Stack Edge device in Azure portal](./media/azure-stack-edge-create-vm-from-azure-marketplace/azure-stack-edge-add-vm-image-from-azure-marketplace-02.png)](./media/azure-stack-edge-create-vm-from-azure-marketplace/azure-stack-edge-add-vm-image-from-azure-marketplace-02.png#lightbox)

1. On the **Add image** page, select an image from the **Image to download** dropdown menu, and then select **Add**.

   



## Add a VM image from an Azure storage account

## View VM image properties

## Delete a VM image

## Add a VM

## Next steps

