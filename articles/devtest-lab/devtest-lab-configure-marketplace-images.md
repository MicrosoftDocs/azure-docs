<properties
	pageTitle="Configure Azure Marketplace image settings in Azure DevTest Labs | Microsoft Azure"
	description="Configure which Azure Marketplace images can be used when creating a VM in Azure DevTest Labs"
	services="devtest-lab,virtual-machines"
	documentationCenter="na"
	authors="tomarcher"
	manager="douge"
	editor=""/>

<tags
	ms.service="devtest-lab"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/06/2016"
	ms.author="tarcher"/>

# Configure Azure Marketplace image settings in Azure DevTest Labs

DevTest Labs supports creating VMs based on Azure Marketplace images depending
on how you have configured Azure Marketplace images to be used in your lab. This article
shows you how to specify which, if any, Azure Marketplace images can be used when
creating VMs in a lab.

## Select which Azure Marketplace images are allowed when creating a VM

1. Sign in to the [Azure portal](http://go.microsoft.com/fwlink/p/?LinkID=525040).

1. Select **More Services**, and then select **DevTest Labs** from the list.

1. From the list of labs, select the desired lab. 

1. On the lab's blade, select **Configuration**.
	
1. On lab's **Configuration** blade, select **Marketplace images**

1. Specify whether you want all the qualified Azure Marketplace images to be available for use as a base of a new VM. If you select **Yes**, 
then all the Azure Marketplace images that meet all the following criteria are allowed in the lab:

	- The image creates a single VM, **and**
	- The image uses Azure Resource Manager to provision VMs, **and**
	- The image doesn't require purchasing an extra licensing plan
	
	If you want no images to be allowed, or you want to specify which images can be used, select **No**.
 
	![Option to allow all Marketplace images to be used as base images for VMs](./media/devtest-lab-configure-marketplace-images/allow-all-marketplace-images.png)
 
1. If you select **No** to the previous step, the **Allowed images/Select all** checkbox is enabled. 
You can use this option together with the search box to quickly select or deselect all the items displayed in the list.
You can also select the Azure Marketplace images you want to allow for VM creation individually by checking each image's corresponding checkbox.
Select nothing from the list if you don't want to allow any Azure Marketplace images to be used in the lab.

	![You can specify which Azure Marketplace images can be used as base images for VMs](./media/devtest-lab-configure-marketplace-images/select-marketplace-images.png)

[AZURE.INCLUDE [devtest-lab-try-it-out](../../includes/devtest-lab-try-it-out.md)]

## Next steps

Once you have configured how Azure Marketplace images are allowed when creating a VM, the next step is to [add a VM to your lab](./devtest-lab-add-vm-with-artifacts.md).