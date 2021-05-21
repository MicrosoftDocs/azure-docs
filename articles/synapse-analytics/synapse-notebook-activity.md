---
title: Transform data by running a Synapse notebook
description: In this article, you learn how to create and develop Synapse notebook activity a Synapse pipeline.
services: synapse analytics 
author: ruixinxu 
ms.service: synapse-analytics 
ms.topic: conceptual 
ms.subservice: synapse pipeline
ms.date: 05/19/2021
ms.author: ruxu 
ms.reviewer: 
ms.custom: devx-track-python
---


# Transform data by running a Synapse notebook

The Azure Synapse Notebook Activity in a [Synapse pipeline](../data-factory/concepts-pipelines-activities.md) runs a Synapse notebook in your Azure Synapse workspace. This article builds on the [data transformation activities](../data-factory/transform-data.md) article, which presents a general overview of data transformation and the supported transformation activities. 

## Create a Synapse notebook activity

You can create a Synapse notebook activity directly from the Synapse pipeline canvas or from the notebook editor. The Synapse notebook activity runs on the Spark pool that gets chosen in the Synapse notebook. 

### Create a Synapse notebook activity

Drag and drop **Synapse Notebook** under **Activities** to the Synapse pipeline canvas. Select on the Synapse notebook activity box and config the notebook content for current activity in the **settings**. You can select an existing notebook from current workspace or add a new one. 

![create-notebook-activity](./media/synapse-notebook-activity/create-synapse-notebook-activity.png)

### Add a notebook to Synapse pipeline

Select the **Add to pipeline** button on the upper right corner to add a notebook to an existing pipeline or create a new pipeline.

![Add notebook to pipeline](./media/synapse-notebook-activity/add-to-pipeline.png)

## Passing parameters between notebooks and Synapse pipeline

### Designate a parameters cell

# [Classical Notebook](#tab/classical)

To parameterize your notebook, select the ellipses (...) to access the other cell actions menu at the far right. Then select **Toggle parameter cell** to designate the cell as the parameters cell.

![toggle-parameter](./media/synapse-notebook-activity/toggle-parameter-cell.png)

# [Preview Notebook](#tab/preview)

To parameterize your notebook, select the ellipses (...) to access the **more commands** at the cell toolbar. Then select **Toggle parameter cell** to designate the cell as the parameters cell.

![azure-notebook-toggle-parameter](./media/synapse-notebook-activity/azure-notebook-toggle-parameter-cell.png)

---

Azure Data Factory looks for the parameters cell and treats this cell as defaults for the parameters passed in at execution time. The execution engine will add a new cell beneath the parameters cell with input parameters in order to overwrite the default values. When a parameters cell isn't designated, the injected cell will be inserted at the top of the notebook.


### Assign parameters values from a pipeline

Once you've created a notebook with parameters, you can execute it from a pipeline with the Synapse Notebook activity. After you add the activity to your pipeline canvas, you will be able to set the parameters values under **Base parameters** section on the **Settings** tab. 

![Assign a parameter](./media/synapse-notebook-activity/assign-parameter.png)

When assigning parameter values, you can use the [pipeline expression language](../data-factory/control-flow-expression-language-functions.md) or [system variables](../data-factory/control-flow-system-variables.md).


## Read Synapse notebook cell output value in subsequent activities

You can read notebook cell output value in subsequent activities follow steps below:
1. Call [mssparkutils.notebook.exit](./spark/microsoft-spark-utilities.md#exit-a-notebook) API in your Synapse notebook activity to return the value that you want to show in activity output, for example:  

```python
mssparkutils.notebook.exit(“hello world”) 
```

Saving the notebook content and retrigger the pipeline, the notebook activity output will contain the exitValue that can be consumed for subsequent activities in step 2. 

2.	Read exitValue property from notebook activity output. 
Here is a sample expression that is used to check whether the exitValue fetched from the notebook activity output equals to “hello world” or not: 

![Read exit value](./media/synapse-notebook-activity/synapse-read-exit-value.png)


## Run another Synapse notebook 

You can reference other notebook in a Synapse notebook activity via calling [%run magic](./spark/apache-spark-development-using-notebooks#notebook-reference) or [mssparkutils notebook utilities](./spark/microsoft-spark-utilities.md/#notebook-utilities). Both support nesting function calls. Here are key differences of these two methods. You can decide which one to use based on your scenario.

- [%run magic](./spark/apache-spark-development-using-notebooks#notebook-reference) copies all cells from the referenced notebook to the %run cell and share the variable context. When notebook1 reference notebook2 via `%run notebook2` and notebook2 calls a [mssparkutils.notebook.exit](./spark/microsoft-spark-utilities.md#exit-a-notebook) function. The cell execution in notebook1 will be stopped. We recommend you to use %run magic when you want to "include" a notebook file.
- [mssparkutils notebook utilities](./spark/microsoft-spark-utilities.md/#notebook-utilities) calls the referenced notebook as a method or a function. The variable context is not shared. When notebook1 reference notebook2 via `mssparkutils.notebook.run(notebook2)` and notebook2 calls a [mssparkutils.notebook.exit](./spark/microsoft-spark-utilities.md#exit-a-notebook) function. The cell execution in notebook1 will continue. We recommend you to use mssparkutils notebook utilities when you want to  "import" a notebook.

>[!Note]
> Run another Synapse notebook from a Synapse pipeline only work for notebook with Preview enabled.


## See notebook activity run history
Go to **Pipeline runs** under **Monitor** tab, you can see the pipeline you have triggered. Open the pipeline that contains notebook activity to see the run history. 

You can see the notebook activity input or output via clicking the **input** or **Output** button, and also see the latest run including both cells input and output via clicking the **open notebook** button. 

![see-notebook-activity-history](./media/synapse-notebook-activity/input-output-open-notebook.png)


## Synapse Notebook activity definition


Here is the sample JSON definition of a Synapse Notebook Activity:

```json
{
    "name": "parameter_test",
    "type": "SynapseNotebook",
    "dependsOn": [],
    "policy": {
        "timeout": "7.00:00:00",
        "retry": 0,
        "retryIntervalInSeconds": 30,
        "secureOutput": false,
        "secureInput": false
    },
    "userProperties": [],
    "typeProperties": {
        "notebook": {
            "referenceName": "parameter_test",
            "type": "NotebookReference"
        },
        "parameters": {
            "input": {
                "value": {
                    "value": "@pipeline().parameters.input",
                    "type": "Expression"
                }
            }
        }
    }
}

```


## Synapse Notebook activity output

Here is the sample JSON of a Synapse Notebook Activity output:

```json

{
    "status": {
        "Status": 1,
        "Output": {
            "status": <livySessionInfo>
            },
            "result": {
                "runId": "<GUID>",
                "runStatus": "Succeed",
                "message": "Notebook execution is in Succeeded state",
                "lastCheckedOn": "2021-03-23T00:40:10.6033333Z",
                "errors": {
                    "ename": "",
                    "evalue": ""
                },
                "sessionId": 4,
                "sparkpool": "sparkpool",
                "snapshotUrl": "https://myworkspace.dev.azuresynapse.net/notebooksnapshot/{guid}",
                "exitCode": "abc" // return value from user notebook via mssparkutils.notebook.exit("abc")
            }
        },
        "Error": null,
        "ExecutionDetails": {}
    },

    "effectiveIntegrationRuntime": "DefaultIntegrationRuntime (West US 2)",
    "executionDuration": 234,
    "durationInQueue": {
        "integrationRuntimeQueue": 0
    },
    "billingReference": {
        "activityType": "ExternalActivity",
        "billableDuration": [
            {
                "meterType": "AzureIR",
                "duration": 0.06666666666666667,
                "unit": "Hours"
            }
        ]
    }
}

```