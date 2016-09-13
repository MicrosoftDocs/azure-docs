<properties
	pageTitle="Adding a VM Image to Azure Stack | Microsoft Azure"
	description="Add your organization's custom Windows or Linux VM image for tenants to use"
	services="azure-stack"
	documentationCenter=""
	authors="mattmcg"
	manager="byronr"
	editor=""/>

<tags
	ms.service="azure-stack"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="09/01/2016"
	ms.author="mattmcg"/>

#Making a custom Virtual Machine image available in Azure Stack


Azure Stack allows administrators to make VM images, like their
organization’s custom VHD, available to their tenants. Added images can
be referenced by Azure Resource Manager templates or added into the
marketplace UI with the creation of a Marketplace item. A Windows
Server 2012 R2 image is included by default in the Azure Stack Technical
Preview. 

> [AZURE.NOTE] VM images with Marketplace items can be deployed by selecting **New** in the UI and then selecting the item from those listed in the **Virtual Machines** category. 



##Add a VM image available in the Marketplace with PowerShell

If the VM image VHD is available locally on the Console VM (or another externally connected device) and you wish to create an item in the Marketplace, follow the below steps: 

1. To begin, prepare a Windows or Linux operating system virtual hard disk image in VHD format (not VHDX). 
    -   If you are uploading a Windows VM image, the article [*Upload a Windows VM image to Azure for Resource Manager deployments*](https://azure.microsoft.com/en-us/documentation/articles/virtual-machines-windows-upload-image/) contains image preparation instructions in the **Prepare the VHD for      upload** section.
    -   If you are uploading a Linux image, follow the instructions to
        prepare the image or use an existing Azure Stack Linux image in
        the [Deploy Linux virtual machines on Azure
        Stack](https://azure.microsoft.com/en-us/documentation/articles/azure-stack-linux/)
        article
2. Clone the [*Azure Stack Tools repository*](https://aka.ms/azurestackaddvmimage) and navigate to the AddVMImage folder.
3. Open PowerShell and in the AddVMImage directory execute:

	```powershell
	Import-Module .\Add-VMImage.psm1
	```

4. Add the VM image by invoking the Add-VMImage cmdlet.  
	-  Include the Publisher, Offer, Sku, and Version for the VM image. These parameters are used by Azure Resource Manager templates that reference the VM image. 
	-  Specify the osType as Windows or Linux
	-  Include your Azure Active Directory Tenant ID in the form &lt;myaadtenant&gt;.onmicrosoft.com
	- An example invocation of the script is the following:
	```powershell
	Add-VMImage -publisher "Canonical" -offer "UbuntuServer" -sku "14.04.3-LTS" -version "1.0.0" -osType Linux -osDiskLocalPath 'C:\Users\AzureStackAdmin\Desktop\UbuntuServer.vhd' -tenantID <myaadtenant>.onmicrosoft.com 
	```

	> [AZURE.NOTE] The cmdlet will request credentials for adding the VM image. Provide the administrator AAD credentials, like serviceadmin@&lt;myaadtenant&gt;.onmicrosoft.com, to the prompt.  

5. The command will authenticate to your Azure Stack environment, upload the local VHD to a newly created temporary storage account, add the VM image into the VM image repository, and create a Marketplace item for the VM image. To verify that the command ran successfully, navigate to the Marketplace in the portal and verify that the VM image is available in the Virtual Machines category.

> ![VM image added successfully](/articles/azure-stack/media/azure-stack-add-vm-image/image5.png)

A description of command parameters is below:


| Parameter | Description |
|----------| ------------ |
|**tenantID** | This your Azure Active Directory tenant ID in the form &lt;AADTenantID.onmicrosoft.com&gt; |
|**publisher** | The Publisher name segment of the VM Image that tenants will use when deploying the image. An example is ‘Microsoft’. Do not include a space or other special characters in this field.|
|**offer** | The Offer name segment of the VM Image that tenants will use when deploying the image. An example is ‘WindowsServer’. Do not include a space or other special characters in this field. |
| **sku** | The SKU name segment of the VM Image that tenants will use when deploying the image. An example is ‘Datacenter2016’. Do not include a space or other special characters in this field. |
|**version** | The Version of the VM Image that tenants will use when deploying the image. This version is in the format \#.\#.\#. An example is ‘1.0.0’. Do not include a space or other special characters in this field.|
| **osType** | The OS Type of the image must be either ‘Windows’ or ‘Linux’. |
|**osDiskLocalPath** | This is the local path to the OS Disk VHD that you are uploading as a VM Image into Azure Stack. |
|**dataDiskLocalPaths**| This is an optional array of the local paths for data disks that can be uploaded as part of the VM Image.|
|**CreateGalleryItem**| Boolean flag for whether to create an item in the Marketplace. The default is set to true.|
|**title**| The display name of Marketplace item. The default is set to be the Publisher-Offer-Sku of the VM image.|
|**description**| The description of the Marketplace item. |
|**osDiskBlobURI**| Optionally, this script will also accept a blob storage URI for the osDisk.|
|**dataDiskBlobURIs**| Optionally, this script can also accept an array of blob storage URIs for adding data disks to the image.|



##Add a VM Image through the portal

> [AZURE.NOTE] This method will require the separate creation of a Marketplace item. 

1.  Adding the image will require that it can be referenced by a blob
    storage URI. To begin, prepare a Windows or Linux operating system
    virtual hard disk image in VHD format (not VHDX) and upload the
    image to a storage account in Azure or in Azure Stack. If your image
    is already uploaded to blob storage in Azure or Azure Stack, you can
    skip this.

    Follow the steps from [*Upload a Windows VM image to Azure for
    Resource Manager
    deployments*](https://azure.microsoft.com/en-us/documentation/articles/virtual-machines-windows-upload-image/) article
    up through the step ‘**Upload the VM image to your storage
    account’,** but first make a note of the following:

    -   If you are uploading a Linux image, follow the instructions to
        prepare the image or use an existing Azure Stack Linux image in
        the [Deploy Linux virtual machines on Azure
        Stack](https://azure.microsoft.com/en-us/documentation/articles/azure-stack-linux/)
        article

    -   Uploading to Azure Stack blob storage is preferred over Azure
        blob storage as the time required to push the VM image into the
        Azure Stack image repository will be less. While following the
        steps above, make sure to substitute the [Authenticate
        PowerShell with Microsoft Azure
        Stack](https://azure.microsoft.com/en-us/documentation/articles/azure-stack-deploy-template-powershell/1)
        step for the ‘Login to Azure’ step.

    -   Make a note of the blob URI where you upload the image. It will
        have the following format:
        *&lt;storageAccount&gt;/&lt;blobContainer&gt;/&lt;targetVHDName&gt;.vhd*

2.  Set the storage account blob container access where the VM image VHD
    was uploaded to ‘Blob’ by navigating to the container in the blob
    storage account and selecting **Access Policy**. This will make the
    blob anonymously accessible, but if you do not wish to do this, you
    can instead generate a Shared Access Signature for the container.

![Navigate to storage account blobs](/articles/azure-stack/media/azure-stack-add-vm-image/image1.png)

![Set blob access to public](/articles/azure-stack/media/azure-stack-add-vm-image/image2.png)

1.  Login to Azure Stack as an administrator. Navigate to Region
    Management -&gt; Under RPs, select the **Compute** Resource Provider
    -&gt; select VM Images and then select **Add.**

    ![](/articles/azure-stack/media/azure-stack-add-vm-image/image3.png)

2.  On the following blade, enter the Publisher, Offer, SKU, and Version
    of the VM Image. These name segments are used to refer to the VM
    Image in Azure Resource Manager templates. Make sure to select the
    OS Type correctly. For the OS Disk Blob URI, enter the URI where the
    image was uploaded in step 1. Click Create to begin creating the
    VM Image.

    ![](/articles/azure-stack/media/azure-stack-add-vm-image/image4.png)

3.  The VM Image status will change to ‘Succeeded’ when the image is
    successfully added.

4.  All tenants can now consume the VM Image by specifying the
    Publisher, Offer, SKU, and Version of the added VM Image in an Azure
    Resource Manager template (just as in Azure). To make the VM image
    more readily available for tenant consumption in the UI, it is best
    to [create a
    marketplace item.](https://azure.microsoft.com/en-us/documentation/articles/azure-stack-create-marketplace-item/)




