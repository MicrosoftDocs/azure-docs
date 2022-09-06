---
title: What's new? 
description: Learn about the new features and documentation improvements for Azure Synapse Analytics
author: ryanmajidi
ms.author: rymajidi 
ms.service: synapse-analytics
ms.subservice: overview
ms.topic: conceptual
ms.date: 04/15/2022
---

# What's new in Azure Synapse Analytics?

This article lists updates to Azure Synapse Analytics that are published in April 2022. Each update links to the Azure Synapse Analytics blog and an article that provides more information. For previous months releases, check out [Azure Synapse Analytics - updates archive](whats-new-archive.md).

## General

* **Azure Orbital analytics with Synapse Analytics** - We now offer an [Azure Orbital analytics sample solution](https://github.com/Azure/Azure-Orbital-Analytics-Samples) showing an end-to-end implementation of extracting, loading, transforming, and analyzing spaceborne data by using geospatial libraries and AI models with [Azure Synapse Analytics](overview-what-is.md). The sample solution also demonstrates how to integrate geospatial-specific [Azure Cognitive Services](../cognitive-services/index.yml) models, AI models from partners, and bring-your-own-data models.  

* **Azure Synapse success by design** - Project success is no accident and requires careful planning and execution. The Synapse Analytics' Success by Design playbooks are now available. The [Azure Synapse proof of concept playbook](./guidance/proof-of-concept-playbook-overview.md) provides a guide to scope, design, execute, and evaluate a proof of concept for SQL or Spark workloads. These guides contain best practices from the most challenging and complex solution implementations incorporating Azure Synapse. To learn more about the Azure Synapse proof of concept playbook, read [Success by Design](./guidance/success-by-design-introduction.md).
## SQL

**Result set size limit increase** - We know that you turn to Azure Synapse Analytics to work with large amounts of data. With that in mind, the maximum size of query result sets in Serverless SQL pools has been increased from 200GB to 400GB. This limit is shared between concurrent queries. To learn more about this size limit increase and other constraints, read [Self-help for serverless SQL pool](./sql/resources-self-help-sql-on-demand.md?tabs=x80070002#constraints). 

## Synapse data explorer

* **Web Explorer new homepage** - The new Synapse Web Explorer homepage makes it even easier to get started with Synapse Web Explorer. The [Web Explorer homepage](https://dataexplorer.azure.com/home) now includes the following sections:  

  * Get started – Sample gallery offering example queries and dashboards for popular Synapse Data Explorer use cases.  
  * Recommended – Popular learning modules designed to help you master Synapse Web Explorer and KQL. 
  * Documentation – Synapse Web Explorer basic and advanced documentation.  

* **Web Explorer sample gallery** - A great way to learn about a product is to see how it is being used by others. The Web Explorer sample gallery provides end-to-end samples of how customers leverage Synapse Data Explorer popular use cases such as Logs Data, Metrics Data, IoT data and Basic big data examples. Each sample includes the dataset, well-documented queries, and a sample dashboard. To learn more about the sample gallery, read [Azure Data Explorer in 60 minutes with the new samples gallery](https://techcommunity.microsoft.com/t5/azure-data-explorer-blog/azure-data-explorer-in-60-minutes-with-the-new-samples-gallery/ba-p/3447552).  

* **Web Explorer dashboards drill through capabilities** - You can now add drill through capabilities to your Synapse Web Explorer dashboards. The new drill through capabilities allow you to easily jump back and forth between dashboard pages. This is made possible by using a contextual filter to connect your dashboards. Defining these contextual drill throughs is done by editing the visual interactions of the selected tile in your dashboard. To learn more about drill through capabilities, read [Use drillthroughs as dashboard parameters](/azure/data-explorer/dashboard-parameters#use-drillthroughs-as-dashboard-parameters). 

* **Time Zone settings for Web Explorer** - Being able to display data in different time zones is very powerful. You can now decide to view the data in UTC time, your local time zone, or the time zone of the monitored device/machine. The Time Zone settings of the Web Explorer now apply to both the Query results and to the Dashboard. By changing the time zone, the dashboards will be automatically refreshed to present the data with the selected time zone.  For more information on time zone settings, read [Change datetime to specific time zone](/azure/data-explorer/web-query-data#change-datetime-to-specific-time-zone). 

## Data integration

* **Fuzzy Join option in Join Transformation** - Fuzzy matching with a sliding similarity score option has been added to the Join transformation in Mapping Data Flows. You can create inner and outer joins on data values that are similar rather than exact matches! Previously, you would have had to use an exact match. The sliding scale value goes from 60% to 100%, making it easy to adjust the similarity threshold of the match. For learn more about fuzzy joins, read [Join transformation in mapping data flow](../data-factory/data-flow-join.md).

* **Map Data [Generally Available]** - We’re excited to announce that the Map Data tool is now Generally Available. The Map Data tool is a guided process to help you create ETL mappings and mapping data flows from your source data to Synapse without writing code. To learn more about Map Data, read [Map Data in Azure Synapse Analytics](./database-designer/overview-map-data.md).

* **Rerun pipeline with new parameters** - You can now change pipeline parameters when re-running a pipeline from the Monitoring page without having to return to the pipeline editor. After running a pipeline with new parameters, you can easily monitor the new run against the old ones without having to toggle between pages.  To learn more about rerunning pipelines with new parameters, read [Rerun pipelines and activities](../data-factory/monitor-visually.md#rerun-pipelines-and-activities).

* **User Defined Functions [Generally Available]** - We’re excited to announce that user defined functions (UDFs) are now Generally Available. With user-defined functions, you can create customized expressions that can be reused across multiple mapping data flows. You no longer have to use the same string manipulation, math calculations, or other complex logic several times. User-defined functions will be grouped in libraries to help developers group common sets of functions.  To learn more about user defined functions, read [User defined functions in mapping data flows](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/introducing-user-defined-functions-preview-for-mapping-data/ba-p/3414628).
## Machine learning

**Distributed Deep Neural Network Training with Horovod and Petastorm [Public Preview]** - To simplify the process for creating and managing GPU-accelerated pools, Azure Synapse takes care of pre-installing low-level libraries and setting up all the complex networking requirements between compute nodes. This integration allows users to get started with GPU- accelerated pools within just a few minutes.  

Now, Azure Synapse Analytics provides built-in support for deep learning infrastructure.  The Azure Synapse Analytics runtime for Apache Spark 3.1 and 3.2 now includes support for the most common deep learning libraries like TensorFlow and PyTorch. The Azure Synapse runtime also includes supporting libraries like Petastorm and Horovod, which are commonly used for distributed training. This feature is currently available in Public Preview.  

To learn more about how to leverage these libraries within your Azure Synapse Analytics GPU-accelerated pools, read the [Deep learning tutorials](./machine-learning/concept-deep-learning.md). 
## Next steps

[Get started with Azure Synapse Analytics](get-started.md)