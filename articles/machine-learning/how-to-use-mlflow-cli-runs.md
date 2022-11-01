---
title: Track ML experiments and models with MLflow
titleSuffix: Azure Machine Learning
description:  Set up MLflow Tracking with Azure Machine Learning to log metrics and artifacts from ML models with MLflow
services: machine-learning
author: santiagxf
ms.author: fasantia
ms.reviewer: mopeakande
ms.service: machine-learning
ms.subservice: mlops
ms.date: 04/08/2022
ms.topic: how-to
ms.custom: devx-track-python, mlflow, devx-track-azurecli, cliv2, devplatv2, event-tier1-build-2022
ms.devlang: azurecli
---

# Track ML experiments and models with MLflow

> [!div class="op_single_selector" title1="Select the version of Azure Machine Learning developer platform you are using:"]
> * [v1](./v1/how-to-use-mlflow.md)
> * [v2 (current version)](how-to-use-mlflow-cli-runs.md)

In this article, learn how to enable [MLflow Tracking](https://mlflow.org/docs/latest/quickstart.html#using-the-tracking-api) to connect Azure Machine Learning as the backend of your MLflow experiments.

[MLflow](https://www.mlflow.org) is an open-source library for managing the lifecycle of your machine learning experiments. MLflow Tracking is a component of MLflow that logs and tracks your training job metrics and model artifacts, no matter your experiment's environment--locally on your computer, on a remote compute target, a virtual machine, or an [Azure Databricks cluster](how-to-use-mlflow-azure-databricks.md).

See [MLflow and Azure Machine Learning](concept-mlflow.md) for all supported MLflow and Azure Machine Learning functionality including MLflow Project support (preview) and model deployment.

> [!Tip] 
> If you want to track experiments running on Azure Databricks or Azure Synapse Analytics, see the dedicated articles [Track Azure Databricks ML experiments with MLflow and Azure Machine Learning](how-to-use-mlflow-azure-databricks.md) or [Track Azure Synapse Analytics ML experiments with MLflow and Azure Machine Learning](how-to-use-mlflow-azure-synapse.md).

> [!NOTE]
> The information in this document is primarily for data scientists and developers who want to monitor the model training process. If you are an administrator interested in monitoring resource usage and events from Azure Machine Learning, such as quotas, completed training jobs, or completed model deployments, see [Monitoring Azure Machine Learning](monitor-azure-machine-learning.md).

## Prerequisites

* Install the `mlflow` package. 
    * You can use the [MLflow Skinny](https://github.com/mlflow/mlflow/blob/master/README_SKINNY.rst) which is a lightweight MLflow package without SQL storage, server, UI, or data science dependencies. This is recommended for users who primarily need the tracking and logging capabilities without importing the full suite of MLflow features including deployments.

* Install the `azureml-mlflow` package. 
* [Create an Azure Machine Learning Workspace](quickstart-create-resources.md).
    * See which [access permissions you need to perform your MLflow operations with your workspace](how-to-assign-roles.md#mlflow-operations).

* (Optional) Install and [set up Azure ML CLI (v2)](how-to-configure-cli.md#prerequisites) and make sure you install the ml extension.
* (Optional) Install and set up Azure ML SDK(v2) for Python.


## Track runs from your local machine or remote compute

Tracking using MLflow with Azure Machine Learning lets you store the logged metrics and artifacts runs that were executed on your local machine into your Azure Machine Learning workspace.

### Set up tracking environment

To track a run that is not running on Azure Machine Learning compute (from now on referred to as *"local compute"*), you need to point your local compute to the Azure Machine Learning MLflow Tracking URI. 


> [!NOTE]
> When running on Azure Compute (Azure Notebooks, Jupyter Notebooks hosted on Azure Compute Instances or Compute Clusters) you don't have to configure the tracking URI. It's automatically configured for you.
 
# [Using the Azure ML SDK v2](#tab/azuremlsdk)

[!INCLUDE [sdk v2](../../includes/machine-learning-sdk-v2.md)]

You can get the Azure ML MLflow tracking URI using the [Azure Machine Learning SDK v2 for Python](concept-v2.md). Ensure you have the library `azure-ai-ml` installed in the cluster you are using. The following sample gets the unique MLFLow tracking URI associated with your workspace. Then the method [`set_tracking_uri()`](https://mlflow.org/docs/latest/python_api/mlflow.html#mlflow.set_tracking_uri) points the MLflow tracking URI to that URI.

1. Using the workspace configuration file:

    ```Python
    from azure.ai.ml import MLClient
    from azure.identity import DefaultAzureCredential
    import mlflow

    ml_client = MLClient.from_config(credential=DefaultAzureCredential())
    azureml_mlflow_uri = ml_client.workspaces.get(ml_client.workspace_name).mlflow_tracking_uri
    mlflow.set_tracking_uri(azureml_mlflow_uri)
    ```

    > [!TIP]
    > You can download the workspace configuration file by:
    > 1. Navigate to [Azure ML studio](https://ml.azure.com)
    > 2. Click on the uper-right corner of the page -> Download config file.
    > 3. Save the file `config.json` in the same directory where you are working on.

1. Using the subscription ID, resource group name and workspace name:

    ```Python
    from azure.ai.ml import MLClient
    from azure.identity import DefaultAzureCredential
    import mlflow

    #Enter details of your AzureML workspace
    subscription_id = '<SUBSCRIPTION_ID>'
    resource_group = '<RESOURCE_GROUP>'
    workspace_name = '<AZUREML_WORKSPACE_NAME>'

    ml_client = MLClient(credential=DefaultAzureCredential(),
                         subscription_id=subscription_id, 
                         resource_group_name=resource_group)

    azureml_mlflow_uri = ml_client.workspaces.get(workspace_name).mlflow_tracking_uri
    mlflow.set_tracking_uri(azureml_mlflow_uri)
    ```

    > [!IMPORTANT]
    > `DefaultAzureCredential` will try to pull the credentials from the available context. If you want to specify credentials in a different way, for instance using the web browser in an interactive way, you can use `InteractiveBrowserCredential` or any other method available in `azure.identity` package.

# [Using an environment variable](#tab/environ)

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

Another option is to set one of the MLflow environment variables [MLFLOW_TRACKING_URI](https://mlflow.org/docs/latest/tracking.html#logging-to-a-tracking-server) directly in your terminal. 

```Azure CLI
export MLFLOW_TRACKING_URI=$(az ml workspace show --query mlflow_tracking_uri | sed 's/"//g') 
```

>[!IMPORTANT]
> Make sure you are logged in to your Azure account on your local machine, otherwise the tracking URI returns an empty string. If you are using any Azure ML compute the tracking environment and experiment name is already configured.

# [Building the MLflow tracking URI](#tab/build)

The Azure Machine Learning Tracking URI can be constructed using the subscription ID, region of where the resource is deployed, resource group name and workspace name. The following code sample shows how:


```python
import mlflow

region = ""
subscription_id = ""
resource_group = ""
workspace_name = ""

azureml_mlflow_uri = f"azureml://{region}.api.azureml.ms/mlflow/v1.0/subscriptions/{subscription_id}/resourceGroups/{resource_group}/providers/Microsoft.MachineLearningServices/workspaces/{workspace_name}"
mlflow.set_tracking_uri(azureml_mlflow_uri)
```

> [!NOTE]
> You can also get this URL by: 
> 1. Navigate to [Azure ML studio](https://ml.azure.com)
> 2. Click on the uper-right corner of the page -> View all properties in Azure Portal -> MLflow tracking URI.
> 3. Copy the URI and use it with the method `mlflow.set_tracking_uri`.

---

### Set experiment name

All MLflow runs are logged to the active experiment. By default, runs are logged to an experiment named `Default` that is automatically created for you. To configure the experiment you want to work on use MLflow command [`mlflow.set_experiment()`](https://mlflow.org/docs/latest/python_api/mlflow.html#mlflow.set_experiment).
    
```Python
experiment_name = 'experiment_with_mlflow'
mlflow.set_experiment(experiment_name)
```

> [!TIP]
> When submitting jobs using Azure ML CLI v2, you can set the experiment name using the property `experiment_name` in the YAML definition of the job. You don't have to configure it on your training script. See [YAML: display name, experiment name, description, and tags](reference-yaml-job-command.md#yaml-display-name-experiment-name-description-and-tags) for details.

You can also set one of the MLflow environment variables [MLFLOW_EXPERIMENT_NAME or MLFLOW_EXPERIMENT_ID](https://mlflow.org/docs/latest/cli.html#cmdoption-mlflow-run-arg-uri) with the experiment name. 

```bash
export MLFLOW_EXPERIMENT_NAME="experiment_with_mlflow"
```

### Start training job

After you set the MLflow experiment name, you can start your training job with `start_run()`. Then use `log_metric()` to activate the MLflow logging API and begin logging your training job metrics.

```Python
import os
from random import random

with mlflow.start_run() as mlflow_run:
    mlflow.log_param("hello_param", "world")
    mlflow.log_metric("hello_metric", random())
    os.system(f"echo 'hello world' > helloworld.txt")
    mlflow.log_artifact("helloworld.txt")
```


For details about how to log metrics, parameters and artifacts in a run using MLflow view [How to log and view metrics](how-to-log-view-metrics.md).

## Track jobs running on Azure Machine Learning


[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

Remote runs (jobs) let you train your models in a more robust and repetitive way. They can also leverage more powerful computes, such as Machine Learning Compute clusters. See [What are compute targets in Azure Machine Learning?](concept-compute-target.md) to learn about different compute options.

When submitting runs using jobs, Azure Machine Learning automatically configures MLflow to work with the workspace the job is running in. This means that there is no need to configure the MLflow tracking URI. On top of that, experiments are automatically named based on the details of the job.

> [!IMPORTANT]
> When submitting training jobs to Azure Machine Learning, you don't have to configure the MLflow tracking URI on your training logic as it is already configured for you.

### Creating a training routine


First, you should create a `src` subdirectory and create a file with your training code in a `hello_world.py` file in the `src` subdirectory. All your training code will go into the `src` subdirectory, including `train.py`.

The training code is taken from this [MLfLow example](https://github.com/Azure/azureml-examples/blob/main/cli/jobs/basics/src/hello-mlflow.py) in the Azure Machine Learning example repo. 

Copy this code into the file:

:::code language="python" source="~/azureml-examples-main/cli/jobs/basics/src/hello-mlflow.py":::


> [!NOTE]
> Note how this sample don't contains the instructions `mlflow.start_run` nor `mlflow.set_experiment`. This is automatically done by Azure Machine Learning.

### Submitting the job

Use the [Azure Machine Learning](how-to-train-model.md) to submit a remote run. When using the Azure Machine Learning CLI (v2), the MLflow tracking URI and experiment name are set automatically and directs the logging from MLflow to your workspace. Learn more about [logging Azure Machine Learning experiments with MLflow](how-to-use-mlflow-cli-runs.md) 


Create a YAML file with your job definition in a `job.yml` file. This file should be created outside the `src` directory. Copy this code into the file:

:::code language="azurecli" source="~/azureml-examples-main/cli/jobs/basics/hello-mlflow.yml":::

Open your terminal and use the following to submit the job.

```Azure CLI
az ml job create -f job.yml --web
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


## Manage models

Register and track your models with the [Azure Machine Learning model registry](concept-model-management-and-deployment.md#register-package-and-deploy-models-from-anywhere), which supports the MLflow model registry. Azure Machine Learning models are aligned with the MLflow model schema making it easy to export and import these models across different workflows. The MLflow-related metadata, such as run ID, is also tracked with the registered model for traceability. Users can submit training jobs, register, and deploy models produced from MLflow runs.

If you want to deploy and register your production ready model in one step, see [Deploy and register MLflow models](how-to-deploy-mlflow-models.md).

To register and view a model from a job, use the following steps:

1. Once a job is complete, call the [`register_model()`](https://mlflow.org/docs/latest/python_api/mlflow.html#mlflow.register_model) method.

    

    ```Python
    # the model folder produced from a job is registered. This includes the MLmodel file, model.pkl and the conda.yaml.
    model_path = "model"
    model_uri = 'runs:/{}/{}'.format(run_id, model_path) 
    mlflow.register_model(model_uri,"registered_model_name")
    ```

1. View the registered model in your workspace with [Azure Machine Learning studio](https://ml.azure.com).

    In the following example the registered model, `my-model` has MLflow tracking metadata tagged. 

    ![register-mlflow-model](./media/how-to-use-mlflow-cli-runs/registered-mlflow-model.png)

1. Select the **Artifacts** tab to see all the model files that align with the MLflow model schema (conda.yaml, MLmodel, model.pkl).

    ![model-schema](./media/how-to-use-mlflow-cli-runs/mlflow-model-schema.png)

1. Select MLmodel to see the MLmodel file generated by the job.

    ![MLmodel-schema](./media/how-to-use-mlflow-cli-runs/mlmodel-view.png)


## Example files

[Using MLflow (Jupyter Notebooks)](https://github.com/Azure/azureml-examples/tree/main/v1/notebooks/using-mlflow)

## Limitations

Some methods available in the MLflow API may not be available when connected to Azure Machine Learning. For details about supported and unsupported operations please read [Support matrix for querying runs and experiments](how-to-track-experiments-mlflow.md#support-matrix-for-querying-runs-and-experiments).

## Next steps

* [Deploy MLflow models)](how-to-deploy-mlflow-models.md).
* [Manage models with MLflow](how-to-manage-models-mlflow.md).
