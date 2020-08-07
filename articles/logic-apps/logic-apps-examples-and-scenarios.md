---
title: Examples & common scenarios
description: Find examples, common scenarios, tutorials, and walkthroughs for Azure Logic Apps
services: logic-apps
ms.suite: integration
ms.reviewer: klam, logicappspm
ms.topic: conceptual
ms.date: 02/28/2020
---

# Common scenarios, examples, tutorials, and walkthroughs for Azure Logic Apps

[Azure Logic Apps](../logic-apps/logic-apps-overview.md) helps you orchestrate and integrate different services by providing [hundreds of ready-to-use connectors](../connectors/apis-list.md), ranging from SQL Server or SAP to Azure Cognitive Services. The Logic Apps service is "serverless", so you don't have to worry about scale or instances. All you have to do is define the workflow with a trigger and the actions that the workflow performs. The underlying platform handles scale, availability, and performance. Logic Apps is especially useful for use cases and scenarios where you need to coordinate actions across multiple systems and services.

To help you learn about the capabilities and patterns that Azure Logic Apps supports, this article describes common starting points, examples, and scenarios.

## Common starting points for logic app workflows

Every logic app starts with a [*trigger*](../logic-apps/logic-apps-overview.md#logic-app-concepts), and only one trigger, which starts your logic app workflow and passes in any data as part of that trigger. Some connectors provide triggers, which come in these types:

* *Polling triggers*: Regularly checks a service endpoint for new data. When new data exists, the trigger creates and runs a new workflow instance with the data as input.

* *Push triggers*: Listens for data at a service endpoint and waits until a specific event happens. When the event happens, the trigger fires immediately, creating and running a new workflow instance that uses any available data as input.

Here are examples that describe commonly-used triggers:

* *Polling* triggers:

  * [**Recurrence** trigger](../connectors/connectors-native-recurrence.md) lets you set the start date and time plus the recurrence for firing your logic app. For example, you can select the days of the week and times of day for triggering your logic app. For more information, see these topics:<p>

    * [Schedule and run recurring automated tasks, processes, and workflows with Azure Logic Apps](../logic-apps/concepts-schedule-automated-recurring-tasks-workflows.md)
    * [Tutorial: Create automated, schedule-based recurring workflows by using Azure Logic Apps](../logic-apps/tutorial-build-schedule-recurring-logic-app-workflow.md)

  * The **When an email is received** trigger lets your logic app check for new email from any mail provider that's supported by Logic Apps, for example, [Office 365 Outlook](../connectors/connectors-create-api-office365-outlook.md), [Gmail](https://docs.microsoft.com/connectors/gmail/), [Outlook.com](https://docs.microsoft.com/connectors/outlook/), and so on.

    > [!IMPORTANT]
    > If you want to use the Gmail connector, only G-Suite business accounts can use this connector without restriction in logic apps. 
    > If you have a Gmail consumer account, you can use this connector with only specific Google-approved services, or you can 
    > [create a Google client app to use for authentication with your Gmail connector](https://docs.microsoft.com/connectors/gmail/#authentication-and-bring-your-own-application). 
    > For more information, see [Data security and privacy policies for Google connectors in Azure Logic Apps](../connectors/connectors-google-data-security-privacy-policy.md).

    For more information, see these topics:<p>

    * [Tutorial: Create automated approval-based workflows by using Azure Logic Apps](../logic-apps/tutorial-process-mailing-list-subscriptions-workflow.md)
    * [Tutorial: Automate tasks to process emails by using Azure Logic Apps, Azure Functions, and Azure Storage](../logic-apps/tutorial-process-email-attachments-workflow.md)

  * The [**HTTP** trigger](../connectors/connectors-native-http.md) can call a service endpoint over HTTP or HTTPS. For more information, see [Call, trigger, or nest workflows by using HTTP endpoints](../logic-apps/logic-apps-http-endpoint.md).

* *Push* triggers:

  * The [**Request** trigger](../connectors/connectors-native-reqres.md) can receive incoming HTTPS requests.

  * The [**HTTP Webhook** trigger](../connectors/connectors-native-webhook.md) subscribes to a service endpoint by registering a *callback URL* with that service. That way, the service can just notify the trigger when the specified event happens, so that the trigger doesn't need to poll the service.

After the specified event happens, the trigger fires, which creates a new logic app workflow instance and runs the actions in the workflow. You can access any data from the trigger throughout the workflow. For example, the Twitter **On a new tweet** trigger passes the tweet content into the logic app run. To get started with Azure Logic Apps, try these quickstart topics:

* [Quickstart: Create your first automated workflow by using Azure Logic Apps - Azure portal](../logic-apps/quickstart-create-first-logic-app-workflow.md)
* [Quickstart: Create automated tasks, processes, and workflows by using Azure Logic Apps - Visual Studio](../logic-apps/quickstart-create-logic-apps-with-visual-studio.md)
* [Quickstart: Create and manage automated logic app workflows by using Visual Studio Code](../logic-apps/quickstart-create-logic-apps-visual-studio-code.md)

## Control flow and error handling capabilities

Logic apps include rich capabilities for advanced control flow, such as conditions, switches, loops, and scopes. To ensure resilient solutions, you can also implement error and exception handling in your workflows.

* Perform different actions based on [conditional statements](../logic-apps/logic-apps-control-flow-conditional-statement.md)
and [switch statements](../logic-apps/logic-apps-control-flow-switch-statement.md)
* [Repeat steps or process items in arrays and collections with loops](../logic-apps/logic-apps-control-flow-loops.md)
* [Group actions together with scopes](../logic-apps/logic-apps-control-flow-run-steps-group-scopes.md)
* [Add error and exception handling to a workflow](../logic-apps/logic-apps-exception-handling.md)
* [Use case: How a healthcare company uses logic app exception handling for HL7 FHIR workflows](../logic-apps/logic-apps-scenario-error-and-exception-handling.md)

## Create custom APIs and connectors

For systems and services that don't have published connectors, you can also extend logic apps.

* [Create custom APIs to call from Azure Logic Apps](../logic-apps/logic-apps-create-api-app.md)
* [Check for new data or events regularly by using the polling trigger pattern](../logic-apps/logic-apps-create-api-app.md#polling-triggers)
* [Wait and listen for new data or events by using the webhook trigger pattern](../logic-apps/logic-apps-create-api-app.md#webhook-triggers)
* [Perform long running-tasks by using the polling action pattern](../logic-apps/logic-apps-create-api-app.md#async-pattern)
* [Perform long-running tasks by using the webhook action pattern](../logic-apps/logic-apps-create-api-app.md#webhook-actions)
* [Custom connectors in Azure Logic Apps](../logic-apps/custom-connector-overview.md)

## Build business-to-business (B2B) solutions

For enterprise integration solutions and seamless communication between organizations, you can build automated scalable workflows for these scenarios by using the Enterprise Integration Pack (EIP) with Azure Logic Apps. Although organizations use different protocols and formats, they can exchange messages electronically. The EIP transforms different formats into a format that your organizations' systems can process and supports industry-standard protocols, including AS2, X12, EDIFACT, and RosettaNet. To build these solutions, you create an integration account, which is a separate Azure resource that provides a secure, scalable, and manageable container for the artifacts that you define and use with your logic app workflows. For example, artifacts include trading partners, agreements, maps, schemas, certificates, and batch configurations.

* [Overview: B2B enterprise integration solutions with Azure Logic Apps and Enterprise Integration Pack](../logic-apps/logic-apps-enterprise-integration-overview.md)
* [Create and manage integration accounts for B2B enterprise integrations in Azure Logic Apps](../logic-apps/logic-apps-enterprise-integration-create-integration-account.md)

## Access Azure virtual network resources

Sometimes, your logic apps and integration accounts need access to secured resources, such as virtual machines (VMs) and other systems or services, that are in an Azure virtual network. To set up this access, you can create an integration service environment (ISE) where you can build and run your logic apps. An ISE is a private and isolated instance of the Logic Apps service that uses dedicated resources such as storage, and runs separately from the public, "global", multi-tenant Logic Apps service. Separating your isolated private instance and the public global instance also helps reduce the impact that other Azure tenants might have on your apps' performance, which is also known as the "noisy neighbors" effect.

* [Overview: Access to Azure virtual network resources from Azure Logic Apps](../logic-apps/connect-virtual-network-vnet-isolated-environment-overview.md)
* [Connect to Azure virtual networks from Azure Logic Apps](../logic-apps/connect-virtual-network-vnet-isolated-environment.md)

## Deploy, manage, and monitor logic apps

You can fully develop and deploy logic apps with Visual Studio, Azure DevOps, or any other source control and automated build tools. To support deployment for workflows and dependent connections in a resource template, logic apps use Azure resource deployment templates. Visual Studio tools automatically generate these templates, which you can check in to source control for versioning. For notification and diagnostic logs for workflow run status, Azure Logic Apps also provides monitoring and alerts.

### Deploy

* [Quickstart: Create automated tasks, processes, and workflows by using Azure Logic Apps - Visual Studio](../logic-apps/quickstart-create-logic-apps-with-visual-studio.md)
* [Overview: Automate logic app deployment](../logic-apps/logic-apps-azure-resource-manager-templates-overview.md)
* [Create Azure Resource Manager templates to automate deployment for Azure Logic Apps](../logic-apps/logic-apps-create-azure-resource-manager-templates.md)
* [Deploy Azure Resource Manager templates for Azure Logic Apps](../logic-apps/logic-apps-deploy-azure-resource-manager-templates.md)
* [Sample: Connect to Azure Service Bus queues from Azure Logic Apps and deploy with Azure Pipelines in Azure DevOps](https://docs.microsoft.com/samples/azure-samples/azure-logic-apps-deployment-samples/connect-to-azure-service-bus-queues-from-azure-logic-apps-and-deploy-with-azure-devops-pipelines/)
* [Sample: Connect to Azure Storage accounts from Azure Logic Apps and deploy with Azure Pipelines in Azure DevOps](https://docs.microsoft.com/samples/azure-samples/azure-logic-apps-deployment-samples/connect-to-azure-storage-accounts-from-azure-logic-apps-and-deploy-with-azure-devops-pipelines/)
* [Sample: Set up a function app action for Azure Logic Apps and deploy with Azure Pipelines in Azure DevOps](https://docs.microsoft.com/samples/azure-samples/azure-logic-apps-deployment-samples/set-up-an-azure-function-app-action-for-azure-logic-apps-and-deploy-with-azure-devops-pipelines/)
* [Sample: Connect to an integration account from Azure Logic Apps and deploy with Azure Pipelines in Azure DevOps](https://docs.microsoft.com/samples/azure-samples/azure-logic-apps-deployment-samples/connect-to-an-integration-account-from-azure-logic-apps-and-deploy-by-using-azure-devops-pipelines/)
* [Sample: Orchestrate Azure Pipelines by using Azure Logic Apps](https://docs.microsoft.com/samples/azure-samples/azure-logic-apps-pipeline-orchestration/azure-devops-orchestration-with-logic-apps/)

### Manage

* [Manage logic apps by using Visual Studio](../logic-apps/manage-logic-apps-with-visual-studio.md)
* [Create and manage integration accounts for B2B enterprise integrations](../logic-apps/logic-apps-enterprise-integration-create-integration-account.md)
* [Manage integration service environment (ISE) in Azure Logic Apps](../logic-apps/ise-manage-integration-service-environment.md)

### Monitor

* [Monitor run status, review trigger history, and set up alerts for Azure Logic Apps](../logic-apps/monitor-logic-apps.md)
* [Set up Azure Monitor logs and collect diagnostics data for Azure Logic Apps](../logic-apps/monitor-logic-apps-log-analytics.md)
* [Set up Azure Monitor logs and collect diagnostics data for B2B messages in Azure Logic Apps](../logic-apps/monitor-b2b-messages-log-analytics.md)
* [View and create queries for monitoring and tracking in Azure Monitor logs for Azure Logic Apps](../logic-apps/create-monitoring-tracking-queries.md)

## Handle content types, conversions, and transformations

You can access, convert, and transform multiple content types by using the many functions in the Azure Logic Apps [workflow definition language](https://aka.ms/logicappsdocs). For example, you can convert between a string, JSON, and XML with the `@json()` and `@xml()` workflow expressions. The Logic Apps engine preserves content types to support content transfer in a lossless manner between services.

* [Handle content types in Azure Logic Apps](../logic-apps/logic-apps-content-type.md), such as `application/`, `application/octet-stream`, and `multipart/formdata`
* [Reference guide to using functions in expressions for Azure Logic Apps and Power Automate](../logic-apps/workflow-definition-language-functions-reference.md)
* [Workflow Definition Language schema for Azure Logic Apps](../logic-apps/logic-apps-workflow-definition-language.md)

## Other integrations and capabilities

Azure Logic Apps integrates with many services, such as Azure Functions, Azure API Management, Azure App Service, and custom HTTP endpoints, for example, REST and SOAP.

* [Call Azure Functions from Azure Logic Apps](../logic-apps/logic-apps-azure-functions.md)
* [Tutorial: Call or trigger logic apps by using Azure Functions and Azure Service Bus](../logic-apps/logic-apps-scenario-function-sb-trigger.md)
* [Tutorial: Create a streaming customer insights dashboard with Azure Logic Apps and Azure Functions](../logic-apps/logic-apps-scenario-social-serverless.md)
* [Tutorial: Create a function that integrates with Azure Logic Apps and Azure Cognitive Services to analyze Twitter post sentiment](../azure-functions/functions-twitter-email.md)
* [Tutorial: Build an AI-powered social dashboard by using Power BI and Azure Logic Apps](https://aka.ms/logicappsdemo)
* [Tutorial: Monitor virtual machine changes by using Azure Event Grid and Logic Apps](../event-grid/monitor-virtual-machine-changes-event-grid-logic-app.md)
* [Tutorial: IoT remote monitoring and notifications with Azure Logic Apps connecting your IoT hub and mailbox](../iot-hub/iot-hub-monitoring-notifications-with-azure-logic-apps.md)
* [Blog: Call SOAP services by using Azure Logic Apps](https://blogs.msdn.microsoft.com/logicapps/2016/04/07/using-soap-services-with-logic-apps/)

## End-to-end scenarios

* [Whitepaper: End-to-end case management integration with Azure services, such as Logic Apps](https://aka.ms/enterprise-integration-e2e-case-management-utilities-logic-apps)

## Customer stories

Learn how Azure Logic Apps, along with other Azure services and Microsoft products, helped [these companies](https://aka.ms/logic-apps-customer-stories) improve their agility and focus on their core businesses by simplifying, organizing, automating, and orchestrating complex processes.

## Next steps

* Learn about [connectors for Logic Apps](../connectors/apis-list.md)
* Learn about [B2B enterprise integration scenarios with Azure Logic Apps](../logic-apps/logic-apps-enterprise-integration-overview.md)
