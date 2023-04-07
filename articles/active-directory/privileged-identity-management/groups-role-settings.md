---
title: Configure PIM for Groups settings (preview)
description: Learn how to configure PIM for Groups settings (preview).
services: active-directory
documentationcenter: ''
author: amsliu
manager: amycolannino
ms.service: active-directory
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: identity
ms.subservice: pim
ms.date: 01/27/2023
ms.author: amsliu
ms.custom: pim
ms.collection: M365-identity-device-management
---

# Configure PIM for Groups settings (preview)

In Privileged Identity Management (PIM) for groups in Azure Active Directory (Azure AD), part of Microsoft Entra, role settings define membership or ownership assignment properties: MFA and approval requirements for activation, assignment maximum duration, notification settings, etc. Use the following steps to configure role settings and set up the approval workflow to specify who can approve or deny requests to elevate privilege.

You need to have Global Administrator, Privileged Role Administrator, or group Owner permissions to manage settings for membership or ownership assignments of the group. Role settings are defined per role per group: all assignments for the same role (member or owner) for the same group follow same role settings. Role settings of one group are independent from role settings of another group. Role settings for one role (member) are independent from role settings for another role (owner).


## Update role settings

Follow these steps to open the settings for a group role. 

1. [Sign in to the Azure portal](https://portal.azure.com).

1. Select **Azure AD Privileged Identity Management -> Groups (Preview)**. 

1. Select the group that you want to configure role settings for.

1. Select **Settings**.

1. Select the role you need to configure role settings for – **Member** or **Owner**.

   :::image type="content" source="media/pim-for-groups/pim-group-17.png" alt-text="Screenshot of where to select the role you need to configure role settings for." lightbox="media/pim-for-groups/pim-group-17.png":::

1. Review current role settings.

1. Select **Edit** to update role settings. 

    :::image type="content" source="media/pim-for-groups/pim-group-18.png" alt-text="Screenshot of where to select Edit to update role settings." lightbox="media/pim-for-groups/pim-group-18.png":::

1. Once finished, select **Update**.

## Role settings

### Activation maximum duration

Use the **Activation maximum duration** slider to set the maximum time, in hours, that an activation request for a role assignment remains active before it expires. This value can be from one to 24 hours.

### On activation, require multi-factor authentication

You can require users who are eligible for a role to prove who they are using Azure AD Multi-Factor Authentication before they can activate. Multi-factor authentication helps safeguard access to data and applications, providing another layer of security by using a second form of authentication. 

> [!NOTE]
> User may not be prompted for multi-factor authentication if they authenticated with strong credentials, or provided multi-factor authentication earlier in this session. If your goal is to ensure that users have to provide authentication during activation, you can use [On activation, require Azure AD Conditional Access authentication context](pim-how-to-change-default-settings.md#on-activation-require-azure-ad-conditional-access-authentication-context-public-preview) together with [Authentication Strengths](../authentication/concept-authentication-strengths.md) to require users to authenticate during activation using methods different from the one they used to sign-in to the machine. For example, if users sign-in to the machine using Windows Hello for Business, you can use “On activation, require Azure AD Conditional Access authentication context” and Authentication Strengths to require users to do Passwordless sign-in with Microsoft Authenticator when they activate the role. After the user provides Passwordless sign-in with Microsoft Authenticator once in this example, they'll be able to do their next activation in this session without additional authentication because Passwordless sign-in with Microsoft Authenticator will already be part of their token. 
> 
> It's recommended to enable Azure AD Multi-Factor Authentication for all users. For more information, see [Plan an Azure Active Directory Multi-Factor Authentication deployment](../authentication/howto-mfa-getstarted.md).

### On activation, require Azure AD Conditional Access authentication context (Public Preview)

You can require users who are eligible for a role to satisfy Conditional Access policy requirements: use specific authentication method enforced through Authentication Strengths, elevate the role from Intune compliant device, comply with Terms of Use, and more. 

To enforce this requirement, you need to:

1.	Create Conditional Access authentication context.

1.	Configure Conditional Access policy that would enforce requirements for this authentication context.
    > [!NOTE]
    > The scope of the Conditional Access policy should include all or eligible users for group membership/ownership. Do not create a Conditional Access policy scoped to authentication context and group at the same time because during activation a user does not have group membership yet, and the Conditional Access policy would not apply.
1.	Configure authentication context in PIM settings for the role.

:::image type="content" source="media/pim-for-groups/pim-group-21.png" alt-text="Screenshot of the Edit role settings Member page." lightbox="media/pim-for-groups/pim-group-21.png":::

> [!NOTE]
> If PIM settings have “**On activation, require Azure AD Conditional Access authentication context**” configured, Conditional Access policies define what conditions user needs to meet in order to satisfy the access requirements. This means that security principals with permissions to manage Conditional Access policies such as Conditional Access Administrators or Security Administrators may change requirements, remove them, or block eligible users from activating their group membership/ownership. Security principals that can manage Conditional Access policies should be considered highly privileged and protected accordingly.

> [!NOTE]
> We recommend creating and enabling Conditional Access policy for the authentication context before the authentication context is configured in PIM settings. As a backup protection mechanism, if there are no Conditional Access policies in the tenant that target authentication context configured in PIM settings, during group membership/ownership activation, Azure AD Multi-Factor Authentication is required as the [On activation, require multi-factor authentication](groups-role-settings.md#on-activation-require-multi-factor-authentication) setting would be set. This backup protection mechanism is designed to solely protect from a scenario when PIM settings were updated before the Conditional Access policy is created, due to a configuration mistake. This backup protection mechanism will not be triggered if the Conditional Access policy is turned off, in report-only mode, or has eligible users excluded from the policy. 

> [!NOTE]
> **“On activation, require Azure AD Conditional Access authentication context”** setting defines authentication context, requirements for which users will need to satisfy when they activate group membership/ownership. After group membership/ownership is activated, this does not prevent users from using another browsing session, device, location, etc. to use group membership/ownership. For example, user may use Intune compliant device to activate group membership/ownership, then after the role is activated, sign-in to the same user account from another device that is not Intune compliant, and use previously activated group ownership/membership from there. To protect from this situation, you may scope Conditional Access policies enforcing certain requirements to eligible users directly. For example, you can require users eligible to certain group membership/ownership to always use Intune compliant devices.

To learn more about Conditional Access authentication context, see [Conditional Access: Cloud apps, actions, and authentication context](../conditional-access/concept-conditional-access-cloud-apps.md#authentication-context).

### Require justification on activation

You can require that users enter a business justification when they activate the eligible assignment.

### Require ticket information on activation

You can require that users enter a support ticket when they activate the eligible assignment. This is information only field and correlation with information in any ticketing system isn't enforced.

### Require approval to activate

You can require approval for activation of eligible assignment. Approver doesn’t have to be group member or owner. When using this option, you have to select at least one approver (we recommend selecting at least two approvers), there are no default approvers.

To learn more about approvals, see [Approve activation requests for PIM for Groups members and owners (preview)](groups-approval-workflow.md).

### Assignment duration

You can choose from two assignment duration options for each assignment type (eligible and active) when you configure settings for a role. These options become the default maximum duration when a user is assigned to the role in Privileged Identity Management.

You can choose one of these **eligible** assignment duration options:

| | Description |
| --- | --- |
| **Allow permanent eligible assignment** | Resource administrators can assign permanent eligible assignment. |
| **Expire eligible assignment after** | Resource administrators can require that all eligible assignments have a specified start and end date. |

And, you can choose one of these **active** assignment duration options:

| | Description |
| --- | --- |
| **Allow permanent active assignment** | Resource administrators can assign permanent active assignment. |
| **Expire active assignment after** | Resource administrators can require that all active assignments have a specified start and end date. |

> [!NOTE]
> All assignments that have a specified end date can be renewed by resource administrators. Also, users can initiate self-service requests to [extend or renew role assignments](pim-resource-roles-renew-extend.md).

### Require multi-factor authentication on active assignment

You can require that administrator or group owner provides multi-factor authentication when they create an active (as opposed to eligible) assignment. Privileged Identity Management can't enforce multi-factor authentication when the user uses their role assignment because they are already active in the role from the time that it is assigned.

Administrator or group owner may not be prompted for multi-factor authentication if they authenticated with strong credential or provided multi-factor authentication earlier in this session.

### Require justification on active assignment

You can require that users enter a business justification when they create an active (as opposed to eligible) assignment.

In the **Notifications** tab on the role settings page, Privileged Identity Management enables granular control over who receives notifications and which notifications they receive.

- **Turning off an email**<br>You can turn off specific emails by clearing the default recipient check box and deleting any other recipients.  
- **Limit emails to specified email addresses**<br>You can turn off emails sent to default recipients by clearing the default recipient check box. You can then add other email addresses as recipients. If you want to add more than one email address, separate them using a semicolon (;).
- **Send emails to both default recipients and more recipients**<br>You can send emails to both default recipient and another recipient by selecting the default recipient checkbox and adding email addresses for other recipients.
- **Critical emails only**<br>For each type of email, you can select the check box to receive critical emails only. What this means is that Privileged Identity Management will continue to send emails to the specified recipients only when the email requires an immediate action. For example, emails asking users to extend their role assignment will not be triggered while an email requiring admins to approve an extension request will be triggered.

## Next steps

- [Assign eligibility for a group (preview) in Privileged Identity Management](groups-assign-member-owner.md)
