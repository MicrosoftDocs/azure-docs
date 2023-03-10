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

This article shows you how to enable ingress features for your container app.  Ingress is an application-wide setting. Changes to ingress settings apply to all revisions simultaneously, and don't generate new revisions.

When you enable ingress, you have the following options:

- Public and private ingress
- Transport type: HTTPS or TCP
- Target port: The port your container listens to for incoming requests
- Authentication: Enable authentication for your app
- Access restrictions: [Restrict access to your app by IP address](ip-restrictions.md)
- Allow insecure traffic to your app

## Ingress settings


> [!NOTE] 
> Need information about the flags that are available in the CLI and the portal.  But this table shows what I have so far

The following settings are available when configuring ingress:

| Property | Description | Values | Required |
|---|---|---|---|
| `type` | Allow ingress to your app from outside its Container Apps environment. |`external` or `external` | Yes |
| `targetPort` | The port your container listens to for incoming requests. | Set this value to the port number that your container uses. Your application ingress endpoint is always exposed on port `443`. | Yes |
| `exposedPort` | (TCP ingress only) An additional exposed port used to access the app. If `external` is `true`, the value must be unique in the Container Apps environment if ingress is external. | A port number from `1` to `65535`. (can't be `80` or `443`) | No |
| `transport` | The transport protocol type. | auto (default) detects HTTP/1 or HTTP/2,  `http` for HTTP/1, `http2` for HTTP/2, `tcp` for TCP. | No |
| `allowInsecure` | Allows insecure traffic to your container app. | `false` (default), `true`<br><br>If set to `true`, HTTP requests to port 80 aren't automatically redirected to port 443 using HTTPS, allowing insecure connections. | No |
| `autoTLS` | Enables automatic TLS certificate provisioning. If set to `true`, Container Apps automatically provisions a TLS certificate for your container app. |`true` (default), `false`<br><br> | No | 
| `access-restriction` | Configure IP ingress restrictions. | See [Set up IP ingress restrictions](ip-restrictions.md)| No |
|`traffic` | Configure traffic splitting.  Set the weight based on revision name or [revision label](revisions.md#revision-labels) | 0 - 100 | No |

>[!NOTE]
> Should we add the customDomain property here?

## Enable ingress

Enable ingress for your container app by using the `az containerapp ingress` command.

# [Azure CLI](#tab/azure-cli)

```azurecli
az containerapp ingress enable \
    --name <app-name> \
    --resource-group <resource-group> \
    --target-port <target-port> \
    --transport <transport> \
    --type <external>
```

# [Portal](#tab/portal)

Enable ingress for your container app by using the portal.

# [ARM template](#tab/arm-template)

Disable ingress for your container app by using the `ingress` configuration property.  Set the `external` property to `false`:

```json
{
  ...
  "configuration": {
      "ingress": {
          "external": true
      }
  }
}
```

---

## Disable ingress

# [Azure CLI](#tab/azure-cli)

Disable ingress for your container app by using the `az containerapp ingress` command.

```azurecli
az containerapp ingress disable \
    --name <app-name> \
    --resource-group <resource-group> \
```

# [Portal](#tab/portal)

Disable ingress for your container app by using the portal.

# [ARM template](#tab/arm-template)

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

> [!NOTE]
> To disable ingress for your application, omit the `ingress` configuration property entirely.


---

## Internal ingress

## Transport type

### Set TCP ingress

Set TCP ingress with the `az containerapp ingress enable` command.  When you set TCP ingress, you must specify the target port, and you can optionally set the exposed port.

# [Azure CLI](#tab/azure-cli)

```azurecli
az containerapp ingress enable \
    --name <app-name> \
    --resource-group <resource-group> \
    --target-port <target-port> \
    --exposed-port <exposed-port> \
    --transport tcp \
    --type external
```

# [Portal](#tab/portal)

Enable ingress for your container app by using the portal.

# [ARM template](#tab/arm-template)

Disable ingress for your container app by using the `ingress` configuration property.  Set the `external` property to `false`:

```json
{
  ...
  "configuration": {
      "ingress": {
          "external": true
      }
  }
}
```

---

## Traffic splitting

# [Azure CLI](#tab/azure-cli)

DisConfigure traffic splitting between revisions using the `az containerapp ingress traffic set` command.

The following command set the traffic weight for revision `v1` to `50` and revision `v2` to `50`:

```azurecli
az containerapp ingress traffic set \
    --name <app-name> \
    --resource-group <resource-group> \
    --revision-weight v1=50 v2=50
```

This command sets the traffic weight for revision labeled `label-1` to `50` and revision `label-2` to `50`:

```azurecli
az containerapp ingress traffic set \
    --name <app-name> \
    --resource-group <resource-group> \
    --label-weight label-1=50 label-2=50
```

# [Portal](#tab/portal)

Disable ingress for your container app by using the portal.

# [ARM template](#tab/arm-template)

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

---

## Configure HTTP headers

> [!NOTE] 
> Add information about how to configure HTTP headers.

## Next steps

> [!div class="nextstepaction"]
> [IP restrictions](ip-restrictions.md)
