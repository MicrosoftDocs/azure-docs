---
title: Logic Apps Examples and Scenarios | Microsoft Docs
description: See common Logic apps examples and learn how to implement common scenarios
services: logic-apps
documentationcenter: .net,nodejs,java
author: jeffhollan
manager: anneta
editor: ''

ms.assetid: e06311bc-29eb-49df-9273-1f05bbb2395c
ms.service: logic-apps
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: integration
ms.date: 03/14/2017
ms.author: jehollan

---
# Logic Apps Examples and Common Scenarios
This document details common scenarios and examples to help you to understand many of the patterns and capabilities of Azure Logic Apps.

## Key scenarios for a logic app
A logic app provides resilient orchestration and integration to different services.  The service is 'serverless', so the user doesn't need to worry about scale or instances - simply defining the workflow (trigger and actions) is all that is required.  The underlying platform will take care of scale, availability, and performance.  Any scenario where multiple actions need to be coordinated, especially across multiple systems, is a great use-case for Azure Logic Apps.  Below are a few patterns and examples.

## Responding to triggers and extending actions
Every logic app begins with a trigger.  This may be a schedule, a manual invocation, or an event from an external system (e.g. 'when a file is added to an FTP server').  Logic Apps currently supports over 100 connectors out-of-the-box, ranging from on-premises SAP to Azure Cognitive Services.  Logic Apps can also be extended to support systems and services that may not have connectors published currently.  

* [Tutorial: Build an AI-powered social dashboard in minutes with Logic Apps and Power BI.](http://aka.ms/logicappsdemo)
* [How to create a custom trigger or action.](../logic-apps/logic-apps-create-api-app.md)
* [How to have long-running actions in a run.](../logic-apps/logic-apps-create-api-app.md)
* [Manually invoking a logic app via an HTTP request.](logic-apps-http-endpoint.md)
* [Leveraging webhooks to respond to external events and actions.](../logic-apps/logic-apps-create-api-app.md)
* [Synchronous responses to HTTP request triggers.](logic-apps-http-endpoint.md)
* [Tutorial: Responding to Twilio SMS webhooks and sending a text response.](https://channel9.msdn.com/Blogs/Windows-Azure/Azure-Logic-Apps-Walkthrough-Webhook-Functions-and-an-SMS-Bot)

## Error handling, logging, and control flow capabilities
Logic Apps provides rich capabilities for advanced control flow.  This includes conditions, switches, loops, and scopes.  In addition, a workflow can implement error and exception handling to ensure robust solutions.  Monitoring and alerting is also provided for notification and diagnostic logs on the status of workflow runs. 

* [Author error and exception handling in a workflow.](logic-apps-exception-handling.md)
* [Configure Azure Alerts and diagnostics.](logic-apps-monitor-your-logic-apps.md)
* [How to use scopes and loops in a logic app.](logic-apps-loops-and-scopes.md)
* [Use Case: Healthcare company uses logic app exception handling for HL7 FHIR workflows.](logic-apps-scenario-error-and-exception-handling.md)

## Deploying and managing a logic app
Logic Apps can be fully developed and deployed through Visual Studio, Visual Studio Team Services, or any other source control and automated build tooling.  Logic Apps leverage the Azure resource deployment templates to enable deployment of workflows and dependent connections in a resource template.  These templates are automatically generated from our Visual Studio tooling, and can be checked into and versioned with source control.

* [How to create an automated deployment template.](../logic-apps/logic-apps-create-deploy-template.md)
* [Build and deploy logic apps from Visual Studio.](logic-apps-deploy-from-vs.md)
* [Monitor the health of your logic apps.](logic-apps-monitor-your-logic-apps.md)

## Content types, conversions, and transformations within a run
The Logic Apps [workflow definition language](http://aka.ms/logicappsdocs) contains many functions to allow accessing, converting, and transforming multiple content types.  For example, the `@json()` and `@xml()` workflow expressions can convert between a string, JSON, and XML.  The engine will preserve content-types to enable transferring of content between services in a lossless manner.

* [How a logic app handles non-JSON content-types](../logic-apps/logic-apps-content-type.md) such as `application/xml`, `application/octet-stream`, and `multipart/formdata`.
* [Understanding logic app workflow expressions.](../logic-apps/logic-apps-author-definitions.md)
* [Reference: Azure Logic Apps workflow definition language](http://aka.ms/logicappsdocs)

## Other integrations and capabilities
In addition to the above, logic apps provides integration with many other services, including Azure Functions, Azure API Management, Azure App Services, and custom HTTP endpoints (including REST and SOAP).

* [Calling an Azure Function from a logic app.](../logic-apps/logic-apps-azure-functions.md)
* [Scenario: Firing a logic app from an Azure Function.](logic-apps-scenario-function-sb-trigger.md)
* [Blog: Calling a SOAP endpoint from a logic app.](https://blogs.msdn.microsoft.com/logicapps/2016/04/07/using-soap-services-with-logic-apps/)

## Next Steps
- Try other [Logic Apps features](logic-apps-use-logic-app-features.md).
- Learn about [error and exception handling](logic-apps-exception-handling.md).
- Explore more [workflow language capabilities](logic-apps-author-definitions.md).
- Leave a comment with your questions or feedback, or [tell us how can we improve Logic Apps](https://feedback.azure.com/forums/287593-logic-apps).