---
title: Create & manage a catalog of resources in entitlement management - Azure AD
description: Learn how to create a new container of resources and access packages in Azure Active Directory entitlement management.
services: active-directory
documentationCenter: ''
author: ajburnle
manager: daveba
editor: HANKI
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: how-to
ms.subservice: compliance
ms.date: 12/23/2020
ms.author: ajburnle
ms.reviewer: hanki
ms.collection: M365-identity-device-management


#Customer intent: As an administrator, I want detailed information about the options available when creating and manage catalog so that I most effectively use catalogs in my organization.

---
# Create and manage a catalog of resources in Azure AD entitlement management

## Create a catalog

A catalog is a container of resources and access packages. You create a catalog when you want to group related resources and access packages. Whoever creates the catalog becomes the first catalog owner. A catalog owner can add additional catalog owners.

**Prerequisite role:** Global administrator, User administrator, or Catalog creator

1. In the Azure portal, click **Azure Active Directory** and then click **Identity Governance**.

1. In the left menu, click **Catalogs**.

    ![Entitlement management catalogs in the Azure portal](./media/entitlement-management-catalog-create/catalogs.png)

1. Click **New catalog**.

1. Enter a unique name for the catalog and provide a description.

    Users will see this information in an access package's details.

1. If you want the access packages in this catalog to be available for users to request as soon as they are created, set **Enabled** to **Yes**.

1. If you want to allow users in selected external directories to be able to request access packages in this catalog, set **Enabled for external users** to **Yes**.

    ![New catalog pane](./media/entitlement-management-shared/new-catalog.png)

1. Click **Create** to create the catalog.

### Creating a catalog programmatically

You can also create a catalog using Microsoft Graph.  A user in an appropriate role with an application that has the delegated `EntitlementManagement.ReadWrite.All` permission can call the API to [create an accessPackageCatalog](/graph/api/accesspackagecatalog-post?view=graph-rest-beta&preserve-view=true).

## Add resources to a catalog

To include resources in an access package, the resources must exist in a catalog. The types of resources you can add are groups, applications, and SharePoint Online sites. The groups can be cloud-created Microsoft 365 Groups or cloud-created Azure AD security groups. The applications can be Azure AD enterprise applications, including both SaaS applications and your own applications federated to Azure AD. The sites can be SharePoint Online sites or SharePoint Online site collections.

**Prerequisite role:** See [Required roles to add resources to a catalog](entitlement-management-delegate.md#required-roles-to-add-resources-to-a-catalog)

1. In the Azure portal, click **Azure Active Directory** and then click **Identity Governance**.

1. In the left menu, click **Catalogs** and then open the catalog you want to add resources to.

1. In the left menu, click **Resources**.

1. Click **Add resources**.

1. Click a resource type: **Groups and Teams**, **Applications**, or **SharePoint sites**.

    If you don't see a resource that you want to add or you are unable to add a resource, make sure you have the required Azure AD directory role and entitlement management role. You might need to have someone with the required roles add the resource to your catalog. For more information, see [Required roles to add resources to a catalog](entitlement-management-delegate.md#required-roles-to-add-resources-to-a-catalog).

1. Select one or more resources of the type that you would like to add to the catalog.

    ![Add resources to a catalog](./media/entitlement-management-catalog-create/catalog-add-resources.png)

1. When finished, click **Add**.

    These resources can now be included in access packages within the catalog.

### Add a Multi-geo SharePoint Site (Preview)

1. If you have [Multi-Geo](/microsoft-365/enterprise/multi-geo-capabilities-in-onedrive-and-sharepoint-online-in-microsoft-365) enabled for SharePoint, select the environment you would like to select sites from.
    
    :::image type="content" source="media/entitlement-management-catalog-create/sharepoint-multigeo-select.png" alt-text="Access package - Add resource roles - Select SharePoint Multi-geo sites":::

1. Then select the sites you would like to be added to the catalog. 

### Adding a resource to a catalog programmatically

You can also add a resource to a catalog using Microsoft Graph.  A user in an appropriate role, or a catalog and resource owner, with an application that has the delegated `EntitlementManagement.ReadWrite.All` permission can call the API to [create an accessPackageResourceRequest](/graph/api/accesspackageresourcerequest-post?view=graph-rest-beta&preserve-view=true).

## Remove resources from a catalog

You can remove resources from a catalog. A resource can only be removed from a catalog if it is not being used in any of the catalog's access packages.

**Prerequisite role:** See [Required roles to add resources to a catalog](entitlement-management-delegate.md#required-roles-to-add-resources-to-a-catalog)

1. In the Azure portal, click **Azure Active Directory** and then click **Identity Governance**.

1. In the left menu, click **Catalogs** and then open the catalog you want to remove resources from.

1. In the left menu, click **Resources**.

1. Select the resources you want to remove.

1. Click **Remove** (or click the ellipsis (**...**) and then click **Remove resource**).


## Add additional catalog owners

The user that created a catalog becomes the first catalog owner. To delegate management of a catalog, you add users to the catalog owner role. This helps share the catalog management responsibilities. 

Follow these steps to assign a user to the catalog owner role:

**Prerequisite role:** Global administrator, User administrator, or Catalog owner

1. In the Azure portal, click **Azure Active Directory** and then click **Identity Governance**.

1. In the left menu, click **Catalogs** and then open the catalog you want to add administrators to.

1. In the left menu, click **Roles and administrators**.

    ![Catalogs roles and administrators](./media/entitlement-management-shared/catalog-roles-administrators.png)

1. Click **Add owners** to select the members for these roles.

1. Click **Select** to add these members.

## Edit a catalog

You can edit the name and description for a catalog. Users see this information in an access package's details.

**Prerequisite role:** Global administrator, User administrator, or Catalog owner

1. In the Azure portal, click **Azure Active Directory** and then click **Identity Governance**.

1. In the left menu, click **Catalogs** and then open the catalog you want to edit.

1. On the catalog's **Overview** page, click **Edit**.

1. Edit the catalog's name, description, or enabled settings.

    ![Edit catalog settings](./media/entitlement-management-shared/catalog-edit.png)

1. Click **Save**.

## Delete a catalog

You can delete a catalog, but only if it does not have any access packages.

**Prerequisite role:** Global administrator, User administrator, or Catalog owner

1. In the Azure portal, click **Azure Active Directory** and then click **Identity Governance**.

1. In the left menu, click **Catalogs** and then open the catalog you want to delete.

1. On the catalog's **Overview**, click **Delete**.

1. In the message box that appears, click **Yes**.

### Deleting a catalog programmatically

You can also delete a catalog using Microsoft Graph.  A user in an appropriate role with an application that has the delegated `EntitlementManagement.ReadWrite.All` permission can call the API to [delete an accessPackageCatalog](/graph/api/accesspackagecatalog-delete?view=graph-rest-beta&preserve-view=true).

## Next steps

- [Delegate access governance to access package managers](entitlement-management-delegate-managers.md)
