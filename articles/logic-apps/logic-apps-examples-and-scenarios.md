---
title: Examples & common scenarios - Azure Logic Apps | Microsoft Docs
description: Examples, scenarios, tutorials, and walkthroughs for Azure Logic Apps
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: ecfan
ms.author: estfan
ms.reviewer: klam, LADocs
ms.topic: article
ms.assetid: e06311bc-29eb-49df-9273-1f05bbb2395c
ms.date: 01/31/18
---

# Common scenarios, examples, tutorials, and walkthroughs for Azure Logic Apps

[Azure Logic Apps](../logic-apps/logic-apps-overview.md) 
helps you orchestrate and integrate different services 
by providing [100+ ready-to-use connectors](../connectors/apis-list.md), 
ranging from on-premises SQL Server or SAP to Microsoft Cognitive Services. 
The Logic Apps service is "serverless", so you don't have to worry about scale or instances. 
All you have to do is define the workflow with a trigger and the actions that the workflow performs. 
The underlying platform handles scale, availability, and performance. 
Logic Apps is especially useful for use cases and scenarios where you 
need to coordinate multiple actions across multiple systems.

To help you learn more about the many patterns and capabilities that 
[Azure Logic Apps](../logic-apps/logic-apps-overview.md) supports, 
here are common examples and scenarios.

## Popular starting points for logic app workflows

Every logic app starts with a [*trigger*](../logic-apps/logic-apps-overview.md#logic-app-concepts), 
and only one trigger, which starts your logic app workflow 
and passes in any data as part of that trigger. 
Some connectors provide triggers, which come in these types:

* *Polling triggers*: Regularly checks a service endpoint for new data. 
When new data exists, the trigger creates and runs a new workflow instance with the data as input.

* *Push triggers*: Listens for data at a service endpoint and waits until a specific event happens. 
When the event happens, the trigger fires immediately, creating and running a new workflow 
instance that uses any available data as input.

Here are just a few popular trigger examples:

* Polling: 

  * [**Schedule - Recurrence** trigger](../connectors/connectors-native-recurrence.md) 
  lets you set the start date and time plus the recurrence for firing your logic app. 
  For example, you can select the days of the week and times of day for triggering your logic app.

  * The "When an email is received" trigger lets your logic app check for 
  new email from any mail provider that's supported by Logic Apps, for example, 
  [Office 365 Outlook](../connectors/connectors-create-api-office365-outlook.md), 
  [Gmail](https://docs.microsoft.com/connectors/gmail/), [Outlook.com](https://docs.microsoft.com/connectors/outlook/), and so on.

  * The [**HTTP** trigger](../connectors/connectors-native-http.md) lets your 
  logic app check a specified service endpoint by communicating over HTTP.
  
* Push:

  * The [**Request / Response - Request** trigger](../connectors/connectors-native-reqres.md) 
  lets your logic app receive HTTP requests and respond in real time 
  to events in some way.

  * The [**HTTP Webhook** trigger](../connectors/connectors-native-webhook.md) 
  subscribes to a service endpoint by registering a *callback URL* with that service. 
  That way, the service can just notify the trigger when the specified event happens, 
  so that the trigger doesn't need to poll the service.

After receiving a notification about new data or an event, 
the trigger fires, creates a new logic app workflow instance, 
and runs the actions in the workflow. 
You can access any data from the trigger throughout the workflow. For example, 
the "On a new tweet" trigger passes the tweet content into the logic app run. 

## Respond to triggers and extend actions

For systems and services that might not have published connectors, 
you can also extend logic apps.

* [Create custom triggers or actions](../logic-apps/logic-apps-create-api-app.md)
* [Set up long-running actions for workflow runs](../logic-apps/logic-apps-create-api-app.md)
* [Respond to external events and actions with webhooks](../logic-apps/logic-apps-create-api-app.md)
* [Call, trigger, or nest workflows with synchronous responses to HTTP requests](../logic-apps/logic-apps-http-endpoint.md)
* [Tutorial: Build an AI-powered social dashboard in minutes with Logic Apps and Power BI](http://aka.ms/logicappsdemo)
* [Video: Respond to Twilio SMS webhooks and send a text response](https://channel9.msdn.com/Blogs/Windows-Azure/Azure-Logic-Apps-Walkthrough-Webhook-Functions-and-an-SMS-Bot)

## Control flow, error handling, and logging capabilities

Logic apps include rich capabilities for advanced control flow, 
like conditions, switches, loops, and scopes. 
To ensure resilient solutions, you can also implement 
error and exception handling in your workflows. 
For notification and diagnostic logs for workflow run status, 
Azure Logic Apps also provides monitoring and alerts.

* Perform different actions based on 
[conditional statements](../logic-apps/logic-apps-control-flow-conditional-statement.md) 
and [switch statements](../logic-apps/logic-apps-control-flow-switch-statement.md)
* [Repeat steps or process items in arrays and collections with loops](../logic-apps/logic-apps-control-flow-loops.md)
* [Group actions together with scopes](../logic-apps/logic-apps-control-flow-run-steps-group-scopes.md)
* [Author error and exception handling in a workflow](../logic-apps/logic-apps-exception-handling.md)
* [Use case: How a healthcare company uses logic app exception handling for HL7 FHIR workflows](../logic-apps/logic-apps-scenario-error-and-exception-handling.md)
* [Turn on monitoring, logging, and alerts for existing logic apps](../logic-apps/logic-apps-monitor-your-logic-apps.md)
* [Turn on monitoring and diagnostics logging when creating logic apps](../logic-apps/logic-apps-monitor-your-logic-apps-oms.md)

## Deploy and manage logic apps

You can fully develop and deploy logic apps with Visual Studio, 
Azure DevOps, or any other source control and automated build tools. 
To support deployment for workflows and dependent connections in a resource template, 
logic apps use Azure resource deployment templates. 
Visual Studio tools automatically generate these templates, 
which you can check in to source control for versioning.

* [Create and deploy logic apps with Visual Studio](../logic-apps/quickstart-create-logic-apps-with-visual-studio.md)
* [Turn on monitoring, logging, and alerts for existing logic apps](../logic-apps/logic-apps-monitor-your-logic-apps.md)
* [Create an automated deployment template](../logic-apps/logic-apps-create-deploy-template.md)

## Content types, conversions, and transformations within a run

You can access, convert, and transform multiple content types by using the many functions 
in the Azure Logic Apps [workflow definition language](http://aka.ms/logicappsdocs). 
For example, you can convert between a string, JSON, and XML with 
the `@json()` and `@xml()` workflow expressions. 
The Logic Apps engine preserves content types to support 
content transfer in a lossless manner between services.

* [How workflow expressions work in logic apps](../logic-apps/logic-apps-author-definitions.md)
* [Handle non-JSON content types](../logic-apps/logic-apps-content-type.md), 
like `application/xml`, `application/octet-stream`, and `multipart/formdata`
* [Workflow Definition Language schema for Azure Logic Apps](http://aka.ms/logicappsdocs)

## Other integrations and capabilities

Logic apps also offer integration with many services, 
like Azure Functions, Azure API Management, 
Azure App Services, and custom HTTP endpoints, 
for example, REST and SOAP.

* [Create a real-time social dashboard with Azure Serverless](../logic-apps/logic-apps-scenario-social-serverless.md)
* [Call Azure Functions from logic apps](../logic-apps/logic-apps-azure-functions.md)
* [Tutorial: Trigger logic apps with Azure Functions](../logic-apps/logic-apps-scenario-function-sb-trigger.md)
* [Tutorial: Monitor virtual machine changes with Azure Event Grid and Logic Apps](../event-grid/monitor-virtual-machine-changes-event-grid-logic-app.md)
* [Tutorial: Create a function that integrates with Azure Logic Apps and Microsoft Cognitive Services to analyze Twitter post sentiment](../azure-functions/functions-twitter-email.md)
* [Tutorial: IoT remote monitoring and notifications with Azure Logic Apps connecting your IoT hub and mailbox](../iot-hub/iot-hub-monitoring-notifications-with-azure-logic-apps.md)
* [Blog: Call SOAP endpoints from logic apps](https://blogs.msdn.microsoft.com/logicapps/2016/04/07/using-soap-services-with-logic-apps/)

## End-to-end scenarios

* [Whitepaper: End-to-end case management integration with Azure services, such as Logic Apps](https://aka.ms/enterprise-integration-e2e-case-management-utilities-logic-apps)

## Customer stories

Learn how Azure Logic Apps, along with other Azure services and Microsoft products, 
helped [these companies](https://aka.ms/logic-apps-customer-stories) improve their 
agility and focus on their core businesses by simplifying, organizing, automating, 
and orchestrating complex processes.

## Next steps

* [Build on logic app definitions with JSON](../logic-apps/logic-apps-author-definitions.md)
* [Handle errors and exceptions in logic apps](../logic-apps/logic-apps-exception-handling.md)
* [Submit your comments, questions, feedback, or suggestions for improving Azure Logic Apps](https://feedback.azure.com/forums/287593-logic-apps)