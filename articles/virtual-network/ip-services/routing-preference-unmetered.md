---
title: What is routing preference unmetered?
titleSuffix: Azure Virtual Network
description: Learn about how you can configure routing preference for your resources egressing data to CDN provider.
ms.date: 08/24/2023
ms.author: mbender
author: mbender-ms
ms.service: virtual-network
ms.subservice: ip-services
# Customer intent: As an Azure customer, I want to learn more about enabling routing preference for my CDN origin resources.
ms.topic: conceptual
---

# What is routing preference unmetered?

Routing preference unmetered is available for Content Delivery Network (CDN) providers with customers hosted their origin contents in Azure. The service allows CDN providers to establish direct peering connection with Microsoft global network edge routers at various locations.

:::image type="content" source="./media/routing-preference-unmetered/unmetered.png" alt-text="Diagram of routing preference unmetered.":::

Your network traffic egressing from origin in Azure destined to CDN provider benefits from the direct connectivity.

* Data transfer bill for traffic egressing from your Azure resources that are routed through these direct links is free.

* Direct connect between CDN provider and origin in Azure provides optimal performance as there are no hops in between. This direct connect benefits the CDN workload that frequently fetches data from the origin.

## Configuring Routing Preference Unmetered

To take advantage of routing preference unmetered, your CDN provider needs to be part of this program. Check with your CDN provider on which CDN services are supported by routing preference unmetered. If your CDN provider isn't part of the program, contact your CDN provider. For a list of Azure services that are supported by routing preference unmetered see [https://learn.microsoft.com/en-US/azure/virtual-network/ip-services/routing-preference-overview#supported-services].

Next, configure routing preference for your resources, and set the Routing Preference type to **Internet**. You can configure routing preference while creating a public IP address, and then associate the public IP to resources such as virtual machines, internet facing load balancers, and more. [Learn how to configure routing preference for a public IP address using the Azure portal](./routing-preference-portal.md)

You can also enable routing preference for your storage account and publish a second endpoint that needs to be used by CDN provider to fetch data from the storage origin. For example, publishing an internet route-specific endpoint for the storage account *StorageAccountA* publishes the second end point for your storage services as shown as follows:

:::image type="content" source="./media/routing-preference-unmetered/storage-endpoints.png" alt-text="Diagram of routing preference for storage accounts.":::

## Next steps

* [Configure routing preference for a VM using the Azure PowerShell](./configure-routing-preference-virtual-machine-powershell.md)

* [Configure routing preference for a VM using the Azure CLI](./configure-routing-preference-virtual-machine-cli.md)

* [Configure routing preference for your storage account](../../storage/common/network-routing-preference.md)
