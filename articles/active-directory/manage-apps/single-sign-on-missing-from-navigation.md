---
title: Single sign-on option missing from navigation | Microsoft Docs
description: Address some of the common reasons that the Single sign-on option is not appearing where expected in the Azure portal.
services: active-directory
documentationcenter: ''
author: kenwith
manager: celestedg
ms.assetid: 
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 06/09/2020
ms.author: kenwith
ms.collection: M365-identity-device-management
---

# Single sign-on option missing

The navigational components in Azure AD are displayed, or hidden, based on many factors. This article describes situations related to the Single sign-on option when managing applications.

## Application proxy

If using an Application Proxy (except SAML SSO using Application Proxy) then the Single sign-on option will be missing because...

## Single tenant application registered using App Registration

When the application is registered using App Registration, then the Single sign-on option will be missing because... 

QUESTION - is there a way to use SSO with app that is registered through App Registration?


## Multi-tenant application hosted in another tenant

When the application is hosted in another tenant and the customers consent to that application (From gallery or directly from the application website) then the Single sign-on option will be missing because....



https://github.com/MicrosoftDocs/azure-docs/issues/34374

https://social.msdn.microsoft.com/Forums/azure/en-US/6ed1ce28-1b91-45d0-a48c-3f104518920e/azure-ad-application-single-signon-option-missing



## Next steps
[Managing Applications with Azure Active Directory](what-is-application-management.md)
