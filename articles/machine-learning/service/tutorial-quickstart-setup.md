---
title:
titleSuffix: Azure Machine Learning service
description:
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: tutorial
author: trevorbye
ms.author: trbye
ms.reviewer: trbye
ms.date: 07/20/2019
---

# Tutorial: Setup environment and workspace

In this tutorial, you complete the end-to-end steps to get started with the Azure Machine Learning Python SDK running in Jupyter notebooks. This tutorial is **part one of a two-part tutorial series**, and covers Python environment setup and configuration, as well as creating a workspace to manage your experiments and machine learning models. **Part two** builds on this to train a machine learning model and deploy it as a platform-agnostic web-service.

In this tutorial, you:

> [!div class="checklist"]
> * Create a machine learning Workspace to use in the next tutorial.
> * Choose and configure development environment.
> * Set up Python environment with necessary packages (if running locally).

## Prerequisites

The only prerequisite for this tutorial is an Azure subscription. If you don’t have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning service](https://aka.ms/AMLFree) today.

## Create a workspace

If you already have an Azure Machine Learning service workspace, skip to the [next section](#choose-development-environment). Otherwise, create one now.

[!INCLUDE [aml-create-portal](../../../includes/aml-create-in-portal.md)]

## Choose development environment

Use the Azure Machine Learning SDK either in your own local Python environment, or in the cloud notebook server in your workspace. Use your own environment if you prefer to have control over packages and dependencies, or use the cloud notebook server for an install-free and pre-configured experience.

Choose **one** of the following development environments.

* Use a [cloud notebook server in your workspace](#azure)
* Use [your own local environment](#server)

### <a name="azure"></a>Use a cloud notebook server

From your workspace, you create a cloud resource to get started using Jupyter notebooks. This resource is a cloud-based Linux virtual machine pre-configured with everything you need to run Azure Machine Learning service.

1. Open your workspace in the [Azure portal](https://portal.azure.com/).  If you're not sure how to locate your workspace in the portal, see how to [find your workspace](how-to-manage-workspace.md#view).

1. On your workspace page in the Azure portal, select **Notebook VMs** on the left.

1. Select **+New** to create a notebook VM.

     ![Select New VM](./media/quickstart-run-cloud-notebook/add-workstation.png)

1. Provide a name for your VM. Then select **Create**.

    > [!NOTE]
    > Your Notebook VM name must be between 2 to 16 characters. Valid characters are letters, digits, and the - character.  The name must also be unique across your Azure subscription.

    ![Create a new VM](media/quickstart-run-cloud-notebook/create-new-workstation.png)

1. Wait until the status changes to **Running**.


#### Launch Jupyter web interface

After your VM is running, use the **Notebook VMs** section to launch the Jupyter web interface.

1. Select **Jupyter** in the **URI** column for your VM.

    ![Start the Jupyter notebook server](./media/quickstart-run-cloud-notebook/start-server.png)

    The link starts your notebook server and opens the Jupyter notebook webpage in a new browser tab.  This link will only work for the person who creates the VM.

1. On the Jupyter notebook webpage, the top foldername is your username.  Select this folder.

    > [!TIP]
    > This folder is located on the [storage container](concept-workspace.md#resources) in your workspace rather than on the notebook VM itself.  You can delete the notebook VM and still keep all your work.  When you create a new notebook VM later, it will load  this same folder.

1. Open the `samples-*` subdirectory, then open `tutorials/tutorial-quickstart-train-deploy.ipynb` to run **part two** of the tutorial.

### <a name="server"></a>Use your own local environment

Use these instructions to install and use the SDK from your local computer. Before you install the SDK, we recommend that you create an isolated Python environment. Although this article uses [Miniconda](https://docs.conda.io/en/latest/miniconda.html), you can also use full [Anaconda](https://www.anaconda.com/) installed or [Python virtualenv](https://virtualenv.pypa.io/en/stable/). The following instructions install the packages necessary for this tutorial as well as the rest of the tutorials.

#### Install Miniconda

[Download and install Miniconda](https://docs.conda.io/en/latest/miniconda.html). Select the Python 3.7 version to install. Don't select the Python 2.x version.

#### Create an isolated Python environment

1. Open an Anaconda prompt, then create a new Anaconda environment named *myenv* and install Python 3.6.5. Azure Machine Learning SDK will work with Python 3.5.2 or later, but the automated machine learning components are not fully functional on Python 3.7.  It will take several minutes to create the environment while components and packages are downloaded.

    ```shell
    conda create -n myenv python=3.6.5
    ```

1. Activate the environment.

    ```shell
    conda activate myenv
    ```

1. Enable environment-specific ipython kernels:

    ```shell
    conda install notebook ipykernel
    ```

    Then create the kernel:

    ```shell
    ipython kernel install --user
    ```

#### Install the SDK

1. In the activated conda environment, install the core components of the Machine Learning SDK with Jupyter notebook capabilities. The installation takes a few minutes to finish based on the configuration of your machine.

    ```shell
    pip install --upgrade azureml-sdk[notebooks] scikit-learn
    ```

1. To use this environment for other Azure Machine Learning tutorials, install these packages. Skip this step if you only intend on running this quickstart tutorial series.

    ```shell
    conda install -y cython matplotlib pandas
    ```

    ```shell
    pip install --upgrade azureml-sdk[automl]
    ```

> [!IMPORTANT]
> In some command-line tools, you might need to add quotation marks as follows:
> *  'azureml-sdk[notebooks]'
> * 'azureml-sdk[automl]'

#### Get workspace credentials

The most secure method of attaching your workspace subscription information to the SDK code is to use a JSON file. Use the following steps to get the file, which is necessary for **part two** of this tutorial series.

1. Open your workspace in the [Azure portal](https://portal.azure.com/).
1. On the **Overview** (default) tab, click **Download config.json** at the top of the page.
1. Move this file into the same directory as your Anaconda installation so it will be available for the next notebook.

#### Start notebook server

1. Clone [the GitHub repository](https://aka.ms/aml-notebooks).

    ```CLI
    git clone https://github.com/Azure/MachineLearningNotebooks.git
    ```

1. Run the following command in your activated Anaconda environment *myenv* to start a Jupyter notebook server.

    ```shell
    jupyter notebook
    ```

1. In the Jupyter file tree, navigate to the cloned repository, and open the file `tutorials/tutorial-quickstart-train-deploy.ipynb`.

## Clean up resources

Do not complete this section if you plan on continuing to **part 2** of the tutorial.

### Stop the notebook VM

If you used a cloud notebook server, stop the VM when you are not using it to reduce cost.

1. In your workspace, select **Notebook VMs**.

   ![Stop the VM server](./media/quickstart-run-cloud-notebook/stop-server.png)

1. From the list, select the VM.

1. Select **Stop**.

1. When you're ready to use the server again, select **Start**.

### Delete everything

[!INCLUDE [aml-delete-resource-group](../../../includes/aml-delete-resource-group.md)]

You can also keep the resource group but delete a single workspace. Display the workspace properties and select **Delete**.

## Next steps

In this tutorial, you completed these tasks:

* Created an Azure Machine Learning service workspace.
* Chose a development environment and setup SDK packages.

Continue with **part 2** of this tutorial to train and deploy a simple machine learning model.

> [!div class="nextstepaction"]
> [Tutorial: Train and deploy your first model]()
