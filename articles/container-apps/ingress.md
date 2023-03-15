---
title: Configure Ingress for your app in Azure Container Apps
description: How to configure ingress for your container app
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: how-to
ms.date: 02/12/2023
ms.author: cshoe
ms.custom: ignite-fall-2021, event-tier1-build-2022
---

#  Configure Ingress for your app in Azure Container Apps

This article shows you how to enable ingress features for your container app.  Ingress is an application-wide setting. Changes to ingress settings apply to all revisions simultaneously, and don't generate new revisions.

When you enable ingress, you have the following options:

- Public and private ingress
- Transport type: HTTPS or TCP
- Target port: The port your container listens to for incoming requests
- Access restrictions: [Restrict access to your app by IP address](ip-restrictions.md)
- Allow insecure traffic to your app
- [Client certificate](client-certificate-authorization-howto.md) mode for mTLS authentication

## Ingress settings

You can set the following ingress properties:

| Property | Description | Values | Required |
|---|---|---|---|
| `allowInsecure` | Allows insecure traffic to your container app. | `false` (default), `true`<br><br>If set to `true`, HTTP requests to port 80 aren't automatically redirected to port 443 using HTTPS, allowing insecure connections.| No |
| `clientCertificateMode` | Client certificate mode for mTLS authentication. Ignore indicates server drops client certificate on forwarding. Accept indicates server forwards client certificate but doesn't require a client certificate. Require indicates server requires a client certificate. | `Required`, `Accept`, `Ignore` (default) | No |
| `customDomains` |Custom domain bindings for Container Apps' hostnames. | Array of bindings | No |
| `exposedPort` | (TCP ingress only) An port for TCP ingress. If `external` is `true`, the value must be unique in the Container Apps environment if ingress is external. | A port number from `1` to `65535`. (can't be `80` or `443`) | No |
| `external` | Allow ingress to your app from outside its Container Apps environment. |`true` or `false`(default) | Yes |
| `ipSecurityRestrictions` | IP ingress restrictions. See [Set up IP ingress restrictions](ip-restrictions.md) | array of rules | No |
| `targetPort` | The port your container listens to for incoming requests. | Set this value to the port number that your container uses. Your application ingress endpoint is always exposed on port `443`. | Yes |
|`traffic` | Traffic weights based on revision name or [revision label](revisions.md#revision-labels) | array of rules | No |
| `transport` | The transport protocol type. | auto (default) detects HTTP/1 or HTTP/2,  `http` for HTTP/1, `http2` for HTTP/2, `tcp` for TCP. | No |

<!--

This is supposed to be the schema for ingress.  We haven't changed to this yet, but it's what we're planning on.

https://github.com/Azure/azure-rest-api-specs/blob/4fcd6d4eb9153ff8dbbb2940d62c3789ca15e8ce/specification/app/resource-manager/Microsoft.App/stable/2022-10-01/ContainerApps.json#L703

"Ingress": {
      "description": "Container App Ingress configuration.",
      "type": "object",
      "properties": {
        "fqdn": {
          "description": "Hostname.",
          "type": "string",
          "readOnly": true
        },
        "external": {
          "description": "Bool indicating if app exposes an external http endpoint",
          "default": false,
          "type": "boolean"
        },
        "targetPort": {
          "format": "int32",
          "description": "Target Port in containers for traffic from ingress",
          "type": "integer"
        },
        "exposedPort": {
          "format": "int32",
          "description": "Exposed Port in containers for TCP traffic from ingress",
          "type": "integer"
        },
        "transport": {
          "description": "Ingress transport protocol",
          "enum": [
            "auto",
            "http",
            "http2",
            "tcp"
          ],
          "type": "string",
          "x-ms-enum": {
            "name": "IngressTransportMethod",
            "modelAsString": true
          },
          "default": "auto"
        },
        "traffic": {
          "description": "Traffic weights for app's revisions",
          "type": "array",
          "items": {
            "$ref": "#/definitions/TrafficWeight"
          },
          "x-ms-identifiers": [
            "revisionName"
          ]
        },
        "customDomains": {
          "description": "custom domain bindings for Container Apps' hostnames.",
          "type": "array",
          "items": {
            "$ref": "#/definitions/CustomDomain"
          },
          "x-ms-identifiers": [
            "name"
          ]
        },
        "allowInsecure": {
          "description": "Bool indicating if HTTP connections to is allowed. If set to false HTTP connections are automatically redirected to HTTPS connections",
          "type": "boolean",
          "default": false
        },
        "ipSecurityRestrictions": {
          "description": "Rules to restrict incoming IP address.",
          "type": "array",
          "items": {
            "$ref": "#/definitions/IpSecurityRestrictionRule"
          },
          "x-ms-identifiers": [
            "name"
          ]
        },
        "clientCertificateMode": {
          "description": "Client certificate mode for mTLS authentication. Ignore indicates server drops client certificate on forwarding. Accept indicates server forwards client certificate but does not require a client certificate. Require indicates server requires a client certificate.",
          "enum": [
            "ignore",
            "accept",
            "require"
          ],
          "type": "string",
          "x-ms-enum": {
            "name": "IngressClientCertificateMode",
            "modelAsString": true
          }
        },
     }
    },
-->

## Enable ingress

>[!NOTE]
> Need to think about how to present the different options for enabling ingress.  Do we break the setting down to separate sections?  

You can configure ingress for your container app using the Azure CLI, an ARM template or the Azure portal.

# [Azure CLI](#tab/azure-cli)

This `az containerapp ingress enable` command enables ingress for your container app.  You must specify the target port, and you can optionally set the exposed port if your transport type is `tcp`.

```azurecli
az containerapp ingress enable \
    --name <app-name> \
    --resource-group <resource-group> \
    --target-port <target-port> \
    --exposed-port tcp-exposed-port> \
    --transport <transport> \
    --type <external>
    --allow-insecure
```

`az containerapp ingress enable` ingress arguments:

| Option | Property | Description | Values | Required |
| --- | --- | --- | --- | --- |
| `--type` | external | Allow ingress to your app from outside its Container Apps environment. |
| `external` or `internal`  | Yes |
|`--allow-insecure` | allowInsecure | Allow HTTP connections to your app. |  | No |
| `--target-port` | targetPort | The port your container listens to for incoming requests. | Set this value to the port number that your container uses. Your application ingress endpoint is always exposed on port `443`. | Yes |
|`--exposed-port | exposedPort | (TCP ingress only) An port for TCP ingress. If `external` is `true`, the value must be unique in the Container Apps environment if ingress is external. | A port number from `1` to `65535`. (can't be `80` or `443`) | No |
|`--transport` | transport | The transport protocol type. | auto (default) detects HTTP/1 or HTTP/2,  `http` for HTTP/1, `http2` for HTTP/2, `tcp` for TCP. | No |



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

Disable ingress for your container app by omitting the `ingress` configuration property entirely.

---


## Next steps

> [!div class="nextstepaction"]
> [Ingress in Azure Container Apps](ip-restrictions.md)
