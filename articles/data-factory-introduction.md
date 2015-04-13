<properties 
	pageTitle="Introduction to Azure Data Factory" 
	description="Learn how you can use the Azure Data Factory service to compose data processing, data storage and data movement services to create pipelines that produce trusted information." 
	services="data-factory" 
	documentationCenter="" 
	authors="spelluru" 
	manager="jhubbard" 
	editor="monicar"/>

<tags 
	ms.service="data-factory" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/08/2015" 
	ms.author="spelluru"/>

# Introduction to Azure Data Factory Service
<!--
The **Azure Data Factory** service is a fully managed service for composing data storage, processing, and movement services into streamlined, scalable, and reliable data production pipelines.  Developers can use Data Factory to transform semi-structured, unstructured and structured data from on-premises and cloud sources into trusted information. Developers build data-driven workflows (pipelines) that join, aggregate and transform data sourced from their on-premises, cloud-based and internet services, and set up complex data processing through simple JSON scripting. The Azure Data Factory service provides monitoring and management of these pipelines at a glance with a rich visual experience offered through the Azure Preview Portal. The information produced by pipelines can be easily consumed using BI and analytics tools, and other applications to reliably drive key business insights and decisions.
-->


The **Azure Data Factory** service is a fully managed service for composing data storage, data processing, and data movement services into streamlined, scalable, and reliable data production pipelines. The Data Factory service allows you to: 

- Build data-driven workflows (pipelines) that join, aggregate and transform data sourced from  on-premises, cloud-based, and internet data stores. 
- Transform semi-structured, unstructured and structured data from diverse data sources into trusted information.
- Produce data that can be easily consumed by using business intelligence (BI), analytics tools, and other applications. 
- Set up complex data processing through simple JSON scripting.
- Monitor and manage pipelines at a glance with a rich visual experience offered through the Azure Preview Portal.  

The following video provides a quick overview of the Azure Data Factory service.

> [AZURE.VIDEO azure-data-factory-overview]

<!--
This article provides an overview of the Azure Data Factory service, the value it provides, and the scenarios it supports.
--> 

## Overview
Traditionally, data integration projects have revolved around creating Extract-Transform-Load (ETL) processes that extract data from various data sources within an organization, transform the data to conform to the target schema of an Enterprise Data Warehouse (EDW), and load the data into an EDW. The EDW is then accessed as the single source of truth for BI analytics solutions. 

![Traditional ETL][image-data-factory-introduction-traditional-ETL]

Today’s data landscape for enterprises continues to grow exponentially in volume, variety, and complexity. It is more diverse than ever with on-premises and cloud-born data of different forms and velocities.  The data processing must happen across geographic locations, and includes a combination of open source software, commercial solutions and custom processing services and that are expensive, and hard to integrate and maintain.  The agility needed to adapt to today’s changing Big Data landscape is an opportunity to merge the traditional EDW with capabilities required for a modern information production system.  

![Todays Diverse Processing Landscape][image-data-factory-introduction-todays-diverse-processing-landspace]

The **Azure Data Factory** service is the composition platform to work across traditional EDWs and the changing data landscape to empower enterprises to leverage all data that is available to them for data-driven decision making. It empowers enterprises to harness this diversity by providing a platform to compose data processing, storage and movement services into information production pipelines, and manage trusted data assets.

The Azure Data Factory service lets you:

- **Easily work with diverse data storage and processing systems.** 
The Data Factory service allows you to create information production pipelines that move and process both on-premises data (such as SQL Server) and cloud data sources such as Azure SQL Database, Azure table and blobs. 
- **Transform data into trusted information.** 
The Data factory service supports Hive, Pig and C# processing, along with key processing features such as automatic Hadoop (HDInsight) cluster management, re-tries for transient failures, configurable timeout policies, and alerting.  
- **Monitor data pipelines in one place.** 
The Data Factory service provides reliable and complete view of your storage, processing, and data movement services.  It helps you quickly assess end-to-end data pipeline health, pinpoint issues, and take corrective action if needed. You can also visually track data lineage and the relationships between your data across any of your sources, and see a full historical accounting of job execution, system health, and dependencies from a single monitoring dashboard.
- **Get rich insights from transformed data**
The Data Factory service allows you to create data pipelines that produce trusted data, which can be consumed by by business intelligence and analytics tools, and other applications.

<!--
Today, to take advantage of the benefits of Data Factory, developers interact directly with individual data pipelines, storage services, and compute services.  As the Data Factory service evolves over time, we will introduce additional storage and processing services, and new mechanisms of grouping compute and storage services and data pipelines together into ‘Hubs’.  We describe Hubs here in our introduction, as this nascent concept appears throughout the service as a precursor for future releases.

An Azure Data Factory Hub is a container for storage and compute services (both referred to as Linked services), as well as for the data pipelines that use and run on those resources. The Hub container allows the Data Factory to be divided into logical or domain specific groupings.  For example, an enterprise may have a “West US Azure Hub” which manages all of the Linked services and pipelines focused in the West US data center, or a “Sales EDW Hub” which manages all the Linked services and pipelines associated with populating and processing data for the Sales EDW.  An important characteristic of Hubs is that a pipeline runs on a single hub. This means that when defining a pipeline, all of the Linked services referenced by tables or activities within that pipeline must have the same Hub name as the pipeline itself.

Hubs will help to encapsulate storage and compute in a way where pipelines can reference only a Hub rather than the specific services and tables it uses. The Hub can then use policies to decide where to run a pipeline. This will have several important impacts. One is that it will provide easier scale-up as more Linked services can be added to a Hub, and pipelines can be load-balanced across these new Linked services. Another is that it will reuse of pipeline definitions on different Hubs.

-->

## Application Model
The following diagram illustrates the application model supported by the Azure Data Factory service.

![Application Model][image-data-factory-application-model]

There are three information production stages in an Azure data factory:

- **Connect & Collect**. In this stage, data from various data sources is imported into data hubs. A pipeline in a data factory can have one or more activities. You use one or more **Copy** activities in a data pipeline to collect data from source data stores to a destination data store with in a data hub for further processing. A HDInsight cluster (compute) and its associated Azure blob storage (storage) together form a data hub, a HDInsight data hub. To use a HDInsight data hub, you copy all the source data into an Azure blob store associated with the HDInsight so that the data can be processed by HDInsight cluster. A pipeline runs on a compute resource in a data hub such as a HDInsight cluster.      
- **Transform & Enrich**. In this stage, the collected data is processed. For example, a **HDInsight Activity** in a pipeline can process data stored in the associated Azure blob store by performing transformations using Hive/Pig scripts to produce trusted information. Pipelines can be chained (as shown in the diagram) such that output data sets of a pipeline can be input data sets for another pipeline in the same data hub or another data hub.  
- **Publish**. In this stage, the data is published so that it can be consumed by BI tools, analytics tools, and other applications. For example, a Copy Activity in the pipeline can copy output data from the processing performed in the Transform & Enrich stage to a data store (for example: on-premises SQL Server) on top of which business intelligence solutions can be built.   

<!--

Data Factories enable developers to create pipelines which are groups of data movement and/or processing activities that accept one or more input datasets and produce one or more output datasets. Pipelines can be executed once or on a flexible range of schedules (hourly, daily, weekly, etc…). A dataset is a named view of data. The data being described can vary from simple bytes, semi-structured data like CSV files all the way to tables or models.

Pipelines comprised of data movement activities (for example: Copy Activity) are often used to import/export data from all the data sources (databases, files, SaaS services, etc…) used by the organization into a data hub.
 
Once data is in a **hub**, **pipelines** hosted by the compute services of the hub, are used to transform data into a form suitable for consumption (by BI tools, applications, customers, etc.).  
  
Finally, **pipelines** can be chained (as shown in the diagram) such that the output **dataset(s)** of one are the input(s) of another.  This allows complex data flows to be factored into **pipelines** that run within a data hub or span multiple hubs.  Using **pipelines** in this way provides organizations the building blocks to compose the best of breed on-premises, cloud and Software-as-a-Service (SaaS) services all through the lens of a single, easily managed data factory.
--> 


##Next Steps
1. [Get started with Data Factory][datafactory-getstarted]. This article provides an end-to-end tutorial that shows you how to create a sample Azure data factory that copies data from an Azure blob to an Azure SQL database.
2. [Tutorial: Move and process log files using Data Factory][adf-tutorial]. This article provides an **end-to-end walkthrough** that shows how to implement a **real world scenario** using Azure Data Factory to transform data from log files into insights.

## See Also
- [Data Factory - Terminology][adf-terminology]. This article introduces you to the terminology used in creating data factories using the Azure Data Factory service 
- [Data Factory - Frequently Asked Questions][adf-faq]. This article provides a list of frequently asked questions and the answers.
- [Common scenarios for using Azure Data Factory][adf-common-scenarios]. This article describes a few common scenarios for using the Azure Data Factory service. 


[Power-Query-Azure-Table]: http://office.microsoft.com/en-001/excel-help/connect-to-microsoft-azuretable-storage-HA104122607.aspx
[Power-Query-Azure-Blob]: http://office.microsoft.com/en-001/excel-help/connect-to-microsoft-azure-blob-storage-HA104113447.aspx
[Power-Query-Azure-SQL]: http://office.microsoft.com/en-001/excel-help/connect-to-a-microsoft-azure-sql-database-HA104019809.aspx
[Power-Query-OnPrem-SQL]: http://office.microsoft.com/en-001/excel-help/connect-to-a-sql-server-database-HA104019808.aspx

[adf-faq]: data-factory-faq.md
[adf-terminology]: data-factory-terminology.md
[copy-data-with-adf]: data-factory-copy-activity.md
[use-pig-hive]: data-factory-pig-hive-activities.md
[run-map-reduce]: data-factory-map-reduce.md
[azure-ml-adf]: data-factory-create-predictive-pipelines.md
[adf-common-scenarios]: data-factory-common-scenarios.md
[create-factory-using-dotnet-sdk]: data-factory-create-data-factories-programmatically.md
[data-factory-editor]: data-factory-editor.md
[create-data-factory-using-powershell]: data-factory-monitor-manage-using-powershell.md

[adf-powershell-reference]: https://msdn.microsoft.com/library/dn820234.aspx 


[msdn-stored-procedure-activity]: https://msdn.microsoft.com/library/dn912649.aspx
[msdn-class-library-reference]: https://msdn.microsoft.com/library/dn883654.aspx
[msdn-rest-api-reference]: https://msdn.microsoft.com/library/dn906738.aspx

[adf-tutorial]: data-factory-tutorial.md
[datafactory-getstarted]: data-factory-get-started.md

[image-data-factory-introduction-traditional-ETL]: ./media/data-factory-introduction/TraditionalETL.PNG

[image-data-factory-introduction-todays-diverse-processing-landspace]:./media/data-factory-introduction/TodaysDiverseDataProcessingLandscape.PNG

[image-data-factory-application-model]:./media/data-factory-introduction/DataFactoryApplicationModel.png

[image-data-factory-data-flow]:./media/data-factory-introduction/DataFactoryDataFlow.png



