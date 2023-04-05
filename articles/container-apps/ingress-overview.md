---
title: Ingress in Azure Container Apps
description: Ingress options for Azure Container Apps
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: conceptual
ms.date: 03/29/2023
ms.author: cshoe
---

# Ingress in Azure Container Apps

Azure Container Apps allows you to expose your container app to the public web, your virtual network (VNET), and other container apps within your environment by enabling ingress. Ingress settings are enforced through a set of rules that control the routing of external and internal traffic to your container app.  When you enable ingress, you don't need to create an Azure Load Balancer, public IP address, or any other Azure resources to enable incoming HTTP requests or TCP traffic.

Ingress supports:

- [External and internal ingress](#external-and-internal-ingress)
- [HTTP and TCP ingress types](#protocol-types)
- [Domain names](#domain-names)
- [IP restrictions](#ip-restrictions)
- [Authentication](#authentication)
- [Traffic splitting between revisions](#traffic-splitting)
- [Session affinity](#session-affinity)

Example ingress configuration showing ingress split between two revisions:

:::image type="content" source="media/ingress/ingress-diagram.png" alt-text="Diagram showing an ingress configuration splitting traffic between two revisions.":::

For configuration details, see [Configure ingress](ingress-how-to.md).

## External and internal ingress

When you enable ingress, you can choose between two types of ingress:

- External: Accepts traffic from both the public internet and your container app's internal environment.
- Internal: Allows only internal access from within your container app's environment.

Each container app within an environment can be configured with different ingress settings. For example, in a scenario with multiple microservice apps, to increase security you may have a single container app that receives public requests and passes the requests to a background service.  In this scenario, you would configure the public-facing container app with external ingress and the internal-facing container app with internal ingress.

## Protocol types

Container Apps supports two protocols for ingress: HTTP and TCP.

### HTTP

With HTTP ingress enabled, your container app has:

- Support for TLS termination
- Support for HTTP/1.1 and HTTP/2
- Support for  WebSocket and gRPC
- HTTPS endpoints that always use TLS 1.2, terminated at the ingress point
- Endpoints that expose ports 80 (for HTTP) and 443 (for HTTPS)
  - By default, HTTP requests to port 80 are automatically redirected to HTTPS on 443
- A fully qualified domain name (FQDN)
- Request timeout is 240 seconds

#### HTTP headers

HTTP ingress adds headers to pass metadata about the client request to your container app. For example, the `X-Forwarded-Proto` header is used to identify the protocol that the client used to connect with the Container Apps service. The following table lists the HTTP headers that are relevant to ingress in Container Apps:

| Header | Description | Values |
|---|---|---|
| `X-Forwarded-Proto` | Protocol used by the client to connect with the Container Apps service. | `http` or `https` |
| `X-Forwarded-For` | The IP address of the client that sent the request. |  |
| `X-Forwarded-Host` | The host name the client used to connect with the Container Apps service. |  |

### <a name="tcp"></a>TCP (preview) 

Container Apps supports TCP-based protocols other than HTTP or HTTPS. For example, you can use TCP ingress to expose a container app that uses the [Redis protocol](https://redis.io/topics/protocol).

> [!NOTE]
> TCP ingress is in public preview and is only supported in Container Apps environments that use a [custom VNET](vnet-custom.md).

With TCP ingress enabled, your container app:

- Is accessible to other container apps in the same environment via its name (defined by the `name` property in the Container Apps resource) and exposed port number.
- Is accessible externally via its fully qualified domain name (FQDN) and exposed port number if the ingress is set to "external".

## Domain names

You can access your app in the following ways:

- The default fully qualified domain name (FQDN):  Each app in a Container Apps environment is automatically assigned an FQDN based on the environment's DNS suffix. To customize an environment's DNS suffix, see [Custom environment DNS Suffix](environment-custom-dns-suffix.md).
- A custom domain name:  You can configure a custom DNS domain for your Container Apps environment.  For more information, see [Custom domain names and certificates](./custom-domains-certificates.md).
- The app name: You can use the app name for communication between apps in the same environment.

To get the FQDN for your app, see [Location](connect-apps.md#location).

## IP restrictions

Container Apps supports IP restrictions for ingress. You can create rules to either configure IP addresses that are allowed or denied access to your container app. For more information, see [Configure IP restrictions](ip-restrictions.md).

## Authentication

Azure Container Apps provides built-in authentication and authorization features to secure your external ingress-enabled container app.  For more information, see [Authentication and authorization in Azure Container Apps](authentication.md).

You can configure your app to support client certificates (mTLS) for authentication and traffic encryption. For more information, see [Configure client certificates](client-certificate-authorization.md)


## Traffic splitting

Containers Apps allows you to split incoming traffic between active revisions.  When you define a splitting rule, you assign the percentage of inbound traffic to go to different revisions.  For more information, see [Traffic splitting](traffic-splitting.md).

## Session affinity

Session affinity, also known as sticky sessions, is a feature that allows you to route all HTTP requests from a client to the same container app replica. This feature is useful for stateful applications that require a consistent connection to the same replica.  For more information, see [Session affinity](sticky-sessions.md).

## Next steps

> [!div class="nextstepaction"]
> [Configure ingress](ingress-how-to.md)
