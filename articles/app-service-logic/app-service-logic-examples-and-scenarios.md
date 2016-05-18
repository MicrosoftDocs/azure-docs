<properties
   pageTitle="Logic apps examples and scenarios | Microsoft Azure"
   description="See common Logic apps examples and learn how to implement common scenarios"
   services="app-service\logic"
   documentationCenter=".net,nodejs,java"
   authors="msftman"
   manager="erikre"
   editor=""/>

<tags
   ms.service="app-service-logic"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="integration"
   ms.date="04/25/2016"
   ms.author="deonhe"/>

# Logic apps examples and common scenarios

This document details common scenarios and examples to help you to understand some of the ways you can use Logic apps to automate business processes. 

## Triggering a logic app

There are several ways you can trigger a Logic app from another app. Here are some of those ways: 

- [HTTP Request (POST)](app-service-logic-http-endpoint.md)
- [Receive a webhook](app-service-logic-create-api-app.md)
- [Poll an endpoint](app-service-logic-create-api-app.md)

### Scenarios

- [Logic App Request Synchronous Response](app-service-logic-http-endpoint.md)

## Content-Types, Conversions, and Transformations

The Logic Apps [workflow definition language](http://aka.ms/logicappsdocs) contains many functions to allow you to convert and work with different content types.  In addition the engine will do all it can to preserve content-types as data flows through the workflow.

- [Handling of Content-Types](app-service-logic-content-type.md) like application/json, application/xml, and plain/text
- [Workflow Definition Language](http://aka.ms/logicappsdocs)

## Long-Running Actions

- [Creating a long running action](app-service-logic-create-api-app.md)

## Batches and Looping

- [SplitOn](app-service-logic-loops-and-scopes.md)
- [ForEach](app-service-logic-loops-and-scopes.md)
- [Until](app-service-logic-loops-and-scopes.md)

## HTTP, REST, and SOAP

 - [Calling SOAP](https://blogs.msdn.microsoft.com/logicapps/2016/04/07/using-soap-services-with-logic-apps/)


We will keep adding examples and scenarios to this document. Use the comments section below to let us know what examples or scenarios you'd like to see here.