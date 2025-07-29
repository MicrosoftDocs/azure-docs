---
title: Microservices with Azure Containers Apps
description: Build a microservice in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: conceptual
ms.date: 04/01/2025
ms.author: cshoe
ms.custom: build-2023
---

# Microservices with Azure Container Apps

[Microservice architectures](https://azure.microsoft.com/solutions/microservice-applications/#overview) allow you to independently develop, upgrade, version, and scale core areas of functionality in an overall system. Azure Container Apps provides the foundation for deploying microservices featuring:

- Independent [scaling](scale-app.md), [versioning](application-lifecycle-management.md), and [upgrades](application-lifecycle-management.md)
- [Service discovery](connect-apps.md)
- [Dapr integration](./dapr-overview.md)

:::image type="content" source="media/microservices/azure-container-services-microservices.png" alt-text="Container apps are deployed as microservices.":::

A Container Apps [environment](environment.md) provides a security boundary around a group of container apps. A single container app typically represents a microservice, which is composed of container apps made up of one or more [containers](containers.md).

You can add [**Azure Functions**](../container-apps/functions-overview.md) and [**Azure Spring Apps**](https://aka.ms/asaonaca) to your Azure Container Apps environment.

## Dapr integration

When you implement a system with microservices, function calls are distributed across the network. To support the distributed nature of microservices, you need to account for failures, retries, and time-outs. While Azure Container Apps features the building blocks for running microservices, integrating [Dapr](https://docs.dapr.io/concepts/overview/) enhances the microservices programming model. Dapr offers more features such as observability, pub/sub, and service-to-service invocation with mutual TLS, retries, and more.

For more information on using Dapr, see [Build microservices with Dapr](microservices-dapr.md).

## Next steps

> [!div class="nextstepaction"]
> [Scaling](scale-app.md)
