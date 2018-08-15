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

In this document, you'll learn about different choices for development environment when building and deploying models with the Azure Machine Learning service. When choosing your environment, consider these factors:

* Do you need interactive experimentation and data exploration? 
* Is your goal to integrate your machine learning code with larger solution?
* Do you need to publish and share results with others?
* Do you need high degree of control over your local environment?

__Local__ environments - a computer or virtual machine that you have full access to - provides the highest level of control. You can load any libraries or make any changes you need.

__Managed__ environments are services hosted in the cloud. These environments are easy to get started with, as they require little setup or configuration. However, your ability to modify the environment or load new libraries is limited.

__Notebook__ environments allow you to interactively experiment by modifying and running code sections. Notebooks also allow you to visualize the data you're working with. Azure Notebooks provides a managed cloud-based solution, while Jupyter Notebooks can be installed locally or on virtual machines, such as the Data Science Virtual Machine available in Azure.

Operationalizing a notebook, or integrating with source control and build automation tools, may require extracting the code from the notebook.

__Integrated Development Environments (IDE) and code editors__ such Visual Studio Code, Atom, and PyCharm, are more suited to creating production-ready solutions. IDEs provide development-oriented tools like debuggers, and have better integration with source control and build automation systems. Most IDEs are installed locally or in a VM.

In this document, you'll learn about the following development environments:
| &nbsp; | [Azure Notebooks](#azure-notebooks) | [Jupyter Notebooks](#jupyter-notebook-on-your-own-computer) | [IDEs and code editors](#ides-and-code-editors) |
| --- |:---:|:---:|:---:|
| __Interactive__ | ✓ | ✓ | &nbsp; |
| __Visualization__ | ✓ | ✓ | &nbsp; |
| __Sharing__ | ✓ | &nbsp; | &nbsp; |
| __Pre-configured__ | ✓ | &nbsp; | &nbsp; |
| __Customization__ | Low | High | High |
| __Development tools__ | &nbsp; | &nbsp; | ✓ |

> [!TIP]
> If you're new to Azure Machine Learning, or want to get started quickly, we recommend Azure Notebooks. It's a free, cloud hosted notebook service with the Azure Machine Learning SDK already installed.

## Azure Notebooks

Azure Notebooks (preview) are a managed service in the Azure cloud. It is powered by Jupyter, and is compatible with Jupyter Notebooks.

Use Azure Notebooks when you need the following features:

* __No setup or configuration__: The Azure Machine Learning SDK, along with other popular Python libraries, are already installed.
* __Interactive experimentation__: Since Azure Notebooks are powered by Jupyter, you get the same interactive programming experience as Jupyter Notebooks.
* __Data visualization__: Popular plotting libraries such as ggplot, matplotlib, bokeh, and seaborn are included with Azure Notebooks
* __Share your notebooks__: Azure Notebooks allows to you share a link to your notebook library, or mark a library as public. Visitors can then download your notebooks for use on Jupyter Notebooks, or clone your library into their own Azure Notebooks account.

> [!TIP]
> Azure Notebooks includes a library of examples to help you get started with Azure Machine Learning.

> [!NOTE]
> Azure Notebooks provides a set of pre-configured set of Jupyter kernels. You cannot add a custom kernel. Also, your code executes in a containerized environment that shares compute resources with other users, so it may not be as fast as using a local Jupyter Notebook. 

## Jupyter Notebook on your own computer

The Azure Machine Learning SDK can be installed and used with Jupyter Notebooks on your computer or virtual machine. The SDK is a pip installable Python package that allows you to work with the Azure Machine Learning service.

This environment is recommended when you need the following features:

* __Interactive experimentation__: Jupter Notebooks allow you to interactively modify and rerun code sections.
* __Data visualization__: There are many data visualization packages available for use with Jupyter Notebooks.
* __A high degree of control over local compute resources__: You can install any library, kernel, or make any configuration changes you want to the local environment.

## IDEs and code editors

Since the Azure Machine Learning SDK is a pip installable Python package, you can use it from the code editor of your choice. Just install the package and continue using the editor and tools that work best for you.

IDEs and code editors are recommended when you need the following features:

* __Source control__: Source control/version control systems allow you to keep track of changes to your code over time. They also make it easier to coordinate code contributions from multiple people.
* __Integration with production systems__: IDEs and code editors can often be integrated with automated build and deployment systems.
* __Development tools__: Many IDEs and code editors provide language or framework specific tools. For example, syntax highlighting, linting, and debugging.

### Visual Studio Code

Visual Studio Code is source code editor, which makes it easier to work on machine learning applications intended for production use. It is recommended when you need the following features:
 
* __Source control__: Source control/Version control systems allow you to keep track of changes to your code over time. They also make it easier to coordinate code contributions from multiple people. Visual Studio Code integrates with popular source control systems such as Git and Team Foundation Version Control.
* __Integration with production systems__: Visual Studio Code provides integration with automated build and deployment systems that help speed up the process of deploying your model into production.
* __Development tools__: Visual Studio Code provides support for an ecosystem of extensions. Some of these extensions provide tools for working with Python. The [Visual Studio Tools for AI](https://visualstudio.microsoft.com/downloads/ai-tools-vs/) is an extension that makes it easier to work with Azure Machine Learning from within Visual Studio Code.

## Data Science Virtual Machine

The Data Science Virtual Machine (DSVM) is a VM image on Azure. It comes with the Azure Machine Learning SDK, Jupyter Notebooks, PyCharm, and a variety of other components used for machine learning. When creating DSVM, you can choose the size of virtual machine, allowing you to choose the number of CPU cores, GPU, and amount of memory. 

This environment is recommended when you need the following features:

* __Little setup or configuration__: DSVM is pre-installed with Jupyter Notebooks and other popular software. Configuring the VM can be as simple as selecting the CPU cores, memory, and other basic characteristics of the VM.
* __Interactive experimentation__: Jupter Notebooks allow you to interactively modify and rerun code sections.
* __Data visualization__: DSVM provides pre-installed versions of popular data visualization libraries, and you can install others as needed.
* __IDEs and code editors__: DSVM provides Visual Studio Code, PyCharm Community Edition, Atom, Vim, Emacs, and other code editors.
* __Machine Learning tools and frameworks__: Xgboost, TensorFlow, Keras, PyTorch, and others are pre-installed.
* __A high degree of control over local compute resources__: You can install any library, kernel, or make other configuration changes you want to the DSVM environment.

For more information, see the [What is the Data Science Virtual Machine](../data-science-virtual-machine/overview.md) document.
