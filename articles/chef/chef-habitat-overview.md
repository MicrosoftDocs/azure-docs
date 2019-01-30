---
title: Use Habitat to deploy your application to Azure
description: Learn how to consistently deploy your application to Azure virtual machines and containers
keywords: azure, chef, devops, virtual machines, overview, automate, habitat
ms.service: virtual-machines-linux
author: tomarchermsft
manager: jeconnoc
ms.author: tarcher
ms.date: 05/15/2018
ms.topic: article
---

# Use Habitat to deploy your application to Azure
[Habitat](https://www.habitat.sh/) is an application packaging and runtime system that bundles the application and its automation together as the unit of deployment. This creates ultimate portability for the application, allowing it to be deployed to containers, virtual machines, bare metal, or PaaS, without a rewrite or repackaging.

This article describes the main benefits of using Habitat.

## Modernize and move legacy applications
Free legacy applications from older operating systems and middleware by repackaging them with Habitat. The resulting artifact is portable, and easily replatforms onto newer infrastructure, like virtual machines or containers running in the cloud.

## Accelerate container adoption
Habitat solves the continuous deployment of complex, microservice-oriented applications by accurately representing runtime dependencies. Move beyond simple blue/green deployment of individual components and architect sophisticated deployment behavior without generating complex orchestration flows.

## Run any application anywhere
With Habitat, applications can run unmodified in any runtime environment. This includes everything from bare metal and virtual machines to containers (such as Docker), cluster-management systems (such as Mesosphere or Kubernetes), and PaaS systems (such as Pivotal Cloud Foundry).

## Integrate into the Chef DevOps workflow
The Habitat project is one of an open source project from Chef Software, with a strong community of support. Habitat leverages Chef’s deep experience with infrastructure automation to bring unprecedented automation capabilities to applications. Chef offers commercial support for Habitat and builds a seamless integration between Habitat and Chef Automate to fully automate the application release cycle, from development to deployment.

## Next steps

* [Try Habitat](https://www.habitat.sh/learn/)
