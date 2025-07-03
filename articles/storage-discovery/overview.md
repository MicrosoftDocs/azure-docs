---
title: Introduction to Azure Storage Discovery | Microsoft Docs
description: Storage Discovery provides insights on storage capacity, transactions, and configurations - providing visibility into their storage estate at entire organization level and aiding business decisions.
author: pthippeswamy
ms.service: azure-storage-mover
ms.topic: overview
ms.date: 06/15/2025
ms.author: pthippeswamy
---

<!-- 
!########################################################
STATUS: DRAFT

CONTENT: NOT STARTED

REVIEW Stephen/Fabian: NOT STARTED
EDIT PASS: NOT STARTED

Document score: not run

!########################################################
-->

# What is Azure Storage Discovery?

Azure Storage Discovery provides a centralized view of storage across subscriptions and regions, aggregating metrics on capacity, activity, and configuration. Discovery Workspaces can be customized to track the storage growth and align with business needs, enabling users to drill into specific areas of storage and understand the changes effectively.

Multiple scopes can be created within each Discovery Workspace. Each scope can align with the business needs and can be defined per business unit or team to track the growth of storage estate overtime so that long term decisions can be taken 

## Capabilities of Discovery:
### Visibility into the storage estate
Users can understand their entire data estate, including capacity, transactions, compliance, and security. You can drill down into different parts of the data estate, derive insights.
### Data Security and Compliance
Monitoring the implementation of security and compliance modifications across various subscriptions and regions can be complex. Discovery dashboards help visualize storage configuration effortlessly.
### Storage Cost Prediction and Optimization
Discovery advances user’s understanding of storage costs by offering a detailed breakdown of expenses related to storage and transactions, categorized by each operation type at the individual storage account level.

## Key concepts

### Azure Storage Discovery Workspace (ASDW) 
ASDW is a key resource definition within the Azure Storage Discovery project. ASDW plays a crucial role in managing and visualizing storage data across various scopes, including tenants, subscriptions, and resource groups.

### WorkspaceRoots 
Azure Resource Manager (ARM) resource identifiers that define the root-level boundaries of an Azure Storage Discovery Workspace (ASDW). These roots specify the top-level Azure resources - such as subscriptions and/or resource groups - over which the discovery workspace will operate.

Example:

```json
"workspaceRoots": [
  "/subscriptions/abc123...",
  "/subscriptions/abc123/resourceGroups/rg1"
]
```

This configuration means the workspace will monitor storage accounts under the specified subscription and resource group.

> [!NOTE]
> - Users need Reader access on subscriptions or resource groups to add them to workspaceRoots during ASDW deployment.


### Scope 
A Scope in Azure Storage Discovery defines a logical grouping of storage accounts based on user-defined criteria such as resource tags. Scopes are nested within the boundaries defined by workspaceRoots and are used to filter and organize data for reporting and insights. Users have flexibility to define:

- Scope without any ARM tags will include all storage accounts within the defined scope
- Scope with tags enables users to selectively choose specific storage accounts based on Azure tags assigned to the storage accounts.

## Next steps

The following articles can help you become familiar with the Storage Discovery service.

- [Planning for an Azure Storage Discovery deployment](discovery-deployment-planning.md)
- [Create Storage Discovery Workspace by using the Azure portal](discovery-create.md)
- [Pricing and billing](discovery-pricing-billing.md)
- [Storage Discovery regional coverage](discovery-regionalCoverage.md)