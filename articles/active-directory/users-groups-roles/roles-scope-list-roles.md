---
title: Administrative unit scope for roles (preview) - Azure Active Directory | Microsoft Docs
description: Using administrative units for more granular delegation of permissions in Azure Active Directory
services: active-directory
documentationcenter: ''
author: curtand
manager: daveba
ms.service: active-directory
ms.topic: article
ms.subservice: users-groups-roles
ms.workload: identity
ms.date: 03/31/2020
ms.author: curtand
ms.reviewer: elkuzmen
ms.custom: oldportal;it-pro;
ms.collection: M365-identity-device-management
---

# List the scoped administrators in an administrative unit

## Azure portal

All the role assignments done on an administrative unit level can be viewed in the Administrative units section in Azure AD. Go to **Azure AD > Administrative units** in the portal. Select the administrative unit for which you want to list the role assignments. Select the **Roles and administrators**

## PowerShell

    $administrative unitObj = Get-AzureADAdministrativeUnit -Filter "displayname eq 'Test administrative unit 2'"
    Get-AzureADScopedRoleMembership -ObjectId $administrative unitObj.ObjectId | fl *

The highlighted section may be changed as required for the specific environment.

## Graph API

    Http request
    GET /administrativeUnits/{id}/scopedRoleMembers
    Request body
    {}

## Next steps

- [Aasign roles with administrative unit scope](roles-scope-assign-roles.md)
