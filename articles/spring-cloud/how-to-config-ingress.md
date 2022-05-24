---
title: How to config ingress for Azure Spring Apps
description: Describes how to config ingress for Azure Spring Apps
author: frankliu20
ms.author: haital
ms.service:  spring-cloud
ms.topic: how-to
ms.date: 05/27/2022
ms.custom: devx-track-java, devx-track-azurecli
---
# Customize the Ingress Configuration in Azure Spring Apps 

**This article applies to:** ✔️ Basic/Standard tier ✔️ Enterprise tier

This article shows you how to set and update the ingress configuration in Azure Spring Apps, using the Azure portal and CLI.

Azure Spring Apps service leverages ingress controller underlyingly to handle application traffic management. You can customize some ingress settings to fulfill your application or architectural requirements.

## Prerequisites
You must have the following resource installed:
- [Azure Spring extension](/cli/azure/azure-cli-extensions-overview) for the Azure CLI

## What are configurable
Currently, only a few core ingress settings are supported to be customized.

| Name                 | Ingress setting    | Default value | Valid range | Description                                                       |
| -------------------- | ------------------ | ------------- | ----------- | ----------------------------------------------------------------- |
| ingress-read-timeout | proxy-read-timeout | 300           | \[1,1800\]  | timeout in seconds for reading a response from proxied server |



## Set ingress configuration when creating a service
You can set ingress configuration when creating a service by using the following CLI command. 

```azurecli
az spring create \
    --resource-group <resource-group-name> \
    --name <service-name> \
    --ingress-read-timeout 300
```
This will create a service with ingress read timeout set to 300s.

## Update ingress configuration for an existing service

You can update ingress configuration for an existing service in Portal or CLI.

# [Portal](#tab/azure-portal)
1. Sign in to the portal using an account associated with the Azure subscription that contains the Azure Spring Apps instance.
2. Navigate to the **Networking** blade, then go to the tab **Ingress configuration**.
3. Update ingress configurations, and then click **Save**:
:::image type="content" source="media/how-to-config-ingress/config-ingress-read-timeout.png" lightbox="media/how-to-config-ingress/config-ingress-read-timeout.png" alt-text="Screenshot of Azure portal example for config ingress read timeout.":::

# [Azure CLI](#tab/azure-cli)
To update ingress configuration for an existing service, use the following command:

```azurecli
az spring update \
    --resource-group <resource-group-name> \
    --name <service-name> \
    --ingress-read-timeout 600
```
This will update the ingress read timeout to 600s.

## Next steps

* [Learn more about ingress controler](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers)
* [Learn more about NGINX ingress controller](https://kubernetes.github.io/ingress-nginx)