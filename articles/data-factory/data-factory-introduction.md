---
title: Introduction to Data Factory, a data integration service | Microsoft Docs
description: 'Learn what Azure Data Factory is: A cloud data integration service that orchestrates and automates movement and transformation of data.'
keywords: data integration, cloud data integration, what is azure data factory
services: data-factory
documentationcenter: ''
author: sharonlo101
manager: jhubbard
editor: monicar

ms.assetid: cec68cb5-ca0d-473b-8ae8-35de949a009e
ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 04/21/2017
ms.author: shlo

---
# Introduction to Azure Data Factory 
## What is Azure Data Factory?
In the world of big data, how is existing data leveraged in business? Is it possible to enrich data generated in the cloud by using reference data from on-premises data sources or other disparate data sources? For example, a gaming company collects many logs produced by games in the cloud. It wants to analyze these logs to gain insights in to customer preferences, demographics, usage behavior etc. to identify up-sell and cross-sell opportunities, develop new compelling features to drive business growth, and provide a better experience to customers. 

To analyze these logs, the company needs to use the reference data such as customer information, game information, marketing campaign information that is in an on-premises data store. Therefore, the company wants to ingest log data from the cloud data store and reference data from the on-premises data store. Then, process the data by using Hadoop in the cloud (Azure HDInsight) and publish the result data into a cloud data warehouse such as Azure SQL Data Warehouse or an on-premises data store such as SQL Server. It wants this workflow to run weekly once. 

What is needed is a platform that allows the company to create a workflow that can ingest data from both on-premises and cloud data stores, and transform or process data by using existing compute services such as Hadoop, and publish the results to an on-premises or cloud data store for BI applications to consume. 

![Data Factory overview](media/data-factory-introduction/what-is-azure-data-factory.png) 

Azure Data Factory is the platform for this kind of scenarios. It is a **cloud-based data integration service that allows you to create data-driven workflows in the cloud for orchestrating and automating data movement and data transformation**. Using Azure Data Factory, you can create and schedule data-driven workflows (called pipelines) that can ingest data from disparate data stores, process/transform the data by using compute services such as Azure HDInsight Hadoop, Spark, Azure Data Lake Analytics, and Azure Machine Learning, and publish output data to data stores such as Azure SQL Data Warehouse for business intelligence (BI) applications to consume.  

It's more of an Extract-and-Load (EL) and then Transform-and-Load (TL) platform rather than a traditional Extract-Transform-and-Load (ETL) platform. The transformations that are performed are to transform/process data by using compute services rather than to perform transformations like the ones for adding derived columns, counting number of rows, sorting data, etc. 

Currently, in Azure Data Factory, the data that is consumed and produced by workflows is **time-sliced data** (hourly, daily, weekly, etc.). For example, a pipeline may read input data, process data, and produce output data once a day. You can also run a workflow just one time.  
  

## How does it work? 
The pipelines (data-driven workflows) in Azure Data Factory typically perform the following three steps:

![Three stages of Azure Data Factory](media/data-factory-introduction/three-information-production-stages.png)

### Connect and collect
Enterprises have data of various types located in disparate sources. The first step in building an information production system is to connect to all the required sources of data and processing, such as SaaS services, file shares, FTP, web services, and move the data as-needed to a centralized location for subsequent processing.

Without Data Factory, enterprises must build custom data movement components or write custom services to integrate these data sources and processing. It is expensive and hard to integrate and maintain such systems, and it often lacks the enterprise grade monitoring and alerting, and the controls that a fully managed service can offer.

With Data Factory, you can use the Copy Activity in a data pipeline to move data from both on-premises and cloud source data stores to a centralization data store in the cloud for further analysis. For example, you can collect data in an Azure Data Lake Store and transform the data later by using an Azure Data Lake Analytics compute service. Or, collect data in an Azure Blob Storage and transform data later by using an Azure HDInsight Hadoop cluster.

### Transform and enrich
Once data is present in a centralized data store in the cloud, you want the collected data to be processed or transformed by using compute services such as HDInsight Hadoop, Spark, Data Lake Analytics, and Machine Learning. You want to reliably produce transformed data on a maintainable and controlled schedule to feed production environments with trusted data. 

### Publish 
Deliver transformed data from the cloud to on-premises sources like SQL Server, or keep it in your cloud storage sources for consumption by business intelligence (BI) and analytics tools and other applications

## Key components
An Azure subscription may have one or more Azure Data Factory instances (or data factories). Azure Data Factory is composed of four key components that work together to provide the platform on which you can compose data-driven workflows with steps to move and transform data. 

### Pipeline
A data factory may have one or more pipelines. A pipeline is a group of activities. Together, the activities in a pipeline perform a task. For example, a pipeline could contain a group of activities that ingests data from an Azure blob, and then run a Hive query on an HDInsight cluster to partition the data. The benefit of this is that the pipeline allows you to manage the activities as a set instead of each one individually. For example, you can deploy and schedule the pipeline, instead of the activities independently. 

### Activity
A pipeline may have one or more activities. Activities define the actions to perform on your data. For example, you may use a Copy activity to copy data from one data store to another data store. Similarly, you may use a Hive activity, which runs a Hive query on an Azure HDInsight cluster to transform or analyze your data. Data Factory supports two types of activities: data movement activities and data transformation activities.

### Data movement activities
Copy Activity in Data Factory copies data from a source data store to a sink data store. Data Factory supports the following data stores. Data from any source can be written to any sink. Click a data store to learn how to copy data to and from that store.

[!INCLUDE [data-factory-supported-data-stores](../../includes/data-factory-supported-data-stores.md)]

For more information, see [Data Movement Activities](data-factory-data-movement-activities.md) article.

### Data transformation activities
[!INCLUDE [data-factory-transformation-activities](../../includes/data-factory-transformation-activities.md)]

For more information, see [Data Transformation Activities](data-factory-data-transformation-activities.md) article.

### Custom .NET activities
If you need to move data to/from a data store that Copy Activity doesn't support, or transform data using your own logic, create a **custom .NET activity**. For details on creating and using a custom activity, see [Use custom activities in an Azure Data Factory pipeline](data-factory-use-custom-activities.md).

### Datasets
An activity takes zero or more datasets as inputs and one or more datasets as outputs. Datasets represent data structures within the data stores, which simply point or reference the data you want to use in your activities as inputs or outputs. For example, an Azure Blob dataset specifies the blob container and folder in the Azure Blob Storage from which the pipeline should read the data. Or, an Azure SQL Table dataset specifies the table to which the output data is written by the activity. 

### Linked services
Linked services are much like connection strings, which define the connection information needed for Data Factory to connect to external resources. Think of it this way - a linked service defines the connection to the data source and a dataset represents the structure of the data. For example, an Azure Storage linked service specifies connection string to connect to the Azure Storage account. And, an Azure Blob dataset specifies the blob container and the folder that contains the data.   

Linked services are used for two purposes in Data Factory:

* To represent a **data store** including, but not limited to, an on-premises SQL Server, Oracle database, file share, or an Azure Blob Storage account. See the [Data movement activities](#data-movement-activities) section for a list of supported data stores.
* To represent a **compute resource** that can host the execution of an activity. For example, the HDInsightHive activity runs on an HDInsight Hadoop cluster. See [Data transformation activities](#data-transformation-activities) section for a list of supported compute environments.

### Relationship between Data Factory entities
![Diagram: Data Factory, a cloud data integration service - Key Concepts](./media/data-factory-introduction/data-integration-service-key-concepts.png)
**Figure 2.** Relationships between Dataset, Activity, Pipeline, and Linked service

## Supported regions
Currently, you can create data factories in the **West US**, **East US**, and **North Europe** regions. However, a data factory can access data stores and compute services in other Azure regions to move data between data stores or process data using compute services.

Azure Data Factory itself does not store any data. It lets you create data-driven workflows to orchestrate movement of data between [supported data stores](#data-movement-activities) and processing of data using [compute services](#data-transformation-activities) in other regions or in an on-premises environment. It also allows you to [monitor and manage workflows](data-factory-monitor-manage-pipelines.md) using both programmatic and UI mechanisms.

Even though Data Factory is available in only **West US**, **East US**, and **North Europe** regions, the service powering the data movement in Data Factory is available [globally](data-factory-data-movement-activities.md#global) in several regions. If a data store is behind a firewall, then a [Data Management Gateway](data-factory-move-data-between-onprem-and-cloud.md) installed in your on-premises environment moves the data instead.

For an example, let us assume that your compute environments such as Azure HDInsight cluster and Azure Machine Learning are running out of West Europe region. You can create and use an Azure Data Factory instance in North Europe and use it to schedule jobs on your compute environments in West Europe. It takes a few milliseconds for Data Factory to trigger the job on your compute environment but the time for running the job on your computing environment does not change.

## Get started with creating a pipeline
You can use one of these tools or APIs to create data pipelines in Azure Data Factory: 

- Azure portal
- Visual Studio
- PowerShell
- .NET API
- REST API
- Azure Resource Manager template. 

To learn how to build data factories with data pipelines, follow step-by-step instructions in the following tutorials:

| Tutorial | Description |
| --- | --- |
| [Move data between two cloud data stores](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md) |In this tutorial, you create a data factory with a pipeline that **moves data** from Blob storage to SQL database. |
| [Transform data using Hadoop cluster](data-factory-build-your-first-pipeline.md) |In this tutorial, you build your first Azure data factory with a data pipeline that **processes data** by running Hive script on an Azure HDInsight (Hadoop) cluster. |
| [Move data between an on-premises data store and a cloud data store using Data Management Gateway](data-factory-move-data-between-onprem-and-cloud.md) |In this tutorial, you build a data factory with a pipeline that **moves data** from an **on-premises** SQL Server database to an Azure blob. As part of the walkthrough, you install and configure the Data Management Gateway on your machine. |
