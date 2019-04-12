---
title: How to use MLflow with Azure Machine Learning service
titleSuffix: Azure Machine Learning service
description: Learn how to log metrics and artifacts using MLflow library to Azure Machine Learning service
services: machine-learning
author: rastala
ms.author: roastala
ms.service: machine-learning
ms.subservice: core
ms.reviewer: larryfr
ms.topic: conceptual
ms.date: 04/02/2019
ms.custom: seodec18
---

# How to use MLflow with Azure Machine Learning service (Preview)

[MLflow](https://www.mlflow.org) is an open-source library for managing the life cycle of your machine learning experiments. With [MLFlow Tracking](https://mlflow.org/docs/latest/quickstart.html#using-the-tracking-api) you can log metrics and artifacts from your training runs whether its on your local machine, a virtual machine or a remote compute environment.

[Azure Machine Learning service Workspace](https://docs.microsoft.com/azure/machine-learning/service/concept-azure-machine-learning-architecture#workspace) provides a centralized, secure, scalable location to store your metrics and models, manage your computes, and deploy models. 
This how-to demonstrates how to use MLflow Tracking with Azure Machine Learning service to view and track the experiment metrics and artifacts in your workspace.

![mlflow with azure machine learning diagram](./media/how-to-use-mlflow/mlflow-diagram.PNG)

## Prerequisites

* [Install MLflow.](https://mlflow.org/docs/latest/quickstart.html)
* [Install Azure ML Python SDK on your local computer and create Azure ML Workspace](setup-create-workspace.md). The SDK provides the connectivity for MLflow to access your workspace.

## Interactive runs

You can use MLflow with Azure Machine Learning service interactively, for example when training models in your local Jupyter Notebook or code editor.

To switch your MLflow code to use Azure Machine Learning service as back end, you need to first install the 'azureml.core.contrib' package.

```shell
pip install azureml.core.contrib
```

In your Python code, import necessary packages and set the tracking URI to point to your workspace

```Python
import mlflow
import azureml.contrib.mlflow
from azureml.core import Workspace

ws = Workspace.from_config()

mlflow.set_tracking_uri(ws.get_mlflow_tracking_uri())
```

>[!NOTE]
>The tracking URI is valid up to an hour or less. If you restart your script after some idle time, use the get_mlflow_tracking_uri API to get a new URI.

Then, you can set the MLflow experiment name and start logging metrics.

```Python
experiment_name = "experiment-with-mlflow"
mlflow.set_experiment(experiment_name)

with mlflow.start_run():
    mlflow.log_metric('alpha', 0.03)
```

In addition to logging metrics, you can log models and artifacts.

## Remote runs

Remote runs allow you to train your models on more powerful compute, such as GPU enabled virtual machines, or Machine Learning Compute clusters. See [Set up compute targets for model training](how-to-set-up-training-targets.md) to learn about different compute options.

When you submit a run to a compute target using Azure ML SDK's ```Experiment.submit("train.py")``` method, Azure ML automatically sets the MLflow tracking URI and directs the logging from MLflow to your Workspace. 

To enable the logging, include the azureml.core.contrib package to as a pip dependency to your run configuration: 

```Python
from azureml.core.runconfig import RunConfiguration
from azureml.core.conda_dependencies import CondaDependencies
from azureml.core import ScriptRunConfig

exp = Experiment(workspace=<my-workspace>, name="my-experiment")

cd = CondaDependencies.create(pip_packages=["mlflow", "azureml-contrib-run"])

run_config = RunConfiguration(framework="python",conda_dependencies=cd)

run_config.target = "my-remote-compute-name"

src = ScriptRunConfig(script="my-training-script.py", run_config=run_config)

run = exp.submit(src)
```

In your training script, simply import mlflow and azureml.contrib.mlflow and start logging:

```Python
import mlflow
import azureml.contrib.mlflow

with mlflow.start_run():
    mlflow.log_metric("example", 1.23)
```

Then, in your script you can use MLflow logging APIs as shown above, but without having to set the tracking URI.

## View metrics and artifacts in your workspace

The metrics and artifacts from MLflow logging are kept in your workspace on the [Azure portal](https://portal.azure.com). To view them, navigate to your workspace, find the experiment by name, and then view the details of your runs. If you want to view these items at a later time, storing these items incurs costs to your Azure subscription.

## Clean up resources

[!INCLUDE [aml-delete-resource-group](../../../includes/aml-delete-resource-group.md)]
At this time, deleting individual metrics and artifacts is not available.

## Example notebooks

The [MLflow with Azure ML notebooks](https://github.com/Azure/MachineLearningNotebooks/blob/master/contrib/mlflow) demonstrates concepts in this article.

## Next steps

* See [How to deploy a model](how-to-deploy-and-where.md).