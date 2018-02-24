---
title: How to add a multi-tenant application to the Azure AD application gallery | Microsoft Docs
description:  Explains how you can list your custom developed multi-tenant application in the Azure AD Application Gallery
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila

ms.assetid: 92c1651a-675d-42c8-b337-f78e7dbcc40d
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/16/2018
ms.author: jeedes

---

# How to add a multi-tenant application to the Azure AD application gallery

## What is the Azure AD Application Gallery?

Azure AD is a cloud-based Identity service. [Azure AD app gallery](https://azure.microsoft.com/marketplace/active-directory/all/) is a common store where all the application connectors are published for single sign-on and user provisioning. Our mutual customers who are using Azure AD as Identity provider look for different SaaS application connectors, which are published here. IT administrator adds connector from the app gallery and configures and use it for Single sign-on and provisioning. Azure AD supports all major federation protocols like SAML 2.0, OpenID Connect, OAuth, and WS-Fed for single sign-on. 

## If your application supports SAML or OpenIDConnect
If you have a multi-tenant application you'd like to list in the Azure AD Application Gallery, you must first make sure that your application supports one of the following single sign-on technologies:

1. **OpenID Connect** - Create the multi-tenant application in Azure AD and implement [Azure AD consent framework](https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-integrating-applications#overview-of-the-consent-framework) for your application. Send the login request to common endpoint so that any customer can provide consent to the application. You can control the customer user access based on the tenant ID and user's UPN received in the token. Please submit the application as mentioned in this [article](https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-app-gallery-listing).

2. **SAML** – If your application supports SAML 2.0 then we can list your application in the gallery and the instructions are listed [here](https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-app-gallery-listing)

If your application supports one of these single sign-on modes and you'd like to list your multi-tenant application in the Azure AD Application Gallery, you can follow the steps mentioned in [this](https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-app-gallery-listing) article. 

## If your application does not support SAML or OpenIDConnect
Even if your application does not support one of these modes, we can still integrate it into our gallery using our Password Single Sign-on technology.

**Password SSO** – Create a web application that has an HTML sign-in page to configure [password-based single sign-on](https://docs.microsoft.com/en-us/azure/active-directory/active-directory-appssoaccess-whatis). Password-based SSO, also referred to as password vaulting, enables you to manage user access and passwords to web applications that don't support identity federation. It is also useful for scenarios where several users need to share a single account, such as to your organization's social media app accounts. 

If you'd like to list your application with this technology then, please submit the request as described in [this](https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-app-gallery-listing) article.

## Escalations

For any escalations, drop an email to [Azure AD SSO Integration Team](<mailto:SaaSApplicationIntegrations@service.microsoft.com>) and we get back to you ASAP.

## Next steps
[How to list your application in the Azure Active Directory application gallery](https://docs.microsoft.com/azure/active-directory/develop/active-directory-app-gallery-listing)
