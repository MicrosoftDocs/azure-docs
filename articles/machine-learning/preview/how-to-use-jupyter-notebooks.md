---
title: How to Use Jupyter Notebooks in Azure Machine Learning Workbench | Microsoft Docs
description: Guide for the using the Jupyter Notebooks feature of Azure Machine Learning Workbench
services: machine-learning
author: jopela
ms.author: jopela
manager: haining
ms.reviewer: garyericson, jasonwhowell, mldocs
ms.service: machine-learning
ms.workload: data-services
ms.topic: article
ms.date: 09/11/2017
---
# How to Use Jupyter Notebooks in Azure Machine Learning Workbench

## Introduction
Azure Machine Learning Workbench supports interactive data science experimentation via its integration of **Jupyter Notebooks**.
This article describes how to make effective use of this feature to increase the rate and the quality of your interactive data science experimentation.


## Prerequisites
To step through this how-to guide, you need to:
- [Install AML Workbench](doc-template-how-to.md)
- Familiarity with [Jupyter Notebooks](http://jupyter.org/)


## Notebook Basics
For many data scientists, **Jupyter Notebooks** provide an indispensable medium for interactive experimentation, collaboration, and publication of results.
Azure Machine Learning Workbench integrates **Jupyter Notebooks**, which can be accessed via the Workbench's  **Notebooks** tab.
The **Classifying Iris** template generates a project with a Notebook that serves a great foundation for exploring this feature.

![notebooks tab](media/how-to-use-jupyter-notebooks/how-to-use-jupyter-notebooks-01.png)

When a **Notebook** is opened in Azure Machine Learning Workbench, it is displayed in its own document tab in **Preview Mode**.
Notebooks are composed of cells, each of which can contain markdown, code, text output, rendered images, or even video.
All content is nicely contained in the notebook file, which is displayed as rendered (with rich formatting intact) here in the Workbench.

![notebook preview](media/how-to-use-jupyter-notebooks/how-to-use-jupyter-notebooks-02.png)

Clicking **Start Notebook Server** switches the notebook into **Edit Mode**.
The familiar **Jupyter Notebook UX** appears above the content and is ready to use with the notebook.

![edit mode](media/how-to-use-jupyter-notebooks/how-to-use-jupyter-notebooks-04.png)

This is a _fully-interactive_ _in-place_ Juptyer Notebook experience, complete with markdown and code cells as well as their rendered output.

![interactive notebook](media/how-to-use-jupyter-notebooks/how-to-use-jupyter-notebooks-05.png)

In addition to text output, rendered graphical output (such as plots) is also supported as shown.

![interactive plot](media/how-to-use-jupyter-notebooks/how-to-use-jupyter-notebooks-06.png)

Azure Machine Learning Workbench is configured to use a **Jupyter kernel** to execute code in the notebook.
By default, a **Python 3 kernel** is used with new notebooks, but additional kernels are planned for forthcoming releases.
These kernels are expected to extend the reach of notebooks beyond the local compute context.


## Command Line Interface
Azure Machine Learning Workbench provides a **Command Line Interface** for its **Jupyter Notebook** capability.
You can launch a notebook session by issuing an `az ml notebook start` from the command-line.
```
$ az ml notebook start
[I 10:14:25.455 NotebookApp] The port 8888 is already in use, trying another port.
[I 10:14:25.464 NotebookApp] Serving notebooks from local directory: /Users/johnpelak/Desktop/IrisDemo
[I 10:14:25.465 NotebookApp] 0 active kernels 
[I 10:14:25.465 NotebookApp] The Jupyter Notebook is running at: http://localhost:8889/?token=1f0161ab88b22fc83f2083a93879ec5e8d0ec18490f0b953
[I 10:14:25.465 NotebookApp] Use Control-C to stop this server and shut down all kernels (twice to skip confirmation).
[C 10:14:25.466 NotebookApp] 
    
    Copy/paste this URL into your browser when you connect for the first time,
    to login with a token:
        http://localhost:8889/?token=1f0161ab88b22fc83f2083a93879ec5e8d0ec18490f0b953
[I 10:14:25.759 NotebookApp] Accepting one-time-token-authenticated connection from ::1
[I 10:16:52.970 NotebookApp] Kernel started: 7f8932e0-89b9-48b4-b5d0-e8f48d1da159
[I 10:16:53.854 NotebookApp] Adapting to protocol v5.1 for kernel 7f8932e0-89b9-48b4-b5d0-e8f48d1da159
```
The `az ml notebook` process is ready to use from any web browser on your local machine (or any remote machine which can connect to the URL listed above.)

## Notebook User Experience via CLI Launch
When launched from the **CLI**, your default web browser is opened and navigated to the URL on which the `az ml notebook` server is listening.
By default, this page lists the files present in the project folder as shown.

![project dashboard](media/how-to-use-jupyter-notebooks/how-to-use-jupyter-notebooks-07.png)

Clicking on the **iris.ipynb** file (displayed beside the notebook icon) opens the notebook in a separate tab.

![project dashboard](media/how-to-use-jupyter-notebooks/how-to-use-jupyter-notebooks-08.png)

By design, the user experience the same as the one provided by Azure Machine Learning Workbench's **Notebook Edit Mode**.

## Next Steps
These features are available to assist with the process of interactive data science experimentation.
We hope that you find them to be useful, and would greatly appreciate your feedback.
This is just our initial implementation, and we have a great deal of enhancements planned.
We look forward to continuously delivering them to the Azure Machine Learning Workbench. 

