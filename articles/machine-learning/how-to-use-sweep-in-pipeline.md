---
title: How to do hyperparameter sweep in pipeline 
titleSuffix: Azure Machine Learning
description: How to use sweep to do hyperparameter tuning in Azure Machine Learning pipeline using CLI v2 and Python SDK
services: machine-learning
ms.service: machine-learning
ms.subservice: mlops
ms.topic: how-to
author: xiaoharper
ms.author: zhanxia
ms.reviewer: lagayhar
ms.date: 05/26/2022
ms.custom: devx-track-python, sdkv2, cliv2, event-tier1-build-2022, ignite-2022
---

# How to do hyperparameter tuning in pipeline (v2)

[!INCLUDE [dev v2](includes/machine-learning-dev-v2.md)]

In this article, you'll learn how to do hyperparameter tuning in Azure Machine Learning pipeline.

## Prerequisite

1. Understand what is [hyperparameter tuning](how-to-tune-hyperparameters.md) and how to do hyperparameter tuning in Azure Machine Learning use SweepJob.
2. Understand what is a [Azure Machine Learning pipeline](concept-ml-pipelines.md)
3. Build a command component that takes hyperparameter as input.

## How to do hyperparameter tuning in Azure Machine Learning pipeline

This section explains how to do hyperparameter tuning in Azure Machine Learning pipeline using CLI v2 and Python SDK. Both approaches share the same prerequisite: you already have a command component created and the command component takes hyperparameters as inputs. If you don't have a command component yet. Follow below links to create a command component first.

- [Azure Machine Learning CLI v2](how-to-create-component-pipelines-cli.md)
- [Azure Machine Learning Python SDK v2](how-to-create-component-pipeline-python.md)

### CLI v2

The example used in this article can be found in [azureml-example repo](https://github.com/Azure/azureml-examples). Navigate to *[azureml-examples/cli/jobs/pipelines-with-components/pipeline_with_hyperparameter_sweep* to check the example.

Assume you already have a command component defined in `train.yaml`. A two-step pipeline job (train and predict) YAML file looks like below.

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/pipelines-with-components/pipeline_with_hyperparameter_sweep/pipeline.yml" highlight="7-48":::

The `sweep_step` is the step for hyperparameter tuning. Its type needs to be `sweep`.  And `trial` refers to the command component defined in `train.yaml`. From the `search space` field we can see three hyparmeters (`c_value`, `kernel`, and `coef`) are added to the search space. After you submit this pipeline job, Azure Machine Learning will run the trial component multiple times to sweep over hyperparameters based on the search space and terminate policy you defined in `sweep_step`. Check [sweep job YAML schema](reference-yaml-job-sweep.md) for full schema of sweep job.

Below is the trial component definition (train.yml file). 

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/pipelines-with-components/pipeline_with_hyperparameter_sweep/train.yml" highlight="11-16,23-25,60":::

The hyperparameters added to search space in pipeline.yml need to be inputs for the trial component. The source code of the trial component is under `./train-src` folder. In this example, it's a single `train.py` file. This is the code that will be executed in every trial of the sweep job. Make sure you've logged the metrics in the trial component source code with exactly the same name as `primary_metric` value in pipeline.yml file. In this example, we use `mlflow.autolog()`, which is the recommended way to track your ML experiments. See more about mlflow [here](./how-to-use-mlflow-cli-runs.md)  
 
Below code snippet is the source code of trial component. 

:::code language="python" source="~/azureml-examples-main/cli/jobs/pipelines-with-components/pipeline_with_hyperparameter_sweep/train-src/train.py" highlight="15":::

### Python SDK

The Python SDK example can be found in [azureml-example repo](https://github.com/Azure/azureml-examples). Navigate to *azureml-examples/sdk/jobs/pipelines/1c_pipeline_with_hyperparameter_sweep* to check the example.

In Azure Machine Learning Python SDK v2, you can enable hyperparameter tuning for any command component by calling `.sweep()` method.

Below code snippet shows how to enable sweep for `train_model`.

[!notebook-python[] (~/azureml-examples-main/sdk/python/jobs/pipelines/1c_pipeline_with_hyperparameter_sweep/pipeline_with_hyperparameter_sweep.ipynb?name=enable-sweep)]

 We first load `train_component_func` defined in `train.yml` file. When creating `train_model`, we add `c_value`, `kernel` and `coef0` into search space(line 15-17). Line 30-35 defines the primary metric, sampling algorithm etc.

## Check pipeline job with sweep step in Studio

After you submit a pipeline job, the SDK or CLI widget will give you a web URL link to Studio UI. The link will guide you to the pipeline graph view by default.

To check details of the sweep step, double click the sweep step and navigate to the **child job** tab in the panel on the right.

:::image type="content" source="./media/how-to-use-sweep-in-pipeline/pipeline-view.png" alt-text="Screenshot of the pipeline with child job and the train_model node highlighted." lightbox= "./media/how-to-use-sweep-in-pipeline/pipeline-view.png":::

This will link you to the sweep job page as seen in the below screenshot. Navigate to **child job** tab, here you can see the metrics of all child jobs and list of all child jobs.

:::image type="content" source="./media/how-to-use-sweep-in-pipeline/sweep-job.png" alt-text="Screenshot of the job page on the child jobs tab." lightbox= "./media/how-to-use-sweep-in-pipeline/sweep-job.png":::

If a child jobs failed, select the name of that child job to enter detail page of that specific child job (see screenshot below). The useful debug information is under **Outputs + Logs**.

:::image type="content" source="./media/how-to-use-sweep-in-pipeline/child-run.png" alt-text="Screenshot of the output + logs tab of a child run." lightbox= "./media/how-to-use-sweep-in-pipeline/child-run.png":::

## Sample notebooks

- [Build pipeline with sweep node](https://github.com/Azure/azureml-examples/blob/main/sdk/python/jobs/pipelines/1c_pipeline_with_hyperparameter_sweep/pipeline_with_hyperparameter_sweep.ipynb)
- [Run hyperparameter sweep on a command job](https://github.com/Azure/azureml-examples/blob/main/sdk/python/jobs/single-step/lightgbm/iris/lightgbm-iris-sweep.ipynb)

## Next steps

- [Track an experiment](how-to-log-view-metrics.md)
- [Deploy a trained model](how-to-deploy-online-endpoints.md)
