---
title: Azure Data Factory - JSON Scripting Reference 
description: Provides JSON schemas for Data Factory entities.
services: data-factory
documentationcenter: ''
author: djpmsft
ms.author: daperlov
manager: jroth
ms.reviewer: maghan
ms.service: data-factory
ms.workload: data-services
ms.topic: conceptual
ms.date: 01/10/2018
---

# Azure Data Factory - JSON Scripting Reference
> [!NOTE]
> This article applies to version 1 of Data Factory.


This article provides JSON schemas and examples for defining Azure Data Factory entities (pipeline, activity, dataset, and linked service).

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

## Pipeline
The high-level structure for a pipeline definition is as follows:

```json
{
  "name": "SamplePipeline",
  "properties": {
    "description": "Describe what pipeline does",
    "activities": [
    ],
    "start": "2016-07-12T00:00:00",
    "end": "2016-07-13T00:00:00"
  }
}
```

Following table describes the properties within the pipeline JSON definition:

| Property | Description | Required
-------- | ----------- | --------
| name | Name of the pipeline. Specify a name that represents the action that the activity or pipeline is configured to do<br/><ul><li>Maximum number of characters: 260</li><li>Must start with a letter number, or an underscore (\_)</li><li>Following characters are not allowed: “.”, “+”, “?”, “/”, “<”,”>”,”*”,”%”,”&”,”:”,”\\”</li></ul> |Yes |
| description |Text describing what the activity or pipeline is used for | No |
| activities | Contains a list of activities. | Yes |
| start |Start date-time for the pipeline. Must be in [ISO format](https://en.wikipedia.org/wiki/ISO_8601). For example: 2014-10-14T16:32:41. <br/><br/>It is possible to specify a local time, for example an EST time. Here is an example: `2016-02-27T06:00:00**-05:00`, which is 6 AM EST.<br/><br/>The start and end properties together specify active period for the pipeline. Output slices are only produced with in this active period. |No<br/><br/>If you specify a value for the end property, you must specify value for the start property.<br/><br/>The start and end times can both be empty to create a pipeline. You must specify both values to set an active period for the pipeline to run. If you do not specify start and end times when creating a pipeline, you can set them using the Set-AzDataFactoryPipelineActivePeriod cmdlet later. |
| end |End date-time for the pipeline. If specified must be in ISO format. For example: 2014-10-14T17:32:41 <br/><br/>It is possible to specify a local time, for example an EST time. Here is an example: `2016-02-27T06:00:00**-05:00`, which is 6 AM EST.<br/><br/>To run the pipeline indefinitely, specify 9999-09-09 as the value for the end property. |No <br/><br/>If you specify a value for the start property, you must specify value for the end property.<br/><br/>See notes for the **start** property. |
| isPaused |If set to true the pipeline does not run. Default value = false. You can use this property to enable or disable. |No |
| pipelineMode |The method for scheduling runs for the pipeline. Allowed values are: scheduled (default), onetime.<br/><br/>‘Scheduled’ indicates that the pipeline runs at a specified time interval according to its active period (start and end time). ‘Onetime’ indicates that the pipeline runs only once. Onetime pipelines once created cannot be modified/updated currently. See [Onetime pipeline](data-factory-create-pipelines.md#onetime-pipeline) for details about onetime setting. |No |
| expirationTime |Duration of time after creation for which the pipeline is valid and should remain provisioned. If it does not have any active, failed, or pending runs, the pipeline is deleted automatically once it reaches the expiration time. |No |


## Activity
The high-level structure for an activity within a pipeline definition (activities element) is as follows:

```json
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
    },
    "scheduler":
    {
    }
}
```

Following table describe the properties within the activity JSON definition:

| Tag | Description | Required |
| --- | --- | --- |
| name |Name of the activity. Specify a name that represents the action that the activity is configured to do<br/><ul><li>Maximum number of characters: 260</li><li>Must start with a letter number, or an underscore (\_)</li><li>Following characters are not allowed: “.”, “+”, “?”, “/”, “<”,”>”,”*”,”%”,”&”,”:”,”\\”</li></ul> |Yes |
| description |Text describing what the activity is used for. |No |
| type |Specifies the type of the activity. See the [DATA STORES](#data-stores) and [DATA TRANSFORMATION ACTIVITIES](#data-transformation-activities) sections for different types of activities. |Yes |
| inputs |Input tables used by the activity<br/><br/>`// one input table`<br/>`"inputs":  [ { "name": "inputtable1"  } ],`<br/><br/>`// two input tables` <br/>`"inputs":  [ { "name": "inputtable1"  }, { "name": "inputtable2"  } ],` |No for HDInsightStreaming and SqlServerStoredProcedure activities <br/> <br/> Yes for all others |
| outputs |Output tables used by the activity.<br/><br/>`// one output table`<br/>`"outputs":  [ { "name": “outputtable1” } ],`<br/><br/>`//two output tables`<br/>`"outputs":  [ { "name": “outputtable1” }, { "name": “outputtable2” }  ],` |Yes |
| linkedServiceName |Name of the linked service used by the activity. <br/><br/>An activity may require that you specify the linked service that links to the required compute environment. |Yes for HDInsight activities, Azure Machine Learning activities, and Stored Procedure Activity. <br/><br/>No for all others |
| typeProperties |Properties in the typeProperties section depend on type of the activity. |No |
| policy |Policies that affect the run-time behavior of the activity. If it is not specified, default policies are used. |No |
| scheduler |“scheduler” property is used to define desired scheduling for the activity. Its subproperties are the same as the ones in the [availability property in a dataset](data-factory-create-datasets.md#dataset-availability). |No |

### Policies
Policies affect the run-time behavior of an activity, specifically when the slice of a table is processed. The following table provides the details.

| Property | Permitted values | Default Value | Description |
| --- | --- | --- | --- |
| concurrency |Integer <br/><br/>Max value: 10 |1 |Number of concurrent executions of the activity.<br/><br/>It determines the number of parallel activity executions that can happen on different slices. For example, if an activity needs to go through a large set of available data, having a larger concurrency value speeds up the data processing. |
| executionPriorityOrder |NewestFirst<br/><br/>OldestFirst |OldestFirst |Determines the ordering of data slices that are being processed.<br/><br/>For example, if you have 2 slices (one happening at 4pm, and another one at 5pm), and both are pending execution. If you set the executionPriorityOrder to be NewestFirst, the slice at 5 PM is processed first. Similarly if you set the executionPriorityORder to be OldestFIrst, then the slice at 4 PM is processed. |
| retry |Integer<br/><br/>Max value can be 10 |0 |Number of retries before the data processing for the slice is marked as Failure. Activity execution for a data slice is retried up to the specified retry count. The retry is done as soon as possible after the failure. |
| timeout |TimeSpan |00:00:00 |Timeout for the activity. Example: 00:10:00 (implies timeout 10 mins)<br/><br/>If a value is not specified or is 0, the timeout is infinite.<br/><br/>If the data processing time on a slice exceeds the timeout value, it is canceled, and the system attempts to retry the processing. The number of retries depends on the retry property. When timeout occurs, the status is set to TimedOut. |
| delay |TimeSpan |00:00:00 |Specify the delay before data processing of the slice starts.<br/><br/>The execution of activity for a data slice is started after the Delay is past the expected execution time.<br/><br/>Example: 00:10:00 (implies delay of 10 mins) |
| longRetry |Integer<br/><br/>Max value: 10 |1 |The number of long retry attempts before the slice execution is failed.<br/><br/>longRetry attempts are spaced by longRetryInterval. So if you need to specify a time between retry attempts, use longRetry. If both Retry and longRetry are specified, each longRetry attempt includes Retry attempts and the max number of attempts is Retry * longRetry.<br/><br/>For example, if we have the following settings in the activity policy:<br/>Retry: 3<br/>longRetry: 2<br/>longRetryInterval: 01:00:00<br/><br/>Assume there is only one slice to execute (status is Waiting) and the activity execution fails every time. Initially there would be 3 consecutive execution attempts. After each attempt, the slice status would be Retry. After first 3 attempts are over, the slice status would be LongRetry.<br/><br/>After an hour (that is, longRetryInteval’s value), there would be another set of 3 consecutive execution attempts. After that, the slice status would be Failed and no more retries would be attempted. Hence overall 6 attempts were made.<br/><br/>If any execution succeeds, the slice status would be Ready and no more retries are attempted.<br/><br/>longRetry may be used in situations where dependent data arrives at non-deterministic times or the overall environment is flaky under which data processing occurs. In such cases, doing retries one after another may not help and doing so after an interval of time results in the desired output.<br/><br/>Word of caution: do not set high values for longRetry or longRetryInterval. Typically, higher values imply other systemic issues. |
| longRetryInterval |TimeSpan |00:00:00 |The delay between long retry attempts |

### typeProperties section
The typeProperties section is different for each activity. Transformation activities have just the type properties. See [DATA TRANSFORMATION ACTIVITIES](#data-transformation-activities) section in this article for JSON samples that define transformation activities in a pipeline.

**Copy activity** has two subsections in the typeProperties section: **source** and **sink**. See [DATA STORES](#data-stores) section in this article for JSON samples that show how to use a data store as a source and/or sink.

### Sample copy pipeline
In the following sample pipeline, there is one activity of type **Copy** in the **activities** section. In this sample, the [Copy activity](data-factory-data-movement-activities.md) copies data from an Azure Blob storage to Azure SQL Database.

```json
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
    "start": "2016-07-12T00:00:00",
    "end": "2016-07-13T00:00:00"
  }
}
```

Note the following points:

* In the activities section, there is only one activity whose **type** is set to **Copy**.
* Input for the activity is set to **InputDataset** and output for the activity is set to **OutputDataset**.
* In the **typeProperties** section, **BlobSource** is specified as the source type and **SqlSink** is specified as the sink type.

See [DATA STORES](#data-stores) section in this article for JSON samples that show how to use a data store as a source and/or sink.

For a complete walkthrough of creating this pipeline, see [Tutorial: Copy data from Blob Storage to SQL Database](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md).

### Sample transformation pipeline
In the following sample pipeline, there is one activity of type **HDInsightHive** in the **activities** section. In this sample, the [HDInsight Hive activity](data-factory-hive-activity.md) transforms data from an Azure Blob storage by running a Hive script file on an Azure HDInsight Hadoop cluster.

```json
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
        "start": "2016-04-01T00:00:00",
        "end": "2016-04-02T00:00:00",
        "isPaused": false
    }
}
```

Note the following points:

* In the activities section, there is only one activity whose **type** is set to **HDInsightHive**.
* The Hive script file, **partitionweblogs.hql**, is stored in the Azure storage account (specified by the scriptLinkedService, called **AzureStorageLinkedService**), and in **script** folder in the container **adfgetstarted**.
* The **defines** section is used to specify the runtime settings that are passed to the hive script as Hive configuration values (e.g `${hiveconf:inputtable}`, `${hiveconf:partitionedtable}`).

See [DATA TRANSFORMATION ACTIVITIES](#data-transformation-activities) section in this article for JSON samples that define transformation activities in a pipeline.

For a complete walkthrough of creating this pipeline, see [Tutorial: Build your first pipeline to process data using Hadoop cluster](data-factory-build-your-first-pipeline.md).

## Linked service
The high-level structure for a linked service definition is as follows:

```json
{
    "name": "<name of the linked service>",
    "properties": {
        "type": "<type of the linked service>",
        "typeProperties": {
        }
    }
}
```

Following table describe the properties within the activity JSON definition:

| Property | Description | Required |
| -------- | ----------- | -------- |
| name | Name of the linked service. | Yes |
| properties - type | Type of the linked service. For example: Azure Storage, Azure SQL Database. |
| typeProperties | The typeProperties section has elements that are different for each data store or compute environment. See data stores section for all the data store linked services and [compute environments](#compute-environments) for all the compute linked services |

## Dataset
A dataset in Azure Data Factory is defined as follows:

```json
{
    "name": "<name of dataset>",
    "properties": {
        "type": "<type of dataset: AzureBlob, AzureSql etc...>",
        "external": <boolean flag to indicate external data. only for input datasets>,
        "linkedServiceName": "<Name of the linked service that refers to a data store.>",
        "structure": [
            {
                "name": "<Name of the column>",
                "type": "<Name of the type>"
            }
        ],
        "typeProperties": {
            "<type specific property>": "<value>",
            "<type specific property 2>": "<value 2>",
        },
        "availability": {
            "frequency": "<Specifies the time unit for data slice production. Supported frequency: Minute, Hour, Day, Week, Month>",
            "interval": "<Specifies the interval within the defined frequency. For example, frequency set to 'Hour' and interval set to 1 indicates that new data slices should be produced hourly>"
        },
        "policy":
        {
        }
    }
}
```

The following table describes properties in the above JSON:

| Property | Description | Required | Default |
| --- | --- | --- | --- |
| name | Name of the dataset. See [Azure Data Factory - Naming rules](data-factory-naming-rules.md) for naming rules. |Yes |NA |
| type | Type of the dataset. Specify one of the types supported by Azure Data Factory (for example: AzureBlob, AzureSqlTable). See [DATA STORES](#data-stores) section for all the data stores and dataset types supported by Data Factory. |
| structure | Schema of the dataset. It contains columns, their types, etc. | No |NA |
| typeProperties | Properties corresponding to the selected type. See [DATA STORES](#data-stores) section for supported types and their properties. |Yes |NA |
| external | Boolean flag to specify whether a dataset is explicitly produced by a data factory pipeline or not. |No |false |
| availability | Defines the processing window or the slicing model for the dataset production. For details on the dataset slicing model, see [Scheduling and Execution](data-factory-scheduling-and-execution.md) article. |Yes |NA |
| policy |Defines the criteria or the condition that the dataset slices must fulfill. <br/><br/>For details, see Dataset Policy section. |No |NA |

Each column in the **structure** section contains the following properties:

| Property | Description | Required |
| --- | --- | --- |
| name |Name of the column. |Yes |
| type |Data type of the column.  |No |
| culture |.NET based culture to be used when type is specified and is .NET type `Datetime` or `Datetimeoffset`. Default is `en-us`. |No |
| format |Format string to be used when type is specified and is .NET type `Datetime` or `Datetimeoffset`. |No |

In the following example, the dataset has three columns `slicetimestamp`, `projectname`, and `pageviews` and they are of type: String, String, and Decimal respectively.

```json
structure:
[
    { "name": "slicetimestamp", "type": "String"},
    { "name": "projectname", "type": "String"},
    { "name": "pageviews", "type": "Decimal"}
]
```

The following table describes properties you can use in the **availability** section:

| Property | Description | Required | Default |
| --- | --- | --- | --- |
| frequency |Specifies the time unit for dataset slice production.<br/><br/><b>Supported frequency</b>: Minute, Hour, Day, Week, Month |Yes |NA |
| interval |Specifies a multiplier for frequency<br/><br/>”Frequency x interval” determines how often the slice is produced.<br/><br/>If you need the dataset to be sliced on an hourly basis, you set <b>Frequency</b> to <b>Hour</b>, and <b>interval</b> to <b>1</b>.<br/><br/><b>Note</b>: If you specify Frequency as Minute, we recommend that you set the interval to no less than 15 |Yes |NA |
| style |Specifies whether the slice should be produced at the start/end of the interval.<ul><li>StartOfInterval</li><li>EndOfInterval</li></ul><br/><br/>If Frequency is set to Month and style is set to EndOfInterval, the slice is produced on the last day of month. If the style is set to StartOfInterval, the slice is produced on the first day of month.<br/><br/>If Frequency is set to Day and style is set to EndOfInterval, the slice is produced in the last hour of the day.<br/><br/>If Frequency is set to Hour and style is set to EndOfInterval, the slice is produced at the end of the hour. For example, for a slice for 1 PM – 2 PM period, the slice is produced at 2 PM. |No |EndOfInterval |
| anchorDateTime |Defines the absolute position in time used by scheduler to compute dataset slice boundaries. <br/><br/><b>Note</b>: If the AnchorDateTime has date parts that are more granular than the frequency then the more granular parts are ignored. <br/><br/>For example, if the <b>interval</b> is <b>hourly</b> (frequency: hour and interval: 1) and the <b>AnchorDateTime</b> contains <b>minutes and seconds</b> then the <b>minutes and seconds</b> parts of the AnchorDateTime are ignored. |No |01/01/0001 |
| offset |Timespan by which the start and end of all dataset slices are shifted. <br/><br/><b>Note</b>: If both anchorDateTime and offset are specified, the result is the combined shift. |No |NA |

The following availability section specifies that the output dataset is either produced hourly (or) input dataset is available hourly:

```json
"availability":
{
    "frequency": "Hour",
    "interval": 1
}
```

The **policy** section in dataset definition defines the criteria or the condition that the dataset slices must fulfill.

| Policy Name | Description | Applied To | Required | Default |
| --- | --- | --- | --- | --- |
| minimumSizeMB |Validates that the data in an **Azure blob** meets the minimum size requirements (in megabytes). |Azure Blob |No |NA |
| minimumRows |Validates that the data in **Azure SQL Database** or an **Azure table** contains the minimum number of rows. |<ul><li>Azure SQL Database</li><li>Azure Table</li></ul> |No |NA |

**Example:**

```json
"policy":

{
    "validation":
    {
        "minimumSizeMB": 10.0
    }
}
```

Unless a dataset is being produced by Azure Data Factory, it should be marked as **external**. This setting generally applies to the inputs of first activity in a pipeline unless activity or pipeline chaining is being used.

| Name | Description | Required | Default Value |
| --- | --- | --- | --- |
| dataDelay |Time to delay the check on the availability of the external data for the given slice. For example, if the data is available hourly, the check to see the external data is available and the corresponding slice is Ready can be delayed by using dataDelay.<br/><br/>Only applies to the present time.  For example, if it is 1:00 PM right now and this value is 10 minutes, the validation starts at 1:10 PM.<br/><br/>This setting does not affect slices in the past (slices with Slice End Time + dataDelay < Now) are processed without any delay.<br/><br/>Time greater than 23:59 hours need to specified using the `day.hours:minutes:seconds` format. For example, to specify 24 hours, don't use 24:00:00; instead, use 1.00:00:00. If you use 24:00:00, it is treated as 24 days (24.00:00:00). For 1 day and 4 hours, specify 1:04:00:00. |No |0 |
| retryInterval |The wait time between a failure and the next retry attempt. If a try fails, the next try is after retryInterval. <br/><br/>If it is 1:00 PM right now, we begin the first try. If the duration to complete the first validation check is 1 minute and the operation failed, the next retry is at 1:00 + 1 min (duration) + 1 min (retry interval) = 1:02 PM. <br/><br/>For slices in the past, there is no delay. The retry happens immediately. |No |00:01:00 (1 minute) |
| retryTimeout |The timeout for each retry attempt.<br/><br/>If this property is set to 10 minutes, the validation needs to be completed within 10 minutes. If it takes longer than 10 minutes to perform the validation, the retry times out.<br/><br/>If all attempts for the validation times out, the slice is marked as TimedOut. |No |00:10:00 (10 minutes) |
| maximumRetry |Number of times to check for the availability of the external data. The allowed maximum value is 10. |No |3 |


## DATA STORES
The [Linked service](#linked-service) section provided descriptions for JSON elements that are common to all types of linked services. This section provides details about JSON elements that are specific to each data store.

The [Dataset](#dataset) section provided descriptions for JSON elements that are common to all types of datasets. This section provides details about JSON elements that are specific to each data store.

The [Activity](#activity) section provided descriptions for JSON elements that are common to all types of activities. This section provides details about JSON elements that are specific to each data store when it is used as a source/sink in a copy activity.

Click the link for the store you are interested in to see the JSON schemas for linked service, dataset, and the source/sink for the copy activity.

| Category | Data store
|:--- |:--- |
| **Azure** |[Azure Blob storage](#azure-blob-storage) |
| &nbsp; |Azure Data Lake Store |
| &nbsp; |[Azure Cosmos DB](#azure-cosmos-db) |
| &nbsp; |[Azure SQL Database](#azure-sql-database) |
| &nbsp; |[Azure SQL Data Warehouse](#azure-sql-data-warehouse) |
| &nbsp; |[Azure Cognitive Search](#azure-cognitive-search) |
| &nbsp; |[Azure Table storage](#azure-table-storage) |
| **Databases** |[Amazon Redshift](#amazon-redshift) |
| &nbsp; |[IBM DB2](#ibm-db2) |
| &nbsp; |[MySQL](#mysql) |
| &nbsp; |[Oracle](#oracle) |
| &nbsp; |[PostgreSQL](#postgresql) |
| &nbsp; |[SAP Business Warehouse](#sap-business-warehouse) |
| &nbsp; |[SAP HANA](#sap-hana) |
| &nbsp; |[SQL Server](#sql-server) |
| &nbsp; |[Sybase](#sybase) |
| &nbsp; |[Teradata](#teradata) |
| **NoSQL** |[Cassandra](#cassandra) |
| &nbsp; |[MongoDB](#mongodb) |
| **File** |[Amazon S3](#amazon-s3) |
| &nbsp; |[File System](#file-system) |
| &nbsp; |[FTP](#ftp) |
| &nbsp; |[HDFS](#hdfs) |
| &nbsp; |[SFTP](#sftp) |
| **Others** |[HTTP](#http) |
| &nbsp; |[OData](#odata) |
| &nbsp; |[ODBC](#odbc) |
| &nbsp; |[Salesforce](#salesforce) |
| &nbsp; |Web Table |

## Azure Blob Storage

### Linked service
There are two types of linked services: Azure Storage linked service and Azure Storage SAS linked service.

#### Azure Storage Linked Service
To link your Azure storage account to a data factory by using the **account key**, create an Azure Storage linked service. To define an Azure Storage linked service, set the **type** of the linked service to **AzureStorage**. Then, you can specify following properties in the **typeProperties** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| connectionString |Specify information needed to connect to Azure storage for the connectionString property. |Yes |

##### Example

```json
{
    "name": "StorageLinkedService",
    "properties": {
        "type": "AzureStorage",
        "typeProperties": {
            "connectionString": "DefaultEndpointsProtocol=https;AccountName=<accountname>;AccountKey=<accountkey>"
        }
    }
}
```

#### Azure Storage SAS Linked Service
The Azure Storage SAS linked service allows you to link an Azure Storage Account to an Azure data factory by using a Shared Access Signature (SAS). It provides the data factory with restricted/time-bound access to all/specific resources (blob/container) in the storage. To link your Azure storage account to a data factory by using Shared Access Signature, create an Azure Storage SAS linked service. To define an Azure Storage SAS linked service, set the **type** of the linked service to **AzureStorageSas**. Then, you can specify following properties in the **typeProperties** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| sasUri |Specify Shared Access Signature URI to the Azure Storage resources such as blob, container, or table. |Yes |

##### Example

```json
{
    "name": "StorageSasLinkedService",
    "properties": {
        "type": "AzureStorageSas",
        "typeProperties": {
            "sasUri": "<storageUri>?<sasToken>"
        }
    }
}
```

For more information about these linked services, see [Azure Blob Storage connector](data-factory-azure-blob-connector.md#linked-service-properties) article.

### Dataset
To define an Azure Blob dataset, set the **type** of the dataset to **AzureBlob**. Then, specify the following Azure Blob specific properties in the **typeProperties** section:

| Property | Description | Required |
| --- | --- | --- |
| folderPath |Path to the container and folder in the blob storage. Example: myblobcontainer\myblobfolder\ |Yes |
| fileName |Name of the blob. fileName is optional and case-sensitive.<br/><br/>If you specify a filename, the activity (including Copy) works on the specific Blob.<br/><br/>When fileName is not specified, Copy includes all Blobs in the folderPath for input dataset.<br/><br/>When fileName is not specified for an output dataset, the name of the generated file would be in the following this format: `Data.<Guid>.txt` (for example: : Data.0a405f8a-93ff-4c6f-b3be-f69616f1df7a.txt |No |
| partitionedBy |partitionedBy is an optional property. You can use it to specify a dynamic folderPath and filename for time series data. For example, folderPath can be parameterized for every hour of data. |No |
| format | The following format types are supported: **TextFormat**, **JsonFormat**, **AvroFormat**, **OrcFormat**, **ParquetFormat**. Set the **type** property under format to one of these values. For more information, see [Text Format](data-factory-supported-file-and-compression-formats.md#text-format), [Json Format](data-factory-supported-file-and-compression-formats.md#json-format), [Avro Format](data-factory-supported-file-and-compression-formats.md#avro-format), [Orc Format](data-factory-supported-file-and-compression-formats.md#orc-format), and [Parquet Format](data-factory-supported-file-and-compression-formats.md#parquet-format) sections. <br><br> If you want to **copy files as-is** between file-based stores (binary copy), skip the format section in both input and output dataset definitions. |No |
| compression | Specify the type and level of compression for the data. Supported types are: **GZip**, **Deflate**, **BZip2**, and **ZipDeflate**. Supported levels are: **Optimal** and **Fastest**. For more information, see [File and compression formats in Azure Data Factory](data-factory-supported-file-and-compression-formats.md#compression-support). |No |

#### Example

```json
{
    "name": "AzureBlobInput",
    "properties": {
        "type": "AzureBlob",
        "linkedServiceName": "AzureStorageLinkedService",
        "typeProperties": {
            "fileName": "input.log",
            "folderPath": "adfgetstarted/inputdata",
            "format": {
                "type": "TextFormat",
                "columnDelimiter": ","
            }
        },
        "availability": {
            "frequency": "Month",
            "interval": 1
        },
        "external": true,
        "policy": {}
    }
}
 ```


For more information, see [Azure Blob connector](data-factory-azure-blob-connector.md#dataset-properties) article.

### BlobSource in Copy Activity
If you are copying data from an Azure Blob Storage, set the **source type** of the copy activity to **BlobSource**, and specify following properties in the **source** section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| recursive |Indicates whether the data is read recursively from the sub folders or only from the specified folder. |True (default value), False |No |

#### Example: **BlobSource**
```json
{
    "name": "SamplePipeline",
    "properties": {
        "start": "2016-06-01T18:00:00",
        "end": "2016-06-01T19:00:00",
        "description": "pipeline with copy activity",
        "activities": [{
            "name": "AzureBlobtoSQL",
            "description": "Copy Activity",
            "type": "Copy",
            "inputs": [{
                "name": "AzureBlobInput"
            }],
            "outputs": [{
                "name": "AzureSqlOutput"
            }],
            "typeProperties": {
                "source": {
                    "type": "BlobSource"
                },
                "sink": {
                    "type": "SqlSink"
                }
            },
            "policy": {
                "concurrency": 1,
                "executionPriorityOrder": "OldestFirst",
                "retry": 0,
                "timeout": "01:00:00"
            }
        }]
    }
}
```
### BlobSink in Copy Activity
If you are copying data to an Azure Blob Storage, set the **sink type** of the copy activity to **BlobSink**, and specify following properties in the **sink** section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| copyBehavior |Defines the copy behavior when the source is BlobSource or FileSystem. |<b>PreserveHierarchy</b>: preserves the file hierarchy in the target folder. The relative path of source file to source folder is identical to the relative path of target file to target folder.<br/><br/><b>FlattenHierarchy</b>: all files from the source folder are in the first level of target folder. The target files have auto generated name. <br/><br/><b>MergeFiles (default):</b> merges all files from the source folder to one file. If the File/Blob Name is specified, the merged file name would be the specified name; otherwise, would be auto-generated file name. |No |

#### Example: BlobSink

```json
{
    "name": "SamplePipeline",
    "properties": {
        "start": "2016-06-01T18:00:00",
        "end": "2016-06-01T19:00:00",
        "description": "pipeline for copy activity",
        "activities": [{
            "name": "AzureSQLtoBlob",
            "description": "copy activity",
            "type": "Copy",
            "inputs": [{
                "name": "AzureSQLInput"
            }],
            "outputs": [{
                "name": "AzureBlobOutput"
            }],
            "typeProperties": {
                "source": {
                    "type": "SqlSource",
                    "SqlReaderQuery": "$$Text.Format('select * from MyTable where timestampcolumn >= \\'{0:yyyy-MM-dd HH:mm}\\' AND timestampcolumn < \\'{1:yyyy-MM-dd HH:mm}\\'', WindowStart, WindowEnd)"
                },
                "sink": {
                    "type": "BlobSink"
                }
            },
            "policy": {
                "concurrency": 1,
                "executionPriorityOrder": "OldestFirst",
                "retry": 0,
                "timeout": "01:00:00"
            }
        }]
    }
}
```

For more information, see [Azure Blob connector](data-factory-azure-blob-connector.md#copy-activity-properties) article.

## Azure Data Lake Store

### Linked service
To define an Azure Data Lake Store linked service, set the type of the linked service to **AzureDataLakeStore**, and specify following properties in the **typeProperties** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **AzureDataLakeStore** | Yes |
| dataLakeStoreUri | Specify information about the Azure Data Lake Store account. It is in the following format: `https://[accountname].azuredatalakestore.net/webhdfs/v1` or `adl://[accountname].azuredatalakestore.net/`. | Yes |
| subscriptionId | Azure subscription ID to which Data Lake Store belongs. | Required for sink |
| resourceGroupName | Azure resource group name to which Data Lake Store belongs. | Required for sink |
| servicePrincipalId | Specify the application's client ID. | Yes (for service principal authentication) |
| servicePrincipalKey | Specify the application's key. | Yes (for service principal authentication) |
| tenant | Specify the tenant information (domain name or tenant ID) under which your application resides. You can retrieve it by hovering the mouse in the top-right corner of the Azure portal. | Yes (for service principal authentication) |
| authorization | Click **Authorize** button in the **Data Factory Editor** and enter your credential that assigns the auto-generated authorization URL to this property. | Yes (for user credential authentication)|
| sessionId | OAuth session ID from the OAuth authorization session. Each session ID is unique and may only be used once. This setting is automatically generated when you use Data Factory Editor. | Yes (for user credential authentication) |

#### Example: using service principal authentication
```json
{
    "name": "AzureDataLakeStoreLinkedService",
    "properties": {
        "type": "AzureDataLakeStore",
        "typeProperties": {
            "dataLakeStoreUri": "https://<accountname>.azuredatalakestore.net/webhdfs/v1",
            "servicePrincipalId": "<service principal id>",
            "servicePrincipalKey": "<service principal key>",
            "tenant": "<tenant info. Example: microsoft.onmicrosoft.com>"
        }
    }
}
```

#### Example: using user credential authentication
```json
{
    "name": "AzureDataLakeStoreLinkedService",
    "properties": {
        "type": "AzureDataLakeStore",
        "typeProperties": {
            "dataLakeStoreUri": "https://<accountname>.azuredatalakestore.net/webhdfs/v1",
            "sessionId": "<session ID>",
            "authorization": "<authorization URL>",
            "subscriptionId": "<subscription of ADLS>",
            "resourceGroupName": "<resource group of ADLS>"
        }
    }
}
```

For more information, see [Azure Data Lake Store connector](data-factory-azure-datalake-connector.md#linked-service-properties) article.

### Dataset
To define an Azure Data Lake Store dataset, set the **type** of the dataset to **AzureDataLakeStore**, and specify the following properties in the **typeProperties** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| folderPath |Path to the container and folder in the Azure Data Lake store. |Yes |
| fileName |Name of the file in the Azure Data Lake store. fileName is optional and case-sensitive. <br/><br/>If you specify a filename, the activity (including Copy) works on the specific file.<br/><br/>When fileName is not specified, Copy includes all files in the folderPath for input dataset.<br/><br/>When fileName is not specified for an output dataset, the name of the generated file would be in the following this format: `Data.<Guid>.txt` (for example: : Data.0a405f8a-93ff-4c6f-b3be-f69616f1df7a.txt |No |
| partitionedBy |partitionedBy is an optional property. You can use it to specify a dynamic folderPath and filename for time series data. For example, folderPath can be parameterized for every hour of data. |No |
| format | The following format types are supported: **TextFormat**, **JsonFormat**, **AvroFormat**, **OrcFormat**, **ParquetFormat**. Set the **type** property under format to one of these values. For more information, see [Text Format](data-factory-supported-file-and-compression-formats.md#text-format), [Json Format](data-factory-supported-file-and-compression-formats.md#json-format), [Avro Format](data-factory-supported-file-and-compression-formats.md#avro-format), [Orc Format](data-factory-supported-file-and-compression-formats.md#orc-format), and [Parquet Format](data-factory-supported-file-and-compression-formats.md#parquet-format) sections. <br><br> If you want to **copy files as-is** between file-based stores (binary copy), skip the format section in both input and output dataset definitions. |No |
| compression | Specify the type and level of compression for the data. Supported types are: **GZip**, **Deflate**, **BZip2**, and **ZipDeflate**. Supported levels are: **Optimal** and **Fastest**. For more information, see [File and compression formats in Azure Data Factory](data-factory-supported-file-and-compression-formats.md#compression-support). |No |

#### Example
```json
{
    "name": "AzureDataLakeStoreInput",
    "properties": {
        "type": "AzureDataLakeStore",
        "linkedServiceName": "AzureDataLakeStoreLinkedService",
        "typeProperties": {
            "folderPath": "datalake/input/",
            "fileName": "SearchLog.tsv",
            "format": {
                "type": "TextFormat",
                "rowDelimiter": "\n",
                "columnDelimiter": "\t"
            }
        },
        "external": true,
        "availability": {
            "frequency": "Hour",
            "interval": 1
        },
        "policy": {
            "externalData": {
                "retryInterval": "00:01:00",
                "retryTimeout": "00:10:00",
                "maximumRetry": 3
            }
        }
    }
}
```

For more information, see [Azure Data Lake Store connector](data-factory-azure-datalake-connector.md#dataset-properties) article.

### Azure Data Lake Store Source in Copy Activity
If you are copying data from an Azure Data Lake Store, set the **source type** of the copy activity to **AzureDataLakeStoreSource**, and specify following properties in the **source** section:

**AzureDataLakeStoreSource** supports the following properties **typeProperties** section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| recursive |Indicates whether the data is read recursively from the sub folders or only from the specified folder. |True (default value), False |No |

#### Example: AzureDataLakeStoreSource

```json
{
    "name": "SamplePipeline",
    "properties": {
        "start": "2016-06-01T18:00:00",
        "end": "2016-06-01T19:00:00",
        "description": "pipeline for copy activity",
        "activities": [{
            "name": "AzureDakeLaketoBlob",
            "description": "copy activity",
            "type": "Copy",
            "inputs": [{
                "name": "AzureDataLakeStoreInput"
            }],
            "outputs": [{
                "name": "AzureBlobOutput"
            }],
            "typeProperties": {
                "source": {
                    "type": "AzureDataLakeStoreSource"
                },
                "sink": {
                    "type": "BlobSink"
                }
            },
            "policy": {
                "concurrency": 1,
                "executionPriorityOrder": "OldestFirst",
                "retry": 0,
                "timeout": "01:00:00"
            }
        }]
    }
}
```

For more information, see [Azure Data Lake Store connector](data-factory-azure-datalake-connector.md#copy-activity-properties) article.

### Azure Data Lake Store Sink in Copy Activity
If you are copying data to an Azure Data Lake Store, set the **sink type** of the copy activity to **AzureDataLakeStoreSink**, and specify following properties in the **sink** section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| copyBehavior |Specifies the copy behavior. |<b>PreserveHierarchy</b>: preserves the file hierarchy in the target folder. The relative path of source file to source folder is identical to the relative path of target file to target folder.<br/><br/><b>FlattenHierarchy</b>: all files from the source folder are created in the first level of target folder. The target files are created with auto generated name.<br/><br/><b>MergeFiles</b>: merges all files from the source folder to one file. If the File/Blob Name is specified, the merged file name would be the specified name; otherwise, would be auto-generated file name. |No |

#### Example: AzureDataLakeStoreSink
```json
{
    "name": "SamplePipeline",
    "properties": {
        "start": "2016-06-01T18:00:00",
        "end": "2016-06-01T19:00:00",
        "description": "pipeline with copy activity",
        "activities": [{
            "name": "AzureBlobtoDataLake",
            "description": "Copy Activity",
            "type": "Copy",
            "inputs": [{
                "name": "AzureBlobInput"
            }],
            "outputs": [{
                "name": "AzureDataLakeStoreOutput"
            }],
            "typeProperties": {
                "source": {
                    "type": "BlobSource"
                },
                "sink": {
                    "type": "AzureDataLakeStoreSink"
                }
            },
            "scheduler": {
                "frequency": "Hour",
                "interval": 1
            },
            "policy": {
                "concurrency": 1,
                "executionPriorityOrder": "OldestFirst",
                "retry": 0,
                "timeout": "01:00:00"
            }
        }]
    }
}
```

For more information, see [Azure Data Lake Store connector](data-factory-azure-datalake-connector.md#copy-activity-properties) article.

## Azure Cosmos DB

### Linked service
To define an Azure Cosmos DB linked service, set the **type** of the linked service to **DocumentDb**, and specify following properties in the **typeProperties** section:

| **Property** | **Description** | **Required** |
| --- | --- | --- |
| connectionString |Specify information needed to connect to Azure Cosmos DB database. |Yes |

#### Example

```json
{
    "name": "CosmosDBLinkedService",
    "properties": {
        "type": "DocumentDb",
        "typeProperties": {
            "connectionString": "AccountEndpoint=<EndpointUrl>;AccountKey=<AccessKey>;Database=<Database>"
        }
    }
}
```
For more information, see [Azure Cosmos DB connector](data-factory-azure-documentdb-connector.md#linked-service-properties) article.

### Dataset
To define an Azure Cosmos DB dataset, set the **type** of the dataset to **DocumentDbCollection**, and specify the following properties in the **typeProperties** section:

| **Property** | **Description** | **Required** |
| --- | --- | --- |
| collectionName |Name of the Azure Cosmos DB collection. |Yes |

#### Example

```json
{
    "name": "PersonCosmosDBTable",
    "properties": {
        "type": "DocumentDbCollection",
        "linkedServiceName": "CosmosDBLinkedService",
        "typeProperties": {
            "collectionName": "Person"
        },
        "external": true,
        "availability": {
            "frequency": "Day",
            "interval": 1
        }
    }
}
```
For more information, see [Azure Cosmos DB connector](data-factory-azure-documentdb-connector.md#dataset-properties) article.

### Azure Cosmos DB Collection Source in Copy Activity
If you are copying data from an Azure Cosmos DB, set the **source type** of the copy activity to **DocumentDbCollectionSource**, and specify following properties in the **source** section:


| **Property** | **Description** | **Allowed values** | **Required** |
| --- | --- | --- | --- |
| query |Specify the query to read data. |Query string supported by Azure Cosmos DB. <br/><br/>Example: `SELECT c.BusinessEntityID, c.PersonType, c.NameStyle, c.Title, c.Name.First AS FirstName, c.Name.Last AS LastName, c.Suffix, c.EmailPromotion FROM c WHERE c.ModifiedDate > \"2009-01-01T00:00:00\"` |No <br/><br/>If not specified, the SQL statement that is executed: `select <columns defined in structure> from mycollection` |
| nestingSeparator |Special character to indicate that the document is nested |Any character. <br/><br/>Azure Cosmos DB is a NoSQL store for JSON documents, where nested structures are allowed. Azure Data Factory enables user to denote hierarchy via nestingSeparator, which is “.” in the above examples. With the separator, the copy activity will generate the “Name” object with three children elements First, Middle and Last, according to “Name.First”, “Name.Middle” and “Name.Last” in the table definition. |No |

#### Example

```json
{
    "name": "DocDbToBlobPipeline",
    "properties": {
        "activities": [{
            "type": "Copy",
            "typeProperties": {
                "source": {
                    "type": "DocumentDbCollectionSource",
                    "query": "SELECT Person.Id, Person.Name.First AS FirstName, Person.Name.Middle as MiddleName, Person.Name.Last AS LastName FROM Person",
                    "nestingSeparator": "."
                },
                "sink": {
                    "type": "BlobSink",
                    "blobWriterAddHeader": true,
                    "writeBatchSize": 1000,
                    "writeBatchTimeout": "00:00:59"
                }
            },
            "inputs": [{
                "name": "PersonCosmosDBTable"
            }],
            "outputs": [{
                "name": "PersonBlobTableOut"
            }],
            "policy": {
                "concurrency": 1
            },
            "name": "CopyFromCosmosDbToBlob"
        }],
        "start": "2016-04-01T00:00:00",
        "end": "2016-04-02T00:00:00"
    }
}
```

### Azure Cosmos DB Collection Sink in Copy Activity
If you are copying data to Azure Cosmos DB, set the **sink type** of the copy activity to **DocumentDbCollectionSink**, and specify following properties in the **sink** section:

| **Property** | **Description** | **Allowed values** | **Required** |
| --- | --- | --- | --- |
| nestingSeparator |A special character in the source column name to indicate that nested document is needed. <br/><br/>For example above: `Name.First` in the output table produces the following JSON structure in the Cosmos DB document:<br/><br/>"Name": {<br/>    "First": "John"<br/>}, |Character that is used to separate nesting levels.<br/><br/>Default value is `.` (dot). |Character that is used to separate nesting levels. <br/><br/>Default value is `.` (dot). |
| writeBatchSize |Number of parallel requests to Azure Cosmos DB service to create documents.<br/><br/>You can fine-tune the performance when copying data to/from Azure Cosmos DB by using this property. You can expect a better performance when you increase writeBatchSize because more parallel requests to Azure Cosmos DB are sent. However you’ll need to avoid throttling that can throw the error message: "Request rate is large".<br/><br/>Throttling is decided by a number of factors, including size of documents, number of terms in documents, indexing policy of target collection, etc. For copy operations, you can use a better collection (for example, S3) to have the most throughput available (2,500 request units/second). |Integer |No (default: 5) |
| writeBatchTimeout |Wait time for the operation to complete before it times out. |timespan<br/><br/> Example: “00:30:00” (30 minutes). |No |

#### Example

```json
{
    "name": "BlobToDocDbPipeline",
    "properties": {
        "activities": [{
            "type": "Copy",
            "typeProperties": {
                "source": {
                    "type": "BlobSource"
                },
                "sink": {
                    "type": "DocumentDbCollectionSink",
                    "nestingSeparator": ".",
                    "writeBatchSize": 2,
                    "writeBatchTimeout": "00:00:00"
                },
                "translator": {
                    "type": "TabularTranslator",
                    "ColumnMappings": "FirstName: Name.First, MiddleName: Name.Middle, LastName: Name.Last, BusinessEntityID: BusinessEntityID, PersonType: PersonType, NameStyle: NameStyle, Title: Title, Suffix: Suffix"
                }
            },
            "inputs": [{
                "name": "PersonBlobTableIn"
            }],
            "outputs": [{
                "name": "PersonCosmosDbTableOut"
            }],
            "policy": {
                "concurrency": 1
            },
            "name": "CopyFromBlobToCosmosDb"
        }],
        "start": "2016-04-14T00:00:00",
        "end": "2016-04-15T00:00:00"
    }
}
```

For more information, see [Azure Cosmos DB connector](data-factory-azure-documentdb-connector.md#copy-activity-properties) article.

## Azure SQL Database

### Linked service
To define an Azure SQL Database linked service, set the **type** of the linked service to **AzureSqlDatabase**, and specify following properties in the **typeProperties** section:

| Property | Description | Required |
| --- | --- | --- |
| connectionString |Specify information needed to connect to the Azure SQL Database instance for the connectionString property. |Yes |

#### Example
```json
{
    "name": "AzureSqlLinkedService",
    "properties": {
        "type": "AzureSqlDatabase",
        "typeProperties": {
            "connectionString": "Server=tcp:<servername>.database.windows.net,1433;Database=<databasename>;User ID=<username>@<servername>;Password=<password>;Trusted_Connection=False;Encrypt=True;Connection Timeout=30"
        }
    }
}
```

For more information, see [Azure SQL connector](data-factory-azure-sql-connector.md#linked-service-properties) article.

### Dataset
To define an Azure SQL Database dataset, set the **type** of the dataset to **AzureSqlTable**, and specify the following properties in the **typeProperties** section:

| Property | Description | Required |
| --- | --- | --- |
| tableName |Name of the table or view in the Azure SQL Database instance that linked service refers to. |Yes |

#### Example

```json
{
    "name": "AzureSqlInput",
    "properties": {
        "type": "AzureSqlTable",
        "linkedServiceName": "AzureSqlLinkedService",
        "typeProperties": {
            "tableName": "MyTable"
        },
        "external": true,
        "availability": {
            "frequency": "Hour",
            "interval": 1
        },
        "policy": {
            "externalData": {
                "retryInterval": "00:01:00",
                "retryTimeout": "00:10:00",
                "maximumRetry": 3
            }
        }
    }
}
```
For more information, see [Azure SQL connector](data-factory-azure-sql-connector.md#dataset-properties) article.

### SQL Source in Copy Activity
If you are copying data from an Azure SQL Database, set the **source type** of the copy activity to **SqlSource**, and specify following properties in the **source** section:


| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| sqlReaderQuery |Use the custom query to read data. |SQL query string. Example: `select * from MyTable`. |No |
| sqlReaderStoredProcedureName |Name of the stored procedure that reads data from the source table. |Name of the stored procedure. |No |
| storedProcedureParameters |Parameters for the stored procedure. |Name/value pairs. Names and casing of parameters must match the names and casing of the stored procedure parameters. |No |

#### Example

```json
{
    "name": "SamplePipeline",
    "properties": {
        "start": "2016-06-01T18:00:00",
        "end": "2016-06-01T19:00:00",
        "description": "pipeline for copy activity",
        "activities": [{
            "name": "AzureSQLtoBlob",
            "description": "copy activity",
            "type": "Copy",
            "inputs": [{
                "name": "AzureSQLInput"
            }],
            "outputs": [{
                "name": "AzureBlobOutput"
            }],
            "typeProperties": {
                "source": {
                    "type": "SqlSource",
                    "SqlReaderQuery": "$$Text.Format('select * from MyTable where timestampcolumn >= \\'{0:yyyy-MM-dd HH:mm}\\' AND timestampcolumn < \\'{1:yyyy-MM-dd HH:mm}\\'', WindowStart, WindowEnd)"
                },
                "sink": {
                    "type": "BlobSink"
                }
            },
            "scheduler": {
                "frequency": "Hour",
                "interval": 1
            },
            "policy": {
                "concurrency": 1,
                "executionPriorityOrder": "OldestFirst",
                "retry": 0,
                "timeout": "01:00:00"
            }
        }]
    }
}
```
For more information, see [Azure SQL connector](data-factory-azure-sql-connector.md#copy-activity-properties) article.

### SQL Sink in Copy Activity
If you are copying data to Azure SQL Database, set the **sink type** of the copy activity to **SqlSink**, and specify following properties in the **sink** section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| writeBatchTimeout |Wait time for the batch insert operation to complete before it times out. |timespan<br/><br/> Example: “00:30:00” (30 minutes). |No |
| writeBatchSize |Inserts data into the SQL table when the buffer size reaches writeBatchSize. |Integer (number of rows) |No (default: 10000) |
| sqlWriterCleanupScript |Specify a query for Copy Activity to execute such that data of a specific slice is cleaned up. |A query statement. |No |
| sliceIdentifierColumnName |Specify a column name for Copy Activity to fill with auto generated slice identifier, which is used to clean up data of a specific slice when rerun. |Column name of a column with data type of binary(32). |No |
| sqlWriterStoredProcedureName |Name of the stored procedure that upserts (updates/inserts) data into the target table. |Name of the stored procedure. |No |
| storedProcedureParameters |Parameters for the stored procedure. |Name/value pairs. Names and casing of parameters must match the names and casing of the stored procedure parameters. |No |
| sqlWriterTableType |Specify a table type name to be used in the stored procedure. Copy activity makes the data being moved available in a temp table with this table type. Stored procedure code can then merge the data being copied with existing data. |A table type name. |No |

#### Example

```json
{
    "name": "SamplePipeline",
    "properties": {
        "start": "2016-06-01T18:00:00",
        "end": "2016-06-01T19:00:00",
        "description": "pipeline with copy activity",
        "activities": [{
            "name": "AzureBlobtoSQL",
            "description": "Copy Activity",
            "type": "Copy",
            "inputs": [{
                "name": "AzureBlobInput"
            }],
            "outputs": [{
                "name": "AzureSqlOutput"
            }],
            "typeProperties": {
                "source": {
                    "type": "BlobSource",
                    "blobColumnSeparators": ","
                },
                "sink": {
                    "type": "SqlSink"
                }
            },
            "scheduler": {
                "frequency": "Hour",
                "interval": 1
            },
            "policy": {
                "concurrency": 1,
                "executionPriorityOrder": "OldestFirst",
                "retry": 0,
                "timeout": "01:00:00"
            }
        }]
    }
}
```

For more information, see [Azure SQL connector](data-factory-azure-sql-connector.md#copy-activity-properties) article.

## Azure SQL Data Warehouse

### Linked service
To define an Azure SQL Data Warehouse linked service, set the **type** of the linked service to **AzureSqlDW**, and specify following properties in the **typeProperties** section:

| Property | Description | Required |
| --- | --- | --- |
| connectionString |Specify information needed to connect to the Azure SQL Data Warehouse instance for the connectionString property. |Yes |



#### Example

```json
{
    "name": "AzureSqlDWLinkedService",
    "properties": {
        "type": "AzureSqlDW",
        "typeProperties": {
            "connectionString": "Server=tcp:<servername>.database.windows.net,1433;Database=<databasename>;User ID=<username>@<servername>;Password=<password>;Trusted_Connection=False;Encrypt=True;Connection Timeout=30"
        }
    }
}
```

For more information, see [Azure SQL Data Warehouse connector](data-factory-azure-sql-data-warehouse-connector.md#linked-service-properties) article.

### Dataset
To define an Azure SQL Data Warehouse dataset, set the **type** of the dataset to **AzureSqlDWTable**, and specify the following properties in the **typeProperties** section:

| Property | Description | Required |
| --- | --- | --- |
| tableName |Name of the table or view in the Azure SQL Data Warehouse database that the linked service refers to. |Yes |

#### Example

```json
{
    "name": "AzureSqlDWInput",
    "properties": {
    "type": "AzureSqlDWTable",
        "linkedServiceName": "AzureSqlDWLinkedService",
        "typeProperties": {
            "tableName": "MyTable"
        },
        "external": true,
        "availability": {
            "frequency": "Hour",
            "interval": 1
        },
        "policy": {
            "externalData": {
                "retryInterval": "00:01:00",
                "retryTimeout": "00:10:00",
                "maximumRetry": 3
            }
        }
    }
}
```

For more information, see [Azure SQL Data Warehouse connector](data-factory-azure-sql-data-warehouse-connector.md#dataset-properties) article.

### SQL DW Source in Copy Activity
If you are copying data from Azure SQL Data Warehouse, set the **source type** of the copy activity to **SqlDWSource**, and specify following properties in the **source** section:


| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| sqlReaderQuery |Use the custom query to read data. |SQL query string. For example: `select * from MyTable`. |No |
| sqlReaderStoredProcedureName |Name of the stored procedure that reads data from the source table. |Name of the stored procedure. |No |
| storedProcedureParameters |Parameters for the stored procedure. |Name/value pairs. Names and casing of parameters must match the names and casing of the stored procedure parameters. |No |

#### Example

```json
{
    "name": "SamplePipeline",
    "properties": {
        "start": "2016-06-01T18:00:00",
        "end": "2016-06-01T19:00:00",
        "description": "pipeline for copy activity",
        "activities": [{
            "name": "AzureSQLDWtoBlob",
            "description": "copy activity",
            "type": "Copy",
            "inputs": [{
                "name": "AzureSqlDWInput"
            }],
            "outputs": [{
                "name": "AzureBlobOutput"
            }],
            "typeProperties": {
                "source": {
                    "type": "SqlDWSource",
                    "sqlReaderQuery": "$$Text.Format('select * from MyTable where timestampcolumn >= \\'{0:yyyy-MM-dd HH:mm}\\' AND timestampcolumn < \\'{1:yyyy-MM-dd HH:mm}\\'', WindowStart, WindowEnd)"
                },
                "sink": {
                    "type": "BlobSink"
                }
            },
            "scheduler": {
                "frequency": "Hour",
                "interval": 1
            },
            "policy": {
                "concurrency": 1,
                "executionPriorityOrder": "OldestFirst",
                "retry": 0,
                "timeout": "01:00:00"
            }
        }]
    }
}
```

For more information, see [Azure SQL Data Warehouse connector](data-factory-azure-sql-data-warehouse-connector.md#copy-activity-properties) article.

### SQL DW Sink in Copy Activity
If you are copying data to Azure SQL Data Warehouse, set the **sink type** of the copy activity to **SqlDWSink**, and specify following properties in the **sink** section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| sqlWriterCleanupScript |Specify a query for Copy Activity to execute such that data of a specific slice is cleaned up. |A query statement. |No |
| allowPolyBase |Indicates whether to use PolyBase (when applicable) instead of BULKINSERT mechanism. <br/><br/> **Using PolyBase is the recommended way to load data into SQL Data Warehouse.** |True <br/>False (default) |No |
| polyBaseSettings |A group of properties that can be specified when the **allowPolybase** property is set to **true**. |&nbsp; |No |
| rejectValue |Specifies the number or percentage of rows that can be rejected before the query fails. <br/><br/>Learn more about the PolyBase’s reject options in the **Arguments** section of [CREATE EXTERNAL TABLE (Transact-SQL)](https://msdn.microsoft.com/library/dn935021.aspx) topic. |0 (default), 1, 2, … |No |
| rejectType |Specifies whether the rejectValue option is specified as a literal value or a percentage. |Value (default), Percentage |No |
| rejectSampleValue |Determines the number of rows to retrieve before the PolyBase recalculates the percentage of rejected rows. |1, 2, … |Yes, if **rejectType** is **percentage** |
| useTypeDefault |Specifies how to handle missing values in delimited text files when PolyBase retrieves data from the text file.<br/><br/>Learn more about this property from the Arguments section in [CREATE EXTERNAL FILE FORMAT (Transact-SQL)](https://msdn.microsoft.com/library/dn935026.aspx). |True, False (default) |No |
| writeBatchSize |Inserts data into the SQL table when the buffer size reaches writeBatchSize |Integer (number of rows) |No (default: 10000) |
| writeBatchTimeout |Wait time for the batch insert operation to complete before it times out. |timespan<br/><br/> Example: “00:30:00” (30 minutes). |No |

#### Example

```json
{
    "name": "SamplePipeline",
    "properties": {
        "start": "2016-06-01T18:00:00",
        "end": "2016-06-01T19:00:00",
        "description": "pipeline with copy activity",
        "activities": [{
            "name": "AzureBlobtoSQLDW",
            "description": "Copy Activity",
            "type": "Copy",
            "inputs": [{
                "name": "AzureBlobInput"
            }],
            "outputs": [{
                "name": "AzureSqlDWOutput"
            }],
            "typeProperties": {
                "source": {
                "type": "BlobSource",
                    "blobColumnSeparators": ","
                },
                "sink": {
                    "type": "SqlDWSink",
                    "allowPolyBase": true
                }
            },
            "scheduler": {
                "frequency": "Hour",
                "interval": 1
            },
            "policy": {
                "concurrency": 1,
                "executionPriorityOrder": "OldestFirst",
                "retry": 0,
                "timeout": "01:00:00"
            }
        }]
    }
}
```

For more information, see [Azure SQL Data Warehouse connector](data-factory-azure-sql-data-warehouse-connector.md#copy-activity-properties) article.

## Azure Cognitive Search

### Linked service
To define an Azure Cognitive Search linked service, set the **type** of the linked service to **AzureSearch**, and specify following properties in the **typeProperties** section:

| Property | Description | Required |
| -------- | ----------- | -------- |
| url | URL for the search service. | Yes |
| key | Admin key for the search service. | Yes |

#### Example

```json
{
    "name": "AzureSearchLinkedService",
    "properties": {
        "type": "AzureSearch",
        "typeProperties": {
            "url": "https://<service>.search.windows.net",
            "key": "<AdminKey>"
        }
    }
}
```

For more information, see [Azure Cognitive Search connector](data-factory-azure-search-connector.md#linked-service-properties) article.

### Dataset
To define an Azure Cognitive Search dataset, set the **type** of the dataset to **AzureSearchIndex**, and specify the following properties in the **typeProperties** section:

| Property | Description | Required |
| -------- | ----------- | -------- |
| type | The type property must be set to **AzureSearchIndex**.| Yes |
| indexName | Name of the search index. Data Factory does not create the index. The index must exist in Azure Cognitive Search. | Yes |

#### Example

```json
{
    "name": "AzureSearchIndexDataset",
    "properties": {
        "type": "AzureSearchIndex",
        "linkedServiceName": "AzureSearchLinkedService",
        "typeProperties": {
            "indexName": "products"
        },
        "availability": {
            "frequency": "Minute",
            "interval": 15
        }
    }
}
```

For more information, see [Azure Cognitive Search connector](data-factory-azure-search-connector.md#dataset-properties) article.

### Azure Cognitive Search Index Sink in Copy Activity
If you are copying data to a search index, set the **sink type** of the copy activity to **AzureSearchIndexSink**, and specify following properties in the **sink** section:

| Property | Description | Allowed values | Required |
| -------- | ----------- | -------------- | -------- |
| WriteBehavior | Specifies whether to merge or replace when a document already exists in the index. | Merge (default)<br/>Upload| No |
| WriteBatchSize | Uploads data into the search index when the buffer size reaches writeBatchSize. | 1 to 1,000. Default value is 1000. | No |

#### Example

```json
{
    "name": "SamplePipeline",
    "properties": {
        "start": "2016-06-01T18:00:00",
        "end": "2016-06-01T19:00:00",
        "description": "pipeline for copy activity",
        "activities": [{
            "name": "SqlServertoAzureSearchIndex",
            "description": "copy activity",
            "type": "Copy",
            "inputs": [{
                "name": " SqlServerInput"
            }],
            "outputs": [{
                "name": "AzureSearchIndexDataset"
            }],
            "typeProperties": {
                "source": {
                    "type": "SqlSource",
                    "SqlReaderQuery": "$$Text.Format('select * from MyTable where timestampcolumn >= \\'{0:yyyy-MM-dd HH:mm}\\' AND timestampcolumn < \\'{1:yyyy-MM-dd HH:mm}\\'', WindowStart, WindowEnd)"
                },
                "sink": {
                    "type": "AzureSearchIndexSink"
                }
            },
            "scheduler": {
                "frequency": "Hour",
                "interval": 1
            },
            "policy": {
                "concurrency": 1,
                "executionPriorityOrder": "OldestFirst",
                "retry": 0,
                "timeout": "01:00:00"
            }
        }]
    }
}
```

For more information, see [Azure Cognitive Search connector](data-factory-azure-search-connector.md#copy-activity-properties) article.

## Azure Table Storage

### Linked service
There are two types of linked services: Azure Storage linked service and Azure Storage SAS linked service.

#### Azure Storage Linked Service
To link your Azure storage account to a data factory by using the **account key**, create an Azure Storage linked service. To define an Azure Storage linked service, set the **type** of the linked service to **AzureStorage**. Then, you can specify following properties in the **typeProperties** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type |The type property must be set to: **AzureStorage** |Yes |
| connectionString |Specify information needed to connect to Azure storage for the connectionString property. |Yes |

**Example:**

```json
{
    "name": "StorageLinkedService",
    "properties": {
        "type": "AzureStorage",
        "typeProperties": {
            "connectionString": "DefaultEndpointsProtocol=https;AccountName=<accountname>;AccountKey=<accountkey>"
        }
    }
}
```

#### Azure Storage SAS Linked Service
The Azure Storage SAS linked service allows you to link an Azure Storage Account to an Azure data factory by using a Shared Access Signature (SAS). It provides the data factory with restricted/time-bound access to all/specific resources (blob/container) in the storage. To link your Azure storage account to a data factory by using Shared Access Signature, create an Azure Storage SAS linked service. To define an Azure Storage SAS linked service, set the **type** of the linked service to **AzureStorageSas**. Then, you can specify following properties in the **typeProperties** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type |The type property must be set to: **AzureStorageSas** |Yes |
| sasUri |Specify Shared Access Signature URI to the Azure Storage resources such as blob, container, or table. |Yes |

**Example:**

```json
{
    "name": "StorageSasLinkedService",
    "properties": {
        "type": "AzureStorageSas",
        "typeProperties": {
            "sasUri": "<storageUri>?<sasToken>"
        }
    }
}
```

For more information about these linked services, see [Azure Table Storage connector](data-factory-azure-table-connector.md#linked-service-properties) article.

### Dataset
To define an Azure Table dataset, set the **type** of the dataset to **AzureTable**, and specify the following properties in the **typeProperties** section:

| Property | Description | Required |
| --- | --- | --- |
| tableName |Name of the table in the Azure Table Database instance that linked service refers to. |Yes. When a tableName is specified without an azureTableSourceQuery, all records from the table are copied to the destination. If an azureTableSourceQuery is also specified, records from the table that satisfies the query are copied to the destination. |

#### Example

```json
{
    "name": "AzureTableInput",
    "properties": {
        "type": "AzureTable",
        "linkedServiceName": "StorageLinkedService",
        "typeProperties": {
            "tableName": "MyTable"
        },
        "external": true,
        "availability": {
            "frequency": "Hour",
            "interval": 1
        },
        "policy": {
            "externalData": {
                "retryInterval": "00:01:00",
                "retryTimeout": "00:10:00",
                "maximumRetry": 3
            }
        }
    }
}
```

For more information about these linked services, see [Azure Table Storage connector](data-factory-azure-table-connector.md#dataset-properties) article.

### Azure Table Source in Copy Activity
If you are copying data from Azure Table Storage, set the **source type** of the copy activity to **AzureTableSource**, and specify following properties in the **source** section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| azureTableSourceQuery |Use the custom query to read data. |Azure table query string. See examples in the next section. |No. When a tableName is specified without an azureTableSourceQuery, all records from the table are copied to the destination. If an azureTableSourceQuery is also specified, records from the table that satisfies the query are copied to the destination. |
| azureTableSourceIgnoreTableNotFound |Indicate whether swallow the exception of table not exist. |TRUE<br/>FALSE |No |

#### Example

```json
{
    "name": "SamplePipeline",
    "properties": {
        "start": "2016-06-01T18:00:00",
        "end": "2016-06-01T19:00:00",
        "description": "pipeline for copy activity",
        "activities": [{
            "name": "AzureTabletoBlob",
            "description": "copy activity",
            "type": "Copy",
            "inputs": [{
                "name": "AzureTableInput"
            }],
            "outputs": [{
                "name": "AzureBlobOutput"
            }],
            "typeProperties": {
                "source": {
                    "type": "AzureTableSource",
                    "AzureTableSourceQuery": "PartitionKey eq 'DefaultPartitionKey'"
                },
                "sink": {
                    "type": "BlobSink"
                }
            },
            "scheduler": {
                "frequency": "Hour",
                "interval": 1
            },
            "policy": {
                "concurrency": 1,
                "executionPriorityOrder": "OldestFirst",
                "retry": 0,
                "timeout": "01:00:00"
            }
        }]
    }
}
```

For more information about these linked services, see [Azure Table Storage connector](data-factory-azure-table-connector.md#copy-activity-properties) article.

### Azure Table Sink in Copy Activity
If you are copying data to Azure Table Storage, set the **sink type** of the copy activity to **AzureTableSink**, and specify following properties in the **sink** section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| azureTableDefaultPartitionKeyValue |Default partition key value that can be used by the sink. |A string value. |No |
| azureTablePartitionKeyName |Specify name of the column whose values are used as partition keys. If not specified, AzureTableDefaultPartitionKeyValue is used as the partition key. |A column name. |No |
| azureTableRowKeyName |Specify name of the column whose column values are used as row key. If not specified, use a GUID for each row. |A column name. |No |
| azureTableInsertType |The mode to insert data into Azure table.<br/><br/>This property controls whether existing rows in the output table with matching partition and row keys have their values replaced or merged. <br/><br/>To learn about how these settings (merge and replace) work, see [Insert or Merge Entity](https://msdn.microsoft.com/library/azure/hh452241.aspx) and [Insert or Replace Entity](https://msdn.microsoft.com/library/azure/hh452242.aspx) topics. <br/><br> This setting applies at the row level, not the table level, and neither option deletes rows in the output table that do not exist in the input. |merge (default)<br/>replace |No |
| writeBatchSize |Inserts data into the Azure table when the writeBatchSize or writeBatchTimeout is hit. |Integer (number of rows) |No (default: 10000) |
| writeBatchTimeout |Inserts data into the Azure table when the writeBatchSize or writeBatchTimeout is hit |timespan<br/><br/>Example: “00:20:00” (20 minutes) |No (Default to storage client default timeout value 90 sec) |

#### Example

```json
{
    "name": "SamplePipeline",
    "properties": {
        "start": "2016-06-01T18:00:00",
        "end": "2016-06-01T19:00:00",
        "description": "pipeline with copy activity",
        "activities": [{
            "name": "AzureBlobtoTable",
            "description": "Copy Activity",
            "type": "Copy",
            "inputs": [{
                "name": "AzureBlobInput"
            }],
            "outputs": [{
                "name": "AzureTableOutput"
            }],
            "typeProperties": {
                "source": {
                    "type": "BlobSource"
                },
                "sink": {
                    "type": "AzureTableSink",
                    "writeBatchSize": 100,
                    "writeBatchTimeout": "01:00:00"
                }
            },
            "scheduler": {
                "frequency": "Hour",
                "interval": 1
            },
            "policy": {
                "concurrency": 1,
                "executionPriorityOrder": "OldestFirst",
                "retry": 0,
                "timeout": "01:00:00"
            }
        }]
    }
}
```
For more information about these linked services, see [Azure Table Storage connector](data-factory-azure-table-connector.md#copy-activity-properties) article.

## Amazon RedShift

### Linked service
To define an Amazon Redshift linked service, set the **type** of the linked service to **AmazonRedshift**, and specify following properties in the **typeProperties** section:

| Property | Description | Required |
| --- | --- | --- |
| server |IP address or host name of the Amazon Redshift server. |Yes |
| port |The number of the TCP port that the Amazon Redshift server uses to listen for client connections. |No, default value: 5439 |
| database |Name of the Amazon Redshift database. |Yes |
| username |Name of user who has access to the database. |Yes |
| password |Password for the user account. |Yes |

#### Example

```json
{
    "name": "AmazonRedshiftLinkedService",
    "properties": {
        "type": "AmazonRedshift",
        "typeProperties": {
            "server": "<Amazon Redshift host name or IP address>",
            "port": 5439,
            "database": "<database name>",
            "username": "user",
            "password": "password"
        }
    }
}
```

For more information, see Amazon Redshift connector article.

### Dataset
To define an Amazon Redshift dataset, set the **type** of the dataset to **RelationalTable**, and specify the following properties in the **typeProperties** section:

| Property | Description | Required |
| --- | --- | --- |
| tableName |Name of the table in the Amazon Redshift database that linked service refers to. |No (if **query** of **RelationalSource** is specified) |


#### Example

```json
{
    "name": "AmazonRedshiftInputDataset",
    "properties": {
        "type": "RelationalTable",
        "linkedServiceName": "AmazonRedshiftLinkedService",
        "typeProperties": {
            "tableName": "<Table name>"
        },
        "availability": {
            "frequency": "Hour",
            "interval": 1
        },
        "external": true
    }
}
```
For more information, see Amazon Redshift connector article.

### Relational Source in Copy Activity
If you are copying data from Amazon Redshift, set the **source type** of the copy activity to **RelationalSource**, and specify following properties in the **source** section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| query |Use the custom query to read data. |SQL query string. For example: `select * from MyTable`. |No (if **tableName** of **dataset** is specified) |

#### Example

```json
{
    "name": "CopyAmazonRedshiftToBlob",
    "properties": {
        "description": "pipeline for copy activity",
        "activities": [{
            "type": "Copy",
            "typeProperties": {
                "source": {
                    "type": "RelationalSource",
                    "query": "$$Text.Format('select * from MyTable where timestamp >= \\'{0:yyyy-MM-ddTHH:mm:ss}\\' AND timestamp < \\'{1:yyyy-MM-ddTHH:mm:ss}\\'', WindowStart, WindowEnd)"
                },
                "sink": {
                    "type": "BlobSink",
                    "writeBatchSize": 0,
                    "writeBatchTimeout": "00:00:00"
                }
            },
            "inputs": [{
                "name": "AmazonRedshiftInputDataset"
            }],
            "outputs": [{
                "name": "AzureBlobOutputDataSet"
            }],
            "policy": {
                "timeout": "01:00:00",
                "concurrency": 1
            },
            "scheduler": {
                "frequency": "Hour",
                "interval": 1
            },
            "name": "AmazonRedshiftToBlob"
        }],
        "start": "2016-06-01T18:00:00",
        "end": "2016-06-01T19:00:00"
    }
}
```
For more information, see Amazon Redshift connector article.

## IBM DB2

### Linked service
To define an IBM DB2 linked service, set the **type** of the linked service to **OnPremisesDB2**, and specify following properties in the **typeProperties** section:

| Property | Description | Required |
| --- | --- | --- |
| server |Name of the DB2 server. |Yes |
| database |Name of the DB2 database. |Yes |
| schema |Name of the schema in the database. The schema name is case-sensitive. |No |
| authenticationType |Type of authentication used to connect to the DB2 database. Possible values are: Anonymous, Basic, and Windows. |Yes |
| username |Specify user name if you are using Basic or Windows authentication. |No |
| password |Specify password for the user account you specified for the username. |No |
| gatewayName |Name of the gateway that the Data Factory service should use to connect to the on-premises DB2 database. |Yes |

#### Example
```json
{
    "name": "OnPremDb2LinkedService",
    "properties": {
        "type": "OnPremisesDb2",
        "typeProperties": {
            "server": "<server>",
            "database": "<database>",
            "schema": "<schema>",
            "authenticationType": "<authentication type>",
            "username": "<username>",
            "password": "<password>",
            "gatewayName": "<gatewayName>"
        }
    }
}
```
For more information, see IBM DB2 connector article.

### Dataset
To define a DB2 dataset, set the **type** of the dataset to **RelationalTable**, and specify the following properties in the **typeProperties** section:

| Property | Description | Required |
| --- | --- | --- |
| tableName |Name of the table in the DB2 Database instance that linked service refers to. The tableName is case-sensitive. |No (if **query** of **RelationalSource** is specified)

#### Example
```json
{
    "name": "Db2DataSet",
    "properties": {
        "type": "RelationalTable",
        "linkedServiceName": "OnPremDb2LinkedService",
        "typeProperties": {},
        "availability": {
            "frequency": "Hour",
            "interval": 1
        },
        "external": true,
        "policy": {
            "externalData": {
                "retryInterval": "00:01:00",
                "retryTimeout": "00:10:00",
                "maximumRetry": 3
            }
        }
    }
}
```

For more information, see IBM DB2 connector article.

### Relational Source in Copy Activity
If you are copying data from IBM DB2, set the **source type** of the copy activity to **RelationalSource**, and specify following properties in the **source** section:


| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| query |Use the custom query to read data. |SQL query string. For example: `"query": "select * from "MySchema"."MyTable""`. |No (if **tableName** of **dataset** is specified) |

#### Example
```json
{
    "name": "CopyDb2ToBlob",
    "properties": {
        "description": "pipeline for copy activity",
        "activities": [{
            "type": "Copy",
            "typeProperties": {
                "source": {
                    "type": "RelationalSource",
                    "query": "select * from \"Orders\""
                },
                "sink": {
                    "type": "BlobSink"
                }
            },
            "inputs": [{
                "name": "Db2DataSet"
            }],
            "outputs": [{
                "name": "AzureBlobDb2DataSet"
            }],
            "policy": {
                "timeout": "01:00:00",
                "concurrency": 1
            },
            "scheduler": {
                "frequency": "Hour",
                "interval": 1
            },
            "name": "Db2ToBlob"
        }],
        "start": "2016-06-01T18:00:00",
        "end": "2016-06-01T19:00:00"
    }
}
```
For more information, see IBM DB2 connector article.

## MySQL

### Linked service
To define a MySQL linked service, set the **type** of the linked service to **OnPremisesMySql**, and specify following properties in the **typeProperties** section:

| Property | Description | Required |
| --- | --- | --- |
| server |Name of the MySQL server. |Yes |
| database |Name of the MySQL database. |Yes |
| schema |Name of the schema in the database. |No |
| authenticationType |Type of authentication used to connect to the MySQL database. Possible values are: `Basic`. |Yes |
| userName |Specify user name to connect to the MySQL database. |Yes |
| password |Specify password for the user account you specified. |Yes |
| gatewayName |Name of the gateway that the Data Factory service should use to connect to the on-premises MySQL database. |Yes |

#### Example

```json
{
    "name": "OnPremMySqlLinkedService",
    "properties": {
        "type": "OnPremisesMySql",
        "typeProperties": {
            "server": "<server name>",
            "database": "<database name>",
            "schema": "<schema name>",
            "authenticationType": "<authentication type>",
            "userName": "<user name>",
            "password": "<password>",
            "gatewayName": "<gateway>"
        }
    }
}
```

For more information, see [MySQL connector](data-factory-onprem-mysql-connector.md#linked-service-properties) article.

### Dataset
To define a MySQL dataset, set the **type** of the dataset to **RelationalTable**, and specify the following properties in the **typeProperties** section:

| Property | Description | Required |
| --- | --- | --- |
| tableName |Name of the table in the MySQL Database instance that linked service refers to. |No (if **query** of **RelationalSource** is specified) |

#### Example

```json
{
    "name": "MySqlDataSet",
    "properties": {
        "type": "RelationalTable",
        "linkedServiceName": "OnPremMySqlLinkedService",
        "typeProperties": {},
        "availability": {
            "frequency": "Hour",
            "interval": 1
        },
        "external": true,
        "policy": {
            "externalData": {
                "retryInterval": "00:01:00",
                "retryTimeout": "00:10:00",
                "maximumRetry": 3
            }
        }
    }
}
```
For more information, see [MySQL connector](data-factory-onprem-mysql-connector.md#dataset-properties) article.

### Relational Source in Copy Activity
If you are copying data from a MySQL database, set the **source type** of the copy activity to **RelationalSource**, and specify following properties in the **source** section:


| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| query |Use the custom query to read data. |SQL query string. For example: `select * from MyTable`. |No (if **tableName** of **dataset** is specified) |


#### Example
```json
{
    "name": "CopyMySqlToBlob",
    "properties": {
        "description": "pipeline for copy activity",
        "activities": [{
            "type": "Copy",
            "typeProperties": {
                "source": {
                    "type": "RelationalSource",
                    "query": "$$Text.Format('select * from MyTable where timestamp >= \\'{0:yyyy-MM-ddTHH:mm:ss}\\' AND timestamp < \\'{1:yyyy-MM-ddTHH:mm:ss}\\'', WindowStart, WindowEnd)"
                },
                "sink": {
                    "type": "BlobSink",
                    "writeBatchSize": 0,
                    "writeBatchTimeout": "00:00:00"
                }
            },
            "inputs": [{
                "name": "MySqlDataSet"
            }],
            "outputs": [{
                "name": "AzureBlobMySqlDataSet"
            }],
            "policy": {
                "timeout": "01:00:00",
                "concurrency": 1
            },
            "scheduler": {
                "frequency": "Hour",
                "interval": 1
            },
            "name": "MySqlToBlob"
        }],
        "start": "2016-06-01T18:00:00",
        "end": "2016-06-01T19:00:00"
    }
}
```

For more information, see [MySQL connector](data-factory-onprem-mysql-connector.md#copy-activity-properties) article.

## Oracle

### Linked service
To define an Oracle linked service, set the **type** of the linked service to **OnPremisesOracle**, and specify following properties in the **typeProperties** section:

| Property | Description | Required |
| --- | --- | --- |
| driverType | Specify which driver to use to copy data from/to Oracle Database. Allowed values are **Microsoft** or **ODP** (default). See Supported version and installation section on driver details. | No |
| connectionString | Specify information needed to connect to the Oracle Database instance for the connectionString property. | Yes |
| gatewayName | Name of the gateway that is used to connect to the on-premises Oracle server |Yes |

#### Example
```json
{
    "name": "OnPremisesOracleLinkedService",
    "properties": {
        "type": "OnPremisesOracle",
        "typeProperties": {
            "driverType": "Microsoft",
            "connectionString": "Host=<host>;Port=<port>;Sid=<sid>;User Id=<username>;Password=<password>;",
            "gatewayName": "<gateway name>"
        }
    }
}
```

For more information, see [Oracle connector](data-factory-onprem-oracle-connector.md#linked-service-properties) article.

### Dataset
To define an Oracle dataset, set the **type** of the dataset to **OracleTable**, and specify the following properties in the **typeProperties** section:

| Property | Description | Required |
| --- | --- | --- |
| tableName |Name of the table in the Oracle Database that the linked service refers to. |No (if **oracleReaderQuery** of **OracleSource** is specified) |

#### Example

```json
{
    "name": "OracleInput",
    "properties": {
        "type": "OracleTable",
        "linkedServiceName": "OnPremisesOracleLinkedService",
        "typeProperties": {
            "tableName": "MyTable"
        },
        "external": true,
        "availability": {
            "offset": "01:00:00",
            "interval": "1",
            "anchorDateTime": "2016-02-27T12:00:00",
            "frequency": "Hour"
        },
        "policy": {
            "externalData": {
                "retryInterval": "00:01:00",
                "retryTimeout": "00:10:00",
                "maximumRetry": 3
            }
        }
    }
}
```
For more information, see [Oracle connector](data-factory-onprem-oracle-connector.md#dataset-properties) article.

### Oracle Source in Copy Activity
If you are copying data from an Oracle database, set the **source type** of the copy activity to **OracleSource**, and specify following properties in the **source** section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| oracleReaderQuery |Use the custom query to read data. |SQL query string. For example: `select * from MyTable` <br/><br/>If not specified, the SQL statement that is executed: `select * from MyTable` |No (if **tableName** of **dataset** is specified) |

#### Example

```json
{
    "name": "SamplePipeline",
    "properties": {
        "start": "2016-06-01T18:00:00",
        "end": "2016-06-01T19:00:00",
        "description": "pipeline for copy activity",
        "activities": [{
            "name": "OracletoBlob",
            "description": "copy activity",
            "type": "Copy",
            "inputs": [{
                "name": " OracleInput"
            }],
            "outputs": [{
                "name": "AzureBlobOutput"
            }],
            "typeProperties": {
                "source": {
                    "type": "OracleSource",
                    "oracleReaderQuery": "$$Text.Format('select * from MyTable where timestampcolumn >= \\'{0:yyyy-MM-dd HH:mm}\\' AND timestampcolumn < \\'{1:yyyy-MM-dd HH:mm}\\'', WindowStart, WindowEnd)"
                },
                "sink": {
                    "type": "BlobSink"
                }
            },
            "scheduler": {
            "frequency": "Hour",
                "interval": 1
            },
            "policy": {
                "concurrency": 1,
                "executionPriorityOrder": "OldestFirst",
                "retry": 0,
                "timeout": "01:00:00"
            }
        }]
    }
}
```

For more information, see [Oracle connector](data-factory-onprem-oracle-connector.md#copy-activity-properties) article.

### Oracle Sink in Copy Activity
If you are copying data to am Oracle database, set the **sink type** of the copy activity to **OracleSink**, and specify following properties in the **sink** section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| writeBatchTimeout |Wait time for the batch insert operation to complete before it times out. |timespan<br/><br/> Example: 00:30:00 (30 minutes). |No |
| writeBatchSize |Inserts data into the SQL table when the buffer size reaches writeBatchSize. |Integer (number of rows) |No (default: 100) |
| sqlWriterCleanupScript |Specify a query for Copy Activity to execute such that data of a specific slice is cleaned up. |A query statement. |No |
| sliceIdentifierColumnName |Specify column name for Copy Activity to fill with auto generated slice identifier, which is used to clean up data of a specific slice when rerun. |Column name of a column with data type of binary(32). |No |

#### Example
```json
{
    "name": "SamplePipeline",
    "properties": {
        "start": "2016-06-01T18:00:00",
        "end": "2016-06-05T19:00:00",
        "description": "pipeline with copy activity",
        "activities": [{
            "name": "AzureBlobtoOracle",
            "description": "Copy Activity",
            "type": "Copy",
            "inputs": [{
                "name": "AzureBlobInput"
            }],
            "outputs": [{
                "name": "OracleOutput"
            }],
            "typeProperties": {
                "source": {
                    "type": "BlobSource"
                },
                "sink": {
                    "type": "OracleSink"
                }
            },
            "scheduler": {
                "frequency": "Day",
                "interval": 1
            },
            "policy": {
                "concurrency": 1,
                "executionPriorityOrder": "OldestFirst",
                "retry": 0,
                "timeout": "01:00:00"
            }
        }]
    }
}
```
For more information, see [Oracle connector](data-factory-onprem-oracle-connector.md#copy-activity-properties) article.

## PostgreSQL

### Linked service
To define a PostgreSQL linked service, set the **type** of the linked service to **OnPremisesPostgreSql**, and specify following properties in the **typeProperties** section:

| Property | Description | Required |
| --- | --- | --- |
| server |Name of the PostgreSQL server. |Yes |
| database |Name of the PostgreSQL database. |Yes |
| schema |Name of the schema in the database. The schema name is case-sensitive. |No |
| authenticationType |Type of authentication used to connect to the PostgreSQL database. Possible values are: Anonymous, Basic, and Windows. |Yes |
| username |Specify user name if you are using Basic or Windows authentication. |No |
| password |Specify password for the user account you specified for the username. |No |
| gatewayName |Name of the gateway that the Data Factory service should use to connect to the on-premises PostgreSQL database. |Yes |

#### Example

```json
{
    "name": "OnPremPostgreSqlLinkedService",
    "properties": {
        "type": "OnPremisesPostgreSql",
        "typeProperties": {
            "server": "<server>",
            "database": "<database>",
            "schema": "<schema>",
            "authenticationType": "<authentication type>",
            "username": "<username>",
            "password": "<password>",
            "gatewayName": "<gatewayName>"
        }
    }
}
```
For more information, see [PostgreSQL connector](data-factory-onprem-postgresql-connector.md#linked-service-properties) article.

### Dataset
To define a PostgreSQL dataset, set the **type** of the dataset to **RelationalTable**, and specify the following properties in the **typeProperties** section:

| Property | Description | Required |
| --- | --- | --- |
| tableName |Name of the table in the PostgreSQL Database instance that linked service refers to. The tableName is case-sensitive. |No (if **query** of **RelationalSource** is specified) |

#### Example
```json
{
    "name": "PostgreSqlDataSet",
    "properties": {
        "type": "RelationalTable",
        "linkedServiceName": "OnPremPostgreSqlLinkedService",
        "typeProperties": {},
        "availability": {
            "frequency": "Hour",
            "interval": 1
        },
        "external": true,
        "policy": {
            "externalData": {
                "retryInterval": "00:01:00",
                "retryTimeout": "00:10:00",
                "maximumRetry": 3
            }
        }
    }
}
```
For more information, see [PostgreSQL connector](data-factory-onprem-postgresql-connector.md#dataset-properties) article.

### Relational Source in Copy Activity
If you are copying data from a PostgreSQL database, set the **source type** of the copy activity to **RelationalSource**, and specify following properties in the **source** section:


| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| query |Use the custom query to read data. |SQL query string. For example: "query": "select * from \"MySchema\".\"MyTable\"". |No (if **tableName** of **dataset** is specified) |

#### Example

```json
{
    "name": "CopyPostgreSqlToBlob",
    "properties": {
        "description": "pipeline for copy activity",
        "activities": [{
            "type": "Copy",
            "typeProperties": {
                "source": {
                    "type": "RelationalSource",
                    "query": "select * from \"public\".\"usstates\""
                },
                "sink": {
                    "type": "BlobSink"
                }
            },
            "inputs": [{
                "name": "PostgreSqlDataSet"
            }],
            "outputs": [{
                "name": "AzureBlobPostgreSqlDataSet"
            }],
            "policy": {
                "timeout": "01:00:00",
                "concurrency": 1
            },
            "scheduler": {
                "frequency": "Hour",
                "interval": 1
            },
            "name": "PostgreSqlToBlob"
        }],
        "start": "2016-06-01T18:00:00",
        "end": "2016-06-01T19:00:00"
    }
}
```

For more information, see [PostgreSQL connector](data-factory-onprem-postgresql-connector.md#copy-activity-properties) article.

## SAP Business Warehouse


### Linked service
To define a SAP Business Warehouse (BW) linked service, set the **type** of the linked service to **SapBw**, and specify following properties in the **typeProperties** section:

Property | Description | Allowed values | Required
-------- | ----------- | -------------- | --------
server | Name of the server on which the SAP BW instance resides. | string | Yes
systemNumber | System number of the SAP BW system. | Two-digit decimal number represented as a string. | Yes
clientId | Client ID of the client in the SAP W system. | Three-digit decimal number represented as a string. | Yes
username | Name of the user who has access to the SAP server | string | Yes
password | Password for the user. | string | Yes
gatewayName | Name of the gateway that the Data Factory service should use to connect to the on-premises SAP BW instance. | string | Yes
encryptedCredential | The encrypted credential string. | string | No

#### Example

```json
{
    "name": "SapBwLinkedService",
    "properties": {
        "type": "SapBw",
        "typeProperties": {
            "server": "<server name>",
            "systemNumber": "<system number>",
            "clientId": "<client id>",
            "username": "<SAP user>",
            "password": "<Password for SAP user>",
            "gatewayName": "<gateway name>"
        }
    }
}
```

For more information, see [SAP Business Warehouse connector](data-factory-sap-business-warehouse-connector.md#linked-service-properties) article.

### Dataset
To define a SAP BW dataset, set the **type** of the dataset to **RelationalTable**. There are no type-specific properties supported for the SAP BW dataset of type **RelationalTable**.

#### Example

```json
{
    "name": "SapBwDataset",
    "properties": {
        "type": "RelationalTable",
        "linkedServiceName": "SapBwLinkedService",
        "typeProperties": {},
        "availability": {
            "frequency": "Hour",
            "interval": 1
        },
        "external": true
    }
}
```
For more information, see [SAP Business Warehouse connector](data-factory-sap-business-warehouse-connector.md#dataset-properties) article.

### Relational Source in Copy Activity
If you are copying data from SAP Business Warehouse, set the **source type** of the copy activity to **RelationalSource**, and specify following properties in the **source** section:


| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| query | Specifies the MDX query to read data from the SAP BW instance. | MDX query. | Yes |

#### Example

```json
{
    "name": "CopySapBwToBlob",
    "properties": {
        "description": "pipeline for copy activity",
        "activities": [{
            "type": "Copy",
            "typeProperties": {
                "source": {
                    "type": "RelationalSource",
                    "query": "<MDX query for SAP BW>"
                },
                "sink": {
                    "type": "BlobSink",
                    "writeBatchSize": 0,
                    "writeBatchTimeout": "00:00:00"
                }
            },
            "inputs": [{
                "name": "SapBwDataset"
            }],
            "outputs": [{
                "name": "AzureBlobDataSet"
            }],
            "policy": {
                "timeout": "01:00:00",
                "concurrency": 1
            },
            "scheduler": {
                "frequency": "Hour",
                "interval": 1
            },
            "name": "SapBwToBlob"
        }],
        "start": "2017-03-01T18:00:00",
        "end": "2017-03-01T19:00:00"
    }
}
```

For more information, see [SAP Business Warehouse connector](data-factory-sap-business-warehouse-connector.md#copy-activity-properties) article.

## SAP HANA

### Linked service
To define a SAP HANA linked service, set the **type** of the linked service to **SapHana**, and specify following properties in the **typeProperties** section:

Property | Description | Allowed values | Required
-------- | ----------- | -------------- | --------
server | Name of the server on which the SAP HANA instance resides. If your server is using a customized port, specify `server:port`. | string | Yes
authenticationType | Type of authentication. | string. "Basic" or "Windows" | Yes
username | Name of the user who has access to the SAP server | string | Yes
password | Password for the user. | string | Yes
gatewayName | Name of the gateway that the Data Factory service should use to connect to the on-premises SAP HANA instance. | string | Yes
encryptedCredential | The encrypted credential string. | string | No

#### Example

```json
{
    "name": "SapHanaLinkedService",
    "properties": {
        "type": "SapHana",
        "typeProperties": {
            "server": "<server name>",
            "authenticationType": "<Basic, or Windows>",
            "username": "<SAP user>",
            "password": "<Password for SAP user>",
            "gatewayName": "<gateway name>"
        }
    }
}

```
For more information, see [SAP HANA connector](data-factory-sap-hana-connector.md#linked-service-properties) article.

### Dataset
To define a SAP HANA dataset, set the **type** of the dataset to **RelationalTable**. There are no type-specific properties supported for the SAP HANA dataset of type **RelationalTable**.

#### Example

```json
{
    "name": "SapHanaDataset",
    "properties": {
        "type": "RelationalTable",
        "linkedServiceName": "SapHanaLinkedService",
        "typeProperties": {},
        "availability": {
            "frequency": "Hour",
            "interval": 1
        },
        "external": true
    }
}
```
For more information, see [SAP HANA connector](data-factory-sap-hana-connector.md#dataset-properties) article.

### Relational Source in Copy Activity
If you are copying data from a SAP HANA data store, set the **source type** of the copy activity to **RelationalSource**, and specify following properties in the **source** section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| query | Specifies the SQL query to read data from the SAP HANA instance. | SQL query. | Yes |


#### Example


```json
{
    "name": "CopySapHanaToBlob",
    "properties": {
        "description": "pipeline for copy activity",
        "activities": [{
            "type": "Copy",
            "typeProperties": {
                "source": {
                    "type": "RelationalSource",
                    "query": "<SQL Query for HANA>"
                },
                "sink": {
                    "type": "BlobSink",
                    "writeBatchSize": 0,
                    "writeBatchTimeout": "00:00:00"
                }
            },
            "inputs": [{
                "name": "SapHanaDataset"
            }],
            "outputs": [{
                "name": "AzureBlobDataSet"
            }],
            "policy": {
                "timeout": "01:00:00",
                "concurrency": 1
            },
            "scheduler": {
                "frequency": "Hour",
                "interval": 1
            },
            "name": "SapHanaToBlob"
        }],
        "start": "2017-03-01T18:00:00",
        "end": "2017-03-01T19:00:00"
    }
}
```

For more information, see [SAP HANA connector](data-factory-sap-hana-connector.md#copy-activity-properties) article.


## SQL Server

### Linked service
You create a linked service of type **OnPremisesSqlServer** to link a SQL Server database to a data factory. The following table provides description for JSON elements specific to SQL Server linked service.

The following table provides description for JSON elements specific to SQL Server linked service.

| Property | Description | Required |
| --- | --- | --- |
| type |The type property should be set to: **OnPremisesSqlServer**. |Yes |
| connectionString |Specify connectionString information needed to connect to the SQL Server database using either SQL authentication or Windows authentication. |Yes |
| gatewayName |Name of the gateway that the Data Factory service should use to connect to the SQL Server database. |Yes |
| username |Specify user name if you are using Windows Authentication. Example: **domainname\\username**. |No |
| password |Specify password for the user account you specified for the username. |No |

You can encrypt credentials using the **New-AzDataFactoryEncryptValue** cmdlet and use them in the connection string as shown in the following example (**EncryptedCredential** property):

```json
"connectionString": "Data Source=<servername>;Initial Catalog=<databasename>;Integrated Security=True;EncryptedCredential=<encrypted credential>",
```


#### Example: JSON for using SQL Authentication

```json
{
    "name": "MyOnPremisesSQLDB",
    "properties": {
        "type": "OnPremisesSqlServer",
        "typeProperties": {
            "connectionString": "Data Source=<servername>;Initial Catalog=MarketingCampaigns;Integrated Security=False;User ID=<username>;Password=<password>;",
            "gatewayName": "<gateway name>"
        }
    }
}
```
#### Example: JSON for using Windows Authentication

If username and password are specified, gateway uses them to impersonate the specified user account to connect to the SQL Server database. Otherwise, gateway connects to the SQL Server directly with the security context of Gateway (its startup account).

```json
{
    "Name": " MyOnPremisesSQLDB",
    "Properties": {
        "type": "OnPremisesSqlServer",
        "typeProperties": {
            "ConnectionString": "Data Source=<servername>;Initial Catalog=MarketingCampaigns;Integrated Security=True;",
            "username": "<domain\\username>",
            "password": "<password>",
            "gatewayName": "<gateway name>"
        }
    }
}
```

For more information, see [SQL Server connector](data-factory-sqlserver-connector.md#linked-service-properties) article.

### Dataset
To define a SQL Server dataset, set the **type** of the dataset to **SqlServerTable**, and specify the following properties in the **typeProperties** section:

| Property | Description | Required |
| --- | --- | --- |
| tableName |Name of the table or view in the SQL Server Database instance that linked service refers to. |Yes |

#### Example
```json
{
    "name": "SqlServerInput",
    "properties": {
        "type": "SqlServerTable",
        "linkedServiceName": "SqlServerLinkedService",
        "typeProperties": {
            "tableName": "MyTable"
        },
        "external": true,
        "availability": {
            "frequency": "Hour",
            "interval": 1
        },
        "policy": {
            "externalData": {
                "retryInterval": "00:01:00",
                "retryTimeout": "00:10:00",
                "maximumRetry": 3
            }
        }
    }
}
```

For more information, see [SQL Server connector](data-factory-sqlserver-connector.md#dataset-properties) article.

### Sql Source in Copy Activity
If you are copying data from a SQL Server database, set the **source type** of the copy activity to **SqlSource**, and specify following properties in the **source** section:


| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| sqlReaderQuery |Use the custom query to read data. |SQL query string. For example: `select * from MyTable`. May reference multiple tables from the database referenced by the input dataset. If not specified, the SQL statement that is executed: select from MyTable. |No |
| sqlReaderStoredProcedureName |Name of the stored procedure that reads data from the source table. |Name of the stored procedure. |No |
| storedProcedureParameters |Parameters for the stored procedure. |Name/value pairs. Names and casing of parameters must match the names and casing of the stored procedure parameters. |No |

If the **sqlReaderQuery** is specified for the SqlSource, the Copy Activity runs this query against the SQL Server Database source to get the data.

Alternatively, you can specify a stored procedure by specifying the **sqlReaderStoredProcedureName** and **storedProcedureParameters** (if the stored procedure takes parameters).

If you do not specify either sqlReaderQuery or sqlReaderStoredProcedureName, the columns defined in the structure section are used to build a select query to run against the SQL Server Database. If the dataset definition does not have the structure, all columns are selected from the table.

> [!NOTE]
> When you use **sqlReaderStoredProcedureName**, you still need to specify a value for the **tableName** property in the dataset JSON. There are no validations performed against this table though.


#### Example
```json
{
    "name": "SamplePipeline",
    "properties": {
        "start": "2016-06-01T18:00:00",
        "end": "2016-06-01T19:00:00",
        "description": "pipeline for copy activity",
        "activities": [{
            "name": "SqlServertoBlob",
            "description": "copy activity",
            "type": "Copy",
            "inputs": [{
                "name": " SqlServerInput"
            }],
            "outputs": [{
                "name": "AzureBlobOutput"
            }],
            "typeProperties": {
                "source": {
                    "type": "SqlSource",
                    "SqlReaderQuery": "$$Text.Format('select * from MyTable where timestampcolumn >= \\'{0:yyyy-MM-dd HH:mm}\\' AND timestampcolumn < \\'{1:yyyy-MM-dd HH:mm}\\'', WindowStart, WindowEnd)"
                },
                "sink": {
                    "type": "BlobSink"
                }
			},
            "scheduler": {
                "frequency": "Hour",
                "interval": 1
            },
            "policy": {
                "concurrency": 1,
                "executionPriorityOrder": "OldestFirst",
                "retry": 0,
                "timeout": "01:00:00"
            }
        }]
    }
}
```

In this example, **sqlReaderQuery** is specified for the SqlSource. The Copy Activity runs this query against the SQL Server Database source to get the data. Alternatively, you can specify a stored procedure by specifying the **sqlReaderStoredProcedureName** and **storedProcedureParameters** (if the stored procedure takes parameters). The sqlReaderQuery can reference multiple tables within the database referenced by the input dataset. It is not limited to only the table set as the dataset's tableName typeProperty.

If you do not specify sqlReaderQuery or sqlReaderStoredProcedureName, the columns defined in the structure section are used to build a select query to run against the SQL Server Database. If the dataset definition does not have the structure, all columns are selected from the table.

For more information, see [SQL Server connector](data-factory-sqlserver-connector.md#copy-activity-properties) article.

### Sql Sink in Copy Activity
If you are copying data to a SQL Server database, set the **sink type** of the copy activity to **SqlSink**, and specify following properties in the **sink** section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| writeBatchTimeout |Wait time for the batch insert operation to complete before it times out. |timespan<br/><br/> Example: “00:30:00” (30 minutes). |No |
| writeBatchSize |Inserts data into the SQL table when the buffer size reaches writeBatchSize. |Integer (number of rows) |No (default: 10000) |
| sqlWriterCleanupScript |Specify query for Copy Activity to execute such that data of a specific slice is cleaned up. For more information, see repeatability section. |A query statement. |No |
| sliceIdentifierColumnName |Specify column name for Copy Activity to fill with auto generated slice identifier, which is used to clean up data of a specific slice when rerun. For more information, see repeatability section. |Column name of a column with data type of binary(32). |No |
| sqlWriterStoredProcedureName |Name of the stored procedure that upserts (updates/inserts) data into the target table. |Name of the stored procedure. |No |
| storedProcedureParameters |Parameters for the stored procedure. |Name/value pairs. Names and casing of parameters must match the names and casing of the stored procedure parameters. |No |
| sqlWriterTableType |Specify table type name to be used in the stored procedure. Copy activity makes the data being moved available in a temp table with this table type. Stored procedure code can then merge the data being copied with existing data. |A table type name. |No |

#### Example
The pipeline contains a Copy Activity that is configured to use these input and output datasets and is scheduled to run every hour. In the pipeline JSON definition, the **source** type is set to **BlobSource** and **sink** type is set to **SqlSink**.

```json
{
    "name": "SamplePipeline",
    "properties": {
        "start": "2016-06-01T18:00:00",
        "end": "2016-06-01T19:00:00",
        "description": "pipeline with copy activity",
        "activities": [{
            "name": "AzureBlobtoSQL",
            "description": "Copy Activity",
            "type": "Copy",
            "inputs": [{
                "name": "AzureBlobInput"
            }],
            "outputs": [{
                "name": " SqlServerOutput "
            }],
            "typeProperties": {
                "source": {
                    "type": "BlobSource",
                    "blobColumnSeparators": ","
                },
                "sink": {
                    "type": "SqlSink"
                }
            },
            "scheduler": {
                "frequency": "Hour",
                "interval": 1
            },
            "policy": {
                "concurrency": 1,
                "executionPriorityOrder": "OldestFirst",
                "retry": 0,
                "timeout": "01:00:00"
            }
        }]
    }
}
```

For more information, see [SQL Server connector](data-factory-sqlserver-connector.md#copy-activity-properties) article.

## Sybase

### Linked service
To define a Sybase linked service, set the **type** of the linked service to **OnPremisesSybase**, and specify following properties in the **typeProperties** section:

| Property | Description | Required |
| --- | --- | --- |
| server |Name of the Sybase server. |Yes |
| database |Name of the Sybase database. |Yes |
| schema |Name of the schema in the database. |No |
| authenticationType |Type of authentication used to connect to the Sybase database. Possible values are: Anonymous, Basic, and Windows. |Yes |
| username |Specify user name if you are using Basic or Windows authentication. |No |
| password |Specify password for the user account you specified for the username. |No |
| gatewayName |Name of the gateway that the Data Factory service should use to connect to the on-premises Sybase database. |Yes |

#### Example
```json
{
    "name": "OnPremSybaseLinkedService",
    "properties": {
        "type": "OnPremisesSybase",
        "typeProperties": {
            "server": "<server>",
            "database": "<database>",
            "schema": "<schema>",
            "authenticationType": "<authentication type>",
            "username": "<username>",
            "password": "<password>",
            "gatewayName": "<gatewayName>"
        }
    }
}
```

For more information, see [Sybase connector](data-factory-onprem-sybase-connector.md#linked-service-properties) article.

### Dataset
To define a Sybase dataset, set the **type** of the dataset to **RelationalTable**, and specify the following properties in the **typeProperties** section:

| Property | Description | Required |
| --- | --- | --- |
| tableName |Name of the table in the Sybase Database instance that linked service refers to. |No (if **query** of **RelationalSource** is specified) |

#### Example

```json
{
    "name": "SybaseDataSet",
    "properties": {
        "type": "RelationalTable",
        "linkedServiceName": "OnPremSybaseLinkedService",
        "typeProperties": {},
        "availability": {
            "frequency": "Hour",
            "interval": 1
        },
        "external": true,
        "policy": {
            "externalData": {
                "retryInterval": "00:01:00",
                "retryTimeout": "00:10:00",
                "maximumRetry": 3
            }
        }
    }
}
```

For more information, see [Sybase connector](data-factory-onprem-sybase-connector.md#dataset-properties) article.

### Relational Source in Copy Activity
If you are copying data from a Sybase database, set the **source type** of the copy activity to **RelationalSource**, and specify following properties in the **source** section:


| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| query |Use the custom query to read data. |SQL query string. For example: `select * from MyTable`. |No (if **tableName** of **dataset** is specified) |

#### Example

```json
{
    "name": "CopySybaseToBlob",
    "properties": {
        "description": "pipeline for copy activity",
        "activities": [{
            "type": "Copy",
            "typeProperties": {
                "source": {
                    "type": "RelationalSource",
                    "query": "select * from DBA.Orders"
                },
                "sink": {
                    "type": "BlobSink"
                }
            },
            "inputs": [{
                "name": "SybaseDataSet"
            }],
            "outputs": [{
                "name": "AzureBlobSybaseDataSet"
            }],
            "policy": {
                "timeout": "01:00:00",
                "concurrency": 1
            },
            "scheduler": {
                "frequency": "Hour",
                "interval": 1
            },
            "name": "SybaseToBlob"
        }],
        "start": "2016-06-01T18:00:00",
        "end": "2016-06-01T19:00:00"
    }
}
```

For more information, see [Sybase connector](data-factory-onprem-sybase-connector.md#copy-activity-properties) article.

## Teradata

### Linked service
To define a Teradata linked service, set the **type** of the linked service to **OnPremisesTeradata**, and specify following properties in the **typeProperties** section:

| Property | Description | Required |
| --- | --- | --- |
| server |Name of the Teradata server. |Yes |
| authenticationType |Type of authentication used to connect to the Teradata database. Possible values are: Anonymous, Basic, and Windows. |Yes |
| username |Specify user name if you are using Basic or Windows authentication. |No |
| password |Specify password for the user account you specified for the username. |No |
| gatewayName |Name of the gateway that the Data Factory service should use to connect to the on-premises Teradata database. |Yes |

#### Example
```json
{
    "name": "OnPremTeradataLinkedService",
    "properties": {
        "type": "OnPremisesTeradata",
        "typeProperties": {
            "server": "<server>",
            "authenticationType": "<authentication type>",
            "username": "<username>",
            "password": "<password>",
            "gatewayName": "<gatewayName>"
        }
    }
}
```

For more information, see [Teradata connector](data-factory-onprem-teradata-connector.md#linked-service-properties) article.

### Dataset
To define a Teradata Blob dataset, set the **type** of the dataset to **RelationalTable**. Currently, there are no type properties supported for the Teradata dataset.

#### Example
```json
{
    "name": "TeradataDataSet",
    "properties": {
        "type": "RelationalTable",
        "linkedServiceName": "OnPremTeradataLinkedService",
        "typeProperties": {},
        "availability": {
            "frequency": "Hour",
            "interval": 1
        },
        "external": true,
        "policy": {
            "externalData": {
                "retryInterval": "00:01:00",
                "retryTimeout": "00:10:00",
                "maximumRetry": 3
            }
        }
    }
}
```

For more information, see [Teradata connector](data-factory-onprem-teradata-connector.md#dataset-properties) article.

### Relational Source in Copy Activity
If you are copying data from a Teradata database, set the **source type** of the copy activity to **RelationalSource**, and specify following properties in the **source** section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| query |Use the custom query to read data. |SQL query string. For example: `select * from MyTable`. |Yes |

#### Example

```json
{
    "name": "CopyTeradataToBlob",
    "properties": {
        "description": "pipeline for copy activity",
        "activities": [{
            "type": "Copy",
            "typeProperties": {
                "source": {
                    "type": "RelationalSource",
                    "query": "$$Text.Format('select * from MyTable where timestamp >= \\'{0:yyyy-MM-ddTHH:mm:ss}\\' AND timestamp < \\'{1:yyyy-MM-ddTHH:mm:ss}\\'', SliceStart, SliceEnd)"
                },
                "sink": {
                    "type": "BlobSink",
                    "writeBatchSize": 0,
                    "writeBatchTimeout": "00:00:00"
                }
            },
            "inputs": [{
                "name": "TeradataDataSet"
            }],
            "outputs": [{
                "name": "AzureBlobTeradataDataSet"
            }],
            "policy": {
                "timeout": "01:00:00",
                "concurrency": 1
            },
            "scheduler": {
                "frequency": "Hour",
                "interval": 1
            },
            "name": "TeradataToBlob"
        }],
        "start": "2016-06-01T18:00:00",
        "end": "2016-06-01T19:00:00",
        "isPaused": false
    }
}
```

For more information, see [Teradata connector](data-factory-onprem-teradata-connector.md#copy-activity-properties) article.

## Cassandra


### Linked service
To define a Cassandra linked service, set the **type** of the linked service to **OnPremisesCassandra**, and specify following properties in the **typeProperties** section:

| Property | Description | Required |
| --- | --- | --- |
| host |One or more IP addresses or host names of Cassandra servers.<br/><br/>Specify a comma-separated list of IP addresses or host names to connect to all servers concurrently. |Yes |
| port |The TCP port that the Cassandra server uses to listen for client connections. |No, default value: 9042 |
| authenticationType |Basic, or Anonymous |Yes |
| username |Specify user name for the user account. |Yes, if authenticationType is set to Basic. |
| password |Specify password for the user account. |Yes, if authenticationType is set to Basic. |
| gatewayName |The name of the gateway that is used to connect to the on-premises Cassandra database. |Yes |
| encryptedCredential |Credential encrypted by the gateway. |No |

#### Example

```json
{
    "name": "CassandraLinkedService",
    "properties": {
        "type": "OnPremisesCassandra",
        "typeProperties": {
            "authenticationType": "Basic",
            "host": "<cassandra server name or IP address>",
            "port": 9042,
            "username": "user",
            "password": "password",
            "gatewayName": "<onpremgateway>"
        }
    }
}
```

For more information, see [Cassandra connector](data-factory-onprem-cassandra-connector.md#linked-service-properties) article.

### Dataset
To define a Cassandra dataset, set the **type** of the dataset to **CassandraTable**, and specify the following properties in the **typeProperties** section:

| Property | Description | Required |
| --- | --- | --- |
| keyspace |Name of the keyspace or schema in Cassandra database. |Yes (If **query** for **CassandraSource** is not defined). |
| tableName |Name of the table in Cassandra database. |Yes (If **query** for **CassandraSource** is not defined). |

#### Example

```json
{
    "name": "CassandraInput",
    "properties": {
        "linkedServiceName": "CassandraLinkedService",
        "type": "CassandraTable",
        "typeProperties": {
            "tableName": "mytable",
            "keySpace": "<key space>"
        },
        "availability": {
            "frequency": "Hour",
            "interval": 1
        },
        "external": true,
        "policy": {
            "externalData": {
                "retryInterval": "00:01:00",
                "retryTimeout": "00:10:00",
                "maximumRetry": 3
            }
        }
    }
}
```

For more information, see [Cassandra connector](data-factory-onprem-cassandra-connector.md#dataset-properties) article.

### Cassandra Source in Copy Activity
If you are copying data from Cassandra, set the **source type** of the copy activity to **CassandraSource**, and specify following properties in the **source** section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| query |Use the custom query to read data. |SQL-92 query or CQL query. See [CQL reference](https://docs.datastax.com/en/cql/3.1/cql/cql_reference/cqlReferenceTOC.html). <br/><br/>When using SQL query, specify **keyspace name.table name** to represent the table you want to query. |No (if tableName and keyspace on dataset are defined). |
| consistencyLevel |The consistency level specifies how many replicas must respond to a read request before returning data to the client application. Cassandra checks the specified number of replicas for data to satisfy the read request. |ONE, TWO, THREE, QUORUM, ALL, LOCAL_QUORUM, EACH_QUORUM, LOCAL_ONE. See [Configuring data consistency](https://docs.datastax.com/en/cassandra/2.1/cassandra/dml/dml_config_consistency_c.html) for details. |No. Default value is ONE. |

#### Example

```json
{
    "name": "SamplePipeline",
    "properties": {
        "start": "2016-06-01T18:00:00",
        "end": "2016-06-01T19:00:00",
        "description": "pipeline with copy activity",
        "activities": [{
            "name": "CassandraToAzureBlob",
            "description": "Copy from Cassandra to an Azure blob",
            "type": "Copy",
            "inputs": [{
                "name": "CassandraInput"
            }],
            "outputs": [{
                "name": "AzureBlobOutput"
            }],
            "typeProperties": {
                "source": {
                    "type": "CassandraSource",
                    "query": "select id, firstname, lastname from mykeyspace.mytable"
                },
                "sink": {
                    "type": "BlobSink"
                }
            },
            "scheduler": {
                "frequency": "Hour",
                "interval": 1
            },
            "policy": {
                "concurrency": 1,
                "executionPriorityOrder": "OldestFirst",
                "retry": 0,
                "timeout": "01:00:00"
            }
        }]
    }
}
```

For more information, see [Cassandra connector](data-factory-onprem-cassandra-connector.md#copy-activity-properties) article.

## MongoDB

### Linked service
To define a MongoDB linked service, set the **type** of the linked service to **OnPremisesMongoDB**, and specify following properties in the **typeProperties** section:

| Property | Description | Required |
| --- | --- | --- |
| server |IP address or host name of the MongoDB server. |Yes |
| port |TCP port that the MongoDB server uses to listen for client connections. |Optional, default value: 27017 |
| authenticationType |Basic, or Anonymous. |Yes |
| username |User account to access MongoDB. |Yes (if basic authentication is used). |
| password |Password for the user. |Yes (if basic authentication is used). |
| authSource |Name of the MongoDB database that you want to use to check your credentials for authentication. |Optional (if basic authentication is used). default: uses the admin account and the database specified using databaseName property. |
| databaseName |Name of the MongoDB database that you want to access. |Yes |
| gatewayName |Name of the gateway that accesses the data store. |Yes |
| encryptedCredential |Credential encrypted by gateway. |Optional |

#### Example

```json
{
    "name": "OnPremisesMongoDbLinkedService",
    "properties": {
        "type": "OnPremisesMongoDb",
        "typeProperties": {
            "authenticationType": "<Basic or Anonymous>",
            "server": "< The IP address or host name of the MongoDB server >",
            "port": "<The number of the TCP port that the MongoDB server uses to listen for client connections.>",
            "username": "<username>",
            "password": "<password>",
            "authSource": "< The database that you want to use to check your credentials for authentication. >",
            "databaseName": "<database name>",
            "gatewayName": "<onpremgateway>"
        }
    }
}
```

For more information, see [MongoDB connector article](data-factory-on-premises-mongodb-connector.md#linked-service-properties)

### Dataset
To define a MongoDB dataset, set the **type** of the dataset to **MongoDbCollection**, and specify the following properties in the **typeProperties** section:

| Property | Description | Required |
| --- | --- | --- |
| collectionName |Name of the collection in MongoDB database. |Yes |

#### Example

```json
{
    "name": "MongoDbInputDataset",
    "properties": {
        "type": "MongoDbCollection",
        "linkedServiceName": "OnPremisesMongoDbLinkedService",
        "typeProperties": {
            "collectionName": "<Collection name>"
        },
        "availability": {
            "frequency": "Hour",
            "interval": 1
        },
        "external": true
    }
}
```

For more information, see [MongoDB connector article](data-factory-on-premises-mongodb-connector.md#dataset-properties)

#### MongoDB Source in Copy Activity
If you are copying data from MongoDB, set the **source type** of the copy activity to **MongoDbSource**, and specify following properties in the **source** section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| query |Use the custom query to read data. |SQL-92 query string. For example: `select * from MyTable`. |No (if **collectionName** of **dataset** is specified) |

#### Example

```json
{
    "name": "CopyMongoDBToBlob",
    "properties": {
        "description": "pipeline for copy activity",
        "activities": [{
            "type": "Copy",
            "typeProperties": {
                "source": {
                    "type": "MongoDbSource",
                    "query": "select * from MyTable"
                },
                "sink": {
                    "type": "BlobSink",
                    "writeBatchSize": 0,
                    "writeBatchTimeout": "00:00:00"
                }
            },
            "inputs": [{
                "name": "MongoDbInputDataset"
            }],
            "outputs": [{
                "name": "AzureBlobOutputDataSet"
            }],
            "policy": {
                "timeout": "01:00:00",
                "concurrency": 1
            },
            "scheduler": {
                "frequency": "Hour",
                "interval": 1
            },
            "name": "MongoDBToAzureBlob"
        }],
        "start": "2016-06-01T18:00:00",
        "end": "2016-06-01T19:00:00"
    }
}
```

For more information, see [MongoDB connector article](data-factory-on-premises-mongodb-connector.md#copy-activity-properties)

## Amazon S3


### Linked service
To define an Amazon S3 linked service, set the **type** of the linked service to **AwsAccessKey**, and specify following properties in the **typeProperties** section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| accessKeyID |ID of the secret access key. |string |Yes |
| secretAccessKey |The secret access key itself. |Encrypted secret string |Yes |

#### Example
```json
{
    "name": "AmazonS3LinkedService",
    "properties": {
        "type": "AwsAccessKey",
        "typeProperties": {
            "accessKeyId": "<access key id>",
            "secretAccessKey": "<secret access key>"
        }
    }
}
```

For more information, see [Amazon S3 connector article](data-factory-amazon-simple-storage-service-connector.md#linked-service-properties).

### Dataset
To define an Amazon S3 dataset, set the **type** of the dataset to **AmazonS3**, and specify the following properties in the **typeProperties** section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| bucketName |The S3 bucket name. |String |Yes |
| key |The S3 object key. |String |No |
| prefix |Prefix for the S3 object key. Objects whose keys start with this prefix are selected. Applies only when key is empty. |String |No |
| version |The version of S3 object if S3 versioning is enabled. |String |No |
| format | The following format types are supported: **TextFormat**, **JsonFormat**, **AvroFormat**, **OrcFormat**, **ParquetFormat**. Set the **type** property under format to one of these values. For more information, see [Text Format](data-factory-supported-file-and-compression-formats.md#text-format), [Json Format](data-factory-supported-file-and-compression-formats.md#json-format), [Avro Format](data-factory-supported-file-and-compression-formats.md#avro-format), [Orc Format](data-factory-supported-file-and-compression-formats.md#orc-format), and [Parquet Format](data-factory-supported-file-and-compression-formats.md#parquet-format) sections. <br><br> If you want to **copy files as-is** between file-based stores (binary copy), skip the format section in both input and output dataset definitions. |No | |
| compression | Specify the type and level of compression for the data. Supported types are: **GZip**, **Deflate**, **BZip2**, and **ZipDeflate**. The supported levels are: **Optimal** and **Fastest**. For more information, see [File and compression formats in Azure Data Factory](data-factory-supported-file-and-compression-formats.md#compression-support). |No | |


> [!NOTE]
> bucketName + key specifies the location of the S3 object where bucket is the root container for S3 objects and key is the full path to S3 object.

#### Example: Sample dataset with prefix

```json
{
    "name": "dataset-s3",
    "properties": {
        "type": "AmazonS3",
        "linkedServiceName": "link- testS3",
        "typeProperties": {
            "prefix": "testFolder/test",
            "bucketName": "<S3 bucket name>",
            "format": {
                "type": "OrcFormat"
            }
        },
        "availability": {
            "frequency": "Hour",
            "interval": 1
        },
        "external": true
    }
}
```
#### Example: Sample data set (with version)

```json
{
    "name": "dataset-s3",
    "properties": {
        "type": "AmazonS3",
        "linkedServiceName": "link- testS3",
        "typeProperties": {
            "key": "testFolder/test.orc",
            "bucketName": "<S3 bucket name>",
            "version": "XXXXXXXXXczm0CJajYkHf0_k6LhBmkcL",
            "format": {
                "type": "OrcFormat"
            }
        },
        "availability": {
            "frequency": "Hour",
            "interval": 1
        },
        "external": true
    }
}
```

#### Example: Dynamic paths for S3
In the sample, we use fixed values for key and bucketName properties in the Amazon S3 dataset.

```json
"key": "testFolder/test.orc",
"bucketName": "<S3 bucket name>",
```

You can have Data Factory calculate the key and bucketName dynamically at runtime by using system variables such as SliceStart.

```json
"key": "$$Text.Format('{0:MM}/{0:dd}/test.orc', SliceStart)"
"bucketName": "$$Text.Format('{0:yyyy}', SliceStart)"
```

You can do the same for the prefix property of an Amazon S3 dataset. See [Data Factory functions and system variables](data-factory-functions-variables.md) for a list of supported functions and variables.

For more information, see [Amazon S3 connector article](data-factory-amazon-simple-storage-service-connector.md#dataset-properties).

### File System Source in Copy Activity
If you are copying data from Amazon S3, set the **source type** of the copy activity to **FileSystemSource**, and specify following properties in the **source** section:


| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| recursive |Specifies whether to recursively list S3 objects under the directory. |true/false |No |


#### Example


```json
{
    "name": "CopyAmazonS3ToBlob",
    "properties": {
        "description": "pipeline for copy activity",
        "activities": [{
            "type": "Copy",
            "typeProperties": {
                "source": {
                    "type": "FileSystemSource",
                    "recursive": true
                },
                "sink": {
                    "type": "BlobSink",
                    "writeBatchSize": 0,
                    "writeBatchTimeout": "00:00:00"
                }
            },
            "inputs": [{
                "name": "AmazonS3InputDataset"
            }],
            "outputs": [{
                "name": "AzureBlobOutputDataSet"
            }],
            "policy": {
                "timeout": "01:00:00",
                "concurrency": 1
            },
            "scheduler": {
                "frequency": "Hour",
                "interval": 1
            },
            "name": "AmazonS3ToBlob"
        }],
        "start": "2016-08-08T18:00:00",
        "end": "2016-08-08T19:00:00"
    }
}
```

For more information, see [Amazon S3 connector article](data-factory-amazon-simple-storage-service-connector.md#copy-activity-properties).

## File System


### Linked service
You can link an on-premises file system to an Azure data factory with the **On-premises File Server** linked service. The following table provides descriptions for JSON elements that are specific to the On-premises File Server linked service.

| Property | Description | Required |
| --- | --- | --- |
| type |Ensure that the type property is set to **OnPremisesFileServer**. |Yes |
| host |Specifies the root path of the folder that you want to copy. Use the escape character ‘ \ ’ for special characters in the string. See Sample linked service and dataset definitions for examples. |Yes |
| userid |Specify the ID of the user who has access to the server. |No (if you choose encryptedCredential) |
| password |Specify the password for the user (userid). |No (if you choose encryptedCredential |
| encryptedCredential |Specify the encrypted credentials that you can get by running the New-AzDataFactoryEncryptValue cmdlet. |No (if you choose to specify userid and password in plain text) |
| gatewayName |Specifies the name of the gateway that Data Factory should use to connect to the on-premises file server. |Yes |

#### Sample folder path definitions

| Scenario | Host in linked service definition | folderPath in dataset definition |
| --- | --- | --- |
| Local folder on Data Management Gateway machine: <br/><br/>Examples: D:\\\* or D:\folder\subfolder\\* |D:\\\\ (for Data Management Gateway 2.0 and later versions) <br/><br/> localhost (for earlier versions than Data Management Gateway 2.0) |.\\\\ or folder\\\\subfolder (for Data Management Gateway 2.0 and later versions) <br/><br/>D:\\\\ or D:\\\\folder\\\\subfolder (for gateway version below 2.0) |
| Remote shared folder: <br/><br/>Examples: \\\\myserver\\share\\\* or \\\\myserver\\share\\folder\\subfolder\\* |\\\\\\\\myserver\\\\share |.\\\\ or folder\\\\subfolder |


#### Example: Using username and password in plain text

```json
{
    "Name": "OnPremisesFileServerLinkedService",
    "properties": {
        "type": "OnPremisesFileServer",
        "typeProperties": {
            "host": "\\\\Contosogame-Asia",
            "userid": "Admin",
            "password": "123456",
            "gatewayName": "<onpremgateway>"
        }
    }
}
```

#### Example: Using encryptedcredential

```json
{
    "Name": " OnPremisesFileServerLinkedService ",
    "properties": {
        "type": "OnPremisesFileServer",
        "typeProperties": {
            "host": "D:\\",
            "encryptedCredential": "WFuIGlzIGRpc3Rpbmd1aXNoZWQsIG5vdCBvbmx5IGJ5xxxxxxxxxxxxxxxxx",
            "gatewayName": "<onpremgateway>"
        }
    }
}
```

For more information, see [File System connector article](data-factory-onprem-file-system-connector.md#linked-service-properties).

### Dataset
To define a File System dataset, set the **type** of the dataset to **FileShare**, and specify the following properties in the **typeProperties** section:

| Property | Description | Required |
| --- | --- | --- |
| folderPath |Specifies the subpath to the folder. Use the escape character ‘\’ for special characters in the string. See Sample linked service and dataset definitions for examples.<br/><br/>You can combine this property with **partitionBy** to have folder paths based on slice start/end date-times. |Yes |
| fileName |Specify the name of the file in the **folderPath** if you want the table to refer to a specific file in the folder. If you do not specify any value for this property, the table points to all files in the folder.<br/><br/>When fileName is not specified for an output dataset, the name of the generated file is in the following format: <br/><br/>`Data.<Guid>.txt` (Example: Data.0a405f8a-93ff-4c6f-b3be-f69616f1df7a.txt) |No |
| fileFilter |Specify a filter to be used to select a subset of files in the folderPath rather than all files. <br/><br/>Allowed values are: `*` (multiple characters) and `?` (single character).<br/><br/>Example 1: "fileFilter": "*.log"<br/>Example 2: "fileFilter": 2016-1-?.txt"<br/><br/>Note that fileFilter is applicable for an input FileShare dataset. |No |
| partitionedBy |You can use partitionedBy to specify a dynamic folderPath/fileName for time-series data. An example is folderPath parameterized for every hour of data. |No |
| format | The following format types are supported: **TextFormat**, **JsonFormat**, **AvroFormat**, **OrcFormat**, **ParquetFormat**. Set the **type** property under format to one of these values. For more information, see [Text Format](data-factory-supported-file-and-compression-formats.md#text-format), [Json Format](data-factory-supported-file-and-compression-formats.md#json-format), [Avro Format](data-factory-supported-file-and-compression-formats.md#avro-format), [Orc Format](data-factory-supported-file-and-compression-formats.md#orc-format), and [Parquet Format](data-factory-supported-file-and-compression-formats.md#parquet-format) sections. <br><br> If you want to **copy files as-is** between file-based stores (binary copy), skip the format section in both input and output dataset definitions. |No |
| compression | Specify the type and level of compression for the data. Supported types are: **GZip**, **Deflate**, **BZip2**, and **ZipDeflate**; and supported levels are: **Optimal** and **Fastest**. see [File and compression formats in Azure Data Factory](data-factory-supported-file-and-compression-formats.md#compression-support). |No |

> [!NOTE]
> You cannot use fileName and fileFilter simultaneously.

#### Example

```json
{
    "name": "OnpremisesFileSystemInput",
    "properties": {
        "type": " FileShare",
        "linkedServiceName": " OnPremisesFileServerLinkedService ",
        "typeProperties": {
            "folderPath": "mysharedfolder/yearno={Year}/monthno={Month}/dayno={Day}",
            "fileName": "{Hour}.csv",
            "partitionedBy": [{
                "name": "Year",
                "value": {
                    "type": "DateTime",
                    "date": "SliceStart",
                        "format": "yyyy"
                }
            }, {
                "name": "Month",
                "value": {
                    "type": "DateTime",
                    "date": "SliceStart",
                    "format": "MM"
                }
            }, {
                "name": "Day",
                "value": {
                    "type": "DateTime",
                    "date": "SliceStart",
                    "format": "dd"
                }
            }, {
                "name": "Hour",
                "value": {
                    "type": "DateTime",
                    "date": "SliceStart",
                    "format": "HH"
                }
            }]
        },
        "external": true,
        "availability": {
            "frequency": "Hour",
            "interval": 1
        },
        "policy": {
            "externalData": {
                "retryInterval": "00:01:00",
                "retryTimeout": "00:10:00",
                "maximumRetry": 3
            }
        }
    }
}
```

For more information, see [File System connector article](data-factory-onprem-file-system-connector.md#dataset-properties).

### File System Source in Copy Activity
If you are copying data from File System, set the **source type** of the copy activity to **FileSystemSource**, and specify following properties in the **source** section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| recursive |Indicates whether the data is read recursively from the subfolders or only from the specified folder. |True, False (default) |No |

#### Example

```json
{
    "name": "SamplePipeline",
    "properties": {
        "start": "2015-06-01T18:00:00",
        "end": "2015-06-01T19:00:00",
        "description": "Pipeline for copy activity",
        "activities": [{
            "name": "OnpremisesFileSystemtoBlob",
            "description": "copy activity",
            "type": "Copy",
            "inputs": [{
                "name": "OnpremisesFileSystemInput"
            }],
            "outputs": [{
                "name": "AzureBlobOutput"
            }],
            "typeProperties": {
                "source": {
                    "type": "FileSystemSource"
                },
                "sink": {
                    "type": "BlobSink"
                }
            },
            "scheduler": {
            "frequency": "Hour",
                "interval": 1
            },
            "policy": {
                "concurrency": 1,
                "executionPriorityOrder": "OldestFirst",
                "retry": 0,
                "timeout": "01:00:00"
            }
        }]
    }
}
```
For more information, see [File System connector article](data-factory-onprem-file-system-connector.md#copy-activity-properties).

### File System Sink in Copy Activity
If you are copying data to File System, set the **sink type** of the copy activity to **FileSystemSink**, and specify following properties in the **sink** section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| copyBehavior |Defines the copy behavior when the source is BlobSource or FileSystem. |**PreserveHierarchy:** Preserves the file hierarchy in the target folder. That is, the relative path of the source file to the source folder is the same as the relative path of the target file to the target folder.<br/><br/>**FlattenHierarchy:** All files from the source folder are created in the first level of target folder. The target files are created with an autogenerated name.<br/><br/>**MergeFiles:** Merges all files from the source folder to one file. If the file name/blob name is specified, the merged file name is the specified name. Otherwise, it is an auto-generated file name. |No |

auto-

#### Example

```json
{
    "name": "SamplePipeline",
    "properties": {
        "start": "2015-06-01T18:00:00",
        "end": "2015-06-01T20:00:00",
        "description": "pipeline for copy activity",
        "activities": [{
            "name": "AzureSQLtoOnPremisesFile",
            "description": "copy activity",
            "type": "Copy",
            "inputs": [{
                "name": "AzureSQLInput"
            }],
            "outputs": [{
                "name": "OnpremisesFileSystemOutput"
            }],
            "typeProperties": {
                "source": {
                    "type": "SqlSource",
                    "SqlReaderQuery": "$$Text.Format('select * from MyTable where timestampcolumn >= \\'{0:yyyy-MM-dd}\\' AND timestampcolumn < \\'{1:yyyy-MM-dd}\\'', WindowStart, WindowEnd)"
                },
                "sink": {
                    "type": "FileSystemSink"
                }
            },
            "scheduler": {
                "frequency": "Hour",
                "interval": 1
            },
            "policy": {
                "concurrency": 1,
                "executionPriorityOrder": "OldestFirst",
                "retry": 3,
                "timeout": "01:00:00"
            }
        }]
    }
}
```

For more information, see [File System connector article](data-factory-onprem-file-system-connector.md#copy-activity-properties).

## FTP

### Linked service
To define an FTP linked service, set the **type** of the linked service to **FtpServer**, and specify following properties in the **typeProperties** section:

| Property | Description | Required | Default |
| --- | --- | --- | --- |
| host |Name or IP address of the FTP Server |Yes |&nbsp; |
| authenticationType |Specify authentication type |Yes |Basic, Anonymous |
| username |User who has access to the FTP server |No |&nbsp; |
| password |Password for the user (username) |No |&nbsp; |
| encryptedCredential |Encrypted credential to access the FTP server |No |&nbsp; |
| gatewayName |Name of the Data Management Gateway to connect to an on-premises FTP server |No |&nbsp; |
| port |Port on which the FTP server is listening |No |21 |
| enableSsl |Specify whether to use FTP over SSL/TLS channel |No |true |
| enableServerCertificateValidation |Specify whether to enable server TLS/SSL certificate validation when using FTP over SSL/TLS channel |No |true |

#### Example: Using Anonymous authentication

```json
{
    "name": "FTPLinkedService",
    "properties": {
        "type": "FtpServer",
            "typeProperties": {
            "authenticationType": "Anonymous",
            "host": "myftpserver.com"
        }
    }
}
```

#### Example: Using username and password in plain text for basic authentication

```json
{
    "name": "FTPLinkedService",
    "properties": {
        "type": "FtpServer",
        "typeProperties": {
            "host": "myftpserver.com",
            "authenticationType": "Basic",
            "username": "Admin",
            "password": "123456"
        }
    }
}
```

#### Example: Using port, enableSsl, enableServerCertificateValidation

```json
{
    "name": "FTPLinkedService",
    "properties": {
        "type": "FtpServer",
        "typeProperties": {
            "host": "myftpserver.com",
            "authenticationType": "Basic",
            "username": "Admin",
            "password": "123456",
            "port": "21",
            "enableSsl": true,
            "enableServerCertificateValidation": true
        }
    }
}
```

#### Example: Using encryptedCredential for authentication and gateway

```json
{
    "name": "FTPLinkedService",
    "properties": {
        "type": "FtpServer",
        "typeProperties": {
            "host": "myftpserver.com",
            "authenticationType": "Basic",
            "encryptedCredential": "xxxxxxxxxxxxxxxxx",
            "gatewayName": "<onpremgateway>"
        }
      }
}
```

For more information, see [FTP connector](data-factory-ftp-connector.md#linked-service-properties) article.

### Dataset
To define an FTP dataset, set the **type** of the dataset to **FileShare**, and specify the following properties in the **typeProperties** section:

| Property | Description | Required |
| --- | --- | --- |
| folderPath |Sub path to the folder. Use escape character ‘ \ ’ for special characters in the string. See Sample linked service and dataset definitions for examples.<br/><br/>You can combine this property with **partitionBy** to have folder paths based on slice start/end date-times. |Yes
| fileName |Specify the name of the file in the **folderPath** if you want the table to refer to a specific file in the folder. If you do not specify any value for this property, the table points to all files in the folder.<br/><br/>When fileName is not specified for an output dataset, the name of the generated file would be in the following this format: <br/><br/>`Data.<Guid>.txt` (Example: Data.0a405f8a-93ff-4c6f-b3be-f69616f1df7a.txt) |No |
| fileFilter |Specify a filter to be used to select a subset of files in the folderPath rather than all files.<br/><br/>Allowed values are: `*` (multiple characters) and `?` (single character).<br/><br/>Examples 1: `"fileFilter": "*.log"`<br/>Example 2: `"fileFilter": 2016-1-?.txt"`<br/><br/> fileFilter is applicable for an input FileShare dataset. This property is not supported with HDFS. |No |
| partitionedBy |partitionedBy can be used to specify a dynamic folderPath, filename for time series data. For example, folderPath parameterized for every hour of data. |No |
| format | The following format types are supported: **TextFormat**, **JsonFormat**, **AvroFormat**, **OrcFormat**, **ParquetFormat**. Set the **type** property under format to one of these values. For more information, see [Text Format](data-factory-supported-file-and-compression-formats.md#text-format), [Json Format](data-factory-supported-file-and-compression-formats.md#json-format), [Avro Format](data-factory-supported-file-and-compression-formats.md#avro-format), [Orc Format](data-factory-supported-file-and-compression-formats.md#orc-format), and [Parquet Format](data-factory-supported-file-and-compression-formats.md#parquet-format) sections. <br><br> If you want to **copy files as-is** between file-based stores (binary copy), skip the format section in both input and output dataset definitions. |No |
| compression | Specify the type and level of compression for the data. Supported types are: **GZip**, **Deflate**, **BZip2**, and **ZipDeflate**; and supported levels are: **Optimal** and **Fastest**. For more information, see [File and compression formats in Azure Data Factory](data-factory-supported-file-and-compression-formats.md#compression-support). |No |
| useBinaryTransfer |Specify whether use Binary transfer mode. True for binary mode and false ASCII. Default value: True. This property can only be used when associated linked service type is of type: FtpServer. |No |

> [!NOTE]
> filename and fileFilter cannot be used simultaneously.

#### Example

```json
{
    "name": "FTPFileInput",
    "properties": {
        "type": "FileShare",
        "linkedServiceName": "FTPLinkedService",
        "typeProperties": {
            "folderPath": "<path to shared folder>",
            "fileName": "test.csv",
            "useBinaryTransfer": true
        },
        "external": true,
        "availability": {
            "frequency": "Hour",
            "interval": 1
        }
    }
}
```

For more information, see [FTP connector](data-factory-ftp-connector.md#dataset-properties) article.

### File System Source in Copy Activity
If you are copying data from an FTP server, set the **source type** of the copy activity to **FileSystemSource**, and specify following properties in the **source** section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| recursive |Indicates whether the data is read recursively from the sub folders or only from the specified folder. |True, False (default) |No |

#### Example

```json
{
    "name": "pipeline",
    "properties": {
        "activities": [{
            "name": "FTPToBlobCopy",
            "inputs": [{
                "name": "FtpFileInput"
            }],
            "outputs": [{
                "name": "AzureBlobOutput"
            }],
            "type": "Copy",
            "typeProperties": {
                "source": {
                    "type": "FileSystemSource"
                },
                "sink": {
                    "type": "BlobSink"
                }
            },
            "scheduler": {
                "frequency": "Hour",
                "interval": 1
            },
            "policy": {
                "concurrency": 1,
                "executionPriorityOrder": "NewestFirst",
                "retry": 1,
                "timeout": "00:05:00"
            }
        }],
        "start": "2016-08-24T18:00:00",
        "end": "2016-08-24T19:00:00"
    }
}
```

For more information, see [FTP connector](data-factory-ftp-connector.md#copy-activity-properties) article.


## HDFS

### Linked service
To define a HDFS linked service, set the **type** of the linked service to **Hdfs**, and specify following properties in the **typeProperties** section:

| Property | Description | Required |
| --- | --- | --- |
| type |The type property must be set to: **Hdfs** |Yes |
| Url |URL to the HDFS |Yes |
| authenticationType |Anonymous, or Windows. <br><br> To use **Kerberos authentication** for HDFS connector, refer to this section to set up your on-premises environment accordingly. |Yes |
| userName |Username for Windows authentication. |Yes (for Windows Authentication) |
| password |Password for Windows authentication. |Yes (for Windows Authentication) |
| gatewayName |Name of the gateway that the Data Factory service should use to connect to the HDFS. |Yes |
| encryptedCredential |[New-AzDataFactoryEncryptValue](https://docs.microsoft.com/powershell/module/az.datafactory/new-azdatafactoryencryptvalue) output of the access credential. |No |

#### Example: Using Anonymous authentication

```json
{
    "name": "HDFSLinkedService",
    "properties": {
        "type": "Hdfs",
        "typeProperties": {
            "authenticationType": "Anonymous",
            "userName": "hadoop",
            "url": "http://<machine>:50070/webhdfs/v1/",
            "gatewayName": "<onpremgateway>"
        }
    }
}
```

#### Example: Using Windows authentication

```json
{
    "name": "HDFSLinkedService",
    "properties": {
        "type": "Hdfs",
        "typeProperties": {
            "authenticationType": "Windows",
            "userName": "Administrator",
            "password": "password",
            "url": "http://<machine>:50070/webhdfs/v1/",
            "gatewayName": "<onpremgateway>"
        }
    }
}
```

For more information, see HDFS connector article.

### Dataset
To define a HDFS dataset, set the **type** of the dataset to **FileShare**, and specify the following properties in the **typeProperties** section:

| Property | Description | Required |
| --- | --- | --- |
| folderPath |Path to the folder. Example: `myfolder`<br/><br/>Use escape character ‘ \ ’ for special characters in the string. For example: for folder\subfolder, specify folder\\\\subfolder and for d:\samplefolder, specify d:\\\\samplefolder.<br/><br/>You can combine this property with **partitionBy** to have folder paths based on slice start/end date-times. |Yes |
| fileName |Specify the name of the file in the **folderPath** if you want the table to refer to a specific file in the folder. If you do not specify any value for this property, the table points to all files in the folder.<br/><br/>When fileName is not specified for an output dataset, the name of the generated file would be in the following this format: <br/><br/>`Data.<Guid>.txt` (for example: : Data.0a405f8a-93ff-4c6f-b3be-f69616f1df7a.txt |No |
| partitionedBy |partitionedBy can be used to specify a dynamic folderPath, filename for time series data. Example: folderPath parameterized for every hour of data. |No |
| format | The following format types are supported: **TextFormat**, **JsonFormat**, **AvroFormat**, **OrcFormat**, **ParquetFormat**. Set the **type** property under format to one of these values. For more information, see [Text Format](data-factory-supported-file-and-compression-formats.md#text-format), [Json Format](data-factory-supported-file-and-compression-formats.md#json-format), [Avro Format](data-factory-supported-file-and-compression-formats.md#avro-format), [Orc Format](data-factory-supported-file-and-compression-formats.md#orc-format), and [Parquet Format](data-factory-supported-file-and-compression-formats.md#parquet-format) sections. <br><br> If you want to **copy files as-is** between file-based stores (binary copy), skip the format section in both input and output dataset definitions. |No |
| compression | Specify the type and level of compression for the data. Supported types are: **GZip**, **Deflate**, **BZip2**, and **ZipDeflate**. Supported levels are: **Optimal** and **Fastest**. For more information, see [File and compression formats in Azure Data Factory](data-factory-supported-file-and-compression-formats.md#compression-support). |No |

> [!NOTE]
> filename and fileFilter cannot be used simultaneously.

#### Example

```json
{
    "name": "InputDataset",
    "properties": {
        "type": "FileShare",
        "linkedServiceName": "HDFSLinkedService",
        "typeProperties": {
            "folderPath": "DataTransfer/UnitTest/"
        },
        "external": true,
        "availability": {
            "frequency": "Hour",
            "interval": 1
        }
    }
}
```

For more information, see HDFS connector article.

### File System Source in Copy Activity
If you are copying data from HDFS, set the **source type** of the copy activity to **FileSystemSource**, and specify following properties in the **source** section:

**FileSystemSource** supports the following properties:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| recursive |Indicates whether the data is read recursively from the sub folders or only from the specified folder. |True, False (default) |No |

#### Example

```json
{
    "name": "pipeline",
    "properties": {
        "activities": [{
            "name": "HdfsToBlobCopy",
            "inputs": [{
                "name": "InputDataset"
            }],
            "outputs": [{
                "name": "OutputDataset"
            }],
            "type": "Copy",
            "typeProperties": {
                "source": {
                    "type": "FileSystemSource"
                },
                "sink": {
                    "type": "BlobSink"
                }
            },
            "policy": {
                "concurrency": 1,
                "executionPriorityOrder": "NewestFirst",
                "retry": 1,
                "timeout": "00:05:00"
            }
        }],
        "start": "2016-06-01T18:00:00",
        "end": "2016-06-01T19:00:00"
    }
}
```

For more information, see HDFS connector article.

## SFTP


### Linked service
To define an SFTP linked service, set the **type** of the linked service to **Sftp**, and specify following properties in the **typeProperties** section:

| Property | Description | Required |
| --- | --- | --- |
| host | Name or IP address of the SFTP server. |Yes |
| port |Port on which the SFTP server is listening. The default value is: 21 |No |
| authenticationType |Specify authentication type. Allowed values: **Basic**, **SshPublicKey**. <br><br> Refer to Using basic authentication and [Using SSH public key authentication](#using-ssh-public-key-authentication) sections on more properties and JSON samples respectively. |Yes |
| skipHostKeyValidation | Specify whether to skip host key validation. | No. The default value: false |
| hostKeyFingerprint | Specify the finger print of the host key. | Yes if the `skipHostKeyValidation` is set to false.  |
| gatewayName |Name of the Data Management Gateway to connect to an on-premises SFTP server. | Yes if copying data from an on-premises SFTP server. |
| encryptedCredential | Encrypted credential to access the SFTP server. Auto-generated when you specify basic authentication (username + password) or SshPublicKey authentication (username + private key path or content) in copy wizard or the ClickOnce popup dialog. | No. Apply only when copying data from an on-premises SFTP server. |

#### Example: Using basic authentication

To use basic authentication, set `authenticationType` as `Basic`, and specify the following properties besides the SFTP connector generic ones introduced in the last section:

| Property | Description | Required |
| --- | --- | --- |
| username | User who has access to the SFTP server. |Yes |
| password | Password for the user (username). | Yes |

```json
{
    "name": "SftpLinkedService",
    "properties": {
        "type": "Sftp",
        "typeProperties": {
            "host": "<SFTP server name or IP address>",
            "port": 22,
            "authenticationType": "Basic",
            "username": "xxx",
            "password": "xxx",
            "skipHostKeyValidation": false,
            "hostKeyFingerPrint": "ssh-rsa 2048 xx:00:00:00:xx:00:x0:0x:0x:0x:0x:00:00:x0:x0:00",
            "gatewayName": "<onpremgateway>"
        }
    }
}
```

#### Example: **Basic authentication with encrypted credential**

```json
{
    "name": "SftpLinkedService",
    "properties": {
        "type": "Sftp",
        "typeProperties": {
            "host": "<FTP server name or IP address>",
            "port": 22,
            "authenticationType": "Basic",
            "username": "xxx",
            "encryptedCredential": "xxxxxxxxxxxxxxxxx",
            "skipHostKeyValidation": false,
            "hostKeyFingerPrint": "ssh-rsa 2048 xx:00:00:00:xx:00:x0:0x:0x:0x:0x:00:00:x0:x0:00",
            "gatewayName": "<onpremgateway>"
        }
    }
}
```

#### **Using SSH public key authentication:**

To use basic authentication, set `authenticationType` as `SshPublicKey`, and specify the following properties besides the SFTP connector generic ones introduced in the last section:

| Property | Description | Required |
| --- | --- | --- |
| username |User who has access to the SFTP server |Yes |
| privateKeyPath | Specify absolute path to the private key file that gateway can access. | Specify either the `privateKeyPath` or `privateKeyContent`. <br><br> Apply only when copying data from an on-premises SFTP server. |
| privateKeyContent | A serialized string of the private key content. The Copy Wizard can read the private key file and extract the private key content automatically. If you are using any other tool/SDK, use the privateKeyPath property instead. | Specify either the `privateKeyPath` or `privateKeyContent`. |
| passPhrase | Specify the pass phrase/password to decrypt the private key if the key file is protected by a pass phrase. | Yes if the private key file is protected by a pass phrase. |

```json
{
    "name": "SftpLinkedServiceWithPrivateKeyPath",
    "properties": {
        "type": "Sftp",
        "typeProperties": {
            "host": "<FTP server name or IP address>",
            "port": 22,
            "authenticationType": "SshPublicKey",
            "username": "xxx",
            "privateKeyPath": "D:\\privatekey_openssh",
            "passPhrase": "xxx",
            "skipHostKeyValidation": true,
            "gatewayName": "<onpremgateway>"
        }
    }
}
```

#### Example: **SshPublicKey authentication using private key content**

```json
{
    "name": "SftpLinkedServiceWithPrivateKeyContent",
    "properties": {
        "type": "Sftp",
        "typeProperties": {
            "host": "mysftpserver.westus.cloudapp.azure.com",
            "port": 22,
            "authenticationType": "SshPublicKey",
            "username": "xxx",
            "privateKeyContent": "<base64 string of the private key content>",
            "passPhrase": "xxx",
            "skipHostKeyValidation": true
        }
    }
}
```

For more information, see [SFTP connector](data-factory-sftp-connector.md#linked-service-properties) article.

### Dataset
To define an SFTP dataset, set the **type** of the dataset to **FileShare**, and specify the following properties in the **typeProperties** section:

| Property | Description | Required |
| --- | --- | --- |
| folderPath |Sub path to the folder. Use escape character ‘ \ ’ for special characters in the string. See Sample linked service and dataset definitions for examples.<br/><br/>You can combine this property with **partitionBy** to have folder paths based on slice start/end date-times. |Yes |
| fileName |Specify the name of the file in the **folderPath** if you want the table to refer to a specific file in the folder. If you do not specify any value for this property, the table points to all files in the folder.<br/><br/>When fileName is not specified for an output dataset, the name of the generated file would be in the following this format: <br/><br/>`Data.<Guid>.txt` (Example: Data.0a405f8a-93ff-4c6f-b3be-f69616f1df7a.txt) |No |
| fileFilter |Specify a filter to be used to select a subset of files in the folderPath rather than all files.<br/><br/>Allowed values are: `*` (multiple characters) and `?` (single character).<br/><br/>Examples 1: `"fileFilter": "*.log"`<br/>Example 2: `"fileFilter": 2016-1-?.txt"`<br/><br/> fileFilter is applicable for an input FileShare dataset. This property is not supported with HDFS. |No |
| partitionedBy |partitionedBy can be used to specify a dynamic folderPath, filename for time series data. For example, folderPath parameterized for every hour of data. |No |
| format | The following format types are supported: **TextFormat**, **JsonFormat**, **AvroFormat**, **OrcFormat**, **ParquetFormat**. Set the **type** property under format to one of these values. For more information, see [Text Format](data-factory-supported-file-and-compression-formats.md#text-format), [Json Format](data-factory-supported-file-and-compression-formats.md#json-format), [Avro Format](data-factory-supported-file-and-compression-formats.md#avro-format), [Orc Format](data-factory-supported-file-and-compression-formats.md#orc-format), and [Parquet Format](data-factory-supported-file-and-compression-formats.md#parquet-format) sections. <br><br> If you want to **copy files as-is** between file-based stores (binary copy), skip the format section in both input and output dataset definitions. |No |
| compression | Specify the type and level of compression for the data. Supported types are: **GZip**, **Deflate**, **BZip2**, and **ZipDeflate**. Supported levels are: **Optimal** and **Fastest**. For more information, see [File and compression formats in Azure Data Factory](data-factory-supported-file-and-compression-formats.md#compression-support). |No |
| useBinaryTransfer |Specify whether use Binary transfer mode. True for binary mode and false ASCII. Default value: True. This property can only be used when associated linked service type is of type: FtpServer. |No |

> [!NOTE]
> filename and fileFilter cannot be used simultaneously.

#### Example

```json
{
    "name": "SFTPFileInput",
    "properties": {
        "type": "FileShare",
        "linkedServiceName": "SftpLinkedService",
        "typeProperties": {
            "folderPath": "<path to shared folder>",
            "fileName": "test.csv"
        },
        "external": true,
        "availability": {
            "frequency": "Hour",
            "interval": 1
        }
    }
}
```

For more information, see [SFTP connector](data-factory-sftp-connector.md#dataset-properties) article.

### File System Source in Copy Activity
If you are copying data from an SFTP source, set the **source type** of the copy activity to **FileSystemSource**, and specify following properties in the **source** section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| recursive |Indicates whether the data is read recursively from the sub folders or only from the specified folder. |True, False (default) |No |



#### Example

```json
{
    "name": "pipeline",
    "properties": {
        "activities": [{
            "name": "SFTPToBlobCopy",
            "inputs": [{
                "name": "SFTPFileInput"
            }],
            "outputs": [{
                "name": "AzureBlobOutput"
            }],
            "type": "Copy",
            "typeProperties": {
                "source": {
                    "type": "FileSystemSource"
                },
                "sink": {
                    "type": "BlobSink"
                }
            },
            "scheduler": {
                "frequency": "Hour",
                "interval": 1
            },
            "policy": {
                "concurrency": 1,
                "executionPriorityOrder": "NewestFirst",
                "retry": 1,
                "timeout": "00:05:00"
            }
        }],
        "start": "2017-02-20T18:00:00",
        "end": "2017-02-20T19:00:00"
    }
}
```

For more information, see [SFTP connector](data-factory-sftp-connector.md#copy-activity-properties) article.


## HTTP

### Linked service
To define a HTTP linked service, set the **type** of the linked service to **Http**, and specify following properties in the **typeProperties** section:

| Property | Description | Required |
| --- | --- | --- |
| url | Base URL to the Web Server | Yes |
| authenticationType | Specifies the authentication type. Allowed values are: **Anonymous**, **Basic**, **Digest**, **Windows**, **ClientCertificate**. <br><br> Refer to sections below this table on more properties and JSON samples for those authentication types respectively. | Yes |
| enableServerCertificateValidation | Specify whether to enable server TLS/SSL certificate validation if source is HTTPS Web Server | No, default is true |
| gatewayName | Name of the Data Management Gateway to connect to an on-premises HTTP source. | Yes if copying data from an on-premises HTTP source. |
| encryptedCredential | Encrypted credential to access the HTTP endpoint. Auto-generated when you configure the authentication information in copy wizard or the ClickOnce popup dialog. | No. Apply only when copying data from an on-premises HTTP server. |

#### Example: Using Basic, Digest, or Windows authentication
Set `authenticationType` as `Basic`, `Digest`, or `Windows`, and specify the following properties besides the HTTP connector generic ones introduced above:

| Property | Description | Required |
| --- | --- | --- |
| username | Username to access the HTTP endpoint. | Yes |
| password | Password for the user (username). | Yes |

```json
{
    "name": "HttpLinkedService",
    "properties": {
        "type": "Http",
        "typeProperties": {
            "authenticationType": "basic",
            "url": "https://en.wikipedia.org/wiki/",
            "userName": "user name",
            "password": "password"
        }
    }
}
```

#### Example: Using ClientCertificate authentication

To use basic authentication, set `authenticationType` as `ClientCertificate`, and specify the following properties besides the HTTP connector generic ones introduced above:

| Property | Description | Required |
| --- | --- | --- |
| embeddedCertData | The Base64-encoded contents of binary data of the Personal Information Exchange (PFX) file. | Specify either the `embeddedCertData` or `certThumbprint`. |
| certThumbprint | The thumbprint of the certificate that was installed on your gateway machine’s cert store. Apply only when copying data from an on-premises HTTP source. | Specify either the `embeddedCertData` or `certThumbprint`. |
| password | Password associated with the certificate. | No |

If you use `certThumbprint` for authentication and the certificate is installed in the personal store of the local computer, you need to grant the read permission to the gateway service:

1. Launch Microsoft Management Console (MMC). Add the **Certificates** snap-in that targets the **Local Computer**.
2. Expand **Certificates**, **Personal**, and click **Certificates**.
3. Right-click the certificate from the personal store, and select **All Tasks**->**Manage Private Keys...**
3. On the **Security** tab, add the user account under which Data Management Gateway Host Service is running with the read access to the certificate.

**Example: using client certificate:**
This linked service links your data factory to an on-premises HTTP web server. It uses a client certificate that is installed on the machine with Data Management Gateway installed.

```json
{
    "name": "HttpLinkedService",
    "properties": {
        "type": "Http",
        "typeProperties": {
            "authenticationType": "ClientCertificate",
            "url": "https://en.wikipedia.org/wiki/",
            "certThumbprint": "thumbprint of certificate",
            "gatewayName": "gateway name"
        }
    }
}
```

#### Example: using client certificate in a file
This linked service links your data factory to an on-premises HTTP web server. It uses a client certificate file on the machine with Data Management Gateway installed.

```json
{
    "name": "HttpLinkedService",
    "properties": {
        "type": "Http",
        "typeProperties": {
            "authenticationType": "ClientCertificate",
            "url": "https://en.wikipedia.org/wiki/",
            "embeddedCertData": "base64 encoded cert data",
            "password": "password of cert"
        }
    }
}
```

For more information, see [HTTP connector](data-factory-http-connector.md#linked-service-properties) article.

### Dataset
To define a HTTP dataset, set the **type** of the dataset to **Http**, and specify the following properties in the **typeProperties** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| relativeUrl | A relative URL to the resource that contains the data. When path is not specified, only the URL specified in the linked service definition is used. <br><br> To construct dynamic URL, you can use [Data Factory functions and system variables](data-factory-functions-variables.md), Example: `"relativeUrl": "$$Text.Format('/my/report?month={0:yyyy}-{0:MM}&fmt=csv', SliceStart)"`. | No |
| requestMethod | Http method. Allowed values are **GET** or **POST**. | No. Default is `GET`. |
| additionalHeaders | Additional HTTP request headers. | No |
| requestBody | Body for HTTP request. | No |
| format | If you want to simply **retrieve the data from HTTP endpoint as-is** without parsing it, skip this format settings. <br><br> If you want to parse the HTTP response content during copy, the following format types are supported: **TextFormat**, **JsonFormat**, **AvroFormat**, **OrcFormat**, **ParquetFormat**. For more information, see [Text Format](data-factory-supported-file-and-compression-formats.md#text-format), [Json Format](data-factory-supported-file-and-compression-formats.md#json-format), [Avro Format](data-factory-supported-file-and-compression-formats.md#avro-format), [Orc Format](data-factory-supported-file-and-compression-formats.md#orc-format), and [Parquet Format](data-factory-supported-file-and-compression-formats.md#parquet-format) sections. |No |
| compression | Specify the type and level of compression for the data. Supported types are: **GZip**, **Deflate**, **BZip2**, and **ZipDeflate**. Supported levels are: **Optimal** and **Fastest**. For more information, see [File and compression formats in Azure Data Factory](data-factory-supported-file-and-compression-formats.md#compression-support). |No |

#### Example: using the GET (default) method

```json
{
    "name": "HttpSourceDataInput",
    "properties": {
        "type": "Http",
        "linkedServiceName": "HttpLinkedService",
        "typeProperties": {
            "relativeUrl": "XXX/test.xml",
            "additionalHeaders": "Connection: keep-alive\nUser-Agent: Mozilla/5.0\n"
        },
        "external": true,
        "availability": {
            "frequency": "Hour",
            "interval": 1
        }
    }
}
```

#### Example: using the POST method

```json
{
    "name": "HttpSourceDataInput",
    "properties": {
        "type": "Http",
        "linkedServiceName": "HttpLinkedService",
        "typeProperties": {
            "relativeUrl": "/XXX/test.xml",
            "requestMethod": "Post",
            "requestBody": "body for POST HTTP request"
        },
        "external": true,
        "availability": {
            "frequency": "Hour",
            "interval": 1
        }
    }
}
```
For more information, see [HTTP connector](data-factory-http-connector.md#dataset-properties) article.

### HTTP Source in Copy Activity
If you are copying data from a HTTP source, set the **source type** of the copy activity to **HttpSource**, and specify following properties in the **source** section:

| Property | Description | Required |
| -------- | ----------- | -------- |
| httpRequestTimeout | The timeout (TimeSpan) for the HTTP request to get a response. It is the timeout to get a response, not the timeout to read response data. | No. Default value: 00:01:40 |


#### Example

```json
{
    "name": "SamplePipeline",
    "properties": {
        "start": "2016-06-01T18:00:00",
        "end": "2016-06-01T19:00:00",
        "description": "pipeline with copy activity",
        "activities": [{
            "name": "HttpSourceToAzureBlob",
            "description": "Copy from an HTTP source to an Azure blob",
            "type": "Copy",
            "inputs": [{
                "name": "HttpSourceDataInput"
            }],
            "outputs": [{
                "name": "AzureBlobOutput"
            }],
            "typeProperties": {
                "source": {
                    "type": "HttpSource"
                },
                "sink": {
                    "type": "BlobSink"
                }
            },
            "scheduler": {
                "frequency": "Hour",
                "interval": 1
            },
            "policy": {
                "concurrency": 1,
                "executionPriorityOrder": "OldestFirst",
                "retry": 0,
                "timeout": "01:00:00"
            }
        }]
    }
}
```

For more information, see [HTTP connector](data-factory-http-connector.md#copy-activity-properties) article.

## OData

### Linked service
To define an OData linked service, set the **type** of the linked service to **OData**, and specify following properties in the **typeProperties** section:

| Property | Description | Required |
| --- | --- | --- |
| url |Url of the OData service. |Yes |
| authenticationType |Type of authentication used to connect to the OData source. <br/><br/> For cloud OData, possible values are Anonymous, Basic, and OAuth (note Azure Data Factory currently only support Azure Active Directory based OAuth). <br/><br/> For on-premises OData, possible values are Anonymous, Basic, and Windows. |Yes |
| username |Specify user name if you are using Basic authentication. |Yes (only if you are using Basic authentication) |
| password |Specify password for the user account you specified for the username. |Yes (only if you are using Basic authentication) |
| authorizedCredential |If you are using OAuth, click **Authorize** button in the Data Factory Copy Wizard or Editor and enter your credential, then the value of this property will be auto-generated. |Yes (only if you are using OAuth authentication) |
| gatewayName |Name of the gateway that the Data Factory service should use to connect to the on-premises OData service. Specify only if you are copying data from on premises OData source. |No |

#### Example - Using Basic authentication
```json
{
    "name": "inputLinkedService",
    "properties": {
        "type": "OData",
        "typeProperties": {
            "url": "https://services.odata.org/OData/OData.svc",
            "authenticationType": "Basic",
            "username": "username",
            "password": "password"
        }
    }
}
```

#### Example - Using Anonymous authentication

```json
{
    "name": "ODataLinkedService",
    "properties": {
        "type": "OData",
        "typeProperties": {
            "url": "https://services.odata.org/OData/OData.svc",
            "authenticationType": "Anonymous"
        }
    }
}
```

#### Example - Using Windows authentication accessing on-premises OData source

```json
{
    "name": "inputLinkedService",
    "properties": {
        "type": "OData",
        "typeProperties": {
            "url": "<endpoint of on-premises OData source, for example, Dynamics CRM>",
            "authenticationType": "Windows",
            "username": "domain\\user",
            "password": "password",
            "gatewayName": "<onpremgateway>"
        }
    }
}
```

#### Example - Using OAuth authentication accessing cloud OData source
```json
{
    "name": "inputLinkedService",
    "properties":
    {
        "type": "OData",
            "typeProperties":
        {
            "url": "<endpoint of cloud OData source, for example, https://<tenant>.crm.dynamics.com/XRMServices/2011/OrganizationData.svc>",
            "authenticationType": "OAuth",
            "authorizedCredential": "<auto generated by clicking the Authorize button on UI>"
        }
    }
}
```

For more information, see [OData connector](data-factory-odata-connector.md#linked-service-properties) article.

### Dataset
To define an OData dataset, set the **type** of the dataset to **ODataResource**, and specify the following properties in the **typeProperties** section:

| Property | Description | Required |
| --- | --- | --- |
| path |Path to the OData resource |No |

#### Example

```json
{
    "name": "ODataDataset",
    "properties": {
        "type": "ODataResource",
        "typeProperties": {
            "path": "Products"
        },
        "linkedServiceName": "ODataLinkedService",
        "structure": [],
        "availability": {
            "frequency": "Hour",
            "interval": 1
        },
        "external": true,
        "policy": {
            "retryInterval": "00:01:00",
            "retryTimeout": "00:10:00",
            "maximumRetry": 3
        }
    }
}
```

For more information, see [OData connector](data-factory-odata-connector.md#dataset-properties) article.

### Relational Source in Copy Activity
If you are copying data from an OData source, set the **source type** of the copy activity to **RelationalSource**, and specify following properties in the **source** section:

| Property | Description | Example | Required |
| --- | --- | --- | --- |
| query |Use the custom query to read data. |"?$select=Name, Description&$top=5" |No |

#### Example

```json
{
    "name": "CopyODataToBlob",
    "properties": {
        "description": "pipeline for copy activity",
        "activities": [{
            "type": "Copy",
            "typeProperties": {
                "source": {
                    "type": "RelationalSource",
                    "query": "?$select=Name, Description&$top=5"
                },
                "sink": {
                    "type": "BlobSink",
                    "writeBatchSize": 0,
                    "writeBatchTimeout": "00:00:00"
                }
            },
            "inputs": [{
                "name": "ODataDataSet"
            }],
            "outputs": [{
                "name": "AzureBlobODataDataSet"
            }],
            "policy": {
                "timeout": "01:00:00",
                "concurrency": 1
            },
            "scheduler": {
                "frequency": "Hour",
                "interval": 1
            },
            "name": "ODataToBlob"
        }],
        "start": "2017-02-01T18:00:00",
        "end": "2017-02-03T19:00:00"
    }
}
```

For more information, see [OData connector](data-factory-odata-connector.md#copy-activity-properties) article.


## ODBC


### Linked service
To define an ODBC linked service, set the **type** of the linked service to **OnPremisesOdbc**, and specify following properties in the **typeProperties** section:

| Property | Description | Required |
| --- | --- | --- |
| connectionString |The non-access credential portion of the connection string and an optional encrypted credential. See examples in the following sections. |Yes |
| credential |The access credential portion of the connection string specified in driver-specific property-value format. Example: `“Uid=<user ID>;Pwd=<password>;RefreshToken=<secret refresh token>;”.` |No |
| authenticationType |Type of authentication used to connect to the ODBC data store. Possible values are: Anonymous and Basic. |Yes |
| username |Specify user name if you are using Basic authentication. |No |
| password |Specify password for the user account you specified for the username. |No |
| gatewayName |Name of the gateway that the Data Factory service should use to connect to the ODBC data store. |Yes |

#### Example - Using Basic authentication

```json
{
    "name": "ODBCLinkedService",
    "properties": {
        "type": "OnPremisesOdbc",
        "typeProperties": {
            "authenticationType": "Basic",
            "connectionString": "Driver={SQL Server};Server=Server.database.windows.net; Database=TestDatabase;",
            "userName": "username",
            "password": "password",
            "gatewayName": "<onpremgateway>"
        }
    }
}
```
#### Example - Using Basic authentication with encrypted credentials
You can encrypt the credentials using the [New-AzDataFactoryEncryptValue](https://docs.microsoft.com/powershell/module/az.datafactory/new-azdatafactoryencryptvalue) cmdlet.

```json
{
    "name": "ODBCLinkedService",
    "properties": {
        "type": "OnPremisesOdbc",
        "typeProperties": {
            "authenticationType": "Basic",
            "connectionString": "Driver={SQL Server};Server=myserver.database.windows.net; Database=TestDatabase;;EncryptedCredential=eyJDb25uZWN0...........................",
            "gatewayName": "<onpremgateway>"
        }
    }
}
```

#### Example: Using Anonymous authentication

```json
{
    "name": "ODBCLinkedService",
    "properties": {
        "type": "OnPremisesOdbc",
        "typeProperties": {
            "authenticationType": "Anonymous",
            "connectionString": "Driver={SQL Server};Server={servername}.database.windows.net; Database=TestDatabase;",
            "credential": "UID={uid};PWD={pwd}",
            "gatewayName": "<onpremgateway>"
        }
    }
}
```

For more information, see [ODBC connector](data-factory-odbc-connector.md#linked-service-properties) article.

### Dataset
To define an ODBC dataset, set the **type** of the dataset to **RelationalTable**, and specify the following properties in the **typeProperties** section:

| Property | Description | Required |
| --- | --- | --- |
| tableName |Name of the table in the ODBC data store. |Yes |


#### Example

```json
{
    "name": "ODBCDataSet",
    "properties": {
        "type": "RelationalTable",
        "linkedServiceName": "ODBCLinkedService",
        "typeProperties": {},
        "availability": {
            "frequency": "Hour",
            "interval": 1
        },
        "external": true,
        "policy": {
            "externalData": {
                "retryInterval": "00:01:00",
                "retryTimeout": "00:10:00",
                "maximumRetry": 3
            }
        }
    }
}
```

For more information, see [ODBC connector](data-factory-odbc-connector.md#dataset-properties) article.

### Relational Source in Copy Activity
If you are copying data from an ODBC data store, set the **source type** of the copy activity to **RelationalSource**, and specify following properties in the **source** section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| query |Use the custom query to read data. |SQL query string. For example: `select * from MyTable`. |Yes |

#### Example

```json
{
    "name": "CopyODBCToBlob",
    "properties": {
        "description": "pipeline for copy activity",
        "activities": [{
            "type": "Copy",
            "typeProperties": {
                "source": {
                    "type": "RelationalSource",
                    "query": "$$Text.Format('select * from MyTable where timestamp >= \\'{0:yyyy-MM-ddTHH:mm:ss}\\' AND timestamp < \\'{1:yyyy-MM-ddTHH:mm:ss}\\'', WindowStart, WindowEnd)"
                },
                "sink": {
                    "type": "BlobSink",
                    "writeBatchSize": 0,
                    "writeBatchTimeout": "00:00:00"
                }
            },
            "inputs": [{
                "name": "OdbcDataSet"
            }],
            "outputs": [{
                "name": "AzureBlobOdbcDataSet"
            }],
            "policy": {
                "timeout": "01:00:00",
                "concurrency": 1
            },
            "scheduler": {
                "frequency": "Hour",
                "interval": 1
            },
            "name": "OdbcToBlob"
        }],
        "start": "2016-06-01T18:00:00",
        "end": "2016-06-01T19:00:00"
    }
}
```

For more information, see [ODBC connector](data-factory-odbc-connector.md#copy-activity-properties) article.

## Salesforce


### Linked service
To define a Salesforce linked service, set the **type** of the linked service to **Salesforce**, and specify following properties in the **typeProperties** section:

| Property | Description | Required |
| --- | --- | --- |
| environmentUrl | Specify the URL of Salesforce instance. <br><br> - Default is "https:\//login.salesforce.com". <br> - To copy data from sandbox, specify "https://test.salesforce.com". <br> - To copy data from custom domain, specify, for example, "https://[domain].my.salesforce.com". |No |
| username |Specify a user name for the user account. |Yes |
| password |Specify a password for the user account. |Yes |
| securityToken |Specify a security token for the user account. See [Get security token](https://help.salesforce.com/apex/HTViewHelpDoc?id=user_security_token.htm) for instructions on how to reset/get a security token. To learn about security tokens in general, see [Security and the API](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_concepts_security.htm). |Yes |

#### Example

```json
{
    "name": "SalesforceLinkedService",
    "properties": {
        "type": "Salesforce",
        "typeProperties": {
            "username": "<user name>",
            "password": "<password>",
            "securityToken": "<security token>"
        }
    }
}
```

For more information, see [Salesforce connector](data-factory-salesforce-connector.md#linked-service-properties) article.

### Dataset
To define a Salesforce dataset, set the **type** of the dataset to **RelationalTable**, and specify the following properties in the **typeProperties** section:

| Property | Description | Required |
| --- | --- | --- |
| tableName |Name of the table in Salesforce. |No (if a **query** of **RelationalSource** is specified) |

#### Example

```json
{
    "name": "SalesforceInput",
    "properties": {
        "linkedServiceName": "SalesforceLinkedService",
        "type": "RelationalTable",
        "typeProperties": {
            "tableName": "AllDataType__c"
        },
        "availability": {
            "frequency": "Hour",
            "interval": 1
        },
        "external": true,
        "policy": {
            "externalData": {
                "retryInterval": "00:01:00",
                "retryTimeout": "00:10:00",
                "maximumRetry": 3
            }
        }
    }
}
```

For more information, see [Salesforce connector](data-factory-salesforce-connector.md#dataset-properties) article.

### Relational Source in Copy Activity
If you are copying data from Salesforce, set the **source type** of the copy activity to **RelationalSource**, and specify following properties in the **source** section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| query |Use the custom query to read data. |A SQL-92 query or [Salesforce Object Query Language (SOQL)](https://developer.salesforce.com/docs/atlas.en-us.soql_sosl.meta/soql_sosl/sforce_api_calls_soql.htm) query. For example:  `select * from MyTable__c`. |No (if the **tableName** of the **dataset** is specified) |

#### Example



```json
{
    "name": "SamplePipeline",
    "properties": {
        "start": "2016-06-01T18:00:00",
        "end": "2016-06-01T19:00:00",
        "description": "pipeline with copy activity",
        "activities": [{
            "name": "SalesforceToAzureBlob",
            "description": "Copy from Salesforce to an Azure blob",
            "type": "Copy",
            "inputs": [{
                "name": "SalesforceInput"
            }],
            "outputs": [{
                "name": "AzureBlobOutput"
            }],
            "typeProperties": {
                "source": {
                    "type": "RelationalSource",
                    "query": "SELECT Id, Col_AutoNumber__c, Col_Checkbox__c, Col_Currency__c, Col_Date__c, Col_DateTime__c, Col_Email__c, Col_Number__c, Col_Percent__c, Col_Phone__c, Col_Picklist__c, Col_Picklist_MultiSelect__c, Col_Text__c, Col_Text_Area__c, Col_Text_AreaLong__c, Col_Text_AreaRich__c, Col_URL__c, Col_Text_Encrypt__c, Col_Lookup__c FROM AllDataType__c"
                },
                "sink": {
                    "type": "BlobSink"
                }
            },
            "scheduler": {
                "frequency": "Hour",
                "interval": 1
            },
            "policy": {
                "concurrency": 1,
                "executionPriorityOrder": "OldestFirst",
                "retry": 0,
                "timeout": "01:00:00"
            }
        }]
    }
}
```

> [!IMPORTANT]
> The "__c" part of the API Name is needed for any custom object.

For more information, see [Salesforce connector](data-factory-salesforce-connector.md#copy-activity-properties) article.

## Web Data

### Linked service
To define a Web linked service, set the **type** of the linked service to **Web**, and specify following properties in the **typeProperties** section:

| Property | Description | Required |
| --- | --- | --- |
| Url |URL to the Web source |Yes |
| authenticationType |Anonymous. |Yes |


#### Example


```json
{
    "name": "web",
    "properties": {
        "type": "Web",
        "typeProperties": {
            "authenticationType": "Anonymous",
            "url": "https://en.wikipedia.org/wiki/"
        }
    }
}
```

For more information, see [Web Table connector](data-factory-web-table-connector.md#linked-service-properties) article.

### Dataset
To define a Web dataset, set the **type** of the dataset to **WebTable**, and specify the following properties in the **typeProperties** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type |type of the dataset. must be set to **WebTable** |Yes |
| path |A relative URL to the resource that contains the table. |No. When path is not specified, only the URL specified in the linked service definition is used. |
| index |The index of the table in the resource. See Get index of a table in an HTML page section for steps to getting index of a table in an HTML page. |Yes |

#### Example

```json
{
    "name": "WebTableInput",
    "properties": {
        "type": "WebTable",
        "linkedServiceName": "WebLinkedService",
        "typeProperties": {
            "index": 1,
            "path": "AFI's_100_Years...100_Movies"
        },
        "external": true,
        "availability": {
            "frequency": "Hour",
            "interval": 1
        }
    }
}
```

For more information, see [Web Table connector](data-factory-web-table-connector.md#dataset-properties) article.

### Web Source in Copy Activity
If you are copying data from a web table, set the **source type** of the copy activity to **WebSource**. Currently, when the source in copy activity is of type **WebSource**, no additional properties are supported.

#### Example

```json
{
    "name": "SamplePipeline",
    "properties": {
        "start": "2016-06-01T18:00:00",
        "end": "2016-06-01T19:00:00",
        "description": "pipeline with copy activity",
        "activities": [{
            "name": "WebTableToAzureBlob",
            "description": "Copy from a Web table to an Azure blob",
            "type": "Copy",
            "inputs": [{
                "name": "WebTableInput"
            }],
            "outputs": [{
                "name": "AzureBlobOutput"
            }],
            "typeProperties": {
                "source": {
                    "type": "WebSource"
                },
                "sink": {
                    "type": "BlobSink"
                }
            },
            "scheduler": {
                "frequency": "Hour",
                "interval": 1
            },
            "policy": {
                "concurrency": 1,
                "executionPriorityOrder": "OldestFirst",
                "retry": 0,
                "timeout": "01:00:00"
            }
        }]
    }
}
```

For more information, see [Web Table connector](data-factory-web-table-connector.md#copy-activity-properties) article.

## COMPUTE ENVIRONMENTS
The following table lists the compute environments supported by Data Factory and the transformation activities that can run on them. Click the link for the compute you are interested in to see the JSON schemas for linked service to link it to a data factory.

| Compute environment | Activities |
| --- | --- |
| [On-demand HDInsight cluster](#on-demand-azure-hdinsight-cluster) or [your own HDInsight cluster](#existing-azure-hdinsight-cluster) |[.NET custom activity](#net-custom-activity), [Hive activity](#hdinsight-hive-activity), [Pig activity](#hdinsight-pig-activity), [MapReduce activity](#hdinsight-mapreduce-activity), Hadoop streaming activity, [Spark activity](#hdinsight-spark-activity) |
| [Azure Batch](#azure-batch) |[.NET custom activity](#net-custom-activity) |
| [Azure Machine Learning](#azure-machine-learning) | [Machine Learning Batch Execution Activity](#machine-learning-batch-execution-activity), [Machine Learning Update Resource Activity](#machine-learning-update-resource-activity) |
| [Azure Data Lake Analytics](#azure-data-lake-analytics) |[Data Lake Analytics U-SQL](#data-lake-analytics-u-sql-activity) |
| [Azure SQL Database](#azure-sql-database), [Azure SQL Data Warehouse](#azure-sql-data-warehouse), [SQL Server](#sql-server-stored-procedure) |[Stored Procedure](#stored-procedure-activity) |

## On-demand Azure HDInsight cluster
The Azure Data Factory service can automatically create a Windows/Linux-based on-demand HDInsight cluster to process data. The cluster is created in the same region as the storage account (linkedServiceName property in the JSON) associated with the cluster. You can run the following transformation activities on this linked service: [.NET custom activity](#net-custom-activity), [Hive activity](#hdinsight-hive-activity), [Pig activity](#hdinsight-pig-activity), [MapReduce activity](#hdinsight-mapreduce-activity), Hadoop streaming activity, [Spark activity](#hdinsight-spark-activity).

### Linked service
The following table provides descriptions for the properties used in the Azure JSON definition of an on-demand HDInsight linked service.

| Property | Description | Required |
| --- | --- | --- |
| type |The type property should be set to **HDInsightOnDemand**. |Yes |
| clusterSize |Number of worker/data nodes in the cluster. The HDInsight cluster is created with 2 head nodes along with the number of worker nodes you specify for this property. The nodes are of size Standard_D3 that has 4 cores, so a 4 worker node cluster takes 24 cores (4\*4 = 16 cores for worker nodes, plus 2\*4 = 8 cores for head nodes). See [Create Linux-based Hadoop clusters in HDInsight](../../hdinsight/hdinsight-hadoop-provision-linux-clusters.md) for details about the Standard_D3 tier. |Yes |
| timetolive |The allowed idle time for the on-demand HDInsight cluster. Specifies how long the on-demand HDInsight cluster stays alive after completion of an activity run if there are no other active jobs in the cluster.<br/><br/>For example, if an activity run takes 6 minutes and timetolive is set to 5 minutes, the cluster stays alive for 5 minutes after the 6 minutes of processing the activity run. If another activity run is executed with the 6 minutes window, it is processed by the same cluster.<br/><br/>Creating an on-demand HDInsight cluster is an expensive operation (could take a while), so use this setting as needed to improve performance of a data factory by reusing an on-demand HDInsight cluster.<br/><br/>If you set timetolive value to 0, the cluster is deleted as soon as the activity run in processed. On the other hand, if you set a high value, the cluster may stay idle unnecessarily resulting in high costs. Therefore, it is important that you set the appropriate value based on your needs.<br/><br/>Multiple pipelines can share the same instance of the on-demand HDInsight cluster if the timetolive property value is appropriately set |Yes |
| version |Version of the HDInsight cluster. For details, see [supported HDInsight versions in Azure Data Factory](data-factory-compute-linked-services.md#supported-hdinsight-versions-in-azure-data-factory). |No |
| linkedServiceName |Azure Storage linked service to be used by the on-demand cluster for storing and processing data. <p>Currently, you cannot create an on-demand HDInsight cluster that uses an Azure Data Lake Store as the storage. If you want to store the result data from HDInsight processing in an Azure Data Lake Store, use a Copy Activity to copy the data from the Azure Blob Storage to the Azure Data Lake Store.</p>  | Yes |
| additionalLinkedServiceNames |Specifies additional storage accounts for the HDInsight linked service so that the Data Factory service can register them on your behalf. |No |
| osType |Type of operating system. Allowed values are: Windows (default) and Linux |No |
| hcatalogLinkedServiceName |The name of Azure SQL linked service that point to the HCatalog database. The on-demand HDInsight cluster is created by using Azure SQL Database as the metastore. |No |

### JSON example
The following JSON defines a Linux-based on-demand HDInsight linked service. The Data Factory service automatically creates a **Linux-based** HDInsight cluster when processing a data slice.

```json
{
    "name": "HDInsightOnDemandLinkedService",
    "properties": {
        "type": "HDInsightOnDemand",
        "typeProperties": {
            "version": "3.5",
            "clusterSize": 1,
            "timeToLive": "00:05:00",
            "osType": "Linux",
            "linkedServiceName": "StorageLinkedService"
        }
    }
}
```

For more information, see [Compute linked services](data-factory-compute-linked-services.md) article.

## Existing Azure HDInsight cluster
You can create an Azure HDInsight linked service to register your own HDInsight cluster with Data Factory. You can run the following data transformation activities on this linked service: [.NET custom activity](#net-custom-activity), [Hive activity](#hdinsight-hive-activity), [Pig activity](#hdinsight-pig-activity), [MapReduce activity](#hdinsight-mapreduce-activity), Hadoop streaming activity, [Spark activity](#hdinsight-spark-activity).

### Linked service
The following table provides descriptions for the properties used in the Azure JSON definition of an Azure HDInsight linked service.

| Property | Description | Required |
| --- | --- | --- |
| type |The type property should be set to **HDInsight**. |Yes |
| clusterUri |The URI of the HDInsight cluster. |Yes |
| username |Specify the name of the user to be used to connect to an existing HDInsight cluster. |Yes |
| password |Specify password for the user account. |Yes |
| linkedServiceName | Name of the Azure Storage linked service that refers to the Azure blob storage used by the HDInsight cluster. <p>Currently, you cannot specify an Azure Data Lake Store linked service for this property. You may access data in the Azure Data Lake Store from Hive/Pig scripts if the HDInsight cluster has access to the Data Lake Store. </p>  |Yes |

For versions of HDInsight clusters supported, see [supported HDInsight versions](data-factory-compute-linked-services.md#supported-hdinsight-versions-in-azure-data-factory).

#### JSON example

```json
{
    "name": "HDInsightLinkedService",
    "properties": {
        "type": "HDInsight",
        "typeProperties": {
            "clusterUri": " https://<hdinsightclustername>.azurehdinsight.net/",
            "userName": "admin",
            "password": "<password>",
            "linkedServiceName": "MyHDInsightStoragelinkedService"
        }
    }
}
```

## Azure Batch
You can create an Azure Batch linked service to register a Batch pool of virtual machines (VMs) with a data factory. You can run .NET custom activities using either Azure Batch or Azure HDInsight. You can run a [.NET custom activity](#net-custom-activity) on this linked service.

### Linked service
The following table provides descriptions for the properties used in the Azure JSON definition of an Azure Batch linked service.

| Property | Description | Required |
| --- | --- | --- |
| type |The type property should be set to **AzureBatch**. |Yes |
| accountName |Name of the Azure Batch account. |Yes |
| accessKey |Access key for the Azure Batch account. |Yes |
| poolName |Name of the pool of virtual machines. |Yes |
| linkedServiceName |Name of the Azure Storage linked service associated with this Azure Batch linked service. This linked service is used for staging files required to run the activity and storing the activity execution logs. |Yes |


#### JSON example

```json
{
    "name": "AzureBatchLinkedService",
    "properties": {
        "type": "AzureBatch",
        "typeProperties": {
            "accountName": "<Azure Batch account name>",
            "accessKey": "<Azure Batch account key>",
            "poolName": "<Azure Batch pool name>",
            "linkedServiceName": "<Specify associated storage linked service reference here>"
        }
    }
}
```

## Azure Machine Learning
You create an Azure Machine Learning linked service to register a Machine Learning batch scoring endpoint with a data factory. Two data transformation activities that can run on this linked service: [Machine Learning Batch Execution Activity](#machine-learning-batch-execution-activity), [Machine Learning Update Resource Activity](#machine-learning-update-resource-activity).

### Linked service
The following table provides descriptions for the properties used in the Azure JSON definition of an Azure Machine Learning linked service.

| Property | Description | Required |
| --- | --- | --- |
| Type |The type property should be set to: **AzureML**. |Yes |
| mlEndpoint |The batch scoring URL. |Yes |
| apiKey |The published workspace model’s API. |Yes |

#### JSON example

```json
{
    "name": "AzureMLLinkedService",
    "properties": {
        "type": "AzureML",
        "typeProperties": {
            "mlEndpoint": "https://[batch scoring endpoint]/jobs",
            "apiKey": "<apikey>"
        }
    }
}
```

## Azure Data Lake Analytics
You create an **Azure Data Lake Analytics** linked service to link an Azure Data Lake Analytics compute service to an Azure data factory before using the [Data Lake Analytics U-SQL activity](data-factory-usql-activity.md) in a pipeline.

### Linked service

The following table provides descriptions for the properties used in the JSON definition of an Azure Data Lake Analytics linked service.

| Property | Description | Required |
| --- | --- | --- |
| Type |The type property should be set to: **AzureDataLakeAnalytics**. |Yes |
| accountName |Azure Data Lake Analytics Account Name. |Yes |
| dataLakeAnalyticsUri |Azure Data Lake Analytics URI. |No |
| authorization |Authorization code is automatically retrieved after clicking **Authorize** button in the Data Factory Editor and completing the OAuth login. |Yes |
| subscriptionId |Azure subscription ID |No (If not specified, subscription of the data factory is used). |
| resourceGroupName |Azure resource group name |No (If not specified, resource group of the data factory is used). |
| sessionId |session ID from the OAuth authorization session. Each session ID is unique and may only be used once. When you use the Data Factory Editor, this ID is auto-generated. |Yes |


#### JSON example
The following example provides JSON definition for an Azure Data Lake Analytics linked service.

```json
{
    "name": "AzureDataLakeAnalyticsLinkedService",
    "properties": {
        "type": "AzureDataLakeAnalytics",
        "typeProperties": {
            "accountName": "<account name>",
            "dataLakeAnalyticsUri": "datalakeanalyticscompute.net",
            "authorization": "<authcode>",
            "sessionId": "<session ID>",
            "subscriptionId": "<subscription id>",
            "resourceGroupName": "<resource group name>"
        }
    }
}
```

## SQL Server Stored Procedure

You create a SQL Server linked service and use it with the [Stored Procedure Activity](data-factory-stored-proc-activity.md) to invoke a stored procedure from a Data Factory pipeline.

### Linked service
You create a linked service of type **OnPremisesSqlServer** to link a SQL Server database to a data factory. The following table provides description for JSON elements specific to SQL Server linked service.

The following table provides description for JSON elements specific to SQL Server linked service.

| Property | Description | Required |
| --- | --- | --- |
| type |The type property should be set to: **OnPremisesSqlServer**. |Yes |
| connectionString |Specify connectionString information needed to connect to the SQL Server database using either SQL authentication or Windows authentication. |Yes |
| gatewayName |Name of the gateway that the Data Factory service should use to connect to the SQL Server database. |Yes |
| username |Specify user name if you are using Windows Authentication. Example: **domainname\\username**. |No |
| password |Specify password for the user account you specified for the username. |No |

You can encrypt credentials using the **New-AzDataFactoryEncryptValue** cmdlet and use them in the connection string as shown in the following example (**EncryptedCredential** property):

```JSON
"connectionString": "Data Source=<servername>;Initial Catalog=<databasename>;Integrated Security=True;EncryptedCredential=<encrypted credential>",
```


#### Example: JSON for using SQL Authentication

```json
{
    "name": "MyOnPremisesSQLDB",
    "properties": {
        "type": "OnPremisesSqlServer",
        "typeProperties": {
            "connectionString": "Data Source=<servername>;Initial Catalog=MarketingCampaigns;Integrated Security=False;User ID=<username>;Password=<password>;",
            "gatewayName": "<gateway name>"
        }
    }
}
```
#### Example: JSON for using Windows Authentication

If username and password are specified, gateway uses them to impersonate the specified user account to connect to the SQL Server database. Otherwise, gateway connects to the SQL Server directly with the security context of Gateway (its startup account).

```json
{
    "Name": " MyOnPremisesSQLDB",
    "Properties": {
        "type": "OnPremisesSqlServer",
        "typeProperties": {
            "ConnectionString": "Data Source=<servername>;Initial Catalog=MarketingCampaigns;Integrated Security=True;",
            "username": "<domain\\username>",
            "password": "<password>",
            "gatewayName": "<gateway name>"
        }
    }
}
```

For more information, see [SQL Server connector](data-factory-sqlserver-connector.md#linked-service-properties) article.

## DATA TRANSFORMATION ACTIVITIES

Activity | Description
-------- | -----------
[HDInsight Hive activity](#hdinsight-hive-activity) | The HDInsight Hive activity in a Data Factory pipeline executes Hive queries on your own or on-demand Windows/Linux-based HDInsight cluster.
[HDInsight Pig activity](#hdinsight-pig-activity) | The HDInsight Pig activity in a Data Factory pipeline executes Pig queries on your own or on-demand Windows/Linux-based HDInsight cluster.
[HDInsight MapReduce Activity](#hdinsight-mapreduce-activity) | The HDInsight MapReduce activity in a Data Factory pipeline executes MapReduce programs on your own or on-demand Windows/Linux-based HDInsight cluster.
[HDInsight Streaming Activity](#hdinsight-streaming-activity) | The HDInsight Streaming Activity in a Data Factory pipeline executes Hadoop Streaming programs on your own or on-demand Windows/Linux-based HDInsight cluster.
[HDInsight Spark Activity](#hdinsight-spark-activity) | The HDInsight Spark activity in a Data Factory pipeline executes Spark programs on your own HDInsight cluster.
[Machine Learning Batch Execution Activity](#machine-learning-batch-execution-activity) | Azure Data Factory enables you to easily create pipelines that use a published Azure Machine Learning web service for predictive analytics. Using the Batch Execution Activity in an Azure Data Factory pipeline, you can invoke a Machine Learning web service to make predictions on the data in batch.
[Machine Learning Update Resource Activity](#machine-learning-update-resource-activity) | Over time, the predictive models in the Machine Learning scoring experiments need to be retrained using new input datasets. After you are done with retraining, you want to update the scoring web service with the retrained Machine Learning model. You can use the Update Resource Activity to update the web service with the newly trained model.
[Stored Procedure Activity](#stored-procedure-activity) | You can use the Stored Procedure activity in a Data Factory pipeline to invoke a stored procedure in one of the following data stores: Azure SQL Database, Azure SQL Data Warehouse, SQL Server Database in your enterprise or an Azure VM.
[Data Lake Analytics U-SQL activity](#data-lake-analytics-u-sql-activity) | Data Lake Analytics U-SQL Activity runs a U-SQL script on an Azure Data Lake Analytics cluster.
[.NET custom activity](#net-custom-activity) | If you need to transform data in a way that is not supported by Data Factory, you can create a custom activity with your own data processing logic and use the activity in the pipeline. You can configure the custom .NET activity to run using either an Azure Batch service or an Azure HDInsight cluster.


## HDInsight Hive Activity
You can specify the following properties in a Hive Activity JSON definition. The type property for the activity must be: **HDInsightHive**. You must create a HDInsight linked service first and specify the name of it as a value for the **linkedServiceName** property. The following properties are supported in the **typeProperties** section when you set the type of activity to HDInsightHive:

| Property | Description | Required |
| --- | --- | --- |
| script |Specify the Hive script inline |No |
| script path |Store the Hive script in an Azure blob storage and provide the path to the file. Use 'script' or 'scriptPath' property. Both cannot be used together. The file name is case-sensitive. |No |
| defines |Specify parameters as key/value pairs for referencing within the Hive script using 'hiveconf' |No |

These type properties are specific to the Hive Activity. Other properties (outside the typeProperties section) are supported for all activities.

### JSON example
The following JSON defines a HDInsight Hive activity in a pipeline.

```json
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

For more information, see [Hive Activity](data-factory-hive-activity.md) article.

## HDInsight Pig Activity
You can specify the following properties in a Pig Activity JSON definition. The type property for the activity must be: **HDInsightPig**. You must create a HDInsight linked service first and specify the name of it as a value for the **linkedServiceName** property. The following properties are supported in the **typeProperties** section when you set the type of activity to HDInsightPig:

| Property | Description | Required |
| --- | --- | --- |
| script |Specify the Pig script inline |No |
| script path |Store the Pig script in an Azure blob storage and provide the path to the file. Use 'script' or 'scriptPath' property. Both cannot be used together. The file name is case-sensitive. |No |
| defines |Specify parameters as key/value pairs for referencing within the Pig script |No |

These type properties are specific to the Pig Activity. Other properties (outside the typeProperties section) are supported for all activities.

### JSON example

```json
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

For more information, see Pig Activity article.

## HDInsight MapReduce Activity
You can specify the following properties in a MapReduce Activity JSON definition. The type property for the activity must be: **HDInsightMapReduce**. You must create a HDInsight linked service first and specify the name of it as a value for the **linkedServiceName** property. The following properties are supported in the **typeProperties** section when you set the type of activity to HDInsightMapReduce:

| Property | Description | Required |
| --- | --- | --- |
| jarLinkedService | Name of the linked service for the Azure Storage that contains the JAR file. | Yes |
| jarFilePath | Path to the JAR file in the Azure Storage. | Yes |
| className | Name of the main class in the JAR file. | Yes |
| arguments | A list of comma-separated arguments for the MapReduce program. At runtime, you see a few extra arguments (for example: mapreduce.job.tags) from the MapReduce framework. To differentiate your arguments with the MapReduce arguments, consider using both option and value as arguments as shown in the following example (-s, --input, --output etc., are options immediately followed by their values) | No |

### JSON example

```json
{
    "name": "MahoutMapReduceSamplePipeline",
    "properties": {
        "description": "Sample Pipeline to Run a Mahout Custom Map Reduce Jar. This job calculates an Item Similarity Matrix to determine the similarity between two items",
        "activities": [
            {
                "type": "HDInsightMapReduce",
                "typeProperties": {
                    "className": "org.apache.mahout.cf.taste.hadoop.similarity.item.ItemSimilarityJob",
                    "jarFilePath": "adfsamples/Mahout/jars/mahout-examples-0.9.0.2.2.7.1-34.jar",
                    "jarLinkedService": "StorageLinkedService",
                    "arguments": ["-s", "SIMILARITY_LOGLIKELIHOOD", "--input", "wasb://adfsamples@spestore.blob.core.windows.net/Mahout/input", "--output", "wasb://adfsamples@spestore.blob.core.windows.net/Mahout/output/", "--maxSimilaritiesPerItem", "500", "--tempDir", "wasb://adfsamples@spestore.blob.core.windows.net/Mahout/temp/mahout"]
                },
                "inputs": [
                    {
                        "name": "MahoutInput"
                    }
                ],
                "outputs": [
                    {
                        "name": "MahoutOutput"
                    }
                ],
                "policy": {
                    "timeout": "01:00:00",
                    "concurrency": 1,
                    "retry": 3
                },
                "scheduler": {
                    "frequency": "Hour",
                    "interval": 1
                },
                "name": "MahoutActivity",
                "description": "Custom Map Reduce to generate Mahout result",
                "linkedServiceName": "HDInsightLinkedService"
            }
        ],
        "start": "2017-01-03T00:00:00",
        "end": "2017-01-04T00:00:00"
    }
}
```

For more information, see [MapReduce Activity](data-factory-map-reduce.md) article.

## HDInsight Streaming Activity
You can specify the following properties in a Hadoop Streaming Activity JSON definition. The type property for the activity must be: **HDInsightStreaming**. You must create a HDInsight linked service first and specify the name of it as a value for the **linkedServiceName** property. The following properties are supported in the **typeProperties** section when you set the type of activity to HDInsightStreaming:

| Property | Description |
| --- | --- |
| mapper | Name of the mapper executable. In the example, cat.exe is the mapper executable.|
| reducer | Name of the reducer executable. In the example, wc.exe is the reducer executable. |
| input | Input file (including location) for the mapper. In the example: `"wasb://adfsample@<account name>.blob.core.windows.net/example/data/gutenberg/davinci.txt"`: adfsample is the blob container, example/data/Gutenberg is the folder, and davinci.txt is the blob. |
| output | Output file (including location) for the reducer. The output of the Hadoop Streaming job is written to the location specified for this property. |
| filePaths | Paths for the mapper and reducer executables. In the example: "adfsample/example/apps/wc.exe", adfsample is the blob container, example/apps is the folder, and wc.exe is the executable. |
| fileLinkedService | Azure Storage linked service that represents the Azure storage that contains the files specified in the filePaths section. |
| arguments | A list of comma-separated arguments for the MapReduce program. At runtime, you see a few extra arguments (for example: mapreduce.job.tags) from the MapReduce framework. To differentiate your arguments with the MapReduce arguments, consider using both option and value as arguments as shown in the following example (-s, --input, --output etc., are options immediately followed by their values) |
| getDebugInfo | An optional element. When it is set to Failure, the logs are downloaded only on failure. When it is set to All, logs are always downloaded irrespective of the execution status. |

> [!NOTE]
> You must specify an output dataset for the Hadoop Streaming Activity for the **outputs** property. This dataset can be just a dummy dataset that is required to drive the pipeline schedule (hourly, daily, etc.). If the activity doesn't take an input, you can skip specifying an input dataset for the activity for the **inputs** property.

## JSON example

```json
{
    "name": "HadoopStreamingPipeline",
    "properties": {
        "description": "Hadoop Streaming Demo",
        "activities": [
            {
                "type": "HDInsightStreaming",
                "typeProperties": {
                    "mapper": "cat.exe",
                    "reducer": "wc.exe",
                    "input": "wasb://<nameofthecluster>@spestore.blob.core.windows.net/example/data/gutenberg/davinci.txt",
                    "output": "wasb://<nameofthecluster>@spestore.blob.core.windows.net/example/data/StreamingOutput/wc.txt",
                    "filePaths": ["<nameofthecluster>/example/apps/wc.exe","<nameofthecluster>/example/apps/cat.exe"],
                    "fileLinkedService": "StorageLinkedService",
                    "getDebugInfo": "Failure"
                },
                "outputs": [
                    {
                        "name": "StreamingOutputDataset"
                    }
                ],
                "policy": {
                    "timeout": "01:00:00",
                    "concurrency": 1,
                    "executionPriorityOrder": "NewestFirst",
                    "retry": 1
                },
                "scheduler": {
                    "frequency": "Day",
                    "interval": 1
                },
                "name": "RunHadoopStreamingJob",
                "description": "Run a Hadoop streaming job",
                "linkedServiceName": "HDInsightLinkedService"
            }
        ],
        "start": "2014-01-04T00:00:00",
        "end": "2014-01-05T00:00:00"
    }
}
```

For more information, see [Hadoop Streaming Activity](data-factory-hadoop-streaming-activity.md) article.

## HDInsight Spark Activity
You can specify the following properties in a Spark Activity JSON definition. The type property for the activity must be: **HDInsightSpark**. You must create a HDInsight linked service first and specify the name of it as a value for the **linkedServiceName** property. The following properties are supported in the **typeProperties** section when you set the type of activity to HDInsightSpark:

| Property | Description | Required |
| -------- | ----------- | -------- |
| rootPath | The Azure Blob container and folder that contains the Spark file. The file name is case-sensitive. | Yes |
| entryFilePath | Relative path to the root folder of the Spark code/package. | Yes |
| className | Application's Java/Spark main class | No |
| arguments | A list of command-line arguments to the Spark program. | No |
| proxyUser | The user account to impersonate to execute the Spark program | No |
| sparkConfig | Spark configuration properties. | No |
| getDebugInfo | Specifies when the Spark log files are copied to the Azure storage used by HDInsight cluster (or) specified by sparkJobLinkedService. Allowed values: None, Always, or Failure. Default value: None. | No |
| sparkJobLinkedService | The Azure Storage linked service that holds the Spark job file, dependencies, and logs.  If you do not specify a value for this property, the storage associated with HDInsight cluster is used. | No |

### JSON example

```json
{
    "name": "SparkPipeline",
    "properties": {
        "activities": [
            {
                "type": "HDInsightSpark",
                "typeProperties": {
                    "rootPath": "adfspark\\pyFiles",
                    "entryFilePath": "test.py",
                	"getDebugInfo": "Always"
                },
                "outputs": [
                    {
                        "name": "OutputDataset"
                    }
                ],
                "name": "MySparkActivity",
                "linkedServiceName": "HDInsightLinkedService"
            }
        ],
        "start": "2017-02-05T00:00:00",
        "end": "2017-02-06T00:00:00"
    }
}
```
Note the following points:

- The **type** property is set to **HDInsightSpark**.
- The **rootPath** is set to **adfspark\\pyFiles** where adfspark is the Azure Blob container and pyFiles is fine folder in that container. In this example, the Azure Blob Storage is the one that is associated with the Spark cluster. You can upload the file to a different Azure Storage. If you do so, create an Azure Storage linked service to link that storage account to the data factory. Then, specify the name of the linked service as a value for the **sparkJobLinkedService** property. See Spark Activity properties for details about this property and other properties supported by the Spark Activity.
- The **entryFilePath** is set to the **test.py**, which is the python file.
- The **getDebugInfo** property is set to **Always**, which means the log files are always generated (success or failure).

	> [!IMPORTANT]
	> We recommend that you do not set this property to Always in a production environment unless you are troubleshooting an issue.
- The **outputs** section has one output dataset. You must specify an output dataset even if the spark program does not produce any output. The output dataset drives the schedule for the pipeline (hourly, daily, etc.).

For more information about the activity, see [Spark Activity](data-factory-spark.md) article.

## Machine Learning Batch Execution Activity
You can specify the following properties in an Azure Machine Learning studio Batch Execution Activity JSON definition. The type property for the activity must be: **AzureMLBatchExecution**. You must create an Azure Machine Learning linked service first and specify the name of it as a value for the **linkedServiceName** property. The following properties are supported in the **typeProperties** section when you set the type of activity to AzureMLBatchExecution:

Property | Description | Required
-------- | ----------- | --------
webServiceInput | The dataset to be passed as an input for the Azure Machine Learning studio web service. This dataset must also be included in the inputs for the activity. |Use either webServiceInput or webServiceInputs. |
webServiceInputs | Specify datasets to be passed as inputs for the Azure Machine Learning studio web service. If the web service takes multiple inputs, use the webServiceInputs property instead of using the webServiceInput property. Datasets that are referenced by the **webServiceInputs** must also be included in the Activity **inputs**. | Use either webServiceInput or webServiceInputs. |
webServiceOutputs | The datasets that are assigned as outputs for the Azure Machine Learning studio web service. The web service returns output data in this dataset. | Yes |
globalParameters | Specify values for the web service parameters in this section. | No |

### JSON example
In this example, the activity has the dataset **MLSqlInput** as input and **MLSqlOutput** as the output. The **MLSqlInput** is passed as an input to the web service by using the **webServiceInput** JSON property. The **MLSqlOutput** is passed as an output to the Web service by using the **webServiceOutputs** JSON property.

```json
{
   "name": "MLWithSqlReaderSqlWriter",
   "properties": {
      "description": "Azure ML model with sql azure reader/writer",
      "activities": [{
         "name": "MLSqlReaderSqlWriterActivity",
         "type": "AzureMLBatchExecution",
         "description": "test",
         "inputs": [ { "name": "MLSqlInput" }],
         "outputs": [ { "name": "MLSqlOutput" } ],
         "linkedServiceName": "MLSqlReaderSqlWriterDecisionTreeModel",
         "typeProperties":
         {
            "webServiceInput": "MLSqlInput",
            "webServiceOutputs": {
               "output1": "MLSqlOutput"
            },
            "globalParameters": {
               "Database server name": "<myserver>.database.windows.net",
               "Database name": "<database>",
               "Server user account name": "<user name>",
               "Server user account password": "<password>"
            }
         },
         "policy": {
            "concurrency": 1,
            "executionPriorityOrder": "NewestFirst",
            "retry": 1,
            "timeout": "02:00:00"
         }
      }],
      "start": "2016-02-13T00:00:00",
       "end": "2016-02-14T00:00:00"
   }
}
```

In the JSON example, the deployed Azure Machine Learning Web service uses a reader and a writer module to read/write data from/to an Azure SQL Database. This Web service exposes the following four parameters:  Database server name, Database name, Server user account name, and Server user account password.

> [!NOTE]
> Only inputs and outputs of the AzureMLBatchExecution activity can be passed as parameters to the Web service. For example, in the above JSON snippet, MLSqlInput is an input to the AzureMLBatchExecution activity, which is passed as an input to the Web service via webServiceInput parameter.

## Machine Learning Update Resource Activity
You can specify the following properties in an Azure Machine Learning studio Update Resource Activity JSON definition. The type property for the activity must be: **AzureMLUpdateResource**. You must create an Azure Machine Learning linked service first and specify the name of it as a value for the **linkedServiceName** property. The following properties are supported in the **typeProperties** section when you set the type of activity to AzureMLUpdateResource:

Property | Description | Required
-------- | ----------- | --------
trainedModelName | Name of the retrained model. | Yes |
trainedModelDatasetName | Dataset pointing to the iLearner file returned by the retraining operation. | Yes |

### JSON example
The pipeline has two activities: **AzureMLBatchExecution** and **AzureMLUpdateResource**. The Azure Machine Learning studio Batch Execution activity takes the training data as input and produces an iLearner file as an output. The activity invokes the training web service (training experiment exposed as a web service) with the input training data and receives the ilearner file from the webservice. The placeholderBlob is just a dummy output dataset that is required by the Azure Data Factory service to run the pipeline.


```json
{
    "name": "pipeline",
    "properties": {
        "activities": [
            {
                "name": "retraining",
                "type": "AzureMLBatchExecution",
                "inputs": [
                    {
                        "name": "trainingData"
                    }
                ],
                "outputs": [
                    {
                        "name": "trainedModelBlob"
                    }
                ],
                "typeProperties": {
                    "webServiceInput": "trainingData",
                    "webServiceOutputs": {
                        "output1": "trainedModelBlob"
                    }
                 },
                "linkedServiceName": "trainingEndpoint",
                "policy": {
                    "concurrency": 1,
                    "executionPriorityOrder": "NewestFirst",
                    "retry": 1,
                    "timeout": "02:00:00"
                }
            },
            {
                "type": "AzureMLUpdateResource",
                "typeProperties": {
                    "trainedModelName": "trained model",
                    "trainedModelDatasetName" :  "trainedModelBlob"
                },
                "inputs": [{ "name": "trainedModelBlob" }],
                "outputs": [{ "name": "placeholderBlob" }],
                "policy": {
                    "timeout": "01:00:00",
                    "concurrency": 1,
                    "retry": 3
                },
                "name": "AzureML Update Resource",
                "linkedServiceName": "updatableScoringEndpoint2"
            }
        ],
        "start": "2016-02-13T00:00:00",
		"end": "2016-02-14T00:00:00"
    }
}
```

## Data Lake Analytics U-SQL Activity
You can specify the following properties in a U-SQL Activity JSON definition. The type property for the activity must be: **DataLakeAnalyticsU-SQL**. You must create an Azure Data Lake Analytics linked service and specify the name of it as a value for the **linkedServiceName** property. The following properties are supported in the **typeProperties** section when you set the type of activity to DataLakeAnalyticsU-SQL:

| Property | Description | Required |
|:--- |:--- |:--- |
| scriptPath |Path to folder that contains the U-SQL script. Name of the file is case-sensitive. |No (if you use script) |
| scriptLinkedService |Linked service that links the storage that contains the script to the data factory |No (if you use script) |
| script |Specify inline script instead of specifying scriptPath and scriptLinkedService. For example: "script": "CREATE DATABASE test". |No (if you use scriptPath and scriptLinkedService) |
| degreeOfParallelism |The maximum number of nodes simultaneously used to run the job. |No |
| priority |Determines which jobs out of all that are queued should be selected to run first. The lower the number, the higher the priority. |No |
| parameters |Parameters for the U-SQL script |No |

### JSON example

```json
{
    "name": "ComputeEventsByRegionPipeline",
    "properties": {
        "description": "This pipeline computes events for en-gb locale and date less than Feb 19, 2012.",
        "activities":
        [
            {
                "type": "DataLakeAnalyticsU-SQL",
                "typeProperties": {
                    "scriptPath": "scripts\\kona\\SearchLogProcessing.txt",
                    "scriptLinkedService": "StorageLinkedService",
                    "degreeOfParallelism": 3,
                    "priority": 100,
                    "parameters": {
                        "in": "/datalake/input/SearchLog.tsv",
                        "out": "/datalake/output/Result.tsv"
                    }
                },
                "inputs": [
                    {
                        "name": "DataLakeTable"
                    }
                ],
                "outputs":
                [
                    {
                        "name": "EventsByRegionTable"
                    }
                ],
                "policy": {
                    "timeout": "06:00:00",
                    "concurrency": 1,
                    "executionPriorityOrder": "NewestFirst",
                    "retry": 1
                },
                "scheduler": {
                    "frequency": "Day",
                    "interval": 1
                },
                "name": "EventsByRegion",
                "linkedServiceName": "AzureDataLakeAnalyticsLinkedService"
            }
        ],
        "start": "2015-08-08T00:00:00",
        "end": "2015-08-08T01:00:00",
        "isPaused": false
    }
}
```

For more information, see [Data Lake Analytics U-SQL Activity](data-factory-usql-activity.md).

## Stored Procedure Activity
You can specify the following properties in a Stored Procedure Activity JSON definition. The type property for the activity must be: **SqlServerStoredProcedure**. You must create an one of the following linked services and specify the name of the linked service as a value for the **linkedServiceName** property:

- SQL Server
- Azure SQL Database
- Azure SQL Data Warehouse

The following properties are supported in the **typeProperties** section when you set the type of activity to SqlServerStoredProcedure:

| Property | Description | Required |
| --- | --- | --- |
| storedProcedureName |Specify the name of the stored procedure in Azure SQL Database or Azure SQL Data Warehouse that is represented by the linked service that the output table uses. |Yes |
| storedProcedureParameters |Specify values for stored procedure parameters. If you need to pass null for a parameter, use the syntax: "param1": null (all lower case). See the following sample to learn about using this property. |No |

If you do specify an input dataset, it must be available (in ‘Ready’ status) for the stored procedure activity to run. The input dataset cannot be consumed in the stored procedure as a parameter. It is only used to check the dependency before starting the stored procedure activity. You must specify an output dataset for a stored procedure activity.

Output dataset specifies the **schedule** for the stored procedure activity (hourly, weekly, monthly, etc.). The output dataset must use a **linked service** that refers to an Azure SQL Database or an Azure SQL Data Warehouse or a SQL Server Database in which you want the stored procedure to run. The output dataset can serve as a way to pass the result of the stored procedure for subsequent processing by another activity ([chaining activities](data-factory-scheduling-and-execution.md#multiple-activities-in-a-pipeline)) in the pipeline. However, Data Factory does not automatically write the output of a stored procedure to this dataset. It is the stored procedure that writes to a SQL table that the output dataset points to. In some cases, the output dataset can be a **dummy dataset**, which is used only to specify the schedule for running the stored procedure activity.

### JSON example

```json
{
    "name": "SprocActivitySamplePipeline",
    "properties": {
        "activities": [
            {
                "type": "SqlServerStoredProcedure",
                "typeProperties": {
                    "storedProcedureName": "usp_sample",
                    "storedProcedureParameters": {
                        "DateTime": "$$Text.Format('{0:yyyy-MM-dd HH:mm:ss}', SliceStart)"
                    }
                },
                "outputs": [{ "name": "sprocsampleout" }],
                "name": "SprocActivitySample"
            }
        ],
         "start": "2016-08-02T00:00:00",
         "end": "2016-08-02T05:00:00",
        "isPaused": false
    }
}
```

For more information, see [Stored Procedure Activity](data-factory-stored-proc-activity.md) article.

## .NET custom activity
You can specify the following properties in a .NET custom activity JSON definition. The type property for the activity must be: **DotNetActivity**. You must create an Azure HDInsight linked service or an Azure Batch linked service, and specify the name of the linked service as a value for the **linkedServiceName** property. The following properties are supported in the **typeProperties** section when you set the type of activity to DotNetActivity:

| Property | Description | Required |
|:--- |:--- |:--- |
| AssemblyName | Name of the assembly. In the example, it is: **MyDotnetActivity.dll**. | Yes |
| EntryPoint |Name of the class that implements the IDotNetActivity interface. In the example, it is: **MyDotNetActivityNS.MyDotNetActivity** where MyDotNetActivityNS is the namespace and MyDotNetActivity is the class.  | Yes |
| PackageLinkedService | Name of the Azure Storage linked service that points to the blob storage that contains the custom activity zip file. In the example, it is: **AzureStorageLinkedService**.| Yes |
| PackageFile | Name of the zip file. In the example, it is: **customactivitycontainer/MyDotNetActivity.zip**. | Yes |
| extendedProperties | Extended properties that you can define and pass on to the .NET code. In this example, the **SliceStart** variable is set to a value based on the SliceStart system variable. | No |

### JSON example

```json
{
  "name": "ADFTutorialPipelineCustom",
  "properties": {
    "description": "Use custom activity",
    "activities": [
      {
        "Name": "MyDotNetActivity",
        "Type": "DotNetActivity",
        "Inputs": [
          {
            "Name": "InputDataset"
          }
        ],
        "Outputs": [
          {
            "Name": "OutputDataset"
          }
        ],
        "LinkedServiceName": "AzureBatchLinkedService",
        "typeProperties": {
          "AssemblyName": "MyDotNetActivity.dll",
          "EntryPoint": "MyDotNetActivityNS.MyDotNetActivity",
          "PackageLinkedService": "AzureStorageLinkedService",
          "PackageFile": "customactivitycontainer/MyDotNetActivity.zip",
          "extendedProperties": {
            "SliceStart": "$$Text.Format('{0:yyyyMMddHH-mm}', Time.AddMinutes(SliceStart, 0))"
          }
        },
        "Policy": {
          "Concurrency": 2,
          "ExecutionPriorityOrder": "OldestFirst",
          "Retry": 3,
          "Timeout": "00:30:00",
          "Delay": "00:00:00"
        }
      }
    ],
    "start": "2016-11-16T00:00:00",
    "end": "2016-11-16T05:00:00",
    "isPaused": false
  }
}
```

For detailed information, see [Use custom activities in Data Factory](data-factory-use-custom-activities.md) article.

## Next Steps
See the following tutorials:

- [Tutorial: create a pipeline with a copy activity](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md)
- [Tutorial: create a pipeline with a hive activity](data-factory-build-your-first-pipeline.md)
