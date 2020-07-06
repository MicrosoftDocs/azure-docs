---
title: Move a VM in using the Azure CLI
description: Move a VM to another Azure subscription or resource group using the Azure CLI.
author: cynthn
ms.service: virtual-machines
ms.workload: infrastructure-services
ms.topic: article
ms.date: 09/12/2018
ms.author: cynthn

---
# Move a VM to another subscription or resource group
This article walks you through how to move a virtual machine (VM) between resource groups or subscriptions. Moving a VM between subscriptions can be handy if you created a VM in a personal subscription and now want to move it to your company's subscription.

> [!IMPORTANT]
>New resource IDs are created as part of the move. After the VM has been moved, you will need to update your tools and scripts to use the new resource IDs.
>


## Use the Azure CLI to move a VM


Before you can move your VM by using the Azure CLI, you need to make sure the source and destination subscriptions exist within the same tenant. To check that both subscriptions have the same tenant ID, use [az account show](/cli/azure/account).

```azurecli-interactive
az account show --subscription mySourceSubscription --query tenantId
az account show --subscription myDestinationSubscription --query tenantId
```
If the tenant IDs for the source and destination subscriptions are not the same, you must contact [support](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview) to move the resources to a new tenant.

To successfully move a VM, you need to move the VM and all its supporting resources. Use the [az resource list](/cli/azure/resource) command to list all the resources in a resource group and their IDs. It helps to pipe the output of this command to a file so you can copy and paste the IDs into later commands.

```azurecli-interactive
az resource list --resource-group "mySourceResourceGroup" --query "[].{Id:id}" --output table
```

To move a VM and its resources to another resource group, use [az resource move](/cli/azure/resource). The following example shows how to move a VM and the most common resources it requires. Use the **-ids** parameter and pass in a comma-separated list (without spaces) of IDs for the resources to move.

```azurecli-interactive
vm=/subscriptions/mySourceSubscriptionID/resourceGroups/mySourceResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM
nic=/subscriptions/mySourceSubscriptionID/resourceGroups/mySourceResourceGroup/providers/Microsoft.Network/networkInterfaces/myNIC
nsg=/subscriptions/mySourceSubscriptionID/resourceGroups/mySourceResourceGroup/providers/Microsoft.Network/networkSecurityGroups/myNSG
pip=/subscriptions/mySourceSubscriptionID/resourceGroups/mySourceResourceGroup/providers/Microsoft.Network/publicIPAddresses/myPublicIPAddress
vnet=/subscriptions/mySourceSubscriptionID/resourceGroups/mySourceResourceGroup/providers/Microsoft.Network/virtualNetworks/myVNet
diag=/subscriptions/mySourceSubscriptionID/resourceGroups/mySourceResourceGroup/providers/Microsoft.Storage/storageAccounts/mydiagnosticstorageaccount
storage=/subscriptions/mySourceSubscriptionID/resourceGroups/mySourceResourceGroup/providers/Microsoft.Storage/storageAccounts/mystorageaccountname    

az resource move \
    --ids $vm,$nic,$nsg,$pip,$vnet,$storage,$diag \
	--destination-group "myDestinationResourceGroup"
```

If you want to move the VM and its resources to a different subscription, add the **--destination-subscriptionId** parameter to specify the destination subscription.

When you are asked to confirm that you want to move the specified resources, enter **Y** to confirm.

[!INCLUDE [virtual-machines-common-move-vm](../../../includes/virtual-machines-common-move-vm.md)]

## Next steps
You can move many different types of resources between resource groups and subscriptions. For more information, see [Move resources to a new resource group or subscription](../../azure-resource-manager/management/move-resource-group-and-subscription.md).    
