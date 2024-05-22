---
author: santiagxf
ms.service: machine-learning
ms.topic: include
ms.date: 04/02/2024
ms.author: fasantia
---

Before you follow the steps in this article, make sure you have the following prerequisites:

* An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).

* An Azure Machine Learning workspace. If you don't have one, use the steps in the [How to manage workspaces](../how-to-manage-workspace.md) article to create one.

* To perform the following tasks, ensure that you have these permissions in the workspace:

    * To create/manage batch endpoints and deployments: Use owner role, contributor role, or a custom role allowing `Microsoft.MachineLearningServices/workspaces/batchEndpoints/*`.

    * To create ARM deployments in the workspace resource group: Use owner role, contributor role, or a custom role allowing `Microsoft.Resources/deployments/write` in the resource group where the workspace is deployed.

* You need to install the following software to work with Azure Machine Learning:

    # [Azure CLI](#tab/cli)

    [!INCLUDE [cli v2](machine-learning-cli-v2.md)]

    The [Azure CLI](/cli/azure/) and the `ml` [extension for Azure Machine Learning](../how-to-configure-cli.md).

    ```azurecli
    az extension add -n ml
    ```

    # [Python](#tab/python)

    [!INCLUDE [sdk v2](machine-learning-sdk-v2.md)]

    Install the [Azure Machine Learning SDK for Python](https://aka.ms/sdk-v2-install).

    ```python
    pip install azure-ai-ml
    ```

    # [Studio](#tab/azure-studio)

    There are no further requirements if you plan to use Azure Machine Learning studio.
