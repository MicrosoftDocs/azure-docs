<properties 
	pageTitle="What is Data Factory? Data integration service | Microsoft Azure" 
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
	ms.date="07/12/2016" 
	ms.author="spelluru"/>

# Introduction to Azure Data Factory Service, a data integration service in the cloud

## What is Azure Data Factory? 
Data Factory is a cloud-based data integration service that orchestrates and automates the movement and transformation of data. Just like a manufacturing factory that runs equipment to take raw materials and transform them into finished goods, Data Factory orchestrates existing services that collect raw data and transform it into ready-to-use information. 

Data Factory works across on-premises and cloud data sources and SaaS to ingest, prepare, transform, analyze, and publish your data.  Use Data Factory to compose services into managed data flow pipelines to transform your data using services like [Azure HDInsight (Hadoop)](http://azure.microsoft.com/documentation/services/hdinsight/) and [Azure Batch](https://azure.microsoft.com/documentation/services/batch/) for your big data computing needs, and with [Azure Machine Learning](https://azure.microsoft.com/documentation/services/machine-learning/) to operationalize your analytics solutions.  Go beyond just a tabular monitoring view, and use the rich visualizations of Data Factory to quickly display the lineage and dependencies between your data pipelines. Monitor all of your data flow pipelines from a single unified view to easily pinpoint issues and setup monitoring alerts.

![Diagram: Data Factory Overview, a data integration service](./media/data-factory-introduction/what-is-azure-data-factory.png)

**Figure1.** Collect data from many different on-premises data sources, ingest and prepare it, organize and analyze it with a range of transformations, then publish ready-to-use data for consumption.

You can use Data Factory anytime you need to collect data of different shapes and sizes, transform it, and publish it to extract deep insights – all on a reliable schedule. Data Factory is used to create highly available data flow pipelines for many scenarios across different industries for their analytics pipeline needs.  Online retailers use it to generate personalized [product recommendations](data-factory-product-reco-usecase.md) based on customer browsing behavior. Game studios use it to understand the [effectiveness of their marketing](data-factory-customer-profiling-usecase.md) campaigns. Learn directly from our customers how and why they use Data Factory by reviewing [Customer Case Studies](data-factory-customer-case-studies.md). 

> [AZURE.VIDEO azure-data-factory-overview]

## Key Concepts

Azure Data Factory has a few key entities that work together to define the input and output data, processing events, and the schedule and resources required to execute the desired data flow.

![Diagram: Data Factory, a cloud data integration service - Key Concepts](./media/data-factory-introduction/data-integration-service-key-concepts.png)

**Figure 2.** Relationships between Dataset, Activity, Pipeline, and Linked service


### Activities
Activities define the actions to perform on your data. Each activity takes zero or more [datasets](data-factory-create-datasets.md) as inputs and produces one or more datasets as outputs. An activity is a unit of orchestration in Azure Data Factory. For example, you may use a [Copy activity](data-factory-data-movement-activities.md) to orchestrate copying data from one dataset to another. Similarly you may use a [Hive activity](data-factory-data-transformation-activities.md) which will run a Hive query on an Azure HDInsight cluster to transform or analyze your data. Azure Data Factory provides a wide range of data transformation, analysis, and data movement activities. 

### Pipelines
[Pipelines](data-factory-create-pipelines.md) are a logical grouping of Activities. They are used to group activities into a unit that together perform a task. For example, a sequence of several transformation Activities might be needed to cleanse log file data.  This sequence could have a complex schedule and dependencies that need to be orchestrated and automated. All of these activities could be grouped into a single Pipeline named “CleanLogFiles”.  “CleanLogFiles” could then be deployed, scheduled, or deleted as one single unit  instead of managing each individual activity independently.

### Datasets
[Datasets](data-factory-create-datasets.md) are named references/pointers to the data you want to use as an input or an output of an Activity. Datasets identify data structures within different data stores including tables, files, folders, and documents.

### Linked service
Linked services define the information needed for Data Factory to connect to external resources.  Linked services are used for two purposes in Data Factory:

- To represent a data store  including, but not limited to, an on-premises SQL Server, Oracle DB, File share or an Azure Blob Storage account.   As discussed above, Datasets represent the structures within the data stores connected to Data Factory through a Linked service.
- To represent a compute resource that can host the execution of an Activity.  For example, the “HDInsightHive Activity”executes on an HDInsight Hadoop cluster.

With the four simple concepts of datasets, activities, pipelines and linked services, you are ready to get started!  You can [build your first pipeline](data-factory-build-your-first-pipeline.md)  from the ground up, or deploy a ready-made sample by following the instructions in our [Data Factory Samples](data-factory-samples.md) article. 

## Supported regions
You can create data factories in the **West US**, **East US** and **North Europe** regions at this time. However, a data factory can access data stores and compute services in other Azure regions to move data between data stores or process data using compute services. 

Azure Data Factory itself does not store any data. It lets you create data-driven flows to orchestrate movement of data between [supported data stores](data-factory-data-movement-activities.md#supported-data-stores) and processing of data using [compute services](data-factory-compute-linked-services.md) in other regions or in an on-premises environment. It also allows you to [monitor and manage workflows](data-factory-monitor-manage-pipelines.md) using both programmatic and UI mechanisms. 

Note that even though the Azure Data Factory is available in only **West US**, **East US** and **North Europe** regions, the service powering the data movement in Data Factory is available [globally](data-factory-data-movement-activities.md#global) in several regions. In case a data store sits behind a firewall then a  a [Data Management Gateway](data-factory-move-data-between-onprem-and-cloud.md) installed in your on-premises environment moves the data instead. 

For an example, let us assume that your compute environment(s) such as Azure HDInsight cluster and Azure Machine Learning are running out of West Europe region. You can create and leverage an Azure Data Factory instance in North Europe and use it to schedule jobs on your compute environments in West Europe. It takes a few milliseconds for the Data Factory service to trigger the job on your compute environment but the time for executing the job on your computing environment does not change.

We intend to have Azure Data Factory in every geography supported by Azure in the future.
  
## Next steps
Follow step-by-step instruction in the following tutorials to learn how to build data factories with data pipelines. 

Tutorial | Description
-------- | -----------
[Build a data pipeline that processes data using Hadoop cluster](data-factory-build-your-first-pipeline.md) | In this tutorial, you’ll build your first Azure data factory with a data pipeline that **processes data** by running Hive script on an Azure HDInsight (Hadoop) cluster. |
[Build a data pipeline to move data between two cloud data stores](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md) | In this tutorial, you’ll create a data factory with a pipeline that **moves data** from Blob storage to SQL database.
[Build a data pipeline to move data between an on-premises data store and a cloud data store using Data Management Gateway](data-factory-move-data-between-onprem-and-cloud.md) |  In this tutorial, you'll build a data factory with a pipeline that **moves data** from an **on-premises** SQL Server database to an Azure blob. As part of the walkthrough, you will install and configure the Data Management Gateway on your machine. 