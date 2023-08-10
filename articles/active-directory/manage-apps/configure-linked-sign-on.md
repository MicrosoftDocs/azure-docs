---
title: Add linked single sign-on to an application
description: Add linked single sign-on to an application in Azure Active Directory.
services: active-directory
author: omondiatieno
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: conceptual
ms.workload: identity
ms.date: 05/19/2023
ms.author: jomondi
ms.reviewer: alamaral
ms.custom: enterprise-apps
# Customer intent: As an IT admin, I need to know how to implement linked single sign-on in Azure Active Directory.
---

# Add linked single sign-on to an application

This article shows you how to configure linked-based single sign-on (SSO) for your application in Azure Active Directory (Azure AD). Linked-based SSO enables Azure AD to provide SSO to an application that is already configured for SSO in another service. The linked option lets you configure the target location when a user selects the application in your organization's My Apps or Microsoft 365 portal.

Linked-based SSO doesn't provide sign-on functionality through Azure AD. The option simply sets the location that users are sent when they select the application on the My Apps or Microsoft 365 portal.

Some common scenarios where linked-based SSO is valuable include:
- Add a link to a custom web application that currently uses federation, such as Active Directory Federation Services (AD FS).
- Add deep links to specific web pages that you want to appear on your user's access pages.
- Add a link to an application that doesn't require authentication. The linked option doesn't provide sign-on functionality through Azure AD credentials, but you can still use some of the other features of enterprise applications. For example, you can use audit logs and add a custom logo and application name.

[!INCLUDE [portal updates](../includes/portal-update.md)]

## Prerequisites

To configure linked-based SSO in your Azure AD tenant, you need:
-	An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
-	One of the following roles: Global Administrator, Application Administrator, or owner of the service principal.
-	An application that supports linked-based SSO.

## Configure linked-based single sign-on

1. Sign in to the [Azure portal](https://portal.azure.com) with the appropriate role.
2. Select **Azure Active Directory** in Azure Services, and then select **Enterprise applications**.
3. Search for and select the application that you want to add linked SSO.
4. Select **Single sign-on** and then select **Linked**.
5. Enter the URL for the sign-in page of the application.
6. Select **Save**. 

## Next steps

- [Manage access to apps](what-is-access-management.md)
