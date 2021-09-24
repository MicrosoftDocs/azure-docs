---
title: Microservices with Azure Containers Apps
description: Build a microservice in Azure Container Apps.
services: app-service
author: craigshoemaker
ms.service: app-service
ms.topic:  conceptual
ms.date: 09/16/2021
ms.author: cshoe
---

# Microservices with Azure Containers Apps

Into microservices:  https://azure.microsoft.com/en-us/solutions/microservice-applications/#overview

How is Container Apps designed for microservices

- Service discovery (link to connect-apps.md)
- Container app allows you to operate a container as a microservice
    - each service can independently scale, be upgraded, and versioned
- Dapr is designed specifically for microservice architectures

you get the runtime and all the basics, but Dapr provides a richer environment

without Dapr
    basic building blocks
        but you might end up reimplementing Dapr
with Dapr
    gives additional building blocks for managing distributed apps
        observability
        pub/sub
        service-to-service invocation (mutual TLS, retries, )

before microservices - function calls were local
    now you are going across the network
        so now you have to account for failures, retries, timeouts, etc.


------------------------------------
one container app = one microservice
don't think of multiple containers and multiple services
an application is made up of a pod and your microservice is the entire container apps application, and not the individual containers in the pod

you have a container app that is a microservice 

an application is a collection of container apps
 if you have multiple microservices

one container app = one microservice
    within and environment
        the environment context is the security boundary

mapping of concepts and terms 



## Next steps

> [!div class="nextstepaction"]
> [Get started](get-started.md)
