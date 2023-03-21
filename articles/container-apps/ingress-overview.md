---
title: Ingress in Azure Container Apps
description: Ingress options for Azure Container Apps
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: conceptual
ms.date: 03/20/2023
ms.author: cshoe
---

# Ingress in Azure Container Apps

Azure Container Apps allows you to expose your container app to the public web, your virtual network (VNET), and other container apps within your environment by enabling ingress. Ingress settings are enforced through a set of rules that control the routing of external and internal traffic to your container app.  When you enable ingress, you don't need to create an Azure Load Balancer, public IP address, or any other Azure resources to enable incoming HTTPS requests or TCP traffic.

Ingress supports:

- [Public and private ingress](#public-and-private-ingress)
- [HTTP and TCP ingress types](#protocol-types)
- [Domain names](#domain-names)
- [IP restrictions](#ip-restrictions)
- [Authentication](#authentication)
- [Traffic splitting between revisions](#traffic-splitting)

> [!NOTE]
> Add diagram here,  Talked with Anthony about this.  He thought that we should consult Ahmed.  I think that we should have a diagram that shows the ingress options and how they work together.

For configuration details, see [Configure ingress](ingress.md).

## Public and private ingress

When you enable ingress, you choose whether ingress to your container app is public (external) or private (internal).  

- External: Allows public access to your container app.
- Internal: Allows access only private access to your container app from within environment's internal VNET.

Each container app within an environment can be configured with different ingress settings. For example, in a scenario with multiple microservice apps, to increase security you may have a single container app that receives public requests and passes the requests to a background service.  In this scenario, you would configure the public-facing container app with external ingress and the internal-facing container app with internal ingress.

## Protocol types

Container Apps supports two protocols for ingress: HTTP and TCP.

### HTTP

With HTTP ingress enabled, your container app has:

- Support for TLS termination
- Support for HTTP/1.1 and HTTP/2
- Support for  WebSocket and gRPC
- HTTPS endpoints that always use TLS 1.2, terminated at the ingress point
- Endpoints that always expose port 80 (for HTTP) and 443 (for HTTPS)
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

Each app in a Container Apps environment is automatically assigned a fully qualified domain name (FQDN) that is based on the environment's DNS suffix. To customize an environment's DNS suffix, see [Custom environment DNS Suffix](environment-custom-dns-suffix.md).

You can configure a custom DNS domain for your Container Apps environment.  For more information, see [Custom domain names and certificates](./custom-domains-certificates.md).

Within a Container Apps environment, apps can communicate with each other using their app names.

VNET-scope ingress requires additional DNS configuration. For more information, see [DNS configuration for VNET-scope ingress](./networking.md#dns).

### Default fully qualified domain names (FQDN)

The automatically assigned domain name takes the following forms:

|Ingress visibility setting | Fully qualified domain name |
|---|---|
| External | `<APP_NAME>.<UNIQUE_IDENTIFIER>.<REGION_NAME>.azurecontainerapps.io`|
| Internal | `<APP_NAME>.internal.<UNIQUE_IDENTIFIER>.<REGION_NAME>.azurecontainerapps.io` |

For HTTP ingress, traffic is routed to individual applications based on the FQDN in the host header.

For TCP ingress, traffic is routed to individual applications based on the FQDN and its *exposed* port number. Other container apps in the same environment can also access a TCP ingress-enabled container app by using its name (defined by the container app's `name` property) and its `exposedPort` number.

You can get access to the environment's unique identifier by querying the environment settings. For more information, see [Connect applications](connect-apps.md#get-fully-qualified-domain-name).

### App names

In addition to the default FQDN and the custom domain name, one container app can access another app in the same environment by using its name.  The name of the container app is defined by the `name` property in the Container Apps resource.

## IP restrictions

Container Apps supports IP restrictions for ingress. You can create rules to either configure IP addresses that are allowed or denied access to your container app.

For more information, see [Configure IP restrictions](ip-restrictions.md).

## Authentication

Azure Container Apps provides built-in authentication and authorization features to secure your external ingress-enabled container app.  For more information, see [Authentication and authorization in Azure Container Apps](authentication.md).

You can configure your app to support client certificates (mTLS) for authentication and traffic encryption. For more information, see [Configure client certificates](client-certificate-authorization.md).

## Traffic splitting

Containers Apps allows you to split incoming traffic between active revisions.  When you define a splitting rule, you assign the percentage of inbound traffic to go to different revisions.  For more information, see [Traffic splitting](traffic-splitting.md).

## Next steps

> [!div class="nextstepaction"]
> [Configure ingress](ingress.md)
