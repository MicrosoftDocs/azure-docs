---
title: Using Azure AD for applications not listed in the app gallery
description: Understand how to integrate apps not listed in the Azure AD gallery.
services: active-directory
author: kenwith
manager: celestedg
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: conceptual
ms.workload: identity
ms.date: 07/27/2020
ms.author: kenwith
ms.reviewer: arvinh,luleon
---

# Using Azure AD for applications not listed in the app gallery

In the [Add an app](add-application-portal.md) quickstart, you learn how to add an app to your Azure AD tenant.

In addition to the choices in the [Azure AD application gallery](https://azure.microsoft.com/documentation/articles/active-directory-saas-tutorial-list/), you have the option to add a **non-gallery application**. 

## Capabilities for apps not listed in the Azure AD gallery

You can add any application that already exists in your organization, or any third-party application  from a vendor who is not already part of the Azure AD gallery. Depending on your [license agreement](https://azure.microsoft.com/pricing/details/active-directory/), the following capabilities are available:

- Self-service integration of any application that supports [Security Assertion Markup Language (SAML) 2.0](https://wikipedia.org/wiki/SAML_2.0) identity providers (SP-initiated or IdP-initiated)
- Self-service integration of any web application that has an HTML-based sign-in page using [password-based SSO](sso-options.md#password-based-sso)
- Self-service connection of applications that use the [System for Cross-Domain Identity Management (SCIM) protocol for user provisioning](../app-provisioning/use-scim-to-provision-users-and-groups.md)
- Ability to add links to any application in the [Office 365 app launcher](https://www.microsoft.com/microsoft-365/blog/2014/10/16/organize-office-365-new-app-launcher-2/) or [My Apps](sso-options.md#linked-sign-on)

If you're looking for developer guidance on how to integrate custom apps with Azure AD, see [Authentication Scenarios for Azure AD](../develop/authentication-scenarios.md). When you develop an app that uses a modern protocol like [OpenId Connect/OAuth](../develop/active-directory-v2-protocols.md) to authenticate users, you can register it with the Microsoft identity platform by using the [App registrations](../develop/quickstart-register-app.md) experience in the Azure portal.

## Next steps

- [Quickstart Series on App Management](view-applications-portal.md)

