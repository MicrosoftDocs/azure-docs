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

1. Use the instructions at [Create an Azure Machine Learning service workspace](../articles/machine-learning/service/setup-create-workspace.md#portal) to do the following:
    * Create a Miniconda environment
    * Install the Azure Machine Learning SDK for Python
    * Create a workspace
    * Write a workspace configuration file (**aml_config/config.json**).

1. Clone [the GitHub repository](https://aka.ms/aml-notebooks).

    ```CLI
    git clone https://github.com/Azure/MachineLearningNotebooks.git
    ```

1. Start the notebook server from your cloned directory.

    ```shell
    jupyter notebook
    ```