---
title: Set up HTTPS ingress in Azure Container Apps
description: Manage an application through its lifecycle in Azure Container Apps.
services: app-service
author: craigshoemaker
ms.service: app-service
ms.topic:  how-to
ms.date: 09/16/2021
ms.author: cshoe
---

# Set up HTTPS ingress in Azure Container Apps

Azure Container Apps provides HTTPS ingress with TLS termination. You do not need to create an Azure Load Balancer, public IP address, or any other Azure resources to enable HTTPS ingress.

Azure Container Apps currently supports HTTP/1.1 and HTTP/2. Ingress endpoints always use TLS 1.2, terminated at the ingress point.

## Configuration

Ingress is an application-wide setting. Changes to ingress settings apply to all revisions simultaneously, and do not generate new revisions.

The ingress configuration section has the following form:

```json
"configuration": {
    "ingress": {
        "external": true,
        "targetPort": 80,
        "transport": auto
    }
},
```

The following settings are available when configuring ingress:

| Property | Description | Values | Required |
|---|---|---|---|
| `external` | Your ingress IP and FQDN can either be visible externally to the internet, or internally within a VNET. This property is required. |<li>`true` for external visibility<li>`false` for internal visibility | Yes |
| `targetPort` | This is the port your container is listening on that will receive traffic. | Set this value to the port number that your container uses. Your application ingress endpoint will always be exposed on port 443. | Yes |
| `transport` | You can use either HTTP/1.1 or HTTP/2, or you can set it to automatically detect the transport type. | <li>`http` for HTTP/1<li>`http2` for HTTP/2<li>`auto` to automatically detect the transport type (default) | No |

> [!NOTE]
> To disable ingress for your application, simply omit the `ingress` configuration property entirely.

## IP addresses and domain names

With ingress is enabled, your application is assigned a fully-qualified domain name (FQDN). The the domain name takes the following forms:

|Ingress visibility setting | FQDN |
|--|--|
|external | `<APP-NAME>.<ENV-NAME>-<RANDOM-STRING>.<REGION>.workerapps.k4apps.io`|
|internal | `<APP-NAME>.internal.<ENV-NAME>-<RANDOM-STRING>.<REGION>.workerapps.k4apps.io` |

Your Container Apps environment has a single public IP address for applications with `external` ingress visibility, and a single internal IP address for applications with `internal` ingress visibility. Therefore, all applications within a Container Apps environment with `external` ingress visibility share a single public IP address. Similarly, all applications within a Container Apps environment with `internal` ingress visibility share a single internal IP address. HTTP traffic is routed to individual applications based on the FQDN in the host header.

> [!div class="nextstepaction"]
> [Manage scaling](scale-app.md)
