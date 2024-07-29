---
title: Roles and permissions 
description: Learn about Advisor permissions and how each may block your ability to configure subscriptions or postpone or dismiss recommendations.
ms.topic: article
ms.date: 07/29/2024
---

# Roles and permissions

Learn more about how Advisor provides recommendations. Your recommendations are based on the following information.

*  Use of your Azure resources.

*  Settings of your Azure resources.

*  Settings of your Azure subscriptions.

Advisor manages your access to recommendations and Advisor features. Advisor uses the [built-in roles](/azure/role-based-access-control/built-in-roles) provided by [Azure role-based access control (Azure RBAC)](/azure/role-based-access-control/overview).

## Roles and associated access

Review the following section to learn more about each role and the associated access.

### [Subscription](#tab/subscription-owner)

* [X] Display recommendations

* [X] Edit rules

* [X] Edit subscription configuration

* [X] Edit resource group configuration

* [X] Dismiss and postpone recommendations

### [Subscription Contributor](#tab/subscription-contributor)

* [X] Display recommendations

* [X] Edit rules

* [X] Edit subscription configuration

* [X] Edit resource group configuration

* [X] Dismiss and postpone recommendations

### [Subscription Reader](#tab/subscription-reader)

* [X] Display recommendations

* [ ] Edit rules

* [ ] Edit subscription configuration

* [ ] Edit resource group configuration

* [ ] Dismiss and postpone recommendations

### [Resource group Owner](#tab/resource-group-owner)

* [X] Display recommendations

* [ ] Edit rules

* [ ] Edit subscription configuration

* [X] Edit resource group configuration

* [X] Dismiss and postpone recommendations

### [Resource group Contributor](#tab/resource-group-contributor)

* [X] Display recommendations

* [ ] Edit rules

* [ ] Edit subscription configuration

* [X] Edit resource group configuration

* [X] Dismiss and postpone recommendations

### [Resource group Reader](#tab/resource-group-reader)

* [X] Display recommendations

* [ ] Edit rules

* [ ] Edit subscription configuration

* [ ] Edit resource group configuration

* [ ] Dismiss and postpone recommendations

### [Resource Owner](#tab/resource-owner)

* [X] Display recommendations

* [ ] Edit rules

* [ ] Edit subscription configuration

* [ ] Edit resource group configuration

* [X] Dismiss and postpone recommendations

### [Resource Contributor](#tab/resource-contributor)

* [X] Display recommendations

* [ ] Edit rules

* [ ] Edit subscription configuration

* [ ] Edit resource group configuration

* [X] Dismiss and postpone recommendations

### [Resource Reader](#tab/resource-reader)

* [X] Display recommendations

* [ ] Edit rules

* [ ] Edit subscription configuration

* [ ] Edit resource group configuration

* [ ] Dismiss and postpone recommendations

<!--
| Role | Display recommendations | Edit rules | Edit subscription configuration | Edit resource group configuration| Dismiss and postpone recommendations |
|:--- |:--- |:--- |:--- |:--- |:--- |
| Subscription Owner | [X] | [X] | [X] | [X] | [X] |
| Subscription Contributor | [X] | [X] | [X] | [X] | [X] |
| Subscription Reader | [X] | [] | [] | [] | [] |
| Resource group Owner | [X] | [] | [] | [X] | [X] |
| Resource group Contributor | [X] | [] | [] | [X] | [X] |
| Resource group Reader | [X] | [] | [] | [] | [] |
| Resource Owner | [X] | [] | [] | [] | [X] |
| Resource Contributor | [X] | [] | [] | [] | [X] |
| Resource Reader | [X] | [] | [] | [] | [] |
-->

> [!NOTE]
> You must have access to the resource associated with the recommendation you may display a recommendation.

## Permissions and unavailable actions

If you do not have correct permission, your ability to perform the associated action is blocked. Review common problems in the following section.

### Configure subscription or resource group is blocked

When you attempt to configure a subscription or resource group, the option to include or exclude is blocked. The blocked status indicates that your permission level for that resource group or subscription in not sufficient. To learn how to change your permission level, review [Tutorial: Grant a user access to Azure resources using the Azure portal](/azure/role-based-access-control/quickstart-assign-role-user-portal "Tutorial: Grant a user access to Azure resources using the Azure portal | Azure RBAC | Microsoft Learn").

### Postpone or dismiss a recommendation is blocked

When you try to postpone or dismiss a recommendation, you receive an error. The error indicates that your permission level is not sufficient. You must have a sufficient permission level to dismiss recommendations.

> [!TIP]
> After you dismiss a recommendation, you must manually reactivate it before it is displayed in your list of recommendations. If you dismiss a recommendation, you may miss important advice that optimizes your Azure deployment.

To postpone or dismiss a recommendation, verify that your permission level for the resource associated with the recommendation is set to Contributor or better. To learn how to change your permission level, review [Tutorial: Grant a user access to Azure resources using the Azure portal](/azure/role-based-access-control/quickstart-assign-role-user-portal "Tutorial: Grant a user access to Azure resources using the Azure portal | Azure RBAC | Microsoft Learn").

## Related content

This article provided an overview of how Advisor uses Azure RBAC to control user permissions and how to resolve common problems. To learn more about Advisor, review the following articles.

*   [What is Azure Advisor](./advisor-overview.md)

*   [Get started with Azure Advisor](./advisor-get-started.md)
