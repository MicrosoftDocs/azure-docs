---
title: Azure Data Catalog frequently asked questions
description: Frequently asked questions about Azure Data Catalog, including capabilities for data source discovery, annotation, and management.
author: JasonWHowell
ms.author: jasonh
ms.service: data-catalog
ms.topic: conceptual
ms.date: 07/01/2019
---
# Azure Data Catalog frequently asked questions
This article provides answers to frequently asked questions related to the Azure Data Catalog service.

## What is Azure Data Catalog?
Data Catalog is a fully managed service, hosted in Microsoft Azure, that serves as a system of registration and discovery for enterprise data sources. With Data Catalog, any user, from analysts to data scientists and developers, can register, discover, understand, and consume data sources.

## What customer challenges does it solve?
Data Catalog addresses the challenges of data-source discovery and “dark data” so that users can discover and understand enterprise data sources.

## What are its target audiences?
Data Catalog is designed for technical and non-technical users, including:

* Data developers and BI and analytics professionals: People who are responsible for producing data and analytics content for others to consume.
* Data stewards: People who have the knowledge about the data, what it means, and how it is intended to be used.
* Data consumers: People who need to be able to easily discover, understand, and connect to the data they need to do their job, by using the tool of their choice.
* Central IT: People who need to make hundreds of data sources discoverable by business users, and who need to maintain oversight over how data is being used and by whom.

## What is its availability by region?
Data Catalog services are currently available in the following data centers:

* West US
* East US
* West Europe
* North Europe
* Australia East
* Southeast Asia

## What are its limits on the number of data assets?
The Free Edition of Data Catalog is limited to 5,000 registered data assets.

The Standard Edition of Data Catalog supports up to 100,000 registered data assets.

Any object registered in Data Catalog, such as tables, views, files, and reports, counts as a data asset.

## What are its supported data source and asset types?
For a list of currently supported data sources, see [Data Catalog DSR](data-catalog-dsr.md).

## How do I request support for another data source?
To submit feature requests and other feedback, go to the [Data Catalog on the Azure Feedback Forums](https://feedback.azure.com/forums/906052-data-catalog/category/320788-data-sources).

## How do I get started with Data Catalog?
The best way to get started is by going to [Getting Started with Data Catalog](data-catalog-get-started.md). This article is an end-to-end overview of the capabilities in the service.

## How do I register my data?
To register your data in Data Catalog:
1. In the Azure Data Catalog portal, in the **Publish** area, start the Azure Data Catalog registration tool. 
2. In the Data Catalog data source registration tool, sign in with the same credentials that you use to access the Data Catalog portal.
3. Select the data source and the specific assets that you want to register.

## What properties does it extract for data assets that are registered?
The specific properties differ from data source to data source but, in general, the Data Catalog publishing service extracts the following information:

* Asset Name
* Asset Type
* Asset Description
* Attribute/Column Names
* Attribute/Column Data Types
* Attribute/Column Description

> [!IMPORTANT]
> Registering data assets with Data Catalog does not move or copy your data to the cloud. Registering assets from a data source copies the assets’ metadata to Azure, but the data remains in the existing data-source location. The exception to this rule is if you choose to upload preview records or a data profile when you register the assets. When you include a preview, up to 20 records are copied from each asset and stored as a snapshot in Data Catalog. When you include a data profile, aggregate information is calculated and included in the metadata that's stored in the catalog. Aggregate information can include the size of tables, the percentage of null values per column, or the minimum, maximum, and average values for columns. 
>
>

> [!NOTE]
> For data sources such as SQL Server Analysis Services that have a first-class **Description** property, the Data Catalog data source registration tool extracts that property value. For SQL Server relational databases, which lack a first-class **Description** property, the Data Catalog data source registration tool extracts the value from the **ms_description** extended property for objects and columns. For more information, see [Using Extended Properties on Database Objects](https://technet.microsoft.com/library/ms190243%28v=sql.105%29.aspx).
>
>

## How long should it take for newly registered assets to appear in the catalog?
After you register assets with Data Catalog, there may be a period of 5 to 10 seconds before they appear in the Data Catalog portal.

## How do I annotate and enrich the metadata for my registered data assets?
The simplest way to provide metadata for registered assets is to select the asset in the Data Catalog portal and then enter the values in the properties pane or schema pane for the selected object.

You can also provide some metadata, such as experts and tags, during the registration process. The values you provide in the Data Catalog publishing service apply to all assets being registered at that time. To view the recently registered objects in the portal for additional annotation, select the **View Portal** button on the final screen of the Data Catalog data source registration tool.

## How do I delete my registered data objects?
You can delete an object from Data Catalog by selecting the object in the portal and then clicking the **Delete** button. Removing the object removes its metadata from Data Catalog but does not affect the underlying data source.

## What is an expert?
An expert is a person who has an informed perspective about a data object. An object can have multiple experts. An expert does not need to be the “owner” for an object, but is simply someone who knows how the data can and should be used.

## How do I share information with the Data Catalog team if I encounter problems?
To report problems, share information, and ask questions, go to the [Azure Data Catalog forum](https://go.microsoft.com/fwlink/?LinkID=616424&clcid=0x409).

## Does the catalog work with another data source that I’m interested in?
We’re actively working on adding more data sources to Data Catalog. If you want to see a specific data source supported, suggest it (or voice your support if it has already been suggested) by going to the [Data Catalog on the Azure Feedback Forums](https://feedback.azure.com/forums/906052-data-catalog).

## What permissions do I need to register assets with Data Catalog?
To run the Data Catalog registration tool, you need permissions on the data source that allows you to read the metadata from the source. To also include a preview, you must have permissions that allow you to read in the data from the objects being registered.

Data Catalog also allows catalog administrators to restrict which users and groups can add metadata to the catalog. For additional information, see [How to secure access to data catalog and data assets](data-catalog-how-to-secure-catalog.md).

## Will Data Catalog be made available for on-premises deployment as well?
Data Catalog is a cloud service that can work with both cloud and on-premises data sources to deliver a hybrid data-source discovery solution. There are currently no plans for a version of the Data Catalog service that runs on-premises.

## Can I extract more or richer metadata from the data sources I register?
We’re actively working to expand the capabilities of Data Catalog. If you want to have additional metadata extracted from the data source during registration, suggest it (or vote for it, if it has already been suggested) in the [Data Catalog on the Azure Feedback Forums](https://feedback.azure.com/forums/906052-data-catalog). 

If you would like to include column/schema metadata, previews, or data profiles, for data sources where this metadata is not extracted by the data source registration tool, you can use the Data Catalog API to add this metadata. For additional information, see [Azure Data Catalog REST API](https://docs.microsoft.com/rest/api/datacatalog/).

## How do I restrict the visibility of registered data assets, so that only certain people can discover them?
Select the data assets in the Data Catalog, and then click the **Take Ownership** button. Owners of data assets in Data Catalog can change the visibility settings to either allow all users to discover the owned assets or restrict visibility to specific users. For additional information, see [Manage data assets in Azure Data Catalog](data-catalog-how-to-manage.md).

## How do I update the registration for a data asset so that changes in the data source are reflected in the catalog?
To update the metadata for data assets that are already registered in the catalog, simply re-register the data source that contains the assets. Any changes in the data source, such as columns being added or removed from tables or views, are updated in the catalog, but any annotations provided by users are retained.

## My question isn’t answered here. Where can I go for answers?
Go to the [Azure Data Catalog forum](https://go.microsoft.com/fwlink/?LinkID=616424&clcid=0x409). Questions asked there will find their way here.
