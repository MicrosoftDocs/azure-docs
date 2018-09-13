---
title: How to configure a development environment for Azure Machine Learning  | Microsoft Docs
description: This how-to guide explains how to configure a development environment when working with Azure Machine Learning.
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

# How to configure a development environment for the Azure Machine Learning service

You'll learn how to create a workspace configuration file to use in any environment.

You'll also learn about configuring the following develop environments:

* Jupyter Notebooks on your own computer
* Visual Studio Code
* Code editor of your choice


The recommended approach is to use Continuum Anaconda [conda virtual environments](https://conda.io/docs/user-guide/tasks/manage-environments.html) to isolate your working environment so as to avoid dependency conflicts between packages. This article shows the steps of setting up a conda environment and using it for Azure Machine Learning.

## Prerequisites

 * [Continuum Anaconda](https://anaconda.org/anaconda/continuum-docs) or [Miniconda](https://conda.io/miniconda.html) package manager installed

 * For Visual Studio Code environment, [Python Extension installed](https://code.visualstudio.com/docs/python/python-tutorial)

## Create workspace configuration file

Create a configuration file, so your code can interact with your workspace in the cloud.

1. [Create a workspace](quickstart-get-started.md)

1. Open your workspace in the [Azure portal](https://portal.azure.com).

    ![Azure portal](./media/how-to-configure-environment/configure.png) 

3. In a text editor, create a file called **config.json**.  Add the following content to that file, inserting your values from the portal:

    ```json
    {
    "subscription_id": "<subscription-id>",
    "resource_group": "<resource-group>",
    "workspace_name": "<workspace-name>"
    }
    ```

    >[!NOTE] 
    >Later in your code, you read this file with:  `ws = Workspace.from_config()`

4. Be sure to save **config.json** into the same directory as the scripts or notebooks that reference it.

## Configure Jupyter Notebooks on your own computer

1. Open a command-prompt or shell.

2. To create a conda environment, use the following commands:

    ```shell
    # create a new conda environment with Python 3.6, numpy and cython
    conda create -n myenv Python=3.6 cython numpy

    # activate the conda environment
    conda activate myenv

    # If you are running Mac OS you should run
    source activate myenv
    ```

3. To install Azure Machine Learning SDK with notebook extras, use the following command:

     ```shell
    pip install --upgrade azureml-sdk[notebooks,automl,contrib]
    ```

4. To install packages for your machine learning experimentation, use the following command and replace `<new package>` with the package you want to install:

    ```shell
    conda install <new package>
    ```

5. To install a conda-aware Jupyter Notebook server and enable experiment widgets (to view run information), use the following commands:

    ```shell
    # install Jupyter 
    conda install nb_conda

    # install experiment widget
    jupyter nbextension install --py --user azureml.train.widgets

    # enable experiment widget
    jupyter nbextension enable --py --user azureml.train.widgets
    ```

6. To launch Jupyter Notebook, use the following command:

    ```shell
    jupyter notebook
    ```

7. Open a new notebook, and select "myenv" as your kernel. Then validate that you have Azure Machine Learning SDK installed by running following command in a notebook cell:

    ```python
    import azureml.core
    azureml.core.VERSION
    ```

## Configure Visual Studio Code

1. Open a command-prompt or shell.

2. To create a conda environment, use the following commands:

    ```shell
    # create a new conda environment with Python 3.6, numpy and cython
    conda create -n myenv Python=3.6 cython numpy

    # activate the conda environment
    conda activate myenv

    # If you are running Mac OS you should run
    source activate myenv
    ```

2. To install the Azure Machine Learning SDK, use the following command:
 
    ```shell
    pip install --upgrade azureml-sdk[automl,contrib]
    ```

4. To install the Visual Studio code Tools for AI, see the Visual Studio marketplace entry for [Tools for AI](https://marketplace.visualstudio.com/items?itemName=ms-toolsai.vscode-ai). 

5. To install packages for your machine learning experimentation, use the following command and replace `<new package>` with the package you want to install:

    ```shell
    conda install <new package>
    ```

6. Launch Visual Studio Code, and then use __CTRL-SHIFT-P__ to get the __Command Palette__. Enter *Python: Select Interpreter*, and select the conda environment you created.

    > [!NOTE]
    > Visual Studio Code is automatically aware of conda environments on your computer. For more information, see [Visual Studio code documentation](https://code.visualstudio.com/docs/python/environments#_conda-environments).

7. To validate the configuration, use Visual Studio Code to create a new Python script file with following code, and then run it:

    ```python
    import azureml.core
    azureml.core.VERSION
    ```

## Configure code editor of your choice

To use a custom code editor with Azure Machine Learning SDK, first create conda environment as described above. Then follow the instructions for each editor to use the conda environment. For example, the instructions for PyCharm are located at [https://www.jetbrains.com/help/pycharm/2018.2/conda-support-creating-conda-virtual-environment.html](https://www.jetbrains.com/help/pycharm/2018.2/conda-support-creating-conda-virtual-environment.html).

## Configure Azure Notebooks and Data Science Virtual Machine

Azure Notebooks and the Data Science Virtual Machine (DSVM) do not require any configuration to work with Azure Machine Learning service. The required components, such as the Azure Machine Learning SDK, are pre-installed on these environments. 

The DSVM also comes with Jupyter Notebooks and popular Python IDEs pre-installed. For more information, see [Data Science Virtual Machines](https://azure.microsoft.com/services/virtual-machines/data-science-virtual-machines/).
 
## Next steps

* [Train a model on Azure Machine Learning with the MNIST dataset](tutorial-train-models-with-aml.md)
