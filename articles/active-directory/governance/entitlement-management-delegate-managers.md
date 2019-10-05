---
title: Delegate access governance to access package managers in Azure AD entitlement management (Preview) - Azure Active Directory
description: Learn how to delegate access governance from IT administrators to access package managers and project managers so that they can manage access themselves.
services: active-directory
documentationCenter: ''
author: msaburnley
manager: daveba
editor: markwahl-msft
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.subservice: compliance
ms.date: 07/10/2019
ms.author: ajburnle
ms.reviewer: mwahl
ms.collection: M365-identity-device-management


#Customer intent: As an administrator, I want to delegate access governance from IT administrators to department managers and project managers so that they can manage access themselves.

---

# Delegate access governance to access package managers in Azure AD entitlement management (Preview)

> [!IMPORTANT]
> Azure Active Directory (Azure AD) entitlement management is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

To delegate the creation and management of access packages in a catalog, you add users to the access package manager role. Access package managers must be familiar with the project and are typically a project manager or a project lead. Access package managers are involved in the day-to-day operations of the project, and they know the following information:

- What resources are needed
- Who will need access
- Who needs to approve the access requests
- How long the project will last

This video provides an overview of how to delegate access governance from catalog owner to access package manager.

> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE3Lq08]

## As a catalog owner, delegate to access package manager

Follow these steps to assign a user to the access package manager role:

**Prerequisite role:** Global administrator, User administrator, or Catalog owner

1. In the Azure portal, click **Azure Active Directory** and then click **Identity Governance**.

1. In the left menu, click **Catalogs** and then open the catalog you want to add administrators to.

1. In the left menu, click **Roles and administrators**.

    ![Catalogs roles and administrators](./media/entitlement-management-shared/catalog-roles-administrators.png)

1. Click **Add access package managers** to select the members for these roles.

1. Click **Select** to add these members.

## Next steps

- [Create a new access package](entitlement-management-access-package-create.md)
