---
title: Prerequisites for deploying Microsoft Sentinel
description: Learn about pre-deployment activities and prerequisites for deploying Microsoft Sentinel.
author: batamig
ms.author: bagol
ms.topic: conceptual
ms.date: 11/09/2021
ms.custom: ignite-fall-2021
---

# Pre-deployment activities and prerequisites for deploying Microsoft Sentinel

This article introduces the pre-deployment activities and prerequisites for deploying Microsoft Sentinel.

## Pre-deployment activities

Before deploying Microsoft Sentinel, we recommend taking the following steps to help focus your deployment on providing maximum value, as soon as possible.

1. Determine which [data sources](connect-data-sources.md) you need and the data size requirements to help you accurately project your deployment's budget and timeline.

   You might determine this information during your business use case review, or by evaluating a current SIEM that you already have in place. If you already have a SIEM in place, analyze your data to understand which data sources provide the most value and should be ingested into Microsoft Sentinel.

1. Design your Microsoft Sentinel workspace. Consider parameters such as:

   - Whether you'll use a single tenant or multiple tenants
   - Any compliance requirements you have for data collection and storage
   - How to control access to Microsoft Sentinel data

   For more information, see [Workspace architecture best practices](best-practices-workspace-architecture.md) and [Sample workspace designs](sample-workspace-designs.md).

1. After the business use cases, data sources, and data size requirements have been identified, [start planning your budget](billing.md), considering cost implications for each planned scenario.

   Make sure that your budget covers the cost of data ingestion for both Microsoft Sentinel and Azure Log Analytics, any playbooks that will be deployed, and so on.

   For more information, see:

   - [Microsoft Sentinel costs and billing](billing.md)
   - [Microsoft Sentinel pricing](https://azure.microsoft.com/pricing/details/azure-sentinel/)
   - [Log Analytics pricing](https://azure.microsoft.com/pricing/details/monitor/)
   - [Logic apps (playbooks) pricing](https://azure.microsoft.com/pricing/details/logic-apps/)
   - [Integrating Azure Data Explorer for long-term log retention](store-logs-in-azure-data-explorer.md)

1. Nominate an engineer or architect lead the deployment, based on requirements and timelines. This individual should lead the deployment and be the main point of contact on your team.

## Azure tenant requirements

Before deploying Microsoft Sentinel, make sure that your Azure tenant has the following requirements:

- An [Azure Active Directory license and tenant](../active-directory/develop/quickstart-create-new-tenant.md), or an [individual account with a valid payment method](https://azure.microsoft.com/free/), are required to access Azure and deploy resources.

- After you have a tenant, you must have an [Azure subscription](../cost-management-billing/manage/create-subscription.md) to track resource creation and billing.

- After you have a subscription, you'll need the [relevant permissions](../role-based-access-control/index.yml) to begin using your subscription. If you are using a new subscription, an admin or higher from the Azure AD tenant should be designated as the [owner/contributor](../role-based-access-control/rbac-and-directory-admin-roles.md) for the subscription.

  - To maintain the least privileged access available, assign roles at the level of the resource group.
  - For more control over permissions and access, set up custom roles. For more information, see [Role-based access control](../role-based-access-control/custom-roles.md).
  - For extra separation between users and security users, you might want to use [resource-context](resource-context-rbac.md) or [table-level RBAC](https://techcommunity.microsoft.com/t5/azure-sentinel/table-level-rbac-in-azure-sentinel/ba-p/965043).

  For more information about other roles and permissions supported for Microsoft Sentinel, see [Permissions in Microsoft Sentinel](roles.md).

- A [Log Analytics workspace](../azure-monitor/logs/quick-create-workspace.md) is required to house all of the data that Microsoft Sentinel will be ingesting and using for its detections, analytics, and other features. For more information, see [Microsoft Sentinel workspace architecture best practices](best-practices-workspace-architecture.md). Microsoft Sentinel doesn't support Log Analytics workspaces with a resource lock applied.

We recommend that when you set up your Microsoft Sentinel workspace, [create a resource group](../azure-resource-manager/management/manage-resource-groups-portal.md) that's dedicated to Microsoft Sentinel and the resources that Microsoft Sentinel uses, including the Log Analytics workspace, any playbooks, workbooks, and so on.

A dedicated resource group allows for permissions to be assigned once, at the resource group level, with permissions automatically applied to any relevant resources. Managing access via a resource group helps to ensure that you're using Microsoft Sentinel efficiently without potentially issuing improper permissions. Without a resource group for Microsoft Sentinel, where resources are scattered among multiple resource groups, a user or service principal may find themselves unable to perform a required action or view data due to insufficient permissions.
To implement more access control to resources by tiers, use extra resource groups to house the resources that should be accessed only by those groups. Using multiple tiers of resource groups enables you to separate access between those tiers.

## Next steps
> [!div class="nextstepaction"]
> >[On-board Microsoft Sentinel](quickstart-onboard.md)
> [!div class="nextstepaction"]
> >[Get visibility into alerts](get-visibility.md)

