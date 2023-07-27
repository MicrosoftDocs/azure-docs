---
title: Introduction to containers on Azure
description: Get started with containers on Azure with Azure Container Apps
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: conceptual
ms.date: 07/26/2023
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

A container packages up every aspect required to run an application. From code to configuration, from system tools to the operating system, a container packages everything needed to run your application. Fortunately with containers, they're cheap, fast, and easy to move around the network.

Containers are tailor-made for the entire software development lifecycle.

With containers, you can create apps in your development environment, and then run the same container on a server in a data center. The best part is that you can port your app to different locations without worrying about hardware and OS differences between the two environments. All you have to do is make sure the configuration settings reflect the right environment.

Azure Container Apps allows you to run containers in the cloud so all you have to do is write and maintain your code.

Container Apps makes it easy to manage:

1. **Changes**: As your containers change and evolve, you need a way to keep track of the changes. Container Apps catalogs changes as revisions to your containers. If you're experiencing a problem with a container, you can easily roll back to an older version.

1. **Demand levels**: Requests for your application ebb and flow. Container Apps handles scaling by automatically creating new revisions of your container to meet demand. As demand falls, the system removes unneeded replicas on your behalf.

1. **Security**: Application security is enforced throughout many layers. From authentication and authorization to network-level security, Container Apps

1. **Public access**: When you open up your container to the public web, you're enabling [ingress](ingress-overview.md). If you disable ingress, then only applications inside your container's virtual network have access to the container.

1. **Monitoring**: You can easily track the health and state of your container app through various [observability tools](observability.md) available in Container Apps.

## Where to go next

Looking to dive in? Use the following table to help you get acquainted with Azure Container Apps.

| Action | Description |
|---|---|
| Build an app | [Deploy your first app](quickstart-portal.md), then [create an event driven app to process a message queue](background-processing.md). |
| Pick a plan | Do you need [customized hardware](plans.md), or does your app work great our general purpose machines? |
| Scale an app | Learn how Containers Apps handles [meeting variable levels of demand](scale-app.md). |
| Enable public access | Enable [ingress](ingress-overview.md) on your container app to accept request from the public web. |
| Observe your app | Use log streaming, your apps console, application logs, and alerts to [observe the state](observability.md) of your container app.  |
| Configure your virtual network | Learn to set up your virtual network to secure your containers and communicate between applications.  |
| Run a process that executes and exits | Find out how [jobs](jobs.md) can help you run tasks that have finite beginning and end.  |