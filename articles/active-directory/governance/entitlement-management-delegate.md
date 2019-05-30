---
title: Delegate tasks in Azure AD entitlement management (Preview) - Azure Active Directory
description: Learn about the roles you can assign to delegate tasks in Azure Active Directory entitlement management.
services: active-directory
documentationCenter: ''
author: rolyon
manager: mtillman
editor: markwahl-msft
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.subservice: compliance
ms.date: 05/29/2019
ms.author: rolyon
ms.reviewer: mwahl
ms.collection: M365-identity-device-management


#Customer intent: As a administrator, I want learn about the roles and permissions in entitlement management that I can assign to delegate management of resources in my organization.

---

# Delegate tasks in Azure AD entitlement management

By default, Global administrators and User administrators can create and manage all aspects of Azure AD entitlement management. Instead of granting unrestricted permissions, you should grant users the least permissions they need to perform their job. This article describes the roles that you can assign to delegate various tasks in entitlement management.

## Entitlement management roles

Entitlement management has several roles specific that are unique to entitlement management.

| Role | Description |
| --- | --- |
| Catalog creator | Create and manage catalogs. Typically an IT administrator or resource owner. The person that creates a catalog automatically becomes the catalog's first catalog owner. |
| Catalog owner | Edit and manage existing catalogs. Typically an IT administrator or resource owner. |
| Access package manager | Edit and manage all existing access packages within a catalog. |
| Approver | Approve requests to access packages. |
| Requestor | Request access packages. |

The following table lists the tasks that each of these roles can perform.

| Task | Catalog creator | Catalog owner | Access package manager | Approver |
| --- | :---: | :---: | :---: | :---: |
| [Create a new access package in the General catalog](entitlement-management-access-package-create.md) | :heavy_check_mark: |  |  |  |
| [Create a new access package in a catalog](entitlement-management-access-package-create.md) |  | :heavy_check_mark: |  |  |
| [Manage resource roles in an access package](entitlement-management-access-package-edit.md) |  | :heavy_check_mark: | :heavy_check_mark: |  |
| [Specify who can request an access package](entitlement-management-access-package-edit.md#add-a-new-policy) |  | :heavy_check_mark: | :heavy_check_mark: |  |
| [Directly assign a user to an access package](entitlement-management-access-package-edit.md#directly-assign-a-user) |  | :heavy_check_mark: | :heavy_check_mark: |  |
| [View who has an assignment to an access package](entitlement-management-access-package-edit.md#view-who-has-an-assignment) |  | :heavy_check_mark: | :heavy_check_mark: |  |
| [View an access package's requests](entitlement-management-access-package-edit.md#view-requests) |  | :heavy_check_mark: | :heavy_check_mark: |  |
| [View a request's delivery errors](entitlement-management-access-package-edit.md#view-a-requests-delivery-errors) |  | :heavy_check_mark: | :heavy_check_mark: |  |
| [Cancel a pending request](entitlement-management-access-package-edit.md#cancel-a-pending-request) |  | :heavy_check_mark: | :heavy_check_mark: |  |
| [Hide an access package](entitlement-management-access-package-edit.md#change-the-hidden-setting) |  | :heavy_check_mark: | :heavy_check_mark: |  |
| [Delete an access package](entitlement-management-access-package-edit.md#delete) |  | :heavy_check_mark: | :heavy_check_mark: |  |
| [Approve an access request](entitlement-management-request-approve.md) |  |  |  | :heavy_check_mark: |
| [Create a catalog](entitlement-management-catalog-create.md) | :heavy_check_mark: |  |  |  |
| [Add a catalog creator](#add-a-catalog-creator) | :heavy_check_mark: |  |  |  |
| [Add a catalog owner or an access package manager](#add-a-catalog-owner-or-an-access-package-manager) |  | :heavy_check_mark: |  |  |
| [Edit/delete a catalog](entitlement-management-catalog-create.md#edit-a-catalog) |  | :heavy_check_mark: |  |  |

## Roles to manage resources in a catalog

To manage groups, applications, and SharePoint Online sites in a catalog you must have the appropriate Azure AD directory role and entitlement management role. For more information, see [manage resources in a catalog](entitlement-management-catalog-create.md#add-resources-to-a-catalog).

| Directory role | Catalog owner | Cloud-created security group | Cloud-created unified group | Application | SharePoint Online site |
| --- | :---: | :---: | :---: | :---: | :---: |
| [Global administrator](../users-groups-roles/directory-assign-admin-roles.md) | n/a |  :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| [User administrator](../users-groups-roles/directory-assign-admin-roles.md) | n/a |  :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |
| [Intune service administrator](../users-groups-roles/directory-assign-admin-roles.md) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  |  |
| [Exchange administrator](../users-groups-roles/directory-assign-admin-roles.md) | :heavy_check_mark: |  | :heavy_check_mark: |  |  |
| [Teams administrator](../users-groups-roles/directory-assign-admin-roles.md) | :heavy_check_mark: |  | :heavy_check_mark: |  |  |
| [SharePoint administrator](../users-groups-roles/directory-assign-admin-roles.md) | :heavy_check_mark: |  | :heavy_check_mark: |  | :heavy_check_mark: |
| [Application administrator](../users-groups-roles/directory-assign-admin-roles.md) | :heavy_check_mark: |  |  | :heavy_check_mark: |  |
| [Cloud application administrator](../users-groups-roles/directory-assign-admin-roles.md) | :heavy_check_mark: |  |  | :heavy_check_mark: |  |
| User | :heavy_check_mark: | Only if group owner | Only if group owner | Only if app owner |  |

## Add a catalog creator

If you want to delegate catalog creation, you assign users to the catalog creator role.

**Prerequisite role:** User administrator or Catalog creator

1. In the Azure portal, click **Azure Active Directory** and then click **Identity Governance**.

1. In the left menu, click **Settings**.

1. Click **Edit**.

1. In the **Delegate entitlement management** section, click **Add catalog creators** to select the members for this role.

1. Click **Select**.

1. Click **Save**.

## Add a catalog owner or an access package manager

If you want to delegate management of a catalog or access packages in the catalog, you add users to the catalog owner or access package manager roles. Whoever creates a catalog becomes the first catalog owner.

**Prerequisite role:** User administrator or Catalog owner

1. In the Azure portal, click **Azure Active Directory** and then click **Identity Governance**.

1. In the left menu, click **Catalogs** and then open the catalog you want to add administrators to.

1. In the left menu, click **Roles and administrators**.

1. Click **Add owners** or **Add access package managers** to select the members for these roles.

1. Click **Select** to add these members.

## Next steps

- [Add approvers](entitlement-management-access-package-edit.md#policy-request)
