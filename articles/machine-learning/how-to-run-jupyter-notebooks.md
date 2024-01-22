---
title: Run Jupyter notebooks in your workspace
titleSuffix: Azure Machine Learning
description: Learn how run a Jupyter notebook without leaving your workspace in Azure Machine Learning studio.
services: machine-learning
author: sdgilley
ms.author: sgilley
ms.reviewer: sgilley
ms.service: machine-learning
ms.subservice: core
ms.custom: ignite-2022, devx-track-python
ms.topic: how-to
ms.date: 09/26/2023
#Customer intent: As a data scientist, I want to run Jupyter notebooks in my workspace in Azure Machine Learning studio.
---

# Run Jupyter notebooks in your workspace

This article shows how to run your Jupyter notebooks inside your workspace of Azure Machine Learning studio.  There are other ways to run the notebook as well: [Jupyter](https://jupyter.org/), [JupyterLab](https://jupyterlab.readthedocs.io), and [Visual Studio Code](./how-to-launch-vs-code-remote.md). VS Code Desktop can be configured to access your compute instance. Or use VS Code for the Web, directly from the browser, and without any required installations or dependencies.

We recommend you try VS Code for the Web to take advantage of the easy integration and rich development environment it provides.  VS Code for the Web gives you many of the features of VS Code Desktop that you love, including search and syntax highlighting while browsing and editing.  For more information about using VS Code Desktop and VS Code for the Web, see [Launch Visual Studio Code integrated with Azure Machine Learning (preview)](how-to-launch-vs-code-remote.md) and [Work in VS Code remotely connected to a compute instance (preview)](how-to-work-in-vs-code-remote.md).

No matter which solution you use to run the notebook, you'll have access to all the files from your workspace. For information on how to create and manage files, including notebooks, see [Create and manage files in your workspace](how-to-manage-files.md).

This rest of this article shows the experience for running the notebook directly in studio.

> [!IMPORTANT]
> Features marked as (preview) are provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
* A Machine Learning workspace. See [Create workspace resources](quickstart-create-resources.md).
* Your user identity must have access to your workspace's default storage account. Whether you can read, edit, or create notebooks depends on your [access level](how-to-assign-roles.md) to your workspace. For example, a Contributor can edit the notebook, while a Reader could only view it.

## Access notebooks from your workspace

Use the **Notebooks** section of your workspace to edit and run Jupyter notebooks.

1. Sign into [Azure Machine Learning studio](https://ml.azure.com)
1. Select your workspace, if it isn't already open
1. On the left, select **Notebooks**

## Edit a notebook

To edit a notebook, open any notebook located in the **User files** section of your workspace. Select the cell you wish to edit.  If you don't have any notebooks in this section, see [Create and manage files in your workspace](how-to-manage-files.md).

You can edit the notebook without connecting to a compute instance.  When you want to run the cells in the notebook, select or create a compute instance.  If you select a stopped compute instance, it will automatically start when you run the first cell.

When a compute instance is running, you can also use code completion, powered by [Intellisense](https://code.visualstudio.com/docs/editor/intellisense), in any Python notebook.

You can also launch Jupyter or JupyterLab from the notebook toolbar.  Azure Machine Learning doesn't provide updates and fix bugs from Jupyter or JupyterLab as they're Open Source products outside of the boundary of Microsoft Support.

## Focus mode

Use focus mode to expand your current view so you can focus on your active tabs. Focus mode hides the Notebooks file explorer.

1. In the terminal window toolbar, select **Focus mode** to turn on focus mode. Depending on your window width, the tool may be located under the **...** menu item in your toolbar.
1. While in focus mode, return to the standard view by selecting **Standard view**.

    :::image type="content" source="media/how-to-run-jupyter-notebooks/focusmode.gif" alt-text="Toggle focus mode / standard view":::

## Code completion (IntelliSense)

[IntelliSense](https://code.visualstudio.com/docs/editor/intellisense) is a code-completion aid that includes many features: List Members, Parameter Info, Quick Info, and Complete Word. With only a few keystrokes, you can:
* Learn more about the code you're using
* Keep track of the parameters you're typing
* Add calls to properties and methods 
<!--
### Insert code snippets (preview)

Use **Ctrl+Space** to trigger IntelliSense code snippets.  Scroll through the suggestions or start typing to find the code you want to insert.  Once you insert code, tab through the arguments to customize the code for your own use.

:::image type="content" source="media/how-to-run-jupyter-notebooks/insert-snippet.gif" alt-text="Insert a code snippet":::

These same snippets are available when you open your notebook in VS Code. For a complete list of available snippets, see [Azure Machine Learning VS Code Snippets](https://github.com/Azure/azureml-snippets/blob/main/snippets/snippets.md).

You can browse and search the list of snippets by using the notebook toolbar to open the snippet panel.

:::image type="content" source="media/how-to-run-jupyter-notebooks/open-snippet-panel.png" alt-text="Open snippet panel tool in the notebook toolbar":::

From the snippets panel, you can also submit a request to add new snippets.

:::image type="content" source="media/how-to-run-jupyter-notebooks/propose-new-snippet.png" alt-text="Snippet panel allows you to propose a new snippet":::
-->
## Share a notebook

Your notebooks are stored in your workspace's storage account, and can be shared with others, depending on their [access level](how-to-assign-roles.md) to your workspace.  They can open and edit the notebook as long as they have the appropriate access. For example, a Contributor can edit the notebook, while a Reader could only view it.

Other users of your workspace can find your notebook in the **Notebooks**, **User files** section of Azure Machine Learning studio. By default, your notebooks are in a folder with your username, and others can access them there.

You can also copy the URL from your browser when you open a notebook, then send to others.  As long as they have appropriate access to your workspace, they can open the notebook.

Since you don't share compute instances, other users who run your notebook will do so on their own compute instance.  

## Collaborate with notebook comments (preview)

Use a notebook comment to collaborate with others who have access to your notebook.

Toggle the comments pane on and off with the **Notebook comments** tool at the top of the notebook.  If your screen isn't wide enough, find this tool by first selecting the **...** at the end of the set of tools.

:::image type="content" source="media/how-to-run-jupyter-notebooks/notebook-comments-tool.png" alt-text="Screenshot of notebook comments tool in the top toolbar.":::  

Whether the comments pane is visible or not, you can add a comment into any code cell:

1. Select some text in the code cell.  You can only comment on text in a code cell.
1. Use the **New comment thread** tool to create your comment.
    :::image type="content" source="media/how-to-run-jupyter-notebooks/comment-from-code.png" alt-text="Screenshot of add a comment to a code cell tool.":::
1. If the comments pane was previously hidden, it will now open.  
1. Type your comment and post it with the tool or use **Ctrl+Enter**.
1. Once a comment is posted, select **...** in the top right to:
    * Edit the comment
    * Resolve the thread
    * Delete the thread

Text that has been commented will appear with a purple highlight in the code. When you select a comment in the comments pane, your notebook will scroll to the cell that contains the highlighted text.

> [!NOTE]
> Comments are saved into the code cell's metadata.

## Clean your notebook (preview)

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

Every notebook is autosaved every 30 seconds. AutoSave updates only the initial *ipynb* file, not the checkpoint file.
 
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
    
Once you're connected to a compute instance, use the toolbar to run all cells in the notebook, or Control + Enter to run a single selected cell. 

Only you can see and use the compute instances you create.  Your **User files** are stored separately from the VM and are shared among all compute instances in the workspace.

## Explore variables in the notebook

On the notebook toolbar, use the **Variable explorer** tool to show the name, type, length, and sample values for all variables that have been created in your notebook.

:::image type="content" source="media/how-to-run-jupyter-notebooks/variable-explorer.png" alt-text="Screenshot: Variable explorer tool":::

Select the tool to show the variable explorer window.

:::image type="content" source="media/how-to-run-jupyter-notebooks/variable-explorer-window.png" alt-text="Screenshot: Variable explorer window":::

## Navigate with a TOC

On the notebook toolbar, use the  **Table of contents** tool to display or hide the table of contents.  Start a markdown cell with a heading to add it to the table of contents. Select an entry in the table to scroll to that cell in the notebook.  

:::image type="content" source="media/how-to-run-jupyter-notebooks/table-of-contents.png" alt-text="Screenshot: Table of contents in the notebook":::

## Change the notebook environment

The notebook toolbar allows you to change the environment on which your notebook runs.  

These actions won't change the notebook state or the values of any variables in the notebook:

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

[Use the terminal](how-to-access-terminal.md#add-new-kernels) to create and add new kernels to your compute instance. The notebook will automatically find all Jupyter kernels installed on the connected compute instance.

Use the kernel dropdown on the right to change to any of the installed kernels.  

## Manage packages

Since your compute instance has multiple kernels, make sure use `%pip` or `%conda` [magic functions](https://ipython.readthedocs.io/en/stable/interactive/magics.html), which  install packages into the currently running kernel.  Don't use `!pip` or `!conda`, which refers to all packages (including packages outside the currently running kernel).

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

## Useful keyboard shortcuts
Similar to Jupyter Notebooks, Azure Machine Learning studio notebooks have a modal user interface. The keyboard does different things depending on which mode the notebook cell is in. Azure Machine Learning studio notebooks support the following two modes for a given code cell: command mode and edit mode.

### Command mode shortcuts

A cell is in command mode when there's no text cursor prompting you to type. When a cell is in Command mode, you can edit the notebook as a whole but not type into individual cells. Enter command mode by pressing `ESC` or using the mouse to select outside of a cell's editor area.  The left border of the active cell is blue and solid, and its **Run** button is blue.

   :::image type="content" source="media/how-to-run-jupyter-notebooks/command-mode.png" alt-text="Notebook cell in command mode ":::

| Shortcut                      | Description                          |
| ----------------------------- | ------------------------------------|
| Enter                         | Enter edit mode             |        
| Shift + Enter                 | Run cell, select below         |     
| Control/Command + Enter       | Run cell                            |
| Alt + Enter                   | Run cell, insert code cell below    |
| Control/Command + Alt + Enter | Run cell, insert markdown cell below|
| Alt + R                       | Run all      |                       
| Y                             | Convert cell to code    |                         
| M                             | Convert cell to markdown  |                       
| Up/K                          | Select cell above    |               
| Down/J                        | Select cell below    |               
| A                             | Insert code cell above  |            
| B                             | Insert code cell below   |           
| Control/Command + Shift + A   | Insert markdown cell above    |      
| Control/Command + Shift + B   | Insert markdown cell below   |       
| X                             | Cut selected cell    |               
| C                             | Copy selected cell   |               
| Shift + V                     | Paste selected cell above           |
| V                             | Paste selected cell below    |       
| D D                           | Delete selected cell|                
| O                             | Toggle output         |              
| Shift + O                     | Toggle output scrolling   |          
| I I                           | Interrupt kernel |                   
| 0 0                           | Restart kernel |                     
| Shift + Space                 | Scroll up  |                         
| Space                         | Scroll down|
| Tab                           | Change focus to next focusable item (when tab trap disabled)|
| Control/Command + S           | Save notebook |                      
| 1                             | Change to h1|                       
| 2                             | Change to h2|                        
| 3                             | Change to h3|                        
| 4                             | Change to h4 |                       
| 5                             | Change to h5 |                       
| 6                             | Change to h6 |                       

### Edit mode shortcuts

Edit mode is indicated by a text cursor prompting you to type in the editor area. When a cell is in edit mode, you can type into the cell. Enter edit mode by pressing `Enter` or select a cell's editor area. The left border of the active cell is green and hatched, and its **Run** button is green. You also see the cursor prompt in the cell in Edit mode.

   :::image type="content" source="media/how-to-run-jupyter-notebooks/edit-mode.png" alt-text="Notebook cell in edit mode":::

Using the following keystroke shortcuts, you can more easily navigate and run code in Azure Machine Learning notebooks when in Edit mode.

| Shortcut                      | Description|                                     
| ----------------------------- | ----------------------------------------------- |
| Escape                        | Enter command mode|  
| Control/Command + Space       | Activate IntelliSense |
| Shift + Enter                 | Run cell, select below |                         
| Control/Command + Enter       | Run cell  |                                      
| Alt + Enter                   | Run cell, insert code cell below  |              
| Control/Command + Alt + Enter | Run cell, insert markdown cell below  |          
| Alt + R                       | Run all cells     |                              
| Up                            | Move cursor up or previous cell    |             
| Down                          | Move cursor down or next cell |                  
| Control/Command + S           | Save notebook   |                                
| Control/Command + Up          | Go to cell start   |                             
| Control/Command + Down        | Go to cell end |                                 
| Tab                           | Code completion or indent (if tab trap enabled) |
| Control/Command + M           | Enable/disable tab trap  |                       
| Control/Command + ]           | Indent |                                         
| Control/Command + [           | Dedent  |                                        
| Control/Command + A           | Select all|                                      
| Control/Command + Z           | Undo |                                           
| Control/Command + Shift + Z   | Redo |                                           
| Control/Command + Y           | Redo |                                           
| Control/Command + Home        | Go to cell start|                                
| Control/Command + End         | Go to cell end   |                               
| Control/Command + Left        | Go one word left |                               
| Control/Command + Right       | Go one word right |                              
| Control/Command + Backspace   | Delete word before |                             
| Control/Command + Delete      | Delete word after |                              
| Control/Command + /           | Toggle comment on cell

## Troubleshooting

* **Connecting to a notebook**: If you can't connect to a notebook, ensure that web socket communication is **not** disabled. For compute instance Jupyter functionality to work, web socket communication must be enabled. Ensure your [network allows websocket connections](how-to-access-azureml-behind-firewall.md?tabs=ipaddress#microsoft-hosts) to *.instances.azureml.net and *.instances.azureml.ms. 

* **Private endpoint**: When a compute instance is deployed in a workspace with a private endpoint, it can be only be [accessed from within virtual network](./how-to-secure-training-vnet.md). If you're using custom DNS or hosts file, add an entry for < instance-name >.< region >.instances.azureml.ms with the private IP address of your workspace private endpoint. For more information, see the [custom DNS](./how-to-custom-dns.md?tabs=azure-cli) article.

* **Kernel crash**: If your kernel crashed and was restarted, you can run the following command to look at Jupyter log and find out more details: `sudo journalctl -u jupyter`. If kernel issues persist, consider using a compute instance with more memory.

* **Kernel not found** or **Kernel operations were disabled**: When using the default Python 3.8 kernel on a compute instance, you may get an error such as "Kernel not found" or "Kernel operations were disabled". To fix, use one of the following methods:
    * Create a new compute instance. This will use a new image where this problem has been resolved.
    * Use the Py 3.6 kernel on the existing compute instance.
    * From a terminal in the default py38 environment, run  ```pip install ipykernel==6.6.0``` OR ```pip install ipykernel==6.0.3```

* **Expired token**: If you run into an expired token issue, sign out of your Azure Machine Learning studio, sign back in, and then restart the notebook kernel.

* **File upload limit**: When uploading a file through the notebook's file explorer, you're limited files that are smaller than 5 TB. If you need to upload a file larger than this, we recommend that you use the SDK to upload the data to a datastore. For more information, see [Create data assets](how-to-create-data-assets.md?tabs=Python-SDK).

## Next steps

* [Run your first experiment](tutorial-1st-experiment-sdk-train.md)
* [Backup your file storage with snapshots](../storage/files/storage-snapshots-files.md)
* [Working in secure environments](./how-to-secure-training-vnet.md)
