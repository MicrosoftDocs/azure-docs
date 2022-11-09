---
title: View and remove requests for an access package in Azure AD entitlement management - Azure Active Directory
description: Learn how to view requests and remove for an access package in Azure Active Directory entitlement management.
services: active-directory
documentationCenter: ''
author: owinfreyatl
manager: amycolannino
editor: 
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: how-to
ms.subservice: compliance
ms.date: 9/20/2021
ms.author: owinfrey
ms.reviewer: 
ms.collection: M365-identity-device-management


#Customer intent: As an access package manager, I want detailed information about requests for access packages so that I can view the status and troubleshoot any issues.

---
# View and remove requests for an access package in Azure AD entitlement management

In Azure AD entitlement management, you can see who has requested access packages, the policy for their request, and the status of their request. This article describes how to view requests for an access package, and remove requests that are no longer needed.

## View requests

**Prerequisite role:** Global administrator, Identity Governance administrator, User administrator, Catalog owner, Access package manager or Access package assignment manager

1. In the Azure portal, click **Azure Active Directory** and then click **Identity Governance**.

1. In the left menu, click **Access packages** and then open the access package.

1. Click **Requests**.

1. Click a specific request to see additional details.

    ![List of requests for an access package](./media/entitlement-management-access-package-requests/requests-list.png)

1. You can click on **Request History details** to see who approved a request, what their approval justifications were, and when access was delivered.

If you have a set of users whose requests are in the "Partially Delivered" or "Failed" state, you can retry those requests by using the [reprocess functionality](entitlement-management-reprocess-access-package-requests.md).

### View requests with Microsoft Graph
You can also retrieve requests for an access package using Microsoft Graph.  A user in an appropriate role with an application that has the delegated `EntitlementManagement.Read.All` or `EntitlementManagement.ReadWrite.All` permission can call the API to [list accessPackageAssignmentRequests](/graph/api/entitlementmanagement-list-accesspackageassignmentrequests?view=graph-rest-beta&preserve-view=true). While an identity governance administrator can retrieve access package requests from multiple catalogs, if user or application service principal is assigned only to catalog-specific delegated administrative roles, the request must supply a filter to indicate a specific access package, such as: `$expand=accessPackage&$filter=accessPackage/id eq '9bbe5f7d-f1e7-4eb1-a586-38cdf6f8b1ea'`. An application that has the application permission `EntitlementManagement.Read.All` or `EntitlementManagement.ReadWrite.All` permission can also use this API to retrieve requests across all catalogs.

## Remove request (Preview)

You can also remove a completed request that is no longer needed. To remove a request:

1. In the Azure portal, click **Azure Active Directory** and then click **Identity Governance**.

1. In the left menu, click **Access packages** and then open the access package.

1. Click **Requests**.

1. Find the request you want to remove from the access package.

1. Select the Remove button.

> [!NOTE]
> If you remove a completed request from an access package, this doesn't remove the active assignment, only the data of the request. So the requestor will continue to have access. If you also need to remove an assignment and the resulting access from that access package, in the left menu, click **Assignments**, locate the assignment, and then [remove the assignment](entitlement-management-access-package-assignments.md).

### Remove a request with Microsoft Graph

You can also remove a request using Microsoft Graph.  A user in an appropriate role with an application that has the delegated `EntitlementManagement.ReadWrite.All` permission, or an application with that application permission, can call the API to [remove an accessPackageAssignmentRequest](/graph/api/accesspackageassignmentrequest-delete).

## Next steps

- [Reprocess requests for an access package](entitlement-management-reprocess-access-package-requests.md)
- [Change request and approval settings for an access package](entitlement-management-access-package-request-policy.md)
- [View, add, and remove assignments for an access package](entitlement-management-access-package-assignments.md)
- [Troubleshoot requests](entitlement-management-troubleshoot.md#requests)
