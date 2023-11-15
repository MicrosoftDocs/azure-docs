---
title: Introduction to containers on Azure
description: Get started with containers on Azure with Azure Container Apps
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: conceptual
ms.date: 11/14/2023
ms.author: cshoe
---

# Introduction to containers on Azure

As you develop and deploy applications, you quickly run into challenges common to any production-grade system. For instance, you might ask yourself questions like:

- How can I be confident that what works on my machine works in production?
- How can I manage settings between different environments?
- How do I reliably deploy my application?

Some organizations choose to use virtual machines to deal with these problems.  However, virtual machines can be costly, sometimes slow, and too large to move around the network.

Instead of using a fully virtualized environment, some developers turn to containers.

What is a container?

Think for a moment about goods traveling around in a shipping container. When you see large metal boxes on cargo ships, you notice they're all the same size and shape. These containers make it easy to stack and move goods all around the world, regardless of what’s inside.

Software containers work the same way, but in the digital world. Just like how a shipping container can hold toys, clothes, or electronics, a software container packages up everything an application needs to run. Whether on your computer, in a test environment, or in production a cloud service like Microsoft Azure, a container works the same way in diverse contexts.

## Benefits of using containers

Containers package your applications in an easy-to-transport unit. Here are a few benefits of using containers:

- **Consistency**: Goods in a shipping container remain safe and unchanged during transport. Similarly, a software container guarantees consistent application behavior among different environments.

- **Flexibility**: Despite the diverse contents of a shipping container, transportation methods remain standardized. Software containers encapsulate different apps and technologies, but maintain are maintained in a standardized fashion.

- **Efficiency**: Just as shipping containers optimize transport by allowing efficient stacking on ships and trucks, software containers optimize the use of computing resources. This optimization allows multiple containers to operate simultaneously on a single server.

- **Simplicity**: Moving shipping containers requires specific, yet standardized tools. Similarly, Azure Container Apps simplifies how you use containers, which allows you focus on app development without worrying about the details of container management.

> [!div class="nextstepaction"]
> [Build your first app using a container](quickstart-portal.md)
