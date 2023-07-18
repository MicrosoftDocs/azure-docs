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

1. [Create an Azure Machine Learning workspace](../how-to-manage-workspace.md).

1. Download a workspace configuration file:

    * Sign in to [Azure Machine Learning studio](https://ml.azure.com)
    * Select your workspace settings in the upper right
    * Select **Download config file**

    ![Download config.json](./media/aml-dsvm-server/download-config.png)

1. From the directory where you added the configuration file, clone the [the AzureML-Examples repository](https://aka.ms/aml-notebooks).

    ```bash
    git clone https://github.com/Azure/azureml-examples.git --depth 1
    ```

1. Start the notebook server from the directory, which now contains the clone and the config file.

    ```bash
    jupyter notebook
    ```