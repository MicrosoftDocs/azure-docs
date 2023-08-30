---
title: Track ML experiments and models with MLflow
titleSuffix: Azure Machine Learning
description:  Use MLflow to log metrics and artifacts from machine learning runs
author: santiagxf
ms.author: fasantia
ms.reviewer: mopeakande
ms.service: machine-learning
ms.subservice: mlops
ms.date: 11/04/2022
ms.topic: how-to
ms.custom: mlflow, devx-track-azurecli, cliv2, devplatv2, event-tier1-build-2022
ms.devlang: azurecli
---

# Track ML experiments and models with MLflow


__Tracking__ refers to process of saving all experiment's related information that you may find relevant for every experiment you run. Such metadata varies based on your project, but it may include:

> [!div class="checklist"]
> - Code
> - Environment details (OS version, Python packages)
> - Input data
> - Parameter configurations
> - Models
> - Evaluation metrics 
> - Evaluation visualizations (confusion matrix, importance plots)  
> - Evaluation results (including some evaluation predictions)

Some of these elements are automatically tracked by Azure Machine Learning when working with jobs (including code, environment, and input and output data). However, others like models, parameters, and metrics, need to be instrumented by the model builder as it's specific to the particular scenario. 

In this article, you'll learn how to use MLflow for tracking your experiments and runs in Azure Machine Learning workspaces.

> [!NOTE] 
> If you want to track experiments running on Azure Databricks or Azure Synapse Analytics, see the dedicated articles [Track Azure Databricks ML experiments with MLflow and Azure Machine Learning](how-to-use-mlflow-azure-databricks.md) or [Track Azure Synapse Analytics ML experiments with MLflow and Azure Machine Learning](how-to-use-mlflow-azure-synapse.md).

## Benefits of tracking experiments

We highly encourage machine learning practitioners to instrument their experimentation by tracking them, regardless if they're training with jobs in Azure Machine Learning or interactively in notebooks. Benefits include:

- All of your ML experiments are organized in a single place, allowing you to search and filter experiments to find the information and drill down to see what exactly it was that you tried before.
- Compare experiments, analyze results, and debug model training with little extra work.
- Reproduce or re-run experiments to validate results.
- Improve collaboration by seeing what everyone is doing, sharing experiment results, and access experiment data programmatically.

### Why MLflow

Azure Machine Learning workspaces are MLflow-compatible, which means you can use MLflow to track runs, metrics, parameters, and artifacts with your Azure Machine Learning workspaces. By using MLflow for tracking, you don't need to change your training routines to work with Azure Machine Learning or inject any cloud-specific syntax, which is one of the main advantages of the approach. 

See [MLflow and Azure Machine Learning](concept-mlflow.md) for all supported MLflow and Azure Machine Learning functionality including MLflow Project support (preview) and model deployment.

## Prerequisites

[!INCLUDE [mlflow-prereqs](includes/machine-learning-mlflow-prereqs.md)]

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

Azure Machine Learning tracks any training job in what MLflow calls a run. Use runs to capture all the processing that your job performs.

# [Working interactively](#tab/interactive)

When working interactively, MLflow starts tracking your training routine as soon as you try to log information that requires an active run. For instance, when you log a metric, log a parameter, or when you start a training cycle when Mlflow's autologging functionality is enabled. However, it's usually helpful to start the run explicitly, specially if you want to capture the total time of your experiment in the field __Duration__. To start the run explicitly, use `mlflow.start_run()`.

Regardless if you started the run manually or not, you'll eventually need to stop the run to inform MLflow that your experiment run has finished and marks its status as __Completed__. To do that, all `mlflow.end_run()`. We strongly recommend starting runs manually so you don't forget to end them when working on notebooks.

```python
mlflow.start_run()

# Your code

mlflow.end_run()
```

To help you avoid forgetting to end the run, it's usually helpful to use the context manager paradigm:

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

Azure Machine Learning jobs allow you to submit long running training or inference routines as isolated and reproducible executions.

### Creating a training routine

When working with jobs, you typically place all your training logic inside of a folder, for instance `src`. Place all the files you need in that folder. Particularly, one of them will be a Python file with your training code entry point. The following example shows a `hello_world.py` example:

:::code language="python" source="~/azureml-examples-main/cli/jobs/basics/src/hello-mlflow.py" highlight="9-10,12":::

The previous code example doesn't uses `mlflow.start_run()` but if used you can expect MLflow to reuse the current active run so there's no need to remove those lines if migrating to Azure Machine Learning.

### Adding tracking to your routine

Use MLflow SDK to track any metric, parameter, artifacts, or models. For detailed examples about how to log each, see [Log metrics, parameters and files with MLflow](how-to-log-view-metrics.md).

### Ensure your job's environment has MLflow installed

All Azure Machine Learning environments already have MLflow installed for you, so no action is required if you're using a curated environment. If you want to use a custom environment:

1. Create a `conda.yaml` file with the dependencies you need:

    :::code language="yaml" source="~/azureml-examples-main//sdk/python/using-mlflow/deploy/environment/conda.yaml" highlight="7-8" range="1-12":::
    
1. Reference the environment in the job you're using.

### Configuring job's name

Use the parameter `display_name` of Azure Machine Learning jobs to configure the name of the run. The following example shows how:

1. Use the `display_name` property to configure the job.

    # [Azure CLI](#tab/cli)

    To submit the job, create a YAML file with your job definition in a `job.yml` file. This file should be created outside the `src` directory.

    :::code language="yaml" source="~/azureml-examples-main/cli/jobs/basics/hello-world-org.yml" highlight="8" range="1-9":::

    # [Python SDK](#tab/python)

    ```python
    from azure.ai.ml import command, Environment

    command_job = command(
        code="src",
        command="echo "hello world",
        environment=Environment(image="library/python:latest"),
        compute="cpu-cluster",
        display_name="hello-world-example"
    )
    ```

2. Ensure you're not using `mlflow.start_run(run_name="")` inside of your training routine.

### Submitting the job

1. First, let's connect to Azure Machine Learning workspace where we're going to work on.

    # [Azure CLI](#tab/cli)
   
    ```azurecli
    az account set --subscription <subscription>
    az configure --defaults workspace=<workspace> group=<resource-group> location=<location>
    ```
   
    # [Python SDK](#tab/python)
   
    The workspace is the top-level resource for Azure Machine Learning, providing a centralized place to work with all the artifacts you create when you use Azure Machine Learning. In this section, we'll connect to the workspace in which you'll perform deployment tasks.
   
    1. Import the required libraries:
   
    ```python
    from azure.ai.ml import MLClient
    from azure.identity import DefaultAzureCredential
    ```
   
    2. Configure workspace details and get a handle to the workspace:
   
    ```python
    subscription_id = "<subscription>"
    resource_group = "<resource-group>"
    workspace = "<workspace>"
    
    ml_client = MLClient(DefaultAzureCredential(), subscription_id, resource_group, workspace)
    ```

1. Submit the job

   # [Azure CLI](#tab/cli)

   Use the Azure Machine Learning CLI [to submit your job](how-to-train-model.md). Jobs using MLflow and running on Azure Machine Learning will automatically log any tracking information to the workspace. Open your terminal and use the following to submit the job.

   ```azurecli
   az ml job create -f job.yml --web
   ```

   # [Python SDK](#tab/python)

   Use the Python SDK [to submit your job](how-to-train-model.md). Jobs using MLflow and running on Azure Machine Learning will automatically log any tracking information to the workspace.

   ```python
   returned_job = ml_client.jobs.create_or_update(command_job)
   returned_job.studio_url
   ```

1. You can monitor the job process in Azure Machine Learning studio.

---

## Autologging

You can [log metrics, parameters and files with MLflow](how-to-log-view-metrics.md) manually. However, you can also rely on MLflow automatic logging capability. Each machine learning framework supported by MLflow decides what to track automatically for you.

To enable [automatic logging](https://mlflow.org/docs/latest/tracking.html#automatic-logging) insert the following code before your training code:

```python
mlflow.autolog()
```

## View metrics and artifacts in your workspace

The metrics and artifacts from MLflow logging are tracked in your workspace. To view them anytime, navigate to your workspace and find the experiment by name in your workspace in [Azure Machine Learning studio](https://ml.azure.com). 

:::image type="content" source="media/how-to-log-view-metrics/metrics.png" alt-text="Screenshot of the metrics view.":::

Select the logged metrics to render charts on the right side. You can customize the charts by applying smoothing, changing the color, or plotting multiple metrics on a single graph. You can also resize and rearrange the layout as you wish. Once you've created your desired view, you can save it for future use and share it with your teammates using a direct link.

You can also access or __query metrics, parameters and artifacts programatically__ using the MLflow SDK. Use [mlflow.get_run()](https://mlflow.org/docs/latest/python_api/mlflow.html#mlflow.get_run) as explained bellow:

```python
import mlflow

run = mlflow.get_run("<RUN_ID>")

metrics = run.data.metrics
params = run.data.params
tags = run.data.tags

print(metrics, params, tags)
```

> [!TIP]
> For metrics, the previous example will only return the last value of a given metric. If you want to retrieve all the values of a given metric, use `mlflow.get_metric_history` method as explained at [Getting params and metrics from a run](how-to-track-experiments-mlflow.md#getting-params-and-metrics-from-a-run).

To download artifacts you've logged, like files and models, you can use [mlflow.artifacts.download_artifacts()](https://www.mlflow.org/docs/latest/python_api/mlflow.artifacts.html#mlflow.artifacts.download_artifacts)

```python
mlflow.artifacts.download_artifacts(run_id="<RUN_ID>", artifact_path="helloworld.txt")
```

For more details about how to __retrieve or compare__ information from experiments and runs in Azure Machine Learning using MLflow view [Query & compare experiments and runs with MLflow](how-to-track-experiments-mlflow.md)

## Example notebooks

If you're looking for examples about how to use MLflow in Jupyter notebooks, please see our example's repository [Using MLflow (Jupyter Notebooks)](https://github.com/Azure/azureml-examples/tree/main/sdk/python/using-mlflow).

## Limitations

Some methods available in the MLflow API may not be available when connected to Azure Machine Learning. For details about supported and unsupported operations please read [Support matrix for querying runs and experiments](how-to-track-experiments-mlflow.md#support-matrix-for-querying-runs-and-experiments).

## Next steps

* [Deploy MLflow models](how-to-deploy-mlflow-models.md).
* [Manage models with MLflow](how-to-manage-models-mlflow.md).
