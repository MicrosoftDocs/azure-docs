---
title: Migrate to Azure Machine Learning, general availability
description: Learn how to upgrade or migrate to the late version of Azure Machine Learning Services.
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: conceptual
ms.author: haining
author: haining
ms.date: 07/27/2018
---

# How to migrate to the latest version of Azure Machine Learning Services 

**If you have installed the Workbench application and/or have experimentation and model management accounts, use this article to migrate to the latest version.**  If you don't have Workbench installed or an experimentation account, you don't need to migrate to use Azure Machine Learning Services.

Most of the artifacts created in the earlier version of Azure Machine Learning Services are stored in your own local or cloud storage. So the migration path largely involves re-registering them with the new Azure Machine Learning offering. 

You can continue to use the previous version and the following assets for some time ([see transition support timeline](overview-what-happened-to-workbench.md#timeline)):
+ Your Azure subscription and resource group
+ Your scoring files
+ Your model file dependencies, environment, and schema files
+ Deployed web services

The following table and article explains what you can do with your existing assets and resources before or after moving over to the latest version of Azure Machine Learning Services.

|Previous asset or resource|Can I migrate?|How?|
|-----------------|:-------------:|-------------|
|Model management account|No|Create a workspace instead.|
|Experimentation account|No|Create a workspace  instead.|
|Machine learning CLI|No|Use the new one for new work.|
|Machine learning SDK|No|Use the new one for new work.|
|Projects|Yes|Attach the local folder to new workspace.|
|Models|Yes|None. Works as before.|
|Model dependencies <br/> and schemas|Yes|None. Works as before.|
|Run histories|No|Downloadable for a while.|
|Compute targets|No|Register them again in new workspace.|
|Web services|No|None. They continue to work as-is or redeploy models using latest version.|

Learn more about the changes to Azure Machine Learning Services in the article "[What happened to Workbench](overview-what-happened-to-workbench.md)"?

>[!Warning]
>You cannot migrate assets from Azure Machine Learning **Studio** to Azure Machine Learning **Services**.

## Azure resources

Resources such as your experimentation account and model management account, and machine learning compute environments cannot be migrated over to the latest version of Azure Machine Learning Services. See the [timeline](overview-what-happened-to-workbench.md#timeline) on how long your assets will continue to work.

Get started with the latest version by creating an Azure Machine Learning Workspace:
+ In the [Azure portal](quickstart-get-started.md)
+ Using [the CLI](quickstart-get-started-with-cli.md). 

This new workspace is the top-level service resource and enables you to use all features of the latest features of Azure Machine Learning Services. [Learn more about this workspace and architecture](concept-azure-machine-learning-architecture.md).

## Projects

Instead of having your projects in a workspace in the cloud, projects are now directories on your local machine in the latest release.

To migrate your projects, attach the local directory containing your scripts to your newly created Azure Machine Learning Workspace. When you attach that project to the workspace, you can also start a run history file in the workspace for that project by specifying a name for that history.  

Attach your existing local project directory to the workspace using one of these methods. Replace the information in \<\>  brackets with the name of your workspace, file path to your local project directory, and the name for run history.

Using the new [CLI](reference-azure-machine-learning-cli.md):
  ```azurecli
  az ml project attach -w <my_workspace_name> -p <proj_dir_path> --history <run_history_name>
  ```

Using the new [SDK](reference-azure-machine-learning-sdk.md):
  ```python
  from azureml.core import Workspace, Project
    
  ws = Workspace.from_config()
  proj = Project.attach(workspace_object=ws, run_history='<run_history_name>', directory='<proj_dir_path>')
  ```

Follow the complete [CLI quickstart](quickstart-get-started-with-cli.md) or [Portal/SDK quickstart](quickstart-get-started.md) to learn how to create a workspace and attach a project.


## Deployed web services

To migrate your web services, you must redeploy your models using the new SDK or CLI to the new deployment targets. In the latest version, models are deployed as web services to [Azure Container Instances](how-to-deploy-to-aci.md) (ACI) or [Azure Kubernetes Service](how-to-deploy-to-aks.md) (AKS) clusters. There is no need to change your original scoring file, model file dependencies files, environment file, and schema files. 

Learn more in these articles:
+ [Deploy to ACI](how-to-deploy-to-aci.md)
+ [Deploy to AKS](how-to-deploy-to-aks.md)
+ [Tutorial: train and deploy models with Azure Machine Learning Serivces](tutorial-build-train-deploy-with-azure-machine-learning.md)

When [support for the previous CLI ends](overview-what-happened-to-workbench.md#timeline), you won't be able to manage the web services you originally deployed with your Model Management account. However, those web services will continue to work for as long as Azure Container Service (ACS) is still supported.

## Run history records

While you can't continue adding to your existing run histories under the old workspace, you can export the histories you have using the previous CLI. When [support for the previous CLI ends](overview-what-happened-to-workbench.md#timeline), you won't be able to export anymore.

To export the run history with previous CLI:

```azurecli
#list all runs
az ml history list

#get details about a particular run
az ml history info

# download all artifacts of a run
az ml history download
```

## Data preparation files
TBD .. @@@

## Next steps

For a quickstart showing you how to create a workspace, create a project, run a script, and explore the run history of the script with the latest version of Azure Machine Learning Services, try:
+ [Get started with Azure Machine Learning Services](quickstart-get-started.md)
+ [Get started with Azure Machine Learning using the CLI extension](quickstart-get-started-with-cli.md)

For a more in-depth experience of this workflow, follow the full-length tutorial that contains detailed steps for building, training, and deploying models with Azure Machine Learning Services. 

> [!div class="nextstepaction"]
> [Tutorial: Build, train, and deploy](tutorial-build-train-deploy-with-azure-machine-learning.md)