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

- https://_{verifiedCustomerDomain}/{string}_
- https://_{string}.{verifiedCustomerDomain}_
- https://_{string}.{verifiedCustomerDomain}/{string}_
  
A verified customer domain is one that is owned by the tenant creating the application. In case a verified customer domain is not available, a tenant could use its the initial domain as a verified domain. For example, if you own the Contoso tenant, you could use `https://contoso.onmicrosoft.com` as the verified customer domain in your appId Uri.

