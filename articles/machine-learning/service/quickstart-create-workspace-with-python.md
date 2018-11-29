---
title: "Quickstart: Use the Python SDK to create a machine learning service workspace - Azure Machine Learning"
description: Get started with Azure Machine Learning. Install the Python SDK and use it to create a workspace. This workspace is the foundational block in the cloud that you use to experiment, train, and deploy machine learning models with Azure Machine Learning.  
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: quickstart
ms.reviewer: sgilley
author: hning86
ms.author: haining
ms.date: 12/04/2018
---

# Quickstart: Use Python to get started with Azure Machine Learning

In this quickstart, you use the Azure Machine Learning SDK for Python to create and then use a Machine Learning service [workspace](concept-azure-machine-learning-architecture.md). This workspace is the foundational block in the cloud that you use to experiment, train, and deploy machine learning models with Machine Learning. In this quickstart, you start by configuring your own Python environment and Jupyter notebook server. To run with no installation, see [Quickstart: Use the Azure portal to get started with Azure Machine Learning](quickstart-get-started.md).

> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE2G9N6]

In this tutorial, you install the Python SDK and:

* Create a workspace in your Azure subscription.
* Create a configuration file for that workspace to use later in other notebooks and scripts.
* Write code that logs values inside the workspace.
* View the logged values in your workspace.

In this quickstart, you create a workspace and a configuration file. You can use them as prerequisites to other Machine Learning tutorials and how-to articles. As with other Azure services, there are limits and quotas associated with Machine Learning. [Learn about quotas and how to request more.](how-to-manage-quotas.md)

The following Azure resources are added automatically to your workspace when they're regionally available:
 
- [Azure Container Registry](https://azure.microsoft.com/services/container-registry/)
- [Azure Storage](https://azure.microsoft.com/services/storage/)
- [Azure Application Insights](https://azure.microsoft.com/services/application-insights/) 
- [Azure Key Vault](https://azure.microsoft.com/services/key-vault/)
>[!NOTE]
> Code in this article was tested with Azure Machine Learning SDK version 0.1.74 


If you don’t have an Azure subscription, create a [free account](https://aka.ms/AMLfree) before you begin.


## Install the SDK

*Skip this section if you use a data science virtual machine created after September 27, 2018.* Those data science virtual machines come with the Python SDK preinstalled.

Before you install the SDK, we recommend that you create an isolated Python environment. While this quickstart uses [Miniconda](https://conda.io/docs/user-guide/install/index.html), you also can use full [Anaconda](https://www.anaconda.com/) installed or [Python virtualenv](https://virtualenv.pypa.io/en/stable/).

### Install Miniconda


[Download](https://conda.io/miniconda.html) and install Miniconda. Select the Python 3.7 version or later. Don't select the Python 2.x version.

### Create an isolated Python environment 

Open a command-line window. Then create a new conda environment named `myenv` with Python 3.6.

```shell
conda create -n myenv -y Python=3.6
```

Activate the environment.

  ```shell
  conda activate myenv
  ```

### Install the SDK

In the activated conda environment, install the SDK. This code installs the core components of the Machine Learning SDK. It also installs a Jupyter Notebook server in the conda environment. The installation takes a few minutes to finish, depending on the configuration of your machine.

```sh
# install Jupyter
conda install nb_conda

# install the base SDK and Jupyter Notebook
pip install azureml-sdk[notebooks]

```

You can also use different "extra" keywords to install additional components of the SDK.

```sh
# install the base SDK and auto ml components
pip install azureml-sdk[automl]

# install the base SDK and model explainability component
pip install azureml-sdk[explain]

# install the base SDK and experimental components
pip install azureml-sdk[contrib]
```

Use this install instead in a Databricks environment.

```
# install the base SDK and automl components in Azure Databricks environment
# read more at: https://github.com/Azure/MachineLearningNotebooks/tree/master/databricks
pip install azureml-sdk[databricks]
```


## Create a workspace

To launch the Jupyter Notebook, enter this command.
```shell
jupyter notebook
```

In the browser window, create a new notebook by using the default `Python 3` kernel. 

To display the SDK version, enter the following Python code in a notebook cell and execute it.

[!code-python[](~/aml-sdk-samples/ignore/doc-qa/quickstart-create-workspace-with-python/quickstart.py?name=import)]

Create a new Azure resource group and a new workspace.

Find a value for `<azure-subscription-id>` in the [subscriptions list in the Azure portal](https://ms.portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade). Use any subscription in which your role is owner or contributor.

```python
from azureml.core import Workspace
ws = Workspace.create(name='myworkspace',
                      subscription_id='<azure-subscription-id>',	
                      resource_group='myresourcegroup',
                      create_resource_group=True,
                      location='eastus2' # or other supported Azure region	
                     )
```

Executing the preceding code might trigger a new browser window for you to sign into your Azure account. After you sign in, the authentication token is cached locally.

To see the workspace details, such as associated storage, container registry, and key vault, enter the following code.

[!code-python[](~/aml-sdk-samples/ignore/doc-qa/quickstart-create-workspace-with-python/quickstart.py?name=getDetails)]


## Write a configuration file

Save the details of your workspace in a configuration file into the current directory. This file is called 'aml_config\config.json'.  

This workspace configuration file makes it easy to load this same workspace later. You can load it with other notebooks and scripts in the same directory or a subdirectory. 

[!code-python[](~/aml-sdk-samples/ignore/doc-qa/quickstart-create-workspace-with-python/quickstart.py?name=writeConfig)]


The `write_config()` API call creates the configuration file in the current directory. The `config.json` file contains the following script.

```json
{
    "subscription_id": "<azure-subscription-id>",
    "resource_group": "myresourcegroup",
    "workspace_name": "myworkspace"
}
```

## Use the workspace

Write some code that uses the basic APIs of the SDK to track experiment runs.

[!code-python[](~/aml-sdk-samples/ignore/doc-qa/quickstart-create-workspace-with-python/quickstart.py?name=useWs)]


## View logged results
When the run finishes, you can view the experiment run in the Azure portal. Use the following code to print a URL to the results for the last run.

```python
print(run.get_portal_url())
```

Use the link to view the logged values in the Azure portal in your browser.

![Logged values in portal](./media/quickstart-create-workspace-with-python/logged-values.png)

## Clean up resources 
>[!IMPORTANT]
>The resources you created can be used as prerequisites to other Machine Learning tutorials and how-to articles.

If you don't plan to use the resources you created here, delete them so you don't incur any charges.

[!code-python[](~/aml-sdk-samples/ignore/doc-qa/quickstart-create-workspace-with-python/quickstart.py?name=delete)]


## Next steps

You created the necessary resources you need to experiment with and deploy models. You also ran code in a notebook. And you explored the run history from that code in your workspace in the cloud.

You need a few more packages in your environment to use it with Machine Learning tutorials.

1. In your browser, close your notebook.
1. In the command-line window, use `Ctrl`+`C` to stop the notebook server.
1. Install additional packages.

    ```shell
    conda install -y cython matplotlib scikit-learn pandas numpy
    pip install azureml-sdk[automl]
    ```


After you install these packages, follow the tutorials to train and deploy a model. 

> [!div class="nextstepaction"]
> [Tutorial: Train an image classification model](tutorial-train-models-with-aml.md)

You also can explore [more advanced examples on GitHub](https://aka.ms/aml-notebooks).
