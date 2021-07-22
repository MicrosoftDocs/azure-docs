---
title: Add linked single sign-on to an application in Azure Active Directory
description: Add of linked single sign-on to an application in Azure Active Directory.
services: active-directory
author: davidmu1
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: conceptual
ms.workload: identity
ms.date: 07/19/2021
ms.author: davidmu
# Customer intent: As an IT admin, I need to know how to implement password-based single sign-on in Azure Active Directory.
---

# Add linked single sign-on to an application in Azure Active Directory

This article provides steps for you to follow to implement linked single sign-on (SSO). Linked sign-on enables Azure AD to provide single sign-on to an application that is already configured for single sign-on in another service. The linked option lets you configure the target location when a user selects the application in your organization's My Apps or Microsoft 365 portal.

The linked option doesn't provide sign-on functionality through Azure Active Directory (Azure AD). The option simply sets the location users are sent when they select the application on My Apps or Microsoft 365. Because the sign-in doesn't provide sign-on functionality through Azure AD, conditional access is not available for applications configured with linked single sign-on.

For example, a user can launch an application that is configured for single sign-on in Active Directory Federation Services 2.0 (AD FS) from the Office 365 portal. Additional reporting is also available for linked applications that are launched from the Office 365 portal or the Azure AD MyApps portal.

Some common scenarios where the link option is valuable include:
- Add a link to a custom web application that currently uses federation, such as Active Directory Federation Services (AD FS).
- Add deep links to specific web pages that you want to appear on your user's access panels.
- Add a link to an app that doesn't require authentication. The linked option doesn't provide sign-on functionality through Azure AD credentials, but you can still use some of the other features of enterprise applications. For example, you can use audit logs and add a custom logo and app name.

## Prerequisites

To configure linked SSO in your Azure AD tenant, you need:
-	An Azure account with an active subscription. Create an account for free.
-	One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.
-	An application that supports linked-based SSO.

## Configure linked-based SSO

1.	Sign in to the [Azure portal](https://portal.azure.com) with the appropriate role.
2.	Select **Azure Active Directory** in Azure Services, and then select **Enterprise applications**.
3.	Search for and select the application that you want to add linked SSO.
4.	Select **Single sign-on** and then select **Linked**.
5.	Enter the URL for the sign-in page of the application.
6.	Select **Save**. 

## Next steps

- [Manage access to apps](what-is-access-management.md)