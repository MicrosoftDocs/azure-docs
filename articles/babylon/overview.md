---
title: Introduction to Azure Babylon
description: This article provides an overview of Azure Babylon, including its features and the problems it addresses. Azure Babylon enables any user to register, discover, understand, and consume data sources.
author: hophan
ms.author: hophan
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: overview
ms.date: 06/18/2020
---

# What is Azure Babylon?

Azure Babylon is a new cloud service for use by data users centrally manage data governance across their data estate spanning cloud and on-prem environments. This service enables business analysts to search for relevant data using business terms that are meaningful to them. Additionally, technical users can view meta-data and lineage of data assets in a central catalog using a UI or Apache Atlas API. Data assets can be annotated by experts and owners sharing tribal knowledge through the UI, or at scale through automated classification based on meta-data and content inspection.
 
The Project Babylon Preview Program provides customers early access to preview releases in their Azure Subscriptions for evaluation. You will be getting product support and will be able to provide feedback directly to the product team.

## Transition from ADC Gen 2 to Babylon

The service ADC Gen 2 is being rolled into a broader Data Governance offering code named Babylon.
 
Based on the feedback from our customers in the ADC Gen 2 Private Preview, we're making

* Enhancements to the catalog UX to enable
  * Business & technical users to find relevant data more easily, and
  * Data stewards to manage the governance of data assets more effectively
* Enhancements to the data map platform powering the catalog UX to
  * Power other data governance scenarios for data officers and consumers
  * Make the catalog even more ambient with more seamless integration with data sources on Azure like Synapse
  * Increase the coverage of data sources that can be scanned and richness of classifications
 
We released the first version of Babylon under a Private Preview in early April in East US region to a handful of customers who have successfully provisioned Babylon and used the cataloging capability. Babylon April release is at functional parity with last release of ADC Gen 2. 

## Discovery challenges for data consumers

Traditionally, discovering enterprise data sources has been an organic process based on tribal knowledge. For companies that want to get the most value from their information assets, this approach presents numerous challenges:

* Users might not know that a data source exists unless they come into contact with it as part of another process. There is no central location where data sources are registered.
* Unless users know the location of a data source, they cannot connect to the data by using a client application. Data-consumption experiences require users to know the connection string or path.
* Unless users know the location of a data source's documentation, they cannot understand the intended uses of the data. Data sources and documentation might live in a variety of places and be consumed through a variety of experiences.
* If users have questions about an information asset, they must locate the expert or team that's responsible for the data and engage them offline. There is no explicit connection between data and the experts that have perspectives on its use.
* Unless users understand the process for requesting access to the data source, discovering the data source and its documentation still does not help them access the data.

## Discovery challenges for data producers

Although data consumers face the previously mentioned challenges, users who are responsible for producing and maintaining information assets face challenges of their own:

* Annotating data sources with descriptive metadata is often a lost effort. Client applications typically ignore descriptions that are stored in the data source.
* Creating documentation for data sources is often a lost effort. Keeping documentation in sync with data sources is an ongoing responsibility. Users may lack trust in documentation that's perceived as being out of date.
* Creating and maintaining documentation for data sources is complex and time-consuming. Making that documentation readily available to everyone who uses the data source can be even more so.
* Restricting access to data sources and ensuring that data consumers know how to request access is an ongoing challenge.

When such challenges are combined, they present a significant barrier for companies who want to encourage and promote the use and understanding of enterprise data.

## Project Babylon can help

Project Babylon is designed to address these problems and to help enterprises get the most value from their existing information assets. The catalog makes data sources easily discoverable and understandable by the users who manage the data.

Project Babylon provides a cloud-based service into which a data source can be registered. The data remains in its existing location, but a copy of its metadata is added to Project Babylon, along with a reference to the data-source location. The metadata is also indexed to make each data source easily discoverable via search and understandable to the users who discover it.

After a data source has been registered, its metadata can then be enriched. The metadata can be added either by the user who registered it or by other users in the enterprise. Any user can annotate a data source by providing descriptions, tags, or other metadata, such as documentation and processes for requesting data source access. This descriptive metadata supplements the structural metadata (such as column names and data types) that's registered from the data source.

Discovering and understanding data sources and their use is the primary purpose of registering the sources. Enterprise users might need data for business intelligence, application development, data science, or any other task where the right data is required. They can use the Data Catalog discovery experience to quickly find data that matches their needs, understand the data to evaluate its fitness for the purpose, and consume the data by opening the data source in their tool of choice. 

At the same time, users can contribute to the catalog by tagging, documenting, and annotating data sources that have already been registered. They can also register new data sources, which can then be discovered, understood, and consumed by the community of catalog users.

## Next steps

To get started with Project Babylon:
[Create a Babylon account](overview.md)