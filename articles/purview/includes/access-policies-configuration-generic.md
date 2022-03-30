---
author: ePpnqeqR
ms.author: vlrodrig
ms.service: purview
ms.subservice: purview-data-policies
ms.topic: include
ms.date: 03/07/2022
ms.custom:
---

### Register Azure Purview as a resource provider in other subscriptions
Execute this step only if the data sources and the Azure Purview account are in different subscriptions. Register Azure Purview as a resource provider in each subscription where data sources reside by following this guide: [Azure resource providers and types](../../azure-resource-manager/management/resource-providers-and-types.md)

### Configure permissions for policy management actions
This section discusses the permissions needed to:
- Make a data resource available for *Data use governance*. This step is needed before a policy can be created in Azure Purview for that resource.
- Author and publish policies in Azure Purview

>[!IMPORTANT]
> Currently, Azure Purview roles related to policy operations must be configured at **root collection level** and not child collection level.

#### Permissions to make a data resource available for *Data use governance*
To enable the *Data use Governance* (DUG) toggle for a data source, resource group, or subscription, the same user needs to have both certain IAM privileges on the resource and certain Azure Purview privileges. 

1) User needs to have **either one of the following** IAM role combinations on the resource:
   - IAM *Owner*
   - Both IAM *Contributor* + IAM *User Access Administrator*

   Follow this [guide to configure Azure RBAC role permissions](../../role-based-access-control/check-access.md).

2) In addition, the same user needs to have Azure Purview Data source administrator role at the **root collection level**. See the guide on [managing Azure Purview role assignments](../catalog-permissions.md#assign-permissions-to-your-users).

#### Permissions for policy authoring and publishing
The following permissions are needed in Azure Purview at the **root collection level**
- *Policy authors* role can create or edit policies.
- *Data source administrator* role can publish a policy.

Check the section on managing Azure Purview role assignments in this [guide](../how-to-create-and-manage-collections.md#add-roles-and-restrict-access-through-collections).

>[!WARNING]
> **Known issues** related to permissions
> - In addition to Azure Purview *Policy authors* role, user requires *Directory Reader* permission in Azure Active Directory to create data owner policy. Learn more about permissions for [Azure AD Directory Reader](../../active-directory/roles/permissions-reference.md#directory-readers)
> - Azure Purview *Policy author* role is not sufficient to create policies. It also requires Azure Purview *Data source admin* role as well.
> - An issues has been reported when IAM Owner, which is required to enable Data use governance, is not directly applied to the data resource but instead inherited from a management group or a subscription. This issue is currently under investigation.
