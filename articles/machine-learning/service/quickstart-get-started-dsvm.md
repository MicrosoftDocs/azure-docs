---
title: "Quickstart: Use an Azure Data Science Virtual Machine to run Azure Machine Learning in Python with no installation"
description: Get started with Azure Machine Learning in an Azure Data Science Virtual Machine. Install the Python SDK and use it to create a workspace. This workspace is the foundational block in the cloud that you use to experiment, train, and deploy machine learning models with Azure Machine Learning.  
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: quickstart
ms.reviewer: trbye
author: trbye
ms.author: trbye
ms.date: 10/31/2018
---

# Quickstart: Use Azure Data Science Virtual Machine (DSVM) to get started with Azure Machine learning in Python with no installation

In this quickstart, you use an Azure Data Science Virtual Machine to run the Azure Machine Learning SDK for Python to create and then use a Machine Learning service [workspace](concept-azure-machine-learning-architecture.md) with no installation. This workspace is the foundational block in the cloud that you use to experiment, train, and deploy machine learning models with Machine Learning. In this quickstart, you start by launching a Python environment and starting a Jupyter notebook server.

In this quickstart, you use the Python SDK and:

* Create a workspace in your Azure subscription.
* Create a configuration file for that workspace to use later in other notebooks and scripts.
* Write code that logs values inside the workspace.
* View the logged values in your workspace.

You also create a workspace and a configuration file, and you can use these as prerequisites to other Machine Learning tutorials and how-to articles. As with other Azure services, there are limits and quotas associated with Machine Learning. [Learn about quotas and how to request more.](how-to-manage-quotas.md)

The following Azure resources are added automatically to your workspace when they're regionally available:
 
- [Azure Container Registry](https://azure.microsoft.com/services/container-registry/)
- [Azure Storage](https://azure.microsoft.com/services/storage/)
- [Azure Application Insights](https://azure.microsoft.com/services/application-insights/) 
- [Azure Key Vault](https://azure.microsoft.com/services/key-vault/)

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Start an Azure Data Science Virtual Machine and Python Environment

This quickstart assumes you already have a remote connection established to an Azure Data Science Virtual Machine. If you haven't already provisioned one, see [Create a Windows Data Science VM](https://docs.microsoft.com/en-us/azure/machine-learning/data-science-virtual-machine/provision-vm). This quickstart is based on a Windows DSVM, but the steps will be similar for other VM types.

This quickstart uses a pre-configured [Anaconda (3.6.x)](https://www.anaconda.com/) environment along with Jupyter. Alternatively, you can set up your own custom environments using [Miniconda](https://conda.io/docs/user-guide/install/index.html) or [Python virtualenv](https://virtualenv.pypa.io/en/stable/).

### Launch Python Environment and Jupyter Notebook server

Inside your Azure DSVM, open a command-line window and launch a Jupyter Notebook server.

```sh
jupyter notebook
```

Within the Jupyter Notebook server, click the `new` dropdown menu, and select `Python [conda env:AzureML]`. This will create a new Jupyter Notebook with the Python Azure Machine Learning SDK package already installed. At this point, you are able to immediately import the Azure ML SDK.

```python
import azureml.core
print(azureml.core.VERSION)
```

To verify your Python environment version within the Jupyter Notebook, run the following code.

```python
import sys
print(sys.version)
```

## Create a workspace

Now that you are running a Python environment within your DSVM, you are ready to create an Azure workspace. Continue following the steps in [Quickstart: Use Python to get started with Azure Machine Learning](quickstart-create-workspace-with-python.md#create-a-workspace), as the remaining code is identical.
