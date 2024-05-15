---
title: Use service tags
titleSuffix: Azure Web PubSub service
description: Use service tags to allow outbound traffic to your Azure Web PubSub service.
author: ArchangelSDY
ms.service: azure-web-pubsub
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.date: 11/08/2021
ms.author: dayshen
---

# Use service tags for Azure Web PubSub Service

You can use [Service Tags](../virtual-network/service-tags-overview.md) to identify Azure Web PubSub Service traffic. A service tag represents a group of IP address prefixes. Azure Web PubSub Service manages a service tag called `AzureWebPubSub` for both inbound and outbound traffic.

A service tag can be used when for configuring **Network Security Group**. Alternatively, you can query the IP address prefixes using [Service Tag Discovery API](../virtual-network/service-tags-overview.md#service-tags-on-premises).

## Outbound traffic

Endpoints of Azure Web PubSub Service resources are guaranteed to be within IP ranges of Service Tag `AzureWebPubSub`.

### Access Azure Web PubSub Service from virtual network

You can allow outbound traffic from your network to Azure Web PubSub Service by adding a new outbound network security rule.

#### [Azure portal](#tab/azure-portal)

1. On portal, go to the network security group.
1. Select on the settings menu called **Outbound security rules**.
1. Select the **Add** button.
1. Select **Destination** and choose **Service Tag**.
1. Select **Destination service tag** and choose **AzureWebPubSub**.
1. Enter **443** in **Destination port ranges**.

    :::image type="content" alt-text="Screenshot showing dialogue to create an outbound security rule." source="media/howto-service-tags/portal-add-outbound-security-rule.png" :::

1. Adjust other fields as needed.
1. Select **Add**.

#### [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az network nsg rule create -n <rule-name> --nsg-name <nsg-name> -g <resource-group> --priority 100 --direction Outbound --destination-address-prefixes AzureWebPubSub
```

-----

## Inbound traffic

In following scenarios, Azure Web PubSub Service can generate network traffic to your resource. The source of traffic is guaranteed to be within IP ranges of Service Tag `AzureWebPubSub`.

* Use [event handlers](howto-develop-eventhandler.md).
* Use [event listeners](howto-develop-event-listener.md)
* Use [Key Vault secret reference](howto-use-managed-identity.md#use-a-managed-identity-for-key-vault-reference) in URL template settings.
* Use [custom certificate](howto-custom-domain.md#add-a-custom-certificate).

### Event handler endpoints in virtual network

You can configure **Network Security Group** to allow inbound traffic to virtual network.

#### [Azure portal](#tab/azure-portal)

1. On portal, go to the network security group.
1. Select  **Inbound security rules**.
1. Select the **Add** button.
1. Select **Source** and choose **Service Tag** from the list.
1. Select **Source service tag** and choose **AzureWebPubSub** from the list.
1. Enter \* in **Source port ranges**.

   :::image type="content" alt-text="Screenshot showing dialogue to create an inbound security rule." source="media/howto-service-tags/portal-add-inbound-security-rule.png" :::

1. Change other settings as needed.
1. Select **Add**.

#### [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az network nsg rule create -n <rule-name> --nsg-name <nsg-name> -g <resource-group> --priority 100 --direction Inbound --source-address-prefixes AzureWebPubSub
```

-----

> [!Note]
> Azure Web PubSub Service is a shared service. By allowing Service Tag `AzureWebPubSub` or its associated IP address prefixes, you also allow traffic from other resources, even if they belong to other customers. Make sure you implement appropriate authentication on your endpoints.

### Event handler endpoints of Azure Function

You can configure a [service tag-based rule](../app-service/app-service-ip-restrictions.md#set-a-service-tag-based-rule).

Alternatively, you can use [Shared Private Endpoints](howto-secure-shared-private-endpoints.md) for better security. Shared Private Endpoints are dedicated to your resources. No traffic from other resources can access your endpoints.

### Event Hubs and Key Vault access

We recommend [Shared Private Endpoints](howto-secure-shared-private-endpoints-key-vault.md) for best security.

## Next steps

- [Network security groups: service tags](../virtual-network/network-security-groups-overview.md#security-rules)
