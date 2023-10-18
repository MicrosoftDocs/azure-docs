---
title: Best practices for Microsoft Entra roles
description: Best practices for using Microsoft Entra roles.
services: active-directory
author: rolyon
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.subservice: roles
ms.topic: conceptual
ms.date: 09/14/2023
ms.author: rolyon
ms.reviewer: vincesm
ms.custom: it-pro
ms.collection: M365-identity-device-management
---

# Best practices for Microsoft Entra roles

This article describes some of the best practices for using Microsoft Entra role-based access control (Microsoft Entra RBAC). These best practices are derived from our experience with Microsoft Entra RBAC and the experiences of customers like yourself. We encourage you to also read our detailed security guidance at [Securing privileged access for hybrid and cloud deployments in Microsoft Entra ID](security-planning.md).

## 1. Apply principle of least privilege

When planning your access control strategy, it's a best practice to manage to least privilege. Least privilege means you grant your administrators exactly the permission they need to do their job. There are three aspects to consider when you assign a role to your administrators: a specific set of permissions, over a specific scope, for a specific period of time. Avoid assigning broader roles at broader scopes even if it initially seems more convenient to do so. By limiting roles and scopes, you limit what resources are at risk if the security principal is ever compromised. Microsoft Entra RBAC supports over 65 [built-in roles](permissions-reference.md). There are Microsoft Entra roles to manage directory objects like users, groups, and applications, and also to manage Microsoft 365 services like Exchange, SharePoint, and Intune. To better understand Microsoft Entra built-in roles, see [Understand roles in Microsoft Entra ID](concept-understand-roles.md). If there isn't a built-in role that meets your need, you can create your own [custom roles](custom-create.md).  
 
### Finding the right roles

Follow these steps to help you find the right role.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com).

1. Browse to **Identity** > **Roles & admins** > **Roles & admins**.

1. Use the **Service** filter to narrow down the list of roles.

    :::image type="content" source="media/best-practices/roles-administrators.png" alt-text="Roles and administrators page in admin center with Service filter open." lightbox="media/best-practices/roles-administrators.png":::

1. Refer to the [Microsoft Entra built-in roles](permissions-reference.md) documentation. Permissions associated with each role are listed together for better readability. To understand the structure and meaning of role permissions, see [How to understand role permissions](privileged-roles-permissions.md#how-to-understand-role-permissions).

1. Refer to the [Least privileged role by task](delegate-by-task.md) documentation.

## 2. Use Privileged Identity Management to grant just-in-time access

One of the principles of least privilege is that access should be granted only when required. [Microsoft Entra Privileged Identity Management (PIM)](../privileged-identity-management/pim-configure.md) lets you grant just-in-time access to your administrators. Microsoft recommends that you use PIM in Microsoft Entra ID. Using PIM, a user can be made eligible for a Microsoft Entra role where they can then activate the role for a limited time when needed. Privileged access is automatically removed when the timeframe expires. You can also configure PIM settings to require approval, receive notification emails when someone activates their role assignment, or other role settings. Notifications provide an alert when new users are added to highly privileged roles. For more information, see [Configure Microsoft Entra role settings in Privileged Identity Management](../privileged-identity-management/pim-how-to-change-default-settings.md).

## 3. Turn on multi-factor authentication for all your administrator accounts

[Based on our studies](https://techcommunity.microsoft.com/t5/azure-active-directory-identity/your-pa-word-doesn-t-matter/ba-p/731984), your account is 99.9% less likely to be compromised if you use multi-factor authentication (MFA). 
 
You can enable MFA on Microsoft Entra roles using two methods:
- [Role settings](../privileged-identity-management/pim-how-to-change-default-settings.md) in Privileged Identity Management
- [Conditional Access](../conditional-access/howto-conditional-access-policy-admin-mfa.md)

## 4. Configure recurring access reviews to revoke unneeded permissions over time

Access reviews enable organizations to review administrator's access regularly to make sure only the right people have continued access. Regular auditing your administrators is crucial because of following reasons:
- A malicious actor can compromise an account.
- People move teams within a company. If there's no auditing, they can amass unnecessary access over time.

Microsoft recommends that you use access reviews to find and remove role assignments that are no longer needed. This helps you reduce the risk of unauthorized or excessive access and maintain your compliance standards.

For information about access reviews for roles, see [Create an access review of Azure resource and Microsoft Entra roles in PIM](../privileged-identity-management/pim-create-roles-and-resource-roles-review.md). For information about access reviews of groups that are assigned roles, see [Create an access review of groups and applications in Microsoft Entra ID](../governance/create-access-review.md).

## 5. Limit the number of Global Administrators to less than 5

As a best practice, Microsoft recommends that you assign the Global Administrator role to **fewer than five** people in your organization. Global Administrators essentially have unrestricted access, and it is in your best interest to keep the attack surface low. As stated previously, all of these accounts should be protected with multi-factor authentication.

If you have 5 or more privileged Global Administrator role assignments, a **Global Administrators** alert card is displayed on the Microsoft Entra Overview page to help you monitor Global Administrator role assignments.

:::image type="content" source="./media/best-practices/overview-privileged-roles-card.png" alt-text="Screenshot of the Microsoft Entra Overview page that shows a card with the number of privileged role assignments." lightbox="./media/best-practices/overview-privileged-roles-card.png":::

By default, when a user signs up for a Microsoft cloud service, a Microsoft Entra tenant is created and the user is assigned the Global Administrators role. Users who are assigned the Global Administrator role can read and modify almost every administrative setting in your Microsoft Entra organization. With a few exceptions, Global Administrators can also read and modify all configuration settings in your Microsoft 365 organization. Global Administrators also have the ability to elevate their access to read data.

Microsoft recommends that you keep two break glass accounts that are permanently assigned to the Global Administrator role. Make sure that these accounts don't require the same multi-factor authentication mechanism as your normal administrative accounts to sign in, as described in [Manage emergency access accounts in Microsoft Entra ID](../roles/security-emergency-access.md). 

## 6. Limit the number of privileged role assignments to less than 10

Some roles include privileged permissions, such as the ability to update credentials. Since these roles can potentially lead to elevation of privilege, you should limit the use of these privileged role assignments to **fewer than 10** in your organization. If you exceed 10 privileged role assignments, a warning is displayed on the Roles and administrators page.

:::image type="content" source="./media/best-practices/privileged-role-assignments-warning.png" alt-text="Screenshot of the Microsoft Entra roles and administrators page that shows the privileged role assignments warning." lightbox="./media/best-practices/privileged-role-assignments-warning.png":::

 You can identity roles, permissions, and role assignments that are privileged by looking for the **PRIVILEGED** label. For more information, see [Privileged roles and permissions in Microsoft Entra ID](privileged-roles-permissions.md).

<a name='7-use-groups-for-azure-ad-role-assignments-and-delegate-the-role-assignment'></a>

## 7. Use groups for Microsoft Entra role assignments and delegate the role assignment

If you have an external governance system that takes advantage of groups, then you should consider assigning roles to Microsoft Entra groups, instead of individual users. You can also manage role-assignable groups in PIM to ensure that there are no standing owners or members in these privileged groups. For more information, see [Privileged Identity Management (PIM) for Groups](../privileged-identity-management/concept-pim-for-groups.md).

You can assign an owner to role-assignable groups. That owner decides who is added to or removed from the group, so indirectly, decides who gets the role assignment. In this way, a Global Administrator or Privileged Role Administrator can delegate role management on a per-role basis by using groups. For more information, see [Use Microsoft Entra groups to manage role assignments](groups-concept.md).

## 8. Activate multiple roles at once using PIM for Groups

It may be the case that an individual has five or six eligible assignments to Microsoft Entra roles through PIM. They'll have to activate each role individually, which can reduce productivity. Worse still, they can also have tens or hundreds of Azure resources assigned to them, which aggravates the problem.
 
In this case, you should use [Privileged Identity Management (PIM) for Groups](../privileged-identity-management/concept-pim-for-groups.md). Create a PIM for Groups and grant it permanent access to multiple roles (Microsoft Entra ID and/or Azure). Make that user an eligible member or owner of this group. With just one activation, they'll have access to all the linked resources.

![PIM for Groups diagram showing activating multiple roles at once](./media/best-practices/pim-for-groups.png)

<a name='9-use-cloud-native-accounts-for-azure-ad-roles'></a>

## 9. Use cloud native accounts for Microsoft Entra roles

Avoid using on-premises synced accounts for Microsoft Entra role assignments. If your on-premises account is compromised, it can compromise your Microsoft Entra resources as well.

## Next steps

- [Securing privileged access for hybrid and cloud deployments in Microsoft Entra ID](security-planning.md)
