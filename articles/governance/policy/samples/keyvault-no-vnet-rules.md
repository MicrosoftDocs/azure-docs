---
title: Sample - Audit Key Vaults for no virtual network endpoints
description: This sample policy definition audits Key Vault vaults to detect instances that have no virtual network service endpoints.
author: DCtheGeek
manager: carmonm
ms.service: azure-policy
ms.topic: sample
ms.date: 01/26/2019
ms.author: dacoulte
---
# Sample - Key Vault vaults with no virtual network endpoints

This policy audits for Key Vault vaults that have no virtual network endpoints. Use to enforce your
security requirements. For more information, see [virtual network service endpoints in Key
Vault](../../../key-vault/key-vault-overview-vnet-service-endpoints.md)

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

[!code-json[full](../../../../policy-templates/samples/KeyVault/audit-keyvault-vnet-rules/azurepolicy.json "KeyVault vnet rules")]

> [!NOTE]
> If manually creating a policy in the portal, use the **properties.parameters** and **properties.policyRule**
> portions of the above. Wrap the two sections together with curly braces `{}` to make it valid JSON.

### Policy rules

The JSON defining the rules of the policy, used by Azure CLI and Azure PowerShell.

[!code-json[rule](../../../../policy-templates/samples/KeyVault/audit-keyvault-vnet-rules/azurepolicy.rules.json "Policy rules (JSON)")]

### Policy parameters

This sample policy definition has no parameters defined.

## Azure portal

[![Deploy the Policy sample to Azure](https://azuredeploy.net/deploybutton.png)](https://portal.azure.com/#blade/Microsoft_Azure_Policy/CreatePolicyDefinitionBlade/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-policy%2Fmaster%2Fsamples%2FKeyVault%2Faudit-keyvault-vnet-rules%2Fazurepolicy.json)
[![Deploy the Policy sample to Azure Gov](https://docs.microsoft.com/azure/governance/policy/media/deploy/deployGovbutton.png)](https://portal.azure.us/#blade/Microsoft_Azure_Policy/CreatePolicyDefinitionBlade/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-policy%2Fmaster%2Fsamples%2FKeyVault%2Faudit-keyvault-vnet-rules%2Fazurepolicy.json)

## Azure PowerShell

[!INCLUDE [sample-powershell-install](../../../../includes/sample-powershell-install-no-ssh-az.md)]

### Deploy with Azure PowerShell

```azurepowershell-interactive
# Create the Policy Definition (Subscription scope)
$definition = New-AzPolicyDefinition -Name "audit-keyvault-vnet-rules" -DisplayName "Audit if Key Vault has no virtual network rules" -description "Audits Key Vault vaults if they do not have virtual network service endpoints set up. More information on virtual network service endpoints in Key Vault is available here: https://docs.microsoft.com/azure/key-vault/key-vault-overview-vnet-service-endpoints" -Policy 'https://raw.githubusercontent.com/Azure/azure-policy/master/samples/KeyVault/audit-keyvault-vnet-rules/azurepolicy.rules.json' -Mode Indexed

# Set the scope to a resource group; may also be a subscription or management group
$scope = Get-AzResourceGroup -Name 'YourResourceGroup'

# Create the Policy Assignment
$assignment = New-AzPolicyAssignment -Name 'audit-keyvault-vnet-rules-assignment' -DisplayName 'Audit Key Vault Assignment' -Scope $scope.ResourceId -PolicyDefinition $definition
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
definition=$(az policy definition create --name 'audit-keyvault-vnet-rules' --display-name 'Audit if Key Vault has no virtual network rules' --description 'Audits Key Vault vaults if they do not have virtual network service endpoints set up. More information on virtual network service endpoints in Key Vault is available here: https://docs.microsoft.com/azure/key-vault/key-vault-overview-vnet-service-endpoints' --rules 'https://raw.githubusercontent.com/Azure/azure-policy/master/samples/KeyVault/audit-keyvault-vnet-rules/azurepolicy.rules.json' --mode Indexed)

# Set the scope to a resource group; may also be a subscription or management group
scope=$(az group show --name 'YourResourceGroup')

# Create the Policy Assignment
assignment=$(az policy assignment create --name 'audit-keyvault-vnet-rules-assignment' --display-name 'Audit Key Vault Assignment' --scope `echo $scope | jq '.id' -r` --policy `echo $definition | jq '.name' -r`)
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
  PUT https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/policyDefinitions/audit-keyvault-vnet-rules?api-version=2018-05-01
  ```

- Create the Policy Assignment (Resource Group scope)

  ```http
  PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/YourResourceGroup/providers/Microsoft.Authorization/policyAssignments/audit-keyvault-vnet-rules-assignment?api-version=2018-05-01
  ```

  Use the following JSON example for the Request Body:

  ```json
  {
      "properties": {
          "displayName": "Audit Key Vault Assignment",
          "policyDefinitionId": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/policyDefinitions/audit-keyvault-vnet-rules"
      }
  }
  ```

### Remove with REST API

- Remove the Policy Assignment

  ```http
  DELETE https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/policyAssignments/audit-keyvault-vnet-rules-assignment?api-version=2018-05-01
  ```

- Remove the Policy Definition

  ```http
  DELETE https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/policyDefinitions/audit-keyvault-vnet-rules?api-version=2018-05-01
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