---
title: Use service tags
titleSuffix: Azure SignalR Service
description: Use service tags to allow outbound traffic to your Azure SignalR Service
services: signalr
author: vicancy
ms.service: signalr
ms.topic: how-to
ms.date: 12/12/2022
ms.author: lianwei
---

# Use service tags for Azure SignalR Service

You can use [Service Tags](../virtual-network/service-tags-overview.md) to identify Azure SignalR Service traffic. A service tag represents a group of IP address prefixes. Azure SignalR Service manages a service tag called `AzureSignalR` for both inbound and outbound traffic.

A service tag can be used when for configuring **Network Security Group**. Alternatively, you can query the IP address prefixes using [Service Tag Discovery API](../virtual-network/service-tags-overview.md#service-tags-on-premises).

## Outbound traffic

Endpoints of Azure SignalR Service resources are guaranteed to be within IP ranges of Service Tag `AzureSignalR`.

### Access Azure SignalR Service from virtual network

You can allow outbound traffic from your network to Azure SignalR Service by adding a new outbound network security rule.

1. On portal, go to the network security group.
1. Select on the settings menu called **Outbound security rules**.
1. Select the **Add** button.
1. Select **Destination** and choose **Service Tag**.
1. Select **Destination service tag** and choose **AzureSignalR**.
1. Enter **443** in **Destination port ranges**.

    ![Create an outbound security rule](media/howto-service-tags/portal-add-outbound-security-rule.png)

1. Adjust other fields as needed.
1. Select **Add**.

## Inbound traffic

In following scenarios, Azure SignalR Service can generate network traffic to your resource. The source of traffic is guaranteed to be within IP ranges of Service Tag `AzureSignalR`.

* Use [upstream endpoints](concept-upstream.md) in [serverless mode](signalr-concept-azure-functions.md).
* Use [Key Vault secret reference](concept-upstream.md#key-vault-secret-reference-in-url-template-settings) in URL template settings.
* Use [custom certificate](howto-custom-domain.md#add-a-custom-certificate).

### Upstream endpoints in virtual network

You can configure **Network Security Group** to allow inbound traffic to virtual network:

1. On portal, go to the network security group.
1. Select  **Inbound security rules**.
1. Select the **Add** button.
1. Select **Source** and choose **Service Tag** from the list.
1. Select **Source service tag** and choose **AzureSignalR** from the list.
1. Enter \* in **Source port ranges**.

   :::image type="content" alt-text="Create an inbound security rule" source="media/howto-service-tags/portal-add-inbound-security-rule.png" :::

1. Change other settings as needed.
1. Select **Add**.

> [!Note]
> Azure SignalR Service is a shared service. By allowing Service Tag `AzureSignalR` or its associated IP address prefixes, you also allow traffic from other resources, even if they belong to other customers. Make sure you implement appropriate authentication on your endpoints.

### Upstream endpoints of Azure Function

You can configure a [service tag-based rule](../app-service/app-service-ip-restrictions.md#set-a-service-tag-based-rule).

Alternatively, you can use [Shared Private Endpoints](howto-shared-private-endpoints.md) for better security. Shared Private Endpoints are dedicated to your resources. No traffic from other resources can access your endpoints.

### Key vault access

We recommend [Shared Private Endpoints](howto-shared-private-endpoints-key-vault.md) for best security.

## Next steps

- [Network security groups: service tags](../virtual-network/network-security-groups-overview.md#security-rules)