<properties 
	pageTitle="Introduction to Data Factory, a data integration service | Microsoft Azure" 
	description="Learn what Azure Data Factory is: A cloud data integration service that orchestrates and automates movement and transformation of data." 
	keywords="data integration, cloud data integration, what is azure data factory"
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
	ms.topic="get-started-article" 
	ms.date="09/22/2016" 
	ms.author="spelluru"/>

# Introduction to Azure Data Factory Service, a data integration service in the cloud

## What is Azure Data Factory? 
Data Factory is a cloud-based data integration service that orchestrates and automates the **movement** and **transformation** of data. You can create data integration solutions using the Data Factory service that can ingest data from various data stores, transform/process the data, and publish the result data to the data stores. 

Data Factory service allows you to create data pipelines that move and transform data, and then run the pipelines on a specified schedule (hourly, daily, weekly, etc.). It also provides rich visualizations to display the lineage and dependencies between your data pipelines, and monitor all your data pipelines from a single unified view to easily pinpoint issues and setup monitoring alerts.

![Diagram: Data Factory Overview, a data integration service](./media/data-factory-introduction/what-is-azure-data-factory.png)
**Figure1.** Ingest data from various data sources, prepare, transform, and analyze the data, and then publish ready-to-use data for consumption.

## Pipelines and activities
In a Data Factory solution, you create one or more data **pipelines**. A pipeline is a logical grouping of activities. They are used to group activities into a unit that together perform a task. 

**Activities** define the actions to perform on your data. For example, you may use a Copy activity to copy data from one data store to another data store. Similarly, you may use a Hive activity, which runs a Hive query on an Azure HDInsight cluster to transform or analyze your data. Data Factory supports two types of activities: data movement activities and data transformation activities. 
  
## Data movement activities 
[AZURE.INCLUDE [data-factory-supported-data-stores](../../includes/data-factory-supported-data-stores.md)]

See [Data Movement Activities](data-factory-data-movement-activities.md) article for more details. 

## Data transformation activities
[AZURE.INCLUDE [data-factory-transformation-activities](../../includes/data-factory-transformation-activities.md)]

See [Data Transformation Activities](data-factory-data-transformation-activities.md) article for more details.

If you need to move data to/from a data store that Copy Activity doesn't support, or transform data using your own logic, create a **custom .NET activity**. For details on creating and using a custom activity, see [Use custom activities in an Azure Data Factory pipeline](data-factory-use-custom-activities.md).

## Linked services
Linked services define the information needed for Data Factory to connect to external resources (Examples: Azure Storage, on-premises SQL Server, Azure HDInsight). Linked services are used for two purposes in Data Factory:

- To represent a **data store** including, but not limited to, an on-premises SQL Server, Oracle database, file share, or an Azure Blob Storage account. See the [Data movement activities](data-factory-data-movement-activities.md) section for a list of supported data stores. 
- To represent a **compute resource** that can host the execution of an activity. For example, the HDInsightHive activity runs on an HDInsight Hadoop cluster. See [Data transformation activities](data-factory-data-transformation-activities.md) section for a list of supported compute environments. 

## Datasets 
Linked services link data stores to an Azure data factory. Datasets represent data structures with in the data stores. For example, an Azure Storage linked service provides connection information for Data Factory to connect to an Azure Storage account. An Azure Blob dataset specifies the blob container and folder in the Azure Blob Storage from which the pipeline should read the data. Similarly, an Azure SQL linked service provides connection information for an Azure SQL database and an Azure SQL dataset specifies the table that contains the data.   

## Relationship between Data Factory entities
Data Factory has a few key entities that work together to define input and output data, processing events, and the schedule and resources required to execute the desired data flow.

![Diagram: Data Factory, a cloud data integration service - Key Concepts](./media/data-factory-introduction/data-integration-service-key-concepts.png)
**Figure 2.** Relationships between Dataset, Activity, Pipeline, and Linked service

With the four simple concepts of linked services, datasets, activities, and pipelines, you are ready to get started! You can [build your first pipeline](data-factory-build-your-first-pipeline.md). 

## Supported regions
Currently, you can create data factories in the **West US**, **East US**, and **North Europe** regions. However, a data factory can access data stores and compute services in other Azure regions to move data between data stores or process data using compute services. 

Azure Data Factory itself does not store any data. It lets you create data-driven flows to orchestrate movement of data between [supported data stores](data-factory-data-movement-activities.md#supported-data-stores) and processing of data using [compute services](data-factory-compute-linked-services.md) in other regions or in an on-premises environment. It also allows you to [monitor and manage workflows](data-factory-monitor-manage-pipelines.md) using both programmatic and UI mechanisms. 

Even though Azure Data Factory is available in only **West US**, **East US**, and **North Europe** regions, the service powering the data movement in Data Factory is available [globally](data-factory-data-movement-activities.md#global) in several regions. In case a data store sits behind a firewall then a [Data Management Gateway](data-factory-move-data-between-onprem-and-cloud.md) installed in your on-premises environment moves the data instead. 

For an example, let us assume that your compute environments such as Azure HDInsight cluster and Azure Machine Learning are running out of West Europe region. You can create and use an Azure Data Factory instance in North Europe and use it to schedule jobs on your compute environments in West Europe. It takes a few milliseconds for Data Factory to trigger the job on your compute environment but the time for running the job on your computing environment does not change.

We intend to have Azure Data Factory in every geography supported by Azure in the future.
  
## Next steps
To learn how to build data factories with data pipelines, follow step-by-step instructions in the following tutorials. 

Tutorial | Description
-------- | -----------
[Build a data pipeline that processes data using Hadoop cluster](data-factory-build-your-first-pipeline.md) | In this tutorial, you build your first Azure data factory with a data pipeline that **processes data** by running Hive script on an Azure HDInsight (Hadoop) cluster. |
[Build a data pipeline to move data between two cloud data stores](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md) | In this tutorial, you create a data factory with a pipeline that **moves data** from Blob storage to SQL database.
[Build a data pipeline to move data between an on-premises data store and a cloud data store using Data Management Gateway](data-factory-move-data-between-onprem-and-cloud.md) | In this tutorial, you build a data factory with a pipeline that **moves data** from an **on-premises** SQL Server database to an Azure blob. As part of the walkthrough, you install and configure the Data Management Gateway on your machine. 
