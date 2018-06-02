---
title: Add an Azure Stack marketplace item from a local source| Microsoft Docs
description: Describes how to add a local operating system image to the Azure Stack Marketplace.
services: azure-stack
documentationcenter: ''
author: jeffgilb
manager: femila
editor: ''

ms.assetid: 
ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: PowerShell
ms.topic: tutorial
ms.custom: mvc
ms.date: 04/20/2018
ms.author: jeffgilb
ms.reviewer: misainat
---

# Tutorial: add an Azure Stack marketplace item from a local source

As an Azure Stack Operator, the first thing you need to do to enable users to deploy a Virtual Machine (VM) is to add a VM image to the Azure Stack marketplace. By default, nothing is published to the Azure Stack marketplace, but you can upload VM ISO images to make them available to your users. Use this option if you have deployed Azure Stack in a disconnected scenario or in scenarios with limited connectivity.

In this tutorial, you download a Windows Server 2016 VM image from the the Windows Server Evaluations page and upload it to the Azure Stack marketplace.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Add a Windows Server 2016 VM image
> * Verify the VM image is available 
> * Test the VM image

## Prerequisites

To complete this tutorial:

- Install the [Azure Stack-compatible Azure PowerShell modules](asdk-post-deploy.md#install-azure-stack-powershell)
- Download the [Azure Stack tools](asdk-post-deploy.md#download-the-azure-stack-tools)
- Download the [Windows Server 2106 virtual machine ISO image](https://www.microsoft.com/en-us/evalcenter/evaluate-windows-server-2016) from the Windows Server Evaluations page

## Add a Windows Server VM image
You can publish the Windows Server 2016 image to the Azure Stack marketplace by adding a previously downloaded ISO image using PowerShell. 

Use this option if you have deployed Azure Stack in a disconnected scenario or in scenarios with limited connectivity.

1. [Install PowerShell for Azure Stack](../azure-stack-powershell-install.md).

  ```PowerShell  
    # Create the Azure Stack operator's Azure Resource Manager environment by using the following cmdlet:
    Add-AzureRMEnvironment `
      -Name "AzureStackAdmin" `
      -ArmEndpoint $ArmEndpoint

    Set-AzureRmEnvironment `
      -Name "AzureStackAdmin" `
      -GraphAudience $GraphAudience

    $TenantID = Get-AzsDirectoryTenantId `
      -AADTenantName "<myDirectoryTenantName>.onmicrosoft.com" `
      -EnvironmentName AzureStackAdmin

    Add-AzureRmAccount `
      -EnvironmentName "AzureStackAdmin" `
      -TenantId $TenantID
  ```

2. If using **Active Directory Federation Services**, use the following cmdlet:

  ```PowerShell
  # For Azure Stack Development Kit, this value is set to https://adminmanagement.local.azurestack.external. To get this value for Azure Stack integrated systems, contact your service provider.
  $ArmEndpoint = "<Resource Manager endpoint for your environment>"

  # For Azure Stack Development Kit, this value is set to https://graph.local.azurestack.external/. To get this value for Azure Stack integrated systems, contact your service provider.
  $GraphAudience = "<GraphAuidence endpoint for your environment>"

  # Create the Azure Stack operator's Azure Resource Manager environment by using the following cmdlet:
  Add-AzureRMEnvironment `
    -Name "AzureStackAdmin" `
    -ArmEndpoint $ArmEndpoint
    ```

3. Sign in to Azure Stack as an operator. For instructions, see [Sign in to Azure Stack as an operator](../azure-stack-powershell-configure-admin.md).

   ````PowerShell  
    Add-AzureRmAccount `
      -EnvironmentName "AzureStackAdmin" `
      -TenantId $TenantID
  ````

4. Add the Windows Server 2016 image to the Azure Stack marketplace.

    The **Add-AzsPlatformimage** cmdlet used to add the image specifies values used by the Azure Resource Manager templates to reference the VM image.
    
    The values include:
    
  - **publisher**  
    For example: `Microsoft`  
    The publisher name segment of the VM image that users use when they deploy the image. An example is **Microsoft**. Do not include a space or other special characters in this field.  
  - **offer**  
    For example: `WindowsServer`  
    The offer name segment of the VM image that users use when they deploy the VM image. An example is **WindowsServer**. Do not include a space or other special characters in this field.  
  - **sku**  
    For example: `Datacenter2016`  
    The SKU name segment of the VM Image that users use when they deploy the VM image. An example is **Datacenter2016**. Do not include a space or other special characters in this field.  
  - **version**  
    For example: `1.0.0`  
    The version of the VM Image that users use when they deploy the VM image. This version is in the format *\#.\#.\#*. An example is **1.0.0**. Do not include a space or other special characters in this field.  
  - **osType**  
    For example: `Windows`  
    The osType of the image must be either **Windows** or **Linux**. Replace *fully_qualified_path_to_ISO* with the path to the Windows Server 2016 ISO that you downloaded. 
  - **OSUri**  
    For example: `https://storageaccount.blob.core.windows.net/vhds/Ubuntu1404.vhd`  
    You can specify a blob storage URI for an `osDisk`. In his case, you will specify the location where you stored the image that you downloaded.

    For more information, see the PowerShell reference for the [Add-AzsPlatformimage](https://docs.microsoft.com/powershell/module/azs.compute.admin/add-azsplatformimage) cmdlet.

    Open PowerShell with an elevated prompt, and run:

      ````PowerShell  
        Add-AzsPlatformimage -publisher "Microsoft" -offer "WindowsServer" -sku "Datacenter2016" -version "1.0.0” -OSType "Windows" -OSUri "<fully_qualified_path_to_ISO>"
      ````  

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
> * Add a Windows Server 2016 VM image
> * Verify the VM image is available 
> * Test the VM image

Advance to the next tutorial to learn how to create an Azure Stack offer and plan.

> [!div class="nextstepaction"]
> [Offer Azure Stack IaaS services](asdk-offer-services.md)
