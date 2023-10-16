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

You can use [Service Tags](../virtual-network/network-security-groups-overview.md#service-tags) for Azure Web PubSub service when configuring [Network Security Group](../virtual-network/network-security-groups-overview.md#network-security-groups). It allows you to define inbound/outbound network security rule for Azure Web PubSub Service endpoints without need to hardcode IP addresses.

Azure Web PubSub service manages these service tags. You can't create your own service tag or modify an existing tag. Microsoft manages the address prefixes that match to the service tag and automatically updates the service tag as addresses change.

> [!Note]
> Starting from 15 August 2021, Azure Web PubSub service supports bidirectional Service Tag for both inbound and outbound traffic.

## Use service tag via Azure CLI

### Configure outbound traffic

You can allow outbound traffic to Azure Web PubSub service by adding a new outbound network security rule:

```azurecli-interactive
az network nsg rule create -n <rule-name> --nsg-name <nsg-name> -g <resource-group> --priority 100 --direction Outbound --destination-address-prefixes AzureWebPubSub
```

### Configure inbound traffic

If you're using [event handler](concept-service-internals.md#event-handler), you can also allow inbound traffic from Azure Web PubSub service by adding a new inbound network security rule:

```azurecli-interactive
az network nsg rule create -n <rule-name> --nsg-name <nsg-name> -g <resource-group> --priority 100 --direction Inbound --source-address-prefixes AzureWebPubSub
```

## Next steps

- [Network security groups: service tags](../virtual-network/network-security-groups-overview.md#security-rules)
