---
title: Set up development environment | Python
titleSuffix: Azure Machine Learning
description: Learn to set up a Python development environment for Azure Machine Learning. Use Conda environments, create configuration files, and configure your own cloud-based notebook server, Jupyter Notebooks, Azure Databricks, IDEs, code editors, and the Data Science Virtual Machine.
services: machine-learning
author: rastala
ms.author: roastala
ms.service: machine-learning
ms.subservice: core
ms.reviewer: larryfr
ms.date: 09/30/2020
ms.topic: conceptual
ms.custom: how-to, devx-track-python, contperfq1, devx-track-azurecli
---

# Set up a development environment for Azure Machine Learning

Learn how to configure a Python development environment for Azure Machine Learning.

The following table shows each development environment covered in this article, along with pros and cons.

| Environment | Pros | Cons |
| --- | --- | --- |
| [Local environment](#local) | Full control of your development environment and dependencies. Run with any build tool, environment, or IDE of your choice. | Takes longer to get started. Necessary SDK packages must be installed, and an environment must also be installed if you don't already have one. |
| [Azure Machine Learning compute instance](#compute-instance) | Easiest way to get started. The entire SDK is already installed in your workspace VM, and notebook tutorials are pre-cloned and ready to run. | Lack of control over your development environment and dependencies. Additional cost incurred for Linux VM (VM can be stopped when not in use to avoid charges). See [pricing details](https://azure.microsoft.com/pricing/details/virtual-machines/linux/). |
| [Azure Databricks](#aml-databricks) | Ideal for running large-scale intensive machine learning workflows on the scalable Apache Spark platform. | Overkill for experimental machine learning, or smaller-scale experiments and workflows. Additional cost incurred for Azure Databricks. See [pricing details](https://azure.microsoft.com/pricing/details/databricks/). |
| [The Data Science Virtual Machine (DSVM)](#dsvm) | Similar to the cloud-based compute instance (Python and the SDK are pre-installed), but with additional popular data science and machine learning tools pre-installed. Easy to scale and combine with other custom tools and workflows. | A slower getting started experience compared to the cloud-based compute instance. |

This article also provides additional usage tips for the following tools:

* Jupyter Notebooks: If you're already using Jupyter Notebooks, the SDK has some extras that you should install.

* Visual Studio Code: If you use Visual Studio Code, the [Azure Machine Learning extension](https://marketplace.visualstudio.com/items?itemName=ms-toolsai.vscode-ai) includes extensive language support for Python as well as features to make working with the Azure Machine Learning much more convenient and productive.

## Prerequisites

* Azure Machine Learning workspace. If you don't have one you can create an Azure Machine Learning workspace through the [Azure portal](how-to-manage-workspace.md), [Azure CLI](how-to-manage-workspace-cli.md#create-a-workspace), and [Azure Resource Manager templates](how-to-create-workspace-template.md).

### <a id="workspace"></a> (Local and DSVM only) Create a workspace configuration file

The workspace configuration file is a JSON file that tells the SDK how to communicate with your Azure Machine Learning workspace. The file is named *config.json*, and it has the following format:

```json
{
    "subscription_id": "<subscription-id>",
    "resource_group": "<resource-group>",
    "workspace_name": "<workspace-name>"
}
```

This JSON file must be in the directory structure that contains your Python scripts or Jupyter Notebooks. It can be in the same directory, a subdirectory named *.azureml*, or in a parent directory.

To use this file from your code, use the [`Workspace.from_config`](/python/api/azureml-core/azureml.core.workspace.workspace?view=azure-ml-py#from-config-path-none--auth-none---logger-none---file-name-none-&preserve-view=true) method. This code loads the information from the file and connects to your workspace.

Create a workspace configuration file in one of the following methods:

* Azure portal

    **Download the file**: In the [Azure portal](https://ms.portal.azure.com), select  **Download config.json** from the **Overview** section of your workspace.

    ![Azure portal](./media/how-to-configure-environment/configure.png)

* Azure Machine Learning Python SDK

    Create a script to connect to your Azure Machine Learning workspace and use the [`write_config`](/python/api/azureml-core/azureml.core.workspace.workspace?view=azure-ml-py#write-config-path-none--file-name-none-&preserve-view=true) method to generate your file and save it as *.azureml/config.json*. Make sure to replace `subscription_id`,`resource_group`, and `workspace_name` with your own.

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

## <a id="local"></a>Local computer

To configure a local development environment (which might also be a remote virtual machine such as an Azure Machine Learning compute instance or DSVM):

1. Create a Python virtual environment (virtualenv, conda).

    > [!NOTE]
    > Although not required, it's recommended you use [Anaconda](https://www.anaconda.com/download/) or [Miniconda](https://www.anaconda.com/download/) to manage Python virtual environments and install packages.

    > [!IMPORTANT]
    > If you're on Linux or macOS and use a shell other than bash (for example, zsh) you might receive errors when you run some commands. To work around this problem, use the `bash` command to start a new bash shell and run the commands there.

1. Activate your newly created Python virtual environment.
1. Install the [Azure Machine Learning Python SDK](/python/api/overview/azure/ml/install?preserve-view=true&view=azure-ml-py).
1. To to configure your local environment to use your Azure Machine Learning workspace, [create a workspace configuration file](#workspace) or use an existing one.

Now that you have your local environment set up, you're ready to start working with Azure Machine Learning. See the [Azure Machine Learning Python getting started guide](tutorial-1st-experiment-sdk-setup-local.md) to get started.

### <a id="jupyter"></a>Jupyter Notebooks

When running a local Jupyter Notebook server, it's recommended that you create an IPython kernel for your Python virtual environment. This helps ensure the expected kernel and package import behavior.

1. Enable environment-specific IPython kernels

    ```bash
    conda install notebook ipykernel
    ```

1. Create a kernel for your Python virtual environment. Make sure to replace `<myenv>` with the name of your Python virtual environment.

    ```bash
    ipython kernel install --user --name <myenv> --display-name "Python (myenv)"
    ```

1. Launch the Jupyter Notebook server

See the [Azure Machine Learning notebooks repository](https://github.com/Azure/MachineLearningNotebooks) to get started with Azure Machine Learning and Jupyter Notebooks.

> [!NOTE]
> A community-driven repository of examples can be found at https://github.com/Azure/azureml-examples.

### <a id="vscode"></a>Visual Studio Code

To use Visual Studio Code for development:

1. Install [Visual Studio Code](https://code.visualstudio.com/Download).
1. Install the [Azure Machine Learning Visual Studio Code extension](tutorial-setup-vscode-extension.md) (preview).

Once you have the Visual Studio Code extension installed, you can manage your [Azure Machine Learning resources](how-to-manage-resources-vscode.md), [run and debug experiments](how-to-debug-visual-studio-code.md), and [deploy trained models](tutorial-train-deploy-image-classification-model-vscode.md).

## <a id="compute-instance"></a>Azure Machine Learning compute instance

The Azure Machine Learning [compute instance](concept-compute-instance.md) is a secure, cloud-based Azure workstation that provides data scientists with a Jupyter Notebook server, JupyterLab, and a fully managed machine learning environment.

There is nothing to install or configure for a compute instance.  

Create one anytime from within your Azure Machine Learning workspace. Provide just a name and specify an Azure VM type. Try it now with this [Tutorial: Setup environment and workspace](tutorial-1st-experiment-sdk-setup.md).

To learn more about compute instances, including how to install packages, see [Create and manage an Azure Machine Learning compute instance](how-to-create-manage-compute-instance.md).

> [!TIP]
> To prevent incurring charges for an unused compute instance, [stop the compute instance](how-to-create-manage-compute-instance.md#manage).

In addition to a Jupyter Notebook server and JupyterLab, you can use compute instances in the [integrated notebook feature inside of Azure Machine Learning studio](how-to-run-jupyter-notebooks.md).

You can also use the Azure Machine Learning Visual Studio Code extension to [configure an Azure Machine Learning compute instance as a remote Jupyter Notebook server](how-to-set-up-vs-code-remote.md#configure-compute-instance-as-remote-notebook-server).

## <a id="dsvm"></a>Data Science Virtual Machine

The DSVM is a customized virtual machine (VM) image. It's designed for data science work that's pre-configured tools and software like:

  - Packages such as TensorFlow, PyTorch, Scikit-learn, XGBoost, and the Azure Machine Learning SDK
  - Popular data science tools such as Spark Standalone and Drill
  - Azure tools such as the Azure CLI, AzCopy, and Storage Explorer
  - Integrated development environments (IDEs) such as Visual Studio Code and PyCharm
  - Jupyter Notebook Server

For a more comprehensive list of the tools, see the [DSVM included tools guide](data-science-virtual-machine/tools-included.md).

> [!IMPORTANT]
> If you plan to use the DSVM as a [compute target](concept-compute-target.md) for your training or inferencing jobs, only Ubuntu is supported.

To use the DSVM as a development environment

1. Create a DSVM using one of the following methods:

    * Use the Azure portal to create an [Ubuntu](data-science-virtual-machine/dsvm-ubuntu-intro.md) or [Windows](data-science-virtual-machine/provision-vm.md) DSVM.
    * [Create a DSVM using ARM templates](data-science-virtual-machine/dsvm-tutorial-resource-manager.md).
    * Use the Azure CLI

        To create an Ubuntu DSVM, use the following command:

        ```azurecli-interactive
        # create a Ubuntu DSVM in your resource group
        # note you need to be at least a contributor to the resource group in order to execute this command successfully
        # If you need to create a new resource group use: "az group create --name YOUR-RESOURCE-GROUP-NAME --location YOUR-REGION (For example: westus2)"
        az vm create --resource-group YOUR-RESOURCE-GROUP-NAME --name YOUR-VM-NAME --image microsoft-dsvm:linux-data-science-vm-ubuntu:linuxdsvmubuntu:latest --admin-username YOUR-USERNAME --admin-password YOUR-PASSWORD --generate-ssh-keys --authentication-type password
        ```

        To create a Windows DSVM, use the following command:

        ```azurecli-interactive
        # create a Windows Server 2016 DSVM in your resource group
        # note you need to be at least a contributor to the resource group in order to execute this command successfully
        az vm create --resource-group YOUR-RESOURCE-GROUP-NAME --name YOUR-VM-NAME --image microsoft-dsvm:dsvm-windows:server-2016:latest --admin-username YOUR-USERNAME --admin-password YOUR-PASSWORD --authentication-type password
        ```

1. Activate the conda environment containing the Azure Machine Learning SDK.

    * For Ubuntu DSVM:

        ```bash
        conda activate py36
        ```

    * For Windows DSVM:

        ```bash
        conda activate AzureML
        ```

1. To configure the DSVM to use your Azure Machine Learning workspace, [create a workspace configuration file](#workspace) or use an existing one.

Similar to local environments, you can use Visual Studio Code and the [Azure Machine Learning Visual Studio Code extension](#vscode) to interact with Azure Machine Learning.

For more information, see [Data Science Virtual Machines](https://azure.microsoft.com/services/virtual-machines/data-science-virtual-machines/).

## <a name="aml-databricks"></a> Azure Databricks

Azure Databricks is an Apache Spark-based environment in the Azure cloud. It provides a collaborative Notebook-based environment with a CPU or GPU-based compute cluster.

How Azure Databricks works with Azure Machine Learning:

+ You can train a model using Spark MLlib and deploy the model to ACI/AKS from within Azure Databricks.
+ You can also use [automated machine learning](concept-automated-ml.md) capabilities in a special Azure ML SDK with Azure Databricks.
+ You can use Azure Databricks as a compute target from an [Azure Machine Learning pipeline](concept-ml-pipelines.md).

### Set up your Databricks cluster

Create a [Databricks cluster](/azure/databricks/scenarios/quickstart-create-databricks-workspace-portal). Some settings apply only if you install the SDK for automated machine learning on Databricks.
**It will take few minutes to create the cluster.**

Use these settings:

| Setting |Applies to| Value |
|----|---|---|
| Cluster name |always| yourclustername |
| Databricks Runtime |always|Non-ML Runtime 7.1 (scala 2.21, spark 3.0.0) |
| Python version |always| 3 |
| Workers |always| 2 or higher |
| Worker node VM types <br>(determines max # of concurrent iterations) |Automated ML<br>only| Memory optimized VM preferred |
| Enable Autoscaling |Automated ML<br>only| Uncheck |

Wait until the cluster is running before proceeding further.

### Install the correct SDK into a Databricks library

Once the cluster is running, [create a library](https://docs.databricks.com/user-guide/libraries.html#create-a-library) to attach the appropriate Azure Machine Learning SDK package to your cluster. For automated ML skip to the [SDK for Databricks with automated machine learning section](#sdk-for-databricks-with-automated-machine-learning).

1. Right-click the current Workspace folder where you want to store the library. Select **Create** > **Library**.

1. Choose the following option (no other SDK installation are supported)

   |SDK&nbsp;package&nbsp;extras|Source|PyPi&nbsp;Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|
   |----|---|---|
   |For Databricks| Upload Python Egg or PyPI | azureml-sdk[databricks]|

   > [!Warning]
   > No other SDK extras can be installed. Choose only the [`databricks`] option .

   * Do not select **Attach automatically to all clusters**.
   * Select  **Attach** next to your cluster name.

1. Monitor for errors until status changes to **Attached**, which may take several minutes.  If this step fails:

   Try restarting your cluster by:
   1. In the left pane, select **Clusters**.
   1. In the table, select your cluster name.
   1. On the **Libraries** tab, select **Restart**.

   Also consider:
   + In AutoML config, when using Azure Databricks add the following parameters:
       1. ```max_concurrent_iterations``` is based on number of worker nodes in your cluster.
        2. ```spark_context=sc``` is based on the default spark context.
   + Or, if you have an old SDK version, deselect it from cluster's installed libs and move to trash. Install the new SDK version and restart the cluster. If there is an issue after the restart, detach and reattach your cluster.

If install was successful, the imported library should look like one of these:

#### SDK for Databricks
![Azure Machine Learning SDK for Databricks](./media/how-to-configure-environment/amlsdk-withoutautoml.jpg)

#### SDK for Databricks with automated machine learning
If the cluster was created with Databricks non ML runtime 7.1 or above, run the following command in the first cell of your notebook to install the AML SDK.

```
%pip install --upgrade --force-reinstall -r https://aka.ms/automl_linux_requirements.txt
```
For Databricks non ML runtime 7.0 and lower, install the AML SDK using the [init script](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/azure-databricks/automl/README.md).


### Start exploring

Try it out:
+ While many sample notebooks are available, **only [these sample notebooks](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/azure-databricks) work with Azure Databricks.**

+ Import these samples directly from your workspace. See below:
![Select Import](./media/how-to-configure-environment/azure-db-screenshot.png)
![Import Panel](./media/how-to-configure-environment/azure-db-import.png)

+ Learn how to [create a pipeline with Databricks as the training compute](how-to-create-your-first-pipeline.md).

## Next steps

- [Train a model](tutorial-train-models-with-aml.md) on Azure Machine Learning with the MNIST dataset
- View the [Azure Machine Learning SDK for Python](/python/api/overview/azure/ml/intro?preserve-view=true&view=azure-ml-py) reference