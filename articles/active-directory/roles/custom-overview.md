---
title: Overview of role-based access control (RBAC) in Azure Active Directory | Microsoft Docs
description: Learn how to understand the parts of a role assignment and restricted scope in Azure Active Directory.
services: active-directory
author: curtand
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.subservice: roles
ms.topic: overview
ms.date: 11/16/2020
ms.author: curtand
ms.reviewer: vincesm
ms.custom: it-pro

ms.collection: M365-identity-device-management
---

# Overview of role-based access control (RBAC) in Azure Active Directory

This article describes how to understand roles-based access control (RBAC) in Azure Active Directory (Azure AD). Azure AD roles allow you to grant granular permissions to your admins, abiding by the principle of least privilege. Azure AD built-in and custom roles operate on concepts similar to those you will find in [the role-based access control system for Azure resources](../../role-based-access-control/overview.md) (Azure roles). The [difference between these two role-based access control systems](../../role-based-access-control/rbac-and-directory-admin-roles.md) is:

- Azure AD roles control access to Azure AD resources such as users, groups, and applications using Graph API
- Azure roles control access to Azure resources such as virtual machines or storage using Azure Resource Management

Both systems contain similarly used role definitions and role assignments. However, Azure AD role permissions can't be used in Azure custom roles and vice versa.

## How Azure AD determines if a user has access to a resource

The following are the high-level steps that Azure AD uses to determine if you have access to a management resource. Use this information to troubleshoot access issues.

1. A user (or service principal) acquires a token to the Microsoft Graph or Azure AD Graph endpoint.
1. The user makes an API call to Azure Active Directory (Azure AD) via Microsoft Graph or Azure AD Graph using the issued token.
1. Depending on the circumstance, Azure AD takes one of the following actions:
   - Evaluates the user’s role memberships based on the [wids claim](../../active-directory-b2c/access-tokens.md) in the user’s access token.
   - Retrieves all the role assignments that apply for the user, either directly or via group membership, to the resource on which the action is being taken.
1. Azure AD determines if the action in the API call is included in the roles the user has for this resource.
1. If the user doesn't have a role with the action at the requested scope, access is not granted. Otherwise access is granted.

## Role assignment

A role assignment is an Azure AD resource that attaches a *role definition* to a *user* at a particular *scope* to grant access to Azure AD resources. Access is granted by creating a role assignment, and access is revoked by removing a role assignment. At its core, a role assignment consists of three elements:

- Azure AD user
- Role definition
- Resource scope

You can [create role assignments](custom-create.md) using the Azure portal, Azure AD PowerShell, or Graph API. You can also [view the assignments for a custom role](custom-view-assignments.md#view-the-assignments-of-a-role).

The following diagram shows an example of a role assignment. In this example, Chris Green has been assigned the App registration administrator custom role at the scope of the Contoso Widget Builder app registration. The assignment grants Chris the permissions of the App registration administrator role for only this specific app registration.

![Role assignment is how permissions are enforced and has three parts](./media/custom-overview/rbac-overview.png)

### Security principal

A security principal represents the user that is to be assigned access to Azure AD resources. A user is an individual who has a user profile in Azure Active Directory.

### Role

A role definition, or role, is a collection of permissions. A role definition lists the operations that can be performed on Azure AD resources, such as create, read, update, and delete. There are two types of roles in Azure AD:

- Built-in roles created by Microsoft that can't be changed.
- Custom roles created and managed by your organization.

### Scope

A scope is the restriction of permitted actions to a particular Azure AD resource as part of a role assignment. When you assign a role, you can specify a scope that limits the administrator's access to a specific resource. For example, if you want to grant a developer a custom role, but only to manage a specific application registration, you can include the specific application registration as a scope in the role assignment.

## Required license plan

[!INCLUDE [License requirement for using custom roles in Azure AD](../../../includes/active-directory-p1-license.md)]

## Next steps

- Create custom role assignments using [the Azure portal, Azure AD PowerShell, and Graph API](custom-create.md)
- [View the assignments for a custom role](custom-view-assignments.md)
