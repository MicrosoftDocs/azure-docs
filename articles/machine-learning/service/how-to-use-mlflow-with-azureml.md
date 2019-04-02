---
title: How to use Mlflow with Azure Machine Learning service
titleSuffix: Azure Machine Learning service
description: Learn how to log metrics and artifacts using Mlflow library to Azure Machine Learning service
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

# How to use Mlflow with Azure Machine Learning service (Preview)

[Mlflow](https://www.mlflow.org) is an open-source library for tracking your machine learning experiments and models. You can use Mlflow client with Azure Machine Learning service as a back end for storing metrics and artifacts. You can then view and track the metrics in your Azure ML Workspace.

You can use Mlflow logging on local runs, different Azure ML compute targets, such as Machine Learning compute, and also on Azure Databricks.

## Pre-requisites

 * Install Azure ML SDK on your local computer.
 * Create Azure ML Workspace.

## Local runs

To switch your Mlflow code to use Azure ML as back end, you need to first install azureml.core.contrib package:

```
pip install azureml.core.contrib
```

In your Python code, import necessary packages and set the tracking URI to point to your Azure ML Workspace

```
import mlflow
import azureml.contrib.mlflow
from azureml.core import Workspace

ws = Workspace.from_config()

mlflow.set_tracking_uri(ws.get_mlflow_tracking_uri())
```

>[!NOTE]
>The tracking URI is valid up to an hour or less. If you restart your script after some idle time, use the get_mlflow_tracking_uri API to get a new URI.

Then, you can set the Mlflow experiment name and start logging metrics:

```
experiment_name = "experiment-with-mlflow"
mlflow.set_experiment(experiment_name)

with mlflow.start_run():
    mlflow.log_metric('alpha', 0.03)
```

In addition to logging metrics, you can log models and artifacts. See [TBD notebooks](tbd) for more examples.

## Remote runs

When you submit a run to a compute target using Azure ML SDK's ```Experiment.submit("train.py")``` method, Azure ML automatically sets the Mlflow tracking URI and directs the logging from Mlflow to your Workspace. 

To enable the logging, include the azureml.core.contrib package to as a pip dependency to your run configuration, and import it in your training script.

```
Code example TBD
```

Then, in your script you can use Mlflow logging APIs as shown above, but without having to set the tracking URI.

## Azure Databricks runs

(TBD)

## View metrics and artifacts in your workspace

The metrics and artifacts from Mlflow logging appear in your Azure ML Workspace. You can simply navigate to your Workspace blade at [Azure Portal](https://portal.azure.com), find the experiment by name, and then view the details of your runs.

## Use Mlflow User Interface with Azure ML

(TBD)

## Next steps

 * Try out [example notebooks for Mlflow with Azure ML](TBD)