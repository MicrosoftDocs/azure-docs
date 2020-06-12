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
ms.topic: troubleshooting
ms.date: 06/12/2020
ms.author: kenwith
ms.collection: M365-identity-device-management
---

# Single sign-on option missing

The navigational components in Azure AD are displayed, or hidden, based on many factors. This article describes situations where the **Single sign-on** option is missing when managing applications.

## Application proxy

If using an Application Proxy (except SAML SSO using Application Proxy) then the **Single sign-on** option will be missing because...

## Single tenant application registered using App registrations

When the application is registered using **App registrations**, then the **Single sign-on** option will be missing because... 

QUESTION - is there a way to use SSO with app that is registered through App Registration?


## Multi-tenant application hosted in another tenant

When the application is hosted in another tenant and the customers consent to that application (From gallery or directly from the application website) then the **Single sign-on** option will be missing because....

## Application was created with PowerShell using `New-AzureRmADApplication` cmdlet

In this case the application that was created uses OpenID Connect (OIDC). The **Single sign-on** tab is not enabled with OIDC applications because they are natively integrated with Azure for single sign-on. To learn more about OIDC, see (https://docs.microsoft.com/azure/active-directory/develop/v2-protocols-oidc).


## Cloud App Administrator role not assigned to user
To configure **Single sign-on** the user must have the `Cloud App Administrator` role. If a user does not have this permission, then the ability to configure single sign-on will not be present.

## Opening application from **Application registrations** interface
If you open the application from the **Application registrations** interface, then the option to configure single sign-on will not be present. You must open the application from **Enterprise applications** in the **Manage** section in Azure AD navigation.


====== Ken Notes ====================
https://github.com/MicrosoftDocs/azure-docs/issues/34374

https://social.msdn.microsoft.com/Forums/azure/en-US/6ed1ce28-1b91-45d0-a48c-3f104518920e/azure-ad-application-single-signon-option-missing



## Next steps
[Managing Applications with Azure Active Directory](what-is-application-management.md)
