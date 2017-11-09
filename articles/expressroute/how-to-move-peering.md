---
title: 'Move a public peering on Azure ExpressRoute to Microsoft peering | Microsoft Docs'
description: This article shows you the steps to move your public peering to Microsoft peering on ExpressRoute.
services: expressroute
documentationcenter: na
author: cherylmc
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: expressroute
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 11/09/2017
ms.author: cherylmc

---
# Move a public peering to Microsoft peering

ExpressRoute supports using Microsoft peering with route filters for Azure PaaS services, such as Azure storage and Azure SQL Database. You now need only one routing domain to access Microsoft PaaS and SaaS services. You can use route filters to selectively advertise the PaaS service prefixes for Azure regions you want to consume.

This article helps you move a public peering configuration to Microsoft peering with no downtime. For more information about routing domains and peerings, see [ExpressRoute circuits and routing domains](expressroute-circuit-peerings.md).

> [!IMPORTANT]
> You must have the ExpressRoute premium add-on in order to use Microsoft peering. For more information about the premium add-on, see the [ExpressRoute FAQ](expressroute-faqs.md#expressroute-premium).

## <a name="before"></a>Before you begin

* To connect to Microsoft peering, you need to set up and manage NAT. Your connectivity provider may set up and manage the NAT as a managed service. If you are planning to access the Azure PaaS and Azure SaaS services on Microsoft peering, it's important to size the NAT IP pool correctly. For more information about NAT for ExpressRoute, see the [NAT requirements for Microsoft peering](expressroute-nat.md#nat-requirements-for-microsoft-peering).

* If you currently have a network access control list (ACL) for the Azure PaaS service endpoints when using Azure public peering, you need to make sure that the NAT IP pool that is configured with Microsoft peering is included in the ACL configured for the service endpoint.

* In order to move to Microsoft peering with no downtime, use the steps in this article in the order that they are presented.

## <a name="create"></a>1. Create Microsoft peering

If Microsoft peering has not been created, use any of the following articles to create Microsoft peering. If your connectivity provider offers managed layer 3 services, you can ask the connectivity provider to enable Microsoft peering for your circuit.

  * [Create Microsoft peering using Azure portal](expressroute-howto-routing-portal-resource-manager.md#msft)
  * [Create Microsoft peering using Azure Powershell](expressroute-howto-routing-arm.md#msft)
  * [Create Microsoft peering using Azure CLI](howto-routing-cli.md#msft)

## <a name="validate"></a>2. Validate Microsoft peering is enabled

Verify that the Microsoft peering is enabled and the advertised public prefixes are in the configured state.

  * [Azure portal](expressroute-howto-routing-portal-resource-manager.md#getmsft)
  * [Azure PowerShell](expressroute-howto-routing-arm.md#getmsft)
  * [Azure CLI](howto-routing-cli.md#getmsft)

## <a name="routefilter"></a>3. Configure and attach a route filter to the circuit

By default, new Microsoft peerings do not advertise any prefixes until a route filter is attached to the circuit. When you create a route filter rule, you can specify the list of service communities for Azure regions that you want to consume for Azure PaaS services, as shown in the following screenshot:

![Merge public peering](.\media\how-to-move-peering\public.png)

Configure route filters using any of the following articles:

  * [Configure route filters for Microsoft peering using Azure portal](how-to-routefilter-portal.md)
  * [Configure route filters for Microsoft peering using Azure PowerShell](how-to-routefilter-powershell.md)
  * [Configure route filters for Microsoft peering using Azure CLI](how-to-routefilter-cli.md)

## <a name="delete"></a>4. Delete the public peering

After verifying that the Microsoft peering is configured and the prefixes you wish to consume are correctly advertised on Microsoft peering, you can then delete the public peering. To delete the public peering, use any of the following articles:

  * [Delete Azure public peering using Azure portal](expressroute-howto-routing-portal-resource-manager.md#deletepublic)
  * [Delete Azure public peering using Azure PowerShell](expressroute-howto-routing-arm.md#deletepublic)
  * [Delete Azure public peering using CLI](howto-routing-cli.md#deletepublic)

## Next Steps

For more information about ExpressRoute, see the [ExpressRoute FAQ](expressroute-faqs.md).