---
title: ForEach activity
titleSuffix: Azure Data Factory & Azure Synapse
description: The For Each Activity defines a repeating control flow in an Azure Data Factory or Azure Synapse Analytics pipeline. The For Each Activity is used for iterating over a collection to execute actions on each item in the collection individually.
author: chez-charlie
ms.author: chez
ms.reviewer: jburchel
ms.service: data-factory
ms.subservice: orchestration
ms.custom: synapse
ms.topic: conceptual
ms.date: 10/20/2023
---

# ForEach activity in Azure Data Factory and Azure Synapse Analytics
[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

The ForEach Activity defines a repeating control flow in an Azure Data Factory or Synapse pipeline. This activity is used to iterate over a collection and executes specified activities in a loop. The loop implementation of this activity is similar to Foreach looping structure in programming languages.

## Create a ForEach activity with UI

To use a ForEach activity in a pipeline, complete the following steps:

1. You can use any array type variable or [outputs from other activities](how-to-expression-language-functions.md#examples-of-using-parameters-in-expressions) as the input for your ForEach activity.  To create an array variable, select the background of the pipeline canvas and then select the **Variables** tab to add an array type variable as shown below.

   :::image type="content" source="media/control-flow-activities-common/pipeline-array-variable.png" alt-text="Shows an empty pipeline canvas with an array type variable added to the pipeline.":::

1. Search for _ForEach_ in the pipeline Activities pane, and drag a ForEach activity to the pipeline canvas.
1. Select the new ForEach activity on the canvas if it is not already selected, and its  **Settings** tab, to edit its details.

   :::image type="content" source="media/control-flow-for-each-activity/for-each-activity.png" alt-text="Shows the UI for a Filter activity.":::

1. Select the **Items** field and then select the **Add dynamic content** link to open the dynamic content editor pane.

   :::image type="content" source="media/control-flow-for-each-activity/add-dynamic-content-link.png" alt-text="Shows the &nbsp;Add dynamic content&nbsp; link for the Items property.":::

1. Select your input array to be filtered in the dynamic content editor.  In this example, we select the variable created in the first step.

   :::image type="content" source="media/control-flow-activities-common/add-dynamic-content-pane.png" alt-text="Shows the dynamic content editor with the variable created in the first step selected":::

1. Select the Activities editor on the ForEach activity to add one or more activities to be executed for each item in the input **Items** array.

   :::image type="content" source="media/control-flow-for-each-activity/activity-editor-button.png" alt-text="Shows the Activities editor button on the ForEach activity in the pipeline editor window.":::

1. In any activities you create within the ForEach activity, you can reference the current item the ForEach activity is iterating through from the **Items** list.  You can reference the current item anywhere you can use a dynamic expression to specify a property value.  In the dynamic content editor, select the ForEach iterator to return the current item.

   :::image type="content" source="media/control-flow-for-each-activity/add-dynamic-content-for-each-iterator.png" alt-text="Shows the dynamic content editor with the ForEach iterator selected.":::

## Syntax
The properties are described later in this article. The items property is the collection and each item in the collection is referred to by using the `@item()` as shown in the following syntax:  

```json
{  
   "name":"MyForEachActivityName",
   "type":"ForEach",
   "typeProperties":{  
      "isSequential":"true",
        "items": {
            "value": "@pipeline().parameters.mySinkDatasetFolderPathCollection",
            "type": "Expression"
        },
      "activities":[  
         {  
            "name":"MyCopyActivity",
            "type":"Copy",
            "typeProperties":{  
               ...
            },
            "inputs":[  
               {  
                  "referenceName":"MyDataset",
                  "type":"DatasetReference",
                  "parameters":{  
                     "MyFolderPath":"@pipeline().parameters.mySourceDatasetFolderPath"
                  }
               }
            ],
            "outputs":[  
               {  
                  "referenceName":"MyDataset",
                  "type":"DatasetReference",
                  "parameters":{  
                     "MyFolderPath":"@item()"
                  }
               }
            ]
         }
      ]
   }
}

```

## Type properties

Property | Description | Allowed values | Required
-------- | ----------- | -------------- | --------
name | Name of the for-each activity. | String | Yes
type | Must be set to **ForEach** | String | Yes
isSequential | Specifies whether the loop should be executed sequentially or in parallel.  Maximum of 50 loop iterations can be executed at once in parallel). For example, if you have a ForEach activity iterating over a copy activity with 10 different source and sink datasets with **isSequential** set to False, all copies are executed at once. Default is False. <br/><br/> If "isSequential" is set to False, ensure that there is a correct configuration to run multiple executables. Otherwise, this property should be used with caution to avoid incurring write conflicts. For more information, see [Parallel execution](#parallel-execution) section. | Boolean | No. Default is False.
batchCount | Batch count to be used for controlling the number of parallel execution (when isSequential is set to false). This is the upper concurrency limit, but the for-each activity will not always execute at this number | Integer (maximum 50) | No. Default is 20.
Items | An expression that returns a JSON Array to be iterated over. | Expression (which returns a JSON Array) | Yes
Activities | The activities to be executed. | List of Activities | Yes

## Parallel execution
If **isSequential** is set to false, the activity iterates in parallel with a maximum of 50 concurrent iterations. This setting should be used with caution. If the concurrent iterations are writing to the same folder but to different files, this approach is fine. If the concurrent iterations are writing concurrently to the exact same file, this approach most likely causes an error. 

## Iteration expression language
In the ForEach activity, provide an array to be iterated over for the property **items**." Use `@item()` to iterate over a single enumeration in ForEach activity. For example, if **items** is an array: [1, 2, 3], `@item()` returns 1 in the first iteration, 2 in the second iteration, and 3 in the third iteration. You can also use `@range(0,10)` like expression to iterate ten times starting with 0 ending with 9.

## Iterating over a single activity
**Scenario:** Copy from the same source file in Azure Blob to multiple destination files in Azure Blob.

### Pipeline definition

```json
{
    "name": "<MyForEachPipeline>",
    "properties": {
        "activities": [
            {
                "name": "<MyForEachActivity>",
                "type": "ForEach",
                "typeProperties": {
                    "isSequential": "true",
                    "items": {
                        "value": "@pipeline().parameters.mySinkDatasetFolderPath",
                        "type": "Expression"
                    },
                    "activities": [
                        {
                            "name": "MyCopyActivity",
                            "type": "Copy",
                            "typeProperties": {
                                "source": {
                                    "type": "BlobSource",
                                    "recursive": "false"
                                },
                                "sink": {
                                    "type": "BlobSink",
                                    "copyBehavior": "PreserveHierarchy"
                                }
                            },
                            "inputs": [
                                {
                                    "referenceName": "<MyDataset>",
                                    "type": "DatasetReference",
                                    "parameters": {
                                        "MyFolderPath": "@pipeline().parameters.mySourceDatasetFolderPath"
                                    }
                                }
                            ],
                            "outputs": [
                                {
                                    "referenceName": "MyDataset",
                                    "type": "DatasetReference",
                                    "parameters": {
                                        "MyFolderPath": "@item()"
                                    }
                                }
                            ]
                        }
                    ]
                }
            }
        ],
        "parameters": {
            "mySourceDatasetFolderPath": {
                "type": "String"
            },
            "mySinkDatasetFolderPath": {
                "type": "String"
            }
        }
    }
}

```

### Blob dataset definition

```json
{  
   "name":"<MyDataset>",
   "properties":{  
      "type":"AzureBlob",
      "typeProperties":{  
         "folderPath":{  
            "value":"@dataset().MyFolderPath",
            "type":"Expression"
         }
      },
      "linkedServiceName":{  
         "referenceName":"StorageLinkedService",
         "type":"LinkedServiceReference"
      },
      "parameters":{  
         "MyFolderPath":{  
            "type":"String"
         }
      }
   }
}

```

### Run parameter values

```json
{
    "mySourceDatasetFolderPath": "input/",
    "mySinkDatasetFolderPath": [ "outputs/file1", "outputs/file2" ]
}

```

## Iterate over multiple activities
It's possible to iterate over multiple activities (for example: copy and web activities) in a ForEach activity. In this scenario, we recommend that you abstract out multiple activities into a separate pipeline. Then, you can use the [ExecutePipeline activity](control-flow-execute-pipeline-activity.md) in the pipeline with ForEach activity to invoke the separate pipeline with multiple activities. 


### Syntax

```json
{
  "name": "masterPipeline",
  "properties": {
    "activities": [
      {
        "type": "ForEach",
        "name": "<MyForEachMultipleActivities>"
        "typeProperties": {
          "isSequential": true,
          "items": {
            ...
          },
          "activities": [
            {
              "type": "ExecutePipeline",
              "name": "<MyInnerPipeline>"
              "typeProperties": {
                "pipeline": {
                  "referenceName": "<copyHttpPipeline>",
                  "type": "PipelineReference"
                },
                "parameters": {
                  ...
                },
                "waitOnCompletion": true
              }
            }
          ]
        }
      }
    ],
    "parameters": {
      ...
    }
  }
}

```

### Example
**Scenario:** Iterate over an InnerPipeline within a ForEach activity with Execute Pipeline activity. The inner pipeline copies with schema definitions parameterized.

#### Master Pipeline definition

```json
{
  "name": "masterPipeline",
  "properties": {
    "activities": [
      {
        "type": "ForEach",
        "name": "MyForEachActivity",
        "typeProperties": {
          "isSequential": true,
          "items": {
            "value": "@pipeline().parameters.inputtables",
            "type": "Expression"
          },
          "activities": [
            {
              "type": "ExecutePipeline",
              "typeProperties": {
                "pipeline": {
                  "referenceName": "InnerCopyPipeline",
                  "type": "PipelineReference"
                },
                "parameters": {
                  "sourceTableName": {
                    "value": "@item().SourceTable",
                    "type": "Expression"
                  },
                  "sourceTableStructure": {
                    "value": "@item().SourceTableStructure",
                    "type": "Expression"
                  },
                  "sinkTableName": {
                    "value": "@item().DestTable",
                    "type": "Expression"
                  },
                  "sinkTableStructure": {
                    "value": "@item().DestTableStructure",
                    "type": "Expression"
                  }
                },
                "waitOnCompletion": true
              },
              "name": "ExecuteCopyPipeline"
            }
          ]
        }
      }
    ],
    "parameters": {
      "inputtables": {
        "type": "Array"
      }
    }
  }
}

```

#### Inner pipeline definition

```json
{
  "name": "InnerCopyPipeline",
  "properties": {
    "activities": [
      {
        "type": "Copy",
        "typeProperties": {
          "source": {
            "type": "SqlSource",
            }
          },
          "sink": {
            "type": "SqlSink"
          }
        },
        "name": "CopyActivity",
        "inputs": [
          {
            "referenceName": "sqlSourceDataset",
            "parameters": {
              "SqlTableName": {
                "value": "@pipeline().parameters.sourceTableName",
                "type": "Expression"
              },
              "SqlTableStructure": {
                "value": "@pipeline().parameters.sourceTableStructure",
                "type": "Expression"
              }
            },
            "type": "DatasetReference"
          }
        ],
        "outputs": [
          {
            "referenceName": "sqlSinkDataset",
            "parameters": {
              "SqlTableName": {
                "value": "@pipeline().parameters.sinkTableName",
                "type": "Expression"
              },
              "SqlTableStructure": {
                "value": "@pipeline().parameters.sinkTableStructure",
                "type": "Expression"
              }
            },
            "type": "DatasetReference"
          }
        ]
      }
    ],
    "parameters": {
      "sourceTableName": {
        "type": "String"
      },
      "sourceTableStructure": {
        "type": "String"
      },
      "sinkTableName": {
        "type": "String"
      },
      "sinkTableStructure": {
        "type": "String"
      }
    }
  }
}

```

#### Source dataset definition

```json
{
  "name": "sqlSourceDataset",
  "properties": {
    "type": "SqlServerTable",
    "typeProperties": {
      "tableName": {
        "value": "@dataset().SqlTableName",
        "type": "Expression"
      }
    },
    "structure": {
      "value": "@dataset().SqlTableStructure",
      "type": "Expression"
    },
    "linkedServiceName": {
      "referenceName": "sqlserverLS",
      "type": "LinkedServiceReference"
    },
    "parameters": {
      "SqlTableName": {
        "type": "String"
      },
      "SqlTableStructure": {
        "type": "String"
      }
    }
  }
}

```

#### Sink dataset definition

```json
{
  "name": "sqlSinkDataSet",
  "properties": {
    "type": "AzureSqlTable",
    "typeProperties": {
      "tableName": {
        "value": "@dataset().SqlTableName",
        "type": "Expression"
      }
    },
    "structure": {
      "value": "@dataset().SqlTableStructure",
      "type": "Expression"
    },
    "linkedServiceName": {
      "referenceName": "azureSqlLS",
      "type": "LinkedServiceReference"
    },
    "parameters": {
      "SqlTableName": {
        "type": "String"
      },
      "SqlTableStructure": {
        "type": "String"
      }
    }
  }
}

```

#### Master pipeline parameters
```json
{
    "inputtables": [
        {
            "SourceTable": "department",
            "SourceTableStructure": [
              {
                "name": "departmentid",
                "type": "int"
              },
              {
                "name": "departmentname",
                "type": "string"
              }
            ],
            "DestTable": "department2",
            "DestTableStructure": [
              {
                "name": "departmentid",
                "type": "int"
              },
              {
                "name": "departmentname",
                "type": "string"
              }
            ]
        }
    ]
    
}
```

## Aggregating outputs

To aggregate outputs of __foreach__ activity, please utilize _Variables_ and _Append Variable_ activity.

First, declare an `array` _variable_ in the pipeline. Then, invoke _Append Variable_ activity inside each __foreach__ loop. Subsequently, you can retrieve the aggregation from your array.

## Limitations and workarounds

Here are some limitations of the ForEach activity and suggested workarounds.

| Limitation | Workaround |
|---|---|
| You can't nest a ForEach loop inside another ForEach loop (or an Until loop). | Design a two-level pipeline where the outer pipeline with the outer ForEach loop iterates over an inner pipeline with the nested loop. |
| The ForEach activity has a maximum `batchCount` of 50 for parallel processing, and a maximum of 100,000 items. | Design a two-level pipeline where the outer pipeline with the ForEach activity iterates over an inner pipeline. |
| SetVariable can't be used inside a ForEach activity that runs in parallel as the variables are global to the whole pipeline, they are not scoped to a ForEach or any other activity. | Consider using sequential ForEach or use Execute Pipeline inside ForEach (Variable/Parameter handled in child Pipeline).|
| | |

## Next steps
See other supported control flow activities: 

- [Execute Pipeline Activity](control-flow-execute-pipeline-activity.md)
- [Get Metadata Activity](control-flow-get-metadata-activity.md)
- [Lookup Activity](control-flow-lookup-activity.md)
- [Web Activity](control-flow-web-activity.md)
