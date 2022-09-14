---
title: Pipeline Parameters and Variables
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn about pipeline parameters and variables in Azure Data Factory and Azure Synapse Analytics.
author: soferreira
ms.author: soferreira
ms.service: data-factory
ms.subservice: orchestration
ms.custom: synapse
ms.topic: conceptual
ms.date: 13/09/2022
---

# Pipeline Parameters and Variables in Azure Data Factory and Azure Synapse Analytics

This article helps you understand the difference between pipeline parameters and variables in Azure Data Factory and Azure Synapse Analytics and how to use them to control your pipeline.

# Pipeline Parameters

Parameters are defined for the whole pipeline, and are constant during a pipeline run. You can read them during a pipeline run but you are unable to modify them.

## Define a parameter

To define a pipeline parameter click on your pipeline to view the pipeline configuration tabs. Select the "Parameters" tab and click on "+ New" to define a new parameter.
Parameters can be of type String, Int, Float, Bool, Array, Object or SecureString. In this tab, you can also assign a default value to your parameter.

![image](https://user-images.githubusercontent.com/101214403/189849448-8e2a0620-5777-4ec1-b0e3-f32bdc231d05.png)

Before each pipeline run there will be a right panel where you can assign a new value to your parameter, otherwise the pipeline will take the default value previously defined.

## Access a parameter value

To access a parameter value use the ```@pipeline().parameters.<parameter name>``` expression.

# Pipeline variables

Pipeline variables can be set at the start of a pipeline, read and modified during a pipeline run through a [Set Variable](https://docs.microsoft.com/en-us/azure/data-factory/control-flow-set-variable-activity) activity.

> [!NOTE]
> Variables are currently scoped at the pipeline level. This means that they are not thread safe and can cause unexpected and undesired behavior if they are accessed from within a parallel iteration activity such as a foreach loop, especially when the value is also being modified within that foreach activity.
## Define a variable

To define a pipeline variable click on your pipeline to view the pipeline configuration tabs. Select the "Variables" tab and click on "+ New" to define a new variable.
Parameters can be of type String, Bool or Array. In this tab, you can also assign a default value to your variable that it will be used as initial value at the start of a pipeline run.

![image](https://user-images.githubusercontent.com/101214403/189858276-18a5a580-7cb2-4c99-a8f0-cefd019dfa19.png)


## Access a variable value

To access a variable value use the ```@variables('<variable name>')``` expression.

## Next steps
See the following tutorials for step-by-step instructions for creating pipelines with activities:

- [Build a pipeline with a copy activity](quickstart-create-data-factory-powershell.md)
- [Build a pipeline with a data transformation activity](tutorial-transform-data-spark-powershell.md)

How to achieve CI/CD (continuous integration and delivery) using Azure Data Factory
- [Continuous integration and delivery in Azure Data Factory](continuous-integration-delivery.md)
