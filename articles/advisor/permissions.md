---
title: Permissions in Azure Advisor 
description: Advisor permissions and how they may block your ability to configure subscriptions or postpone or dismiss recommendations.
ms.topic: article
ms.date: 04/03/2019
---

# Permissions in Azure Advisor

Azure Advisor provides recommendations based on the usage and configuration of your Azure resources and subscriptions. Advisor uses the [built-in roles](../role-based-access-control/built-in-roles.md) provided by [Azure role-based access control (Azure RBAC)](../role-based-access-control/overview.md) to manage your access to recommendations and Advisor features. 

## Roles and their access

The following table defines the roles and the access they have within Advisor:

| **Role** | **View recommendations** | **Edit rules** | **Edit subscription configuration** | **Edit resource group configuration**| **Dismiss and postpone recommendations**|
|---|:---:|:---:|:---:|:---:|:---:|
|Subscription Owner|**X**|**X**|**X**|**X**|**X**|
|Subscription Contributor|**X**|**X**|**X**|**X**|**X**|
|Subscription Reader|**X**|--|--|--|--|
|Resource group Owner|**X**|--|--|**X**|**X**|
|Resource group Contributor|**X**|--|--|**X**|**X**|
|Resource group Reader|**X**|--|--|--|--|
|Resource Owner|**X**|--|--|--|**X**|
|Resource Contributor|**X**|--|--|--|**X**|
|Resource Reader|**X**|--|--|--|--|

> [!NOTE]
> Access to view recommendations is dependent on your access to the recommendation's impacted resource.

## Permissions and unavailable actions

Lack of proper permissions can block your ability to perform actions in Advisor. Following are some common problems.

### Unable to configure subscriptions or resource groups

When you attempt to configure subscriptions or resource groups in Advisor, you may see that the option to include or exclude is disabled. This status indicates that you do not have a sufficient level of permission for that resource group or subscription. To resolve this issue, learn how to [grant a user access](../role-based-access-control/quickstart-assign-role-user-portal.md).

### Unable to postpone or dismiss a recommendation

If you receive an error when trying to postpone or dismiss a recommendation, you may not have sufficient permissions. Make sure that you have at least contributor access to the impacted resource of the recommendation you are postponing or dismissing. To resolve this issue, learn how to [grant a user access](../role-based-access-control/quickstart-assign-role-user-portal.md).

## Next steps

This article gave an overview of how Advisor uses Azure RBAC to control user permissions and how to resolve common issues. To learn more about Advisor, see:

- [What is Azure Advisor?](./advisor-overview.md)
- [Get started with Azure Advisor](./advisor-get-started.md)
