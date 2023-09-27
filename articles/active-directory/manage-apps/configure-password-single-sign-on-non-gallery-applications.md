---
title: Add password-based single sign-on to an application
description: Add password-based single sign-on to an application in Microsoft Entra ID.
services: active-directory
author: omondiatieno
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: conceptual
ms.workload: identity
ms.date: 04/25/2023
ms.author: jomondi
ms.reviewer: alamaral
ms.custom: enterprise-apps
# Customer intent: As an IT admin, I need to know how to implement password-based single sign-on in Microsoft Entra ID.
---

# Add password-based single sign-on to an application

This article shows you how to set up password-based single sign-on (SSO) in Microsoft Entra ID. With password-based SSO, a user signs in to the application with a username and password the first time it's accessed. After the first sign-on, Microsoft Entra ID sends the username and password to the application. 

Password-based SSO uses the existing authentication process provided by the application. When you enable password-based SSO for an application, Microsoft Entra ID collects and securely stores usernames and passwords for the application. User credentials are stored in an encrypted state in the directory. Password-based SSO is supported for any cloud-based application that has an HTML-based sign-in page.

Choose password-based SSO when:
- An application doesn't support the SAML SSO protocol.
- An application authenticates with a username and password instead of access tokens and headers.

The configuration page for password-based SSO is simple. It includes only the URL of the sign-on page that the application uses. This string must be the page that includes the username input field.

[!INCLUDE [portal updates](../includes/portal-update.md)]

## Prerequisites

To configure password-based SSO in your Microsoft Entra tenant, you need:
-	An Azure account with an active subscription. If you don't already have one, you can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
-	Global Administrator, Cloud Application Administrator, or owner of the service principal.
-	An application that supports password-based SSO.

## Configure password-based single sign-on

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator). 
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **All applications**.
1. Enter the name of the existing application in the search box, and then select the application from the search results.
1. Select **Single sign-on** and then select **Password-based**.
1. Enter the URL for the sign-in page of the application.
1. Select **Save**. 

Microsoft Entra ID parses the HTML of the sign-in page for username and password input fields. If the attempt succeeds, you're done. Your next step is to [Assign users or groups](add-application-portal-assign-users.md) to the application. 

After you've assigned users and groups, you can provide credentials to be used for a user when they sign in to the application. 

1. Select **Users and groups**, select the checkbox for the user's or group's row, and then select **Update Credentials**. 
1. Enter the username and password to be used for the user or group. If you don't, users are prompted to enter the credentials themselves upon launch.

## Manual configuration

If the parsing attempt by Microsoft Entra ID fails, you can configure sign-on manually.

1. Select **Configure {application name} Password Single Sign-on Settings** to display the **Configure sign-on** page.
1. Select **Manually detect sign-in fields**. More instructions that describe manual detection of sign-in fields appear.
1. Select **Capture sign-in fields**. A capture status page opens in a new tab, showing the message metadata capture is currently in progress.
1. If the **My Apps Extension Required** box appears in a new tab, select **Install Now** to install the My Apps Secure Sign-in Extension browser extension. (The browser extension requires Microsoft Edge or Chrome.) Then install, launch, and enable the extension, and refresh the capture status page. The browser extension then opens another tab that displays the entered URL.
1. In the tab with the entered URL, go through the sign-in process. Fill in the username and password fields, and try to sign in. (You don't have to provide the correct password.) A prompt asks you to save the captured sign-in fields.
1. Select **OK**. The browser extension updates the capture status page with the message **Metadata has been updated for the application**. The browser tab closes.
1. In the Microsoft Entra ID Configure sign-on page, select **Ok, I was able to sign-in to the app successfully**.
1. Select **OK**.

## Next steps

- [Manage access to apps](what-is-access-management.md)
