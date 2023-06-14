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

You can use [Service Tags](../virtual-network/service-tags-overview.md) with Azure SignalR Service when configuring [Network Security Group](../virtual-network/network-security-groups-overview.md#network-security-groups). Service tags allow you to define inbound/outbound network security rules for Azure resources that connect to the SignalR Service endpoints without the need to hardcode IP addresses.  

The SignalR Service manages service tags, which means that you can't create your own service tag or modify an existing one. Microsoft manages address prefixes that match the service tag and automatically updates the service tag as addresses change.

This article shows you how to create a network security group with inbound/outbound service tags for Azure SignalR Service.  Once you've created the network security group, you can apply it to the resource, such as Azure Functions, connecting to SignalR Service.

> [!Note]
> Starting 15 August 2021, Azure SignalR Service supports bidirectional service tags for both inbound and outbound traffic.

## Create a network security group 

Create a network security group using the Azure portal:

1. Search for **Network security groups** in the Azure portal.
1. Select **Network security groups**.
1. Select **Create**
1. Enter the settings for the network security group:
    | Field| Value|
    | Subscription | Your subscription |
    | Resource group | Choose an existing or create a new resource group |
    | Name | Your network security group name |
    | Region | Your region |
1. Select **Review + create**.
1. Select **Create**.


### Configure outbound traffic

You can allow outbound traffic to Azure SignalR Service by adding a new outbound network security rule.

1. Select **Go to resource** or go to the network security group.
1. Select on the settings menu called **Outbound security rules**.
1. Select the **Add** button.
1. Select **Destination** and choose **Service Tag**.
1. Select **Destination service tag** and choose **AzureSignalR**.
1. Enter **443** in **Destination port ranges**.

    ![Create an outbound security rule](media/howto-service-tags/portal-add-outbound-security-rule.png)

1. Adjust other fields as needed.
1. Select **Add**.

### Configure inbound traffic

If you're using upstream endpoints, you can also enable inbound traffic from Azure SignalR Service by adding a new inbound network security rule:

1. Go to the network security group.
1. Select  **Inbound security rules**.
1. Select the **Add** button.
1. Select **Source** and choose **Service Tag** from the list.
1. Select **Source service tag** and choose **AzureSignalR** from the list.
1. Enter \* in **Source port ranges**.

   :::image type="content" alt-text="Create an inbound security rule" source="media/howto-service-tags/portal-add-inbound-security-rule.png" :::

1. Change other settings as needed.
1. Select **Add**.

## Next steps

- [Network security groups: service tags](../virtual-network/network-security-groups-overview.md#security-rules)