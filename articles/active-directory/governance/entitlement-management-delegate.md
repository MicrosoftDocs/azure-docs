---
title: Delegate access governance to others in Azure AD entitlement management (Preview) - Azure Active Directory
description: Learn how to delegate access governance from IT administrators to department managers and project managers so that they can manage access themselves.
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


#Customer intent: As a administrator, I want delegate access governance from IT administrators to department managers and project managers so that they can manage access themselves.

---

# Delegate access governance to others in Azure AD entitlement management (Preview)

> [!IMPORTANT]
> Azure Active Directory (Azure AD) entitlement management is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

By default, Global administrators and User administrators can create and manage all aspects of Azure AD entitlement management. However, the users in these roles may not know all the scenarios where access packages are required. Typically it is users within departments who know who need to collaborate. Instead of granting unrestricted permissions to non-administrators, you can grant users the least permissions they need to perform their job and avoid creating conflicting or inappropriate access rights.

This video provides an overview of how to delegate access governance from IT administrator to department manager.

> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE3Lq00]

## Delegate example for department adoption

To understand how you might delegate access governance in entitlement management, it helps to consider an example. Suppose your organization has the following administrator and department managers.

![Delegate from IT administrator to department managers](./media/entitlement-management-delegate/delegate-admin-dept-managers.png)

As the IT administrator, Hana has contacts in each department -- Mamta in Marketing, Mark in Finance, and Joe in Legal who are responsible for their department's resources and business critical content.

With entitlement management, you can delegate access governance to these department managers because they're the ones who know who needs access and to which resources. This ensures the right people are managing access for their departments, without IT involvement.

Here is one way that Hana could delegate access governance to the marketing, finance, and legal departments.

1. Hana creates a new Azure AD security group, and adds Mamta, Mark, and Joe as members of the group.

1. Hana adds that group to the catalog creators role.

    Mamta, Mark, and Joe can now create catalogs for their departments, add resources that their department needs, and further delegate within the catalog.

    Note that Mamta, Mark, and Joe cannot see each other's catalogs.

1. Mamta creates a **Marketing** catalog, which is a container of resources.

1. Mamta adds the resources her marketing department owns to the catalog.

1. Mamta can add any catalog owners that she wants to be a co-owner for that catalog. This helps share the catalog management tasks.

1. Mamta can further delegate to project managers the creation and management of access packages in the Marketing catalog by assigning the access package manager role. An access package is a bundle of resources for a team or project that users can request.

The following diagram shows catalogs with resources for the marketing, finance, and legal departments. Using these catalogs, project managers can create access packages for their teams or projects.

![Entitlement management delegate example](./media/entitlement-management-delegate/elm-delegate.png)

After delegation, the marketing department might have roles similar to the following table. For more information about roles, see [Roles in entitlement management](entitlement-management-roles.md).

| User | Job role | Azure AD role | Entitlement management role |
| --- | --- | --- | --- |
| Hana | IT administrator | Global administrator or User administrator |  |
| Mamta | Marketing manager | User | Catalog creator and Catalog owner |
| Bob | Marketing lead | User | Catalog owner |
| Jessica | Marketing project manager | User | Access package manager |

## As an IT administrator, delegate to department manager

To delegate to department managers so that they can create their own catalogs, you add users to the catalog creator role. You can add individual users, or for convenience can add a group, whose members are then able to create catalogs.

Follow these steps to assign a user to the catalog creator role.

**Prerequisite role:** Global administrator or User administrator

1. In the Azure portal, click **Azure Active Directory** and then click **Identity Governance**.

1. In the left menu, in the **Entitlement management** section, click **Settings**.

1. Click **Edit**.

    ![Settings to manage the lifecycle of external users](./media/entitlement-management-shared/settings-external-users.png)

1. In the **Delegate entitlement management** section, click **Add catalog creators** to select the users or groups who will be the members for this entitlement management role.

1. Click **Select**.

1. Click **Save**.

## As a department manager, create a catalog

[!INCLUDE [Entitlement management create a catalog](../../../includes/active-directory-entitlement-management-catalog-create.md)]

## As a department manager, add resources to the catalog

[!INCLUDE [Entitlement management add resources to a catalog](../../../includes/active-directory-entitlement-management-catalog-resources.md)]

## As a department manager, add additional catalog owners

Whoever creates a catalog becomes the first catalog owner. To delegate management of a catalog, you add users to the catalog owner role. This helps share the catalog management tasks. 

Follow these steps to assign a user to the catalog owner role:

**Prerequisite role:** Global administrator, User administrator, or Catalog owner

1. In the Azure portal, click **Azure Active Directory** and then click **Identity Governance**.

1. In the left menu, click **Catalogs** and then open the catalog you want to add administrators to.

1. In the left menu, click **Roles and administrators**.

1. Click **Add owners** to select the members for these roles.

1. Click **Select** to add these members.

## As a department manager, delegate to project manager

To delegate creation and management of access packages in a catalog, you add users to the access package manager role. Access package managers must be familiar with the project and are typically a project manager or a project lead. Access package managers are involved in the day-to-day operations of the project, and they know the following information:

- What resources are needed
- Who will need access
- Who needs to approve access
- How long the project will last

This video provides an overview of how to delegate access governance from department manager to project manager.

> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE3Lq08]

Follow these steps to assign a user to the access package manager role:

**Prerequisite role:** Global administrator, User administrator, or Catalog owner

1. In the Azure portal, click **Azure Active Directory** and then click **Identity Governance**.

1. In the left menu, click **Catalogs** and then open the catalog you want to add administrators to.

1. In the left menu, click **Roles and administrators**.

1. Click **Add access package managers** to select the members for these roles.

1. Click **Select** to add these members.

## Next steps

- [Roles in entitlement management](entitlement-management-roles.md)
- [Create a new access package](entitlement-management-access-package-create.md)
