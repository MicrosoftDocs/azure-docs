---
title: Development environments for Azure Machine Learning  | Microsoft Docs
description: An overview of development environments you can use with the Azure Machine Learning service. Python 3 is the only requirement for your development environment, but we recommend also using Conda environments. For development tooling, we recommend Jupyter Notebooks, Azure Notebooks, and IDE/code editors.
services: machine-learning
author: rastala
ms.author: roastala
manager:  cgronlun
ms.service: machine-learning
ms.component: core
ms.reviewer: larryfr
manager: cgronlun
ms.topic: conceptual
ms.date: 9/24/2018
---

# Development environment for Azure Machine Learning 

Learn about the development environments that you can use with the Azure Machine Learning service. 

The Azure Machine Learning service is platform agnostic, and doesn't require a specific development environment. It requires __Python 3__, and we recommend using __Conda__ to create isolated environments. __If you already have a development environment that meets those requirements__, you can skip this document and go to the [Configure your development environment](how-to-configure-environment.md) document.

The rest of this document discusses the development environments that we recommend:

* __Jupyter Notebooks__
* __Azure Notebooks__
* __Integrated development environments (IDE) and code editors__
* __Data Science Virtual Machine__

A comparison between these environments is difficult, as both notebooks and IDEs can be extended. For example, some IDEs can be used as clients to Jupyter Notebooks. Generally speaking, __notebooks__ are designed for __interactive experimentation__ and __visualization__. __IDEs and code editors__ provide tools to __improve code quality__ and __integrate with external systems__ such as version control.

> [!TIP]
> Using one environment doesn't lock you out of using the other. Notebooks and IDEs are just tools, and can be mixed as needed. For example, you might start experimenting in a notebook, then export to a python script for editing and debugging in an IDE.
>
> This is why the Data Science Virtual Machine provides both Jupyter Notebooks and several popular Python IDEs.

## Jupyter Notebooks

Jupyter Notebooks is part of the [Jupyter Project](https://jupyter.org/). They are focused on providing an interactive coding experience where you create documents that mix live code with narrative text and graphics. You can install Jupyter Notebooks on a variety of platforms.

Having your own Jupyter Notebook installation allows you to install and configure the environment as needed. However you are responsible for maintaining the system.

## Azure Notebooks

[Azure Notebooks](https://notebooks.azure.com) (preview) is a notebooks environment in the Azure cloud. It is based on Jupyter, and provides an environment that is pre-loaded with popular libraries. The Azure Machine Learning SDK is already installed in Azure Notebooks, so you can start experimenting with almost no setup.

Azure Notebooks also simplifies the process of sharing your notebooks. You can share a URL to your notebooks, make your library public, or share on social media from the Azure Notebooks interface.

The drawback of Azure Notebooks is that you do not have complete control over the environment, and may not be able to install custom software that you need. It is also a shared environment, so your notebooks may run slower than on a dedicated Jupyter Notebook installation.

## IDEs and code editors

There are many IDEs and code editors that will work with Azure Machine Learning. The only software requirement is the Azure Machine Learning SDK, which can be installed using the `pip` utility.

We recommend [Visual Studio Code](https://code.visualstudio.com/), as it provides tools for working with both the Python language and Azure Machine Learning. It's available for Linux, macOS, and Windows platforms.

## Data Science Virtual Machine

The Data Science Virtual Machine (DSVM) is a combination of the previous environments. It's a VM on the Azure Platform that has Jupyter Notebooks, Visual Studio Code, and the Azure Machine Learning SDK pre-installed. Creating the VM is more complex than Azure Notebooks, but less complex than setting up a machine from scratch. Since the required software is pre-installed in the VM image, you can begin experimenting with Azure Machine Learning quickly once the VM has been created.

The DSVM allows you to select compute resources you need, such as the CPU, GPU, and memory. It is also pre-installed with other editors such as PyCharm, as well as popular machine learning software such as TensorFlow, Keras, and PyTorch. If the software you need is not installed, you can install it yourself.

For more information on what is pre-installed, see the [What is the Data Science Virtual Machine](../data-science-virtual-machine/overview.md) document.

## Next steps

Now that you have learned about the development environments, learn [how to configure a development environment](how-to-configure-environment.md).

