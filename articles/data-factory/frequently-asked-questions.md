---
title: Azure Data Factory - Frequently asked questions | Microsoft Docs
description: Frequently asked questions about Azure Data Factory.
services: data-factory
documentationcenter: ''
author: sharonlo101
manager: jhubbard
editor: monicar

ms.assetid: 532dec5a-7261-4770-8f54-bfe527918058
ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/23/2017
ms.author: shlo
---
# Azure Data Factory - Frequently asked questions
This article applies to version 2 of the Azure Data Factory service. It provides a list of frequently asked questions (FAQ), and their answers.  

## What is Azure Data Factory? 
Data Factory is a fully managed cloud-based data integration service that automates the movement and transformation of data. Just like a factory that runs equipment to take raw materials and transform them into finished goods, Azure Data Factory orchestrates existing services that collect raw data and transform it into ready-to-use information. Azure Data Factory allows you to create data-driven workflows to move data between both on-premises and cloud data stores as well as process/transform data using compute services such as Azure HDInsight, Azure Data Lake Analytics and SQL Server Integration Services (SSIS) Integration Runtime. Data Factory gives you an option of executing your data processing either on an Azure-based cloud service or utilize your own self-hosted compute environment such as SSIS, SQL Server, and Oracle. After you create a pipeline that performs the action that you need, you can schedule it to run periodically (hourly, daily, weekly etc.) or trigger the pipeline from on an event occurrence. For more information, see [Introduction to Azure Data Factory](introduction.md).

## What’s different in version 2?
Azure Data Factory version 2 builds upon the original Azure Data Factory data movement and transformation service, extending to a broader set of cloud-first data integration scenarios. Azure Data Factory Version 2 brings the following capabilities:

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
If you want to move your SSIS workloads, you can create a data factory version 2, and provision an Azure-SSIS Integration Runtime (IR). The Azure-SSIS IR is a fully managed cluster of Azure VMs (nodes) dedicated to run your SSIS packages in the cloud. For step-by-step instructions, see the tutorial: [deploy SSIS packages to Azure](tutorial-deploy-ssis-packages-azure.md). 
 

### SDKs
If you are an advanced user and looking for a programmatic interface, version 2 provides a rich set of SDKs that can be used to author, manage, monitor pipelines using your favorite IDE.

- .NET SDK - The .NET SDK is updated for version 2. 
- PowerShell - The PowerShell cmdlets are updated for version 2. The version 2 cmdlets have **DataFactoryV2** in the name. For example: Get-AzureRmDataFactoryV2. 
- Python SDK - This SDK is new to version 2.
- REST API - The REST API is updated for version 2.  

The SDKs that are updated for version 2 are not backward compatible with version 1 clients. 

### Monitoring
Currently, version 2 supports monitoring of data factories by using only SDKs. The portal does not have the support for monitoring version 2 data factories yet. 

## What is Integration Runtime?
The Integration Runtime (IR) is the compute infrastructure used by Azure Data Factory to provide the following data integration capabilities across different network environments:

- **Data movement**: Move data between data stores in public network and data stores in private network (on-premise or virtual private network). It provides support for built-in connectors, format conversion, column mapping, and performant and scalable data transfer.
- **Dispatch activities**:  Dispatch and monitor transformation activities running on a variety of compute services such as Azure HDInsight, Azure Machine Learning, Azure SQL Database, SQL Server, and more.
- **Execute SSIS packages**: Natively executes SQL Server Integration Services (SSIS) packages in a managed Azure compute environment.

You can deploy one or many instances of Integration Runtime as required to move and transform data.  The Integration Runtime can run in Azure public network or in a private network (on premises, Azure Virtual Network, or Amazon Web Services virtual private cloud(VPC)). 

For more information, see [Integration Runtime in Azure Data Factory](concepts-integration-runtime.md).

## What is the limit on the number of integration runtimes?
There are no hard limits on how many Integration Runtimes instances you can have in a data factory. There is however a limit on the number of virtual machine (VM) cores the Integration Runtime can use per subscription for SSIS package execution. For more information, see [Data Factory limits](../azure-subscription-service-limits.md#data-factory-limits).

## When to use version 2 rather than version 1? 
If you are new to Azure Data Factory, start directly with version 2. If you are already using version 1, rebuild your data factories on version 2.

> [!WARNING]
> Version 2 of Data Factory is in preview, not generally available (GA). Therefore, it does not fall under the same Azure service level agreement (SLA) commitments as version 1 of Data Factory, which is in GA. 

## What are the top-level concepts of version 2?
An Azure subscription may have one or more Azure Data Factory instances (or data factories). Azure Data Factory is composed of four key components that work together to provide the platform on which you can compose data-driven workflows with steps to move and transform data.

### Pipeline
A data factory may have one or more pipelines. Pipeline is a logical grouping of activities to perform a unit of work. Together, the activities in a pipeline perform a task. For example, a pipeline could contain a group of activities that ingests data from an Azure blob, and then run a Hive query on an HDInsight cluster to partition the data. The benefit of this is that the pipeline allows you to manage the activities as a set instead of each one individually. The activities in a pipeline can be chained together to operate sequentially or can operate independently in parallel

### Activity
Activities represent a processing step in a pipeline. For example, you may use a Copy activity to copy data from one data store to another data store. Similarly, you may use a Hive activity, which runs a Hive query on an Azure HDInsight cluster to transform or analyze your data. Data Factory supports three types of activities: data movement activities, data transformation activities, and control activities

### Datasets
Datasets represent data structures within the data stores, which simply point or reference the data you want to use in your activities as inputs or outputs. 

### Linked services
Linked services are much like connection strings, which define the connection information needed for Data Factory to connect to external resources. Think of it this way - a linked service defines the connection to the data source and a dataset represents the structure of the data. For example, an Azure Storage linked service specifies connection string to connect to the Azure Storage account. And, an Azure Blob dataset specifies the blob container and the folder that contains the data.

Linked services are used for two purposes in Data Factory:

- To represent a **data store** including, but not limited to, an on-premises SQL Server, Oracle database, file share, or an Azure Blob Storage account. For a list of supported data stores, see the [copy activity](copy-activity-overview.md) article.
- To represent a **compute resource** that can host the execution of an activity. For example, the HDInsightHive activity runs on an HDInsight Hadoop cluster. For a list of transformation activities and supported compute environments, See [transform data](transform-data.md) article.

### Triggers
Triggers represent the unit of processing that determines when a pipeline execution needs to be kicked off. There are different types of triggers for different types of events; for preview, we support wall-clock scheduler trigger. 


### Pipeline runs
A pipeline run is an instance of the pipeline execution. Pipeline Runs are typically instantiated by passing the arguments to the parameters defined in pipelines. The arguments can be passed manually or within the trigger definition

### Parameters
Parameters are key-value pairs of read-only configuration.  Parameters are defined in the pipeline and the arguments for the defined parameters are passed during execution from the run context created by a trigger or a pipeline executed manually. Activities within the pipeline consume the parameter values.
A Dataset is a strongly typed parameter and a reusable/referenceable entity. An activity can reference datasets and can consume the properties defined in the Dataset definition

A linked service is also a strongly typed parameter containing the connection information to either a data store or a compute environment. It is also a reusable/referenceable entity.

### Control flow
Orchestration of pipeline activities that includes chaining activities in a sequence, branching, and parameters that can be defined at the pipeline level and arguments passed while invoking the pipeline on demand or from a trigger. Also includes custom state passing and looping containers, that is, For-each iterators.


For more information about Data Factory concepts, see the following articles:

- [Dataset and linked services](concepts-datasets-linked-services.md)
- [Pipelines and activities](concepts-pipelines-activities.md)
- [Integration runtime](concepts-integration-runtime.md)

## What is the pricing model for Data Factory?
See [Data Factory Pricing Details](https://azure.microsoft.com/pricing/details/data-factory/) page for the pricing details for the Azure Data Factory.

## What regions support Azure Data Factory version 2?
Currently, you can create data factories of version 2 in East US and East US 2 regions. However, a data factory can use Integration Runtime in another region to move data between data stores, dispatch activities against compute services, or dispatch SSIS packages.  For more information, see [Data Factory locations](concepts-integration-runtime.md#integration-runtime-location).

## How can I stay up to date with information about Data Factory?
Use the following sites to stay up to date with information about Azure Data Factory:

- [Blog](https://azure.microsoft.com/blog/tag/azure-data-factory/)
- [Documentation home page](/azure/data-factory)
- [Product home page](https://azure.microsoft.com/services/data-factory/)

## Technical deep dive 

### Can I have version 1 and version 2 pipelines run side by side?
No. Version 2 or version 1 data factories cannot have entities (linked services, datasets, pipelines, etc.) of other version.   

### Do I still need to define datasets in version 2?
Dataset is no longer a mandatory entity for most activities. It is required for Copy, Machine Learning, Lookup, Validation, and custom activities that use the schema and other metadata information in the Dataset for transformation. The rest of the activities do not require datasets any more.

### Can I chain two activities without a dataset in version 2?
Yes. You can chain together activities in version 2 without requiring Datasets. You chain activities by using the **dependsOn** property in the JSON definition of your pipeline. 

### Are all the version 1 activities supported in version 2? 
Yes, all the version 1 activities are supported

### How can I schedule a version 2 pipeline? 
You can use the scheduler trigger to schedule a version 2 pipeline. It uses a wall-clock calendar schedule and enables users to schedule pipelines either periodically or using calendar-based recurrent patterns (for example, weekly Mondays @ 6 PM and Thursdays @ 9 PM). For more information, see [Pipeline execution and triggers](concepts-pipeline-execution-triggers.md).

### Can I pass parameters to a pipeline run in version 2?
Yes, parameters are first class top-level concept in version 2. You can define parameters at the pipeline level and pass arguments while executing the pipeline run on-demand or by using a trigger.  

### Can I define default values for the pipeline parameters? 
Yes. You can define default values for the parameters in the pipelines. 

### Can an activity in a pipeline consume arguments passed to a pipeline run? 
Yes. Each activity within the pipeline can consume the parameter value passed to the pipeline run with the `@parameter` construct. 

### Can an activity output property be consumed in another activity? 
Yes. An activity output can be consumed in a subsequent activity with the @activity construct.
 
### How do I gracefully handle null values in an activity output? 
You can use the `@coalesce` construct in the expressions to handle null values gracefully. 

### Can I use retries, timeouts at the activity level in version 2?
Yes. You can configure retry and timeout at the activity level to govern the execution of activities in version 2 like in version 1. 

## Next steps
For step-by-step instructions to create a data factory of version 2, see the following tutorials:

- [Quickstart: create a data factory](quickstart-create-data-factory-dot-net.md)
- [Tutorial: copy data in cloud](tutorial-copy-data-dot-net.md)

