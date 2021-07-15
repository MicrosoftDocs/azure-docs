---
title: More app development, less infrastructure management
description: Azure serverless helps you focus on creating cloud-based apps, while spending less on managing infrastructure when you use Azure Logic Apps and Azure Functions 
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: conceptual
ms.date: 07/15/2021
---

# Azure serverless overview: Create cloud-based apps and solutions with Azure Logic Apps and Azure Functions

While serverless doesn't mean "no servers", Azure serverless helps you spend less on managing your infrastructure. In traditional app development, you can spend much time and energy on discussing and addressing hosting, scaling, and monitoring solutions to meet your app requirements and demands. With serverless apps and solutions, you can more easily handle these concerns as part of the app or solution. Serverless offers other benefits such as faster development, less code, simplicity, and scaling flexibility. All these capabilities free you to focus more on the business logic. Also, serverless is typically billed or charged based on usage. So, if no consumption happens, no charges are incurred. For more information, learn more about [Azure serverless](https://azure.microsoft.com/solutions/serverless/).

This article briefly summarizes the core serverless offerings in Azure, which are Azure Logic Apps and Azure Functions. Both services align with the previously described principles and help you build robust cloud apps and solutions with minimal code.

For more introductory information, visit the Azure pages for [Azure Logic Apps](https://azure.microsoft.com/services/logic-apps/) and [Azure Functions](https://azure.microsoft.com/services/functions/). For more detailed information, review the documentation pages for [What is Azure Logic Apps](logic-apps-overview.md) and [What is Azure Functions](../azure-functions/functions-overview.md).

## Azure Logic Apps

This service provides simplified ways to design, develop, and orchestrate automated integration event-driven workflows that run and scale in the cloud. You can use the visual designer to quickly model business processes as workflows. 

You can create logic app workflows that run in either multi-tenant Azure Logic Apps, single-tenant Azure Logic Apps, or a dedicated integration service environment (ISE). Each have their own capabilities, benefits, and billing models.


To connect your workflows to other Azure services, Microsoft services, cloud-based environments, and on-premises environments  - all without writing code, add prebuilt triggers and actions to your workflows by choosing from [hundreds of connectors](/connectors/connector-reference/connector-reference-logicapps-connectors/). Every workflow starts with a event-driven trigger as the first step. For example, the Office 365 Outlook connector offers a trigger named **When a new email arrives**. If the trigger successfully fires, workflows can run various combinations of actions, including conditional logic and data conversions.

Each connector is managed by Microsoft and is actually a proxy or wrapper around an API, which lets the underlying service communicate with Azure Logic Apps. If no connector is available to meet your needs, you can use a built-in operation, such as the HTTP action or Request trigger to communicate with any service endpoint, or you can create your own connector using an existing API.

To deploy to Azure, just push the button to save your workflow. 

Azure Logic Apps is a great choice when orchestrating different Azure Functions in a process, especially when the process requires interacting with an external system or API.

Although the Azure portal provides the fastest way to get started creating workflows, you can also  is using  can directly create workflows using the Azure portal, 


To get started with Azure Logic Apps, start with [creating your first logic app](quickstart-create-first-logic-app-workflow.md). For more technical information about Azure Logic Apps, see the [developer reference](logic-apps-workflow-definition-language.md).

## Azure Functions

Azure Functions is a service for easily running pieces of code or "functions" in the cloud. You can write only the code necessary for the current problem, without worrying about an entire app or the infrastructure required. Functions can make development even more productive, and you can use your development language of choice, such as C#, F#, Node.js, Python, or PHP. You pay only for the time your code runs and Azure scales as necessary.

To get started with Azure Functions, start with [Create your first Azure Function](../azure-functions/functions-get-started.md). For more technical information about Functions, see the [developer reference](../azure-functions/functions-reference.md).

## How can I build and deploy serverless apps in Azure?

Azure provides rich tools for developing, deploying, and managing serverless apps. You can create serverless apps using the Azure portal, Visual Studio, or [Visual Studio Code](quickstart-create-logic-apps-visual-studio-code.md). After you build your app, you can [deploy that app quickly with Azure Resource Manager templates](logic-apps-deploy-azure-resource-manager-templates.md). Azure also provides monitoring, which you can access through the Azure portal, through the API or SDKs, or with integrated tooling for Azure Monitor logs and Application Insights.

create-serverless-app-visual-studio

## Next steps

* [Build a serverless app in Visual Studio](create-serverless-app-visual-studio.md)
* [Create a customer insights dashboard with serverless](logic-apps-scenario-social-serverless.md)
* [Automate logic app deployment](logic-apps-azure-resource-manager-templates-overview.md)