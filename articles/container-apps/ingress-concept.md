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
- [HTTPS and TCP ingress types](#ingress-types)
- [Fully qualified domain names (FQDNs)](#fully-qualified-domain-name)
- [HTTP Headers](#http-headers)
- [Traffic routing rules](#traffic-splitting-scenari[os)
- [IP restrictions](#ip-restrictions)
- [Ingress authentication](#ingress-authentication)


> [!NOTE]
> Add diagram here


Each container app can be configured with different ingress settings. For example, you can have one container app that is exposed to the public web and another that is only accessible from within your Container Apps environment.

## Ingress types

Container Apps supports two types of ingress: HTTPS and TCP.

### HTTPS

With HTTPS ingress enabled, your container app features the following characteristics:

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

> [!NOTE] 
> why is X-Forwarded-Proto used?  Example of how it's used?

The header is added to an HTTP request or response using a *name: value* format.  The following table lists the HTTP headers that are relevant to ingress in Container Apps:

> [!NOTE]
> Do we have response headers we need to document?

| Header | Description | Values | Required |
|---|---|---|---|
| `X-Forwarded-Proto` | The protocol that the client used to connect with the Container Apps service. | `http` or `https` | Yes |
| `X-Forwarded-For` | The IP address of the client that sent the request. | Yes |
| 'X-Forwarded-Host | The host name that the client used to connect with the Container Apps service. | Yes |
### <a name="tcp"></a>TCP (preview) 

TCP ingress is useful for exposing container apps that use a TCP-based protocol other than HTTP or HTTPS. For example, you can use TCP ingress to expose a container app that uses the [Redis protocol](https://redis.io/topics/protocol).

> [!NOTE]
> TCP ingress is in public preview and is only supported in Container Apps environments that use a [custom VNET](vnet-custom.md).

With TCP ingress enabled, your container app features the following characteristics:

- The container app is accessed via its fully qualified domain name (FQDN) and exposed port number.
- Other container apps in the same environment can also access a TCP ingress-enabled container app by using its name (defined by the `name` property in the Container Apps resource) and exposed port number.

## Fully qualified domain name

> [!NOTE]
> should we mention that there is an FQDN for each revision?

With ingress enabled, your application is assigned a fully qualified domain name (FQDN). The domain name takes the following forms:

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

Container Apps supports IP restrictions for ingress. You can restrict access to your container app by specifying a list of IP addresses or IP address ranges.  For more information, see [Configure IP restrictions](ip-restrictions-howto.md).


## Ingress authentication

Container Apps supports the following authentication methods for ingress:

- TLS server certificate authentication (default).
- mTLS client certificate authentication.  For more information, see [Configure client certificate authorization in Azure Container Apps](client-certificate-authorization-howto.md)
- OAUTH2 authentication.  For more information, see [Configure OAUTH2 authorization in Azure Container Apps](oauth2-authorization-howto.md)
- Do we have anything else?


## Ingress configuration

### Enable ingress

Ingress is an application-wide setting. Changes to ingress settings apply to all revisions simultaneously, and don't generate new revisions.

The ingress configuration section of the container app template has the following form:

```json
{
  ...
  "configuration": {
      "ingress": {
          "external": true,
          "targetPort": 80,
          "transport": "auto"
      }
  }
}
```

## Ingress Configuration options

> [!NOTE] 
> Need information about the flags that are available in the CLI and the portal.

The following settings are available when configuring ingress:

| Property | Description | Values | Required |
|---|---|---|---|
| `external` | Allow ingress to your app from outside its Container Apps environment. |`true` for visibility from internet or VNET, depending on app environment endpoint, `false` for visibility within app environment only. (default) | Yes |
| `targetPort` | The port your container listens to for incoming requests. | Set this value to the port number that your container uses. Your application ingress endpoint is always exposed on port `443`. | Yes |
| `exposedPort` | (TCP ingress only) An additional exposed port used to access the app. If `external` is `true`, the value must be unique in the Container Apps environment if ingress is external. | A port number from `1` to `65535`. (can't be `80` or `443`) | No |
| `transport` | The transport protocol type. | auto (default) detects HTTP/1 or HTTP/2,  `http` for HTTP/1, `http2` for HTTP/2, `tcp` for TCP. | No |
| `allowInsecure` | Allows insecure traffic to your container app. | `false` (default), `true`<br><br>If set to `true`, HTTP requests to port 80 aren't automatically redirected to port 443 using HTTPS, allowing insecure connections. | No |
| `autoTLS` | Enables automatic TLS certificate provisioning. If set to `true`, Container Apps automatically provisions a TLS certificate for your container app. |`true` (default), `false`<br><br> | No | 
| `access-restriction` | Configure IP ingress restrictions. | See [Set up IP ingress restrictions](ip-restrictions.md)| No |

> [!NOTE]
> To disable ingress for your application, omit the `ingress` configuration property entirely.


>[!NOTE]
> Should we include the other ingress scenarios, like access restrictions?

## <a name="scenarios"></a>Ingress Scenarios

### Public Container Apps environment

- TLS authentication (server certificate)
- OAUTH2 authentication
- IP Restrictions

>[!NOTE]
> Should we include the other ingress scenarios, like access restrictions?

### Private Container Apps VNET environment

- mTLS authentication (client certificate)

## Traffic splitting scenarios

The following scenarios describe configuration settings for common use cases.

### Rapid iteration

In situations where you're frequently iterating development of your container app, you can set traffic rules to always shift all traffic to the latest deployed revision.

The following example template routes all traffic to the latest deployed revision:

```jso
"ingress": { 
  "traffic": [
    {
      "latestRevision": true,
      "weight": 100
    }
  ]
}
```

Once you're satisfied with the latest revision, you can lock traffic to that revision by updating the `ingress` settings to:

```json
"ingress": { 
  "traffic": [
    {
      "latestRevision": false, // optional
      "revisionName": "myapp--knowngoodrevision",
      "weight": 100
    }
  ]
}
```

### Update existing revision

Consider a situation where you have a known good revision that's serving 100% of your traffic, but you want to issue an update to your app. You can deploy and test new revisions using their direct endpoints without affecting the main revision serving the app.

Once you're satisfied with the updated revision, you can shift a portion of traffic to the new revision for testing and verification.

The following template moves 20% of traffic over to the updated revision:

```json
"ingress": {
  "traffic": [
    {
      "revisionName": "myapp--knowngoodrevision",
      "weight": 80
    },
    {
      "revisionName": "myapp--newerrevision",
      "weight": 20
    }
  ]
}
```

### Staging microservices

When building microservices, you may want to maintain production and staging endpoints for the same app. Use labels to ensure that traffic doesn't switch between different revisions.

The following example template applies labels to different revisions.

```json
"ingress": { 
  "traffic": [
    {
      "revisionName": "myapp--knowngoodrevision",
      "weight": 100
    },
    {
      "revisionName": "myapp--98fdgt",
      "weight": 0,
      "label": "staging"
    }
  ]
}
```


## Next steps

> [!div class="nextstepaction"]
> [IP restrictions](ip-restrictions.md)
