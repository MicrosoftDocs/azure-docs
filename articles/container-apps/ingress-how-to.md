---
title: Configure Ingress for your app in Azure Container Apps
description: How to configure ingress for your container app
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: how-to
ms.date: 03/28/2023
ms.author: cshoe
ms.custom: ignite-fall-2021, event-tier1-build-2022
zone_pivot_groups: arm-azure-cli-portal
---

#  Configure Ingress for your app in Azure Container Apps

This article shows you how to enable [ingress](ingress-overview.md) features for your container app.  Ingress is an application-wide setting. Changes to ingress settings apply to all revisions simultaneously, and don't generate new revisions.

## Ingress settings

You can set the following ingress template properties:

| Property | Description | Values | Required |
|---|---|---|---|
| `allowInsecure` | Allows insecure traffic to your container app. When set to `true` HTTP requests to port 80 aren't automatically redirected to port 443 using HTTPS, allowing insecure connections.| `false` (default), `true` enables insecure connections| No |
| `clientCertificateMode` | Client certificate mode for mTLS authentication. Ignore indicates server drops client certificate on forwarding. Accept indicates server forwards client certificate but doesn't require a client certificate. Require indicates server requires a client certificate. | `Required`, `Accept`, `Ignore` (default) | No |
| `customDomains` | Custom domain bindings for Container Apps' hostnames. See [Custom domains and certificates](custom-domains-certificates.md) | An array of bindings | No |
| `exposedPort` | (TCP ingress only) The port TCP listens on. If `external` is `true`, the value must be unique in the Container Apps environment. | A port number from `1` to `65535`. (can't be `80` or `443`) | No |
| `external` | Allow ingress to your app from outside its Container Apps environment. |`true` or `false`(default) | Yes |
| `ipSecurityRestrictions` | IP ingress restrictions. See [Set up IP ingress restrictions](ip-restrictions.md) | An array of rules | No |
| `stickySessions.affinity` | Enables [session affinity](sticky-sessions.md). | `none` (default), `sticky` | No |
| `targetPort` | The port your container listens to for incoming requests. | Set this value to the port number that your container uses. For HTTP ingress, your application ingress endpoint is always exposed on port `443`. | Yes |
| `traffic` | [Traffic splitting](traffic-splitting.md) weights split between revisions. | An array of rules | No |
| `transport` | The transport protocol type. | auto (default) detects HTTP/1 or HTTP/2, `http` for HTTP/1, `http2` for HTTP/2, `tcp` for TCP. | No |


## Enable ingress

You can configure ingress for your container app using the Azure CLI, an ARM template, or the Azure portal.

::: zone pivot="azure-cli"

# [Azure CLI](#tab/azure-cli)

This `az containerapp ingress enable` command enables ingress for your container app.  You must specify the target port, and you can optionally set the exposed port if your transport type is `tcp`.

```azurecli
az containerapp ingress enable \
    --name <app-name> \
    --resource-group <resource-group> \
    --target-port <target-port> \
    --exposed-port <tcp-exposed-port> \
    --transport <transport> \
    --type <external>
    --allow-insecure
```

`az containerapp ingress enable` ingress arguments:

| Option | Property | Description | Values | Required |
| --- | --- | --- | --- | --- |
| `--type` | external | Allow ingress to your app from anywhere, or limit ingress to its internal 
 Container Apps environment. | `external` or `internal`  | Yes |
|`--allow-insecure` | allowInsecure | Allow HTTP connections to your app. |  | No |
| `--target-port` | targetPort | The port your container listens to for incoming requests. | Set this value to the port number that your container uses. Your application ingress endpoint is always exposed on port `443`. | Yes |
|`--exposed-port` | exposedPort | (TCP ingress only) An port for TCP ingress. If `external` is `true`, the value must be unique in the Container Apps environment if ingress is external. | A port number from `1` to `65535`. (can't be `80` or `443`) | No |
|`--transport` | transport | The transport protocol type. | auto (default) detects HTTP/1 or HTTP/2,  `http` for HTTP/1, `http2` for HTTP/2, `tcp` for TCP. | No |

::: zone-end

::: zone pivot="azure-portal"

# [Portal](#tab/portal)

Enable ingress for your container app by using the portal.

You can enable ingress when you create your container app, or you can enable ingress for an existing container app.  
- To configure ingress when you create your container app, select **Ingress** from the **App Configuration** tab of the container app creation wizard.
- To configure ingress for an existing container app, select **Ingress** from the **Settings** menu of the container app resource page.

### Enabling ingress for your container app:

You can configure ingress when you create your container app by using the Azure portal.


1. Set **Ingress** to **Enabled**.
1. Configure the ingress settings for your container app.
1. Select **Limited to Container Apps Environment** for internal ingress or **Accepting traffic from anywhere** for external ingress.
1. Select the **Ingress Type**:  **HTTP** or **TCP** (TCP ingress is only available in environments configured with a custom VNET).
1. If *HTTP* is selected for the **Ingress Type**, select the **Transport**: **Auto**, **HTTP/1** or **HTTP/2**. 
1. Select **Insecure connections** if you want to allow HTTP connections to your app.
1. Enter the **Target port** for your container app.
1. If you have selected **TCP** for the **Transport** option, enter the **Exposed port** for your container app. The exposed port number can be `1` to `65535`. (can't be `80` or `443`)

The **Ingress** settings page for your container app also allows you to configure **IP Restrictions**.  For information to configure IP restriction, see [IP Restrictions](ip-restrictions.md).

::: zone-end

::: zone pivot="azure-resource-manager"

# [ARM template](#tab/arm-template)

Enable ingress for your container app by using the `ingress` configuration property.  Set the `external` property to `true`, and set your `transport` and `targetPort` properties.  
-`external` property can be set to *true* for external or *false* for internal ingress.
- Set the `transport` to `auto` to detect HTTP/1 or HTTP/2, `http` for HTTP/1, `http2` for HTTP/2, or `tcp` for TCP.
- Set the `targetPort` to the port number that your container uses. Your application ingress endpoint is always exposed on port `443`.
- Set the `exposedPort` property if transport type is `tcp` to a port for TCP ingress. The value must be unique in the Container Apps environment if ingress is external. A port number from `1` to `65535`. (can't be `80` or `443`)

```json
{
  ...
  "configuration": {
    "ingress": {
        "external": true,
        "transport": "tcp",
        "targetPort": 80,
        "exposedPort": 8080,
    },
  }
}
```

---

::: zone-end

::: zone pivot="azure-cli"

## Disable ingress

# [Azure CLI](#tab/azure-cli)

Disable ingress for your container app by using the `az containerapp ingress` command.

```azurecli
az containerapp ingress disable \
    --name <app-name> \
    --resource-group <resource-group> \
```

::: zone-end

::: zone pivot="azure-portal"

# [Portal](#tab/portal)

You can disable ingress for your container app  using the portal.

1. Select **Ingress** from the **Settings** menu of the container app page.
1. Deselect the **Ingress** **Enabled** setting.
1. Select **Save**.

:::image type="content" source="media/ingress/screenshot-disable-ingress.png" alt-text="Sceenshot of  disabling container app ingress.":::

::: zone-end

::: zone pivot="azure-resource-manager"

# [ARM template](#tab/arm-template)

Disable ingress for your container app by omitting the `ingress` configuration property from `properties.configuration` entirely.

---

::: zone-end

## Next steps

> [!div class="nextstepaction"]
> [Ingress in Azure Container Apps](ingress-overview.md)
