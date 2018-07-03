---
title: Get started with Azure Machine Learning Services | Microsoft Docs
description: In this Quickstart, you will learn how to create a workspace and a project to get started with Azure Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: quickstart
ms.reviewer: sgilley
author: rastala
ms.author: roastala
ms.date: 07/27/2018
---

# Quickstart: Get started with Azure Machine Learning Services

In this quickstart, you'll use the Azure portal to get started with [Azure Machine Learning Services](overview-what-is-azure-ml.md).

You'll learn how to:

1. Create a workspace, which is the top-level resource for this service. This workspace is used by one or more users to store their compute resources, models, deployments, and run histories.
1. Attach a project containing your machine learning scripts to your workspace.   A project is a local folder that contains the scripts needed to solve your machine learning problem.  
1. Run a Python script in your project to show a few metrics.
1. View the run history.

> [!NOTE]
> For your convenience, the following Azure resources are added automatically to your workspace when regionally available:  [container registry](https://azure.microsoft.com/en-us/services/container-registry/), [storage](https://azure.microsoft.com/en-us/services/storage/), [application insights](https://azure.microsoft.com/en-us/services/application-insights/), and [key vault](https://azure.microsoft.com/en-us/services/key-vault/).

The resources you create can be used as prerequisites to other Azure Machine Learning tutorials and how-to articles.

## Prerequisites

Make sure you have the following prerequisites before starting the quickstart steps:

+ An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
+ [Python 3.5 or higher](https://www.python.org/) installed.
+ A package manager installed, such as [Continuum Anaconda](https://anaconda.org/anaconda/continuum-docs) or [Miniconda](https://conda.io/miniconda.html).

## Create a workspace 

[!INCLUDE [aml-create-portal](../../../includes/aml-create-in-portal.md)]

## Install the SDK

[!INCLUDE [aml-install-sdk](../../../includes/aml-install-sdk.md)]

## Configure a project

In a command-line window, create a folder and subfolder on your local machine for your Azure Machine Learning project.

   ```sh
   mkdir myproject
   cd myproject
   mkdir aml_config
   ```

Create a configuration file for the project. Create a file called config.json in the aml_config folder.  Copy the following code into that file, using the code you see in the portal.  It will look like:

```json
{
"subscription_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
"resource_group": "Group",
"workspace_name": "MyWorkspace"
}
```

## Create a Python script

[!INCLUDE [aml-create-script-pi](../../../includes/aml-create-script-pi.md)]

## Attach the project and run the script

Attach the project to your workspace and run the script with this Python code:

```python
from azureml.core import Workspace, Project, Run

ws = Workspace.from_config()

proj = Project.attach(workspace_object = ws,
    history_name = "myhistory",
    directory = ".")

run = Run.submit(project_object = proj,
                    run_config = "local",
                    script_to_run = "pi.py")
```

## View history

In the portal, navigate to the **History** section for your workspace.

   ![navigate to history](./media/quickstart-get-started/history.png)

Click on the myhistory link and find your run results.

   ![view history](./media/quickstart-get-started/web-results.png)

## Clean up resources 

[!INCLUDE [aml-delete-resource-group](../../../includes/aml-delete-resource-group.md)]

You can also keep the resource group, but delete a single workspace by displaying the workspace properties and selecting the Delete button.

## Next steps
You have now created the necessary resources to start experimenting and deploying models. You also created a project, ran a script, and explored the run history of that script.

For an in-depth workflow experience, follow the Azure Machine Learning tutorial on building, training, and deploying a model.

> [!div class="nextstepaction"]
> [Tutorial: Build, train, and deploy](tutorial-build-train-deploy-with-azure-machine-learning.md)