---
title: MLflow and Azure Machine Learning
titleSuffix: Azure Machine Learning
description: Learn how Azure Machine Learning uses MLflow to log metrics and artifacts from machine learning models, and to deploy your machine learning models to an endpoint.
services: machine-learning
author: santiagxf
ms.author: fasantia
ms.reviewer: mopeakande
ms.service: machine-learning
ms.subservice: mlops
ms.date: 08/15/2022
ms.topic: conceptual
ms.custom: cliv2, sdkv2, event-tier1-build-2022, ignite-2022
---

# MLflow and Azure Machine Learning

[!INCLUDE [dev v2](includes/machine-learning-dev-v2.md)]


[MLflow](https://www.mlflow.org) is an open-source framework designed to manage the complete machine learning lifecycle. Its ability to train and serve models on different platforms allows you to use a consistent set of tools regardless of where your experiments are running: whether locally on your computer, on a remote compute target, on a virtual machine, or on an Azure Machine Learning compute instance.

Azure Machine Learning **workspaces are MLflow-compatible**, which means that you can use Azure Machine Learning workspaces in the same way that you'd use an MLflow server. This compatibility has the following advantages:

* Azure Machine Learning doesn't host MLflow server instances under the hood; rather, the workspace can speak the MLflow API language.
* You can use Azure Machine Learning workspaces as your tracking server for any MLflow code, whether it runs on Azure Machine Learning or not. You only need to configure MLflow to point to the workspace where the tracking should happen.
* You can run any training routine that uses MLflow in Azure Machine Learning without any change.

> [!TIP]
> Unlike the Azure Machine Learning SDK v1, there's no logging functionality in the SDK v2. We recommend that you use MLflow for logging, so that your training routines are cloud-agnostic and portable—removing any dependency your code has on Azure Machine Learning.

## Tracking with MLflow

Azure Machine Learning uses MLflow tracking to log metrics and store artifacts for your experiments. When you're connected to Azure Machine Learning, all tracking performed using MLflow is materialized in the workspace you're working on. To learn more about how to set up your experiments to use MLflow for tracking experiments and training routines, see [Log metrics, parameters, and files with MLflow](how-to-log-view-metrics.md). You can also use MLflow to [query & compare experiments and runs](how-to-track-experiments-mlflow.md).

MLflow in Azure Machine Learning provides a way to __centralize tracking__. You can connect MLflow to Azure Machine Learning workspaces even when you're working locally or in a different cloud. The workspace provides a centralized, secure, and scalable location to store training metrics and models.

Using MLflow in Azure Machine Learning includes the capabilities to:

* [Track machine learning experiments and models running locally or in the cloud](how-to-use-mlflow-cli-runs.md).
* [Track Azure Databricks machine learning experiments](how-to-use-mlflow-azure-databricks.md).
* [Track Azure Synapse Analytics machine learning experiments](how-to-use-mlflow-azure-synapse.md).

### Example notebooks

* [Training and tracking an XGBoost classifier with MLflow](https://github.com/Azure/azureml-examples/blob/main/sdk/python/using-mlflow/train-and-log/xgboost_classification_mlflow.ipynb): Demonstrates how to track experiments by using MLflow, log models, and combine multiple flavors into pipelines.
* [Training and tracking an XGBoost classifier with MLflow using service principal authentication](https://github.com/Azure/azureml-examples/blob/main/sdk/python/using-mlflow/train-and-log/xgboost_service_principal.ipynb): Demonstrates how to track experiments by using MLflow from a compute that's running outside Azure Machine Learning. The example shows how to authenticate against Azure Machine Learning services by using a service principal.
* [Hyper-parameter optimization using HyperOpt and nested runs in MLflow](https://github.com/Azure/azureml-examples/blob/main/sdk/python/using-mlflow/train-and-log/xgboost_nested_runs.ipynb): Demonstrates how to use child runs in MLflow to do hyper-parameter optimization for models by using the popular library `Hyperopt`. The example shows how to transfer metrics, parameters, and artifacts from child runs to parent runs.
* [Logging models with MLflow](https://github.com/Azure/azureml-examples/blob/main/sdk/python/using-mlflow/train-and-log/logging_and_customizing_models.ipynb): Demonstrates how to use the concept of models, instead of artifacts, with MLflow. The example also shows how to construct custom models.
* [Manage runs and experiments with MLflow](https://github.com/Azure/azureml-examples/blob/main/sdk/python/using-mlflow/runs-management/run_history.ipynb): Demonstrates how to query experiments, runs, metrics, parameters, and artifacts from Azure Machine Learning by using MLflow.

#### Tracking with MLflow in R

MLflow support in R has the following limitations:

- MLflow tracking is limited to tracking experiment metrics, parameters, and models on Azure Machine Learning jobs.
- Interactive training on RStudio, Posit (formerly RStudio Workbench), or Jupyter notebooks with R kernels is _not supported_.
- Model management and registration are _not supported_ using the MLflow R SDK. Instead, use the Azure Machine Learning CLI or [Azure Machine Learning studio](https://ml.azure.com) for model registration and management.

To learn about using the MLflow tracking client with Azure Machine Learning, view the examples in [Train R models using the Azure Machine Learning CLI (v2)](https://github.com/Azure/azureml-examples/tree/main/cli/jobs/single-step/r).

#### Tracking with MLflow in Java

MLflow support in Java has the following limitations:

- MLflow tracking is limited to tracking experiment metrics and parameters on Azure Machine Learning jobs.
- Artifacts and models can't be tracked using the MLflow Java SDK. Instead, use the `Outputs` folder in jobs along with the `mlflow.save_model` method to save models (or artifacts) that you want to capture.

To learn about using the MLflow tracking client with Azure Machine Learning, view the [Java example that uses the MLflow tracking client with Azure Machine Learning](https://github.com/Azure/azureml-examples/tree/main/cli/jobs/single-step/java/iris).

## Model registries with MLflow

Azure Machine Learning supports MLflow for model management. This support represents a convenient way to support the entire model lifecycle for users that are familiar with the MLflow client.

To learn more about how to manage models by using the MLflow API in Azure Machine Learning, view [Manage model registries in Azure Machine Learning with MLflow](how-to-manage-models-mlflow.md).

### Example notebook

* [Manage model registries with MLflow](https://github.com/Azure/azureml-examples/blob/main/sdk/python/using-mlflow/model-management/model_management.ipynb): Demonstrates how to manage models in registries by using MLflow.

## Model deployment with MLflow

You can [deploy MLflow models to Azure Machine Learning](how-to-deploy-mlflow-models.md) and take advantage of the improved experience when you use MLflow models. Azure Machine Learning supports deployment of MLflow models to both real-time and batch endpoints without having to specify an environment or a scoring script. Deployment is supported using the MLflow SDK, Azure Machine Learning CLI, Azure Machine Learning SDK for Python, or the [Azure Machine Learning studio](https://ml.azure.com).

To learn more about deploying MLflow models to Azure Machine Learning for both real-time and batch inferencing, see [Guidelines for deploying MLflow models](how-to-deploy-mlflow-models.md).

### Example notebooks

* [Deploy MLflow to online endpoints](https://github.com/Azure/azureml-examples/blob/main/sdk/python/using-mlflow/deploy/mlflow_sdk_online_endpoints.ipynb): Demonstrates how to deploy models in MLflow format to online endpoints using the MLflow SDK.
* [Deploy MLflow to online endpoints with safe rollout](https://github.com/Azure/azureml-examples/blob/main/sdk/python/using-mlflow/deploy/mlflow_sdk_online_endpoints_progresive.ipynb): Demonstrates how to deploy models in MLflow format to online endpoints, using the MLflow SDK with progressive rollout of models. The example also shows deployment of multiple versions of a model to the same endpoint.
* [Deploy MLflow to web services (V1)](https://github.com/Azure/azureml-examples/blob/main/sdk/python/using-mlflow/deploy/mlflow_sdk_web_service.ipynb): Demonstrates how to deploy models in MLflow format to web services (ACI/AKS v1) using the MLflow SDK.
* [Deploy models trained in Azure Databricks to Azure Machine Learning with MLflow](https://github.com/Azure/azureml-examples/blob/main/sdk/python/using-mlflow/deploy/track_with_databricks_deploy_aml.ipynb): Demonstrates how to train models in Azure Databricks and deploy them in Azure Machine Learning. The example also covers how to handle cases where you also want to track the experiments with the MLflow instance in Azure Databricks.

## Training with MLflow projects (preview)

> [!IMPORTANT]
> Items marked (preview) in this article are currently in public preview.
> The preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

You can submit training jobs to Azure Machine Learning by using [MLflow projects](https://www.mlflow.org/docs/latest/projects.html) (preview). You can submit jobs locally with Azure Machine Learning tracking or migrate your jobs to the cloud via [Azure Machine Learning compute](./how-to-create-attach-compute-cluster.md).

To learn how to submit training jobs with MLflow Projects that use Azure Machine Learning workspaces for tracking, see [Train machine learning models with MLflow projects and Azure Machine Learning](how-to-train-mlflow-projects.md).

### Example notebooks

* [Track an MLflow project in Azure Machine Learning workspaces](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/track-and-monitor-experiments/using-mlflow/train-projects-local/train-projects-local.ipynb).
* [Train and run an MLflow project on Azure Machine Learning jobs](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/track-and-monitor-experiments/using-mlflow/train-projects-remote/train-projects-remote.ipynb).

## MLflow SDK, Azure Machine Learning v2, and Azure Machine Learning studio capabilities

The following table shows the operations that are possible, using each of the client tools available in the machine learning lifecycle.

| Feature | MLflow SDK | Azure Machine Learning CLI/SDK | Azure Machine Learning studio |
| :- | :-: | :-: | :-: |
| Track and log metrics, parameters, and models | **&check;** | | |
| Retrieve metrics, parameters, and models | **&check;** | <sup>1</sup> | **&check;** |
| Submit training jobs | **&check;** <sup>2</sup> | **&check;** | **&check;** |
| Submit training jobs with Azure Machine Learning data assets |  | **&check;** | **&check;** |
| Submit training jobs with machine learning pipelines | | **&check;** | **&check;** |
| Manage experiments and runs | **&check;** | **&check;** | **&check;** |
| Manage MLflow models | **&check;**<sup>3</sup> | **&check;** | **&check;** |
| Manage non-MLflow models | | **&check;** | **&check;** |
| Deploy MLflow models to Azure Machine Learning (Online & Batch) | **&check;**<sup>4</sup> | **&check;** | **&check;** |
| Deploy non-MLflow models to Azure Machine Learning | | **&check;** | **&check;** |

> [!NOTE]
> - <sup>1</sup> Only artifacts and models can be downloaded.
> - <sup>2</sup> Possible by using MLflow projects (preview).
> - <sup>3</sup> Some operations may not be supported. View [Manage model registries in Azure Machine Learning with MLflow](how-to-manage-models-mlflow.md) for details.
> - <sup>4</sup> Deployment of MLflow models for batch inference by using the MLflow SDK is not possible at the moment. As an alternative, see [Deploy and run MLflow models in Spark jobs](how-to-deploy-mlflow-model-spark-jobs.md).


## Related content

* [From artifacts to models in MLflow](concept-mlflow-models.md).
* [Configure MLflow for Azure Machine Learning](how-to-use-mlflow-configure-tracking.md).
* [Migrate logging from SDK v1 to MLflow](reference-migrate-sdk-v1-mlflow-tracking.md)
* [Track ML experiments and models with MLflow](how-to-use-mlflow-cli-runs.md).
* [Log MLflow models](how-to-log-mlflow-models.md).
* [Guidelines for deploying MLflow models](how-to-deploy-mlflow-models.md).
