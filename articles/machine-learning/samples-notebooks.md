---
title: Example Jupyter notebooks
titleSuffix: Azure Machine Learning
description: Find and use example Jupyter notebooks to explore the Azure Machine Learning Python for SDK.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: sample

author: sdgilley
ms.author: sgilley
ms.reviewer: sgilley
ms.date: 03/05/2020
ms.custom: seodec18
#Customer intent: As a professional data scientist, I find and run example Jupyter notebooks for Azure Machine Learning.
---

# Explore Azure Machine Learning with Jupyter notebooks

The [example Azure Machine Learning Notebooks repository](https://github.com/azure/machinelearningnotebooks) includes the latest Azure Machine Learning Python SDK samples. These Juypter notebooks are designed to help you explore the SDK and serve as models for your own machine learning projects.

This article shows you how to access the repository from the following environments:

- [Azure Machine Learning compute instance](#notebookvm)
- [Bring your own notebook server](#byo)
- [Data Science Virtual Machine](#dsvm)

> [!NOTE]
> Once you've cloned the repository, you'll find tutorial notebooks in the **tutorials** folder and feature-specific notebooks in the **how-to-use-azureml** folder.

<a name="notebookvm"></a>
## Get samples on Azure Machine Learning compute instance

The easiest way to get started with the samples is to complete the [Tutorial: Setup environment and workspace](tutorial-1st-experiment-sdk-setup.md). Once completed, you'll have a dedicated notebook server pre-loaded with the SDK and the sample repository. No downloads or installation necessary.

<a name="byo"></a>

## Get samples on your notebook server

If you'd like to bring your own notebook server for local development, follow these steps:

[!INCLUDE [aml-your-server](../../includes/aml-your-server.md)]

These instructions install the base SDK packages necessary for the quickstart and tutorial notebooks. Other sample notebooks may require you to install extra components. For more information, see [Install the Azure Machine Learning SDK for Python](https://docs.microsoft.com/python/api/overview/azure/ml/install).

<a name="dsvm"></a>
## Get samples on DSVM

The Data Science Virtual Machine (DSVM) is a customized VM image built specifically for doing data science. If you [create a DSVM](how-to-configure-environment.md#dsvm), the SDK and notebook server are installed and configured for you. However, you'll still need to create a workspace and clone the sample repository.

[!INCLUDE [aml-dsvm-server](../../includes/aml-dsvm-server.md)]

## Next steps

Explore the [sample notebooks](https://aka.ms/aml-notebooks) to discover what Azure Machine Learning can do.

For more GitHub sample projects and examples, see these repos:
+ [Microsoft/MLOps](https://github.com/Microsoft/MLOps)
+ [Microsoft/MLOpsPython](https://github.com/microsoft/MLOpsPython)

Try these tutorials:

- [Train and deploy an image classification model with MNIST](tutorial-train-models-with-aml.md)

- [Prepare data and use automated machine learning to train a regression model with the NYC taxi data set](tutorial-auto-train-models.md)
