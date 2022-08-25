---
title: Train ML models
titleSuffix: Azure Machine Learning
description: Configure and submit Azure Machine Learning jobs to train your models using the SDK, CLI, etc.
services: machine-learning
author: balapv
ms.author: balapv
ms.reviewer: larryfr
ms.service: machine-learning
ms.subservice: core
ms.date: 08/25/2022
ms.topic: how-to
ms.custom: sdkv2
---

# Train models with Azure Machine Learning

[!INCLUDE [sdk v2](../../includes/machine-learning-sdk-v2.md)]
[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

Azure Machine Learning provides multiple ways to submit ML training jobs. In this article, you'll learn how to submit jobs using the following methods:

* Azure CLI extension for machine learning: The `ml` extension, also referred to as CLI v2.
* Python SDK v2 for Azure Machine Learning.
* REST API: The API that the CLI and SDK are built on.

> [!IMPORTANT]
> SDK v2 is currently in public preview.
> The preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).
* An Azure Machine Learning workspace. If you don't have one, you can use the steps in the [Quickstart: Create Azure ML resources](quickstart-create-resources.md) article.

# [Python SDK](#tab/pythonsdkv2)

To use the __SDK__ information, install the Azure Machine Learning [SDK v2 for Python](https://aka.ms/sdk-v2-install).

# [Azure CLI](#tab/azurecli)

To use the __CLI__ information, install the [Azure CLI and extension for machine learning](how-to-configure-cli.md).

# [REST API](#tab/restapi)

To use the __REST API__ information, you need the following items:

- A __service principal__ in your workspace. Administrative REST requests use [service principal authentication](how-to-setup-authentication.md#use-service-principal-authentication).
- A service principal __authentication token__. Follow the steps in [Retrieve a service principal authentication token](./how-to-manage-rest.md#retrieve-a-service-principal-authentication-token) to retrieve this token. 
- The __curl__ utility. The curl program is available in the [Windows Subsystem for Linux](/windows/wsl/install-win10) or any UNIX distribution. 

    > [!TIP]
    > In PowerShell, `curl` is an alias for `Invoke-WebRequest` and `curl -d "key=val" -X POST uri` becomes `Invoke-WebRequest -Body "key=val" -Method POST -Uri uri`.
    >
    > While it is possible to call the REST API from PowerShell, the examples in this article assume you are using Bash.

---

### Clone the examples repository

The code snippets in this article are based on examples in the [Azure ML examples GitHub repo](https://github.com/azure/azureml-examples). To clone the repository to your development environment, use the following command:

```bash
git clone --depth 1 https://github.com/Azure/azureml-examples
```

> [!TIP]
> Use `--depth 1` to clone only the latest commit to the repository, which reduces time to complete the operation.

## Example job

The example machine learning training job used in this article is [TBD]. You can use the following steps to run it locally on your development environment before using it with Azure ML.

[TBD]

## Train in the cloud

After confirming that the training job works locally, we can run it in the cloud with Azure ML. 

[TBD - do we want to assume they've followed the quickstart to create compute resources? If we inline creation steps, then we're duplicating content from the 'how to create workspace/computes' articles.]

### 1. Connect to the workspace

# [Python SDK](#tab/pythonsdkv2)

To connect to the workspace, you need identifier parameters - a subscription, resource group, and workspace name. You'll use these details in the `MLClient` from `azure.ai.ml` to get a handle to the required Azure Machine Learning workspace. To authenticate, you use the [default Azure authentication](/python/api/azure-identity/azure.identity.defaultazurecredential?view=azure-python&preserve-view=true). Check this [example](https://github.com/Azure/azureml-examples/blob/sdk-preview/sdk/jobs/configuration.ipynb) for more details on how to configure credentials and connect to a workspace.

```python
#import required libraries
from azure.ai.ml import MLClient
from azure.identity import DefaultAzureCredential

#Enter details of your AzureML workspace
subscription_id = '<SUBSCRIPTION_ID>'
resource_group = '<RESOURCE_GROUP>'
workspace = '<AZUREML_WORKSPACE_NAME>'

#connect to the workspace
ml_client = MLClient(DefaultAzureCredential(), subscription_id, resource_group, workspace)
```

# [Azure CLI](#tab/azurecli)

When using the Azure CLI, you need identifier parameters - a subscription, resource group, and workspace name. While you can specify these parameters for each command, you can also set defaults that will be used for all the commands. Use the following steps to set default values:

[TBD]

# [REST API](#tab/restapi)

The REST API examples in this article use `$SUBSCRIPTION_ID`, `$RESOURCE_GROUP`, `$LOCATION`, `$WORKSPACE`, and `$TOKEN` as placeholders. Replace the placeholders with your own values as follows:

* `$SUBSCRIPTION_ID`: Your Azure subscription ID.
* `$RESOURCE_GROUP`: The Azure resource group that contains your workspace.
* `$LOCATION`: The Azure region where your workspace is located.
* `$WORKSPACE`: The name of your Azure Machine Learning workspace.
* `$COMPUTE_NAME`: The name of your Azure Machine Learning compute cluster.
* `$TOKEN`: The authentication token used to authenticate the REST API requests.

---

### 2. Create a training environment

To train in the cloud, a Docker image is used to provide the training environment. To create the environment, use the following steps:

# [Python SDK](#tab/pythonsdkv2)

[TBD]

# [Azure CLI](#tab/azurecli)

[TBD]

# [REST API](#tab/restapi)

[TBD]

---

### 3. Configure the training data

There are multiple potential storage options for your training data in the cloud. Azure Machine Learning uses _datastores_ as an abstraction over the underlying storage type. In this step, you'll create a datastore that is backed by the default Azure Storage Account used by your workspace:

# [Python SDK](#tab/pythonsdkv2)

[TBD]

# [Azure CLI](#tab/azurecli)

[TBD]

# [REST API](#tab/restapi)

[TBD]

---

### 4. Submit the training job

# [Python SDK](#tab/pythonsdkv2)

[TBD]

# [Azure CLI](#tab/azurecli)

[TBD]

# [REST API](#tab/restapi)

[TBD - we would also cover the "upload training script to storage" step here]

---

## Submit a hyperparameter sweep

[Not sure if we want to cover this here or just link to the hyperparametere sweep article]

## Register the model

[Not sure if we need this step or not, but it's been called out in the past as something customers found hard to understand/find info on.]

## Next steps

Now that you have a trained model, learn [how to deploy it](how-to-deploy-managed-online-endpoint.md).

