---
title: Create and manage a catalog in Azure AD entitlement management (Preview) - Azure Active Directory
description: Learn how to create a new container of resources and access packages in Azure Active Directory entitlement management (Preview).
services: active-directory
documentationCenter: ''
author: rolyon
manager: mtillman
editor: HANKI
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.subservice: compliance
ms.date: 04/19/2019
ms.author: rolyon
ms.reviewer: hanki
ms.collection: M365-identity-device-management


#Customer intent: As an administrator, I want detailed information about the options available when creating and manage catalog so that I most effectively use catalogs in my organization.

---
# Create and manage a catalog in Azure AD entitlement management (Preview)

> [!IMPORTANT]
> Azure Active Directory (Azure AD) entitlement management is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Create a catalog

A catalog is a container of resources and access packages. You create a catalog when you want to group related resources and access packages. Whoever creates the catalog becomes the first catalog owner. A catalog owner can add additional catalog owners.

**Prerequisite role:** User administrator or Catalog creator

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Click **Azure Active Directory** and then click **Identity governance**.

1. In the left menu, click **Catalogs**.

    ![Entitlement management catalogs in the Azure portal](./media/entitlement-management-catalog-create/catalogs.png)

1. Click **New catalog**.

1. Enter a unique name for the catalog and provide a description.

    Users will see this information in an access package's details.

1. If you want the access packages in this catalog to be available for users to request as soon as they are created, set **Enabled** to **Yes**.

1. If you want to allow users in selected external directories to be able to request access packages in this catalog, set **Enabled for external users** to **Yes**.

    ![New catalog pane](./media/entitlement-management-catalog-create/new-catalog.png)

1. Click **Create** to create the catalog.

## Add resources to a catalog

To include resources in an access package, the resources must exist in a catalog. The types of resources you can add are groups, applications, and SharePoint Online sites.

**Prerequisite role:** User administrator or Catalog owner

1. In the Azure portal, click **Azure Active Directory** and then click **Identity governance**.

1. In the left menu, click **Catalogs** and then open the catalog you want to add resources to.

1. In the left menu, click **Resources**.

1. Click **Add resources**.

1. Click a resource type: **Groups**, **Applications**, or **SharePoint sites**.

    If you are a catalog creator, you can add any Office 365 group or Azure AD security group you own to your catalog. If there is a group that you want to assign to users, but you do not own the group, you will need to have a User administrator add that group to your catalog.

    If you are a catalog creator, you can add any Azure AD enterprise application you own, including both SaaS applications and your own applications federated to Azure AD, to your catalog. If there is an application that you want to assign users to but do not own, you will need to have a User administrator add that application to your catalog. Once the application is part of the catalog, you can select any of the application's roles in an access package.

1. Select one or more resources of the type that you would like to add to the catalog.

1. When finished, click **Add**.

    These resources can now be included in access packages within the catalog.

## Remove resources from a catalog

You can remove resources from a catalog. A resource can only be removed from a catalog if it is not being used in any of the catalog's access packages.

**Prerequisite role:** User administrator or Catalog owner

1. In the Azure portal, click **Azure Active Directory** and then click **Identity governance**.

1. In the left menu, click **Catalogs** and then open the catalog you want to remove resources from.

1. In the left menu, click **Resources**.

1. Select the resources you want to remove.

1. Click **Remove** (or click the ellipsis (**...**) and then click **Remove resource**).

## Add catalog owners or access package managers

If you want to delegate management of the catalog or the access packages in the catalog, you add catalog owners or access package managers. Whoever creates a catalog becomes the first catalog owner.

**Prerequisite role:** User administrator or Catalog owner

1. In the Azure portal, click **Azure Active Directory** and then click **Identity governance**.

1. In the left menu, click **Catalogs** and then open the catalog you want to add administrators to.

1. In the left menu, click **Roles and administrators**.

1. Click **Add owners** or **Add access package managers** to select the members for these roles.

1. Click **Select** to add these members.

## Edit a catalog

You can edit the name and description for a catalog. Users see this information in an access package's details.

**Prerequisite role:** User administrator or Catalog owner

1. In the Azure portal, click **Azure Active Directory** and then click **Identity governance**.

1. In the left menu, click **Catalogs** and then open the catalog you want to edit.

1. On the catalog's **Overview** page, click **Edit**.

1. Edit the catalog's name or description.

1. Click **Save**.

## Delete a catalog

You can delete a catalog, but only if it does not have any access packages.

**Prerequisite role:** User administrator or Catalog owner

1. In the Azure portal, click **Azure Active Directory** and then click **Identity governance**.

1. In the left menu, click **Catalogs** and then open the catalog you want to delete.

1. On the catalog's **Overview**, click **Delete**.

1. In the message box that appears, click **Yes**.

## Next steps

- [Create and manage an access package](entitlement-management-access-package-create.md)
