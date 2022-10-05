---
author: inward-eye
ms.author: vlrodrig
ms.service: purview
ms.subservice: purview-data-policies
ms.topic: include
ms.date: 10/05/2022
ms.custom:
---

#### Register Microsoft Purview as a resource provider in other subscriptions
This step is necessary only if the data sources and the Microsoft Purview account are in different subscriptions. Register Microsoft Purview as a resource provider in each subscription where data sources reside by following this guide: [Register resource provider](../../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider). The Microsoft Purview resource provider is: Microsoft.Purview.

To register using PowerShell run the below:
```
Register-AzResourceProvider -ProviderNamespace Microsoft.Purview
```

#### Configure permissions needed to enable *Data use management* on the data source
This step is needed before a policy can be created in Microsoft Purview for that resource. To enable the *Data use management* toggle for a data source, resource group, or subscription, the **same user** must have **both** specific IAM privileges on the resource and specific Microsoft Purview privileges. 

1) The user must have **either one of the following** IAM role combinations on the resource's ARM path or any parent of it (i.e, leveraging IAM permission inheritance).
   - IAM *Owner*
   - Both IAM *Contributor* + IAM *User Access Administrator*

   Follow this [guide to configure Azure RBAC role permissions](../../role-based-access-control/check-access.md). The following screenshot shows how to access the Access Control section in Azure portal experience for the data resource to add a role assignment:

   ![Screenshot shows how to access Access Control in Azure Portal to add a role assignment](../media/how-to-policies-data-owner-authoring-generic/assign-IAM-permissions.png)

2) In addition, the same user needs to have Microsoft Purview Data source administrator (DSA) role at the **root collection level**. See the guide on [managing Microsoft Purview role assignments](../catalog-permissions.md#assign-permissions-to-your-users). The following screenshot shows how to assign Data Source Admin at root collection level:
![Screenshot shows how to assign Data Source Admin at root collection level](../media/how-to-policies-data-owner-authoring-generic/assign-purview-permissions.png)

>[!IMPORTANT]
> Currently, Microsoft Purview roles related to access policy operations must be configured at **root collection level**.

#### Configure Micosoft Purview permissions needed to create and publish data owner policies
The following permissions are needed in Microsoft Purview at the **root collection level**:
- *Policy authors* role can create or edit policies.
- *Data source administrator* role can publish a policy.

Check the section on managing Microsoft Purview role assignments in this [guide](../how-to-create-and-manage-collections.md#add-roles-and-restrict-access-through-collections).

>[!IMPORTANT]
> Currently, Microsoft Purview roles related to access policy operations must be configured at **root collection level**.

>[!Note]
> **Known issues** related to permissions
> In addition to Microsoft Purview *Policy authors* role, user may need *Directory Reader* permission in Azure Active Directory to create a policy. This is a common permission for users in an Azure tenant. You can check permissions for [Azure AD Directory Reader](../../active-directory/roles/permissions-reference.md#directory-readers)

#### Delegation of access provisioning responsibility to roles in Microsoft Purview
>[!IMPORTANT]
> - The IAM Owner role for a data resource can be inherited from parent resource group, subscription or subscription Management group. 
> - Once a resource has been enabled for *Data Use Management*, **any** Microsoft Purview root-collection *policy author* will be able to create access policies against it, and **any** Microsoft Purview root-collection *Data source admin* will be able to publish those policies at **any point afterwards**.
> - **Any** Microsoft Purview root *Collection admin* can assign **new** root-collection *Data Source Admin* and *Policy author* roles.
> - If the Microsoft Purview account is deleted then any published policies will stop being enforced within an amount of time that is dependent on the specific data source. This can have implications both on security and data access availability.

With these considerations in mind, here are some **suggested best practices for permissions:**
- Minimize and carefully vet the users that hold Microsoft Purview *Collection admin*, *Data Source Admin* or *Policy author* roles at root collection level.
- Data owner policies allow for check and balances if you assign the Microsoft Purview *Policy author* and *Data source admin* roles to different people in the organization. With this, before a data policy takes effect, a second person (the *Data source admin*) must review it and explicitly approve it by publishing it.
- A Microsoft Purview account can be deleted by Contributor and Owner roles in IAM. You can check these permissions by navigating to the Access control (IAM) section for your Microsoft Purview account and selecting **Role Assignments**. You can also place a lock to prevent the Microsoft Purview account from being deleted through [ARM locks](../../azure-resource-manager/management/lock-resources.md).
