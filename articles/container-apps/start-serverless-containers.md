---
title: Using Serverless Containers on Azure
description: Get started with using serverless containers with Azure Container Apps on Azure.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: conceptual
ms.date: 01/28/2026
ms.author: cshoe
---

# Use serverless containers on Azure

Serverless computing provides services that manage and maintain servers, which relieves you of the burden of physically operating servers yourself. Azure Container Apps is a serverless platform that handles scaling, security, and infrastructure management for you, in addition to reducing costs. When you don't need to manage servers, you can spend your time focusing on your application code.

Container Apps make it easy to manage:

- **Automatic scaling.** As requests for your applications fluctuate, Container Apps keeps your systems running even during seasons of high demand. Container Apps meets the demand for your app at any level by [automatically creating new copies](scale-app.md) (called replicas) of your container. As demand falls, the runtime removes unneeded replicas.

- **Security.** Application security is enforced throughout many layers. From [authentication and authorization](authentication.md) to [network-level security](networking.md), Container Apps enables you to be explicit about the users and requests allowed into your system.

- **Monitoring.** Easily monitor your container app's health by using [observability tools](observability.md) in Container Apps.

- **Deployment flexibility.** You can deploy from GitHub, Azure DevOps, or your local machine.

- **Changes.** As your containers evolve, Container Apps catalogs changes as [revisions](revisions.md) to your containers. If you have a problem with a container, you can easily roll back to an older version.

## Where to go next

Use the following resources to get acquainted with Container Apps.

| Action | Description |
|---|---|
| [Build the app](quickstart-portal.md) | Deploy your first app, and then create an event-driven app to process a message queue. |
| [Scale the app](scale-app.md) | Learn how Container Apps handles meeting variable levels of demand. |
| [Enable public access](ingress-overview.md) | Enable ingress on your container app to accept requests from the public web. |
| [Observe app behavior](observability.md) | Use log streaming, your app's console, application logs, and alerts to observe the state of your container app.  |
| [Configure the virtual network](networking.md) | Set up your virtual network to secure your containers and communicate between applications.  |
| [Run a process that executes and exits](jobs.md) | Learn how jobs can help you run tasks that have a finite beginning and end.  |
