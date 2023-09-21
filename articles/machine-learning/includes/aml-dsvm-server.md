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

1. Add a workspace configuration file using either of these methods:

    * In [Azure Machine Learning studio](https://ml.azure.com), select your workspace settings in the upper right, then select **Download config file**. 

    ![Download config.json](./media/aml-dsvm-server/download-config.png)

    * Create a new workspace using code in the [configuration.ipynb](https://github.com/Azure/MachineLearningNotebooks/blob/master/configuration.ipynb) notebook.

1. From the directory where you added the configuration file, clone [the Machine Learning Notebooks repository](https://aka.ms/aml-notebooks).

    ```bash
    git clone https://github.com/Azure/MachineLearningNotebooks.git --depth 1
    ```

1. Start the notebook server from the directory, which now contains the clone and the config file.

    ```bash
    jupyter notebook
    ```