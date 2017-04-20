---
title: Privileged Identity Management Approval workflows
description: Learn about approval workflows in Privileged Identity Management (PIM)
services: active-directory
documentationcenter: ''
author: barclayn
manager: mbaldwin
editor: ''

ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/19/2017
ms.author: barclayn

---

# Azure AD PIM – Approval Workflow (Preview)

## Private Preview

Greetings and thank you for electing to participate in the Private Preview for
PIM Approvals! We are thankful to have customers like you, eager to try early
versions of products we hope will bring immense value to all our customers soon.

>[!NOTE]
Please keep in mind this feature is still in development, and you may encounter
bugs. The functionality, including text and naming conventions are subject to
change, and should not be considered final. Additionally, participation in this
program is covered under your NDA, and the experiences are not to be shared with
other customers without approval from the Microsoft product team.


To share feedback, or in the event you encounter a bug when using this feature,
please send your correspondence to: <pim-preview@microsoft.com>

## Key Terminology

*Eligible Role User* – An eligible role user is a user within your organization
that’s been assigned to an Azure AD role as eligible (role requires activation).

*Privileged Role Administrator (PRA)* – A PRA is one or multiple individuals
within the organization whom manage the assignment, settings, and review of
privileged roles in your Azure AD.

*Delegated Approver* – A delegated approver is one or multiple individuals or
groups within your Azure AD whom are responsible for approving requests for role
activation.

## Scenarios

The private preview supports the following scenarios:

**As a Privileged Role Administrator (PRA) you can:**

-   [enable approval for specific roles](#enable-approval-for-specific-roles)

-   [specify approver users and/or groups to approve
    requests](#specify-approver-users-andor-groups-to-approve-requests)

-   [view request and approval history for all privileged
    roles](#view-request-and-approval-history-for-all-privileged-roles)

**As a designated approver, you can:**

-   [view pending approvals (requests)](#view-pending-approvals-requests)

-   [approve or reject requests for role elevation (single and/or
    bulk)](#approve-or-reject-requests-for-role-elevation-single-andor-bulk)

-   [provide justification for my
    approval/rejection](#provide-justification-for-my-approvalrejection) 

**As an Eligible Role User you can: **

-   [request activation of a role that requires
    approval](#request-activation-of-a-role-that-requires-approval)

-   [view the status of your request to
    activate](#view-the-status-of-your-request-to-activate)

-   [complete your task in Azure AD if activation was
    approved](#complete-your-task-in-azure-ad-if-activation-was-approved)

### Navigation

The Approval scenarios are only available in the new navigation. To get there,
log into the Azure Portal, and navigate to PIM. When you see the below, select
the link to “Try the new navigation”.

![](media/azure-ad-pim-approval-workflow/image001.png)

Once the new navigation loads, you’ll see the below screen:

![](media/azure-ad-pim-approval-workflow/image003.png)

>[!NOTE]
If you encounter an Access Denied page, you’ll need to activate your PRA
role to see everything. Remember, approvals may only be configured by a PRA.

### Enable approval for specific roles

To enable approval for a specific role, select the settings button in the action
bar.

![](media/azure-ad-pim-approval-workflow/image005.png)

Select Privileged Roles:

![](media/azure-ad-pim-approval-workflow/image007.png)

Select a Role you want to enable approval:

![](media/azure-ad-pim-approval-workflow/image009.png)

Select “Enable” in the Require approval section:

![](media/azure-ad-pim-approval-workflow/image011.png)

Once enabled, the blade will expand to show the following details:

![](media/azure-ad-pim-approval-workflow/image013.png)

>[!NOTE]
If you DO NOT specify any approvers, the PRA(s) become the default
approver(s). PRA(s) would be required to approve ALL activation requests for
this role.

### Specify approver users and/or groups to approve requests

To delegate approval, click the option to “Select approvers”:

![](media/azure-ad-pim-approval-workflow/image015.png)

When the Select approvers blade loads, you may search for a specific user or
group using the search bar at the top, or selecting from the pre-populated list,
then click “Select” when finished:

![](media/azure-ad-pim-approval-workflow/image017.png)

Note: You may select multiple users or groups at a time.

Your selection will appear in the list of selected approvers as seen below:

![](media/azure-ad-pim-approval-workflow/image019.png)

To remove an approver, simply click the Remove button next to their name.

To add additional approvers, repeat the process.

## View request and approval history for all privileged roles

To view request and approval history for all privileged roles (as a PRA), select
the Audit history tile from the dashboard:

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

![](media/azure-ad-pim-approval-workflow/image025.png)

### Approve or reject requests for role elevation (single and/or bulk)

Select the requests you wish to approve or deny, and click the button in the
action bar that corresponds with your decision:

![](media/azure-ad-pim-approval-workflow/image027.png)

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

Your feedback is valuable to us. Please ensure you share any comments or bugs
with us as promptly as possible.

[Send communication to us
here](mailto:pim_preview@microsoft.com?subject=Feedback%20or%20Bug%20|%20PIM%20Approvals)
