---
title: Approve or deny requests for Azure AD directory roles in PIM | Microsoft Docs
description: Learn how to approve or deny requests for Azure AD directory roles in Azure AD Privileged Identity Management (PIM).
services: active-directory
documentationcenter: ''
author: rolyon
manager: mtillman
editor: ''

ms.service: active-directory
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.component: pim
ms.date: 04/28/2017
ms.author: rolyon
ms.custom: pim
---

# Approve or deny requests for Azure AD directory roles in PIM

With Privileged Identity Management, you can configure roles to require approval for activation, and choose one or multiple users or groups as delegated approvers.

## View pending approvals (requests)

As a delegated approver, you’ll receive email notifications when a request is
pending your approval. To view these requests in the PIM portal, from the
dashboard (in the new navigation) select the “Pending Approval Requests” tab in
the left navigation bar.

![](media/azure-ad-pim-approval-workflow/image023.png)

From there, you’ll see a list of requests pending approval:

![](media/azure-ad-pim-approval-workflow/image024.png)

## Approve or deny requests for role elevation (single and/or bulk)

Select the requests you wish to approve or deny, and click the button in the
action bar that corresponds with your decision:

![](media/azure-ad-pim-approval-workflow/image025.png)

## Provide justification for my approval/denial

This will open a new blade to approve or deny multiple requests at once. Enter a
justification for your decision, and click approve (or deny) at the bottom or
the blade:

![](media/azure-ad-pim-approval-workflow/image029.png)

When the request process is complete, the status symbol will reflect the
decision you made (in this example, the decision is approve):

![](media/azure-ad-pim-approval-workflow/image031.png)

## Next steps

- [Approve or deny requests for Azure resource roles in PIM](pim-resource-roles-approval-workflow.md)
- [Email notifications in PIM](pim-email-notifications.md)
