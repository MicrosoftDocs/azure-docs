<properties
   pageTitle="Creating a virtual machine image on-premise for the Azure Marketplace | Microsoft Azure"
   description="Understand and execute the steps to create a VM image on-premise and  deploy to the Azure Marketplace for others to purchase."
   services="marketplace-publishing"
   documentationCenter=""
   authors="HannibalSII"
   manager=""
   editor=""/>

<tags
  ms.service="marketplace-publishing"
  ms.devlang="na"
  ms.topic="article"
  ms.tgt_pltfrm="Azure"
  ms.workload="na"
  ms.date="10/08/2015"
  ms.author="hascipio; v-divte"/>

# Developing a Virtual Machine Image on-premise for the Azure Marketplace
We strongly recommend that you develop Azure VHDs directly in the cloud using RDP. However, if you must, it is possible to download a VHD and develop using on-premises infrastructure.  

For on-premises development, you must download the OS VHD of the created VM. These steps would take place as part of step 3.3, above.  

## Download a VHD image
### Locate the Blob URL
In order to download the VHD, first locate the blob URL for the OS disk.

Locate the Blob URL from the new [Microsoft Azure Portal](https://ms.portal.azure.com):

1.	Go to **Browse > VMs**, and select the deployed VM.
2.	Under **Configure**, select the **Disks** tile, opening the Disks blade.

  ![drawing](media/marketplace-publishing-vm-image-creation-on-premise/img01.png)

3.	Select the **OS Disk**. This will open another blade displaying disk properties, including the VHD location.
4.	Copy this blob URL.

  ![drawing](media/marketplace-publishing-vm-image-creation-on-premise/img02.png)

5.	Now, delete the deployed VM, without deleting the backing disks. You can also choose to stop the VM, instead of deleting it. Do not download the OS VHD when the VM is running.

  ![drawing](media/marketplace-publishing-vm-image-creation-on-premise/img03.png)

### Download the VHD
Once you know the blob URL, you can download the VHD using [Azure Management Portal](http://manage.windowsazure.com/) or PowerShell.  
> [AZURE.NOTE] At the time of this guide’s creation, the functionality to download a VHD is not yet present in the new Microsoft Azure Portal.  

**Download the OS VHD via the current [Azure Management Portal](http://manage.windowsazure.com/)**

1.	Log into the Azure Management Portal if you have not done so already.
2.	Click the **Storage** tab.
3.	Select the **Storage Account** within which the VHD is stored.

  ![drawing](media/marketplace-publishing-vm-image-creation-on-premise/img04.png)

4.	This will open up the Storage Account properties. Select the Containers tab.

  ![drawing](media/marketplace-publishing-vm-image-creation-on-premise/img05.png)

5.	Select the container in which the VHD is stored. By default when created from Portal, the VHD will be stored in a vhds container.

  ![drawing](media/marketplace-publishing-vm-image-creation-on-premise/img06.png)

6.	Select the correct OS VHD by comparing the URL to the one you saved.
7.	Click **Download**.

  ![drawing](media/marketplace-publishing-vm-image-creation-on-premise/img07.png)

### Download the VHD using PowerShell
In addition to the Azure Management Portal, you can use the [Save-AzureVhd](http://msdn.microsoft.com/en-us/library/dn495297.aspx) cmdlet to download the OS VHD:

        Save-AzureVhd –Source <storageURIOfVhd> `
        -LocalFilePath <diskLocationOnWorkstation> `
        -StorageKey <keyForStorageAccount>
e.g.,
        Save-AzureVhd -Source “https://baseimagevm.blob.core.windows.net/vhds/BaseImageVM-6820cq00-BaseImageVM-os-1411003770191.vhd” -LocalFilePath “C:\Users\Administrator\Desktop\baseimagevm.vhd” -StorageKey <String>

> [AZURE.NOTE] *Save-AzureVhd* also has a NumberOfThreads option that can be used to increase parallelism to make the best use of available bandwidth for the download.

## Upload VHDs to an Azure storage account
If you prepared your VHDs on premises you will need to upload them into a storage account in Azure. This step would take place after creating your VHD on-premises but before obtaining certification for your VM image.

### Create a Storage Account and Container
As mentioned previously, we recommend VHDs be uploaded into a storage account in a region in the United States. All VHDs for a single SKU should be placed in a single container within a single storage account.

To create a storage account, you can use the [Microsoft Azure Portal](https://portal.azure.com/), PowerShell or the Linux Command-line tool.  

**Creating a storage account from the Microsoft Azure Portal**

1.	Click **New**.
2.	Select **Storage**.
3.	Fill in the storage account name and select location.

  ![drawing](media/marketplace-publishing-vm-image-creation-on-premise/img08.png)

4.	Click **Create**.
5.	The blade for the created storage account should be open. If not, select **Browse > Storage Accounts**. On the **Storage Account** blade, select the storage account created.
6.	Select **Containers**.

  ![drawing](media/marketplace-publishing-vm-image-creation-on-premise/img09.png) 

7.	On the **Containers** blade, select **Add** and enter a container name and the container permissions. Select **Private** for container permissions.

> [AZURE.TIP] It is recommended to create one container per SKU that you are planning to publish.

  ![drawing](media/marketplace-publishing-vm-image-creation-on-premise/img10.png)

### Creating a storage account using PowerShell
Using PowerShell, create a storage account using the [New-AzureStorageAccount](http://msdn.microsoft.com/en-us/library/dn495115.aspx) cmdlet:

        New-AzureStorageAccount -StorageAccountName “mystorageaccount” -Location “West US”

Then you can create a container within that storage account, using the [NewAzureStorageContainer](http://msdn.microsoft.com/en-us/library/dn495291.aspx) cmdlet:

        New-AzureStorageContainer -Name “containername” -Permission “Off”

> [AZURE.NOTE] Those commands assume that the current storage account context has already been set in PowerShell.   Refer to [Setting up Azure PowerShell](marketplace-publishing-powershell-setup.md) for more details on PowerShell setup.
 
### Creating a storage account using the Command-line Tool for Mac and Linux
From [Linux Command-line tool](http://azure.microsoft.com/en-us/documentation/articles/command-line-tools/), create a storage account as follows:

        azure storage account create mystorageaccount --location "West US"

Create a container as follows:

        azure storage container create containername --account-name mystorageaccount --accountkey <accountKey>

## Upload VHDs
Once the storage account and container is created, you can upload your prepared VHDs. It is possible to use PowerShell, the Linux Command-line tool, or other Azure Storage management tools.

### Upload a VHD via PowerShell
Use the [Add-AzureVhd](http://msdn.microsoft.com/en-us/library/dn495173.aspx) cmdlet:

        Add-AzureVhd –Destination “http://mystorageaccount.blob.core.windows.net/containername/vmsku.vhd” -LocalFilePath “C:\Users\Administrator\Desktop\vmsku.vhd”

### Upload a VHD using the Command-line Tool for Mac and Linux
With the [Linux Command-line tool](http://azure.microsoft.com/en-us/documentation/articles/command-line-tools/), use the following:
        azure vm image create <image name> --location <Location of the data center> --OS Linux <LocationOfLocalVHD>

## See Also
- [Creating a Virtual Machine Image for the Marketplace](marketplace-publishing-vm-image-creation.md)
- [Setting up Azure PowerShell](marketplace-publishing-powershell-setup.md)
