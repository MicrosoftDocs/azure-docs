---
author: baanders
description: include file for steps overview and permission prerequisite in Azure Digital Twins setup
ms.service: digital-twins
ms.topic: include
ms.date: 8/7/2020
ms.author: baanders
---

>[!NOTE]
>These operations are intended to be completed by a user with the power to manage both resources and user access on the Azure subscription. Although some steps can be completed with lower permissions, cooperation of someone with these permissions will be required to completely set up a usable instance. View more information on this in the [*Prerequisites: Required permissions*](#prerequisites-permission-requirements) section below.

Full setup for a new Azure Digital Twins instance consists of two parts:
1. **Creating the instance**
2. **Setting up user access permissions**: Azure users need to have the *Azure Digital Twins Owner (Preview)* role on the Azure Digital Twins instance to be able to manage it and its data. In this step, you as an Owner/administrator of the Azure subscription will assign this role to the person who will be managing your Azure Digital Twins instance. This may be yourself or someone else in your organization.

To proceed, you will need an Azure subscription. You can set one up for free [here](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Prerequisites: Permission requirements

To be able to complete all the steps in this article, you need to have a [role in your subscription](../articles/role-based-access-control/rbac-and-directory-admin-roles.md) that has the following permissions:
* Create and manage Azure resources
* Manage user access to Azure resources (including granting and delegating permissions)

Common roles that meet this requirement are *Owner*, *Account admin*, or the combination of *User Access Administrator* and *Contributor*. For a complete explanation of roles and permissions, including what permissions are included with other roles, visit [*Classic subscription administrator roles, Azure roles, and Azure AD roles*](../articles/role-based-access-control/rbac-and-directory-admin-roles.md) in the Azure RBAC documentation.

To view your role in your subscription, visit the [subscriptions page](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade) in the Azure portal (you can use this link or look for *Subscriptions* with the portal search bar). Look for the name of the subscription you are using, and view your role for it in the *My role* column:

:::image type="content" source="../articles/digital-twins/media/how-to-set-up-instance/portal/subscriptions-role.png" alt-text="View of the Subscriptions page in the Azure portal, showing user as an owner" lightbox="../articles/digital-twins/media/how-to-set-up-instance/portal/subscriptions-role.png":::

If you find that the value is *Contributor*, or another role that doesn't have the required permissions described above, you can contact the user on your subscription that *does* have these permissions (such as a subscription Owner or Account admin) and proceed in one of the following ways:
* Request that they complete the steps in this article on your behalf
* Request that they elevate your role on the subscription so that you will have the permissions to proceed yourself. Whether this is appropriate depends on your organization and your role within it.