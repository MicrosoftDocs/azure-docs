---
title: MLflow and Azure Machine Learning (v1)
titleSuffix: Azure Machine Learning
description: Learn about how Azure Machine Learning uses MLflow to log metrics and artifacts from machine learning models, and to deploy your machine learning models as a web service.
services: machine-learning
ms.author: lagayhar
author: lgayhardt
ms.service: machine-learning
ms.subservice: mlops
ms.date: 10/21/2021
ms.topic: conceptual
ms.custom: UpdateFrequency5, how-to, sdkv1, event-tier1-build-2022
---

# MLflow and Azure Machine Learning (v1)

[!INCLUDE [dev v1](../includes/machine-learning-dev-v1.md)]


[MLflow](https://www.mlflow.org) is an open-source library for managing the life cycle of your machine learning experiments. MLflow's tracking URI and logging API are collectively known as [MLflow Tracking](https://mlflow.org/docs/latest/quickstart.html#using-the-tracking-api). This component of MLflow logs and tracks your training run metrics and model artifacts, no matter where your experiment's environment is--on your computer, on a remote compute target, on a virtual machine, or in an Azure Databricks cluster. 

Together, MLflow Tracking and Azure Machine Learning allow you to track an experiment's run metrics and store model artifacts in your Azure Machine Learning workspace.

## Compare MLflow and Azure Machine Learning clients

The following table summarizes the clients that can use Azure Machine Learning and their respective capabilities.

MLflow Tracking offers metric logging and artifact storage functionalities that are otherwise available only through the [Azure Machine Learning Python SDK](/python/api/overview/azure/ml/intro).

| Capability | MLflow Tracking and deployment | Azure Machine Learning Python SDK |  Azure Machine Learning CLI | Azure Machine Learning studio|
|---|---|---|---|---|
| Manage a workspace |   | ✓ | ✓ | ✓ |
| Use data stores  |   | ✓ | ✓ | |
| Log metrics      | ✓ | ✓ |   | |
| Upload artifacts | ✓ | ✓ |   | |
| View metrics     | ✓ | ✓ | ✓ | ✓ |
| Manage compute   |   | ✓ | ✓ | ✓ |
| Deploy models    | ✓ | ✓ | ✓ | ✓ |
| Monitor model performance ||✓|  |   |
| Detect data drift |   | ✓ |   | ✓ |


## Track experiments

With MLflow Tracking, you can connect Azure Machine Learning as the back end of your MLflow experiments. You can then do the following tasks:

+ Track and log experiment metrics and artifacts in your [Azure Machine Learning workspace](concept-azure-machine-learning-architecture.md#workspace). If you already use MLflow Tracking for your experiments, the workspace provides a centralized, secure, and scalable location to store training metrics and models. Learn more at [Track machine learning models with MLflow and Azure Machine Learning](../how-to-use-mlflow.md). 

+ Track and manage models in MLflow and the Azure Machine Learning model registry.

+ [Track Azure Databricks training runs](../how-to-use-mlflow-azure-databricks.md).

## Train MLflow projects (preview)

> [!IMPORTANT]
> Items marked (preview) in this article are currently in public preview.
> The preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

You can use MLflow Tracking to submit training jobs with [MLflow Projects](https://www.mlflow.org/docs/latest/projects.html) and Azure Machine Learning back-end support.

You can submit jobs locally with Azure Machine Learning tracking or migrate your runs to the cloud via [Azure Machine Learning compute](../how-to-create-attach-compute-cluster.md).

Learn more at [Train machine learning models with MLflow projects and Azure Machine Learning](../how-to-train-mlflow-projects.md).

## Deploy MLflow experiments

You can [deploy your MLflow model as an Azure web service](../how-to-deploy-mlflow-models.md) so that you can apply the model management and data drift detection capabilities in Azure Machine Learning to your production models.

## Next steps
* [Track machine learning models with MLflow and Azure Machine Learning](how-to-use-mlflow.md) 
* [Train machine learning models with MLflow projects and Azure Machine Learning (preview)](../how-to-train-mlflow-projects.md)
* [Track Azure Databricks runs with MLflow](../how-to-use-mlflow-azure-databricks.md)
* [Deploy models with MLflow](how-to-deploy-mlflow-models.md)
