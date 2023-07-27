---
title: Introduction to containers on Azure
description: Get started with containers on Azure with Azure Container Apps
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: conceptual
ms.date: 07/27/2023
ms.author: cshoe
---

# Introduction to containers on Azure

As you build, develop, and deploy applications, you quickly need to answer questions like:

- How can I be confident that what works on my machine works in production?
- How can I manage configuration settings between different environments?
- How do I reliably deploy my application?

In the past, we've turned to virtual machines to solve these problems.

Virtual machines emulate different environments. These virtual contexts provide an isolated and consistent place to run applications. Virtual machines work, but come with some significant drawbacks. Unfortunately, they're expensive, can be slow, and are prohibitively large.

Containers solve the same problems, but are fundamentally different.

A container packages up every aspect required to run an application. From code to configuration, from system tools to the operating system, a container packages every dependency needed to run your application. Fortunately with containers, they're cheap, fast, and easy to move around the network.

Containers are tailor-made for the entire software development lifecycle.

With containers, you create apps in your development environment, and then run the same container on a server. Containers makes your apps portable to various locations without worrying about hardware and operating system differences between environments. All you have to do is make sure the configuration settings reflect the right environment.

## Where to go next

Looking to dive in? Use the following table to help you get acquainted with using containers.

| Action | Description |
|---|---|
| Learn more about containers | Containers are [standardized, portable packaging for your applications](https://azure.microsoft.com/resources/cloud-computing-dictionary/what-is-a-container). |
| Build an app | [Deploy your first app with a sample container](quickstart-portal.md). |

> [!div class="nextstepaction"]
> [Deploy your first app with a sample container](quickstart-portal.md)