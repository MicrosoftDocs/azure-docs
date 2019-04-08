---
title: Sample - Allowed locations
description: This sample policy definition requires that all resources are deployed to the approved locations.
author: DCtheGeek
manager: carmonm
ms.service: azure-policy
ms.topic: sample
ms.date: 01/26/2019
ms.author: dacoulte
---
# Sample - Allowed region locations

This policy enables you to restrict the locations your organization can specify when deploying
resources. Use to enforce your geo-compliance requirements. Excludes resource groups,
Microsoft.AzureActiveDirectory/b2cDirectories, and resources that use the 'global' region. You
specify an array of allowed locations.

You can deploy this sample policy using:

- The [Azure portal](#azure-portal)
- [Azure PowerShell](#azure-powershell)
- [Azure CLI](#azure-cli)
- [REST API](#rest-api)

[!INCLUDE [quickstarts-free-trial-note](../../../../includes/quickstarts-free-trial-note.md)]

## Sample policy

### Policy definition

The complete composed JSON policy definition, used by the REST API, 'Deploy to Azure' buttons, and
manually in the portal.

[!code-json[full](../../../../policy-templates/samples/built-in-policy/allowed-locations/azurepolicy.json "Allowed locations")]

> [!NOTE]
> If manually creating a policy in the portal, use the **properties.parameters** and **properties.policyRule**
> portions of the above. Wrap the two sections together with curly braces `{}` to make it valid JSON.

### Policy rules

The JSON defining the rules of the policy, used by Azure CLI and Azure PowerShell.

[!code-json[rule](../../../../policy-templates/samples/built-in-policy/allowed-locations/azurepolicy.rules.json "Policy rules (JSON)")]

### Policy parameters

The JSON defining the policy parameters, used by Azure CLI and Azure PowerShell.

[!code-json[parameters](../../../../policy-templates/samples/built-in-policy/allowed-locations/azurepolicy.parameters.json "Policy parameters (JSON)")]

## Parameters

|Name |Type |Field |Description |
|---|---|---|---|
|listOfAllowedLocations |Array |locations |The list of allowed locations|

When creating an assignment via PowerShell or Azure CLI, the parameter values can be passed as
JSON in either a string or via a file using `-PolicyParameter` (PowerShell) or `--params` (Azure CLI).
PowerShell also supports `-PolicyParameterObject` which requires passing the cmdlet a Name/Value
hashtable where **Name** is the parameter name and **Value** is the single value or array of values
being passed during assignment.

In this example parameter, only the _eastus2_ or _westus_ locations will be allowed.

```json
{
    "listOfAllowedLocations": {
        "value": [
            "eastus2",
            "westus"
        ]
    }
}
```

## Azure portal

[![Deploy the Policy sample to Azure](https://azuredeploy.net/deploybutton.png)](https://portal.azure.com/#blade/Microsoft_Azure_Policy/CreatePolicyDefinitionBlade/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-policy%2Fmaster%2Fsamples%2Fbuilt-in-policy%2Fallowed-locations%2Fazurepolicy.json)
[![Deploy the Policy sample to Azure Gov](https://docs.microsoft.com/azure/governance/policy/media/deploy/deployGovbutton.png)](https://portal.azure.us/#blade/Microsoft_Azure_Policy/CreatePolicyDefinitionBlade/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-policy%2Fmaster%2Fsamples%2Fbuilt-in-policy%2Fallowed-locations%2Fazurepolicy.json)

## Azure PowerShell

[!INCLUDE [sample-powershell-install](../../../../includes/sample-powershell-install-no-ssh-az.md)]

### Deploy with Azure PowerShell

```azurepowershell-interactive
# Create the Policy Definition (Subscription scope)
$definition = New-AzPolicyDefinition -Name "allowed-locations" -DisplayName "Allowed locations" -description "This policy enables you to restrict the locations your organization can specify when deploying resources. Use to enforce your geo-compliance requirements. Excludes resource groups, Microsoft.AzureActiveDirectory/b2cDirectories, and resources that use the 'global' region." -Policy 'https://raw.githubusercontent.com/Azure/azure-policy/master/samples/built-in-policy/allowed-locations/azurepolicy.rules.json' -Parameter 'https://raw.githubusercontent.com/Azure/azure-policy/master/samples/built-in-policy/allowed-locations/azurepolicy.parameters.json' -Mode Indexed

# Set the scope to a resource group; may also be a resource, subscription, or management group
$scope = Get-AzResourceGroup -Name 'YourResourceGroup'

# Set the Policy Parameter (JSON format)
$policyparam = '{ "listOfAllowedLocations": { "value": [ "eastus2", "westus" ] } }'

# Create the Policy Assignment
$assignment = New-AzPolicyAssignment -Name 'allowed-locations-assignment' -DisplayName 'Allowed locations Assignment' -Scope $scope.ResourceId -PolicyDefinition $definition -PolicyParameter $policyparam
```

### Remove with Azure PowerShell

Run the following commands to remove the previous assignment and definition:

```azurepowershell-interactive
# Remove the Policy Assignment
Remove-AzPolicyAssignment -Id $assignment.ResourceId

# Remove the Policy Definition
Remove-AzPolicyDefinition -Id $definition.ResourceId
```

### Azure PowerShell explanation

The deploy and remove scripts use the following commands. Each command in the following table links to command-specific documentation:

| Command | Notes |
|---|---|
| [New-AzPolicyDefinition](/powershell/module/az.resources/New-Azpolicydefinition) | Creates a new Azure Policy definition. |
| [Get-AzResourceGroup](/powershell/module/az.resources/Get-Azresourcegroup) | Gets a single resource group. |
| [New-AzPolicyAssignment](/powershell/module/az.resources/New-Azpolicyassignment) | Creates a new Azure Policy assignment. In this example, we provide it a definition, but it can also take an initiative. |
| [Remove-AzPolicyAssignment](/powershell/module/az.resources/Remove-Azpolicyassignment) | Removes an existing Azure Policy assignment. |
| [Remove-AzPolicyDefinition](/powershell/module/az.resources/Remove-Azpolicydefinition) | Removes an existing Azure Policy definition. |

## Azure CLI

[!INCLUDE [sample-cli-install](../../../../includes/sample-cli-install.md)]

### Deploy with Azure CLI

```azurecli-interactive
# Create the Policy Definition (Subscription scope)
definition=$(az policy definition create --name 'allowed-locations' --display-name 'Allowed locations' --description 'This policy enables you to restrict the locations your organization can specify when deploying resources. Use to enforce your geo-compliance requirements. Excludes resource groups, Microsoft.AzureActiveDirectory/b2cDirectories, and resources that use the 'global' region.' --rules 'https://raw.githubusercontent.com/Azure/azure-policy/master/samples/built-in-policy/allowed-locations/azurepolicy.rules.json' --params 'https://raw.githubusercontent.com/Azure/azure-policy/master/samples/built-in-policy/allowed-locations/azurepolicy.parameters.json' --mode Indexed)

# Set the scope to a resource group; may also be a resource, subscription, or management group
scope=$(az group show --name 'YourResourceGroup')

# Set the Policy Parameter (JSON format)
policyparam='{ "listOfAllowedLocations": { "value": [ "eastus2", "westus" ] } }'

# Create the Policy Assignment
assignment=$(az policy assignment create --name 'allowed-locations-assignment' --display-name 'Allowed locations Assignment' --scope `echo $scope | jq '.id' -r` --policy `echo $definition | jq '.name' -r` --params "$policyparam")
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

## REST API

There are several tools that can be used to interact with the Resource Manager REST API such as
[ARMClient](https://github.com/projectkudu/ARMClient) or PowerShell.

### Deploy with REST API

- Create the Policy Definition (Subscription scope). Use the [policy definition](#policy-definition) JSON for the Request Body.

  ```http
  PUT https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/policyDefinitions/allowed-locations?api-version=2018-05-01
  ```

- Create the Policy Assignment (Resource Group scope)

  ```http
  PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/YourResourceGroup/providers/Microsoft.Authorization/policyAssignments/allowed-locations-assignment?api-version=2018-05-01
  ```

  Use the following JSON example for the Request Body:

  ```json
  {
      "properties": {
          "displayName": "Allowed locations Assignment",
          "policyDefinitionId": "/subscriptions/<subscriptionId>/providers/Microsoft.Authorization/policyDefinitions/allowed-locations",
          "parameters": {
              "listOfAllowedLocations": {
                  "value": [
                      "eastus2",
                      "westus"
                  ]
              }
          }
      }
  }
  ```

### Remove with REST API

- Remove the Policy Assignment

  ```http
  DELETE https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/policyAssignments/allowed-locations-assignment?api-version=2018-05-01
  ```

- Remove the Policy Definition

  ```http
  DELETE https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/policyDefinitions/allowed-locations?api-version=2018-05-01
  ```

### REST API explanation

| Service | Group | Operation | Notes |
|---|---|---|---|
| Resource Management | Policy Definitions | [Create](/rest/api/resources/policydefinitions/createorupdate) | Creates a new Azure Policy definition at a subscription. Alternative: [Create at management group](/rest/api/resources/policydefinitions/createorupdateatmanagementgroup) |
| Resource Management | Policy Assignments | [Create](/rest/api/resources/policyassignments/create) | Creates a new Azure Policy assignment. In this example, we provide it a definition, but it can also take an initiative. |
| Resource Management | Policy Assignments | [Delete](/rest/api/resources/policyassignments/delete) | Removes an existing Azure Policy assignment. |
| Resource Management | Policy Definitions | [Delete](/rest/api/resources/policydefinitions/delete) | Removes an existing Azure Policy definition. Alternative: [Delete at management group](/rest/api/resources/policydefinitions/deleteatmanagementgroup) |

## Next steps

- Review additional [Azure Policy samples](index.md)
- Review [Azure Policy definition structure](../concepts/definition-structure.md)