---
title: Customize the ingress configuration in Azure Spring Apps
description: Learn how to customize the ingress configuration in Azure Spring Apps.
author: KarlErickson
ms.author: haital
ms.service: spring-apps
ms.topic: how-to
ms.date: 09/29/2022
ms.custom: devx-track-java, devx-track-azurecli
---

# Customize the ingress configuration in Azure Spring Apps

**This article applies to:** ✔️ Basic/Standard tier ✔️ Enterprise tier

This article shows you how to set and update the applications' ingress settings in Azure Spring Apps by using the Azure portal and Azure CLI.

The Azure Spring Apps service uses an underlying ingress controller to handle application traffic management. Currently, the following ingress setting is supported for customization.

| Name                 | Ingress setting        | Default value | Valid range       | Description                                                              |
|----------------------|------------------------|---------------|-------------------|--------------------------------------------------------------------------|
| ingress-read-timeout | proxy-read-timeout     | 300           | \[1,1800\]        | The timeout in seconds for reading a response from a proxied server.     |
| ingress-send-timeout | proxy-send-timeout     | 60            | \[1,1800\]        | The timeout in seconds for transmitting a request to the proxied server. |
| session-affinity     | affinity               | None          | Session, None     | Type of the affinity, which will make the request come to the same pod replica that was responding to the request before. Set session-affinity to Cookie to enable session affinity, in the portal only need to choose the enable session affinity box.    |
| session-max-age      | session-cookie-max-age | 0             | \[0,7 days\]      | Time seconds until the cookie expires, corresponds to the Max-Age cookie directive. If set to 0, the expiration period is equal to the browser session period. |
| backend-protocol     | backend-protocol       | Default       | Default, GRPC     | Sets the backend-protocol to indicate how NGINX should communicate with the backend service. Default means HTTP/HTTPS/WebSocket. The backend-protocol setting is only about client-to-app traffic. For app-to-app traffic within the same service instance, choose any protocol for app-to-app traffic without modifying this option. The protocol doesn't restrict your choice of protocol for app-to-app traffic within the same service instance.  |

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [The Azure CLI](/cli/azure/install-azure-cli).
- The Azure Spring Apps extension. Use the following command to remove previous versions and install the latest extension. If you previously installed the spring-cloud extension, uninstall it to avoid configuration and version mismatches.

  ```azurecli
  az extension remove --name spring
  az extension add --name spring
  az extension remove --name spring-cloud
  ```

## Set the ingress settings when creating an app

You can set the ingress configuration when creating a service by using the following CLI command.

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

This command will create an app with ingress read timeout set to 300 seconds, ingress send timeout set to 60 seconds, session affinity set to `Cookie`, session cookie max age set to 1800 seconds, backend protocol set to `Default`.

## Update the ingress settings for an existing app

### [Azure portal](#tab/azure-portal)

To update the ingress settings for an existing service's application, use the following steps:

1. Sign in to the portal using an account associated with the Azure subscription that contains the Azure Spring Apps instance.
1. Navigate to the **Apps** pane, then select the app you want to configure.
1. Navigate to the **Configuration** pane, then select the **Ingress settings** tab.
1. Update the ingress settings, and then select **Save**.

   :::image type="content" source="media/how-to-configure-ingress/ingress-settings.jpg" lightbox="media/how-to-configure-ingress/ingress-settings.jpg" alt-text="Screenshot of Azure portal example for config ingress settings.":::

### [Azure CLI](#tab/azure-cli)

To update the ingress settings for an existing app, use the following command:

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

This command will update the ingress read timeout to 600 seconds, ingress send timeout set to 600 seconds, session affinity set to `None`, session cookie max age set to 0, backend protocol set to `GRPC`.

## FAQ

- How to enable gRPC?
  - Set the backend protocol to `GRPC`.

- How to enable WebSocket?
  - Set the backend protocol to `Default`, and the WebSocket is enabled by default.
  - For WebSocket connection limit, the upper limit is 20000, and when you reach that limit the connection will fail.
  - You can also use RSocket based on WebSocket.

- The `ingress config` still can be used in CLI and sdk, and that setting will apply to all apps within the service instance, but once an app has been configured by `ingress settings`, the `ingress config` won't affect it. We don't recommend that new scripts use "ingress config" since we plan to stop supporting it in the future.

- When ingress settings are used together with App Gateway/APIM, what is the overall effect of timeout when you set the timeout in both ASA ingress and the App Gateway/APIM?
  - The shorter timeout should be effective.

- Do you need extra config in App Gateway/APIM if you need to have end-to-end support for gRPC or WebSocket?
  - Nothing extra config as long as the App Gateway support gRPC.

- Configurable port isn't currently supported (80/443)

## Next steps

- [Learn more about ingress controller](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers)
- [Learn more about NGINX ingress controller](https://kubernetes.github.io/ingress-nginx)
