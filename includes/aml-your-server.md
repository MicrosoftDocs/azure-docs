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

- The Azure Machine Learning SDK for Python installed. Use the instructions at [Azure Machine Learning SDK](https://docs.microsoft.com/python/api/overview/azure/ml/install?view=azure-ml-py)  to do the following:


1. Use the instructions at [Azure Machine Learning SDK](https://docs.microsoft.com/python/api/overview/azure/ml/install?view=azure-ml-py)  to do the following:
    * Create a Miniconda environment[Create and manage Azure Machine Learning service workspaces]
    * Install the Azure Machine Learning SDK for Python

1. Create an [Azure Machine Learning service workspace](../articles/machine-learning/service/how-to-manage-workspace.md).

1. Write a  [configuration file](../articles/machine-learning/service/how-to-configure-environment.md#workspace) file (**aml_config/config.json**).

1. Clone [the GitHub repository](https://aka.ms/aml-notebooks).

    ```CLI
    git clone https://github.com/Azure/MachineLearningNotebooks.git
    ```

1. Start the notebook server from your cloned directory.

    ```shell
    jupyter notebook
    ```