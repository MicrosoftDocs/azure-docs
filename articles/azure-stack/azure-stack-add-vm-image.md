---
title: Add a VM image to Azure Stack | Microsoft Docs
description: Add your organization's custom Windows or Linux VM image for tenants to use.
services: azure-stack
documentationcenter: ''
author: SnehaGunda
manager: byronr
editor: ''

ms.assetid: e5a4236b-1b32-4ee6-9aaa-fcde297a020f
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 09/25/2017
ms.author: sngun

---
# Make a custom virtual machine image available in Azure Stack

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

In Azure Stack, operators can make custom virtual machine images available to their users. These images can be referenced by Azure Resource Manager templates, or you can add them to the Azure Marketplace UI as a Marketplace item. 

## Add a VM image to Marketplace by using PowerShell

Run the following prerequisites, either from the [development kit](azure-stack-connect-azure-stack.md#connect-to-azure-stack-with-remote-desktop) or from a Windows-based external client, if you are [connected through VPN](azure-stack-connect-azure-stack.md#connect-to-azure-stack-with-vpn):

1. [Install PowerShell for Azure Stack](azure-stack-powershell-install.md).  

2. Download the [tools required to work with Azure Stack](azure-stack-powershell-download.md).  

3. Prepare a Windows or Linux operating system virtual hard disk image in VHD format (don't use VHDX format).
   
   * For Windows images, for instructions on preparing the image, see [Upload a Windows VM image to Azure for Resource Manager deployments](../virtual-machines/windows/upload-generalized-managed.md).
   * For Linux images, see [Deploy Linux virtual machines on Azure Stack](azure-stack-linux.md). Complete the steps to prepare the image or use an existing Azure Stack Linux image as described in the article.  

To add the image to the Azure Stack Marketplace, complete the following steps:

1. Import the Connect and ComputeAdmin modules:
   
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
          -EnvironmentName AzureStackAdmin 

        Login-AzureRmAccount `
          -EnvironmentName "AzureStackAdmin" `
          -TenantId $TenantID 
        ```
    
3. Add the VM image by invoking the `Add-AzsVMImage` cmdlet. In the `Add-AzsVMImage` cmdlet, specify `osType` as Windows or Linux. Include the publisher, offer, SKU, and version for the VM image. For information about allowed parameters, see [Parameters](#parameters). The parameters are used by Azure Resource Manager templates to reference the VM image. The following example invokes the script:
     
  ```powershell
  Add-AzsVMImage `
    -publisher "Canonical" `
    -offer "UbuntuServer" `
    -sku "14.04.3-LTS" `
    -version "1.0.0" `
    -osType Linux `
    -osDiskLocalPath 'C:\Users\AzureStackAdmin\Desktop\UbuntuServer.vhd' `
  ```

The command does the following:

* Authenticates to the Azure Stack environment.
* Uploads the local VHD to a newly created temporary storage account.
* Adds the VM image to the VM image repository.
* Creates a Marketplace item.

To verify that the command ran successfully, in the portal, go to the Marketplace. Verify that the VM image is available in the **Virtual Machines** category.

![VM image added successfully](./media/azure-stack-add-vm-image/image5.PNG) 

## Remove a VM image by using PowerShell

When you no longer need the virtual machine image that you uploaded, you can delete it from the Marketplace by using the following cmdlet:

```powershell
Remove-AzsVMImage `
  -publisher "Canonical" `
  -offer "UbuntuServer" `
  -sku "14.04.3-LTS" `
  -version "1.0.0" `
```

## Parameters

| Parameter | Description |
| --- | --- |
| **publisher** |The publisher name segment of the VM image that users use when they deploy the image. An example is **Microsoft**. Do not include a space or other special characters in this field. |
| **offer** |The offer name segment of the VM image that users use when they deploy the VM image. An example is **WindowsServer**. Do not include a space or other special characters in this field. |
| **sku** |The SKU name segment of the VM Image that users use when they deploy the VM image. An example is **Datacenter2016**. Do not include a space or other special characters in this field. |
| **version** |The version of the VM Image that users use when they deploy the VM image. This version is in the format *\#.\#.\#*. An example is **1.0.0**. Do not include a space or other special characters in this field. |
| **osType** |The osType of the image must be either **Windows** or **Linux**. |
| **osDiskLocalPath** |The local path to the OS disk VHD that you are uploading as a VM image to Azure Stack. |
| **dataDiskLocalPaths** |An optional array of the local paths for data disks that can be uploaded as part of the VM image. |
| **CreateGalleryItem** |A Boolean flag that determines whether to create an item in Marketplace. By default, it is set to **true**. |
| **title** |The display name of Marketplace item. By default, it is set to the `Publisher-Offer-Sku` value of the VM image. |
| **description** |The description of the Marketplace item. |
| **location** |The location where the VM image should be published. By default, this value is set to **local**.|
| **osDiskBlobURI** |(Optional) This script also accepts a Blob storage URI for `osDisk`. |
| **dataDiskBlobURIs** |(Optional) This script also accepts an array of Blob storage URIs for adding data disks to the image. |

## Add a VM image through the portal

> [!NOTE]
> With this method, you must create the Marketplace item separately.

Images must be able to be referenced by a Blob storage URI. Prepare a Windows or Linux operating system image in VHD format (not VHDX), and then upload the image to a storage account in Azure or Azure Stack. If your image is already uploaded to the Blob storage in Azure or Azure Stack, you can skip step 1.

1. [Upload a Windows VM image to Azure for Resource Manager deployments](https://azure.microsoft.com/documentation/articles/virtual-machines-windows-upload-image/) or, for a Linux image, follow the instructions described in [Deploy Linux virtual machines on Azure Stack](azure-stack-linux.md). Before you upload the image, it's important to consider the following factors:

   * It's more efficient to upload an image to Azure Stack Blob storage than to Azure Blob storage because it takes less time to push the image to the Azure Stack image repository. 
   
   * When you upload the [Windows VM image](https://azure.microsoft.com/documentation/articles/virtual-machines-windows-upload-image/), make sure to substitute the **Login to Azure** step with the [Configure the Azure Stack operator's PowerShell environment](azure-stack-powershell-configure-admin.md) step.  

   * Make a note of the Blob storage URI where you upload the image. The Blob storage URI has the following format:
  *&lt;storageAccount&gt;/&lt;blobContainer&gt;/&lt;targetVHDName&gt;*.vhd.

   * To make the blob anonymously accessible, go to the storage account blob container where the VM image VHD was uploaded. Select **Blob**, and then select **Access Policy**. Optionally, you can instead generate a shared access signature for the container, and include it as part of the blob URI.

   ![Go to storage account blobs](./media/azure-stack-add-vm-image/image1.png)

   ![Set blob access to public](./media/azure-stack-add-vm-image/image2.png)

2. Sign in to Azure Stack as operator. In the menu, select **More services** > **Resource Providers**. Then, select  **Compute** > **VM images** > **Add**.

3. Under **Add a VM Image**, enter the publisher, offer, SKU, and version of the virtual machine image. These name segments refer to the VM   image in Resource Manager templates. Make sure to select the **osType** value correctly. For **OD Disk Blob URI**, enter the Blob URI where the    image was uploaded. Then, select **Create** to begin creating the VM Image.
   
   ![Begin to create the image](./media/azure-stack-add-vm-image/image4.png)

   When the image is successfully created, the VM image status changes to **Succeeded**.

4. To make the virtual machine image more readily available for user consumption in the UI, it's a good idea to [create a Marketplace item](azure-stack-create-and-publish-marketplace-item.md).

## Next steps

[Provision a virtual machine](azure-stack-provision-vm.md)