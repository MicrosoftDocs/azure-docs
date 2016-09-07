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
marketplace UI with the creation of a custom marketplace item. A Windows
Server 2012 R2 image is included by default in the Azure Stack technical
preview.

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

![](/articles/azure-stack/media/azure-stack-add-vm-image/image1.png){width="6.5in" height="2.0076388888888888in"}

![](/articles/azure-stack/media/azure-stack-add-vm-image/image2.png){width="6.5in" height="2.484722222222222in"}

1.  Login to Azure Stack as an administrator. Navigate to Region
    Management -&gt; Under RPs, select the **Compute** Resource Provider
    -&gt; select VM Images and then select **Add.**

    ![](/articles/azure-stack/media/azure-stack-add-vm-image/image3.png){width="6.5in" height="3.263888888888889in"}

2.  On the following blade, enter the Publisher, Offer, SKU, and Version
    of the VM Image. These name segments are used to refer to the VM
    Image in Azure Resource Manager templates. Make sure to select the
    OS Type correctly. For the OS Disk Blob URI, enter the URI where the
    image was uploaded in step 1. Click Create to begin creating the
    VM Image.

    ![](/articles/azure-stack/media/azure-stack-add-vm-image/image4.png){width="6.5in" height="3.3652777777777776in"}

3.  The VM Image status will change to ‘Succeeded’ when the image is
    successfully added.

4.  All tenants can now consume the VM Image by specifying the
    Publisher, Offer, SKU, and Version of the added VM Image in an Azure
    Resource Manager template (just as in Azure). To make the VM image
    more readily available for tenant consumption in the UI, it is best
    to [create a
    marketplace item.](https://azure.microsoft.com/en-us/documentation/articles/azure-stack-create-marketplace-item/)

##PowerShell Script to automate adding a VM Image


If you have your VHD locally on the Console VM and want to use
PowerShell to automate the steps above, download this script.

The script requires your Azure Active Directory Tenant ID to
authenticate to your Azure Stack environment and will request your Azure
Stack administrator credentials while running the script.

An example invocation of the script is:

AddVMImage -publisher 'Canonical' -offer 'Ubuntu' -sku 'Server' -version
'1.0.0' -osDiskLocalPath 'C:\\Users\\admin1\\Desktop\\Ubuntu.vhd'
-osType Linux -tenantID 'myAADTenant.onmicrosoft.com'

*Note: Make sure to change ‘myAADTenant.onmicrosoft.com’ to your AAD
tenant.*

The script will finish executing as soon as the VM image has begun
downloading into the Azure Stack image repository. To verify that the
image has successfully downloaded into the Azure Stack image repository,
follow the instructions in step 3, above, to view the list of VM images
and check that the status changes to ‘Succeeded’.

As above, to make the VM image readily available for tenant consumption,
it is best to [create a marketplace
item.](https://azure.microsoft.com/en-us/documentation/articles/azure-stack-create-marketplace-item/)

A full list of the parameters for the script below is below:

tenantID : This your Azure Active Directory tenant ID in the form
&lt;AADTenantID.onmicrosoft.com&gt;

publisher : The Publisher name segment of the VM Image that tenants will
use when deploying the image. An example is ‘Microsoft’. Do not include
a space or other special characters in this field.

offer : The Offer name segment of the VM Image that tenants will use
when deploying the image. An example is ‘WindowsServer’. Do not include
a space or other special characters in this field.

sku : The SKU name segment of the VM Image that tenants will use when
deploying the image. An example is ‘Datacenter2016’. Do not include a
space or other special characters in this field.

version : The Version of the VM Image that tenants will use when
deploying the image. This version is in the format \#.\#.\#. An example
is ‘1.0.0’. Do not include a space or other special characters in this
field.

osType : The OS Type of the image must be either ‘Windows’ or ‘Linux’.

osDiskLocalPath: This is the local path to the OS Disk VHD that you are
uploading as a VM Image into Azure Stack.

dataDiskLocalPaths: This is an optional array of the local paths for
data disks that can be uploaded as part of the VM Image.

osDiskBlobURI: Optionally, this script will also accept a blob storage
URI for the osDisk.

dataDiskBlobURIs: Optionally, this script can also accept an array of
blob storage URIs for adding data disks to the image.
