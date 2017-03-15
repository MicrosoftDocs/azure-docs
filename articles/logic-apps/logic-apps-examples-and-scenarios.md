---
title: Examples & scenarios - Azure Logic Apps | Microsoft Docs
description: Review logic apps examples for common scenarios
services: logic-apps
author: jeffhollan
manager: anneta
editor: ''
documentationcenter: .net,nodejs,java

ms.assetid: e06311bc-29eb-49df-9273-1f05bbb2395c
ms.service: logic-apps
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: integration
ms.date: 03/14/2017
ms.author: jehollan

---
# Examples and common scenarios for Azure Logic Apps

To help you to understand the many patterns and capabilities in Azure Logic Apps, 
here's more information about common scenarios and examples.

## Key scenarios for logic apps

Logic apps provide resilient orchestration and integration for different services. 
The Azure Logic Apps service is "serverless", so you don't have to worry about scale or instances - 
all you have to do is define the workflow (trigger and actions). 
The underlying platform handles scale, availability, and performance. 
Any scenario where you need to coordinate multiple actions, especially across multiple systems, 
is a great use case for Azure Logic Apps. Here are some patterns and examples.

## Respond to triggers and extend actions

Every logic app starts with a trigger, like a schedule, 
a manual invocation, or an event from an external system 
(for example, "when a file is added to an FTP server"). 
Azure Logic Apps currently supports over 100 ready-to-use connectors, 
ranging from on-premises SAP to Azure Cognitive Services. 
For systems and services that might not have published connectors, 
you can also extend logic apps.

* [Tutorial: Build an AI-powered social dashboard in minutes with Logic Apps and Power BI](http://aka.ms/logicappsdemo)
* [Create a custom trigger or action](../logic-apps/logic-apps-create-api-app.md)
* [Set up long-running actions in a run](../logic-apps/logic-apps-create-api-app.md)
* [Manually invoke a logic app through an HTTP request](logic-apps-http-endpoint.md)
* [Respond to external events and actions with webhooks](../logic-apps/logic-apps-create-api-app.md)
* [Synchronous responses to HTTP request triggers](logic-apps-http-endpoint.md)
* [Tutorial: Respond to Twilio SMS webhooks and send a text response](https://channel9.msdn.com/Blogs/Windows-Azure/Azure-Logic-Apps-Walkthrough-Webhook-Functions-and-an-SMS-Bot)

## Error handling, logging, and control flow capabilities

Logic apps provides rich capabilities for advanced control flow, 
including conditions, switches, loops, and scopes. 
For ensuring robust solutions, a workflow can also implement error and exception handling. 
For notification and diagnostic logs for workflow run status, monitoring and alerting is also provided. 

* [Author error and exception handling in a workflow](logic-apps-exception-handling.md)
* [Configure Azure Alerts and diagnostics](logic-apps-monitor-your-logic-apps.md)
* [Scopes and loops for logic apps](logic-apps-loops-and-scopes.md)
* [Use case: How a healthcare company uses logic app exception handling for HL7 FHIR workflows](logic-apps-scenario-error-and-exception-handling.md)

## Deploy and manage logic apps

You can fully develop and deploy logic apps through Visual Studio, 
Visual Studio Team Services, or any other source control and automated build tools. 
To support deployment for workflows and dependent connections in a resource template, 
logic apps use Azure resource deployment templates. 
These templates are automatically generated from Visual Studio tools, 
which you can check in to source control for versioning.

* [Create an automated deployment template](../logic-apps/logic-apps-create-deploy-template.md)
* [Build and deploy logic apps from Visual Studio](logic-apps-deploy-from-vs.md)
* [Monitor the health of your logic apps](logic-apps-monitor-your-logic-apps.md)

## Content types, conversions, and transformations within a run

You can access, convert, and transform multiple content types by using the many functions 
in the Azure Logic Apps [workflow definition language](http://aka.ms/logicappsdocs). 
For example, you can convert between a string, JSON, and XML with the `@json()` and `@xml()` workflow expressions. 
The Logic Apps engine preserves content types to support content transfer in a lossless manner between services.

* [How logic apps handle non-JSON content-types](../logic-apps/logic-apps-content-type.md), 
like `application/xml`, `application/octet-stream`, and `multipart/formdata`
* [Understand logic app workflow expressions](../logic-apps/logic-apps-author-definitions.md)
* [Reference: Azure Logic Apps workflow definition language](http://aka.ms/logicappsdocs)

## Other integrations and capabilities

Logic apps also provide integration with many other services, 
including Azure Functions, Azure API Management, 
Azure App Services, and custom HTTP endpoints including REST and SOAP.

* [Call an Azure Function from a logic app](../logic-apps/logic-apps-azure-functions.md)
* [Scenario: Fire logic apps from Azure Functions](logic-apps-scenario-function-sb-trigger.md)
* [Blog: Calling a SOAP endpoint from a logic app](https://blogs.msdn.microsoft.com/logicapps/2016/04/07/using-soap-services-with-logic-apps/)

## Next Steps

- [Handle errors and exceptions in logic apps](logic-apps-exception-handling.md)
- [Author workflow defintions with the workflow definition language](logic-apps-author-definitions.md)
- [Submit your comments, questions, feedback, or suggestions for how can we improve Azure Logic Apps](https://feedback.azure.com/forums/287593-logic-apps)