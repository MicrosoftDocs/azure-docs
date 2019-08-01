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
ms.date: 01/25/2019
---

1. [Create an Azure Machine Learning service workspace](../articles/machine-learning/service/setup-create-workspace.md).

1. Clone [the GitHub repository](https://aka.ms/aml-notebooks).

    ```CLI
    git clone https://github.com/Azure/MachineLearningNotebooks.git
    ```

1. Add a workspace configuration file to the cloned directory using either of these methods:

    * In the [Azure portal](https://ms.portal.azure.com), select  **Download config.json** from the **Overview** section of your workspace. 

    ![Download config.json](./media/aml-dsvm-server/download-config.png)

    * Create a new workspace using code in the [configuration.ipynb](https://github.com/Azure/MachineLearningNotebooks/blob/master/configuration.ipynb) notebook in your cloned directory.

1. Start the notebook server from your cloned directory.

    ```shell
    jupyter notebook
    ```