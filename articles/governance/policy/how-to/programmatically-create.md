---
title: Programmatically create policies and view compliance data with Azure Policy
description: This article walks you through programmatically creating and managing policies for Azure Policy.
services: azure-policy
author: DCtheGeek
ms.author: dacoulte
ms.date: 09/18/2018
ms.topic: conceptual
ms.service: azure-policy
manager: carmonm
---
# Programmatically create policies and view compliance data

This article walks you through programmatically creating and managing policies. Policy definitions
enforce different rules and effects over your resources. Enforcement makes sure that resources stay
compliant with your corporate standards and service level agreements.

For information about compliance, see [getting compliance data](getting-compliance-data.md).

## Prerequisites

Before you begin, make sure that the following prerequisites are met:

1. If you haven't already, install the [ARMClient](https://github.com/projectkudu/ARMClient). It's a tool that sends HTTP requests to Azure Resource Manager-based APIs.

1. Update your AzureRM PowerShell module to the latest version. For more information about the latest version, see [Azure PowerShell](https://github.com/Azure/azure-powershell/releases).

1. Register the Policy Insights resource provider using Azure PowerShell to ensure that your subscription works with the resource provider. To register a resource provider, you must have permission to perform the register action operation for the resource provider. This operation is included in the Contributor and Owner roles. Run the following command to register the resource provider:

   ```azurepowershell-interactive
   Register-AzureRmResourceProvider -ProviderNamespace 'Microsoft.PolicyInsights'
   ```

   For more information about registering and viewing resource providers, see  [Resource Providers and Types](../../../azure-resource-manager/resource-manager-supported-services.md).

1. If you haven't already, install Azure CLI. You can get the latest version at [Install Azure CLI on Windows](/cli/azure/install-azure-cli-windows).

## Create and assign a policy definition

The first step toward better visibility of your resources is to create and assign policies over
your resources. The next step is to learn how to programmatically create and assign a policy. The
example policy audits storage accounts that are open to all public networks using PowerShell, Azure
CLI, and HTTP requests.

### Create and assign a policy definition with PowerShell

1. Use the following JSON snippet to create a JSON file with the name AuditStorageAccounts.json.

   ```json
   {
       "if": {
           "allOf": [{
                   "field": "type",
                   "equals": "Microsoft.Storage/storageAccounts"
               },
               {
                   "field": "Microsoft.Storage/storageAccounts/networkAcls.defaultAction",
                   "equals": "Allow"
               }
           ]
       },
       "then": {
           "effect": "audit"
       }
   }
   ```

   For more information about authoring a policy definition, see [Azure Policy Definition Structure](../concepts/definition-structure.md).

1. Run the following command to create a policy definition using the AuditStorageAccounts.json file.

   ```azurepowershell-interactive
   New-AzureRmPolicyDefinition -Name 'AuditStorageAccounts' -DisplayName 'Audit Storage Accounts Open to Public Networks' -Policy 'AuditStorageAccounts.json'
   ```

   The command creates a policy definition named _Audit Storage Accounts Open to Public Networks_. For more information about other parameters that you can use, see [New-AzureRmPolicyDefinition](/powershell/module/azurerm.resources/new-azurermpolicydefinition).

1. After you create your policy definition, you can create a policy assignment by running the following commands:

   ```azurepowershell-interactive
   $rg = Get-AzureRmResourceGroup -Name 'ContosoRG'
   $Policy = Get-AzureRmPolicyDefinition -Name 'AuditStorageAccounts'
   New-AzureRmPolicyAssignment -Name 'AuditStorageAccounts' -PolicyDefinition $Policy -Scope $rg.ResourceId
   ```

   Replace _ContosoRG_ with the name of your intended resource group.

For more information about managing resource policies using the Azure Resource Manager PowerShell module, see [AzureRM.Resources](/powershell/module/azurerm.resources/#policies).

### Create and assign a policy definition using ARMClient

Use the following procedure to create a policy definition.

1. Copy the following JSON snippet to create a JSON file. You'll call the file in the next step.

   ```json
   "properties": {
       "displayName": "Audit Storage Accounts Open to Public Networks",
       "policyType": "Custom",
       "mode": "Indexed",
       "description": "This policy ensures that storage accounts with exposure to Public Networks are audited.",
       "parameters": {},
       "policyRule": {
           "if": {
               "allOf": [{
                       "field": "type",
                       "equals": "Microsoft.Storage/storageAccounts"
                   },
                   {
                       "field": "Microsoft.Storage/storageAccounts/networkAcls.defaultAction",
                       "equals": "Allow"
                   }
               ]
           },
           "then": {
               "effect": "audit"
           }
       }
   }
   ```

1. Create the policy definition using one of the following calls:

   ```
   # For defining a policy in a subscription
   armclient PUT "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/policyDefinitions/AuditStorageAccounts?api-version=2016-12-01" @<path to policy definition JSON file>

   # For defining a policy in a management group
   armclient PUT "/providers/Microsoft.Management/managementgroups/{managementGroupId}/providers/Microsoft.Authorization/policyDefinitions/AuditStorageAccounts?api-version=2016-12-01" @<path to policy definition JSON file>
   ```

   Replace the preceding {subscriptionId} with the ID of your subscription or {managementGroupId} with the ID of your [management group](../../management-groups/overview.md).

   For more information about the structure of the query, see [Policy Definitions – Create or Update](/rest/api/resources/policydefinitions/createorupdate) and [Policy Definitions – Create or Update At Management Group](/rest/api/resources/policydefinitions/createorupdateatmanagementgroup)

Use the following procedure to create a policy assignment and assign the policy definition at the resource group level.

1. Copy the following JSON snippet to create a JSON policy assignment file. Replace example information in &lt;&gt; symbols with your own values.

   ```json
   {
       "properties": {
           "description": "This policy assignment makes sure that storage accounts with exposure to Public Networks are audited.",
           "displayName": "Audit Storage Accounts Open to Public Networks Assignment",
           "parameters": {},
           "policyDefinitionId": "/subscriptions/<subscriptionId>/providers/Microsoft.Authorization/policyDefinitions/Audit Storage Accounts Open to Public Networks",
           "scope": "/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>"
       }
   }
   ```

1. Create the policy assignment using the following call:

   ```
   armclient PUT "/subscriptions/<subscriptionID>/resourceGroups/<resourceGroupName>/providers/Microsoft.Authorization/policyAssignments/Audit Storage Accounts Open to Public Networks?api-version=2017-06-01-preview" @<path to Assignment JSON file>
   ```

   Replace example information in &lt;&gt; symbols with your own values.

   For more information about making HTTP calls to the REST API, see [Azure REST API Resources](/rest/api/resources/).

### Create and assign a policy definition with Azure CLI

To create a policy definition, use the following procedure:

1. Copy the following JSON snippet to create a JSON policy assignment file.

  ```json
  {
      "if": {
          "allOf": [{
                  "field": "type",
                  "equals": "Microsoft.Storage/storageAccounts"
              },
              {
                  "field": "Microsoft.Storage/storageAccounts/networkAcls.defaultAction",
                  "equals": "Allow"
              }
          ]
      },
      "then": {
          "effect": "audit"
      }
  }
  ```

1. Run the following command to create a policy definition:

   ```azurecli-interactive
   az policy definition create --name 'audit-storage-accounts-open-to-public-networks' --display-name 'Audit Storage Accounts Open to Public Networks' --description 'This policy ensures that storage accounts with exposures to public networks are audited.' --rules '<path to json file>' --mode All
   ```

1. Use the following command to create a policy assignment. Replace example information in &lt;&gt; symbols with your own values.

   ```azurecli-interactive
   az policy assignment create --name '<name>' --scope '<scope>' --policy '<policy definition ID>'
   ```

You can get the Policy Definition ID by using PowerShell with the following command:

```azurecli-interactive
az policy definition show --name 'Audit Storage Accounts with Open Public Networks'
```

The policy definition ID for the policy definition that you created should resemble the following example:

```
"/subscription/<subscriptionId>/providers/Microsoft.Authorization/policyDefinitions/Audit Storage Accounts Open to Public Networks"
```

For more information about how you can manage resource policies with Azure CLI, see [Azure CLI Resource Policies](/cli/azure/policy?view=azure-cli-latest).

## Next steps

Review the following articles for more information about the commands and queries in this article.

- [Azure REST API Resources](/rest/api/resources/)
- [Azure RM PowerShell Modules](/powershell/module/azurerm.resources/#policies)
- [Azure CLI Policy Commands](/cli/azure/policy?view=azure-cli-latest)
- [Policy Insights resource provider REST API reference](/rest/api/policy-insights)
- [Organize your resources with Azure management groups](../../management-groups/overview.md)