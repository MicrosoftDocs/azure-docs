---
title: Request process and email notifications in Azure AD entitlement management (Preview) - Azure Active Directory
description: Learn about the request process for an access package and when email notifications are sent in Azure Active Directory entitlement management (Preview).
services: active-directory
documentationCenter: ''
author: rolyon
manager: mtillman
editor: mamtakumar
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.subservice: compliance
ms.date: 05/30/2019
ms.author: rolyon
ms.reviewer: mamkumar
ms.collection: M365-identity-device-management


#Customer intent: As a < type of user >, I want < what? > so that < why? >.

---
# Request process and email notifications in Azure AD entitlement management (Preview)

> [!IMPORTANT]
> Azure Active Directory (Azure AD) entitlement management is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

When a user submits a request to an access package, a process is started to deliver that request. Azure AD entitlement management also sends email notifications to approvers and requestors when key events occur during the process.

This article describes the request process, and the email notifications that are sent.

## Request process

A user that needs access to an access package can submit an access request. Depending on the configuration of the policy, the request might require an approval. When a request is approved, a process begins to assign the user access to each resource in the access package. The following diagram shows an overview of the process and the different states.

![Approval process diagram](./media/entitlement-management-process/request-process.png)

| State | Description |
| --- | --- |
| Submitted | User submits a request. |
| Pending approval | If the policy for an access package requires approval, a request moves to pending approval. |
| Expired | If no approvers approve a request within the approval request timeout, the request expires. To try again, the user will have to resubmit their request. |
| Denied | Approver denies a request. |
| Approved | Approver approves a request. |
| Delivering | User has **not** been assigned access to all the resources in the access package. If this is an external user, the user has not yet accessed the resource directory and accepted the permissions prompt. |
| Delivered | User has been assigned access to all the resources in the access package. |
| Access extended | If extensions are allowed in the policy, the user extended the assignment. |
| Access expired | User's access to the access package has expired. To get access again, the user will have to submit a request. |

## Email notifications

If you are an approver, you are sent email notifications when you need to approve an access request and when an access request has been completed. If you are a requestor, you are sent email notifications that indicate the status of your request. The following diagram shows when these email notifications are sent.

![Entitlement management email process](./media/entitlement-management-process/email-notifications.png)

The following table provides more detail about each of these email notifications.

| # | Email subject | When sent | Sent to |
| --- | --- | --- | --- |
| 1 | Action required: Review access request from *[requestor]* to *[access package]* by *[date]* | When a requestor submits a request for an access package | All approvers |
| 2 | Action required: Review access request from *[requestor]* to *[access package]* by *[date]* | X days before the approval request timeout | All approvers |
| 3 | Status notification: *[requestor]*'s access request to *[access package]* has expired | When the approvers do not approve or deny an access request within the request duration | Requestor |
| 4 | Status notification: *[requestor]* access request to *[access package]* has been completed | When the first approver approves or denies an access request | All approvers |
| 5 | You have been denied access to *[access package]* | When a requestor has been denied access to the access package | Requestor |
| 6 | You now have access to *[access package]*  | When a requestor has been granted access to every resource in the access package | Requestor |
| 7 | Your access to *[access package]* expires in X day(s) | X days before the requestor's access to the access package expires | Requestor |
| 8 | Your access to *[access package]* has expired | When the requestor's access to an access package expires | Requestor |

### Access request emails

When a requestor submits an access request for an access package that is configured to require approval, all approvers configured in the policy receive an email notification with details of the request. Details include the requestor's name, organization, access start and end date if provided, business justification, when the request was submitted, and when the request will expire. The email includes a link where approvers can approve or deny the access request. Here is a sample email notification that is sent to an approver when a requestor submits an access request.

![Review access request email](./media/entitlement-management-shared/email-approve-request.png)

### Approved or denied emails

Requestors are notified when their access request is approved and available for access, or when their access request is denied. When an approver receives an access request submitted by a requestor, they can approve or deny the access request. The approver needs to add a business justification for their decision.

When an access request is approved, entitlement management starts the process of granting the requestor access to each of the resources in the access package. After the requestor has been granted access to every resource in the access package, an email notification is sent to the requestor that their access request was approved and that they now have access to the access package. Here is a sample email notification that is sent to a requestor when they are granted access to an access package.

When an access request is denied, an email notification is sent to the requestor. Here is a sample email notification that is sent to a requestor when their access request is denied.

### Expired access request emails

Requestors are notified when their access request has expired. When a requestor submits an access request, the request has a request duration after which it expires. If there are no approvers who submit an approve/deny decision, the request continues to remain in a pending approval state. When the request reaches its configured expiration duration, the request expires, and can no longer be approved or denied by the approvers. In this case, the request goes into an expired state. An expired request can no longer be approved or denied. An email notification is sent to the requestor that their access request has expired, and that they need to resubmit the access request. Here is a sample email notification that is sent to a requestor when their access request has expired.

![Expired access request email](./media/entitlement-management-process/email-expired-access-request.png)

## Next steps

- [Request access to an access package](entitlement-management-request-access.md)
- [Approve or deny access requests](entitlement-management-request-approve.md)
