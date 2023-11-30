---
title: Introduction to serverless containers on Azure
description: Get started with serverless containers on Azure with Azure Container Apps
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: conceptual
ms.date: 11/14/2023
ms.author: cshoe
---

# Introduction to serverless containers on Azure

Serverless computing offers services that manage and maintain servers, which relieve you of the burden of physically operating servers yourself. Azure Container Apps is a serverless platform that handles scaling, security, and infrastructure management for you - all while reducing costs. Once freed from server-related concerns, you're able to spend your time focusing on your application code.

Container Apps make it easy to manage:

1. **Automatic scaling**: As requests for your applications fluctuate, Container Apps keeps your systems running even during seasons of high demand. Container Apps meets the demand for your app at any level by [automatically creating new copies](scale-app.md) (called replicas) of your container. As demand falls, the runtime removes unneeded replicas on your behalf.

1. **Security**: Application security is enforced throughout many layers. From [authentication and authorization](authentication.md) to [network-level security](networking.md), Container Apps allows you to be explicit about the users and requests allowed into your system.

1. **Monitoring**: Easily monitor your container app's health using [observability tools](observability.md) in Container Apps.

1. **Deployment flexibility**: You can deploy from GitHub, Azure DevOps, or from your local machine.

1. **Changes**: As your containers evolve, Container Apps catalogs changes as [revisions](revisions.md) to your containers. If you're experiencing a problem with a container, you can easily roll back to an older version.

## Where to go next

Use the following table to help you get acquainted with Azure Container Apps.

| Action | Description |
|---|---|
| [Build the app](quickstart-code-to-cloud.md) | Deploy your first app, then create an event driven app to process a message queue. |
| [Scale the app](scale-app.md) | Learn how Containers Apps handles meeting variable levels of demand. |
| [Enable public access](ingress-overview.md) | Enable ingress on your container app to accept request from the public web. |
| [Observe app behavior](observability.md) | Use log streaming, your apps console, application logs, and alerts to observe the state of your container app.  |
| [Configure the virtual network](networking.md) | Learn to set up your virtual network to secure your containers and communicate between applications.  |
| [Run a process that executes and exits](jobs.md) | Find out how jobs can help you run tasks that have finite beginning and end.  |
