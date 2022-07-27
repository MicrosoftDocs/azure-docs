---
title: MLflow and Azure Machine Learning
titleSuffix: Azure Machine Learning
description: Learn about how Azure Machine Learning uses MLflow to log metrics and artifacts from ML models, and deploy your ML models to an endpoint.
services: machine-learning
author: abeomor
ms.author: osomorog
ms.service: machine-learning
ms.subservice: mlops
ms.date: 04/15/2022
ms.topic: conceptual
ms.custom: devx-track-python, cliv2, sdkv2, event-tier1-build-2022
---

# MLflow and Azure Machine Learning

[!INCLUDE [dev v2](../../includes/machine-learning-dev-v2.md)]

> [!div class="op_single_selector" title1="Select the version of Azure Machine Learning developer platform you are using:"]
> * [v1](v1/concept-mlflow-v1.md)
> * [v2 (current version)](concept-mlflow.md)

[MLflow](https://www.mlflow.org) is an open-source framework, designed to manage the complete machine learning lifecycle. Its ability to train and serve models on different platforms allows you to use a consistent set of tools regardless of where your experiments are running: locally on your computer, on a remote compute target, a virtual machine or an Azure Machine Learning compute instance.

> [!TIP]
> Azure Machine Learning workspaces are MLflow compatible, meaning that you can use Azure Machine Learning workspaces in the same way you use an MLflow Tracking Server. Such compatibility has the following advantages:
> * You can use Azure Machine Learning workspaces as your tracking server for any experiment you are running with MLflow, regardless if they run on Azure Machine Learning or not. You only need to configure MLflow to point to the workspace where the tracking should happen.
> * You can run any training routine that uses MLflow in Azure Machine Learning without changes. Model mangagement and model deployment capabilities are also supported.

MLflow can manage the complete machine learning lifecycle using four core capabilities:

* [Tracking](https://mlflow.org/docs/latest/quickstart.html#using-the-tracking-api) is a component of MLflow that logs and tracks your training job metrics, parameters and model artifacts; no matter your experiment's environment--locally on your computer, on a remote compute target, a virtual machine or an Azure Machine Learning compute instance.
* [Model Registries](https://mlflow.org/docs/latest/model-registry.html) is a component of MLflow that manage model's versions in a centralized repository.
* [Model Deployments](https://mlflow.org/docs/latest/models.html#deploy-a-python-function-model-on-microsoft-azure-ml) is a component of MLflow that deploys models registered using the MLflow format to different compute targets. Because of how MLflow models are stored, there's no need to provide scoring scripts for models in such format.
* [Projects](https://mlflow.org/docs/latest/projects.html) is a format for packaging data science code in a reusable and reproducible way, based primarily on conventions. It's supported on preview on Azure Machine Learning.


## Tracking with MLflow

Azure Machine Learning uses MLflow Tracking for metric logging and artifact storage for your experiments, whether you created the experiment via the Azure Machine Learning Python SDK, Azure Machine Learning CLI or the Azure Machine Learning studio. Learn more at [Log & view metrics and log files with MLflow](how-to-log-view-metrics.md).

> [!NOTE]
> Unlike the Azure Machine Learning SDK v1, there's no logging functionality in the SDK v2 (preview), and it is recommended to use MLflow for logging and tracking.

With MLflow Tracking you can connect Azure Machine Learning as the backend of your MLflow experiments. By doing so, you can:

+ Track and log experiment metrics and artifacts in your [Azure Machine Learning workspace](./concept-azure-machine-learning-v2.md#workspace).
  + If you're using Azure Machine Learning computes, they're already configured to work with MLflow for tracking. Just import `mlflow` in your training routine and start using it.
  + Azure Machine Learning also supports remote tracking of experiments by configuring MLflow to point to the Azure Machine Learning workspace. By doing so, you can leverage the capabilities of Azure Machine Learning while keeping your experiments where they are.
+ Lift and shift existing MLflow experiments to Azure Machine Learning. The workspace provides a centralized, secure, and scalable location to store training metrics and models.

> [!IMPORTANT]
> - MLflow in R support is limited to tracking experiment's metrics and parameters on Azure Machine Learning jobs. Artifacts and models can't be tracked using the MLflow R SDK. You can save them locally and then have Azure Machine Learning to capture for you as a workaround. RStudio or Jupyter Notebooks with R kernels are not supported. View the following [R example about using the MLflow tracking client with Azure Machine Learning](https://github.com/Azure/azureml-examples/tree/main/cli/jobs/single-step/r).
> - MLflow in Java support is limited to tracking experiment's metrics and parameters on Azure Machine Learning jobs. Artifacts and models can't be tracked using the MLflow Java SDK. You can save them locally and then have Azure Machine Learning to capture for you as a workaround. View the following [Java example about using the MLflow tracking client with the Azure Machine Learning](https://github.com/Azure/azureml-examples/tree/main/cli/jobs/single-step/java/iris).

## Model Registries with MLflow

Azure Machine Learning supports MLflow for model management. This represents a convenient way to support the entire model lifecycle for users familiar with the MLFlow client.

To learn more about how you can manage models using the MLflow API in Azure Machine Learning, view [Manage models registries in Azure Machine Learning with MLflow](how-to-manage-models-mlflow.md).

## Model Deployments of MLflow models

You can [deploy MLflow models to Azure Machine Learning](how-to-deploy-mlflow-models.md), so you can leverage and apply Azure Machine Learning's model management capabilities and no-code deployment offering. We support deploying MLflow models to both real-time and batch endpoints. You can use the `azureml-mlflow` MLflow plugin, the Azure ML CLI v2, and using the user interface in Azure Machine Learning studio.

Learn more at [Deploy MLflow models to Azure Machine Learning](how-to-deploy-mlflow-models.md).

## Train MLflow projects (preview)

[!INCLUDE [preview disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

You can submit training jobs to Azure Machine Learning using [MLflow Projects](https://www.mlflow.org/docs/latest/projects.html) (preview). You can submit jobs locally with Azure Machine Learning tracking or migrate your jobs to the cloud like via an [Azure Machine Learning Compute](./how-to-create-attach-compute-cluster.md).

Learn more at [Train ML models with MLflow projects and Azure Machine Learning (preview)](how-to-train-mlflow-projects.md).

## MLflow SDK, Azure ML v2 and Azure ML Studio capabilities

The following table shows which operations are supported by each of the tools available in the ML lifecycle.

| Feature | MLflow SDK | Azure ML v2 (CLI/SDK) | Azure ML Studio |
| :- | :-: | :-: | :-: |
| Track and log metrics, parameters and models | **&check;** | | |
| Retrieve metrics, parameters and models | **&check;**<sup>1</sup> | <sup>2</sup> | **&check;** |
| Submit training jobs with MLflow projects | **&check;** |  |  |
| Submit training jobs with inputs and outputs |  | **&check;** | |
| Submit training pipelines | | **&check;** | |
| Manage experiments runs | **&check;**<sup>1</sup> | **&check;** | **&check;** |
| Manage MLflow models | **&check;**<sup>3</sup> | **&check;** | **&check;** |
| Manage non-MLflow models | | **&check;** | **&check;** |
| Deploy MLflow models to Azure Machine Learning | **&check;**<sup>4</sup> | **&check;** | **&check;** |
| Deploy non-MLflow models to Azure Machine Learning | | **&check;** | **&check;** |

> [!NOTE]
> - <sup>1</sup> View [Manage experiments and runs with MLflow](how-to-track-experiments-mlflow.md) for details.
> - <sup>2</sup> Only artifacts and models can be downloaded.
> - <sup>3</sup> View [Manage models registries in Azure Machine Learning with MLflow](how-to-manage-models-mlflow.md) for details.
> - <sup>4</sup> View [Deploy MLflow models to Azure Machine Learning](how-to-deploy-mlflow-models.md) for details. Deployment of MLflow models to batch inference using the MLflow SDK is not possible by the moment.

## Example notebooks

If you are getting started with MLflow in Azure Machine Learning, we recommend you to explore the [notebooks examples about how to user MLflow](https://github.com/Azure/azureml-examples/blob/main/notebooks/using-mlflow/readme.md):

* [Training and tracking a classifier with MLflow](https://github.com/Azure/azureml-examples/blob/main/notebooks/using-mlflow/train-with-mlflow/xgboost_classification_mlflow.ipynb): Demonstrates how to track experiments using MLflow, log models and combine multiple flavors into pipelines.
* [Training and tracking a classifier with MLflow using Service Principal authentication](https://github.com/Azure/azureml-examples/blob/main/notebooks/using-mlflow/train-with-mlflow/xgboost_service_principal.ipynb): Demonstrate how to track experiments using MLflow from compute that is running outside Azure ML and how to authenticate against Azure ML services using a Service Principal.
* [Hyper-parameters optimization using child runs with MLflow and HyperOpt optimizer](https://github.com/Azure/azureml-examples/blob/main/notebooks/using-mlflow/train-with-mlflow/xgboost_nested_runs.ipynb): Demonstrate how to use child runs in MLflow to do hyper-parameter optimization for models using the popular library HyperOpt. It shows how to transfer metrics, params and artifacts from child runs to parent runs.
* [Logging models instead of assets with MLflow](https://github.com/Azure/azureml-examples/blob/main/notebooks/using-mlflow/logging-models/logging_model_with_mlflow.ipynb): Demonstrates how to use the concept of models instead of artifacts with MLflow, including how to construct custom models.
* [Manage experiments and runs with MLflow](https://github.com/Azure/azureml-examples/blob/main/notebooks/using-mlflow/run-history/run_history.ipynb): Demonstrates how to query experiments, runs, metrics, parameters and artifacts from Azure ML using MLflow.
* [Manage models registries with MLflow](https://github.com/Azure/azureml-examples/blob/main/notebooks/using-mlflow/model-management/model_management.ipynb): Demonstrates how to manage models in registries using MLflow.
* [No-code deployment with MLflow](https://github.com/Azure/azureml-examples/blob/main/notebooks/using-mlflow/no-code-deployment/deploying_with_mlflow.ipynb): Demonstrates how to deploy models in MLflow format to the different deployment target in Azure ML.
* [Training models in Azure Databricks and deploying them on Azure ML with MLflow](https://github.com/Azure/azureml-examples/blob/main/notebooks/using-mlflow/no-code-deployment/track_with_databricks_deploy_aml.ipynb): Demonstrates how to train models in Azure Databricks and deploy them in Azure ML. It also includes how to handle cases where you also want to track the experiments with the MLflow instance in Azure Databricks.
* [Migrating models with scoring scripts to MLflow format](https://github.com/Azure/azureml-examples/blob/main/notebooks/using-mlflow/migrating-scoring-to-mlflow/scoring_to_mlmodel.ipynb): Demonstrates how to migrate models with scoring scripts to no-code-deployment with MLflow.
* [Using MLflow REST with Azure ML](https://github.com/Azure/azureml-examples/blob/main/notebooks/using-mlflow/using-rest-api/using_mlflow_rest_api.ipynb): Demonstrates how to work with MLflow REST API when connected to Azure ML.
