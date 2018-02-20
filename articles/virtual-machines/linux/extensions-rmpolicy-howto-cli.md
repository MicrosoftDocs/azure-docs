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

## Policy and parameters

In this example, we are going to block the installation of the VM agent that allows you to reset passwords and the Custom Script Extension that can be used to run scripts and commands on a VM. In order to restrict what extensions can be installed, you need to have a rule to provide the logic to identify the extension and a set of parameters that includes a list of the extensions to block.

In this example, the rules file looks like this:

```json
{
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
}
```

The parameters file lists the extensions to be blocked.

```json
{
	"notAllowedExtensions": {
		"type": "Array",
		"metadata": {
			"description": "The list of extensions that will be denied. Example: BGInfo, CustomScriptExtension, JsonAADDomainExtension, VMAccessAgent.",
			"strongType": "type",
			"displayName": "Denied extension"
		}
	}
}
```


## Create the policy

A policy definition is an object used to store the configuration that you would like to use. Create a policy definition using [az policy definition create](/cli/azure/role/assignment?view=azure-cli-latest#az_role_assignment_create).

The rules and parameters are expressed in .json and can be passed in as files. In this example, the rules and parameters have been saved as .json files on GitHub and the raw files are passed into the command.

```azurecli-interactive
az policy definition create \
   --name 'not-allowed-vmextension' \
   --display-name 'Block VM Extensions' \
   --description 'This policy governs which VM extensions that are blocked.' \
   --rules 'https://raw.githubusercontent.com/Azure/azure-policy/master/samples/Compute/not-allowed-vmextension/azurepolicy.rules.json' \
   --params 'https://raw.githubusercontent.com/Azure/azure-policy/master/samples/Compute/not-allowed-vmextension/azurepolicy.parameters.json' \
   --mode All
```


## Assign the policy

This example assigns the policy to a resource group using [az policy assignment create](/cli/azure/policy/assignment#az_policy_assignment_create). Any VM created in the **myResourceGroup** resource group will not be able to install the VM Access or Custom Script extensions. The resource group must exist before you can assign the policy.

Use [az account list](/cli/azure/account?view=azure-cli-latest#az_account_list) to get your subscription ID to use in place of the one in the example.


```azurecli-interactive
az policy assignment create \
   --name 'not-allowed-vmextension' \
   --scope /subscriptions/<subscription Id>/resourceGroups/myResourceGroup \
   --policy "not-allowed-vmextension" \
   --params '{
		"notAllowedExtensions": {
			"value": [
				"VMAccessAgent",
				"CustomScriptExtension"
			]
		}
	}'
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
  --password 'mynewuserpwd123!'
```



## Removing the assignment
```azurecli-interactive
az policy assignment delete --name 'not-allowed-vmextension' --resource-group myResourceGroup
```
## Removing the policy
```azurecli-interactive
az policy definition delete --name 'not-allowed-vmextension'
```


## Next Steps
For more information, please refer to [Azure Policy](../../azure-policy/azure-policy-introduction.md).
