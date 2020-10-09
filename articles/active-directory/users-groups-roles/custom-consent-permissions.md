---
title: App consent permissions for custom roles in Azure Active Directory | Microsoft Docs
description: Preview app consent permissions for custom Azure AD roles in the Azure portal, PowerShell, or Graph API.
services: active-directory
author: curtand
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.subservice: users-groups-roles
ms.topic: overview
ms.date: 10/06/2020
ms.author: curtand
ms.reviewer: psignoret
ms.custom: it-pro
---

# App consent permissions for custom roles in Azure Active Directory

This article contains the currently available app consent permissions for custom role definitions in Azure Active Directory (Azure AD). In this article, you'll find the permissions required for some common scenarios related to app consent and permissions.

## Required license plan

Using this feature requires an Azure AD Premium P1 license for your Azure AD organization. To find the right license for your requirements, see [Comparing generally available features of the Free, Basic, and Premium editions](https://azure.microsoft.com/pricing/details/active-directory/).

## App consent permissions

Use the permissions listed in this article to manage app consent policies, as well as the permission to grant consent to apps.

> [!NOTE]
> The Azure AD admin portal does not yet support adding the permissions listed in this article to a custom directory role definition. You must [use Azure AD PowerShell to create a custom directory role](roles-create-custom.md#create-a-role-using-powershell) with the permissions listed in this article.

### Granting delegated permissions to apps on behalf of self (user consent)

To allow users to grant consent to applications on behalf of themselves (user consent), subject to an app consent policy.

- microsoft.directory/servicePrincipals/managePermissionGrantsForSelf.{id}

Where `{id}` is replaced by the ID of an [app consent policy](../manage-apps/manage-app-consent-policies.md) which will set the conditions which must be met for this permission to be active.

For example, to allow users to grant consent on their own behalf, subject to the built-in app consent policy with ID `microsoft-user-default-low`, you would use the permission `...managePermissionGrantsForSelf.microsoft-user-default-low`.

### Granting permissions to apps on behalf of all (admin consent)

To delegate tenant-wide admin consent to apps, for both delegated permissions and application permissions (app roles):

- microsoft.directory/servicePrincipals/managePermissionGrantsForAll.{id}

Where `{id}` is replaced by the ID of an [app consent policy](../manage-apps/manage-app-consent-policies.md) which will set the conditions which must be met for this permission to be usable.

For example, to allow role assignees to grant tenant-wide admin consent to apps subject to a custom [app consent policy](../manage-apps/manage-app-consent-policies.md) with ID `low-risk-any-app`, you would use the permission `microsoft.directory/servicePrincipals/managePermissionGrantsForAll.low-risk-any-app`.

### Managing app consent policies

To delegate the creation, update and deletion of [app consent policies](../manage-apps/manage-app-consent-policies.md).

- microsoft.directory/permissionGrantPolicies/create
- microsoft.directory/permissionGrantPolicies/standard/read
- microsoft.directory/permissionGrantPolicies/basic/update
- microsoft.directory/permissionGrantPolicies/delete

## Full list of permissions

Permission | Description
---------- | -----------
microsoft.directory/servicePrincipals/managePermissionGrantsForSelf.{id} | Grants the ability to consent to apps on behalf of self (user consent), subject to app consent policy `{id}`.
microsoft.directory/servicePrincipals/managePermissionGrantsForAll.{id} | Grants the permission to consent to apps on behalf of all (tenant-wide admin consent), subject to app consent policy `{id}`.
microsoft.directory/permissionGrantPolicies/standard/read | Grants the ability to read app consent policies.
microsoft.directory/permissionGrantPolicies/basic/update | Grants the ability to update basic properties on existing app consent policies.
microsoft.directory/permissionGrantPolicies/create | Grants the ability to create app consent policies.
microsoft.directory/permissionGrantPolicies/delete | Grants the ability to delete app consent policies.

## Next steps

- [Create custom roles using the Azure portal, Azure AD PowerShell, and Graph API](roles-create-custom.md)
- [View the assignments for a custom role](roles-view-assignments.md)
