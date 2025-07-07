---
title: Examples & common scenarios
description: Review examples, common scenarios, tutorials, and walkthroughs for Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: conceptual
ms.date: 03/21/2025
---

# Common scenarios, examples, tutorials, and walkthroughs for Azure Logic Apps

[Azure Logic Apps](/azure/logic-apps/logic-apps-overview) helps you orchestrate and integrate different services, systems, apps, and data by providing [1,400+ prebuilt and ready-to-use connectors](/connectors/connector-reference/connector-reference-logicapps-connectors) for Azure services, Microsoft services, GitHub, SQL Server, SAP, Salesforce, and more. Azure Logic Apps is a "serverless" integration platform, meaning you don't need to provide your own infrastructure nor manage scaling for your application instances. You can focus your energy and effort on designing the logic for your integration solutions and building your automated workflows. The platform handles scale, availability, and performance. Azure Logic Apps is especially useful for use cases and scenarios where you need to coordinate actions across multiple systems and services.

To help you learn about the capabilities and patterns that Azure Logic Apps supports, this guide describes common starting points, examples, and scenarios.

## Common starting points for logic app workflows

Every workflow starts with a [*trigger*](logic-apps-overview.md#logic-app-concepts), which fires either on a specified schedule or when the trigger condition is met. When the trigger fires, subsequent actions run in the workflow, and pass along any trigger outputs to these actions. Many connectors provide triggers, which have either of the following types:

* *Polling* trigger: Based on the specified schedule, this trigger checks an endpoint for data or an event that meets the trigger condition. If the trigger condition is met, the trigger fires, creates, and runs a new workflow instance. Any trigger outputs pass as inputs to the first action in the workflow.

* *Push* trigger: This trigger waits for an event that meets the trigger condition to happen at the specified endpoint. For example, events might include ,  to receive a request, a message, or a file created or updated at the endpoint location. When this event happens, the trigger fires, creates, and runs a new workflow instance. Any trigger outputs pass as inputs to the first action in the workflow.

### Polling trigger examples

| Trigger | Description | More information |
|---------|-------------|------------------|
| [**Recurrence** trigger](/azure/connectors/connectors-native-recurrence) | Set the recurrence for running your workflow, including the start date and time. For example, you can select the days of the week and times of day. | - [Schedule and run recurring automated tasks, processes, and workflows with Azure Logic Apps](concepts-schedule-automated-recurring-tasks-workflows.md) <br><br>- [Tutorial: Create automated, schedule-based recurring workflows by using Azure Logic Apps](tutorial-build-schedule-recurring-logic-app-workflow.md) |
| **When an email is received** | Check for new email from any mail provider that's supported by Azure Logic Apps, for example, [Office 365 Outlook](../connectors/connectors-create-api-office365-outlook.md), [Gmail](/connectors/gmail/), [Outlook.com](/connectors/outlook/), and so on. | **Important**: If you want to use the Gmail connector, only G-Suite business accounts can use this connector without restriction in Azure Logic Apps. If you have a Gmail consumer account, you can use this connector with only specific Google-approved services, or you can [create a Google client app to use for authentication with your Gmail connector](/connectors/gmail/#authentication-and-bring-your-own-application). For more information, see [Data security and privacy policies for Google connectors in Azure Logic Apps](../connectors/connectors-google-data-security-privacy-policy.md). <br><br>For tutorials about email-related triggers, see the following documentation: <br><br>- [Tutorial: Create automated approval-based workflows by using Azure Logic Apps](tutorial-process-mailing-list-subscriptions-workflow.md) <br><br>- [Tutorial: Automate tasks to process emails by using Azure Logic Apps, Azure Functions, and Azure Storage](tutorial-process-email-attachments-workflow.md)
| [**HTTP** trigger](../connectors/connectors-native-http.md) | Call a service endpoint over HTTP or HTTPS. | [Call, trigger, or nest workflows by using HTTP endpoints](logic-apps-http-endpoint.md) |

### Push trigger examples

| Trigger | Description |
|---------|-------------|
| [**Request** trigger](../connectors/connectors-native-reqres.md) | Receive incoming HTTPS requests. |
| [**HTTP Webhook** trigger](../connectors/connectors-native-webhook.md) | Subscribe to a service endpoint by registering a *callback URL* with that service. That way, the service can just notify the trigger when the specified event happens, so that the trigger doesn't need to poll the service. |

After you add the trigger, continue building your workflow by adding one or more actions. The following how-to guides help you build your first Consumption logic app workflow, which runs in global, multitenant Azure Logic Apps:

* [Quickstart: Create an example Consumption workflow in multitenant Azure Logic Apps with Azure portal](quickstart-create-example-consumption-workflow.md)
* [Quickstart: Create and manage Consumption workflows with Visual Studio Code](quickstart-create-logic-apps-visual-studio-code.md)

The following how-to guides help you build a Standard logic app workflow that runs in single-tenant Azure Logic Apps:

* [Create an example Standard workflow in single-tenant Azure Logic Apps with Azure portal](create-single-tenant-workflows-azure-portal.md)
* [Create an example Standard workflow in single-tenant Azure Logic Apps with Visual Studio Code](create-standard-workflows-visual-studio-code.md)

The following how-to guides help you set up infrastructure and build a Standard logic app workflow that runs in a partially connected environment using your own infrastructure:

* [Set up your own infrastructure for Standard workflows using hybrid deployment ](set-up-standard-workflows-hybrid-deployment-requirements.md)
* [Create Standard workflows for hybrid deployment on your own infrastructure](create-standard-workflows-hybrid-deployment.md)

## Migrate to Azure Logic Apps

* [Why migrate from BizTalk Server](biztalk-server-migration-overview.md)
* [Migration options for BizTalk Server and best practices](biztalk-server-migration-approaches.md)
* [Power Automate migration to Azure Logic Apps (Standard)](power-automate-migration.md)

## Control flow and error handling capabilities

Azure Logic Apps includes rich capabilities for advanced control flow, such as conditions, switches, loops, and scopes. To ensure resilient solutions, you can also implement error and exception handling in your workflows.

* Perform different actions based on [conditional statements](logic-apps-control-flow-conditional-statement.md) and [switch statements](logic-apps-control-flow-switch-statement.md)
* [Repeat steps or process items in arrays and collections with loops](logic-apps-control-flow-loops.md)
* [Group actions together with scopes](logic-apps-control-flow-run-steps-group-scopes.md)
* [Add error and exception handling to a workflow](logic-apps-exception-handling.md)

## Run code from your workflows

* [Add and run JavaScript snippets in workflows](add-run-javascript.md)
* [Call Azure Functions from workflows](call-azure-functions-from-workflows.md)
* [Create and run .NET code from Standard workflows](create-run-custom-code-functions.md)
* [Create and run C# scripts from Standard workflows ](add-run-csharp-scripts.md)
* [Create and run PowerShell scripts from Standard workflows ](add-run-powershell-scripts.md)

## Secure your workflows

* [Secure access and data for workflows](logic-apps-securing-a-logic-app.md)
* [Authenticate access and connections to Azure resources from workflows using managed identities ](authenticate-with-managed-identity.md)
* [Block connector usage](block-connections-connectors.md)
* [Block connections to and from other tenants](block-connections-across-tenants.md)

## Reliability

* [Reliability in Azure Logic Apps](../reliability/reliability-logic-apps.md)
* [Enable zone-redundancy for your logic app](set-up-zone-redundancy-availability-zones.md)
* [Create replication tasks for Azure resources using Azure Logic Apps](create-replication-tasks-azure-resources.md)
* [Set up cross-region disaster recovery for integration accounts in Azure Logic Apps](logic-apps-enterprise-integration-b2b-business-continuity.md)

## Integrate with Azure AI services and capabilities

* [AI playbook, examples, and other resources for workflows in Azure Logic Apps](ai-resources.md)
* [Parse or chunk content from workflows](parse-document-chunk-text.md)
* [Connect to Azure AI services from Standard workflows in Azure Logic Apps](/azure/logic-apps/connectors/azure-ai)

## Handle content types, conversions, and transformations

You can access, convert, and transform multiple content types by using the many functions in the Azure Logic Apps [workflow definition language](logic-apps-workflow-definition-language.md). For example, you can convert between a string, JSON, and XML with the `@json()` and `@xml()` workflow expressions. Azure Logic Apps preserves content types to support content transfer in a lossless manner between services.

* [Handle content types in Azure Logic Apps](logic-apps-content-type.md), such as `application/`, `application/octet-stream`, and `multipart/formdata`
* [Reference guide to using functions in expressions for Azure Logic Apps and Power Automate](workflow-definition-language-functions-reference.md)
* [Workflow Definition Language schema for Azure Logic Apps](logic-apps-workflow-definition-language.md)

## Create custom APIs and connectors

For systems and services that don't have published connectors, you can also extend Azure Logic Apps to create custom APIs and connectors:

* [Create custom APIs to call from Azure Logic Apps](logic-apps-create-api-app.md)
* [Custom connectors in Azure Logic Apps](custom-connector-overview.md)

## Build business-to-business (B2B) solutions

For enterprise integration solutions and seamless communication between organizations, you can build automated scalable workflows for these scenarios by using the Enterprise Integration Pack (EIP) with Azure Logic Apps. Although organizations use different protocols and formats, they can exchange messages electronically. The EIP transforms different formats into a format that your organizations' systems can process and supports industry-standard protocols, including AS2, X12, EDIFACT, and RosettaNet. To build these solutions, you create an integration account, which is a separate Azure resource that provides a secure, scalable, and manageable container for the artifacts that you define and use with your logic app workflows. For example, artifacts include trading partners, agreements, maps, schemas, certificates, and batch configurations.

* [Overview: B2B enterprise integration solutions with Azure Logic Apps and Enterprise Integration Pack](logic-apps-enterprise-integration-overview.md)
* [Create and manage integration accounts for B2B enterprise integrations in Azure Logic Apps](logic-apps-enterprise-integration-create-integration-account.md)
* [Decision management and business logic integration with the Azure Logic Apps Rules Engine](rules-engine/rules-engine-overview.md)

## Access Azure virtual network resources

Sometimes, your logic app workflow might need access to secured resources, such as virtual machines (VMs) in an Azure virtual network. To directly access such resources, [create a Standard logic app workflow](create-single-tenant-workflows-azure-portal.md). This type of logic app workflow runs in single-tenant Azure Logic Apps, separately from Consumption logic app workflows in multitenant Azure Logic Apps, and uses dedicated storage and other resources. With this option, you can reduce the impact that other Azure tenants might have on your apps' performance, which is also known as the "noisy neighbors" effect.

## Deploy, manage, and monitor logic app workflows

You can fully develop and deploy logic app resources with Azure DevOps or any other source control and automated build tools. To support deployment for workflows and dependent connections in a resource template, logic app resources use Azure resource deployment templates. For notification and diagnostic logs for workflow run status, Azure Logic Apps also provides monitoring and alerts.

### Deploy

* [Set up deployment slots to enable zero downtime deployment in single-tenant Azure Logic Apps](/azure/logic-apps/set-up-deployment-slots)
* [DevOps deployment for Standard logic apps in single-tenant Azure Logic Apps](/azure/logic-apps/devops-deployment-single-tenant-azure-logic-apps)
* [Set up DevOps deployment for Standard logic apps in single-tenant Azure Logic Apps](/azure/logic-apps/set-up-devops-deployment-single-tenant-azure-logic-apps)
* [Automate build and deployment with Azure DevOps for Standard logic apps](/azure/logic-apps/automate-build-deployment-standard)
* [Overview: Automate logic app deployment with Azure Resource Manager templates](logic-apps-azure-resource-manager-templates-overview.md)
* [Create Azure Resource Manager templates to automate deployment for Azure Logic Apps](logic-apps-create-azure-resource-manager-templates.md)
* [Streamline deployment for Azure integration services with Azure Verified Modules for Bicep](/community/content/deploy-azure-integration-services-with-azure-verified-modules)
* [Deploy Azure Resource Manager templates for Azure Logic Apps](logic-apps-deploy-azure-resource-manager-templates.md)
* [Sample: Set up an API Management action for Azure Logic Apps](https://github.com/Azure-Samples/azure-logic-apps-deployment-samples/tree/master/api-management-actions)
* [Sample: Orchestrate Azure Pipelines by using Azure Logic Apps](https://github.com/Azure-Samples/azure-logic-apps-pipeline-orchestration)
* [Sample: Connect to Azure Storage accounts from Azure Logic Apps and deploy with Azure Pipelines in Azure DevOps](https://github.com/Azure-Samples/azure-logic-apps-deployment-samples/tree/master/storage-account-connections)
* [Sample: Connect to Azure Service Bus queues from Azure Logic Apps and deploy with Azure Pipelines in Azure DevOps](https://github.com/Azure-Samples/azure-logic-apps-deployment-samples/tree/master/service-bus-connections)
* [Sample: Set up an Azure Functions action for Azure Logic Apps and deploy with Azure Pipelines in Azure DevOps](https://github.com/Azure-Samples/azure-logic-apps-deployment-samples/tree/master/function-app-actions)
* [Sample: Connect to an integration account from Azure Logic Apps and deploy with Azure Pipelines in Azure DevOps](https://github.com/Azure-Samples/azure-logic-apps-deployment-samples/tree/master/integration-account-connections)

### Manage

* [Plan and manage costs](plan-manage-costs.md)
* [Manage logic apps in the Azure portal](manage-logic-apps-with-azure-portal.md)
* [Manage logic apps in Visual Studio Code](manage-logic-apps-visual-studio-code.md)
* [Create and manage integration accounts for B2B enterprise integrations](logic-apps-enterprise-integration-create-integration-account.md)
* [Manage Azure resources and monitor costs by creating automation tasks](create-automation-tasks-azure-resources.md)
* [Move logic app resources to other Azure resource groups, regions, or subscriptions](move-logic-app-resources.md)

### Monitor

* [Monitor workflows in Azure Logic Apps](monitor-logic-apps-overview.md)
* [Monitor run status, review trigger history, and set up alerts for Azure Logic Apps](view-workflow-status-run-history.md)
* [View health and performance metrics](view-workflow-metrics.md)
* [Monitor and collect diagnostic data for workflows in Azure Logic Apps](monitor-workflows-collect-diagnostic-data.md)
* [Monitor logic app workflows in Microsoft Defender for Cloud](healthy-unhealthy-resource.md)

##### Monitor Consumption workflows

* [Monitor and track B2B messages in Consumption workflows](monitor-track-b2b-messages-consumption.md)
* [Create monitoring and tracking queries in Azure Monitor Logs for Azure Logic Apps](create-monitoring-tracking-queries.md)

##### Monitor Standard workflows

* [Monitor health for Standard workflows in Azure Logic Apps with Health Check](monitor-health-standard-workflows.md)
* [Enable and view enhanced telemetry in Application Insights for Standard workflows](enable-enhanced-telemetry-standard-workflows.md)
* [Monitor and track B2B transactions in Standard workflows](monitor-track-b2b-transactions-standard.md)

## Other integrations and capabilities

Azure Logic Apps integrates with many services, such as Azure API Management, Azure App Service, and custom HTTP endpoints, for example, REST and SOAP.

* [Tutorial: Create a streaming customer insights dashboard with Azure Logic Apps and Azure Functions](logic-apps-scenario-social-serverless.md)
* [Tutorial: Create a function that integrates with Azure Logic Apps and Azure AI services to analyze X post sentiment](../azure-functions/functions-twitter-email.md)
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
