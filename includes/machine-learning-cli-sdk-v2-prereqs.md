---
author: blackmist
ms.service: machine-learning
ms.topic: include
ms.date: 09/14/2022
ms.author: larryfr
---

Before following the steps in this article, make sure you have the following prerequisites:

* An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).

* An Azure Machine Learning workspace. If you don't have one, use the steps in the [Quickstart: Create workspace resources](../articles/machine-learning/quickstart-create-resources.md) article to create one.

* The Azure CLI extension for ML or Azure ML Python SDK v2 (preview):
    # [Azure CLI](#tab/cli)

    * Install and configure the Azure CLI and ML extension. For more information, see [Install, set up, and use the CLI (v2)](/azure/machine-learning/how-to-configure-cli). 

    * If you've not already set the defaults for Azure CLI, you should save your default settings. To avoid having to repeatedly pass in the values, run:

    ```azurecli
    az account set --subscription <subscription id>
    az configure --defaults workspace=<azureml workspace name> group=<resource group>
    ```

    # [Python SDK](#tab/python)

    * If you haven't installed Python SDK v2 (preview), please install with this command:

    ```azurecli
    pip install --pre azure-ai-ml
    ```

    For more information, see [Install the Azure Machine Learning SDK v2 (preview) for Python](/python/api/overview/azure/ml/installv2).

    ---