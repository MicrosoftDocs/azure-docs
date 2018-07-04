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
 
In September 2017, Azure Machine Learning Services first went Public Preview in Azure portal. Since then, our customers have shared their feedback and we've been listening. 

We are pleased to announce that the August 2018 Public Preview version contains many significant updates based on that feedback to improve your experience. Some early features, such as the installed Workbench, were also deprecated to make way for a newer, better [architecture](concept-azure-machine-learning-architecture.md). 

In this article, you'll learn about what changed and how it affects your pre-existing work with Azure Machine Learning Services.

## What changed?

While the overall workflow hasn't changed, the latest release of Azure Machine Learning includes:
+ A [simplified Azure resources model](concept-azure-machine-learning-architecture.md)
+ New portal UI for managing and sharing run histories and compute targets
+ A new, more comprehensive [Python SDK](reference-azure-machine-learning-sdk.md)
+ An updated and expanded [Azure CLI extension](reference-azure-machine-learning-sdk.md)

The [architecture](concept-azure-machine-learning-architecture.md) was redesigned with ease-of-use in mind. Instead of requiring multiple Azure resources and accounts, you only need an [Azure Machine Learning Workspace](concept-azure-machine-learning-architecture.md).  You can quickly create your workspaces in the [Azure portal](quickstart-get-started.md) or with [the CLI](quickstart-get-started-with-cli.md).  Workspaces can be used by multiple users to store training and deployment compute targets, model run histories, Docker images, deployed models, and so on. 

While Azure Machine Learning still offers CLI and SDK clients, the desktop Workbench application was deprecated. You can still monitor your run history, but now you can do so in the Azure portal online. In the Azure portal's workspace dashboard, you can run history reports, manage the compute targets attached to your workspace, manage your models, Docker images, and even deploy web services.

<a name="timeline"></a>

## What's the support timeline?
No worries! You can continue to use your experimentation and model management accounts as well as the Workbench application for a while longer after September 2018. 

Support for these resources will be incrementally deprecated over the next 6 - 8 months. 

|Phase|Support details for earlier features|
|:---:|----------------|
|1|The ability to create new accounts in the Azure portal ends. Existing accounts, the CLI, and the desktop Workbench continue to work in this phase.|
|2|The underlying APIs for creating new workspaces and projects in the desktop Workbench and with the CLI ends. You can still run existing models and deploy web services to ACS in this phase.|
|3|Support for everything else, including the remaining APIs and the desktop Workbench end in this phase.|

[Start migrating](how-to-migrate.md) today. All features and capabilities (except data preparation) are available in the latest version through the new [SDK](reference-azure-machine-learning-sdk.md), [CLI](reference-azure-machine-learning-cli.md), and [portal](quickstart-get-started.md). 

While you can still use the older features, you'll be able to find that documentation at the bottom of this [table of contents](../desktop-workbench/tutorial-classifying-iris-part-1.md).

## How do I migrate?

Most of the artifacts created in the earlier version of Azure Machine Learning Services are stored in your own local or cloud storage. These artifacts won't ever disappear. To migrate, you'll need to register the artifacts again with the updated Azure Machine Learning offering. 

Learn what you can migrate to the latest Azure Machine Learning Services and how to do so in this [migration article](how-to-migrate.md).

## Will projects persist?

You won't lose any code or work. In the older version, projects are cloud entities with a local directory. In the latest version, projects are local directories that are attached to the new workspace. [See a diagram of the latest architecture](concept-azure-machine-learning-architecture.md). 

Since much of the project contents was already on your local machine, you just need to register the local project directory with your new workspace. Learn how to create a new project [in Python with the new SDK](quickstart-get-started.md) or with [the updated CLI](quickstart-get-started-with-cli.md).

With a few lines of code, your existing project files will continue to work in the latest version. [Learn how migrate your projects.](how-to-migrate.md#projects)

## What about web services?

The models you deployed as web services using your Model Management account will continue to work for as long as Azure Container Service (ACS) is supported. Those web services will even work after support has ended for Model Management accounts. However, when CLI support ends, so does your ability to manage those web services.

In the newer version, models are deployed as web services to [Azure Container Instances](how-to-deploy-to-aci.md) (ACI) or [Azure Kubernetes Service](how-to-deploy-to-aks.md) (AKS) clusters. Without having to change any of your scoring files and dependencies, you can redeploy your models using the new SDK or CLI to either target: ACI or AKS. You do not need to change anything in your original scoring file, model file dependencies files, environment file, and schema files. 

## What about run histories?

The older run histories are accessible until WHEN???. When you ready to move to the new version of Azure Machine Learning Services, you can export these run histories if you want to keep a copy. 

In the latest version of Azure Machine Learning Services, you can still collect the run history of your models and explore them using the new SDK and CLI as well as in the web portal. 

@@ Portal screenshot?

## Will the SDK and CLI still work?
Yes, they will continue to work for a while (see the [timeline](#timeline) above). But, you can start creating your new experiments and models with the latest SDK and/or CLI.

In the latest release, the new Python SDK allows you to interact with the Azure Machine Learning services in any Python environment. Learn how to [install the SDK](reference-azure-machine-learning-sdk.md).  You can also use the [updated Azure CLI machine learning extension](reference-azure-machine-learning-cli.md),with the rich set of `az ml` commands to interact the service in any command-line environment, including Azure portal cloud shell.
 
## How does this affect experimentation and deployment?

@@@Service and workflow continue to work the same.

## Can I still prepare data?
(Short answer followed by links to Quickstarts and tutorials that help someone get started with latest functionality)

@@@@@@ Pendleton availability? WHat's the story???

Data Prep UX in the Workbench desktop client is not going to be available in new Workspace Web UI in Azure portal. Some of the Data Prep capabilities will surface through the Python SDK in the near future; and the plan for the Data Prep UX is still being finalized.
 

## What about Visual Studio Code Tools for AI?

With this latest release, the Visual Studio Code Tools for AI extension has been expanded and improved to work with the above new features.

@@Screenshot showing code + run history too