---
title: Bicep template for creating an Azure Storage Discovery workspace
titleSuffix: Azure Storage Discovery
description: Learn how to create an Azure Storage Discovery workspace using a bicep template.
author: fauhse
ms.service: azure-storage-discovery
ms.topic: quickstart-bicep
ms.custom: subject-bicepqs
ms.date: 10/06/2025
ms.author: fauhse
---

# Quickstart: Create a Storage Discovery workspace with a Bicep template

This quickstart shows you how to use a Bicep file to deploy a Storage Discovery workspace in Azure.

[Bicep](../azure-resource-manager/bicep/overview.md) is a domain-specific language (DSL) that uses declarative syntax to deploy Azure resources. It provides concise syntax, reliable type safety, and support for code reuse. Bicep offers the best authoring experience for your infrastructure-as-code solutions in Azure.

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) before you begin.

## Review the Bicep file

The Bicep file used in this quickstart is from [Azure Quickstart Templates](/azure/templates/microsoft.storagediscovery/storagediscoveryworkspaces?pivots=deployment-language-bicep).

```Bicep
    @description('Storage Discovery Workspace name')
    param workspaceName string
    
    @description('Storage Discovery Workspace location')
    param workspaceLocation string = resourceGroup().location
    
    @description('Storage Discovery Workspace SKU')
    param workspaceSku string
    
    @description('Storage Discovery Workspace description')
    param workspaceDescription string = ''
    
    @description('Storage Discovery Workspace roots')
    param workspaceRoots array = []
    
    @description('Storage Discovery Workspace scopes')
    param workspaceScopes array = []
    
    @description('Storage Discovery Workspace tags')
    param tags object
    
    resource storageDiscoveryResource 'Microsoft.StorageDiscovery/storageDiscoveryWorkspaces@2025-09-01' = {
      name: workspaceName
      location: workspaceLocation
      properties: {
        sku: workspaceSku
        workspaceRoots: workspaceRoots
        description: workspaceDescription
        scopes: workspaceScopes
      }
      tags: (empty(tags) ? {} : tags)
    }
```

## Parameters

The template lists [Discovery workspace properties](/azure/templates/microsoft.storagediscovery/storagediscoveryworkspaces?pivots=deployment-language-bicep) that require extra objects:

| Name             | Description |
|------------------|-------------|
|`workspaceRoots`  | The workspace root designates the storage resources to get insights for. This `string[]` can contain a combination of subscription IDs and resource group IDs. You may mix and match these resource types. The identity under which you deploy this template [must have permissions](deployment-planning.md#permissions-to-your-storage-resources) to all resources you list at the time of deployment. |
|`scopes`          | You can create several scopes in a workspace. A scope allows you to filter the storage resources the workspace covers and obtain different reports for each of these scopes. Filtering is based on ARM resource tags on your storage resources. This property expects a `JSON` object containing sections for `tag key name` : `value` combinations or `tag key names` only. When your storage resources have matching ARM resource tags, they're included in this scope.|

Here's an example of the `JSON` structure defining a single scope in a Discovery workspace.
Storage resources are included in this scope when they have both ARM resource tags:

- The tag key `Department` or `department` with case-matching value `Marketing`.
- The tag key `App` or `app`, regardless of its value.

```json
    "scopes": [ 
        { 
        
            "displayName": "Marketing App Resources", 
        
            "resourceTypes": [ 
        
                "Microsoft.Storage/storageAccounts" 
        
            ], 
        
            "tags": { 
        
                "Department": "Marketing" 
        
            }, 
        
            "tagsKeyOnly": [ 
        
                "App" 
        
            ] 
        
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

New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep -adminUsername "<admin-username>"
```

### [Azure CLI](#tab/cli)

```azurecli
az group create --name exampleRG --location eastus

az deployment group create --resource-group exampleRG --template-file main.bicep --parameters adminUsername=<admin-username>
```

---

> [!NOTE]
> Replace `<admin-username>` with a username you can authenticate with.

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
