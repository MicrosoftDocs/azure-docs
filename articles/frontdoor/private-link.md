---
title: 'Secure your Origin with Private Link in Azure Front Door Premium'
description: This page provides information about how to secure connectivity to your origin using Private Link.
services: frontdoor
documentationcenter: ''
author: duongau
ms.service: frontdoor
ms.topic: conceptual
ms.date: 03/30/2022
ms.author: duau
ms.custom: references_regions
---

# Secure your Origin with Private Link in Azure Front Door Premium

[Azure Private Link](../private-link/private-link-overview.md) enables you to access Azure PaaS services and services hosted in Azure over a private endpoint in your virtual network. Traffic between your virtual network and the service goes over the Microsoft backbone network, eliminating exposure to the public Internet.

Azure Front Door Premium can connect to your origin using Private Link. Your origin can be hosted in a virtual network or hosted as a PaaS service such as Azure App Service or Azure Storage. Private Link removes the need for your origin to be access publicly.

:::image type="content" source="./media/concept-private-link/front-door-private-endpoint-architecture.png" alt-text="Diagram of Azure Front Door with Private Link enabled.":::

## How Private Link works

When you enable Private Link to your origin in Azure Front Door Premium, Front Door creates a private endpoint on your behalf from an Azure Front Door managed regional private network. You'll receive an Azure Front Door private endpoint request at the origin pending your approval.

You must approve the private endpoint connection before traffic can pass to the origin privately. You can approve private endpoint connections by using the Azure portal, Azure CLI, or Azure PowerShell. For more information, see [Manage a Private Endpoint connection](../private-link/manage-private-endpoint.md).

> [!IMPORTANT]
> You must approve the private endpoint connection before traffic will flow to your origin.

After you enable an origin for Private Link and approve the private endpoint connection, it can take a few minutes for the connection to get established. During this time, requests to the origin will receive an Azure Front Door error message. The error message will go away once the connection is established.

Once your request is approved, a private IP address gets assigned from the Azure Front Door managed virtual network. Traffic between your Azure Front Door and your origin will communicate using the established private link over the Microsoft backbone network. Incoming traffic to your origin is now secured when arriving at your Azure Front Door.

:::image type="content" source="./media/concept-private-link/enable-private-endpoint.png" alt-text="Screenshot of enable Private Link service checkbox from origin configuration page.":::

## Region availability

Azure Front Door private link is available in the following regions:

| Americas | Europe | Asia Pacific |
|--|--|--|
| Brazil South | France Central | Australia East |
| Canada Central | Germany West Central | Central India |
| Central US | Norway East | East Asia |
| East US | Sweden Central | Japan East |
| East US 2 | UK South | Korea Central |
| South Central US | West Europe |  |
| West US 2 |  |  |
| West US 3 |  |  |

## Limitations

Origin support for direct private end point connectivity is limited to Storage (Azure Blobs), App Services and internal load balancers.

For the best latency, you should always pick an Azure region closest to your origin when choosing to enable Azure Front Door private link endpoint.

## Next steps

* Learn how to [connect Azure Front Door Premium to a App Service origin with Private Link](standard-premium/how-to-enable-private-link-web-app.md).
* Learn how to [connect Azure Front Door Premium to a storage account origin with Private Link](standard-premium/how-to-enable-private-link-storage-account.md).
* Learn how to [connect Azure Front Door Premium to an internal load balancer origin with Private Link](standard-premium/how-to-enable-private-link-internal-load-balancer.md).
