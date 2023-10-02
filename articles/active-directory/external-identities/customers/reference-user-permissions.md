---
title: User default permissions in customer tenants
description: Learn about the default permissions for users in a customer tenant.
services: active-directory
author: msmimart
manager: celestedg
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: reference
ms.date: 05/01/2023
ms.author: mimart
ms.custom: it-pro
---

# Default user permissions in customer tenants

A customer tenant provides clear separation between your corporate workforce directory and your customer-facing app directory. Furthermore, users created in your customer tenant are restricted from accessing information about other users in the customer tenant. By default, customers can’t access information about other users, groups, or devices.

The following table describes the default permissions assigned to a customer.

| **Area** | **Customer user permissions** |
| ------------ | --------- |
| Users and contacts | - Read and update their own profile through the app profile management experience  <br>- Change their own password <br>- Sign in with a local or social account |
| Applications | - Access customer-facing applications <br>- Revoke consent to applications |
