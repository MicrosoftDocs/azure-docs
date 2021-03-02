---
title: Run Jupyter notebooks in your workspace
titleSuffix: Azure Machine Learning
description: Learn how run a Jupyter notebook without leaving your workspace in Azure Machine Learning studio.
services: machine-learning
author: abeomor
ms.author: osomorog
ms.reviewer: sgilley
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.custom: how-to
ms.date: 01/19/2021
# As a data scientist, I want to run Jupyter notebooks in my workspace in Azure Machine Learning studio
---

# Run Jupyter Notebooks in your workspace

Learn how to run your Jupyter notebooks directly in your workspace in Azure Machine Learning studio. While you can launch [Jupyter](https://jupyter.org/) or [JupyterLab](https://jupyterlab.readthedocs.io), you can also edit and run your notebooks without leaving the workspace.

For information on how to create and manage files, including notebooks, see [Create and manage files in your workspace](how-to-manage-files.md).

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, create a [free account](https://aka.ms/AMLFree) before you begin.
* A Machine Learning workspace. See [Create an Azure Machine Learning workspace](how-to-manage-workspace.md).

## Edit a notebook

To edit a notebook, open any notebook located in the **User files** section of your workspace. Click on the cell you wish to edit.  If you don't have any notebooks in this section, see [Create and manage files in your workspace](how-to-manage-files.md).

You can edit the notebook without connecting to a compute instance.  When you want to run the cells in the notebook, select or create a compute instance.  If you select a stopped compute instance, it will automatically start when you run the first cell.

When a compute instance is running, you can also use code completion, powered by [Intellisense](https://code.visualstudio.com/docs/editor/intellisense), in any Python notebook.

You can also launch Jupyter or JupyterLab from the notebook toolbar.  Azure Machine Learning does not provide updates and fix bugs from Jupyter or JupyterLab as they are Open Source products outside of the boundary of Microsoft Support.

## Focus mode

Use focus mode to expand your current view so you can focus on your active tabs. Focus mode hides the Notebooks file explorer.

1. In the terminal window toolbar, select **Focus mode** to turn on focus mode. Depending on your window width, this may be located under the **...** menu item in your toolbar.
1. While in focus mode, return to the standard view by selecting **Standard view**.

    :::image type="content" source="media/how-to-run-jupyter-notebooks/focusmode.gif" alt-text="Toggle focus mode / standard view":::

## Use IntelliSense

[IntelliSense](https://code.visualstudio.com/docs/editor/intellisense) is a code-completion aid that includes a number of features: List Members, Parameter Info, Quick Info, and Complete Word. These features help you to learn more about the code you're using, keep track of the parameters you're typing, and add calls to properties and methods with only a few keystrokes.  

When typing code, use Ctrl+Space to trigger IntelliSense.

## Clean your notebook (preview)

> [!IMPORTANT]
> The gather feature is currently in public preview.
> The preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Over the course of creating a notebook, you typically end up with cells you used for data exploration or debugging. The *gather* feature will help you produce a clean notebook without these extraneous cells.

1. Run all of your notebook cells.
1. Select the cell containing the code you wish the new notebook to run. For example, the code that submits an experiment, or perhaps the code that registers a model.
1. Select the **Gather** icon that appears on the cell toolbar.
    :::image type="content" source="media/how-to-run-jupyter-notebooks/gather.png" alt-text="Screenshot: select the Gather icon":::
1. Enter the name for your new "gathered" notebook.  

The new notebook contains only code cells, with all cells required to produce the same results as the cell you selected for gathering.

## Save and checkpoint a notebook

Azure Machine Learning creates a checkpoint file when you create an *ipynb* file.

In the notebook toolbar, select the menu and then **File&gt;Save and checkpoint** to manually save the notebook and it will add a checkpoint file associated with the notebook.

:::image type="content" source="media/how-to-run-jupyter-notebooks/file-save.png" alt-text="Screenshot of save tool in notebook toolbar":::

Every notebook is autosaved every 30 seconds. Autosave updates only the initial *ipynb* file, not the checkpoint file.
 
Select **Checkpoints** in the notebook menu to create a named checkpoint and to revert the notebook to a saved checkpoint.

## Export a notebook

In the notebook toolbar, select the menu and then **Export As** to export the notebook as any of the supported types:

* Notebook
* Python
* HTML
* LaTeX

:::image type="content" source="media/how-to-run-jupyter-notebooks/export-notebook.png" alt-text="Export a notebook to your computer":::

The exported file is saved on your computer.

## Run a notebook or Python script

To run a notebook or a Python script, you first connect to a running [compute instance](concept-compute-instance.md).

* If you don't have a compute instance, use these steps to create one:

    1. In the notebook or script toolbar, to the right of the Compute dropdown, select **+ New Compute**. Depending on your screen size, this may be located under a **...** menu.
        :::image type="content" source="media/how-to-run-jupyter-notebooks/new-compute.png" alt-text="Create a new compute":::
    1. Name the Compute and choose a **Virtual Machine Size**. 
    1. Select **Create**.
    1. The compute instance is connected to the file automatically.  You can now run the notebook cells or the Python script using the tool to the left of the compute instance.

* If you have a stopped compute instance, select  **Start compute** to the right of the Compute dropdown. Depending on your screen size, this may be located under a **...** menu.

    :::image type="content" source="media/how-to-run-jupyter-notebooks/start-compute.png" alt-text="Start compute instance":::

Only you can see and use the compute instances you create.  Your **User files** are stored separately from the VM and are shared among all compute instances in the workspace.

### View logs and output

Use [notebook widgets](/python/api/azureml-widgets/azureml.widgets?preserve-view=true&view=azure-ml-py) to view the progress of the run and logs. A widget is asynchronous and provides updates until training finishes. Azure Machine Learning widgets are also supported in Jupyter and JupterLab.

:::image type="content" source="media/how-to-run-jupyter-notebooks/jupyter-widget.png" alt-text="Screenshot: Jupyter notebook widget ":::

## Explore variables in the notebook

On the notebook toolbar, use the **Variable explorer** tool to show the name, type, length, and sample values for all variables that have been created in your notebook.

:::image type="content" source="media/how-to-run-jupyter-notebooks/variable-explorer.png" alt-text="Screenshot: Variable explorer tool":::

Select the tool to show the variable explorer window.

:::image type="content" source="media/how-to-run-jupyter-notebooks/variable-explorer-window.png" alt-text="Screenshot: Variable explorer window":::

## Navigate with a TOC

On the notebook toolbar, use the  **Table of contents** tool to display or hide the table of contents.  Start a markdown cell with a heading to add it to the table of contents. Click on an entry in the table to scroll to that cell in the notebook.  

:::image type="content" source="media/how-to-run-jupyter-notebooks/table-of-contents.png" alt-text="Screenshot: Table of contents in the notebook":::

## Change the notebook environment

The notebook toolbar allows you to change the environment on which your notebook runs.  

These actions will not change the notebook state or the values of any variables in the notebook:

|Action  |Result  |
|---------|---------| --------|
|Stop the kernel     |  Stops any running cell. Running a cell will automatically restart the kernel. |
|Navigate to another workspace section     |     Running cells are stopped. |

These actions will reset the notebook state and will reset all variables in the notebook.

|Action  |Result  |
|---------|---------| --------|
| Change the kernel | Notebook uses new kernel |
| Switch compute    |     Notebook automatically uses the new compute. |
| Reset compute | Starts again when you try to run a cell |
| Stop compute     |    No cells will run  |
| Open notebook in Jupyter or JupyterLab     |    Notebook opened in a new tab.  |

## Add new kernels

[Use the terminal ](how-to-access-terminal.md#add-new-kernels) to create and add new kernels to your compute instance. The notebook will automatically find all Jupyter kernels installed on the connected compute instance.

Use the kernel dropdown on the right to change to any of the installed kernels.  


### Status indicators

An indicator next to the **Compute** dropdown shows its status.  The status is also shown in the dropdown itself.  

|Color |Compute status |
|---------|---------| 
| Green | Compute running |
| Red |Compute failed | 
| Black | Compute stopped |
|  Light Blue |Compute creating, starting, restarting, setting Up |
|  Gray |Compute deleting, stopping |

An indicator next to the **Kernel** dropdown shows its status.

|Color |Kernel status |
|---------|---------|
|  Green |Kernel connected, idle, busy|
|  Gray |Kernel not connected |

## Find compute details

Find details about your compute instances on the **Compute** page in [studio](https://ml.azure.com).

## Troubleshooting

* If you can't connect to a notebook, ensure that web socket communication is **not** disabled. For compute instance Jupyter functionality to work, web socket communication must be enabled. Please ensure your network allows websocket connections to *.instances.azureml.net and *.instances.azureml.ms. 

* When compute instance is deployed in a private link workspace it can be only be [accessed from within virtual network](https://docs.microsoft.com/azure/machine-learning/how-to-secure-training-vnet#compute-instance). If you are using custom DNS or hosts file please add an entry for <instance-name>.<region>.instances.azureml.ms with private IP address of workspace private endpoint. For more information see the [custom DNS](./how-to-custom-dns.md?tabs=azure-cli) article.
    
## Next steps

* [Run your first experiment](tutorial-1st-experiment-sdk-train.md)
* [Backup your file storage with snapshots](../storage/files/storage-snapshots-files.md)
* [Working in secure environments](./how-to-secure-training-vnet.md#compute-instance)
