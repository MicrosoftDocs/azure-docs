---
title: Manage access to Azure resources with Privileged Identity Management (PIM)
description: Learn about using Role-Based Access Management in PIM to access Azure resources.
services: active-directory
documentationcenter: ''
author: skwan
manager: mbaldwin
editor: bryanla
ms.assetid: ba06b8dd-4a74-4bda-87c7-8a8583e6fd14
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 09/22/2017
ms.author: skwan
---

# Manage access to Azure resources with Privileged Identity Management (Preview)

To protect privileged accounts from malicious cyber-attacks, you can use Azure Active Directory Privileged Identity Management (PIM) to lower the exposure time of privileges and increase your visibility into their use through reports and alerts. PIM does this by limiting users to only taking on their privileges "just in time" (JIT), or by assigning privileges for a shortened duration after which privileges are revoked automatically. 

You can now use PIM with Azure Role-Based Access Control (RBAC) to manage, control, and monitor access to Azure resources. PIM can manage the membership of built-in and custom roles to help you: 

- Enable on-demand, "just in time" access to Azure resources
- Expire resource access automatically for assigned users and groups
- Assign temporary access to Azure resources for quick tasks or on-call schedules
- Get alerts when new users or groups are assigned resource access, and when they activate eligible assignments

For more information, see [Overview of Role-Based Access Control in Azure PIM](privileged-identity-management/azure-pim-resource-rbac.md).