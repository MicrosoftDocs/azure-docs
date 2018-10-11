---
title: 'Azure Data Factory: Frequently asked questions | Microsoft Docs'
description: Get answers to frequently asked questions about Azure Data Factory.
services: data-factory
documentationcenter: ''
author: sharonlo101
manager: craigg


ms.assetid: 532dec5a-7261-4770-8f54-bfe527918058
ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 06/27/2018
ms.author: shlo
---
# Azure Data Factory FAQ
This article provides answers to frequently asked questions about Azure Data Factory.  

## What is Azure Data Factory? 
Data Factory is a fully managed, cloud-based, data-integration service that automates the movement and transformation of data. Like a factory that runs equipment to transform raw materials into finished goods, Azure Data Factory orchestrates existing services that collect raw data and transform it into ready-to-use information. 

By using Azure Data Factory, you can create data-driven workflows to move data between on-premises and cloud data stores. And you can process and transform data by using compute services such as Azure HDInsight, Azure Data Lake Analytics, and SQL Server Integration Services (SSIS) integration runtime. 

With Data Factory, you can execute your data processing either on an Azure-based cloud service or in your own self-hosted compute environment, such as SSIS, SQL Server, or Oracle. After you create a pipeline that performs the action that you need, you can schedule it to run periodically (for example, hourly, daily, or weekly), time window scheduling or trigger the pipeline from an event occurrence. For more information, see [Introduction to Azure Data Factory](introduction.md).

### Control flows and scale 
To support the diverse integration flows and patterns in the modern data warehouse, Data Factory enables flexible data pipeline modeling that includes full control flow programming paradigms including conditional execution, branching in data pipelines, and explicitly pass parameters within and across these flows. Control Flow also encompasses transforming data through activity dispatch to external execution engines and data flow capabilities, including data movement at scale, via the Copy Activity.

Data Factory provides freedom to model any flow style that's required for data integration and that can be dispatched on demand or repeatedly on a schedule. A few common flows that this model enables are:   

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

### Transform your data at scale with code free pipelines
The new browser-based tooling experience provides code-free pipeline authoring and deployment with a modern, interactive web-based experience.

For visual data developers and data engineers, the ADF Web UI is the code-free design environment that you will use to build pipelines. It is fully integrated with Visual Studio Online Git and provides integration for CI/CD and iterative development with debugging options.

### Rich cross platform SDKs for advanced users
If you are an advanced user and looking for a programmatic interface, ADF V2 provides a rich set of SDKs that can be leveraged to author, manage, monitor pipelines using your favorite IDE
1.	Python SDK
2.	Powershell CLI
3.	C# SDK
Users can also leverage the documented REST APIs to interface with ADF V2

### Iterative development and debugging using visual tools
Azure Data Factory (ADF) visual tools allow you to do iterative development and debugging. You can create your pipelines and do test runs using the Debug capability in the pipeline canvas without writing a single line of code. You can view the results of your test runs in the Output window of your pipeline canvas. Once your test run succeeds, you can add more activities to your pipeline and continue debugging in an iterative manner. You can also Cancel your test runs once they are in-progress. You are not required to publish your changes to the data factory service before clicking Debug. This is helpful in scenarios where you want to make sure that the new additions or changes work as expected before you update your data factory workflows in dev, test, or prod environments. 

### Deploy SSIS packages to Azure 
If you want to move your SSIS workloads, you can create a Data Factory and provision an Azure-SSIS integration runtime. The Azure-SSIS integration runtime is a fully managed cluster of Azure VMs (nodes) that are dedicated to run your SSIS packages in the cloud. For step-by-step instructions, see the [Deploy SSIS packages to Azure](tutorial-create-azure-ssis-runtime-portal.md) tutorial. 
 
### SDKs
If you are an advanced user and looking for a programmatic interface, ADF provides a rich set of SDKs that you can use to author, manage, or monitor pipelines by using your favorite IDE. Language support includes .NET, PowerShell, Python, and REST.

### Monitoring
You can monitor your Data Factories via PowerShell, SDK, or the Visual Monitoring Tools in the browser user interface. You can monitor and manage on demand, trigger based and clock driven custom flows in an efficient and effective manner. Cancel existing tasks, see failures at a glance, drill down to get detailed error messages, and debug the issues all from a single pane of glass without context switching or navigating back and forth between screens. 

### New features for SSIS in ADF
Since the initial Public Preview release in 2017, Data Factory has added the following features for SSIS:

-	Support for three more configurations/variants of Azure SQL Database (DB) to host SSIS catalog of projects/packages (SSISDB):
-	Azure SQL DB with VNet service endpoints
-	Managed Instance (MI)
-	Elastic pool
-	Support for Azure Resource Manager Virtual Network (VNet) on top of Classic VNet that will be deprecated in the future – This lets you inject/join your Azure-SSIS Integration Runtime (IR) to a VNet that is configured for Azure SQL DB with VNet service endpoints/MI/on-premises data access, see:
https://docs.microsoft.com/azure/data-factory/join-azure-ssis-integration-runtime-virtual-network 
-	Support for Azure Active Directory (AAD) authentication on top of SQL authentication to connect to your SSISDB - This lets you use AAD authentication with your ADF managed identity for Azure resources
-	Support for bringing your own on-premises SQL Server license to earn substantial cost savings from Azure Hybrid Benefit (AHB) option
-	Support for Enterprise Edition of Azure-SSIS IR that lets you use advanced/premium features, custom setup to install additional components/extensions, and 3rd party ecosystem, see: 
https://blogs.msdn.microsoft.com/ssis/2018/04/27/enterprise-edition-custom-setup-and-3rd-party-extensibility-for-ssis-in-adf/ 
-	Deeper integration of SSIS in ADF that lets you invoke/trigger first-class Execute SSIS Package activities in ADF pipelines and schedule them via SSMS, see:
https://blogs.msdn.microsoft.com/ssis/2018/05/23/modernize-and-extend-your-etlelt-workflows-with-ssis-activities-in-adf-pipelines/ 


## What is integration runtime?
Integration runtime is the compute infrastructure that's used by Azure Data Factory to provide the following data integration capabilities across various network environments:

- **Data movement**: For data movement, Integration Runtime moves the data between the source and destination data stores, while providing support for built-in connectors, format conversion, column mapping, and performant and scalable data transfer.
- **Dispatch activities**: For transformation, Integration Runtime provide capability to natively execute SSIS packages.
- **Execute SSIS packages**: Natively executes SSIS packages in a managed Azure compute environment. Integration Runtime also supports dispatching and monitoring transformation activities running on a variety of compute services such as Azure HDInsight, Azure Machine Learning, Azure SQL Database, SQL Server, and more.

You can deploy one or many instances of integration runtime as required to move and transform data. Integration runtime can run on an Azure public network or on a private network (on-premises, Azure Virtual Network, or Amazon Web Services virtual private cloud [VPC]). 

For more information, see [Integration runtime in Azure Data Factory](concepts-integration-runtime.md).

## What is the limit on the number of integration runtimes?
There is no hard limit on the number of integration runtime instances you can have in a data factory. There is, however, a limit on the number of VM cores that the integration runtime can use per subscription for SSIS package execution. For more information, see [Data Factory limits](../azure-subscription-service-limits.md#data-factory-limits).

## What are the top-level concepts of Azure Data Factory?
An Azure subscription can have one or more Azure Data Factory instances (or data factories). Azure Data Factory contains four key components that work together as a platform on which you can compose data-driven workflows with steps to move and transform data.

### Pipelines
A data factory can have one or more pipelines. A pipeline is a logical grouping of activities to perform a unit of work. Together, the activities in a pipeline perform a task. For example, a pipeline can contain a group of activities that ingest data from an Azure blob and then run a Hive query on an HDInsight cluster to partition the data. The benefit is that you can use a pipeline to manage the activities as a set instead of having to manage each activity individually. You can chain together the activities in a pipeline to operate them sequentially, or you can operate them independently, in parallel.

### Activity
Activities represent a processing step in a pipeline. For example, you can use a *Copy* activity to copy data from one data store to another data store. Similarly, you can use a Hive activity, which runs a Hive query on an Azure HDInsight cluster to transform or analyze your data. Data Factory supports three types of activities: data movement activities, data transformation activities, and control activities.

### Datasets
Datasets represent data structures within the data stores, which simply point to or reference the data you want to use in your activities as inputs or outputs. 

### Linked services
Linked services are much like connection strings, which define the connection information needed for Data Factory to connect to external resources. Think of it this way: a linked service defines the connection to the data source, and a data set represents the structure of the data. For example, an Azure Storage linked service specifies the connection string to connect to the Azure Storage account. And an Azure Blob data set specifies the blob container and the folder that contains the data.

Linked services have two purposes in Data Factory:

- To represent a *data store* that includes, but is not limited to, an on-premises SQL Server instance, an Oracle database instance, a file share, or an Azure Blob storage account. For a list of supported data stores, see [Copy Activity in Azure Data Factory](copy-activity-overview.md).
- To represent a *compute resource* that can host the execution of an activity. For example, the HDInsight Hive activity runs on an HDInsight Hadoop cluster. For a list of transformation activities and supported compute environments, see [Transform data in Azure Data Factory](transform-data.md).

### Triggers
Triggers represent units of processing that determine when a pipeline execution is kicked off. There are different types of triggers for different types of events. 

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

## How can I stay up-to-date with information about Data Factory?
For the most up-to-date information about Azure Data Factory, go to the following sites:

- [Blog](https://azure.microsoft.com/blog/tag/azure-data-factory/)
- [Documentation home page](/azure/data-factory)
- [Product home page](https://azure.microsoft.com/services/data-factory/)

## Technical deep dive 

### How can I schedule a pipeline? 
You can use the scheduler trigger or time window trigger to schedule a pipeline. The trigger uses a wall-clock calendar schedule, and you can use it to schedule pipelines either periodically or by using calendar-based recurrent patterns (for example, weekly on Mondays at 6 PM and Thursdays at 9 PM). For more information, see [Pipeline execution and triggers](concepts-pipeline-execution-triggers.md).

### Can I pass parameters to a pipeline run?
Yes, parameters are a first-class, top-level concept in ADF. You can define parameters at the pipeline level and pass arguments as you execute the pipeline run on demand or by using a trigger.  

### Can I define default values for the pipeline parameters? 
Yes. You can define default values for the parameters in the pipelines. 

### Can an activity in a pipeline consume arguments that are passed to a pipeline run? 
Yes. Each activity within the pipeline can consume the parameter value that's passed to the pipeline and run with the `@parameter` construct. 

### Can an activity output property be consumed in another activity? 
Yes. An activity output can be consumed in a subsequent activity with the `@activity` construct.
 
### How do I gracefully handle null values in an activity output? 
You can use the `@coalesce` construct in the expressions to handle null values gracefully. 

## Next steps
For step-by-step instructions to create a data factory, see the following tutorials:

- [Quickstart: Create a data factory](quickstart-create-data-factory-dot-net.md)
- [Tutorial: Copy data in the cloud](tutorial-copy-data-dot-net.md)
