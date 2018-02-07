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




```
New-AzureRMPolicyAssignment `
   -Name "not-allowed-vmextension" `
   -Scope "/subscriptions/<subscription ID>/resourceGroups/myResourceGroup" `
   -PolicyDefinition $definition 

```

## Removing the assignment
```powershell
Remove-AzureRMPolicyAssignment -Name $assignmentName -Scope $scope
```

## Removing the policy

```powershell
Remove-AzureRmPolicyDefinition -Name $policyDefinitionName 
```

## Testing

The fastest way to test, is to try to reset the password on a VM or test executing a script with the Windows Custom Script Extension, this should return an error.



## Next Steps
For more information, please refer to [Azure Policy](../../azure-policy/azure-policy-introduction.md).
