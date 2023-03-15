---
title: Ingress in Azure Container Apps
description: Ingress options for Azure Container Apps
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: conceptual
ms.date: 02/12/2023
ms.author: cshoe
ms.custom: ignite-fall-2021, event-tier1-build-2022
---

# Ingress in Azure Container Apps


Azure Container Apps uses the ingress feature to allow you to expose your container app to the public web, your VNET, and other container apps within your environment. Ingress works on a set of configurable rules that control the routing of external and internal traffic to your container app.  When you enable ingress, you don't need to create an Azure Load Balancer, public IP address, or any other Azure resources to enable incoming HTTPS requests or TCP traffic.

Ingress supports:

- Public and private ingress
- [HTTPS and TCP ingress types](#ingress-type)
- [Fully qualified domain names (FQDNs)](#fully-qualified-domain-name)
- [HTTP Headers](#http-headers)
- [Traffic splitting between revisions](#traffic-splitting-scenarios)
- [IP restrictions](#ip-restrictions)
- [Ingress authentication](#ingress-authentication)


> [!NOTE]
> Add diagram here,  Talked with Anthony about this.  He thought that we should consult Sanchit.  I think that we should have a diagram that shows the ingress options and how they work together.

Each container app can be configured with different ingress settings. For example, you can have one container app that is exposed to the public web and another that is only accessible from within your Container Apps environment.

## Ingress type

When you enable ingress, you can choose between two ingress types: external and internal. 

- External: Allows public ingress to your app.
- Internal: Allows ingress only from within your Container Apps environment.

## Ingress protocol types

Container Apps supports two types of ingress: HTTPS and TCP.

### HTTP

With HTTP ingress enabled, your container app features the following characteristics:

- Supports TLS termination
- Supports HTTP/1.1 and HTTP/2
- Supports WebSocket and gRPC
- HTTPS endpoints always use TLS 1.2, terminated at the ingress point
- Endpoints always expose ports 80 (for HTTP) and 443 (for HTTPS)
  - By default, HTTP requests to port 80 are automatically redirected to HTTPS on 443
- The container app is accessed via its fully qualified domain name (FQDN)
- Request timeout is 240 seconds

#### HTTP headers

The HTTP headers are used to pass protocol and metadata related information between the client and your container app. For example, the `X-Forwarded-Proto` header is used to identify the protocol that the client used to connect with the Container Apps service.  For information about configuring HTTP headers, see [Configure HTTP headers](./ingress.md#configure-http-headers).

The header is added to an HTTP request or response using a *name: value* format.  The following table lists the HTTP headers that are relevant to ingress in Container Apps:

> [!NOTE]
> Are there more to document here? Do we have response headers we need to document?

| Header | Description | Values | Required |
|---|---|---|---|
| `X-Forwarded-Proto` | The protocol that the client used to connect with the Container Apps service. | `http` or `https` | Yes |
| `X-Forwarded-For` | The IP address of the client that sent the request. | Yes |
| 'X-Forwarded-Host | The host name that the client used to connect with the Container Apps service. | Yes |

## Configure HTTP headers


> [!NOTE] 
> We need to find a different home for this.  We don't want to get technical in this document.
> Add information about how to configure HTTP headers.


### <a name="tcp"></a>TCP (preview) 

TCP ingress is useful for exposing container apps that use a TCP-based protocol other than HTTP or HTTPS. For example, you can use TCP ingress to expose a container app that uses the [Redis protocol](https://redis.io/topics/protocol).

> [!NOTE]
> TCP ingress is in public preview and is only supported in Container Apps environments that use a [custom VNET](vnet-custom.md).

With TCP ingress enabled, your container app features the following characteristics:

- The container app is accessed via its fully qualified domain name (FQDN) and exposed port number.
- Other container apps in the same environment can also access a TCP ingress-enabled container app by using its name (defined by the `name` property in the Container Apps resource) and exposed port number.

## DNS

Container Apps automatically provides a built-in DNS domain for each Container Apps environment. Each app in the environment is assigned a fully qualified domain name (FQDN) that is based on the DNS domain.  For more information, see [DNS](./networking.md#dns).

You can also configure a custom DNS domain for your Container Apps environment.  For more information, see [Custom DNS](./custom-domains-certificates.md).  

For VNET-scope ingress, you can configure:

- a custom DNS domain in your Container Apps environment
- a non-custom domain with Azure Private

### Automatic fully qualified domain names

When you enable ingress, Container Apps automatically assigns a fully qualified domain name (FQDN) to your container app. The FQDN is based on the DNS domain for your Container Apps environment.  For more information, see [DNS](./networking.md#dns).

The domain name takes the following forms:

|Ingress visibility setting | Fully qualified domain name |
|---|---|
| External | `<APP_NAME>.<UNIQUE_IDENTIFIER>.<REGION_NAME>.azurecontainerapps.io`|
| Internal | `<APP_NAME>.internal.<UNIQUE_IDENTIFIER>.<REGION_NAME>.azurecontainerapps.io` |

For HTTP ingress, traffic is routed to individual applications based on the FQDN in the host header.

For TCP ingress, traffic is routed to individual applications based on the FQDN and its *exposed* port number. Other container apps in the same environment can also access a TCP ingress-enabled container app by using its name (defined by the container app's `name` property) and its *exposedPort* number.

For applications with external ingress visibility, the following conditions apply:

- An internal Container Apps environment has a single private IP address for applications. For container apps in internal environments, you must configure [DNS](./networking.md#dns) for VNET-scope ingress.
- An external Container Apps environment or Container Apps environment that isn't in a VNET has a single public IP address for applications.

You can get access to the environment's unique identifier by querying the environment settings.

[!INCLUDE [container-apps-get-fully-qualified-domain-name](../../includes/container-apps-get-fully-qualified-domain-name.md)]

## IP restrictions

Container Apps supports IP restrictions for ingress. You can restrict access to your container app by specifying a list of IP addresses or IP address ranges.  For more information, see [Configure IP restrictions](ip-restrictions.md).

## Ingress authentication

Azure Container Apps provides built-in authentication and authorization features to secure your external ingress-enabled container app.  For more information, see [Authentication and authorization in Azure Container Apps](authentication.md).

Container Apps can be configured to support client certificates (mTLS) for authentication and traffic encryption. For more information, see [Configure client certificates](client-certificates.md).

## Ingress configuration

When you enable ingress, you configure the following options:

- Public and private ingress
- Transport type: HTTPS or TCP
- Authentication: Enable authentication for your app
- Access restrictions: Restrict access to your app by IP address
- Allow insecure traffic to your app
- Traffic splitting: Split traffic between revisions of your app

For configuration details, see [Configure ingress](ingress.md).

## Traffic splitting

Containers Apps allows you to set up traffic rules that split incoming traffic between active revisions.  The rules are based on the percent of traffic going to each revision.  For more information, see [Traffic splitting](traffic-splitting.md).

## Next steps

> [!div class="nextstepaction"]
> [Configure ingress](ingress.md)
