---
title: "Quickstart: Use the Python SDK to create a machine learning workspace - Azure Machine Learning"
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

# Quickstart: Use Python to get started with Azure Machine Learning

In this quickstart, you'll use the Azure Machine Learning SDK for Python to create and then use a Machine Learning service [workspace](concept-azure-machine-learning-architecture.md). This workspace is the foundational block for experimenting, training, and deploying machine learning models in the cloud with the Azure Machine Learning service.

In this tutorial, you will install the Python SDK and:
* Create a workspace in your Azure subscription
* Create a configuration file for that workspace to use later in other notebooks and scripts
* Write code that logs values inside the workspace
* View the logged values in your workspace

The workspace and its configuration file you create in this quickstart can be used as prerequisites to other Azure Machine Learning tutorials and how-to articles. As with other Azure services, there are limits and quotas associated with the Azure Machine Learning service. [Learn about quotas and how to request more.](how-to-manage-quotas.md)

For your convenience, the following Azure resources are added automatically to your workspace when regionally available:  [container registry](https://azure.microsoft.com/services/container-registry/), [storage](https://azure.microsoft.com/services/storage/), [application insights](https://azure.microsoft.com/services/application-insights/), and [key vault](https://azure.microsoft.com/services/key-vault/).

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.


##  Install the SDK

**Skip this section if you are using** a Data Science Virtual Machine (DSVM) created after September 27, 2018 since those DSVMs comes with the Python SDK pre-installed.

Before installing the SDK, we recommend you create an isolated Python environment first. While this quickstart uses [Miniconda](https://conda.io/docs/user-guide/install/index.html), you can also use full [Anaconda](https://www.anaconda.com/) installed or [Python virtualenv](https://virtualenv.pypa.io/en/stable/).

### Install Miniconda


[Download](https://conda.io/miniconda.html) and install Miniconda. Choose the Python 3.7 version or later. Do not choose Python 2.x version.

### Create an isolated Python environment 

Launch a command-line window and create a new conda environment named `myenv` with Python 3.6.

```sh
conda create -n myenv -y Python=3.6
```
### Activate the environment

Activate the environment using the steps for your operating system
* On Windows
  ```sh
  conda activate myenv
  ```

* On Linux or macOS
  ```sh
  source activate myenv
  ```

### Install the SDK

In the activated conda environment, install the SDK. This code installs the core components of the Azure Machine Learning SDK as well as a Jupyter Notebook server in the `myenv` conda environment.

```sh
pip install azureml-sdk[notebooks]
```

## Create a workspace

Launch Jupyter Notebook by typing this command.
```sh
jupyter notebook
```

In the browser window, create a new notebook using the default `Python 3` kernel. 

Display the SDK version by typing the following Python code in a notebook cell and execute it.

```python
import azureml.core
print(azureml.core.VERSION)
```

Create a new Azure resource group and a new workspace.

Find a value for `<azure-subscription-id>` in the [subscriptions list in the Azure portal](https://ms.portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade). Use any subscription in which your role is owner or contributor.

```
ws = Workspace.create(name='myworkspace',
                      subscription_id='<azure-subscription-id>'
                      resource_group='myresourcegroup',
                      create_resource_group=True,
                      location='eastus2' # or other supported Azure region
                     )
```

Executing the above code may trigger a new browser window for you to sign into your Azure account. Once you sign in, the authentication token will be cached locally.

To see the details of the workspace, including the associated storage, container registry, and key vault, type:

```python
ws.get_details()
```

## Write a configuration file

Save the details of your workspace in a configuration file.  

```python
# write the configuration file
ws.write_config()

# in other code in this directory or its sub-directories, you can load this workspace with
# ws = Workspace.from_config()
```

This `write_config()` API call creates the `aml_config\config.json` file in the current directory. The `config.json` file looks like this:

```json
{
    "subscription_id": "<azure-subscription-id>",
    "resource_group": "<resource-group-name>",
    "workspace_name": "<workspace-name>"
}
This workspace configuration file makes it easy to share the workspace later with other notebooks and scripts in the same directory or below.  Use `ws = Workspace.from_config()`  to read the configuration file and load the workspace.
```

## Use the workspace

Write some simple code that uses the basic APIs of the SDK to track experiment runs.

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

## View logged results
Now view the experiment run in the Azure portal by printing out its URL, then go to it.

```python
print(run.get_portal_url())
```

Click on the link to view the logged values.

![logged values in portal](./media/quickstart-create-workspace-with-python/logged-values.png)

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
