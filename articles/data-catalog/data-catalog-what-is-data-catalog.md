<properties
   pageTitle="What is Azure Data Catalog? | Microsoft Azure"
   description="This article provides an overview of Microsoft Azure Data Catalog, including its features and the problems it is designed to address. Data Catalog provides capabilities that enable any user – from analysts to data scientists to developers – to register, discover, understand, and consume data sources."
   services="data-catalog"
   documentationCenter=""
   authors="steelanddata"
   manager="NA"
   editor=""
   tags=""/>
<tags
   ms.service="data-catalog"
   ms.devlang="NA"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-catalog"
   ms.date="05/26/2016"
   ms.author="maroche"/>

# What is Azure Data Catalog?

Azure Data Catalog is a fully managed cloud service that enables users to discover the data sources they need, and to understand the data sources they find, while helping organizations get more value from their existing investments. Data Catalog provides capabilities that enable any user – from analysts to data scientists to developers – to discover, understand, and consume data sources. Data Catalog includes a crowdsourcing model of metadata and annotations, and allows all users to contribute their knowledge to build a community and culture of data.

## Discovery challenges for data consumers

Traditionally, discovering enterprise data sources has been an organic process based on tribal knowledge. This presents numerous challenges for companies wanting to get the most value from their information assets.

-	Users are not aware that data sources exist unless they come into contact with it as part of another process; there is no central location where data sources are registered.
-	Unless a user knows the location of a data source, he cannot connect to the data using a client application; data consumption experiences require users to know the connection string or path.
-	Unless a user knows the location of a data source's documentation, he cannot understand the intended uses of the data; data sources and documentation live in different places and are consumed through different experiences.
-	If a user has questions about an information asset, he must locate the expert or team responsible for the data and engage those experts offline; there is no explicit connection between data and those with expert perspectives on its use.
-  Unless a user understands the process for requesting access to the data source, discovering the data source and its documentation still does not enable him to access the data he requires.

## Discovery challenges for data producers

While data consumers face these challenges, users responsible for producing and maintaining information assets face challenges of their own.

-	Annotating data sources with descriptive metadata is often a lost effort; client applications typically ignore descriptions stored in the data source.
-	Creating documentation for data sources is often a lost effort; keeping documentation in sync with the data source is an ongoing responsibility, and users lack trust in documentation as it is often perceived as being out of date.
- Restricting access to the data source, and ensuring that data consumers know how to request access is an ongoing challenge.

Creating and maintaining documentation for a data source is complex and time-consuming. The challenge of making that documentation readily available to everyone who uses the data source is often even more so.

When combined, these challenges present a significant barrier for companies who want to encourage and promote the use and understanding of enterprise data.

## Azure Data Catalog can help

Data Catalog is designed to address these problems and to enable enterprises to get the most value from their existing information assets. Data Catalog helps by making data sources easily discoverable, and understandable by the users who need the data they manage.

Data Catalog provides a cloud-based service into which data source can be registered. The data remains in in its existing location, but a copy of the metadata is added to Data Catalog, along with a reference to the data source location. This metadata is also indexed to make each data source easily discoverable via search, and understandable to users who discover it.

Once a data source has been registered, its metadata can then be enriched, either by the user who performed the registration, or by other users in the enterprise. Any user can annotate a data source by providing descriptions, tags, or other metadata, such as documentation and processes for requesting data source access. This descriptive metadata supplements the structural metadata (such as column names and data types) registered from the data source.

Discovering and understanding data sources and their use is the primary purpose of registering the sources. When enterprise users need data for their efforts (which could be business intelligence, application development, data science, or any other task where the right data is required) they can use the Data Catalog discovery experience to quickly find data that matches their needs, understand the data to evaluate its fitness for purpose, and consume that data by opening the data source in their tool of choice. At the same time, Data Catalog allows users to contribute to the catalog, by tagging, documenting, and annotating data sources that have already been registered, and by registering new data sources which can then be discovered, understood, and consumed by the community of catalog users.

![Data Catalog Capabilities](./media/data-catalog-what-is-data-catalog/data-catalog-capabilities.png)

## Get started with Data Catalog

To get started with Data Catalog today, visit [www.azuredatacatalog.com](https://www.azuredatacatalog.com).

A getting started guide is available [here](data-catalog-get-started.md).

## Learn more about Data Catalog

To learn more about the capabilities of Data Catalog, see:

* [How to register data sources](data-catalog-how-to-register.md)
* [How to discover data sources](data-catalog-how-to-discover.md)
* [How to annotate data sources](data-catalog-how-to-annotate.md)
* [How to document data sources](data-catalog-how-to-documentation.md)
* [How to connect to data sources](data-catalog-how-to-connect.md)
* [How to work with big data](data-catalog-how-to-big-data.md)
* [How to manage data assets](data-catalog-how-to-manage.md)
* [How to set up the Business Glossary](data-catalog-how-to-business-glossary.md)
* [Frequently Asked Questions](data-catalog-frequently-asked-questions.md)
