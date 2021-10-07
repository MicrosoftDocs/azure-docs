---
title: "include file"
description: "include file"
services: active-directory
author: madansr7
ms.service: active-directory
ms.topic: "include"
ms.author: saumadan
ms.custom: include file
ms.date: 10/06/2021
---

The following patterns are considered valid use cases for AppId Uri (Identifier Uri):

**Valid api schemes:**

- api://_{appId}_ 
- api://_{tenantId}/{appId}_
- api://_{tenantId}/{string}_

**Valid https schemes:**

- https://_{verifiedCustomerOwnedDomain}/{string}_
- https://_{string}.{verifiedCustomerOwnedDomain}_
- https://_{string}.{verifiedCustomerOwnedDomain}/{string}_
  
A verified customer domain is one that is owned by the tenant creating the application. In case a verified customer owned domain is not available, a tenant could use its the initial domain as a verified domain. Every new Azure AD tenant comes with an initial domain name, <domainname>.onmicrosoft.com. You can't change or delete the initial domain name, but you can add your organization's names. Adding custom domain names helps you to create user names that are familiar to your users, such as alain@contoso.com.
For example, if you own the Contoso tenant, you could use `https://contoso.onmicrosoft.com` as the verified customer owned domain in your AppId Uri.
For more information on custom domain, refer to [add custom domain](../articles/active-directory/fundamentals/add-custom-domain.md) documentation.
