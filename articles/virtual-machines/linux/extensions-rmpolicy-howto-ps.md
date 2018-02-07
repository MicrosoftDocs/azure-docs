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


## Create the policy

A policy definition is an object used to store the configuration that you would like to use. Create a policy definition using the [New-AzureRmPolicyDefinition](/powershell/module/azurerm.resources/new-azurermpolicydefinition) cmdlet.

In this example, we are going to block the installation of the VM agent that allows you to reset passwords and the Custom Script Extension that can be used to run scripts and commands on a VM. The extensions to block are listed in .json format in the **--rules** parameter.

```azurepowershell-interactive
$definition = New-AzureRmPolicyDefinition -Name "not-allowed-vmextension" `
   -DisplayName "Not allowed VM Extensions" `
   -description "This policy governs which VM extensions that are explicitly denied." 	`
   -Policy '{
		"notAllowedExtensions": {
			"value": [
				"VMAccessAgent",
				"CustomScriptExtension"
			]
		}
	}'
```


## Assign the policy

This example assigns the policy to a resource group using [New-AzureRMPolicyAssignment](/powershell/module/azurerm.resources/new-azurermpolicyassignment). Any VM created in the **myResourceGroup** resource group will not be able to install the VM Access or Custom Script extensions. Use the [Get-AzureRMSubscription | Format-Table](/powershell/module/azurerm.profile/get-azurermsubscription) cmdlet to get your subscription ID to use in place of the one in the example.

```azurepowershell-interactive
New-AzureRMPolicyAssignment `
   -Name "not-allowed-vmextension" `
   -Scope "/subscriptions/<subscription ID>/resourceGroups/myResourceGroup" `
   -PolicyDefinition $definition 
```

## Test policy

The fastest way to test, is to try to reset the password on a VM.

```
$cred=Get-Credential
Set-AzureRmVMAccessExtension `
   -ResourceGroupName "myResourceGroup" `
   -VMName "myVM" -Name "myVMAccess" `
   -Location EastUS `
   -UserName $cred.GetNetworkCredential().UserName -Password $cred.GetNetworkCredential().Password 
```


## Removing the assignment

```azurepowershell-interactive
Remove-AzureRMPolicyAssignment -Name $assignmentName -Scope $scope
```

## Removing the policy

```azurepowershell-interactive
Remove-AzureRmPolicyDefinition -Name $policyDefinitionName 
```
	
## Next Steps
For more information, please refer to [Azure Policy](../../azure-policy/azure-policy-introduction.md).
