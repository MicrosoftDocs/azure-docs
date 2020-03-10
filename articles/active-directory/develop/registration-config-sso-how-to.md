---
title: Configure application single sign-on | Microsoft Docs
description: How to configure single sign-on for a custom application you are developing and registering with Azure AD.
services: active-directory
documentationcenter: ''
author: rwike77
manager: CelesteDG

ms.assetid: 
ms.service: active-directory
ms.subservice: develop
ms.custom: aaddev 
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 07/15/2019
ms.author: ryanwi

---

# How to configure single sign-on for an application

Enabling federated single sign-on (SSO) in your app is automatically enabled when federating through Azure AD for OpenID Connect, SAML 2.0, or WS-Fed. If your end users are having to sign in despite already having an existing session with Azure AD, it’s likely your app may be misconfigured.

* If you’re using ADAL/MSAL, make sure you have **PromptBehavior** set to **Auto** rather than **Always**.

* If you’re building a mobile app, you may need additional configurations to enable brokered or non-brokered SSO.

For Android, see [Enabling Cross App SSO in Android](https://docs.microsoft.com/azure/active-directory/develop/active-directory-sso-android).<br>

For iOS, see [Enabling Cross App SSO in iOS](https://docs.microsoft.com/azure/active-directory/develop/active-directory-sso-ios).

## Next steps

[Azure AD SSO](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)<br>

[Enabling Cross App SSO in Android](https://docs.microsoft.com/azure/active-directory/develop/active-directory-sso-android)<br>

[Enabling Cross App SSO in iOS](https://docs.microsoft.com/azure/active-directory/develop/active-directory-sso-ios)<br>

[Integrating Apps to AzureAD](https://docs.microsoft.com/azure/active-directory/develop/active-directory-integrating-applications)<br>

[Consent and Permissioning for AzureAD v2.0 converged Apps](https://docs.microsoft.com/azure/active-directory/develop/active-directory-v2-scopes)<br>

[AzureAD StackOverflow](https://stackoverflow.com/questions/tagged/azure-active-directory)
