---
title: Track ML experiments and models with MLflow
titleSuffix: Azure Machine Learning
description:  Use MLflow to log metrics and artifacts from machine learning runs
services: machine-learning
author: santiagxf
ms.author: fasantia
ms.reviewer: mopeakande
ms.service: machine-learning
ms.subservice: mlops
ms.date: 11/04/2022
ms.topic: how-to
ms.custom: devx-track-python, mlflow, devx-track-azurecli, cliv2, devplatv2, event-tier1-build-2022
ms.devlang: azurecli
---

# Track ML experiments and models with MLflow

> [!div class="op_single_selector" title1="Select the version of Azure Machine Learning developer platform you are using:"]
> * [v1](./v1/how-to-use-mlflow.md)
> * [v2 (current version)](how-to-use-mlflow-cli-runs.md)

Azure Machine Learning workspaces are MLflow-compatible, which means you can use MLflow to track runs, metrics, parameters, and artifacts with your Azure Machine Learning workspaces. By using MLflow for tracking, you don't need to change your training routines to work with Azure Machine Learning or inject any cloud-specific syntax, which is one of the main advantages of the approach. 

See [MLflow and Azure Machine Learning](concept-mlflow.md) for all supported MLflow and Azure Machine Learning functionality including MLflow Project support (preview) and model deployment.

In this article, you will learn how to use MLflow for tracking your experiments and runs in Azure Machine Learning workspaces.

> [!NOTE] 
> If you want to track experiments running on Azure Databricks or Azure Synapse Analytics, see the dedicated articles [Track Azure Databricks ML experiments with MLflow and Azure Machine Learning](how-to-use-mlflow-azure-databricks.md) or [Track Azure Synapse Analytics ML experiments with MLflow and Azure Machine Learning](how-to-use-mlflow-azure-synapse.md).

## Prerequisites

[!INCLUDE [mlflow-prereqs](../../includes/machine-learning-mlflow-prereqs.md)]

### Connect to your workspace

First, let's connect to Azure Machine Learning workspace where your model is registered.

# [Azure Machine Learning compute](#tab/aml)

Tracking is already configured for you. Your default credentials will also be used when working with MLflow.

# [Remote compute](#tab/remote)

**Configure tracking URI**

[!INCLUDE [configure-mlflow-tracking](../../includes/machine-learning-mlflow-configure-tracking.md)]

**Configure authentication**

Once the tracking is configured, you'll also need to configure how the authentication needs to happen to the associated workspace. By default, the Azure Machine Learning plugin for MLflow will perform interactive authentication by opening the default browser to prompt for credentials. Refer to [Configure MLflow for Azure Machine Learning: Configure authentication](how-to-use-mlflow-configure-tracking.md#configure-authentication) to additional ways to configure authentication for MLflow in Azure Machine Learning workspaces.

[!INCLUDE [configure-mlflow-auth](../../includes/machine-learning-mlflow-configure-auth.md)]

---


## Configuring the experiment

MLflow organizes the information in experiments and runs (in Azure Machine Learning, runs are called __Jobs__). By default, runs are logged to an experiment named __Default__ that is automatically created for you. You can configure the experiment where tracking is happening.

# [Working interactively](#tab/interactive)

When training interactively, such as in a Jupyter Notebook, use MLflow command `mlflow.set_experiment()`. For example, the following code snippet demonstrates configuring the experiment, and then logging during a job:

```python
experiment_name = 'hello-world-example'
mlflow.set_experiment(experiment_name)
```

# [Working with jobs](#tab/jobs)

When submitting jobs using Azure Machine Learning CLI or SDK, you can set the experiment name using the property `experiment_name` of the job. You don't have to configure it on your training script.

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/basics/hello-world-org.yml" highlight="9" range="1-9":::

---

## Configure the run

Azure Machine Learning any training job in what MLflow calls a run. Use runs to capture all the processing that your job performs.

# [Working interactively](#tab/interactive)

When working interactively, MLflow starts tracking your training routine as soon as you try to log information that requires an active run. For instance, when you log a metric, log a parameter, or when you start a training cycle when Mlflow's autologging functionality is enabled. However, it is usually helpful to start the run explicitly, specially if you want to capture the total time of your experiment in the field __Duration__. To start the run explicitly, use `mlflow.start_run()`.

Regardless if you started the run manually or not, you will eventually need to stop the run to inform MLflow that your experiment run has finished and marks its status as __Completed__. To do that, all `mlflow.end_run()`. We strongly recomend to start runs manually so you don't forget to end them when working on notebooks.

```python
mlflow.start_run()

# Your code

mlflow.end_run()
```

To help you avoid forgetting to end the run, it is usually helpful to use the context manager paradigm:

```python
with mlflow.start_run() as run:
    # Your code
```

When you start a new run with `mlflow.start_run()`, it may be interesting to indicate the parameter `run_name` which will then translate to the name of the run in Azure Machine Learning user interface and help you identify the run quicker:

```python
with mlflow.start_run(run_name="hello-world-example") as run:
    # Your code
```

# [Working with jobs](#tab/jobs)

When running training jobs in Azure Machine Learning, your job is configured for tracking as soon as Azure Machine Learning starts to execute it. You are not required to call `mlflow.start_run()` or `mlflow_end_run()`.

### Creating a training routine

When working with jobs, you typically place all your training logic inside of a folder, for instance `src`. Place all the files you need in that folder. Particularly, one of them will be a Python file with your training code entry point. The following example shows a `hello_world.py` example:

:::code language="python" source="~/azureml-examples-main/cli/jobs/basics/src/hello-mlflow.py" highlight="9-10,12":::

The previous code example doesn't uses `mlflow.start_run()` but if used you can expect MLflow to reuse the current active run so there is no need to remove those lines if migrating to Azure Machine Learning.

### Adding tracking to your routine

Use MLflow SDK to track any metric, parameter, artifacts, or models. For detailed examples about how to log each, see [Log metrics, parameters and files with MLflow](how-to-log-view-metrics.md).

### Configuring the job's name

Use the parameter `display_name` of Azure Machine Learning jobs to configure the name of the run. The following example shows how:

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/basics/hello-world-org.yml" highlight="8" range="1-9":::

### Submitting the job

Use the [Azure Machine Learning CLI](how-to-train-model.md) to submit your job. Jobs using MLflow and running on Azure Machine Learning will automatically log any tracking information to the workspace. To submit the job, create a YAML file with your job definition in a `job.yml` file. This file should be created outside the `src` directory. Copy this code into the file:

:::code language="azurecli" source="~/azureml-examples-main/cli/jobs/basics/hello-mlflow.yml":::

Open your terminal and use the following to submit the job.

```Azure CLI
az ml job create -f job.yml --web
```

---

## Autologging

You can [log metrics, parameters and files with MLflow](how-to-log-view-metrics.md) manually. However, you can also rely on MLflow automatic logging capability. Each machine learning framework supported by MLflow decides what to track automatically for you.

To enable [automatic logging](https://mlflow.org/docs/latest/tracking.html#automatic-logging) insert the following code before your training code:

```python
mlflow.autolog()
```

## View metrics and artifacts in your workspace

The metrics and artifacts from MLflow logging are tracked in your workspace. To view them anytime, navigate to your workspace and find the experiment by name in your workspace in [Azure Machine Learning studio](https://ml.azure.com).  Or run the below code. 

Retrieve run metric using MLflow [get_run()](https://mlflow.org/docs/latest/python_api/mlflow.html#mlflow.get_run).

```Python
from mlflow.tracking import MlflowClient

# Use MlFlow to retrieve the job that was just completed
client = MlflowClient()
run_id = mlflow_run.info.run_id
finished_mlflow_run = MlflowClient().get_run(run_id)

metrics = finished_mlflow_run.data.metrics
tags = finished_mlflow_run.data.tags
params = finished_mlflow_run.data.params

print(metrics,tags,params)
```

To view the artifacts of a run, you can use [MlFlowClient.list_artifacts()](https://mlflow.org/docs/latest/python_api/mlflow.tracking.html#mlflow.tracking.MlflowClient.list_artifacts)

```Python
client.list_artifacts(run_id)
```

To download an artifact to the current directory, you can use [MLFlowClient.download_artifacts()](https://www.mlflow.org/docs/latest/python_api/mlflow.tracking.html#mlflow.tracking.MlflowClient.download_artifacts)

```Python
client.download_artifacts(run_id, "helloworld.txt", ".")
```

For more details about how to retrieve information from experiments and runs in Azure Machine Learning using MLflow view [Manage experiments and runs with MLflow](how-to-track-experiments-mlflow.md).

## Example notebooks

If you are looking for examples about how to use MLflow in Jupyter notebooks, please see our example's repository [Using MLflow (Jupyter Notebooks)](https://github.com/Azure/azureml-examples/tree/main/sdk/python/using-mlflow).

## Limitations

Some methods available in the MLflow API may not be available when connected to Azure Machine Learning. For details about supported and unsupported operations please read [Support matrix for querying runs and experiments](how-to-track-experiments-mlflow.md#support-matrix-for-querying-runs-and-experiments).

## Next steps

* [Deploy MLflow models)](how-to-deploy-mlflow-models.md).
* [Manage models with MLflow](how-to-manage-models-mlflow.md).
