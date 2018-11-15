---
title: Invite external users and assign Azure resource roles in PIM | Microsoft Docs
description: Learn how to invite external users and assign Azure resource roles in Azure AD Privileged Identity Management (PIM).
services: active-directory
documentationcenter: ''
author: rolyon
manager: mtillman
ms.service: active-directory
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.component: pim
ms.date: 11/14/2018
ms.author: rolyon
ms.custom: pim
---

# Invite external users and assign Azure resource roles in PIM

Azure Active Directory (Azure AD) Privileged Identity Management (PIM) enables better security management for organizations working with external collaborators, vendors, or freelancers that need access to specific resources in your environment. With PIM, you can use the same role assignment settings and approval workflows for external users that you use for members. To keep track of what external users are doing, you can use the audit logs.

## Check external collaboration settings

1. Sign in to [Azure portal](https://portal.azure.com/).

1. Click **Azure Active Directory** > **User settings**.

1. Click **Manage external collaboration settings**.

    ![External collaboration settings](./media/pim-resource-roles-external-users/external-collaboration-settings.png)

1. Make sure that the **Admins and users in the guest inviter role can invite** switch is set to **Yes**.

## Invite an external user and assign a role

1. Sign in to [Azure portal](https://portal.azure.com/) with a user that is a member of the [Privileged Role Administrator](../users-groups-roles/directory-assign-admin-roles.md#privileged-role-administrator) or [User Account Administrator](../users-groups-roles/directory-assign-admin-roles.md#user-account-administrator) role.

1. Open **Azure AD Privileged Identity Management**.

1. Click **Azure resources**.

1. Use the **Resource filter** to filter the list of managed resources.

1. Click the resource you want to manage, such as a resource, resource group, subscription, or management group.

    You should set the scope to only what the external user needs.

1. Under Manage, click **Roles** to see the list of roles for Azure resources.

    ![Azure resources roles](./media/pim-resource-roles-external-users/resources-roles.png)

1. Click the minimum role that the user will need.

    ![Selected role](./media/pim-resource-roles-external-users/selected-role.png)

1. On the role page, click **Add member** to open the New assignment pane.

1. Click **Select a member or group**.

    ![Select a member or group](./media/pim-resource-roles-external-users/select-member-group.png)

1. To invite an external user, click **Invite**.

    ![Invite a guest](./media/pim-resource-roles-external-users/invite-guest.png)

1. After you have specified an external user, click **Invite**.

    The external user should be added as a selected member.

1. In the Select a member or group pane, click **Select**.

1. In the Membership settings pane, select the assignment type and duration.

    ![Membership settings](./media/pim-resource-roles-external-users/membership-settings.png)

1. To complete the assignment, click **Done** and then **Add**.

    The external user role assignment will appear in your role list.

    ![Role assignment for external user](./media/pim-resource-roles-external-users/role-assignment.png)

## Activate role as an external user

As an external user, you first need to accept the invite to the Azure AD directory and possibly active your role.

1. Open the email with your directory invitation. The email will look similar to the following.

    ![Email invite](./media/pim-resource-roles-external-users/email-invite.png)

1. Click the **Get Started** link in the email.

1. After reviewing the permissions, click **Accept**.

    ![Review permissions](./media/pim-resource-roles-external-users/invite-accept.png)

1. You might be asked to accept a Terms of use and specify whether you want to stay signed in.

    The Azure portal opens. If you are just eligible for a role, you won't have access to resources.

1. To activate your role, open the email with your activate role link. The email will look similar to the following.

    ![Email invite](./media/pim-resource-roles-external-users/email-role-assignment.png)

1. Click **Activate role** to open your eligible roles in PIM.

    ![My roles - Eligible](./media/pim-resource-roles-external-users/my-roles-eligible.png)

1. Under Action, click the **Activate** link.

    Depending on the role settings, you'll need to specify some information to activate the role.

1. Once you have specified the settings for the role, click **Activate** to activate the role.

    ![Activate role](./media/pim-resource-roles-external-users/activate-role.png)

    Unless the administrator has approved your request, you should access to the specified resources.

## View activity for external user

1. As an administrator, open PIM and select the resource that has been shared.

1. Click **Resource audit** to view the activity for that resource.

    ![Resource audit](./media/pim-resource-roles-external-users/audit-resource.png)

1. To view the activity for the external user, click **Azure Active Directory** > **Users** > external user.

1. Click **Audit logs** to see the audit logs for the directory. If necessary, you can specify filters.

    ![Directory audit](./media/pim-resource-roles-external-users/audit-directory.png)

## Next steps

- [Assign Azure AD directory roles in PIM](pim-how-to-add-role-to-user.md)
- [What is guest user access in Azure Active Directory B2B?](../b2b/what-is-b2b.md)
