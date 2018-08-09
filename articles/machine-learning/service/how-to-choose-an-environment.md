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

In this document, you'll learn about different choices for development environment when building and deploying models with Azure Machine Learning. When choosing your environment, consider these factors:

* Do you need interactive experimentation and data exploration? 
* Is your goal to integrate your machine learning code with larger solution?
* Do you need to publish and share results with others?
* Do you need high degree of control over your local environment?

__Notebook__ environments allow you to interactively experiment by modifying and running code sections. Notebooks also allow you to visualize the data you're working with. Operationalizing a notebook, or integrating with source control and build automation tools, may require extracting the code from the notebook.

__Integrated Development Environments (IDE)__ such Visual Studio Code, are more suited to creating production-ready solutions. IDEs provide development-oriented tools like debuggers, and have better integration with source control and build automation systems.

__Local__ environments - a computer or virtual machine that you have full access to - provides the highest level of control. You can load any libraries or make any changes you need.

__Managed__ environments are services hosted in the cloud. These environments are easy to get started with, as they require little setup or configuration. However, your ability to modify the environment or load new libraries is limited.

In this document, you'll learn about the following development environments:

| Environment | Interactive<br/>experimentation | Data<br/>visualization | Collaboration<br/>(sharing) | Pre-configured | Control over<br/>environment | Development tools |
| ----- |:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|
| Azure Notebooks | ✓ | ✓ | ✓ | ✓ | Low | 
| Jupyter Notebooks<br/>(local or on a virtual machine) | ✓ | ✓ | &nbsp; | &nbsp; | High |
| Data Science Virtual Machine<br/>(includes Jupyter Notebooks) | ✓ | ✓ | &nbsp; | ✓ | High |
| Visual Studio Code</br>& other IDEs | &nbsp; | &nbsp; | &nbsp; | &nbsp; | High | ✓ |

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
> Azure Notebooks includes a library of examples to help you get started with Azure Machine Learning. For more information, see [TBD].

> [!NOTE]
> Azure Notebooks provides a set of pre-configured set of Jupyter kernels. You cannot add a custom kernel. Also, your code executes in a containerized environment that shares compute resources with other users, so it may not be as fast as using a local Jupyter Notebook. 

## Jupyter Notebook on your own computer

The Azure Machine Learning SDK can be installed and used with Jupyter Notebooks on your computer or virtual machine. The SDK is a pip installable Python package that allows you to work with the Azure Machine Learning service.

This environment is recommended when you need the following features:

* __Interactive experimentation__: Jupter Notebooks allow you to interactively modify and rerun code sections.
* __Data visualization__: There are many data visualization packages available for use with Jupyter Notebooks.
* __A high degree of control over local compute resources__: You can install any library, kernel, or make any configuration changes you want to the local environment.

## Jupyter Notebooks on Data Science Virtual Machine or Deep Learning Virtual Machine on Azure

The Data Science Virtual Machine (DSVM) is a VM image on Azure. It comes with many common data science and machine learning libraries pre-installed. When creating DSVM, you can choose the size of virtual machine, allowing you to choose the number of CPU cores and amount of memory. 

The Deep Learning Virtual Machine (DLVM) is a GPU-enabled variant of DSVM, aimed at training deep neural network models.

Both DSVM and DLVM comes with the Azure Machine Learning SDK and Jupyter Notebooks. This environment is recommended when you need the following features:

* __Little setup or configuration__: DSVM is pre-installed with Jupyter Notebooks and other popular libraries. Configuring the VM can be as simple as selecting the CPU cores, memory, and other basic characteristics of the VM.
* __Interactive experimentation__: Jupter Notebooks allow you to interactively modify and rerun code sections.
* __Data visualization__: DSVM provides pre-installed versions of popular data visualization libraries, and you can install others as needed.
* __A high degree of control over local compute resources__: You can install any library, kernel, or make other configuration changes you want to the DSVM environment.

## Visual Studio Code

The disadvantage of notebook-based environments is that extra steps are required to extract production code and bring it into source control. 

Visual Studio Code is source code editor, which makes it easier to work on machine learning applications intended for production use. It is recommended when you are:
 
* Using source control for your machine learning code. 
* Integrating your machine learning application with production systems

Furthermore, you can use VS Code Tools for AI, which makes it easier to interact with Azure Machine Learning capabilities.

## Code editor of your choice

The Azure Machine Learning SDK is pip installable Python package that you can use from a Python code editor of your choice, such as Spyder or PyCharm. 

