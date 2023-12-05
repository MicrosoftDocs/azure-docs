---
title: Transform data with Synapse Notebook 
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to process or transform data by running a Synapse notebook in Azure Data Factory and Synapse Analytics pipelines.
ms.service: data-factory
ms.subservice: tutorials
ms.custom: synapse
author: nabhishek
ms.author: jejiang
ms.topic: conceptual
ms.date: 07/13/2023
---

# Transform data by running a Synapse Notebook
[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

The Azure Synapse Notebook Activity in a [pipeline](concepts-pipelines-activities.md) runs a Synapse notebook in your Azure Synapse Analytics workspace. This article builds on the [data transformation activities](transform-data.md) article, which presents a general overview of data transformation and the supported transformation activities.

You can create an Azure Synapse Analytics notebook activity directly through the Azure Data Factory Studio user interface. For a step-by-step walkthrough of how to create a Synapse notebook activity using the user interface, you can refer to the following.

## Add a Notebook activity for Synapse to a pipeline with UI

To use a Notebook activity for Synapse in a pipeline, complete the following steps:

## General settings

1. Search for _Notebook_ in the pipeline Activities pane, and drag a Notebook activity under the Synapse to the pipeline canvas.
2. Select the new Notebook activity on the canvas if it is not already selected.
3. In the General settings, enter sample for Name.
4. (Option) You can also enter a description.
5. Timeout: Maximum amount of time an activity can run. Default is 12 hours, and the maximum amount of time allowed is 7 days. Format is in D.HH:MM:SS.
6. Retry: Maximum number of retry attempts.
7. Retry interval (sec): The number of seconds between each retry attempt.
8. Secure output: When checked, output from the activity won't be captured in logging.
9. Secure input: The number of seconds between each retry attempt

## Azure Synapse Analytics (Artifacts) settings

Select the  **Azure Synapse Analytics (Artifacts)** tab to select or create a new [Azure Synapse Analytics linked service](compute-linked-services.md#azure-synapse-analytics-linked-service) that will execute the Notebook activity. 

:::image type="content" source="./media/transform-data-synapse-notebook/notebook-activity.png" alt-text="Screenshot of the linked service tab for a Notebook activity." lightbox="./media/transform-data-synapse-notebook/notebook-activity.png":::





## Settings tab
1. Select the new Synapse Notebook activity on the canvas if it is not already selected.

2. Select the Settings tab.

3. Expand the Notebook list, you can select an existing notebook in the linked Azure Synapse Analytics (Artifacts).

4. Click the Open button to open the page of the linked service where the selected notebook is located.

> [!NOTE]
>
> If the Workspace resource ID in the linked service is empty, the Open button will be disabled.
> 
> :::image type="content" source="./media/transform-data-synapse-notebook/resource-id-empty.png" alt-text="Screenshot of the open button is disabled." lightbox="./media/transform-data-synapse-notebook/resource-id-empty.png":::

5. Select the **Settings** tab and choose the notebook, and optional base parameters to pass to the notebook.

    :::image type="content" source="./media/transform-data-synapse-notebook/notebook-activity-settings.png" alt-text="Screenshot of the Settings tab for a Notebook activity." lightbox="./media/transform-data-synapse-notebook/notebook-activity-settings.png":::

6. (Optional) You can fill in information for Synapse notebook. If the following settings are empty, the settings of the Synapse notebook itself will be used to run; if the following settings are not empty, these settings will replace the settings of the Synapse notebook itself.

     |  Property   | Description   |  
     | ----- | ----- |  
     |Spark pool | Reference to the Spark pool. You can select Apache Spark pool from the list. | 
     |Executor size | Number of cores and memory to be used for executors allocated in the specified Apache Spark pool for the session. For dynamic content, valid values are Small/Medium/Large/XLarge/XXLarge. |  
     |Dynamically allocate executors| This setting maps to the dynamic allocation property in Spark configuration for Spark Application executors allocation.|
     |Min executors| Min number of executors to be allocated in the specified Spark pool for the job.|
     |Max executors| Max number of executors to be allocated in the specified Spark pool for the job.|
     |Driver size| Number of cores and memory to be used for driver given in the specified Apache Spark pool for the job.|

## Azure Synapse Analytics Notebook activity definition

Here is the sample JSON definition of an Azure Synapse Analytics Notebook Activity:

```json
{
    "activities": [
            {
                "name": "demo",
                "description": "description",
                "type": "SynapseNotebook",
                "dependsOn": [],
                "policy": {
                    "timeout": "7.00:00:00",
                    "retry": 0,
                    "retryIntervalInSeconds": 30,
                    "secureOutput": false,
                    "secureInput": false
                },
                "userProperties": [
                    {
                        "name": "testproperties",
                        "value": "test123"
                    }
                ],
                "typeProperties": {
                    "notebook": {
                        "referenceName": {
                            "value": "Notebookname",
                            "type": "Expression"
                        },
                        "type": "NotebookReference"
                    },
                    "parameters": {
                        "test": {
                            "value": "testvalue",
                            "type": "string"
                        }
                    },
                    "snapshot": true,
                    "sparkPool": {
                        "referenceName": {
                            "value": "SampleSpark",
                            "type": "Expression"
                        },
                        "type": "BigDataPoolReference"
                    }
                },
                "linkedServiceName": {
                    "referenceName": "AzureSynapseArtifacts1",
                    "type": "LinkedServiceReference"
                }
            }
        ]
    }
```

## Azure Synapse Analytics Notebook activity properties

The following table describes the JSON properties used in the JSON
definition:

|Property|Description|Required|
|---|---|---|
|name|Name of the activity in the pipeline.|Yes|
|description|Text describing what the activity does.|No|
|type|For Azure Synapse Analytics Notebook Activity, the activity type is SynapseNotebook.|Yes|
|notebook|The name of the notebook to be run in the Azure Synapse Analytics. |Yes|
|sparkPool|The spark pool required to run Azure Synapse Analytics Notebook.|No|
|parameter|Parameter required to run Azure Synapse Analytics Notebook. For more information see [Transform data by running a Synapse notebook](../synapse-analytics/synapse-notebook-activity.md#assign-parameters-values-from-a-pipeline)|No|

## Designate a parameters cell

Azure Data Factory looks for the parameters cell and uses the values as defaults for the parameters passed in at execution time. The execution engine will add a new cell beneath the parameters cell with input parameters to overwrite the default values. You can refer to [Transform data by running a Synapse notebook](../synapse-analytics/synapse-notebook-activity.md#designate-a-parameters-cell).

## Read Synapse notebook cell output value

You can read notebook cell output value in activity, for this panel, you can refer to [Transform data by running a Synapse notebook](../synapse-analytics/synapse-notebook-activity.md#read-synapse-notebook-cell-output-value).

## Run another Synapse notebook

You can reference other notebooks in a Synapse notebook activity via calling [%run magic](../synapse-analytics/spark/apache-spark-development-using-notebooks.md#notebook-reference) or [mssparkutils notebook utilities](../synapse-analytics/spark/microsoft-spark-utilities.md#notebook-utilities). Both support nesting function calls. The key differences of these two methods that you should consider based on your scenario are:

- [%run magic](../synapse-analytics/spark/apache-spark-development-using-notebooks.md#notebook-reference) copies all cells from the referenced notebook to the %run cell and shares the variable context. When notebook1 references notebook2 via `%run notebook2` and notebook2 calls a [mssparkutils.notebook.exit](../synapse-analytics/spark/microsoft-spark-utilities.md#exit-a-notebook) function, the cell execution in notebook1 will be stopped. We recommend you use %run magic when you want to "include" a notebook file.
- [mssparkutils notebook utilities](../synapse-analytics/spark/microsoft-spark-utilities.md#notebook-utilities) calls the referenced notebook as a method or a function. The variable context isn't shared. When notebook1 references notebook2 via `mssparkutils.notebook.run("notebook2")` and notebook2 calls a [mssparkutils.notebook.exit](../synapse-analytics/spark/microsoft-spark-utilities.md#exit-a-notebook) function, the cell execution in notebook1 will continue. We recommend you use mssparkutils notebook utilities when you want to  "import" a notebook.

## See Azure Synapse Analytics Notebook activity run history

Go to Pipeline runs under the **Monitor** tab, you'll see the pipeline you have triggered. Open the pipeline that contains notebook activity to see the run history.

:::image type="content" source="./media/transform-data-synapse-notebook/input-output-history-notebook.png" alt-text="Screenshot of the input and output for a Notebook activity." lightbox="./media/transform-data-synapse-notebook/input-output-history-notebook.png":::

For Open notebook snapshot, this feature is not currently supported.

You can see the notebook activity input or output by selecting the input or Output button. If your pipeline failed with a user error, select the output to check the result field to see the detailed user error traceback.

:::image type="content" source="./media/transform-data-synapse-notebook/notebook-output-user-error.png" alt-text="Screenshot of the output user error for a Notebook activity." lightbox="./media/transform-data-synapse-notebook/notebook-output-user-error.png":::