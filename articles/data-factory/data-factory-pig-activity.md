<properties 
	pageTitle="Pig Activity" 
	description="Learn how you can use the Pig Activity in an Azure data factory to run Pig scripts on an on-demand/your own HDInsight cluster." 
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
	ms.date="06/15/2016" 
	ms.author="spelluru"/>

# Pig Activity

The HDInsight Pig activity in a Data Factory [pipeline](data-factory-create-pipelines.md) executes Pig queries on [your own](data-factory-compute-linked-services.md#azure-hdinsight-linked-service) or [on-demand](data-factory-compute-linked-services.md#azure-hdinsight-on-demand-linked-service) Windows/Linux-based HDInsight cluster. This article builds on the [data transformation activities](data-factory-data-transformation-activities.md) article which presents a general overview of data transformation and the supported transformation activities.

## Syntax

	{
		"name": "HiveActivitySamplePipeline",
	  	"properties": {
	    "activities": [
	    	{
	        	"name": "Pig Activity",
	        	"description": "description",
	        	"type": "HDInsightPig",
	        	"inputs": [
	          		{
	            		"name": "input tables"
	          		}
	        	],
	        	"outputs": [
	          		{
	            		"name": "output tables"
	          		}
        		],
	        	"linkedServiceName": "MyHDInsightLinkedService",
	        	"typeProperties": {
	          		"script": "Pig script",
	          		"scriptPath": "<pathtothePigscriptfileinAzureblobstorage>",
	          		"defines": {
	            		"param1": "param1Value"
	          		}
	        	},
       			"scheduler": {
          			"frequency": "Day",
          			"interval": 1
        		}
	      	}
	    ]
	  }
	}

## Syntax details

Property | Description | Required
-------- | ----------- | --------
name | Name of the activity | Yes
description | Text describing what the activity is used for | No
type | HDinsightPig | Yes
inputs | Input(s) consumed by the Pig activity | No
outputs | Output(s) produced by the Pig activity | Yes
linkedServiceName | Reference to the HDInsight cluster registered as a linked service in Data Factory | Yes
script | Specify the Pig script inline | No
script path | Store the Pig script in an Azure blob storage and provide the path to the file. Use 'script' or 'scriptPath' property. Both cannot be used together. Note that the file name is case-sensitive. | No
defines | Specify parameters as key/value pairs for referencing within the Pig script | No

## Example

Let’s consider an example of game logs analytics where you want to identify the time spent by users playing games launched by your company.
 
Below is a sample game log, which is comma (,) separated and contains the following fields – ProfileID, SessionStart, Duration, SrcIPAddress, and GameType.

	1809,2014-05-04 12:04:25.3470000,14,221.117.223.75,CaptureFlag
	1703,2014-05-04 06:05:06.0090000,16,12.49.178.247,KingHill
	1703,2014-05-04 10:21:57.3290000,10,199.118.18.179,CaptureFlag
	1809,2014-05-04 05:24:22.2100000,23,192.84.66.141,KingHill
	.....

The **Pig script** to process this data looks like this:

	PigSampleIn = LOAD 'wasb://adfwalkthrough@anandsub14.blob.core.windows.net/samplein/' USING PigStorage(',') AS (ProfileID:chararray, SessionStart:chararray, Duration:int, SrcIPAddress:chararray, GameType:chararray);
	
	GroupProfile = Group PigSampleIn all;
	
	PigSampleOut = Foreach GroupProfile Generate PigSampleIn.ProfileID, SUM(PigSampleIn.Duration);
	
	Store PigSampleOut into 'wasb://adfwalkthrough@anandsub14.blob.core.windows.net/sampleoutpig/' USING PigStorage (',');

To execute this Pig script in a Data Factory pipeline, you need to the do the following:

1. Create a linked service to register [your own HDInsight compute cluster](data-factory-compute-linked-services.md#azure-hdinsight-linked-service) or configure [on-demand HDInsight compute cluster](data-factory-compute-linked-services.md#azure-hdinsight-on-demand-linked-service). Let’s call this linked service “HDInsightLinkedService”.
2.	Create a [linked service](data-factory-azure-blob-connector.md) to configure the connection to Azure Blob storage hosting the data. Let’s call this linked service “StorageLinkedService”.
3.	Create [datasets](data-factory-create-datasets.md) pointing to the input and the output data. Let’s call the input dataset “PigSampleIn” and the output dataset “PigSampleOut”.
4.	Copy the Pig query in a file the Azure Blob Storage configured in step #2 above. if the linked service for hosting the data is different from the one hosting this query file, create a separate Azure Storage linked service and refer to it in the activity configuration. Use **scriptPath **to specify the path to pig script file and **scriptLinkedService** to specify the Azure storage that contains the script file. 
	
	> [AZURE.NOTE] You can also provide the Pig script inline in the activity definition by using the **script** property but this is not recommended as all special characters in the script within the JSON document needs to be escaped and may cause debugging issues. The best practice is to follow step #4.
5. Create the below pipeline with the HDInsightPig activity to process the data.

		{
		  "name": "PigActivitySamplePipeline",
		  "properties": {
		    "activities": [
		      {
		        "name": "PigActivitySample",
		        "type": "HDInsightPig",
		        "inputs": [
		          {
		            "name": "PigSampleIn"
		          }
		        ],
		        "outputs": [
		          {
		            "name": "PigSampleOut"
		          }
		        ],
		        "linkedServiceName": "HDInsightLinkedService",
		        "typeproperties": {
		          "scriptPath": "adfwalkthrough\\scripts\\enrichlogs.pig",
		          "scriptLinkedService": "StorageLinkedService"
		        },
       			"scheduler": {
          			"frequency": "Day",
          			"interval": 1
        		}
		      }
		    ]
		  }
		} 
6. Deploy the pipeline. See [Creating pipelines](data-factory-create-pipelines.md) article for details. 
7. Monitor the pipeline using the data factory monitoring and management views. See [Monitoring and manage Data Factory pipelines](data-factory-monitor-manage-pipelines.md) article for details.

## Specifying parameters for a Pig script using the defines element

Consider the example where the game logs are ingested daily into Azure Blob Storage and stored in a folder partitioned with date and time. You want to parameterize the Pig script and pass the input folder location dynamically during runtime and also produce the output partitioned with date and time.
 
To use parameterize Pig script, do the following:

- Define the parameters in **defines**.

		{
			"name": "PigActivitySamplePipeline",
		  	"properties": {
		    "activities": [
		    	{
		        	"name": "PigActivitySample",
		        	"type": "HDInsightPig",
		        	"inputs": [
		          		{
		            		"name": "PigSampleIn"
		          		}
		        	],
		        	"outputs": [
		          		{
		            		"name": "PigSampleOut"
		          		}
		        	],
		        	"linkedServiceName": "HDInsightLinkedService",
		        	"typeproperties": {
		          		"scriptPath": "adfwalkthrough\\scripts\\samplepig.hql",
		          		"scriptLinkedService": "StorageLinkedService",
		          		"defines": {
		            		"Input": "$$Text.Format('wasb: //adfwalkthrough@<storageaccountname>.blob.core.windows.net/samplein/yearno={0: yyyy}/monthno={0: %M}/dayno={0: %d}/',SliceStart)",
				            "Output": "$$Text.Format('wasb://adfwalkthrough@<storageaccountname>.blob.core.windows.net/sampleout/yearno={0:yyyy}/monthno={0:%M}/dayno={0:%d}/', SliceStart)"
		          		}
		        	},
       				"scheduler": {
          				"frequency": "Day",
	          			"interval": 1
    	    		}
		      	}
		    ]
		  }
		}  
	  
- In the Pig Script, refer to the parameters using '**$parameterName**' as shown in the following example:

		PigSampleIn = LOAD '$Input' USING PigStorage(',') AS (ProfileID:chararray, SessionStart:chararray, Duration:int, SrcIPAddress:chararray, GameType:chararray);	
		GroupProfile = Group PigSampleIn all;		
		PigSampleOut = Foreach GroupProfile Generate PigSampleIn.ProfileID, SUM(PigSampleIn.Duration);		
		Store PigSampleOut into '$Output' USING PigStorage (','); 


## See Also
- [Hive Activity](data-factory-hive-activity.md)
- [MapReduce Activity](data-factory-map-reduce.md)
- [Hadoop Streaming Activity](data-factory-hadoop-streaming-activity.md)
- [Invoke Spark programs](data-factory-spark.md)
- [Invoke R scripts](https://github.com/Azure/Azure-DataFactory/tree/master/Samples/RunRScriptUsingADFSample)


