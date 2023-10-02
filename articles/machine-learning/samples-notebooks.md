---
title: Example Jupyter Notebooks (v2)
titleSuffix: Azure Machine Learning
description: Learn how to find and use the Juypter Notebooks designed to help you explore the SDK (v2) and serve as models for your own machine learning projects.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: sample

author: sdgilley
ms.author: sgilley
ms.reviewer: sgilley
ms.date: 08/30/2022
ms.custom: seodec18, ignite-2022
#Customer intent: As a professional data scientist, I find and run example Jupyter Notebooks for Azure Machine Learning.
---

# Explore Azure Machine Learning with Jupyter Notebooks

[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

The [AzureML-Examples](https://github.com/Azure/azureml-examples) repository includes the latest (v2) Azure Machine Learning Python CLI and SDK samples. For information on the various example types, see the [readme](https://github.com/Azure/azureml-examples#azure-machine-learning-examples).

This article shows you how to access the repository from the following environments:

- Azure Machine Learning compute instance
- Your own compute resource
- Data Science Virtual Machine


## Option 1: Access on Azure Machine Learning compute instance (recommended)

The easiest way to get started with the samples is to complete the [Create resources to get started](quickstart-create-resources.md). Once completed, you'll have a dedicated notebook server pre-loaded with the SDK and the Azure Machine Learning Notebooks repository. No downloads or installation necessary.

To view example notebooks:

1. Sign in to [studio](https://ml.azure.com) and select your workspace if necessary.
1. Select **Notebooks**.
1. Select the **Samples** tab. Use the **SDK v2** folder for examples using Python SDK v2.


## Option 2: Access on your own notebook server

If you'd like to bring your own notebook server for local development, follow these steps on your computer.

[!INCLUDE [aml-your-server](includes/aml-your-server-v2.md)]

These instructions install the base SDK packages necessary for the quickstart and tutorial notebooks. Other sample notebooks may require you to install extra components. For more information, see [Install the Azure Machine Learning SDK for Python](https://aka.ms/sdk-v2-install).


## Option 3: Access on a DSVM

The Data Science Virtual Machine (DSVM) is a customized VM image built specifically for doing data science. If you [create a DSVM](how-to-configure-environment.md#local-and-dsvm-only-create-a-workspace-configuration-file), the SDK and notebook server are installed and configured for you. However, you'll still need to create a workspace and clone the sample repository.

[!INCLUDE [aml-dsvm-server](includes/aml-dsvm-server-v2.md)]

## Next steps

Explore the [AzureML-Examples](https://github.com/Azure/azureml-examples) repository to discover what Azure Machine Learning can do.

For more examples of MLOps, see [https://github.com/Azure/mlops-v2](https://github.com/Azure/mlops-v2).

Try these tutorials:

- [Train and deploy an image classification model with MNIST](tutorial-train-deploy-notebook.md)

- [Tutorial: Train an object detection model with AutoML and Python](tutorial-auto-train-image-models.md)
