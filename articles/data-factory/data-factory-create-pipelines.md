<properties 
	pageTitle="Creating pipelines" 
	description="Understand Azure Data Factory pipelines and learn how to create them to move and transform data to produce information that can be used to gain insights" 
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
	ms.date="07/17/2015" 
	ms.author="spelluru"/>

# Understanding Pipelines & Activities
This article will help you understand pipelines and activities in Azure Data Factory and how to leverage them to construct end-to-end flows for your scenario or business. This article assumes you have gone through the [Overview](data-factory-introduction.md) and [Creating Datasets](data-factory-create-datasets.md) articles prior to this.

## What is a pipeline?
A pipeline is a logical grouping of related activities. Activities which when grouped together to make one logical sense can be defined in one pipeline and can be managed together. To understand pipelines better lets understand an activity first and then we will come back to a pipeline. 

### What is an activity?
One uses an Activity in Azure Data Factory to perform a desired action on one’s data. Each activity takes zero/more datasets as inputs and produces one/more datasets as output. An activity is a unit of execution in Azure Data Factory. Scheduling and execution are covered in more detail later in this article. 

For example, you may use a Copy activity to copy data from one dataset to another. Similarly you may use an HDInsight activity to run a Hive query to transform or analyze your data. Azure Data Factory provides data movement and data processing activities out-of-the-box. You may also choose to run your own code.  

Example of an activity: 
	
	{
		"name": "CopyActivity",
	    "description": "Copies data from an on premise SQL Server table to Azure Storage", 
	    "type": "CopyActivity",
	    "inputs":  [ { "name": "MyOnPremTable"  } ],
	    "outputs":  [ { "name": "MyAzureBlob" } ],
	    "transformation":
	    {
	    	"source":
	        {
	        	"type": "SqlSource",
	            "sqlReaderQuery": "select * from MyTable"
			},
	        "sink":
	        {
	        	"type": "BlobSink"
			}
		}
	}

The above activity copies data from SQL Server to Azure Blob Storage.

Now that we have a brief understanding on what an activity is, let’s re-visit the pipeline. 

**A pipeline is a logical grouping of related activities. Activities which when grouped together to make one logical sense can be defined in one pipeline and can be managed together**. A pipeline is the unit of deployment for activities. An output dataset from an activity in a pipeline can be the input dataset to another activity in the same/different pipeline and via this dependencies among activities can be defined.

Should I create 1 pipeline or more? The answer depends on your logical construction of your scenario. Examples:

1. You may define a single pipeline which copies over data from an on premise system, then runs analysis on top of it via a Hive query and finally copies the analyzed result into same/different on premise system. 
2. Whereas someone else may choose to do all the ingress data movement in 1 pipeline. Data transformation and analysis on copied data could be in the 2nd pipeline and the 3rd pipeline may be leveraged to publish the data to the eventual storage systems.

The pipeline construct helps in the management of the logical separations. 

Example of a pipeline definition: 

	{
	    "name": "AnalyzeMarketingCampaignPipeline",
	    "properties":
	    {
	        "description" : "To join the Regional Campaign data and with Enriched Gamer Fact Data and push to Azure SQLD Database",
	        "activities":Ca
	        [
	            {
			"name": "JoinData",
			"description": "Join Regional Campaign data with Enriched Gamer Fact Data",
			"type": "HDInsightActivity",
			"inputs": [ {"name": "EnrichedGameEventsTable"}, {"name": "RefMarketingCampaignTable"} ],
			"outputs": [ {"name": "MarketingCampaignEffectivenessBlobTable"} ],
			"linkedServiceName": "HDInsightLinkedService",
			"transformation":
			{
	    			"type": "Hive",
				"extendedProperties":
				{
	                                "EventsInput": "$$Text.Format('wasb://adfwalkthrough@<storageaccountname>.blob.core.windows.net/logs/enrichedgameevents/yearno={0:yyyy}/monthno={0:%M}/dayno={0:%d}/', SliceStart)",
	                                "CampaignInput": "wasb://adfwalkthrough@<storageaccountname>.blob.core.windows.net/refdata/refmarketingcampaign/",
	                                "CampaignOutput": "$$Text.Format('wasb://adfwalkthrough@<storageaccountname>.blob.core.windows.net/marketingcampaigneffectiveness/yearno={0:yyyy}/monthno={0:%M}/dayno={0:%d}/', SliceStart)"
				},		
	    			"scriptpath": "adfwalkthrough\\scripts\\transformdata.hql",    			
				"scriptLinkedService": "StorageLinkedService"
			},
			"policy":
			{
				"concurrency": 1,
				"executionPriorityOrder": "NewestFirst",
				"retry": 1,
				"timeout": "01:00:00"
			}
	            },
		    {
			"name": "EgressDataAzure",
			"description": "Push Regional Effectiveness Campaign data to Sql Azure",		
			"type": "CopyActivity",
			"inputs": [ {"name": "MarketingCampaignEffectivenessBlobTable"} ],
			"outputs": [ {"name": "MarketingCampaignEffectivenessSQLTable"} ],	
			"transformation":
			{
				"source":
				{                               
					"type": "BlobSource"
				},
				"sink":
				{
					"type": "SqlSink",
					"SqlWriterTableType": "MarketingCampaignEffectivenessType",
					"SqlWriterStoredProcedureName": "spEgressOverwriteMarketingCampaignEffectiveness"
				}			
			},
			"Policy":
			{
				"concurrency": 1,
				"executionPriorityOrder": "NewestFirst",
				"style": "StartOfInterval",
				"retry": 0,
				"timeout": "01:00:00"
			}
		     }
	        ]
	      }
	}

The above pipeline describes two activities in it. The first one is an HDInsight activity which runs a Hive query with 2 datasets as inputs and produces 1 output dataset. The second activity takes the output of the preceding activity and copies it to Azure SQL Database. Let us take a closer look on how a pipeline is defined.

Typical steps when creating a pipeline in Azure Data Factory are:

1. Create a Data Factory (if not created)
2. Create a linked service for each data store or compute
3. Create input and output dataset(s)
4. Create a pipeline with activities which operate on the datasets defined above

## Anatomy of a Pipeline  
The generic structure for a pipeline looks as follows:

	{
	    "name": "PipelineName”,
	    "properties": 
	    {
	        "description" : "pipeline description",
	        "activities":
	        [
	
	        ],
		start: <start date-time>,
		end: <end date-time>
	    }
	}

The activities section can have one or more activities defined within it. Each activity has the following top level structure:

	{
	    "name": "ActivityName",
	    "description": "description", 
	    "type": "<ActivityType>",
	    "inputs":  [],
	    "outputs":  [],
	    “linkedServiceName”: "MyLinkedService",
	    "transformation":
	    {
	
	    },
	    policy:
	    {
	    }
	}

Following table describes the tags within the activity and pipeline JSON definitions:

Tag | Description | Required
--- | ----------- | --------
name | Name of the activity or the pipeline. Specify a name that represents the action that the activity or pipeline is configured to do<br/><ul><li>Maximum number of characters: 260</li><li>Must start with a letter  number, or a  underscore (_)</li><li>Following characters are not allowed: “.”, “+”, “?”, “/”, “<”,”>”,”*”,”%”,”&”,”:”,”\\”</li></ul> | Yes
description | Text describing what the activity or pipeline is used for | Yes
type | Specifies the type of the activity. See the next table of activity types in this article to determine the activity you require | Yes
inputs | Input tables used by the activity<p>// one input table<br/>"inputs":  [ { "name": "inputtable1"  } ],</p><p>// two input tables <br/>"inputs":  [ { "name": "inputtable1"  }, { "name": "inputtable2"  } ],</p> | Yes
outputs | Output tables used by the activity.<p>// one output table<br/>"outputs":  [ { "name": “outputtable1” } ],</p><p>//two output tables<br/>"outputs":  [ { "name": “outputtable1” }, { "name": “outputtable2” }  ],</p> | Yes
linkedServiceName | Name of the linked service used by the activity. <p>An activity may require that you specify the linked service that links to the required compute environment.</p> | Yes for HDInsight Activity and Azure Machine Learning Batch Scoring Activity <p>No for all others</p>
transformation | Properties in the transformation section depend on type of the activity. Refer to the article on each individual activity to learn more on this | No
policy | Policies which affect the run-time behavior of the activity. If it is not specified, default policies will be used. Scroll below for details | No
start | Start date-time for the pipeline. Must be in ISO format. For example: 2014-10-14T16:32:41Z. The start and end properties together specify active period for the pipeline. Output slices are only produced with in this active period. | No
End | End date-time for the pipeline. If specified must be in ISO format. For example: 2014-10-14T17:32:41Z | No
isPaused | If set to true the pipeline will not get executed. Default value = false
Via this property one can enable or disable | No   

### Activity types
The table below lists the types of activities provided by Azure Data Factory. [Data movement](data-factory-data-movement-activities.md) and [Data transformation](data-factory-data-transformation-activities.md) articles describe these further with examples.

Activity | Type | Description | No. of inputs | No. of outputs
-------- | ---- | ----------- | ------------- | --------------
Copy | Copy | Copies the data from a data store to another data store. The store can be either a cloud or on-premises store (add link to data movement article which will list all connectors we support). | 1 | 1
HDInsight Hive Activity | HDInsightHive | Specifies the Hive script that will process the data from the input tables, and produce data to output tables. | ? | ?
HDInsight Pig Activity | HDInsightPig | Specifies the Pig script that will process the data from the input tables, and produce data to output tables. | ? | ?
HDInsight Map Reduce Activity | HDInsightMapReduce | Specifies the MapReduce program that will be invoked to process the data from the input tables, and produce data to the output tables | ? | ?
HDInsight Hadoop Streaming Activity | HDInsightHadoopStreaming | Specifies the map/reduce program (other than Java) that will be invoked to process the data from the input tables, and produce data to the output tables | ? | ? 
Azure Machine Learning Batch Scoring Activity | AzureMLBatchScoring | This activity gets the location of the input file from your input tables, call the Azure Machine Learning batch scoring API, and copy the batch scoring output to the blob given in your output table | ? |?
SQL Server Stored Procedure Activity | SqlServerStoredProcedure | This activity invokes a stored procedure in an Azure SQL Database when the input data is ready and produces output as per the schedule defined by the output table. | ? | ? 
.Net Activity | DotNetActivity | This activity helps in execute user’s custom code in a pipeline. The activity can be configured to run using either an Azure HDInsight cluster or an Azure Batch service | | 
**Note: **If you specify multiple output tables for an activity, the tables must be on the same schedule.

### Policies
Policies affect the run-time behavior of an activity, specifically when the slice of a table is processed. The following table provides the details.

Property | Description | Allowed values
-------- | ----------- | --------------
concurrency | Number of concurrent executions of the activity. <br/>It determines the number of parallel activity executions that can happen on different slices. For example, if an activity needs to go through a large set of available data, having a larger concurrency speeds up the data processing. | Integer<br/>Default value: 1<br/>Max value: 10
executionPriorityOrder | Determines the ordering of data slices that is processed.<br/>For example, if you have 2 slices (one happening at 4pm, and another one at 5pm), and both are pending execution. If you set the executionPriorityOrder to be NewestFirst, the slice at 5pm will be processed first. Similarly if you set the executionPriorityORder to be OldestFIrst, then the slice at 4pm will be processed. | NewestFirst<br/>OldestFirst
retry | Number of retries before the data processing for the slice is marked as Failure. Activity execution for a data slice is retried up to the specified retry count. The retry is done as soon as possible after the failure. | Integer <br/>Max value can be 10
timeout | Timeout for the activity. Example: 00:10:00 (implies timeout 10 mins)<br/>If a value is not specified or is 0, the timeout is infinite.<br/>If the data processing time on a slice exceeds the timeout value, it is canceled, and the system attempts to retry the processing. The number of retries depends on the retry property. When timeout occurs, the status will be TimedOut. | TimeSpan<br/>Default value: 00:00:00
delay | Specify the delay before data processing of the slice starts.<br/>The execution of activity for a data slice is started after the Delay is past the expected execution time.<br/>Example: 00:10:00 (implies delay of 10 mins) | TimeSpan<br/>Default value: 00:00:00
longRetry | The number of long retry attempts before the slice execution is failed.<p>longRetry attempts are spaced by longRetryInterval. So if you need to specify a time between retry attempts, use longRetry. If both Retry and longRetry are specified, each longRetry attempt will include Retry attempts and the max number of attempts will be Retry * longRetry.</p> <p>For example, if we have the following in the activity policy:<br/>Retry: 3<br/>longRetry: 2<br/>longRetryInterval: 01:00:00</p><p>Assume there is only one slice to execute (status is PendingExecution) and the activity execution fails every time. Initially there would be 3 consecutive execution attempts. After each attempt the slice status would be Retry. After first 3 attempts are over the slice status would be LongRetry.<br/>After an hour (i.e. longRetryInteval’s value), there would be another set of 3 consecutive execution attempts. After that, the slice status would be Failed and no more retries would be attempted. Hence overall 6 attempts were made.<br/>Note: If any execution succeeds, the slice status would be Ready and no more retries will be attempted.</p><p>longRetry may be used in situations where dependent data arrives at non-deterministic times or the overall environment is quite flaky under which data processing occurs. In such cases doing retries one after another may not help and doing so after an interval of time results in the desired output.<br/>**Warning**: do not set high values for longRetry or longRetryInterval. Typically higher values imply other systemic issues which are being brushed off under this</p> | Integer <br/>Default value: 1<br/>Max value: 10
longRetryInterval | The delay between long retry attempts | TimeSpan<br/>Default value: 00:00:00

## Authoring
Azure Data Factory provides various mechanisms to author and deploy a pipelines (which in turn contain one or more activities in it). They are: 

### Using Azure Preview Portal

- Log into [Azure Preview Portal](https://portal.azure.com/)
- Navigate to your Azure Data Factory instance in which you wish to create a pipeline
- Click  **Author and Deploy** tile in the **Summary** lens. 
	![Author and deploy tile](./media/data-factory-create-pipelines/author-deploy-tile.png)
- Click **New pipeline** on the command bar. 

	![New pipeline button](./media/data-factory-create-pipelines/new-pipeline-button.png)

- You should see the editor window with pipeline JSON template.
	![Pipeline editor](./media/data-factory-create-pipelines/pipeline-in-editor.png)
- After you have finished authoring the pipeline, then click on **Deploy** on the command bar to deploy the pipeline. **Note:** during deployment, the Azure Data Factory service performs a few validation checks to help rectify a few common issues. In case there is an error, the corresponding information will show up. Take corrective actions and then re-deploy the authored pipeline.

### Using Visual Studio plugin
You can use Visual Studio to author and deploy pipelines to Azure Data Factory. To learn more, refer to (add link to the create pipelines section in the Visual Studio authoring article being written).

### Using Azure PowerShell
You can use the Azure PowerShellto create pipelines in Azure Data Factory. Say, you have defined the pipeline JSON in a file at c:\DPWikisample.json. You can upload it to your Azure Data Factory instance as shown in the following example.

	New-AzureDataFactoryPipeline -ResourceGroupName ADF -Name DPWikisample -DataFactoryName wikiADF -File c:\DPWikisample.json

To learn more about this cmdlet, see [New-AzureDataFactoryPipeline cmdlet](https://msdn.microsoft.com/library/dn820227.aspx).

### Using REST API
You can create and deploy pipeline using REST APIs too. This mechanism can be leveraged to create pipelines programmatically. To learn more on this, see [Create or Update a Pipeline](https://msdn.microsoft.com/library/azure/dn906741.aspx).

## Scheduling & Execution
So far we have understood what pipelines and activities are. We have also taken a look at how are they defined and a high level view of the activities in Azure Data Factory. Now let us take a look at how they get executed.

A pipeline is active only between its start time and end time. Before and after that it will not get executed. If the pipeline is paused it will not get executed irrespective of its start and end time. For a pipeline to run, it should not be paused. 

In fact it is not the pipeline that gets executed. It is the activities in the pipeline which get executed. However they do so in the overall context of the pipeline. Activities in a pipeline inherit their time active interval based on the pipeline’s active period, their input and output dataset(s), and their own availability configuration. Let us take a closer look at how activities get executed here (add link to a detailed article which explain execution).

## Manage & Monitor  
Once a pipeline is deployed you can manage and monitor your pipelines, slices and runs. Read more about it here: [Monitor and Manage](data-factory-monior-manage.md).

## Next Steps

- Read about the [data movement](data-factory-data-movement-activities.md) and [data transformation capabilities](data-factory-data-transformation-activities) in Azure Data Factory
- Author and deploy a pipeline and then see it in action. Refer to the authoring section above to do so
- Refer to more pipeline examples via the Samples & Tutorials section 


 

   













 
 


 

 



