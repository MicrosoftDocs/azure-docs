---
title: Bicep template for creating an Azure Storage Discovery workspace
titleSuffix: Azure Storage Discovery
description: Learn how to create or update an Azure Storage Discovery workspace and enable capacity details using a Bicep template.
author: fauhse
ms.service: azure-storage-discovery
ms.topic: quickstart-bicep
ms.custom: subject-bicepqs
ms.date: 10/06/2025
ms.author: fauhse
---

# Quickstart: Create a Storage Discovery workspace with a Bicep template

This quickstart shows you how to use a Bicep file to deploy or update a Storage Discovery workspace in Azure, with optional advanced capacity insights.

[Bicep](../azure-resource-manager/bicep/overview.md) is a domain-specific language (DSL) that uses declarative syntax to deploy Azure resources. It provides concise syntax, reliable type safety, and support for code reuse. Bicep offers the best authoring experience for your infrastructure-as-code solutions in Azure.

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) before you begin.
- Ensure that the deploying identity has the [required workspace deployment permissions](deployment-planning.md#permissions). To enable advanced capacity insights, also review the [prerequisites and permissions](deployment-planning.md#prerequisites-for-advanced-capacity-insights). These prerequisites include the built-in [Storage Blob Data Reader](../role-based-access-control/built-in-roles/storage.md#storage-blob-data-reader) role and separately granted `Microsoft.Storage/storageAccounts/read` permission on each workspace root.

## Review the Bicep file

The following Bicep file uses the [Storage Discovery workspace resource reference](/azure/templates/microsoft.storagediscovery/2026-10-01-preview/storagediscoveryworkspaces?pivots=deployment-language-bicep) and API version `2026-10-01-preview`. This preview API supports configuring capacity details during workspace creation or update. Advanced capacity insights require the **Standard** plan.

```Bicep
    @description('Storage Discovery Workspace name')
    param workspaceName string
    
    @description('Storage Discovery Workspace location')
    param workspaceLocation string = resourceGroup().location
    
    @description('Storage Discovery Workspace SKU')
    @allowed([
      'Free'
      'Standard'
    ])
    param workspaceSku string = 'Standard'
    
    @description('Storage Discovery Workspace description')
    param workspaceDescription string = ''
    
    @description('Storage Discovery Workspace roots')
    param workspaceRoots array
    
    @description('Storage Discovery Workspace scopes')
    param workspaceScopes array

    @description('Enable or disable capacity details. Enabled requires the Standard SKU.')
    @allowed([
      'Disabled'
      'Enabled'
    ])
    param capacityDetailStatus string = 'Disabled'

    @description('Optional storage account, container, and blob prefix configurations for capacity details')
    param prefixConfigurations array = []
    
    @description('Storage Discovery Workspace tags')
    param tags object = {}
    
    resource storageDiscoveryResource 'Microsoft.StorageDiscovery/storageDiscoveryWorkspaces@2026-10-01-preview' = {
      name: workspaceName
      location: workspaceLocation
      properties: {
        sku: workspaceSku
        workspaceRoots: workspaceRoots
        description: workspaceDescription
        scopes: workspaceScopes
        capabilities: {
          azureBlobStorage: {
            capacityDetails: {
              status: capacityDetailStatus
            }
            prefixConfigurations: prefixConfigurations
          }
        }
      }
      tags: (empty(tags) ? {} : tags)
    }
```

## Parameters

The following parameters control workspace coverage and capacity details:

| Name             | Description |
|------------------|-------------|
|`workspaceRoots`  | The workspace root designates the storage resources to get insights for. This `string[]` can contain a combination of subscription IDs and resource group IDs. You may mix and match these resource types. The identity under which you deploy this template [must have permissions](deployment-planning.md#permissions-to-your-storage-resources) to all resources you list at the time of deployment. |
|`workspaceScopes` | An array of scopes that filter storage accounts by resource type and Azure resource tags. Each scope can specify `tags` for key-value matches and `tagKeysOnly` for tag-name matches. |
|`workspaceSku` | `Free` or `Standard`. Set to `Standard` to enable advanced capacity insights. |
|`capacityDetailStatus` | `Enabled` or `Disabled`. Defaults to `Disabled`. Set to `Enabled` to enable **Capacity details**. |
|`prefixConfigurations` | Optional array of objects with `storageAccountName`, `containerName`, and `prefix`. Use an empty prefix to cover the entire container. Prefixes must not start with `/`. For details, see [Configure Blob prefixes for analysis](configure-blob-storage-prefixes.md). |

Save the following example as `main.parameters.json`. Replace the subscription ID and resource group name in `workspaceRoots` with the resources you want to analyze. This example enables capacity details and defines a scope that includes storage accounts with both of these tags:

- The tag key `Department` or `department` with case-matching value `Marketing`.
- The tag key `App` or `app`, regardless of its value.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "workspaceName": {
      "value": "myStorageDiscoveryWorkspace"
    },
    "workspaceSku": {
      "value": "Standard"
    },
    "workspaceRoots": {
      "value": [
        "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>"
      ]
    },
    "workspaceScopes": {
      "value": [
        {
          "displayName": "Marketing App Resources",
          "resourceTypes": [
            "Microsoft.Storage/storageAccounts"
          ],
          "tags": {
            "Department": "Marketing"
          },
          "tagKeysOnly": [
            "App"
          ]
        }
      ]
    },
    "capacityDetailStatus": {
      "value": "Enabled"
    }
  }
}
```
> [!NOTE]
> In Azure, tag names (keys) are case-insensitive for operations. Tag values are case-sensitive.

## Deploy the Bicep file

1. Save the Bicep file as `main.bicep` to your local computer.

1. Deploy the Bicep file by using either Azure PowerShell or Azure CLI.

### [Azure PowerShell](#tab/powershell)

```azurepowershell
New-AzResourceGroup -Name exampleRG -Location eastus

New-AzResourceGroupDeployment -ResourceGroupName exampleRG `
    -TemplateFile .\main.bicep -TemplateParameterFile .\main.parameters.json `
    -Mode Incremental
```

### [Azure CLI](#tab/cli)

```azurecli
az group create --name exampleRG --location eastus

az deployment group create --resource-group exampleRG --template-file main.bicep --parameters @main.parameters.json --mode Incremental
```

---

If an access check fails, correct the reported permissions and deploy again. After you enable capacity details, insights can take up to 48 hours to begin populating.

## Update an existing workspace

To update a workspace, use the same template and deployment commands with the existing workspace name, resource group, and location. Set `capacityDetailStatus` to `Enabled` and `workspaceSku` to `Standard` to enable capacity details.

> [!IMPORTANT]
> Bicep deployments describe the desired state, not a partial update. Preserve the workspace's current roots, scopes, description, tags, and prefix configurations in your parameter file. Incremental mode leaves other resources unchanged, but omitted properties on the workspace can reset to defaults. The default `capacityDetailStatus` in this template is `Disabled`, so specify the intended status explicitly when updating.

Preview the changes before deploying:

### [Azure PowerShell](#tab/powershell)

```azurepowershell
New-AzResourceGroupDeployment -ResourceGroupName exampleRG `
    -TemplateFile .\main.bicep -TemplateParameterFile .\main.parameters.json `
    -Mode Incremental -WhatIf
```

### [Azure CLI](#tab/cli)

```azurecli
az deployment group what-if --resource-group exampleRG --template-file main.bicep --parameters @main.parameters.json
```

---

Review the proposed changes, then run the deployment command without `-WhatIf`, or use `az deployment group create`, as shown in the previous section. You don't need to create the resource group again when updating.

## Review deployed resources

Use the Azure portal, Azure PowerShell, or Azure CLI to list the deployed resources in the resource group.

### [Azure PowerShell](#tab/powershell)

```azurepowershell-interactive
Get-AzResource -ResourceGroupName exampleRG
```

### [Azure CLI](#tab/cli)

```azurecli-interactive
az resource list --resource-group exampleRG
```

---

## Next steps

> [!div class="nextstepaction"]
> [Explore Storage Discovery reports](get-started-reports.md)
