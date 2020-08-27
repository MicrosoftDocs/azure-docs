---
title: Troubleshoot password-based single sign-on in Azure AD
description: How to troubleshoot issues with an Azure AD app that's configured for password-based single sign-on.
author: kenwith
manager: celestedg
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: troubleshooting
ms.date: 07/11/2017
ms.author: kenwith
ms.reviewer: asteen
---

# Troubleshoot password-based single sign-on in Azure AD

To use password-based single sign-on (SSO) in My Apps, the browser extension must be installed. The extension downloads automatically when you select an app that's configured for password-based SSO. To learn about using My Apps from an end-user perspective, see [My Apps portal help](../user-help/my-apps-portal-end-user-access.md).

## My Apps browser extension not installed
Make sure the browser extension is installed. To learn more, see [Plan an Azure Active Directory My Apps deployment](access-panel-deployment-plan.md). 

## Single sign-on not configured
Make sure password-based single sign-on is configured. To learn more, see [Configure password-based single sign-on](configure-password-single-sign-on-non-gallery-applications.md).

## Users not assigned
Make sure the user is assigned to the app. To learn more, see [Assign a user or group to an app](assign-user-or-group-access-portal.md).

## Request support 
If you get an error message when you set up SSO and assign users, open a support ticket. Include as much of the following information as possible:

-   Correlation error ID
-   UPN (user email address)
-   TenantID
-   Browser type
-   Time zone and time/time frame when the error occurred
-   Fiddler traces

## Next steps
* [Quickstart Series on Application Management](view-applications-portal.md)
* [Plan a My Apps deployment](access-panel-deployment-plan.md)
