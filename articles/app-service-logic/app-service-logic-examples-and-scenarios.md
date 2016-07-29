<properties
   pageTitle="Logic Apps Examples and Scenarios | Microsoft Azure"
   description="See common Logic apps examples and learn how to implement common scenarios"
   services="logic-apps"
   documentationCenter=".net,nodejs,java"
   authors="msftman"
   manager="erikre"
   editor=""/>

<tags
   ms.service="logic-apps"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="integration"
   ms.date="04/25/2016"
   ms.author="deonhe"/>

# Logic Apps Examples and Common Scenarios

This document details common scenarios and examples to help you to understand some of the ways you can use Logic apps to automate business processes. 

## Triggering a Logic App

There are several ways you can trigger a Logic app from another app. Here are some of those ways: 

- [HTTP Request (POST)](app-service-logic-http-endpoint.md)
- [Receive a webhook](app-service-logic-create-api-app.md)
- [Poll an endpoint](app-service-logic-create-api-app.md)

### Scenarios

- [Logic App Request Synchronous Response](app-service-logic-http-endpoint.md)

## Custom and Long-Running Actions

- [Creating a Custom Action](app-service-logic-create-api-app.md)

## Deploying and Managing a Logic App

- [Create a Logic App Deployment Template](app-service-logic-create-deploy-template.md)
- [Diagnosing Issues with a Logic App](app-service-logic-diagnosing-failures.md)
- [Deploy a Logic App from Visual Studio](app-service-logic-deploy-from-vs.md)
- [Monitor a Logic App](app-service-logic-monitor-your-logic-apps.md)

## Content-Types, Conversions, and Transformations

The Logic Apps [workflow definition language](http://aka.ms/logicappsdocs) contains many functions to allow you to convert and work with different content types.  In addition the engine will do all it can to preserve content-types as data flows through the workflow.

- [Handling of Content-Types](app-service-logic-content-type.md) like application/json, application/xml, and plain/text
- [Authoring Workflow Definitions](app-service-logic-author-definitions.md)
- [Workflow Definition Language Reference](http://aka.ms/logicappsdocs)

## Batches and Looping

- [SplitOn](app-service-logic-loops-and-scopes.md)
- [ForEach](app-service-logic-loops-and-scopes.md)
- [Until](app-service-logic-loops-and-scopes.md)

## Integrating with Azure Functions

- [Azure Functions Integration](app-service-logic-azure-functions.md)

### Scenarios

- [Azure Function as a Service Bus Trigger](app-service-logic-scenario-function-sb-trigger.md)

## HTTP, REST, and SOAP

 - [Calling SOAP](https://blogs.msdn.microsoft.com/logicapps/2016/04/07/using-soap-services-with-logic-apps/)


We will keep adding examples and scenarios to this document. Use the comments section below to let us know what examples or scenarios you'd like to see here.