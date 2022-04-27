---
title: Example Jupyter Notebooks
titleSuffix: Azure Machine Learning
description: Learn how to find and use the Juypter Notebooks designed to help you explore the SDK and serve as models for your own machine learning projects.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: sample

author: sdgilley
ms.author: sgilley
ms.reviewer: sgilley
ms.date: 12/27/2021
ms.custom: seodec18
#Customer intent: As a professional data scientist, I find and run example Jupyter Notebooks for Azure Machine Learning.
---

# Explore Azure Machine Learning with Jupyter Notebooks

The [Azure Machine Learning Notebooks repository](https://github.com/azure/machinelearningnotebooks) includes the latest Azure Machine Learning Python SDK samples. These Jupyter notebooks are designed to help you explore the SDK and serve as models for your own machine learning projects.  In this repository, you'll find tutorial notebooks in the **tutorials** folder and feature-specific notebooks in the **how-to-use-azureml** folder.

Also explore the community-driven repository of [AzureML-Examples](https://github.com/Azure/azureml-examples). This repository includes notebooks and [CLI (v2)](how-to-configure-cli.md) examples. For information on the various example types, see the [readme](https://github.com/Azure/azureml-examples#azure-machine-learning-examples).

This article shows you how to access the repositories from the following environments:

- [Azure Machine Learning compute instance](#notebookvm)
- [Bring your own notebook server](#byo)
- [Data Science Virtual Machine](#dsvm)


<a name="notebookvm"></a>
## Get samples on Azure Machine Learning compute instance

The easiest way to get started with the samples is to complete the [Quickstart: Get started with Azure Machine Learning](quickstart-create-resources.md). Once completed, you'll have a dedicated notebook server pre-loaded with the SDK and the Azure Machine Learning Notebooks repository. No downloads or installation necessary.

To add the community-driven repository, [use a compute instance terminal](how-to-access-terminal.md).  In the terminal window, clone the repository:

```bash
git clone https://github.com/Azure/azureml-examples.git --depth 1
```

<a name="byo"></a>

## Get samples on your notebook server

If you'd like to bring your own notebook server for local development, follow these steps on your computer.

[!INCLUDE [aml-your-server](../../includes/aml-your-server.md)]

These instructions install the base SDK packages necessary for the quickstart and tutorial notebooks. Other sample notebooks may require you to install extra components. For more information, see [Install the Azure Machine Learning SDK for Python](/python/api/overview/azure/ml/install).

<a name="dsvm"></a>
## Get samples on DSVM

The Data Science Virtual Machine (DSVM) is a customized VM image built specifically for doing data science. If you [create a DSVM](how-to-configure-environment.md#dsvm), the SDK and notebook server are installed and configured for you. However, you'll still need to create a workspace and clone the sample repository.

[!INCLUDE [aml-dsvm-server](../../includes/aml-dsvm-server.md)]

## Next steps

Explore the [MachineLearningNotebooks](https://github.com/Azure/MachineLearningNotebooks) and [AzureML-Examples](https://github.com/Azure/azureml-examples) repositories to discover what Azure Machine Learning can do.

For more GitHub sample projects and examples, see these repos:
+ [Microsoft/MLOps](https://github.com/Microsoft/MLOps)
+ [Microsoft/MLOpsPython](https://github.com/microsoft/MLOpsPython)

Try these tutorials:

- [Train and deploy an image classification model with MNIST](tutorial-train-deploy-notebook.md)

- [Prepare data and use automated machine learning to train a regression model with the NYC taxi data set](tutorial-auto-train-models.md)
