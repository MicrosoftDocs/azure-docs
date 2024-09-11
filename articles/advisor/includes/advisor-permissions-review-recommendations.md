---
ms.service: advisor
ms.topic: include
ms.date: 08/22/2024

---

### Reviews and personalized recommendations

#### Roles to manage access to Advisor reviews

The permissions vary by role. The roles must be configured for the subscription that was used to publish the review.

| Role | View reviews for a workload and all recommendations associated with the reviews | Triage recommendations associated with the reviews |
|:--- |:--- |:--- |
| Advisor Reviews Reader | X |  |
| Advisor Reviews Contributor | X | X |
| Subscription Reader | X |  |
| Subscription Contributor | X | X |
| Subscription Owner | X | X |

#### Roles to manage access to Advisor personalized recommendations

The roles must be configured for the subscriptions included in the workload under a review.

| Role | View accepted recommendations | Manage the lifecycle of a recommendation |
|:--- |:--- |:--- |
| Advisor Recommendations Contributor (Assessments and Reviews) | X | X |
| Subscription Reader | X |  |
| Subscription Contributor |  | X |
| Subscription Owner |  | X |

Learn how to assign an Azure role, see [Steps to assign an Azure role](/azure/role-based-access-control/role-assignments-steps "Steps to assign an Azure role | Azure RBAC | Microsoft Learn").
