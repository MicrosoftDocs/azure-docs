---
title: Set up HTTPS or TCP ingress in Azure Container Apps
description: Enable public and private endpoints in your app with Azure Container Apps
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: how-to
ms.date: 02/12/2023
ms.author: cshoe
ms.custom: ignite-fall-2021, event-tier1-build-2022
---

# Set up HTTPS or TCP ingress in Azure Container Apps

This article shows you how to enable ingress features for your container app.  Azure Container Apps supports two types of ingress: HTTPS and TCP.
Each container app can be configured with different ingress settings. For example, you can have one container app that is exposed to the public web and another that is only accessible from within your Container Apps environment.

>[!NOTE]
> Are the container apps referenced in this article in the same enviornment?


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

## How to enable ingress

Ingress is an application-wide setting. Changes to ingress settings apply to all revisions simultaneously, and don't generate new revisions.

#[ARM template](#tab/arm-template)

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

#[CLI](#tab/cli)

Enable ingress for your container app by using the `az containerapp ingress` command.

```bash
az containerapp ingress enable \
    --name <app-name> \
    --resource-group <resource-group> \
    --target-port <target-port> \
    --transport <transport> \
    --external <external>
```

#[Portal](#tab/portal)

Enable ingress for your container app by using the portal.


---

## How to disable ingress

#[ARM template](#tab/arm-template)

Disable ingress for your container app by using the `ingress` configuration property.  Set the `external` property to `false`:

```json
{
  ...
  "configuration": {
      "ingress": {
          "external": false
      }
  }
}
```

#[CLI](#tab/cli)

Disable ingress for your container app by using the `az containerapp ingress` command.

```bash
az containerapp ingress disable \
    --name <app-name> \
    --resource-group <resource-group> \
```

#[Portal](#tab/portal)

Disable ingress for your container app by using the portal.

---

## Configure ingress settings

You can configure ingress settings for your container app by using the `ingress` configuration property.  Using these settings you can configure the following:

- Whether your ingress-enabled app is accessible outside its Container Apps environment.
- The transport type. (HTTP/1, HTTP/2, TCP)
- The port your container listens to for incoming requests.
- The port used to access the app.
- Traffic splitting between revisions.
- IP address restrictions. For more information, see [IP address restrictions](./ip-restrictions.md).
- Client certificate authentication. For more information see [Client certificate authentication](./client-certificate-authentication-howto.md).

The following settings are available when configuring ingress:

| Property | Description | Values | Required |
|---|---|---|---|
| `external` | Whether your ingress-enabled app is accessible outside its Container Apps environment. |`true` for visibility from internet or VNET, depending on app environment endpoint, `false` for visibility within app environment only. (default) | Yes |
| `targetPort` | The port your container listens to for incoming requests. | Set this value to the port number that your container uses. Your application ingress endpoint is always exposed on port `443`. | Yes |
| `exposedPort` | (TCP ingress only) The port used to access the app. If `external` is `true`, the value must be unique in the Container Apps environment and can't be `80` or `443`. | A port number from `1` to `65535`. | No |
| `transport` | The transport type. | `http` for HTTP/1, `http2` for HTTP/2, `auto` to automatically detect HTTP/1 or HTTP/2 (default), `tcp` for TCP. | No |
| `allowInsecure` | Allows insecure traffic to your container app. | `false` (default), `true`<br><br>If set to `true`, HTTP requests to port 80 aren't automatically redirected to port 443 using HTTPS, allowing insecure connections. | No |

> [!NOTE]
> To disable ingress for your application, omit the `ingress` configuration property entirely.

## Configure ingress

> [!NOTE] 
> Need information about the flags that are available in the CLI and the portal.

> [!NOTE] 
> How far do we want to go with this?  Do we want to show how to configure ingress in the portal?  In the CLI? In the ARM template?

## HTTP headers

The HTTP headers are used to pass protocol and metadata related information between client and your container app. For example, the `X-Forwarded-Proto` header is used to identify the protocol that the client used to connect with the Container Apps service.

> [!NOTE] 
> why is X-Forwarded-Proto needed?

The header is added to an HTTP request or response using a *name: value* format.  The following table lists the HTTP headers that are added to the request or response.

| Header | Description | Values | Required |
|---|---|---|---|
| `X-Forwarded-Proto` | The protocol that the client used to connect with the Container Apps service. | `http` or `https` | Yes |

### Configure HTTP headers

> [!NOTE] 
> Add information about how to configure HTTP headers.

## Next steps

> [!div class="nextstepaction"]
> [IP restrictions](ip-restrictions.md)
