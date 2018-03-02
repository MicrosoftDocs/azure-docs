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
ms.date: 02/27/2018
ms.author: danis

---

# How to use Azure Policy to Restrict Extensions Installation on VMs

If you want to prevent extension installation, or certain extensions being install to your VMs, you can use an Azure policy to restrict VMs having specific or all extensions installed. Policies are scoped to a resource group. 




## Create the policy

A policy definition is an object used to store the configuration that you would like to use. Create a policy definition using the [New-AzureRmPolicyDefinition](/powershell/module/azurerm.resources/new-azurermpolicydefinition) cmdlet.

In this example, we are going to block the installation of the VM agent that allows you to reset passwords and the Custom Script Extension that can be used to run scripts and commands on a VM. the policy defines the type and publisher of the extensions and refers to **parameters** for defining exactly which extensions should be blocked.



```azurepowershell-interactive
$definition = New-AzureRmPolicyDefinition -Name "not-allowed-vmextension" `
   -DisplayName "Not allowed VM Extensions" `
   -description "This policy governs which VM extensions that are explicitly denied."   `
   -Policy 'https://raw.githubusercontent.com/Azure/azure-policy/master/samples/Compute/not-allowed-vmextension/azurepolicy.rules.json' 
```

The following .json is what is stored as **azurepolicy.rules.json** in GitHub and used for **-Policy** above. If you are creating your own policy, you can use this as a starting point and store it in your own location.

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


## Assign the policy

This example assigns the policy to a resource group using [New-AzureRMPolicyAssignment](/powershell/module/azurerm.resources/new-azurermpolicyassignment). Any VM created in the **myResourceGroup** resource group will not be able to install the VM Access Agent or Custom Script extensions. For Linux VMs, the custom script extension is called **CustomScriptForLinux** and the Vm access extension is **VMAccessForLinux**


Use the [Get-AzureRMSubscription | Format-Table](/powershell/module/azurerm.profile/get-azurermsubscription) cmdlet to get your subscription ID to use in place of the one in the example.

```azurepowershell-interactive
$scope = "/subscriptions/<subscription id>/resourceGroups/myResourceGroup"
$assignment = New-AzureRMPolicyAssignment `
   -Name "not-allowed-vmextension" `
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

To test the policy, try to reset the password on a VM. The following should fail with the message "Set-AzureRmVMAccessExtension : Resource 'myVMAccess' was disallowed by policy."

```
Set-AzureRmVMAccessExtension `
   -ResourceGroupName "myResourceGroup" `
   -VMName "myVM" `
   -Name "myVMAccess" `
   -Location EastUS `
```

In the portal, the VM should fail validation and list what extension is causing the failure.

## Removing the assignment

```azurepowershell-interactive
Remove-AzureRMPolicyAssignment -Name not-allowed-vmextension -Scope $scope
```

## Removing the policy

```azurepowershell-interactive
Remove-AzureRmPolicyDefinition -Name not-allowed-vmextension
```
	
## Next Steps
For more information, please refer to [Azure Policy](../../azure-policy/azure-policy-introduction.md).
