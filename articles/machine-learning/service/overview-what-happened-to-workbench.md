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
 
In July 2018, Azure Machine Learning Services became generally available (GA) in Azure Portal. At that time, some of the pre-GA features were deprecated to make way for newer, better [architecture](concept-azure-machine-learning-architecture.md) and capabilities. 

New UX sneak peek: https://portal.azure.com/?feature.customPortal=false&feature.showassettypes=Microsoft_Azure_MLTeamAccounts_MachineLearningServices&feature.canmodifystamps=true&Microsoft_Azure_MLWorkspaces=dev&Microsoft_Azure_MLCommitmentPlans=dev&Microsoft_Azu...

Hai's notes: https://github.com/hning86/azure-docs-pr/blob/tax/articles/machine-learning/service/what-happened-to-workbench.md

## How much did the service change?
In this generally available release, we’ve redesigned the [architecture](concept-azure-machine-learning-architecture.md)  and this and that based on the rich customer feedback we received during the initial public preview phase. Link out to your blog on the product announcement - what’s new on MSDN and a link to the new Quickstart to get started.

The desktop workbench application was replaced with an easy to use and more comprehensive Python SDK and CLI.  

## For how long will the desktop Workbench continue to work?
Answer that. We can also point them to the deprecated docs if they intend to stay on 3RP for a while longer.

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

Generally speaking, most of the artifacts created in the pre-GA version of Azure Machine Learning Services are stored in your own local or cloud storage. So the migration path largely involves re-registering them with the new Azure Machine Learning offering. Get detailed steps in the article, [How to migrate to the generally available version of Azure Machine Learning Services](how-to-migrate-to-ga.md).