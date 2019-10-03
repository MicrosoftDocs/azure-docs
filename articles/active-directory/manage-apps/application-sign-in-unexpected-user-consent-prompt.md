---
title: Unexpected consent prompt when signing in to an application | Microsoft Docs
description: How to troubleshoot when a user sees a consent prompt for an application you have integrated with Azure AD that you did not expect
services: active-directory
documentationcenter: ''
author: msmimart
manager: CelesteDG

ms.assetid: 
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 07/11/2017
ms.author: mimart
ms.reviewer: asteen

ms.collection: M365-identity-device-management
---

# Unexpected consent prompt when signing in to an application

Many applications that integrate with Azure Active Directory require permissions to various resources in order to run. When these resources are also integrated with Azure Active Directory, permissions to access them is requested using the Azure AD consent framework. 

This results in a consent prompt being shown the first time an application is used, which is often a one-time operation. 

## Scenarios in which users see consent prompts

Additional prompts can be expected in various scenarios:

* The set of permissions required by the application has changed.

* The user who originally consented to the application was not an administrator, and now a different (non-admin) User is using the application for the first time.

* The user who originally consented to the application was an administrator, but they did not consent on-behalf of the entire organization.

* The application is using [incremental and dynamic consent](https://docs.microsoft.com/azure/active-directory/develop/active-directory-v2-compare#incremental-and-dynamic-consent) to request additional permissions after consent was initially granted. This is often used when optional features of an application additional require permissions beyond those required for baseline functionality.

* Consent was revoked after being granted initially.

* The developer has configured the application to require a consent prompt every time it is used (note: this is not best practice).

## Next steps

-   [Apps, permissions, and consent in Azure Active Directory (v1.0 endpoint)](https://docs.microsoft.com/azure/active-directory/active-directory-apps-permissions-consent)

-   [Scopes, permissions, and consent in the Azure Active Directory (v2.0 endpoint)](https://docs.microsoft.com/azure/active-directory/develop/active-directory-v2-scopes)


