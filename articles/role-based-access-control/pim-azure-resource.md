---
title: Manage access to Azure resources with Azure AD Privileged Identity Management (PIM)
description: Learn about managing access to Azure resources using Azure Active Directory Privileged Identity Management (PIM) and role-based access control (RBAC).
services: active-directory
documentationcenter: ''
author: rolyon
manager: mtillman
editor: skwan
ms.assetid: ba06b8dd-4a74-4bda-87c7-8a8583e6fd14
ms.service: role-based-access-control
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 03/30/2018
ms.author: rolyon
ms.reviewer: skwan
---

# Manage access to Azure resources with Azure AD Privileged Identity Management

To protect privileged accounts from malicious cyber-attacks, you can use Azure Active Directory Privileged Identity Management (PIM) to lower the exposure time of privileges and increase your visibility into their use through reports and alerts. PIM does this by limiting users to only taking on their privileges "just in time" (JIT), or by assigning privileges for a shortened duration after which privileges are revoked automatically. 

You can now use PIM with Azure role-based access control (RBAC) to manage, control, and monitor access to Azure resources. PIM can manage the membership of built-in and custom roles to help you: 

- Enable on-demand, "just in time" access to Azure resources
- Expire resource access automatically for assigned users and groups
- Assign temporary access to Azure resources for quick tasks or on-call schedules
- Get alerts when new users or groups are assigned resource access, and when they activate eligible assignments

For more information, see [What is Azure AD Privileged Identity Management?](../active-directory/privileged-identity-management/pim-configure.md).