---
title: 'Azure Data Factory: Frequently asked questions | Microsoft Docs'
description: Get answers to frequently asked questions about Azure Data Factory.
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
# Azure Data Factory FAQ
This article applies to version 2 of the Azure Data Factory service. It provides answers to frequently asked questions about Data Factory.  

> [!NOTE]
> This article applies to version 2 of Data Factory, which is currently in preview. If you are using version 1 of the Data Factory service, which is generally available (GA), see [frequently asked questions for Data Factory version 1](v1/data-factory-faq.md).

## What is Azure Data Factory? 
Data Factory is a fully managed, cloud-based, data-integration service that automates the movement and transformation of data. Like a factory that runs equipment to transform raw materials into finished goods, Azure Data Factory orchestrates existing services that collect raw data and transform it into ready-to-use information. 

By using Azure Data Factory, you can create data-driven workflows to move data between on-premises and cloud data stores. And you can process and transform data by using compute services such as Azure HDInsight, Azure Data Lake Analytics, and SQL Server Integration Services (SSIS) integration runtime. 

With Data Factory, you can execute your data processing either on an Azure-based cloud service or in your own self-hosted compute environment, such as SSIS, SQL Server, or Oracle. After you create a pipeline that performs the action that you need, you can schedule it to run periodically (for example, hourly, daily, or weekly) or trigger the pipeline from an event occurrence. For more information, see [Introduction to Azure Data Factory](introduction.md).

## What’s different in version 2?
Azure Data Factory version 2 builds upon the original Azure Data Factory data movement and transformation service, extending to a broader set of cloud-first data integration scenarios. Azure Data Factory version 2 offers the following capabilities:

- Control flows and scale
- Deploy and run SSIS packages in Azure

Following the version 1 release, we recognized that customers need to design complex, hybrid data-integration scenarios that require both data movement and processing in the cloud, on-premises, and on cloud virtual machines (VMs). These requirements bring a need to transfer and process data within secured virtual network environments and to scale out with on-demand processing power.

As data pipelines are becoming a more critical part of a business analytics strategy, we have observed that these activities require flexible scheduling to support incremental data loads and event-triggered executions. As the complexity increases, so too does the requirement for the service to support common workflow paradigms that include branching, looping, and conditional processing.

With version 2, you can also migrate existing SSIS packages to the cloud. This action lifts and shifts SSIS as an Azure service that's managed within Data Factory, which utilizes a new feature of integration runtime. By spinning up an SSIS integration runtime in version 2, you can execute, manage, monitor, and build SSIS packages in the cloud.

### Control flows and scale 
To support the diverse integration flows and patterns in the modern data warehouse, Data Factory has enabled a new, flexible, data pipeline model that is no longer tied to time-series data. With this release, you can model conditionals, branch in the control flow of a data pipeline, and explicitly pass parameters within and across these flows.

You now have the freedom to model any flow style that's required for data integration and that can be dispatched on demand or repeatedly on a schedule. A few common flows now enabled that were previously not possible are:   

- Control flows:
	- Chain activities in a sequence within a pipeline.
	- Branch activities within a pipeline.
	- Parameters
		- Define parameters at the pipeline level, and pass arguments while you invoke the pipeline on demand or from a trigger.
		- Activities can consume the arguments that are passed to the pipeline.
	- Custom state passing
		- Activity outputs including state can be consumed by a subsequent activity in the pipeline.
	- Looping containers
		- For-each 
- Trigger-based flows:
	- Pipelines can be triggered on demand or by wall-clock time.
- Delta flows:
	- Use parameters and define your high-water mark for delta copy while moving dimension or reference tables from a relational store, either on-premises or in the cloud, to load the data into the lake. 

For more information, see [Tutorial: Control flows](tutorial-control-flow.md).

### Deploy SSIS packages to Azure 
If you want to move your SSIS workloads, you can create a Data Factory version 2 and provision an Azure-SSIS integration runtime. The Azure-SSIS integration runtime is a fully managed cluster of Azure VMs (nodes) that are dedicated to run your SSIS packages in the cloud. For step-by-step instructions, see the [Deploy SSIS packages to Azure](tutorial-deploy-ssis-packages-azure.md) tutorial. 
 

### SDKs
If you are an advanced user and looking for a programmatic interface, version 2 provides a rich set of SDKs that you can use to author, manage, or monitor pipelines by using your favorite IDE.

- **.NET SDK**: The .NET SDK is updated for version 2. 
- **PowerShell**: The PowerShell cmdlets are updated for version 2. The version 2 cmdlets have *DataFactoryV2* in the name. For example, *Get-AzureRmDataFactoryV2*. 
- **Python SDK**: This SDK is new to version 2.
- **REST API**: The REST API is updated for version 2.  

The SDKs that are updated for version 2 are not backward compatible with version 1 clients. 

### Monitoring
Currently, version 2 supports monitoring of data factories by using only SDKs. The portal does not have the support for monitoring version 2 data factories yet. 

## What is integration runtime?
Integration runtime is the compute infrastructure that's used by Azure Data Factory to provide the following data integration capabilities across various network environments:

- **Data movement**: Move data between data stores on a public network and data stores on a private network (on-premises or virtual private network). It provides support for built-in connectors, format conversion, column mapping, and performant and scalable data transfer.
- **Dispatch activities**:  Dispatch and monitor transformation activities that are running on a variety of compute services, such as Azure HDInsight, Azure Machine Learning, Azure SQL Database, SQL Server, and more.
- **Execute SSIS packages**: Natively executes SSIS packages in a managed Azure compute environment.

You can deploy one or many instances of integration runtime as required to move and transform data. Integration runtime can run on an Azure public network or on a private network (on-premises, Azure Virtual Network, or Amazon Web Services virtual private cloud [VPC]). 

For more information, see [Integration runtime in Azure Data Factory](concepts-integration-runtime.md).

## What is the limit on the number of integration runtimes?
There is no hard limit on the number of integration runtime instances you can have in a data factory. There is, however, a limit on the number of VM cores that the integration runtime can use per subscription for SSIS package execution. For more information, see [Data Factory limits](../azure-subscription-service-limits.md#data-factory-limits).

## When should I use version 2 rather than version 1? 
If you are new to Azure Data Factory, start directly with version 2. If you are already using version 1, rebuild your data factories on version 2.

> [!WARNING]
> Version 2 of Data Factory is in preview, and it is not in general availability (GA). Therefore, it does not fall under the same Azure service level agreement (SLA) commitments as version 1 of Data Factory, which is in GA. 

## What are the top-level concepts of version 2?
An Azure subscription can have one or more Azure Data Factory instances (or data factories). Azure Data Factory contains four key components that work together as a platform on which you can compose data-driven workflows with steps to move and transform data.

### Pipelines
A data factory can have one or more pipelines. A pipeline is a logical grouping of activities to perform a unit of work. Together, the activities in a pipeline perform a task. For example, a pipeline can contain a group of activities that ingest data from an Azure blob and then run a Hive query on an HDInsight cluster to partition the data. The benefit is that you can use a pipeline to manage the activities as a set instead of having to manage each activity individually. You can chain together the activities in a pipeline to operate them sequentially, or you can operate them independently, in parallel.

### Activity
Activities represent a processing step in a pipeline. For example, you can use a *Copy* activity to copy data from one data store to another data store. Similarly, you can use a Hive activity, which runs a Hive query on an Azure HDInsight cluster to transform or analyze your data. Data Factory supports three types of activities: data movement activities, data transformation activities, and control activities.

### Data sets
Data sets represent data structures within the data stores, which simply point to or reference the data you want to use in your activities as inputs or outputs. 

### Linked services
Linked services are much like connection strings, which define the connection information needed for Data Factory to connect to external resources. Think of it this way: a linked service defines the connection to the data source, and a data set represents the structure of the data. For example, an Azure Storage linked service specifies the connection string to connect to the Azure Storage account. And an Azure Blob data set specifies the blob container and the folder that contains the data.

Linked services have two purposes in Data Factory:

- To represent a *data store* that includes, but is not limited to, an on-premises SQL Server instance, an Oracle database instance, a file share, or an Azure Blob storage account. For a list of supported data stores, see [Copy Activity in Azure Data Factory](copy-activity-overview.md).
- To represent a *compute resource* that can host the execution of an activity. For example, the HDInsight Hive activity runs on an HDInsight Hadoop cluster. For a list of transformation activities and supported compute environments, see [Transform data in Azure Data Factory](transform-data.md).

### Triggers
Triggers represent units of processing that determine when a pipeline execution is kicked off. There are different types of triggers for different types of events. For preview, we support a wall-clock scheduler trigger. 


### Pipeline runs
A pipeline run is an instance of a pipeline execution. You usually instantiate a pipeline run by passing arguments to the parameters that are defined in the pipeline. You can pass the arguments manually or within the trigger definition.

### Parameters
Parameters are key-value pairs in a read-only configuration. You define parameters in a pipeline, and you pass the arguments for the defined parameters during execution from a run context. The run context is created by a trigger or from a pipeline that you execute manually. Activities within the pipeline consume the parameter values.

A data set is a strongly typed parameter and an entity that you can reuse or reference. An activity can reference data sets, and it can consume the properties that are defined in the data-set definition.

A linked service is also a strongly typed parameter that contains connection information to either a data store or a compute environment. It is also an entity that you can reuse or reference.

### Control flows
Control flows orchestrate pipeline activities that include chaining activities in a sequence, branching, parameters that you define at the pipeline level, and arguments that you pass as you invoke the pipeline on demand or from a trigger. Control flows also include custom-state passing and looping containers (that is, for-each iterators).


For more information about Data Factory concepts, see the following articles:

- [Data set and linked services](concepts-datasets-linked-services.md)
- [Pipelines and activities](concepts-pipelines-activities.md)
- [Integration runtime](concepts-integration-runtime.md)

## What is the pricing model for Data Factory?
For Azure Data Factory pricing details, see [Data Factory pricing details](https://azure.microsoft.com/pricing/details/data-factory/).

## What regions support Azure Data Factory version 2?
Currently, you can create data factories of version 2 in the East US and East US 2 regions. However, a data factory can use integration runtime in another region to move data between data stores, dispatch activities against compute services, or dispatch SSIS packages. For more information, see [Data Factory locations](concepts-integration-runtime.md#integration-runtime-location).

## How can I stay up to date with information about Data Factory?
For the most up-to-date information about Azure Data Factory, go to the following sites:

- [Blog](https://azure.microsoft.com/blog/tag/azure-data-factory/)
- [Documentation home page](/azure/data-factory)
- [Product home page](https://azure.microsoft.com/services/data-factory/)

## Technical deep dive 

### Can version 1 and version 2 pipelines run side by side?
No. Version 2 and version 1 data factories cannot contain entities (for example, linked services, data sets, or pipelines) of the other version.   

### Do I still need to define data sets in version 2?
A data set is no longer a mandatory entity for most activities. It is required for copy, machine learning, lookup, validation, and custom activities that use the schema and other metadata information in the data set for transformation. The rest of the activities no longer require data sets.

### Can I chain two activities without a data set in version 2?
Yes. You can chain activities in version 2 without requiring data sets. You chain activities by using the **dependsOn** property in the JSON definition of your pipeline. 

### Are all the version 1 activities supported in version 2? 
Yes, all version 1 activities are supported in version 2.

### How can I schedule a version 2 pipeline? 
You can use the scheduler trigger to schedule a version 2 pipeline. The trigger uses a wall-clock calendar schedule, and you can use it to schedule pipelines either periodically or by using calendar-based recurrent patterns (for example, weekly on Mondays at 6 PM and Thursdays at 9 PM). For more information, see [Pipeline execution and triggers](concepts-pipeline-execution-triggers.md).

### Can I pass parameters to a pipeline run in version 2?
Yes, parameters are a first-class, top-level concept in version 2. You can define parameters at the pipeline level and pass arguments as you execute the pipeline run on demand or by using a trigger.  

### Can I define default values for the pipeline parameters? 
Yes. You can define default values for the parameters in the pipelines. 

### Can an activity in a pipeline consume arguments that are passed to a pipeline run? 
Yes. Each activity within the pipeline can consume the parameter value that's passed to the pipeline and run with the `@parameter` construct. 

### Can an activity output property be consumed in another activity? 
Yes. An activity output can be consumed in a subsequent activity with the `@activity` construct.
 
### How do I gracefully handle null values in an activity output? 
You can use the `@coalesce` construct in the expressions to handle null values gracefully. 

### Can I use retry and timeout at the activity level in version 2?
Yes. To govern the execution of activities in version 2 as you do in version 1, you can configure retry and timeout at the activity level. 

## Next steps
For step-by-step instructions to create a data factory of version 2, see the following tutorials:

- [Quickstart: Create a data factory](quickstart-create-data-factory-dot-net.md)
- [Tutorial: Copy data in the cloud](tutorial-copy-data-dot-net.md)

