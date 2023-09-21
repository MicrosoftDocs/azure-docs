---
title: Transform data using Pig Activity in Azure Data Factory 
description: Learn how you can use the Pig Activity in Azure Data Factory v1 to run Pig scripts on an on-demand/your own HDInsight cluster.
author: dcstwh
ms.author: weetok
ms.reviewer: jburchel
ms.service: data-factory
ms.subservice: v1
ms.topic: conceptual
ms.date: 04/12/2023
---

# Transform data using Pig Activity in Azure Data Factory
> [!div class="op_single_selector" title1="Transformation Activities"]
> * [Hive Activity](data-factory-hive-activity.md) 
> * [Pig Activity](data-factory-pig-activity.md)
> * [MapReduce Activity](data-factory-map-reduce.md)
> * [Hadoop Streaming Activity](data-factory-hadoop-streaming-activity.md)
> * [Spark Activity](data-factory-spark.md)
> * [ML Studio (classic) Batch Execution Activity](data-factory-azure-ml-batch-execution-activity.md)
> * [ML Studio (classic) Update Resource Activity](data-factory-azure-ml-update-resource-activity.md)
> * [Stored Procedure Activity](data-factory-stored-proc-activity.md)
> * [Data Lake Analytics U-SQL Activity](data-factory-usql-activity.md)
> * [.NET Custom Activity](data-factory-use-custom-activities.md)

> [!NOTE]
> This article applies to version 1 of Data Factory. If you are using the current version of the Data Factory service, see [transform data using Pig activity in Data Factory](../transform-data-using-hadoop-pig.md).


The HDInsight Pig activity in a Data Factory [pipeline](data-factory-create-pipelines.md) executes Pig queries on [your own](data-factory-compute-linked-services.md#azure-hdinsight-linked-service) or [on-demand](data-factory-compute-linked-services.md#azure-hdinsight-on-demand-linked-service) Windows/Linux-based HDInsight cluster. This article builds on the [data transformation activities](data-factory-data-transformation-activities.md) article, which presents a general overview of data transformation and the supported transformation activities.

> [!NOTE] 
> If you are new to Azure Data Factory, read through [Introduction to Azure Data Factory](data-factory-introduction.md) and do the tutorial: [Build your first data pipeline](data-factory-build-your-first-pipeline.md) before reading this article. 

## Syntax

```JSON
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
```

## Syntax details

| Property | Description | Required |
| --- | --- | --- |
| name |Name of the activity |Yes |
| description |Text describing what the activity is used for |No |
| type |HDinsightPig |Yes |
| inputs |One or more inputs consumed by the Pig activity |No |
| outputs |One or more outputs produced by the Pig activity |Yes |
| linkedServiceName |Reference to the HDInsight cluster registered as a linked service in Data Factory |Yes |
| script |Specify the Pig script inline |No |
| scriptPath |Store the Pig script in an Azure blob storage and provide the path to the file. Use 'script' or 'scriptPath' property. Both cannot be used together. The file name is case-sensitive. |No |
| defines |Specify parameters as key/value pairs for referencing within the Pig script |No |

## Example
Let’s consider an example of game logs analytics where you want to identify the time spent by players playing games launched by your company.

The following sample game log is a comma (,) separated file. It contains the following fields - ProfileID, SessionStart, Duration, SrcIPAddress, and GameType.

```
1809,2014-05-04 12:04:25.3470000,14,221.117.223.75,CaptureFlag
1703,2014-05-04 06:05:06.0090000,16,12.49.178.247,KingHill
1703,2014-05-04 10:21:57.3290000,10,199.118.18.179,CaptureFlag
1809,2014-05-04 05:24:22.2100000,23,192.84.66.141,KingHill
.....
```

The **Pig script** to process this data:

```
PigSampleIn = LOAD 'wasb://adfwalkthrough@anandsub14.blob.core.windows.net/samplein/' USING PigStorage(',') AS (ProfileID:chararray, SessionStart:chararray, Duration:int, SrcIPAddress:chararray, GameType:chararray);

GroupProfile = Group PigSampleIn all;

PigSampleOut = Foreach GroupProfile Generate PigSampleIn.ProfileID, SUM(PigSampleIn.Duration);

Store PigSampleOut into 'wasb://adfwalkthrough@anandsub14.blob.core.windows.net/sampleoutpig/' USING PigStorage (',');
```

To execute this Pig script in a Data Factory pipeline, do the following steps:

1. Create a linked service to register [your own HDInsight compute cluster](data-factory-compute-linked-services.md#azure-hdinsight-linked-service) or configure [on-demand HDInsight compute cluster](data-factory-compute-linked-services.md#azure-hdinsight-on-demand-linked-service). Let’s call this linked service **HDInsightLinkedService**.
2. Create a [linked service](data-factory-azure-blob-connector.md) to configure the connection to Azure Blob storage hosting the data. Let’s call this linked service **StorageLinkedService**.
3. Create [datasets](data-factory-create-datasets.md) pointing to the input and the output data. Let’s call the input dataset **PigSampleIn** and the output dataset **PigSampleOut**.
4. Copy the Pig query in a file the Azure Blob Storage configured in step #2. If the Azure storage that hosts the data is different from the one that hosts the query file, create a separate Azure Storage linked service. Refer to the linked service in the activity configuration. Use **scriptPath** to specify the path to pig script file and **scriptLinkedService**. 
   
   > [!NOTE]
   > You can also provide the Pig script inline in the activity definition by using the **script** property. However, we do not recommend this approach as all special characters in the script needs to be escaped and may cause debugging issues. The best practice is to follow step #4.
   >
   >
5. Create the pipeline with the HDInsightPig activity. This activity processes the input data by running Pig script on HDInsight cluster.

    ```JSON
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
    ```
6. Deploy the pipeline. See [Creating pipelines](data-factory-create-pipelines.md) article for details. 
7. Monitor the pipeline using the data factory monitoring and management views. See [Monitoring and manage Data Factory pipelines](data-factory-monitor-manage-pipelines.md) article for details.

## Specifying parameters for a Pig script
Consider the following example: game logs are ingested daily into Azure Blob Storage and stored in a folder partitioned based on date and time. You want to parameterize the Pig script and pass the input folder location dynamically during runtime and also produce the output partitioned with date and time.

To use parameterized Pig script, do the following:

* Define the parameters in **defines**.

    ```JSON
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
                "Input": "$$Text.Format('wasb: //adfwalkthrough@<storageaccountname>.blob.core.windows.net/samplein/yearno={0: yyyy}/monthno={0:MM}/dayno={0: dd}/',SliceStart)",
                "Output": "$$Text.Format('wasb://adfwalkthrough@<storageaccountname>.blob.core.windows.net/sampleout/yearno={0:yyyy}/monthno={0:MM}/dayno={0:dd}/', SliceStart)"
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
    ```
* In the Pig Script, refer to the parameters using '**$parameterName**' as shown in the following example:

    ```
    PigSampleIn = LOAD '$Input' USING PigStorage(',') AS (ProfileID:chararray, SessionStart:chararray, Duration:int, SrcIPAddress:chararray, GameType:chararray);
    GroupProfile = Group PigSampleIn all;
    PigSampleOut = Foreach GroupProfile Generate PigSampleIn.ProfileID, SUM(PigSampleIn.Duration);
    Store PigSampleOut into '$Output' USING PigStorage (','); 
    ```

## See Also
* [Hive Activity](data-factory-hive-activity.md)
* [MapReduce Activity](data-factory-map-reduce.md)
* [Hadoop Streaming Activity](data-factory-hadoop-streaming-activity.md)
* [Invoke Spark programs](data-factory-spark.md)
* [Invoke R scripts](https://github.com/Azure/Azure-DataFactory/tree/master/SamplesV1/RunRScriptUsingADFSample)
