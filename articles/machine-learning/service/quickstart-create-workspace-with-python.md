---
title: "Quickstart: Create an Azure Machine Learning workspace - Python SDK"
description: Get started with Azure Machine Learning.  Install the Python SDK and use it to create a workspace. This workspace is the foundational block in the cloud for experimenting, training, and deploying machine learning models with Azure Machine Learning service.  
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: quickstart
ms.reviewer: sgilley
author: hning86
ms.author: haining
ms.date: 09/24/2018
---

# Quickstart: Get started with Azure Machine Learning using Python SDK

In this quickstart, you'll use the Azure Machine Learning Python SDK to create and then use a workspace. This workspace is the foundational block in the cloud for experimenting, training, and deploying machine learning models with Azure Machine Learning service.

In this tutorial, you will:

* Install the Python SDK and use it to create a workspace in your Azure subscription
* Learn how to save a configuration file to use for other notebooks and scripts in the same directory
* Write some code that logs values inside the workspace
* View the logged values in your workspace

For your convenience, the following Azure resources are added automatically to your workspace when regionally available:  [container registry](https://azure.microsoft.com/services/container-registry/), [storage](https://azure.microsoft.com/services/storage/), [application insights](https://azure.microsoft.com/services/application-insights/), and [key vault](https://azure.microsoft.com/services/key-vault/).

The resources you create can be used as prerequisites to other Azure Machine Learning tutorials and how-to articles. As with other Azure services, there are limits on certain resources (for eg. BatchAI cluster size) associated with the Azure Machine Learning service. Read [this](how-to-manage-quotas.md) article on the default limits and how to request more quota.

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.


##  Install Miniconda

Before installing the SDK, it is recommended to create an isolated Python environment first. This quickstart shows using [Miniconda](https://conda.io/docs/user-guide/install/index.html). If you have full [Anaconda](https://www.anaconda.com/) installed, that works too. You can also choose to use [Python virtualenv](https://virtualenv.pypa.io/en/stable/).

Download and install Miniconda from [this website](https://conda.io/miniconda.html). Make sure to choose the Python 3.7 version or later. Do not choose Python 2.x version.

## Install the Python SDK

Once Miniconda is installed, launch command-line window, and type the following command to create a new conda environment named `myennv` with Python 3.6.

```sh
conda create -n myenv -y Python=3.6
```

Now activate the environment.
* If you are on Windows
    ```sh
    # if you are on Windows
    conda activate myenv
    ```
* If you are on Linux or macOS
    ```sh
    # if you are on Linux or macOS
    source activate myenv
    ```

In the activated conda environment, install  the SDK. This code installs the core components of the Azure Machine Learning SDK as well as a Jupyter Notebook server in the `myenv` conda environment.

```sh
pip install azureml-sdk[notebooks]
```

## Create a workspace

Launch Jupyter Notebook by typing this command.
```sh
jupyter notebook
```

In the browser window, create a new notebook using the default `Python 3` kernel. 

First, display the SDK version by typing the following Python code in a notebook cell and execute it.

```python
import azureml.core
print(azureml.core.VERSION)
```

Create a new Azure resource group and a new workspace. Find your subscription ID in the [subscriptions list in the Azure portal](). Use any subscription in which you are an owner or contributor.

```
ws = Workspace.create(name='myworkspace',
                      subscription_id='<azure-subscription-id>'
                      resource_group='myresourcegroup',
                      resource_group_create=True,
                      location='eastus2' # or other supported Azure region
                     )
```

Executing the above code might trigger an interactive window in the browser to sign into your Azure account. You only need to do this once, the authentication token will be cached locally.

To see the details of the workspace, including the associated Azure Blob Storage Account, Azure Container Registry, and Azure KeyVault, type:

```python
ws.get_details()
```

## Write a configuration file

Persist the workspace configuration in a local file:

```python
ws.write_config()
```

This `write_config()` API call creates a `config.json` file under an `aml_config` folder in the current directory. The `config.json` file looks like this:

```json
{
    "subscription_id": "<azure-subscription-id>",
    "resource_group": "<resource-group-name>",
    "workspace_name": "<workspace-name>"
}
```

## Why write a configuration file?

Once you create the `config.json` file, all other scripts and notebooks in that directory and below can read from it with the `from_config()` API.  This makes it easy to use the same workspace with scripts and notebooks in a directory.

```python
ws = Workspace.from_config()
```

## Track run metrics

Let's now write some simple code to show you how to use the basic APIs of the SDK to track experiment runs.

```python
from azureml.core import Experiment

# create a new experiemnt
exp = Experiment(workspace=ws, name='myexp')

# start a run
run = exp.start_logging()

# log a number
run.log('my magic number', 42)

# log a list (Fibonacci numbers)
run.log_list('my list', [1, 1, 2, 3, 5, 8, 13, 21, 34, 55]) 

# finish the run
run.complete()
```

## View the run details
Now view the experiment run in the Azure portal by printing out its URL, then go to it.

```python
print(run.get_portal_url())
```

## Clean up resources 
>[!IMPORTANT]
>The resources you created can be used as prerequisites to other Azure Machine Learning tutorials and how-to articles.

If you're not going to use what you've created here, delete the resources you just created with this quickstart so you don't incur any charges.

```python
ws.delete(delete_dependent_resources=True)
```

## Next steps

You have now created the necessary resources to start experimenting and deploying models. You also ran code in a notebook, and explored the run history from that code in your workspace in the cloud.

For an in-depth workflow experience, follow the Azure Machine Learning tutorials to train and deploy a model.  

> [!div class="nextstepaction"]
> [Tutorial: Train an image classification model](tutorial-train-models-with-aml.md)