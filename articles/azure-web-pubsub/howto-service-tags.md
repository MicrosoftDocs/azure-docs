---
title: Use service tags
titleSuffix: Azure Web PubSub
description: Learn how to use service tags to allow outbound traffic to your Azure Web PubSub resource.
author: ArchangelSDY
ms.service: azure-web-pubsub
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.date: 08/16/2024
ms.author: dayshen
---

# Use service tags for Azure Web PubSub

You can use [service tags](../virtual-network/service-tags-overview.md) to identify Azure Web PubSub traffic. A service tag represents a group of IP address prefixes. Web PubSub manages a service tag called `AzureWebPubSub` for both inbound and outbound traffic.

You can use a service tag to configure a network security group. Alternatively, you can query the IP address prefixes by using the [Service Tag Discovery API](../virtual-network/service-tags-overview.md#service-tags-on-premises).

## Outbound traffic

Endpoints of Web PubSub resources are guaranteed to be within IP ranges of the service tag `AzureWebPubSub`.

### Access Web PubSub resources from a virtual network

You can allow outbound traffic from your network to Web PubSub by adding a new outbound network security rule.

#### [Azure portal](#tab/azure-portal)

1. In the portal, go to the network security group.
1. On the left menu, select **Outbound security rules**.
1. Select **Add**.
1. Select **Destination**, and then select **Service Tag**.
1. Select **Destination service tag**, and then select **AzureWebPubSub**.
1. For **Destination port ranges**, enter **443**.

    :::image type="content" alt-text="Screenshot showing dialogue to create an outbound security rule." source="media/howto-service-tags/portal-add-outbound-security-rule.png" :::

1. Update other fields as needed.
1. Select **Add**.

#### [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az network nsg rule create -n <rule-name> --nsg-name <nsg-name> -g <resource-group> --priority 100 --direction Outbound --destination-address-prefixes AzureWebPubSub
```

-----

## Inbound traffic

In the following scenarios, Azure Web PubSub can generate network traffic to your resource. The source of traffic is guaranteed to be within IP ranges of the `AzureWebPubSub` service tag.

* Use [event handlers](howto-develop-eventhandler.md).
* Use [event listeners](howto-develop-event-listener.md).
* Use a [Key Vault secret reference](howto-use-managed-identity.md#use-a-managed-identity-for-a-key-vault-reference) in URL template settings.
* Use a [custom certificate](howto-custom-domain.md#add-a-custom-certificate).

### Event handler endpoints in a virtual network

You can configure a *network security group* to allow inbound traffic to a virtual network.

#### [Azure portal](#tab/azure-portal)

1. In the Azure portal, go to the network security group.
1. On the left menu, select **Inbound security rules**.
1. Select **Add**.
1. Select **Source**, and then select **Service Tag**.
1. Select **Source service tag**, and then select **AzureWebPubSub**.
1. For **Source port ranges**, enter **\***.

   :::image type="content" alt-text="Screenshot showing dialogue to create an inbound security rule." source="media/howto-service-tags/portal-add-inbound-security-rule.png" :::

1. Update other settings as needed.
1. Select **Add**.

#### [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az network nsg rule create -n <rule-name> --nsg-name <nsg-name> -g <resource-group> --priority 100 --direction Inbound --source-address-prefixes AzureWebPubSub
```

-----

> [!NOTE]
> Azure Web PubSub is a shared service. By allowing the `AzureWebPubSub` service tag or its associated IP address prefixes, you also allow traffic from other resources, even if they belong to other customers. Make sure that you implement appropriate authentication on your endpoints.

### Event handler endpoints for Azure Functions

You can configure a [service tag-based rule](../app-service/app-service-ip-restrictions.md#set-a-service-tag-based-rule).

Alternatively, you can use [shared private endpoints](howto-secure-shared-private-endpoints.md) for increased security. Shared private endpoints are dedicated to your resources. No traffic from other resources can access your endpoints.

### Azure Event Hubs and Azure Key Vault access

We recommend that you use [shared private endpoints](howto-secure-shared-private-endpoints-key-vault.md) to help you maintain the best security.

## Related content

* [Network security groups: service tags](../virtual-network/network-security-groups-overview.md#security-rules)
