---
title: Cross-tenant management experience with Azure Delegated Resource Management
description: Azure Delegated Resource Management enables a cross-tenant management experience.
author: JnHs
ms.service: service-provider-toolkit
ms.author: jenhayes
ms.date: 04/03/2019
ms.topic: overview
manager: carmonm
---
# Cross-tenant management experience

> [!IMPORTANT]
> Azure Delegated Resource Management is currently in limited public preview. The info in this topic may change before general availability.

This article describes the scenarios that you, as a service provider, can use with [Azure Delegated Resource Management](../concepts/azure-delegated-resource-management.md) to manage Azure resources for multiple customers from within your own tenant in the [Azure portal](https://portal.azure.com).

> [!NOTE]
> Azure Delegated Resource Management can also be used within an enterprise which has multiple Azure Active Directory (Azure AD) tenants of its own to simplify cross-tenant administration.

Currently, the cross-tenant management experience supports the following scenarios with delegated customer resources:

[Azure Automation](https://docs.microsoft.com/en-us/azure/automation/)

- **need to confirm supported scenario(s)**

[Azure Backup](https://docs.microsoft.com/en-us/azure/backup/)

- Back up and restore customer data

[Azure Kubernetes Service (AKS)](https://docs.microsoft.com/en-us/azure/aks/)

- Manage hosted Kubernetes environments and deploy and manage containerized applications within customer tenants

[Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/):

- View alerts for delegated subscriptions and filter on up to 20 subscriptions
- View activity log details for delegated subscriptions
- Query data from remote customer workspaces

[Azure Policy](https://docs.microsoft.com/azure/governance/policy/):

- Compliance snapshots show details for assigned policies within delegated subscriptions
- Create and edit policy definitions within a delegated subscription
- Assign customer-defined policy definitions within the delegated subscription
- Customers see policies authored by the service provider alongside any policies they’ve authored themselves

[Azure Resource Graph](https://docs.microsoft.com/azure/governance/resource-graph/):

- Now includes the tenant ID in returned query results, allowing you to identify which tenant a subscription belongs to in the results 

[Azure Security Center](https://docs.microsoft.com/azure/security-center/):

- Ability to filter and see all info for delegated subscriptions

[Azure Site Recovery](https://docs.microsoft.com/en-us/azure/site-recovery/)

- Manage disaster recovery options for Azure VMs in customer tenants

[Azure Virtual Network](https://docs.microsoft.com/azure/virtual-network/)

- Deploy and manage virtual networks and virtual network interface cards (vNICs) within customer tenants

