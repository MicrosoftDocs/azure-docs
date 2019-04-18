---
title: How to use MLflow with Azure Machine Learning service
titleSuffix: Azure Machine Learning service
description: Learn how to log metrics and artifacts using MLflow library to Azure Machine Learning service
services: machine-learning
author: rastala
ms.author: roastala
ms.service: machine-learning
ms.subservice: core
ms.reviewer: nibaccam
ms.topic: conceptual
ms.date: 05/02/2019
ms.custom: seodec18
---

# How to use MLflow with Azure Machine Learning service (Preview)

[MLflow](https://www.mlflow.org) is an open-source library for managing the life cycle of your machine learning experiments. Whether you run your experiments locally, on a virtual machine, or on a remote compute cluster, [MLFlow Tracking](https://mlflow.org/docs/latest/quickstart.html#using-the-tracking-api) logs and tracks your training run metrics and model artifacts. If you already use MLflow Tracking with your experiments, the [Azure Machine Learning Workspace](https://docs.microsoft.com/azure/machine-learning/service/concept-azure-machine-learning-architecture#workspace) provides a centralized, secure, and scalable location to store your training metrics and models.

This article demonstrates how to use MLflow Tracking with Azure Machine Learning together to track and log your experiment metrics and artifacts in your workspace.

![mlflow with azure machine learning diagram](media/how-to-use-mlflow/mlflow-diagram.png)

## Prerequisites

* [Install MLflow.](https://mlflow.org/docs/latest/quickstart.html)
* [Install the Azure Machine Learning Python SDK on your local computer and create an Azure Machine Learning Workspace](setup-create-workspace.md#sdk). The SDK provides the connectivity for MLflow to access your workspace.

## Use MLflow Tracking on local runs

Install the `azureml.core.contrib` package to use MLflow Tracking with Azure Machine Learning on your experiments locally run in a Jupyter Notebook or code editor.

```shell
pip install azureml.core.contrib
```

>[!NOTE]
>The azureml.contrib namespace changes frequently, as we work to improve the service. As such, anything in this namespace should be considered as a preview, and not fully supported by Microsoft.

Import the mlflow, `azureml.contrib.mlflow`, and [`Workspace`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.workspace(class)?view=azure-ml-py) classes to access MLflow's tracking URI and configure your workspace.

In the following code, the `get_mlflow_tracking_uri()` method assigns a unique tracking URI address to the workspace, `ws`, and `set_tracking_uri()` points the MLflow tracking URI to that address.

```Python
import mlflow
import azureml.contrib.mlflow
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

## Use MLflow Tracking with remote runs

Remote runs let you train your models on more powerful computes, such as GPU enabled virtual machines, or Machine Learning Compute clusters. See [Set up compute targets for model training](how-to-set-up-training-targets.md) to learn about different compute options.

Configure your compute and training run environment with RunConfiguration, CondaDependencies,and ScriptRunConfig. Enable metric logging by including the azureml.core.contrib package as a pip dependency to your run configuration.

```Python
from azureml.core.runconfig import RunConfiguration
from azureml.core.conda_dependencies import CondaDependencies
from azureml.core import ScriptRunConfig

exp = Experiment(workspace = "my_workspace",
                 name = "my_experiment")

cd = CondaDependencies.create(pip_packages = ["mlflow", "azureml-contrib-run"])

run_config = RunConfiguration(framework = "python",conda_dependencies = cd)

run_config.target = "my_remote_compute_name"

src = ScriptRunConfig(script="my_training_script.py", run_config = run_config)
```

In your training script, import `mlflow` and `azureml.contrib.mlflow` to use the MLflow logging APIs, and start logging your run metrics.

```Python
import mlflow
import azureml.contrib.mlflow

with mlflow.start_run():
    mlflow.log_metric("example", 1.23)
```

With this compute and training run configuration, use the `Experiment.submit("train.py")` method to submit a run. This automatically sets the MLflow tracking URI and directs the logging from MLflow to your Workspace.

```Python
run = exp.submit(src)
```

## View metrics and artifacts in your workspace

The metrics and artifacts from MLflow logging are kept in your workspace on the [Azure portal](https://portal.azure.com). To view them, navigate to your workspace and find the experiment by name. You can also view these items at a later time, but be aware this incurs costs to your Azure subscription.

## Clean up resources

If you don't plan to use the logged metrics and artifacts in your workspace, you aren't able to delete them individually. Instead, delete the resource group that contains the storage account and workspace, so you don't incur any charges:

1. In the Azure portal, select **Resource groups** on the far left.

   ![Delete in the Azure portal](./media/aml-delete-resource-group/delete-resources.png)

1. From the list, select the resource group you created.

1. Select **Delete resource group**.

1. Enter the resource group name. Then select **Delete**.

## Example notebooks

The [MLflow with Azure ML notebooks](https://github.com/Azure/MachineLearningNotebooks/blob/master/contrib/mlflow) demonstrates concepts in this article.

## Next steps

* [How to deploy a model](how-to-deploy-and-where.md).