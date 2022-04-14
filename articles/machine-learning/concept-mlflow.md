---
title: MLflow and Azure Machine Learning
titleSuffix: Azure Machine Learning
description: Learn about MLflow with Azure Machine Learning to log metrics and artifacts from ML models, and deploy your ML models as a web service.
services: machine-learning
author: abeomor
ms.author: osomorog
ms.service: machine-learning
ms.subservice: mlops
ms.date: 04/15/2022
ms.topic: conceptual
ms.custom: how-to, devx-track-python
---

# MLflow and Azure Machine Learning

Azure Machine Learning uses MLflow Tracking for metric logging and artifact storage for your experiments, whether you created the experiment via the Azure Machine Learning Python SDK, Azure Machine Learning CLI or the Azure Machine Learning studio. 

[MLflow](https://www.mlflow.org) is an open-source library for managing the life cycle of your machine learning experiments.  MLflow's tracking URI and logging API, collectively known as [MLflow Tracking](https://mlflow.org/docs/latest/quickstart.html#using-the-tracking-api) is a component of MLflow that logs and tracks your training run metrics and model artifacts, no matter your experiment's environment--locally on your computer, on a remote compute target, a virtual machine or an Azure Machine Learning compute instance.

## Track experiments

> [!IMPORTANT]
> If you require to use the Azure Machine learning Python SDK v1, see [Start, monitor, and track run history](how-to-track-monitor-analyze-runs.md) or [Track Azure Databricks training runs with MLflow](how-to-use-mlflow-azure-databricks.md).

With MLflow Tracking you can connect Azure Machine Learning as the backend of your MLflow experiments. By doing so, you can

+ Track and log experiment metrics and artifacts in your [Azure Machine Learning workspace](./concept-azure-machine-learning-architecture.md#workspace). If you already use MLflow Tracking for your experiments, the workspace provides a centralized, secure, and scalable location to store training metrics and models. Learn more at [Track ML models with MLflow and Azure Machine Learning CLI v2](how-to-use-mlflow-cli-runs.md).

+ Track and manage models in MLflow and Azure Machine Learning model registry.

## Train MLflow projects (preview)

[!INCLUDE [preview disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

You can use MLflow's tracking URI and logging API, collectively known as MLflow Tracking, to submit training jobs with [MLflow Projects](https://www.mlflow.org/docs/latest/projects.html) and Azure Machine Learning backend support (preview). You can submit jobs locally with Azure Machine Learning tracking or migrate your runs to the cloud like via an [Azure Machine Learning Compute](./how-to-create-attach-compute-cluster.md).

Learn more at [Train ML models with MLflow projects and Azure Machine Learning (preview)](how-to-train-mlflow-projects.md).

## Deploy MLflow experiments

> [!IMPORTANT]
> If you require to use the Azure Machine learning Python SDK v1, see [Deploy an MLflow model as an Azure web service](how-to-deploy-mlflow-models.md).

You can [Deploy MLflow models to an online endpoint](how-to-deploy-mlflow-models-online-endpoints.md), so you can leverage and apply Azure Machine Learning's model management capabilities and no-code deployment offering.

## Next steps
* [Track ML models with MLflow and Azure Machine Learning CLI v2](how-to-use-mlflow-cli-runs.md)
* Convert your custom model to MLflow model format for no code deployments
* [Deploy MLflow models to an online endpoint](how-to-deploy-mlflow-models-online-endpoints.md)

