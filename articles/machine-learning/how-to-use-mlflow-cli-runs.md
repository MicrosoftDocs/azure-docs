---
title: Track ML experiments and models with MLflow
titleSuffix: Azure Machine Learning
description:  Use MLflow to log metrics and artifacts from machine learning runs.
author: santiagxf
ms.author: fasantia
ms.reviewer: mopeakande
ms.service: machine-learning
ms.subservice: mlops
ms.date: 02/15/2024
ms.topic: how-to
ms.custom: mlflow, devx-track-azurecli, cliv2, devplatv2, update-code
ms.devlang: azurecli
---

# Track ML experiments and models with MLflow


In this article, you learn how to use MLflow for tracking your experiments and runs in Azure Machine Learning workspaces.

_Tracking_ is the process of saving relevant information about experiments that you run. The saved information (metadata) varies based on your project, and it can include:

- Code
- Environment details (such as OS version, Python packages)
- Input data
- Parameter configurations
- Models
- Evaluation metrics 
- Evaluation visualizations (such as confusion matrices, importance plots)  
- Evaluation results (including some evaluation predictions)

When you're working with jobs in Azure Machine Learning, Azure Machine Learning automatically tracks some information about your experiments, such as code, environment, and input and output data. However, for others like models, parameters, and metrics, the model builder needs to configure their tracking, as they're specific to the particular scenario. 

> [!NOTE] 
> If you want to track experiments that are running on Azure Databricks, see [Track Azure Databricks ML experiments with MLflow and Azure Machine Learning](how-to-use-mlflow-azure-databricks.md). To learn about tracking experiments that are running on Azure Synapse Analytics, see [Track Azure Synapse Analytics ML experiments with MLflow and Azure Machine Learning](how-to-use-mlflow-azure-synapse.md).

## Benefits of tracking experiments

We strongly recommend that machine learning practitioners track experiments, whether you're training with jobs in Azure Machine Learning or training interactively in notebooks. Experiment tracking allows you to:

- Organize all of your machine learning experiments in a single place. You can then search and filter experiments and drill down to see details about the experiments you ran before.
- Compare experiments, analyze results, and debug model training with little extra work.
- Reproduce or rerun experiments to validate results.
- Improve collaboration, since you can see what other teammates are doing, share experiment results, and access experiment data programmatically.

## Why use MLflow for tracking experiments?

Azure Machine Learning workspaces are MLflow-compatible, which means you can use MLflow to track runs, metrics, parameters, and artifacts within your Azure Machine Learning workspaces. A major advantage of using MLflow for tracking is that you don't need to change your training routines to work with Azure Machine Learning or inject any cloud-specific syntax.

For more information about all supported MLflow and Azure Machine Learning functionalities, see [MLflow and Azure Machine Learning](concept-mlflow.md).

## Limitations

Some methods available in the MLflow API might not be available when connected to Azure Machine Learning. For details about supported and unsupported operations, see [Support matrix for querying runs and experiments](how-to-track-experiments-mlflow.md#support-matrix-for-querying-runs-and-experiments).

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).

[!INCLUDE [mlflow-prereqs](includes/machine-learning-mlflow-prereqs.md)]

## Configure the experiment

MLflow organizes information in experiments and runs (_runs_ are called _jobs_ in Azure Machine Learning). By default, runs are logged to an experiment named __Default__ that is automatically created for you. You can configure the experiment where tracking is happening.

# [Working interactively](#tab/interactive)

For interactive training, such as in a Jupyter notebook, use the MLflow command `mlflow.set_experiment()`. For example, the following code snippet configures an experiment:

```python
experiment_name = 'hello-world-example'
mlflow.set_experiment(experiment_name)
```

# [Working with jobs](#tab/jobs)

To submit jobs, when using Azure Machine Learning CLI or SDK, set the experiment name by using the `experiment_name` property of the job. You don't have to configure it in your training script.

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/basics/hello-world-org.yml" highlight="8" range="1-9":::

---

## Configure the run

Azure Machine Learning tracks any training job in what MLflow calls a run. Use runs to capture all the processing that your job performs.

# [Working interactively](#tab/interactive)

When you're working interactively, MLflow starts tracking your training routine as soon as you try to log information that requires an active run. For instance, MLflow tracking starts when you log a metric, a parameter, or start a training cycle, and Mlflow's autologging functionality is enabled. However, it's usually helpful to start the run explicitly, specially if you want to capture the total time for your experiment in the __Duration__ field. To start the run explicitly, use `mlflow.start_run()`.

Whether you start the run manually or not, you eventually need to stop the run, so that MLflow knows that your experiment run is done and can mark the run's status as __Completed__. To stop a run, use `mlflow.end_run()`. 

We strongly recommend starting runs manually, so that you don't forget to end them when you're working in notebooks.

- To start a run manually and end it when you're done working in the notebook:

    ```python
    mlflow.start_run()
    
    # Your code
    
    mlflow.end_run()
    ```

- It's usually helpful to use the context manager paradigm to help you remember to end the run:

    ```python
    with mlflow.start_run() as run:
        # Your code
    ```

- When you start a new run with `mlflow.start_run()`, it can be useful to specify the `run_name` parameter, which later translates to the name of the run in the Azure Machine Learning user interface and help you to identify the run quicker:

    ```python
    with mlflow.start_run(run_name="hello-world-example") as run:
        # Your code
    ```

# [Working with jobs](#tab/jobs)

Azure Machine Learning jobs allow you to submit long-running training or inference routines as isolated and reproducible executions.

### Create a training routine

When working with jobs, you typically place all your training logic as files inside a folder, for instance `src`. One of these files is a Python file with your training code entry point. The following example shows a `hello_world.py` example:

:::code language="python" source="~/azureml-examples-main/cli/jobs/basics/src/hello-mlflow.py" highlight="9-10,12":::

The previous code example doesn't uses `mlflow.start_run()` but if used, MLflow reuses the current active run. Therefore, you don't need to remove the line that uses `mlflow.start_run()` if you're migrating code to Azure Machine Learning.

### Add tracking to your routine

Use the MLflow SDK to track any metric, parameter, artifacts, or models. For examples about how to log these, see [Log metrics, parameters, and files with MLflow](how-to-log-view-metrics.md).

### Ensure your job's environment has MLflow installed

All Azure Machine Learning environments already have MLflow installed for you, so no action is required if you're using a curated environment. However, if you want to use a custom environment:

1. Create a `conda.yaml` file with the dependencies you need:

    :::code language="yaml" source="~/azureml-examples-main/sdk/python/using-mlflow/deploy/environment/conda.yaml" highlight="7-8" range="1-12":::
    
1. Reference the environment in the job you're using.

### Configure your job's name

Use the Azure Machine Learning jobs parameter `display_name` to configure the name of the run.

1. Use the `display_name` property to configure the job.

    # [Azure CLI](#tab/cli)

    To submit the job, create a YAML file with your job definition in a `job.yml` file. This file should be created outside the `src` directory.

    :::code language="yaml" source="~/azureml-examples-main/cli/jobs/basics/hello-world-org.yml" highlight="7" range="1-9":::

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

2. Ensure you're not using `mlflow.start_run(run_name="")` inside your training routine.

### Submit the job

1. First, connect to the Azure Machine Learning workspace where you'll work.

    # [Azure CLI](#tab/cli)
   
    ```azurecli
    az account set --subscription <subscription>
    az configure --defaults workspace=<workspace> group=<resource-group> location=<location>
    ```
   
    # [Python SDK](#tab/python)
   
    The workspace is the top-level resource for Azure Machine Learning, providing a centralized place to work with all the artifacts you create when you use Azure Machine Learning. In this section, you connect to the workspace where you'll perform deployment tasks.
   
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

   Use the Azure Machine Learning CLI [to submit your job](how-to-train-model.md). Jobs that use MLflow and run on Azure Machine Learning automatically log any tracking information to the workspace. Open your terminal and use the following code to submit the job.

   ```azurecli
   az ml job create -f job.yml --web
   ```

   # [Python SDK](#tab/python)

   Use the Python SDK [to submit your job](how-to-train-model.md). Jobs that use MLflow and run on Azure Machine Learning automatically log any tracking information to the workspace.

   ```python
   returned_job = ml_client.jobs.create_or_update(command_job)
   returned_job.studio_url
   ```

1. Monitor the job progress in Azure Machine Learning studio.

---

## Enable MLflow autologging

You can [log metrics, parameters, and files with MLflow](how-to-log-view-metrics.md) manually. However, you can also rely on MLflow's automatic logging capability. Each machine learning framework supported by MLflow decides what to track automatically for you.

To enable [automatic logging](https://mlflow.org/docs/latest/tracking.html#automatic-logging), insert the following code before your training code:

```python
mlflow.autolog()
```

## View metrics and artifacts in your workspace

The metrics and artifacts from MLflow logging are tracked in your workspace. You can view and access them in the studio anytime or access them programatically via the MLflow SDK.

To view metrics and artifacts in the studio:

1. Go to [Azure Machine Learning studio](https://ml.azure.com).
1. Navigate to your workspace.
1. Find the experiment by name in your workspace.
1. Select the logged metrics to render charts on the right side. You can customize the charts by applying smoothing, changing the color, or plotting multiple metrics on a single graph. You can also resize and rearrange the layout as you wish.
1. Once you've created your desired view, save it for future use and share it with your teammates, using a direct link.

    :::image type="content" source="media/how-to-log-view-metrics/metrics.png" alt-text="Screenshot of the metrics view." lightbox="media/how-to-log-view-metrics/metrics.png"::: 

To __access or query__ metrics, parameters, and artifacts programatically via the MLflow SDK, use [mlflow.get_run()](https://mlflow.org/docs/latest/python_api/mlflow.html#mlflow.get_run).

```python
import mlflow

run = mlflow.get_run("<RUN_ID>")

metrics = run.data.metrics
params = run.data.params
tags = run.data.tags

print(metrics, params, tags)
```

> [!TIP]
> For metrics, the previous example code will only return the last value of a given metric. If you want to retrieve all the values of a given metric, use the `mlflow.get_metric_history` method. For more information on retrieving values of a metric, see [Getting params and metrics from a run](how-to-track-experiments-mlflow.md#get-params-and-metrics-from-a-run).

To __download__ artifacts you've logged, such as files and models, use [mlflow.artifacts.download_artifacts()](https://www.mlflow.org/docs/latest/python_api/mlflow.artifacts.html#mlflow.artifacts.download_artifacts).

```python
mlflow.artifacts.download_artifacts(run_id="<RUN_ID>", artifact_path="helloworld.txt")
```

For more information about how to __retrieve or compare__ information from experiments and runs in Azure Machine Learning, using MLflow, see [Query & compare experiments and runs with MLflow](how-to-track-experiments-mlflow.md).

## Related content

* [Deploy MLflow models](how-to-deploy-mlflow-models.md)
* [Manage models with MLflow](how-to-manage-models-mlflow.md)
* [Using MLflow (Jupyter Notebooks)](https://github.com/Azure/azureml-examples/tree/main/sdk/python/using-mlflow)

