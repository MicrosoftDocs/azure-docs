---
title: Set up HTTPS ingress in Azure Container Apps
description: Enable public and private endpoints in your app with Azure Container Apps
services: app-service
author: craigshoemaker
ms.service: app-service
ms.topic:  how-to
ms.date: 09/16/2021
ms.author: cshoe
---

# Set up HTTPS ingress in Azure Container Apps

Azure Container Apps allows you to expose your container app to the public web by enabling ingress. When you enable ingress, you do not need to create an Azure Load Balancer, public IP address, or any other Azure resources to enable incoming HTTPS requests.

With ingress enabled, your container app features the following characteristics:

- Supports TLS termination
- Supports HTTP/1.1 and HTTP/2
- Endpoints always use TLS 1.2, terminated at the ingress point
- Endpoints always expose ports 80 (for HTTP) and 443 (for HTTPS).
  - By default, HTTP requests to port 80 are automatically redirected to HTTPS on 443.

## Configuration

Ingress is an application-wide setting. Changes to ingress settings apply to all revisions simultaneously, and do not generate new revisions.

The ingress configuration section has the following form:

```json
{
  ...
  "configuration": {
      "ingress": {
          "external": true,
          "targetPort": 80,
          "transport": auto
      }
  }
}
```

The following settings are available when configuring ingress:

| Property | Description | Values | Required |
|---|---|---|---|
| `external` | Your ingress IP and fully qualified domain name can either be visible externally to the internet, or internally within a VNET. |<li>`true` for external visibility<li>`false` for internal visibility | Yes |
| `targetPort` | The port your container listens to for incoming requests. | Set this value to the port number that your container uses. Your application ingress endpoint is always exposed on port `443`. | Yes |
| `transport` | You can use either HTTP/1.1 or HTTP/2, or you can set it to automatically detect the transport type. | <li>`http` for HTTP/1<li>`http2` for HTTP/2<li>`auto` to automatically detect the transport type (default) | No |
| `allowInsecure` | If set to true, HTTP requests to port 80 are not automatically redirected to port 443 using HTTPS, allowing insecure connections. | `false` (default), `true` | No |

> [!NOTE]
> To disable ingress for your application, you can omit the `ingress` configuration property entirely.

## IP addresses and domain names

With ingress enabled, your application is assigned a fully qualified domain name (FQDN). The domain name takes the following forms:

|Ingress visibility setting | Fully qualified domain name |
|---|---|
| External | `<APP_NAME>.<UNIQUE_IDENTIFIER>.<REGION_NAME>.containerapps.io`|
| Internal | `<APP_NAME>.internal.<UNIQUE_IDENTIFIER>.<REGION_NAME>.containerapps.io` |

Your Container Apps environment has a single public IP address for applications with `external` ingress visibility, and a single internal IP address for applications with `internal` ingress visibility. Therefore, all applications within a Container Apps environment with `external` ingress visibility share a single public IP address. Similarly, all applications within a Container Apps environment with `internal` ingress visibility share a single internal IP address. HTTP traffic is routed to individual applications based on the FQDN in the host header.

You can get access to the environment's unique identifier by querying the environment settings.

### Get fully qualified domain name

The `az containerapp show` command returns the fully qualified domain name of an application.

```azurecli
az containerapp show \
  --resource-group <RESOURCE_GROUP_NAME> \
  --name <CONTAINER_APP_NAME> \
  --query configuration.ingress.fqdn
```

In this example, replace the placeholders surrounded by `<>` with your values.

The value returned from this command resembles a domain name like the following example:

```sh
myapp.happyhill-70162bb9.eastus2.azurecontainerapps.io
```

> [!div class="nextstepaction"]
> [Manage scaling](scale-app.md)
