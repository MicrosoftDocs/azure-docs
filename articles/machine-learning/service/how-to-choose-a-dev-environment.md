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

In this article, you'll learn about different choices for development environment when building and deploying models with Azure Machine Learning. When choosing your environment, consider these factors:

* Do you frequently perform interactive experimentation and data exploration? 
* Is your goal to integrate your machine learning code with larger solution?
* Do you need to publish and share results with others?
* Do you need high degree of control over you local environment?

For example, Jupyter Notebooks can be very effective for presenting results of your experimentation with visuals and explanatory content. On the other hand, integrated development environments such as Visual Studio Code are well suited to productionalize your machine learning code, when used together with source control and build automation tools.

You'll learn about following develop environments:

* Azure Notebooks
* Jupyter Notebooks on your own computer
* Jupyter Notebooks on Data Science Virtual Machine
* Visual Studio Code
* Code editor of your choice

## Azure Notebooks

Azure Notebooks are recommended for:

 * Getting started with Azure Machine Learning
 * Performing interactive experimentation and visualization in turn-key environment.
 * Publishing your experiments. 

The notebook environment is a managed and hosted, and has Azure Machine Learning SDK pre-installed. In this environment, you can:

 * Perform local experimentation and data visualization
 * Create remote compute targets and launch remote experiment runs
 * View the history and results of your experiment runs.
 * Deploy and manage web services.

Also, Azure Notebooks includes a library of examples to help you get started with Azure Machine Learning.

With Azure Notebooks, you are restricted to the pre-configured set of Jupyter kernels. Also, your local code executes in a containerized environment that shares compute resources with other users. 

## Jupyter Notebooks on your own computer

You can install Azure Machine Learning SDK as a pip installable Python package to your own computer or virtual machine. Then, you can Azure Machine Learning from Jupyter Notebook running on your own computer. This environment is recommended for:

 * Performing interactive experimentation and visualization  with high degree of control over your environment
 * Using Azure Machine Learning with high degree of control over local compute resources.

## Jupyter Notebooks on Data Science Virtual Machine or Deep Learning Virtual Machine on Azure

The Data Science Virtual Machine (DSVM) is a VM image on Azure with many common data science and machine learning libraries pre-installed. When creating DSVM, you can choose your the size of virtual machine, allowing you to choose the local compute resources: number of CPU cores, and amount of memory. The Deep Learning Virtual Machine (DLVM) is a GPU-enabled variant of DSVM, aimed at training deep neural network models.

Both DSVM and DLVM comes with Azure Machine Learning SDK that you can access through remote Jupyter Notebook server. This environment is recommended for:

 * Performing interactive experimentation and visualization in turn-key environment
 * Having a common set of machine learning libraries for team projects
 * Using Azure Machine Learning with high degree of control over local compute resources.


## Visual Studio Code

The disadvantage of notebook-based environments is that extra steps are required to extract production code and bring it into source control. 

Visual Studio Code is source code editor, which makes it easier to work on machine learning applications intended for production use. It is recommended when you are:
 
* Using source control for your machine learning code. 
* Integrating your machine learning application with production systems

Furthermore, you can use VS Code Tools for AI, which makes it easier to interact with Azure Machine Learning capabilities.

## Code editor of your choice

The Azure Machine Learning SDK is pip installable Python package that you can use from a Python code editor of your choice, such as Spyder or PyCharm. 

