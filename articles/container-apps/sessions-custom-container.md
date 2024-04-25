---
title: Azure Container Apps custom container sessions
description: 
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: conceptual
ms.date: 04/04/2024
ms.author: cshoe
---

# Azure Container Apps custom container sessions

<!-- 
## Outline

* Describe when custom containers sessions are useful
* Architecture of custom container sessions and what sort of containers it supports
* Link to quickstart
 -->

In addition to the built-in code interpreter that Azure Container Apps dynamic sessions provides, you can also use custom containers to define your own session sandboxes.

## Uses for custom container sessions

You can use custom containers to build any solution where you need to run code or applications in fast, ephemeral, and secure sandboxed environments that have Hyper-V and optional network isolation. Some examples include:

* Running code interpreters to execute untrusted code in secure sandboxes, but with a language that's not supported by the built-in code interpreter or you need full control over the code interpreter environment.

* Running any application in hostile, multi-tenant scenarios where you need to ensure each tenant or user has their own sandboxed environments that are isolated from each other and from the host application. Some examples include applications that run user-provided code or gives end user access to a cloud-based shell or development environment.

## Architecture of custom container sessions

To use custom container sessions, you first create a session pool with a custom container image. Azure Container Apps automatically starts containers in their own Hyper-V sandboxes using the provided image. Once the container has started, it is available for use by the session pool. When your application requests a session, it's instantly allocated one from the pool. The session remains active until it's idle for a period of time, at which point it's automatically stopped and destroyed.

Your application interacts with a session using the session pool's management API. A pool management endpoint for custom container sessions looks like this: `https://<your-session-pool>.<environment-identifier>.<region>.azurecontainerapps.io`.