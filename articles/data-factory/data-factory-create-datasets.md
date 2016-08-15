<properties 
	pageTitle="Datasets in Azure Data Factory | Microsoft Azure" 
	description="Understand Azure Data Factory datasets and learn how to create them." 
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
	ms.date="04/06/2016" 
	ms.author="spelluru"/>

# Datasets in Azure Data Factory
Datasets are named references/pointers to the data you want to use as an input or an output of an activity in a Data Factory pipeline. Datasets identify data structures within different data stores including tables, files, folders, and documents. After you create datasets, you can use them with activities in the pipeline. For example, you can have a dataset as an input/output dataset of a Copy Activity/HDInsightHive Activity. Typical steps in creating an Azure data factory are: 

1. Create a data factory
2. Create linked services
3. Create datasets
4. Create a pipeline with activities that consume/produce datasets

> [AZURE.NOTE] For an overview of Azure Data Factory service, see [Introduction to Azure Data Factory](data-factory-introduction.md).

## Overview
**Linked services** in Data Factory defines the information needed for Data Factory to **connect** to external resources.  Linked services are used for two purposes in Data Factory:

- To represent a **data store** including, but not limited to, an on-premises SQL Server database, Oracle database, file share or an Azure Blob Storage account. 
- To represent a **compute resource** that can host execution of an activity.  For example, the **HDInsightHive Activity** runs on an HDInsight Hadoop cluster.

A **data store linked service** defines the mechanism (address, protocol, authentication scheme, etc...) to access the data store and **dataset** represents the data within this data store to be used as input or output of an activity.  

## Syntax
A dataset in Azure Data Factory is defined as follows: 


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

The following table describes properties in the above JSON:   

| Property | Description | Required | Default |
| -------- | ----------- | -------- | ------- |
| name | Name of the dataset | Yes | NA |
| type | Type of the dataset | Yes | NA |
| structure | Schema of the dataset<br/><br/>See [Dataset Structure](#Structure) section for more details | No. | NA |
| typeProperties | Properties corresponding to the selected type. See [Dataset Type](#Type) section for details on the supported types and their properties. | Yes | NA |
| external | Boolean flag to specify whether a dataset is explicitly produced by a data factory pipeline or not.  | No | false | 
| availability | Defines the processing window or the slicing model for the dataset production. <br/><br/>See [Dataset Availability](#Availability) topic for more details<br/><br/>See [Scheduling and Execution](data-factory-scheduling-and-execution.md) article for more details on the dataset slicing model | Yes | NA
| policy | Defines the criteria or the condition that the dataset slices must fulfill. <br/><br/>See [Dataset Policy](#Policy) topic for more details | No | NA |

### Example

Below is an example of a dataset representing a table named **MyTable** in an **Azure SQL database**. The Azure SQL database connection strings are defined in the **AzureSqlLinkedService** referenced in this dataset. This dataset is sliced daily.  

	{
	    "name": "DatasetSample",
	    "properties": {
	        "type": "AzureSqlTable",
	        "linkedServiceName": "AzureSqlLinkedService",
	        "typeProperties": 
	        {
	            "tableName": "MyTable"
	        },
	        "availability": 
	        {
	            "frequency": "Day",
	            "interval": 1
	        }
	    }
	}

AzureSqlLinkedService is defined as follows:

	{
	    "name": "AzureSqlLinkedService",
	    "properties": {
	        "type": "AzureSqlDatabase",
	        "description": "",
	        "typeProperties": {
	            "connectionString": "Data Source=tcp:<servername>.database.windows.net,1433;Initial Catalog=<databasename>;User ID=<username>@<servername>;Password=<password>;Integrated Security=False;Encrypt=True;Connect Timeout=30"
	        }
	    }
	}

As you can see, the linked service defines how to connect to an Azure SQL database and the dataset defines what table is used as an input/output in your data factory. The activity section in your pipeline JSON specifies whether the dataset is used as an input or output dataset. For an input dataset, you should set "external" property to "true" unless the dataset is produced by Data Factory.  

## <a name="Type"></a> Dataset Type
The supported data sources and dataset types are aligned. See topics referenced in the [Data Movement Activities](data-factory-data-movement-activities.md#supported-data-stores) article for information on types and configuration of datasets. For example, if you are using data from an Azure SQL database, click Azure SQL Database in the list of  supported data stores to see detailed information on how to use Azure SQL Database as a source or sink data store.  

## <a name="Structure"></a>Dataset Structure
The **structure** section defines the schema of the dataset. It contains a collection of names and data types of columns.  In the following example, the dataset has three columns slicetimestamp, projectname, and pageviews and they are of type: String, String, and Decimal respectively.

	structure:  
	[ 
	    { "name": "slicetimestamp", "type": "String"},
	    { "name": "projectname", "type": "String"},
	    { "name": "pageviews", "type": "Decimal"}
	]

## <a name="Availability"></a> Dataset Availability
The **availability** section in a dataset defines the processing window (hourly, daily, weekly etc...) or the slicing model for the dataset. See [Scheduling and Execution](data-factory-scheduling-and-execution.md) article for more details on the dataset slicing and dependency model. 

The availability section below specifies that the dataset is either produced hourly in case of an output dataset (or) available hourly in case of input dataset. 

	"availability":	
	{	
		"frequency": "Hour",		
		"interval": "1",	
	}

The following table describes properties you can use in the availability section. 

| Property | Description | Required | Default |
| -------- | ----------- | -------- | ------- |
| frequency | Specifies the time unit for dataset slice production.<br/><br/>**Supported frequency**: Minute, Hour, Day, Week, Month | Yes | NA |
| interval | Specifies a multiplier for frequency<br/><br/>”Frequency x interval” determines how often the slice is produced.<br/><br/>If you need the dataset to be sliced on an hourly basis, you set **Frequency** to **Hour**, and **interval** to **1**.<br/><br/>**Note:** If you specify Frequency as Minute, we recommend that you set the interval to no less than 15 | Yes | NA |
| style | Specifies whether the slice should be produced at the start/end of the interval.<ul><li>StartOfInterval</li><li>EndOfInterval</li></ul><br/><br/>If Frequency is set to Month and style is set to EndOfInterval, the slice is produced on the last day of month. If the style is set to StartOfInterval, the slice is produced on the first day of month.<br/><br/>If Frequency is set to Day and style is set to EndOfInterval, the slice is produced in the last hour of the day.<br/><br/>If Frequency is set to Hour and style is set to EndOfInterval, the slice is produced at the end of the hour. For example, for a slice for 1 PM – 2 PM period, the slice is produced at 2 PM. | No | EndOfInterval |
| anchorDateTime | Defines the absolute position in time used by scheduler to compute dataset slice boundaries. <br/><br/>**Note:** If the AnchorDateTime has date parts that are more granular than the frequency then the more granular parts will be ignored. <br/><br/>For example, if the **interval** is **hourly** (frequency: hour and interval: 1) and the **AnchorDateTime** contains **minutes and seconds**, then the **minutes and seconds** parts of the AnchorDateTime will be ignored. | No | 01/01/0001 |
| offset | Timespan by which the start and end of all dataset slices are shifted. <br/><br/>**Note:** If both anchorDateTime and offset are specified, the result is the combined shift. | No | NA |

### offset example

Daily slices that start at 6 AM instead of the default midnight. 

	"availability":
	{
		"frequency": "Day",
		"interval": "1",
		"offset": "06:00:00"
	}

The **frequency** is set to **Month** and **interval** is set to **1** (once a month): 
If you want the slice to be produced on 9th day of each month at 6 AM, set offset to "09.06:00:00". Remember that this is an UTC time. 

For a 12 month (frequency = month; interval = 12) schedule, offset: 60.00:00:00 means every year on March 1st or 2nd (60 days from the beginning of the year if style =  StartOfInterval), depending on the year being leap year or not.

### anchorDateTime example

**Example:** 23 hours dataset slices that starts on 2007-04-19T08:00:00

	"availability":	
	{	
		"frequency": "Hour",		
		"interval": "23",	
		"anchorDateTime":"2007-04-19T08:00:00"	
	}

### offset/style Example

If you need to run a pipeline on monthly basis on specific date and time (suppose on 3rd of every month at 8:00 AM), you could use the **offset** tag to set the date and time it should run. 

	{
	  "name": "MyDataset",
	  "properties": {
	    "type": "AzureSqlTable",
	    "linkedServiceName": "AzureSqlLinkedService",
	    "typeProperties": {
	      "tableName": "MyTable"
	    },
	    "availability": {
	      "frequency": "Month",
	      "interval": 1,
	      "offset": "3.08:10:00",
	      "style": "StartOfInterval"
	    }
	  }
	}


## <a name="Policy"></a>Dataset Policy

The **policy** section in dataset definition defines the criteria or the condition that the dataset slices must fulfill.

### Validation policies

| Policy Name | Description | Applied To | Required | Default |
| ----------- | ----------- | ---------- | -------- | ------- |
| minimumSizeMB | Validates that the data in an **Azure blob** meets the minimum size requirements (in megabytes). | Azure Blob | No | NA |
|minimumRows | Validates that the data in an **Azure SQL database** or an **Azure table** contains the minimum number of rows. | <ul><li>Azure SQL Database</li><li>Azure Table</li></ul> | No | NA

#### Examples

**minimumSizeMB:**

	"policy":
	
	{
	    "validation":
	    {
	        "minimumSizeMB": 10.0
	    }
	}

**minimumRows**

	"policy":
	{
		"validation":
		{
			"minimumRows": 100
		}
	}

### External datasets

External datasets are the ones that are not produced by a running pipeline in the data factory. If the dataset is marked as **external**, the **ExternalData** policy may be defined to influence the behavior of the dataset slice availability. 

Unless a dataset is being produced by Azure Data Factory, it should be marked as **external**. This would generally apply to the input(s) of first activity in a pipeline unless activity or pipeline chaining is being leveraged. 

| Name | Description | Required | Default Value  |
| ---- | ----------- | -------- | -------------- |
| dataDelay | Time to delay the check on the availability of the external data for the given slice. For example, if the data is supposed to be available hourly, the check to see the external data is actually available and the corresponding slice is Ready can be delayed by dataDelay.<br/><br/>Only applies to the present time; for example, if it is 1:00 PM right now and this value is 10 minutes, the validation will start at 1:10 PM.<br/><br/>This setting does not affect slices in the past (slices with Slice End Time + dataDelay < Now) will be processed without any delay.<br/><br/>Time greater than 23:59 hours need to specified using the day.hours:minutes:seconds format. For example, to specify 24 hours, don't use 24:00:00; instead, use 1.00:00:00. If you use 24:00:00, it will be treated as 24 days (24.00:00:00). For 1 day and 4 hours, specify 1:04:00:00. | No | 0 |
| retryInterval | The wait time between a failure and the next retry attempt. Applies to present time; if the previous try failed, we wait this long after the last try. <br/><br/>If it is 1:00pm right now, we will begin the first try. If the duration to complete the first validation check is 1 minute and the operation failed, the next retry will be at 1:00 + 1min (duration) + 1min (retry interval) = 1:02pm. <br/><br/>For slices in the past, there will be no delay. The retry will happen immediately. | No | 00:01:00 (1 minute) | 
| retryTimeout | The timeout for each retry attempt.<br/><br/>If this is set to 10 minutes, the validation needs to be completed within 10 minutes. If it takes longer than 10 minutes to perform the validation, the retry will time out.<br/><br/>If all attempts for the validation times out, the slice will be marked as TimedOut. | No | 00:10:00 (10 minutes) |
| maximumRetry | Number of times to check for the availability of the external data. The allowed maximum value is 10. | No | 3 | 

