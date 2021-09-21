---
title: Containers in Azure Container Apps
description: Learn how containers are managed in Azure Container Apps.
services: app-service
author: craigshoemaker
ms.service: app-service
ms.topic:  conceptual
ms.date: 09/16/2021
ms.author: cshoe
---

# Containers in Azure Container Apps

<!-- PRELIMINARY OUTLINE
## Container image
How do containers run in Azure Container Apps?
  Run any container image
    Linux only
  Don't need a base image
  Can use favorite stack/framework

make it as painless as possible
 you provide the container and we run it for you

## Container registry
Container image can be from any container registry
There are three required fields
    address of server
    username
    password <-- secret ref

## Container concepts
What is available & what is required

### Pods
a group of containers that have shared storage and network resources 
   they exist in a semi-isolated network

why is this important
    run containers in separate pods or in the same pod
    Container Apps: if you have a multi-container app, or two separate apps in different container apps instances
        whether or not those two containers want to share storage and network resources
            two containers that talk to each other, use ports on the same network?
            if in separate pods - then have to use the formal networking system.

  do you want to use the same hard drive and network to connect to another pod?

containers int the same pod share the same scale rules
    they scale together in tandem

Why separate pods?
    run as a sidecar vs a microservice
    different scale needs

Sidecar example:
    backend service with a sidecar with logging service
    health checks
    metrics

### Configuration options

Resource requests: CPU and memory
Environment variables

Start up command

## Requirements
What fields are necessary

## Limitations
Can't run init/privileged  containers

privileged container
    the program has root access to the container

If you have a program that wants to spawn a shell and run a script that wants root access
    it'll cause a runtime error in the app
    you don't have access to system resources that require root access
-->

## Next steps

> [!div class="nextstepaction"]
> [Environment](environment.md)
