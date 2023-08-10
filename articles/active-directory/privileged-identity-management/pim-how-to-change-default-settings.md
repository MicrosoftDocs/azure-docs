---
title: Configure Azure AD role settings in PIM
description: Learn how to configure Azure AD role settings in Azure AD Privileged Identity Management (PIM).
services: active-directory
documentationcenter: ''
author: billmath
manager: amycolannino
editor: ''
ms.service: active-directory
ms.topic: how-to
ms.workload: identity
ms.subservice: pim
ms.date: 6/7/2023
ms.author: billmath
ms.custom: pim
ms.collection: M365-identity-device-management
---
# Configure Azure AD role settings in Privileged Identity Management

In Privileged Identity Management (PIM) in Azure Active Directory (Azure AD), which is part of Microsoft Entra, role settings define role assignment properties. These properties include multifactor authentication and approval requirements for activation, assignment maximum duration, and notification settings. This article shows you how to configure role settings and set up the approval workflow to specify who can approve or deny requests to elevate privilege.

You must have the Global Administrator or Privileged Role Administrator role to manage PIM role settings for an Azure AD role. Role settings are defined per role. All assignments for the same role follow the same role settings. Role settings of one role are independent from role settings of another role.

PIM role settings are also known as PIM policies.

## Open role settings

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

To open the settings for an Azure AD role:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **Azure AD Privileged Identity Management** > **Azure AD Roles** > **Roles**. This page shows a list of Azure AD roles available in the tenant, including built-in and custom roles.
    :::image type="content" source="media/pim-how-to-change-default-settings/role-settings.png" alt-text="Screenshot that shows the list of Azure AD roles available in the tenant, including built-in and custom roles." lightbox="media/pim-how-to-change-default-settings/role-settings.png":::

1. Select the role whose settings you want to configure.

1. Select **Role settings**. On the **Role settings** page, you can view current PIM role settings for the selected role.

    :::image type="content" source="media/pim-how-to-change-default-settings/role-settings-edit.png" alt-text="Screenshot that shows the Role settings page with options to update assignment and activation settings." lightbox="media/pim-how-to-change-default-settings/role-settings-edit.png":::

1. Select **Edit** to update role settings.

1. Select **Update**.

## Role settings

This section discusses role settings options.

### Activation maximum duration

Use the **Activation maximum duration** slider to set the maximum time, in hours, that an activation request for a role assignment remains active before it expires. This value can be from one to 24 hours.

### On activation, require multifactor authentication

You can require users who are eligible for a role to prove who they are by using the multifactor authentication feature in Azure AD before they can activate. Multifactor authentication helps safeguard access to data and applications. It provides another layer of security by using a second form of authentication.

Users might not be prompted for multifactor authentication if they authenticated with strong credentials or provided multifactor authentication earlier in the session.

If your goal is to ensure that users must provide authentication during activation, you can use [On activation, require Azure AD Conditional Access authentication context](pim-how-to-change-default-settings.md#on-activation-require-azure-ad-conditional-access-authentication-context) together with [Authentication Strengths](../authentication/concept-authentication-strengths.md). These options require users to authenticate during activation by using methods different from the one they used to sign in to the machine.

For example, if users sign in to the machine by using Windows Hello for Business, you can use **On activation, require Azure AD Conditional Access authentication context** and **Authentication Strengths**. This option requires users to do passwordless sign-in with Microsoft Authenticator when they activate the role.

After the user provides passwordless sign-in with Microsoft Authenticator once in this example, they can do their next activation in this session without another authentication. Passwordless sign-in with Microsoft Authenticator is already part of their token.

We recommend that you enable the multifactor authentication feature of Azure AD for all users. For more information, see [Plan an Azure AD multifactor authentication deployment](../authentication/howto-mfa-getstarted.md).

### On activation, require Azure AD Conditional Access authentication context

You can require users who are eligible for a role to satisfy Conditional Access policy requirements. For example, you can require users to use a specific authentication method enforced through Authentication Strengths, elevate the role from an Intune-compliant device, and comply with terms of use.

To enforce this requirement, you create the Conditional Access authentication context.

1. Configure a Conditional Access policy that enforces requirements for this authentication context.

    The scope of the Conditional Access policy should include all or eligible users for a role. Don't create a Conditional Access policy scoped to authentication context and a directory role at the same time. During activation, the user doesn't have a role yet, so the Conditional Access policy wouldn't apply.

    See the steps at the end of this section about a situation when you might need two Conditional Access policies. One must be scoped to the authentication context and another must be scoped to the role.
1. Configure authentication context in PIM settings for the role.

   :::image type="content" source="media/pim-how-to-change-default-settings/role-settings-page.png" alt-text="Screenshot that shows the Edit role setting - Attribute Definition Administrator page." lightbox="media/pim-how-to-change-default-settings/role-settings-page.png":::

If PIM settings have **On activation, require Azure AD Conditional Access authentication context** configured, the Conditional Access policies define conditions a user must meet to satisfy the access requirements.

This means that security principals with permissions to manage Conditional Access policies, such as Conditional Access administrators or security administrators, can change requirements, remove them, or block eligible users from activating the role. Security principals that can manage the Conditional Access policies should be considered highly privileged and protected accordingly.

We recommend that you create and enable a Conditional Access policy for the authentication context before the authentication context is configured in PIM settings. As a backup protection mechanism, if there are no Conditional Access policies in the tenant that target authentication context configured in PIM settings, during PIM role activation, the multifactor authentication feature in Azure AD is required as the [On activation, require multifactor authentication](pim-how-to-change-default-settings.md#on-activation-require-multifactor-authentication) setting would be set.

This backup protection mechanism is designed to solely protect from a scenario when PIM settings were updated before the Conditional Access policy was created because of a configuration mistake. This backup protection mechanism isn't triggered if the Conditional Access policy is turned off, is in report-only mode, or has an eligible user excluded from the policy.

The **On activation, require Azure AD Conditional Access authentication context** setting defines the authentication context requirements that users must satisfy when they activate the role. After the role is activated, users aren't prevented from using another browsing session, device, or location to use permissions.

For example, users might use an Intune-compliant device to activate the role. Then after the role is activated, they might sign in to the same user account from another device that isn't Intune compliant and use the previously activated role from there.

To prevent this situation, create two Conditional Access policies:
1. The first Conditional Access policy targets authentication context. It should have all users or eligible users in its scope. This policy specifies the requirements that users must meet to activate the role.
1. The second Conditional Access policy targets directory roles. This policy specifies the requirements that users must meet to sign in with the directory role activated.

Both policies can enforce the same or different requirements depending on your needs.

Another option is to scope Conditional Access policies that enforce certain requirements to eligible users directly. For example, you can require users who are eligible for certain roles to always use Intune-compliant devices.

To learn more about Conditional Access authentication context, see [Conditional Access: Cloud apps, actions, and authentication context](../conditional-access/concept-conditional-access-cloud-apps.md#authentication-context).

### Require justification on activation

You can require users to enter a business justification when they activate the eligible assignment.

### Require ticket information on activation

You can require users to enter a support ticket number when they activate the eligible assignment. This option is an information-only field. Correlation with information in any ticketing system isn't enforced.

### Require approval to activate

You can require approval for activation of an eligible assignment. The approver doesn't have to have any roles. When you use this option, you must select at least one approver. We recommend that you select at least two approvers. There are no default approvers.

To learn more about approvals, see [Approve or deny requests for Azure AD roles in Privileged Identity Management](azure-ad-pim-approval-workflow.md).

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
| Allow permanent active assignment | Resource administrators can assign permanent active assignments. |
| Expire active assignment after | Resource administrators can require that all active assignments have a specified start and end date. |

All assignments that have a specified end date can be renewed by Global admins and Privileged Role admins. Also, users can initiate self-service requests to [extend or renew role assignments](pim-resource-roles-renew-extend.md).

### Require multifactor authentication on active assignment

You can require that administrators provide multifactor authentication when they create an active (as opposed to eligible) assignment. Privileged Identity Management can't enforce multifactor authentication when the user uses their role assignment because they're already active in the role from the time that it's assigned.

An administrator might not be prompted for multifactor authentication if they authenticated with strong credentials or provided multifactor authentication earlier in this session.

### Require justification on active assignment

You can require that users enter a business justification when they create an active (as opposed to eligible) assignment.

On the **Notifications** tab on the **Role settings** page, Privileged Identity Management enables granular control over who receives notifications and which notifications they receive. You have the following options:

- **Turning off an email**: You can turn off specific emails by clearing the default recipient checkbox and deleting any other recipients.
- **Limit emails to specified email addresses**: You can turn off emails sent to default recipients by clearing the default recipient checkbox. You can then add other email addresses as recipients. If you want to add more than one email address, separate them by using a semicolon (;).
- **Send emails to both default recipients and more recipients**: You can send emails to both the default recipient and another recipient. Select the default recipient checkbox and add email addresses for other recipients.
- **Critical emails only**: For each type of email, you can select the checkbox to receive critical emails only. With this option, Privileged Identity Management continues to send emails to the specified recipients only when the email requires immediate action. For example, emails that ask users to extend their role assignment aren't triggered. Emails that require admins to approve an extension request are triggered.

>[!NOTE]
>One event in Privileged Identity Management can generate email notifications to multiple recipients – assignees, approvers, or administrators. The maximum number of notifications sent per one event is 1000. If the number of recipients exceeds 1000 – only the first 1000 recipients will receive an email notification. This does not prevent other assignees, administrators, or approvers from using their permissions in Microsoft Entra and Privileged Identity Management.
## Manage role settings by using Microsoft Graph

To manage settings for Azure AD roles by using PIM APIs in Microsoft Graph, use the [unifiedRoleManagementPolicy resource type and related methods](/graph/api/resources/unifiedrolemanagementpolicy).

In Microsoft Graph, role settings are referred to as rules. They're assigned to Azure AD roles through container policies. Each Azure AD role is assigned a specific policy object. You can retrieve all policies that are scoped to Azure AD roles. For each policy, you can retrieve the associated collection of rules by using an `$expand` query parameter. The syntax for the request is as follows:

```http
GET https://graph.microsoft.com/v1.0/policies/roleManagementPolicies?$filter=scopeId eq '/' and scopeType eq 'DirectoryRole'&$expand=rules
```

For more information about how to manage role settings through PIM APIs in Microsoft Graph, see [Role settings and PIM](/graph/api/resources/privilegedidentitymanagementv3-overview#role-settings-and-pim). For examples of how to update rules, see [Update rules in PIM by using Microsoft Graph](/graph/how-to-pim-update-rules).

## Next steps

- [Assign Azure AD roles in Privileged Identity Management](pim-how-to-add-role-to-user.md)
- [Configure security alerts for Azure AD roles in Privileged Identity Management](pim-how-to-configure-security-alerts.md)
