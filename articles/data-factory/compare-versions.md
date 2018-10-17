---
title: Compare Azure Data Factory with Data Factory version 1 | Microsoft Docs
description: This article compares Azure Data Factory with Azure Data Factory version 1.
services: data-factory
documentationcenter: ''
author: kromerm
manager: craigg

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: overview
ms.date: 04/09/2018
ms.author: makromer

---
# Compare Azure Data Factory with Data Factory version 1
This article compares Data Factory with Data Factory version 1. For an introduction to Data Factory, see [Introduction to Data Factory](introduction.md).For an introduction to Data Factory version 1, see [Introduction to Azure Data Factory](v1/data-factory-introduction.md). 

## Feature comparison
The following table compares the features of Data Factory with the features of Data Factory version 1. 

| Feature | Version 1 | Current version | 
| ------- | --------- | --------- | 
| Datasets | A named view of data that references the data that you want to use in your activities as inputs and outputs. Datasets identify data within different data stores, such as tables, files, folders, and documents. For example, an Azure Blob dataset specifies the blob container and folder in Azure Blob storage from which the activity should read the data.<br/><br/>**Availability** defines the processing window slicing model for the dataset (for example, hourly, daily, and so on). | Datasets are the same in the current version. However, you do not need to define **availability** schedules for datasets. You can define a trigger resource that can schedule pipelines from a clock scheduler paradigm. For more information, see [Triggers](concepts-pipeline-execution-triggers.md#triggers) and [Datasets](concepts-datasets-linked-services.md). | 
| Linked services | Linked services are much like connection strings, which define the connection information that's necessary for Data Factory to connect to external resources. | Linked services are the same as in Data Factory V1, but with a new **connectVia** property to utilize the Integration Runtime compute environment of the current version of Data Factory. For more information, see [Integration runtime in Azure Data Factory](concepts-integration-runtime.md) and [Linked service properties for Azure Blob storage](connector-azure-blob-storage.md#linked-service-properties). |
| Pipelines | A data factory can have one or more pipelines. A pipeline is a logical grouping of activities that together perform a task. You use startTime, endTime, and isPaused to schedule and run pipelines. | Pipelines are groups of activities that are performed on data. However, the scheduling of activities in the pipeline has been separated into new trigger resources. You can think of pipelines in the current version of Data Factory more as “workflow units” that you schedule separately via triggers. <br/><br/>Pipelines do not have “windows” of time execution in the current version of Data Factory. The Data Factory V1 concepts of startTime, endTime, and isPaused are no longer present in the current version of Data Factory. For more information, see [Pipeline execution and triggers](concepts-pipeline-execution-triggers.md) and [Pipelines and activities](concepts-pipelines-activities.md). |
| Activities | Activities define actions to perform on your data within a pipeline. Data movement (copy activity) and data transformation activities (such as Hive, Pig, and MapReduce) are supported. | In the current version of Data Factory, activities still are defined actions within a pipelineThe current version of Data Factory introduces new [control flow activities](concepts-pipelines-activities.md#control-activities). You use these activities in a control flow (looping and branching). Data movement and data transformation activities that were supported in V1 are supported in the current version. You can define transformation activities without using datasets in the current version. |
| Hybrid data movement and activity dispatch | Now called Integration Runtime, [Data Management Gateway](v1/data-factory-data-management-gateway.md) supported moving data between on-premises and cloud.| Data Management Gateway is now called Self-Hosted Integration Runtime. It provides the same capability as it did in V1. <br/><br/> The Azure-SSIS Integration Runtime in the current version of Data Factory also supports deploying and running SQL Server Integration Services (SSIS) packages in the cloud. For more information, see [Integration runtime in Azure Data Factory](concepts-integration-runtime.md).|
| Parameters | NA | Parameters are key-value pairs of read-only configuration settings that are defined in pipelines. You can pass arguments for the parameters when you are manually running the pipeline. If you are using a scheduler trigger, the trigger can pass values for the parameters too. Activities within the pipeline consume the parameter values.  |
| Expressions | Data Factory V1 allows you to use functions and system variables in data selection queries and activity/dataset properties. | In the current version of Data Factory, you can use expressions anywhere in a JSON string value. For more information, see [Expressions and functions in the current version of Data Factory](control-flow-expression-language-functions.md).|
| Pipeline runs | NA | A single instance of a pipeline execution. For example, say you have a pipeline that executes at 8 AM, 9 AM, and 10 AM. There would be three separate runs of the pipeline (pipeline runs) in this case. Each pipeline run has a unique pipeline run ID. The pipeline run ID is a GUID that uniquely defines that particular pipeline run. Pipeline runs are typically instantiated by passing arguments to parameters that are defined in the pipelines. |
| Activity runs | NA | An instance of an activity execution within a pipeline. | 
| Trigger runs | NA | An instance of a trigger execution. For more information, see [Triggers](concepts-pipeline-execution-triggers.md). |
| Scheduling | Scheduling is based on pipeline start/end times and dataset availability. | Scheduler trigger or execution via external scheduler. For more information, see [Pipeline execution and triggers](concepts-pipeline-execution-triggers.md). |

The following sections provide more information about the capabilities of the current version. 

## Control flow  
To support diverse integration flows and patterns in the modern data warehouse, the current version of Data Factory has enabled a new flexible data pipeline model that is no longer tied to time-series data. A few common flows that were previously not possible are now enabled. They are described in the following sections.   

### Chaining activities
In V1, you had to configure the output of an activity as an input of another activity to chain them. in the current version, you can chain activities in a sequence within a pipeline. You can use the **dependsOn** property in an activity definition to chain it with an upstream activity. For more information and an example, see [Pipelines and activities](concepts-pipelines-activities.md#multiple-activities-in-a-pipeline) and [Branching and chaining activities](tutorial-control-flow.md). 

### Branching activities
in the current version, you can branch activities within a pipeline. The [If-condition activity](control-flow-if-condition-activity.md) provides the same functionality that an `if` statement provides in programming languages. It evaluates a set of activities when the condition evaluates to `true` and another set of activities when the condition evaluates to `false`. For examples of branching activities, see the [Branching and chaining activities](tutorial-control-flow.md) tutorial.

### Parameters 
You can define parameters at the pipeline level and pass arguments while you're invoking the pipeline on-demand or from a trigger. Activities can consume the arguments that are passed to the pipeline. For more information, see [Pipelines and triggers](concepts-pipeline-execution-triggers.md). 

### Custom state passing
Activity outputs including state can be consumed by a subsequent activity in the pipeline. For example, in the JSON definition of an activity, you can access the output of the previous activity by using the following syntax: `@activity('NameofPreviousActivity').output.value`. By using this feature, you can build workflows where values can pass through activities.

### Looping containers
The [ForEach activity](control-flow-for-each-activity.md) defines a repeating control flow in your pipeline. This activity iterates over a collection and runs specified activities in a loop. The loop implementation of this activity is similar to the Foreach looping structure in programming languages. 

The [Until](control-flow-until-activity.md) activity provides the same functionality that a do-until looping structure provides in programming languages. It runs a set of activities in a loop until the condition that's associated with the activity evaluates to `true`. You can specify a timeout value for the until activity in Data Factory.  

### Trigger-based flows
Pipelines can be triggered by on-demand or wall-clock time. The [pipelines and triggers](concepts-pipeline-execution-triggers.md) article has detailed information about triggers. 

### Invoking a pipeline from another pipeline
The [Execute Pipeline activity](control-flow-execute-pipeline-activity.md) allows a Data Factory pipeline to invoke another pipeline.

### Delta flows
A key use case in ETL patterns is “delta loads,” in which only data that has changed since the last iteration of a pipeline is loaded. New capabilities in the current version, such as [lookup activity](control-flow-lookup-activity.md), flexible scheduling, and control flow, enable this use case in a natural way. For a tutorial with step-by-step instructions, see [Tutorial: Incremental copy](tutorial-incremental-copy-powershell.md).

### Other control flow activities
Following are a few more control flow activities that are supported by the current version of Data Factory. 

Control activity | Description
---------------- | -----------
[ForEach activity](control-flow-for-each-activity.md) | Defines a repeating control flow in your pipeline. This activity is used to iterate over a collection and runs specified activities in a loop. The loop implementation of this activity is similar to Foreach looping structure in programming languages.
[Web activity](control-flow-web-activity.md) | Calls a custom REST endpoint from a Data Factory pipeline. You can pass datasets and linked services to be consumed and accessed by the activity. 
[Lookup activity](control-flow-lookup-activity.md) | Reads or looks up a record or table name value from any external source. This output can further be referenced by succeeding activities. 
[Get metadata activity](control-flow-get-metadata-activity.md) | Retrieves the metadata of any data in Azure Data Factory. 
[Wait activity](control-flow-wait-activity.md) | Pauses the pipeline for a specified period of time.

## Deploy SSIS packages to Azure 
You use Azure-SSIS if you want to move your SSIS workloads to the cloud, create a data factory by using the current version, and provision an Azure-SSIS Integration Runtime.

The Azure-SSIS Integration Runtime is a fully managed cluster of Azure VMs (nodes) that are dedicated to running your SSIS packages in the cloud. After you provision Azure-SSIS Integration Runtime, you can use the same tools that you have been using to deploy SSIS packages to an on-premises SSIS environment. 

For example, you can use SQL Server Data Tools or SQL Server Management Studio to deploy SSIS packages to this runtime on Azure. For step-by-step instructions, see the tutorial [Deploy SQL Server integration services packages to Azure](tutorial-create-azure-ssis-runtime-portal.md). 

## Flexible scheduling
In the current version of Data Factory, you do not need to define dataset availability schedules. You can define a trigger resource that can schedule pipelines from a clock scheduler paradigm. You can also pass parameters to pipelines from a trigger for a flexible scheduling and execution model. 

Pipelines do not have “windows” of time execution in the current version of Data Factory. The Data Factory V1 concepts of startTime, endTime, and isPaused don't exist in the current version of Data Factory. For more information about how to build and then schedule a pipeline in the current version of Data Factory, see [Pipeline execution and triggers](concepts-pipeline-execution-triggers.md).

## Support for more data stores
The current version supports the copying of data to and from more data stores than V1. For a list of supported data stores, see the following articles:

- [Version 1 - supported data stores](v1/data-factory-data-movement-activities.md#supported-data-stores-and-formats)
- [Current version - supported data stores](copy-activity-overview.md#supported-data-stores-and-formats)

## Support for on-demand Spark cluster
The current version supports the creation of an on-demand Azure HDInsight Spark cluster. To create an on-demand Spark cluster, specify the cluster type as Spark in your on-demand, HDInsight linked service definition. Then you can configure the Spark activity in your pipeline to use this linked service. 

At runtime, when the activity is executed, the Data Factory service automatically creates the Spark cluster for you. For more information, see the following articles:

- [Spark Activity in the current version of Data Factory](transform-data-using-spark.md)
- [Azure HDInsight on-demand linked service](compute-linked-services.md#azure-hdinsight-on-demand-linked-service)

## Custom activities
In V1, you implement (custom) DotNet activity code by creating a .NET class library project with a class that implements the Execute method of the IDotNetActivity interface. Therefore, you need to write your custom code in .NET Framework 4.5.2 and run it on Windows-based Azure Batch Pool nodes. 

In a custom activity in the current version, you don't have to implement a .NET interface. You can directly run commands, scripts, and your own custom code compiled as an executable. 

For more information, see [Difference between custom activity in Data Factory and version 1](transform-data-using-dotnet-custom-activity.md#compare-v2-v1).

## SDKs
 the current version of Data Factory provides a richer set of SDKs that can be used to author, manage, and monitor pipelines.

- **.NET SDK**: The .NET SDK is updated in the current version.

- **PowerShell**: The PowerShell cmdlets are updated in the current version. The cmdlets for the current version have **DataFactoryV2** in the name, for example: Get-AzureRmDataFactoryV2. 

- **Python SDK**: This SDK is new in the current version.

- **REST API**: The REST API is updated in the current version. 

The SDKs that are updated in the current version are not backward-compatible with V1 clients. 

## Authoring experience

| &nbsp; | V2 | V1 |
| ------ | -- | -- | 
| Azure portal | [Yes](quickstart-create-data-factory-portal.md) | [Yes](data-factory-build-your-first-pipeline-using-editor.md) |
| Azure PowerShell | [Yes](quickstart-create-data-factory-powershell.md) | [Yes](data-factory-build-your-first-pipeline-using-powershell.md) |
| .NET SDK | [Yes](quickstart-create-data-factory-dot-net.md) | [Yes](data-factory-build-your-first-pipeline-using-vs.md) |
| REST API | [Yes](quickstart-create-data-factory-rest-api.md) | [Yes](data-factory-build-your-first-pipeline-using-rest-api.md) |
| Python SDK | [Yes](quickstart-create-data-factory-python.md) | No |
| Resource Manager template | [Yes](quickstart-create-data-factory-resource-manager-template.md) | [Yes](data-factory-build-your-first-pipeline-using-arm.md) | 

## Roles and permissions

The Data Factory version 1 Contributor role can be used to create and manage the current version of Data Factory resources. For more info, see [Data Factory Contributor](../role-based-access-control/built-in-roles.md#data-factory-contributor).

## Monitoring experience
in the current version, you can also monitor data factories by using [Azure Monitor](monitor-using-azure-monitor.md). The new PowerShell cmdlets support monitoring of [integration runtimes](monitor-integration-runtime.md). Both V1 and V2 support visual monitoring via a monitoring application that can be launched from the Azure portal.


## Next steps
Learn how to create a data factory by following step-by-step instructions in the following quickstarts: [PowerShell](quickstart-create-data-factory-powershell.md), [.NET](quickstart-create-data-factory-dot-net.md), [Python](quickstart-create-data-factory-python.md), [REST API](quickstart-create-data-factory-rest-api.md). 
