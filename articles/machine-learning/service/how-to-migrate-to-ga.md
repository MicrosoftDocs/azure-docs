---
title: Migrate to Azure Machine Learning, general availability
description: Learn how to upgrade or migrate to the generally available version of Azure Machine Learning Services.
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: conceptual
ms.author: haining
author: haining
ms.date: 07/27/2018
---

# How to migrate to the generally available version of Azure Machine Learning Services 

In this article, you'll learn which assets and artifacts you can migrate and how to get them working in the generally available version of Azure Machine Learning Services. This article is for pre-GA users who have the Workbench application installed on their machines. For more information, see the article "[What happened to Workbench?](overview-what-happened-to-workbench.md)"

Generally speaking, most of the artifacts created in the pre-GA version of Azure Machine Learning Services are stored in your own local or cloud storage. So the migration path largely involves re-registering them with the new Azure Machine Learning offering. 

### Azure resources

Resources such as the pre-GA Azure Machine Learning experimentation accounts, Azure Machine Learning model management accounts, and machine learning compute environment are not supported in the generally available version of Azure Machine Learning Services. You can get started with the GA version by creating an Azure Machine Learning Workspace [in Python](quickstart-set-up-in-python.md), using [the CLI](quickstart-set-up-in-cli.md), or in the [Azure portal](how-to-create-workspace-in-portal.md). This workspace enables you to use all features of the generally available features of Azure Machine Learning Services. 

### Azure ML projects
Azure ML projects are now local folders with files. For any existing Azure ML project from the preview offering, once you create the new Azure ML Workspace in GA offering, you can attach the project folder to the new Workspace with a run history name of your choice. 

* From CLI:
    ```shell
    $ az ml project attach -w <my_workspace> -p <proj_folder_path> --history <run_history_name>
    ```

* From Python SDK:
    ```python
    from azureml.core import Workspace, Project
    
    ws = Workspace.from_config()
    proj = Project.attach(workspace_object=ws, run_history='my history', directory='c:\projects\mnist')
    ```

### Deployed web services
In preview offering, two deployment targets are supported: local Docker environment, and Azure Container Service (ACS). In the GA offering, two different deployment targets are supported: Azure Container Instance (ACI) and Azure Kubernetes Cluster (AKS). 

To take advantage of the new deployment targets in ACI and AKS, you can use the new SDK/CLI to redeploy your services withe one of these two targets. Your original scoring file, model file dependencies files, environment file, and schema files can all remain unchanged. 

Your old deployment in a local Docker environment and/or ACS will continue to function. However, you will lose the ability to manage them through the old `az ml service` commands after the support of the preview CLI commands are terminated.

### Run history records
The run history records from the preview offering cannot be migrated into the GA offering unfortunately. However you can export all run history records using the preview offering CLI:

```sh
# list all runs
$ az ml history list list

# get details about a particular run
$ az ml history info

# download all artifacts of a run
$ az ml history download
```

### Data Prep files
TBD ...



## Next steps

For a quickstart showing you how to create a project, run a script, and explore the run history of the script with the generally available version of Azure Machine Learning Services, try:
+ [Create a project with Azure Machine Learning Services SDK for Python](quickstart-set-up-in-python.md)
+ [Create a project with Azure Machine Learning Services CLI](quickstart-set-up-in-cli.md)

For a more in-depth experience of this workflow, follow the full-length tutorial that contains detailed steps for building, training, and deploying models with Azure Machine Learning Services. 

> [!div class="nextstepaction"]
> [Tutorial: Build, train, and deploy](tutorial-build-train-deploy-with-azure-machine-learning.md)