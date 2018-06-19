---
title: What happened to Azure Machine Learning Workbench? | Microsoft Docs
description: Azure Machine Learning has gone GA. What happened to the Workbench application? 
services: machine-learning
author: mwinkle
ms.author: mwinkle
ms.service: machine-learning
ms.component: core
ms.workload: data-services
ms.topic: get-started-article
ms.date: 07/27/2018
---
# What happened to Azure Machine Learning Workbench?
 
Followed by an intro paragraph on how AML went GA in July 2018 and with it we’ve changed the architecture (link out) and replaced the workbench with an easy to use comprehensive SDK.
 
## For how long can I still use the desktop Workbench?
Answer that. We can also point them to the deprecated docs if they intend to stay on 3RP for a while longer.
 
## How much has Azure Machine Learning Services changed?
In this generally available release, we’ve redesigned the architecture (link) and this and that based on the rich customer feedback we received during the initial public preview phase. Link out to your blog on the product announcement - what’s new on MSDN and a link to the new Quickstart to get started.
 
## How will I prepare data?
(Short answer followed by links to Quickstarts and tutorials that help someone get started with GA functionality)
 
## Will my web services still work?
(Explain what will and what won’t. If they need to do some migration work, point off to that section)
 
## Will run histories persist?
How do I migrate to generally available release of Azure Machine Learning?
(If this section gets too long, we may need another article for the next 8 months specific to migration)
 
## How do I build and deploy models now?
Process hasn’t changed, but a new SDK and CLI have been released to support the process. Learn how with this tutorial…
 
## Will the SDK and CLI continue to work?
Yes, for a while. But we’ve invested more and have cool new ones. Check them out.
 
## Will my experimentation and model management accounts continue to work?
 
## How do I migrate my work?
Generally speaking, most of the artifacts created in Azure ML Services preview are stored in user's own local or cloud storage. So the migration path largely involves "re-registering" them with the new Azure ML GA offering. 

### Azure resources
As mentioned above, Azure ML experimentation account, model management account, and ML compute environment are preview-only Azure resources. In GA offerings these resources are not supported. Simply create a new Azure ML Workspace that enables you to use all Azure ML services features. You can also create multiple Workspaces and assign different roles to team members.

### Projects
Projects are now local folders with files. For any existing Azure ML project from the preview offering, once you create the new Azure ML Workspace in GA offering, you can attach the project folder to the new Workspace with a run history name of your choice. 

* From CLI:
    ```sh
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
There are no migration path for the data prep package files at this point.