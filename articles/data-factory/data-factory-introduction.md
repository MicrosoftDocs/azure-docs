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
	ms.date="09/08/2016" 
	ms.author="spelluru"/>

# Introduction to Azure Data Factory Service, a data integration service in the cloud

## What is Azure Data Factory? 
Data Factory is a cloud-based data integration service that orchestrates and automates the **movement** and **transformation** of data. It allows you to create data pipelines that move and transform data, and then run the pipelines to run on a specified schedule (hourly, daily, weekly, etc.). 

Data Factory works across on-premises and cloud data sources to ingest, prepare, transform, analyze, and publish your data. Use Data Factory to compose services into data pipelines to transform your data using services such as Azure HDInsight (Hadoop), Azure Machine Learning, and Azure Batch. It provides rich visualizations to quickly display the lineage and dependencies between your data pipelines, and monitor all your data pipelines from a single unified view to easily pinpoint issues and setup monitoring alerts.

![Diagram: Data Factory Overview, a data integration service](./media/data-factory-introduction/what-is-azure-data-factory.png)
**Figure1.** Collect data from many different on-premises data sources, ingest, prepare, transform, and analyze the data, and then publish ready-to-use data for consumption.

## Pipelines and activities
In a Data Factory solution, you create one or more data **pipelines**. A pipeline is a logical grouping of activities. They are used to group activities into a unit that together perform a task. For example, a sequence of several transformation Activities might be needed to cleanse log file data. This sequence could have a complex schedule and dependencies that need to be orchestrated and automated. All these activities could be grouped into a single Pipeline named "CleanLogFiles." CleanLogFiles pipeline could then be deployed, scheduled, or deleted as one single unit instead of managing each individual activity independently.

**Activities** define the actions to perform on your data. Each activity takes zero or more datasets as inputs and produces one or more datasets as outputs. An activity is a unit of orchestration in Azure Data Factory. For example, you may use a Copy activity to orchestrate copying data from one data store to another data store. Similarly, you may use a Hive activity, which runs a Hive query on an Azure HDInsight cluster to transform or analyze your data. Azure Data Factory provides a wide range of [data transformation](data-factory-data-transformation-activities.md), and a data movement activity (copy activity).
  
## Data movement activities 
[AZURE.INCLUDE [data-factory-supported-data-stores](../../includes/data-factory-supported-data-stores.md)]

## Data transformation activities
[AZURE.INCLUDE [data-factory-transformation-activities](../../includes/data-factory-transformation-activities.md)]

## Linked services
Linked services define the information needed for Data Factory to connect to external resources. Linked services are used for two purposes in Data Factory:

- To represent a data store including, but not limited to, an on-premises SQL Server, Oracle DB, File share, or an Azure Blob Storage account. As mentioned earlier, Datasets represent data structures within the data stores connected to Data Factory through a Linked service.
- To represent a compute resource that can host the execution of an Activity. For example, the “HDInsightHive Activity”executes on an HDInsight Hadoop cluster.

## Datasets 
**Datasets** are named references/pointers to the data you want to use as an input or an output of an activity. Datasets identify data structures within different data stores including tables, files, folders, and documents.

## Relationship between Data Factory entities
Data Factory has a few key entities that work together to define input and output data, processing events, and the schedule and resources required to execute the desired data flow.

![Diagram: Data Factory, a cloud data integration service - Key Concepts](./media/data-factory-introduction/data-integration-service-key-concepts.png)
**Figure 2.** Relationships between Dataset, Activity, Pipeline, and Linked service

With the four simple concepts of datasets, activities, pipelines and linked services, you are ready to get started! You can [build your first pipeline](data-factory-build-your-first-pipeline.md). 

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