---
title: Prerequisites for deploying Microsoft Sentinel
description: Learn about prerequisites to deploy Microsoft Sentinel.
author: cwatson
ms.author: cwatson
ms.topic: conceptual
ms.date: 03/05/2024
---

# Prerequisites to deploy Microsoft Sentinel

Before deploying Microsoft Sentinel, make sure that your Azure tenant meets the requirements listed in this article. This article is part of the [Deployment guide for Microsoft Sentinel](deploy-overview.md).

## Prerequisites

- A [Microsoft Entra ID license and tenant](../active-directory/develop/quickstart-create-new-tenant.md), or an [individual account with a valid payment method](https://azure.microsoft.com/free/), are required to access Azure and deploy resources.

- An [Azure subscription](../cost-management-billing/manage/create-subscription.md) to track resource creation and billing.

- Assign [relevant permissions](../role-based-access-control/index.yml) to your subscription. For new subscriptions, designate an [owner/contributor](../role-based-access-control/rbac-and-directory-admin-roles.md).

  - To maintain the least privileged access, assign roles at resource group level.
  - For more control over permissions and access, set up custom roles. For more information, see [Role-based access control](../role-based-access-control/custom-roles.md) (RBAC).
  - For extra separation between users and security users, consider [resource-context](resource-context-rbac.md) or [table-level RBAC](https://techcommunity.microsoft.com/t5/azure-sentinel/table-level-rbac-in-azure-sentinel/ba-p/965043).

  For more information about other roles and permissions supported for Microsoft Sentinel, see [Permissions in Microsoft Sentinel](roles.md).

- A [Log Analytics workspace](../azure-monitor/logs/quick-create-workspace.md) is required to house the data that Microsoft Sentinel ingests and analyzes for detections, analytics, and other features. For more information, see [Microsoft Sentinel workspace architecture best practices](best-practices-workspace-architecture.md).

- The Log Analytics workspace must not have a resource lock applied, and the workspace pricing tier must be Pay-as-You-Go or a commitment tier. Log Analytics legacy pricing tiers and resource locks aren't supported when enabling Microsoft Sentinel. For more information about pricing tiers, see [Simplified pricing tiers for Microsoft Sentinel](enroll-simplified-pricing-tier.md#prerequisites).

- To reduce complexity, we recommend a dedicated [resource group](../azure-resource-manager/management/manage-resource-groups-portal.md) for your Microsoft Sentinel workspace. This resource group should only contain the resources that Microsoft Sentinel uses, including the Log Analytics workspace, any playbooks, workbooks, and so on.

  A dedicated resource group allows for permissions to be assigned once, at the resource group level, with permissions automatically applied to dependent resources. With a dedicated resource group, access management of Microsoft Sentinel is efficient and less prone to improper permissions. Reducing permission complexity ensures users and service principals have the permissions required to complete actions and makes it easier to keep less privileged roles from accessing inappropriate resources.

  Implement extra resource groups to control access by tiers. Use the extra resource groups to house resources only accessible by groups with higher permissions. Use multiple tiers to separate access between resource groups even more granularly.

## Next steps

In this article, you reviewed the prerequisites that help you plan and prepare before deploying Microsoft Sentinel.

> [!div class="nextstepaction"]
> >[Review workspace architecture best practices](best-practices-workspace-architecture.md)
