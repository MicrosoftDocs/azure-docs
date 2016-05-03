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

- [Register for an external event](app-service-logic-scenario-paypal-slack.md) like a Paypal or Slack webhook
- [Build a custom API to long-poll service bus](app-service-logic-scenario-sb-custom-api.md)
- [Logic App Request Synchronous Response](app-service-logic-http-endpoint.md)

## Content-Types, Conversions, and Transformations

The Logic Apps [workflow definition language](http://aka.ms/logicappsdocs) contains many functions to allow you to convert and work with different content types.  In addition the engine will do all it can to preserve content-types as data flows through the workflow.

- [Handling of Content-Types](app-service-logic-content-type.md) like application/json, application/xml, and plain/text
- [Workflow Definition Language](app-service-logic-workflow-language.md)

### Scenarios

- [Convert XML to JSON](app-service-scenario-xml-json.md)
- [Parsing JSON string](app-service-scenario-sb-json.md)
- [Converting form encoded data](app-service-scenario-paypal-slack.md) like a Slack or Twilio webhook.

## Exceptions, Tracking, and Error Handling

 - Exception Handling
 - Azure Diagnostics

## Long-Running Actions

- [Creating a long running action](app-service-logic-create-api-app.md)

## Batches and Looping

- SplitOn
- ForEach
- Until

### Scenario

- [Loop over email attachments and store to blob](app-service-logic-scenario-email-attach.md)
- [Insert new Salesforce customers into SQL](app-service-logic-scenario-salesforce-sql.md)

## HTTP, REST, and SOAP

 - HTTP Action and HTTP+Swagger
 - Calling SOAP

### Scenario

- [Getting the weather forecast via HTTP](app-service-logic-scenario-weather.md)

## Deploying Logic Apps and Connections

 - Logic App Resource Deployment and Templates

### Scenarios

- [Deploying FTP to Blob](app-service-logic-scenario-ftp-blob.md)

## Integrating with Nested Workflows and Azure Functions

- Nested Workflows
- Azure Functions Integration

### Scenarios

- [Trigger on Stream Analytics through Service Bus](app-service-logic-scenario-stream-analytics.md)


We will keep adding examples and scenarios to this document. Use the comments section below to let us know what examples or scenarios you'd like to see here.








