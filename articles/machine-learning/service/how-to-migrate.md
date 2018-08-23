---
title: Migrate to Azure Machine Learning, general availability
description: Learn how to upgrade or migrate to the late version of Azure Machine Learning service.
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: conceptual
ms.author: haining
author: haining
ms.date: 09/24/2018
---

# How to migrate to the latest version of Azure Machine Learning service 

**If you have installed the Workbench (preview) application and/or have experimentation and model management preview accounts, use this article to migrate to the latest version.**  If you don't have preview Workbench installed, or an experimentation and/or model management account, you don't need to migrate anything.

Most artifacts created in the first preview of Azure Machine Learning service are stored in your own local or cloud storage. These artifacts won't disappear. To migrate, register the artifacts again with the updated Azure Machine Learning offering. 

The following table and article explain what you can do with your existing assets and resources before or after moving over to the latest version of Azure Machine Learning service. You can also continue to use the previous version and your assets for some time ([see transition support timeline](overview-what-happened-to-workbench.md#timeline)).

|Previous preview asset or resource|Can I migrate?|Actions|
|-----------------|:-------------:|-------------|
|Machine learning models (as local files)|Yes|None. Works as before.|
|Model dependencies & schemas (as local files)|Yes|None. Works as before.|
|Projects|Yes|[Attach the local folder to new workspace](#projects).|
|Run histories|No|[Downloadable](#history) for a while.|
|Compute targets|No|Register them in new workspace.|
|Registered Models|No|You must re-register the model under a the new workspace.|
|Registered Manifests|No|None. Manifests no longer exists as a concept in the new workspace.|
|Registered Images|No|You must re-create the deployment Docker image under a new workspace.|
|Deployed web services|No|None. They'll still work as-is <br/>or [deploy them again using latest version](#services).|
|Experimentation and <br/>Model management accounts|No|[Create a workspace](#resources) instead.|
|Machine learning CLI & SDK|No|Use the new [CLI](reference-azure-machine-learning-cli.md) and [SDK](reference-azure-machine-learning-sdk.md) for new work.|


Learn more about [what changed in this release](overview-what-happened-to-workbench.md)?

>[!Warning]
>This article is not for Azure Machine Learning Studio users.

<a name="resources"></a>

## Azure resources

Resources such as your experimentation accounts, model management accounts, and machine learning compute environments cannot be migrated over to the latest version of Azure Machine Learning service. See the [timeline](overview-what-happened-to-workbench.md#timeline) on how long your assets will continue to work.

Get started with the latest version by creating an Azure Machine Learning Workspace:
+ In the [Azure portal](quickstart-get-started.md)
+ Using the new [machine learning CLI extension](quickstart-get-started-with-cli.md)

This new workspace is the top-level service resource and enables you to use all of the latest features of Azure Machine Learning service. [Learn more about this workspace and architecture](concept-azure-machine-learning-architecture.md).

<a name="projects"></a>

## Projects

Instead of having your projects in a workspace in the cloud, projects are now directories on your local machine in the latest release. [See a diagram of the latest architecture](concept-azure-machine-learning-architecture.md). 

To migrate your projects, attach the local directory containing your scripts to your newly created Azure Machine Learning Workspace. Using a single CLI command or in a few lines of Python code, your existing project files will continue to work in the latest version. For a complete example, follow the [CLI quickstart](quickstart-get-started-with-cli.md) or [Portal/SDK quickstart](quickstart-get-started.md). 

+ For [CLI](reference-azure-machine-learning-cli.md), use:
  ```azurecli
  az ml project attach -w <my_workspace_name> -p <proj_dir_path> --history <run_history_name>
  ```

+ For the new [SDK](reference-azure-machine-learning-sdk.md), use:
  ```python
  from azureml.core import Workspace, Project
    
  ws = Workspace.from_config()
  proj = Project.attach(workspace_object=ws, run_history='<run_history_name>', directory='<proj_dir_path>')
  ```

Replace the information in \<\>  brackets with the name of your workspace, file path to your local project directory, and the name for run history.   

<a name="services"></a>

## Deployed web services

To migrate web services, redeploy your models using the new SDK or CLI to the new deployment targets. There is no need to change your original scoring file, model file dependencies files, environment file, and schema files. 

In the latest version, models are deployed as web services to [Azure Container Instances](how-to-deploy-to-aci.md) (ACI) or [Azure Kubernetes Service](how-to-deploy-to-aks.md) (AKS) clusters. 

Learn more in these articles:
+ [Deploy to ACI](how-to-deploy-to-aci.md)
+ [Deploy to AKS](how-to-deploy-to-aks.md)
+ [Tutorial:Deploy models with Azure Machine Learning service](tutorial-deploy-models-with-aml.md)

When [support for the previous CLI ends](overview-what-happened-to-workbench.md#timeline), you won't be able to manage the web services you originally deployed with your Model Management account. However, those web services will continue to work for as long as Azure Container Service (ACS) is still supported.

<a name="history"></a>

## Run history records

While you can't continue to add to your existing run histories under the old workspace, you can export the histories you have using the previous CLI. When [support for the previous CLI ends](overview-what-happened-to-workbench.md#timeline), you won't be able to export these run histories anymore.

Start training your models and tracking the run histories using the new CLI and SDK. You can learn how with the [Tutorial: train models with Azure Machine Learning service](tutorial-train-models-with-aml.md).

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
Data preparation files are not portable to the new release since we don't have Workbench anymore. However, you can still prepare any size data set for modeling using the new Azure Data Prep SDK or use Azure Data Bricks for big data sets.

### Azure Data Prep SDK download and installation Links

- [Azure Data Prep SDK](https://dataprepdownloads.azureedge.net/pypi/privPreview/latest/)

```    
pip install --upgrade --extra-index-url https://dataprepdownloads.azureedge.net/pypi/privPreview/latest/ azureml-dataprep
```

## Next steps

For a quickstart showing you how to create a workspace, create a project, run a script, and explore the run history of the script with the latest version of Azure Machine Learning service, try:
+ [Get started with Azure Machine Learning service](quickstart-get-started.md)
+ [Get started with Azure Machine Learning using the CLI extension](quickstart-get-started-with-cli.md)

For a more in-depth experience of this workflow, follow the full-length tutorial that contains detailed steps for training and deploying models with Azure Machine Learning service. 

> [!div class="nextstepaction"]
> [Tutorial: Train and deploy models](tutorial-train-models-with-aml.md)