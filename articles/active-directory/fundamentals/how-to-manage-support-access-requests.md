---
title: Manage Microsoft Support access requests (preview)
description: How to view and control support access requests to Azure Active Directory identity data
services: active-directory
author: shlipsey3
manager: amycolannino
ms.author: sarahlipsey
ms.reviewer: jeffsta
ms.service: active-directory
ms.topic: troubleshooting
ms.subservice: fundamentals
ms.workload: identity
ms.date: 07/11/2023
ms.collection: M365-identity-device-management

---
# Manage Microsoft Support access requests (preview)

You can use the Microsoft Entra admin center to manage Microsoft Support access requests (preview). Microsoft Support access requests enable you to give Microsoft Support engineers access to [diagnostic data](concept-diagnostic-data-access.md) in your identity service to help solve support requests you submitted to Microsoft.

## Prerequisites

Only certain Azure AD roles are authorized to manage Microsoft Support access requests. To manage Microsoft Support access requests, a role must have the permission `microsoft.azure.supportTickets/allEntities/allTasks`. To see which Azure AD roles have this permission, search the [Azure AD built-in roles](../roles/permissions-reference.md) for the required permission.

## View existing support access requests

To view all Microsoft Support access requests for your tenant that are no longer pending and less than 30 days old, navigate to the **Diagnose and solve problems** page in Azure AD, select **Approved access**. 

Select the **Support request ID** link to see the details of the Support Access Request. The details page shows information about your support request.

![Screenshot of the Support access requests with the pending requests link highlighted](media/how-to-manage-support-access-requests/request-history.png)

Select the **Revoke** button to revoke access to an **Approved** Support Access Request. The status of a **Rejected, Revoked,** or **Completed** Support Access request can't be changed. 

![Screenshot of the Support access requests history with the Revoke button highlighted](media/how-to-manage-support-access-requests/request-history-details.png)

When your support request is closed, the status of an approved Microsoft Support Access Request is automatically set to **Completed.** Microsoft Support access requests remain in **Approved access** for 30 days.

## Remove Microsoft Support access

Closing a support request automatically revokes the support engineer's access to your identity diagnostic data. If you want to remove Microsoft Support's access to identity diagnostic data for the support request *before* your support request is closed, you can manually revoke access. 

1. Go to **Microsoft support access requests**.
1. Select the **Remove access** button.
<!--- Check on the process --->
Microsoft Support's access to your identity diagnostic data is immediately revoked for that request.



## Next steps

- [How to create a support request](how-to-get-support.md)

- [Learn about the diagnostic data Azure identity support can access](concept-diagnostic-data-access.md)
