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
 
In July 2018, Azure Machine Learning Services became generally available (GA) in Azure portal. At that time, some of the pre-GA features were deprecated to make way for newer, better [architecture](concept-azure-machine-learning-architecture.md) and capabilities. 

New UX sneak peek: https://portal.azure.com/?feature.customPortal=false&feature.showassettypes=Microsoft_Azure_MLTeamAccounts_MachineLearningServices&feature.canmodifystamps=true&Microsoft_Azure_MLWorkspaces=dev&Microsoft_Azure_MLCommitmentPlans=dev&Microsoft_Azu...

Hai's notes: https://github.com/hning86/azure-docs-pr/blob/tax/articles/machine-learning/service/what-happened-to-workbench.md

## How much did the service change?
In this generally available release, the [architecture](concept-azure-machine-learning-architecture.md) has been redesigned and this and that based on the rich customer feedback we received during the initial public preview phase. Link out to your blog on the product announcement - what’s new on MSDN and a link to the new Quickstart to get started.

The desktop workbench application was replaced with an easy to use and more comprehensive Python SDK and CLI.  

Azure Machine Learning Services (preview) went public in September 2017. Since then many customers have provided lots of value feedbacks. Now Azure Machine Learning services have become generally available (GA), it includes many significant updates based on these customer feedbacks. If you have previous created solutions using the Azure Machine Learning services preview offering, make sure you understand the below changes. You can follow the instructions to migrate the solutions onto the supported GA offering.

What's changing

New Azure ML Python SDK

Updated Command-line interface (CLI)

Simplified Azure resources model

In the preview offering, there are three Azure resources that you have to register and create individually:

Experimentation account
Model management account
ML compute environment
In the GA offering, they are consolidated into a single Azure resource named "Azure Machine Learning Workspace", aka Workspace. It means you only need to create a single Azure entity in order to use Azure ML services. You can create the Workspace through Azure Portal, the new Python SDK (Workspace.get_or_create(...)), or the updated CLI (az ml create workspace).

New Workspace UI in Azure Portal
To help enable easy access and sharing, a new web UI for the Azure ML workspace is now available with the GA offering. It displays run history records and allows user to create run history reports, manage compute targets under a Workspace, as well as managing models, Docker images, and deploying web services.

Updated Visual Studio Code Tools for AI extension
With this GA release, the Visual Studio Code Tools for AI extension is also updated to work with the above new features.

Workbench desktop client and CLI
For the existing Workbench desktop client and associated CLI, they will stop being supported after December 31, 2018. Please take steps listed below to migrate your existing solutions to the GA offering. All features and capabilities (except Data Preparation) will be available in the GA offering through the new SDK/CLI/Web UI.

Data Prep
Data Prep UX in the Workbench desktop client is not going to be available in new Workspace Web UI in Azure portal. Some of the Data Prep capabilities will surface through the Python SDK in the near future; and the plan for the Data Prep UX is still being finalized.

## For how long will the desktop Workbench continue to work?
Answer that. We can also point them to the deprecated docs if they intend to stay on 3RP for a while longer.

## How will I prepare data?
(Short answer followed by links to Quickstarts and tutorials that help someone get started with GA functionality)
 
## Will my web services still work?
(Explain what will and what won’t. If they need to do some migration work, point off to that section)
 
## Will run histories persist?
How do I migrate to generally available release of Azure Machine Learning?
(If this section gets too long, we may need another article for the next eight months specific to migration)
 
## How do I build and deploy models now?
Process hasn’t changed, but a new SDK and CLI have been released to support the process. Learn how with this tutorial…
 
## Will the SDK and CLI continue to work?
Yes, for a while. But we’ve invested more and have cool new ones. Check them out.

With GA offering, there is a new set of Azure ML SDK (software development kit) for Python, which allows user to interact with the Azure Machine Learning services in any Python environment, including Jypter Notebook or your favorite Python IDE. This SDK is hosted in pypi and pip-installable, making it easy for any Python developer to start to use Azure ML with a single command line of pip install azureml-sdk.

Along with the new SDK, GA offering also comes with an updated command-line interface in the form of an extension to azure-cli. With the rich set of az ml commands you can interact with Azure ML services in any command-line environment, including Azure portal cloud shell.

 
## Will my experimentation and model management accounts continue to work?
 
## How do I migrate my work?

Generally speaking, most of the artifacts created in the pre-GA version of Azure Machine Learning Services are stored in your own local or cloud storage. So the migration path largely involves re-registering them with the new Azure Machine Learning offering. Get detailed steps in the article, [How to migrate to the generally available version of Azure Machine Learning Services](how-to-migrate-to-ga.md).