---
title: Azure Data Catalog terminology
description: This article provides an introduction to concepts and terms used in Azure Data Catalog documentation.
ms.service: data-catalog
ms.topic: conceptual
ms.date: 12/15/2022
---
# Azure Data Catalog terminology

[!INCLUDE [Microsoft Purview redirect](includes/catalog-to-purview-migration-flag.md)]

This article provides an introduction to concepts and terms used in Azure Data Catalog documentation.

## Catalog

The Azure Data Catalog is a cloud-based metadata repository in which data sources and data assets can be registered. The **catalog** serves as a central storage location for structural metadata that was extracted from data sources and for descriptive metadata added by users.

## Data source

A **data source** is a system or container that manages data assets. Examples include SQL Server databases, Oracle databases, SQL Server Analysis Services databases (tabular or multidimensional), and SQL Server Reporting Services servers.

## Data asset

**Data assets** are objects contained within data sources that can be registered with the catalog. Examples include SQL Server tables and views, Oracle tables and views, SQL Server Analysis Services measures, dimensions and KPIs, and SQL Server Reporting Services reports.

## Data asset location

The catalog stores the **location** of a data source or data asset, which can be used to connect to the source using a client application. The format and details of the location vary based on the data source type. For example, a SQL Server table can be identified by its four part name – server name, database name, schema name, object name – while a SQL Server Reporting Services Report can be identified by its URL.

## Structural metadata

**Structural metadata** is the metadata extracted from a data source that describes the structure of a data asset. Structural metadata includes the asset's location, its object name and type, and other type-specific characteristics. For example, the structural metadata for tables and views includes the names and data types for the object’s columns.

## Descriptive metadata

**Descriptive metadata** is metadata that describes the purpose or intent of a data asset. Usually, descriptive metadata is added by catalog users using the Azure Data Catalog portal, but it can also be extracted from the data source during registration. For example, the Azure Data Catalog registration tool will extract descriptions from the Description property in SQL Server Analysis Services and SQL Server Reporting Services, and from the [ms_description extended property](/previous-versions/sql/sql-server-2008-r2/ms190243(v=sql.105)) in SQL Server databases, if these properties have been populated with values.

## Request access

A data asset's descriptive metadata can include information on how to **request access** to the data asset or data source. This information is presented with the data asset location, and can include one or more of the following options:

* The email address of the user or team responsible for granting access to the data source.
* The URL of the documented process that users must follow to gain access to the data source.
* The URL of an identity and access management tool (such as Microsoft Identity Manager) that can be used to gain access to the data source.
* A free-text entry that describes how users can gain access to the data source.

## Preview

A **preview** in Azure Data Catalog is a snapshot of up to 20 records that can be extracted from the data source during registration, and stored in the catalog with the data asset metadata. The preview can help users who discover a data asset better understand its function and purpose. In other words, seeing sample data can be more valuable than seeing just the column names and data types.
Previews are only supported for tables and views, and must be explicitly selected by the user during registration.

## Data Profile

A **data profile** in Azure Data Catalog is a snapshot of table-level and column-level metadata about a registered data asset. This information can be extracted from the data source during registration, and stored in the catalog with the data asset metadata. The data profile can help users who discover a data asset better understand its function and purpose. Similar to previews, data profiles must be explicitly selected by the user during registration.

> [!NOTE]
> Extracting a data profile can be a costly operation for large tables and views, and may significantly increase the time required to register a data source.

## User perspective

In Azure Data Catalog, **any user can provide descriptive metadata** for a registered data asset. Every user has a distinct perspective on the data and its use. For example, the administrator responsible for a server may provide the details of its service level agreement (SLA) or backup windows. A data steward may provide links to documentation for the business processes the data supports. An analyst may provide a description in the terms that are most relevant to other analysts, and which can be most valuable to those users who need to discover and understand the data.

Each of these perspectives is inherently valuable, and with Azure Data Catalog each user can provide the information that is meaningful to them, while all users can use that information to understand the data and its purpose.

## Expert

An **expert** is a user who has been identified as having an informed “expert” perspective for a data asset. Any user can add themselves or another user as an expert for an asset. Being listed as an expert doesn't convey any other privileges in Azure Data Catalog; it allows users to easily locate those perspectives that are most likely to be useful when reviewing an asset’s descriptive metadata.

## Owner

An **owner** is a user who has more privileges for managing a data asset in Azure Data Catalog. Users can take ownership of registered data assets, and owners can add other users as co-owners. For more information, see the [article on how to manage data assets](data-catalog-how-to-manage.md).  

> [!NOTE]
> Ownership and management are available only in the Standard Edition of Azure Data Catalog.

## Registration

**Registration** is the act of extracting data asset metadata from a data source and copying it to the Azure Data Catalog service. Data assets that have been registered can then be annotated and discovered.

## Next steps

[Quickstart: Create an Azure Data Catalog](data-catalog-get-started.md)
