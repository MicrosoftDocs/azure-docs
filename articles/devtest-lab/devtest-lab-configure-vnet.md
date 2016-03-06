<properties
	pageTitle="Configure an existing VNET for a DevTest Lab  | Microsoft Azure"
	description="Learn how to configure an existing VNET and subnet, and use them in a VM"
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
	ms.date="03/06/2016"
	ms.author="tarcher"/>

# Configure an existing VNET for a DevTest Lab

## Overview

As explained in the article, [Add a VM with artifacts to an Azure DevTest Lab](devtest-lab-add-vm-with-artifacts.md), when you create a VM in a lab, 
you can specify a configured VNET (and subnet) for that VM. One scenario for doing this is if you want to be able to access your corpnet resources 
from your VMs. The following sections show you how to add your existing VNET into the lab's Virtual Network settings so that it will be available 
to choose when creating your VMs.

## Add an existing VNET into a DevTest Lab using the Azure portal
The following steps walk you through adding an existing VNET (and subnet) to a DevTest Lab so that it can be used when creating a VM in the same lab. 

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Tap **Browse**, and then tap **DevTest Labs** from the list.

1. From the list of labs, tap the lab in which you want create the new VM.  

1. Tap **Virtual options**.

	![VNETs can be configured from the lab's Settings blade](./media/devtest-lab-configure-vnet/lab-settings-vnet.png)
	
1. On the **Virtual networks** blade, you'll see a list of VNETs you've configured for the current lab as well
as the default VNET that is created for your lab. 

1. Tap **+ Add**.

	![Add an existing VNET to your lab](./media/devtest-lab-configure-vnet/lab-settings-vnet-add.png)
	
1. On the **Virtual network** blade, tap **[Select virtual network]**.

	![Select an existing VNET](./media/devtest-lab-configure-vnet/lab-settings-vnets-vnet.png)
	
1. On the **Choose virtual network** blade, select the desired VNET.

1. When you return to the **Virtual network blade**, specify a description for your VNET/Lab combination.

1. To allow a subnet to be used in lab VM creation, select the **USE IN VM CREATION** option.

1. To allow public IP addresses in a subnet, select the **ALLOW PUBLIC IP** option.

1. Tap **Save**.

1. Now that the VNET is configured, it can be selected when creating a new VM. 
This is explained in the article, [Add a VM with artifacts to an Azure DevTest Lab](devtest-lab-add-vm-with-artifacts.md). 

## Add an existing VNET into a DevTest Lab using an ARM template
This section explains how to use an ARM template to add an existing VNET into a DevTest Lab.

1. Create a JSON file representing the ARM template. The following JSON is an example of this.

		{
			"$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
			"contentVersion": "1.0.0.0",
			"parameters": {
				"newLabName": {
				"type": "string",
				"metadata": {
					"description": "The name of the new lab instance to be created."
				}
				},
				"existingVirtualNetworkId": {
				"type": "string",
				"defaultValue": "",
				"metadata": {
					"description": "The resource identifier of an existing virtual network to be used by as the default for the new lab instance being created."
				}
				}
			},
			"resources": [
				{
				"apiVersion": "2015-05-21-preview",
				"name": "[parameters('newLabName')]",
				"type": "Microsoft.DevTestLab/labs",
				"location": "[resourceGroup().location]",
				"properties": {
					"defaultVirtualNetworkId": "[parameters('existingVirtualNetworkId')]"
				}
				}
			],
			"outputs": {
				"labId": {
				"type": "string",
				"value": "[resourceId('Microsoft.DevTestLab/labs', parameters('newLabName'))]"
				}
			}
		}

1. Follow the instructions *Parameter file* section of the article, [Deploy a Resource Group with Azure Resource Manager template](../resource-group-template-deploy#parameter-file). 

## Next steps

Once you have added the desired VNET(s) to your lab, the next step is to [add a VM to your DevTest Lab](devtest-lab-add-vm-with-artifacts.md).