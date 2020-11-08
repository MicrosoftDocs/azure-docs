---
title: Set catalog permissions in Azure Purview
description: This article provides an overview of Azure Purview portal-managed permissions and roles.
author: rogerbu
ms.author: rogerbu
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: conceptual
ms.date: 11/07/2020
---

# Catalog permissions

Azure Purview uses [role-based access control (RBAC)](../role-based-access-control/overview.md) to manage catalog permissions for security principals. A security principal is an object that represents a user, Azure Active Directory group, service principal, or managed identity. For each Azure Purview security role, you can add or remove any of these types of security principals.

You use the Azure Purview portal to set permissions to call all of the APIs in the catalog, except for [setting up scans](add-security-principal.md#assign-permission-to-scan-content-into-the-catalog), which you set in the Azure portal.

## Azure Purview security roles

Azure Purview defines the following five security roles:

- **Catalog administrator**: Allows a user to call all APIs on the catalog that are managed via the Azure Purview portal. This role doesn't make the Catalog administrator an owner or contributor in the Azure portal.

- **Data source administrator**: Allows a user to set up scans and connect Atlas hooks.

- **Curator**: Allows a user to edit content after it's entered into the catalog.

- **Contributor**: Allows a user to have read-only access to the catalog.

- **Automated data source process**: Allows a user to provision service principals or managed identities into the catalog so that they can push information to the catalog. This role is currently primarily used when giving ADF access to push lineage into the catalog.

All roles are global. For example, if a user is assigned to the Contributor role, that user can read all entries in the catalog.

To scan content into the catalog, a security principal must have a Catalog administrator or Data source administrator role assignment in the Azure Purview portal. It must also have an Owner or Contributor role assignment in the Azure portal. For example, if a Catalog administrator user creates a catalog in Azure Purview, it's not authorized to set up a scan until you assign it to an Owner or Contributor role in the Azure portal.

For information about how to control security principal role assignments, see [Add a security principal to a role](add-security-principal.md).

## Security roles reference

The following table shows the catalog actions that each security role allows:

| Catalog activity | Catalog admin role | Data source admin role | Automated data source process role | Curator role | Contributor role |
|--|--|--|--|--|--|
| Read Azure Data Catalog portal role membership | Yes | Yes | No | Yes | Yes |
| Create, update, and delete Azure Data Catalog portal role membership | Yes | No | No | No | No |
| Remove self from Azure Data Catalog portal roles (where directly provisioned) | Yes | Yes | Yes | Yes | Yes |
| Create, update, and delete identities in automated data source process role | Yes | Yes | No | No | No |
| Access Data Catalog portal, search API, and catalog analytics | Yes | Yes | No | Yes | Yes |
| Read entries in the catalog | Yes | Yes | Yes | Yes | Yes |
| Create, update, and delete entries in the catalog | Yes | Yes | Yes | Yes | No |
| Create, update, and delete lineage via the REST API | Yes | Yes | Yes | No | No |
| Read classification definitions | Yes | Yes | Yes | Yes | Yes |
| Create, update, and delete classification definitions | Yes | Yes | Yes | Yes | No |
| Create, read, update, and delete classification instances on an entity | Yes | Yes | Yes | Yes | No |
| Create, read, update, and delete managed scanning configurations | Yes | Yes | No | No | No |
| Create multiple Atlas glossaries | Yes | No | No | No | No |
| Read term and category definitions | Yes | Yes | Yes | Yes | Yes |
| Create, update, and delete term and category definitions | Yes | No | No | Yes | No |
| Associate glossary terms with entities | Yes | Yes | Yes | Yes | No |
| Create, read, update, and delete classification rules | Yes | Yes | No | No | No |
| Use business rules API | Yes | Yes | No | No | No |
| Read Kafka connection strings | Yes | Yes | Yes | No | No |
| Create, read, update, and delete resource set policies | Yes | Yes | No | No | No |
| Read data factory connection list | Yes | Yes | Yes | Yes | Yes |
| Create, update, and delete data factory connection list | Yes | Yes | No | No | No |

## Next steps

[Quickstart: Add a security principal to a role](add-security-principal.md)
