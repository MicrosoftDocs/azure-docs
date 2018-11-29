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
ms.date: 11/29/2018
ms.author: rolyon
ms.custom: pim
---

# Invite external users and assign Azure resource roles in PIM

Azure Activity Directory (Azure AD) business-to-business (B2B) is a set of capabilities within Azure AD that enables organizations to collaborate with external users and vendors using any account. When you combine B2B with Azure AD Privileged Identity Management (PIM), you can continue to apply your compliance and governance requirements to external users. For example, you can use these PIM features for Azure resources with external users:

- Assign access to specific Azure resources
- Enable just-in-time access
- Specify assignment duration and end date
- Require MFA on active assignment or activation
- Perform access reviews
- Utilize alerts and audit logs

This article describes how to invite an external user to your directory and manage their access to Azure resources using PIM.

## When would you invite external users?

Here are some example scenarios when you would invite external users to your directory:

- Allow an external self-employed vendor that only has an email account to access your Azure resources.
- Allow an external partner in a large organization that uses on-premises Active Directory Federation Services to access your expense application.
- Allow support engineers not in your organization (such as Microsoft support) to temporarily access your Azure resource to troubleshoot issues.

## How does external collaboration using B2B work?

When you use B2B, you can invite an external user to your directory. The external user appears to be in your directory, but the user does not have any credentials associated with it. Whenever an external user has to be authenticated, they must be authenticated in their home directory and not your directory. This means that if the external user no longer has access to their home directory, they automatically lose access to your directory. For example, if the external user leaves their organization, they automatically lose access to any resources you shared with them in your directory without you having to do anything. For more information about B2B, see [What is guest user access in Azure Active Directory B2B?](../b2b/what-is-b2b.md).

![B2B and external user](./media/pim-resource-roles-external-users/b2b-external-user.png)

## Check external collaboration settings

To make sure you can invite external users into your directory, you should check your external collaboration settings.

1. Sign in to [Azure portal](https://portal.azure.com/).

1. Click **Azure Active Directory** > **User settings**.

1. Click **Manage external collaboration settings**.

    ![External collaboration settings](./media/pim-resource-roles-external-users/external-collaboration-settings.png)

1. Make sure that the **Admins and users in the guest inviter role can invite** switch is set to **Yes**.

## Invite an external user and assign a role

Using PIM, you can invite an external user and make them eligible for an Azure resource role just like a member user.

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

As an external user, you first need to accept the invite to the Azure AD directory and possibly activate your role.

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

    Unless the administrator is required to approve your request, you should access to the specified resources.

## View activity for an external user

Just like a member user, you can view audit logs to keep track of what external users are doing.

1. As an administrator, open PIM and select the resource that has been shared.

1. Click **Resource audit** to view the activity for that resource.

    ![Resource audit](./media/pim-resource-roles-external-users/audit-resource.png)

1. To view the activity for the external user, click **Azure Active Directory** > **Users** > external user.

1. Click **Audit logs** to see the audit logs for the directory. If necessary, you can specify filters.

    ![Directory audit](./media/pim-resource-roles-external-users/audit-directory.png)

## Next steps

- [Assign Azure AD directory roles in PIM](pim-how-to-add-role-to-user.md)
- [What is guest user access in Azure Active Directory B2B?](../b2b/what-is-b2b.md)
