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

Learn how to run your Jupyter Notebooks directly in your workspace in Azure Machine Learning studio. While you can launch [Jupyter](https://jupyter.org/) or [JupyterLab](https://jupyterlab.readthedocs.io), you can also edit and run your notebooks without leaving the workspace.

See how you can:

* Create Jupyter Notebooks in your workspace
* Run an experiment from a notebook
* Change the notebook environment
* Find details of the compute instances used to run your notebooks

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, create a [free account](https://aka.ms/AMLFree) before you begin.
* A Machine Learning workspace. See [Create an Azure Machine Learning workspace](how-to-manage-workspace.md).

## <a name="create"></a> Create notebooks

In your Azure Machine Learning workspace, create a new Jupyter notebook and start working. The newly created notebook is stored in the default workspace storage. This notebook can be shared with anyone with access to the workspace. 

To create a new notebook: 

1. Open your workspace in [Azure Machine Learning studio](https://ml.azure.com).
1. On the left side, select **Notebooks**. 
2. Select the  **Create new file** icon on the top of the File Explorer Pane. 
3. Name the file. 
4. For Jupyter Notebook Files, select **Python Notebook** as the file type.
5. Select a file directory.
6. Select **Create**.

> [!TIP]
> You can create text files as well.  Select **Text** as the file type and add the extension to the name (for example, myfile.py or myfile.txt)  

You can also upload folders and files, including notebooks, with the tools at the top of the Notebooks page.  Notebooks and most text file types display in the preview section.  No preview is available for most other file types.

### Clone samples

Your workspace contains a **Samples** folder with notebooks designed to help you explore the SDK and serve as examples for your own machine learning projects.  You can clone these notebooks into your own folder on your workspace storage container.  

For an example, see [Tutorial: Create your first ML experiment](tutorial-1st-experiment-sdk-setup.md#azure).

### Use files from Git and version my files

You can access all Git operations by using a terminal window. All Git files and folders will be stored in your workspace file system.

To access the terminal:

1. Open your workspace in [Azure Machine Learning studio](https://ml.azure.com).
1. On the left side, select **Notebooks**.
1. Select any notebook located in the **User files** section on the left-hand side.  If you don't have any notebooks there, first [create a notebook](#create)
1. Select **Terminal** in the Notebook toolbar.


Learn more about [cloning Git repositories into your workspace file system](concept-train-model-git-integration.md#clone-git-repositories-into-your-workspace-file-system).

### Save notebooks and checkpoint

Azure Machine Learning creates a checkpoint file when you create an *ipynb* file.  

Select **...>File>Save** in the notebook toolbar to manually save the notebook. The save also updates the checkpoint file associated with the notebook. 

Every notebook is autosaved every 30 seconds. Autosaves update only the initial *ipynb* file, not the checkpoint file.

Use the **Terminal** to access the checkpoint file.  This file is located within a hidden folder named *.ipynb_checkpoints*, located within the same folder as the initial *ipynb* file.

### Share notebooks and other files

Copy and paste the URL to share a notebook or file.  Only other users of the workspace will be able to access this URL.  Learn more about [granting access to your workspace](how-to-assign-roles.md).

## Edit a notebook

To edit a notebook, open any notebook located in the **User files** section of your workspace. Click on the cell you wish to edit. 

When a compute instance running is running, you can also use code completion, powered by [Intellisense](https://code.visualstudio.com/docs/editor/intellisense), in any Python Notebook.

You can also launch Jupyter or JupyterLab from the Notebook toolbar.  Azure Machine Learning does not provide updates and fix bugs from Jupyter or JupyterLab as they are Open Source products outside of the boundary of Microsoft Support.

### Useful keyboard shortcuts

|Keyboard  |Action  |
|---------|---------|
|Shift+Enter     |  Run a cell       |
|Ctrl+M(Windows)     |  Enable/disable tab trapping in notebook.       |
|Ctrl+Shift+M(Mac & Linux)     |    Enable/disable tab trapping in notebook.     |
|Tab (when tab trap enabled) | Add a '\t' character (indent)
|Tab (when tab trap disabled) | Change focus to next focusable item (delete cell button, run button, etc.)

## Run an experiment

To run an experiment from a Notebook, you first connect to a running [compute instance](concept-compute-instance.md). If you don't have a compute instance, use these steps to create one: 

1. Select **+** in the Notebook toolbar. 
2. Name the Compute and choose a **Virtual Machine Size**. 
3. Select **Create**.
4. The compute instance is connected to the Notebook automatically and you can now run your cells.

Only you can see and use the compute instances you create.  

### View logs and output

Use [Notebook widgets](https://docs.microsoft.com/python/api/azureml-widgets/azureml.widgets?view=azure-ml-py) to view the progress of the run and logs. A widget is asynchronous and provides updates until training finishes. Azure Machine Learning widgets are also supported in Jupyter and JupterLab.

## Change the notebook environment

The Notebook toolbar allows you to change the environment on which your Notebook runs.  

These actions will not change the notebook state or the values of any variables in the notebook:

|Action  |Result  |
|---------|---------| --------|
|Stop the kernel     |  Stops any running cell. Running a cell will automatically restart the kernel. |
|Navigate to another workspace section     |     Running cells are stopped. |

These actions will reset the notebook state as well as all variables in the notebook.

|Action  |Result  |
|---------|---------| --------|
| Change the kernel | Notebook uses new kernel |
| Switch compute    |     Notebook automatically uses the new compute. |
| Reset compute | Starts again when you try to run a cell |
| Stop compute     |    No cells will run  |
| Open notebook in Jupyter or JupyterLab     |    Notebook opened in a new tab.  |

### Add new kernels

The Notebook will automatically find all Jupyter kernels installed on the connected compute instance.  To add a kernel to the compute instance:

1. Select **Terminal** in the Notebook toolbar.
1. Use the terminal window to create a new environment.
1. Activate the environment.  For example, after creating `newenv`:

    ```shell
    source activate newenv
    python -m ipykernel install --user --name newenv --display-name "Python (newenv)"
    ```

Any of the [available Jupyter Kernels](https://github.com/jupyter/jupyter/wiki/Jupyter-kernels) can be installed.

### Status indicators

A dot next to the **Compute** dropdown shows its status.  The status is also shown in the dropdown itself.  

|Color |Compute status |
|---------|---------| 
| Green | Compute running |
| Red |Compute failed | 
| Black | Compute stopped |
|  Light Blue |Compute creating, starting, restarting, setting Up |
|  Gray |Compute deleting, stopping |

A dot next to the **Kernel** dropdown shows its status.

|Color |Kernel status |
|---------|---------|
|  Green |Kernel connected, idle, busy|
|  Gray |Kernel not connected |



## Find compute details 

Find details about your compute instances on the **Compute** page in [studio](https://ml.azure.com).

## Next steps

* [Run your first experiment](tutorial-1st-experiment-sdk-train.md)
* [Backup your file storage with snapshots](../storage/files/storage-snapshots-files.md)
