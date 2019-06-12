---
title: Activate my Azure resource roles in PIM - Azure Active Directory | Microsoft Docs
description: Learn how to activate your Azure resource roles in Azure AD Privileged Identity Management (PIM).
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

# Activate my Azure resource roles in PIM

Using Azure Active Directory (Azure AD) Privileged Identity Management (PIM), eligible role members for Azure resources can schedule activation for a future date and time. They can also select a specific activation duration within the maximum (configured by administrators).

This article is for members who need to activate their Azure resource role in PIM.

## Activate a role

When you need to take on an Azure resource role, you can request activation by using the **My roles** navigation option in PIM.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Open **Azure AD Privileged Identity Management**. For information about how to add the PIM tile to your dashboard, see [Start using PIM](pim-getting-started.md).

1. Click **My roles**.

    ![Azure AD roles and Azure resource roles - My roles](./media/pim-resource-roles-activate-your-roles/resources-my-roles.png)

1. Click **Azure resource roles** to see a list of your eligible Azure resource roles.

   ![Azure resource roles](./media/pim-resource-roles-activate-your-roles/resources-my-roles-azure-resources.png) 

1. In the **Azure resource roles** list, find the role you want to activate.

    ![Azure resource roles - My roles list](./media/pim-resource-roles-activate-your-roles/resources-my-roles-activate.png)

1. Click **Activate** to open the Activate pane.

1. If your role requires multi-factor authentication (MFA), click **Verify your identity before proceeding**. You only have to authenticate once per session.

    ![Verify with MFA before role activation](./media/pim-resource-roles-activate-your-roles/resources-my-roles-mfa.png)

1. Click **Verify my identity** and follow the instructions to provide additional security verification.

    ![Additional security verification](./media/pim-resource-roles-activate-your-roles/resources-mfa-enter-code.png)

1. If you want to specify a reduced scope, click **Scope** to open the Resource filter pane.

    It's a best practice to only request access to the resources you need. On the Resource filter pane, you can specify the resource groups or resources that you need access to.

    ![Activate - Resource filter](./media/pim-resource-roles-activate-your-roles/resources-my-roles-resource-filter.png)

1. If necessary, specify a custom activation start time. The member would be activated after the selected time.

1. In the **Reason** box, enter the reason for the activation request.

    ![Completed Activate pane](./media/pim-resource-roles-activate-your-roles/resources-my-roles-activate-done.png)

1. Click **Activate**.

    If the role does not require approval, it is activated and added to the list of active roles. If you want to use the role, follow the steps in next section.

    If the [role requires approval](pim-resource-roles-approval-workflow.md) to activate, a notification will appear in the upper right corner of your browser informing you the request is pending approval.

    ![Request pending notification](./media/pim-resource-roles-activate-your-roles/resources-my-roles-activate-notification.png)

## Use a role immediately after activation

In case of any delay after activation, follow these steps after you activate to use your Azure resource roles immediately.

1. Open Azure AD Privileged Identity Management.

1. Click **My roles** to see a list of your eligible Azure AD roles and Azure resource roles.

1. Click **Azure resource roles**.

1. Click the **Active roles** tab.

1. Once the role is active, sign out of the portal and sign back in.

    The role should now be available to use.

## View the status of your requests

You can view the status of your pending requests to activate.

1. Open Azure AD Privileged Identity Management.

1. Click **My requests** to see a list of your Azure AD role and Azure resource role requests.

    ![Azure AD roles and Azure resource roles - My requests](./media/pim-resource-roles-activate-your-roles/resources-my-requests.png)

1. Scroll to the right to view the **Request Status** column.

## Cancel a pending request

If you do not require activation of a role that requires approval, you can cancel a pending request at any time.

1. Open Azure AD Privileged Identity Management.

1. Click **My requests**.

1. For the role that you want to cancel, click the **Cancel** link.

    When you click Cancel, the request will be canceled. To activate the role again, you will have to submit a new request for activation.

   ![Cancel pending request](./media/pim-resource-roles-activate-your-roles/resources-my-requests-cancel.png)

## Troubleshoot

### Permissions not granted after activating a role

When you activate a role in PIM, it takes at least 10 minutes before you can access the desired administrative portal or perform functions within a specific administrative workload. Once the activation is complete, sign out of the Azure portal and sign back in to start using the newly activated role.

For additional troubleshooting steps, see [Troubleshooting Elevated Permissions](https://social.technet.microsoft.com/wiki/contents/articles/37568.troubleshooting-elevated-permissions-with-azure-ad-privileged-identity-management.aspx).

### Cannot activate a role due to a resource lock

If you receive a message that an Azure resource is locked when you try to activate a role, it might be because a resource within the scope of a role assignment has a resource lock. Locks protect resources from accidental deletion or unexpected changes. A lock also prevents PIM from removing a role assignment on the resource at the end of the activation period. Since PIM is unable to function properly when a lock is applied, PIM prohibits users from activating roles on the resource. There are two ways that you can address this issue:

- Delete the lock as described in [Lock resources to prevent unexpected changes](../../azure-resource-manager/resource-group-lock-resources.md).
- If you want to keep the lock, make the role assignment permanent or use a break-glass account.

## Next steps

- [Extend or renew Azure resource roles in PIM](pim-resource-roles-renew-extend.md)
- [Activate my Azure AD roles in PIM](pim-how-to-activate-role.md)
