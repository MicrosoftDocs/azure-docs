---
author: santiagxf
ms.service: machine-learning
ms.topic: include
ms.date: 01/02/2023
ms.author: fasantia
---

- Install Mlflow SDK package `mlflow` and Azure Machine Learning plug-in for MLflow `azureml-mlflow`. 

    ```bash
    pip install mlflow azureml-mlflow
    ```
    
    > [!TIP]
    > You can use the package [`mlflow-skinny`](https://github.com/mlflow/mlflow/blob/master/README_SKINNY.rst), which is a lightweight MLflow package without SQL storage, server, UI, or data science dependencies. It is recommended for users who primarily need the tracking and logging capabilities without importing the full suite of MLflow features including deployments.

- You need an Azure Machine Learning workspace. You can [create one following this tutorial](../quickstart-create-resources.md).
    * See which [access permissions you need to perform your MLflow operations with your workspace](../how-to-assign-roles.md#mlflow-operations).

- If you're doing remote tracking (tracking experiments running outside Azure Machine Learning), configure MLflow to point to your Azure Machine Learning workspace's tracking URI as explained at [Configure MLflow for Azure Machine Learning](../how-to-use-mlflow-configure-tracking.md).
