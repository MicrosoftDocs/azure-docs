---
title: Introduction to containers on Azure
description: Get started with containers on Azure with Azure Container Apps
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: conceptual
ms.date: 09/12/2023
ms.author: cshoe
---

# Introduction to containers on Azure

Imagine standing at a shipping dock, watching giant cargo ships deliver loads of huge metal shipping containers. These metal boxes offer a standardized way to transport various goods all around the world.

You soon notice that each container has a consistent size and shape, which makes for efficient stacking and transport. Each container packages up an assortment of items. Regardless of the contents, the transportation method remains consistent.

Software containers operate in a similar fashion, just in the digital realm. Much like how shipping containers carry diverse goods, software containers packages everything an application needs to run - the code, system tools, system libraries, and settings. This encapsulation ensures consistent application behavior, whether on a local computer, a test environment, or a cloud service like Microsoft Azure.

## Benefits

- **Consistency**: Goods in a shipping container remain safe and unchanged during transport. Similarly, a software container guarantees consistent application behavior across different environments.

- **Flexibility**: Despite the diverse contents of a shipping container, transportation methods remain standardized. In software, containers encapsulate different apps and technologies but maintain a standard management approach.

- **Efficiency**: Just as shipping containers optimize transport by allowing efficient stacking on ships and trucks, software containers optimize computing resources. These lightweight entities allow for multiple containers to operate simultaneously on a single server.

- **Simplicity**: Moving shipping containers requires specific, yet standardized tools. In a similar vein, services like Azure Container Apps simplify the deployment and management of containers. Container Apps allows you to focus on app development without having to worry about the details of container management.

## Need for containers

As you build, develop, and deploy applications, you quickly need to answer questions like:

- How can I be confident that what works on my machine works in production?
- How can I manage configuration settings between different environments?
- How do I reliably deploy my application?

In the past, virtual machines have helped solve these problems.

While virtual machines emulate full computing environments, these virtual contexts provide an isolated and consistent place to run applications. Unfortunately, virtual machines can be expensive, at times slow, and are prohibitively large.

Containers solve the same problems, but go about providing a solution in a different way.

Instead of creating a virtual representation of an entire system, a container creates an isolated environment for your application that runs on any machine. From code to configuration, from system tools to the operating system, a container packages up every dependency required by your application. Fortunately, containers are cheap, fast, and easy to move around the network.

Containers are tailor-made for the entire software development lifecycle.

## Where to go next

Looking to learn more? Use the following resources to help you get acquainted with containers.

| Action | Description |
|---|---|
| Build your first app using a container | [Deploy your first app with a sample container](quickstart-portal.md). |

> [!div class="nextstepaction"]
> [Deploy your first app with a sample container](quickstart-portal.md)
