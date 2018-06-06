---
title: Add an Azure Stack marketplace item from Azure | Microsoft Docs
description: Describes how to add an Azure-based Windows Server virtual machine image to the Azure Stack Marketplace.
services: azure-stack
documentationcenter: ''
author: jeffgilb
manager: femila
editor: ''

ms.assetid: 
ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.custom: mvc
ms.date: 03/16/2018
ms.author: jeffgilb
ms.reviewer: misainat
---

# Tutorial: add an Azure Stack marketplace item from Azure

As an Azure Stack Operator, the first thing you need to do to enable users to deploy a Virtual Machine (VM) is to add a VM image to the Azure Stack marketplace. By default, nothing is published to the Azure Stack marketplace, but you can download items from [a curated list of Azure marketplace items](.\.\azure-stack-marketplace-azure-items.md) that have been pre-tested to run on Azure Stack. Use this option if you are operating in a connected scenario and you have registered your Azure Stack instance with Azure.

In this tutorial, you add the Windows Server 2016 VM image from the Azure marketplace to the Azure Stack marketplace.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Add a Windows Server VM Azure Stack marketplace item
> * Verify the VM image is available 
> * Test the VM image

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

To complete this tutorial:

- Install the [Azure Stack-compatible Azure PowerShell modules](asdk-post-deploy.md#install-azure-stack-powershell)
- Download the [Azure Stack tools](asdk-post-deploy.md#download-the-azure-stack-tools)
- [Register the ASDK](asdk-register.md) with your Azure subscription

## Add a Windows Server VM image
You can add a Windows Server 2016 image to the Azure Stack marketplace by downloading the image from the Azure marketplace. Use this option if you are operating in a connected scenario and you have already [registered your Azure Stack instance](asdk-register.md) with Azure.

1. Sign in to the [ASDK admin portal](https://adminportal.local.azurestack.external).

2. Select **More services** > **Marketplace Management** > **Add from Azure**. 

   ![Add from Azure](media/asdk-marketplace-item/azs-marketplace.png)

3. Find or search for the **Windows Server 2016 Datacenter** image.

4. Select the **Windows Server 2016 Datacenter** image and then select **Download**.

   ![Download image from Azure](media/asdk-marketplace-item/azure-marketplace-ws2016.png)


> [!NOTE]
> It takes approximately an hour to download the VM image and publish it to the Azure Stack marketplace. 

When the download finishes, the image will be published and available under **Marketplace Management**. The image is also available under **Compute** to create new virtual machines.

## Verify the marketplace item is available
Use these steps to verify that the new VM image is available in the Azure Stack marketplace.

1. Sign in to the [ASDK admin portal](https://adminportal.local.azurestack.external).

2. Select **More services** > **Marketplace Management**. 

3. Verify that the Windows Server 2016 Datacenter VM image has been added successfully.

   ![Downloaded image from Azure](media/asdk-marketplace-item/azs-marketplace-ws2016.png)

## Test the VM image
As an Azure Stack operator, you can use the [administrator portal](https://adminportal.local.azurestack.external) to create a test VM to validate the image has been made available successfully. 

1. Sign in to the [ASDK admin portal](https://adminportal.local.azurestack.external).

2. Click **New** > **Compute** > **Windows Server 2016 Datacenter** > **Create**.  
 ![Create VM from marketplace image](media/asdk-marketplace-item/new-compute.png)

3. In the **Basics** blade, enter the following information and then click **OK**:
  - **Name**: test-vm-1
  - **User name**: AdminTestUser
  - **Password**: AzS-TestVM01
  - **Subscription**: Accept the Default Provider Subscription
  - **Resource group**: test-vm-rg
  - **Location**: local

4. In the **Choose a size** blade, click **A1 Standard**, and then click **Select**.  

5. In the **Settings** blade, accept the defaults and click **OK**

6. In the **Summary** blade, click **OK** to create the virtual machine.  
> [!NOTE]
> The virtual machine deployment takes a few minutes to complete.

7. To view to the new VM, click **Virtual machines**, then search for **test-vm-1** and click its name.
    ![First test VM image displayed](media/asdk-marketplace-item/first-test-vm.png)

## Clean up resources
After you have successfully signed in to the VM, and verified that the test image is working properly, you should delete the test resource group. This will free up limited resources available to single-node ASDK installations.

When no longer needed, delete the resource group, VM, and all related resources by following these steps:

1. Sign in to the [ASDK admin portal](https://adminportal.local.azurestack.external).
2. Click **Resource groups** > **test-vm-rg** > **Delete resource group**.
3. Type **test-vm-rg** as the resource group name and then click **Delete**.

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Add a Windows Server VM Azure Stack marketplace item
> * Verify the VM image is available 
> * Test the VM image

Advance to the next tutorial to learn how to create an Azure Stack offer and plan.

> [!div class="nextstepaction"]
> [Offer Azure Stack IaaS services](asdk-offer-services.md)