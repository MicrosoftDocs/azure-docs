---
title: Configure MLflow for Azure Machine Learning
titleSuffix: Azure Machine Learning
description:  Connect MLflow to Azure Machine Learning workspaces to log metrics, artifacts and deploy models.
services: machine-learning
author: santiagxf
ms.author: fasantia
ms.reviewer: mopeakande
ms.service: machine-learning
ms.subservice: mlops
ms.date: 11/04/2022
ms.topic: how-to
ms.custom: mlflow, cliv2, devplatv2, event-tier1-build-2022
ms.devlang: azurecli
---


# Configure MLflow for Azure Machine Learning

Azure Machine Learning workspaces are MLflow-compatible, which means they can act as an MLflow server without any extra configuration. Each workspace has an MLflow tracking URI that can be used by MLflow to connect to the workspace. Azure Machine Learning workspaces **are already configured to work with MLflow** so no extra configuration is required.

However, if you are working outside of Azure Machine Learning (like your local machine, Azure Synapse Analytics, or Azure Databricks) you need to configure MLflow to point to the workspace. In this article, you'll learn how you can configure MLflow to connect to an Azure Machine Learning for tracking, registries, and deployment. 

> [!IMPORTANT]
> When running on Azure Compute (Azure Machine Learning Notebooks, Jupyter notebooks hosted on Azure Machine Learning Compute Instances, or jobs running on Azure Machine Learning compute clusters) you don't have to configure the tracking URI. **It's automatically configured for you**.

## Prerequisites

You need the following prerequisites to follow this tutorial:

[!INCLUDE [mlflow-prereqs](includes/machine-learning-mlflow-prereqs.md)]


## Configure MLflow tracking URI

To connect MLflow to an Azure Machine Learning workspace, you need the tracking URI for the workspace. Each workspace has its own tracking URI and it has the protocol `azureml://`.

[!INCLUDE [mlflow-configure-tracking](includes/machine-learning-mlflow-configure-tracking.md)]

## Configure authentication

Once the tracking is set, you'll also need to configure how the authentication needs to happen to the associated workspace. By default, the Azure Machine Learning plugin for MLflow will perform interactive authentication by opening the default browser to prompt for credentials.

The Azure Machine Learning plugin for MLflow supports several authentication mechanisms through the package `azure-identity`, which is installed as a dependency for the plugin `azureml-mlflow`. The following authentication methods are tried one by one until one of them succeeds:

1. __Environment__: it reads account information specified via environment variables and use it to authenticate.
1. __Managed Identity__: If the application is deployed to an Azure host with Managed Identity enabled, it authenticates with it.  
1. __Azure CLI__: if a user has signed in via the Azure CLI `az login` command, it authenticates as that user.
1. __Azure PowerShell__: if a user has signed in via Azure PowerShell's `Connect-AzAccount` command, it authenticates as that user.
1. __Interactive browser__: it interactively authenticates a user via the default browser.

[!INCLUDE [mlflow-configure-auth](includes/machine-learning-mlflow-configure-auth.md)]

If you'd rather use a certificate instead of a secret, you can configure the environment variables `AZURE_CLIENT_CERTIFICATE_PATH` to the path to a `PEM` or `PKCS12` certificate file (including private key) and 
`AZURE_CLIENT_CERTIFICATE_PASSWORD` with the password of the certificate file, if any.

### Configure authorization and permission levels

Some default roles like [AzureML Data Scientist or contributor](how-to-assign-roles.md#default-roles) are already configured to perform MLflow operations in an Azure Machine Learning workspace. If using a custom roles, you need the following permissions:

* **To use MLflow tracking:** 
    * `Microsoft.MachineLearningServices/workspaces/experiments/*`.
    * `Microsoft.MachineLearningServices/workspaces/jobs/*`.

* **To use MLflow model registry:**
    * `Microsoft.MachineLearningServices/workspaces/models/*/*`

Grant access for the service principal you created or user account to your workspace as explained at [Grant access](../role-based-access-control/quickstart-assign-role-user-portal.md#grant-access).

### Troubleshooting authentication

MLflow will try to authenticate to Azure Machine Learning on the first operation interacting with the service, like `mlflow.set_experiment()` or `mlflow.start_run()`. If you find issues or unexpected authentication prompts during the process, you can increase the logging level to get more details about the error:

```python
import logging

logging.getLogger("azure").setLevel(logging.DEBUG)
```

## Set experiment name (optional)

All MLflow runs are logged to the active experiment. By default, runs are logged to an experiment named `Default` that is automatically created for you. You can configure the experiment where tracking is happening.

> [!TIP]
> When submitting jobs using Azure Machine Learning CLI v2, you can set the experiment name using the property `experiment_name` in the YAML definition of the job. You don't have to configure it on your training script. See [YAML: display name, experiment name, description, and tags](reference-yaml-job-command.md#yaml-display-name-experiment-name-description-and-tags) for details.


# [MLflow SDK](#tab/mlflow)

To configure the experiment you want to work on use MLflow command [`mlflow.set_experiment()`](https://mlflow.org/docs/latest/python_api/mlflow.html#mlflow.set_experiment).
    
```Python
experiment_name = 'experiment_with_mlflow'
mlflow.set_experiment(experiment_name)
```

# [Using environment variables](#tab/environ)

You can also set one of the MLflow environment variables [MLFLOW_EXPERIMENT_NAME or MLFLOW_EXPERIMENT_ID](https://mlflow.org/docs/latest/cli.html#cmdoption-mlflow-run-arg-uri) with the experiment name. 

```bash
export MLFLOW_EXPERIMENT_NAME="experiment_with_mlflow"
```

---

## Non-public Azure Clouds support

The Azure Machine Learning plugin for MLflow is configured by default to work with the global Azure cloud. However, you can configure the Azure cloud you are using by setting the environment variable `AZUREML_CURRENT_CLOUD`.

# [MLflow SDK](#tab/mlflow)

```Python
import os

os.environ["AZUREML_CURRENT_CLOUD"] = "AzureChinaCloud"
```

# [Using environment variables](#tab/environ)

```bash
export AZUREML_CURRENT_CLOUD="AzureChinaCloud"
```

---

You can identify the cloud you are using with the following Azure CLI command:

```bash
az cloud list
```

The current cloud has the value `IsActive` set to `True`.

## Next steps

Now that your environment is connected to your workspace in Azure Machine Learning, you can start to work with it.

- [Track ML experiments and models with MLflow](how-to-use-mlflow-cli-runs.md)
- [Manage models registries in Azure Machine Learning with MLflow]()
- [Train with MLflow Projects (Preview)](how-to-train-mlflow-projects.md)
- [Guidelines for deploying MLflow models](how-to-deploy-mlflow-models.md)
