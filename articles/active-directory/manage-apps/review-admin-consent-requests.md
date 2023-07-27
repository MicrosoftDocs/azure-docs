---
title: Review and take action on admin consent requests
description: Learn how to review and take action on admin consent requests that were created after you were designated as a reviewer.
services: active-directory
author: omondiatieno
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: how-to
ms.date: 06/14/2023
ms.author: jomondi
ms.reviewer: ergreenl
ms.custom: enterprise-apps


#customer intent: As an admin, I want to review and take action on admin consent requests.
---
# Review admin consent requests

In this article, you learn how to review and take action on admin consent requests. To review and act on consent requests, you must be designated as a reviewer. For more information, check out the [Configure the admin consent workflow](configure-admin-consent-workflow.md) article. As a reviewer, you can view all admin consent requests but you can only act on those requests that were created after you were designated as a reviewer.

## Prerequisites

To review and take action on admin consent requests, you need:

- An Azure account. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A designated reviewer with the appropriate role to [review admin consent requests](grant-admin-consent.md#prerequisites).

## Review and take action on admin consent requests

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

To review the admin consent requests and take action:

1. Sign in to the [Azure portal](https://portal.azure.com) as one of the registered reviewers of the admin consent workflow.
1. Search for and select **Azure Active Directory**.
1. From the navigation menu, select **Enterprise applications**.
1. Under **Activity**, select **Admin consent requests**.
1. Select **My Pending** tab to view and act on the pending requests. 
1. Select the application that is being requested from the list.
1. Review details about the request:
   - To see what permissions are being requested by the application, select **Review permissions and consent**.
   - To view the application details, select the **App details** tab.
   - To see who is requesting access and why, select the **Requested by** tab.
   
   :::image type="content" source="media/configure-admin-consent-workflow/review-consent-requests.png" alt-text="Screenshot of the admin consent requests in the portal.":::
   
1. Evaluate the request and take the appropriate action:
   - **Approve the request**. To approve a request, grant admin consent to the application. Once a request is approved, all requestors are notified that they have been granted access. Approving a request allows all users in your tenant to access the application unless otherwise restricted with user assignment. 
   - **Deny the request**. To deny a request, you must provide a justification that is provided to all requestors. Once a request is denied, all requestors are notified that they have been denied access to the application. Denying a request won't prevent users from requesting admin consent to the application again in the future.  
   - **Block the request**. To block a request, you must provide a justification that is provided to all requestors. Once a request is blocked, all requestors are notified they've been denied access to the application. Blocking a request creates a service principal object for the application in your tenant in a disabled state. Users won't be able to request admin consent to the application in the future.

## Review admin consent requests using Microsoft Graph

To review the admin consent requests programmatically, use the [appConsentRequest resource type](/graph/api/resources/appconsentrequest) and [userConsentRequest resource type](/graph/api/resources/userconsentrequest) and their associated methods in Microsoft Graph. You can't approve or deny consent requests using Microsoft Graph.

## Next steps
- [Review permissions granted to apps](manage-application-permissions.md)
- [Grant tenant-wide admin consent](grant-admin-consent.md)
