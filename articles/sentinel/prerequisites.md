---
title: Plan and prepare for your Microsoft Sentinel deployment
description: Learn about pre-deployment activities and prerequisites for deploying Microsoft Sentinel.
author: limwainstein
ms.author: lwainstein
ms.topic: conceptual
ms.date: 06/29/2023
---
# Plan and prepare for your Microsoft Sentinel deployment

This article introduces the activities and prerequisites that help you plan and prepare before deploying Microsoft Sentinel.

The plan and prepare phase is typically performed by a SOC architect or related roles.

Before deploying Microsoft Sentinel, we recommend taking the following steps to help focus your deployment on providing maximum value, as soon as possible.

## Plan and prepare overview

| Step | Details |
| --------- | ------- |
| **1. Plan and prepare overview and prerequisites** | **YOU ARE HERE**<br><br>Review the [Azure tenant prerequisites](#azure-tenant-prerequisites). |
| **2. Plan workspace architecture** | Design your Microsoft Sentinel workspace. Consider parameters such as:<br><br>- Whether you'll use a single tenant or multiple tenants<br>- Any compliance requirements you have for data collection and storage<br>- How to control access to Microsoft Sentinel data<br><br>Review these articles:<br><br>1. [Review best practices](best-practices-workspace-architecture.md)<br>2. [Design workspace architecture](design-your-workspace-architecture.md)<br>3. [Review sample workspace designs](sample-workspace-designs.md)<br>4. [Prepare for multiple workspaces](prepare-multiple-workspaces.md) |
| **3. [Prioritize data connectors](prioritize-data-connectors.md)** | Determine which data sources you need and the data size requirements to help you accurately project your deployment's budget and timeline.<br><br>You might determine this information during your business use case review, or by evaluating a current SIEM that you already have in place. If you already have a SIEM in place, analyze your data to understand which data sources provide the most value and should be ingested into Microsoft Sentinel. |
| **4. [Plan roles and permissions](roles.md)** |Use Azure role based access control (RBAC) to create and assign roles within your security operations team to grant appropriate access to Microsoft Sentinel. The different roles give you fine-grained control over what Microsoft Sentinel users can see and do. Azure roles can be assigned in the Microsoft Sentinel workspace directly, or in a subscription or resource group that the workspace belongs to, which Microsoft Sentinel inherits. |
| **5. [Plan costs](billing.md)** |Start planning your budget, considering cost implications for each planned scenario.<br><br>   Make sure that your budget covers the cost of data ingestion for both Microsoft Sentinel and Azure Log Analytics, any playbooks that will be deployed, and so on. |

## Azure tenant prerequisites

Before deploying Microsoft Sentinel, make sure that your Azure tenant has the following requirements:

- An [Azure Active Directory license and tenant](../active-directory/develop/quickstart-create-new-tenant.md), or an [individual account with a valid payment method](https://azure.microsoft.com/free/), are required to access Azure and deploy resources.

- After you have a tenant, you must have an [Azure subscription](../cost-management-billing/manage/create-subscription.md) to track resource creation and billing.

- After you have a subscription, you'll need the [relevant permissions](../role-based-access-control/index.yml) to begin using your subscription. If you are using a new subscription, an admin or higher from the Azure AD tenant should be designated as the [owner/contributor](../role-based-access-control/rbac-and-directory-admin-roles.md) for the subscription.

  - To maintain the least privileged access available, assign roles at the level of the resource group.
  - For more control over permissions and access, set up custom roles. For more information, see [Role-based access control](../role-based-access-control/custom-roles.md).
  - For extra separation between users and security users, you might want to use [resource-context](resource-context-rbac.md) or [table-level RBAC](https://techcommunity.microsoft.com/t5/azure-sentinel/table-level-rbac-in-azure-sentinel/ba-p/965043).

  For more information about other roles and permissions supported for Microsoft Sentinel, see [Permissions in Microsoft Sentinel](roles.md).

- A [Log Analytics workspace](../azure-monitor/logs/quick-create-workspace.md) is required to house all of the data that Microsoft Sentinel will be ingesting and using for its detections, analytics, and other features. For more information, see [Microsoft Sentinel workspace architecture best practices](best-practices-workspace-architecture.md). Microsoft Sentinel doesn't support Log Analytics workspaces with a resource lock applied.

- We recommend that when you set up your Microsoft Sentinel workspace, [create a resource group](../azure-resource-manager/management/manage-resource-groups-portal.md) that's dedicated to Microsoft Sentinel and the resources that Microsoft Sentinel uses, including the Log Analytics workspace, any playbooks, workbooks, and so on.

  A dedicated resource group allows for permissions to be assigned once, at the resource group level, with permissions automatically applied to any relevant resources. Managing access via a resource group helps to ensure that you're using Microsoft Sentinel efficiently without potentially issuing improper permissions. Without a resource group for Microsoft Sentinel, where resources are scattered among multiple resource groups, a user or service principal may find themselves unable to perform a required action or view data due to insufficient permissions.

  To implement more access control to resources by tiers, use extra resource groups to house the resources that should be accessed only by those groups. Using multiple tiers of resource groups enables you to separate access between those tiers.

## Next steps

In this article, you reviewed the activities and prerequisites that help you plan and prepare before deploying Microsoft Sentinel.

> [!div class="nextstepaction"]
> >[Review workspace architecture best practices](best-practices-workspace-architecture.md)