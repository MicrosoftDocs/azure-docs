---
ms.service: machine-learning
ms.topic: include
ms.date: 08/09/2024
author: ccrestana
ms.author: cacrest
---

- An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).

- An Azure Machine Learning workspace. To create a workspace, see [Manage Azure Machine Learning workspaces](../how-to-manage-workspace.md).

- Confirm you have the following permissions in the Machine Learning workspace:

   - **Create or manage batch endpoints and deployments**: Use an Owner, Contributor, or Custom role that allows `Microsoft.MachineLearningServices/workspaces/batchEndpoints/*`.

   - **Create Azure Resource Manager deployments in the workspace resource group**: Use an Owner, Contributor, or Custom role that allows `Microsoft.Resources/deployments/write` in the resource group where the workspace is deployed.

- Install the following software to work with Machine Learning:

   # [Azure CLI](#tab/cli)
   
   Run the following command to install the [Azure CLI](/cli/azure/) and the `ml` [extension for Azure Machine Learning](../how-to-configure-cli.md):
   
   ```azurecli
   az extension add -n ml
   ```
   
   Pipeline component deployments for Batch Endpoints are introduced in version 2.7 of the `ml` extension for the Azure CLI. Use the `az extension update --name ml` command to get the latest version.
   
   # [Python](#tab/python)
   
   Run the following command to install the [Azure Machine Learning SDK for Python](https://aka.ms/sdk-v2-install):
   
   ```python
   pip install azure-ai-ml
   ```
   
   The `ModelBatchDeployment` and `PipelineComponentBatchDeployment` classes are introduced in version 1.7.0 of the SDK. Use the `pip install -U azure-ai-ml` command to get the latest version.

   ---
   
### Connect to your workspace

The workspace is the top-level resource for Machine Learning. It provides a centralized place to work with all artifacts you create when you use Machine Learning. In this section, you connect to the workspace where you perform your deployment tasks.

# [Azure CLI](#tab/cli)

In the following command, enter the values for your subscription ID, workspace, location, and resource group:

```azurecli
az account set --subscription <subscription>
az configure --defaults workspace=<workspace> group=<resource-group> location=<location>
```

# [Python](#tab/python)

1. Import the required libraries:

   ```python
   from azure.ai.ml import MLClient, Input, load_component
   from azure.ai.ml.entities import BatchEndpoint, ModelBatchDeployment, ModelBatchDeploymentSettings, PipelineComponentBatchDeployment, Model, AmlCompute, Data, BatchRetrySettings, CodeConfiguration, Environment, Data
   from azure.ai.ml.constants import AssetTypes, BatchDeploymentOutputAction
   from azure.ai.ml.dsl import pipeline
   from azure.identity import DefaultAzureCredential
   ```

1. Configure the workspace details and get a handle to the workspace:

   In the following command, enter the values for your subscription ID, workspace, and resource group:
   
   ```python
   subscription_id = "<subscription>"
   resource_group = "<resource-group>"
   workspace = "<workspace>"
   
   ml_client = MLClient(DefaultAzureCredential(), subscription_id, resource_group, workspace)
   ```

---
