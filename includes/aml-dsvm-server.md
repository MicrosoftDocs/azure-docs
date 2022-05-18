---
title: "include file"
description: "include file"
services: machine-learning
author: sdgilley
ms.service: machine-learning
ms.author: sgilley
manager: cgronlund
ms.custom: "include file"
ms.topic: "include"
ms.date: 12/27/2021
---

1. [Create an Azure Machine Learning workspace](../articles/machine-learning/how-to-manage-workspace.md).

1. Add a workspace configuration file using either of these methods:

    * In the [Azure portal](https://portal.azure.com), select  **Download config.json** from the **Overview** section of your workspace. 

    ![Download config.json](./media/aml-dsvm-server/download-config.png)

    * Create a new workspace using code in the [configuration.ipynb](https://github.com/Azure/MachineLearningNotebooks/blob/master/configuration.ipynb) notebook in your cloned directory.

1. From the directory where you added the configuration file, clone [the Machine Learning Notebooks repository](https://aka.ms/aml-notebooks).

    ```bash
    git clone https://github.com/Azure/MachineLearningNotebooks.git --depth 1
    ```

1. From the same directory, clone [the AzureML-Examples repository](https://aka.ms/aml-notebooks).

    ```bash
    git clone https://github.com/Azure/azureml-examples.git --depth 1
    ```

1. Start the notebook server from the directory, which now contains the two clones and the config file.

    ```bash
    jupyter notebook
    ```