<properties 
	pageTitle="Create/Schedule Pipelines, Chain Activities in Data Factory | Microsoft Azure" 
	description="Learn to create a data pipeline in Azure Data Factory to move and transform data. Create a data driven workflow to produce ready to use information." 
    keywords="data pipeline, data driven workflow"
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
	ms.topic="article"
	ms.date="09/12/2016" 
	ms.author="spelluru"/>

# Pipelines and Activities in Azure Data Factory
This article helps you understand pipelines and activities in Azure Data Factory and use them to construct end-to-end data-driven workflows for your data movement and data processing scenarios.  

> [AZURE.NOTE] This article assumes that you have gone through [Introduction to Azure Data Factory](data-factory-introduction.md). If you do not have hands-on-experience with creating data factories, going through [Build your first data factory](data-factory-build-your-first-pipeline.md) tutorial would help you understand this article better.  

## What is a data pipeline?
**Pipeline** is a grouping of logically related **activities**. It is used to group activities into a unit that performs a task. To understand pipelines better, you need to understand an activity first. 

## What is an activity?
Activities define the actions to perform on your data. Each activity takes zero or more [datasets](data-factory-create-datasets.md) as inputs and produces one or more datasets as output. 

For example, you may use a Copy activity to orchestrate copying data from one data store to another data store. Similarly, you may use a HDInsight Hive activity to run a Hive query on an Azure HDInsight cluster to transform your data. Azure Data Factory provides a wide range of [data transformation](data-factory-data-transformation-activities.md), and [data movement](data-factory-data-movement-activities.md) activities. You may also choose to create a custom .NET activity to run your own code. 

## Sample copy pipeline
In the following sample pipeline, there is one activity of type **Copy** in the **activities** section. In this sample, the [Copy activity](data-factory-data-movement-activities.md) copies data from an Azure Blob storage to an Azure SQL database. 

	{
	  "name": "CopyPipeline",
	  "properties": {
	    "description": "Copy data from a blob to Azure SQL table",
	    "activities": [
	      {
	        "name": "CopyFromBlobToSQL",
	        "type": "Copy",
	        "inputs": [
	          {
	            "name": "InputDataset"
	          }
	        ],
	        "outputs": [
	          {
	            "name": "OutputDataset"
	          }
	        ],
	        "typeProperties": {
	          "source": {
	            "type": "BlobSource"
	          },
	          "sink": {
	            "type": "SqlSink",
	            "writeBatchSize": 10000,
	            "writeBatchTimeout": "60:00:00"
	          }
	        },
	        "Policy": {
	          "concurrency": 1,
	          "executionPriorityOrder": "NewestFirst",
	          "retry": 0,
	          "timeout": "01:00:00"
	        }
	      }
	    ],
	    "start": "2016-07-12T00:00:00Z",
	    "end": "2016-07-13T00:00:00Z"
	  }
	} 

Note the following points:

- In the activities section, there is only one activity whose **type** is set to **Copy**.
- Input for the activity is set to **InputDataset** and output for the activity is set to **OutputDataset**.
- In the **typeProperties** section, **BlobSource** is specified as the source type and **SqlSink** is specified as the sink type.

For a complete walkthrough of creating this pipeline, see [Tutorial: Copy data from Blob Storage to SQL Database](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md). 

## Sample transformation pipeline
In the following sample pipeline, there is one activity of type **HDInsightHive** in the **activities** section. In this sample, the [HDInsight Hive activity](data-factory-hive-activity.md) transforms data from an Azure Blob storage by running a Hive script file on an Azure HDInsight Hadoop cluster. 

	{
	    "name": "TransformPipeline",
	    "properties": {
	        "description": "My first Azure Data Factory pipeline",
	        "activities": [
	            {
	                "type": "HDInsightHive",
	                "typeProperties": {
	                    "scriptPath": "adfgetstarted/script/partitionweblogs.hql",
	                    "scriptLinkedService": "AzureStorageLinkedService",
	                    "defines": {
	                        "inputtable": "wasb://adfgetstarted@<storageaccountname>.blob.core.windows.net/inputdata",
	                        "partitionedtable": "wasb://adfgetstarted@<storageaccountname>.blob.core.windows.net/partitioneddata"
	                    }
	                },
	                "inputs": [
	                    {
	                        "name": "AzureBlobInput"
	                    }
	                ],
	                "outputs": [
	                    {
	                        "name": "AzureBlobOutput"
	                    }
	                ],
	                "policy": {
	                    "concurrency": 1,
	                    "retry": 3
	                },
	                "scheduler": {
	                    "frequency": "Month",
	                    "interval": 1
	                },
	                "name": "RunSampleHiveActivity",
	                "linkedServiceName": "HDInsightOnDemandLinkedService"
	            }
	        ],
	        "start": "2016-04-01T00:00:00Z",
	        "end": "2016-04-02T00:00:00Z",
	        "isPaused": false
	    }
	}

Note the following points: 

- In the activities section, there is only one activity whose **type** is set to **HDInsightHive**.
- The Hive script file, **partitionweblogs.hql**, is stored in the Azure storage account (specified by the scriptLinkedService, called **AzureStorageLinkedService**), and in **script** folder in the container **adfgetstarted**.
- The **defines** section is used to specify the runtime settings that are passed to the hive script as Hive configuration values (e.g ${hiveconf:inputtable}, ${hiveconf:partitionedtable}).

For a complete walkthrough of creating this pipeline, see [Tutorial: Build your first pipeline to process data using Hadoop cluster](data-factory-build-your-first-pipeline.md). 

## Chaining activities
If you have multiple activities in a pipeline and output of an activity is not an input of another activity, the activities may run in parallel if input data slices for the activities are ready. 

You can chain two activities by having the output dataset of one activity as the input dataset of the other activity. The activities can be in the same pipeline or in different pipelines. The second activity executes only when the first one completes successfully. 

For example, consider the following case:
 
1.	Pipeline P1 has Activity A1 that requires external input dataset D1, and produce **output** dataset **D2**.
2.	Pipeline P2 has Activity A2 that requires **input** from dataset **D2**, and produces output dataset D3.
 
In this scenario, the activity A1 runs when the external data is available, and the scheduled availability frequency is reached.  The activity A2 runs when the scheduled slices from D2 become available and the scheduled availability frequency is reached. If there is an error in one of the slices in dataset D2, A2 does not run for that slice until it becomes available.

Diagram View:

![Chaining activities in two pipelines](./media/data-factory-create-pipelines/chaining-two-pipelines.png)

Diagram View with both activities in the same pipeline: 

![Chaining activities in the same pipeline](./media/data-factory-create-pipelines/chaining-one-pipeline.png)

For more information, see [scheduling and execution](#chaining-activities). 

## Scheduling and Execution
So far you have understood what pipelines and activities are. You have also looked at how are they defined and a high-level view of the activities in Azure Data Factory. Now let us look at how they get executed. 

A pipeline is active only between its start time and end time. It is not executed before the start time or after the end time. If the pipeline is paused, it does not get executed irrespective of its start and end time. For a pipeline to run, it should not be paused. In fact, it is not the pipeline that gets executed. It is the activities in the pipeline that get executed. However they do so in the overall context of the pipeline. 

See [Scheduling and Execution](data-factory-scheduling-and-execution.md) to understand how scheduling and execution works in Azure Data Factory.

## Create pipelines
Azure Data Factory provides various mechanisms to author and deploy pipelines (which in turn contain one or more activities in it). 

### Using Azure portal
You can use Data Factory editor in the Azure portal to create a pipeline. See [Get started with Azure Data Factory (Data Factory Editor)](data-factory-build-your-first-pipeline-using-editor.md) for an end-to-end walkthrough. 

### Using Visual Studio 
You can use Visual Studio to author and deploy pipelines to Azure Data Factory. See [Get started with Azure Data Factory (Visual Studio)](data-factory-build-your-first-pipeline-using-vs.md) for an end-to-end walkthrough. 

### Using Azure PowerShell
You can use the Azure PowerShell to create pipelines in Azure Data Factory. Say, you have defined the pipeline JSON in a file at c:\DPWikisample.json. You can upload it to your Azure Data Factory instance as shown in the following example:

	New-AzureRmDataFactoryPipeline -ResourceGroupName ADF -Name DPWikisample -DataFactoryName wikiADF -File c:\DPWikisample.json

See [Get started with Azure Data Factory (Azure PowerShell)](data-factory-build-your-first-pipeline-using-powershell.md) for an end-to-end walkthrough for creating a data factory with a pipeline. 

### Using .NET SDK
You can create and deploy pipeline via .NET SDK too. This mechanism can be used to create pipelines programmatically. For more information, see [Create, manage, and monitor data factories programmatically](data-factory-create-data-factories-programmatically.md). 


### Using Azure Resource Manager template
You can create and deploy pipeline using an Azure Resource Manager template. For more information, see [Get started with Azure Data Factory (Azure Resource Manager)](data-factory-build-your-first-pipeline-using-arm.md). 

### Using REST API
You can create and deploy pipeline using REST APIs too. This mechanism can be used to create pipelines programmatically. For more information, see [Create or Update a Pipeline](https://msdn.microsoft.com/library/azure/dn906741.aspx). 


## Monitor and manage pipelines  
Once a pipeline is deployed, you can manage and monitor your pipelines, slices, and runs. Read more about it here: [Monitor and Manage Pipelines](data-factory-monitor-manage-pipelines.md).


## Pipeline JSON   
Let us take a closer look on how a pipeline is defined in JSON format. The generic structure for a pipeline looks as follows:

	{
	    "name": "PipelineName",
	    "properties": 
	    {
	        "description" : "pipeline description",
	        "activities":
	        [
	
	        ],
			"start": "<start date-time>",
			"end": "<end date-time>"
	    }
	}

The **activities** section can have one or more activities defined within it. Each activity has the following top-level structure:

	{
	    "name": "ActivityName",
	    "description": "description", 
	    "type": "<ActivityType>",
	    "inputs":  "[]",
	    "outputs":  "[]",
	    "linkedServiceName": "MyLinkedService",
	    "typeProperties":
	    {
	
	    },
	    "policy":
	    {
	    }
	    "scheduler":
	    {
	    }
	}

Following table describe the properties within the activity and pipeline JSON definitions:

Tag | Description | Required
--- | ----------- | --------
name | Name of the activity or the pipeline. Specify a name that represents the action that the activity or pipeline is configured to do<br/><ul><li>Maximum number of characters: 260</li><li>Must start with a letter number, or an underscore (_)</li><li>Following characters are not allowed: “.”, “+”, “?”, “/”, “<”,”>”,”*”,”%”,”&”,”:”,”\\”</li></ul> | Yes
description | Text describing what the activity or pipeline is used for | Yes
type | Specifies the type of the activity. See the [Data Movement Activities](data-factory-data-movement-activities.md) and [Data Transformation Activities](data-factory-data-transformation-activities.md) articles for different types of activities. | Yes
inputs | Input tables used by the activity<br/><br/>// one input table<br/>"inputs":  [ { "name": "inputtable1"  } ],<br/><br/>// two input tables <br/>"inputs":  [ { "name": "inputtable1"  }, { "name": "inputtable2"  } ], | Yes
outputs | Output tables used by the activity.// one output table<br/>"outputs":  [ { "name": “outputtable1” } ],<br/><br/>//two output tables<br/>"outputs":  [ { "name": “outputtable1” }, { "name": “outputtable2” }  ], | Yes
linkedServiceName | Name of the linked service used by the activity. <br/><br/>An activity may require that you specify the linked service that links to the required compute environment. | Yes for HDInsight Activity and Azure Machine Learning Batch Scoring Activity <br/><br/>No for all others
typeProperties | Properties in the typeProperties section depend on type of the activity. | No
policy | Policies that affect the run-time behavior of the activity. If it is not specified, default policies are used. | No
start | Start date-time for the pipeline. Must be in [ISO format](http://en.wikipedia.org/wiki/ISO_8601). For example: 2014-10-14T16:32:41Z. <br/><br/>It is possible to specify a local time, for example an EST time. Here is an example: "2016-02-27T06:00:00**-05:00**", which is 6 AM EST.<br/><br/>The start and end properties together specify active period for the pipeline. Output slices are only produced with in this active period. | No<br/><br/>If you specify a value for the end property, you must specify value for the start property.<br/><br/>The start and end times can both be empty to create a pipeline. You must specify both values to set an active period for the pipeline to run. If you do not specify start and end times when creating a pipeline, you can set them using the Set-AzureRmDataFactoryPipelineActivePeriod cmdlet later.
end | End date-time for the pipeline. If specified must be in ISO format. For example: 2014-10-14T17:32:41Z <br/><br/>It is possible to specify a local time, for example an EST time. Here is an example: "2016-02-27T06:00:00**-05:00**", which is 6 AM EST.<br/><br/>To run the pipeline indefinitely, specify 9999-09-09 as the value for the end property. | No <br/><br/>If you specify a value for the start property, you must specify value for the end property.<br/><br/>See notes for the **start** property.
isPaused | If set to true the pipeline does not run. Default value = false. You can use this property to enable or disable. | No 
scheduler | “scheduler” property is used to define desired scheduling for the activity. Its subproperties are the same as the ones in the [availability property in a dataset](data-factory-create-datasets.md#Availability). | No |   
| pipelineMode | The method for scheduling runs for the pipeline. Allowed values are: scheduled (default), onetime.<br/><br/>‘Scheduled’ indicates that the pipeline runs at a specified time interval according to its active period (start and end time). ‘Onetime’ indicates that the pipeline runs only once. Onetime pipelines once created cannot be modified/updated currently. See [Onetime pipeline](data-factory-scheduling-and-execution.md#onetime-pipeline) for details about onetime setting. | No | 
| expirationTime | Duration of time after creation for which the pipeline is valid and should remain provisioned. If it does not have any active, failed, or pending runs, the pipeline is deleted automatically once it reaches the expiration time. | No | 
| datasets | List of datasets to be used by activities defined in the pipeline. This property can be used to define datasets that are specific to this pipeline and not defined within the data factory. Datasets defined within this pipeline can only be used by this pipeline and cannot be shared. See [Scoped datasets](data-factory-create-datasets.md#scoped-datasets) for details.| No |  
 

### Policies
Policies affect the run-time behavior of an activity, specifically when the slice of a table is processed. The following table provides the details.

Property | Permitted values | Default Value | Description
-------- | ----------- | -------------- | ---------------
concurrency | Integer <br/><br/>Max value: 10 | 1 | Number of concurrent executions of the activity.<br/><br/>It determines the number of parallel activity executions that can happen on different slices. For example, if an activity needs to go through a large set of available data, having a larger concurrency value speeds up the data processing. 
executionPriorityOrder | NewestFirst<br/><br/>OldestFirst | OldestFirst | Determines the ordering of data slices that are being processed.<br/><br/>For example, if you have 2 slices (one happening at 4pm, and another one at 5pm), and both are pending execution. If you set the executionPriorityOrder to be NewestFirst, the slice at 5 PM is processed first. Similarly if you set the executionPriorityORder to be OldestFIrst, then the slice at 4 PM is processed. 
retry | Integer<br/><br/>Max value can be 10 | 3 | Number of retries before the data processing for the slice is marked as Failure. Activity execution for a data slice is retried up to the specified retry count. The retry is done as soon as possible after the failure.
timeout | TimeSpan | 00:00:00 | Timeout for the activity. Example: 00:10:00 (implies timeout 10 mins)<br/><br/>If a value is not specified or is 0, the timeout is infinite.<br/><br/>If the data processing time on a slice exceeds the timeout value, it is canceled, and the system attempts to retry the processing. The number of retries depends on the retry property. When timeout occurs, the status is set to TimedOut.
delay | TimeSpan | 00:00:00 | Specify the delay before data processing of the slice starts.<br/><br/>The execution of activity for a data slice is started after the Delay is past the expected execution time.<br/><br/>Example: 00:10:00 (implies delay of 10 mins)
longRetry | Integer<br/><br/>Max value: 10 | 1 | The number of long retry attempts before the slice execution is failed.<br/><br/>longRetry attempts are spaced by longRetryInterval. So if you need to specify a time between retry attempts, use longRetry. If both Retry and longRetry are specified, each longRetry attempt includes Retry attempts and the max number of attempts is Retry * longRetry.<br/><br/>For example, if we have the following settings in the activity policy:<br/>Retry: 3<br/>longRetry: 2<br/>longRetryInterval: 01:00:00<br/><br/>Assume there is only one slice to execute (status is Waiting) and the activity execution fails every time. Initially there would be 3 consecutive execution attempts. After each attempt, the slice status would be Retry. After first 3 attempts are over, the slice status would be LongRetry.<br/><br/>After an hour (that is, longRetryInteval’s value), there would be another set of 3 consecutive execution attempts. After that, the slice status would be Failed and no more retries would be attempted. Hence overall 6 attempts were made.<br/><br/>If any execution succeeds, the slice status would be Ready and no more retries are attempted.<br/><br/>longRetry may be used in situations where dependent data arrives at non-deterministic times or the overall environment is flaky under which data processing occurs. In such cases, doing retries one after another may not help and doing so after an interval of time results in the desired output.<br/><br/>Word of caution: do not set high values for longRetry or longRetryInterval. Typically, higher values imply other systemic issues. 
longRetryInterval | TimeSpan | 00:00:00 | The delay between long retry attempts 


## Next Steps

- Understand [scheduling and execution in Azure Data Factory](data-factory-scheduling-and-execution.md).  
- Read about the [data movement](data-factory-data-movement-activities.md) and [data transformation capabilities](data-factory-data-transformation-activities.md) in Azure Data Factory
- Understand [management and monitoring in Azure Data Factory](data-factory-monitor-manage-pipelines.md).
- [Build and deploy your fist pipeline](data-factory-build-your-first-pipeline.md). 
