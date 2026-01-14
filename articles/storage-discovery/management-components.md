---
title: Planning for Storage Discovery deployment | Microsoft Docs
titleSuffix: Azure Storage Discovery
description: Storage Discovery provides insights on storage capacity, transactions, and configurations - providing visibility into your storage estate at entire organization level and aiding business decisions.
author: pthippeswamy
ms.service: azure-storage-discovery
ms.topic: overview
ms.date: 10/09/2025
ms.author: pthippeswamy
ms.custom: references_regions
---

# Azure Storage Discovery concepts

This article discusses the key concepts of the Azure Storage Discovery service.

## Azure Storage Discovery workspace 

You deploy the Storage Discovery service by creating a Discovery workspace resource in one of your resource groups.
As part of creating this resource, you also specify what portions of your Azure Storage estate you want to cover.

You can then access your workspace in the Azure portal to find insights in prebuilt reports.
You also need a workspace when asking the Azure Copilot about insights from Storage Discovery.

## Workspace Root

The workspace root designates the storage resources to get insights for. A workspace root can contain a combination of subscriptions and resource groups. You may mix and match these resource types. The identity under which you deploy the workspace [must have permissions](deployment-planning.md#permissions-to-your-storage-resources) to all resources you list at the time of deployment.

Example:

```json
"workspaceRoots": [
  "/subscriptions/ffff5f5f-aa6a-bb7b-cc8c-dddddd9d9d9d",
  "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup"
]
```

This configuration covers storage accounts under the specified subscription and resource group.

## Scope 

You can create several scopes in a workspace. A scope allows you to filter the storage resources the workspace covers and obtain different reports for each of these scopes. Filtering is based on ARM resource tags on your storage resources. A scope contains `tag key name` : `value` combinations or `tag key names` only. When your storage resources have matching ARM resource tags, they're included in this scope.

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

## Select a subscription and region for Azure Storage Discovery workspace deployment

An Azure Storage Discovery workspace can be deployed in one of the supported Azure regions.

[!INCLUDE [control-plane-regions](includes/control-plane-regions.md)]

A workspace can cover all storage resources from the same Entra tenant, regardless of their public cloud locations.

## Permissions

To deploy a Discovery Workspace, user must have following access:

| Scenario | Minimal Role Based Access Control (RBAC) role assignments needed |
|---|---| 
| To deploy Discovery workspace | Contributor access on the subscription or the resource group| 
| To include the subscription or resource groups in a Discovery workspace as part of *workspaceRoots* | Microsoft.Storage/storageAccounts/read access on the subscription or resource group | 
| To view Discovery reports | Reader access on the Discovery workspace |

## Azure Storage Discovery pricing plans

You can choose between different pricing plans for your Discovery workspace.

[!INCLUDE [pricing-plan-differentiation](includes/pricing-plan-differentiation.md)]

## Next steps

- [Learn more about Storage Discovery pricing](pricing.md)
- [Plan a Storage Discovery deployment](deployment-planning.md)
- [Create a Storage Discovery workspace](create-workspace.md)
