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

[New UX sneak peek](https://portal.azure.com/?feature.customPortal=false&feature.showassettypes=Microsoft_Azure_MLTeamAccounts_MachineLearningServices&feature.canmodifystamps=true&Microsoft_Azure_MLWorkspaces=dev&Microsoft_Azure_MLCommitmentPlans=dev&Microsoft_Azu...)

[Hai's notes](https://github.com/hning86/azure-docs-pr/blob/tax/articles/machine-learning/service/what-happened-to-workbench.md)

## How much did the service change?

In a few words, Azure Machine Learning now has:
+ A new comprehensive Python SDK
+ An updated and expanded CLI
+ A [simplified Azure resources model](concept-azure-machine-learning-architecture.md)
+ New portal UI for sharing and managing your run histories and compute targets

In the July 2018 release, [the architecture of Azure Machine Learning Services](concept-azure-machine-learning-architecture.md) was redesigned. Instead of requiring multiple Azure resources and accounts, the service has moved to a single, top-level resource called an Azure Machine Learning Workspace. You can quickly create this workspace [in Python](quickstart-set-up-in-python.md), using [the CLI](quickstart-set-up-in-cli.md), or in the [Azure portal](how-to-create-workspace-in-portal.md).  Your old accounts will continue to work for a while as described in the next section.

The desktop workbench application was replaced with an easy to use Python SDK and expanded CLI. You can still monitor your run history, but now you can do so in the Azure portal online. In this workspace interface in the portal, you can run run history reports, manage the compute targets attached to your workspace, managing your models, Docker images, and even deploy web services.

## For how long will the desktop Workbench continue to work?
No worries! You can continue to use your experimentation and model management accounts as well as the Workbench application for a while longer after the July release. Support for these resources will be incrementally deprecated over the next 6 - 8 months. First, we will discontinue the creation of new accounts in the Azure portal, but CLI and desktop Workbench will continue to work. A while later, we end the underlying APIs for creating workspaces and projects in the desktop Workbench and CLI, but you'll still be able to run your existing projects and deploy web services to ACS. Finally, we will stop support for all APIs and the desktop Workbench this Winter. 

Take steps listed below to migrate your existing solutions to the GA offering. All features and capabilities (except Data Preparation) will be available in the GA offering through the new SDK/CLI/Web UI.

For now, you can still find the documentation for the desktop Workbench and original CLI/SDKs at the bottom of this [table of contents](../desktop-workbench/tutorial-classifying-iris-part-1.md).

## How will I prepare data?
(Short answer followed by links to Quickstarts and tutorials that help someone get started with GA functionality)

Data Prep UX in the Workbench desktop client is not going to be available in new Workspace Web UI in Azure portal. Some of the Data Prep capabilities will surface through the Python SDK in the near future; and the plan for the Data Prep UX is still being finalized.
 
## Will my web services still work?
(Explain what will and what won’t. If they need to do some migration work, point off to that section)
 
## Will run histories persist?
How do I migrate to generally available release of Azure Machine Learning?
(If this section gets too long, we may need another article for the next eight months specific to migration)
 
## How do I build and deploy models now?
Process hasn’t changed, but a new SDK and CLI have was  released to support the process. Learn how with this tutorial…
 
## Will the SDK and CLI continue to work?
Yes, for a while. But we’ve invested more and have cool new ones. Check them out.

With GA offering, there is a new set of Azure ML SDK (software development kit) for Python, which allows user to interact with the Azure Machine Learning services in any Python environment, including Jypter Notebook or your favorite Python IDE. This SDK is hosted in pypi and pip-installable, making it easy for any Python developer to start to use Azure ML with a single command line of pip install azureml-sdk.

Along with the new SDK, GA offering also comes with an updated command-line interface in the form of an extension to azure-cli. With the rich set of az ml commands you can interact with Azure ML services in any command-line environment, including Azure portal cloud shell.

## How do I migrate my work?

Generally speaking, most of the artifacts created in the pre-GA version of Azure Machine Learning Services are stored in your own local or cloud storage. So the migration path largely involves re-registering them with the new Azure Machine Learning offering. Get detailed steps in the article, [How to migrate to the generally available version of Azure Machine Learning Services](how-to-migrate-to-ga.md).

## What about Visual Studio Code Tools for AI
With this GA release, the Visual Studio Code Tools for AI extension is also updated to work with the above new features.
