---
title: Introduction to containers on Azure
description: Get started with containers on Azure with Azure Container Apps
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: conceptual
ms.date: 10/10/2023
ms.author: cshoe
---

# Introduction to containers on Azure

As you deploy your applications, you quickly run into challenges common to any production-grade application. For instance, you might ask yourself questions like:

- How can I be confident that what works on my machine works in production?
- How can I manage settings between different environments?
- How do I reliably deploy my application?

People sometimes use virtual machines to deal with these problems.  However, virtual machines can be costly, sometimes slow, and too large to move around the network.

Instead of using a fully virtualized machine, some turn to containers.

What is a container?

Think for a moment of goods traveling around in a shipping container. When you see large metal boxes on cargo ships, you notice they're all the same size and shape. These containers make it easy to stack and move shipping containers around, regardless of what’s inside.

Software containers work the same way, but in the digital world. Just like how a shipping container can hold toys, clothes, or electronics, a software container packages up everything an application needs to run. Whether on your own computer, during testing, or on a cloud service like Microsoft Azure, a container works the same way in different environments.

## Benefits of using containers

Containers package your applications in an easy-to-transport unit. Here are a few benefits of using containers:

- **Consistency**: Goods in a shipping container remain safe and unchanged during transport. Similarly, a software container guarantees consistent application behavior across different environments.

- **Flexibility**: Despite the diverse contents of a shipping container, transportation methods remain standardized. In software, containers encapsulate different apps and technologies but maintain a standard management approach.

- **Efficiency**: Just as shipping containers optimize transport by allowing efficient stacking on ships and trucks, software containers optimize computing resources. These lightweight entities allow for multiple containers to operate simultaneously on a single server.

- **Simplicity**: Moving shipping containers requires specific, yet standardized tools. In a similar vein, services like Azure Container Apps simplify the deployment and management of containers. Container Apps allows you to focus on app development without having to worry about the details of container management.

## Why use containers?

When making and using software, you might wonder:

- How can I be confident that what works on my machine works in production?
- How can I manage settings between different environments?
- How do I reliably deploy my application?

People sometimes use virtual machines to deal with these problems.  However, virtual machines can be costly, sometimes slow, and too large to move around the network.

Containers help with these problems too, but in an easier way. They give your app a special space to run, which works on any computer. Everything your app needs, from code to settings, is in this space. The best part? Containers are cost-friendly, fast, and simple to share. They're perfect for all stages of the software lifecycle.

> [!div class="nextstepaction"]
> [Build your first app using a container](quickstart-portal.md)
