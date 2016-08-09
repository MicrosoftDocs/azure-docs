<properties
	pageTitle="Move a Linux VM to another subscription | Microsoft Azure"
	description="Move a Linux VM to another Azure subscription in the Resource Manager deployment model."
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
	ms.date="07/06/2016"
	ms.author="cynthn"/>

	


# Move a Linux VM to another subscription 

This article walks you through how to move a Linux VM between subscriptions. This can be handy if you originally created a VM in a personal subscription and now want to move it to your company's subscription to continue your work.

> [AZURE.NOTE] New resource IDs will be created as part of the move. Once the VM has been moved, you will need to update your tools and scripts to use the new resource IDs. 

## Login and set your subscription

1. Login to the CLI.
		
		azure login

2. Make sure you are in Resource Manager mode.
	
		azure config mode arm

3. Set the correct subscription. You can use 'azure account list' to see all of your subscriptions.

		azure account set <SubscriptionId>

## stuff

Subscription = Microsoft Azure Internal Consumption

Resource group = (new) LinuxHeroRG

Location = West US

Computer name = LinuxHero

Disk type = SSD

User name = azureuser

Size = Standard DS1 v2

Storage account = (new) linuxherodisk

Virtual network = (new) LinuxHeroRG-vnet

Subnet = (new) LinuxHeroSubNet (172.17.0.0/24)

Public IP address = (new) LinuxHero-ip

Network security group (firewall) = (new) LinuxHero-nsg

Availability set = None

Diagnostics = Enabled

Diagnostics storage account = (new) linuxherodiag

## Use the CLI to move a VM 

In order to successfully move a VM, you need to move the VM and all of it's supporting resources. Use the **azure group show** command to list all of the resources in a resource group.

	azure group show <resourceGroupName>

To move a VM and it's resources to another resource group, use the **azure resource move** CLI command. The following example shows how to move a VM and the most common resources required for the VM using the **-i** parameter to provide a comma-separated list (without spaces) of the resource IDs to move.

    azure resource move -i /subscriptions/<sourceSubscriptionID>/resourceGroups/<sourceResourceGroup>/providers/Microsoft.Compute/virtualMachines/<vmName>,/subscriptions/<sourceSubscriptionID>/resourceGroups/<sourceResourceGroup>/providers/Microsoft.Network/networkInterfaces/<nicName>,/subscriptions/<sourceSubscriptionID>/resourceGroups/<sourceResourceGroup>/providers/Microsoft.Network/networkSecurityGroups/<nsgName>,/subscriptions/<sourceSubscriptionID>/resourceGroups/<sourceResourceGroup>/providers/Microsoft.Network/publicIPAddresses/<publicIPName>,/subscriptions/<sourceSubscriptionID>/resourceGroups/<sourceResourceGroup>/providers/Microsoft.Network/virtualNetworks/<vnetName>,/subscriptions/<sourceSubscriptionID>/resourceGroups/<sourceResourceGroup>/providers/Microsoft.Storage/storageAccounts/<diagnosticStorageAccountName>,/subscriptions/<sourceSubscriptionID>/resourceGroups/<sourceResourceGroup>/providers/Microsoft.Storage/storageAccounts/<storageAcountName>  -d "<destinationResourceGroup>"
	
If you want to move the VM and it's resources to a different subscription, add the **--destination-subscriptionId <destinationSubscriptionID>** parameter to specify the destination subscription.

You will be asked to confirm that you want to move the specified resource. Type **Y** to confirm that you want to move the resources.
	

[AZURE.INCLUDE [virtual-machines-common-move-vm](../../includes/virtual-machines-common-move-vm.md)]

## Next steps

You can move many different types of resources between resource groups and subscriptions. For more information, see [Move resources to new resource group or subscription](../resource-group-move-resources.md).	