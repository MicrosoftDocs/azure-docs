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
ms.date: 02/05/2018
ms.author: danis

---

# How to use Azure Policy to Restrict Extensions Installation on VMs

If you want to prevent extension installation, or certain extensions being install to your VMs, you can use Azure Resource Manager to restrict VMs having specific or all extensions installed, this can be scoped to a resource group. 


This tutorial requires that you are running the Azure CLI version 2.0.26 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli). 

## Block list

To block extensions, create a .json file listing the extensions and save it as **notAllowed.extensions.json. In this example, we are going to block the installation of the VM agent that allows you to reset passwords and the Custom Script Extension that can be used to run scripts and commands on a VM.

```json
{
    "notAllowedExtensions": {
        "value": [
            "VMAccessAgent",
            "CustomScriptExtension"
        ]
    }
}
```


## Create the policy definition

A policy definition sets up the policy and gets information from the .json about the specific extensions that you want to block or limit. Create a policy definition using [az policy definition create](/cli/azure/role/assignment?view=azure-cli-latest#az_role_assignment_create).

```azurecli-interactive
az policy definition create \
   --name 'not-allowed-vmextension' \
   --display-name 'Not allowed VM Extensions' \
   --description 'This policy governs which VM extensions that are explicitly denied.' \
   --rules 'https://raw.githubusercontent.com/Azure/azure-policy/master/samples/Compute/not-allowed-vmextension/azurepolicy.rules.json' \
   --params 'https://raw.githubusercontent.com/Azure/azure-policy/master/samples/Compute/not-allowed-vmextension/azurepolicy.parameters.json' \
   --mode All
```

## Assign the policy
Scope is to be set a resource group, it needs to be specified in this format, for example:
```text
/subscriptions/<subID>/resourceGroups/resourceGroupName
```


### Final assignment
```azurecli-interactive
az policy assignment create --name 'not-allowed-vmextension' --scope /subscriptions/qqqqqqq-yyyy-xxxx-tttt-wwwwwwwww/resourceGroups/myVMs --policy "not-allowed-vmextension" --params /Users/dansol/extensionPolicy/notAllowed.extensions.json
```
## Removing the assignment
```azurecli-interactive
az policy assignment delete --name 'not-allowed-vmextension' --resource-group myVMs
```
## Removing the policy
```azurecli-interactive
az policy definition delete --name 'not-allowed-vmextension'
```


## Example PowerShell Deployment
### Update to the latest version of AzureRM PSCmdLets
```powershell
Install-Module AzureRM

# Authenticate to Azure & Select Subscription
Add-AzureRmAccount

Get-AzureRmSubscription

Set-AzureRmContext -SubscriptionId "<subid>"
```
### Confirm you are in the correct subscription, test listing some VMs

```powershell
$resourceGroupName = "myVMs"
Get-AzureRmVM -ResourceGroupName $resourceGroupName
```
## Create the policy definition
```powershell
$policyDefinitionName = "not-allowed-vmextension"
$definition = New-AzureRmPolicyDefinition -Name $policyDefinitionName -DisplayName "Not allowed VM Extensions" -description "This policy governs which VM extensions that are explicitly denied." -Policy 'https://raw.githubusercontent.com/Azure/azure-policy/master/samples/Compute/not-allowed-vmextension/azurepolicy.rules.json' -Parameter 'https://raw.githubusercontent.com/Azure/azure-policy/master/samples/Compute/not-allowed-vmextension/azurepolicy.parameters.json' -Mode All
$definition
```
## Assign the policy
Scope is to be set a resource group, it needs to be specified in this format, for example:
```text
/subscriptions/<subID>/resourceGroups/resourceGroupName 
```
## Defining the extensions to block
Also note, you need to pass in a parameters file that has the Azure extensions you wish to block. This is an example:

```json
{
    "notAllowedExtensions": {
        "value": [
            "VMAccessAgent",
            "CustomScriptExtension"
        ]
    }
}
```
Save the above JSON to file:  'notAllowed.extensions.json'.

### Final assignment
```powershell
$scope = "/subscriptions/qqqqqqq-yyyy-xxxx-tttt-wwwwwwwww/resourceGroups/myVMs"
$assignmentName = "not-allowed-vmextension"
$extensions = ".....\notAllowed.extensions.json"
$assignment = New-AzureRMPolicyAssignment -Name $assignmentName -Scope $scope -PolicyDefinition $definition -PolicyParameter $extensions
$assignment
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
The fastest way to test, is to try to reset the password on a VM or test executing a script with the Windows Custom Script Extension, this should return an error quickly.

## Next Steps
For more information, please refer to [Azure Policy](../../azure-policy/azure-policy-introduction.md).
