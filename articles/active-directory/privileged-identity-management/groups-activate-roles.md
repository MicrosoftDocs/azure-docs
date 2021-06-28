---
title: Activate privileged access group roles in PIM - Azure AD | Microsoft Docs
description: Learn how to activate your privileged access group roles in Azure AD Privileged Identity Management (PIM).
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
ms.date: 07/01/2021
ms.author: curtand
ms.custom: pim
ms.collection: M365-identity-device-management
---

# Activate my privileged access group roles in Privileged Identity Management

Use Privileged Identity Management (PIM) to allow eligible role members for privileged access groups to schedule role activation for a specified date and time. They can also select a activation duration up to the maximum duration configured by administrators.

This article is for eligible members who want to activate their privileged access group role in Privileged Identity Management.

## Activate a role

When you need to take on an privileged access group role, you can request activation by using the **My roles** navigation option in Privileged Identity Management.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Open **Azure AD Privileged Identity Management**. For information about how to pin the Privileged Identity Management tile to your dashboard, see [Start using Privileged Identity Management](pim-getting-started.md).

1. Select **My roles**.

1. Select **Privileged access group roles** to see a list of your eligible privileged access group roles.

1. In the **Privileged access group roles** list, find the role you want to activate.

1. Select **Activate** to open the Activate page.

1. If your role requires multi-factor authentication, select **Verify your identity before proceeding**. You only have to authenticate once per session.

1. Select **Verify my identity** and follow the instructions to provide additional security verification.

1. If you want to specify a reduced scope, select **Scope** to open the Resource filter pane.

    It's a best practice to only request access to the resources you need. On the Resource filter pane, you can specify the resource groups or resources that you need access to.

1. If necessary, specify a custom activation start time. The member would be activated after the selected time.

1. In the **Reason** box, enter the reason for the activation request.

1. Select **Activate**.

    If the [role requires approval](pim-resource-roles-approval-workflow.md) to activate, a notification will appear in the upper right corner of your browser informing you the request is pending approval.

## View the status of your requests

You can view the status of your pending requests to activate.

1. Open Azure AD Privileged Identity Management.

1. Select **My requests** to see a list of your Azure AD role and privileged access group role requests.

1. Scroll to the right to view the **Request Status** column.

## Cancel a pending request

If you do not require activation of a role that requires approval, you can cancel a pending request at any time.

1. Open Azure AD Privileged Identity Management.

1. Select **My requests**.

1. For the role that you want to cancel, select the **Cancel** link.

    When you select **Cancel**, the request will be canceled. To activate the role again, you will have to submit a new request for activation.

## Troubleshoot

### Permissions are not granted after activating a role

When you activate a role in Privileged Identity Management, the activation may not instantly propagate to all portals that require the privileged role. Sometimes, even if the change is propagated, web caching in a portal may result in the change not taking effect immediately. If your activation is delayed, here is what you should do.

1. Sign out of the Azure portal and then sign back in.
1. In Privileged Identity Management, verify that you are listed as the member of the role.

## Next steps

- [Extend or renew privileged access group roles in Privileged Identity Management](groups-renew-extend.md)
- [Assign my privileged access group roles in Privileged Identity Management](groups-assign-member-owner.md)
