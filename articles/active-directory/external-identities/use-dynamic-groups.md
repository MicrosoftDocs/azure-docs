---
title: Dynamic groups and B2B collaboration - Azure Active Directory | Microsoft Docs
description: Shows how to use Azure AD dynamic groups with Azure Active Directory B2B collaboration 

services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: how-to
ms.date: 02/28/2020

ms.author: mimart
author: msmimart
manager: celestedg
ms.reviewer: mal

ms.collection: M365-identity-device-management
---

# Dynamic groups and Azure Active Directory B2B collaboration

## What are dynamic groups?
Dynamic configuration of security group membership for Azure Active Directory (Azure AD) is available in [the Azure portal](https://portal.azure.com). Administrators can set rules to populate groups that are created in Azure AD based on user attributes (such as userType, department, or country/region). Members can be automatically added to or removed from a security group based on their attributes. These groups can provide access to applications or cloud resources (SharePoint sites, documents) and to assign licenses to members. Read more about dynamic groups in [Dedicated groups in Azure Active Directory](../active-directory-accessmanagement-dedicated-groups.md).

The appropriate [Azure AD Premium P1 or P2 licensing](https://azure.microsoft.com/pricing/details/active-directory/) is required to create and use dynamic groups. Learn more in the article [Create attribute-based rules for dynamic group membership in Azure Active Directory](../users-groups-roles/groups-dynamic-membership.md).

## Creating an "all users" dynamic group
You can create a group containing all users within a tenant using a membership rule. When users are added or removed from the tenant in the future, the group's membership is adjusted automatically.

1. Sign in to the [Azure portal](https://portal.azure.com) with an account that is assigned the Global administrator or User administrator role in the tenant.
1. Select **Azure Active Directory**.
2. Under **Manage**, select **Groups**, and then select **New group**.
1. On the **New Group** page, under **Group type**, select **Security**. Enter a **Group name** and **Group description** for the new group. 
2. Under **Membership type**, select **Dynamic User**, and then select **Add dynamic query**. 
4. Above the **Rule syntax** text box, select **Edit**. On the **Edit rule syntax** page, type the following expression in the text box:

   ```
   user.objectId -ne null
   ```
1. Select **OK**. The rule appears in the Rule syntax box:

   ![Rule syntax for all users dynamic group](media/use-dynamic-groups/all-user-rule-syntax.png)

1.  Select **Save**. The new dynamic group will now include B2B guest users as well as member users.


1. Select **Create** on the **New group** page to create the group.

## Creating a group of members only

If you want your group to exclude guest users and include only members of your tenant, create a dynamic group as described above, but in the **Rule syntax** box, enter the following expression:

```
(user.objectId -ne null) and (user.userType -eq "Member")
```

The following image shows the rule syntax for a dynamic group modified to include members only and exclude guests.

![Shows rule where user type equals member](media/use-dynamic-groups/all-member-user-rule-syntax.png)

## Creating a group of guests only

You might also find it useful to create a new dynamic group that contains only guest users, so that you can apply policies (such as Azure AD Conditional Access policies) to them. Create a dynamic group as described above, but in the **Rule syntax** box, enter the following expression:

```
(user.objectId -ne null) and (user.userType -eq "Guest")
```

The following image shows the rule syntax for a dynamic group modified to include guests only and exclude member users.

![Shows rule where user type equals guest](media/use-dynamic-groups/all-guest-user-rule-syntax.png)

## Next steps

- [B2B collaboration user properties](user-properties.md)
- [Adding a B2B collaboration user to a role](add-guest-to-role.md)
- [Conditional Access for B2B collaboration users](conditional-access.md)

