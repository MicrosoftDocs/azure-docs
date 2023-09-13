---
title: Examples & common scenarios
description: Review examples, common scenarios, tutorials, and walkthroughs for Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: conceptual
ms.date: 03/07/2023
---

# Common scenarios, examples, tutorials, and walkthroughs for Azure Logic Apps

[Azure Logic Apps](logic-apps-overview.md) helps you orchestrate and integrate different services by providing hundreds of prebuilt and ready-to-use connectors, ranging from SQL Server and SAP to Azure AI services. Azure Logic Apps is "serverless", so you don't have to worry about scale or instances. All you have to do is define a workflow with a trigger and the actions that the workflow performs. The underlying platform handles scale, availability, and performance. Azure Logic Apps is especially useful for use cases and scenarios where you need to coordinate actions across multiple systems and services.

To help you learn about the capabilities and patterns that Azure Logic Apps supports, this guide describes common starting points, examples, and scenarios.

## Common starting points for logic app workflows

Every workflow starts with a single [*trigger*](logic-apps-overview.md#logic-app-concepts), which fires when the trigger condition is met, runs the workflow, and passes along any trigger outputs to subsequent actions in the workflow. Many connectors provide triggers, which have either of the following types:

* *Polling* trigger: Checks a service endpoint for data or an event that meets the trigger condition, based on the specified schedule. If the trigger condition is met at that time, the trigger fires, creating and running a new workflow instance that uses any trigger outputs as inputs for the workflow.

* *Push* trigger: Listens and waits at a service endpoint for data or an event that meets the trigger condition. At that time, the trigger fires immediately, creating and running a new workflow instance that uses any trigger outputs as inputs for the workflow.

### Polling trigger examples

| Trigger | Description | More information |
|---------|-------------|------------------|
| [**Recurrence** trigger](../connectors/connectors-native-recurrence.md) | Set the recurrence for running your workflow, including the start date and time. For example, you can select the days of the week and times of day. | - [Schedule and run recurring automated tasks, processes, and workflows with Azure Logic Apps](concepts-schedule-automated-recurring-tasks-workflows.md) <br><br>- [Tutorial: Create automated, schedule-based recurring workflows by using Azure Logic Apps](tutorial-build-schedule-recurring-logic-app-workflow.md) |
| **When an email is received** | Check for new email from any mail provider that's supported by Azure Logic Apps, for example, [Office 365 Outlook](../connectors/connectors-create-api-office365-outlook.md), [Gmail](/connectors/gmail/), [Outlook.com](/connectors/outlook/), and so on. | **Important**: If you want to use the Gmail connector, only G-Suite business accounts can use this connector without restriction in Azure Logic Apps. If you have a Gmail consumer account, you can use this connector with only specific Google-approved services, or you can [create a Google client app to use for authentication with your Gmail connector](/connectors/gmail/#authentication-and-bring-your-own-application). For more information, see [Data security and privacy policies for Google connectors in Azure Logic Apps](../connectors/connectors-google-data-security-privacy-policy.md). <br><br>For tutorials about email-related triggers, see the following documentation: <br><br>- [Tutorial: Create automated approval-based workflows by using Azure Logic Apps](tutorial-process-mailing-list-subscriptions-workflow.md) <br><br>- [Tutorial: Automate tasks to process emails by using Azure Logic Apps, Azure Functions, and Azure Storage](tutorial-process-email-attachments-workflow.md)
| [**HTTP** trigger](../connectors/connectors-native-http.md) | Call a service endpoint over HTTP or HTTPS. | [Call, trigger, or nest workflows by using HTTP endpoints](logic-apps-http-endpoint.md) |

### Push trigger examples

| Trigger | Description |
|---------|-------------|
| [**Request** trigger](../connectors/connectors-native-reqres.md) | Receive incoming HTTPS requests. |
| [**HTTP Webhook** trigger](../connectors/connectors-native-webhook.md) | Subscribe to a service endpoint by registering a *callback URL* with that service. That way, the service can just notify the trigger when the specified event happens, so that the trigger doesn't need to poll the service. |

After you add the trigger, continue building your workflow by adding one or more actions. The following quickstarts help you build your first Consumption logic app workflow, which runs in global, multi-tenant Azure Logic Apps:

* [Quickstart: Create an example Consumption logic app workflow in multi-tenant Azure Logic Apps - Azure portal](quickstart-create-example-consumption-workflow.md)
* [Quickstart: Create automated tasks, processes, and workflows by using Azure Logic Apps - Visual Studio](quickstart-create-logic-apps-with-visual-studio.md)
* [Quickstart: Create and manage automated logic app workflows by using Visual Studio Code](quickstart-create-logic-apps-visual-studio-code.md)

The following how-to guides help you build a Standard logic app workflow that runs in single-tenant Azure Logic Apps:

* [Create an example Standard logic app workflow in single-tenant Azure Logic Apps - Azure portal](create-single-tenant-workflows-azure-portal.md)
* [Create an example Standard logic app workflow in single-tenant Azure Logic Apps - Visual Studio Code](create-single-tenant-workflows-visual-studio-code.md)

## Control flow and error handling capabilities

Azure Logic Apps includes rich capabilities for advanced control flow, such as conditions, switches, loops, and scopes. To ensure resilient solutions, you can also implement error and exception handling in your workflows.

* Perform different actions based on [conditional statements](logic-apps-control-flow-conditional-statement.md)
and [switch statements](logic-apps-control-flow-switch-statement.md)
* [Repeat steps or process items in arrays and collections with loops](logic-apps-control-flow-loops.md)
* [Group actions together with scopes](logic-apps-control-flow-run-steps-group-scopes.md)
* [Add error and exception handling to a workflow](logic-apps-exception-handling.md)

## Create custom APIs and connectors

For systems and services that don't have published connectors, you can also extend Azure Logic Apps to create custom APIs and connectors:

* [Create custom APIs to call from Azure Logic Apps](logic-apps-create-api-app.md)
* [Custom connectors in Azure Logic Apps](custom-connector-overview.md)

## Build business-to-business (B2B) solutions

For enterprise integration solutions and seamless communication between organizations, you can build automated scalable workflows for these scenarios by using the Enterprise Integration Pack (EIP) with Azure Logic Apps. Although organizations use different protocols and formats, they can exchange messages electronically. The EIP transforms different formats into a format that your organizations' systems can process and supports industry-standard protocols, including AS2, X12, EDIFACT, and RosettaNet. To build these solutions, you create an integration account, which is a separate Azure resource that provides a secure, scalable, and manageable container for the artifacts that you define and use with your logic app workflows. For example, artifacts include trading partners, agreements, maps, schemas, certificates, and batch configurations.

* [Overview: B2B enterprise integration solutions with Azure Logic Apps and Enterprise Integration Pack](../logic-apps/logic-apps-enterprise-integration-overview.md)
* [Create and manage integration accounts for B2B enterprise integrations in Azure Logic Apps](../logic-apps/logic-apps-enterprise-integration-create-integration-account.md)

## Access Azure virtual network resources

Sometimes, your logic app workflow might need access to secured resources, such as virtual machines (VMs) in an Azure virtual network. To directly access such resources, [create a Standard logic app workflow](create-single-tenant-workflows-azure-portal.md). This type of logic app workflow runs in single-tenant Azure Logic Apps, separately from Consumption logic app workflows in multi-tenant Azure Logic Apps, and uses dedicated storage and other resources. With this option, you can reduce the impact that other Azure tenants might have on your apps' performance, which is also known as the "noisy neighbors" effect.

> [!IMPORTANT]
>
> On August 31, 2024, the Integration Service Environment (ISE) resource will retire, due to its dependency on Azure Cloud Services (classic), 
> which retires at the same time. Before the retirement date, export any logic app resources from your ISE to Standard logic app workflows so that you can avoid 
> service disruption. Standard logic app workflows run in single-tenant Azure Logic Apps and provide the same capabilities plus more.
>
> Starting November 1, 2022, you can no longer create new ISE resources. However, ISE resources existing 
> before this date are supported through August 31, 2024. For more information, see the following resources:
>
> - [ISE Retirement - what you need to know](https://techcommunity.microsoft.com/t5/integrations-on-azure-blog/ise-retirement-what-you-need-to-know/ba-p/3645220)
> - [Single-tenant versus multi-tenant and integration service environment for Azure Logic Apps](single-tenant-overview-compare.md)
> - [Azure Logic Apps pricing](https://azure.microsoft.com/pricing/details/logic-apps/)
> - [Export ISE workflows to a Standard logic app](export-from-ise-to-standard-logic-app.md)
> - [Integration Service Environment will be retired on 31 August 2024 - transition to Azure Logic Apps Standard](https://azure.microsoft.com/updates/integration-services-environment-will-be-retired-on-31-august-2024-transition-to-logic-apps-standard/)
> - [Cloud Services (classic) deployment model is retiring on 31 August 2024](https://azure.microsoft.com/updates/cloud-services-retirement-announcement/)

## Deploy, manage, and monitor logic app workflows

You can fully develop and deploy logic app resources with Visual Studio, Azure DevOps, or any other source control and automated build tools. To support deployment for workflows and dependent connections in a resource template, logic app resources use Azure resource deployment templates. Visual Studio tools automatically generate these templates, which you can check in to source control for versioning. For notification and diagnostic logs for workflow run status, Azure Logic Apps also provides monitoring and alerts.

### Deploy

* [Quickstart: Create automated tasks, processes, and workflows by using Azure Logic Apps - Visual Studio](../logic-apps/quickstart-create-logic-apps-with-visual-studio.md)
* [Overview: Automate logic app deployment](../logic-apps/logic-apps-azure-resource-manager-templates-overview.md)
* [Create Azure Resource Manager templates to automate deployment for Azure Logic Apps](../logic-apps/logic-apps-create-azure-resource-manager-templates.md)
* [Deploy Azure Resource Manager templates for Azure Logic Apps](../logic-apps/logic-apps-deploy-azure-resource-manager-templates.md)
* [Sample: Set up an API Management action for Azure Logic Apps](https://github.com/Azure-Samples/azure-logic-apps-deployment-samples/tree/master/api-management-actions)
* [Sample: Orchestrate Azure Pipelines by using Azure Logic Apps](https://github.com/Azure-Samples/azure-logic-apps-pipeline-orchestration)
* [Sample: Connect to Azure Storage accounts from Azure Logic Apps and deploy with Azure Pipelines in Azure DevOps](https://github.com/Azure-Samples/azure-logic-apps-deployment-samples/tree/master/storage-account-connections)
* [Sample: Connect to Azure Service Bus queues from Azure Logic Apps and deploy with Azure Pipelines in Azure DevOps](https://github.com/Azure-Samples/azure-logic-apps-deployment-samples/tree/master/service-bus-connections)
* [Sample: Set up an Azure Functions action for Azure Logic Apps and deploy with Azure Pipelines in Azure DevOps](https://github.com/Azure-Samples/azure-logic-apps-deployment-samples/tree/master/function-app-actions)
* [Sample: Connect to an integration account from Azure Logic Apps and deploy with Azure Pipelines in Azure DevOps](https://github.com/Azure-Samples/azure-logic-apps-deployment-samples/tree/master/integration-account-connections)

### Manage

* [Plan and manage costs](plan-manage-costs.md)
* [Manage logic apps in the Azure portal](manage-logic-apps-with-azure-portal.md)
* [Manage logic apps with Visual Studio](manage-logic-apps-with-visual-studio.md)
* [Create and manage integration accounts for B2B enterprise integrations](logic-apps-enterprise-integration-create-integration-account.md)
* [Move logic app resources to other Azure resource groups, regions, or subscriptions](move-logic-app-resources.md)

### Monitor

* [Monitor run status, review trigger history, and set up alerts for Azure Logic Apps](monitor-logic-apps.md)
* [View health and performance metrics](view-workflow-metrics.md)
* [Monitor and collect diagnostic data for workflows in Azure Logic Apps](monitor-workflows-collect-diagnostic-data.md)
* [Monitor logic app workflows in Microsoft Defender for Cloud](healthy-unhealthy-resource.md)
* [Monitor B2B messages with Azure Monitor Logs in Azure Logic Apps](monitor-b2b-messages-log-analytics.md)
* [Create monitoring and tracking queries in Azure Monitor Logs for Azure Logic Apps](create-monitoring-tracking-queries.md)

## Handle content types, conversions, and transformations

You can access, convert, and transform multiple content types by using the many functions in the Azure Logic Apps [workflow definition language](./logic-apps-workflow-definition-language.md). For example, you can convert between a string, JSON, and XML with the `@json()` and `@xml()` workflow expressions. Azure Logic Apps preserves content types to support content transfer in a lossless manner between services.

* [Handle content types in Azure Logic Apps](../logic-apps/logic-apps-content-type.md), such as `application/`, `application/octet-stream`, and `multipart/formdata`
* [Reference guide to using functions in expressions for Azure Logic Apps and Power Automate](../logic-apps/workflow-definition-language-functions-reference.md)
* [Workflow Definition Language schema for Azure Logic Apps](../logic-apps/logic-apps-workflow-definition-language.md)

## Other integrations and capabilities

Azure Logic Apps integrates with many services, such as Azure Functions, Azure API Management, Azure App Service, and custom HTTP endpoints, for example, REST and SOAP.

* [Call Azure Functions from Azure Logic Apps](../logic-apps/logic-apps-azure-functions.md)
* [Tutorial: Call or trigger logic app workflows by using Azure Functions and Azure Service Bus](../logic-apps/logic-apps-scenario-function-sb-trigger.md)
* [Tutorial: Create a streaming customer insights dashboard with Azure Logic Apps and Azure Functions](../logic-apps/logic-apps-scenario-social-serverless.md)
* [Tutorial: Create a function that integrates with Azure Logic Apps and Azure AI services to analyze Twitter post sentiment](../azure-functions/functions-twitter-email.md)
* [Tutorial: Build an AI-powered social dashboard by using Power BI and Azure Logic Apps](/shows/)
* [Tutorial: Monitor virtual machine changes by using Azure Event Grid and Logic Apps](../event-grid/monitor-virtual-machine-changes-logic-app.md)
* [Tutorial: IoT remote monitoring and notifications with Azure Logic Apps connecting your IoT hub and mailbox](../iot-hub/iot-hub-monitoring-notifications-with-azure-logic-apps.md)
* [Blog: Call SOAP services by using Azure Logic Apps](/archive/blogs/logicapps/using-soap-services-with-logic-apps)

## End-to-end scenarios

* [Whitepaper: End-to-end case management integration with Azure services, such as Azure Logic Apps](https://aka.ms/enterprise-integration-e2e-case-management-utilities-logic-apps)

## Customer stories

Learn how Azure Logic Apps, along with other Azure services and Microsoft products, helped [these companies](https://aka.ms/logic-apps-customer-stories) improve their agility and focus on their core businesses by simplifying, organizing, automating, and orchestrating complex processes.

## Next steps

* [What are connectors in Azure Logic Apps](../connectors/introduction.md)
* [B2B enterprise integration scenarios with Azure Logic Apps](logic-apps-enterprise-integration-overview.md)
