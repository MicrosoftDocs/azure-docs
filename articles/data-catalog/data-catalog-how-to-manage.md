<properties
   pageTitle="How to Manage Data Assets | Microsoft Azure"
   description="How-to article highlighting how to control visibility and ownership of data assets registered in Azure Data Catalog."
   services="data-catalog"
   documentationCenter=""
   authors="steelanddata"
   manager="NA"
   editor=""
   tags=""/>
<tags
   ms.service="data-catalog"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-catalog"
   ms.date="07/12/2016"
   ms.author="maroche"/>


# How to manage data assets

## Introduction

**Azure Data Catalog** provides capabilities for data source discovery, enabling users to easily discover and understand the data sources they need to perform analysis and make decisions. These discovery capabilities make the biggest impact when all users can find and understand the broadest range of available data sources. With this in mind, the default behavior of Data Catalog is for all registered data sources to be visible to – and discoverable by – all catalog users.

Data Catalog does not give users access to the data itself. Data access is controlled by the owner of the data source. Data Catalog allows users to discover data sources and to view the metadata related to the sources registered in the catalog.

There may be situations, however, where data sources should only be visible to specific users, or to members of specific groups. For these scenarios, Data Catalog allows users to take ownership of registered data assets within the catalog, and to then control the visibility of the assets they own.

> [AZURE.NOTE] The functionality described in this article are available only in the Standard Edition of Azure Data Catalog. The Free Edition does not provide capabilities for ownership and restricting data asset visibility.

## Managing ownership of data assets
By default, data assets registered in Data Catalog are unowned; any user with permission to access the catalog can discover and annotate these assets. Users can take ownership of unowned data assets, and can then limit the visibility of the assets they own.

When a data asset in Data Catalog is owned, only users authorized by the owners can discover the asset and view its metadata, and only the owners can delete the asset from the Catalog.

> [AZURE.NOTE] Ownership in Data Catalog only affects the metadata stored in the Catalog. It does not confer any permissions on the underlying data source.

### Taking ownership
Users can take ownership of data assets by selecting the “Take Ownership” option in the Data Catalog portal. No special permissions are required to take ownership of an unowned data asset; any user can take ownership of an unowned data asset.

### Adding owners and co-owners
If a data asset is already owned, users cannot simply take ownership – they must be added as co-owners by an existing owner. Any owner can add additional users or security groups as co-owners.

> [AZURE.NOTE] It is a best practice to have at least two individuals as owners for any owned data asset.

### Removing owners
Just as any asset owner can add co-owners, any asset owner can remove any co-owner.

If an asset owner removes himself as an owner, he can no longer manage the asset. If an asset owner removes himself as an owner and there are no other co-owners, the asset will revert to an unowned state.

## Visibility
Data asset owners can control the visibility of the data assets they own. To restrict visibility from the default – where all Data Catalog users can discover and view the data asset – the asset owner can toggle the visibility setting from “Everyone” to “Owners & These Users” in the properties for the asset. Owners can then add specific users and security groups.

> [AZURE.NOTE] Whenever possible, asset ownership and visibility permissions should be assigned to security groups and not to individual users.

## Catalog administrators
Data Catalog administrators are implicitly co-owners of all assets in the Catalog. Asset owners cannot remove visibility from Catalog administrators, and administrators can manage ownership and visibility for all data assets in the Catalog.

## Summary
Data Catalog’s crowdsourcing model to metadata and data asset discovery allows all Catalog users to contribute and discover. The Standard Edition of Data Catalog provides capabilities for ownership and management to limit the visibility and use of specific data assets.
