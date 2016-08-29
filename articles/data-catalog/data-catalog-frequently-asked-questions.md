<properties
   pageTitle="Azure Data Catalog frequently asked questions | Microsoft Azure"
   description="Frequently asked questions about Azure Data Catalog, including capabilities for data source discovery, annotation, and management."
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

# Azure Data Catalog frequently asked questions

This article provides answers for frequently asked questions related to the Microsoft **Azure Data Catalog** service.

## Q: What is Azure Data Catalog?

A: Microsoft Azure Data Catalog is a fully managed service hosted in the Microsoft Azure cloud that serves as a system of registration and system of discovery for enterprise data sources. Azure Data Catalog provides capabilities that enable any user – from analysts to data scientists to developers – to register, discover, understand, and consume data sources.

## Q: What customer challenges does Azure Data Catalog solve?

Azure Data Catalog addresses the challenge of data source discovery and “dark data” by allowing users to discover and understand enterprise data sources.

## Q: Who are the target audiences for Azure Data Catalog?

Azure Data Catalog provides capabilities for technical and non-technical users, including:

- Data Developers, BI and Analytics Professionals: Who are responsible for producing data and analytics content for others to consume
-	Data Stewards: Those who have the knowledge about the data, what it means and how it is intended to be used and for which purpose
- Data Consumers: Those who need to be able to easily discover, understand and connect to data needed to do their job using the tool of their choice
- Central IT: Those who need to make hundreds of data sources discoverable for the business users, and who need to maintain oversight over how data is being used and by whom

## Q: What is the Azure Data Catalog region availability?

Azure Data Catalog services are currently available in the following data centers:

- West US
- East US
- West Europe
- North Europe
- Australia East
- Southeast Asia

## Q: What are the limits on the number of data assets in Azure Data Catalog?

The Free Edition of Azure Data Catalog is limited to 5,000 registered data assets.

The Standard Edition of Azure Data Catalog supports up to 100,000 registered data assets.

## Q: What are the supported data source and asset types?

Please refer to [Data Catalog DSR](data-catalog-dsr.md) for the list of currently supported data sources.

## Q: How do I request support for another data source?

Feature requests and other feedback can be submitted in the [Azure Data Catalog forum](http://go.microsoft.com/fwlink/?LinkID=616424&clcid=0x409).

## Q: How do I get started with Azure Data Catalog?

The best place to get started is by following the instructions in [Getting Started with Data Catalog](data-catalog-get-started.md). This article is an end-to-end overview of the capabilities in the service.

## Q: How do I register my data?

To register your data in Azure Data Catalog, launch the Azure Data Catalog registration tool from the “Publish” area of the Azure Data Catalog portal. In the Azure Data Catalog publishing application, log in using the same credentials you use to access the Azure Data Catalog portal, and then select the data source and the specific assets you wish to register.

## Q: What properties are extracted for data assets that are registered?

The specific properties will differ from data source to data source, but in general the Azure Data Catalog publishing service will extract the following information:

- Asset Name
- Asset Type
- Asset Description
- Attribute/Column Names
- Attribute/Column Data Types
- Attribute/Column Description

> [AZURE.IMPORTANT] Registering data assets with Azure Data Catalog does not move or copy your data to the cloud. Registering assets from a data source will copy the assets’ metadata to Azure, but the data remains in the existing data source location. The only exception to this rule is if a user chooses to upload preview records or a data profile when registering assets. When including a preview, up to 20 records will be copied from each asset, and are stored as a snapshot in Azure Data Catalog. When including a data profile, aggregate information (such as the size of tables, the percentage null values per column, and the minimum, maximum and average values for columns) will be calculated and included in the metadata stored in the catalog.

<br/>

> [AZURE.NOTE] For data sources such as SQL Server Analysis Services that have a first-class **Description** property, the Azure Data Catalog publishing application will extract that property value. For SQL Server relational databases, which lack a first-class **Description** property, the Azure Data Catalog publishing application will extract the value from the ms_description extended property for objects and columns. For more information, see TechNet [Using Extended Properties on Database Objects](https://technet.microsoft.com/library/ms190243%28v=sql.105%29.aspx).

## Q: How long should it take for newly registered assets to appear in Azure Data Catalog?

After you register assets with Azure Data Catalog there may be a period of 5-10 seconds before they appear in the Azure Data Catalog portal.

## Q: How do I annotate and enrich the metadata for my registered data assets?

The simplest way to provide metadata for registered assets is to select the asset in the Azure Data Catalog portal and then enter the metadata values in the properties pane or schema pane for the selected object.

You can also provide some metadata, such as experts and tags, during the registration process. The values provided in the Azure Data Catalog publishing service will apply to all assets being registered at that time. To view the recently-registered objects in the portal for additional annotation, select the **View Portal** button on the final screen of the Azure Data Catalog publishing application.

## Q: How do I delete my registered data objects?

You can delete an object from Azure Data Catalog by selecting the object in the portal, and then clicking the **Delete** button. This will remove the metadata for the object from Azure Data Catalog but will not affect the actual underlying data source.

## Q: What is an expert?

An expert is a person who has an informed perspective about a data object. An object can have multiple experts. An expert does not need to be the “owner” for an object; the expert is simply someone who knows how the data can and should be used.

## Q: How do I share information with the Azure Data Catalog team if I encounter problems?

Please use the Azure Data Catalog forum to report problems, share information, and ask questions. The forum can be found at http://go.microsoft.com/fwlink/?LinkID=616424&clcid=0x409

##Q: Does Azure Data Catalog work with this other data source I’m interested in?
We’re actively working on adding more data sources to Azure Data Catalog. If there is a data source that you would like to see supported, please suggest it (or voice your support if it has already been suggested) in the [Azure Data Catalog forum](http://go.microsoft.com/fwlink/?LinkID=616424&clcid=0x409).

## Q: How is Azure Data Catalog related to the Data Catalog in Power BI for Office 365?

You can think of Azure Data Catalog as an evolution of the Data Catalog. Azure Data Catalog delivers similar capabilities for data source publishing and discovery, but is focused on broader scenarios and not dependent on Office 365. Shortly after the Azure Data Catalog becomes generally available the two catalogs will merge into a single service.

## Q: What permissions does a user need to register assets with Azure Data Catalog?

The user running the Azure Data Catalog registration tool needs permissions on the data source that will allow him to read the metadata from the source. If the user also selects to include a preview, then the user must also have permissions that allow him to read in the data from the objects being registered.

## Q: Will Azure Data Catalog be made available for on-premises deployment as well?

Azure Data Catalog is a cloud service that can work with both cloud and on-premises data sources, delivering a hybrid data source discovery solution. There are currently no plans for a version of the Azure Data Catalog service that will run on-premises.

##Q: Can we extract more / richer metadata from the data sources we register?

We’re actively working to expand the capabilities of Azure Data Catalog. If there is additional metadata that you would like to see extracted from the data source during registration, please suggest it (or vote for it if it has already been suggested) in the [Azure Data Catalog forum](http://go.microsoft.com/fwlink/?LinkID=616424&clcid=0x409). In the future we will allow third parties to add new data source types through an extensibility API.

## Q: How do I restrict the visibility of registered data assets, so that only certain people can discover them?

A: Select the data assets in the Azure Data Catalog, and click the “Take Ownership” button. Owners of data assets in Azure Data Catalog can change the visibility settings, to either allow all Catalog users to discover the owned assets, or to restrict the visibility to specific users.

## Q: How do I update the registration for a data asset to that changes in the data source are reflected in the Catalog?

A: To update the metadata for data assets that are already registered in the Catalog, simply re-register the data source that contains the assets. Any changes in the data source, such as columns being added or removed from tables or views, will be updated in the Catalog, but any annotations provided by users will be maintained.

## Q: My question isn’t answered here – what should I do?

Head on over to the [Azure Data Catalog forum](http://go.microsoft.com/fwlink/?LinkID=616424&clcid=0x409). Questions asked there will find their way here.
