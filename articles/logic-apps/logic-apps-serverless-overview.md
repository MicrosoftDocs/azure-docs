---
title: Azure Serverless overview | Microsoft Docs
description: Learn about creating powerful solutions in the cloud without worrying about infrastructure
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: jeffhollan
ms.author: jehollan
ms.reviewer: klam, estfan, LADocs
ms.custom: vs-azure
ms.topic: article
ms.date: 03/30/2017
---

# Overview: Azure Serverless with Azure Logic Apps and Azure Functions

Serverless applications offer benefits of an increase in speed of development, reduction in required code, and simplicity with scale.  This article goes into the different attributes of serverless solutions, and Azure serverless offerings.

## What is serverless?

Serverless doesn't mean there are no servers - it just means the developer doesn't have to worry about servers.  A large part of traditional application development is answering questions around scaling, hosting, and monitoring solutions to meet the demands of the application.  With Serverless, these questions are taken care of as part of the solution.  In addition, Serverless applications are billed on a consumption-based plan.  If the application is never used, a charge is never incurred.  These features allow developers to focus solely on the business logic of the solution.

The core services in Azure around Serverless are [Azure Functions](https://azure.microsoft.com/services/functions/) and [Azure Logic Apps](https://azure.microsoft.com/services/logic-apps/).  Both of these solutions follow the principles above, and allow developers to build robust cloud applications with minimal code.

## What are Azure Functions?

Azure Functions is a solution for easily running small pieces of code, or "functions," in the cloud. You can write just the code you need for the problem at hand, without worrying about a whole application or the infrastructure to run it. Functions can make development even more productive, and you can use your development language of choice, such as C#, F#, Node.js, Python, or PHP. Pay only for the time your code runs and Azure scales as needed.

If you want to jump right in and get started with Azure Functions, start with [Create your first Azure Function](../azure-functions/functions-create-first-azure-function.md). If you are looking for more technical information about Functions, see the [developer reference](../azure-functions/functions-reference.md).

## What are Azure Logic Apps?

Azure Logic Apps provides a way to simplify and implement scalable integrations and workflows in the cloud. It provides a visual designer to model and automate your process as a series of steps called a workflow.  There are [many connectors](../connectors/apis-list.md) across cloud and on-premises services to quickly connect a serverless app to other APIs.  A logic app begins with a trigger (like 'When an account is added to Dynamics CRM') and after firing can begin many combinations actions, conversions, and condition logic.  Logic Apps is a great choice when orchestrating different Azure Functions in a process - especially when the process requires interacting with an external system or API.

To get started with Logic Apps, start with [creating your first logic app](quickstart-create-first-logic-app-workflow.md).  If you are looking for more technical information about Logic Apps, see the [developer reference](logic-apps-workflow-actions-triggers.md).

## How can I build and deploy Serverless applications in Azure?

Azure provides a rich set of tools across development, deployment, and management of Serverless apps.  Apps can be built directly in the Azure portal, or with [tooling from Visual Studio](logic-apps-serverless-get-started-vs.md).  Once an application has been developed it can be [deployed instantly](logic-apps-create-deploy-template.md).  Azure also provides monitoring for serverless apps.  This monitoring can be accessed from the Azure portal, through the API or SDKs, or with integrated tooling to Log Analytics and Application Insights.

## Next steps

* [Get started building a Serverless app in Visual Studio](logic-apps-serverless-get-started-vs.md)
* [Create a customer insights dashboard with Serverless](logic-apps-scenario-social-serverless.md)
* [Build a deployment template for a logic app](logic-apps-create-deploy-template.md)