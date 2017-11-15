---
title: Add the default VM image to the Azure Stack Marketplace | Microsoft Docs
description: Add the Windows Server 2016 VM default image to the Azure Stack Marketplace.
services: azure-stack
documentationcenter: ''
author: SnehaGunda
manager: byronr
editor: ''

ms.assetid:
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 07/10/2017
ms.author: sngun

---
# Add the Windows Server 2016 VM image to the Azure Stack Marketplace

By default, no virtual machine images are available in the Azure Stack Marketplace. An Azure Stack operator must add an image to the Marketplace for users to access. You can add the Windows Server 2016 image to the Azure Stack Marketplace by using one of the following methods:

* [Download the image from the Azure Marketplace](#add-the-image-by-downloading-it-from-the-azure-marketplace). Use this option if you are operating in a connected scenario and you have registered your Azure Stack instance with Azure.

* [Add the image by using PowerShell](#add-the-image-by-using-powershell). Use this option if you have deployed Azure Stack in a disconnected scenario, or in scenarios with limited connectivity.

## Add the image by downloading it from the Azure Marketplace

1. Deploy Azure Stack, and then sign in to your Azure Stack Development Kit.

2. Select **More services** > **Marketplace Management** > **Add from Azure**. 

3. Find or search for the **Windows Server 2016 Datacenter – Eval** image, and then select **Download**.

   ![Download image from Azure](media/azure-stack-add-default-image/download-image.png)

When the download is finished, the image is available under **Marketplace Management**. The image also is available under **Virtual Machines**.

## Add the image by using PowerShell

### Prerequisites 

Run the following prerequisites, either from the [development kit](azure-stack-connect-azure-stack.md#connect-to-azure-stack-with-remote-desktop) or from a Windows-based external client, if you are [connected through VPN](azure-stack-connect-azure-stack.md#connect-to-azure-stack-with-vpn):

1. Install [Azure Stack-compatible Azure PowerShell modules](azure-stack-powershell-install.md).  

2. Download the [tools required to work with Azure Stack](azure-stack-powershell-download.md).  

3. On the Windows Server Evaluations page, [download the Windows Server 2016 evaluation](https://www.microsoft.com/en-us/evalcenter/evaluate-windows-server-2016). When prompted, select the ISO version of the download. Record the path to the download location, which is used later in the steps described in this article. This step requires internet connectivity.  

### Add the image to the Azure Stack Marketplace
   
1. Import the Azure Stack Connect and ComputeAdmin modules by using the following commands:

   ```powershell
   Set-ExecutionPolicy RemoteSigned

   # Import the Connect and ComputeAdmin modules.   
   Import-Module .\Connect\AzureStack.Connect.psm1
   Import-Module .\ComputeAdmin\AzureStack.ComputeAdmin.psm1

   ```

2. Sign in to your Azure Stack environment. Run one of the following scripts, depending on whether you deployed your Azure Stack environment by using Azure Active Directory (Azure AD) or Active Directory Federation Services (AD FS). (Replace the Azure AD `tenantName`, `GraphAudience` endpoint, and `ArmEndpoint` values to reflect your environment configuration.)  

   * **Azure Active Directory**. Use the following cmdlet:

    ```PowerShell
    # For Azure Stack Development Kit, this value is set to https://adminmanagement.local.azurestack.external. To get this value for Azure Stack integrated systems, contact your service provider.
    $ArmEndpoint = "<Resource Manager endpoint for your environment>"

    # For Azure Stack Development Kit, this value is set to https://graph.windows.net/. To get this value for Azure Stack integrated systems, contact your service provider.
    $GraphAudience = "<GraphAuidence endpoint for your environment>"
    
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

    Login-AzureRmAccount `
      -EnvironmentName "AzureStackAdmin" `
      -TenantId $TenantID 
    ```

   * **Active Directory Federation Services**. Use the following cmdlet:
    
    ```PowerShell
    # For Azure Stack Development Kit, this value is set to https://adminmanagement.local.azurestack.external. To get this value for Azure Stack integrated systems, contact your service provider.
    $ArmEndpoint = "<Resource Manager endpoint for your environment>"

    # For Azure Stack Development Kit, this value is set to https://graph.local.azurestack.external/. To get this value for Azure Stack integrated systems, contact your service provider.
    $GraphAudience = "<GraphAuidence endpoint for your environment>"

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

To ensure that the Windows Server 2016 VM image has the latest cumulative update, include the `IncludeLatestCU` parameter when you run the `New-AzsServer2016VMImage` cmdlet. For information about allowed parameters for the `New-AzsServer2016VMImage` cmdlet, see [Parameters](#parameters). It takes approximately an hour to publish the image to the Azure Stack Marketplace. 

## Parameters

|New-AzsServer2016VMImage parameters|Required?|Description|
|-----|-----|------|
|ISOPath|Yes|The fully qualified path to the downloaded Windows Server 2016 ISO.|
|Net35|No|Installs the .NET 3.5 runtime on the Windows Server 2016 image. By default, this value is set to **true**.|
|Version|No|Specifies **Core**, **Full**, or **Both** Windows Server 2016 images. By default, this value is set to **Full**.|
|VHDSizeInMB|No|Sets the size (in MB) of the VHD image to be added to your Azure Stack environment. By default, this value is set to 40,960 MB.|
|CreateGalleryItem|No|Specifies whether a Marketplace item should be created for the Windows Server 2016 image. By default, this value is set to **true**.|
|location |No |Specifies the location to which the Windows Server 2016 image should be published.|
|IncludeLatestCU|No|Applies the latest Windows Server 2016 cumulative update to the new VHD.|
|CUUri |No |Sets the Windows Server 2016 cumulative update to run from a specific URI. |
|CUPath |No |Sets the Windows Server 2016 cumulative update to run from a local path. This option is helpful if you have deployed the Azure Stack instance in a disconnected environment.|

## Next steps

[Provision a virtual machine](azure-stack-provision-vm.md)
