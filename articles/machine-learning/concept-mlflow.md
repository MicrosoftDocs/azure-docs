---
title: MLflow and Azure Machine Learning
titleSuffix: Azure Machine Learning
description: Learn about how Azure Machine Learning uses MLflow to log metrics and artifacts from machine learning models, and to deploy your machine learning models to an endpoint.
services: machine-learning
author: abeomor
ms.author: osomorog
ms.service: machine-learning
ms.subservice: mlops
ms.date: 08/15/2022
ms.topic: conceptual
ms.custom: devx-track-python, cliv2, sdkv2, event-tier1-build-2022
---

# MLflow and Azure Machine Learning

[!INCLUDE [dev v2](../../includes/machine-learning-dev-v2.md)]

> [!div class="op_single_selector" title1="Select the version of the Azure Machine Learning developer platform that you're using:"]
> * [v1](v1/concept-mlflow-v1.md)
> * [v2 (current version)](concept-mlflow.md)

[MLflow](https://www.mlflow.org) is an open-source framework that's designed to manage the complete machine learning lifecycle. Its ability to train and serve models on different platforms allows you to use a consistent set of tools regardless of where your experiments are running: locally on your computer, on a remote compute target, on a virtual machine, or on an Azure Machine Learning compute instance.

> [!TIP]
> Azure Machine Learning workspaces are MLflow-compatible, which means you can use Azure Machine Learning workspaces in the same way that you use an MLflow tracking server. Such compatibility has the following advantages:
> * You can use Azure Machine Learning workspaces as your tracking server for any experiment you're running with MLflow, whether it runs on Azure Machine Learning or not. You only need to configure MLflow to point to the workspace where the tracking should happen.
> * You can run any training routine that uses MLflow in Azure Machine Learning without changes. MLflow also supports model management and model deployment capabilities.

MLflow can manage the complete machine learning lifecycle by using four core capabilities:

* [Tracking](https://mlflow.org/docs/latest/quickstart.html#using-the-tracking-api) is a component of MLflow that logs and tracks your training job metrics, parameters, and model artifacts. It doesn't matter where your experiment's environment is--locally on your computer, on a remote compute target, on a virtual machine, or on an Azure Machine Learning compute instance.
* [Model Registry](https://mlflow.org/docs/latest/model-registry.html) is a component of MLflow that manages a model's versions in a centralized repository.
* [Model deployment](https://mlflow.org/docs/latest/models.html#deploy-a-python-function-model-on-microsoft-azure-ml) is a capability of MLflow that deploys models registered through the MLflow format to compute targets. Because of how MLflow models are stored, there's no need to provide scoring scripts for models in such a format.
* [Project](https://mlflow.org/docs/latest/projects.html) is a format for packaging data science code in a reusable and reproducible way, based primarily on conventions. It's supported in preview on Azure Machine Learning.


## Tracking with MLflow

Azure Machine Learning uses MLflow Tracking for metric logging and artifact storage for your experiments, whether you created the experiments via the Azure Machine Learning Python SDK, the Azure Machine Learning CLI, or Azure Machine Learning studio. We recommend using MLflow for tracking experiments. To get started, see [Log metrics, parameters, and files with MLflow](how-to-log-view-metrics.md).

> [!NOTE]
> Unlike the Azure Machine Learning SDK v1, there's no logging functionality in the SDK v2 (preview). We recommend that you use MLflow for logging.

With MLflow Tracking, you can connect Azure Machine Learning as the back end of your MLflow experiments. The workspace provides a centralized, secure, and scalable location to store training metrics and models. Capabilities include:

* [Track machine learning experiments and models running locally or in the cloud](how-to-use-mlflow-cli-runs.md) with MLflow in Azure Machine Learning.
* [Track Azure Databricks machine learning experiments](how-to-use-mlflow-azure-databricks.md) with MLflow in Azure Machine Learning.
* [Track Azure Synapse Analytics machine learning experiments](how-to-use-mlflow-azure-synapse.md) with MLflow in Azure Machine Learning.

> [!IMPORTANT]
> - MLflow in R support is limited to tracking an experiment's metrics, parameters, and models on Azure Machine Learning jobs. RStudio or Jupyter Notebooks with R kernels are not supported. Model registries are not supported if you're using the MLflow R SDK. As an alternative, use the Azure Machine Learning CLI or Azure Machine Learning studio for model registration and management. View an [R example about using the MLflow tracking client with Azure Machine Learning](https://github.com/Azure/azureml-examples/tree/main/cli/jobs/single-step/r).
> - MLflow in Java support is limited to tracking an experiment's metrics and parameters on Azure Machine Learning jobs. Artifacts and models can't be tracked via the MLflow Java SDK. View a [Java example about using the MLflow tracking client with Azure Machine Learning](https://github.com/Azure/azureml-examples/tree/main/cli/jobs/single-step/java/iris).

To learn how to use MLflow to query experiments and runs in Azure Machine Learning, see [Manage experiments and runs with MLflow](how-to-track-experiments-mlflow.md).

## Model registries with MLflow

Azure Machine Learning supports MLflow for model management. This support represents a convenient way to support the entire model lifecycle for users who are familiar with the MLflow client.

To learn more about how to manage models by using the MLflow API in Azure Machine Learning, view [Manage model registries in Azure Machine Learning with MLflow](how-to-manage-models-mlflow.md).

## Model deployments of MLflow models

You can [deploy MLflow models to Azure Machine Learning](how-to-deploy-mlflow-models.md) so that you can apply the model management capabilities and no-code deployment offering in Azure Machine Learning. Azure Machine Learning supports deploying models to both real-time and batch endpoints. You can use the `azureml-mlflow` MLflow plug-in, the Azure Machine Learning CLI v2, and the user interface in Azure Machine Learning studio.

Learn more at [Deploy MLflow models to Azure Machine Learning](how-to-deploy-mlflow-models.md).

## Training MLflow projects (preview)

[!INCLUDE [preview disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

You can submit training jobs to Azure Machine Learning by using [MLflow projects](https://www.mlflow.org/docs/latest/projects.html) (preview). You can submit jobs locally with Azure Machine Learning tracking or migrate your jobs to the cloud via [Azure Machine Learning compute](./how-to-create-attach-compute-cluster.md).

Learn more at [Train machine learning models with MLflow projects and Azure Machine Learning (preview)](how-to-train-mlflow-projects.md).

## MLflow SDK, Azure Machine Learning v2, and Azure Machine Learning studio capabilities

The following table shows which operations are supported by each of the tools available in the machine learning lifecycle.

| Feature | MLflow SDK | Azure Machine Learning v2 (CLI/SDK) | Azure Machine Learning studio |
| :- | :-: | :-: | :-: |
| Track and log metrics, parameters, and models | **&check;** | | |
| Retrieve metrics, parameters, and models | **&check;**<sup>1</sup> | <sup>2</sup> | **&check;** |
| Submit training jobs with MLflow projects | **&check;** |  |  |
| Submit training jobs with inputs and outputs |  | **&check;** | **&check;** |
| Submit training jobs by using machine learning pipelines | | **&check;** | |
| Manage experiments and runs | **&check;**<sup>1</sup> | **&check;** | **&check;** |
| Manage MLflow models | **&check;**<sup>3</sup> | **&check;** | **&check;** |
| Manage non-MLflow models | | **&check;** | **&check;** |
| Deploy MLflow models to Azure Machine Learning | **&check;**<sup>4</sup> | **&check;** | **&check;** |
| Deploy non-MLflow models to Azure Machine Learning | | **&check;** | **&check;** |

> [!NOTE]
> - <sup>1</sup> View [Manage experiments and runs with MLflow](how-to-track-experiments-mlflow.md) for details.
> - <sup>2</sup> Only artifacts and models can be downloaded.
> - <sup>3</sup> View [Manage model registries in Azure Machine Learning with MLflow](how-to-manage-models-mlflow.md) for details.
> - <sup>4</sup> View [Deploy MLflow models to Azure Machine Learning](how-to-deploy-mlflow-models.md) for details. Deployment of MLflow models to batch inference by using the MLflow SDK is not possible at the moment.

## Example notebooks

If you're getting started with MLflow in Azure Machine Learning, we recommend that you explore the [notebook examples about how to use MLflow](https://github.com/Azure/azureml-examples/blob/main/notebooks/using-mlflow/readme.md):

* [Training and tracking an XGBoost classifier with MLflow](https://github.com/Azure/azureml-examples/blob/main/notebooks/using-mlflow/train-with-mlflow/xgboost_classification_mlflow.ipynb): Demonstrates how to track experiments by using MLflow, log models, and combine multiple flavors into pipelines.
* [Training and tracking an XGBoost classifier with MLflow using service principal authentication](https://github.com/Azure/azureml-examples/blob/main/notebooks/using-mlflow/train-with-mlflow/xgboost_service_principal.ipynb): Demonstrates how to track experiments by using MLflow from compute that's running outside Azure Machine Learning. It shows how to authenticate against Azure Machine Learning services by using a service principal.
* [Hyper-parameter optimization using Hyperopt and nested runs in MLflow](https://github.com/Azure/azureml-examples/blob/main/notebooks/using-mlflow/train-with-mlflow/xgboost_nested_runs.ipynb): Demonstrates how to use child runs in MLflow to do hyper-parameter optimization for models by using the popular library Hyperopt. It shows how to transfer metrics, parameters, and artifacts from child runs to parent runs.
* [Logging models with MLflow](https://github.com/Azure/azureml-examples/blob/main/notebooks/using-mlflow/logging-models/logging_model_with_mlflow.ipynb): Demonstrates how to use the concept of models instead of artifacts with MLflow, including how to construct custom models.
* [Manage runs and experiments with MLflow](https://github.com/Azure/azureml-examples/blob/main/notebooks/using-mlflow/run-history/run_history.ipynb): Demonstrates how to query experiments, runs, metrics, parameters, and artifacts from Azure Machine Learning by using MLflow.
* [Manage model registries with MLflow](https://github.com/Azure/azureml-examples/blob/main/notebooks/using-mlflow/model-management/model_management.ipynb): Demonstrates how to manage models in registries by using MLflow.
* [Deploying models with MLflow](https://github.com/Azure/azureml-examples/blob/main/notebooks/using-mlflow/no-code-deployment/deploying_with_mlflow.ipynb): Demonstrates how to deploy no-code models in MLflow format to a deployment target in Azure Machine Learning.
* [Training models in Azure Databricks and deploying them on Azure Machine Learning](https://github.com/Azure/azureml-examples/blob/main/notebooks/using-mlflow/no-code-deployment/track_with_databricks_deploy_aml.ipynb): Demonstrates how to train models in Azure Databricks and deploy them in Azure Machine Learning. It also includes how to handle cases where you also want to track the experiments with the MLflow instance in Azure Databricks.
* [Migrating models with a scoring script to MLflow](https://github.com/Azure/azureml-examples/blob/main/notebooks/using-mlflow/migrating-scoring-to-mlflow/scoring_to_mlmodel.ipynb): Demonstrates how to migrate models with scoring scripts to no-code deployment with MLflow.
* [Using MLflow REST with Azure Machine Learning](https://github.com/Azure/azureml-examples/blob/main/notebooks/using-mlflow/using-rest-api/using_mlflow_rest_api.ipynb): Demonstrates how to work with the MLflow REST API when you're connected to Azure Machine Learning.
