---
title: Add linked single sign-on to an application
description: Add linked single sign-on to an application in Microsoft Entra ID.
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
# Customer intent: As an IT admin, I need to know how to implement linked single sign-on in Microsoft Entra ID.
---

# Add linked single sign-on to an application

This article shows you how to configure linked-based single sign-on (SSO) for your application in Microsoft Entra ID. Linked-based SSO enables Microsoft Entra ID to provide SSO to an application that is already configured for SSO in another service. The linked option lets you configure the target location when a user selects the application in your organization's My Apps or Microsoft 365 portal.

Linked-based SSO doesn't provide sign-on functionality through Microsoft Entra ID. The option simply sets the location that users are sent when they select the application on the My Apps or Microsoft 365 portal.

Some common scenarios where linked-based SSO is valuable include:
- Add a link to a custom web application that currently uses federation, such as Active Directory Federation Services (AD FS).
- Add deep links to specific web pages that you want to appear on your user's access pages.
- Add a link to an application that doesn't require authentication. The linked option doesn't provide sign-on functionality through Microsoft Entra credentials, but you can still use some of the other features of enterprise applications. For example, you can use audit logs and add a custom logo and application name.

[!INCLUDE [portal updates](../includes/portal-update.md)]

## Prerequisites

To configure linked-based SSO in your Microsoft Entra tenant, you need:
- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
- One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.
- An application that supports linked-based SSO.

## Configure linked-based single sign-on

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator). 
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **All applications**.
1. Search for and select the application that you want to add linked SSO.
1. Select **Single sign-on** and then select **Linked**.
1. Enter the URL for the sign-in page of the application.
1. Select **Save**. 

## Next steps

- [Manage access to apps](what-is-access-management.md)
