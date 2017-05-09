---
title: Adding a VM image to Azure Stack | Microsoft Docs
description: Add your organization's custom Windows or Linux VM image for tenants to use
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
ms.date: 04/21/2017
ms.author: sngun

---
# Make a custom virtual machine image available in Azure Stack
Azure Stack enables administrators to make VM images, such as their
organization’s custom VHD, available to their tenants. Images can
be referenced by Azure Resource Manager templates or added to the
Azure Marketplace UI with the creation of a Marketplace item. A Windows
Server 2012 R2 image is included by default in the Azure Stack Technical
Preview.

> [!NOTE]
> VM images with Marketplace items can be deployed by selecting **New** in the UI, and then selecting the **Virtual Machines** category. The VM image items are listed.
> 
> 

## Add a VM image to Marketplace with PowerShell
If the VM image VHD is available locally on the console VM (or another externally connected device), use the following steps:

1. Prepare a Windows or Linux operating system virtual hard disk image in VHD format (not VHDX).
   
   * For Windows images, the article [Upload a Windows VM image to Azure for Resource Manager deployments](../virtual-machines/windows/upload-image.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) contains image preparation instructions in the **Prepare the VHD for upload** section.
   * For Linux images, follow the steps to
     prepare the image or use an existing Azure Stack Linux image as described in
     the article [Deploy Linux virtual machines on Azure
     Stack](azure-stack-linux.md).
2. [Download Azure Stack tools from GitHub](azure-stack-powershell-download.md) and then import the Connect and ComputeAdmin modules:
   
   ```powershell
   Import-Module .\Connect\AzureStack.Connect.psm1
   Import-Module .\ComputeAdmin\AzureStack.ComputeAdmin.psm1
   ``` 

3. Create the Azure Stack administrator's AzureRM environment by using the following cmdlet:
   ```powershell
   Add-AzureStackAzureRmEnvironment -Name "AzureStackAdmin" -ArmEndpoint "https://adminmanagement.local.azurestack.external" 
   ```

4. Get the GUID value of the Active Directory(AD) tenant that is used to deploy the Azure Stack. If your Azure Stack environment is deployed by using:  

    a. **Azure Active Directory**, use the following cmdlet:
    
    ```PowerShell
    $TenantID = Get-DirectoryTenantID -AADTenantName "<myaadtenant>.onmicrosoft.com" -EnvironmentName AzureStackAdmin
    ```
    b. **Active Directory Federation Services**, use the following cmdlet:
    
    ```PowerShell
    $TenantID = Get-DirectoryTenantID -ADFS -EnvironmentName AzureStackAdmin 
    ```

5. Add the VM image by invoking the **Add-VMImage** cmdlet. In the Add-VMImage cmdlet, specify the osType as Windows or Linux. Include the publisher, offer, SKU, and version for the VM image. These parameters are used by Azure Resource Manager templates that reference the VM image. Following is an example invocation of the script:
     
     ```powershell
     # Store the service administrator account credentials in a variable 
     $UserName='<Username of the service administrator account>'
     $Password='<Admin password provided when deploying Azure Stack>'|ConvertTo-SecureString -Force -AsPlainText
     $Credential=New-Object PSCredential($UserName,$Password)

     Add-VMImage -publisher "Canonical" -offer "UbuntuServer" -sku "14.04.3-LTS" -version "1.0.0" -osType Linux -osDiskLocalPath 'C:\Users\AzureStackAdmin\Desktop\UbuntuServer.vhd' -TenantId $TenantID -EnvironmentName "AzureStackAdmin" -azureStackCredentials $Credential
     ```

The command does the following:

* Authenticates to the Azure Stack environment
* Uploads the local VHD to a newly created temporary storage account
* Adds the VM image to the VM image repository
* Creates a Marketplace item

To verify that the command ran successfully, go to Marketplace in the portal, and then verify that the VM image is available in the **Virtual Machines** category.

> ![VM image added successfully](./media/azure-stack-add-vm-image/image5.PNG)
> 
> 

Following is a description of the command parameters.

| Parameter | Description |
| --- | --- |
| **tenantID** |Your Azure Active Directory tenant ID in the form *&lt;AADTenantID*.onmicrosoft.com&gt;. |
| **publisher** |The publisher name segment of the VM Image that tenants use when deploying the image. An example is ‘Microsoft’. Do not include a space or other special characters in this field. |
| **offer** |The offer name segment of the VM Image that tenants use when deploying the VM image. An example is ‘WindowsServer’. Do not include a space or other special characters in this field. |
| **sku** |The SKU name segment of the VM Image that tenants use when deploying the VM image. An example is ‘Datacenter2016’. Do not include a space or other special characters in this field. |
| **version** |The version of the VM Image that tenants use when deploying the VM image. This version is in the format *\#.\#.\#*. An example is ‘1.0.0’. Do not include a space or other special characters in this field. |
| **osType** |The osType of the image must be either ‘Windows’ or ‘Linux’. |
| **osDiskLocalPath** |The local path to the OS disk VHD that you are uploading as a VM image to Azure Stack. |
| **dataDiskLocalPaths** |An optional array of the local paths for data disks that can be uploaded as part of the VM image. |
| **CreateGalleryItem** |A Boolean flag that determines whether to create an item in Marketplace. The default is set to true. |
| **title** |The display name of Marketplace item. The default is set to be the Publisher-Offer-Sku of the VM image. |
| **description** |The description of the Marketplace item. |
| **EnvironmentName** |The Azure Stack administrtor's PowerShell environment name. |
| **azureStackCredentials** |The credentials provided during deployment that are used to login to the Azure Stack Administrator portal. |
| **location** |The location to which the VM image should be published. By default, this value is set to local.|
| **osDiskBlobURI** |Optionally, this script also accepts a Blob storage URI for osDisk. |
| **dataDiskBlobURIs** |Optionally, this script also accepts an array of Blob storage URIs for adding data disks to the image. |

## Add a VM image through the portal
> [!NOTE]
> This method requires creating the Marketplace item separately.
> 
> 

One requirement of images is that they can be referenced by a Blob
    storage URI. Prepare a Windows or Linux operating system
    virtual hard disk image in VHD format (not VHDX), and then upload the
    image to a storage account in Azure or in Azure Stack. If your image
    is already uploaded to Blob storage in Azure or Azure Stack, you can
    skip this step.

Follow the steps from [Upload a Windows VM image to Azure for
    Resource Manager
    deployments](https://azure.microsoft.com/documentation/articles/virtual-machines-windows-upload-image/) article
    through the step **Upload the VM image to your storage
    account**. Keep in mind the following:

* For a Linux image, follow the instructions to
  prepare the image, or use an existing Azure Stack Linux image as described in the article [Deploy Linux virtual machines on Azure Stack](azure-stack-linux.md).
* It's more efficient to upload an image to Azure Stack Blob storage than to Azure Blob storage because it takes less time to push the VM image to the
  Azure Stack image repository. While following the upload instructions, make sure to substitute the [Authenticate PowerShell with Microsoft Azure
  Stack](azure-stack-deploy-template-powershell.md)
  step for the ‘Login to Azure’ step.
* Make a note of the Blob storage URI where you upload the image. It has the following format:
  *&lt;storageAccount&gt;/&lt;blobContainer&gt;/&lt;targetVHDName&gt;*.vhd

To make the blob anonymously accessible, go to the storage account blob container where the VM image VHD was uploaded to **Blob,** and then select **Access Policy**. If you want, you can instead generate a shared access signature for the container and include it as part of the blob URI.

![Navigate to storage account blobs](./media/azure-stack-add-vm-image/image1.png)

![Set blob access to public](./media/azure-stack-add-vm-image/image2.png)

1. Sign in to Azure Stack as an administrator. Go to **Region
   Management**. Then, under **RPs**, select  **Compute Resource Provider** > **VM Images** > **Add.**
   
   ![Start to add an image](./media/azure-stack-add-vm-image/image3.png)
2. On the following blade, enter the publisher, offer, SKU, and version
   of the VM image. These name segments refer to the VM
   image in Azure Resource Manager templates. Make sure to select the
   **osType** correctly. For **osDiskBlobURI**, enter the URI where the
   image was uploaded in step 1. Click **Create** to begin creating the
   VM Image.
   
   ![Begin to create the image](./media/azure-stack-add-vm-image/image4.png)
3. The VM Image status changes to ‘Succeeded’ when the image is
   successfully added.
4. Tenants can deploy the VM Image by specifying the
   publisher, offer, SKU, and version of the VM image in an Azure
   Resource Manager template. To make the VM image
   more readily available for tenant consumption in the UI, it is best
   to [create a
   Marketplace item](azure-stack-create-and-publish-marketplace-item.md).