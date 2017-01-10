---
title: 'Tenant admin elevate access - RBAC | Microsoft Docs'
description: This topic describes the built in roles for role-based access control (RBAC).
services: active-directory
documentationcenter: ''
author: kgremban
manager: femila
editor: rqureshi

ms.assetid: b547c5a5-2da2-4372-9938-481cb962d2d6
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 01/09/201
ms.author: kgremban

---
# Elevate access as a tenant admin with Role-Based Access Control 

Role-based Access Control helps tenant administrators get temporary elevations in access so that they can grant higher permissions than normal. A tenant admin can elevate herself to the User Access Administrator role when needed. That role gives the tenant admin permissions to grant herself of others roles at the "/" scope. 

This feature is important because it allows the tenant admin to see all the subscription that exist in an organization. It also allows for automation apps (like invoicing and auditing) to access all the subscriptions and provide an accurate view of the state of the organization from a billing or asset management perspective.  

## How to elevate access

The basic process works with the following steps:

1. All tenant administrators get a service roll with a special action *elevateAccess*.
2. Using the REST endpoint of ARM, a tenant admin calls *elevateAccess* to grant themselves the User Access Administrator role.
3. As a User Access Admin, the tenant admin can assign any role at any scope.
4. The tenant admin can, and should, revoke their User Access Admin privileges until they're needed again.

It's important to remember that the User Access Admin role should be inactive until needed. As a safety measure, always revoke the privileges when not needed. This is a safeguard to prevent the privileges from falling into the hands of a third party if the tenant admin account gets compromised. 