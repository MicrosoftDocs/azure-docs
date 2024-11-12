---
author: ggailey777
ms.service: azure-functions
ms.custom:
  - build-2024
ms.topic: include
ms.date: 11/11/2024
ms.author: glenga
---

| Feature |[Flex Consumption plan](../articles/azure-functions/flex-consumption-plan.md)|[Consumption plan](../articles/azure-functions/consumption-plan.md)|[Premium plan](../articles/azure-functions/functions-premium-plan.md)|[Dedicated plan](../articles/azure-functions/dedicated-plan.md)/[ASE](../articles/app-service/environment/intro.md)|[Container Apps](../articles/azure-functions/functions-container-apps-hosting.md)<sup>1</sup> |  
|----------------|-----------|----------------|---------|---------------| ---| 
|[Inbound IP restrictions](../articles/azure-functions/functions-networking-options.md#inbound-networking-features)|✔|✔|✔|✔|✔| 
|[Inbound Private Endpoints](../articles/azure-functions/functions-networking-options.md#inbound-networking-features)|✔| |✔|✔| |  
|[Virtual network integration](../articles/azure-functions/functions-networking-options.md#virtual-network-integration)|✔| |✔<sup>2</sup>|✔<sup>3</sup>|✔| 
|[Outbound IP restrictions](../articles/azure-functions/functions-networking-options.md#outbound-ip-restrictions)|✔| |✔|✔|✔| 

1. For more information, see [Networking in Azure Container Apps environment](../articles/container-apps/networking.md). 
2. There are special considerations when working with [virtual network triggers](../articles/azure-functions/functions-networking-options.md#virtual-network-triggers-non-http).
3. Only the Dedicated/ASE plan supports gateway-required virtual network integration.