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
ms.date: 10/18/2016
ms.author: jehollan

---
# Logic Apps Examples and Common Scenarios
This document details common scenarios and examples to help you to understand some of the ways you can use Logic apps to automate business processes. 

## Custom Triggers and Actions
There are several ways you can trigger a Logic app from another app. Here's a few common examples:

* [Creating a custom trigger or action](../logic-apps/logic-apps-create-api-app.md)
* [Long-running actions](../logic-apps/logic-apps-create-api-app.md)
* [HTTP request trigger (POST)](logic-apps-http-endpoint.md)
* [Webhook triggers and actions](../logic-apps/logic-apps-create-api-app.md)
* [Polling triggers](../logic-apps/logic-apps-create-api-app.md)

### Scenarios
* [Request synchronous response](logic-apps-http-endpoint.md)
* [Request Response with SMS](https://channel9.msdn.com/Blogs/Windows-Azure/Azure-Logic-Apps-Walkthrough-Webhook-Functions-and-an-SMS-Bot)

## Error handling and logging
* [Exception and error handling](logic-apps-exception-handling.md)
* [Configure Azure Alerts and diagnostics](logic-apps-monitor-your-logic-apps.md)

### Scenarios
* [Use Case: Error and exception handling](logic-apps-scenario-error-and-exception-handling.md)

## Deploying and managing
* [Create an automated deployment](../logic-apps/logic-apps-create-deploy-template.md)
* [Build and deploy logic apps from Visual Studio](logic-apps-deploy-from-vs.md)
* [Monitor logic apps](logic-apps-monitor-your-logic-apps.md)

## Content types, conversions, and transformations
The Logic Apps [workflow definition language](http://aka.ms/logicappsdocs) contains many functions to allow you to convert and work with different content types. In addition, the engine will do all it can to preserve content-types as data flows through the workflow.

* [Handling of content-types](../logic-apps/logic-apps-content-type.md) such as application/json, application/xml, and text/plain
* [Authoring workflow definitions](../logic-apps/logic-apps-author-definitions.md)
* [Workflow definition language reference](http://aka.ms/logicappsdocs)

## Batches and looping
* [SplitOn](logic-apps-loops-and-scopes.md)
* [ForEach](logic-apps-loops-and-scopes.md)
* [Until](logic-apps-loops-and-scopes.md)

## Integrating with Azure Functions
* [Azure Functions integration](../logic-apps/logic-apps-azure-functions.md)

### Scenarios
* [Azure Function as a Service Bus trigger](logic-apps-scenario-function-sb-trigger.md)

## HTTP, REST, and SOAP
* [Calling SOAP](https://blogs.msdn.microsoft.com/logicapps/2016/04/07/using-soap-services-with-logic-apps/)

We will keep adding examples and scenarios to this document. Use the comments section below to let us know what examples or scenarios you'd like to see here.

