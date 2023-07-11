---
title: Approve Microsoft Support access requests (preview)
description: How to approve Microsoft Support access requests to Azure Active Directory identity data
services: active-directory
author: shlipsey3
manager: amycolannino
ms.author: sarahlipsey
ms.reviewer: jeffsta
ms.service: active-directory
ms.topic: troubleshooting
ms.subservice: fundamentals
ms.workload: identity
ms.date: 07/10/2023
ms.collection: M365-identity-device-management

---
# Approving Microsoft Support access requests (preview)

In many situations, enabling the collection of **Advanced diagnostic information** during the creation of a support access request is sufficient for Microsoft Support to troubleshoot your issue. In some situations though, a separate approval may be needed to allow Microsoft support to access your identity diagnostic data.

Microsoft Support access requests enable you to give Microsoft Support engineers access to [diagnostic data](concept-diagnostic-data-access.md) in your identity service to help solve support requests you submitted to Microsoft. You can use the Azure Active Directory (Azure AD) administration portal and the Microsoft Entra admin center to manage Microsoft Support access requests (preview).

This article describes how the process works and how to approve Microsoft Support access requests.

## Prerequisites

Only authorized users in your tenant can view and manage Microsoft Support access requests. To view, approve, and reject Microsoft Support access requests, a role must have the permission `microsoft.azure.supportTickets/allEntities/allTasks`. To see which Azure AD roles have this permission, search the [Azure AD built-in roles](../roles/permissions-reference.md) for the required permission.

## Scenarios and workflow

A support access request may be used for several specific support scenarios. At this time, the following cross-tenant scenario is covered by this process:

- The Microsoft Support engineer needs access to diagnostic data in a *resource tenant* that is different from the tenant in which the support request was created, known as the *support request tenant*.  
- The support engineer creates a support access request for the *resource tenant*.
- An administrator of *both* tenants approves the Microsoft Support access request.
- With approval, the support engineer only has access to the data in the approved *resource tenant*. 
- Closing the support request automatically revokes the support engineer's access to your identity data.

This cross-tenant scenario is the primary scenario where a support access request is necessary. In these scenarios, Microsoft approved access is visible only in the resource tenant. To preserve cross-tenant privacy, an administrator of the *support request tenant* is unable to see whether an administrator of the *resource tenant* has manually removed this approval. 

## Pending requests

When you receive a notification for a Microsoft Support Access Request in your tenant, you need to approve that request in order for Microsoft Support to access your identity diagnostic data. 
<!--- Confirm the notification process --->

### See your pending requests

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to **Diagnose and solve problems**.

1. Select **Pending requests** from the **Microsoft Support Access Requests (Preview)** section at the bottom of the page.    

1. Select the **Support request ID** link for the request you need to approve.

    You can also select the **Review for approval** link.

    ![Screenshot of the Support Access requests page, with the Support Request ID and Action needed links highlighted](media/how-to-manage-support-access-requests/pending-requests.png) 

### Pending request details

The **Pending request** page shows information about your support case, and the reason that Microsoft Support needs your approval in order to access your diagnostic data.

- To approve the Support Access Request, select the **Approve** button.
    - Microsoft Support now has *read-only* access to your identity diagnostic data until your support request is completed.
- To reject the Support Access Request, select the **Reject** button.
    - Microsoft Support does *not* have access to your identity diagnostic data.
    - A message appears, indicating this choice may result in slower resolution of your support request.
    - Your support engineer will ask you for data needed to diagnose the issue, and you'll need to collect and provide that information to your support engineer. 

![Screenshot of the Support Access requests details page with the Reject and Approve buttons highlighted](media/how-to-manage-support-access-requests/pending-request-details.png)

## Approve access

To view all Support Access Requests for your tenant that are no longer pending and less than 30 days old, navigate to the **Diagnose and solve problems** page in Azure AD, select **Approved access**. 

Select the **Support request ID** link to see the details of the Support Access Request. The details page shows information about your support request.

![Screenshot of the Support Access Requests with the pending requests link highlighted](media/how-to-manage-support-access-requests/request-history.png)

## Revoke access

Microsoft Support approved access to your identity diagnostic data is revoked when your support request is closed.

If you want to remove Microsoft Support’s access to identity diagnostic data for the support request before it's closed, you can select the **Remove acces**s button. Microsoft Support’s access to identity diagnostic data in this tenant is immediately removed for this support request. 

The status of a **Rejected, Revoked,** or **Completed** Support Access request can't be changed.
<!--- is the above statement true? ---> 

![Screenshot of the Support Access Requests history with the Revoke button highlighted](media/how-to-manage-support-access-requests/request-history-details.png)

When your support request is closed, the status of an approved Microsoft Support Access Request is automatically set to **Completed.** Microsoft Support Access Requests remain in **Approved access** for 30 days.

## Next steps

- [How to create a support request](how-to-get-support.md)

- [Learn about the diagnostic data Azure identity support can access](concept-diagnostic-data-access.md)
