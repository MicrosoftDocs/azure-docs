---
title: Configure Azure AD directory role settings in PIM | Microsoft Docs
description: Learn how to configure Azure AD directory role settings in Azure AD Privileged Identity Management (PIM).
services: active-directory
documentationcenter: ''
author: rolyon
manager: mtillman
editor: ''

ms.service: active-directory
ms.topic: conceptual
ms.workload: identity
ms.component: pim
ms.date: 08/27/2018
ms.author: rolyon
ms.custom: pim
---
# Configure Azure AD directory role settings in PIM

A privileged role administrator can customize Azure AD Privileged Identity Management (PIM) in their organization, including changing the experience for a user who is activating an eligible role assignment.

## Configure the role settings

1. Open **Azure AD Privileged Identity Management**.

1. Click **Azure AD directory roles**.

1. Click **Settings**.

    ![Azure AD directory roles - Settings](./media/pim-how-to-change-default-settings/pim-directory-roles-settings.png)

1. Click **Roles**.

1. Click the role whose settings you want to manage.

    ![Azure AD directory roles - Settings Roles](./media/pim-how-to-change-default-settings/pim-directory-roles-settings-role.png)

    On the settings page for each role, there are several settings you can configure. These settings only affect users who are **eligible** assignments, not **permanent** assignments.

    | Setting | Description | 
    | --- | --- |
    | **Activations** | The time, in hours, that a role stays active before it expires. This can be between 1 and 72 hours. |
    | **Notifications** | You can choose whether or not the system sends emails to admins confirming that they have activated a role. This can be useful for detecting unauthorized or illegitimate activations. |
    | **Incident/Request Ticket** | You can choose whether or not to require eligible admins to include a ticket number when they activate their role. This can be useful when you perform role access audits. |
    | **Multi-Factor Authentication** | You can choose whether or not to require users to verify their identity with MFA before they can activate their roles. They only have to verify this once per session, not every time they activate a role. For additional information, see the next section. |

1. Once you have specified your settings, click **Save** to save your changes.

## Additional information about MFA

There are two tips to keep in mind when you enable MFA:

* Users who have Microsoft accounts for their email addresses (typically @outlook.com, but not always) cannot register for Azure MFA. If you want to assign roles to users with Microsoft accounts, you should either make them permanent admins or disable MFA for that role.
* You cannot disable MFA for highly privileged roles for Azure AD and Office365. This is a safety feature because these roles should be carefully protected:  
  
  * Application administrator
  * Application Proxy server administrator
  * Billing administrator  
  * Compliance administrator  
  * CRM service administrator
  * Customer LockBox access approver
  * Directory writer  
  * Exchange administrator  
  * Global administrator
  * Intune service administrator
  * Mailbox administrator  
  * Partner tier1 support  
  * Partner tier2 support  
  * Privileged role administrator
  * Security administrator  
  * SharePoint administrator  
  * Skype for Business administrator  
  * User account administrator  

For more information about using MFA with PIM, see [Require multi-factor authentication for Azure AD directory roles in PIM](pim-how-to-require-mfa.md).

<!--PLACEHOLDER: Need an explanation of what the temporary Global Administrator setting is for.-->

## Next steps

- [Require multi-factor authentication for Azure AD directory roles in PIM](pim-how-to-require-mfa.md)
- [Configure security alerts for Azure AD directory roles in PIM](pim-how-to-configure-security-alerts.md)
