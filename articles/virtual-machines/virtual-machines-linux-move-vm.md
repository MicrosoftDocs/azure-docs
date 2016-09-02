<properties
	pageTitle="Move a Linux VM | Microsoft Azure"
	description="Move a Linux VM to another Azure subscription or resource group in the Resource Manager deployment model."
	services="virtual-machines-linux"
	documentationCenter=""
	authors="cynthn"
	manager="timlt"
	editor=""
	tags="azure-resource-manager"/>

<tags
	ms.service="virtual-machines-linux"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/08/2016"
	ms.author="cynthn"/>

	


# Move a Linux VM to another subscription or resource group

This article walks you through how to move a Linux VM between resource groups or subscriptions. Moving a VM between subscriptions can be handy if you created a VM in a personal subscription and now want to move it to your company's subscription.

> [AZURE.NOTE] New resource IDs are created as part of the move. Once the VM has been moved, you need to update your tools and scripts to use the new resource IDs. 


## Use the Azure CLI to move a VM 

To successfully move a VM, you need to move the VM and all its supporting resources. Use the **azure group show** command to list all the resources in a resource group and their IDs. It helps to pipe the output of this command to a file so you can copy and paste the IDs into later commands.

	azure group show <resourceGroupName>

To move a VM and its resources to another resource group, use the **azure resource move** CLI command. The following example shows how to move a VM and the most common resources it requires. We use the **-i** parameter and pass in a comma-separated list (without spaces) of IDs for the resources to move.

	
    vm=/subscriptions/<sourceSubscriptionID>/resourceGroups/<sourceResourceGroup>/providers/Microsoft.Compute/virtualMachines/<vmName>
	nic=/subscriptions/<sourceSubscriptionID>/resourceGroups/<sourceResourceGroup>/providers/Microsoft.Network/networkInterfaces/<nicName>
	nsg=/subscriptions/<sourceSubscriptionID>/resourceGroups/<sourceResourceGroup>/providers/Microsoft.Network/networkSecurityGroups/<nsgName>
	pip=/subscriptions/<sourceSubscriptionID>/resourceGroups/<sourceResourceGroup>/providers/Microsoft.Network/publicIPAddresses/<publicIPName>
	vnet=/subscriptions/<sourceSubscriptionID>/resourceGroups/<sourceResourceGroup>/providers/Microsoft.Network/virtualNetworks/<vnetName>
	diag=/subscriptions/<sourceSubscriptionID>/resourceGroups/<sourceResourceGroup>/providers/Microsoft.Storage/storageAccounts/<diagnosticStorageAccountName>
	storage=/subscriptions/<sourceSubscriptionID>/resourceGroups/<sourceResourceGroup>/providers/Microsoft.Storage/storageAccounts/<storageAcountName>  	
	
	azure resource move --ids $vm,$nic,$nsg,$pip,$vnet,$storage,$diag -d "<destinationResourceGroup>"
	
If you want to move the VM and its resources to a different subscription, add the **--destination-subscriptionId &#60;destinationSubscriptionID&#62;** parameter to specify the destination subscription.

If you are working from the Command Prompt on a Windows computer, you need to add a **$** in front of the variable names when you declare them. This isn't needed in Linux.

You are asked to confirm that you want to move the specified resource. Type **Y** to confirm that you want to move the resources.
	

[AZURE.INCLUDE [virtual-machines-common-move-vm](../../includes/virtual-machines-common-move-vm.md)]

## Next steps

You can move many different types of resources between resource groups and subscriptions. For more information, see [Move resources to new resource group or subscription](../resource-group-move-resources.md).	