---
title: Create a workspace
titleSuffix: Azure Machine Learning service
description: Use the Azure portal, the SDK, a template or the CLI to create your Azure Machine Learning service workspace. This workspace provides a centralized place to work with all the artifacts you create when you use Azure Machine Learning service.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.reviewer: sgilley
ms.author: sgilley
author: sdgilley
ms.date: 05/21/2019

---

# Create an Azure Machine Learning service workspace

To use Azure Machine Learning service, you need an [**Azure Machine Learning service workspace**](concept-workspace.md).  This workspace is the top-level resource for the service and provides you with a centralized place to work with all the artifacts you create. 

In this article, you learn how to create a workspace using any of these methods: 
* The [Azure portal](#portal) interface
* The [Azure Machine Learning SDK for Python](#sdk)
* An Azure Resource Manager template
* The [Azure Machine Learning CLI](#cli)

The workspace you create using the steps here-in can be used as a prerequisite to other tutorials and how-to articles.

If you would like to use a script to setup automated machine learning in a local Python environment please refer to the [Azure/MachineLearningNotebooks GitHub](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/automated-machine-learning) for instructions.  

When you create a workspace the following Azure resources are added automatically (if they're regionally available):
 
- [Azure Container Registry](https://azure.microsoft.com/services/container-registry/): To minimize costs, ACR is **lazy-loaded** until deployment images are created.
- [Azure Storage](https://azure.microsoft.com/services/storage/)
- [Azure Application Insights](https://azure.microsoft.com/services/application-insights/) 
- [Azure Key Vault](https://azure.microsoft.com/services/key-vault/)

>[!Note]
>As with other Azure services, certain limits and quotas are associated with Machine Learning. [Learn about quotas and how to request more.](how-to-manage-quotas.md)


## Prerequisites
To create a workspace, you need an Azure subscription. If you don’t have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning service](https://aka.ms/AMLFree) today.

## <a name="portal"></a> Azure portal

[!INCLUDE [aml-create-portal](../../../includes/aml-create-in-portal.md)]

No matter how it was created, you can view your workspace in the [Azure portal](https://portal.azure.com/).  See [view a workspace](how-to-manage-workspace.md#view) for details.

## <a name="sdk"></a> Python SDK

Create your workspace using the Python SDK. First you need to install the SDK.

> [!IMPORTANT]
> Skip installation of the SDK if you use an Azure Data Science Virtual Machine or Azure Databricks.
> * Azure Data Science Virtual Machines created after September 27, 2018 come with the Python SDK preinstalled. Skip the installation and start with [Create a workspace with the SDK](#sdk-create).
> * In the Azure Databricks environment, use the [Databricks installation steps](how-to-configure-environment.md#azure-databricks) instead.

>[!NOTE]
> Use these instructions to install and use the SDK from your local computer. To use Jupyter on a remote virtual machine, set up a remote desktop or X terminal session.

Before you install the SDK, we recommend that you create an isolated Python environment. Although this article uses [Miniconda](https://docs.conda.io/en/latest/miniconda.html), you can also use full [Anaconda](https://www.anaconda.com/) installed or [Python virtualenv](https://virtualenv.pypa.io/en/stable/).

The instructions in this article will install all the packages you need to run the quickstart and tutorial notebooks.  Other sample notebooks may require installation of additional components.  For more information about these components, see [Install the Azure Machine Learning SDK for Python](https://docs.microsoft.com/python/api/overview/azure/ml/install).

### Install Miniconda

[Download and install Miniconda](https://docs.conda.io/en/latest/miniconda.html). Select the Python 3.7 version to install. Don't select the Python 2.x version.  

### Create an isolated Python environment

1. Open Anaconda Prompt , then create a new conda environment named *myenv* and install Python 3.6.5. Azure Machine Learning SDK will work with Python 3.5.2 or later, but the automated machine learning components are not fully functional on Python 3.7.  It will take several minutes to create the environment while components and packages are downloaded. 

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

### Install the SDK

1. In the activated conda environment, install the core components of the Machine Learning SDK with Jupyter notebook capabilities. The installation takes a few minutes to finish based on the configuration of your machine.

    ```shell
    pip install --upgrade azureml-sdk[notebooks]
    ```

1. To use this environment for the Azure Machine Learning tutorials, install these packages.

    ```shell
    conda install -y cython matplotlib pandas
    ```

1. To use this environment for the Azure Machine Learning tutorials, install the automated machine learning components.

    ```shell
    pip install --upgrade azureml-sdk[automl]
    ```

> [!IMPORTANT]
> In some command-line tools, you might need to add quotation marks as follows:
> *  'azureml-sdk[notebooks]'
> * 'azureml-sdk[automl]'
>

### <a name='sdk-create'></a> Create a workspace with the SDK

Create your workspace in a Jupyter Notebook using the Python SDK.

1. Create and/or cd to the directory you want to use for the quickstart and tutorials.

1. To launch Jupyter Notebook, enter this command:

    ```shell
    jupyter notebook
    ```

1. In the browser window, create a new notebook by using the default `Python 3` kernel. 

1. To display the SDK version, enter and then execute the following Python code in a notebook cell:

   [!code-python[](~/aml-sdk-samples/ignore/doc-qa/quickstart-create-workspace-with-python/quickstart.py?name=import)]

1. Find a value for the `<azure-subscription-id>` parameter in the [subscriptions list in the Azure portal](https://ms.portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade). Use any subscription in which your role is owner or contributor. For more information on roles, see [Manage access to an Azure Machine Learning workspace](how-to-assign-roles.md) article.

   ```python
   from azureml.core import Workspace
   ws = Workspace.create(name='myworkspace',
                         subscription_id='<azure-subscription-id>',	
                         resource_group='myresourcegroup',
                         create_resource_group=True,
                         location='eastus2' 
                        )
   ```

   When you execute the code, you might be prompted to sign into your Azure account. After you sign in, the authentication token is cached locally.

1. To view the workspace details, such as associated storage, container registry, and key vault, enter the following code:

    [!code-python[](~/aml-sdk-samples/ignore/doc-qa/quickstart-create-workspace-with-python/quickstart.py?name=getDetails)]


### Write a configuration file

Save the details of your workspace in a configuration file to the current directory. This file is called *.azureml/config.json*.  

This workspace configuration file makes it easy to load the same workspace later. You can load it with other notebooks and scripts in the same directory or a subdirectory using the code `ws=Workspace.from_config()` . 

[!code-python[](~/aml-sdk-samples/ignore/doc-qa/quickstart-create-workspace-with-python/quickstart.py?name=writeConfig)]

This `write_config()` API call creates the configuration file in the current directory. The *.azureml/config.json* file contains the following:

```json
{
    "subscription_id": "<azure-subscription-id>",
    "resource_group": "myresourcegroup",
    "workspace_name": "myworkspace"
}
```

> [!TIP]
> To use your workspace in Python scripts or Jupyter Notebooks located in other directories, copy this file to that directory. The file can be in the same directory, a subdirectory named *.azureml*, or in a parent directory.

## Resource manager template

To create a workspace with a template, see [Create an Azure Machine Learning service workspace by using a template](how-to-create-workspace-template.md)

<a name="cli"></a>
## Command-line interface

To create a workspace with the CLI, see [Use the CLI extension for Azure Machine Learning service](reference-azure-machine-learning-cli.md).

## Clean up resources 

[!INCLUDE [aml-delete-resource-group](../../../includes/aml-delete-resource-group.md)]

## Next steps

* No matter how it was created, you can view your workspace in the [Azure portal](https://portal.azure.com/).  See [view a workspace](how-to-manage-workspace.md#view) for details.

* Try out your workspace with these quickstarts and tutorials.

    * Quickstart: [Run Jupyter notebook in the cloud](quickstart-run-cloud-notebook.md).
    * Quickstart: [Run Jupyter notebook on your own server](quickstart-run-local-notebook.md).
    * Two-part tutorial: [Train](tutorial-train-models-with-aml.md) and [deploy](tutorial-deploy-models-with-aml.md) an image classification mode.
    * Two-part tutorial: [Prepare data](tutorial-data-prep.md) and [use automated machine learning](tutorial-auto-train-models.md) to build a regression model.

* Learn more about how to [configure a development environment](how-to-configure-environment.md).

* Learn more about the [Azure Machine Learning SDK for Python](https://aka.ms/aml-sdk).
