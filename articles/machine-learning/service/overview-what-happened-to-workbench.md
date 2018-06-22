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
 
Azure Machine Learning Services first went Public Preview in Azure portal in September 2017. Since then, customers have shared their feedback and we've been listening. In July 2018, Azure Machine Learning Services became generally available (GA). This GA release contains many significant updates based on that feedback. And, many pre-GA features were deprecated to make way for newer, better [architecture](concept-azure-machine-learning-architecture.md) and capabilities. In this article, you'll learn about what changed and how it affects your pre-existing work with Azure Machine Learning Services.

## How much did the service change?

While the workflow hasn't changed, the July 2018 release of Azure Machine Learning includes:
+ A [simplified Azure resources model](concept-azure-machine-learning-architecture.md)
+ A [new Python SDK](reference-azure-machine-learning-sdk.md) that is more comprehensive
+ An [updated and expanded CLI](reference-azure-machine-learning-sdk.md)
+ New portal UI for sharing and managing your run histories and compute targets

In this newer release, [the architecture of Azure Machine Learning Services](concept-azure-machine-learning-architecture.md) was redesigned with ease-of-use in mind. Instead of requiring multiple Azure resources and accounts, the service has moved to a single, top-level resource called the Azure Machine Learning Workspace. This workspace can be used by one or more users to store their compute resources, models, deployments, and run histories. You can quickly your create workspaces [in Python](quickstart-set-up-in-python.md), using [the CLI](quickstart-set-up-in-cli.md), or in the [Azure portal](how-to-create-workspace-in-portal.md).  

While Azure Machine Learning still offers the CLI and SDK clients, the desktop Workbench application was deprecated. You can still monitor your run history, but now you can do so in the Azure portal online. In this workspace interface in the portal, you can run run history reports, manage the compute targets attached to your workspace, managing your models, Docker images, and even deploy web services.

<a name="timeline"></a>

## For how long will the desktop Workbench, SDK, and CLI work?
No worries! You can continue to use your experimentation and model management accounts as well as the Workbench application for a while longer after the July release. 

Support for these resources will be incrementally deprecated over the next 6 - 8 months. First, we will discontinue the creation of new accounts in the Azure portal, but CLI and desktop Workbench will continue to work. A while later, we end the underlying APIs for creating workspaces and projects in the desktop Workbench and CLI, but you'll still be able to run your existing projects and deploy web services to ACS. Finally, we will stop support for all APIs and the desktop Workbench this Winter. 

Take steps listed below to migrate your existing solutions to the GA offering. All features and capabilities (except Data Preparation) will be available in the GA offering through the new SDK/CLI/Web UI.

For now, you can still find the documentation for the desktop Workbench and old CLI and SDKs at the bottom of this [table of contents](../desktop-workbench/tutorial-classifying-iris-part-1.md).

## How do I migrate my work?

Generally speaking, most of the artifacts created in the pre-GA version of Azure Machine Learning Services are stored in your own local or cloud storage. So the migration path largely involves re-registering them with the new Azure Machine Learning offering. 

Get detailed steps in the Azure Machine Learning Services [migration article](how-to-migrate-to-ga.md).

## Will my project persist?

You won't lose any code and work. In the older version, projects are cloud entities with a local directories. In the latest version, projects are local directories that are attached to the new workspace. [See a diagram of the latest architecture](concept-azure-machine-learning-architecture.md). 

Since much of the project contents was already on your local machine, you just need to register the local project directory with your new workspace. Learn how to create a new project [in Python with the new SDK](quickstart-set-up-in-python.md) or with [the updated CLI](quickstart-set-up-in-cli.md).

With a few lines of code, your pre-existing project files will continue to work in the latest version. [Learn how migrate your projects.](how-to-migrate-to-ga.md#projects)

## Will my web services still work?

The models you deployed as web services using your Model Management account will continue to work for as long as Azure Container Service (ACS) is supported. Those web services will even work after support has ended for Model Management accounts. However, CLI support ends, so does your ability to manage those web services.

In the newer version, models are deployed as web services to [Azure Container Instances]() (ACI) or [Azure Kubernetes Service]() (AKS) clusters. Without having to change any of your scoring files and dependencies, you can redeploy your models using the new SDK or CLI to either target: ACI or AKS. Your original scoring file, model file dependencies files, environment file, and schema files can all remain unchanged. 

## What will happen to my run histories?

The older run histories are accessible until WHEN???. When you ready to move to the new version of Azure Machine Learning Services, you can export these run histories if you want to keep a copy. 

In the latest version of Azure Machine Learning Services, you can still collect the run history of your models and explore them using the new SDK and CLI as well as in the web portal. 
 
## How does this affect experimentation and deployment?

@@@Service and workflow continue to work the same.

## How will I prepare data?
(Short answer followed by links to Quickstarts and tutorials that help someone get started with GA functionality)

@@@@@@ Pendleton availability?? WHat's the story???

Data Prep UX in the Workbench desktop client is not going to be available in new Workspace Web UI in Azure portal. Some of the Data Prep capabilities will surface through the Python SDK in the near future; and the plan for the Data Prep UX is still being finalized.
 
## Will the SDK and CLI continue to work?
Yes, they will continue to work for a while (see the [timeline](#timeline) above). However, we recommend that you create new experiments and models with the latest SDK and/or CLI.   

With GA offering, there is a new set of Azure ML SDK (software development kit) for Python, which allows user to interact with the Azure Machine Learning services in any Python environment, including Jypter Notebook or your favorite Python IDE. This SDK is hosted in pypi and pip-installable, making it easy for any Python developer to start to use Azure ML with a single command line of pip install azureml-sdk.

Along with the new SDK, GA offering also comes with an updated command-line interface in the form of an extension to azure-cli. With the rich set of az ml commands you can interact with Azure ML services in any command-line environment, including Azure portal cloud shell.

## What about Visual Studio Code Tools for AI
With this GA release, the Visual Studio Code Tools for AI extension is also updated to work with the above new features.