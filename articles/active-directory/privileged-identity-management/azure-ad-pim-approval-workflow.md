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

With Approvals for Privileged Identity Management, you can configure roles to require approval for activation, and choose one or multiple users or groups as delegated approvers. Keep reading to learn how to configure roles and select approvers.


## New Terminology

*Eligible Role User* – An eligible role user is a user within your organization
that’s been assigned to an Azure AD role as eligible (role requires activation).

*Delegated Approver* – A delegated approver is one or multiple individuals or
groups within your Azure AD responsible for approving requests to activate roles.

## Scenarios

The private preview supports the following scenarios:

**As a Privileged Role Administrator (PRA) you can:**

-   [enable approval for specific roles](#enable-approval-for-specific-roles)

-   [specify approver users and/or groups to approve requests](#specify-approver-users-and/or-groups-to-approve-requests)

-   [view request and approval history for all privileged roles](#view-request-and-approval-history-for-all-privileged-roles)

**As a designated approver, you can:**

-   [view pending approvals (requests)](#view-pending-approvals-requests)

-   [approve or reject requests for role elevation (single and/or bulk)](#approve-or-reject-requests-for-role-elevation-single-and/or-bulk)

-   [provide justification for my approval/rejection](#provide-justification-for-my-approval/rejection) 

**As an Eligible Role User you can:**

-   [request activation of a role that requires approval](#request-activation-of-a-role-that-requires-approval)

-   [view the status of your request to activate](#view-the-status-of-your-request-to-activate)

-   [complete your task in Azure AD if activation was approved](#complete-your-task-in-azure-ad-if-activation-was-approved)

## View request and approval history for all privileged roles

To view request and approval history for all privileged roles, select Audit History from the dashboard:

![](media/azure-ad-pim-approval-workflow/image021.png)

>[!NOTE]
You can sort the data by Action, and look for “Activation Approved”

### View pending approvals (requests)

As a delegated approver, you’ll receive email notifications when a request is
pending your approval. To view these requests in the PIM portal, from the
dashboard (in the new navigation) select the “Pending Approval Requests” tab in
the left navigation bar.

![](media/azure-ad-pim-approval-workflow/image023.png)

From there, you’ll see a list of requests pending approval:

![](media/azure-ad-pim-approval-workflow/image024.png)

### Approve or reject requests for role elevation (single and/or bulk)

Select the requests you wish to approve or deny, and click the button in the
action bar that corresponds with your decision:

![](media/azure-ad-pim-approval-workflow/image025.png)

### Provide justification for my approval/rejection

This will open a new blade to approve or deny multiple requests at once. Enter a
justification for your decision, and click approve (or deny) at the bottom or
the blade:

![](media/azure-ad-pim-approval-workflow/image029.png)

When the request process is complete, the status symbol will reflect the
decision you made (in this example, the decision is approve):

![](media/azure-ad-pim-approval-workflow/image031.png)

### Request activation of a role that requires approval

Requesting activation of a role that requires approval may be initiated from
either the old PIM navigation, or the new navigation, as the process for role
activation remains the same. Simply select a role from the list of roles to
activate:

![](media/azure-ad-pim-approval-workflow/image033.png)

If a privileged role requires Multi-Factor Authentication, you’ll be prompted to
complete that task first:

![](media/azure-ad-pim-approval-workflow/image035.png)

Once complete, click Activate and provide a justification (if required):

![](media/azure-ad-pim-approval-workflow/image037.png)

The requestor will see a notification that the request is pending approval:

![](media/azure-ad-pim-approval-workflow/image039.png)

### View the status of your request to activate

Viewing the status of a pending request to activate must be accessed from the
new navigation. From the left navigation bar, select the “My Requests” tab:

![](media/azure-ad-pim-approval-workflow/image041.png)

The request state defaults to “Pending”, but you can toggle to see all or denied
requests.

### Complete your task in Azure AD if activation was approved

Once the request is approved, the role is active and you may proceed with any
work that requires this role.

![](media/azure-ad-pim-approval-workflow/image043.png)

## Next steps

- [Approve or deny requests for Azure resource roles in PIM](pim-resource-roles-approval-workflow.md)
