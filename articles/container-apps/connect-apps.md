---
title: Connect applications in Azure Container Apps
description: Learn to deploy multiple applications that communicate together in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: conceptual
ms.date: 11/02/2021
ms.author: cshoe
ms.custom: ignite-fall-2021, event-tier1-build-2022
---

# Connect applications in Azure Container Apps

Azure Container Apps exposes each container app through a domain name if [ingress](ingress-overview.md) is enabled. Ingress endpoints can be exposed either publicly to the world and to other container apps in the same environment, or ingress can be limited to only other container apps in the same [environment](environment.md).

You can call other container apps in the same environment from your application code using one of the following methods: 

- default fully qualified domain name (FQDN)
- a custom domain name
- the container app name, for instance `http://<APP_NAME>` for internal requests
- a Dapr URL

> [!NOTE]
> When you call another container in the same environment using the FQDN or app name, the network traffic never leaves the environment.

A sample solution showing how you can call between containers using both the FQDN Location or Dapr can be found on [Azure Samples](https://github.com/Azure-Samples/container-apps-connect-multiple-apps)

## Location

A container app's location is composed of values associated with its environment, name, and region. Available through the `azurecontainerapps.io` top-level domain, the fully qualified domain name (FQDN) uses:

- the container app name
- the environment unique identifier
- region name

The following diagram shows how these values are used to compose a container app's fully qualified domain name.

:::image type="content" source="media/connect-apps/azure-container-apps-location.png" alt-text="Azure Container Apps container app fully qualified domain name.":::

[!INCLUDE [container-apps-get-fully-qualified-domain-name](../../includes/container-apps-get-fully-qualified-domain-name.md)]

## Dapr location

Developing microservices often requires you to implement patterns common to distributed architecture. Dapr allows you to secure microservices with mutual TLS (client certificates), trigger retries when errors occur, and take advantage of distributed tracing when Azure Application Insights is enabled.

A microservice that uses Dapr is available through the following URL pattern:

:::image type="content" source="media/connect-apps/azure-container-apps-location-dapr.png" alt-text="Azure Container Apps container app location with Dapr.":::

## Next steps

> [!div class="nextstepaction"]
> [Get started](get-started.md)
