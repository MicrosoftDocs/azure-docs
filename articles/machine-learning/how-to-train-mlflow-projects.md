---
title: Train with MLflow Projects (Preview)
titleSuffix: Azure Machine Learning
description:  Set up MLflow with Azure Machine Learning to log metrics and artifacts from ML models
services: machine-learning
author: santiagxf
ms.author: fasantia
ms.reviewer: mopeakande
ms.service: machine-learning
ms.subservice: core
ms.date: 06/16/2021
ms.topic: conceptual
ms.custom: how-to, devx-track-python, sdkv1, event-tier1-build-2022
---

# Train ML models with MLflow Projects and Azure Machine Learning (Preview)

In this article, learn how to enable MLflow's tracking URI and logging API, collectively known as [MLflow Tracking](https://mlflow.org/docs/latest/quickstart.html#using-the-tracking-api), to submit training jobs with [MLflow Projects](https://www.mlflow.org/docs/latest/projects.html) and Azure Machine Learning backend support. You can submit jobs locally with Azure Machine Learning tracking or migrate your runs to the cloud like via an [Azure Machine Learning Compute](./how-to-create-attach-compute-cluster.md).

[MLflow Projects](https://mlflow.org/docs/latest/projects.html) allow for you to organize and describe your code to let other data scientists (or automated tools) run it. MLflow Projects with Azure Machine Learning enable you to track and manage your training runs in your workspace.

[MLflow](https://www.mlflow.org) is an open-source library for managing the life cycle of your machine learning experiments. MLFlow Tracking is a component of MLflow that logs and tracks your training run metrics and model artifacts, no matter your experiment's environment--locally on your computer, on a remote compute target, a virtual machine, or an [Azure Databricks cluster](how-to-use-mlflow-azure-databricks.md).

[Learn more about the MLflow and Azure Machine Learning integration.](how-to-use-mlflow.md).

> [!TIP]
> The information in this document is primarily for data scientists and developers who want to monitor the model training process. If you are an administrator interested in monitoring resource usage and events from Azure Machine Learning, such as quotas, completed training runs, or completed model deployments, see [Monitoring Azure Machine Learning](monitor-azure-machine-learning.md).

## Prerequisites

* Install the `azureml-mlflow` package.
* [Create an Azure Machine Learning Workspace](quickstart-create-resources.md).
    * See which [access permissions you need to perform your MLflow operations with your workspace](how-to-assign-roles.md#mlflow-operations).
 * Configure MLflow for tracking in Azure Machine Learning, as explained in the next section.

### Set up tracking environment

To configure MLflow for working with Azure Machine Learning, you need to point your MLflow environment to the Azure Machine Learning MLflow Tracking URI. 

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

    ml_client = MLClient.from_config(credential=DefaultAzureCredential()
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

## Train MLflow Projects on local compute

This example shows how to submit MLflow projects locally with Azure Machine Learning.

Create the backend configuration object to store necessary information for the integration such as, the compute target and which type of managed environment to use.

```python
backend_config = {"USE_CONDA": False}
```

Add the `azureml-mlflow` package as a pip dependency to your environment configuration file in order to track metrics and key artifacts in your workspace. 

``` shell
name: mlflow-example
channels:
  - defaults
  - anaconda
  - conda-forge
dependencies:
  - python=3.6
  - scikit-learn=0.19.1
  - pip
  - pip:
    - mlflow
    - azureml-mlflow
```

Submit the local run and ensure you set the parameter `backend = "azureml" `. With this setting, you can submit runs locally and get the added support of automatic output tracking, log files, snapshots, and printed errors in your workspace.

View your runs and metrics in the [Azure Machine Learning studio](https://ml.azure.com).

```python
local_env_run = mlflow.projects.run(uri=".", 
                                    parameters={"alpha":0.3},
                                    backend = "azureml",
                                    use_conda=False,
                                    backend_config = backend_config, 
                                    )

```

## Train MLflow projects with remote compute

This example shows how to submit MLflow projects on a remote compute with Azure Machine Learning tracking.

Create the backend configuration object to store necessary information for the integration such as, the compute target and which type of managed environment to use.

The integration accepts "COMPUTE" and "USE_CONDA" as parameters where "COMPUTE" is set to the name of your remote compute cluster and "USE_CONDA" which creates a new environment for the project from the environment configuration file. If "COMPUTE" is present in the object, the project will be automatically submitted to the remote compute and ignore "USE_CONDA". MLflow accepts a dictionary object or a JSON file.

```python
# dictionary
backend_config = {"COMPUTE": "cpu-cluster", "USE_CONDA": False}
```

Add the `azureml-mlflow` package as a pip dependency to your environment configuration file in order to track metrics and key artifacts in your workspace. 

``` shell
name: mlflow-example
channels:
  - defaults
  - anaconda
  - conda-forge
dependencies:
  - python=3.6
  - scikit-learn=0.19.1
  - pip
  - pip:
    - mlflow
    - azureml-mlflow
```

Submit the mlflow project run and ensure you set the parameter `backend = "azureml" `. With this setting, you can submit your run to your remote compute and get the added support of automatic output tracking, log files, snapshots, and printed errors in your workspace.

View your runs and metrics in the [Azure Machine Learning studio](https://ml.azure.com).

```python
remote_mlflow_run = mlflow.projects.run(uri=".", 
                                    parameters={"alpha":0.3},
                                    backend = "azureml",
                                    backend_config = backend_config, 
                                    )

```


## Clean up resources

If you don't plan to use the logged metrics and artifacts in your workspace, the ability to delete them individually is currently unavailable. Instead, delete the resource group that contains the storage account and workspace, so you don't incur any charges:

1. In the Azure portal, select **Resource groups** on the far left.

   ![Delete in the Azure portal](./v1/media/how-to-use-mlflow/delete-resources.png)

1. From the list, select the resource group you created.

1. Select **Delete resource group**.

1. Enter the resource group name. Then select **Delete**.

## Example notebooks

The [MLflow with Azure ML notebooks](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/track-and-monitor-experiments/using-mlflow) demonstrate and expand upon concepts presented in this article.

  * [Train an MLflow project on a local compute](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/track-and-monitor-experiments/using-mlflow/train-projects-local/train-projects-local.ipynb)
  * [Train an MLflow project on remote compute](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/track-and-monitor-experiments/using-mlflow/train-projects-remote/train-projects-remote.ipynb).

> [!NOTE]
> A community-driven repository of examples using mlflow can be found at https://github.com/Azure/azureml-examples.

## Next steps

* [Deploy models with MLflow](how-to-deploy-mlflow-models.md).
* Monitor your production models for [data drift](v1/how-to-enable-data-collection.md).
* [Track Azure Databricks runs with MLflow](how-to-use-mlflow-azure-databricks.md).
* [Manage your models](concept-model-management-and-deployment.md).
