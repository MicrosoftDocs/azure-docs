---
title: Introduction to serverless containers on Azure
description: Get started with serverless containers on Azure with Azure Container Apps
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: conceptual
ms.date: 09/12/2023
ms.author: cshoe
---

# Introduction to serverless containers on Azure

Serverless containers are a part of a cloud-based technology that runs your applications in isolated environments without requiring you to manage server infrastructure.

When you use serverless containers, your concerns remain on the needs of your application, while Azure Container Apps handles scaling, security, and whole of infrastructure management.

Container Apps makes it easy to manage:

1. **Changes**: As your containers change and evolve, you need a way to keep track of the changes. Container Apps catalogs changes as [revisions](revisions.md) to your containers. If you're experiencing a problem with a container, you can easily roll back to an older version.

1. **Demand levels**: Requests for your applications ebb and flow. Container Apps keeps your systems running even at high levels of demand. Container Apps meets the demand for your app at any level by [automatically creating new copies](scale-app.md) (called replicas) of your container. As demand falls, the runtime removes unneeded replicas on your behalf.

1. **Security**: Application security is enforced throughout many layers. From [authentication and authorization](authentication.md) to [network-level security](networking.md), Container Apps allows you to be explicit about the users and requests allowed into your system.

1. **Public access**: When you open up your container to the public web, you're enabling [ingress](ingress-overview.md). If you disable ingress, then only applications inside your container's virtual network have access to the container.

1. **Monitoring**: You can easily track the health and state of your container app through various [observability tools](observability.md) available in Container Apps.

## Where to go next

Looking to dive in? Use the following table to help you get acquainted with Azure Container Apps.

| Action | Description |
|---|---|
| [Pick a plan](plans.md) | Do you need customized hardware, or does your app work great our general purpose machines? |
| [Build the app](quickstart-code-to-cloud.md) | Deploy your first app, then create an event driven app to process a message queue. |
| [Scale the app](scale-app.md) | Learn how Containers Apps handles meeting variable levels of demand. |
| [Enable public access](ingress-overview.md) | Enable ingress on your container app to accept request from the public web. |
| [Observe app behavior](observability.md) | Use log streaming, your apps console, application logs, and alerts to observe the state of your container app.  |
| [Configure the virtual network](networking.md) | Learn to set up your virtual network to secure your containers and communicate between applications.  |
| [Run a process that executes and exits](jobs.md) | Find out how jobs can help you run tasks that have finite beginning and end.  |

> [!div class="nextstepaction"]
> [Deploy your first app](quickstart-code-to-cloud.md)
