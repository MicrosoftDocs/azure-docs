<properties
	pageTitle="Scheduling and Execution with Data Factory | Microsoft Azure"
	description="Learn scheduling and execution aspects of Azure Data Factory application model."
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
	ms.date="08/22/2016"
	ms.author="spelluru"/>

# Data Factory scheduling and execution

This article explains the scheduling and execution aspects of the Azure Data Factory application model. This article builds on [Creating pipelines](data-factory-create-pipelines.md) and [Creating datasets](data-factory-create-datasets.md). It assumes that you understand basics of Data Factory application model concepts, including activity, pipelines, linked services, and datasets.

## Schedule an activity

With the scheduler section of the activity JSON, you can specify a recurring schedule for an activity. For example, you can schedule an activity every hour as follows:

	"scheduler": {
		"frequency": "Hour",
	    "interval": 1
	},  

![Scheduler example](./media/data-factory-scheduling-and-execution/scheduler-example.png)

As shown in the diagram, specifying a schedule for the activity creates a series of tumbling windows. Tumbling windows are a series of fixed-size, non-overlapping, contiguous time intervals. These logical tumbling windows for the activity are called *activity windows*.

For the currently executing activity window, you can access the time interval associated with the activity window with [WindowStart](data-factory-functions-variables.md#data-factory-system-variables) and [WindowEnd](data-factory-functions-variables.md#data-factory-system-variables) system variables in the activity JSON. You can use these variables for different purposes in your activity JSON. For example, you can use them to select data from input and output datasets representing time series data.

The **scheduler** property supports the same subproperties as the **availability** property in a dataset. See [Dataset availability](data-factory-create-datasets.md#Availability) for details. Examples: scheduling at a specific time offset, or setting the mode to align processing at the beginning or end of the interval for the activity window.

You can specify scheduler properties for an activity, but this is optional. If you do specify a property, it must match the cadence you specify in the output dataset definition. Currently, output dataset is what drives the schedule, so you must create an output dataset even if the activity does not produce any output. If the activity doesn't take any input, you can skip creating the input dataset.

## Time series datasets and data slices

Time series data is a continuous sequence of data points that typically consists of successive measurements made over a time interval. Common examples of time series data include sensor data and application telemetry data.

With Data Factory, you can process time series data in batched fashion with activity runs. Typically, there is a recurring cadence at which input data arrives and output data needs to be produced. This cadence is modeled by specifying **availability** in the dataset as follows:

    "availability": {
      "frequency": "Hour",
      "interval": 1
    },

Each unit of data consumed and produced by an activity run is called a data slice. The following diagram shows an example of an activity with one input dataset and one output dataset. These datasets have **availability** set to an hourly frequency.

![Availability scheduler](./media/data-factory-scheduling-and-execution/availability-scheduler.png)

The preceding diagram shows the hourly data slices for the input and output dataset. The diagram shows three input slices that are ready for processing. The 10-11 AM activity is in progress, producing the 10-11 AM output slice.

You can access the time interval associated with the current slice being produced in the dataset JSON with variables [SliceStart](data-factory-functions-variables.md#data-factory-system-variables) and [SliceEnd](data-factory-functions-variables.md#data-factory-system-variables).

Currently, Data Factory requires that the schedule specified in the activity exactly matches the schedule specified in **availability** of the output dataset. Therefore, **WindowStart**, **WindowEnd**, **SliceStart**, and **SliceEnd** always map to the same time period and a single output slice.

For more information on different properties available for the availability section, refer to [Creating datasets](data-factory-create-datasets.md).

## Move data from Azure SQL Database to Azure Blob storage with Copy Activity

Let’s put some things together and in action by creating a pipeline that copies data from an Azure SQL Database table to Azure Blob storage every hour.

**Input: Azure SQL Database dataset**

	{
	    "name": "AzureSqlInput",
	    "properties": {
	        "published": false,
	        "type": "AzureSqlTable",
	        "linkedServiceName": "AzureSqlLinkedService",
	        "typeProperties": {
	            "tableName": "MyTable"
	        },
	        "availability": {
	            "frequency": "Hour",
	            "interval": 1
	        },
	        "external": true,
	        "policy": {}
	    }
	}


**Frequency** is set to **Hour** and **interval** is set to **1** in the availability section.

**Output: Azure Blob storage dataset**

	{
	    "name": "AzureBlobOutput",
	    "properties": {
	        "published": false,
	        "type": "AzureBlob",
	        "linkedServiceName": "StorageLinkedService",
	        "typeProperties": {
	            "folderPath": "mypath/{Year}/{Month}/{Day}/{Hour}",
	            "format": {
	                "type": "TextFormat"
	            },
	            "partitionedBy": [
	                {
	                    "name": "Year",
	                    "value": {
	                        "type": "DateTime",
	                        "date": "SliceStart",
	                        "format": "yyyy"
	                    }
	                },
	                {
	                    "name": "Month",
	                    "value": {
	                        "type": "DateTime",
	                        "date": "SliceStart",
	                        "format": "%M"
	                    }
	                },
	                {
	                    "name": "Day",
	                    "value": {
	                        "type": "DateTime",
	                        "date": "SliceStart",
	                        "format": "%d"
	                    }
	                },
	                {
	                    "name": "Hour",
	                    "value": {
	                        "type": "DateTime",
	                        "date": "SliceStart",
	                        "format": "%H"
	                    }
	                }
	            ]
	        },
	        "availability": {
	            "frequency": "Hour",
	            "interval": 1
	        }
	    }
	}


**Frequency** is set to **Hour** and **interval** is set to **1** in the availability section.



**Activity: Copy Activity**

	{
	    "name": "SamplePipeline",
	    "properties": {
	        "description": "copy activity",
	        "activities": [
	            {
	                "type": "Copy",
	                "name": "AzureSQLtoBlob",
	                "description": "copy activity",
	                "typeProperties": {
	                    "source": {
	                        "type": "SqlSource",
	                        "sqlReaderQuery": "$$Text.Format('select * from MyTable where timestampcolumn >= \\'{0:yyyy-MM-dd HH:mm}\\' AND timestampcolumn < \\'{1:yyyy-MM-dd HH:mm}\\'', WindowStart, WindowEnd)"
	                    },
	                    "sink": {
	                        "type": "BlobSink",
	                        "writeBatchSize": 100000,
	                        "writeBatchTimeout": "00:05:00"
	                    }
	                },
	                "inputs": [
	                    {
	                        "name": "AzureSQLInput"
	                    }
	                ],
	                "outputs": [
	                    {
	                        "name": "AzureBlobOutput"
	                    }
	                ],
	       			"scheduler": {
	          			"frequency": "Hour",
	          			"interval": 1
	        		}
	            }
	        ],
	        "start": "2015-01-01T08:00:00Z",
	        "end": "2015-01-01T11:00:00Z"
	    }
	}


The sample shows the activity schedule and dataset availability sections set to an hourly frequency. The sample shows how you can use **WindowStart** and **WindowEnd** to select relevant data for an activity run and copy it to a blob with the appropriate **folderPath**. The **folderPath** is parameterized to have a separate folder for every hour.

When three of the slices between 8–11 AM execute, the data in Azure SQL Database is as follows:

![Sample input](./media/data-factory-scheduling-and-execution/sample-input-data.png)

After the pipeline deploys, the Azure blob is populated as follows:

-	File mypath/2015/1/1/8/Data.&lt;Guid&gt;.txt with data

			10002345,334,2,2015-01-01 08:24:00.3130000
			10002345,347,15,2015-01-01 08:24:00.6570000
			10991568,2,7,2015-01-01 08:56:34.5300000

	> [AZURE.NOTE] &lt;Guid&gt; is replaced with an actual guid. Example file name: Data.bcde1348-7620-4f93-bb89-0eed3455890b.txt
-	File mypath/2015/1/1/9/Data.&lt;Guid&gt;.txt with data:

			10002345,334,1,2015-01-01 09:13:00.3900000
			24379245,569,23,2015-01-01 09:25:00.3130000
			16777799,21,115,2015-01-01 09:47:34.3130000
-	File mypath/2015/1/1/10/Data.&lt;Guid&gt;.txt with no data.


## Create a data slice, set the active period for a pipeline, and execute slices concurrently

[Creating pipelines](data-factory-create-pipelines.md) introduced the concept of an active period for a pipeline specified by setting the **start** and **end** properties.

You can set the start date for the pipeline active period in the past. Data Factory automatically calculates (back fills) all data slices in the past and begins processing them.

You can configure back-filled data slices to be run in parallel. You can do this by setting the **concurrency** property in the policy section of the activity JSON as shown in [Creating pipelines](data-factory-create-pipelines.md).

## Rerun a failed data slice and track data dependency automatically

You can monitor execution of slices in a rich, visual way. See [Monitoring and managing pipelines using Azure portal blades](data-factory-monitor-manage-pipelines.md) or [Monitoring and Management app](data-factory-monitor-manage-app.md) for details.

Consider the following example, which shows two activities. Activity1 produces a time series dataset with slices as output that is consumed as input by Activity2 to produce the final output time series dataset.

![Failed slice](./media/data-factory-scheduling-and-execution/failed-slice.png)

<br/>

The diagram shows that out of three recent slices, there was a failure producing the 9-10 AM slice for Dataset2. Data Factory automatically tracks dependency for the time series dataset. As a result, it does not start the activity run for the 9-10 AM downstream slice.


Data Factory monitoring and management tools allow you to drill into the diagnostic logs for the failed slice to easily find the root cause for the issue and fix it. After you have fixed the issue, you can easily start the activity run to produce the failed slice. For more details on how to rerun and understand state transitions for data slices, see [Monitoring and managing pipelines using Azure portal blades](data-factory-monitor-manage-pipelines.md) or [Monitoring and Management app](data-factory-monitor-manage-app.md).

After you rerun the 9-10 AM slice for **Dataset2**, Data Factory starts the run for the 9-10 AM dependent slice on the final dataset.

![Rerun failed slice](./media/data-factory-scheduling-and-execution/rerun-failed-slice.png)

## Run activities in a sequence
You can chain two activities (run one activity after another) by setting the output dataset of one activity as the input dataset of the other activity. The activities can be in the same pipeline or in different pipelines. The second activity executes only when the first one finishes successfully.

For example, consider the following case:

1.	Pipeline P1 has Activity A1 that requires external input dataset D1, and produces output dataset D2.
2.	Pipeline P2 has Activity A2 that requires input from dataset D2, and produces output dataset D3.

In this scenario, activities A1 and A2 are in different pipelines. The activity A1 runs when the external data is available and the scheduled availability frequency is reached. The activity A2 runs when the scheduled slices from D2 become available and the scheduled availability frequency is reached. If there is an error in one of the slices in dataset D2, A2 does not run for that slice until it becomes available.

The Diagram view would look like the following diagram:

![Chaining activities in two pipelines](./media/data-factory-scheduling-and-execution/chaining-two-pipelines.png)

As mentioned earlier, the activities can be in the same pipeline. The Diagram view with both activities in the same pipeline would look like the following diagram:

![Chaining activities in the same pipeline](./media/data-factory-scheduling-and-execution/chaining-one-pipeline.png)

### Copy sequentially
It is possible to run multiple copy operations one after another in a sequential/ordered manner. For example, you might have two copy activities in a pipeline (CopyActivity1 and CopyActivity2) with the following input data output datasets.   

CopyActivity1

Input: Dataset. Output: Dataset2.

CopyActivity2

Input: Dataset2.  Output: Dataset3.

CopyActivity2 would run only if the CopyActivity1 has run successfully and Dataset2 is available.

Here is the sample pipeline JSON:

	{
		"name": "ChainActivities",
	    "properties": {
			"description": "Run activities in sequence",
	        "activities": [
	            {
	                "type": "Copy",
	                "typeProperties": {
	                    "source": {
	                        "type": "BlobSource"
	                    },
	                    "sink": {
	                        "type": "BlobSink",
	                        "copyBehavior": "PreserveHierarchy",
	                        "writeBatchSize": 0,
	                        "writeBatchTimeout": "00:00:00"
	                    }
	                },
	                "inputs": [
	                    {
	                        "name": "Dataset1"
	                    }
	                ],
	                "outputs": [
	                    {
	                        "name": "Dataset2"
	                    }
	                ],
	                "policy": {
	                    "timeout": "01:00:00"
	                },
	                "scheduler": {
	                    "frequency": "Hour",
	                    "interval": 1
	                },
	                "name": "CopyFromBlob1ToBlob2",
	                "description": "Copy data from a blob to another"
	            },
	            {
	                "type": "Copy",
	                "typeProperties": {
	                    "source": {
	                        "type": "BlobSource"
	                    },
	                    "sink": {
	                        "type": "BlobSink",
	                        "writeBatchSize": 0,
	                        "writeBatchTimeout": "00:00:00"
	                    }
	                },
	                "inputs": [
	                    {
	                        "name": "Dataset2"
	                    }
	                ],
	                "outputs": [
	                    {
	                        "name": "Dataset3"
	                    }
	                ],
	                "policy": {
	                    "timeout": "01:00:00"
	                },
	                "scheduler": {
	                    "frequency": "Hour",
	                    "interval": 1
	                },
	                "name": "CopyFromBlob2ToBlob3",
	                "description": "Copy data from a blob to another"
	            }
	        ],
	        "start": "2016-08-25T01:00:00Z",
	        "end": "2016-08-25T01:00:00Z",
	        "isPaused": false
	    }
	}

Notice that in the example, the output dataset of the first copy activity (Dataset2) is specified as input for the second activity. Therefore, the second activity runs only when the output dataset from the first activity is ready.  

In the example, CopyActivity2 can have a different input, such as Dataset3, but you specify Dataset2 as an input to CopyActivity2, so the activity does not run until CopyActivity1 finishes. For example:

CopyActivity1

Input: Dataset1. Output: Dataset2.

CopyActivity2

Inputs: Dataset3, Dataset2. Output: Dataset4.

	{
		"name": "ChainActivities",
	    "properties": {
			"description": "Run activities in sequence",
	        "activities": [
	            {
	                "type": "Copy",
	                "typeProperties": {
	                    "source": {
	                        "type": "BlobSource"
	                    },
	                    "sink": {
	                        "type": "BlobSink",
	                        "copyBehavior": "PreserveHierarchy",
	                        "writeBatchSize": 0,
	                        "writeBatchTimeout": "00:00:00"
	                    }
	                },
	                "inputs": [
	                    {
	                        "name": "Dataset1"
	                    }
	                ],
	                "outputs": [
	                    {
	                        "name": "Dataset2"
	                    }
	                ],
	                "policy": {
	                    "timeout": "01:00:00"
	                },
	                "scheduler": {
	                    "frequency": "Hour",
	                    "interval": 1
	                },
	                "name": "CopyFromBlobToBlob",
	                "description": "Copy data from a blob to another"
	            },
	            {
	                "type": "Copy",
	                "typeProperties": {
	                    "source": {
	                        "type": "BlobSource"
	                    },
	                    "sink": {
	                        "type": "BlobSink",
	                        "writeBatchSize": 0,
	                        "writeBatchTimeout": "00:00:00"
	                    }
	                },
	                "inputs": [
	                    {
	                        "name": "Dataset3"
	                    },
	                    {
	                        "name": "Dataset2"
	                    }
	                ],
	                "outputs": [
	                    {
	                        "name": "Dataset4"
	                    }
	                ],
	                "policy": {
	                    "timeout": "01:00:00"
	                },
	                "scheduler": {
	                    "frequency": "Hour",
	                    "interval": 1
	                },
	                "name": "CopyFromBlob3ToBlob4",
	                "description": "Copy data from a blob to another"
	            }
	        ],
	        "start": "2017-04-25T01:00:00Z",
	        "end": "2017-04-25T01:00:00Z",
	        "isPaused": false
	    }
	}


Notice that in the example, two input datasets are specified for the second copy activity. When multiple inputs are specified, only the first input dataset is used for copying data, but other datasets are used as dependencies. CopyActivity2 would start only after the following conditions are met:

- CopyActivity1 has successfully completed and Dataset2 is available. This dataset is not used when copying data to Dataset4. It only acts as a scheduling dependency for CopyActivity2.   
- Dataset3 is available. This dataset represents the data that is copied to the destination.  



## Model datasets with different frequencies

In the samples, the frequencies for input and output datasets and the activity schedule window were the same. Some scenarios require the ability to produce output at a frequency different than the frequencies of one or more inputs. Data Factory supports modeling these scenarios.

### Sample 1: Produce a daily output report for input data that is available every hour

Consider a scenario in which you have input measurement data from sensors available every hour in Azure Blob storage. You want to produce a daily aggregate report with statistics such as mean, maximum, and minimum for the day with [Data Factory hive activity](data-factory-hive-activity.md).

Here is how you can model this scenario with Data Factory:

**Input dataset**

The hourly input files are dropped in the folder for the given day. Availability for input is set at **Hour** (frequency: Hour, interval: 1).

	{
	  "name": "AzureBlobInput",
	  "properties": {
	    "type": "AzureBlob",
	    "linkedServiceName": "StorageLinkedService",
	    "typeProperties": {
	      "folderPath": "mycontainer/myfolder/{Year}/{Month}/{Day}/",
	      "partitionedBy": [
	        { "name": "Year", "value": {"type": "DateTime","date": "SliceStart","format": "yyyy"}},
	        { "name": "Month","value": {"type": "DateTime","date": "SliceStart","format": "%M"}},
	        { "name": "Day","value": {"type": "DateTime","date": "SliceStart","format": "%d"}}
	      ],
	      "format": {
	        "type": "TextFormat"
	      }
	    },
		"external": true,
	    "availability": {
	      "frequency": "Hour",
	      "interval": 1
	    }
	  }
	}

**Output dataset**

One output file is created every day in the day's folder. Availability of output is set at **Day** (frequency: Day and interval: 1).


	{
	  "name": "AzureBlobOutput",
	  "properties": {
	    "type": "AzureBlob",
	    "linkedServiceName": "StorageLinkedService",
	    "typeProperties": {
	      "folderPath": "mycontainer/myfolder/{Year}/{Month}/{Day}/",
	      "partitionedBy": [
	        { "name": "Year", "value": {"type": "DateTime","date": "SliceStart","format": "yyyy"}},
	        { "name": "Month","value": {"type": "DateTime","date": "SliceStart","format": "%M"}},
	        { "name": "Day","value": {"type": "DateTime","date": "SliceStart","format": "%d"}}
	      ],
	      "format": {
	        "type": "TextFormat"
	      }
	    },
	    "availability": {
	      "frequency": "Day",
	      "interval": 1
	    }
	  }
	}

**Activity: hive activity in a pipeline**

The hive script receives the appropriate *DateTime* information as parameters that use the **WindowStart** variable as shown in the following snippet. The hive script uses this variable to load the data from the correct folder for the day and run the aggregation to generate the output.

		{  
		    "name":"SamplePipeline",
		    "properties":{  
		    "start":"2015-01-01T08:00:00",
		    "end":"2015-01-01T11:00:00",
		    "description":"hive activity",
		    "activities": [
		        {
		            "name": "SampleHiveActivity",
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
		            "linkedServiceName": "HDInsightLinkedService",
		            "type": "HDInsightHive",
		            "typeProperties": {
		                "scriptPath": "adftutorial\\hivequery.hql",
		                "scriptLinkedService": "StorageLinkedService",
		                "defines": {
		                    "Year": "$$Text.Format('{0:yyyy}',WindowStart)",
		                    "Month": "$$Text.Format('{0:%M}',WindowStart)",
		                    "Day": "$$Text.Format('{0:%d}',WindowStart)"
		                }
		            },
		            "scheduler": {
		                "frequency": "Day",
		                "interval": 1
		            },			
		            "policy": {
		                "concurrency": 1,
		                "executionPriorityOrder": "OldestFirst",
		                "retry": 2,
		                "timeout": "01:00:00"
		            }
	             }
		     ]
		   }
		}

The following diagram shows the scenario from a data-dependency point of view.

![Data dependency](./media/data-factory-scheduling-and-execution/data-dependency.png)

The output slice for every day depends on 24 hourly slices from an input dataset. Data Factory computes these dependencies automatically by figuring out the input data slices that fall in the same time period as the output slice to be produced. If any of the 24 input slices is not available, Data Factory waits for the input slice to be ready before starting the daily activity run.


### Sample 2: Specify dependency with expressions and Data Factory functions

Let’s consider another scenario. Suppose you have a hive activity that processes two input datasets. One of them has new data daily, but one of them gets new data every week. Suppose you wanted to do a join across the two inputs and produce an output every day.

The simple approach in which Data Factory automatically figures out the right input slices to process by aligning to the output data slice’s time period does not work.

You must specify that for every activity run, the Data Factory should use last week’s data slice for the weekly input dataset. You can do this with the help of Azure Data Factory functions as shown in the following snippet.

**Input1: Azure blob**

The first input is the Azure blob being updated daily.

	{
	  "name": "AzureBlobInputDaily",
	  "properties": {
	    "type": "AzureBlob",
	    "linkedServiceName": "StorageLinkedService",
	    "typeProperties": {
	      "folderPath": "mycontainer/myfolder/{Year}/{Month}/{Day}/",
	      "partitionedBy": [
	        { "name": "Year", "value": {"type": "DateTime","date": "SliceStart","format": "yyyy"}},
	        { "name": "Month","value": {"type": "DateTime","date": "SliceStart","format": "%M"}},
	        { "name": "Day","value": {"type": "DateTime","date": "SliceStart","format": "%d"}}
	      ],
	      "format": {
	        "type": "TextFormat"
	      }
	    },
		"external": true,
	    "availability": {
	      "frequency": "Day",
	      "interval": 1
	    }
	  }
	}

**Input2: Azure blob**

Input2 is the Azure blob being updated weekly.

	{
	  "name": "AzureBlobInputWeekly",
	  "properties": {
	    "type": "AzureBlob",
	    "linkedServiceName": "StorageLinkedService",
	    "typeProperties": {
	      "folderPath": "mycontainer/myfolder/{Year}/{Month}/{Day}/",
	      "partitionedBy": [
	        { "name": "Year", "value": {"type": "DateTime","date": "SliceStart","format": "yyyy"}},
	        { "name": "Month","value": {"type": "DateTime","date": "SliceStart","format": "%M"}},
	        { "name": "Day","value": {"type": "DateTime","date": "SliceStart","format": "%d"}}
	      ],
	      "format": {
	        "type": "TextFormat"
	      }
	    },
		"external": true,
	    "availability": {
	      "frequency": "Day",
	      "interval": 7
	    }
	  }
	}

**Output: Azure blob**

One output file is created every day in the folder for the day. Availability of output is set to **day** (frequency: Day, interval: 1).

	{
	  "name": "AzureBlobOutputDaily",
	  "properties": {
	    "type": "AzureBlob",
	    "linkedServiceName": "StorageLinkedService",
	    "typeProperties": {
	      "folderPath": "mycontainer/myfolder/{Year}/{Month}/{Day}/",
	      "partitionedBy": [
	        { "name": "Year", "value": {"type": "DateTime","date": "SliceStart","format": "yyyy"}},
	        { "name": "Month","value": {"type": "DateTime","date": "SliceStart","format": "%M"}},
	        { "name": "Day","value": {"type": "DateTime","date": "SliceStart","format": "%d"}}
	      ],
	      "format": {
	        "type": "TextFormat"
	      }
	    },
	    "availability": {
	      "frequency": "Day",
	      "interval": 1
	    }
	  }
	}

**Activity: hive activity in a pipeline**

The hive activity takes the two inputs and produces an output slice every day. You can specify every day’s output slice to depend on the previous week’s input slice for weekly input as follows.

	{  
	    "name":"SamplePipeline",
	    "properties":{  
	    "start":"2015-01-01T08:00:00",
	    "end":"2015-01-01T11:00:00",
	    "description":"hive activity",
	    "activities": [
	      {
	        "name": "SampleHiveActivity",
	        "inputs": [
	          {
	            "name": "AzureBlobInputDaily"
	          },
	          {
	            "name": "AzureBlobInputWeekly",
	            "startTime": "Date.AddDays(SliceStart, - Date.DayOfWeek(SliceStart))",
	            "endTime": "Date.AddDays(SliceEnd,  -Date.DayOfWeek(SliceEnd))"  
	          }
	        ],
	        "outputs": [
	          {
	            "name": "AzureBlobOutputDaily"
	          }
	        ],
	        "linkedServiceName": "HDInsightLinkedService",
	        "type": "HDInsightHive",
	        "typeProperties": {
	          "scriptPath": "adftutorial\\hivequery.hql",
	          "scriptLinkedService": "StorageLinkedService",
	          "defines": {
	            "Year": "$$Text.Format('{0:yyyy}',WindowStart)",
	            "Month": "$$Text.Format('{0:%M}',WindowStart)",
	            "Day": "$$Text.Format('{0:%d}',WindowStart)"
	          }
	        },
	        "scheduler": {
	          "frequency": "Day",
	          "interval": 1
	        },			
	        "policy": {
	          "concurrency": 1,
	          "executionPriorityOrder": "OldestFirst",
	          "retry": 2,  
	          "timeout": "01:00:00"
	        }
		   }
	     ]
	   }
	}


## Data Factory functions and system variables   

See [Data Factory functions and system variables](data-factory-functions-variables.md) for a list of functions and system variables that Data Factory supports.

## Data dependency deep dive

To generate a dataset slice by an activity run, Data Factory uses the following *dependency model* to determine the relationships between datasets consumed and produced by an activity.

The time range of the input datasets required to generate the output dataset slice is called the *dependency period*.

An activity run generates a dataset slice only after the data slices in input datasets within the dependency period are available. This means that all the input slices comprising the dependency period must have **Ready** status for the activity run to produce an output dataset slice.

To generate the dataset slice [**start**, **end**], a function must map the dataset slice to its dependency period. This function is essentially a formula that converts the start and end of the dataset slice to the start and end of the dependency period. More formally:

	DatasetSlice = [start, end]
	DependecyPeriod = [f(start, end), g(start, end)]

**F** and **g**  are mapping functions that calculate the start and end of the dependency period for each activity input.

As seen in samples, the dependency period is same as the period for the data slice that will be produced. In these cases, Data Factory automatically computes the input slices that fall in the dependency period.  

For example, in the aggregation sample where output is produced daily and input data is available every hour, the data slice period is 24 hours. Data Factory finds the relevant hourly input slices for this time period and makes the output slice dependent on the input slice.

You can also provide your own mapping for the dependency period as shown in the sample, where one of the inputs is weekly and the output slice is produced daily.

## Data dependency and validation

A dataset can have a validation policy defined that specifies how the data generated by a slice execution can be validated before it is ready for consumption. See [Creating datasets](data-factory-create-datasets.md) for details.

In such cases, after the slice has finished execution, the output slice status is changed to **Waiting** with a substatus of **Validation**. After the slices are validated, the slice status changes to **Ready**.

If a data slice has been produced but did not pass the validation, activity runs for downstream slices depending on the slice that failed validation are not processed.

[Monitor and manage pipelines](data-factory-monitor-manage-pipelines.md) covers the various states of data slices in Data Factory.

## External data

A dataset can be marked as external (as shown in the following JSON snippet), implying it was not generated with Data Factory. In such a case, the Dataset policy can have an additional set of parameters describing validation and retry policy for the dataset. See [Creating pipelines](data-factory-create-pipelines.md) for a description of all the properties.

Similar to datasets that are produced by Data Factory, the data slices for external data need to be ready before dependent slices can be processed.

	{
		"name": "AzureSqlInput",
		"properties":
		{
			"type": "AzureSqlTable",
			"linkedServiceName": "AzureSqlLinkedService",
			"typeProperties":
			{
				"tableName": "MyTable"
			},
			"availability":
			{
				"frequency": "Hour",
				"interval": 1     
			},
			"external": true,
			"policy":
			{
				"externalData":
				{
					"retryInterval": "00:01:00",
					"retryTimeout": "00:10:00",
					"maximumRetry": 3
				}
			}  
		}
	}


## Onetime pipeline
You can create and schedule a pipeline to run periodically (for example: hourly or daily) within the start and end times you specify in the pipeline definition. See [Scheduling activities](#scheduling-and-execution) for details. You can also create a pipeline that runs only once. To do so, you set the **pipelineMode** property in the pipeline definition to **onetime** as shown in the following JSON sample. The default value for this property is **scheduled**.

	{
	    "name": "CopyPipeline",
	    "properties": {
	        "activities": [
	            {
	                "type": "Copy",
	                "typeProperties": {
	                    "source": {
	                        "type": "BlobSource",
	                        "recursive": false
	                    },
	                    "sink": {
	                        "type": "BlobSink",
	                        "writeBatchSize": 0,
	                        "writeBatchTimeout": "00:00:00"
	                    }
	                },
	                "inputs": [
	                    {
	                        "name": "InputDataset"
	                    }
	                ],
	                "outputs": [
	                    {
	                        "name": "OutputDataset"
	                    }
	                ]
	                "name": "CopyActivity-0"
	            }
	        ]
	        "pipelineMode": "OneTime"
	    }
	}

Note the following:

- **Start** and **end** times for the pipeline are not specified.
- **Availability** of input and output datasets is specified (**frequency** and **interval**), even though Data Factory does not use the values.  
- Diagram view does not show one-time pipelines. This behavior is by design.
- One-time pipelines cannot be updated. You can clone a one-time pipeline, rename it, update properties, and deploy it to create another one.
