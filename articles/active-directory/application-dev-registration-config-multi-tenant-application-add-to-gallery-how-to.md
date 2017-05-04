---
title: How to add a multi-tenant application to the Azure AD application gallery | Microsoft Docs
description:  Explains how you can list your custom developed multi-tenant application in the Azure AD Application Gallery
services: active-directory
documentationcenter: ''
author: ajamess
manager: femila

ms.assetid: 
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/04/2017
ms.author: asteen

---

# How to add a multi-tenant application to the Azure AD application gallery

## What is the Azure AD Application Gallery?

The Azure AD Application Gallery is a great way to get your application in front of all the millions of Azure Active Directory customers to broaden the impact and reach of your application in the marketplace. The below steps explain how you can list your application in the Azure AD Application Gallery.

## If your application supports SAML or OpenIDConnect
If you have a multi-tenant application you'd like to list in the Azure AD Application Gallery, you must first make sure that your application supports one of the following single sign-on technologies:

1. **OpenID Connect** - Direct integration with Azure AD using OpenID Connect for authentication and the Azure AD consent API for configuration. If you are just starting an integration and your application does not support SAML, then this is the recommend mode.
2. **SAML** – Your application already has the ability to configure third-party identity providers using the SAML protocol.

If your application supports one of these single sign-on modes and you'd like to list your multi-tenant application in the Azure AD Application Gallery, you can follow the steps in the document below. To get started quickly send an email to **waadpartners@microsoft.com**.

## If your application does not support SAML or OpenIDConnect
Even if your application does not support one of these modes, we can still integrate it into our gallery using our Password Single Sign-on technology. If you'd like to explore this option, you can send an email to **waadpartners@microsoft.com**.

## Next steps
[How to list your application in the Azure Active Directory application gallery](https://docs.microsoft.com/azure/active-directory/develop/active-directory-app-gallery-listing)
