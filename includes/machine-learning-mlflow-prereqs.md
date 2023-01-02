---
author: santiagxf
ms.service: machine-learning
ms.topic: include
ms.date: 01/02/2023
ms.author: fasantia
---

* Install the `mlflow` package. 
    * You can use the [MLflow Skinny](https://github.com/mlflow/mlflow/blob/master/README_SKINNY.rst) which is a lightweight MLflow package without SQL storage, server, UI, or data science dependencies. This is recommended for users who primarily need the tracking and logging capabilities without importing the full suite of MLflow features including deployments.

* Install the `azureml-mlflow` package. 
* [Create an Azure Machine Learning Workspace](../articles/machine-learning/quickstart-create-resources.md).
    * See which [access permissions you need to perform your MLflow operations with your workspace](../articles/machine-learning/how-to-assign-roles.md#mlflow-operations).