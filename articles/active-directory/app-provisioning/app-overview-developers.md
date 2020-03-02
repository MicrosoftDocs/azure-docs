---
title: Use Microsoft Graph APIs to configure provisioning - Azure Active Directory | Microsoft Docs
description: Need to set up provisioning for multiple instances of an application? Learn how to save time by using the Microsoft Graph APIs to automate the configuration of automatic provisioning.
services: active-directory
documentationcenter: ''
author: msmimart
manager: CelesteDG

ms.assetid: 
ms.service: active-directory
ms.subservice: app-provisioning
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 11/15/2019
ms.author: mimart
ms.reviewer: arvinh

ms.collection: M365-identity-device-management
---

# Develop your applications with Azure AD

Whether you're a line-of-business developer building critical applications to be used in your organization or you're an independent software vendor building the next big app, Azure Active Directory is the platform for you to take care of identity and get your customers running quickly and securely. 

**Common scenarios**


> [!div class="checklist"]
> * SSO for all your applications
> * Provision users and groups into your applications



## Scenario 1: Set up SSO for your applications

Get your users into your application quickly and securely with single sign-on.Azure AD supports standards-based integration with any application. 

|Feature  | Description |
|---------|---------|
|[SAML](https://docs.microsoft.com/azure/active-directory/develop/single-sign-on-saml-protocol) based SSO|Integrate any SAML-based application with Azure AD for SSO.|
|[OIDC](https://docs.microsoft.com/azure/active-directory/develop/v2-protocols-oidc) based SSO|Integrate any OIDC based application with Azure AD for SSO.|

## Scenario 2: Enrich your application with data


Most applications require a user to be provisioned into the application before accessing the resources that they need. Furthermore, customers need to ensure that accounts are removed when some one shouldn't have access to the account anymore. Leverage the tools provided by the Azure AD provisioning service to automate user provisioning and deprovisioning. 


|Feature  |Description|
|---------|---------|
|[SCIM](https://SCIMOverview) provisioning|The SCIM standard facilitates automatic user provisioning and deprovisioning. Develop a SCIM compliant endpoint and enable any customer to automatically provision users and groups into your application.|
|[Microsoft Graph](https://docs.microsoft.com/graph/overview)|Microsoft Graph is the gateway to data and intelligence in Microsoft 365. It provides a unified programmability model that you can use to access the tremendous amount of data in Office 365, Windows 10, and Enterprise Mobility + Security. Use the wealth of data in Microsoft Graph to build apps for organizations and consumers that interact with millions of users.|

## Scenario 3: Securely access APIs

Access secured web APIs (for example, from the Microsoft graph or your own web API) using tokens issued by the Microsoft identity platform. 

|Feature  |Description|
|---------|---------|
|MSAL|Using MSAL, a token can be acquired from a number of application types: web applications, web APIs, single-page apps (JavaScript), mobile and native applications, and daemons and server-side applications.|

## Related articles

- [Microsoft identity platform](https://docs.microsoft.com/azure/active-directory/develop/v2-overview)
- [Application provisioning with SCIM](https://docs.microsoft.com/azure/active-directory/app-provisioning/use-scim-to-provision-users-and-groups)
