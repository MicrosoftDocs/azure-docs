---
author: ggailey777
ms.service: azure-functions
ms.custom:
  - build-2024
ms.topic: include
ms.date: 07/16/2024
ms.author: glenga
---

| Feature |[Consumption plan](../articles/azure-functions/consumption-plan.md)|[Flex Consumption plan](../articles/azure-functions/flex-consumption-plan.md)|[Premium plan](../articles/azure-functions/functions-premium-plan.md)|[Dedicated plan](../articles/azure-functions/dedicated-plan.md)/[ASE](../articles/app-service/environment/intro.md)|[Container Apps](../articles/azure-functions/functions-container-apps-hosting.md)<sup>*</sup> |  
|----------------|-----------|----------------|---------|---------------| ---| --- |
|[Inbound IP restrictions](../articles/azure-functions/functions-networking-options.md#inbound-networking-features)|✅Yes|✅Yes|✅Yes|✅Yes | ✅Yes | 
|[Inbound Private Endpoints](../articles/azure-functions/functions-networking-options.md#inbound-networking-features)|❌No|✅Yes|✅Yes|✅Yes| ❌No |   
|[Virtual network integration](../articles/azure-functions/functions-networking-options.md#virtual-network-integration)|❌No|✅Yes (Regional) |✅Yes (Regional)|✅Yes (Regional and Gateway)| ✅Yes| 
|[Virtual network triggers (non-HTTP)](../articles/azure-functions/functions-networking-options.md#virtual-network-triggers-non-http)|❌No|✅Yes | ✅Yes |✅Yes| ✅Yes| 
|[Hybrid connections](../articles/azure-functions/functions-networking-options.md#hybrid-connections) (Windows only)|❌No|❌ No |✅Yes|✅Yes| ❌No|
|[Outbound IP restrictions](../articles/azure-functions/functions-networking-options.md#outbound-ip-restrictions)|❌No| ✅Yes | ✅Yes|✅Yes| ✅Yes| 

<sup>*</sup>For more information, see [Networking in Azure Container Apps environment](../articles/container-apps/networking.md). 