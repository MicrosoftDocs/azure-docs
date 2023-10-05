---
title: Use Azure Policy to restrict VM extension installation (Windows)
description: Use Azure Policy to restrict extension deployments.
ms.topic: article
ms.service: virtual-machines
ms.subservice: extensions
ms.author: gabsta
author: GabstaMSFT
ms.reviewer: erd
ms.collection: windows
ms.date: 04/11/2023 
ms.custom: devx-track-azurepowershell, devx-track-linux
---

# Use Azure Policy to restrict extensions installation on Windows VMs

If you want to prevent the use or installation of certain extensions on your Windows VMs, you can create an Azure Policy definition using PowerShell to restrict extensions for VMs within a resource group.

This tutorial uses Azure PowerShell within the Cloud Shell, which is constantly updated to the latest version. 

## Create a rules file

In order to restrict what extensions can be installed, you need to have a [rule](../../governance/policy/concepts/definition-structure.md#policy-rule) to provide the logic to identify the extension.

This example shows you how to deny extensions published by 'Microsoft. Compute' by creating a rules file in Azure Cloud Shell, but if you're working in PowerShell locally, you can also create a local file and replace the path ($home/clouddrive) with the path to the local file on your machine.

1. In a [Cloud Shell](https://shell.azure.com/powershell), create the file `$home/clouddrive/rules.json` using any text editor.

2. Copy and paste the following .json contents into the file and save it:

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

## Create a parameters file

You also need a [parameters](../../governance/policy/concepts/definition-structure.md#parameters) file that creates a structure for you to use for passing in a list of the extensions to block.

This example shows you how to create a parameters file for VMs in Cloud Shell, but if you're working in PowerShell locally, you can also create a local file and replace the path ($home/clouddrive) with the path to the local file on your machine.

1. In [Cloud Shell](https://shell.azure.com/powershell), create the file `$home/clouddrive/parameters.json` using any text editor.

2. Copy and paste the following .json contents into the file and save it:

```json
{
	"notAllowedExtensions": {
		"type": "Array",
		"metadata": {
			"description": "The list of extensions that will be denied.",
			"displayName": "Denied extension"
		}
	}
}
```

## Create the policy

A policy definition is an object used to store the configuration that you would like to use. The policy definition uses the rules and parameters files to define the policy. Create a policy definition using the [New-AzPolicyDefinition](/powershell/module/az.resources/new-azpolicydefinition) cmdlet.

The policy rules and parameters are the files you created and stored as .json files in your cloud shell. Replace the example `-Policy` and `-Parameter` file paths as needed.

```azurepowershell-interactive
$definition = New-AzPolicyDefinition `
   -Name "not-allowed-vmextension-windows" `
   -DisplayName "Not allowed VM Extensions" `
   -description "This policy governs which VM extensions that are explicitly denied."   `
   -Policy 'C:\Users\ContainerAdministrator\clouddrive\rules.json' `
   -Parameter 'C:\Users\ContainerAdministrator\clouddrive\parameters.json'
```

## Assign the policy

This example assigns the policy to a resource group using [New-AzPolicyAssignment](/powershell/module/az.resources/new-azpolicyassignment). Any VM created in the **myResourceGroup** resource group won't be able to install the VM Access Agent or Custom Script extensions.

Use the [Get-AzSubscription | Format-Table](/powershell/module/az.accounts/get-azsubscription) cmdlet to get your subscription ID to use in place of the one in the example.

```azurepowershell-interactive
$scope = "/subscriptions/<subscription id>/resourceGroups/myResourceGroup"
$assignment = New-AzPolicyAssignment `
   -Name "not-allowed-vmextension-windows" `
   -Scope $scope `
   -PolicyDefinition $definition `
   -PolicyParameter '{
    "notAllowedExtensions": {
        "value": [
            "VMAccessAgent",
            "CustomScriptExtension"
        ]
    }
}'
$assignment
```

## Test the policy

To test the policy, try to use the VM Access extension. The following should fail with the message "Set-AzVMAccessExtension: Resource 'myVMAccess' was disallowed by policy."

```azurepowershell-interactive
Set-AzVMAccessExtension `
   -ResourceGroupName "myResourceGroup" `
   -VMName "myVM" `
   -Name "myVMAccess" `
   -Location EastUS 
```

In the portal, the password change should fail with the "The template deployment failed because of policy violation." message.

## Remove the assignment

```azurepowershell-interactive
Remove-AzPolicyAssignment -Name not-allowed-vmextension-windows -Scope $scope
```

## Remove the policy

```azurepowershell-interactive
Remove-AzPolicyDefinition -Name not-allowed-vmextension-windows
```

## Next steps
For more information, see [Azure Policy](../../governance/policy/overview.md).
