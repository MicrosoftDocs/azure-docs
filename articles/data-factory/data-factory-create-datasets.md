<properties 
	pageTitle="Creating datasets" 
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
	ms.date="10/05/2015" 
	ms.author="spelluru"/>

# Datasets

## Description
A Dataset is a logical description of the data. The data being described can vary from simple bytes, semi-structured data like CSV files all the way up to relational tables or even models. The mechanism (address, protocol, authentication scheme) to access the data is defined in the Linked Service and referenced in the dataset definition.

## Syntax

	{
	    "name": "<name of dataset>",
	    "properties":
	    {
	       "structure": [ ],
	       "type": "<type of dataset>",
			"external": <boolean flag to indicate external data>,
	        "typeProperties":
	        {
	        },
	        "availability":
	        {
	
	        },
	       "policy": 
	        {      
	
	        }
	    }
	}

**Syntax details**

| Property | Description | Required | Default |
| -------- | ----------- | -------- | ------- |
| name | Name of the dataset | Yes | NA |
| structure | <p>Schema of the dataset</p><p>See [Dataset Structure](#Structure) section for more details</p> | No. | NA |
| type | Type of the dataset | Yes | NA |
| typeProperties | <p>Properties corresponding to the selected type</p><p>See [Dataset Type](#Type) section for details on the supported types and their properties.</p> | Yes | NA |
| external | Boolean flag to specify whether a dataset is explicitly produced by a data factory pipeline or not  | No | false | 
| availability | <p>Defines the processing window or the slicing model for the dataset production. </p><p>See [Dataset Availability](#Availability) topic for more details</p><p>See [Scheduling and Execution](data-factory-scheduling-and-execution.md) article for more details on the dataset slicing model</p> | Yes | NA
| policy | Defines the criteria or the condition that the dataset slices must fulfill. <p>See [Dataset Policy](#Policy) topic for more details</p> | No | NA |

### Example

Below is an example of a dataset representing a table named **MyTable** in **Azure SQL database**. The Azure SQL database connection strings are defined in the **AzureSqlLinkedService** referenced in this dataset. This dataset is sliced daily.  

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

## <a name="Structure"></a>Dataset Structure

The **Structure** section asserts the schema of the dataset. It contains the collection of the columns and the type of these columns. Each column contains the following properties:

Property | Description | Required | Default  
-------- | ----------- | -------- | -------
name | Name of the column | No | NA 
type | Data type of the column | No | NA 

### Example

In the following example, the dataset has three columns slicetimestamp, projectname, and pageviews.

	structure:  
	[ 
	    { "name": "slicetimestamp", "type": "String"},
	    { "name": "projectname", "type": "String"},
	    { "name": "pageviews", "type": "Decimal"}
	]

## <a name="Type"></a> Dataset Type

The supported data sources and the dataset types are aligned. See the connector topics referenced in the [Data Movement Activities](data-factory-data-movement-activities.md) article for information on the types and configuration of datasets. 

## <a name="Availability"></a> Dataset Availability

The Availability section in a dataset defines the processing window or the slicing model for the dataset production. See [Scheduling and Execution](data-factory-scheduling-and-execution.md) article for more details on the dataset slicing and dependency model. 

| Property | Description | Required | Default |
| -------- | ----------- | -------- | ------- |
| frequency | Specifies the time unit for dataset slice production.<p>**Supported frequency**: Minute, Hour, Day, Week, Month</p> | Yes | NA |
| interval | Specifies a multiplier for frequency<p>”Frequency x interval” determines how often the slice is produced.</p><p>If you need the dataset to be sliced on an hourly basis, you set **Frequency** to **Hour**, and **interval** to **1**.</p><p>**Note:** If you specify Frequency as Minute, we recommend that you set the interval to no less than 15</p> | Yes | NA |
| style | Specifies whether the slice should be produced at the start/end of the interval.<ul><li>StartOfInterval</li><li>EndOfInterval</li></ul><p>If Frequency is set to Month and style is set to EndOfInterval, the slice is produced on the last day of month. If the style is set to StartOfInterval, the slice is produced on the first day of month.</p><p>If Frequency is set to Day and style is set to EndOfInterval, the slice is produced in the last hour of the day.</p>If Frequency is set to Hour and style is set to EndOfInterval, the slice is produced at the end of the hour. For example, for a slice for 1 PM – 2 PM period, the slice is produced at 2 PM.</p> | No | EndOfInterval |
| anchorDateTime | Defines the absolute position in time used by scheduler to compute dataset slice boundaries. <p>**Note:** If the AnchorDateTime has date parts that are more granular than the frequency then the more granular parts will be ignored. For example, if the **interval** is **hourly** (frequency: hour and interval: 1) and the **AnchorDateTime** contains **minutes and seconds**, then the **minutes and seconds** parts of the AnchorDateTime will be ignored. </p>| No | 01/01/0001 |
| offset | Timespan by which the start and end of all dataset slices are shifted. <p>**Note:** If both anchorDateTime and offset are specified, the result is the combined shift.</p> | No | NA |

### anchorDateTime examples

**Example:** 23 hours dataset slices that starts on 2007-04-19T08:00:00

	"availability":	
	{	
		"frequency": "Hour",		
		"interval": "23",	
		"anchorDateTime":"2007-04-19T08:00:00"	
	}


### offset example

Daily slices that starts at 6 AM instead of the default midnight. 

	"availability":
	{
		"frequency": "Daily",
		"interval": "1",
		"offset": "06:00:00"
	}

In this case, SliceStart is shifted by 6 hours and will be 6 AM.

For a 12 month (frequency = month; interval = 12) schedule, offset: 60.00:00:00 means every year on March 2nd or 3rd (60 days from the beginning of the year if style =  StartOfInterval), depending on the year being leap year or not.



## <a name="Policy"></a>Dataset Policy

The Policy section in the dataset defines the criteria or the condition that the dataset slices must fulfill.

### Validation policies

| Policy Name | Description | Applied To | Required | Default |
| ----------- | ----------- | ---------- | -------- | ------- |
| minimumSizeMB | Validates that the data in an Azure blob meets the minimum size requirements (in megabytes). | Azure Blob | No | NA |
|minimumRows | Validates that the data in an Azure SQL database or an Azure table contains the minimum number of rows. | <ul><li>Azure SQL Database</li><li>Azure Table</li></ul> | No | NA

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

### ExternalData policies

External datasets are ones that are not produced by a running pipeline in the data factory. If the dataset is marked as External, the ExternalData policy may be defined to influence the behavior of the dataset slice availability. 

| Name | Description | Required | Default Value  |
| ---- | ----------- | -------- | -------------- |
| dataDelay | <p>Time to delay the check on the availability of the external data for the given slice. For example, if the data is supposed to be available hourly, the check to see the external data is actually available and the corresponding slice is Ready can be delayed by dataDelay.</p><p>Only applies to the present time; for example, if it is 1:00 PM right now and this value is 10 minutes, the validation will start at 1:10 PM.</p><p>This setting does not affect slices in the past (slices with Slice End Time + dataDelay < Now) will be processed without any delay.</p> <p>Time greater than 23:59 hours need to specified using the day.hours:minutes:seconds format. For example, to specify 24 hours, don't use 24:00:00; instead, use 1.00:00:00. If you use 24:00:00, it will be treated as 24 days (24.00:00:00). For 1 day and 4 hours, specify 1:04:00:00. </p>| No | 0 |
| retryInterval | The wait time between a failure and the next retry attempt. Applies to present time; if the previous try failed, we wait this long after the last try. <p>If it is 1:00pm right now, we will begin the first try. If the duration to complete the first validation check is 1 minute and the operation failed, the next retry will be at 1:00 + 1min (duration) + 1min (retry interval) = 1:02pm. </p><p>For slices in the past, there will be no delay. The retry will happen immediately.</p> | No | 00:01:00 (1 minute) | 
| retryTimeout | The timeout for each retry attempt.<p>If this is set to 10 minutes, the validation needs to be completed within 10 minutes. If it takes longer than 10 minutes to perform the validation, the retry will time out.</p><p>If all attempts for the validation times out, the slice will be marked as TimedOut.</p> | No | 00:10:00 (10 minutes) |
| maximumRetry | Number of times to check for the availability of the external data. The allowed maximum value is 10. | No | 3 | 

#### More examples

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

## Send Feedback
We would really appreciate your feedback on this article. Please take a few minutes to submit your feedback via [email](mailto:adfdocfeedback@microsoft.com?subject=data-factory-create-datasets.md). 





  









