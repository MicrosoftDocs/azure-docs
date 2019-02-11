---
title: Register data sources in Azure Data Catalog
description: This article highlights how to register data sources in Azure Data Catalog, including the metadata fields extracted during registration.
services: data-catalog
author: markingmyname
ms.author: maghan
ms.assetid: bab89906-186f-4d35-9ffd-61b1d903905d
ms.service: data-catalog
ms.topic: conceptual
ms.date: 01/18/2018
---
# Register data sources in Azure Data Catalog
## Introduction
Azure Data Catalog is a fully managed cloud service that serves as a system of registration and discovery for enterprise data sources. In other words, Data Catalog helps people discover, understand, and use data sources, and it helps organizations get more value from their existing data. The first step to making a data source discoverable via Data Catalog is to register that data source.

## Register data sources
Registration is the process of extracting metadata from the data source and copying that data to the Data Catalog service. The data remains where it currently resides, and it remains under the control of the administrators and policies of the current system.

To register a data source, do the following:
1. In the Azure Data Catalog portal, start the Data Catalog data source registration tool. 
2. Sign in with your work or school account with the same Azure Active Directory credentials that you use to sign in to the portal.
3. Select the data source you want to register.

For more step-by-step details, see the [Get Started with Azure Data Catalog](data-catalog-get-started.md) tutorial.

After you've registered the data source, the catalog tracks its location and indexes its metadata. Users can search, browse, and discover the data source, and then use its location to connect to it by using the application or tool of their choice.

## Supported data sources
For a list of currently supported data sources, see [Data Catalog DSR](data-catalog-dsr.md).

## Structural metadata
When you register a data source, the registration tool extracts information about the structure of the objects you select. This information is referred to as structural metadata.

For all objects, this structural metadata includes the object’s location, so that users who discover the data can use that information to connect to the object in the client tools of their choice. Other structural metadata includes object name and type, and attribute/column name and data type.

## Descriptive metadata
In addition to the core structural metadata that's extracted from the data source, the data source registration tool extracts descriptive metadata. For SQL Server Analysis Services and SQL Server Reporting Services, this metadata is taken from the Description properties exposed by these services. For SQL Server, values provided using the ms\_description extended property is extracted. For Oracle Database, the data-source registration tool extracts the COMMENTS column from the ALL\_TAB\_COMMENTS view.

In addition to the descriptive metadata that's extracted from the data source, users can enter descriptive metadata by using the data source registration tool. Users can add tags, and they can identify experts for the objects being registered. All this descriptive metadata is copied to the Data Catalog service along with the structural metadata.

## Include previews
By default, only metadata is extracted from data sources and copied to the Data Catalog service, but understanding a data source is often made easier when you can view a sample of the data it contains.

By using the Data Catalog data-source registration tool, you can include a snapshot preview of the data in each table and view that is registered. If you choose to include previews during registration, the registration tool includes up to 20 records from each table and view. This snapshot is then copied to the catalog along with the structural and descriptive metadata.

> [!NOTE]
> Wide tables with a large number of columns might have fewer than 20 records included in their preview.
>
>

## Include data profiles
Just as including previews can provide valuable context for users who search for data sources in Data Catalog, including a data profile can make it easier to understand discovered data sources.

By using the Data Catalog data-source registration tool, you can include a data profile for each table and view that is registered. If you choose to include a data profile during registration, the registration tool includes aggregate statistics about the data in each table and view, including:

* The number of rows and size of the data in the object.
* The date for the most recent update of the data and the object schema.
* The number of null records and distinct values for columns.
* The minimum, maximum, average, and standard deviation values for columns.

These statistics are then copied to the catalog along with the structural and descriptive metadata.

> [!NOTE]
> Text and date columns do not include average or standard deviation statistics in their data profile.
>
>

## Update registrations
Registering a data source makes it discoverable in Data Catalog when you use the metadata and optional preview extracted during registration. If the data source needs to be updated in the catalog (for example, if the schema of an object has changed, tables originally excluded should be included, or you want to update the data that's included in the previews), the data source registration tool can be re-run.

Re-registering an already-registered data source performs a merge “upsert” operation: existing objects are updated, and new objects are created. Any metadata provided by users through the Data Catalog portal are retained.

## Summary
Because it copies structural and descriptive metadata from a data source to the catalog service, registering the data source in Data Catalog makes the data easier to discover and understand. After you have registered the data source, you can annotate, manage, and discover it by using the Data Catalog portal.

## Next steps
For more information about registering data sources, see the [Get Started with Azure Data Catalog](data-catalog-get-started.md) tutorial.
