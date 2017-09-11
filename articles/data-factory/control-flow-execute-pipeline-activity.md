---
title: Execute Pipeline Activity in Azure Data Factory | Microsoft Docs
description: Learn how you can use the Execute Pipeline Activity to invoke one Data Factory pipeline from another Data Factory pipeline.
services: data-factory
documentationcenter: ''
author: sharonlo101
manager: jhubbard
editor: 

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/05/2017
ms.author: shlo

---
# Execute Pipeline activity in Azure Data Factory
The Execute Pipeline activity allows a Data Factory pipeline to invoke another pipeline.

> [!NOTE]
> This article applies to version 2 of Data Factory, which is currently in preview. If you are using version 1 of the Data Factory service, which is generally available (GA), see [Data Factory V1 documentation](v1/data-factory-introduction.md).

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
waitOnCompletion | Defines whether activity execution waits for the dependent pipeline execution to finish. | Default is false. | Boolean | No

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
            "sinkBlobCountainer": {
              "value": "@pipeline().parameters.masterSinkBlobContainer",
              "type": "Expression"
            }
          },
          "waitOnCompletion": true
        },
        "name": "MyExecutePipelineActivity"
      }
    ],
    "datasets": [],
    "linkedServices": [],
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
    "datasets": [
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
      },
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
    ],
    "linkedServices": [
      {
        "name": "BlobStorageLinkedService",
        "properties": {
          "type": "AzureStorage",
          "typeProperties": {
            "connectionString": {
              "value": "DefaultEndpointsProtocol=https;AccountName=*****"
              "type": "SecureString"
            }
          }
        }
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
        "sinkBlobCountainer": {
          "value": "@pipeline().parameters.masterSinkBlobContainer",
          "type": "Expression"
        }
      },

      ....
}

```
## Next steps
See other control flow activities supported by Data Factory: 

- [If condition](control-flow-if-condition.md)
- [Do Unitl Activity](control-flow-do-until-activity.md)
- [For Each Activity](control-flow-for-each-activity.md)
- [Get Metadata Activity](control-flow-get-metadata-activity.md)
- [Lookup Activity](control-flow-lookup-activity.md)
- [Web Activity](control-flow-web-activity.md)