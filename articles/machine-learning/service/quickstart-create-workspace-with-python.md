---
title: 'Quickstart: Get started in Python'
titleSuffix: Azure Machine Learning service
description: Get started with Azure Machine Learning service in Python. Use the Python SDK to create a workspace, which is the foundational block in the cloud that you use to experiment, train, and deploy machine learning models.  
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: quickstart
ms.reviewer: sgilley
author: hning86
ms.author: haining
ms.date: 01/22/2019
ms.custom: seodec18

---

# Quickstart: Use the Python SDK to get started with Azure Machine Learning

In this article, you use the Azure Machine Learning SDK for Python 3 to create and then use an Azure Machine Learning service [workspace](concept-azure-machine-learning-architecture.md). The workspace is the foundational block in the cloud that you use to experiment, train, and deploy machine learning models with Machine Learning.

You begin by configuring your own Python environment and Jupyter Notebook Server. To run it with no installation, see [Quickstart: Use the Azure portal to get started with Azure Machine Learning](quickstart-get-started.md). 

View a video version of this quickstart:

> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE2G9N6]

In this quickstart, you:

* Install the Python SDK.
* Create a workspace in your Azure subscription.
* Create a configuration file for that workspace to use later in other notebooks and scripts.
* Write code that logs values inside the workspace.
* View the logged values in your workspace.

You create a workspace and a configuration file to use as prerequisites to other Machine Learning tutorials and how-to articles. As with other Azure services, certain limits and quotas are associated with Machine Learning. [Learn about quotas and how to request more.](how-to-manage-quotas.md)

The following Azure resources are added automatically to your workspace when they're regionally available:
 
- [Azure Container Registry](https://azure.microsoft.com/services/container-registry/)
- [Azure Storage](https://azure.microsoft.com/services/storage/)
- [Azure Application Insights](https://azure.microsoft.com/services/application-insights/) 
- [Azure Key Vault](https://azure.microsoft.com/services/key-vault/)

>[!NOTE]
> Code in this article requires  Azure Machine Learning SDK version 1.0.2 or later and was tested with version 1.0.8.


If you don’t have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning service](http://aka.ms/AMLFree) today.

## Install the SDK

> [!IMPORTANT]
> Skip this section if you use an Azure Data Science Virtual Machine or Azure Databricks.
> * Azure Data Science Virtual Machines created after September 27, 2018 come with the Python SDK preinstalled.
> * In the Azure Databricks environment, use the [Databricks installation steps](how-to-configure-environment.md#azure-databricks) instead.

Before you install the SDK, we recommend that you create an isolated Python environment. Although this article uses [Miniconda](https://docs.conda.io/en/latest/miniconda.html), you can also use full [Anaconda](https://www.anaconda.com/) installed or [Python virtualenv](https://virtualenv.pypa.io/en/stable/).

### Install Miniconda

[Download and install Miniconda](https://docs.conda.io/en/latest/miniconda.html). Select the Python 3.7  or later version to install. Don't select the Python 2.x version.  

### Create an isolated Python environment

1. Open a command-line window, then create a new conda environment named *myenv* and install Python 3.6. Azure Machine Learning SDK will work with Python 3.5.2 or later, but the automated machine learning components are not fully functional on Python 3.7.

    ```shell
    conda create -n myenv -y Python=3.6
    ```

1. Activate the environment.

    ```shell
    conda activate myenv
    ```

### Install the SDK

1. In the activated conda environment, install the core components of the Machine Learning SDK with Jupyter notebook capabilities.  The installation takes a few minutes to finish based on the configuration of your machine.

  ```shell
    pip install --upgrade azureml-sdk[notebooks]
    ```

1. Install a Jupyter Notebook server in the conda environment.

  ```shell
    conda install -y nb_conda
    ```

1. To use this environment for the Azure Machine Learning tutorials, install these packages.

    ```shell
    conda install -y cython matplotlib pandas
    ```

1. To use this environment for the Azure Machine Learning tutorials, install the automated machine learning components.

    ```shell
    pip install --upgrade azureml-sdk[automl]
    ```

## Create a workspace

Create your workspace in a Jupyter Notebook using the Python SDK.

1. Create and/or cd to the directory you want to use for the quickstart and tutorials.

1. To launch Jupyter Notebook, enter this command:

    ```shell
    jupyter notebook
    ```

1. In the browser window, create a new notebook by using the default `Python 3` kernel. 

1. To display the SDK version, enter and then execute the following Python code in a notebook cell:

   [!code-python[](~/aml-sdk-samples/ignore/doc-qa/quickstart-create-workspace-with-python/quickstart.py?name=import)]

1. Find a value for the `<azure-subscription-id>` parameter in the [subscriptions list in the Azure portal](https://ms.portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade). Use any subscription in which your role is owner or contributor.

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


## Write a configuration file

Save the details of your workspace in a configuration file to the current directory. This file is called *aml_config\config.json*.  

This workspace configuration file makes it easy to load the same workspace later. You can load it with other notebooks and scripts in the same directory or a subdirectory.  

[!code-python[](~/aml-sdk-samples/ignore/doc-qa/quickstart-create-workspace-with-python/quickstart.py?name=writeConfig)]

This `write_config()` API call creates the configuration file in the current directory. The *config.json* file contains the following:

```json
{
    "subscription_id": "<azure-subscription-id>",
    "resource_group": "myresourcegroup",
    "workspace_name": "myworkspace"
}
```

## Use the workspace

Run some code that uses the basic APIs of the SDK to track experiment runs:

1. Create an experiment in the workspace.
1. Log a single value into the experiment.
1. Log a list of values into the experiment.

[!code-python[](~/aml-sdk-samples/ignore/doc-qa/quickstart-create-workspace-with-python/quickstart.py?name=useWs)]

## View logged results
When the run finishes, you can view the experiment run in the Azure portal. To print a URL that navigates to the results for the last run, use the following code:

```python
print(run.get_portal_url())
```

Use the link to view the logged values in the Azure portal in your browser.

![Logged values in the Azure portal](./media/quickstart-create-workspace-with-python/logged-values.png)

## Clean up resources 
>[!IMPORTANT]
>You can use the resources you've created here as prerequisites to other Machine Learning tutorials and how-to articles.

If you don't plan to use the resources that you created in this article, delete them to avoid incurring any charges.

[!code-python[](~/aml-sdk-samples/ignore/doc-qa/quickstart-create-workspace-with-python/quickstart.py?name=delete)]

## Next steps

In this article, you created the resources you need to experiment with and deploy models. You ran code in a notebook, and you explored the run history for the code in your workspace in the cloud.

> [!div class="nextstepaction"]
> [Tutorial: Train an image classification model](tutorial-train-models-with-aml.md)

You can also explore [more advanced examples on GitHub](https://aka.ms/aml-notebooks).
