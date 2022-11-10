---
author: inward-eye
ms.author: vlrodrig
ms.service: purview
ms.subservice: purview-data-policies
ms.topic: include
ms.date: 10/28/2022
ms.custom:
---

#### Configure permissions needed to enable *Data use management* on the data source
This step is needed before a policy can be created in Microsoft Purview for that resource. To enable the *Data use management* toggle for a data source, resource group, or subscription, the **same user** must have **both** specific IAM privileges on the resource and specific Microsoft Purview privileges. 

1) The user must have **either one of the following** IAM role combinations on the resource's ARM path or any parent of it (i.e, leveraging IAM permission inheritance).
   - IAM *Owner*
   - Both IAM *Contributor* + IAM *User Access Administrator*

   Follow this [guide to configure Azure RBAC role permissions](../../role-based-access-control/check-access.md). The following screenshot shows how to access the Access Control section in Azure portal experience for the data resource to add a role assignment:

   ![Screenshot shows how to access Access Control in Azure Portal to add a role assignment.](../media/how-to-policies-data-owner-authoring-generic/assign-IAM-permissions.png)

2) In addition, the same user needs to have Microsoft Purview Data source administrator (DSA) role for the collection or a parent collection (if inheritance is enabled). See the guide on [managing Microsoft Purview role assignments](../catalog-permissions.md#assign-permissions-to-your-users). The following screenshot shows how to assign Data Source Admin at root collection level:
![Screenshot shows how to assign Data Source Admin at root collection level.](../media/how-to-policies-data-owner-authoring-generic/assign-purview-permissions.png)

#### Configure Microsoft Purview permissions needed to create or update access policies
The following permissions are needed in Microsoft Purview at the **root collection level**:
- *Policy authors* role can create, update and delete DevOps and Data Owner policies

Check the section on managing Microsoft Purview role assignments in this [guide](../how-to-create-and-manage-collections.md#add-roles-and-restrict-access-through-collections).

>[!IMPORTANT]
> Currently, Microsoft Purview roles related to creating/updating/deleting policies must be configured at **root collection level**.

>[!Note]
> **Known issues** related to permissions
> In addition to Microsoft Purview *Policy authors* role, user may need *Directory Reader* permission in Azure Active Directory to create a policy. This is a common permission for users in an Azure tenant. You can check permissions for [Azure AD Directory Reader](../../active-directory/roles/permissions-reference.md#directory-readers).

#### Configure Microsoft Purview permissions needed to publish Data Owner policies
Data owner policies allow for check and balances if you assign the Microsoft Purview *Policy author* and *Data source admin* roles to different people in the organization. With this, before a data policy takes effect, a second person (the *Data source admin*) must review it and explicitly approve it by publishing it. Publishing is automatic once DevOps policies are created/updated so it does not apply to this type of policies.
The following permissions are needed in Microsoft Purview at the **root collection level**:
- *Data source administrator* role can publish a policy.

Check the section on managing Microsoft Purview role assignments in this [guide](../how-to-create-and-manage-collections.md#add-roles-and-restrict-access-through-collections).

>[!IMPORTANT]
> Currently, Microsoft Purview roles related to publishing Data Owner policies must be configured at **root collection level**.

#### Delegation of access provisioning responsibility to roles in Microsoft Purview
>[!IMPORTANT]
> - Once a resource has been enabled for *Data use management*, **any** Microsoft Purview user with *Policy author* role at root-collection level will be able to provision access to that data source from Microsoft Purview.
> - The IAM Owner role for a data resource can be inherited from parent resource group, subscription or subscription Management group. Check which AAD users, groups and service principals hold or are inheriting IAM Owner for the resource.
> - Note that **Any** Microsoft Purview root *Collection admin* can assign **new** users to root *Policy author* roles. **Any** *Collection admin* can assign **new** users to *Data Source Admin* under the collection. Minimize and carefully vet the users that hold Microsoft Purview *Collection admin*, *Data Source Admin* or *Policy author* roles.
> - If a Microsoft Purview account with published policies is deleted, such policies will stop being enforced within an amount of time dependent on the specific data source. This can have implications both on security and data access availability. The Contributor and Owner roles in IAM are able to delete Microsoft Purview accounts. You can check these permissions by navigating to the Access control (IAM) section for your Microsoft Purview account and selecting **Role Assignments**. You can also place a lock to prevent the Microsoft Purview account from being deleted through [ARM locks](../../azure-resource-manager/management/lock-resources.md).
