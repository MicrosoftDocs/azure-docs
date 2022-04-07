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

1. Use the instructions at [Azure Machine Learning SDK](/python/api/overview/azure/ml/install)  to install the Azure Machine Learning SDK for Python

1. Create an [Azure Machine Learning workspace](../articles/machine-learning/how-to-manage-workspace.md).

1. Write a  [configuration file](../articles/machine-learning/how-to-configure-environment.md#workspace) file (**aml_config/config.json**).

1. Clone [the Machine Learning Notebooks repository](https://aka.ms/aml-notebooks).

    ```bash
    git clone https://github.com/Azure/MachineLearningNotebooks.git --depth 1
    ```

1. Clone [the AzureML-Examples repository](https://aka.ms/aml-notebooks).

    ```bash
    git clone https://github.com/Azure/azureml-examples.git --depth 1
    ```

1. Start the notebook server from the directory containing both these clones.

    ```bash
    jupyter notebook
    ```