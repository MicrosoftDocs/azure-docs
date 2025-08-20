---
title: Planning for Storage Discovery deployment | Microsoft Docs
titleSuffix: Azure Storage Discovery
description: Storage Discovery provides insights on storage capacity, transactions, and configurations - providing visibility into your storage estate at entire organization level and aiding business decisions.
author: fauhse
ms.service: azure-storage-discovery
ms.topic: overview
ms.date: 08/01/2025
ms.author: fauhse
ms.custom: references_regions
---

# Azure Storage Discovery preview concepts

The concepts and terminology used throughout this documentation are defined below.

## Key concepts

### Azure Storage Discovery workspace 
The Azure Storage Discovery workspace (ASDW) is the resource used to deploy and manage Storage Discovery in your subscription. It defines the scope of analysis - such as subscriptions or resource groups and once created, it enables visibility into capacity, transactions, and configuration trends across storage accounts within the selected "scope".

### Workspace Root
Azure Resource Manager (ARM) resource identifiers that define the root-level boundaries of an Azure Storage Discovery Workspace (ASDW). These roots specify the top-level Azure resources - such as subscriptions and/or resource groups - over which the discovery workspace will operate.

Example:

```json
"workspaceRoots": [
  "/subscriptions/ffff5f5f-aa6a-bb7b-cc8c-dddddd9d9d9d",
  "/subscriptions/ffff5f5f-aa6a-bb7b-cc8c-dddddd9d9d9d/resourceGroups/myResourceGroup"
]
```

This configuration means the workspace will monitor storage accounts under the specified subscription and resource group.

> [!NOTE]
> - Users need Reader access on subscriptions or resource groups to add them to workspace roots during Discovery workspace deployment.


### Scope 
A Scope in Azure Storage Discovery represents a logical grouping of storage accounts based on user-defined criteria, such as resource tags. Scopes are configured within the boundaries of a workspace and serve as filters to organize and segment data for reporting and insights. By defining scopes, users can tailor their workspace to align with specific business units, workloads, or any segment of their Azure Storage environment they wish to monitor. This enables more targeted visibility and actionable insights across distinct areas of the storage estate. Users have flexibility to define:

- A scope without any ARM tags will include all storage accounts within the defined scope
- A scope with tags enables users to selectively choose specific storage accounts based on Azure tags assigned to the storage accounts.

Deploying Azure Storage Discovery workspace in one of your Azure subscriptions is the first step in starting aggregation of storage account metrics.

## Select a subscription and region for Azure Storage Discovery workspace deployment

Azure Storage Discovery workspace can be deployed in a subscription of your choice and in one of the supported regions.  
[!INCLUDE [control-plane-regions](includes/control-plane-regions.md)]

Once a discovery workspace is created in a specific region, it can aggregate metrics from storage accounts located across a broader set of supported regions, irrespective of the region in which the discovery workspace itself resides.
[!INCLUDE [data-plane-regions](includes/data-plane-regions.md)]

## Permissions

To deploy a Discovery Workspace, user must have following access:

| Scenario | Minimal RBAC role assignments needed |
|---|---| 
| To deploy Discovery workspace | Contributor access on the subscription or the resource group| 
| To include the subscription or resource groups in a Discovery workspace as part of *workspaceRoots* | Microsoft.Storage/storageAccounts/read access on the subscription or resource group | 
| To view Discovery reports | Reader access on the Discovery workspace |

## Azure Storage Discovery pricing plans

Storage Discovery is available in two different SKUs or pricing plans.

[!INCLUDE [pricing-plan-differentiation](includes/pricing-plan-differentiation.md)]