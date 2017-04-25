---
title: Scheduling and Execution with Data Factory | Microsoft Docs
description: Learn scheduling and execution aspects of Azure Data Factory application model.
services: data-factory
documentationcenter: ''
author: spelluru
manager: jhubbard
editor: monicar

ms.assetid: 088a83df-4d1b-4ac1-afb3-0787a9bd1ca5
ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/24/2017
ms.author: spelluru

---
# Data Factory scheduling and execution
This article explains the scheduling and execution aspects of the Azure Data Factory application model. This article assumes that you understand basics of Data Factory application model concepts, including activity, pipelines, linked services, and datasets. For basic concepts of Azure Data Factory, see the following articles:

* [Introduction to Data Factory](data-factory-introduction.md)
* [Pipelines](data-factory-create-pipelines.md)
* [Datasets](data-factory-create-datasets.md) 

## Schedule an activity
An activity in a Data Factory pipeline can take zero or more input **datasets** and produce one or more output datasets. For an activity, you can specify the cadence at which the input data is available or the output data is produced by using the **availability** section in the dataset definitions. 

> [!NOTE]
> For a full list of properties available in the availability section, see [dataset availability](data-factory-create-datasets.md#dataset-availability). 

In the following example, the input data is available hourly and the output data is produced hourly (`"frequency": "Hour", "interval": 1`). 

**Input dataset:** 

```json
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
```


**Output dataset**

```json
```json
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
                { "name": "Year", "value": { "type": "DateTime", "date": "SliceStart", "format": "yyyy" } },
                { "name": "Month", "value": { "type": "DateTime", "date": "SliceStart", "format": "%M" } },
                { "name": "Day", "value": { "type": "DateTime", "date": "SliceStart", "format": "%d" } },
                { "name": "Hour", "value": { type": "DateTime", "date": "SliceStart", format": "%H" }}
            ]
        },
        "availability": {
            "frequency": "Hour",
            "interval": 1
        }
    }
}
```
```

Currently, **output dataset drives the schedule**. In other words, the schedule specified for the output dataset is used to run an activity at runtime. Therefore, you must create an output dataset even if the activity does not produce any output. If the activity doesn't take any input, you can skip creating the input dataset. 

In this example, the activity runs hourly between the start and end times of the pipeline. For example, if the **start** and **end** times of the pipeline is defined as follows, the output data are produced hourly for three hour windows (8 AM - 9 AM, 9 AM - 10 AM, and 10 AM - 11 AM). 

```json
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
        "start": "2017-04-01T08:00:00Z",
        "end": "2017-04-01T11:00:00Z"
    }
}
```

Each unit of data consumed and produced by an activity run is called a **data slice**. The following diagram shows an example of an activity with one input dataset and one output dataset. 

![Availability scheduler](./media/data-factory-scheduling-and-execution/availability-scheduler.png)

The diagram shows the hourly data slices for the input and output dataset. The diagram shows three input slices that are ready for processing. The 10-11 AM activity is in progress, producing the 10-11 AM output slice. You can access the time interval associated with the current slice being produced in the dataset JSON with variables [SliceStart](data-factory-functions-variables.md#data-factory-system-variables) and [SliceEnd](data-factory-functions-variables.md#data-factory-system-variables).

As shown in the diagram, specifying a schedule creates a series of tumbling windows. Tumbling windows are a series of fixed-size, non-overlapping, contiguous time intervals. These logical tumbling windows for the activity are called **activity windows**. For the currently executing activity window, you can access the time interval associated with the activity window with [WindowStart](data-factory-functions-variables.md#data-factory-system-variables) and [WindowEnd](data-factory-functions-variables.md#data-factory-system-variables) system variables in the activity JSON. Currently, WindowStart and WindowEnd values are same as the SliceStart and SliceEnd values respectively. You can use these variables for different purposes in your activity JSON. For example, you can use them to select data from input and output datasets representing time series data (for example: 8 AM to 9 AM).

This example also uses **WindowStart** and **WindowEnd** to select relevant data for an activity run and copy it to a blob with the appropriate **folderPath**. The **folderPath** is parameterized to have a separate folder for every hour.  

In the preceding example, the schedule specified for input and output datasets is the same (hourly). If the input dataset for the activity is available at a different frequency, say every 15 minutes, the activity that produces this output dataset still runs once an hour as the output dataset is what drives the activity schedule. For more information, see [Model datasets with different frequencies](#model-datasets-with-different-frequencies).

The scheduler property for an activity is **optional**. If you do specify this property, it must match the cadence you specify in the output dataset definition. Therefore, **WindowStart**, **WindowEnd**, **SliceStart**, and **SliceEnd** always map to the same time period and a single output slice. 

The **scheduler** property supports the same subproperties as the **availability** property in a dataset. See [Dataset availability](data-factory-create-datasets.md#Availability) for details. Examples: scheduling at a specific time offset, or setting the mode to align processing at the beginning or end of the interval for the activity window.

## Parallel processing of data slices
You can set the start date for the pipeline in the past. When you do so, Data Factory automatically calculates (back fills) all data slices in the past and begins processing them. For example: you just created a pipeline with start date 2017-04-01 and the current date is 2017-04-10. If the cadence of the output dataset is daily, then Data Factory starts processing all the slices from 2017-04-01 to 2017-04-10 immediately because the start date is in the past. 

You can configure back-filled data slices to be processed in parallel by setting the **concurrency** property in the **policy** section of the activity JSON. This property determines the number of parallel activity executions that can happen on different slices.  

The default value for the concurrency property is 1. Therefore, one slice is processed at a time by default. The maximum value is 10. When a pipeline needs to go through a large set of available data, having a larger concurrency value speeds up the data processing.

For example, if there are 3 past slices for the time periods 1 AM - 2 AM, 2 AM - 3 AM, 3 AM - 4 AM when the current time is 4:30 AM for an hourly slice and concurrency is set to 3, all three slices are processed by three activity executions at runtime.   

## Rerun a failed data slice
When an error occurs while processing a data slice, you can find out why the processing of a slice failed by using Azure portal blades or Monitor and Manage App. See [Monitoring and managing pipelines using Azure portal blades](data-factory-monitor-manage-pipelines.md) or [Monitoring and Management app](data-factory-monitor-manage-app.md) for details.

Consider the following example, which shows two activities. Activity1  and Acitivity 2. Activity 1 consumes a slice of Dataset1 and produces a slice of dataset Dataset2, which is consumed as an input by Activity2 to produce a slice of the final output dataset Final Dataset.

![Failed slice](./media/data-factory-scheduling-and-execution/failed-slice.png)

The diagram shows that out of three recent slices, there was a failure producing the 9-10 AM slice for Dataset2. Data Factory automatically tracks dependency for the time series dataset. As a result, it does not start the activity run for the 9-10 AM downstream slice.

Data Factory monitoring and management tools allow you to drill into the diagnostic logs for the failed slice to easily find the root cause for the issue and fix it. After you have fixed the issue, you can easily start the activity run to produce the failed slice. For more information on how to rerun and understand state transitions for data slices, see [Monitoring and managing pipelines using Azure portal blades](data-factory-monitor-manage-pipelines.md) or [Monitoring and Management app](data-factory-monitor-manage-app.md).

After you rerun the 9-10 AM slice for **Dataset2**, Data Factory starts the run for the 9-10 AM dependent slice on the final dataset.

![Rerun failed slice](./media/data-factory-scheduling-and-execution/rerun-failed-slice.png)

## Multiple activities in a pipeline
You can have more than one activity in a pipeline. If you have multiple activities in a pipeline and the output of an activity is not an input of another activity, the activities may run in parallel if input data slices for the activities are ready.

You can chain two activities (run one activity after another) by setting the output dataset of one activity as the input dataset of the other activity. The activities can be in the same pipeline or in different pipelines. The second activity executes only when the first one finishes successfully.

For example, consider the following case where a pipeline has two activities:

1. Activity A1 that requires external input dataset D1, and produces output dataset D2.
2. Activity A2 that requires input from dataset D2, and produces output dataset D3.

In this scenario, activities A1 and A2 are in the same pipeline. The activity A1 runs when the external data is available and the scheduled availability frequency is reached. The activity A2 runs when the scheduled slices from D2 become available and the scheduled availability frequency is reached. If there is an error in one of the slices in dataset D2, A2 does not run for that slice until it becomes available.

The Diagram view with both activities in the same pipeline would look like the following diagram:

![Chaining activities in the same pipeline](./media/data-factory-scheduling-and-execution/chaining-one-pipeline.png)

As mentioned earlier, the activities could be in different pipelines. In such a scenario, the diagram view would look like the following diagram:

![Chaining activities in two pipelines](./media/data-factory-scheduling-and-execution/chaining-two-pipelines.png)

See the [copy sequentially](#copy-sequentially) section in the appendix for an example. 

## Model datasets with different frequencies
In the samples, the frequencies for input and output datasets and the activity schedule window were the same. Some scenarios require the ability to produce output at a frequency different than the frequencies of one or more inputs. Data Factory supports modeling these scenarios.

### Sample 1: Produce a daily output report for input data that is available every hour
Consider a scenario in which you have input measurement data from sensors available every hour in Azure Blob storage. You want to produce a daily aggregate report with statistics such as mean, maximum, and minimum for the day with [Data Factory hive activity](data-factory-hive-activity.md).

Here is how you can model this scenario with Data Factory:

**Input dataset**

The hourly input files are dropped in the folder for the given day. Availability for input is set at **Hour** (frequency: Hour, interval: 1).

```json
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
```
**Output dataset**

One output file is created every day in the day's folder. Availability of output is set at **Day** (frequency: Day and interval: 1).

```json
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
```

**Activity: hive activity in a pipeline**

The hive script receives the appropriate *DateTime* information as parameters that use the **WindowStart** variable as shown in the following snippet. The hive script uses this variable to load the data from the correct folder for the day and run the aggregation to generate the output.

```json
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
```

The following diagram shows the scenario from a data-dependency point of view.

![Data dependency](./media/data-factory-scheduling-and-execution/data-dependency.png)

The output slice for every day depends on 24 hourly slices from an input dataset. Data Factory computes these dependencies automatically by figuring out the input data slices that fall in the same time period as the output slice to be produced. If any of the 24 input slices is not available, Data Factory waits for the input slice to be ready before starting the daily activity run.

### Sample 2: Specify dependency with expressions and Data Factory functions
Let’s consider another scenario. Suppose you have a hive activity that processes two input datasets. One of them has new data daily, but one of them gets new data every week. Suppose you wanted to do a join across the two inputs and produce an output every day.

The simple approach in which Data Factory automatically figures out the right input slices to process by aligning to the output data slice’s time period does not work.

You must specify that for every activity run, the Data Factory should use last week’s data slice for the weekly input dataset. You use Azure Data Factory functions as shown in the following snippet to implement this behavior.

**Input1: Azure blob**

The first input is the Azure blob being updated daily.

```json
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
```

**Input2: Azure blob**

Input2 is the Azure blob being updated weekly.

```json
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
```

**Output: Azure blob**

One output file is created every day in the folder for the day. Availability of output is set to **day** (frequency: Day, interval: 1).

```json
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
```

**Activity: hive activity in a pipeline**

The hive activity takes the two inputs and produces an output slice every day. You can specify every day’s output slice to depend on the previous week’s input slice for weekly input as follows.

```json
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
```

See [Data Factory functions and system variables](data-factory-functions-variables.md) for a list of functions and system variables that Data Factory supports.

## Data dependency deep dive
To generate a dataset slice by an activity run, Data Factory uses the following *dependency model* to determine the relationships between datasets consumed and produced by an activity.

The time range of the input datasets required to generate the output dataset slice is called the *dependency period*.

An activity run generates a dataset slice only after the data slices in input datasets within the dependency period are available. In other words, all the input slices comprising the dependency period must be in **Ready** state for the activity run to produce an output dataset slice.

To generate the dataset slice [**start**, **end**], a function must map the dataset slice to its dependency period. This function is essentially a formula that converts the start and end of the dataset slice to the start and end of the dependency period. More formally:

```
DatasetSlice = [start, end]
DependencyPeriod = [f(start, end), g(start, end)]
```

**F** and **g** are mapping functions that calculate the start and end of the dependency period for each activity input.

As seen in samples, the dependency period is same as the period for the data slice that is produced. In these cases, Data Factory automatically computes the input slices that fall in the dependency period.  

For example, in the aggregation sample where output is produced daily and input data is available every hour, the data slice period is 24 hours. Data Factory finds the relevant hourly input slices for this time period and makes the output slice dependent on the input slice.

You can also provide your own mapping for the dependency period as shown in the sample, where one of the inputs is weekly and the output slice is produced daily.

### Data dependency and validation
A dataset can have a validation policy defined that specifies how the data generated by a slice execution can be validated before it is ready for consumption. See [Creating datasets](data-factory-create-datasets.md) for details.

In such cases, after the slice has finished execution, the output slice status is changed to **Waiting** with a substatus of **Validation**. After the slices are validated, the slice status changes to **Ready**.

If a data slice has been produced but did not pass the validation, activity runs for downstream slices that depend on this slice are not processed.

[Monitor and manage pipelines](data-factory-monitor-manage-pipelines.md) covers the various states of data slices in Data Factory.

### External data
A dataset can be marked as external (as shown in the following JSON snippet), implying it was not generated with Data Factory. In such a case, the Dataset policy can have an additional set of parameters describing validation and retry policy for the dataset. See [Creating pipelines](data-factory-create-pipelines.md) for a description of all the properties.

Similar to datasets that are produced by Data Factory, the data slices for external data need to be ready before dependent slices can be processed.

```json
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
```

## Appendix

### Example: copy sequentially
It is possible to run multiple copy operations one after another in a sequential/ordered manner. For example, you might have two copy activities in a pipeline (CopyActivity1 and CopyActivity2) with the following input data output datasets:   

CopyActivity1

Input: Dataset. Output: Dataset2.

CopyActivity2

Input: Dataset2.  Output: Dataset3.

CopyActivity2 would run only if the CopyActivity1 has run successfully and Dataset2 is available.

Here is the sample pipeline JSON:

```json
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
```

Notice that in the example, the output dataset of the first copy activity (Dataset2) is specified as input for the second activity. Therefore, the second activity runs only when the output dataset from the first activity is ready.  

In the example, CopyActivity2 can have a different input, such as Dataset3, but you specify Dataset2 as an input to CopyActivity2, so the activity does not run until CopyActivity1 finishes. For example:

CopyActivity1

Input: Dataset1. Output: Dataset2.

CopyActivity2

Inputs: Dataset3, Dataset2. Output: Dataset4.

```json
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
```

Notice that in the example, two input datasets are specified for the second copy activity. When multiple inputs are specified, only the first input dataset is used for copying data, but other datasets are used as dependencies. CopyActivity2 would start only after the following conditions are met:

* CopyActivity1 has successfully completed and Dataset2 is available. This dataset is not used when copying data to Dataset4. It only acts as a scheduling dependency for CopyActivity2.   
* Dataset3 is available. This dataset represents the data that is copied to the destination. 