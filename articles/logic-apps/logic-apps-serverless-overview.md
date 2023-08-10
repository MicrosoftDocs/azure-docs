---
title: Azure serverless
description: Azure serverless helps you focus on creating cloud-based apps, while spending less on managing infrastructure when you use Azure Logic Apps and Azure Functions.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: conceptual
ms.date: 08/20/2022
---

# Azure serverless overview: Create cloud-based apps and solutions with Azure Logic Apps and Azure Functions

While serverless doesn't mean "no servers", Azure serverless helps you spend less on managing your infrastructure. In traditional app development, you can spend much time and energy on discussing and addressing hosting, scaling, and monitoring solutions to meet your app requirements and demands. With serverless apps and solutions, you can more easily handle these concerns as part of the app or solution. Serverless offers other benefits such as faster development, less code, simplicity, and scaling flexibility. All these capabilities free you to focus more on the business logic. Also, serverless is typically billed or charged based on usage. So, if no consumption happens, no charges are incurred. For more information, learn more about [Azure serverless](https://azure.microsoft.com/solutions/serverless/).

This article briefly summarizes the core serverless offerings in Azure, which are Azure Logic Apps and Azure Functions. Both services align with the previously described principles and help you build robust cloud apps and solutions with minimal code.

For more introductory information, visit the Azure pages for [Azure Logic Apps](https://azure.microsoft.com/services/logic-apps/) and [Azure Functions](https://azure.microsoft.com/services/functions/). For more detailed information, review the documentation pages for [What is Azure Logic Apps](logic-apps-overview.md) and [What is Azure Functions](../azure-functions/functions-overview.md).

## Azure Logic Apps

This service provides simplified ways to design, develop, and orchestrate automated event-driven integration workflows that run and scale in the cloud. With Azure Logic Apps, you can use a visual designer to quickly model business processes as workflows. A workflow always starts with a trigger as the first step. Following the trigger, one or more actions run subsequent operations in the workflow. These operations can include various combinations of actions, including conditional logic and data conversions.

To connect your workflows to other Azure services, Microsoft services, cloud-based environments, and on-premises environments without writing any code, you can add prebuilt triggers and actions to your workflows by choosing from [hundreds of connectors](/connectors/connector-reference/connector-reference-logicapps-connectors/), all managed by Microsoft. Each connector is actually a proxy or wrapper around an API, which lets the underlying service communicate with Azure Logic Apps. For example, the Office 365 Outlook connector offers a trigger named **When a new email arrives**. For serverless apps and solutions, you can use Azure Logic Apps to orchestrate multiple functions created in Azure Functions. By doing so, you can easily call various functions as a single process, especially when the process requires working with an external API or system.

If no connector is available to meet your needs, you can use the built-in HTTP operation or Request trigger to communicate with any service endpoint. Or, you can create your own connector using an existing API.

Based on the logic app resource type that you choose, the associated workflow runs in either multi-tenant Azure Logic Apps, single-tenant Azure Logic Apps, or a dedicated integration service environment (ISE). Each has their own capabilities, benefits, and billing models. The Azure portal provides the fastest way to get started creating logic app workflows. However, you can also use other tools such as Visual Studio Code, Visual Studio, Azure PowerShell, and others. For more information, review [What is Azure Logic Apps](logic-apps-overview.md)?

To get started with Azure Logic Apps, try a [quickstart to create an example Consumption logic app workflow in multi-tenant Azure Logic Apps using the Azure portal](quickstart-create-example-consumption-workflow.md). Or, try these [steps that create an example serverless app with Azure Logic Apps and Azure Functions in Visual Studio](create-serverless-apps-visual-studio.md).

For other information, review the following documentation:

* [What is Azure Logic Apps?](logic-apps-overview.md)
* [Managed connectors for Azure Logic Apps](/connectors/connector-reference/connector-reference-logicapps-connectors)
* [Built-in connectors for Azure Logic Apps](../connectors/built-in.md)
* [Single-tenant versus multi-tenant and integration service environment for Azure Logic Apps](single-tenant-overview-compare.md)
* [Usage metering, billing, and pricing models for Azure Logic Apps](logic-apps-pricing.md)

## Azure Functions

This service provides a simplified way to write and run pieces of code or *functions* in the cloud. You can write only the code you need for the current problem, without setting up a complete app or the required infrastructure, which makes development faster and more productive. Use your chosen development language, such as C#, Java, JavaScript, PowerShell, Python, and TypeScript. You're billed only for the duration when your code runs, and Azure scales as necessary.

To get started with Azure Functions, try [creating your first Azure function in the Azure portal](../azure-functions/functions-create-function-app-portal.md).

For other information, review the following documentation:

* [What is Azure Functions?](../azure-functions/functions-overview.md)
* [Getting started with Azure Functions](../azure-functions/functions-get-started.md)
* [Supported languages in Azure Functions](../azure-functions/supported-languages.md)
* [Azure Functions hosting options](../azure-functions/functions-scale.md)
* [Azure Functions pricing](../azure-functions/pricing.md)

## Get started with serverless apps in Azure

Azure provides rich tools for developing, deploying, and managing serverless apps. You can create serverless apps using the Azure portal, Visual Studio, or [Visual Studio Code](quickstart-create-logic-apps-visual-studio-code.md). After you build your app, you can [deploy that app quickly with Azure Resource Manager templates](logic-apps-deploy-azure-resource-manager-templates.md). Azure also provides monitoring, which you can access through the Azure portal, through the API or SDKs, or with integrated tooling for Azure Monitor logs and Application Insights.

## Next steps

* [Create an example serverless app with Azure Logic Apps and Azure Functions in Visual Studio](create-serverless-apps-visual-studio.md)
* [Create a customer insights dashboard with serverless](logic-apps-scenario-social-serverless.md)