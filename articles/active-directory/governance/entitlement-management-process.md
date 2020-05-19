---
title: Request process & notifications - Azure AD entitlement management
description: Learn about the request process for an access package and when email notifications are sent in Azure Active Directory entitlement management.
services: active-directory
documentationCenter: ''
author: barclayn
manager: daveba
editor: mamtakumar
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.subservice: compliance
ms.date: 03/22/2020
ms.author: barclayn
ms.reviewer: mamkumar
ms.collection: M365-identity-device-management


#Customer intent: As a < type of user >, I want < what? > so that < why? >.

---
# Request process and email notifications in Azure AD entitlement management

When a user submits a request to an access package, a process begins to deliver that access request. Azure AD entitlement management sends email notifications to approvers and requestors when key events occur during the process. This article describes the request process and the email notifications that are sent.

## Request process

A user that needs access to an access package can submit an access request. Depending on the configuration of the policy, the request might require an approval. When a request is approved, a process begins to assign the user access to each resource in the access package. The following diagram shows an overview of the process and the different states:

![Approval process diagram](./media/entitlement-management-process/request-process.png)

| State | Description |
| --- | --- |
| Submitted | User submits a request. |
| Pending approval | If the policy for an access package requires approval, a request moves to pending approval. |
| Expired | If no approvers approve a request within the approval request timeout, the request expires. To try again, the user will have to resubmit their request. |
| Denied | Approver denies a request. |
| Approved | Approver approves a request. |
| Delivering | User has **not** been assigned access to all the resources in the access package. If this is an external user, the user may not have accessed the resource directory yet. They also may not have accepted the consent prompt. |
| Delivered | User has been assigned access to all the resources in the access package. |
| Access extended | If extensions are allowed in the policy, the user extended the assignment. |
| Access expired | User's access to the access package has expired. To get access again, the user will have to submit a request. |

## Email notifications

If you're an approver, you're sent email notifications when you need to approve an access request. You also receive notifications when an access request has been completed. You're also sent email notifications that indicate the status of your request if you're a requestor.

The following diagrams show when these email notifications are sent to either the approvers or the requestor. Reference the [email notifications table](entitlement-management-process.md#email-notifications-table) to find the corresponding number to the email notifications displayed in the diagrams.

### First approvers and alternate approvers
The following diagram shows the experience of first approvers and alternate approvers, and the email notifications they receive during the request process:

![First and alternate approvers process flow](./media/entitlement-management-process/first-approvers-and-alternate-with-escalation-flow.png)

### Requestors
The following diagram shows the experience of requestors and the email notifications they receive during the request process:

![Requestor process flow](./media/entitlement-management-process/requestor-approval-request-flow.png)

### 2-stage approval
The following diagram shows the experience of stage-1 and stage-2 approvers and the email notifications they receive during the request process:

![2-stage approval process flow](./media/entitlement-management-process/2stage-approval-with-request-timeout-flow.png)

### Email notifications table
The following table provides more detail about each of these email notifications. To manage these emails, you can use rules. For example, in Outlook, you can create rules to move the emails to a folder if the subject contains words from this table:

| # | Email subject | When sent | Sent to |
| --- | --- | --- | --- |
| 1 | Action required: Approve or deny forwarded request by *[date]* | This email will be sent to Stage-1 alternate approvers (after the request has been escalated) to take action. | Stage-1 alternate approvers |
| 2 | Action required: Approve or deny request by *[date]* | This email will be sent to the first approver, if escalation is disabled, to take action. | First approver |
| 3 | Reminder: Approve or deny the request by *[date]* for *[requestor]* | This reminder email will be sent to the first approver, if escalation is disabled. The email asks them to take action if they haven't. | First approver |
| 4 | Approve or deny the request by *[time]* on *[date]* | This email will be sent to the first approver (if escalation is enabled) to take action. | First approver |
| 5 | Action required reminder: Approve or deny the request by *[date]* for *[requestor]* | This reminder email will be sent to the first approver, if escalation is enabled. The email asks them to take action if they haven't. | First approver |
| 6 | Request has expired for *[access_package]* | This email will be sent to the first approver and stage-1 alternate approvers after the request has expired. | First approver, stage-1 alternate approvers |
| 7 | Request approved for *[requestor]* to *[access_package]* | This email will be sent to the first approver and stage-1 alternate approvers upon request completion. | First approver, stage-1 alternate approvers |
| 8 | Request approved for *[requestor]* to *[access_package]* | This email will be sent to the first approver and stage-1 alternate approvers of a 2-stage request when the stage-1 request is approved. | First approver, stage-1 alternate approvers |
| 9 | Request denied to *[access_package]* | This email will be sent to the requestor when their request is denied | Requestor |
| 10 | Your request has expired for *[access_package]* | This email will be sent to the requestor at the end of a single or 2-stage request. The email notifies the requestor that the request expired. | Requestor |
| 11 | Action required: Approve or deny request by *[date]* | This email will be sent to the second approver, if escalation is disabled, to take action. | Second approver |
| 12 | Action required reminder: Approve or deny the request by *[date]* | This reminder email will be sent to the second approver, if escalation is disabled. The notification asks them to take action if they haven't yet. | Second approver |
| 13 | Action required: Approve or deny the request by *[date]* for *[requestor]* | This email will be sent to second approver, if escalation is enabled, to take action. | Second approver |
| 14 | Action required reminder: Approve or deny the request by *[date]* for *[requestor]* | This reminder email will be sent to the second approver, if escalation is enabled. The notification asks them to take action if they haven't yet. | Second approver |
| 15 | Action required: Approve or deny forwarded request by *[date]* | This email will be sent to stage-2 alternate approvers, if escalation is enabled, to take action. | Stage-2 alternate approvers |
| 16 | Request approved for *[requestor]* to *[access_package]* | This email will be sent to the second approver and stage-2 alternate approvers upon approving the request. | Second approver, Stage-2 alternate approvers |
| 17 | A request has expired for *[access_package]* | This email will be sent to the second approver or alternate approvers, after the request expires. | Second approver, stage-2 alternate approvers |
| 18 | You now have access to *[access_package]* | This email will be sent to the end users to start using their access. | Requestor |
| 19 | Extend access for *[access_package]* by *[date]* | This email will be sent to the end users before their access expires. | Requestor |
| 20 | Access has ended for *[access_package]* | This email will be sent to the end users after their access expires. | Requestor |

### Access request emails

When a requestor submits an access request for an access package configured to require approval, all approvers added to the policy will receive an email notification with details of the request. The details in the email include: requestor's name organization, and business justification; and the requested access start and end date (if provided). The details will also include when the request was submitted and when the request will expire.

The email includes a link approvers can click on to go to My Access to approve or deny the access request. Here is a sample email notification that is sent to the first approver or second approver (if 2-stage approval is enabled) to complete an access request:

![Approve request to access package email](./media/entitlement-management-shared/approver-request-email.png)

Approvers can also receive a reminder email. The email asks the approver to make a decision on the request. Here is a sample email notification the approver receives to remind them to take action:

![Reminder access request email](./media/entitlement-management-process/approver-access-request-reminder-email.png)

### Alternate approvers request emails

If the alternate approvers setting is enabled and the request is still pending, it will be forwarded. Alternate approvers will receive an email to approve or deny the request. You can enable alternate approvers in stage-1 and stage-2. Here is a sample email of the notification the alternate approvers receive:

![Alternate approvers request email](./media/entitlement-management-process/alternate-approver-email-fwd-request.png)

Both the approver and the alternate approvers can approve or deny the request.

### Approved or denied emails

 When an approver receives an access request submitted by a requestor, they can approve or deny the access request. The approver needs to add a business justification for their decision. Here is a sample email sent to the approvers
 and alternate approvers after a request is approved:

![Approved request to access package email](./media/entitlement-management-process/approver-request-email-approved.png)

When an access request is approved, and their access is provisioned, an email notification is sent to the requestor that they now have access to the access package. Here is a sample email notification that is sent to a requestor when they're granted access to an access package:

![Approved requestor access request email](./media/entitlement-management-process/requestor-email-approved.png)

When an access request is denied, an email notification is sent to the requestor. Here is a sample email notification that is sent to a requestor when their access request is denied:

![Requestor request denied email](./media/entitlement-management-process/requestor-email-denied.png)

### 2-stage approval access request emails

If 2-stage approval is enabled, at least two approvers must approve the request, one from each stage, before the requestor can receive access.

During stage-1, the first approver will receive the access request email and make a decision. If they approve the request, all first approvers and alternate approvers in stage-1 (if escalation is enabled) will receive notification that stage-1 is complete. Here is a sample email of the notification that is sent when stage-1 is complete:

![2-stage access request email](./media/entitlement-management-process/approver-request-email-2stage.png)

After the first or alternate approvers approve the request in stage-1, stage-2 begins. During stage-2, the second approver will receive the access request notification email. After the second approver or alternate approvers in stage-2 (if escalation is enabled) decide to approve or deny the request, notification emails are sent to the first and second approvers, and all alternate approvers in stage-1 and stage-2, as well as the requestor.

### Expired access request emails

Access requests could expire if no approver has approved or denied the request. 

When the request reaches its configured expiration date and expires, it can no longer be approved or denied by the approvers. Here is a sample email of the notification sent to all of the first, second (if 2-stage approval is enabled), and alternate approvers:

![Approvers expired access request email](./media/entitlement-management-process/approver-request-email-expired.png)

An email notification is also sent to the requestor, notifying them that their access request has expired, and that they need to resubmit the access request. The following diagram shows the experience of the requestor and the email notifications they receive when they request to extend access:

![Requestor extend access process flow](./media/entitlement-management-process/requestor-expiration-request-flow.png) 

Here is a sample email notification that is sent to a requestor when their access request has expired:

![Requestor expired access request email](./media/entitlement-management-process/requestor-email-request-expired.png)

## Next steps

- [Request access to an access package](entitlement-management-request-access.md)
- [Approve or deny access requests](entitlement-management-request-approve.md)
