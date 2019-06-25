---
title: Sample - Apply tag and its default value
description: This sample policy definition appends a specified tag name and value, if that tag is not provided.
author: DCtheGeek
manager: carmonm
ms.service: azure-policy
ms.topic: sample
ms.date: 01/26/2019
ms.author: dacoulte
---
# Sample - Apply tag and its default value

This policy appends a specified tag name and value, if that tag is not provided. You specify the tag name and value to apply.

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

[!code-json[main](../../../../policy-templates/samples/built-in-policy/apply-default-tag-value/azurepolicy.json "Apply tag and its default value")]

> [!NOTE]
> If manually creating a policy in the portal, use the **properties.parameters** and **properties.policyRule**
> portions of the above. Wrap the two sections together with curly braces `{}` to make it valid JSON.

### Policy rules

The JSON defining the rules of the policy, used by Azure CLI and Azure PowerShell.

[!code-json[rule](../../../../policy-templates/samples/built-in-policy/apply-default-tag-value/azurepolicy.rules.json "Policy rules (JSON)")]

### Policy parameters

The JSON defining the policy parameters, used by Azure CLI and Azure PowerShell.

[!code-json[parameters](../../../../policy-templates/samples/built-in-policy/apply-default-tag-value/azurepolicy.parameters.json "Policy parameters (JSON)")]

|Name |Type |Field |Description |
|---|---|---|---|
|tagName |String |tags |Name of the tag, such as costCenter|
|tagValue |String |tags |Value of the tag, such as headquarter|

When creating an assignment via PowerShell or Azure CLI, the parameter values can be passed as
JSON in either a string or via a file using `-PolicyParameter` (PowerShell) or `--params` (Azure CLI).
PowerShell also supports `-PolicyParameterObject` which requires passing the cmdlet a Name/Value
hashtable where **Name** is the parameter name and **Value** is the single value or array of values
being passed during assignment.

In this example parameter, a _tagName_ of **costCenter** and _tagValue_ of **headquarter** is
defined.

```json
{
    "tagName": {
        "value": "costCenter"
    },
    "tagValue": {
        "value": "headquarter"
    }
}
```

## Azure portal

[![Deploy the Policy sample to Azure](../media/deploy/deploybutton.png)](https://portal.azure.com/?#blade/Microsoft_Azure_Policy/CreatePolicyDefinitionBlade/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-policy%2Fmaster%2Fsamples%2Fbuilt-in-policy%2Fapply-default-tag-value%2Fazurepolicy.json)
[![Deploy the Policy sample to Azure Gov](../media/deploy/deployGovbutton.png)](https://portal.azure.us/?#blade/Microsoft_Azure_Policy/CreatePolicyDefinitionBlade/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-policy%2Fmaster%2Fsamples%2Fbuilt-in-policy%2Fapply-default-tag-value%2Fazurepolicy.json)

## Azure PowerShell

[!INCLUDE [sample-powershell-install](../../../../includes/sample-powershell-install-no-ssh-az.md)]

### Deploy with Azure PowerShell

```azurepowershell-interactive
# Create the Policy Definition (Subscription scope)
$definition = New-AzPolicyDefinition -Name 'allowed-custom-images' -DisplayName 'Approved VM images' -description 'This policy governs the approved VM images' -Policy 'https://raw.githubusercontent.com/Azure/azure-policy/master/samples/built-in-policy/apply-default-tag-value/azurepolicy.rules.json' -Parameter 'https://raw.githubusercontent.com/Azure/azure-policy/master/samples/built-in-policy/apply-default-tag-value/azurepolicy.parameters.json' -Mode All

# Set the scope to a resource group; may also be a resource, subscription, or management group
$scope = Get-AzResourceGroup -Name 'YourResourceGroup'

# Set the Policy Parameter (JSON format)
$policyparam = '{ "tagName": { "value": "costCenter" }, "tagValue": { "value": "headquarter" } }'

# Create the Policy Assignment
$assignment = New-AzPolicyAssignment -Name 'apply-default-tag-value' -DisplayName 'Apply tag and its default value Assignment' -Scope $scope.ResourceId -PolicyDefinition $definition -PolicyParameter $policyparam
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
definition=$(az policy definition create --name 'apply-default-tag-value' --display-name 'Apply tag and its default value' --description 'Applies a required tag and its default value if it is not specified by the user' --rules 'https://raw.githubusercontent.com/Azure/azure-policy/master/samples/built-in-policy/apply-default-tag-value/azurepolicy.rules.json' --params 'https://raw.githubusercontent.com/Azure/azure-policy/master/samples/built-in-policy/apply-default-tag-value/azurepolicy.parameters.json' --mode All)

# Set the scope to a resource group; may also be a resource, subscription, or management group
scope=$(az group show --name 'YourResourceGroup')

# Set the Policy Parameter (JSON format)
policyparam='{ "tagName": { "value": "costCenter" }, "tagValue": { "value": "headquarter" } }'

# Create the Policy Assignment
assignment=$(az policy assignment create --name 'apply-default-tag-value' --display-name 'Apply tag and its default value Assignment' --scope `echo $scope | jq '.id' -r` --policy `echo $definition | jq '.name' -r` --params "$policyparam")
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

There are several tools that can be used to interact with the Resource Manager REST API such as
[ARMClient](https://github.com/projectkudu/ARMClient) or PowerShell. An example of calling REST API
from PowerShell can be found in the **Aliases** section of [Policy definition structure](../concepts/definition-structure.md#aliases).

## REST API

### Deploy with REST API

- Create the Policy Definition (Subscription scope). Use the [policy definition](#policy-definition) JSON for the Request Body.

  ```http
  PUT https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/policyDefinitions/apply-default-tag-value?api-version=2016-12-01
  ```

- Create the Policy Assignment (Resource Group scope)

  ```http
  PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/YourResourceGroup/providers/Microsoft.Authorization/policyAssignments/apply-default-tag-value-assignment?api-version=2017-06-01-preview
  ```

  Use the following JSON example for the Request Body:

  ```json
  {
      "properties": {
          "displayName": "Apply tag and its default value Assignment",
          "policyDefinitionId": "/subscriptions/<subscriptionId>/providers/Microsoft.Authorization/policyDefinitions/apply-default-tag-value",
          "parameters": {
              "tagName": {
                  "value": "costCenter"
              },
              "tagValue": {
                  "value": "headquarter"
              }
          }
      }
  }
  ```

### Remove with REST API

- Remove the Policy Assignment

  ```http
  DELETE https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/policyAssignments/apply-default-tag-value-assignment?api-version=2017-06-01-preview
  ```

- Remove the Policy Definition

  ```http
  DELETE https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/policyDefinitions/apply-default-tag-value?api-version=2016-12-01
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