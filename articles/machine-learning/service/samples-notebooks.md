---
title: Example Jupyter notebooks
titleSuffix: Azure Machine Learning service
description: Find and use example Jupyter notebooks to explore the Azure Machine Learning service Python SDK. 
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: sample

author: sdgilley
ms.author: sgilley
ms.reviewer: sgilley
ms.date: 05/29/2019
ms.custom: seodec18
#Customer intent: As a professional data scientist, I can build an image classification model with Azure Machine Learning using Python in a Jupyter notebook.
---

# Use Jupyter notebooks to explore Azure Machine Learning service

The [Azure Machine Learning Notebooks repository](https://github.com/azure/machinelearningnotebooks) includes the latest Azure Machine Learning Python SDK samples. These Juypter notebooks are designed to help you explore the SDK and serve as models for your own machine learning projects.

This article shows you how to access the repository from the following environments:

- [Azure Machine Learning Notebook VM](#azure-machine-learning-notebook-vm)
- [Bring your own notebook server](#bring-your-own-jupyter-notebook-server)
- [Data Science Virtual Machine](#data-science-virtual-machine)
- [Azure Notebooks](#azure-notebooks)

> [!NOTE]
> Once you've cloned the repository, you'll find tutorial notebooks in the **tutorials** folder and feature-specific notebooks in the **how-to-use-azureml** folder.

## Azure Machine Learning Notebook VM

The easiest way to get started with the samples is to complete the [cloud-based notebook quickstart](quickstart-run-cloud-notebook.md). Once completed, you'll have a dedicated notebook server pre-loaded with the SDK and the sample repository. No downloads or installation necessary.

## Bring your own Jupyter Notebook server

If you'd like to bring your own notebook server for local development, follow these steps:

[!INCLUDE [aml-your-server](../../../includes/aml-your-server.md)]

These instructions install the base SDK packages necessary for the quickstart and tutorial notebooks. Other sample notebooks may require you to install extra components. For more information, see [Install the Azure Machine Learning SDK for Python](https://docs.microsoft.com/python/api/overview/azure/ml/install).

## Data Science Virtual Machine

The Data Science Virtual Machine (DSVM) is a customized VM image built specifically for doing data science. If you [create a DSVM](how-to-configure-environment.md#dsvm), the SDK and notebook server are installed and configured for you. However, you'll still need to create a workspace and clone the sample repository.

[!INCLUDE [aml-dsvm-server](../../../includes/aml-dsvm-server.md)]

## Azure Notebooks

On [Azure Notebooks](https://notebooks.azure.com/), the SDK and notebook server are installed and configured for you. Azure Notebooks provides a fully-managed, lightweight notebook environment for you to explore.

To access the sample repository on Azure Notebooks, navigate to your Azure Machine Learning workspace through the [Azure portal](https://portal.azure.com). From the  **Overview** section, select **Get Started in Azure Notebooks**.

## Next steps

Explore the [sample notebooks](https://aka.ms/aml-notebooks) to discover what Azure Machine Learning service can do, or try these tutorials:

- [Train and deploy an image classification model with MNIST](tutorial-train-models-with-aml.md)

- [Prepare data and use automated machine learning to train a regression model with the NYC taxi data set](tutorial-data-prep.md)