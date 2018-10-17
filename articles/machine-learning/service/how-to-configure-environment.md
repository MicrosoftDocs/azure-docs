---
title: Configure a development environment for Azure Machine Learning  | Microsoft Docs
description: Learn how to configure a development environment when working with the Azure Machine Learning service. In this document, learn how to use Conda environments, create configuration files, and configure Jupyter Notebooks, Azure Notebooks, IDEs, code editors, and the Data Science Virtual Machine.
services: machine-learning
author: rastala
ms.author: roastala
ms.service: machine-learning
ms.component: core
ms.reviewer: larryfr
manager: cgronlun
ms.topic: conceptual
ms.date: 8/6/2018
---

# Configure a development environment for the Azure Machine Learning service

Learn how to configure your development environment to work with the Azure Machine Learning service. You will learn how to create a configuration file that associates your environment with an Azure Machine Learning service workspace. You'll also learn how to configure the following development environments:

* Jupyter Notebooks on your own computer
* Visual Studio Code
* Code editor of your choice

The recommended approach is to use Continuum Anaconda [conda virtual environments](https://conda.io/docs/user-guide/tasks/manage-environments.html) to isolate your working environment so as to avoid dependency conflicts between packages. This article shows the steps of setting up a conda environment and using it for Azure Machine Learning.


## Prerequisites

* An Azure Machine Learning service workspace. To create one, use the steps in the [Get started with Azure Machine Learning service](quickstart-get-started.md) document.

* [Continuum Anaconda](https://www.anaconda.com/download/) or [Miniconda](https://conda.io/miniconda.html) package manager.

 * For Visual Studio Code environment, the [Python Extension](https://code.visualstudio.com/docs/python/python-tutorial).

> [!NOTE]
> Shell commands used in this document are tested with bash on Linux and macOS. The commands are also tested with cmd.exe on Windows.

## Create workspace configuration file

The workspace configuration file is used by the SDK to communicate with your Azure Machine Learning service workspace.  There are two ways to get this file:

* Complete the [quickstart](quickstart-get-started.md) to create a workspace and configuration file. The file `config.json` is created for you in Azure notebooks.  This file contains the configuration information for your workspace.  Download or copy it into the same directory as the scripts or notebooks that reference it.


* Create the configuration file yourself with following steps:

    1. Open your workspace in the [Azure portal](https://portal.azure.com). Copy the __Workspace name__, __Resource group__, and __Subscription ID__. These values are used to create the configuration file.

        ![Azure portal](./media/how-to-configure-environment/configure.png) 
    
    1. Create the file with this Python code. Run the code in the same directory as the scripts or notebooks that reference the workspace:

        ```python
        from azureml.core import Workspace

        subscription_id ='<subscription-id>'
        resource_group ='<resource-group>'
        workspace_name = '<workspace-name>'
        
        try:
           ws = Workspace(subscription_id = subscription_id, resource_group = resource_group, workspace_name = workspace_name)
           ws.write_config()
           print('Library configuration succeeded')
        except:
           print('Workspace not found')
        ```
        This writes the following `aml_config/config.json` file: 
    
        ```json
        {
        "subscription_id": "<subscription-id>",
        "resource_group": "<resource-group>",
        "workspace_name": "<workspace-name>"
        }
        ```
        You can copy the `aml_config` directory or just the `config.json` file into any other directory that references the workspace.

>[!NOTE] 
>Other scripts or notebooks in the same directory or below will load the workspace with `ws=Workspace.from_config()`

## Azure Notebooks and Data Science Virtual Machine

Azure Notebooks and Azure Data Science Virtual Machines (DSVM) are pre-configured to work with the Azure Machine Learning service. Required components, such as the Azure Machine Learning SDK, are pre-installed on these environments.

Azure Notebooks is a Jupyter Notebook service in the Azure cloud. The Data Science Virtual Machine is a VM image that is pre-configured for data science work. The VM includes popular tools, IDEs, and packages such as Jupyter Notebooks, PyCharm, and Tensorflow.

You will still need a workspace configuration file to use these environments.

For more information on the Data Science Virtual Machines, see [Data Science Virtual Machines](https://azure.microsoft.com/services/virtual-machines/data-science-virtual-machines/) documentation.

For an example of using Azure Notebooks with the Azure Machine Learning service, see the [Get started with Azure Machine Learning service](quickstart-get-started.md) document.

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

    It can take several minutes to create the environment, as Python 3.6 and other components may need to be downloaded.

3. To install Azure Machine Learning SDK with notebook extras, use the following command:

     ```shell
    pip install --upgrade azureml-sdk[notebooks,automl]
    ```

    > [!NOTE]
    > If you receive a message that `PyYAML` cannot be uninstalled, use the following command instead:
    > 
    > `pip install --upgrade azureml-sdk[notebooks,automl] --ignore-installed PyYAML` 

    It can take several minutes to install the SDK.

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
    pip install --upgrade azureml-sdk[automl]
    ```

4. To install the Visual Studio code Tools for AI, see the Visual Studio marketplace entry for [Tools for AI](https://marketplace.visualstudio.com/items?itemName=ms-toolsai.vscode-ai). 

5. To install packages for your machine learning experimentation, use the following command and replace `<new package>` with the package you want to install:

    ```shell
    conda install <new package>
    ```

6. Launch Visual Studio Code, and then use __CTRL-SHIFT-P__ for Windows or __COMMAND-SHIFT-P__ for Mac to get the __Command Palette__. Enter *Python: Select Interpreter*, and select the conda environment you created.

    > [!NOTE]
    > Visual Studio Code is automatically aware of conda environments on your computer. For more information, see [Visual Studio code documentation](https://code.visualstudio.com/docs/python/environments#_conda-environments).

7. To validate the configuration, use Visual Studio Code to create a new Python script file with following code, and then run it:

    ```python
    import azureml.core
    azureml.core.VERSION
    ```

## Configure code editor of your choice

To use a custom code editor with Azure Machine Learning SDK, first create conda environment as described above. Then follow the instructions for each editor to use the conda environment. For example, the instructions for PyCharm are located at [https://www.jetbrains.com/help/pycharm/2018.2/conda-support-creating-conda-virtual-environment.html](https://www.jetbrains.com/help/pycharm/2018.2/conda-support-creating-conda-virtual-environment.html).
 
## Next steps

* [Train a model on Azure Machine Learning with the MNIST dataset](tutorial-train-models-with-aml.md)
