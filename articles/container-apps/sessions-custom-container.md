---
title: Custom container sessions in Azure Container Apps
description: Learn to run custom container session in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.custom:
  - ignite-2024
ms.topic: conceptual
ms.date: 04/07/2025
ms.update-cycle: 180-days
ms.author: cshoe
ms.collection: ce-skilling-ai-copilot
---

# Azure Container Apps custom container sessions

In addition to the built-in code interpreter that Azure Container Apps dynamic sessions provide, you can also use custom containers to define your own session sandboxes.

## Uses for custom container sessions

Custom containers allow you to build solutions tailored to your needs. They enable you to execute code or run applications in environments that are fast and ephemeral and offer secure, sandboxed spaces with Hyper-V. Additionally, they can be configured with optional network isolation. Some examples include:

* **Code interpreters**: When you need to execute untrusted code in secure sandboxes by a language not supported in the built-in interpreter, or you need full control over the code interpreter environment.

* **Isolated execution**: When you need to run applications in hostile, multitenant scenarios where each tenant or user has their own sandboxed environment. These environments are isolated from each other and from the host application. Some examples include applications that run user-provided code, code that grants end user access to a cloud-based shell, AI agents, and development environments.

## Using custom container sessions

To use custom container sessions, you first create a session pool with a custom container image. Azure Container Apps automatically starts containers in their own Hyper-V sandboxes using the provided image. Once the container starts up, it's available to the session pool.

When your application requests a session, an instance is instantly allocated from the pool. The session remains active until it enters an idle state, which is then automatically stopped and destroyed.

## Related content

* [Serverless code interpreter sessions in Azure Container Apps](sessions-code-interpreter.md)
