---
title: Set up a Python development environment
titleSuffix: Azure Machine Learning service
description: Learn how to configure a development environment when you work with the Azure Machine Learning service. In this article, you learn how to use Conda environments, create configuration files, and configure Jupyter Notebooks, Azure Notebooks, Azure Databricks, IDEs, code editors, and the Data Science Virtual Machine.
services: machine-learning
author: rastala
ms.author: roastala
ms.service: machine-learning
ms.subservice: core
ms.reviewer: larryfr
manager: cgronlun
ms.topic: conceptual
ms.date: 01/18/2019
ms.custom: seodec18
---

# Configure a development environment for Azure Machine Learning

In this article, you learn how to configure a development environment to work with Azure Machine Learning service. Machine Learning service is platform agnostic. 

The only requirements for your development environment are Python 3, Conda (for isolated environments), and a configuration file that contains your Azure Machine Learning workspace information.

This article focuses on the following environments and tools:

* [Azure Notebooks](#aznotebooks): A Jupyter Notebooks service that's hosted in the Azure cloud. It's the easiest way to get started, because the Azure Machine Learning SDK is already installed.

* [The Data Science Virtual Machine (DSVM)](#dsvm): A pre-configured development or experimentation environment in the Azure cloud that's designed for data science work and can be deployed to either CPU only VM instances or GPU-based instances. Python 3, Conda, Jupyter Notebooks, and the Azure Machine Learning SDK are already installed. The VM comes with popular machine learning and deep learning frameworks, tools, and editors for developing machine learning solutions. It's probably the most complete development environment for machine learning on the Azure platform.

* [The Jupyter Notebook](#jupyter): If you're already using the Jupyter Notebook, the SDK has some extras that you should install.

* [Visual Studio Code](#vscode): If you use Visual Studio Code, it has some useful extensions that you can install.

* [Azure Databricks](#aml-databricks): A popular data analytics platform that's based on Apache Spark. Learn how to get the Azure Machine Learning SDK onto your cluster so that you can deploy models.

If you already have a Python 3 environment, or just want the basic steps for installing the SDK, see the [Local computer](#local) section.

## Prerequisites

- An Azure Machine Learning service workspace. To create the workspace, see [Get started with Azure Machine Learning service](quickstart-get-started.md).

- Either the [Continuum Anaconda](https://www.anaconda.com/download/) or [Miniconda](https://conda.io/miniconda.html) package manager.

    > [!IMPORTANT]
    > Anaconda and Miniconda are not required when you're using Azure Notebooks.

- On Linux or macOS, you need the bash shell.

    > [!TIP]
    > If you're on Linux or macOS and use a shell other than bash (for example, zsh) you might receive errors when you run some commands. To work around this problem, use the `bash` command to start a new bash shell and run the commands there.

- On Windows, you need the command prompt or Anaconda prompt (installed by Anaconda and Miniconda).

## <a id="aznotebooks"></a>Azure Notebooks

[Azure Notebooks](https://notebooks.azure.com) (preview) is an interactive development environment in the Azure cloud. It's the easiest way to get started with Azure Machine Learning development.

* The Azure Machine Learning SDK is already installed.
* After you create an Azure Machine Learning service workspace in the Azure portal, you can click a button to automatically configure your Azure Notebook environment to work with the workspace.

To get started developing with Azure Notebooks, see [Get started with Azure Machine Learning service](quickstart-get-started.md).

By default, Azure Notebooks uses a free service tier that is limited to 4GB of memory and 1GB of data. You can, however, remove these limits by attaching a Data Science Virtual Machine instance to the Azure Notebooks project. For more information, see [Manage and configure Azure Notebooks projects - Compute tier](/azure/notebooks/configure-manage-azure-notebooks-projects#compute-tier).

## <a id="dsvm"></a>Data Science Virtual Machine

The DSVM is a customized virtual machine (VM) image. It's designed for data science work that's pre-configured with:

  - Packages such as TensorFlow, PyTorch, Scikit-learn, XGBoost, and the Azure Machine Learning SDK
  - Popular data science tools such as Spark Standalone and Drill
  - Azure tools such as the Azure CLI, AzCopy, and Storage Explorer
  - Integrated development environments (IDEs) such as Visual Studio Code and PyCharm
  - Jupyter Notebook Server

The Azure Machine Learning SDK works on either the Ubuntu or Windows version of the DSVM. But if you plan to use the DSVM as a compute target as well, only Ubuntu is supported.

To use the DSVM as a development environment, do the following:

1. Create a DSVM in either of the following environments:

    * The Azure portal:

        * [Create an Ubuntu Data Science Virtual Machine](https://docs.microsoft.com/azure/machine-learning/data-science-virtual-machine/dsvm-ubuntu-intro)

        * [Create a Windows Data Science Virtual Machine](https://docs.microsoft.com/azure/machine-learning/data-science-virtual-machine/provision-vm)

    * The Azure CLI:

        > [!IMPORTANT]
        > * When you use the Azure CLI, you must first sign in to your Azure subscription by using the `az login` command.
        >
        > * When you use the commands in this step, you must provide a resource group name, a name for the VM, a username, and a password.

        * To create an Ubuntu Data Science Virtual Machine, use the following command:

            ```azurecli
            # create a Ubuntu DSVM in your resource group
            # note you need to be at least a contributor to the resource group in order to execute this command successfully
            # If you need to create a new resource group use: "az group create --name YOUR-RESOURCE-GROUP-NAME --location YOUR-REGION (For example: westus2)"
            az vm create --resource-group YOUR-RESOURCE-GROUP-NAME --name YOUR-VM-NAME --image microsoft-dsvm:linux-data-science-vm-ubuntu:linuxdsvmubuntu:latest --admin-username YOUR-USERNAME --admin-password YOUR-PASSWORD --generate-ssh-keys --authentication-type password
            ```

        * To create a Windows Data Science Virtual Machine, use the following command:

            ```azurecli
            # create a Windows Server 2016 DSVM in your resource group
            # note you need to be at least a contributor to the resource group in order to execute this command successfully
            az vm create --resource-group YOUR-RESOURCE-GROUP-NAME --name YOUR-VM-NAME --image microsoft-dsvm:dsvm-windows:server-2016:latest --admin-username YOUR-USERNAME --admin-password YOUR-PASSWORD --authentication-type password
            ```    

2. The Azure Machine Learning SDK is already installed on the DSVM. To use the Conda environment that contains the SDK, use one of the following commands:

    * For Ubuntu DSVM:

        ```shell
        conda activate py36
        ```

    * For Windows DSVM:

        ```shell
        conda activate AzureML
        ```

1. To verify that you can access the SDK and check the version, use the following Python code:

    ```python
    import azureml.core
    print(azureml.core.VERSION)
    ```

1. To configure the DSVM to use your Azure Machine Learning service workspace, see the [Create a workspace configuration file](#workspace) section.

For more information, see [Data Science Virtual Machines](https://azure.microsoft.com/services/virtual-machines/data-science-virtual-machines/).

## <a id="local"></a>Local computer

When you're using a local computer (which might also be a remote virtual machine), create a Conda environment and install the SDK by doing the following:

1. Open a command prompt or shell.

1. Create a Conda environment with the following commands:

    ```shell
    # create a new Conda environment with Python 3.6, NumPy, and Cython
    conda create -n myenv Python=3.6 cython numpy

    # activate the Conda environment
    conda activate myenv

    # On macOS run
    source activate myenv
    ```

    It might take several minutes to create the environment if Python 3.6 and other components need to be downloaded.

1. Install the Azure Machine Learning SDK with notebook extras and the Data Preparation SDK by using the following command:

     ```shell
    pip install --upgrade azureml-sdk[notebooks,automl] azureml-dataprep
    ```

   > [!NOTE]
   > If you get a message that PyYAML can't be uninstalled, use the following command instead:
   >
   > `pip install --upgrade azureml-sdk[notebooks,automl] azureml-dataprep --ignore-installed PyYAML`

   It might take several minutes to install the SDK.

1. Install packages for your machine learning experimentation. Use the following command and replace *\<new package>* with the package you want to install:

    ```shell
    conda install <new package>
    ```

1. To verify that the SDK is installed, use the following Python code:

    ```python
    import azureml.core
    azureml.core.VERSION
    ```

### <a id="jupyter"></a>Jupyter Notebooks

Jupyter Notebooks are part of the [Jupyter Project](https://jupyter.org/). They provide an interactive coding experience where you create documents that mix live code with narrative text and graphics. Jupyter Notebooks are also a great way to share your results with others, because you can save the output of your code sections in the document. You can install Jupyter Notebooks on a variety of platforms.

The procedure in the [Local computer](#local) section installs optional components for Jupyter Notebooks. To enable these components in your Jupyter Notebook environment, do the following:

1. Open a command prompt or shell.

1. To install a Conda-aware Jupyter Notebook Server, use the following command:

    ```shell
    # install Jupyter
    conda install nb_conda
    ```

1. Open Jupyter Notebook with the following command:

    ```shell
    jupyter notebook
    ```

1. To verify that Jupyter Notebook can use the SDK, open a new notebook, select **myenv** as your kernel, and then run the following command in a notebook cell:

    ```python
    import azureml.core
    azureml.core.VERSION
    ```

1. To configure the Jupyter Notebook to use your Azure Machine Learning service workspace, go to the [Create a workspace configuration file](#workspace) section.

### <a id="vscode"></a>Visual Studio Code

Visual Studio Code is a cross platform code editor. It relies on a local Python 3 and Conda installation for Python support, but it provides additional tools for working with AI. It also provides support for selecting the Conda environment from within the code editor.

To use Visual Studio Code for development, do the following:

1. To learn how to use Visual Studio Code for Python development, see [Get started with Python in VSCode](https://code.visualstudio.com/docs/python/python-tutorial).

1. To select the Conda environment, open VS Code, and then select Ctrl+Shift+P (Linux and Windows) or Command+Shift+P (Mac).  
    The __Command Pallet__ opens. 

1. Enter __Python: Select Interpreter__, and then select the Conda environment.

1. To validate that you can use the SDK, create and then run a new Python file (.py) that contains the following code:

    ```python
    import azureml.core
    azureml.core.VERSION
    ```

1. To install the Azure Machine Learning extension for Visual Studio Code, see [Tools for AI](https://marketplace.visualstudio.com/items?itemName=ms-toolsai.vscode-ai).

    For more information, see [Use Azure Machine Learning for Visual Studio Code](how-to-vscode-tools.md).

<a name="aml-databricks"></a>

## Azure Databricks

You can use a custom version of the Azure Machine Learning SDK for Azure Databricks for end-to-end custom machine learning. Or you can train your model within Databricks and deploy it by using [Visual Studio Code](how-to-vscode-train-deploy.md#deploy-your-service-from-vs-code).

To prepare your Databricks cluster and get sample notebooks:

1. Create a [Databricks cluster](https://docs.microsoft.com/azure/azure-databricks/quickstart-create-databricks-workspace-portal) with the following settings:

    | Setting | Value |
    |----|---|
    | Cluster name | yourclustername |
    | Databricks Runtime | Any non ML runtime (non ML 4.x, 5.x) |
    | Python version | 3 |
    | Workers | 2 or higher |

    Use these settings only if you will be using automated machine learning on Databricks:
    
    |   Setting | Value |
    |----|---|
    | Worker node VM types | Memory optimized VM preferred |
    | Enable Autoscaling | Uncheck |
    
    The number of worker nodes in your Databricks cluster determines the max number of concurrent iterations in Automated ML settings.  

    It will take few minutes to create the cluster. Wait until the cluster is running before proceeding further.

1. Install and attach the Azure Machine Learning SDK package to your cluster.  

    * [Create a library](https://docs.databricks.com/user-guide/libraries.html#create-a-library) with one of these settings (_choose only one of these options_):
    
        * To install Azure Machine Learning SDK _without_ automated machine learning capability:
            | Setting | Value |
            |----|---|
            |Source | Upload Python Egg or PyPI
            |PyPi Name | azureml-sdk[databricks]
    
        * To install Azure Machine Learning SDK _with_ automated machine learning:
            | Setting | Value |
            |----|---|
            |Source | Upload Python Egg or PyPI
            |PyPi Name | azureml-sdk[automl_databricks]
    
    * Do not select **Attach automatically to all clusters**

    * Select  **Attach** next to your cluster name

    * Ensure that there are no errors until status changes to **Attached**. It may take a couple of minutes.

    If you have an old SDK version, deselect it from cluster’s installed libs and move to trash. Install the new SDK version and restart the cluster. If there is an issue after this, detach and reattach your cluster.

    When you're done, the library is attached as shown in the following images. Be aware of these [common Databricks issues](resource-known-issues.md#databricks).

    * If you installed Azure Machine Learning SDK _without_ automated machine learning
   ![SDK without automated machine learning installed on Databricks ](./media/how-to-configure-environment/amlsdk-withoutautoml.jpg)

    * If you installed Azure Machine Learning SDK _with_ automated machine learning
   ![SDK with automated machine learning installed on Databricks ](./media/how-to-configure-environment/automlonadb.jpg)

   If this step fails, restart your cluster by doing the following:

   a. In the left pane, select **Clusters**. 
   
   b. In the table, select your cluster name. 

   c. On the **Libraries** tab, select **Restart**.

1. Download the [Azure Databricks/Azure Machine Learning SDK notebook archive file](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/azure-databricks/Databricks_AMLSDK_1-4_6.dbc).

   >[!Warning]
   > Many sample notebooks are available for use with Azure Machine Learning service. Only [these sample notebooks](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/azure-databricks) work with Azure Databricks.

1.  [Import the archive file](https://docs.azuredatabricks.net/user-guide/notebooks/notebook-manage.html#import-an-archive) into your Databricks cluster and start exploring as described on the [Machine Learning Notebooks](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/azure-databricks) page.


## <a id="workspace"></a>Create a workspace configuration file

The workspace configuration file is a JSON file that tells the SDK how to communicate with your Azure Machine Learning service workspace. The file is named *config.json*, and it has the following format:

```json
{
    "subscription_id": "<subscription-id>",
    "resource_group": "<resource-group>",
    "workspace_name": "<workspace-name>"
}
```

This JSON file must be in the directory structure that contains your Python scripts or Jupyter Notebooks. It can be in the same directory, a subdirectory named *aml_config*, or in a parent directory.

To use this file from your code, use `ws=Workspace.from_config()`. This code loads the information from the file and connects to your workspace.

You can create the configuration file in three ways:

* **Follow the [Azure Machine Learning quickstart](quickstart-get-started.md)**: A *config.json* file is created in your Azure Notebooks library. The file contains the configuration information for your workspace. You can download or copy the *config.json* to other development environments.

* **Create the file manually**: With this method, you use a text editor. You can find the values that go into the configuration file by visiting your workspace in the [Azure portal](https://portal.azure.com). Copy the workspace name, resource group, and subscription ID values and use them in the configuration file.

     ![Azure portal](./media/how-to-configure-environment/configure.png)

* **Create the file programmatically**: In the following code snippet, you connect to a workspace by providing the subscription ID, resource group, and workspace name. It then saves the workspace configuration to the file:

    ```python
    from azureml.core import Workspace

    subscription_id = '<subscription-id>'
    resource_group  = '<resource-group>'
    workspace_name  = '<workspace-name>'

    try:
        ws = Workspace(subscription_id = subscription_id, resource_group = resource_group, workspace_name = workspace_name)
        ws.write_config()
        print('Library configuration succeeded')
    except:
        print('Workspace not found')
    ```

    This code writes the configuration file to the *aml_config/config.json* file.

## Next steps

- [Train a model](tutorial-train-models-with-aml.md) on Azure Machine Learning with the MNIST dataset]
- View the [Azure Machine Learning SDK for Python](https://aka.ms/aml-sdk) reference
- Learn about the [Azure Machine Learning Data Prep SDK](https://aka.ms/data-prep-sdk)
