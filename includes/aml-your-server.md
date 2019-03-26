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

1. Use the instructions at [Create a Azure Machine Learning service workspace](../articles/machine-learning/service/setup-create-workspace.md#portal) to create a Miniconda environment, create a workspace, and write a workspace configuration file (**aml_config/config.json**).

1. Clone [the GitHub repository](https://aka.ms/aml-notebooks).

    ```
    git clone https://github.com/Azure/MachineLearningNotebooks.git
    ```

1. Add a workspace configuration file using either of these methods:
    * Copy the **aml_config/config.json** file you created using the prerequisite quickstart into the cloned directory.
    * Create a new workspace using code in the [configuration.ipynb](https://github.com/Azure/MachineLearningNotebooks/blob/master/configuration.ipynb).
1. Start the notebook server from your cloned directory.
    
    ```shell
    jupyter notebook
    ```