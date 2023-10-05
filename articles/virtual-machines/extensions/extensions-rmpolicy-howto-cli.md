---
title: Use Azure Policy to restrict VM extension installation (Linux)
description: Use Azure Policy to restrict VM extension deployments.
ms.topic: article
ms.service: virtual-machines
ms.subservice: extensions
ms.custom: devx-track-azurecli, devx-track-linux
ms.author: gabsta
author: GabstaMSFT
ms.collection: linux
ms.date: 04/11/2023
---

# Use Azure Policy to restrict extensions installation on Linux VMs

If you want to prevent the installation of certain extensions on your Linux VMs, you can create an Azure Policy definition using the Azure CLI to restrict extensions for VMs within a resource group. To learn the basics of Azure VM extensions for Linux, see [Virtual machine extensions and features for Linux](./features-linux.md).

This tutorial uses the CLI within the Azure Cloud Shell, which is constantly updated to the latest version. If you want to run the Azure CLI locally, you need to install version 2.0.26 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli). 

## Create a rules file

In order to restrict what extensions are available, you need to create a [rule](../../governance/policy/concepts/definition-structure.md#policy-rule) to identify the extension.

This example demonstrates how to deny the installation of disallowed VM extensions by defining a rules file in Azure Cloud Shell. However, if you're working in Azure CLI locally, you can create a local file and replace the path (~/clouddrive) with the path to the file on your local file system.

1. In a [bash Cloud Shell](https://shell.azure.com/bash) create the file `~/clouddrive/azurepolicy.rules.json` using any text editor.

2. Copy and paste the following `.json` contents into the new file and save it.

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
				"equals": "Microsoft.OSTCExtensions"
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

## Create a parameters file

You also need a [parameters](../../governance/policy/concepts/definition-structure.md#parameters) file that creates a structure for you to use for passing in a list of the unauthorized extensions. 

This example shows you how to create a parameter file for Linux VMs in Cloud Shell.

1. In the bash Cloud Shell opened before, create the file ~/clouddrive/azurepolicy.parameters.json using any text editor.

2. Copy and paste the following `.json` contents into the new file and save it.

```json
{
	"notAllowedExtensions": {
		"type": "Array",
		"metadata": {
			"description": "The list of extensions that will be denied. Example: CustomScriptForLinux, VMAccessForLinux etc.",
			"displayName": "Denied extension"
		}
	}
}
```

## Create the policy

A _policy definition_ is an object used to store the configuration that you would like to use. The policy definition uses the rules and parameters files to define the policy. Create the policy definition using [az policy definition create](/cli/azure/role/assignment).

In this example, the rules and parameters are the files you created and stored as .json files in Cloud Shell or in your local file system.

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

This example assigns the policy to a resource group using [`az policy assignment create`](/cli/azure/policy/assignment). Any VM created in the **myResourceGroup** resource group will be unable to install the Linux VM Access or the Custom Script Extensions for Linux.

> [!NOTE]
> The resource group must exist before you can assign the policy.

Use [`az account list`](/cli/azure/account) to find your subscription ID and replace the placeholder in the following example:

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

Test the policy by creating a new VM and adding a new user.

```azurecli-interactive
az vm create \
    --resource-group myResourceGroup \
	--name myVM \
	--image myImage \
	--generate-ssh-keys
```

> [!NOTE]
> Replace `myResourceGroup`, `myVM` and `myImage` values accordingly.

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
