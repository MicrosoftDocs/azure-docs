---
title: 'SDK and CLI v2 expressions'
titleSuffix: Azure Machine Learning
description: SDK and CLI v2 use expressions when a value may not be known when authoring a job or component.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: zhanxia
author: xiaoharper
ms.reviewer: larryfr
ms.date: 07/26/2023
ms.custom: cliv2, sdkv2
---

# Expressions in Azure Machine Learning SDK and CLI v2

With Azure Machine Learning SDK and CLI v2, you can use _expressions_ when a value may not be known when you're authoring a job or component. When you submit a job or call a component, the expression is evaluated and the value is substituted.

The format for an expression is `${{ <expression> }}`. Some expressions are evaluated on the _client_, when submitting the job or component. Other expressions are evaluated on the _server_ (the compute where the job or component is running.)

## Client expressions

> [!NOTE]
> The "client" that evaluates the expression is where the job is submitted or component is ran. For example, your local machine or a compute instance.

| Expression | Description | Scope |
| ---- | ---- | ---- |
| `${{inputs.<input_name>}}` | References to an input data asset or model. | Works for all jobs. |
| `${{outputs.<output_name>}}` | References to an output data asset or model. | Works for all jobs. |
| `${{search_space.<hyperparameter>}}` | References the hyperparameters to use in a sweep job. The hyperparameter values for each trial are selected based on the `search_space`. | Sweep jobs only. |
| `${{parent.inputs.<input_name>}}` | Binds the inputs of a child job (pipeline step) in a pipeline to the inputs of the top-level parent pipeline job. | Pipeline jobs only. |
| `${{parent.outputs.<output_name>}}` | Binds the outputs of a child job (pipeline step) in a pipeline to the outputs of the top-level parent pipeline job. | Pipeline jobs only. |
| `${{parent.jobs.<step-name>.inputs.<input-name>}}` | Binds to the inputs of another step in the pipeline. | Pipeline jobs only. |
| `${{parent.jobs.<step-name>.outputs.<output-name>}}` | Binds to the outputs of another step in the pipeline. | Pipeline jobs only. |

## Server expressions

[!INCLUDE [output-path-expressions](includes/output-path-expressions.md)]

## Next steps

For more information on these expressions, see the following articles and examples:

* [CLI v2 core YAML syntax](reference-yaml-core-syntax.md#expression-syntax-for-configuring-azure-machine-learning-jobs-and-components)
* [Hyperparameter tuning a model](how-to-tune-hyperparameters.md)
* [Tutorial: ML pipelines with Python SDK v2](tutorial-pipeline-python-sdk.md)
* [Create and run component-based ML pipelines (CLI)](how-to-create-component-pipelines-cli.md)
* [Example: Iris batch prediction notebook](https://github.com/Azure/azureml-examples/blob/main/sdk/python/jobs/parallel/2a_iris_batch_prediction/iris_batch_prediction.ipynb)
* [Example: Pipeline YAML file](https://github.com/Azure/azureml-examples/blob/main/cli/jobs/pipelines-with-components/nyc_taxi_data_regression/pipeline.yml)