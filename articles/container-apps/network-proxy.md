---
title: Network proxying in Azure Container Apps 
description: Learn how network requests are proxied and routed in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic:  conceptual
ms.date: 12/06/2022
ms.author: cshoe
---

# Network proxying in Azure Container Apps

Azure Container Apps uses [Envoy](https://www.envoyproxy.io/) as a network proxy. Network requests are proxied in Azure Container Apps to achieve the following capabilities:

- **Allow apps to scale to zero**: Running instances are required for direct calls to an application. If an app scales to zero, then a direct request would fail. With proxying, Azure Container Apps ensures calls to an app have running instances to resolve the request.

- **Achieve load balancing**: As requests come in Azure Container Apps applies load balancing rules spread requests across container replicas.

## Ports and routing

In Container Apps, Envoy listens the following ports to decide which container app to route traffic.

| Type | Request | IP type | Port number | Internal port number |
|--|--|--|--|--|
| Public | Endpoint | Public | `80` | `8080` |
| Public | VNET | Public | `443` | `4430` |
| Internal | Endpoint | Cluster | `80` | `8081` |
| Internal | VNET | Cluster | `443` | `8443` |

Requests that come in to ports `80` and `443` are internally routed to the appropriate internal port depending on the request type.

## Security

- HTTP requests are automatically redirected to HTTPs
- Envoy terminates TLS after crossing its boundary
    - Envoy sends requests to apps over HTTP in plain text
- mTLS is only available when using Dapr
    - When you use Dapr service invocation APIs, mTLS is enabled. However, because Envoy terminates mTLS, inbound calls from Envoy to Dapr-enabled container apps isn't encrypted.

HTTPs, GRPC, and HTTP/2 all follow the same architectural model.

## Timeouts

Network requests timeout after four minutes

> [!div class="nextstepaction"]
> [Networking](networking.md)
