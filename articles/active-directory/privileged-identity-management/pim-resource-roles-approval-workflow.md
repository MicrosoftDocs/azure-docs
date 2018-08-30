---
title: Approve or deny requests for Azure resource roles in PIM | Microsoft Docs
description: Learn how to approve or deny requests for Azure resource roles in Azure AD Privileged Identity Management (PIM).
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
ms.date: 04/02/2018
ms.author: rolyon
ms.custom: pim
---

# Approve or deny requests for Azure resource roles in PIM

To approve or deny a request, you must be a member of the approver list. 

1. In PIM, select **Approve requests** from the tab on the left menu and locate the request.

   !["Approve requests" pane](media/azure-pim-resource-rbac/aadpim_rbac_approve_requests_list.png)

2. Select the request, provide a justification for the decision, and select **Approve** or **Deny**. The request is then resolved.

   ![Selected request with detailed information](media/azure-pim-resource-rbac/aadpim_rbac_approve_request_approved.png)

## Workflow notifications

Here are some facts about workflow notifications:

- All members of the approver list are notified by email when a request for a role is pending their review. Email notifications include a direct link to the request, where the approver can approve or deny.
- Requests are resolved by the first member of the list who approves or denies. 
- When an approver responds to the request, all members of the approver list are notified of the action. 
- Resource administrators are notified when an approved member becomes active in their role. 

>[!Note]
>A resource administrator who believes that an approved member should not be active can remove the active role assignment in PIM. Although resource administrators are not notified of pending requests unless they are members of the approver list, they can view and cancel pending requests of all users by viewing pending requests in PIM. 

## Next steps

- [Approve or deny requests for Azure AD directory roles in PIM](azure-ad-pim-approval-workflow.md)
- [Email notifications in PIM](pim-email-notifications.md)
