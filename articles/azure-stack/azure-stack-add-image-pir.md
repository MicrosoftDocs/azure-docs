<properties
	pageTitle="Add an image to the Platform Image Repository (PIR) in Azure Stack | Microsoft Azure"
	description="Learn how to prepare a virtual hard disk image before you add an image to the PIR in Azure Stack."
	services="azure-stack"
	documentationCenter=""
	authors="ErikjeMS"
	manager="byronr"
	editor=""/>

<tags
	ms.service="azure-stack"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/01/2016"
	ms.author="erikje"/>

# Add an image to the Platform Image Repository (PIR) in Azure Stack

Before a virtual machine can be added to the Marketplace, its image must be added to the Platform Image Repository. This repository  contains all the images for virtual machines offered in the Marketplace and referenced by Azure Resource Manager (ARM) templates.

## To add an image to the PIR, follow these steps:

1. Prepare a Windows or Linux operation system virtual hard disk image in VHD format (not VHDX):
  - Follow Step 1 from the [Create and upload a Windows Server VHD to Azure](../virtual-machines/virtual-machines-windows-classic-createupload-vhd.md) article.
  - Follow Step 1 from the [Creating and Uploading a Virtual Hard Disk that Contains the Linux Operating System](../virtual-machines/virtual-machines-linux-classic-create-upload-vhd.md) article.

2.  Get the drive letter of the DATAIMAGE disk from **This PC**.

3.  In command run the following command. Replace X with your drive letter.

 `X:\CRP\VM\Microsoft.AzureStack.Compute.Installer\content\Scripts\CopyImageToPlatformImageRepository.ps1`

4. For **PlatformImageRepositoryPath**, type `\\SOFS\Share\CRP\PlatformImages\`.

5. For **ImagePath**, type the path to the PIR image.

6. For **Publisher**, type a publisher name, like *Microsoft*.

7. For **Offer**, type any value, like *Server*.

8. For **Sku**, type a SKU for the image, like *Datacenter*.

9. For **Version**, type a version in #.#.# format, like *1.0.0*.

10. For **OsType**, type *Windows* or *Linux*.

11. After the command completes, restart your browser to see the new item in the Marketplace. The image can now be referenced in your virtual machine deployment templates. In some cases it may take up to 5 minutes for this new image to appear in the Marketplace.  

>[AZURE.NOTE] The marketplace UI may error after you remove a previously added image from the PIR. To fix this, click **Settings** in the portal. Then, click **Discard modifications** under **Portal customization**.

## Create an image of WindowsServer2012R2 including .NET 3.5

1.	In Hyper-V, create a virtual machine by using a copy of the WindowsServer2012 PIR image. Store this VHD in a new location and record that location so it can be copied later.

2.	Follow these steps: [https://technet.microsoft.com/library/dn482071.aspx](https://technet.microsoft.com/library/dn482071.aspx). These steps include ensuring that the source media is available, which involves downloading the Windows Server 2012 R2 ISO from TechNet.

3.	To generalize the image, use Sysprep on the virtual machine as described here: [https://technet.microsoft.com/library/hh824938.aspx](https://technet.microsoft.com/library/hh824938.aspx).

4.	Wait until the virtual machine is off (which happens as part of the Sysprep process), then copy the VHD to a staging folder.

5.	Use this new VHD as part of a new PIR Image. Put NET3.5 in the image name so that you remember it has been added.


## Next steps

[Frequently asked questions for Azure Stack](azure-stack-faq.md)
