<properties
   pageTitle="Logic Apps Examples and Scenarios | Microsoft Azure"
   description="See common Logic apps examples and learn how to implement common scenarios"
   services="logic-apps"
   documentationCenter=".net,nodejs,java"
   authors="jeffhollan"
   manager="erikre"
   editor=""/>

<tags
   ms.service="logic-apps"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="integration"
   ms.date="08/01/2016"
   ms.author="jehollan"/>

# Logic Apps Examples and Common Scenarios

This document details common scenarios and examples to help you to understand some of the ways you can use Logic apps to automate business processes. 

## Triggers and actions

There are several ways you can trigger a Logic app from another app. Here are some of those ways: 

- [Creating a custom trigger or action](app-service-logic-create-api-app.md)
- [Long-running actions](app-service-logic-create-api-app.md)
- [HTTP request trigger (POST)](app-service-logic-http-endpoint.md)
- [Webhook triggers and actions](app-service-logic-create-api-app.md)
- [Polling triggers](app-service-logic-create-api-app.md)

### Scenarios

- [Request synchronous response](app-service-logic-http-endpoint.md)

## Error handling and logging

- [Configure Azure Alerts and diagnostics](app-service-logic-monitor-your-logic-apps.md)

### Scenarios

- [Use Case: Error and exception handling](app-service-logic-scenario-error-and-exception-handling.md)

## Deploying and managing

- [Create an automated deployment](app-service-logic-create-deploy-template.md)
- [Build and deploy logic apps from Visual Studio](app-service-logic-deploy-from-vs.md)
- [Monitor logic apps](app-service-logic-monitor-your-logic-apps.md)

## Content types, conversions, and transformations

The Logic Apps [workflow definition language](http://aka.ms/logicappsdocs) contains many functions to allow you to convert and work with different content types.  In addition the engine will do all it can to preserve content-types as data flows through the workflow.

- [Handling of content-types](app-service-logic-content-type.md) like application/json, application/xml, and plain/text
- [Authoring workflow definitions](app-service-logic-author-definitions.md)
- [Workflow definition language reference](http://aka.ms/logicappsdocs)

## Batches and looping

- [SplitOn](app-service-logic-loops-and-scopes.md)
- [ForEach](app-service-logic-loops-and-scopes.md)
- [Until](app-service-logic-loops-and-scopes.md)

## Integrating with Azure Functions

- [Azure Functions integration](app-service-logic-azure-functions.md)

### Scenarios

- [Azure Function as a Service Bus trigger](app-service-logic-scenario-function-sb-trigger.md)

## HTTP, REST, and SOAP

 - [Calling SOAP](https://blogs.msdn.microsoft.com/logicapps/2016/04/07/using-soap-services-with-logic-apps/)


We will keep adding examples and scenarios to this document. Use the comments section below to let us know what examples or scenarios you'd like to see here.