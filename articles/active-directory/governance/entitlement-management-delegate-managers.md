---
title: Delegate access governance to access package managers in entitlement management
description: Learn how to delegate access governance from IT administrators to access package managers and project managers so that they can manage access themselves.
services: active-directory
documentationCenter: ''
author: owinfreyatl
manager: amycolannino
editor: markwahl-msft
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: how-to
ms.subservice: compliance
ms.date: 05/31/2023
ms.author: owinfrey
ms.reviewer: mwahl
ms.collection: M365-identity-device-management


#Customer intent: As an administrator, I want to delegate access governance from IT administrators to department managers and project managers so that they can manage access themselves.

---

# Delegate access governance to access package managers in entitlement management

To delegate the creation and management of access packages in a catalog, you add users to the access package manager role. Access package managers must be familiar with the need for users to request access to resources in a catalog. For example, if a catalog is used for a project, then a project lead might be an access package manager for that catalog.  Access package managers can't add resources to a catalog, but they can manage the access packages and policies in a catalog.  When delegating to an access package manager, that person can then be responsible for:

- What roles a user has to the resources in a catalog
- Who will need access
- Who needs to approve the access requests
- How long the project lasts

They can create access packages and policies, including policies referencing existing [connected organizations](entitlement-management-organization.md). Once their access packages are created, then they can have other users request or be assigned to those access packages.

This video provides an overview of how to delegate access governance from catalog owner to access package manager.

> [!VIDEO https://www.microsoft.com/videoplayer/embed/RE3Lq08]

In addition to the catalog owner and access package manager roles, you can also add users to the catalog reader role, which provides view-only access to the catalog, or to the access package assignment manager role, which enables the users to change assignments but not access packages or policies.

## As a catalog owner, delegate to an access package manager

Follow these steps to assign a user to the access package manager role:

**Prerequisite role:** Global administrator, Identity Governance administrator, User administrator, or Catalog owner

1. In the Azure portal, select **Azure Active Directory** and then select **Identity Governance**.

1. In the left menu, select **Catalogs** and then open the catalog you want to add administrators to.

1. In the left menu, select **Roles and administrators**.

    ![Catalogs roles and administrators](./media/entitlement-management-shared/catalog-roles-administrators.png)

1. Select **Add access package managers** to select the members for these roles.

1. Select **Select** to add these members.

## Remove an access package manager

Follow these steps to remove a user from the access package manager role:

**Prerequisite role:** Global administrator, User administrator, or Catalog owner

1. In the Azure portal, select **Azure Active Directory** and then select **Identity Governance**.

1. In the left menu, select **Catalogs** and then open the catalog you want to add administrators to.

1. In the left menu, select **Roles and administrators**.

1. Add a checkmark next to an access package manager you want to remove.

1. Select **Remove**.

## Next steps

- [Create a new access package](entitlement-management-access-package-create.md)
