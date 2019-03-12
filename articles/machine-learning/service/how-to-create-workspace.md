---
title: Create a workspace
titleSuffix: Azure Machine Learning service
description: Learn how to create an Azure Machine Learning service workspace to manage
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual

ms.reviewer: jmartens
ms.author: shipatel
author: shivp950
ms.date: 09/24/2018
ms.custom: seodec18

---

# Create and manage Azure Machine Learning service workspaces

In this article, you'll create, view, and delete [**Azure Machine Learning service workspaces**](concept-azure-machine-learning-architecture.md#workspace).   or [with Python code](https://aka.ms/aml-sdk).

To create a workspace, you need an Azure subscription. If you don’t have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning service](http://aka.ms/AMLFree) today.

## Use the Azure portal

[!INCLUDE [aml-create-portal](../../../includes/aml-create-in-portal.md)]

## Use the SDK

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


1. Save the details of your workspace in a configuration file to the current directory. This file is called *aml_config\config.json*.  

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

# Use a template

To create a workspace with a template, see [Create an Azure Machine Learning service workspace by using a template](how-to-create-workspace-template.md)

## Use the CLI

To create a workspace with the CLI, see [Use the CLI extension for Azure Machine Learning service](reference-azure-machine-learning-cli.md).

## Clean up resources 

[!INCLUDE [aml-delete-resource-group](../../../includes/aml-delete-resource-group.md)]

## Next steps

* See how your code connects to and uses a workspace in these quickstarts:
    * Run a [Jupyter notebook in the cloud](quickstart-get-started.md)
    * Run a [Jupyter notebook on your own server](quickstart-create-workspace-with-python.md)

* Follow the [full-length tutorial](tutorial-train-models-with-aml.md) to learn how to use a workspace to build, train, and deploy models with Azure Machine Learning service.

