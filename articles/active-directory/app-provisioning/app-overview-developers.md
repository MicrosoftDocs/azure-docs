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

# Doc 2 - High level overview of apps for developers

Whether you're a line of business developer building critical applications to be used in your organization or you're an independent software vendor building the next big app, Azure Active Directory is the platform for you to take care of identity and get your customers running quickly and securely. 

**Common scenarios**


> [!div class="checklist"]
> * SSO for all your applications
> * Provision users and groups into your applications



## Scenario 1: Setup SSO for your applications

No more managing password. Securely access all the resources you need with your corporate credentials. Microsoft supports the standards you need to enable SSO for your users. Furthermore, Microosft provides easy to use libraries to get started with authentication. 

|Feature  | Description | When to use |
|---------|---------|---------|
|SAML|Standards based federated SSO using trusted industry standards.|Lore Ipsum|
|OIDC|||
|MSAL|||

## Scenario 2: Enrich your application with the data that you need


Most applications require a user to be provisioned into the application before accessing the resources that they need. Furthermore, customers need to ensure that accounts are removed when somone shouldn't have access to the account anymore. Leverage the tools provided by the Azure AD provisioning service to automate user provisioning and deprovisioning. 


|Feature  |Description|When to use |
|---------|---------|---------|
|SCIM provisioning|||
|Microsoft Graph|||
