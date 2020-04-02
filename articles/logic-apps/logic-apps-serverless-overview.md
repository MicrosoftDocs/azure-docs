---
title: Overview - Azure Serverless for cloud-based apps and solutions
description: Learn how to create cloud-based apps and solutions without worrying about infrastructure by using Azure Logic Apps and Azure Functions
services: logic-apps
ms.suite: integration
author: jeffhollan
ms.author: jehollan
ms.reviewer: klam, estfan, logicappspm
ms.topic: article
ms.date: 03/30/2017
---

# Azure Serverless: Overview for building cloud-based apps and solutions with Azure Logic Apps and Azure Functions

[Serverless](https://azure.microsoft.com/solutions/serverless/) apps offer benefits such as increased development speed, reduced code, simplicity, and scale. This article covers the different attributes of serverless solutions and Azure serverless offerings.

## What is serverless?

Serverless doesn't mean there are no servers, but rather developers don't have to worry about servers. A large part of traditional application development is answering questions around scaling, hosting, and monitoring solutions to meet the demands of the application. With serverless, these questions are taken care of as part of the solution. In addition, serverless apps are billed on a consumption-based plan. If the app is never used, no charge is incurred. These features help developers focus solely on a solution's business logic.

The core Azure services for serverless are [Azure Logic Apps](https://azure.microsoft.com/services/logic-apps/) and [Azure Functions](https://azure.microsoft.com/services/functions/). Both solutions follow the previously described principles and help developers to build robust cloud apps with minimal code.

## What is Azure Logic Apps?

[Azure Logic Apps](logic-apps-overview.md) provides a way to simplify and implement scalable integrations and workflows in the cloud. This service provides a visual designer to model and automate your process as a series of steps called a workflow. There are many [connectors](../connectors/apis-list.md) across cloud services and on-premises systems that quickly connect a serverless app to other APIs. Every logic app begins with a trigger, such as "When an account is added to Dynamics CRM". After the trigger fires, the workflow can run combinations of actions, conversions, and conditional logic. Logic Apps is a great choice when orchestrating different Azure Functions in a process, especially when the process requires interacting with an external system or API.

To get started with Logic Apps, start with [creating your first logic app](quickstart-create-first-logic-app-workflow.md). For more technical information about Logic Apps, see the [developer reference](logic-apps-workflow-definition-language.md).

## What is Azure Functions?

Azure Functions is a service for easily running pieces of code or "functions" in the cloud. You can write only the code necessary for the current problem, without worrying about an entire app or the infrastructure required. Functions can make development even more productive, and you can use your development language of choice, such as C#, F#, Node.js, Python, or PHP. You pay only for the time your code runs and Azure scales as necessary.

To get started with Azure Functions, start with [Create your first Azure Function](../azure-functions/functions-create-first-azure-function.md). For more technical information about Functions, see the [developer reference](../azure-functions/functions-reference.md).

## How can I build and deploy serverless apps in Azure?

Azure provides rich tools for developing, deploying, and managing serverless apps. You can build apps directly in the Azure portal, with [tools in Visual Studio](logic-apps-serverless-get-started-vs.md), or [Visual Studio Code](quickstart-create-logic-apps-visual-studio-code.md). After you build your app, you can [deploy that app quickly with Azure Resource Manager templates](logic-apps-deploy-azure-resource-manager-templates.md). Azure also provides monitoring, which you can access through the Azure portal, through the API or SDKs, or with integrated tooling for Azure Monitor logs and Application Insights.

## Next steps

* [Build a serverless app in Visual Studio](logic-apps-serverless-get-started-vs.md)
* [Create a customer insights dashboard with serverless](logic-apps-scenario-social-serverless.md)
* [Automate logic app deployment](logic-apps-azure-resource-manager-templates-overview.md)
