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
ms.date: 08/10/2017
ms.author: shlo

---
# Introduction to Azure Data Factory 
> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1 - GA](v1/data-factory-introduction.md)
> * [Version 2 - Preview](introduction.md)

Raw, unorganized data stored in relational, non-relational, and other storage systems do not have the proper context or meaning on their own to provide meaningful insights to analysts, data scientists, and business decision makers. What is needed is a service that can enable orchestrating and operationalizing  hybrid data pipelines to refine these enormous stores of raw data into actionable  business insights. Azure Data Factory is a managed cloud service  built for these complex hybrid extract-transform-load (ETL), extract-load-transform(ELT), and data integration projects.

An example scenario is a gaming company that collects petabytes of game  logs produced by games in the cloud. It wants to analyze these logs to gain insights in to customer preferences, demographics, usage behavior etc. to identify up-sell and cross-sell opportunities, to develop  new compelling features,  to drive business growth and provide a better experience to customers.

To analyze these logs, the company needs to use the reference data such as customer information, game information, marketing campaign information that is in an on-premises data store. Therefore, the company wants to ingest log data from the cloud data store and reference data from the on-premises data store. Then, process the data by using Hive and Python in Hadoop & Spark in the cloud (HDInsight) and publish the results into a cloud data warehouse such as Azure SQL Data Warehouse or an on-premises data store such as SQL Server. This workflow is to be automated, monitored, and managed on a daily schedule and executed when files land in a blob store container.

What is needed is a platform that allows the company to create a workflow that can ingest, dispatch, manage, and monitor hybrid data for transformation, processing, and machine learning by using existing compute services such as Hadoop, Spark, Azure Machine Learning, and SQL Server in order to organize raw data into meaningful data stores and data lakes for making better business decisions.

![top-level view of Data Factory](media/introduction/big-picture.png)

> [!NOTE]
> This article applies to version 2 of Data Factory, which is currently in preview. If you are using version 1 of the Data Factory service, which is generally available (GA), see [Introduction to Data Factory version 1](v1/data-factory-introduction.md).

## How does it work?
The pipelines (data-driven workflows) in Azure Data Factory typically perform the following four steps:

![Four steps of a data-driven workflow](media/introduction/four-steps-of-a-workflow.png)

### Connect and collect
Enterprises have data of various types located in disparate sources on-premises, in the cloud, structured, unstructured, and semi-structured, all arriving at different intervals and speeds. The first step in building an information production system is to connect to all the required sources of data and processing, such as software-as-a-service (SaaS) services, databases, file shares, FTP web services, and move the data as-needed to a centralized location for subsequent processing.

Without Data Factory, enterprises must build custom data movement components or write custom services to integrate these data sources and processing. It is expensive and hard to integrate and maintain such systems, and it often lacks the enterprise grade monitoring and alerting, and the controls that a fully managed service can offer.

With Data Factory, you can use the [Copy Activity](copy-activity-overview.md) in a data pipeline to move data from both on-premises and cloud source data stores to a centralization data store in the cloud for further analysis. For example, you can collect data in an Azure Data Lake Store and transform the data later by using an Azure Data Lake Analytics compute service. Or, collect data in an Azure Blob Storage and transform data later by using an Azure HDInsight Hadoop cluster.

### Transform and enrich
Once data is present in a centralized data store in the cloud, you want the collected data to be processed or transformed by using compute services such as HDInsight Hadoop, Spark, Data Lake Analytics, and Machine Learning. You want to reliably produce transformed data on a maintainable and controlled schedule to feed production environments with trusted data.

### Publish
Now that the raw data has been refined into business-ready consumable form, you load the data into Azure Data Warehouse, Azure SQL DB, Azure CosmosDB, or whichever analytics engine that your business users can point to from their business intelligence tools.

### Monitor
After you have successfully built and deployed your data integration pipeline, providing business value from refined data, you want to monitor the scheduled activities and pipelines for success & failure rates. Azure Data Factory has built-in support for pipeline monitoring via Azure Monitor, API, PowerShell, OMS, and health panels on the Azure portal.

## New capabilities in version 2
Azure Data Factory version 2 builds upon the original Azure Data Factory data movement and transformation service, extending to a broad set of cloud-first data integration scenarios. Following the version 1 release, we recognized the customer need to design complex hybrid data integration scenarios that required both data movement and processing in the cloud, on premises and in cloud VMs. Those requirements bring a need to transfer and process data within secured VNET environments and to scale out with on-demand processing power.

As data pipelines become a critical part of a business analytics strategy, business requirements change & expand, requiring operational support including monitoring and managing to ensure business continuity. We have witnessed these critical data activities that support business functions require flexible scheduling to support nightly incremental data loads and on-demand event-triggered executions. Lastly, as the complexities of those orchestrations increases, so too does the requirement for the service to support common workflow paradigms including branching, looping and conditional processing. 

With version 2, you can also migrate existing SQL Server Integration Services (SSIS)  packages to the cloud to lift & shift SSIS as an Azure service managed within ADF utilizing a new feature called “Integration Runtimes” or IR. By spinning-up an SSIS IR in the version 2 preview, you have the ability to execute, manage, monitor, and build SSIS packages in the cloud.

### Control flow and scale 
To support the diverse integration flows and patterns in the modern data warehouse, Data Factory has enabled a new flexible data pipeline model that is no longer tied with time-series data. With this release, you can model conditionals, and branching in the control flow of a data pipeline and explicitly pass parameters within and across these flows.  

You now have the freedom to model any flow style required for their data integration and be dispatched on demand or repeatedly on a clock schedule. A few common flows now enabled that were previously not possible are:  

- Control Flow:
	- Chaining activities in a sequence within a pipeline
	- Branching of activities within a pipeline
		- OnSuccess of a previous activity run
		- OnFailure of a previous activity run
		- OnCompletion of a previous activity run
		- Conditional branching based on an expression
	- Parameters
		- Parameters can be defined at the Pipeline level and arguments passed while invoking the pipeline on demand or from a trigger
		- Activities can consume the arguments passed to the pipeline
	- Custom state passing
		- Activity outputs including state can be consumed by a subsequent activity in the pipeline
	- Looping Containers
		- For-each, Do-while iterators 
- Trigger based flows
	- Pipelines can be triggered by on-demand or wall-clock time
- Delta flows
	- Use parameters and define your high-water mark for delta copy while moving dimension or reference tables from a relational store either on premises or in the cloud to load the data into the lake 
 
## Rich cross platform SDKs
If you are an advanced user and looking for a programmatic interface, version 2 provides a rich set of SDKs that can be used to author, manage, monitor pipelines using your favorite IDE. 

- .NET SDK
- PowerShell
- Python SDK

You can also use REST APIs to create data factories. 

## Monitor and manage 
You can now monitor and manage on demand, trigger based and clock driven custom flows in an efficient and effective manner. Cancel existing tasks, see failures at a glance, drill down to get detailed error messages, and debug the issues all from a single pane of glass without context switching or navigating back and forth between screens. 
 
## Load the data into lake
Data Factory continues has 30+ connectors to enable you to load data from hybrid and heterogeneous environments into Azure.  See [Performance and Tuning Guide](copy-activity-performance.md) for the latest performance results from internal testing and tuning suggestions. Additionally, we have recently enabled High Availability and Scalability for the self-hosted Integration Runtime that you install in a private network environment to addressing large tier-1 enterprise customer requirements for better availability and scalability.

## Concepts
Name | Description
---- | ----------- 
Triggers | Triggers represent the unit of processing that determines when a pipeline execution needs to be kicked off. 3 kinds of Triggers: On Demand, Wall Clock Schedule, Event Based. For preview, we are only supporting schedule-based triggers. 
Pipelines | Pipeline is a logical grouping of activities to perform a unit of work. The activities in a pipeline can be chained together to operate sequentially or can operate independently in parallel 
Activities | Activities represent a processing step in a pipeline. It can be a data transformation step (Hive, Pig, ML Batch Scoring etc.) or an action (Send Email, Terminate flow etc.) 
Runs | A Run is an instance of the pipeline execution. Pipeline Runs are typically instantiated by passing the arguments to the parameters defined in the Pipelines. The arguments can be passed manually or properties created by the Triggers 
Parameters | Parameters are name-value pairs of read-only configuration.  Parameters are defined in the pipeline and the arguments for the defined parameters are passed during execution from the run context created by a Trigger or pipeline executed manually. Activities within the pipeline consume the parameter values.<p>A Dataset is a strongly typed parameter and a reusable/referenceable entity. An activity can reference datasets and can consume the properties defined in the Dataset definition</p><p>A Linked Service is also a strongly typed parameter containing the connection information to either a data store or a compute environment. It is also a reusable/referenceable entity.</p>  
Control Flow | Orchestration of pipeline activities that includes chaining activities in a sequence, branching, conditional branching based on an expression, parameters that can be defined at the pipeline level and arguments passed while invoking the pipeline on demand or from a trigger. Also includes custom state passing and looping containers, that is, For-each, Do-while iterators. 

See the following articles for details on more information about Data Factory concepts:

- [Pipelines and activities](concepts-pipelines-activities.md)
- [Integration runtime](concepts-integration-runtime.md)

## Next steps
See the following tutorials with step-by-step instructions to create data pipelines: 

- [Quickstart: create a data factory using .NET](quickstart-create-data-factory-dot-net.md)
- [Quickstart: create a data factory using PowerShell](quickstart-create-data-factory-powershell.md)
- [Quickstart: create a data factory using REST API](quickstart-create-data-factory-rest-api.md)
- [Quickstart: create a data factory using Azure portal](quickstart-create-data-factory-portal.md)
