---
title: Azure Functions on Azure Container Apps overview
description: Learn how Azure Functions works with autoscaling rules in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic:  how-to
ms.date: 03/31/2025
ms.author: cshoe
---

# Azure Functions on Azure Container Apps overview

Azure Functions provides integrated support for developing, deploying, and managing containerized function apps on Azure Container Apps. Use Azure Container Apps to host your function app containers when you need to run your event-driven functions in Azure in the same environment as other microservices, APIs, websites, workflows, or any container hosted programs.

Container Apps hosting lets you run your functions in a fully supported and managed, container-based environment with built-in support for open-source monitoring, mTLS, Dapr, and Kubernetes Event-driven Autoscaling (KEDA).

This article shows you how to create and deploy an Azure Functions app that runs within Azure Container Apps. You learn how to:

- Set up a containerized Functions app with preconfigured auto scaling rules
- Deploy your application using either the Azure portal or Azure CLI
- Verify your deployed function with an HTTP trigger

By running Functions in Container Apps, you benefit from automatic scaling, easy configuration, and a fully managed container environment—all without having to manage the underlying infrastructure yourself.

## Event-driven scaling

All Functions triggers are available in your containerized Functions app. However, only the following triggers can dynamically scale (from zero instances) based on received events when running in a Container Apps environment:

- Azure Event Grid
- Azure Event Hubs
- Azure Blob Storage (event-based)
- Azure Queue Storage
- Azure Service Bus
- Durable Functions (MSSQL storage provider)
- HTTP
- Kafka
- Timer

Azure Functions on Container Apps is designed to configure the scale parameters and rules as per the event target. You don't need to worry about configuring the KEDA scaled objects. You can still set minimum and maximum replica count when creating or modifying your function app.

You can write your function code in any language stack supported by Azure Functions. You can use the same Functions triggers and bindings with event-driven scaling.

## Scenarios

Azure Functions in Container Apps provides a versatile combination of services to meet the needs of your applications. The following scenarios are representative of the types of situations where paring Azure Container Apps with Azure Functions gives you the control and scaling features you need.

- **Line-of-business APIs**: Package custom libraries, packages, and APIs with Functions for line-of-business applications.

- **Migration support**: Migration of on-premises legacy and/or monolith applications to cloud native microservices on containers.

- **Event-driven architecture**: Supports event-driven applications for workloads already running on Azure Container Apps.

- **Serverless workloads**: Serverless workload processing of videos, images, transcripts, or any other processing intensive tasks that required  GPU compute resources.

## Making a selection

TODO: functions vs. jobs

## Next steps

> [!div class="nextstepaction"]
> [Use Azure Functions in Azure Container Apps](functions-usage.md)
