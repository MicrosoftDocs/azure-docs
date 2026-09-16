---
author: ggailey777
ms.service: azure-functions
ms.custom:
  - build-2024
ms.topic: include
ms.date: 04/02/2026
ms.author: glenga
---

| Feature |[Flex Consumption plan](../articles/azure-functions/flex-consumption-plan.md)|[Consumption plan](../articles/azure-functions/consumption-plan.md)|[Premium plan](../articles/azure-functions/functions-premium-plan.md)|[Dedicated plan](../articles/azure-functions/dedicated-plan.md)/[ASE](../articles/app-service/environment/overview.md)|[Container Apps](../articles/container-apps/functions-overview.md)<sup>1</sup> |  
|----------------|-----------|----------------|---------|---------------| ---| 
|[Inbound access restrictions](../articles/azure-functions/functions-networking-options.md#inbound-access-restrictions)|✅|✅|✅|✅|✅<sup>2</sup>| 
|[Private endpoints (inbound)](../articles/azure-functions/functions-networking-options.md#private-endpoints)|✅|❌|✅|✅|❌|  
|[Service endpoints (inbound)](../articles/azure-functions/functions-networking-options.md#service-endpoints)|✅|❌|✅|✅|✅|
|[Virtual network integration (outbound)](../articles/azure-functions/functions-networking-options.md#virtual-network-integration)|✅|❌|✅|✅<sup>3</sup>|✅| 
|[Hybrid Connections](../articles/azure-functions/functions-networking-options.md#hybrid-connections)|❌|❌|✅ (Windows only)|✅ (Windows only)|✅ (Windows only)|

1. For more information, see [Networking in Azure Container Apps environment](../articles/container-apps/networking.md). 
2. Managed through the Container Apps environment [ingress configuration](../articles/container-apps/ip-restrictions.md).
3. The Dedicated/ASE plan also supports [gateway-required virtual network integration](../articles/app-service/configure-gateway-required-vnet-integration.md).
