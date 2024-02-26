---
title: "include file"
description: "include file"
services: machine-learning
author: sdgilley
ms.service: machine-learning
ms.author: sgilley
ms.custom: "include file"
ms.topic: "include"
ms.date: 12/27/2021
---

1. Use the instructions at [Azure Machine Learning SDK](/python/api/overview/azure/ml/install)  to install the Azure Machine Learning SDK (v1) for Python

1. Create an [Azure Machine Learning workspace](../v1/how-to-manage-workspace.md).

1. Write a  [configuration file](../v1/how-to-configure-environment.md) file (**aml_config/config.json**).

1. Clone [the Machine Learning Notebooks repository](https://aka.ms/aml-notebooks).

    ```bash
    git clone https://github.com/Azure/MachineLearningNotebooks.git --depth 1
    ```

1. Start the notebook server from the directory containing your clone.

    ```bash
    jupyter notebook
    ```