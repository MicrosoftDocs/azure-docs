---
title: Azure Container Instances Overview | Azure Docs
description: Understand Azure Container Instances
services: container-instances
documentationcenter: ''
author: seanmck
manager: timlt
editor: ''
tags:
keywords: ''

ms.assetid:
ms.service: container-instances
ms.devlang: na
ms.topic: overview
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 07/20/2017
ms.author: seanmck
ms.custom: mvc
---

# Azure Container Instances

Containers are quickly becoming the preferred way to package, deploy, and manage cloud applications. Azure Container Instances offers the fastest and simplest way to run a container in Azure, without having to provision any virtual machines and without having to adopt a higher-level service.

Azure Container Instances is a great solution for any scenario that can operate in isolated containers, including simple applications, task automation, and build jobs. For scenarios where you need full container orchestration, including service discovery across multiple containers, automatic scaling, and coordinated application upgrades, we recommend the [Azure Container Service](https://docs.microsoft.com/azure/container-service/).

## Fast startup times

Containers offer significant startup benefits over virtual machines. With Azure Container Instances, you can start a container in Azure in seconds without the need to provision and manage VMs.

## Hypervisor-level security

Historically, containers have offered application dependency isolation and resource governance but have not been considered sufficiently hardened for hostile multi-tenant usage. With Azure Container Instances, your application is as isolated in a container as it would be in a VM.

## Custom sizes

Containers are typically optimized to run just a single application, but the exact needs of those applications can differ greatly. With Azure Container Instances, you can request exactly what you need in terms of CPU cores and memory. You pay based on what you request, billed by the second, so you can finely optimize your spending based on your needs.

## Public IP connectivity

With Azure Container Instances, you can expose your containers directly to the internet with a public IP address. In the future, we will expand our networking capabilities to include integration with virtual networks, load balancers, and other core parts of the Azure networking infrastructure.

## Persistent storage

To retrieve and persist state with Azure Container Instances, we offer direct mounting of Azure files shares.

## Linux and Windows containers

With Azure Container Instances, you can schedule both Windows and Linux containers with the same API. Simply indicate the base OS type and everything else is identical.

## Co-scheduled groups

Azure Container Instances supports scheduling of multi-container groups that share a host machine, local network, storage, and lifecycle. This enables you to combine your main application with others acting in a supporting role, such as logging.

## Next steps

Try deploying a container to Azure with a single command using our [quickstart guide](container-instances-quickstart.md).