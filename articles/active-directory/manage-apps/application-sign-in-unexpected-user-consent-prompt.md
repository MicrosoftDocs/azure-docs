---
title: Unexpected consent prompt when signing in to an application | Microsoft Docs
description: How to troubleshoot when a user sees a consent prompt for an application you have integrated with Azure AD that you did not expect
services: active-directory
author: davidmu1
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: troubleshooting
ms.date: 07/11/2017
ms.author: davidmu
ms.reviewer: phsignor
ms.collection: M365-identity-device-management
---

# Unexpected consent prompt when signing in to an application

Many applications that integrate with Azure Active Directory require permissions to various resources in order to run. When these resources are also integrated with Azure Active Directory, permissions to access them is requested using the Azure AD consent framework.

This results in a consent prompt being shown the first time an application is used, which is often a one-time operation.

> [!VIDEO https://www.youtube.com/embed/a1AjdvNDda4]

## Scenarios in which users see consent prompts

Additional prompts can be expected in various scenarios:

* The application has been configured to require assignment. User consent is not currently supported for apps which require assignment. If you configure an application to require assignment, be sure to also grant tenant-wide admin consent so that assigned user can sign in.

* The set of permissions required by the application has changed.

* The user who originally consented to the application was not an administrator, and now a different (non-admin) user is using the application for the first time.

* The user who originally consented to the application was an administrator, but they did not consent on-behalf of the entire organization.

* The application is using [incremental and dynamic consent](../azuread-dev/azure-ad-endpoint-comparison.md#incremental-and-dynamic-consent) to request additional permissions after consent was initially granted. This is often used when optional features of an application additional require permissions beyond those required for baseline functionality.

* Consent was revoked after being granted initially.

* The developer has configured the application to require a consent prompt every time it is used (note: this is not best practice).

   > [!NOTE]
   > Following Microsoft's recommendations and best practices, many organizations have disabled or limited users' permission to grant consent to apps. If an application forces users to grant consent every time they sign in, most users will be blocked from using these applications even if an administrator grants tenant-wide admin consent. If you encounter an application which is requiring user consent even after admin consent has been granted, check with the app publisher to see if they have a setting or option to stop forcing user consent on every sign in.

## Next steps

* [Apps, permissions, and consent in Azure Active Directory (v1.0 endpoint)](../develop/quickstart-register-app.md)

* [Scopes, permissions, and consent in the Azure Active Directory (v2.0 endpoint)](../develop/v2-permissions-and-consent.md)
