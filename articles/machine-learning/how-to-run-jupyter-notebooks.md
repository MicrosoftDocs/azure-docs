---
title: How to run Jupyter Notebooks in your workspace
titleSuffix: Azure Machine Learning
description: Learn how run a Jupyter Notebook without leaving your workspace in Azure Machine Learning studio.
services: machine-learning
author: abeomor
ms.author: osomorog
ms.reviewer: sgilley
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.date: 03/19/2020
# As a data scientist, I want to run Jupyter notebooks in my workspace in Azure Machine Learning studio
---

# How to run Jupyter Notebooks in your workspace
[!INCLUDE [applies-to-skus](../../includes/aml-applies-to-basic-enterprise-sku.md)]

Learn how to run your Jupyter Notebooks directly in your workspace in Azure Machine Learning studio. You could also launch [Jupyter](https://jupyter.org/) or [JupyterLab](https://jupyterlab.readthedocs.io) to run your notebooks.  But now you can create, edit, and run notebooks in the workspace without leaving studio.

See how you can:

* Create Jupyter Notebooks in your workspace
* Run an experiment from a notebook
* Change the notebook environment
* Find details of the compute instances used to run your notebooks
* Use files and File Explorer

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, create a [free account](https://aka.ms/AMLFree) before you begin.
* A Machine Learning workspace. See [Create an Azure Machine Learning workspace](how-to-manage-workspace.md).

## Create notebooks

In your Azure Machine Learning workspace, you can easily create a new Jupyter notebook and start working. The newly created notebook is stored in the default workspace storage and can be easily shared with anyone who has access to the workspace.

To create a new notebook: 
1. Open your workspace in [Azure Machine Learning studio](https://ml.azure.com).
1. On the left side, select **Notebooks**. 
2. Select the  **Create new file** icon on the top of the File Explorer Pane. 
3. Name the file. 
4. For Jupyter Notebook Files, select "Python Notebook" as the file type.
5. Select a file directory.
6. Select Create.

You can also create notebooks by cloning from a sample or from a Git repository.

### Clone samples

Your workspace contains a **Samples** folder with notebooks designed to help you explore the SDK and serve as models for your own machine learning projects.  You can clone these notebooks into your own folder on your workspace's storage container.  

For an example, see [Tutorial: Create your first ML experiment](tutorial-1st-experiment-sdk-setup.md#azure).

### Use files from Git and version my files

You can access all Git operations via  the **Terminal** icon in the Notebook toolbar. All Git files and folders will be stored in your workspace file system.

Learn more about [cloneing Git repositories into your workspace file system](concept-train-model-git-integration.md#clone-git-repositories-into-your-workspace-file-system).

### Save notebooks and checkpoint

Azure Machine Learning creates a checkpoint file when you create an *.ipynb* file.  

Manually save a file by selecting **...>File>Save** in the notebook toolbar.  Each manual save updates the checkpoint file associated with the notebook.

Every notebook is autosaved every 30 seconds. Auto-saving updates only the initial .ipynb file, not the checkpoint file.

Use the **Terminal** to access the checkpoint file.  This file is located within a hidden folder named *.ipynb_checkpoints*, located within the same folder as the initial *.ipynb* file.

### Share notebooks and other files

To share a notebook or file from the Azure Machine Learning workspace, copy and paste the URL and send it to any user in your workspace.  Learn more about [granting access to your workspace](how-to-assign-roles.md).

## Edit a notebook

To edit a notebook, open any notebook located in the **User files** section of your workspace. Click on the cell you wish to edit. 

When a compute instance running is running, you can also use code completion is powered by [Intellisense](https://code.visualstudio.com/docs/editor/intellisense)

Note: Intellisense is only supported in Python Notebooks.

### Useful keyboard shortcuts

|Keyboard  |Action  |
|---------|---------|
|Shift+Enter     |  Run a cell       |
|Ctrl+M(Windows)     |  Enable/disable tab trapping in notebook.       |
|Ctrl+Shift+M(Mac & Linux)     |    Enable/disable tab trapping in notebook.     |
|Tab (when tab trap enabled) | Add a '\t' character (indent)
|Tab (when tab trap disabled) | Navigate focus to next focusable item (delete cell button, run button, etc.)

## Run an experiment

### Create compute

### View logs and output

## Change the notebook environment

### Stop and start a kernel

### Switch compute

### Switch to Jupyter/JupyterLab

### Switch pages in the notebook

## Find compute details 

## Next steps

