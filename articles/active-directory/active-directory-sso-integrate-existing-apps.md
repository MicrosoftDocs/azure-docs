<properties
   pageTitle="Integrating Azure Active Directory SSO with existing apps | Microsoft Azure"
   description="Manage the SaaS apps you already use by enabling single sign-on authentication and user provisioning in Azure Active Directory."
   services="active-directory"
   documentationCenter=""
   authors="kgremban"
   manager="stevenpo"
   editor=""/>

<tags
   ms.service="active-directory"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="identity"
   ms.date="10/16/2015"
   ms.author="kgremban; liviodlc"/>

# Integrating Azure Active Directory SSO with existing apps

## Overview

Setting up single sign on (SSO) for an application your organization already uses is a different process than creating new accounts for a new application. There are a couple of preliminary steps including: mapping user identities in the application to Azure Active Directory (AD) identities, and understanding how users will experience logging in to an application after it is integrated.

> [AZURE.NOTE] To set up SSO for an existing application, you need to have global administrator rights in both Azure AD and the SaaS application.

## Mapping user accounts

A user's identity typically has a unique identifier that could be an email address, or universal personal name (UPN). You will need to link (map) each user's application identity to their respective Azure AD identity. There are a couple of ways to accomplish this depending on how the requirement of your application authentication.

For more information about mapping application identities with Azure AD identities, see [Customizing claims issued in the SAML token](http://social.technet.microsoft.com/wiki/contents/articles/31257.azure-active-directory-customizing-claims-issued-in-the-saml-token-for-pre-integrated-apps.aspx) and [Customizing attribute mappings for provisioning](active-directory-saas-customizing-attribute-mappings.md).

## Understanding the user's log in experience

When you integrate SSO for an application that’s already in use, it’s important to realize that the user experience will be affected. For all applications, users will start using their Azure AD credentials to sign in. Additionally, they may need to use a different portal to access the applications.

SSO for some applications can be done on the application's log in interface, but for other applications the user will have to go through a central portal such as ([My Apps](http://myapps.microsoft.com) or [Office365](http://portal.office.com/myapps)) to sign in. Learn more about the different types of SSO and their user experiences in [What is application access and single sign-on with Azure Active Directory](active-directory-appssoaccess-whatis.md).

See also *Suppressing user consent* in the [Guiding developers](active-directory-applications-guiding-developers-for-lob-applications.md) article.

## Related articles
links to suppressing user consent and other guiding developer sub articles
