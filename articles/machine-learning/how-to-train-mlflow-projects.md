---
title: Train with MLflow Projects
titleSuffix: Azure Machine Learning
description:  Set up MLflow with Azure Machine Learning to log metrics and artifacts from ML models
services: machine-learning
author: shivp950
ms.author: shipatel
ms.service: machine-learning
ms.subservice: core
ms.reviewer: nibaccam
ms.date: 06/16/2021
ms.topic: conceptual
ms.custom: how-to, devx-track-python
---

# Train ML models with MLflow Projects and Azure Machine Learning

In this article, learn how to enable MLflow's tracking URI and logging API, collectively known as [MLflow Tracking](https://mlflow.org/docs/latest/quickstart.html#using-the-tracking-api), to submit training jobs with [MLflow Projects](https://www.mlflow.org/docs/latest/projects.html) and Azure Machine Learning backend support. You can submit jobs locally with Azure Machine Learning tracking or migrate your runs to the cloud like via an [Azure Machine Learning Compute](./how-to-create-attach-compute-cluster.md).

[MLflow Projects](https://mlflow.org/docs/latest/projects.html) allow for you to organize and describe your code to let other data scientists (or automated tools) run it. MLflow Projects with Azure Machine Learning enable you to track and manage your training runs in your workspace.

[MLflow](https://www.mlflow.org) is an open-source library for managing the life cycle of your machine learning experiments. MLFlow Tracking is a component of MLflow that logs and tracks your training run metrics and model artifacts, no matter your experiment's environment--locally on your computer, on a remote compute target, a virtual machine, or an [Azure Databricks cluster](how-to-use-mlflow-azure-databricks.md).

[Learn more about the MLflow and Azure Machine Learning integration.](how-to-use-mlflow.md).

> [!TIP]
> The information in this document is primarily for data scientists and developers who want to monitor the model training process. If you are an administrator interested in monitoring resource usage and events from Azure Machine Learning, such as quotas, completed training runs, or completed model deployments, see [Monitoring Azure Machine Learning](monitor-azure-machine-learning.md).

## Prerequisites

* Install the `azureml-mlflow` package.
    * This package automatically brings in `azureml-core` of the [The Azure Machine Learning Python SDK](/python/api/overview/azure/ml/install), which provides the connectivity for MLflow to access your workspace.
* [Create an Azure Machine Learning Workspace](how-to-manage-workspace.md).
    * See which [access permissions you need to perform your MLflow operations with your workspace](how-to-assign-roles.md#mlflow-operations).

## Train MLflow Projects on local compute

This example shows how to submit MLflow projects locally with Azure Machine Learning tracking.

Install the `azureml-mlflow` package to use MLflow Tracking with Azure Machine Learning on your experiments locally. Your experiments can run via a Jupyter Notebook or code editor.

```shell
pip install azureml-mlflow
```

Import the `mlflow` and [`Workspace`](/python/api/azureml-core/azureml.core.workspace%28class%29) classes to access MLflow's tracking URI and configure your workspace.

```Python
import mlflow
from azureml.core import Workspace

ws = Workspace.from_config()

mlflow.set_tracking_uri(ws.get_mlflow_tracking_uri())
```

Set the MLflow experiment name with `set_experiment()` and start your training run with `start_run()`. Then, use `log_metric()` to activate the MLflow logging API and begin logging your training run metrics.

```Python
experiment_name = 'experiment-with-mlflow-projects'
mlflow.set_experiment(experiment_name)
```

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

View your runs and metrics in the [Azure Machine Learning studio](overview-what-is-machine-learning-studio.md).

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

Install the `azureml-mlflow` package to use MLflow Tracking with Azure Machine Learning on your experiments locally. Your experiments can run via a Jupyter Notebook or code editor.

```shell
pip install azureml-mlflow
```

Import the `mlflow` and [`Workspace`](/python/api/azureml-core/azureml.core.workspace%28class%29) classes to access MLflow's tracking URI and configure your workspace.

```Python
import mlflow
from azureml.core import Workspace

ws = Workspace.from_config()

mlflow.set_tracking_uri(ws.get_mlflow_tracking_uri())
```

Set the MLflow experiment name with `set_experiment()` and start your training run with `start_run()`. Then, use `log_metric()` to activate the MLflow logging API and begin logging your training run metrics.

```Python
experiment_name = 'train-mlflow-project-amlcompute'
mlflow.set_experiment(experiment_name)
```

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

View your runs and metrics in the [Azure Machine Learning studio](overview-what-is-machine-learning-studio.md).

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

   ![Delete in the Azure portal](./media/how-to-use-mlflow/delete-resources.png)

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
* Monitor your production models for [data drift](./how-to-enable-data-collection.md).
* [Track Azure Databricks runs with MLflow](how-to-use-mlflow-azure-databricks.md).
* [Manage your models](concept-model-management-and-deployment.md).
