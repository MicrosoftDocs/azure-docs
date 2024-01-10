---
title: How to access a compute instance terminal in your workspace
titleSuffix: Azure Machine Learning
description: Use the terminal on a compute instance for Git operations, to install packages, and add kernels.
services: machine-learning
author: fkriti
ms.author: kritifaujdar
ms.reviewer: sgilley
ms.service: machine-learning
ms.subservice: compute
ms.custom: event-tier1-build-2022
ms.topic: how-to
ms.date: 12/27/2023
#Customer intent: As a data scientist, I want to use Git, install packages and add kernels to a compute instance in my workspace in Azure Machine Learning studio.
---

# Access a compute instance terminal in your workspace

Access the terminal of a compute instance in your workspace to:

* Use files from Git and version files. These files are stored in your workspace file system, not restricted to a single compute instance.
* Install packages on the compute instance.
* Create extra kernels on the compute instance.

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
* A Machine Learning workspace. See [Create workspace resources](quickstart-create-resources.md).

## Access a terminal

To access the terminal:

1. Open your workspace in [Azure Machine Learning studio](https://ml.azure.com).
1. On the left side, select **Notebooks**.
1. Select the **Open terminal** image.

    :::image type="content" source="media/how-to-use-terminal/open-terminal-window.png" alt-text="Open terminal window":::

1. When a compute instance is running, the terminal window for that compute instance appears.
1. When no compute instance is running, use the **Compute** section on the right to start or create a compute instance.
    :::image type="content" source="media/how-to-use-terminal/start-or-create-compute.png" alt-text="Start or create a compute instance":::

In addition to the steps above, you can also access the terminal from:

* RStudio or Posit Workbench (formerly RStudio Workbench) (See [Add custom applications such as RStudio or Posit Workbench)](how-to-create-compute-instance.md?tabs=python#add-custom-applications-such-as-rstudio-or-posit-workbench)): Select the **Terminal** tab on top left.
* Jupyter Lab:  Select the **Terminal** tile under the **Other** heading in the Launcher tab.
* Jupyter:  Select **New>Terminal** on top right in the Files tab.
* SSH to the machine, if you enabled SSH access when the compute instance was created.

## Copy and paste in the terminal

> * Windows: `Ctrl-Insert` to copy and use `Ctrl-Shift-v` or `Shift-Insert` to paste.
> * Mac OS: `Cmd-c` to copy and `Cmd-v` to paste.
> * FireFox/IE may not support clipboard permissions properly.

## <a name=git></a> Use files from Git and version files

Access all Git operations from the terminal. All Git files and folders will be stored in your workspace file system. This storage allows you to use these files from any compute instance in your workspace.

> [!NOTE]
> Add your files and folders anywhere under the **~/cloudfiles/code/Users** folder so they will be visible in all your Jupyter environments.

To integrate Git with your Azure Machine Learning workspace, see  [Git integration for Azure Machine Learning](concept-train-model-git-integration.md).

## Install packages

 Install packages from a terminal window. Install packages into the kernel that you want to use to run your notebooks.  The default kernel is **python310-sdkv2**.  

Or you can install packages directly in Jupyter Notebook, RStudio, or Posit Workbench (formerly RStudio Workbench):

* RStudio or Posit Workbench(see [Add custom applications such as RStudio or Posit Workbench](how-to-create-compute-instance.md#add-custom-applications-such-as-rstudio-or-posit-workbench)): Use the **Packages** tab on the bottom right, or the **Console** tab on the top left.  
* Python: Add install code and execute in a Jupyter Notebook cell.

> [!NOTE]
> For package management within a Python notebook, use **%pip** or **%conda** magic functions to automatically install packages into the **currently-running kernel**, rather than **!pip** or **!conda** which refers to all packages (including packages outside the currently-running kernel)

## Add new kernels

> [!WARNING]
> While customizing the compute instance, make sure you do not delete conda environments or jupyter kernels that you didn't create. Doing so may damage Jupyter/JupyterLab functionality.

To add a new Jupyter kernel to the compute instance:

1. Use the terminal window to create a new environment.  For example, the code below creates `newenv`:

    ```shell
    conda create --name newenv
    ```

1. Activate the environment.  For example, after creating `newenv`:

    ```shell
    conda activate newenv
    ```

1. Install pip and ipykernel package to the new environment and create a kernel for that conda env

    ```shell
    conda install pip
    conda install ipykernel
    python -m ipykernel install --user --name newenv --display-name "Python (newenv)"
    ```

Any of the [available Jupyter Kernels](https://github.com/jupyter/jupyter/wiki/Jupyter-kernels) can be installed.  

To add a new R kernel to the compute instance:

1. Use the terminal window to create a new environment. For example, the code below creates `r_env`:

    ```shell
    conda create -n r_env r-essentials r-base
    ```

1. Activate the environment.  For example, after creating `r_env`:

    ```shell
    conda activate r_env
    ```

1. Run R in the new environment:

   ```
   R
   ```
   
1. At the R prompt, run `IRkernel`:

   ```
   IRkernel::installspec(name = 'irenv', displayname = 'New R Env')
   ```

1. Quit the R session.

    ```
    q()
    ```

It will take a few minutes before the new R kernel is ready to use.  If you get an error saying it is invalid, wait and then try again.

For more information about conda, see [Using R language with Anaconda](https://docs.anaconda.com/free/anaconda/packages/using-r-language/). For more information about IRkernel, see [Native R kernel for Jupyter](https://cran.r-project.org/web/packages/IRkernel/readme/README.html).

### Remove added kernels

> [!WARNING]
> While customizing the compute instance, make sure you do not delete conda environments or jupyter kernels that you didn't create.

To remove an added Jupyter kernel from the compute instance, you must remove the kernelspec, and (optionally) the conda environment. You can also choose to keep the conda environment. You must remove the kernelspec, or your kernel will still be selectable and cause unexpected behavior.

To remove the kernelspec:

1. Use the terminal window to list and find the kernelspec:

    ```shell
    jupyter kernelspec list
    ```

1. Remove the kernelspec, replacing UNWANTED_KERNEL with the kernel you'd like to remove:

    ```shell
    jupyter kernelspec uninstall UNWANTED_KERNEL
    ```

To also remove the conda environment:

1. Use the terminal window to list and find the conda environment:

    ```shell
    conda env list
    ```

1. Remove the conda environment, replacing ENV_NAME with the conda environment you'd like to remove:

    ```shell
    conda env remove -n ENV_NAME
    ```

Upon refresh, the kernel list in your notebooks view should reflect the changes you have made.

## Manage terminal sessions

Terminal sessions can stay active if terminal tabs are not properly closed. Too many active terminal sessions can impact the performance of your compute instance.

Select **Manage active sessions** in the terminal toolbar to see a list of all active terminal sessions and shut down the sessions you no longer need.

Learn more about how to manage sessions running on your compute at [Managing notebook and terminal sessions](how-to-manage-compute-sessions.md).

> [!WARNING]
> Make sure you close any sessions you no longer need to preserve your compute instance's resources and optimize your performance.
