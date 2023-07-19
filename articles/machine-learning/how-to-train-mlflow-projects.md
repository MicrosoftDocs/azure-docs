---
title: Train with MLflow Projects (Preview)
titleSuffix: Azure Machine Learning
description:  Set up MLflow with Azure Machine Learning to log metrics and artifacts from ML models
services: machine-learning
author: santiagxf
ms.author: fasantia
ms.reviewer: mopeakande
ms.service: machine-learning
ms.subservice: core
ms.date: 11/04/2022
ms.topic: conceptual
ms.custom: how-to, sdkv2, event-tier1-build-2022
---

# Train with MLflow Projects in Azure Machine Learning (preview)

In this article, learn how to submit training jobs with [MLflow Projects](https://www.mlflow.org/docs/latest/projects.html) that use Azure Machine Learning workspaces for tracking. You can submit jobs and only track them with Azure Machine Learning or migrate your runs to the cloud to run completely on [Azure Machine Learning Compute](./how-to-create-attach-compute-cluster.md).

[!INCLUDE [machine-learning-preview-generic-disclaimer](includes/machine-learning-preview-generic-disclaimer.md)]

[MLflow Projects](https://mlflow.org/docs/latest/projects.html) allow for you to organize and describe your code to let other data scientists (or automated tools) run it. MLflow Projects with Azure Machine Learning enable you to track and manage your training runs in your workspace.

[!INCLUDE [machine-learning-mlflow-projects-deprecation](includes/machine-learning-mlflow-projects-deprecation.md)]

[Learn more about the MLflow and Azure Machine Learning integration.](concept-mlflow.md)

## Prerequisites

[!INCLUDE [mlflow-prereqs](includes/machine-learning-mlflow-prereqs.md)]

* Using Azure Machine Learning as backend for MLflow projects requires the package `azureml-core`:

  ```bash
  pip install azureml-core
  ```

### Connect to your workspace

If you're working outside Azure Machine Learning, you need to configure MLflow to point to your Azure Machine Learning workspace's tracking URI. You can find the instructions at [Configure MLflow for Azure Machine Learning](how-to-use-mlflow-configure-tracking.md).


## Track MLflow Projects in Azure Machine Learning workspaces

This example shows how to submit MLflow projects and track them Azure Machine Learning.

1. Add the `azureml-mlflow` package as a pip dependency to your environment configuration file in order to track metrics and key artifacts in your workspace. 

    __conda.yaml__

    ```yaml
    name: mlflow-example
    channels:
      - defaults
    dependencies:
      - numpy>=1.14.3
      - pandas>=1.0.0
      - scikit-learn
      - pip:
        - mlflow
        - azureml-mlflow
    ```

1. Submit the local run and ensure you set the parameter `backend = "azureml"`, which adds support of automatic tracking, model's capture, log files, snapshots, and printed errors in your workspace. In this example we assume the MLflow project you are trying to run is in the same folder you currently are, `uri="."`.
  
    # [MLflow CLI](#tab/cli)
    
    ```bash
    mlflow run . --experiment-name  --backend azureml --env-manager=local -P alpha=0.3
    ```
  
    # [Python](#tab/sdk)

    ```python
    local_env_run = mlflow.projects.run(
        uri=".", 
        parameters={"alpha":0.3},
        backend = "azureml",
        env_manager="local",
        backend_config = backend_config, 
    )
    ```
    
    ---
  
    View your runs and metrics in the [Azure Machine Learning studio](https://ml.azure.com).

## Train MLflow projects in Azure Machine Learning jobs

This example shows how to submit MLflow projects as a job running on Azure Machine Learning compute.

1. Create the backend configuration object, in this case we are going to indicate `COMPUTE`. This parameter references the name of your remote compute cluster you want to use for running your project. If `COMPUTE` is present, the project will be automatically submitted as an Azure Machine Learning job to the indicated compute. 

    # [MLflow CLI](#tab/cli)
  
    __backend_config.json__
  
    ```json
    {
        "COMPUTE": "cpu-cluster"
    }
    
    ```
  
    # [Python](#tab/sdk)
  
    ```python
    backend_config = {"COMPUTE": "cpu-cluster"}
    ```

1. Add the `azureml-mlflow` package as a pip dependency to your environment configuration file in order to track metrics and key artifacts in your workspace. 

    __conda.yaml__

    ```yaml
    name: mlflow-example
    channels:
      - defaults
    dependencies:
      - numpy>=1.14.3
      - pandas>=1.0.0
      - scikit-learn
      - pip:
        - mlflow
        - azureml-mlflow
    ```

1. Submit the local run and ensure you set the parameter `backend = "azureml"`, which adds support of automatic tracking, model's capture, log files, snapshots, and printed errors in your workspace. In this example we assume the MLflow project you are trying to run is in the same folder you currently are, `uri="."`.

    # [MLflow CLI](#tab/cli)
 
    ```bash
    mlflow run . --backend azureml --backend-config backend_config.json -P alpha=0.3
    ```
  
    # [Python](#tab/sdk)
  
    ```python
    local_env_run = mlflow.projects.run(
        uri=".", 
        parameters={"alpha":0.3},
        backend = "azureml",
        backend_config = backend_config, 
    )
    ```
    
    ---
  
    > [!NOTE]
    > Since Azure Machine Learning jobs always run in the context of environments, the parameter `env_manager` is ignored.
  
    View your runs and metrics in the [Azure Machine Learning studio](https://ml.azure.com).


## Clean up resources

If you don't plan to use the logged metrics and artifacts in your workspace, the ability to delete them individually is currently unavailable. Instead, delete the resource group that contains the storage account and workspace, so you don't incur any charges:

1. In the Azure portal, select **Resource groups** on the far left.

    :::image type="content" source="media/how-to-use-mlflow-azure-databricks/delete-resources.png" alt-text="Image showing how to delete an Azure resource group.":::    

1. From the list, select the resource group you created.

1. Select **Delete resource group**.

1. Enter the resource group name. Then select **Delete**.

## Example notebooks

The [MLflow with Azure Machine Learning notebooks](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/track-and-monitor-experiments/using-mlflow) demonstrate and expand upon concepts presented in this article.

  * [Train an MLflow project on a local compute](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/track-and-monitor-experiments/using-mlflow/train-projects-local/train-projects-local.ipynb)
  * [Train an MLflow project on remote compute](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/track-and-monitor-experiments/using-mlflow/train-projects-remote/train-projects-remote.ipynb).

> [!NOTE]
> A community-driven repository of examples using mlflow can be found at https://github.com/Azure/azureml-examples.

## Next steps

* [Track Azure Databricks runs with MLflow](how-to-use-mlflow-azure-databricks.md).
* [Query & compare experiments and runs with MLflow](how-to-track-experiments-mlflow.md).
* [Manage models registries in Azure Machine Learning with MLflow](how-to-manage-models-mlflow.md).
* [Guidelines for deploying MLflow models](how-to-deploy-mlflow-models.md).
