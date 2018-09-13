---
title: How to choose a development environment for Azure Machine Learning  | Microsoft Docs
description: This how-to guide explains how to select a development environment when working with Azure Machine Learning.
services: machine-learning
author: rastala
ms.author: roastala
manager:  danielsc
ms.service: machine-learning
ms.workload: data-services
ms.custom: mvc
ms.topic: conceptual
ms.date: 8/6/2018
---

# How to choose a development environment for Azure Machine Learning 

Learn about the development environments that you can use with the Azure Machine Learning service. While this document talks specifically about several popular development environments, all environments fall into two categories:

* __Jupyter Notebooks__ are great for interactive experimentation and data visualization. They are also a great way to share your findings, as the output of your experiment is stored in the notebook. You can share the notebook with someone and when they open it they see the output of your last run.

    The downside of notebooks is that they don't provide tools for code improvement or integrating with things like version control systems.

    Notebook environments discussed in this document are __Jupyter Notebooks__, and __Azure Notebooks__.

* __Integrated Development Environments (IDE)__ and __code editors__ are more suited for creating production code. They provide tools that help make your code better or make the process of coding easier. For example, syntax highlighting, linting, debugging, and profiling. They may also provide integration with version control systems and build systems.

You can extract the code from a notebook and use it with your IDE or code editor, so you can combine both as part of your development process.

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

