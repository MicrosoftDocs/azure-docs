---
title: Invite guests and assign Azure resource roles in PIM - Azure Active Directory | Microsoft Docs
description: Learn how to invite external guest users and assign Azure resource roles in Azure AD Privileged Identity Management (PIM).
services: active-directory
documentationcenter: ''
author: rolyon
manager: mtillman
ms.service: active-directory
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.subservice: pim
ms.date: 04/09/2019
ms.author: rolyon
ms.custom: pim
ms.collection: M365-identity-device-management
---

# Invite guest users and assign Azure resource roles in PIM

Azure Active Directory (Azure AD) business-to-business (B2B) is a set of capabilities within Azure AD that enables organizations to collaborate with external guest users (guests) and vendors using any account. When you combine B2B with Azure AD Privileged Identity Management (PIM), you can continue to apply your compliance and governance requirements to guests. For example, you can use these PIM features for Azure identity tasks with guests:

- Assign access to specific Azure resources
- Enable just-in-time access
- Specify assignment duration and end date
- Require MFA on active assignment or activation
- Perform access reviews
- Utilize alerts and audit logs

This article describes how to invite a guest to your organization and manage their access to Azure resources using Privileged Identity Management.

## When would you invite guests?

Here are a couple example scenarios when you might invite guests to your organization:

- Allow an external self-employed vendor that only has an email account to access your Azure resources for a project.
- Allow an external partner in a large organization that uses on-premises Active Directory Federation Services to access your expense application.
- Allow support engineers not in your organization (such as Microsoft support) to temporarily access your Azure resource to troubleshoot issues.

## How does collaboration using B2B guests work?

When you use B2B collaboration, you can invite an external user to your organization as a guest. The guest appears to be in your organization, but the guest does not have any credentials associated with it. Whenever a guest has to be authenticated, they must be authenticated in their home organization and not in your organization. This means that if the guest no longer has access to their home organization, they also lose access to your organization. For example, if the guest leaves their organization, they automatically lose access to any resources you shared with them in Azure AD without you having to do anything. For more information about B2B, see [What is guest user access in Azure Active Directory B2B?](../b2b/what-is-b2b.md).

![Diagram showing how a guest user appears in your directory, but is authenticated in their home directory](./media/pim-resource-roles-external-users/b2b-external-user.png)

## Check guest collaboration settings

To make sure you can invite guests into your organization, you should check your guest collaboration settings.

1. Sign in to [Azure portal](https://portal.azure.com/).

1. Click **Azure Active Directory** > **User settings**.

1. Click **Manage external collaboration settings**.

    ![External collaboration settings page showing permission, invite, and collaboration restriction settings](./media/pim-resource-roles-external-users/external-collaboration-settings.png)

1. Make sure that the **Admins and users in the guest inviter role can invite** switch is set to **Yes**.

## Invite a guest and assign a role

Using PIM, you can invite a guest and make them eligible for an Azure resource role just like a member user.

1. Sign in to [Azure portal](https://portal.azure.com/) with a user that is a member of the [Privileged Role Administrator](../users-groups-roles/directory-assign-admin-roles.md#privileged-role-administrator) or [User Administrator](../users-groups-roles/directory-assign-admin-roles.md#user-administrator) role.

1. Open **Azure AD Privileged Identity Management**.

1. Click **Azure resources**.

1. Use the **Resource filter** to filter the list of managed resources.

1. Click the resource you want to manage, such as a resource, resource group, subscription, or management group.

    You should set the scope to only what the guest needs.

1. Under Manage, click **Roles** to see the list of roles for Azure resources.

    ![Azure resources roles list showing number of users that are active and eligible](./media/pim-resource-roles-external-users/resources-roles.png)

1. Click the minimum role that the user will need.

    ![Selected role page listing the current members of that role](./media/pim-resource-roles-external-users/selected-role.png)

1. On the role page, click **Add member** to open the New assignment pane.

1. Click **Select a member or group**.

    ![New assignment - Select a member or group pane listing users and groups along with an Invite option](./media/pim-resource-roles-external-users/select-member-group.png)

1. To invite a guest, click **Invite**.

    ![Invite a guest page with boxes to enter an email address and specify a personal message](./media/pim-resource-roles-external-users/invite-guest.png)

1. After you have selected a guest, click **Invite**.

    The guest should be added as a selected member.

1. In the **Select a member or group** pane, click **Select**.

1. In the **Membership settings** pane, select the assignment type and duration.

    ![New assignment - Membership settings page with options to specify assignment type, start date, and end date](./media/pim-resource-roles-external-users/membership-settings.png)

1. To complete the assignment, click **Done** and then **Add**.

    The guest role assignment will appear in your role list.

    ![Role page listing the guest as eligible](./media/pim-resource-roles-external-users/role-assignment.png)

## Activate role as a guest

As an external user, you first need to accept the invite to your Azure AD organization and possibly activate your role.

1. Open the email with your invitation. The email will look similar to the following.

    ![Email invite with directory name, personal message, and a Get Started link](./media/pim-resource-roles-external-users/email-invite.png)

1. Click the **Get Started** link in the email.

1. After reviewing the permissions, click **Accept**.

    ![Review permissions page in a browser with a list of permissions that the organization would like you to review](./media/pim-resource-roles-external-users/invite-accept.png)

1. You might be asked to accept a terms of use and specify whether you want to stay signed in.

    The Azure portal opens. If you are just eligible for a role, you won't have access to resources.

1. To activate your role, open the email with your activate role link. The email will look similar to the following.

    ![Email message from PIM indicating that you eligible for a role with an Activate role link](./media/pim-resource-roles-external-users/email-role-assignment.png)

1. Click **Activate role** to open your eligible roles in PIM.

    ![My roles page in PIM listing your eligible roles](./media/pim-resource-roles-external-users/my-roles-eligible.png)

1. Under Action, click the **Activate** link.

    Depending on the role settings, you'll need to specify some information to activate the role.

1. Once you have specified the settings for the role, click **Activate** to activate the role.

    ![Activate page listing scope and options to specify the start time, duration, and reason](./media/pim-resource-roles-external-users/activate-role.png)

    Unless the administrator is required to approve your request, you should have access to the specified resources.

## View activity for a guest

Just like a member user, you can view audit logs to keep track of what guests are doing.

1. As an administrator, open PIM and select the resource that has been shared.

1. Click **Resource audit** to view the activity for that resource. The following shows an example of the activity for a resource group.

    ![Azure resources - Resource audit page listing the time, requestor, and action](./media/pim-resource-roles-external-users/audit-resource.png)

1. To view the activity for the guest, click **Azure Active Directory** > **Users** > guest name.

1. Click **Audit logs** to see the audit logs for the organization. If necessary, you can specify filters.

    ![Directory audit logs listing date, target, initiated by, and activity](./media/pim-resource-roles-external-users/audit-directory.png)

## Next steps

- [Assign Azure AD admin roles in PIM](pim-how-to-add-role-to-user.md)
- [What is guest user access in Azure Active Directory B2B?](../b2b/what-is-b2b.md)
