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
ms.date: 10/24/2018
---

# Configure a development environment for Azure Machine Learning

This article teaches you how to configure a development environment to work with the Azure Machine Learning service, including:

- How to create a configuration file that associates your environment with an Azure Machine Learning service workspace.
- How to configure the following development environments:
  - Jupyter Notebooks on your computer
  - Visual Studio Code
  - Custom code editor
- How to set up a [conda virtual environment](https://conda.io/docs/user-guide/tasks/manage-environments.html) and use it for Azure Machine Learning. We recommend using Continuum Anaconda to isolate your working environment to avoid dependency conflicts between packages.

## Prerequisites

- Set up an Azure Machine Learning service workspace. Follow the steps in [Get started with Azure Machine Learning service](quickstart-get-started.md).
- Install either the [Continuum Anaconda](https://www.anaconda.com/download/) or [Miniconda](https://conda.io/miniconda.html) package manager.
- If you're using Visual Studio Code, get the [Python Extension](https://code.visualstudio.com/docs/python/python-tutorial).

> [!NOTE]
> You can test the shell commands shown in this article by using bash (in Linux and Mac OS) or command prompt (in Windows).

## Create a workspace configuration file

The Azure Machine Learning SDK uses the workspace configuration file to communicate with your Azure Machine Learning service workspace.

- To create the configuration file, complete the [Azure Machine Learning quickstart](quickstart-get-started.md).
  - The quickstart process creates a `config.json` file in Azure Notebooks. This file contains the configuration information for your workspace.
  - Download or copy the `config.json` into the same directory as the scripts or notebooks that reference it.

- Alternatively, you can build the file manually by following these steps:

    1. Open your workspace in the [Azure portal](https://portal.azure.com). Copy the __Workspace name__, __Resource group__, and __Subscription ID__. These values are used to create the configuration file.
        ![Azure portal](./media/how-to-configure-environment/configure.png)

    1. Create the file with the following Python code and make sure to run the code in the same directory as the scripts or notebooks that reference the workspace:

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
        The code writes the following `aml_config/config.json` file:

        ```json
        {
        "subscription_id": "<subscription-id>",
        "resource_group": "<resource-group>",
        "workspace_name": "<workspace-name>"
        }
        ```
        You can copy the `aml_config` directory or just the `config.json` file into any other directory that references the workspace.

       > [!NOTE]
       > Other scripts or notebooks in the same directory or below load the workspace with `ws=Workspace.from_config()`.

## Azure Notebooks and Data Science Virtual Machines

Azure Notebooks and Azure Data Science Virtual Machines (DSVMs) come configured to work with the Azure Machine Learning service. These environments include required components such as the Azure Machine Learning SDK.

- Azure Notebooks is a Jupyter Notebook service in the Azure cloud.
- The Data Science Virtual Machine is a customized virtual machine (VM) image designed for data science work. It includes:
  - Popular tools
  - Integrated development environments (IDEs)
  - Packages such as Jupyter Notebooks, PyCharm, and Tensorflow
- You'll still need a workspace configuration file to use these environments.

For an example of using Azure Notebooks with the Azure Machine Learning service, see [Get started with Azure Machine Learning service](quickstart-get-started.md).

For more information on the Data Science Virtual Machines, see [Data Science Virtual Machines](https://azure.microsoft.com/services/virtual-machines/data-science-virtual-machines/).

## Configure Jupyter Notebooks on your computer

1. Open a command prompt or shell.

1. Create a conda environment with the following commands:

    ```shell
    # create a new conda environment with Python 3.6, numpy, and cython
    conda create -n myenv Python=3.6 cython numpy

    # activate the conda environment
    conda activate myenv

    # On Mac OS run
    source activate myenv
    ```

    It might take several minutes to create the environment if Python 3.6 and other components need to be downloaded.

1. Install the Azure Machine Learning SDK with notebook extras and the Data Preparation SDK by using the following command:

     ```shell
    pip install --upgrade azureml-sdk[notebooks,automl] azureml-dataprep
    ```

    > [!NOTE]
    > If you get a message that `PyYAML` can't be uninstalled, use the following command instead:
    >
    > `pip install --upgrade azureml-sdk[notebooks,automl] azureml-dataprep --ignore-installed PyYAML`

    It might take several minutes to install the SDK.

1. Install packages for your machine learning experimentation. Use the following command and replace `<new package>` with the package you want to install:

    ```shell
    conda install <new package>
    ```

1. Install a conda-aware Jupyter Notebook server and enable experiment widgets (to view run information). Use the following commands:

    ```shell
    # install Jupyter
    conda install nb_conda

    # install experiment widget
    jupyter nbextension install --py --user azureml.train.widgets

    # enable experiment widget
    jupyter nbextension enable --py --user azureml.train.widgets
    ```

1. Open Jupyter Notebook with the following command:

    ```shell
    jupyter notebook
    ```

1. Open a new notebook, select "myenv" as your kernel, and then validate that you have Azure Machine Learning SDK installed. Run the following command in a notebook cell:

    ```python
    import azureml.core
    azureml.core.VERSION
    ```

## Configure Visual Studio Code

1. Open a command prompt or shell.

1. Create a conda environment with the following commands:

    ```shell
    # create a new conda environment with Python 3.6, numpy and cython
    conda create -n myenv Python=3.6 cython numpy

    # activate the conda environment
    conda activate myenv

    # If you are running Mac OS you should run
    source activate myenv
    ```

1. Install the Azure Machine Learning SDK and Data Preparation SDK with the following command:

    ```shell
    pip install --upgrade azureml-sdk[automl] azureml-dataprep
    ```

1. Install the Visual Studio code Tools for AI extension. See [Tools for AI](https://marketplace.visualstudio.com/items?itemName=ms-toolsai.vscode-ai).

1. Install packages for your machine learning experimentation. Use the following command, replacing `<new package>` with the package you want to install:

    ```shell
    conda install <new package>
    ```

1. Open Visual Studio Code, and then use **CTRL-SHIFT-P** (in Windows) or **COMMAND-SHIFT-P** (in Mac OS) to get the **Command Palette**. Enter _Python: Select Interpreter_ and select the conda environment you created.

   > [!NOTE]
   > Visual Studio Code is automatically aware of conda environments on your computer. For more information, see [Visual Studio code documentation](https://code.visualstudio.com/docs/python/environments#_conda-environments).

1. Validate the configuration by using Visual Studio Code to create a new Python script file with the following code, and then run it:

    ```python
    import azureml.core
    azureml.core.VERSION
    ```

## Configure a custom code editor

You can use a code editor of your choice with the Azure Machine Learning SDK.

1. Create your conda environment as described in step 2 of [Configure Visual Studio Code](#configure-visual-studio-code) above.
1. Follow the instructions for each editor to use the conda environment. For example, you can follow the [PyCharm instructions](https://www.jetbrains.com/help/pycharm/2018.2/conda-support-creating-conda-virtual-environment.html).

## Next steps

- [Train a model on Azure Machine Learning with the MNIST dataset](tutorial-train-models-with-aml.md)
