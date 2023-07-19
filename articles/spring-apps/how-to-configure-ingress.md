---
title: Customize the ingress configuration in Azure Spring Apps
description: Learn how to customize the ingress configuration in Azure Spring Apps.
author: KarlErickson
ms.author: haital
ms.service: spring-apps
ms.topic: how-to
ms.date: 09/29/2022
ms.custom: devx-track-java, devx-track-extended-java, devx-track-azurecli
---

# Customize the ingress configuration in Azure Spring Apps

**This article applies to:** ✔️ Basic/Standard ✔️ Enterprise

This article shows you how to set and update an application's ingress settings in Azure Spring Apps by using the Azure portal and Azure CLI.

The Azure Spring Apps service uses an underlying ingress controller to handle application traffic management. The following ingress settings are supported for customization.

| Name                 | Ingress setting        | Default value | Valid range       | Description                                                              |
|----------------------|------------------------|---------------|-------------------|--------------------------------------------------------------------------|
| `ingress-read-timeout` | `proxy-read-timeout`     | 300           | \[1,1800\]        | The timeout in seconds for reading a response from a proxied server.     |
| `ingress-send-timeout` | `proxy-send-timeout`     | 60            | \[1,1800\]        | The timeout in seconds for transmitting a request to the proxied server. |
| `session-affinity`     | `affinity`               | None          | Session, None     | The type of the affinity that will make the request come to the same pod replica that was responding to the previous request. Set `session-affinity` to Cookie to enable session affinity. In the portal only, you must choose the enable session affinity box.    |
| `session-max-age`      | `session-cookie-max-age` | 0             | \[0, 604800\]      | The time in seconds until the cookie expires, corresponding to the `Max-Age` cookie directive. If you set `session-max-age` to 0, the expiration period is equal to the browser session period. |
| `backend-protocol`     | `backend-protocol`       | Default       | Default, GRPC     | Sets the backend protocol to indicate how NGINX should communicate with the backend service. Default means HTTP/HTTPS/WebSocket. The `backend-protocol` setting only applies to client-to-app traffic. For app-to-app traffic within the same service instance, choose any protocol for app-to-app traffic without modifying the `backend-protocol` setting. The protocol doesn't restrict your choice of protocol for app-to-app traffic within the same service instance.  |

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- [Azure CLI](/cli/azure/install-azure-cli) with the Azure Spring Apps extension. Use the following command to remove previous versions and install the latest extension. If you previously installed the spring-cloud extension, uninstall it to avoid configuration and version mismatches.

  ```azurecli
  az extension remove --name spring
  az extension add --name spring
  az extension remove --name spring-cloud
  ```

## Set the ingress configuration

Use the following Azure CLI command to set the ingress configuration when you create.

```azurecli
az spring app create \
    --resource-group <resource-group-name> \
    --service <service-name> \
    --name <service-name> \
    --ingress-read-timeout 300 \
    --ingress-send-timeout 60 \
    --session-affinity Cookie \
    --session-max-age 1800 \
    --backend-protocol Default \
```

This command creates an app with the following settings:

- Ingress read timeout: 300 seconds
- Ingress send timeout: 60 seconds
- Session affinity: Cookie
- Session cookie max age: 1800 seconds
- Backend protocol: Default

## Update the ingress settings for an existing app

### [Azure portal](#tab/azure-portal)

Use the following steps to update the ingress settings for an application hosted by an existing service instance.

1. Sign in to the portal using an account associated with the Azure subscription that contains the Azure Spring Apps instance.
1. Navigate to the **Apps** pane, and then select the app you want to configure.
1. Navigate to the **Configuration** pane, and then select the **Ingress settings** tab.
1. Update the ingress settings, and then select **Save**.

   :::image type="content" source="media/how-to-configure-ingress/ingress-settings.jpg" lightbox="media/how-to-configure-ingress/ingress-settings.jpg" alt-text="Screenshot of Azure portal Configuration page showing the Ingress settings tab.":::

### [Azure CLI](#tab/azure-cli)

Use the following command to update the ingress settings for an existing app.

```azurecli
az spring app update \
    --resource-group <resource-group-name> \
    --service <service-name> \
    --name <service-name> \
    --ingress-read-timeout 600 \
    --ingress-send-timeout 600 \
    --session-affinity None \
    --session-max-age 0 \
    --backend-protocol GRPC \
```

This command updates the app with the following settings:

- Ingress read timeout: 600 seconds
- Ingress send timeout: 600 seconds
- Session affinity: None
- Session cookie max age: 0
- Backend protocol: GRPC

---

## FAQ

- How do you enable gRPC?

  Set the backend protocol to *GRPC*.

- How do you enable WebSocket?

  WebSocket is enabled by default if you set the backend protocol to *Default*. The WebSocket connection limit is 20000. When you reach that limit, the connection will fail.

  You can also use RSocket based on WebSocket.

- What is the difference between ingress config and ingress settings?

  Ingress config can still be used in the Azure CLI and SDK, and that setting will apply to all apps within the service instance. Once an app has been configured by ingress settings, the Ingress config won't affect it. We don't recommend that new scripts use ingress config since we plan to stop supporting it in the future.

- When ingress settings are used together with App Gateway/APIM, what happens when you set the timeout in both Azure Spring Apps ingress and the App Gateway/APIM?

  The shorter timeout is used.

- Do you need extra config in App Gateway/APIM if you need to have end-to-end support for gRPC or WebSocket?

  You don't need extra config as long as the App Gateway supports gRPC.

- Is configurable port supported?

  Configurable port isn't currently supported (80/443).

## Next steps

- [Ingress controllers](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers)
- [NGINX ingress controller](https://kubernetes.github.io/ingress-nginx)
