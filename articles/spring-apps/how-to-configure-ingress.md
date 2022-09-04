---
title: How to configure ingress for Azure Spring Apps
description: Describes how to configure ingress for Azure Spring Apps.
author: KarlErickson
ms.author: haital
ms.service: spring-apps
ms.topic: how-to
ms.date: 05/27/2022
ms.custom: devx-track-java, devx-track-azurecli
---

# Customize the ingress configuration in Azure Spring Apps

**This article applies to:** ✔️ Basic/Standard tier ✔️ Enterprise tier

This article shows you how to set and update the ingress configuration in Azure Spring Apps by using the Azure portal and Azure CLI.

The Azure Spring Apps service uses an underlying ingress controller to handle application traffic management. Currently, the following ingress setting is supported for customization.

| Name                 | Ingress setting    | Default value | Valid range | Description                                                          |
|----------------------|--------------------|---------------|-------------|----------------------------------------------------------------------|
| ingress-read-timeout | proxy-read-timeout | 300           | \[1,1800\]  | The timeout in seconds for reading a response from a proxied server. |

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [The Azure CLI](/cli/azure/install-azure-cli).
- The Azure Spring Apps extension. Use the following command to remove previous versions and install the latest extension. If you previously installed the spring-cloud extension, uninstall it to avoid configuration and version mismatches.

  ```azurecli
  az extension remove --name spring
  az extension add --name spring
  az extension remove --name spring-cloud
  ```

## Set the ingress configuration when creating a service

You can set the ingress configuration when creating a service by using the following CLI command.

```azurecli
az spring create \
    --resource-group <resource-group-name> \
    --name <service-name> \
    --ingress-read-timeout 300
```

This command will create a service with ingress read timeout set to 300 seconds.

## Update the ingress configuration for an existing service

### [Azure portal](#tab/azure-portal)

To update the ingress configuration for an existing service, use the following steps:

1. Sign in to the portal using an account associated with the Azure subscription that contains the Azure Spring Apps instance.
2. Navigate to the **Networking** pane, then select the **Ingress configuration** tab.
3. Update the ingress configuration, and then select **Save**.

   :::image type="content" source="media/how-to-configure-ingress/config-ingress-read-timeout.png" lightbox="media/how-to-configure-ingress/config-ingress-read-timeout.png" alt-text="Screenshot of Azure portal example for config ingress read timeout.":::

### [Azure CLI](#tab/azure-cli)

To update the ingress configuration for an existing service, use the following command:

```azurecli
az spring update \
    --resource-group <resource-group-name> \
    --name <service-name> \
    --ingress-read-timeout 600
```

This command will update the ingress read timeout to 600 seconds.

## Next steps

- [Learn more about ingress controller](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers)
- [Learn more about NGINX ingress controller](https://kubernetes.github.io/ingress-nginx)
