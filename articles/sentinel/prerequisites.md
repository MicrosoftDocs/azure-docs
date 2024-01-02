---
title: Prerequisites for deploying Microsoft Sentinel
description: Learn about pre-deployment prerequisites to deploy Microsoft Sentinel.
author: cwatson
ms.author: cwatson
ms.topic: conceptual
ms.date: 08/23/2023
---

# Prerequisites to deploy Microsoft Sentinel

Before deploying Microsoft Sentinel, make sure that your Azure tenant meets the requirements listed in this article. This article is part of the [Deployment guide for Microsoft Sentinel](deploy-overview.md).

## Prerequisites

- An [Microsoft Entra ID license and tenant](../active-directory/develop/quickstart-create-new-tenant.md), or an [individual account with a valid payment method](https://azure.microsoft.com/free/), are required to access Azure and deploy resources.

- After you have a tenant, you must have an [Azure subscription](../cost-management-billing/manage/create-subscription.md) to track resource creation and billing.

- After you have a subscription, you'll need the [relevant permissions](../role-based-access-control/index.yml) to begin using your subscription. If you're using a new subscription, an admin or higher from the Microsoft Entra tenant should be designated as the [owner/contributor](../role-based-access-control/rbac-and-directory-admin-roles.md) for the subscription.

  - To maintain the least privileged access available, assign roles at the level of the resource group.
  - For more control over permissions and access, set up custom roles. For more information, see [Role-based access control](../role-based-access-control/custom-roles.md).
  - For extra separation between users and security users, you might want to use [resource-context](resource-context-rbac.md) or [table-level RBAC](https://techcommunity.microsoft.com/t5/azure-sentinel/table-level-rbac-in-azure-sentinel/ba-p/965043).

  For more information about other roles and permissions supported for Microsoft Sentinel, see [Permissions in Microsoft Sentinel](roles.md).

- A [Log Analytics workspace](../azure-monitor/logs/quick-create-workspace.md) is required to house all of the data that Microsoft Sentinel will be ingesting and using for its detections, analytics, and other features. For more information, see [Microsoft Sentinel workspace architecture best practices](best-practices-workspace-architecture.md). Microsoft Sentinel doesn't support Log Analytics workspaces with a resource lock applied.

- We recommend that when you set up your Microsoft Sentinel workspace, [create a resource group](../azure-resource-manager/management/manage-resource-groups-portal.md) that's dedicated to Microsoft Sentinel and the resources that Microsoft Sentinel uses, including the Log Analytics workspace, any playbooks, workbooks, and so on.

  A dedicated resource group allows for permissions to be assigned once, at the resource group level, with permissions automatically applied to any relevant resources. Managing access via a resource group helps to ensure that you're using Microsoft Sentinel efficiently without potentially issuing improper permissions. Without a resource group for Microsoft Sentinel, where resources are scattered among multiple resource groups, a user or service principal might find themselves unable to perform a required action or view data due to insufficient permissions.

  To implement more access control to resources by tiers, use extra resource groups to house the resources that should be accessed only by those groups. Using multiple tiers of resource groups enables you to separate access between those tiers.

## Next steps

In this article, you reviewed the prerequisites that help you plan and prepare before deploying Microsoft Sentinel.

> [!div class="nextstepaction"]
> >[Review workspace architecture best practices](best-practices-workspace-architecture.md)
