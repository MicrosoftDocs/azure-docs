---
title: Introduction to Data Factory, a data integration service 
description: 'Learn what Azure Data Factory is: A cloud data integration service that orchestrates and automates movement and transformation of data.'
author: dcstwh
ms.author: weetok
ms.reviewer: jburchel
ms.service: data-factory
ms.subservice: v1
ms.topic: overview
ms.date: 04/12/2023
---

# Introduction to Azure Data Factory V1
> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1](data-factory-introduction.md)
> * [Version 2 (current version)](../introduction.md)

> [!NOTE]
> This article applies to version 1 of Azure Data Factory. If you are using the current version of the Data Factory service, see [Introduction to Data Factory V2](../introduction.md).


## What is Azure Data Factory?
In the world of big data, how is existing data leveraged in business? Is it possible to enrich data that's generated in the cloud by using reference data from on-premises data sources or other disparate data sources? 

For example, a gaming company collects logs that are produced by games in the cloud. It wants to analyze these logs to gain insights into customer preferences, demographics, usage behavior, and so on. The company also wants to identify up-sell and cross-sell opportunities, develop compelling new features to drive business growth, and provide a better experience to customers. 

To analyze these logs, the company needs to use the reference data such as customer information, game information, and marketing campaign information that is in an on-premises data store. Therefore, the company wants to ingest log data from the cloud data store and reference data from the on-premises data store. 

Next they want to process the data by using Hadoop in the cloud (Azure HDInsight). They want to publish the result data into a cloud data warehouse such as Azure Synapse Analytics or an on-premises data store such as SQL Server. The company wants this workflow to run once a week. 

The company needs a platform where they can create a workflow that can ingest data from both on-premises and cloud data stores. The company also needs to be able to transform or process data by using existing compute services such as Hadoop, and publish the results to an on-premises or cloud data store for BI applications to consume. 

:::image type="content" source="media/data-factory-introduction/what-is-azure-data-factory.png" alt-text="Data Factory overview"::: 

Azure Data Factory is the platform for these kinds of scenarios. It is a *cloud-based data integration service that allows you to create data-driven workflows in the cloud that orchestrate and automate data movement and data transformation*. Using Azure Data Factory, you can do the following tasks: 

- Create and schedule data-driven workflows (called pipelines) that can ingest data from disparate data stores.

- Process or transform the data by using compute services such as Azure HDInsight Hadoop, Spark, Azure Data Lake Analytics, and Azure Machine Learning.

-  Publish output data to data stores such as Azure Synapse Analytics for business intelligence (BI) applications to consume.  

It's more of an Extract-and-Load (EL) and Transform-and-Load (TL) platform rather than a traditional Extract-Transform-and-Load (ETL) platform. The transformations process data by using compute services rather than by adding derived columns, counting the number of rows, sorting data, and so on. 

Currently, in Azure Data Factory, the data that workflows consume and produce is *time-sliced data* (hourly, daily, weekly, and so on). For example, a pipeline might read input data, process data, and produce output data once a day. You can also run a workflow just one time.  
  

## How does it work? 
The pipelines (data-driven workflows) in Azure Data Factory typically perform the following three steps:

:::image type="content" source="media/data-factory-introduction/three-information-production-stages.png" alt-text="Three stages of Azure Data Factory":::

### Connect and collect
Enterprises have data of various types that are located in disparate sources. The first step in building an information production system is to connect to all the required sources of data and processing. These sources include SaaS services, file shares, FTP, and web services. Then move the data as-needed to a centralized location for subsequent processing.

Without Data Factory, enterprises must build custom data movement components or write custom services to integrate these data sources and processing. It is expensive and hard to integrate and maintain such systems. These systems also often lack the enterprise grade monitoring, alerting, and controls that a fully managed service can offer.

With Data Factory, you can use the Copy Activity in a data pipeline to move data from both on-premises and cloud source data stores to a centralization data store in the cloud for further analysis. 

For example, you can collect data in Azure Data Lake Store and transform the data later by using an Azure Data Lake Analytics compute service. Or, collect data in Azure blob storage and transform it later by using an Azure HDInsight Hadoop cluster.

### Transform and enrich
After data is present in a centralized data store in the cloud, process or transfer it by using compute services such as HDInsight Hadoop, Spark, Data Lake Analytics, or Machine Learning. You want to reliably produce transformed data on a maintainable and controlled schedule to feed production environments with trusted data. 

### Publish 
Deliver transformed data from the cloud to on-premises sources such as SQL Server. Alternatively,  keep it in your cloud storage sources for consumption by BI and analytics tools and other applications.

## Key components
An Azure subscription can have one or more Azure Data Factory instances (or data factories). Azure Data Factory is composed of four key components. These components work together to provide the platform on which you can compose data-driven workflows with steps to move and transform data. 

### Pipeline
A data factory can have one or more pipelines. A pipeline is a group of activities. Together, the activities in a pipeline perform a task. 

For example, a pipeline can contain a group of activities that ingests data from an Azure blob, and then runs a Hive query on an HDInsight cluster to partition the data. The benefit of this is that the pipeline allows you to manage the activities as a set instead of each one individually. For example, you can deploy and schedule the pipeline, instead of scheduling independent activities. 

### Activity
A pipeline can have one or more activities. Activities define the actions to perform on your data. For example, you can use a copy activity to copy data from one data store to another data store. Similarly, you can use a Hive activity. A Hive activity runs a Hive query on an Azure HDInsight cluster to transform or analyze your data. Data Factory supports two types of activities: data movement activities and data transformation activities.

### Data movement activities
Copy Activity in Data Factory copies data from a source data store to a sink data store. Data from any source can be written to any sink. Select a data store to learn how to copy data to and from that store. Data Factory supports the following data stores:

[!INCLUDE [data-factory-supported-data-stores](includes/data-factory-supported-data-stores.md)]

For more information, see [Move data by using Copy Activity](data-factory-data-movement-activities.md).

### Data transformation activities
[!INCLUDE [data-factory-transformation-activities](includes/data-factory-transformation-activities.md)]

For more information, see [Move data by using Copy Activity](data-factory-data-transformation-activities.md).

### Custom .NET activities
Create a custom .NET activity if you need to move data to or from a data store that Copy Activity doesn't support or if you need to transform data by using your own logic. For details about how to create and use a custom activity, see [Use custom activities in an Azure Data Factory pipeline](data-factory-use-custom-activities.md).

### Datasets
An activity takes zero or more datasets as inputs and one or more datasets as outputs. Datasets represent data structures within the data stores. These structures point to or reference the data you want to use in your activities (such as inputs or outputs). 

For example, an Azure blob dataset specifies the blob container and folder in the Azure blob storage from which the pipeline should read the data. Or an Azure SQL table dataset specifies the table to which the output data is written by the activity. 

### Linked services
Linked services are much like connection strings, which define the connection information that's needed for Data Factory to connect to external resources. Think of it this way: a linked service defines the connection to the data source and a dataset represents the structure of the data. 

For example, an Azure Storage-linked service specifies a connection string with which to connect to the Azure Storage account. An Azure blob dataset specifies the blob container and the folder that contains the data.   

Linked services are used for two reasons in Data Factory:

* To represent a *data store* that includes, but isn't limited to, a SQL Server database, Oracle database, file share, or Azure blob storage account. See the [Data movement activities](#data-movement-activities) section for a list of supported data stores.

* To represent a *compute resource* that can host the execution of an activity. For example, the HDInsightHive activity runs on an HDInsight Hadoop cluster. See the [Data transformation activities](#data-transformation-activities) section for a list of supported compute environments.

### Relationship between Data Factory entities

:::image type="content" source="./media/data-factory-introduction/data-integration-service-key-concepts.png" alt-text="Diagram: Data Factory, a cloud data integration service - key concepts":::

## Supported regions
Currently, you can create data factories in the West US, East US, and North Europe regions. However, a data factory can access data stores and compute services in other Azure regions to move data between data stores or process data by using compute services.

Azure Data Factory itself does not store any data. It lets you create data-driven workflows to orchestrate the movement of data between [supported data stores](#data-movement-activities). It also lets you process data by using [compute services](#data-transformation-activities) in other regions or in an on-premises environment. It also allows you to [monitor and manage workflows](data-factory-monitor-manage-pipelines.md) by using both programmatic and UI mechanisms.

Data Factory is available in only West US, East US, and North Europe regions. However, the service that powers the data movement in Data Factory is available [globally](data-factory-data-movement-activities.md#global) in several regions. If a data store is behind a firewall, then a [Data Management Gateway](data-factory-move-data-between-onprem-and-cloud.md) that's installed in your on-premises environment moves the data instead.

For an example, let's assume that your compute environments such as Azure HDInsight cluster and Azure Machine Learning are located in the West Europe region. You can create and use an Azure Data Factory instance in North Europe. Then you can use it to schedule jobs on your compute environments in West Europe. It takes a few milliseconds for Data Factory to trigger the job on your compute environment, but the time for running the job on your computing environment does not change.

## Get started with creating a pipeline
You can use one of these tools or APIs to create data pipelines in Azure Data Factory: 

- Visual Studio
- PowerShell
- .NET API
- REST API
- Azure Resource Manager template

To learn how to build data factories with data pipelines, follow the step-by-step instructions in the following tutorials:

| Tutorial | Description |
| --- | --- |
| [Move data between two cloud data stores](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md) |Create a data factory with a pipeline that moves data from blob storage to SQL Database. |
| [Transform data by using Hadoop cluster](data-factory-build-your-first-pipeline.md) |Build your first Azure data factory with a data pipeline that processes data by running a Hive script on an Azure HDInsight (Hadoop) cluster. |
| [Move data between an on-premises data store and a cloud data store by using Data Management Gateway](data-factory-move-data-between-onprem-and-cloud.md) |Build a data factory with a pipeline that moves data from a SQL Server database to an Azure blob. As part of the walkthrough, you install and configure the Data Management Gateway on your machine. |
