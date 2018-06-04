---
title: Azure Policy sample - Approved VM images
description: This policy requires that only approved custom images are deployed in your environment.
services: azure-policy
author: DCtheGeek
manager: carmonm
ms.service: azure-policy
ms.topic: sample
ms.date: 06/03/2018
ms.author: dacoulte
ms.custom: mvc
---
# Approved VM images

This policy requires that only approved custom images are deployed in your environment. You specify
an array of approved image IDs.

You can deploy this sample policy using the [Azure portal](#azure-portal), with
[Azure PowerShell](#azure-powershell), or with the [Azure CLI](#azure-cli).

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Sample policy

[!code-json[main](../../../policy-templates/samples/compute/allowed-custom-images/azurepolicy.json "Approved VM images")]

## Parameters

|Name |Type |Field |Description |
|---|---|---|---|
|imageIds |Array |Microsoft.Compute/imageIds |The list of approved VM images|

When creating an assignment via PowerShell or Azure CLI, the parameter values can be passed as
JSON in either a string or via a file using `-PolicyParameter` (PowerShell) or `--params` (Azure CLI).
PowerShell also supports `-PolicyParameterObject` which requires passing the cmdlet a Name/Value
hashtable where **Name** is the parameter name and **Value** is the single value or array of values
being passed during assignment.

In this example parameter, only Windows Server 2016 Datacenter and Windows Server 2016 Datacenter
(smalldisk), located in 'Central US' and 'West US 2' (respectively), will be allowed.

```json
{
    "imageIds": {
        "value": [
            "/Subscriptions/{subscriptionId}/Providers/Microsoft.Compute/Locations/centralus/Publishers/MicrosoftWindowsServer/ArtifactTypes/VMImage/Offers/WindowsServer/Skus/2016-Datacenter/Versions/2016.127.20180510",
            "/Subscriptions/{subscriptionId}/Providers/Microsoft.Compute/Locations/westus2/Publishers/MicrosoftWindowsServer/ArtifactTypes/VMImage/Offers/WindowsServer/Skus/2016-Datacenter-smalldisk/Versions/2016.127.20180510",
        ]
    }
}
```

## Azure Portal

[![Deploy to Azure](../media/deploy/deploybutton.png)](https://portal.azure.com/?#blade/Microsoft_Azure_Policy/CreatePolicyDefinitionBlade/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-policy%2Fmaster%2Fsamples%2FCompute%2Fallowed-custom-images%2Fazurepolicy.json)
[![Deploy to Azure Gov](../media/deploy/deployGovbutton.png)](https://portal.azure.us/?#blade/Microsoft_Azure_Policy/CreatePolicyDefinitionBlade/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-policy%2Fmaster%2Fsamples%2FCompute%2Fallowed-custom-images%2Fazurepolicy.json)

## Azure PowerShell

[!INCLUDE [sample-powershell-install](../../../includes/sample-powershell-install-no-ssh.md)]

### Deploy with Azure PowerShell

```azurepowershell-interactive
# Create the Policy Definition
$definition = New-AzureRmPolicyDefinition -Name 'allowed-custom-images' -DisplayName 'Approved VM images' -description 'This policy governs the approved VM images' -Policy 'https://raw.githubusercontent.com/Azure/azure-policy/master/samples/Compute/allowed-custom-images/azurepolicy.rules.json' -Parameter 'https://raw.githubusercontent.com/Azure/azure-policy/master/samples/Compute/allowed-custom-images/azurepolicy.parameters.json' -Mode All

# Set the scope to a resource group; may also be a specific resource, subscription, or management group
$scope = Get-AzureRmResourceGroup -Name 'YourResourceGroup'

# Set the Policy Parameter (JSON format)
$policyparam = '{ "imageIds": { "value": [ "/Subscriptions/{subscriptionId}/Providers/Microsoft.Compute/Locations/centralus/Publishers/MicrosoftWindowsServer/ArtifactTypes/VMImage/Offers/WindowsServer/Skus/2016-Datacenter/Versions/2016.127.20180510", "/Subscriptions/{subscriptionId}/Providers/Microsoft.Compute/Locations/westus2/Publishers/MicrosoftWindowsServer/ArtifactTypes/VMImage/Offers/WindowsServer/Skus/2016-Datacenter-smalldisk/Versions/2016.127.20180510" ] } }'

# Create the Policy Assignment
$assignment = New-AzureRmPolicyAssignment -Name 'allowed-custom-images-assignment' -DisplayName 'Approved VM images Assignment -Scope $scope.ResourceId -PolicyDefinition $definition -PolicyParameter $policyparam
```

### Remove with Azure PowerShell

Run the following commands to remove the previous assignment and definition:

```azurepowershell-interactive
# Remove the Policy Assignment
Remove-AzureRmPolicyAssignment -Id $assignment.ResourceId

# Remove the Policy Definition
Remove-AzureRmPolicyDefinition -Id $definition.ResourceId
```

### Azure PowerShell explanation

The deploy and remove scripts use the following commands. Each command in the following table links to command-specific documentation:

| Command | Notes |
|---|---|
| [New-AzureRmPolicyDefinition](/powershell/module/azurerm.resources/new-azurermpolicydefinition) | Creates a new Azure Policy definition. |
| [Get-AzureRmResourceGroup](/powershell/module/azurerm.resources/get-azurermresourcegroup) | Gets a single resource group. |
| [New-AzureRmPolicyAssignment](/powershell/module/azurerm.resources/new-azurermpolicyassignment) | Creates a new Azure Policy assignment. In this example, we provide it a definition, but it can also take an initiative. |
| [Remove-AzureRmPolicyAssignment](/powershell/module/azurerm.resources/remove-azurermpolicyassignment) | Removes an existing Azure Policy assignment. |
| [Remove-AzureRmPolicyDefinition](/powershell/module/azurerm.resources/remove-azurermpolicydefinition) | Removes an existing Azure Policy definition. |

## Azure CLI

[!INCLUDE [sample-cli-install](../../../includes/sample-cli-install.md)]

### Deploy with Azure CLI

```azurecli-interactive
# Create the Policy Definition
definition=$(az policy definition create --name 'allowed-custom-images' --display-name 'Approved VM images' --description 'This policy governs the approved VM images' --rules 'https://raw.githubusercontent.com/Azure/azure-policy/master/samples/Compute/allowed-custom-images/azurepolicy.rules.json' --params 'https://raw.githubusercontent.com/Azure/azure-policy/master/samples/Compute/allowed-custom-images/azurepolicy.parameters.json' --mode All)

# Set the scope to a resource group; may also be a specific resource, subscription, or management group
scope=$(az group show --name 'YourResourceGroup')

# Set the Policy Parameter (JSON format)
policyparam='{ "imageIds": { "value": [ "/Subscriptions/{subscriptionId}/Providers/Microsoft.Compute/Locations/centralus/Publishers/MicrosoftWindowsServer/ArtifactTypes/VMImage/Offers/WindowsServer/Skus/2016-Datacenter/Versions/2016.127.20180510", "/Subscriptions/{subscriptionId}/Providers/Microsoft.Compute/Locations/westus2/Publishers/MicrosoftWindowsServer/ArtifactTypes/VMImage/Offers/WindowsServer/Skus/2016-Datacenter-smalldisk/Versions/2016.127.20180510" ] } }'

# Create the Policy Assignment
assignment=$(az policy assignment create --name 'allowed-custom-images-assignment' --display-name 'Approved VM images Assignment' --scope `echo $scope | jq '.id' -r` --policy `echo $definition | jq '.name' -r` --params "$policyparam")
```

### Remove with Azure CLI

Run the following commands to remove the previous assignment and definition:

```azurecli-interactive
# Remove the Policy Assignment
az policy assignment delete --name `echo $assignment | jq '.name' -r`

# Remove the Policy Definition
az policy definition delete --name `echo $definition | jq '.name' -r`
```

### Azure CLI explanation

| Command | Notes |
|---|---|
| [az policy definition create](/cli/azure/policy/definition?view=azure-cli-latest#az-policy-definition-create) | Creates a new Azure Policy definition. |
| [az group show](/cli/azure/group?view=azure-cli-latest#az-group-show) | Gets a single resource group. |
| [az policy assignment create](/cli/azure/policy/assignment?view=azure-cli-latest#az-policy-assignment-create) | Creates a new Azure Policy assignment. In this example, we provide it a definition, but it can also take an initiative. |
| [az policy assignment delete](/cli/azure/policy/assignment?view=azure-cli-latest#az-policy-assignment-delete) | Removes an existing Azure Policy assignment. |
| [az policy definition delete](/cli/azure/policy/definition?view=azure-cli-latest#az-policy-definition-delete) | Removes an existing Azure Policy definition. |

## Next steps

- Review more examples at [Azure Policy samples](../json-samples.md).
- Additional Azure Policy examples for Virtual Machines at [Apply policies to Windows VMs](../../virtual-machines/windows/policy.md).