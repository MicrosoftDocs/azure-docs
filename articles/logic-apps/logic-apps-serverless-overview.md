---
title: Azure serverless
description: Learn how Azure serverless solutions help you focus more on building cloud-based apps and less on managing infrastructure by using Azure Logic Apps and Azure Functions.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: concept-article
ms.date: 07/22/2025
---

# Azure serverless overview: Create cloud-based apps and solutions with Azure Logic Apps and Azure Functions

Azure serverless solutions help you focus more on building cloud-based apps and less on managing your infrastructure. Traditional app development often requires that you invest much time and energy on discussions about hosting, scaling, and monitoring solutions to address your apps' requirements and needs.

However, with serverless apps and solutions, you can more easily handle these concerns as part of the app or solution. Serverless offers other benefits such as faster development, less code, simplicity, and scaling flexibility. All these capabilities free you to focus more on your apps' business logic. Serverless is also typically billed or charged based on usage. So, if no consumption happens, you don't incur any charges.

This article briefly summarizes the key core serverless offerings in Azure, which are Azure Logic Apps and Azure Functions. Both services align with the previously described principles and help you build robust cloud apps and solutions with minimal code.

For more information about serverless in Azure, see the following resources:

- [Serverless on Azure](https://azure.microsoft.com/solutions/serverless/)
- [Serverless Computing](https://azure.microsoft.com/resources/cloud-computing-dictionary/what-is-serverless-computing)
- [Azure for developers overview](/azure/developer/intro/azure-developer-overview)
- [Microsoft Cloud Adoption Framework for Azure](/azure/cloud-adoption-framework/overview)
- [Azure application architecture fundamentals](/azure/architecture/guide/)

## Azure Logic Apps

This service provides simplified ways for you to design, develop, and orchestrate automated event-driven integration *workflows* that run and scale in the cloud. In Azure Logic Apps, you can use a visual designer to quickly model business processes as workflows. Each workflow always starts with a trigger as the first step. Following the trigger, one or more actions run subsequent operations in the workflow. These operations can include various combinations of actions, including conditional logic and data conversions.

To connect your workflows to other Azure services, Microsoft services, cloud-based environments, and on-premises environments without writing any code, you can add prebuilt triggers and actions to your workflows by choosing from the [1,400+ connectors](/connectors/connector-reference/connector-reference-logicapps-connectors/) that are hosted, managed, and run in global, multitenant Azure. Each of these connectors is actually a proxy or wrapper around an API, which lets the underlying service communicate with Azure Logic Apps. For example, the Office 365 Outlook connector offers a trigger named **When a new email arrives**.

You can also build workflows that orchestrate functions created with Azure Functions. Through this service, you can easily call functions as easily as other actions in your workflow and as a single process, especially when the process requires working with an external API or system.

If no prebuilt operations exist to meet your workflow's needs, you can use the built-in **HTTP** operations or the **Request** trigger to communicate with any service endpoint. Or, you can create your own connector around an existing API.

Based on the logic app resource type that you choose, your workflow runs in either multitenant Azure Logic Apps or in single-tenant Azure Logic Apps, which offers specialized hosting options such as agent workflow, App Service Environment, or hybrid deployment. Each logic app resource type offers their own capabilities, benefits, and billing models.

To get up and running quickly, create your logic app resource and workflow by starting with the Azure portal as your entry point and following the [quickstart to create an example Consumption logic app workflow in multitenant Azure Logic Apps](quickstart-create-example-consumption-workflow.md). For local development or other scenarios, you can use Visual Studio Code, Azure PowerShell, Azure CLI, and other tools.

For more information, see the following resources:

- [What is Azure Logic Apps?](logic-apps-overview.md)
- [Azure Logic Apps](https://azure.microsoft.com/services/logic-apps/)
- [Single-tenant versus multitenant in Azure Logic Apps](single-tenant-overview-compare.md)
- [Training: Introduction to Azure Logic Apps](/training/modules/intro-to-logic-apps/)
- [Training: Route and process data as automated workflows using Azure Logic Apps](/training/modules/route-and-process-data-logic-apps/)

## Azure Functions

This service provides a simplified way for you to write and run pieces of code or *functions* in the cloud. You can write only the code that you need for the current problem, without setting up a complete app or the required infrastructure, making development faster and more productive. You can use your preferred development language, such as C#, Java, JavaScript, PowerShell, Python, and TypeScript. You're billed only for the duration when your code runs, and Azure scales as necessary.

To get up and running quickly, create your function app and functions by starting with the Azure portal as your entry point and follow the [creating your first Azure function in the Azure portal](../azure-functions/functions-create-function-app-portal.md).

For more information, see the following resources:

- [What is Azure Functions?](../azure-functions/functions-overview.md)
- [Azure Functions](https://azure.microsoft.com/services/functions/)
- [Getting started with Azure Functions](../azure-functions/functions-get-started.md)
- [Compare Azure Functions and Azure Logic Apps](../azure-functions/functions-compare-logic-apps-ms-flow-webjobs.md#compare-azure-functions-and-azure-logic-apps)
- [Training: Introduction to Azure Functions](/training/modules/intro-azure-functions/)
- [Training: Create serverless logic with Azure Functions](/training/modules/create-serverless-logic-with-azure-functions/)

## Related content

- [Tutorial: Create workflows that process emails using Azure Logic Apps, Azure Functions, and Azure Storage](tutorial-process-email-attachments-workflow.md)
- [Choose the right integration and automation services in Azure](../azure-functions/functions-compare-logic-apps-ms-flow-webjobs.md)
