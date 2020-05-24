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
ms.date: 03/05/2020
---

1. Use the instructions at [Azure Machine Learning SDK](https://docs.microsoft.com/python/api/overview/azure/ml/install?view=azure-ml-py)  to install the Azure Machine Learning SDK for Python

1. Create an [Azure Machine Learning workspace](../articles/machine-learning/how-to-manage-workspace.md).

1. Write a  [configuration file](../articles/machine-learning/how-to-configure-environment.md#workspace) file (**aml_config/config.json**).

1. Clone [the GitHub repository](https://aka.ms/aml-notebooks).

    ```bash
    git clone https://github.com/Azure/MachineLearningNotebooks.git
    ```

1. Start the notebook server from your cloned directory.

    ```bash
    jupyter notebook
    ```