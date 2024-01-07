---
title: Manage data assets in Azure Data Catalog
description: The article highlights how to control visibility and ownership of data assets registered in Azure Data Catalog.
ms.service: data-catalog
ms.topic: how-to
ms.date: 12/14/2022
---
# Manage data assets in Azure Data Catalog

[!INCLUDE [Microsoft Purview redirect](includes/catalog-to-purview-migration-flag.md)]

## Introduction

Azure Data Catalog is designed for data-source discovery, so that you can find and understand the data sources you need to perform analysis and make decisions. These discovery capabilities make the biggest impact when you and other users can find and understand the broadest range of available data sources. With this information in mind, the default behavior of Azure Data Catalog is for all registered data sources to be visible to and discoverable by all catalog users.

Azure Data Catalog doesn't give you access to the data itself. Data access is controlled by the owner of the data source. With Azure Data Catalog, you can find data sources and view descriptive information about the sources that are registered in the catalog.

There might be situations, where data sources should only be visible to specific users, or to members of specific groups. In such scenarios, users can take ownership of registered data assets within the catalog and then control the visibility of the assets they own.

> [!NOTE]
> The functionality described above is available only in the Standard Edition of Azure Data Catalog. The Free Edition does not provide capabilities for ownership and restricting data-asset visibility.

## Manage ownership of data assets

By default, data assets that are registered in Azure Data Catalog are unowned. Any user with permission to access the catalog can discover and annotate these assets. Users can take ownership of unowned data assets and then limit the visibility of the assets they own.

When a data asset in Azure Data Catalog is owned, only users who are authorized by the owners can discover the asset and view its metadata, and only the owners can delete the asset from the catalog.

> [!NOTE]
> Ownership in Azure Data Catalog affects only the metadata that's stored in the catalog. Ownership does not confer any permissions on the underlying data source.

### Take ownership

Users can take ownership of data assets by selecting the **Take Ownership** option in the Data Catalog portal. No special permissions are required to take ownership of an unowned data asset. Any user can take ownership of an unowned data asset.

### Add owners and co-owners

If a data asset is already owned, other users can’t take ownership. They must be added as co-owners by an existing owner. Any owner can add other users or security groups as co-owners.

> [!NOTE]
> It is a best practice to have at least two individuals as owners for any owned data asset.

### Remove owners

Just as any asset owner can add co-owners, any asset owner can remove any co-owner.

An asset owner who removes themselves as an owner can no longer manage the asset. If the asset owner removes themselves as an owner and there are no other co-owners, the asset reverts to an unowned state.

## Control visibility

Data-asset owners can control the visibility of the data assets they own. To restrict visibility as the default, where all Data Catalog users can discover and view the data asset, the asset owner can toggle the visibility setting from **Everyone** to **Owners & These Users** in the properties for the asset. Owners can then add specific users and security groups.

> [!NOTE]
> Whenever possible, asset ownership and visibility permissions should be assigned to security groups and not to individual users.

## Catalog administrators

Data Catalog administrators are implicitly co-owners of all assets in the catalog. Asset owners can’t remove visibility from administrators, and administrators can manage ownership and visibility for all data assets in the catalog.

## Summary

The Data Catalog crowdsourcing model to metadata and data asset discovery allows all catalog users to contribute and discover information. The Standard Edition of Data Catalog is designed for ownership and management to limit the visibility and use of specific data assets.
