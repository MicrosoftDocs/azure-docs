---
title: "include file"
description: "include file"
services: machine-learning
author: sdgilley
ms.service: machine-learning
ms.author: sgilley
manager: scottpolly
ms.custom: "include file"
ms.topic: "include"
ms.date: 08/30/2022
---

1. Use the instructions at [Azure Machine Learning SDK](https://aka.ms/sdk-v2-install)  to install the Azure Machine Learning SDK (v2) for Python

1. Create an [Azure Machine Learning workspace](../how-to-manage-workspace.md).

1. Write a  [configuration file](../how-to-configure-environment.md#) file (**aml_config/config.json**).

1. Clone [the AzureML-Examples repository](https://aka.ms/aml-notebooks).

    ```bash
    git clone https://github.com/Azure/azureml-examples.git --depth 1
    ```

1. Start the notebook server from the directory containing your clone.

    ```bash
    jupyter notebook
    ```