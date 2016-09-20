<properties
	pageTitle="Add an image to the Platform Image Repository in Azure Stack | Microsoft Azure"
	description="Learn how to prepare a virtual hard disk image before you add an image to the Platform Image Repository in Azure Stack."
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

# Add an image to the Platform Image Repository in Azure Stack

Before a virtual machine can be added to Marketplace, its image must be added to the Platform Image Repository. This repository contains all the images for virtual machines that are offered in Marketplace and that are referenced by Azure Resource Manager templates.

## To add an image to the Platform Image Repository

1. Prepare a Windows or Linux operation system virtual hard disk image in VHD format (not VHDX):
  - Follow Step 1 from the [Create and upload a Windows Server VHD to Azure](../virtual-machines/virtual-machines-windows-classic-createupload-vhd.md) article.
  - Follow Step 1 from the [Create and upload a virtual hard disk that contains the Linux operating system](../virtual-machines/virtual-machines-linux-classic-create-upload-vhd.md) article.

2.  Get the drive letter of the DATAIMAGE disk from **This PC**.

3.  In a command line, run the following command. Replace **X** with your drive letter:

 `X:\CRP\VM\Microsoft.AzureStack.Compute.Installer\content\Scripts\CopyImageToPlatformImageRepository.ps1`

4. For **PlatformImageRepositoryPath**, type `\\SOFS\Share\CRP\PlatformImages\`.

5. For **ImagePath**, type the path to the Platform Image Repository image.

6. For **Publisher**, type a publisher name, such as *Microsoft*.

7. For **Offer**, type any value, such as *Server*.

8. For **Sku**, type a SKU for the image, such as *Datacenter*.

9. For **Version**, type a version in #.#.# format, such as *1.0.0*.

10. For **OsType**, type *Windows* or *Linux*.

11. After the command runs, restart your browser to see the new item in Marketplace. The image can now be referenced in your virtual machine deployment templates. In some cases, it may take up to five minutes for this new image to appear in Marketplace.  

>[AZURE.NOTE] The marketplace UI might experience an error after you remove a previously added image from the Platform Image Repository. To fix this, click **Settings** in the portal. Then, under **Portal customization**, click **Discard modifications**.

## To create an image of Windows Server 2012 R2 that includes .NET 3.5

1.	In Hyper-V, create a virtual machine by using a copy of the Windows Server 2012 Platform Image Repository image. Store this VHD in a new location, and then record that location so that it can be copied later.

2.	Follow the steps in the article [Enable .NET Framework 3.5 by using the Add Roles and Features Wizard](https://technet.microsoft.com/library/dn482071.aspx). These steps include ensuring that the source media is available, which involves downloading the Windows Server 2012 R2 ISO from Microsoft TechNet.

3.	To generalize the image, use Sysprep on the virtual machine as described in the article [Sysprep (Generalize) a Windows installation](https://technet.microsoft.com/library/hh824938.aspx).

4.	Wait until the virtual machine is off (which happens as part of the Sysprep process), and then copy the VHD to a staging folder.

5.	Use this new VHD as part of a new Platform Image Repository image. Put NET3.5 in the image name so that you remember it has been added.


## Next steps

[Frequently asked questions for Azure Stack](azure-stack-faq.md)
