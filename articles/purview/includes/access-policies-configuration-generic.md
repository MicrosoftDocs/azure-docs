---
author: ePpnqeqR
ms.author: vlrodrig
ms.service: purview
ms.subservice: purview-data-policies
ms.topic: include
ms.date: 01/24/2022
ms.custom:
---

### Register Azure Purview as a resource provider in other subscriptions
Execute this step only if the data sources and the Azure Purview account are in different subscriptions. Register Azure Purview as a resource provider in each subscription where data sources reside by following this guide: [Azure resource providers and types](../../azure-resource-manager/management/resource-providers-and-types.md)

### Configure permissions for policy management actions

#### Azure RBAC permissions
To register a data source, resource group, or subscription in Azure Purview with the *Data use Governance* option set, a user must be **either one of the following** IAM role combinations for that resource:
- IAM *Owner*
- Both IAM *Contributor* + IAM *User Access Administrator*
 
Follow this [guide to configure Azure RBAC permissions](../../role-based-access-control/check-access.md)

#### Azure Purview account permissions
>[!IMPORTANT]
> - At this point, policy operations are only supported at **root collection level** and not child collection level.
- User needs Azure Purview *Data source admins* role at the root collection level to:
  - Register a data source source, resource group or subscription for *Data use governance*.
  - Publish a policy.
- User needs Azure Purview *Policy authors* role at root collection level to create or edit policies.

Check the section on managing Azure Purview role assignments in this [guide](../how-to-create-and-manage-collections.md).

>[!WARNING]
> **Known issues** related to permissions
> - In addition to Azure Purview *Policy authors* role, user requires *Directory Reader* permission in Azure Active Directory to create data owner policy. Learn more about permissions for [Azure AD Directory Reader](../../active-directory/roles/permissions-reference.md#directory-readers)
> - Azure Purview *Policy author* role is not sufficient to create policies. It also requires Azure Purview *Data source admin* role as well.
