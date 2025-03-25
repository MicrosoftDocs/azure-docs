---
title: Azure Functions on Azure Container Apps overview
description: Learn how Azure Functions works with autoscaling rules in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic:  how-to
ms.date: 03/25/2025
ms.author: cshoe
---

# Use Azure Functions in Azure Container Apps

Azure Functions allows you to run small pieces of code (functions) without worrying about application infrastructure. When you combine Azure Functions with Azure Container Apps, you get the best of both worlds: the simplicity and event-driven nature of Functions with the containerization and advanced deployment capabilities of Container Apps.

This article shows you how to create and deploy an Azure Functions app that runs within Azure Container Apps. You learn how to:

- Set up a containerized Functions app with preconfigured auto scaling rules
- Deploy your application using either the Azure portal or Azure CLI
- Verify your deployed function with an HTTP trigger

By running Functions in Container Apps, you benefit from automatic scaling based on HTTP traffic, easy configuration, and a fully managed container environment—all without having to manage the underlying infrastructure yourself.

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
