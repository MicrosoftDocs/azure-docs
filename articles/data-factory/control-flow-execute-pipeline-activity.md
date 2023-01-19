---
title: Execute Pipeline Activity
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how you can use the Execute Pipeline Activity to invoke one pipeline from another pipeline in Azure Data Factory or Synapse Analytics.
author: chez-charlie
ms.author: chez
ms.reviewer: jburchel
ms.service: data-factory
ms.subservice: orchestration
ms.custom: synapse
ms.topic: conceptual
ms.date: 10/25/2022
---

# Execute Pipeline activity in Azure Data Factory and Synapse Analytics

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

The Execute Pipeline activity allows a Data Factory or Synapse pipeline to invoke another pipeline.

## Create an Execute Pipeline activity with UI

To use an Execute Pipeline activity in a pipeline, complete the following steps:

1. Search for _pipeline_ in the pipeline Activities pane, and drag an Execute Pipeline activity to the pipeline canvas.
1. Select the new Execute Pipeline activity on the canvas if it is not already selected, and its  **Settings** tab, to edit its details.

   :::image type="content" source="media/control-flow-execute-pipeline-activity/execute-pipeline-activity.png" alt-text="Shows the UI for an execute pipeline activity.":::

1. Select an existing pipeline or create a new one using the New button.  Select other options and configure any parameters for the pipeline as required to complete your configuration.

## Syntax

```json
{
    "name": "MyPipeline",
    "properties": {
        "activities": [
            {
                "name": "ExecutePipelineActivity",
                "type": "ExecutePipeline",
                "typeProperties": {
                    "parameters": {                        
                        "mySourceDatasetFolderPath": {
                            "value": "@pipeline().parameters.mySourceDatasetFolderPath",
                            "type": "Expression"
                        }
                    },
                    "pipeline": {
                        "referenceName": "<InvokedPipelineName>",
                        "type": "PipelineReference"
                    },
                    "waitOnCompletion": true
                 }
            }
        ],
        "parameters": [
            {
                "mySourceDatasetFolderPath": {
                    "type": "String"
                }
            }
        ]
    }
}
```

## Type properties

Property | Description | Allowed values | Required
-------- | ----------- | -------------- | --------
name | Name of the execute pipeline activity. | String | Yes
type | Must be set to: **ExecutePipeline**. | String | Yes
pipeline | Pipeline reference to the dependent pipeline that this pipeline invokes. A pipeline reference object has two properties: **referenceName** and **type**. The referenceName property specifies the name of the reference pipeline. The type property must be set to PipelineReference. | PipelineReference | Yes
parameters | Parameters to be passed to the invoked pipeline | A JSON object that maps parameter names to argument values | No
waitOnCompletion | Defines whether activity execution waits for the dependent pipeline execution to finish. Default is true. | Boolean | No

## Sample
This scenario has two pipelines:

- **Master pipeline** - This pipeline has one Execute Pipeline activity that calls the invoked pipeline. The master pipeline takes two parameters: `masterSourceBlobContainer`, `masterSinkBlobContainer`.
- **Invoked pipeline** - This pipeline has one Copy activity that copies data from an Azure Blob source to Azure Blob sink. The invoked pipeline takes two parameters: `sourceBlobContainer`, `sinkBlobContainer`.

### Master pipeline definition

```json
{
  "name": "masterPipeline",
  "properties": {
    "activities": [
      {
        "type": "ExecutePipeline",
        "typeProperties": {
          "pipeline": {
            "referenceName": "invokedPipeline",
            "type": "PipelineReference"
          },
          "parameters": {
            "sourceBlobContainer": {
              "value": "@pipeline().parameters.masterSourceBlobContainer",
              "type": "Expression"
            },
            "sinkBlobContainer": {
              "value": "@pipeline().parameters.masterSinkBlobContainer",
              "type": "Expression"
            }
          },
          "waitOnCompletion": true
        },
        "name": "MyExecutePipelineActivity"
      }
    ],
    "parameters": {
      "masterSourceBlobContainer": {
        "type": "String"
      },
      "masterSinkBlobContainer": {
        "type": "String"
      }
    }
  }
}

```

### Invoked pipeline definition

```json
{
  "name": "invokedPipeline",
  "properties": {
    "activities": [
      {
        "type": "Copy",
        "typeProperties": {
          "source": {
            "type": "BlobSource"
          },
          "sink": {
            "type": "BlobSink"
          }
        },
        "name": "CopyBlobtoBlob",
        "inputs": [
          {
            "referenceName": "SourceBlobDataset",
            "type": "DatasetReference"
          }
        ],
        "outputs": [
          {
            "referenceName": "sinkBlobDataset",
            "type": "DatasetReference"
          }
        ]
      }
    ],
    "parameters": {
      "sourceBlobContainer": {
        "type": "String"
      },
      "sinkBlobContainer": {
        "type": "String"
      }
    }
  }
}

```

**Linked service**

```json
{
    "name": "BlobStorageLinkedService",
    "properties": {
    "type": "AzureStorage",
    "typeProperties": {
      "connectionString": "DefaultEndpointsProtocol=https;AccountName=*****;AccountKey=*****"
    }
  }
}
```

**Source dataset**
```json
{
    "name": "SourceBlobDataset",
    "properties": {
    "type": "AzureBlob",
    "typeProperties": {
      "folderPath": {
        "value": "@pipeline().parameters.sourceBlobContainer",
        "type": "Expression"
      },
      "fileName": "salesforce.txt"
    },
    "linkedServiceName": {
      "referenceName": "BlobStorageLinkedService",
      "type": "LinkedServiceReference"
    }
  }
}
```

**Sink dataset**
```json
{
    "name": "sinkBlobDataset",
    "properties": {
    "type": "AzureBlob",
    "typeProperties": {
      "folderPath": {
        "value": "@pipeline().parameters.sinkBlobContainer",
        "type": "Expression"
      }
    },
    "linkedServiceName": {
      "referenceName": "BlobStorageLinkedService",
      "type": "LinkedServiceReference"
    }
  }
}
```

### Running the pipeline

To run the master pipeline in this example, the following values are passed for the masterSourceBlobContainer and masterSinkBlobContainer parameters: 

```json
{
  "masterSourceBlobContainer": "executetest",
  "masterSinkBlobContainer": "executesink"
}
```

The master pipeline forwards these values to the invoked pipeline as shown in the following example: 

```json
{
    "type": "ExecutePipeline",
    "typeProperties": {
      "pipeline": {
        "referenceName": "invokedPipeline",
        "type": "PipelineReference"
      },
      "parameters": {
        "sourceBlobContainer": {
          "value": "@pipeline().parameters.masterSourceBlobContainer",
          "type": "Expression"
        },
        "sinkBlobContainer": {
          "value": "@pipeline().parameters.masterSinkBlobContainer",
          "type": "Expression"
        }
      },

      ....
}

```

> [!WARNING]
>Execute Pipeline activity passes array parameter as string to the child pipeline.This is due to the fact that the payload is passed from the parent pipeline to the >child as string. We can see it when we check the input passed to the child pipeline. Plese check this [section](./data-factory-troubleshoot-guide.md#execute-pipeline-passes-array-parameter-as-string-to-the-child-pipeline) for more details. 

## Next steps
See other supported control flow activities: 

- [For Each Activity](control-flow-for-each-activity.md)
- [Get Metadata Activity](control-flow-get-metadata-activity.md)
- [Lookup Activity](control-flow-lookup-activity.md)
- [Web Activity](control-flow-web-activity.md)
