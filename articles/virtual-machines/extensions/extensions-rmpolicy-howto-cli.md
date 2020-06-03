---
title: Use Azure Policy to restrict VM extension installation 
description: Use Azure Policy to restrict VM extension deployments.
services: virtual-machines-linux 
documentationcenter: ''
author: axayjo 
manager: gwallace
editor: ''

ms.service: virtual-machines-linux
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 03/23/2018
ms.author: akjosh
ms.reviewer: cynthn

---

# Use Azure Policy to restrict extensions installation on Linux VMs

If you want to prevent the use or installation of certain extensions on your Linux VMs, you can create an Azure Policy definition using the CLI to restrict extensions for VMs within a resource group. 

This tutorial uses the CLI within the Azure Cloud Shell, which is constantly updated to the latest version. If you want to run the Azure CLI locally, you need to install version 2.0.26 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI]( /cli/azure/install-azure-cli). 

## Create a rules file

In order to restrict what extensions can be installed, you need to have a [rule](../../governance/policy/concepts/definition-structure.md#policy-rule) to provide the logic to identify the extension.

This example shows you how to deny installing extensions published by 'Microsoft.OSTCExtensions' by creating a rules file in Azure Cloud Shell, but if you are working in CLI locally, you can also create a local file and replace the path (~/clouddrive) with the path to the local file on your machine.

In a [bash Cloud Shell](https://shell.azure.com/bash), type:

```bash
vim ~/clouddrive/azurepolicy.rules.json
```

Copy and paste the following .json into the file.

```json
{
	"if": {
		"allOf": [
			{
				"field": "type",
				"equals": "Microsoft.OSTCExtensions/virtualMachines/extensions"
			},
			{
				"field": "Microsoft.OSTCExtensions/virtualMachines/extensions/publisher",
				"equals": "Microsoft.OSTCExtensions"
			},
			{
				"field": "Microsoft.OSTCExtensions/virtualMachines/extensions/type",
				"in": "[parameters('notAllowedExtensions')]"
			}
		]
	},
	"then": {
		"effect": "deny"
	}
}
```

When you are done, hit the **Esc** key and then type **:wq** to save and close the file.


## Create a parameters file

You also need a [parameters](../../governance/policy/concepts/definition-structure.md#parameters) file that creates a structure for you to use for passing in a list of the extensions to block. 

This example shows you how to create a parameters file for Linux VMs in Cloud Shell, but if you are working in CLI locally, you can also create a local file and replace the path (~/clouddrive) with the path to the local file on your machine.

In the [bash Cloud Shell](https://shell.azure.com/bash), type:

```bash
vim ~/clouddrive/azurepolicy.parameters.json
```

Copy and paste the following .json into the file.

```json
{
	"notAllowedExtensions": {
		"type": "Array",
		"metadata": {
			"description": "The list of extensions that will be denied. Example: CustomScriptForLinux, VMAccessForLinux etc.",
			"strongType": "type",
			"displayName": "Denied extension"
		}
	}
}
```

When you are done, hit the **Esc** key and then type **:wq** to save and close the file.

## Create the policy

A policy definition is an object used to store the configuration that you would like to use. The policy definition uses the rules and parameters files to define the policy. Create the policy definition using [az policy definition create](/cli/azure/role/assignment?view=azure-cli-latest).

In this example, the rules and parameters are the files you created and stored as .json files in your cloud shell.

```azurecli-interactive
az policy definition create \
   --name 'not-allowed-vmextension-linux' \
   --display-name 'Block VM Extensions' \
   --description 'This policy governs which VM extensions that are blocked.' \
   --rules '~/clouddrive/azurepolicy.rules.json' \
   --params '~/clouddrive/azurepolicy.parameters.json' \
   --mode All
```


## Assign the policy

This example assigns the policy to a resource group using [az policy assignment create](/cli/azure/policy/assignment). Any VM created in the **myResourceGroup** resource group will not be able to install the Linux VM Access or the Custom Script extensions for Linux. The resource group must exist before you can assign the policy.

Use [az account list](/cli/azure/account?view=azure-cli-latest) to get your subscription ID to use in place of the one in the example.


```azurecli-interactive
az policy assignment create \
   --name 'not-allowed-vmextension-linux' \
   --scope /subscriptions/<subscription Id>/resourceGroups/myResourceGroup \
   --policy "not-allowed-vmextension-linux" \
   --params '{
		"notAllowedExtensions": {
			"value": [
				"VMAccessForLinux",
				"CustomScriptForLinux"
			]
		}
	}'
```

## Test the policy

Test the policy by creating a new VM and trying to add a new user.


```azurecli-interactive
az vm create \
    --resource-group myResourceGroup \
	--name myVM \
	--image UbuntuLTS \
	--generate-ssh-keys
```

Try to create a new user named **myNewUser** using the VM Access extension.

```azurecli-interactive
az vm user update \
  --resource-group myResourceGroup \
  --name myVM \
  --username myNewUser \
  --password 'mynewuserpwd123!'
```



## Remove the assignment

```azurecli-interactive
az policy assignment delete --name 'not-allowed-vmextension-linux' --resource-group myResourceGroup
```
## Remove the policy

```azurecli-interactive
az policy definition delete --name 'not-allowed-vmextension-linux'
```

## Next steps

For more information, see [Azure Policy](../../governance/policy/overview.md).