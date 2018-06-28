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
 
Azure Machine Learning Services first went Public Preview in Azure portal in September 2017. Since then, customers have shared their feedback and we've been listening. The July 2018 version of Azure Machine Learning Services contains many significant updates based on that feedback and some pre-GA features were deprecated to make way for a newer, better [architecture](concept-azure-machine-learning-architecture.md). 

In this article, you'll learn about what changed and how it affects your pre-existing work with Azure Machine Learning Services.

## What changed?

While the workflow hasn't changed, the July 2018 release of Azure Machine Learning includes:
+ A [simplified Azure resources model](concept-azure-machine-learning-architecture.md)
+ A [new Python SDK](reference-azure-machine-learning-sdk.md) that is more comprehensive
+ An [updated and expanded CLI](reference-azure-machine-learning-sdk.md)
+ New portal UI for sharing and managing your run histories and compute targets

In this newer release, [the architecture of Azure Machine Learning Services](concept-azure-machine-learning-architecture.md) was redesigned with ease-of-use in mind. Instead of requiring multiple Azure resources and accounts, the service has moved to a single, top-level resource called the Azure Machine Learning Workspace.  You can quickly create a workspace in the [Azure portal](quickstart-get-started.md) or using [the CLI](quickstart-get-started-with-cli.md).  This workspace can be used by one or more users to store their compute resources, models, deployments, and run histories. You can also have multiple workspaces.

While Azure Machine Learning still offers the CLI and SDK clients, the desktop Workbench application was deprecated. You can still monitor your run history, but now you can do so in the Azure portal online. In this workspace interface in the portal, you can run history reports, manage the compute targets attached to your workspace, managing your models, Docker images, and even deploy web services.

<a name="timeline"></a>

## What's the Workbench & CLI support timeline?
No worries! You can continue to use your experimentation and model management accounts as well as the Workbench application for a while longer after the July release. 

Support for these resources will be incrementally deprecated over the next 6 - 8 months. 

1. The ability to create new accounts in the Azure portal will go away first. Existing accounts, the CLI, and the desktop Workbench will continue to work at that time.

1. The underlying APIs for creating workspaces and projects in the desktop Workbench and CLI will stop working next, but you'll still be able to run your existing projects and deploy web services to ACS. 

1. Support for the remaining APIs and the desktop Workbench will end last. End of support is expected this Winter. 

[Start migrating](how-to-migrate-to-ga.md) today. All features and capabilities (except Data Preparation) are available in the latest version through the new SDK, CLI, and portal.

For now, you can still find the documentation for the desktop Workbench and old CLI and SDKs at the bottom of this [table of contents](../desktop-workbench/tutorial-classifying-iris-part-1.md).

## How do I migrate?

Generally speaking, most of the artifacts created in the pre-GA version of Azure Machine Learning Services are stored in your own local or cloud storage. So the migration path largely involves re-registering them with the new Azure Machine Learning offering. Learn how to [start migrating](how-to-migrate-to-ga.md)  to the latest Azure Machine Learning Services.

## Will projects persist?

You won't lose any code or work. In the older version, projects are cloud entities with a local directory. In the latest version, projects are local directories that are attached to the new workspace. [See a diagram of the latest architecture](concept-azure-machine-learning-architecture.md). 

Since much of the project contents was already on your local machine, you just need to register the local project directory with your new workspace. Learn how to create a new project [in Python with the new SDK](quickstart-get-started.md) or with [the updated CLI](quickstart-get-started-with-cli.md).

With a few lines of code, your pre-existing project files will continue to work in the latest version. [Learn how migrate your projects.](how-to-migrate-to-ga.md#projects)

## What about web services?

The models you deployed as web services using your Model Management account will continue to work for as long as Azure Container Service (ACS) is supported. Those web services will even work after support has ended for Model Management accounts. However, CLI support ends, so does your ability to manage those web services.

In the newer version, models are deployed as web services to [Azure Container Instances]() (ACI) or [Azure Kubernetes Service]() (AKS) clusters. Without having to change any of your scoring files and dependencies, you can redeploy your models using the new SDK or CLI to either target: ACI or AKS. Your original scoring file, model file dependencies files, environment file, and schema files can all remain unchanged. 

## What about run histories?

The older run histories are accessible until WHEN???. When you ready to move to the new version of Azure Machine Learning Services, you can export these run histories if you want to keep a copy. 

In the latest version of Azure Machine Learning Services, you can still collect the run history of your models and explore them using the new SDK and CLI as well as in the web portal. 

## Will the SDK and CLI still work?
Yes, they will continue to work for a while (see the [timeline](#timeline) above). However, we recommend that you create new experiments and models with the latest SDK and/or CLI.   

In the latest release, the new Azure Machine Learning SDK for Python is easy to install (`pip install azureml-sdk`) and allows you to interact with the Azure Machine Learning services in any Python environment. 

Additionally, you can use the updated Azure CLI extension for machine learning, which was built upon the new SDK. Use the rich set of `az ml` commands to interact the service in any command-line environment, including Azure portal cloud shell.
 
## How does this affect experimentation and deployment?

@@@Service and workflow continue to work the same.

## Can I still prepare data?
(Short answer followed by links to Quickstarts and tutorials that help someone get started with GA functionality)

@@@@@@ Pendleton availability? WHat's the story???

Data Prep UX in the Workbench desktop client is not going to be available in new Workspace Web UI in Azure portal. Some of the Data Prep capabilities will surface through the Python SDK in the near future; and the plan for the Data Prep UX is still being finalized.
 

## What about VSCode Tools for AI?
With this GA release, the Visual Studio Code Tools for AI extension is also updated to work with the above new features.