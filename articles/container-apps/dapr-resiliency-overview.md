---
title: Dapr component resiliency in Azure Container Apps
titleSuffix: Azure Container Apps
description: Learn how to make your container apps resilient in Azure Container Apps.
services: container-apps
author: hhunter-ms
ms.service: container-apps
ms.topic: conceptual
ms.date: 08/31/2023
ms.author: hannahhunter
ms.custom: ignite-fall-2023
# Customer Intent: As a developer, I'd like to learn how to make my container apps resilient using Azure Container Apps.
---

# Dapr component resiliency in Azure Container Apps

[Dapr-driven resiliency policies](https://docs.dapr.io/operations/resiliency/) empower developers to detect, mitigate, and recover from network failures using retries, timeouts, and circuit breakers on container applications and Dapr components.

In the context of Azure Container Apps, resiliency policies are configured as child resources on a container app or [Dapr component](./dapr-resiliency-overview.md). When an application initiates a network request, the callee (either the container app or Dapr component associated with the resiliency policies) dictates how timeouts, retries, and other resiliency policies are applied.

You can [define resiliency policies](#defining-resiliency-policies) using either Bicep, the Azure CLI, and the Azure Portal.

## Dapr component resiliency policies

## Related links