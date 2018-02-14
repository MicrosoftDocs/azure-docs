---
title: Use Azure Policy to restrict installation | Microsoft Docs
description: Using Azure Policy to Restrict Extension Deployments.
services: virtual-machines-linux 
documentationcenter: ''
author: danielsollondon 
manager: timlt 
editor: ''

ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 02/06/2018
ms.author: danis

---

# How to use Azure Policy to Restrict Extensions Installation on VMs

If you want to prevent extension installation, or certain extensions being install to your VMs, you can use Azure Resource Manager to restrict VMs having specific or all extensions installed, this can be scoped to a resource group. 


This tutorial requires that you are running the Azure CLI version 2.0.26 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli). 


## Create the policy

A policy definition is an object used to store the configuration that you would like to use. Create a policy definition using [az policy definition create](/cli/azure/role/assignment?view=azure-cli-latest#az_role_assignment_create).

In this example, we are going to block the installation of the VM agent that allows you to reset passwords and the Custom Script Extension that can be used to run scripts and commands on a VM. The extensions to block are listed in .json format in the **--rules** parameter.


```azurecli-interactive
	az policy definition create \
   --name 'not-allowed-vmextension' \
   --display-name 'Block VM Extensions' \
   --description 'This policy governs which VM extensions that are blocked.' \
   --rules '{
			"if": {
				"allOf": [
					{
						"field": "type",
						"equals": "Microsoft.Compute/virtualMachines/extensions"
					},
					{
						"field": "Microsoft.Compute/virtualMachines/extensions/publisher",
						"equals": "Microsoft.Compute"
					},
					{
						"field": "Microsoft.Compute/virtualMachines/extensions/type",
						"in": "[parameters('notAllowedExtensions')]"
					}
				]
			},
			"then": {
				"effect": "deny"
			}
		}'
   --params '{
			"notAllowedExtensions": {
				"value": [
					"VMAccessAgent",
					"CustomScriptExtension"
				]
			}
		}'
```

## Assign the policy

This example assigns the policy to a resource group using [az policy assignment create](/cli/azure/policy/assignment?view=azure-cli-latest#az_policy_assignment_create). Any VM created in the **myResourceGroup** resource group will not be able to install the VM Access or Custom Script extensions. Use [az account list](/cli/azure/account?view=azure-cli-latest#az_account_list) to get your subscription ID to use in place of the one in the example.


```azurecli-interactive
az policy assignment create \
   --name 'not-allowed-vmextension' \
   --scope /subscriptions/<subscription Id>/resourceGroups/myResourceGroup \
   --policy "not-allowed-vmextension" 
```

## Test the policy

Create a VM to test the policy.

```azurecli-interactive
az vm create --resource-group myResourceGroup --name myVM --image UbuntuLTS --generate-ssh-keys
```

Try to create a new user named **myNewUser** using the VM Access extension.

```azurecli-interactive
az vm user update \
  --resource-group myResourceGroup \
  --name myVM \
  --username myNewUser \
  --generate-ssh-keys
```



## Removing the assignment
```azurecli-interactive
az policy assignment delete --name 'not-allowed-vmextension' --resource-group myVMs
```
## Removing the policy
```azurecli-interactive
az policy definition delete --name 'not-allowed-vmextension'
```


## Next Steps
For more information, please refer to [Azure Policy](../../azure-policy/azure-policy-introduction.md).
