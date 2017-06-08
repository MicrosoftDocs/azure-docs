---
title: How to get AppSource certified for Azure Active Directory| Microsoft Docs
description: Details on how to get your application AppSource certified for Azure Active Directory.
services: active-directory
documentationcenter: ''
author: skwan
manager: mbaldwin
editor: ''

ms.assetid: 21206407-49f8-4c0b-84d1-c25e17cd4183
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 02/28/2017
ms.author: skwan;bryanla
ms.custom: aaddev

---
# How to get AppSource Certified for Azure Active Directory (AD)
To receive AppSource certification for Azure AD, your application must implement the multi-tenant sign in pattern with Azure AD using the OpenID Connect or OAuth 2.0 protocols.  

If you’re not familiar with Azure AD sign-in or multi-tenant application development:

1. Start by reading about the [Browser to Web App scenarios in Authentication Scenarios for Azure AD][AAD-Auth-Scenarios-Browser-To-WebApp].  
2. Next, check out the Azure AD [web application quick-start guides][AAD-QuickStart-Web-Apps], which demonstrate how to implement sign-in, and include companion code samples.

   > [!TIP]
   > Try the preview of our new [developer portal](https://identity.microsoft.com/Docs/Web) that will help you get up and running with Azure Active Directory in just a few minutes!  The developer portal will walk you through the process of registering an app and integrating Azure AD into your code.  When you’re finished, you will have a simple application that can authenticate users in your tenant and a back-end that can accept tokens and perform validation.
   >
   >
3. To learn how to implement the multi-tenant sign-in pattern with Azure AD, check out [How to sign in any Azure Active Directory (AD) user using the multi-tenant application pattern][AAD-Howto-Multitenant-Overview]

## Related content
For more information on building applications that support Azure AD sign-in, or to get help and support, refer to the [Azure AD Developer's Guide][AAD-Dev-Guide].

Please use the Disqus comments section following this article to provide feedback and help us refine and shape our content.

<!--Reference style links -->
[AAD-Auth-Scenarios]: ./active-directory-authentication-scenarios.md
[AAD-Auth-Scenarios-Browser-To-WebApp]: ./active-directory-authentication-scenarios.md#web-browser-to-web-application
[AAD-Dev-Guide]: ./active-directory-developers-guide.md
[AAD-Howto-Multitenant-Overview]: ./active-directory-devhowto-multi-tenant-overview.md
[AAD-QuickStart-Web-Apps]: ./active-directory-developers-guide.md#get-started


<!--Image references-->
