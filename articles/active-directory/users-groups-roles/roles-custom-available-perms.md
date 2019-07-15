---
title: Custom administrator role available permissions for delegating identity management - Azure Active Directory | Microsoft Docs
description: Custom administrator role available permissions for delegating identity management. 
services: active-directory
author: curtand
manager: mtillman
ms.service: active-directory
ms.workload: identity
ms.subservice: users-groups-roles
ms.topic: article
ms.date: 07/22/2019
ms.author: curtand
ms.reviewer: vincesm
ms.custom: it-pro

ms.collection: M365-identity-device-management
---

# Custom administrator role available permissions in Azure Active Directory

## Available permissions

There are two types of applications, single-tenant and multi-tenant. Single-tenant applications are only available to users in the Azure AD tenant where the application is registered. Multi-tenant applications are supported by all Azure AD tenants.

## Single-tenant application permissions

Action | Permission | Documentation description
------ | ---------- | -------------------------
Delete | microsoft.directory/applications.myOrganization/delete | Ability to delete single-directory applications. Single-directory applications are defined as having the Supported account types set to "Accounts in this organizational directory only". In the API single-directory application have the signInAudience property set to "AzureADMyOrg".
Read | microsoft.directory/applications.myOrganization/allProperties/read | Ability to read all properties of single-directory applications. Single-directory applications are defined as having the Supported account types set to "Accounts in this organizational directory only". In the API single-directory application have the signInAudience property set to "AzureADMyOrg".
Read | microsoft.directory/applications.myOrganization/basic/read | Ability to read the name, application ID, logo, homepage URL, terms of service URL, privacy statement URL, and publisher domain properties of single-directory applications. Single-directory applications are defined as having the Supported account types set to "Accounts in this organizational directory only". In the API single-directory application have the signInAudience property set to "AzureADMyOrg".
Read | microsoft.directory/applications.myOrganization/owners/read | Ability to read owners property on single-directory applications. Single-directory applications are defined as having the Supported account types set to "Accounts in this organizational directory only". In the API single-directory application have the signInAudience property set to "AzureADMyOrg".
Update | microsoft.directory/applications.myOrganization/allProperties/update | Ability to update all properties. Single-directory applications are defined as having the Supported account types set to "Accounts in this organizational directory only". In the API single-directory application have the signInAudience property set to "AzureADMyOrg".
Update | microsoft.directory/applications.myOrganization/audience/update | Ability to update the supported account type property on single-directory applications. Single-directory applications are defined as having the Supported account types set to "Accounts in this organizational directory only". In the API single-directory application have the signInAudience property set to "AzureADMyOrg".
Update | microsoft.directory/applications.myOrganization/authentication/update | Ability to update the reply URL, logout URL, implicit flow, and publisher domain properties on single-directory applications. Single-directory applications are defined as having the Supported account types set to "Accounts in this organizational directory only". In the API single-directory application have the signInAudience property set to "AzureADMyOrg".
Update | microsoft.directory/applications.myOrganization/basic/update | Ability to update the name, logo, homepage URL, terms of service URL, and privacy statement URL properties on single-directory applications. Single-directory applications are defined as having the Supported account types set to "Accounts in this organizational directory only". In the API single-directory application have the signInAudience property set to "AzureADMyOrg".
Update | microsoft.directory/applications.myOrganization/credentials/update | Ability to update the certificates and client secrets properties on single-directory applications. Single-directory applications are defined as having the Supported account types set to "Accounts in this organizational directory only". In the API single-directory application have the signInAudience property set to "AzureADMyOrg".
Update | microsoft.directory/applications.myOrganization/owners/update | Ability to update the owner property on single-directory applications. Single-directory applications are defined as having the Supported account types set to "Accounts in this organizational directory only". In the API single-directory application have the signInAudience property set to "AzureADMyOrg". Be aware this permission allows adding owners, and owners can promote single-directory applications to multi-directory applications.
Update | microsoft.directory/applications.myOrganization/permissions/update | Ability to update the delegated permissions, application permissions, authorized client applications, required permissions, and grant consent properties on single-directory applications. Single-directory applications are defined as having the Supported account types set to "Accounts in this organizational directory only". In the API single-directory application have the signInAudience property set to "AzureADMyOrg".

## Single- and multi-tenant application permissions

Action | Permission | Documentation description
------ | ----------- | -------------------------
Create |  microsoft.directory/applications/create |  Ability to create a new single-directory or multi-directory application. Creator is not added as the first owner, but creator can add owners during creation (API/CLI only). Be aware creator is not restricted to 250 created objects and therefore can accidently or maliciously consume organization-wide object quota.
Create |  microsoft.directory/applications/createAsOwner |  Ability to create a new single-directory or multi-directory application. Creator is added as the first owner, and the created object counts against the creator's 250 created objects quota.
Delete |  microsoft.directory/applications/delete |  Ability to delete single-directory and multi-directory applications
Read |  microsoft.directory/applications/allProperties/read |  Ability to read all properties of single-directory and multi-directory applications outside of senstive properties like credentials.
Read |  microsoft.directory/applications/basic/read |  Ability to read the name, application ID, logo, homepage URL, terms of service URL, privacy statement URL, and publisher domain properties on single-directory and multi-directory applications.
Read |  microsoft.directory/applications/owners/read |  Ability to read owners property on single-directory and multi-directory applications.
Update |  microsoft.directory/applications/allProperties/update |  Ability to update all properties on single-directory and multi-directory applications.
Update |  microsoft.directory/applications/audience/update |  Ability to update the supported account type (signInAudience) property on single-directory and multi-directory applications.
Update |  microsoft.directory/applications/authentication/update |  Ability to update the reply URL, logout URL, implicit flow, and publisher domain properties on single-directory and multi-directory applications.
Update |  microsoft.directory/applications/basic/update |  Ability to update the name, logo, homepage URL, terms of service URL, and privacy statement URL properties on single-directory and multi-directory applications.
Update |  microsoft.directory/applications/credentials/update |  Ability to update the certificates and client secrets properties on single-directory and multi-directory applications.
Update |  microsoft.directory/applications/owners/update |  Ability to update the owner property on single-directory and multi-directory applications.
Update |  microsoft.directory/applications/permissions/update |  Ability to update the delegated permissions, application permissions, authorized client applications, required permissions, and grant consent properties on single-directory and multi-directory applications.

## Required license plan

[!INCLUDE [License requirement for using custom roles in Azure AD](../../../includes/active-directory-p1-license.md)]

## Next steps

- Create custom roles using [the Azure portal, Azure AD PowerShell, and Graph API](roles-create-custom.md)
- [View the assignments for a custom role](roles-view-assignments.md)
- [Assign Azure AD custom roles in PowerShell](roles-assign-powershell.md)
