---
title: Configure Azure resource role settings in PIM - Azure AD | Microsoft Docs
description: Learn how to configure Azure resource role settings in Azure AD Privileged Identity Management (PIM).
services: active-directory
documentationcenter: ''
author: curtand
manager: daveba
ms.service: active-directory
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: identity
ms.subservice: pim
ms.date: 01/01/2020
ms.author: curtand
ms.custom: pim
ms.collection: M365-identity-device-management
---

# Configure Azure resource role settings in Privileged Identity Management

When you configure Azure resource role settings, you define the default settings that are applied to Azure resource role assignments in Azure Active Directory (Azure AD) Privileged Identity Management (PIM). Use the following procedures to configure the approval workflow and specify who can approve or deny requests.

## Open role settings

Follow these steps to open the settings for an Azure resource role.

1. Sign in to [Azure portal](https://portal.azure.com/) with a user in the [Privileged Role Administrator](../users-groups-roles/directory-assign-admin-roles.md#privileged-role-administrator) role.

1. Open **Azure AD Privileged Identity Management**.

1. Select **Azure resources**.

1. Select the resource you want to manage, such as a subscription or management group.

    ![Azure resources page listing resources that can be managed](./media/pim-resource-roles-configure-role-settings/resources-list.png)

1. Select **Role settings**.

    ![Role settings page listing Azure resource roles](./media/pim-resource-roles-configure-role-settings/resources-role-settings.png)

1. Select the role whose settings you want to configure.

    ![Role setting details page listing several assignment and activation settings](./media/pim-resource-roles-configure-role-settings/resources-role-setting-details.png)

1. Select **Edit** to open the **Role settings** pane. The first tab allows you to update the configuration for role activation in Privileged Identity Management.

    ![Edit role settings page with Activation tab open](./media/pim-resource-roles-configure-role-settings/role-settings-activation-tab.png)

1. Select the **Assignment** tab or the **Next: Assignment** button at the bottom of the page to open the assignment setting tab. These settings control role assignments made inside the Privileged Identity Management interface.

    ![Role Assignment tab in role settings page](./media/pim-resource-roles-configure-role-settings/role-settings-assignment-tab.png)

1. Use the **Notification** tab or the **Next: Activation** button at the bottom of the page to get to the notification setting tab for this role. These settings control all the email notifications related to this role.

    ![Role Notifications tab in role settings page](./media/pim-resource-roles-configure-role-settings/role-settings-notification-tab.png)

    In the **Notifications** tab on the role settings page, Privileged Identity Management enables granular control over who receives notifications and which notifications they receive.

    - **Turning off an email**<br>You can turn off specific emails by clearing the default recipient check box and deleting any additional recipients.  

    - **Limit emails to specified email addresses**<br>You can turn off emails sent to default recipients by clearing the default recipient checkbox. You can then add additional email addresses as additional recipients. If you want to add more than one email address, separate them using a semicolon (;).

    - **Send emails to both default recipients and additional recipients**<br>You can send emails to both default recipient and additional recipient by selecting the default recipient checkbox and adding email addresses for additional recipients.

    - **Critical emails only**<br>For each type of email, you can select the checkbox to receive critical emails only. What this means is that Privileged Identity Management will continue to send emails to the configured recipients only when the email requires an immediate action. For example, emails asking users to extend their role assignment will not be triggered while an emails requiring admins to approve an extension request will be triggered.

1. Select the **Update** button at any time to update the role settings.

## Assignment duration

You can choose from two assignment duration options for each assignment type (eligible and active) when you configure settings for a role. These options become the default maximum duration when a user is assigned to the role in Privileged Identity Management.

You can choose one of these **eligible** assignment duration options:

| | |
| --- | --- |
| **Allow permanent eligible assignment** | Resource administrators can assign permanent eligible assignment. |
| **Expire eligible assignment after** | Resource administrators can require that all eligible assignments have a specified start and end date. |

And, you can choose one of these **active** assignment duration options:

| | |
| --- | --- |
| **Allow permanent active assignment** | Resource administrators can assign permanent active assignment. |
| **Expire active assignment after** | Resource administrators can require that all active assignments have a specified start and end date. |

> [!NOTE]
> All assignments that have a specified end date can be renewed by resource administrators. Also, users can initiate self-service requests to [extend or renew role assignments](pim-resource-roles-renew-extend.md).

## Require multi-factor authentication

Privileged Identity Management provides optional enforcement of Azure Multi-Factor Authentication for two distinct scenarios.

### Require Multi-Factor Authentication on active assignment

In some cases, you might want to assign a user or group to a role for a short duration (one day, for example). In this case, the assigned users don't need to request activation. In this scenario, Privileged Identity Management can't enforce multi-factor authentication when the user uses their role assignment because they are already active in the role from the time that it is assigned.

To ensure that the resource administrator fulfilling the assignment is who they say they are, you can enforce multi-factor authentication on active assignment by checking the **Require Multi-Factor Authentication on active assignment** box.

### Require Multi-Factor Authentication on activation

You can require users who are eligible for a role to prove who they are using Azure Multi-Factor Authentication before they can activate. Multi-factor authentication ensures that the user is who they say they are with reasonable certainty. Enforcing this option protects critical resources in situations when the user account might have been compromised.

To require multi-factor authentication before activation, check the **Require Multi-Factor Authentication on activation** box.

For more information, see [Multi-factor authentication and Privileged Identity Management](pim-how-to-require-mfa.md).

## Activation maximum duration

Use the **Activation maximum duration** slider to set the maximum time, in hours, that a role stays active before it expires. This value can be from one to 24 hours.

## Require justification

You can require that users enter a business justification when they activate. To require justification, check the **Require justification on active assignment** box or the **Require justification on activation** box.

## Require approval to activate

If you want to require approval to activate a role, follow these steps.

1. Check the **Require approval to activate** check box.

1. Select **Select approvers** to open the **Select a member or group** page.

    ![Select a user or group pane to select approvers](./media/pim-resource-roles-configure-role-settings/resources-role-settings-select-approvers.png)

1. Select at least one user or group and then click **Select**. You can add any combination of users and groups. You must select at least one approver. There are no default approvers.

    Your selections will appear in the list of selected approvers.

1. Once you have specified your all your role settings, select **Update** to save your changes.

## Next steps

- [Assign Azure resource roles in Privileged Identity Management](pim-resource-roles-assign-roles.md)
- [Configure security alerts for Azure resource roles in Privileged Identity Management](pim-resource-roles-configure-alerts.md)
