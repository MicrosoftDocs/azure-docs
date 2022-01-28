---
title: Overview of enterprise application ownership
titleSuffix: Azure AD
description: Learn about enterprise application ownership in Azure Active Directory
services: active-directory
documentationcenter: ''
author: saipradeepb23
manager: celesteDG
ms.service: active-directory
ms.workload: identity
ms.subservice: app-mgmt
ms.topic: conceptual
ms.date: 12/22/2021
ms.author: saibandaru
#Customer intent: As an Azure AD administrator, I learn about enterprise application ownership.

---

# Overview of enterprise application ownership in Azure Active Directory

As an owner of an enterprise application in Azure Active Directory (Azure AD), a user can manage the organization-specific configuration of it, such as single sign-on, provisioning, and user assignments. An owner can also add or remove other owners. 

Unlike Global Administrators, owners can manage only the enterprise applications they own. Only users can be owners of enterprise applications. Groups cannot be assigned as owners. Owners can add credentials to an application and use those credentials to impersonate the application’s identity. 

The owner of an enterprise application is assigned by default only when a user with no administrator roles (Global Administrator, Application Administrator etc.) creates a new application registration. In all other cases, an owner is not assigned by default to an enterprise application.  

## Owner permissions

The application may have more permissions than the owner, and thus would be an elevation of privilege over what the owner has access to as a user or service principal. An application owner could potentially create or update users or other objects while impersonating the application, depending on the application's permissions. 

Owners of applications have the same permissions as application administrators scoped to an individual application. For more information, see [Azure AD built-in roles](../roles/permissions-reference.md#application-administrator). 

## Ownerless applications

Even if an enterprise application had an owner at some point, it might end up ownerless if the existing owners leave the organization or remove themselves. To find more information, you can review the activity on the application by checking the audit logs. Audit logs store data for only a limited period. For more information, see [Azure AD audit log reporting](../reports-monitoring/reference-reports-data-retention.md). 

## Next steps

- [Assign enterprise application owners](assign-app-owners.md)
