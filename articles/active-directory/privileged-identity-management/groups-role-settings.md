---
title: Configure PIM for Groups settings
description: Learn how to configure PIM for Groups settings.
services: active-directory
documentationcenter: ''
author: billmath
manager: amycolannino
ms.service: active-directory
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: identity
ms.subservice: pim
ms.date: 6/7/2023
ms.author: billmath
ms.custom: pim
ms.collection: M365-identity-device-management
---

# Configure PIM for Groups settings

In Privileged Identity Management (PIM) for groups in Azure Active Directory (Azure AD), which is part of Microsoft Entra, role settings define membership or ownership assignment properties. These properties include multifactor authentication and approval requirements for activation, assignment maximum duration, and notification settings. This article shows you how to configure role settings and set up the approval workflow to specify who can approve or deny requests to elevate privilege.

You need group management permissions to manage settings. For role-assignable groups, you must have a Global Administrator or Privileged Role Administrator role or be an owner of the group. For non-role assignable groups, you must have a Global Administrator, Directory Writer, Groups Administrator, Identity Governance Administrator, or User Administrator role or be an owner of the group. Role assignments for administrators should be scoped at directory level (not at the administrative unit level).

> [!NOTE]
> Other roles with permissions to manage groups (such as Exchange administrators for non-role-assignable Microsoft 365 groups) and administrators with assignments scoped at the administrative unit level can manage groups through the Groups API/UX and override changes made in Azure AD Privileged Identity Management.

Role settings are defined per role per group. All assignments for the same role (member or owner) for the same group follow the same role settings. Role settings of one group are independent from the role settings of another group. Role settings for one role (member) are independent from role settings for another role (owner).

## Update role settings

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

To open the settings for a group role:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **Azure AD Privileged Identity Management** > **Groups**.

1. Select the group for which you want to configure role settings.

1. Select **Settings**.

1. Select the role for which you need to configure role settings. The options are **Member** or **Owner**.

   :::image type="content" source="media/pim-for-groups/pim-group-17.png" alt-text="Screenshot that shows where to select the role for which you need to configure role settings." lightbox="media/pim-for-groups/pim-group-17.png":::

1. Review current role settings.

1. Select **Edit** to update role settings.

    :::image type="content" source="media/pim-for-groups/pim-group-18.png" alt-text="Screenshot that shows where to select Edit to update role settings." lightbox="media/pim-for-groups/pim-group-18.png":::

1. Select **Update**.

## Role settings

This section discusses role settings options.

### Activation maximum duration

Use the **Activation maximum duration** slider to set the maximum time, in hours, that an activation request for a role assignment remains active before it expires. This value can be from one to 24 hours.

### On activation, require multifactor authentication

You can require users who are eligible for a role to prove who they are by using the multifactor authentication feature in Azure AD before they can activate. Multifactor authentication helps safeguard access to data and applications. It provides another layer of security by using a second form of authentication.

Users might not be prompted for multifactor authentication if they authenticated with strong credentials or provided multifactor authentication earlier in this session. If your goal is to ensure that users have to provide authentication during activation, you can use [On activation, require Azure AD Conditional Access authentication context](pim-how-to-change-default-settings.md#on-activation-require-azure-ad-conditional-access-authentication-context) together with [Authentication Strengths](../authentication/concept-authentication-strengths.md).

Users are required to authenticate during activation by using methods different from the one they used to sign in to the machine. For example, if users sign in to the machine by using Windows Hello for Business, you can use **On activation, require Azure AD Conditional Access authentication context** and **Authentication Strengths** to require users to do passwordless sign-in with Microsoft Authenticator when they activate the role.

After the user provides passwordless sign-in with Microsoft Authenticator once in this example, they're able to do their next activation in this session without another authentication. Passwordless sign-in with Microsoft Authenticator is already part of their token.

We recommend that you enable the multifactor authentication feature in Azure AD for all users. For more information, see [Plan an Azure AD multifactor authentication deployment](../authentication/howto-mfa-getstarted.md).

### On activation, require Azure AD Conditional Access authentication context

You can require users who are eligible for a role to satisfy Conditional Access policy requirements. For example, you can require users to use a specific authentication method enforced through Authentication Strengths, elevate the role from an Intune-compliant device, and comply with terms of use.

To enforce this requirement, you create Conditional Access authentication context.

1. Configure a Conditional Access policy that would enforce requirements for this authentication context.

    The scope of the Conditional Access policy should include all or eligible users for group membership/ownership. Don't create a Conditional Access policy scoped to authentication context and group at the same time. During activation, a user doesn't have group membership yet, so the Conditional Access policy wouldn't apply.

1. Configure authentication context in PIM settings for the role.

   :::image type="content" source="media/pim-for-groups/pim-group-21.png" alt-text="Screenshot that shows the Edit role setting - Member page." lightbox="media/pim-for-groups/pim-group-21.png":::

If PIM settings have **On activation, require Azure AD Conditional Access authentication context** configured, Conditional Access policies define what conditions users must meet to satisfy the access requirements.

This means that security principals with permissions to manage Conditional Access policies, such as Conditional Access administrators or security administrators, can change requirements, remove them, or block eligible users from activating their group membership/ownership. Security principals that can manage Conditional Access policies should be considered highly privileged and protected accordingly.

We recommend that you create and enable a Conditional Access policy for the authentication context before the authentication context is configured in PIM settings. As a backup protection mechanism, if there are no Conditional Access policies in the tenant that target authentication context configured in PIM settings, during group membership/ownership activation, the multifactor authentication feature in Azure AD is required as the [On activation, require multifactor authentication](groups-role-settings.md#on-activation-require-multifactor-authentication) setting would be set.

This backup protection mechanism is designed to solely protect from a scenario when PIM settings were updated before the Conditional Access policy was created because of a configuration mistake. This backup protection mechanism isn't triggered if the Conditional Access policy is turned off, is in report-only mode, or has eligible users excluded from the policy.

The **On activation, require Azure AD Conditional Access authentication context** setting defines the authentication context requirements that users must satisfy when they activate group membership/ownership. After group membership/ownership is activated, users aren't prevented from using another browsing session, device, or location to use group membership/ownership.

For example, users might use an Intune-compliant device to activate group membership/ownership. Then after the role is activated, they might sign in to the same user account from another device that isn't Intune compliant and use the previously activated group ownership/membership from there.

To prevent this situation, you can scope Conditional Access policies to enforce certain requirements for eligible users directly. For example, you can require users who are eligible for certain group membership/ownership to always use Intune-compliant devices.

To learn more about Conditional Access authentication context, see [Conditional Access: Cloud apps, actions, and authentication context](../conditional-access/concept-conditional-access-cloud-apps.md#authentication-context).

### Require justification on activation

You can require users to enter a business justification when they activate the eligible assignment.

### Require ticket information on activation

You can require users to enter a support ticket when they activate the eligible assignment. This option is an information-only field. Correlation with information in any ticketing system isn't enforced.

### Require approval to activate

You can require approval for activation of an eligible assignment. The approver doesn't have to be a group member or owner. When you use this option, you must select at least one approver. We recommend that you select at least two approvers. There are no default approvers.

To learn more about approvals, see [Approve activation requests for PIM for Groups members and owners](groups-approval-workflow.md).

### Assignment duration

When you configure settings for a role, you can choose from two assignment duration options for each assignment type: *eligible* and *active*. These options become the default maximum duration when a user is assigned to the role in Privileged Identity Management.

You can choose one of these eligible assignment duration options.

| Setting | Description |
| --- | --- |
| Allow permanent eligible assignment | Resource administrators can assign permanent eligible assignments. |
| Expire eligible assignment after | Resource administrators can require that all eligible assignments have a specified start and end date. |

You can also choose one of these active assignment duration options.

| Setting | Description |
| --- | --- |
|Allow permanent active assignment | Resource administrators can assign permanent active assignments. |
| Expire active assignment after | Resource administrators can require that all active assignments have a specified start and end date. |

All assignments that have a specified end date can be renewed by resource administrators. Also, users can initiate self-service requests to [extend or renew role assignments](pim-resource-roles-renew-extend.md).

### Require multifactor authentication on active assignment

You can require that an administrator or group owner provides multifactor authentication when they create an active (as opposed to eligible) assignment. Privileged Identity Management can't enforce multifactor authentication when the user uses their role assignment because they're already active in the role from the time that it's assigned.

An administrator or group owner might not be prompted for multifactor authentication if they authenticated with strong credentials or provided multifactor authentication earlier in this session.

### Require justification on active assignment

You can require that users enter a business justification when they create an active (as opposed to eligible) assignment.

On the **Notifications** tab on the **Role settings** page, Privileged Identity Management enables granular control over who receives notifications and which notifications they receive. You have the following options:

- **Turning off an email**: You can turn off specific emails by clearing the default recipient checkbox and deleting any other recipients.
- **Limit emails to specified email addresses**: You can turn off emails sent to default recipients by clearing the default recipient checkbox. You can then add other email addresses as recipients. If you want to add more than one email address, separate them by using a semicolon (;).
- **Send emails to both default recipients and more recipients**: You can send emails to both the default recipient and another recipient. Select the default recipient checkbox and add email addresses for other recipients.
- **Critical emails only**: For each type of email, you can select the checkbox to receive critical emails only. Privileged Identity Management continues to send emails to the specified recipients only when the email requires immediate action. For example, emails that ask users to extend their role assignment aren't triggered. Emails that require admins to approve an extension request are triggered.

>[!NOTE]
>One event in Privileged Identity Management can generate email notifications to multiple recipients – assignees, approvers, or administrators. The maximum number of notifications sent per one event is 1000. If the number of recipients exceeds 1000 – only the first 1000 recipients will receive an email notification. This does not prevent other assignees, administrators, or approvers from using their permissions in Microsoft Entra and Privileged Identity Management.

## Manage role settings by using Microsoft Graph

To manage role settings for groups by using PIM APIs in Microsoft Graph, use the [unifiedRoleManagementPolicy resource type and its related methods](/graph/api/resources/unifiedrolemanagementpolicy).

In Microsoft Graph, role settings are referred to as rules. They're assigned to groups through container policies. You can retrieve all policies that are scoped to a group and for each policy. Retrieve the associated collection of rules by using an `$expand` query parameter. The syntax for the request is as follows:

```http
GET https://graph.microsoft.com/beta/policies/roleManagementPolicies?$filter=scopeId eq '{groupId}' and scopeType eq 'Group'&$expand=rules
```

For more information about how to manage role settings through PIM APIs in Microsoft Graph, see [Role settings and PIM](/graph/api/resources/privilegedidentitymanagement-for-groups-api-overview#policy-settings-in-pim-for-groups). For examples of how to update rules, see [Update rules in PIM by using Microsoft Graph](/graph/how-to-pim-update-rules).

## Next steps

[Assign eligibility for a group in Privileged Identity Management](groups-assign-member-owner.md)
