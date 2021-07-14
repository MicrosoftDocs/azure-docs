---
title: MLflow and Azure Machine Learning
titleSuffix: Azure Machine Learning
description: Learn about MLflow with Azure Machine Learning to log metrics and artifacts from ML models, and deploy your ML models as a web service.
services: machine-learning
author: shivp950
ms.author: shipatel
ms.service: machine-learning
ms.subservice: core
ms.reviewer: nibaccam
ms.date: 05/25/2021
ms.topic: conceptual
ms.custom: how-to, devx-track-python
---

# MLflow and Azure Machine Learning

[MLflow](https://www.mlflow.org) is an open-source library for managing the life cycle of your machine learning experiments.  MLflow's tracking URI and logging API, collectively known as [MLflow Tracking](https://mlflow.org/docs/latest/quickstart.html#using-the-tracking-api) is a component of MLflow that logs and tracks your training run metrics and model artifacts, no matter your experiment's environment--locally on your computer, on a remote compute target, a virtual machine, or an Azure Databricks cluster. 

Together, MLflow Tracking and Azure Machine learning allow you to track an experiment's run metrics and store model artifacts in your Azure Machine Learning workspace. That experiment could've been run locally on your computer, on a remote compute target, a virtual machine, or an [Azure Databricks cluster](how-to-use-mlflow-azure-databricks.md). 

## Compare MLflow and Azure Machine Learning clients

 The following table summarizes the different clients that can use Azure Machine Learning, and their respective function capabilities.

 MLflow Tracking offers metric logging and artifact storage functionalities that are only otherwise available via the [Azure Machine Learning Python SDK](/python/api/overview/azure/ml/intro).

| Capability | MLflow Tracking & Deployment | Azure Machine Learning Python SDK |  Azure Machine Learning CLI | Azure Machine Learning studio|
|---|---|---|---|---|
| Manage workspace |   | ✓ | ✓ | ✓ |
| Use data stores  |   | ✓ | ✓ | |
| Log metrics      | ✓ | ✓ |   | |
| Upload artifacts | ✓ | ✓ |   | |
| View metrics     | ✓ | ✓ | ✓ | ✓ |
| Manage compute   |   | ✓ | ✓ | ✓ |
| Deploy models    | ✓ | ✓ | ✓ | ✓ |
|Monitor model performance||✓|  |   |
| Detect data drift |   | ✓ |   | ✓ |


## Track experiments

With MLflow Tracking you can connect Azure Machine Learning as the backend of your MLflow experiments. By doing so, you can do the following tasks,

+ Track and log experiment metrics and artifacts in your [Azure Machine Learning workspace](./concept-azure-machine-learning-architecture.md#workspace). If you already use MLflow Tracking for your experiments, the workspace provides a centralized, secure, and scalable location to store training metrics and models. 

+ Track and manage models in MLflow and Azure Machine Learning model registry.

+ [Track Azure Databricks training runs](how-to-use-mlflow-azure-databricks.md).

Learn more at [Track ML models with MLflow and Azure Machine Learning](how-to-use-mlflow.md). 

## Train MLflow projects

You can use MLflow's tracking URI and logging API, collectively known as MLflow Tracking, to submit training jobs with [MLflow Projects](https://www.mlflow.org/docs/latest/projects.html) and Azure Machine Learning backend support (preview). You can submit jobs locally with Azure Machine Learning tracking or migrate your runs to the cloud like via an [Azure Machine Learning Compute](./how-to-create-attach-compute-cluster.md).

Learn more at [Train ML models with MLflow projects and Azure Machine Learning](how-to-train-mlflow-projects.md).


## Deploy MLflow experiments

You can [deploy your MLflow model as an Azure web service](how-to-deploy-mlflow-models.md), so you can leverage and apply Azure Machine Learning's model management and data drift detection capabilities to your production models.

## Next steps
* [Track ML models with MLflow and Azure Machine Learning](how-to-use-mlflow.md). 
* [Train ML models with MLflow projects and Azure Machine Learning](how-to-train-mlflow-projects.md).
* [Track Azure Databricks runs with MLflow](how-to-use-mlflow-azure-databricks.md).
* [Deploy models with MLflow](how-to-deploy-mlflow-models.md).


