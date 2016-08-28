<properties 
	pageTitle="Scheduling and Execution with Data Factory" 
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

# Scheduling & Execution with Data Factory
  
This article explains the scheduling and execution aspects of Azure Data Factory application model. This article builds on [Creating Pipelines](data-factory-create-pipelines.md) and [Creating Datasets](data-factory-create-datasets.md) articles and assumes that you understand basics of data factory application model concepts: activity, pipelines, linked services, and datasets.

## Scheduling Activities

With the **scheduler** section in the activity JSON, you can specify a recurring schedule for the activity. For example you can schedule an activity every hour as follows:

	"scheduler": {
		"frequency": "Hour",
	    "interval": 1
	},  
    
![Scheduler example](./media/data-factory-scheduling-and-execution/scheduler-example.png)

As shown in the diagram, specifying a schedule for the activity creates a series of tumbling windows. Tumbling windows are series of fixed-sized, non-overlapping, and contiguous time intervals. These logical tumbling windows for the activity are called **activity windows**.
 
For the currently executing activity window, the time interval associated with the activity window can be accessed with [WindowStart](data-factory-functions-variables.md#data-factory-system-variables) and [WindowEnd](data-factory-functions-variables.md#data-factory-system-variables) system variables in the activity JSON. You can use these variables for different purposes in your activity JSON, for example, to select data from input, and output datasets representing time series data.

The **scheduler** property supports the same sub properties as the **availability** property in a dataset. See [Dataset availability](data-factory-create-datasets.md#Availability) article for details. Examples: scheduling at a specific time offset, setting the mode to align processing at the beginning of interval for the activity window or at the end. 

Specifying scheduler properties for an activity is optional. If you do specify, it must match the cadence you specify in the output dataset definition. Currently, output dataset is what drives the schedule, so you must create an output dataset even if the activity does not produce any output. If the activity doesn't take any input, you can skip creating the input dataset. 

## Time series datasets and data Slices

Time series data is a continuous sequence of data points typically consisting of successive measurements made over a time interval. Common examples of time series data include sensor data, application telemetry data etc.

With Azure Data Factory, you can process time series data in batched fashion with activity runs. Typically, there are recurring cadences at which input data arrives and output data needs to be produced. This cadence is modeled by specifying **availability** section on the dataset as follows:

    "availability": {
      "frequency": "Hour",
      "interval": 1
    },

Each unit of data consumed and produced by an activity run is called a data **slice**. The following diagram shows an example of an activity with one input dataset and one output dataset. These datasets have availability set to hourly frequency.

![Availability scheduler](./media/data-factory-scheduling-and-execution/availability-scheduler.png)

The hourly data slices for the input and output dataset are shown in the diagram. The diagram shows three input slices that are ready for processing and the 10-11 AM activity run in progress producing the 10-11 AM output slice. 

The time interval associated with the current slice being produced can be accessed in the dataset JSON with variables [SliceStart](data-factory-functions-variables.md#data-factory-system-variables) and [SliceEnd](data-factory-functions-variables.md#data-factory-system-variables).

Currently data factory requires that the schedule specified in the activity exactly matches the schedule specified in availability of the output dataset. Therefore, WindowStart, WindowEnd and SliceStart, and SliceEnd always map to the same time period and a single output slice.

For more information on different properties available for availability section, refer to the [Creating Datasets](data-factory-create-datasets.md) article.

## Sample – Copy Activity moving data from Azure SQL to Azure Blob

Let’s put some thing together and in action by creating a pipeline that copies data from an Azure SQL table to Azure blob every hour.

**Input: Azure SQL dataset**

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


The **frequency** is set to **Hour** and **interval** is set to **1** in the **availability** section. 

**Output: Azure Blob dataset**
	
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


The **frequency** is set to **Hour** and **interval** is set to **1** in the **availability** section.



**Activity: Copy activity**

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


The sample shows activity schedule and dataset availability sections set to hourly frequency. The sample shows how you can use **WindowStart** and **WindowEnd** to select relevant data for an activity run and copy it to a blob with appropriate **folderPath**. The folderPath is parameterized to have a separate folder for every hour.

When 3 of the slices between 8 – 11 AM execute and the data in Azure SQL is as follows:

![Sample input](./media/data-factory-scheduling-and-execution/sample-input-data.png)

On deploying the pipeline the Azure blob is populated as follows:

1.	File mypath/2015/1/1/8/Data.&lt;Guid&gt;.txt with data 

			10002345,334,2,2015-01-01 08:24:00.3130000
			10002345,347,15,2015-01-01 08:24:00.6570000
			10991568,2,7,2015-01-01 08:56:34.5300000

	> [AZURE.NOTE] &lt;Guid&gt; is replaced with an actual guid. Example file name: Data.bcde1348-7620-4f93-bb89-0eed3455890b.txt
2.	File mypath/2015/1/1/9/Data.&lt;Guid&gt;.txt with data:

			10002345,334,1,2015-01-01 09:13:00.3900000
			24379245,569,23,2015-01-01 09:25:00.3130000
			16777799,21,115,2015-01-01 09:47:34.3130000
3.	File mypath/2015/1/1/10/Data.&lt;Guid&gt;.txt with no data.


## Data Slices, Active Period for Pipeline and Concurrent Slice Execution

The [Creating Pipelines](data-factory-create-pipelines.md) article introduced the concept of active period for a pipeline specified by setting the **start** and **end** properties.
 
You can set the start date for the pipeline active period in the past. Then, Data Factory automatically calculates (back fills) all data slices in the past and begins processing them.

With back filled data slices, it is possible to configure them to be run in parallel. You can do that by setting the **concurrency** property in **policy** section of the activity JSON as shown in the [Creating Pipelines](data-factory-create-pipelines.md) article.

## Rerunning Failed Data Slices and Automatic Data Dependency Tracking

You can monitor execution of slices in a rich visual way. See **Monitoring and managing pipelines using** [Azure portal blades](data-factory-monitor-manage-pipelines.md) (or) [Monitor and Manage app](data-factory-monitor-manage-app.md) for details. 

Consider the following example, which shows two activities. Activity1 produces a time series dataset with slices as output that is consumed as input by Activity2 to produce the final output time series dataset.

![Failed slice](./media/data-factory-scheduling-and-execution/failed-slice.png)

<br/>

The diagram shows that out of three recent slices there was a failure producing the 9-10 AM slice for **Dataset2**. Data factory automatically tracks dependency for time series dataset and as a result holds off kicking off the activity run for 9-10 AM downstream slice.


Data factory monitoring & management tools allow you to drill into the diagnostic logs for the failed slice easily find the root cause for the issue and fix it. Once you have fixed the issue, you can also easily kick off the activity run to produce the failed slice. For more details on how to rerun, understand state transitions for data slices, see **Monitoring and managing pipelines using** [Azure portal blades](data-factory-monitor-manage-pipelines.md) (or) [Monitor and Manage app](data-factory-monitor-manage-app.md) for details. 

Once you rerun the 9-10 AM slice for dataset2 and it is ready, Data Factory starts the run for the 9-10 AM dependent slice on final dataset.

![Rerun failed slice](./media/data-factory-scheduling-and-execution/rerun-failed-slice.png)

## Running activities in a sequence
You can chain two activities (run one activity after another) by having the output dataset of one activity as the input dataset of the other activity. The activities can be in the same pipeline or in different pipelines. The second activity executes only when the first one completes successfully. 

For example, consider the following case:
 
1.	Pipeline P1 has Activity A1 that requires external input dataset D1, and produce **output** dataset **D2**.
2.	Pipeline P2 has Activity A2 that requires **input** from dataset **D2**, and produces output dataset **D3**.
 
In this scenario, activities A1 and A2 are in different pipelines. The activity A1 runs when the external data is available, and the scheduled availability frequency is reached.  The activity A2 runs when the scheduled slices from D2 become available and the scheduled availability frequency is reached. If there is an error in one of the slices in dataset D2, A2 does not run for that slice until it becomes available.

The Diagram View would look like the following diagram:

![Chaining activities in two pipelines](./media/data-factory-scheduling-and-execution/chaining-two-pipelines.png)

As mentioned earlier, the activities can be in the same pipeline. The Diagram View with both activities in the same pipeline would look as shown in the following diagram: 

![Chaining activities in the same pipeline](./media/data-factory-scheduling-and-execution/chaining-one-pipeline.png)

### Sequential copy
It is possible to run multiple copy operations one after another in a sequential/ordered manner. Say you have two copy activities in a pipeline: CopyActivity1 and CopyActivity2 with the following input data output datasets.   

CopyActivity1: 
Input: Dataset1
Output Dataset2

CopyActivity2: 
Inputs: Dataset2
Output: Dataset3

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

Notice that in the example, the output dataset of the first copy activity (Dataset2) is specified as input for the second activity. Therefore, the second activity runs only when output dataset from the first activity is ready.  

In the example, CopyActivity2 can have a different input, say Dataset3, but you specify Dataset2 also as an input to CopyActivity2 so the activity does not run until CopyActivity1 completes. For example: 

CopyActivity1: 
Input: Dataset1
Output Dataset2

CopyActivity2: 
Inputs: Dataset3, Dataset2
Output: Dataset4

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


Notice that in the example, two input datasets are specified for the second copy activity. **When multiple inputs are specified, only the first input dataset is used for copying data but other datasets are used as dependencies.** CopyActivity2 would only start executing when the following conditions are met: 

- CopyActivity1 has successfully completed and Dataset2 is available. This dataset is not used when copying data to Dataset4. It only acts as a scheduling dependency for CopyActivity2.   
- Dataset3 is available. This dataset represents the data that is copied to the destination.  



## Modeling datasets with different frequencies

In the samples, the frequencies for input and output datasets and activity schedule window were same. Some scenarios require the ability to produce output at a frequency different than frequencies of one or more inputs. Data factory supports modeling these scenarios.

### Sample 1: Producing daily output report for input data that is available every hour

Consider a scenario where we have input measurement data from sensors available every hour in Azure Blob. You want to produce a daily aggregate report with statistics such as mean, max, and min for the day with Data Factory [Hive activity](data-factory-hive-activity.md).

Here is how you can model this scenario with Data Factory:

**Input Azure blob dataset:**

The hourly input files are dropped in the folder for the given day. Availability for input is set Hourly (frequency: Hour, interval: 1).

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

**Output Azure blob dataset**

One output file is created every day in the folder for the day. Availability of output is set Daily (frequency: Day and interval: 1).


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

**Activity: Hive activity in a pipeline**

The hive script receives the appropriate datetime information as parameters that use the **WindowStart** variable as shown in the following snippet. The hive script uses this variable to load the data from the right folder for the day and run the aggregation to generate the output.

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

The following diagram shows the scenario from data dependency point of view.

![Data dependency](./media/data-factory-scheduling-and-execution/data-dependency.png)

The output slice for every day depends on 24 hourly slices from input dataset. Data factory computes these dependencies automatically by figuring out the input data slices that fall in the same time period as the output slice to be produced. If any of the 24 input slices is not available, Data Factory waits for the input slice to be ready before kicking off the daily activity run.


### Sample 2: Specify dependency with expressions and data factory functions

Let’s consider another scenario. Suppose you have a Hive activity that processes two input datasets, one of them has new data daily but one of them gets new data every week. Suppose you wanted to do a join across the two inputs and produce an output daily.
 
The simple approach is where Data Factory automatically figures out the right input slices to process by aligning to the output data slice’s time period does not work.

You need a way to specify for every activity run the data factory should use last week’s data slice for the weekly input dataset. You can do that with the help of Azure Data Factory functions as shown in the following snippet.

**Input1: Azure Blob**

First input is Azure blob updated **daily**.
	
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

**Input2: Azure Blob**

Input2 is Azure blob updated **weekly**.

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

**Output: Azure Blob**

One output file is created every day in the folder for the day. Availability of output is set Daily (frequency: Day, interval: 1).
	
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

**Activity: Hive activity in a pipeline**

The hive activity takes the two inputs and produces an output slice every day. You can specify every day’s output slice to depend on last week’s input slice for weekly input as follows.
	
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

See [Data Factory Functions and System Variables](data-factory-functions-variables.md) article for a list of functions and system variables supported by Azure Data Factory. 

## Data Dependency Deep Dive

To generate a dataset slice by an activity run, Data Factory uses the following **dependency model** to determine the relationships between datasets consumed and produced by an activity.

The time range of the input datasets required to generate the output dataset slice called the **dependency period**.

An activity run generates a dataset slice only after the data slices in input datasets within the dependency period are available. It means that all the input slices comprising the dependency period must be in **Ready** status for the output dataset slice to be produced by an activity run. 

To generate the dataset slice [start, end], a function is needed to map the dataset slice to its dependency period. This function is essentially a formula that converts the start and end of the dataset slice to the start and end of the dependency period. More formally, 
	
	DatasetSlice = [start, end]
	DependecyPeriod = [f(start, end), g(start, end)]

where f and g are mapping functions that calculate the start and end of the dependency period for each activity input.

As seen in samples, the dependency period is same as the period for the data slice to be produced. In these cases, data factory automatically computes the input slices that fall in the dependency period.  

For example: In the aggregation sample, where output is produced daily and input data is available every hour, the data slice period is 24 hours. Data factory finds the relevant hourly input slices for this time period and makes the output slice dependent on the input slice.

You can also provide your own mapping for the dependency period as shown in the sample where one of the inputs was weekly and the output slice is produced daily.
   
## Data Dependency and Validation

A dataset can optionally have a validation policy defined that specifies how the data generated by a slice execution can be validated before it is ready for consumption. See [Creating datasets](data-factory-create-datasets.md) article for details. 

In such cases, once the slice has finished execution, the output slice status is changed to **Waiting** with a substatus of **Validation**. Once the slices are validated, the slice status changes to **Ready**.
   
If a data slice has been produced but did not pass the validation, activity runs for downstream slices depending on the slice that failed validation is not processed.

The various states of data slices in data factory are covered in the [Monitor and manage pipelines](data-factory-monitor-manage-pipelines.md) article.

## External Data

A dataset can be marked as external (as shown in the following JSON snippet), implying it was not generated with Azure Data Factory. In such a case, the Dataset policy can have an additional set of parameters describing validation and retry policy for the dataset. See [Creating Pipelines](data-factory-create-pipelines.md) for a description of all the properties. 

Similar to datasets that are produced by data factory the data slices for external data need to be ready before dependent slices can be processed.

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
You can create and schedule a pipeline to run periodically (for example: hourly, and daily) within the start and end times you specify in the pipeline definition. See [Scheduling activities](#scheduling-and-execution) for details. You can also create a pipeline that runs only once. To do so, you set the **pipelineMode** property in the pipeline definition to **onetime** as shown in the following JSON sample. The default value for this property is **scheduled**. 

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
 
- **start** and **end** times for the pipeline are not specified. 
- **availability** of input and output datasets is specified (frequency and interval) even though the values are not used by Data Factory.  
- Diagram view does not show one-time pipelines. This behavior is by design. 
- One time pipelines cannot be updated. You can clone a one-time pipeline, rename it, update properties, and deploy it to create another one. 

  




  









 
 












      

  




