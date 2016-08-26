<properties
   pageTitle="How to register data sources | Microsoft Azure"
   description="How-to article highlighting how to register data sources with Azure Data Catalog, including the metadata fields extracted during registration."
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


# How to register data sources

## Introduction
**Microsoft Azure Data Catalog** is a fully managed cloud service that serves as a system of registration and system of discovery for enterprise data sources. In other words, **Azure Data Catalog** is all about helping people discover, understand, and use data sources, and helping organizations to get more value from their existing data. And the first step to making a data source discoverable via **Azure Data Catalog** is to register that data source.
## Registering data sources
Registration is the process of extracting metadata from the data source and copying that data into the **Azure Data Catalog** service. The data remains where it currently resides, and remains under the control of the administrators and policies of the current system.

To register a data source, simply launch the **Azure Data Catalog** data source registration tool from the **Azure Data Catalog** portal. Log in with your Work or school account (the same Azure Active Directory credentials you use to log in to the portal) and then select the data source you want to register.
See the [Get Started with Azure Data Catalog](data-catalog-get-started.md) tutorial for more step-by-step details.

Once the data source has been registered, the Catalog tracks its location and indexes its metadata, so that users can search, browse, and discover the data source, and then use its location to connect to it using the application or tool of their choice.

## Sources supported
Please refer to [Data Catalog DSR](data-catalog-dsr.md) for the list of currently supported data sources.
<br/>


## Structural metadata
When you’re registering a data source, the registration tool will extract information about the structure of the objects you select – this is referred to as structural metadata.

For all objects, this structural metadata will include the object’s location, so that users who discover the data can use that information to connect to the object in the client tools of their choice. Other structural metadata includes object name and type, and attribute/column name and data type.

## Descriptive metadata
In addition to the core structural metadata extracted from the data source, the data source registration tool will also extract descriptive metadata as well. For SQL Server Analysis Services and SQL Server Reporting Services, this is taken from the Description properties exposed by these services. For SQL Server, values provided using the ms_description extended property will be extracted. For Oracle Database, the data source registration tool will extract the COMMENTS column from the ALL_TAB_COMMENTS view.

In addition to the descriptive metadata extracted from the data source, users can also enter descriptive metadata using the data source registration tool. Users can add tags, and can identify experts for the objects being registered. All of this descriptive metadata is copied to the **Azure Data Catalog** service along with the structural metadata.

## Including previews

By default, only metadata is extracted from data sources and copied to the **Azure Data Catalog** service, but understanding a data source is often made easier by seeing a sample of the data it contains.

The **Azure Data Catalog** data source registration tool allows users to include a snapshot preview of the data in each table and view that is registered. If the user opts-in to include previews during registration, the registration tool will include up to 20 records from each table and view. This snapshot is then copied into the Catalog along with the structural and descriptive metadata.


> [AZURE.NOTE]  Wide tables with a large number of columns may have fewer than 20 records included in their preview.


## Including data profiles

Just as including previews can provide valuable context for users searching for data sources in **Azure Data Catalog**, including a data profile can also make it easier to understand discovered data sources.

The **Azure Data Catalog** data source registration tool allows users to include a data profile for each table and view that is registered. If the user chooses to include a data profile during registration, the registration tool will include aggregate statistics about the data in each table and view, including:

* The number of rows and size of the data in the object
* The date for the most recent update of the data and the object schema
* The number of null records and distinct values for columns
* The minimum, maximum, average, and standard deviation values for columns

These statistics are then copied into the Catalog along with the structural and descriptive metadata.

> [AZURE.NOTE]  Text and date columns will not include average or standard deviation statistics in their data profile.

## Updating registrations

Registering a data source will make it discoverable in the **Azure Data Catalog** using the metadata and optional preview extracted during registration. If the data source needs to be updated in the Catalog (for example, if the schema of an object has changed, or tables originally excluded should be included, or a user wants to update the data included in the previews) the data source registration tool can be re-run.

Re-registering an already-registered data source performs a merge “upsert” operation: existing objects will be updated, while new objects will be created. Any metadata provided by users through the **Azure Data Catalog** portal will be maintained.

## Summary
Registering a data source with **Azure Data Catalog** makes that data source easier to discover and understand, by copying structural and descriptive metadata from the data source into the Catalog service. Once a data source has been registered, it can then be annotated, managed, and discovered using the **Azure Data Catalog** portal.

## See also
- [Get Started with Azure Data Catalog](data-catalog-get-started.md) tutorial for step-by-step details about how to register data sources.
