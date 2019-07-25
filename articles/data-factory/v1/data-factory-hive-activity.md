---
title: Transform data using Hive Activity - Azure | Microsoft Docs
description: Learn how you can use the Hive Activity in an Azure data factory to run Hive queries on an on-demand/your own HDInsight cluster.
services: data-factory
documentationcenter: ''
author: sharonlo101
manager: craigg


ms.assetid: 80083218-743e-4da8-bdd2-60d1c77b1227
ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na

ms.topic: conceptual
ms.date: 01/10/2018
ms.author: shlo

robots: noindex
---
# Transform data using Hive Activity in Azure Data Factory 
> [!div class="op_single_selector" title1="Transformation Activities"]
> * [Hive Activity](data-factory-hive-activity.md) 
> * [Pig Activity](data-factory-pig-activity.md)
> * [MapReduce Activity](data-factory-map-reduce.md)
> * [Hadoop Streaming Activity](data-factory-hadoop-streaming-activity.md)
> * [Spark Activity](data-factory-spark.md)
> * [Machine Learning Batch Execution Activity](data-factory-azure-ml-batch-execution-activity.md)
> * [Machine Learning Update Resource Activity](data-factory-azure-ml-update-resource-activity.md)
> * [Stored Procedure Activity](data-factory-stored-proc-activity.md)
> * [Data Lake Analytics U-SQL Activity](data-factory-usql-activity.md)
> * [.NET Custom Activity](data-factory-use-custom-activities.md)

> [!NOTE]
> This article applies to version 1 of Data Factory. If you are using the current version of the Data Factory service, see [transform data using Hive activity in Data Factory](../transform-data-using-hadoop-hive.md).

The HDInsight Hive activity in a Data Factory [pipeline](data-factory-create-pipelines.md) executes Hive queries on [your own](data-factory-compute-linked-services.md#azure-hdinsight-linked-service) or [on-demand](data-factory-compute-linked-services.md#azure-hdinsight-on-demand-linked-service) Windows/Linux-based HDInsight cluster. This article builds on the [data transformation activities](data-factory-data-transformation-activities.md) article, which presents a general overview of data transformation and the supported transformation activities.

> [!NOTE] 
> If you are new to Azure Data Factory, read through [Introduction to Azure Data Factory](data-factory-introduction.md) and do the tutorial: [Build your first data pipeline](data-factory-build-your-first-pipeline.md) before reading this article. 

## Syntax

```JSON
{
    "name": "Hive Activity",
    "description": "description",
    "type": "HDInsightHive",
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
      "script": "Hive script",
      "scriptPath": "<pathtotheHivescriptfileinAzureblobstorage>",
      "defines": {
        "param1": "param1Value"
      }
    },
   "scheduler": {
      "frequency": "Day",
      "interval": 1
    }
}
```
## Syntax details
| Property | Description | Required |
| --- | --- | --- |
| name |Name of the activity |Yes |
| description |Text describing what the activity is used for |No |
| type |HDinsightHive |Yes |
| inputs |Inputs consumed by the Hive activity |No |
| outputs |Outputs produced by the Hive activity |Yes |
| linkedServiceName |Reference to the HDInsight cluster registered as a linked service in Data Factory |Yes |
| script |Specify the Hive script inline |No |
| scriptPath |Store the Hive script in an Azure blob storage and provide the path to the file. Use 'script' or 'scriptPath' property. Both cannot be used together. The file name is case-sensitive. |No |
| defines |Specify parameters as key/value pairs for referencing within the Hive script using 'hiveconf' |No |

## Example
Let’s consider an example of game logs analytics where you want to identify the time spent by users playing games launched by your company. 

The following log is a sample game log, which is comma (`,`) separated and contains the following fields – ProfileID, SessionStart, Duration, SrcIPAddress, and GameType.

```
1809,2014-05-04 12:04:25.3470000,14,221.117.223.75,CaptureFlag
1703,2014-05-04 06:05:06.0090000,16,12.49.178.247,KingHill
1703,2014-05-04 10:21:57.3290000,10,199.118.18.179,CaptureFlag
1809,2014-05-04 05:24:22.2100000,23,192.84.66.141,KingHill
.....
```

The **Hive script** to process this data:

```
DROP TABLE IF EXISTS HiveSampleIn; 
CREATE EXTERNAL TABLE HiveSampleIn 
(
    ProfileID        string, 
    SessionStart     string, 
    Duration         int, 
    SrcIPAddress     string, 
    GameType         string
) ROW FORMAT DELIMITED FIELDS TERMINATED BY ',' LINES TERMINATED BY '10' STORED AS TEXTFILE LOCATION 'wasb://adfwalkthrough@<storageaccount>.blob.core.windows.net/samplein/'; 

DROP TABLE IF EXISTS HiveSampleOut; 
CREATE EXTERNAL TABLE HiveSampleOut 
(    
    ProfileID     string, 
    Duration     int
) ROW FORMAT DELIMITED FIELDS TERMINATED BY ',' LINES TERMINATED BY '10' STORED AS TEXTFILE LOCATION 'wasb://adfwalkthrough@<storageaccount>.blob.core.windows.net/sampleout/';

INSERT OVERWRITE TABLE HiveSampleOut
Select 
    ProfileID,
    SUM(Duration)
FROM HiveSampleIn Group by ProfileID
```

To execute this Hive script in a Data Factory pipeline, you need to do the following

1. Create a linked service to register [your own HDInsight compute cluster](data-factory-compute-linked-services.md#azure-hdinsight-linked-service) or configure [on-demand HDInsight compute cluster](data-factory-compute-linked-services.md#azure-hdinsight-on-demand-linked-service). Let’s call this linked service “HDInsightLinkedService”.
2. Create a [linked service](data-factory-azure-blob-connector.md) to configure the connection to Azure Blob storage hosting the data. Let’s call this linked service “StorageLinkedService”
3. Create [datasets](data-factory-create-datasets.md) pointing to the input and the output data. Let’s call the input dataset “HiveSampleIn” and the output dataset “HiveSampleOut”
4. Copy the Hive query as a file to Azure Blob Storage configured in step #2. if the storage for hosting the data is different from the one hosting this query file, create a separate Azure Storage linked service and refer to it in the activity. Use **scriptPath** to specify the path to hive query file and **scriptLinkedService** to specify the Azure storage that contains the script file. 
   
   > [!NOTE]
   > You can also provide the Hive script inline in the activity definition by using the **script** property. We do not recommend this approach as all special characters in the script within the JSON document needs to be escaped and may cause debugging issues. The best practice is to follow step #4.
   > 
   > 
5. Create a pipeline with the HDInsightHive activity. The activity processes/transforms the data.

	```JSON   
	{	
		"name": "HiveActivitySamplePipeline",
	   	"properties": {
		"activities": [
			{
				"name": "HiveActivitySample",
				"type": "HDInsightHive",
				"inputs": [
				{
					"name": "HiveSampleIn"
				}
				],
	         	"outputs": [
	           	{
	            	"name": "HiveSampleOut"
	           	}
	         	],
	         	"linkedServiceName": "HDInsightLinkedService",
	         	"typeproperties": {
	           		"scriptPath": "adfwalkthrough\\scripts\\samplehive.hql",
	           		"scriptLinkedService": "StorageLinkedService"
         		},
            	"scheduler": {
					"frequency": "Hour",
	               	"interval": 1
	         	}
	       	}
			]
		}
	}
    ```
6. Deploy the pipeline. See [Creating pipelines](data-factory-create-pipelines.md) article for details. 
7. Monitor the pipeline using the data factory monitoring and management views. See [Monitoring and manage Data Factory pipelines](data-factory-monitor-manage-pipelines.md) article for details. 

## Specifying parameters for a Hive script
In this example, game logs are ingested daily into Azure Blob Storage and are stored in a folder partitioned with date and time. You want to parameterize the Hive script and pass the input folder location dynamically during runtime and also produce the output partitioned with date and time.

To use parameterized Hive script, do the following

* Define the parameters in **defines**.

	```JSON  
    {
        "name": "HiveActivitySamplePipeline",
          "properties": {
        "activities": [
             {
                "name": "HiveActivitySample",
                "type": "HDInsightHive",
                "inputs": [
                      {
                        "name": "HiveSampleIn"
                      }
                ],
                "outputs": [
                      {
                        "name": "HiveSampleOut"
                    }
                ],
                "linkedServiceName": "HDInsightLinkedService",
                "typeproperties": {
                      "scriptPath": "adfwalkthrough\\scripts\\samplehive.hql",
                      "scriptLinkedService": "StorageLinkedService",
                      "defines": {
                        "Input": "$$Text.Format('wasb://adfwalkthrough@<storageaccountname>.blob.core.windows.net/samplein/yearno={0:yyyy}/monthno={0:MM}/dayno={0:dd}/', SliceStart)",
                        "Output": "$$Text.Format('wasb://adfwalkthrough@<storageaccountname>.blob.core.windows.net/sampleout/yearno={0:yyyy}/monthno={0:MM}/dayno={0:dd}/', SliceStart)"
                      },
                       "scheduler": {
                          "frequency": "Hour",
                          "interval": 1
                    }
                }
              }
        ]
      }
    }
    ```
* In the Hive Script, refer to the parameter using **${hiveconf:parameterName}**. 
  
    ```
    DROP TABLE IF EXISTS HiveSampleIn; 
    CREATE EXTERNAL TABLE HiveSampleIn 
    (
        ProfileID     string, 
        SessionStart     string, 
        Duration     int, 
        SrcIPAddress     string, 
        GameType     string
    ) ROW FORMAT DELIMITED FIELDS TERMINATED BY ',' LINES TERMINATED BY '10' STORED AS TEXTFILE LOCATION '${hiveconf:Input}'; 

    DROP TABLE IF EXISTS HiveSampleOut; 
    CREATE EXTERNAL TABLE HiveSampleOut 
    (
        ProfileID     string, 
        Duration     int
    ) ROW FORMAT DELIMITED FIELDS TERMINATED BY ',' LINES TERMINATED BY '10' STORED AS TEXTFILE LOCATION '${hiveconf:Output}';

    INSERT OVERWRITE TABLE HiveSampleOut
    Select 
        ProfileID,
        SUM(Duration)
    FROM HiveSampleIn Group by ProfileID
    ```
  ## See Also
* [Pig Activity](data-factory-pig-activity.md)
* [MapReduce Activity](data-factory-map-reduce.md)
* [Hadoop Streaming Activity](data-factory-hadoop-streaming-activity.md)
* [Invoke Spark programs](data-factory-spark.md)
* [Invoke R scripts](https://github.com/Azure/Azure-DataFactory/tree/master/Samples/RunRScriptUsingADFSample)

