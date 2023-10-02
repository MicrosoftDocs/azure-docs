---
title: Transform data with Synapse Spark job definition 
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to process or transform data by running a Synapse Spark job definition in Azure Data Factory and Synapse Analytics pipelines.
ms.service: data-factory
ms.subservice: tutorials
ms.custom: synapse
author: nabhishek
ms.author: jejiang
ms.topic: conceptual
ms.date: 07/13/2023
---

# Transform data by running a Synapse Spark job definition
[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

The Azure Synapse Spark job definition Activity in a [pipeline](concepts-pipelines-activities.md) runs a Synapse Spark job definition in your Azure Synapse Analytics workspace. This article builds on the [data transformation activities](transform-data.md) article, which presents a general overview of data transformation and the supported transformation activities.

## Set Apache Spark job definition canvas

To use a Spark job definition activity for Synapse in a pipeline, complete the following steps:

## General settings

1. Search for _Spark job definition_ in the pipeline Activities pane, and drag a Spark job definition activity under the Synapse to the pipeline canvas.

2. Select the new Spark job definition activity on the canvas if it isn't already selected.

3. In the **General** tab, enter sample for Name.

4. (Option) You can also enter a description.

5. Timeout: Maximum amount of time an activity can run. Default is seven days, which is also the maximum amount of time allowed. Format is in D.HH:MM:SS.

6. Retry: Maximum number of retry attempts.

7. Retry interval: The number of seconds between each retry attempt.

8. Secure output: When checked, output from the activity won't be captured in logging.

9. Secure input: When checked, input from the activity won't be captured in logging.

## Azure Synapse Analytics (Artifacts) settings

1. Select the new Spark job definition activity on the canvas if it isn't already selected. 

2. Select the **Azure Synapse Analytics (Artifacts)** tab to select or create a new Azure Synapse Analytics linked service that will execute the Spark job definition activity.

    
    :::image type="content" source="./media/transform-data-synapse-spark-job-definition/spark-job-definition-activity.png" alt-text="Screenshot that shows the UI for the linked service tab for a spark job definition activity.":::

## Settings tab

1. Select the new Spark job definition activity on the canvas if it isn't already selected. 

2. Select the **Settings** tab.

3. Expand the Spark job definition list, you can select an existing Apache Spark job definition in the linked Azure Synapse Analytics workspace.

4. (Optional) You can fill in information for Apache Spark job definition. If the following settings are empty, the settings of the spark job definition itself will be used to run; if the following settings aren't empty, these settings will replace the settings of the spark job definition itself.

     |  Property   | Description   |  
     | ----- | ----- |  
     |Main definition file| The main file used for the job. Select a PY/JAR/ZIP file from your storage. You can select **Upload file** to upload the file to a storage account. <br> Sample: `abfss://…/path/to/wordcount.jar`|
     | References from subfolders | Scanning subfolders from the root folder of the main definition file, these files will be added as reference files. The folders named "jars", "pyFiles", "files" or "archives" will be scanned, and the folders name are case sensitive. |
     |Main class name| The fully qualified identifier or the main class that is in the main definition file. <br> Sample: `WordCount`|
     |Command-line arguments| You can add command-line arguments by clicking the **New** button. It should be noted that adding command-line arguments will override the command-line arguments defined by the Spark job definition. <br> *Sample: `abfss://…/path/to/shakespeare.txt` `abfss://…/path/to/result`* <br> |
     |Apache Spark pool| You can select Apache Spark pool from the list.|
     |Python code reference| Additional python code files used for reference in the main definition file. <br> It supports passing files (.py, .py3, .zip) to the "pyFiles" property. It will override the "pyFiles" property defined in Spark job definition. <br>|
     |Reference files | Additional files used for reference in the main definition file. |
     |Apache Spark pool| You can select Apache Spark pool from the list.|
     |Dynamically allocate executors| This setting maps to the dynamic allocation property in Spark configuration for Spark Application executors allocation.|
     |Min executors| Min number of executors to be allocated in the specified Spark pool for the job.|
     |Max executors| Max number of executors to be allocated in the specified Spark pool for the job.|
     |Driver size| Number of cores and memory to be used for driver given in the specified Apache Spark pool for the job.|
    |Spark configuration| Specify values for Spark configuration properties listed in the topic: Spark Configuration - Application properties. Users can use default configuration and customized configuration. |

    :::image type="content" source="./media/transform-data-synapse-spark-job-definition/spark-job-definition-activity-settings.png" alt-text="Screenshot that shows the UI for the spark job definition activity.":::

5. You can add dynamic content by clicking the **Add Dynamic Content** button or by pressing the shortcut key <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>D</kbd>. In the **Add Dynamic Content** page, you can use any combination of expressions, functions, and system variables to add to dynamic content.

    :::image type="content" source="./media/transform-data-synapse-spark-job-definition/spark-job-definition-activity-add-dynamic-content.png" alt-text="Screenshot that displays the UI for adding dynamic content to Spark job definition activities.":::

## User properties tab

You can add properties for Apache Spark job definition activity in this panel.

:::image type="content" source="./media/transform-data-synapse-spark-job-definition/spark-job-definition-activity-user-properties.png" alt-text="Screenshot that shows the UI for the properties for a spark job definition activity.":::

## Azure Synapse spark job definition activity definition

Here's the sample JSON definition of an Azure Synapse Analytics Notebook Activity:

```json
 {
        "activities": [
            {
                "name": "Spark job definition1",
                "type": "SparkJob",
                "dependsOn": [],
                "policy": {
                    "timeout": "7.00:00:00",
                    "retry": 0,
                    "retryIntervalInSeconds": 30,
                    "secureOutput": false,
                    "secureInput": false
                },
                "typeProperties": {
                    "sparkJob": {
                        "referenceName": {
                            "value": "Spark job definition 1",
                            "type": "Expression"
                        },
                        "type": "SparkJobDefinitionReference"
                    }
                },
                "linkedServiceName": {
                    "referenceName": "AzureSynapseArtifacts1",
                    "type": "LinkedServiceReference"
                }
            }
        ],
    }
```

## Azure Synapse Spark job definition properties

The following table describes the JSON properties used in the JSON
definition:

|Property|Description|Required|
|---|---|---|
|name|Name of the activity in the pipeline.|Yes|
|description|Text describing what the activity does.|No|
|type|For Azure Synapse spark job definition Activity, the activity type is SparkJob.|Yes|

## See Azure Synapse Spark job definition activity run history

Go to Pipeline runs under the **Monitor** tab, you'll see the pipeline you've triggered. Open the pipeline that contains Azure Synapse Spark job definition activity to see the run history.

:::image type="content" source="./media/transform-data-synapse-spark-job-definition/input-output-sjd.png" alt-text="Screenshot that shows the UI for the input and output for a spark job definition activity runs.":::

You can see the notebook activity **input** or **output** by selecting the input or Output button. If your pipeline failed with a user error, select the **output** to check the **result** field to see the detailed user error traceback.


:::image type="content" source="./media/transform-data-synapse-spark-job-definition/sjd-output-user-error.png" alt-text="Screenshot that shows the UI for the output user error for a spark job definition activity runs.":::