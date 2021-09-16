---
title: Azure Container Apps overview
description: Learn about Azure Container Apps.
services: app-service
author: craigshoemaker
ms.service: app-service
ms.topic:  conceptual
ms.date: 11/01/2021
ms.author: cshoe
---

# Azure Container Apps overview

<!-- PRELIMINARY OUTLINE

-->

Azure Container Apps allows you to run containerized applications w

- Intro paragraph
- Run containerized applications without infrastructure or orchestrators
    - what was complicated is now easy
- What are containerized applications?
    - auto-scaling apps:
        - types of apps: http requests, event-triggered scaling* (queues, event hubs etc.), background processing* (loading a file, timer-based, deploy - do work and shut down), -> created and auto-scaled
- microservices: applications composed of multiple services that communicate with each other
    - built-in DNS-based discovery
    - built-in support for Dapr (programming model for microservices)
- application lifecycle management
    - deploy and update an application using built-in revision management
        - deploy two versions of an app side-by-side
        - keep a history of all the changes made to an app (ARM template)
- traffic management
    - split traffic between revisions (percent rules)
    - built-in support for public endpoints with https support
    - no networking infrastructure required
    - load balancing is included automatically
- secret management
    - securely storing passwords, connection string, etc. directly in an application
- applications can deploy into VNETs that you own
    - connect to on-prem systems or other Azure services on the VNET
Terms should question
- ingress
- replicas

\* differentiators

## Next steps

> [!div class="nextstepaction"]
> [Get started](get-started.md)
