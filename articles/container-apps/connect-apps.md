---
title: Communicate between container apps in Azure Container Apps
description: Learn how to communicate between different container apps in the same environment in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: conceptual
ms.date: 04/07/2025
ms.author: cshoe
---

# Communicate between container apps in Azure Container Apps

Azure Container Apps exposes each container app through a domain name if [ingress](ingress-overview.md) is enabled. You can expose ingress endpoints either publicly to the world or to the other container apps in the same environment. Alternatively, you can limit ingress to only other container apps in the same [environment](environment.md).

Application code can call other container apps in the same environment using one of the following methods:

- Default fully qualified domain name (FQDN)
- A custom domain name
- The container app name, for instance `http://<APP_NAME>` for internal requests
- A Dapr URL

> [!NOTE]
> When you call another container in the same environment using the FQDN or app name, the network traffic never leaves the environment.

A sample solution showing how you can call between containers using both the FQDN Location or Dapr can be found on [Azure Samples](https://github.com/Azure-Samples/container-apps-connect-multiple-apps)

## Location

A container app's location is composed of values associated with its environment, name, and region. Available through the `azurecontainerapps.io` top-level domain, the fully qualified domain name (FQDN) uses:

- The container app name
- The environment unique identifier
- Region name

The following diagram shows how these values are used to compose a container app's fully qualified domain name.

:::image type="content" source="media/connect-apps/azure-container-apps-location.png" alt-text="Azure Container Apps container app fully qualified domain name.":::

[!INCLUDE [container-apps-get-fully-qualified-domain-name](../../includes/container-apps-get-fully-qualified-domain-name.md)]

### Dapr location

Developing microservices often requires you to implement patterns common to distributed architecture. Dapr allows you to secure microservices with mutual Transport Layer Security (TLS) (client certificates), trigger retries when errors occur, and take advantage of distributed tracing when Azure Application Insights is enabled.

A microservice that uses Dapr is available through the following URL pattern:

:::image type="content" source="media/connect-apps/azure-container-apps-location-dapr.png" alt-text="Azure Container Apps container app location with Dapr.":::

## Call a container app by name

You can call a container app by doing by sending a request to `http://<CONTAINER_APP_NAME>` from another app in the environment.

## Next steps

> [!div class="nextstepaction"]
> [Get started](get-started.md)
