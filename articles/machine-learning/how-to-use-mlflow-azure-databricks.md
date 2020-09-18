---
title: MLflow Tracking for Azure Databricks ML experiments
titleSuffix: Azure Machine Learning
description:  Set up MLflow with Azure Machine Learning to log metrics and artifacts from Azure Databricks Ml experiments.
services: machine-learning
author: nibaccam
ms.author: nibaccam
ms.service: machine-learning
ms.subservice: core
ms.reviewer: nibaccam
ms.date: 09/22/2020
ms.topic: conceptual
ms.custom: how-to, devx-track-python
---

# Track Azure Databricks ML experiments with MLflow and Azure Machine Learning (preview)

In this article, you learn how to enable MLflow's tracking URI and logging API, collectively known as [MLflow Tracking](https://mlflow.org/docs/latest/quickstart.html#using-the-tracking-api), to connect your Azure Databricks (ADB) experiments, MLflow, and Azure Machine Learning.

[MLflow](https://www.mlflow.org) is an open-source library for managing the life cycle of your machine learning experiments. MLFlow Tracking is a component of MLflow that logs and tracks your training run metrics and model artifacts. Learn more about [Azure Databricks and MLflow](https://docs.microsoft.com/azure/databricks/applications/mlflow/). 

See [Track experiment runs and create endpoints with MLflow and Azure Machine Learning](how-to-use-mlflow.md) for additional MLflow and Azure Machine Learning functionality integrations.

>[!NOTE]
> As an open source library, MLflow changes frequently. As such, the functionality made available via the Azure Machine Learning and MLflow integration should be considered as a preview, and not fully supported by Microsoft.

> [!TIP]
> The information in this document is primarily for data scientists and developers who want to monitor the model training process. If you are an administrator interested in monitoring resource usage and events from Azure Machine Learning, such as quotas, completed training runs, or completed model deployments, see [Monitoring Azure Machine Learning](monitor-azure-machine-learning.md).

## Prerequisites

* Install the `azureml-mlflow` package. 
    * This package automatically brings in `azureml-core` of the [The Azure Machine Learning Python SDK](https://docs.microsoft.com/python/api/overview/azure/ml/install?view=azure-ml-py&preserve-view=true), which provides the connectivity for MLflow to access your workspace.
* An [Azure Databricks workspace and cluster](https://docs.microsoft.com/azure/azure-databricks/quickstart-create-databricks-workspace-portal).
* [Create an Azure Machine Learning Workspace](how-to-manage-workspace.md).

## Track Azure Databricks runs

MLflow Tracking with Azure Machine Learning lets you store the logged metrics and artifacts from your Azure Databricks runs into both your: 

* Azure Databricks workspace.
* Azure Machine Learning workspace

After you create your Azure Databricks workspace and cluster, 

1. Install the *azureml-mlflow* library from PyPi, to ensure that your cluster has access to the necessary functions and classes.

1. Set up your experiment notebook and workspaces.

1. Connect your Azure Databricks workspace and Azure Machine Learning workspace.

The following sections provide additional detail on the aforementioned steps to run your MLflow experiments with Azure Databricks. 

## Install libraries

To install libraries on your cluster, navigate to the **Libraries** tab and select **Install New**

 ![mlflow with azure databricks](./media/how-to-use-mlflow-azure-databricks/azure-databricks-cluster-libraries.png)

In the **Package** field, type azureml-mlflow and then select install. Repeat this step as necessary to install other additional packages to your cluster for your experiment.

 ![Azure DB install mlflow library](./media/how-to-use-mlflow-azure-databricks/install-libraries.png)

## Set up your notebook and workspace

Once your ADB cluster is set up, import your experiment notebook, open it and attach your cluster to it.

The following code should be in your experiment notebook. 
This code, 
*  Gets the details of your Azure subscription to instantiate your Azure Machine Learning workspace. 

* Assumes you have an existing resource group and Azure Machine Learning workspace, otherwise you can [create them](how-to-manage-workspace.md). 

```python
import mlflow
import mlflow.azureml
import azureml.mlflow
import azureml.core

from azureml.core import Workspace

subscription_id = 'subscription_id'

# Azure Machine Learning resource group NOT the managed resource group
resource_group = 'resource_group_name' 

#Azure Machine Learning workspace name, NOT Azure Databricks workspace
workspace_name = 'workspace_name'  

# Instantiate Azure Machine Learning workspace
ws = Workspace.get(name=workspace_name,
                   subscription_id=subscription_id,
                   resource_group=resource_group)
```

## Connect your Azure Databricks and Azure Machine Learning workspaces

Linking your ADB workspace to your Azure Machine Learning workspace enables you to track your experiment data in the Azure Machine Learning workspace.

To link your ADB workspace to a new or existing Azure Machine Learning workspace, 
1. Sign in to [Azure portal](https://ms.portal.azure.com)
1. Navigate to your ADB workspace's **Overview** page 
1. Select the **Link Azure Machine Learning workspace** button on the bottom right. 

 ![Link Azure DB and Azure Machine Learning workspaces](./media/how-to-use-mlflow-azure-databricks/link-workspaces.png)

## MLflow Tracking in your workspaces

After you instantiate your workspace, MLflow Tracking is automatically set to be tracked in
all of the following places:

* The linked Azure Machine Learning workspace.
* Your original ADB workspace. 

All your experiments will land in the managed Azure Machine Learning tracking service.

### Set MLflow Tracking to only track in your Azure Machine Learning workspace

If you prefer to manage your tracked experiments in a centralized location, you can set MLflow tracking  to **only** track in your Azure Machine Learning workspace. 

Include the following code in your script:

```python
uri = ws.get_mlflow_tracking_uri()
mlflow.set_tracking_uri(uri)
```

In your training script, import `mlflow` to use the MLflow logging APIs, and start logging your run metrics. The following example, logs the epoch loss metric. 

```python
import mlflow 
mlflow.log_metric('epoch_loss', loss.item()) 
```

## Create endpoints for MLflow models

When you are ready to create an endpoint for your ML models, you can deploy your MLflow experiments as an Azure Machine Learning web service. Deployment allows you to leverage and apply the Azure Machine Learning model management and data drift detection capabilities to your production models.

Azure Databricks runs can be deployed to the following endpoints, 
* [Azure Container Instance](how-to-use-mlflow.md#deploy-to-aci)
* [Azure Kubernetes Service](how-to-use-mlflow.md#deploy-to-aks)

## Clean up resources

If you don't plan to use the logged metrics and artifacts in your workspace, the ability to delete them individually is currently unavailable. Instead, delete the resource group that contains the storage account and workspace, so you don't incur any charges:

1. In the Azure portal, select **Resource groups** on the far left.

   ![Delete in the Azure portal](./media/how-to-use-mlflow-azure-databricks/delete-resources.png)

1. From the list, select the resource group you created.

1. Select **Delete resource group**.

1. Enter the resource group name. Then select **Delete**.

## Example notebooks

The [MLflow with Azure Machine Learning notebooks](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/track-and-monitor-experiments/using-mlflow) demonstrate and expand upon concepts presented in this article.

## Next steps

* [Manage your models](concept-model-management-and-deployment.md).
* [Track experiment runs and create endpoints with MLflow and Azure Machine Learning](how-to-use-mlflow.md). 
* Learn more about [Azure Databricks and MLflow](https://docs.microsoft.com/azure/databricks/applications/mlflow/).
