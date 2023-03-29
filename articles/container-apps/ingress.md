---
title: Set up HTTPS or TCP ingress in Azure Container Apps
description: Enable public and private endpoints in your app with Azure Container Apps
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: how-to
ms.date: 11/28/2022
ms.author: cshoe
ms.custom: ignite-fall-2021, event-tier1-build-2022
---

# Set up HTTPS or TCP ingress in Azure Container Apps

Azure Container Apps allows you to expose your container app to the public web, to your VNET, or to other container apps within your environment by enabling ingress. When you enable ingress, you don't need to create an Azure Load Balancer, public IP address, or any other Azure resources to enable incoming HTTPS requests.

Each container app can be configured with different ingress settings. For example, you can have one container app that is exposed to the public web and another that is only accessible from within your Container Apps environment.

## Ingress types

Azure Container Apps supports two types of ingress: HTTPS and TCP.

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

### <a name="tcp"></a>TCP (preview)

TCP ingress is useful for exposing container apps that use a TCP-based protocol other than HTTP or HTTPS.

> [!NOTE]
> TCP ingress is in public preview and is only supported in Container Apps environments that use a [custom VNET](vnet-custom.md).

With TCP ingress enabled, your container app features the following characteristics:

- The container app is accessed via its fully qualified domain name (FQDN) and exposed port number
- Other container apps in the same environment can also access a TCP ingress-enabled container app by using its name (defined by the `name` property in the Container Apps resource) and exposed port number

## Configuration

Ingress is an application-wide setting. Changes to ingress settings apply to all revisions simultaneously, and don't generate new revisions.

The ingress configuration section has the following form:

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

The following settings are available when configuring ingress:

| Property | Description | Values | Required |
|---|---|---|---|
| `external` | Whether your ingress-enabled app is accessible outside its Container Apps environment. |`true` for visibility from internet or VNET, depending on app environment endpoint configured, `false` for visibility within app environment only. (default) | Yes |
| `targetPort` | The port your container listens to for incoming requests. | Set this value to the port number that your container uses. Your application ingress endpoint is always exposed on port `443`. | Yes |
| `exposedPort` | (TCP ingress only) The port used to access the app. If `external` is `true`, the value must be unique in the Container Apps environment and cannot be `80` or `443`. | A port number from `1` to `65535`. | No |
| `transport` | The transport type. | `http` for HTTP/1, `http2` for HTTP/2, `auto` to automatically detect HTTP/1 or HTTP/2 (default), `tcp` for TCP. | No |
| `allowInsecure` | Allows insecure traffic to your container app. | `false` (default), `true`<br><br>If set to `true`, HTTP requests to port 80 aren't automatically redirected to port 443 using HTTPS, allowing insecure connections. | No |

> [!NOTE]
> To disable ingress for your application, omit the `ingress` configuration property entirely.

## Fully qualified domain name

With ingress enabled, your application is assigned a fully qualified domain name (FQDN). The domain name takes the following forms:

|Ingress visibility setting | Fully qualified domain name |
|---|---|
| External | `<APP_NAME>.<UNIQUE_IDENTIFIER>.<REGION_NAME>.azurecontainerapps.io`|
| Internal | `<APP_NAME>.internal.<UNIQUE_IDENTIFIER>.<REGION_NAME>.azurecontainerapps.io` |

For HTTP ingress, traffic is routed to individual applications based on the FQDN in the host header.

For TCP ingress, traffic is routed to individual applications based on the FQDN and its *exposed* port number. Other container apps in the same environment can also access a TCP ingress-enabled container app by using its name (defined by the container app's `name` property) and its *exposedPort* number.

For applications with external ingress visibility, the following conditions apply:
- An internal Container Apps environment has a single private IP address for applications. For container apps in internal environments, you must configure [DNS](./networking.md#dns) for VNET-scope ingress.
- An external Container Apps environment or Container Apps environment that is not in a VNET has a single public IP address for applications.

You can get access to the environment's unique identifier by querying the environment settings.

[!INCLUDE [container-apps-get-fully-qualified-domain-name](../../includes/container-apps-get-fully-qualified-domain-name.md)]

## <a name="ip-access-restrictions"></a>Inbound access restrictions by IP address ranges (preview)

By default, ingress doesn't filter traffic. You can add restrictions to limit access based on IP addresses. There are two ways to filter traffic:

* **Allowlist**:  Deny all inbound traffic, but allow access from a list of IP address ranges
* **Denylist**: Allow all inbound traffic, but deny access from a list of IP address ranges

> [!NOTE]
> If defined, all rules must be the same type. You cannot combine allow rules and deny rules.
>
> IPv4 addresses are supported. Define each IPv4 address block in Classless Inter-Domain Routing (CIDR) notation. To learn more about CIDR notation, see [Classless Inter-Domain Routing](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing).

### Configure an allowlist

To allow inbound traffic from a specified IP range, run the following Azure CLI command.

```azurecli
az containerapp ingress access-restriction set \
   --name MyContainerapp \
   --resource-group MyResourceGroup \
   --rule-name restrictionName \
   --ip-address 192.168.1.1/28 \
   --description "Restriction description." \
   --action Allow
```

Add more allow rules by repeating the command with a different IP address range in the `--ip-address` parameter. When you configure one or more allow rules, only traffic that matches at least one rule is allowed. All other traffic is denied.

### Configure a denylist

To deny inbound traffic from a specified IP range, run the following Azure CLI command.

```azurecli
az containerapp ingress access-restriction set \
  --name MyContainerapp \
  --resource-group MyResourceGroup \
  --rule-name my-restriction \
  --ip-address 192.168.1.1/28 \
  --description "Restriction description."
  --action Deny
```

Add more deny rules by repeating the command with a different IP address range in the `--ip-address` parameter. When you configure one or more deny rules, any traffic that matches at least one rule is denied. All other traffic is allowed.

### Remove access restrictions

To remove an access restriction, run the following Azure CLI command.

```azurecli
az containerapp ingress access-restriction remove
  --name MyContainerapp \
  --resource-group MyResourceGroup \
  --rule-name my-restriction
```

## Next steps

> [!div class="nextstepaction"]
> [Manage scaling](scale-app.md)
