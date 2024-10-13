---
title: Roles and permissions 
description: Learn about Advisor permissions, how to manage access to Advisor recommendations and reviews.
ms.topic: article
ms.date: 08/22/2024
---

# Roles and permissions

Learn how to manage access to recommendations and reviews for your organization.

## Roles and associated access

Advisor uses the built-in roles provided by Azure role-based access control (Azure RBAC).

Review the following section to learn more about each role and the associated access.

### Roles to view, dismiss, and postpone recommendations

| Role | View recommendations | Dismiss and postpone recommendations |
|:---|:--- |:--- |
| Subscription Reader | X |  |
| Subscription Contributor | X | X |
| Subscription Owner | X | X |
| Resource group Reader | X |  |
| Resource group Contributor | X | X |
| Resource group Owner | X | X |
| Resource Reader | X |  |
| Resource Contributor | X | X |
| Resource Owner | X | X |

### Roles to edit rules and configurations

| Role | Edit rules | Edit subscription configuration | Edit resource group configuration |
|:---|:--- |:--- |:--- |
| Subscription Contributor | X | X | X |
| Subscription Owner | X | X | X |
| Resource group Contributor |  |  | X |
| Resource group Owner |  |  | X |

> [!NOTE]
> You must have access to the resource associated with the recommendation to view a recommendation.

To learn more about built-in roles, see [Azure built-in roles](/azure/role-based-access-control/built-in-roles "Azure built-in roles | Azure RBAC | Microsoft Learn"). To learn more about Azure role-based access control (Azure RBAC), see [What is Azure role-based access control (Azure RBAC)?](/azure/role-based-access-control/overview "What is Azure role-based access control (Azure RBAC)? | Azure RBAC | Microsoft Learn").

[!INCLUDE [View and manage assessments](./includes/advisor-permissions-review-recommendations.md)]

[!INCLUDE [Reviews and personalized recommendations](./includes/advisor-permissions-waf-assessments.md)]

## Available actions to build custom roles

If your organization requires roles that don't match the Azure built-in roles, create your own custom role. A custom role works like a built-in role and allow you to assign it to users, groups, and service principals at management group, subscription, and resource group scopes. Use the following actions to create your custom role.

| Action | Details |
|:--- |:--- |
| `Microsoft.Advisor/generateRecommendations/action` | Create a Recommendation. |
| `Microsoft.Advisor/register/action` | Register with the Provider. |
| `Microsoft.Advisor/unregister/action` | Unregister with the Provider. |
| `Microsoft.Advisor/advisorScore/read` | Gets Advisor score. |
| `Microsoft.Advisor/configurations/read` | Read Configurations. |
| `Microsoft.Advisor/configurations/write` | Create or update Configuration. |
| `Microsoft.Advisor/generateRecommendations/read` | Get status of `generateRecommendations` action. |
| `Microsoft.Advisor/metadata/read` | Read Metadata. |
| `Microsoft.Advisor/operations/read` | Get operations. |
| `Microsoft.Advisor/recommendations/read` | Read recommendations. |
| `Microsoft.Advisor/recommendations/write` | Create recommendations. |
| `Microsoft.Advisor/recommendations/available/action` | New recommendation is available. |
| `Microsoft.Advisor/recommendations/suppressions/read` | Read Suppressions. |
| `Microsoft.Advisor/recommendations/suppressions/write` | Create or update Suppressions. |
| `Microsoft.Advisor/recommendations/suppressions/delete` | Delete Suppression. |
| `Microsoft.Advisor/suppressions/read` | Read Suppressions. |
| `Microsoft.Advisor/suppressions/write` | Create or update Suppressions. |
| `Microsoft.Advisor/suppressions/delete` | Delete Suppression. |
| `Microsoft.Advisor/assessmentTypes/read` | Reads `AssessmentTypes`. |
| `Microsoft.Advisor/assessments/read` | Reads Assessments. |
| `Microsoft.Advisor/assessments/write` | Create Assessments. |
| `Microsoft.Advisor/resiliencyReviews/read` | Reads `resiliencyReviews`. |
| `Microsoft.Advisor/triageRecommendations/read` | Reads `triageRecommendations`. |
| `Microsoft.Advisor/triageRecommendations/approve/action` | Approves `triageRecommendations`. |
| `Microsoft.Advisor/triageRecommendations/reject/action` | Rejects `triageRecommendations`. |
| `Microsoft.Advisor/triageRecommendations/reset/action` | Resets `triageRecommendations`. |
| `Microsoft.Advisor/workloads/read` | Reads workloads. |

> [!NOTE]
> For example, you must have a sufficient permission level for a virtual machine (VM) to view recommendations associated with the VM.

To learn more about custom roles, see [Azure custom roles](/azure/role-based-access-control/custom-roles "Azure custom roles | Azure RBAC | Microsoft Learn").

## Permissions and unavailable actions

If your permission level is too low, your access to the associated action is blocked. Review common problems in the following section.

### Configure subscription or resource group is blocked

When you try to configure a subscription or resource group, the option to include or exclude is blocked. The blocked status indicates that your permission level for that resource group or subscription is insufficient. To learn how to change your permission level, see [Tutorial: Grant a user access to Azure resources using the Azure portal](/azure/role-based-access-control/quickstart-assign-role-user-portal "Tutorial: Grant a user access to Azure resources using the Azure portal | Azure RBAC | Microsoft Learn").

### Postpone or dismiss is allowed, but sends an error

When you try to postpone or dismiss a recommendation, you receive an error. The error indicates that your permission level is insufficient. You must have a sufficient permission level to dismiss recommendations.

> [!TIP]
> After you dismiss a recommendation, you must manually reactivate it before it is added in your list of recommendations. If you dismiss a recommendation, you may miss important advice that optimizes your Azure deployment.

To postpone or dismiss a recommendation, verify that your permission level for the resource associated with the recommendation is set to Contributor or better. To learn how to change your permission level, see [Tutorial: Grant a user access to Azure resources using the Azure portal](/azure/role-based-access-control/quickstart-assign-role-user-portal "Tutorial: Grant a user access to Azure resources using the Azure portal | Azure RBAC | Microsoft Learn").

## Related content

This article provided an overview of how Advisor uses Azure role-based access control (Azure RBAC) to control user permissions and how to resolve common problems. To learn more about Advisor, see the following articles.

*   [Introduction to Azure Advisor](./advisor-overview.md "Introduction to Azure Advisor | Azure Advisor | Microsoft Learn")

*   [Azure Advisor portal basics](./advisor-get-started.md "Azure Advisor portal basics | Azure Advisor | Microsoft Learn")
