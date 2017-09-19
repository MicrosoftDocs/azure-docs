---
title: Introduction to Azure Data Factory | Microsoft Docs
description: Learn about Azure Data Factory, a cloud data integration service that orchestrates and automates movement and transformation of data.
services: data-factory
documentationcenter: ''
author: sharonlo101
manager: jhubbard
editor: spelluru

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 09/19/2017
ms.author: shlo

---
# Introduction to Azure Data Factory 
> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1 - GA](v1/data-factory-introduction.md)
> * [Version 2 - Preview](introduction.md)

In the world of big data, raw, unorganized data are often stored in relational, non-relational, and other storage systems. However, on their own, raw data do not have the proper context or meaning to provide meaningful insights to analysts, data scientists, and business decision makers. What is needed is a service that can enable orchestrating and operationalizing processes to refine these enormous stores of raw data into actionable business insights. Azure Data Factory is a managed cloud service built for these complex hybrid extract-transform-load (ETL), extract-load-transform(ELT), and data integration projects.

For example, imagine a gaming company that collects petabytes of game logs produced by games in the cloud. It wants to analyze these logs to gain insights into customer preferences, demographics, and usage behavior  to identify up-sell and cross-sell opportunities, develop new compelling features, drive business growth, and provide a better experience to its customers.

To analyze these logs, the company needs to use reference data such as customer information, game information, and marketing campaign information that is in an on-premises data store. The company wants to utilize this data from the on-premises data store, combining it with additional log data it has in a cloud data store. To extract insights, it hopes to process the joined data by using a Spark cluster in the cloud (HDInsight), and finally publish the transformed data into a cloud data warehouse such as Azure SQL Data Warehouse to easily build a report on top of it. This workflow is to be automated, monitored, and managed on a daily schedule and executed when files land in a blob store container.

Azure Data Factory is the platform that solves such data scenarios. It is a **cloud-based data integration service that allows you to create data-driven workflows in the cloud for orchestrating and automating data movement and data transformation**. Using Azure Data Factory, you can create and schedule data-driven workflows (called pipelines) that can ingest data from disparate data stores, process/transform the data by using compute services such as Azure HDInsight Hadoop, Spark, Azure Data Lake Analytics, and Azure Machine Learning, and publish output data to data stores such as Azure SQL Data Warehouse for business intelligence (BI) applications to consume. Ultimately, through Azure Data Factory, raw data can be organized into meaningful data stores and data lakes for better business decisions.

![top-level view of Data Factory](media/introduction/big-picture.png)

> [!NOTE]
> This article applies to version 2 of Data Factory, which is currently in preview. If you are using version 1 of the Data Factory service, which is generally available (GA), see [Introduction to Data Factory version 1](v1/data-factory-introduction.md).

## How does it work?
The pipelines (data-driven workflows) in Azure Data Factory typically perform the following four steps:

![Four steps of a data-driven workflow](media/introduction/four-steps-of-a-workflow.png)

### Connect and collect

Enterprises have data of various types located in disparate sources on-premises, in the cloud, structured, unstructured, and semi-structured, all arriving at different intervals and speeds. The first step in building an information production system is to connect to all the required sources of data and processing, such as software-as-a-service (SaaS) services, databases, file shares, FTP web services, and move the data as-needed to a centralized location for subsequent processing.

Without Data Factory, enterprises must build custom data movement components or write custom services to integrate these data sources and processing. It is expensive and hard to integrate and maintain such systems, and it often lacks the enterprise grade monitoring and alerting, and the controls that a fully managed service can offer.

With Data Factory, you can use the[Copy Activity](copy-activity-overview.md) in a data pipeline to move data from both on-premises and cloud source data stores to a centralization data store in the cloud for further analysis. For example, you can collect data in an Azure Data Lake Store and transform the data later by using an Azure Data Lake Analytics compute service. Or, collect data in an Azure Blob Storage and transform data later by using an Azure HDInsight Hadoop cluster.


With Data Factory, you can use the [Copy Activity](copy-activity-overview.md) in a data pipeline to move data from both on-premises and cloud source data stores to a centralization data store in the cloud for further analysis. For example, you can collect data in an Azure Data Lake Store and transform the data later by using an Azure Data Lake Analytics compute service. Or, collect data in an Azure Blob Storage and transform data later by using an Azure HDInsight Hadoop cluster.

### Transform and enrich
Once data is present in a centralized data store in the cloud, you want the collected data to be processed or transformed by using compute services such as HDInsight Hadoop, Spark, Data Lake Analytics, and Machine Learning. You want to reliably produce transformed data on a maintainable and controlled schedule to feed production environments with trusted data.

### Publish
Now that the raw data has been refined into business-ready consumable form, you load the data into Azure Data Warehouse, Azure SQL DB, Azure CosmosDB, or whichever analytics engine that your business users can point to from their business intelligence tools.

### Monitor
After you have successfully built and deployed your data integration pipeline, providing business value from refined data, you want to monitor the scheduled activities and pipelines for success & failure rates. Azure Data Factory has built-in support for pipeline monitoring via Azure Monitor, API, PowerShell, OMS, and health panels on the Azure portal.

## What’s different in version 2?
Azure Data Factory version 2 builds upon the original Azure Data Factory data movement and transformation service, extending to a broader set of cloud-first data integration scenarios. Azure Data Factory V2 brings the following capabilities:

- Control Flow and Scale
- Deploy and run SSIS packages in Azure

Following the version 1 release, we recognized that the customers need to design complex hybrid data integration scenarios that required both data movement and processing in the cloud, on-premises and in cloud VMs. These requirements brought a need to transfer and process data within secured VNET environments and to scale out with on-demand processing power.

As data pipelines become a critical part of a business analytics strategy, we have witnessed these critical data activities require flexible scheduling to support incremental data loads and event-triggered executions. Lastly, as the complexities of those orchestrations increases, so too does the requirement for the service to support common workflow paradigms including branching, looping and conditional processing.

With version 2, you can also migrate existing SQL Server Integration Services (SSIS) packages to the cloud to lift & shift SSIS as an Azure service managed within ADF utilizing a new feature of “Integration Runtimes” (IR). By spinning-up an SSIS IR in version 2, you have the ability to execute, manage, monitor, and build SSIS packages in the cloud.

### Control flow and scale 
To support the diverse integration flows and patterns in the modern data warehouse, Data Factory has enabled a new flexible data pipeline model that is no longer tied with time-series data. With this release, you can model conditionals, and branching in the control flow of a data pipeline and explicitly pass parameters within and across these flows.

You now have the freedom to model any flow style required for their data integration and be dispatched on demand or repeatedly on a clock schedule. A few common flows now enabled that were previously not possible are:   

- Control Flow:
	- Chaining activities in a sequence within a pipeline
	- Branching of activities within a pipeline
	- Parameters
		- Parameters can be defined at the Pipeline level and arguments passed while invoking the pipeline on demand or from a trigger
		- Activities can consume the arguments passed to the pipeline
	- Custom state passing
		- Activity outputs including state can be consumed by a subsequent activity in the pipeline
	- Looping Containers
		- For-each 
- Trigger based flows
	- Pipelines can be triggered by on-demand or wall-clock time
- Delta flows
	- Use parameters and define your high-water mark for delta copy while moving dimension or reference tables from a relational store either on premises or in the cloud to load the data into the lake 

For more information, see [tutorial: control flow](tutorial-control-flow.md).

### Deploy SSIS packages to Azure 
If you want to move your SSIS workloads, you can create a data factory version 2, and provision an Azure-SSIS Integration Runtime (IR). The Azure-SSIS IR is a fully managed cluster of Azure VMs (nodes) dedicated to run your SSIS packages in the cloud. For step-by-step instructions, see the tutorial: [deploy SSIS packages to Azure](tutorial-deploy-ssis-packages.md). 
 

## Rich cross-platform SDKs
If you are an advanced user and looking for a programmatic interface, version 2 provides a rich set of SDKs that can be used to author, manage, monitor pipelines using your favorite IDE.

- .NET SDK
- PowerShell
- Python SDK

You can also use REST APIs to create data factories. 

## Load the data into a lake
Data Factory continues has 30+ connectors to enable you to load data from hybrid and heterogeneous environments into Azure.  See [Performance and Tuning Guide](copy-activity-performance.md) for the latest performance results from internal testing and tuning suggestions. Additionally, we have recently enabled High Availability and Scalability for the self-hosted Integration Runtime that you install in a private network environment to addressing large tier-1 enterprise customer requirements for better availability and scalability.

## Top-level concepts in version 2
An Azure subscription may have one or more Azure Data Factory instances (or data factories). Azure Data Factory is composed of four key components that work together to provide the platform on which you can compose data-driven workflows with steps to move and transform data.

### Pipeline
A data factory may have one or more pipelines. Pipeline is a logical grouping of activities to perform a unit of work. Together, the activities in a pipeline perform a task. For example, a pipeline could contain a group of activities that ingests data from an Azure blob, and then run a Hive query on an HDInsight cluster to partition the data. The benefit of this is that the pipeline allows you to manage the activities as a set instead of each one individually. The activities in a pipeline can be chained together to operate sequentially or can operate independently in parallel

### Activity
Activities represent a processing step in a pipeline. For example, you may use a Copy activity to copy data from one data store to another data store. Similarly, you may use a Hive activity, which runs a Hive query on an Azure HDInsight cluster to transform or analyze your data. Data Factory supports two types of activities: data movement activities, data transformation activities, and control activities

### Datasets
Datasets represent data structures within the data stores, which simply point or reference the data you want to use in your activities as inputs or outputs. 

### Linked services
Linked services are much like connection strings, which define the connection information needed for Data Factory to connect to external resources. Think of it this way - a linked service defines the connection to the data source and a dataset represents the structure of the data. For example, an Azure Storage linked service specifies connection string to connect to the Azure Storage account. And, an Azure Blob dataset specifies the blob container and the folder that contains the data.

Linked services are used for two purposes in Data Factory:

- To represent a **data store** including, but not limited to, an on-premises SQL Server, Oracle database, file share, or an Azure Blob Storage account. For a list of supported data stores, see the [copy activity](copy-activity-overview.md) article.
- To represent a **compute resource** that can host the execution of an activity. For example, the HDInsightHive activity runs on an HDInsight Hadoop cluster. For a list of transformation activities and supported compute environments, See [transform data](transform-data.md) article.

### Triggers
Triggers represent the unit of processing that determines when a pipeline execution needs to be kicked off. There are different types of triggers for different types of events; for preview, we support wall-clock scheduler trigger. 


### Pipeline Runs
A pipeline run is an instance of the pipeline execution. Pipeline Runs are typically instantiated by passing the arguments to the parameters defined in pipelines. The arguments can be passed manually or within the trigger definition

### Parameters
Parameters are key-value pairs of read-only configuration.  Parameters are defined in the pipeline and the arguments for the defined parameters are passed during execution from the run context created by a trigger or a pipeline executed manually. Activities within the pipeline consume the parameter values.
A Dataset is a strongly typed parameter and a reusable/referenceable entity. An activity can reference datasets and can consume the properties defined in the Dataset definition

A linked service is also a strongly typed parameter containing the connection information to either a data store or a compute environment. It is also a reusable/referenceable entity.

### Control Flow
Orchestration of pipeline activities that includes chaining activities in a sequence, branching, and parameters that can be defined at the pipeline level and arguments passed while invoking the pipeline on demand or from a trigger. Also includes custom state passing and looping containers, that is, For-each iterators.



For more information about Data Factory concepts, see the following articles:

- [Dataset and linked services](concepts-datasets-linked-services.md)
- [Pipelines and activities](concepts-pipelines-activities.md)
- [Integration runtime](concepts-integration-runtime.md)

## Next steps
Learn how to create a data factory by following step-by-step instructions in the **Quickstart: create a data factory using**: [PowerShell](quickstart-create-data-factory-powershell.md), [.NET](quickstart-create-data-factory-dot-net.md), [Python](quickstart-create-data-factory-python.md), [REST API](quickstart-create-data-factory-rest-api.md), and [Azure portal](quickstart-create-data-factory-portal.md). 
