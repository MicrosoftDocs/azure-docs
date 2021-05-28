---
title: Execute Azure Machine Learning pipelines 
description: Learn how to run your Azure Machine Learning pipelines in your Azure Data Factory pipelines. 
ms.service: data-factory
ms.topic: conceptual
ms.author: abnarain
author: nabhishek
ms.date: 07/16/2020
---

# Execute Azure Machine Learning pipelines in Azure Data Factory

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

Run your Azure Machine Learning pipelines as a step in your Azure Data Factory pipelines. The Machine Learning Execute Pipeline activity enables batch prediction scenarios such as identifying possible loan defaults, determining sentiment, and analyzing customer behavior patterns.

The below video features a six-minute introduction and demonstration of this feature.

> [!VIDEO https://channel9.msdn.com/Shows/Azure-Friday/How-to-execute-Azure-Machine-Learning-service-pipelines-in-Azure-Data-Factory/player]

## Syntax

```json
{
    "name": "Machine Learning Execute Pipeline",
    "type": "AzureMLExecutePipeline",
    "linkedServiceName": {
        "referenceName": "AzureMLService",
        "type": "LinkedServiceReference"
    },
    "typeProperties": {
        "mlPipelineId": "machine learning pipeline ID",
        "experimentName": "experimentName",
        "mlPipelineParameters": {
            "mlParameterName": "mlParameterValue"
        }
    }
}

```

## Type properties

Property | Description | Allowed values | Required
-------- | ----------- | -------------- | --------
name | Name of the activity in the pipeline | String | Yes
type | Type of activity is 'AzureMLExecutePipeline' | String | Yes
linkedServiceName | Linked Service to Azure Machine Learning | Linked service reference | Yes
mlPipelineId | ID of the published Azure Machine Learning pipeline | String (or expression with resultType of string) | Yes
experimentName | Run history experiment name of the Machine Learning pipeline run | String (or expression with resultType of string) | No
mlPipelineParameters | Key, Value pairs to be passed to the published Azure Machine Learning pipeline endpoint. Keys must match the names of pipeline parameters defined in the published Machine Learning pipeline | Object with key value pairs (or Expression with resultType object) | No
mlParentRunId | The parent Azure Machine Learning pipeline run ID | String (or expression with resultType of string) | No
dataPathAssignments | Dictionary used for changing datapaths in Azure Machine learning. Enables the switching of datapaths | Object with key value pairs | No
continueOnStepFailure | Whether to continue execution of other steps in the Machine Learning pipeline run if a step fails | boolean | No

> [!NOTE]
> To populate the dropdown items in Machine Learning pipeline name and ID, the user needs to have permission to list ML pipelines. ADF UX calls AzureMLService APIs directly using the logged in user's credentials.  

## Next steps
See the following articles that explain how to transform data in other ways:

* [Execute Data Flow activity](control-flow-execute-data-flow-activity.md)
* [U-SQL activity](transform-data-using-data-lake-analytics.md)
* [Hive activity](transform-data-using-hadoop-hive.md)
* [Pig activity](transform-data-using-hadoop-pig.md)
* [MapReduce activity](transform-data-using-hadoop-map-reduce.md)
* [Hadoop Streaming activity](transform-data-using-hadoop-streaming.md)
* [Spark activity](transform-data-using-spark.md)
* [.NET custom activity](transform-data-using-dotnet-custom-activity.md)
* [Stored procedure activity](transform-data-using-stored-procedure.md)
