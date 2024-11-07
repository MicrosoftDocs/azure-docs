---
author: ggailey777
ms.service: azure-functions
ms.custom:
  - build-2024
ms.topic: include
ms.date: 11/07/2024
ms.author: glenga
---

| Feature |[Flex Consumption plan](../articles/azure-functions/flex-consumption-plan.md)|[Premium plan](../articles/azure-functions/functions-premium-plan.md)|[Dedicated plan](../articles/azure-functions/dedicated-plan.md)/[ASE](../articles/app-service/environment/intro.md)|[Container Apps](../articles/azure-functions/functions-container-apps-hosting.md)<sup>*</sup> | [Consumption plan](../articles/azure-functions/consumption-plan.md)|
|----------------|-----------|----------------|---------|---------------| ---| --- |
|[Inbound IP restrictions](../articles/azure-functions/functions-networking-options.md#inbound-networking-features)|✅Yes|✅Yes|✅Yes|✅Yes | ✅Yes | 
|[Inbound Private Endpoints](../articles/azure-functions/functions-networking-options.md#inbound-networking-features)|✅Yes|✅Yes|✅Yes| ❌No |❌No|   
|[Virtual network integration](../articles/azure-functions/functions-networking-options.md#virtual-network-integration)|✅Yes (Regional) |✅Yes (Regional)|✅Yes (Regional and Gateway)| ✅Yes| ❌No|
|[Virtual network triggers (non-HTTP)](../articles/azure-functions/functions-networking-options.md#virtual-network-triggers-non-http)|✅Yes | ✅Yes |✅Yes| ✅Yes| ❌No|
|[Hybrid connections](../articles/azure-functions/functions-networking-options.md#hybrid-connections) (Windows only)|❌ No |✅Yes|✅Yes| ❌No|❌No|
|[Outbound IP restrictions](../articles/azure-functions/functions-networking-options.md#outbound-ip-restrictions)| ✅Yes | ✅Yes|✅Yes| ✅Yes| ❌No|

<sup>*</sup>For more information, see [Networking in Azure Container Apps environment](../articles/container-apps/networking.md). 