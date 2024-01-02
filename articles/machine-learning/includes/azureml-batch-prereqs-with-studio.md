---
author: santiagxf
ms.service: machine-learning
ms.topic: include
ms.date: 04/22/2023
ms.author: fasantia
---

Before following the steps in this article, make sure you have the following prerequisites:

* An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).
 
* An Azure Machine Learning workspace. If you don't have one, use the steps in the [How to manage workspaces](../how-to-manage-workspace.md) to create one.

* Ensure you have the following permissions in the workspace:

    * Create/manage batch endpoints and deployments: Use roles Owner, contributor, or custom role allowing `Microsoft.MachineLearningServices/workspaces/batchEndpoints/*`.

    * Create ARM deployments in the workspace resource group: Use roles Owner, contributor, or custom role allowing `Microsoft.Resources/deployments/write` in the resource group where the workspace is deployed.

* You will need to install the following software to work with Azure Machine Learning:

    # [Azure CLI](#tab/cli)
    
    The [Azure CLI](/cli/azure/) and the `ml` [extension for Azure Machine Learning](../how-to-configure-cli.md).
    
    ```azurecli
    az extension add -n ml
    ```
    
    # [Python](#tab/python)
    
    Install the [Azure Machine Learning SDK for Python](https://aka.ms/sdk-v2-install).
    
    ```python
    pip install azure-ai-ml
    ```
    
    # [Studio](#tab/studio)
    
    There are no further requirements if you plan to use Azure Machine Learning studio.
    
### Connect to your workspace

First, let's connect to Azure Machine Learning workspace where we're going to work on.

# [Azure CLI](#tab/cli)

```azurecli
az account set --subscription <subscription>
az configure --defaults workspace=<workspace> group=<resource-group> location=<location>
```

# [Python](#tab/python)

The workspace is the top-level resource for Azure Machine Learning, providing a centralized place to work with all the artifacts you create when you use Azure Machine Learning. In this section, we'll connect to the workspace in which you'll perform deployment tasks.

1. Import the required libraries:

    ```python
    from azure.ai.ml import MLClient, Input, load_component
    from azure.ai.ml.entities import BatchEndpoint, ModelBatchDeployment, ModelBatchDeploymentSettings, PipelineComponentBatchDeployment, Model, AmlCompute, Data, BatchRetrySettings, CodeConfiguration, Environment, Data
    from azure.ai.ml.constants import AssetTypes, BatchDeploymentOutputAction
    from azure.ai.ml.dsl import pipeline
    from azure.identity import DefaultAzureCredential
    ```

    > [!NOTE]
    > Classes `ModelBatchDeployment` and `PipelineComponentBatchDeployment` were introduced in version 1.7.0 of the SDK.

2. Configure workspace details and get a handle to the workspace:

    ```python
    subscription_id = "<subscription>"
    resource_group = "<resource-group>"
    workspace = "<workspace>"
    
    ml_client = MLClient(DefaultAzureCredential(), subscription_id, resource_group, workspace)
    ```

# [Studio](#tab/studio)

Open the [Azure Machine Learning studio portal](https://ml.azure.com) and sign in using your credentials.

---