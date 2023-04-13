---
author: blackmist
ms.service: machine-learning
ms.topic: include
ms.date: 10/07/2022
ms.author: larryfr
---

Before following the steps in this article, make sure you have the following prerequisites:

* An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).

* An Azure Machine Learning workspace. If you don't have one, use the steps in the [Quickstart: Create workspace resources](../articles/machine-learning/quickstart-create-resources.md) article to create one.

* The Azure CLI and the `ml` extension __or__ the Azure Machine Learning Python SDK v2:

    * To install the Azure CLI and extension, see [Install, set up, and use the CLI (v2)](../articles/machine-learning/how-to-configure-cli.md).

        > [!IMPORTANT]
        > The CLI examples in this article assume that you are using the Bash (or compatible) shell. For example, from a Linux system or [Windows Subsystem for Linux](/windows/wsl/about). 

    * To install the Python SDK v2, use the following command:

        ```bash
        pip install azure-ai-ml azure-identity
        ```

        For more information, see [Install the Python SDK v2 for Azure Machine Learning](https://aka.ms/sdk-v2-install).