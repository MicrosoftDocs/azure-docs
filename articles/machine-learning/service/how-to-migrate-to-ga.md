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

# How to migrate to the latest version of Azure Machine Learning Services 

In this article, you'll learn which assets and artifacts you can migrate and how to get them working in the generally available version of Azure Machine Learning Services. This article is for pre-GA users who have the Workbench application installed on their machines and/or experimentation and model management accounts. For more information, see the article "[What happened to Workbench?](overview-what-happened-to-workbench.md)"

Generally speaking, most of the artifacts created in the pre-GA version of Azure Machine Learning Services are stored in your own local or cloud storage. So the migration path largely involves re-registering them with the new Azure Machine Learning offering. 

At a glance, you can continue to use the following assets:
+ Your Azure subscription and resource group
+ Your scoring files
+ Your model file dependencies, environment, and schema files
+ Deployed web services

## Azure resources

Resources such as the pre-GA Azure Machine Learning experimentation accounts, Azure Machine Learning model management accounts, and machine learning compute environments do not work with in the generally available version of Azure Machine Learning Services and cannot be migrated. 

You can get started with the GA version by creating an Azure Machine Learning Workspace in the [Azure portal](quickstart-get-started.md) or using [the CLI](quickstart-get-started-with-cli.md). This workspace enables you to use all features of the generally available features of Azure Machine Learning Services. Learn more about [the new architecture](concept-azure-machine-learning-architecture.md).

## Projects

Instead of having your projects in a workspace in the cloud, projects are now directories on your local machine in the latest release.

To migrate your projects, attach the local directory containing your scripts to your newly created Azure Machine Learning Workspace. When you attach that project to the workspace, you can also start a run history file in the workspace for that project by specifying a name for that history.  

+ **CLI users**, attach your existing local project directory to the workspace with the new CLI: 
  ```shell
  az ml project attach -w <my_workspace_name> -p <proj_dir_path> --history <run_history_name>
  ```

+ **SDK users**, attach your existing local project directory to the workspace with the new SDK: 
  ```python
  from azureml.core import Workspace, Project
    
  ws = Workspace.from_config()
  proj = Project.attach(workspace_object=ws, run_history='<run_history_name>', directory='<proj_dir_path>')
  ```

Replace the information in \<\>  brackets with the name of your workspace, file path to your local project directory, and the name for run history.

Follow the longer [CLI quickstart](quickstart-get-started-with-cli.md) and [SDK quickstart](quickstart-get-started.md) to learn how to create a workspace and attach a project.


## Deployed web services

The web services you deployed with your Model Management account will continue to work for as long as Azure Container Service (ACS) is still supported.  However, when support for the previous CLI ends, you won't be able to manage those web services anymore. 

In the newer version of Azure Machine Learning Services, models are deployed as web services to Azure Container Instances (ACI) or Azure Kubernetes Service (AKS) clusters. 

To migrate your web services, redeploy your models using the new SDK or CLI to the new targets, ACI, or AKS. There is no need to change your original scoring file, model file dependencies files, environment file, and schema files. 

Learn more in these articles:
+ How to deploy to ACI
+ How to deploy to AKS
+ [Tutorial: build, train, and deploy models with Azure Machine Learning Serivces](tutorial-build-train-deploy-with-azure-machine-learning.md)

## Run history records

While you can't continue adding to your existing run histories under the old workspace, you can export the histories you have using the previous CLI. In th

To export the run history with previous CLI:

```azurecli
#list all runs
az ml history list

#get details about a particular run
az ml history info

# download all artifacts of a run
az ml history download
```

## Data Prep files
TBD ...



## Next steps

For a quickstart showing you how to create a project, run a script, and explore the run history of the script with the generally available version of Azure Machine Learning Services, try:
+ [Get started with Azure Machine Learning Services](quickstart-get-started.md)
+ [Get started with Azure Machine Learning using the CLI extension](quickstart-get-started-with-cli.md)

For a more in-depth experience of this workflow, follow the full-length tutorial that contains detailed steps for building, training, and deploying models with Azure Machine Learning Services. 

> [!div class="nextstepaction"]
> [Tutorial: Build, train, and deploy](tutorial-build-train-deploy-with-azure-machine-learning.md)