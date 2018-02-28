---
title: Add an Azure Stack marketplace item | Microsoft Docs
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
ms.date: 03/09/2018
ms.author: jeffgilb
ms.reviewer: misainat
---

# Add an Azure Stack marketplace item 

By default, no Virtual Machine (VM) images are available in the Azure Stack Marketplace. An Azure Stack operator must add an image to the Marketplace for users to access. You can add the Windows Server 2016 VM image to the Azure Stack Marketplace by following this tutorial.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Add a Windows Server 2016 VM image
> * Verify the VM image is available 
> * Test the VM image


## Prerequisites

To complete this tutorial:

- Install the [Azure Stack-compatible Azure PowerShell modules](asdk-post-deploy.md#install-azure-stack-powershell)
- Download the [Azure Stack tools](asdk-post-deploy.md#download-the-azure-stack-tools)
- [Register the ASDK](asdk-register.md) with your Azure subscription.
- Download the [Windows Server 2106 virtual machine ISO image](https://www.microsoft.com/en-us/evalcenter/evaluate-windows-server-2016) from the Windows Server Evaluations page
- Deploy Azure Stack and then sign in to the [ASDK administration portal](https://adminportal.local.azurestack.external)

## Add a Windows Server VM image
You can add the Windows Server 2016 image to the Azure Stack Marketplace by using one of the following methods:
- Download the image from the Azure Marketplace. Use this option if you are operating in a connected scenario and you have registered your Azure Stack instance with Azure.
- Add a previously downloaded ISO image by using PowerShell. Use this option if you have deployed Azure Stack in a disconnected scenario or in scenarios with limited connectivity.

### Add a Windows Server 2016 VM image from the Azure Marketplace
Use this option if you are operating in a connected scenario and you have [registered your Azure Stack instance](asdk-register.md) with Azure.

1. Sign in to the [ASDK admin portal](https://adminportal.local.azurestack.external).

2. Select **More services** > **Marketplace Management** > **Add from Azure**. 

   ![Add from Azure](media/asdk-marketplace-item/azs-marketplace.png)

3. Find or search for the **Windows Server 2016 Datacenter** image.

4. Select the **Windows Server 2016 Datacenter** image and then select **Download**.

   ![Download image from Azure](media/asdk-marketplace-item/azure-marketplace-ws2016.png)


> [!NOTE]
> It takes approximately an hour to publish the image to the Azure Stack Marketplace. 

When the download is finished, the image is available under **Marketplace Management**. The image also is available under **Compute** to create new virtual machines.


### Add a Windows Server 2016 VM image from a local source
Use this option if you have deployed Azure Stack in a disconnected scenario or in scenarios with limited connectivity.

1. Before you begin, you will need to import the Azure Stack `Connect` and `ComputeAdmin` PowerShell modules included in the Azure Stack tools directory by using the following commands:

   ```powershell
   Set-ExecutionPolicy RemoteSigned

   # Import the Connect and ComputeAdmin modules.   
   Import-Module .\Connect\AzureStack.Connect.psm1
   Import-Module .\ComputeAdmin\AzureStack.ComputeAdmin.psm1

   ```

2. Run one of the following scripts on to your ASDK host computer depending on whether you deployed your Azure Stack environment by using Azure Active Directory (Azure AD) or Active Directory Federation Services (AD FS):

  - Commands for **Azure AD deployments**: 

      ```PowerShell
      # To get this value for Azure Stack integrated systems, contact your service provider.
      $ArmEndpoint = "https://adminmanagement.local.azurestack.external"

      # To get this value for Azure Stack integrated systems, contact your service provider.
      $GraphAudience = "https://graph.windows.net/"
      
      # Create the Azure Stack operator's Azure Resource Manager environment by using the following cmdlet:
      Add-AzureRMEnvironment `
        -Name "AzureStackAdmin" `
        -ArmEndpoint $ArmEndpoint

      Set-AzureRmEnvironment `
        -Name "AzureStackAdmin" `
        -GraphAudience $GraphAudience

      $TenantID = Get-AzsDirectoryTenantId `
      # Replace the AADTenantName value to reflect your Azure AD tenant name.
        -AADTenantName "<myDirectoryTenantName>.onmicrosoft.com" `
        -EnvironmentName AzureStackAdmin

      Login-AzureRmAccount `
        -EnvironmentName "AzureStackAdmin" `
        -TenantId $TenantID 
      ```

  - Commands for **AD FS deployments**:
      
      ```PowerShell
      # To get this value for Azure Stack integrated systems, contact your service provider.
      $ArmEndpoint = "https://adminmanagement.local.azurestack.external"

      # To get this value for Azure Stack integrated systems, contact your service provider.
      $GraphAudience = "https://graph.local.azurestack.external/"

      # Create the Azure Stack operator's Azure Resource Manager environment by using the following cmdlet:
      Add-AzureRMEnvironment `
        -Name "AzureStackAdmin" `
        -ArmEndpoint $ArmEndpoint

      Set-AzureRmEnvironment `
        -Name "AzureStackAdmin" `
        -GraphAudience $GraphAudience `
        -EnableAdfsAuthentication:$true

      $TenantID = Get-AzsDirectoryTenantId `
      -ADFS `
      -EnvironmentName "AzureStackAdmin" 

      Login-AzureRmAccount `
        -EnvironmentName "AzureStackAdmin" `
        -TenantId $TenantID 
      ```
   
3. Add the Windows Server 2016 image to the Azure Stack Marketplace. (Replace *fully_qualified_path_to_ISO* with the path to the Windows Server 2016 ISO that you downloaded.)

    ```PowerShell
    $ISOPath = "<fully_qualified_path_to_ISO>"

    # Add a Windows Server 2016 Evaluation VM image.
    New-AzsServer2016VMImage `
      -ISOPath $ISOPath

    ```



## Verify the VM is available
Use these steps to verify that the new VM image is available in the Azure Stack marketplace.

1. Sign in to the [ASDK admin portal](https://adminportal.local.azurestack.external).

2. Select **More services** > **Marketplace Management**. 

3. Verify that the Windows Server 2016 Datacenter VM image has been added successfully.

   ![Downloaded image from Azure](media/asdk-marketplace-item/azs-marketplace-ws2016.png)

## Test the VM image
As an Azure Stack operator, you can use the [administrator portal](https://adminportal.local.azurestack.external) to create a test virtual machine to validate the image has been made available successfully. 

1. Sign in to the [ASDK admin portal](https://adminportal.local.azurestack.external).

2. Click **New** > **Compute** > **Windows Server 2016 Datacenter** > **Create**.  
 ![Create VM from marketplace image](media/asdk-marketplace-item/new-compute.png)

3. In the **Basics** blade, type a **Name**, **User name**, and **Password**. Choose a **Subscription**. Create a **Resource group**, or select an existing one, and then click **OK**.  

4. In the **Choose a size** blade, click **A1 Standard**, and then click **Select**.  

5. In the **Settings** blade, accept the defaults and click **OK**

6. In the **Summary** blade, click **OK** to create the virtual machine.  
> [!NOTE]
> The virtual machine deployment takes a few minutes to complete.

7. To see your new virtual machine, click **Virtual machines**, then search for the virtual machine and click its name.
    ![First test VM image displayed](media/asdk-marketplace-item/first-test-vm.png)



## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Add a Windows Server 2016 VM image
> * Verify the VM image is available 
> * Test the VM image

Advance to the next tutorial to learn how to create an Azure Stack offer and plan.

> [!div class="nextstepaction"]
> [Offer Azure Stack IaaS services](asdk-offer-services.md)