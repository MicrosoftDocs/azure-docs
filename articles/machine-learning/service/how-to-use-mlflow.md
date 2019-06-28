---
title: Use MLflow with Azure Machine Learning service
titleSuffix: Azure Machine Learning service
description: Learn how to log metrics and artifacts using MLflow library to Azure Machine Learning service
services: machine-learning
author: rastala
ms.author: roastala
ms.service: machine-learning
ms.subservice: core
ms.reviewer: nibaccam
ms.topic: conceptual
ms.date: 06/10/2019
ms.custom: seodec18
---

# Use MLflow with Azure Machine Learning service (Preview)

This article demonstrates how to use MLflow's tracking URI and logging API, collectively also known as MLflow Tracking, with Azure Machine Learning service to track and log your experiment metrics and artifacts in your [Azure Machine Learning service workspace](https://docs.microsoft.com/azure/machine-learning/service/concept-azure-machine-learning-architecture#workspace). If you already use MLflow Tracking for your experiments, the workspace provides a centralized, secure, and scalable location to store your training metrics and models.

[MLflow](https://www.mlflow.org) is an open-source library for managing the life cycle of your machine learning experiments. [MLFlow Tracking](https://mlflow.org/docs/latest/quickstart.html#using-the-tracking-api) is a component of MLflow that logs and tracks your training run metrics and model artifacts, whether your experiments are run locally, on a virtual machine, or on a remote compute cluster.
![mlflow with azure machine learning diagram](media/how-to-use-mlflow/mlflow-diagram.png)

## Compare MLflow and Azure Machine Learning clients

 The below table summarizes the different clients that can use Azure Machine Learning service, and their respective function capabilities.

 MLflow Tracking offers metric logging and artifact storage functionalities that are only otherwise available via the [Azure Machine Learning Python SDK](https://docs.microsoft.com/python/api/overview/azure/ml/intro?view=azure-ml-py).

| | MLflow Tracking | Azure Machine Learning <br> Python SDK |  Azure Machine Learning <br> CLI | Azure portal|
|-|-|-|-|-|
| Manage workspace |   | ✓ |  ✓ | ✓  |
| Use data stores  |   | ✓ |  ✓ |    |
| Log metrics      | ✓ | ✓ |    |    |
| Upload artifacts | ✓ | ✓ |    |    |
| View metrics     | ✓ | ✓ | ✓  | ✓ |
| Manage compute   |   | ✓ | ✓  | ✓ |
| Deploy models    |   | ✓ |   ✓ | ✓ |

## Prerequisites

* [Install MLflow.](https://mlflow.org/docs/latest/quickstart.html)
* [Install the Azure Machine Learning Python SDK on your local computer and create an Azure Machine Learning Workspace](setup-create-workspace.md#sdk). The SDK provides the connectivity for MLflow to access your workspace.

## Track local runs

Install the `azureml-contrib-run` package to use MLflow Tracking with Azure Machine Learning on your experiments locally run in a Jupyter Notebook or code editor.

```shell
pip install azureml-contrib-run
```

>[!NOTE]
>The azureml.contrib namespace changes frequently, as we work to improve the service. As such, anything in this namespace should be considered as a preview, and not fully supported by Microsoft.

Import the `mlflow` and [`Workspace`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.workspace(class)?view=azure-ml-py) classes to access MLflow's tracking URI and configure your workspace.

In the following code, the `get_mlflow_tracking_uri()` method assigns a unique tracking URI address to the workspace, `ws`, and `set_tracking_uri()` points the MLflow tracking URI to that address.

```Python
import mlflow
from azureml.core import Workspace

ws = Workspace.from_config()

mlflow.set_tracking_uri(ws.get_mlflow_tracking_uri())
```

>[!NOTE]
>The tracking URI is valid up to an hour or less. If you restart your script after some idle time, use the get_mlflow_tracking_uri API to get a new URI.

Set the MLflow experiment name with `set_experiment()` and start your training run with `start_run()`. Then use `log_metric()` to activate the MLflow logging API and begin logging your training run metrics.

```Python
experiment_name = "experiment_with_mlflow"
mlflow.set_experiment(experiment_name)

with mlflow.start_run():
    mlflow.log_metric('alpha', 0.03)
```

## Track remote runs

Remote runs let you train your models on more powerful computes, such as GPU enabled virtual machines, or Machine Learning Compute clusters. See [Set up compute targets for model training](how-to-set-up-training-targets.md) to learn about different compute options.

Configure your compute and training run environment with the [`Environment`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.environment.environment?view=azure-ml-py) class. Include `mlflow` and `azure-contrib-run` pip packages in environment's [`CondaDependencies`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.conda_dependencies.condadependencies?view=azure-ml-py) section. Then construct  [`ScriptRunConfig`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.script_run_config.scriptrunconfig?view=azure-ml-py) with your remote compute as the compute target.

```Python

from azureml.core import Environment
from azureml.core.conda_dependencies import CondaDependencies
from azureml.core import ScriptRunConfig

exp = Experiment(workspace = "my_workspace",
                 name = "my_experiment")

mlflow_env = Environment(name="mlflow-env")

cd = CondaDependencies.create(pip_packages = ["mlflow", "azureml-contrib-run"])

mlflow_env.python.conda_dependencies=cd

src = ScriptRunConfig(source_directory="./my_script_location", script="my_training_script.py")

src.run_config.target = "my-remote-compute-compute"
src.run_config.environment = mlflow_env
```

In your training script, import `mlflow` to use the MLflow logging APIs, and start logging your run metrics.

```Python
import mlflow

with mlflow.start_run():
    mlflow.log_metric("example", 1.23)
```

With this compute and training run configuration, use the `Experiment.submit("train.py")` method to submit a run. This automatically sets the MLflow tracking URI and directs the logging from MLflow to your Workspace.

```Python
run = exp.submit(src)
```

## View metrics and artifacts in your workspace

The metrics and artifacts from MLflow logging are kept in your workspace on the [Azure portal](https://portal.azure.com). To view them any time, navigate to your workspace and find the experiment by name.

## Clean up resources

If you don't plan to use the logged metrics and artifacts in your workspace, the ability to delete them individually is currently unavailable. Instead, delete the resource group that contains the storage account and workspace, so you don't incur any charges:

1. In the Azure portal, select **Resource groups** on the far left.

   ![Delete in the Azure portal](media/how-to-use-mlflow/delete-resources.png)

1. From the list, select the resource group you created.

1. Select **Delete resource group**.

1. Enter the resource group name. Then select **Delete**.

## Example notebooks

The [MLflow with Azure ML notebooks](https://aka.ms/azureml-mlflow-examples) demonstrates concepts in this article.

## Next steps

* [How to deploy a model](how-to-deploy-and-where.md).
