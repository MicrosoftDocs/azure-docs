---
author: baanders
description: include file for permission prerequisite in Azure Digital Twins setup 
ms.service: digital-twins
ms.topic: include
ms.date: 10/14/2020
ms.author: baanders
---

To be able to complete all the following steps, you need to have a [role in your subscription](../articles/role-based-access-control/rbac-and-directory-admin-roles.md) that has the following permissions:
* Create and manage Azure resources
* Manage user access to Azure resources (including granting and delegating permissions)

Common roles that meet this requirement are **Owner**, **Account admin**, or the combination of **User Access Administrator** and **Contributor**. For a complete explanation of roles and permissions, including what permissions are included with other roles, visit [Azure roles, Azure AD roles, and classic subscription administrator roles](../articles/role-based-access-control/rbac-and-directory-admin-roles.md) in the Azure RBAC documentation.

To view your role in your subscription, visit the [subscriptions page](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade) in the Azure portal (you can use this link or look for *Subscriptions* with the portal search bar). Look for the name of the subscription you are using, and view your role for it in the **My role** column:

:::image type="content" source="../articles/digital-twins/media/how-to-set-up-instance/portal/subscriptions-role.png" alt-text="Screenshot of the Subscriptions page in the Azure portal, showing user as an owner." lightbox="../articles/digital-twins/media/how-to-set-up-instance/portal/subscriptions-role.png":::

If you find that the value is **Contributor**, or another role that doesn't have the required permissions described above, you can contact the user on your subscription that does have these permissions (such as a subscription Owner or Account admin) and proceed in one of the following ways:
* Request that they complete the role assignment steps on your behalf.
* Request that they elevate your role on the subscription so that you will have the permissions to proceed yourself. Whether this is appropriate depends on your organization and your role within it.