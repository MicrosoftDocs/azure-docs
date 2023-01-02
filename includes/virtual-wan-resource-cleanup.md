---
author: cherylmc
ms.author: cherylmc
ms.date: 03/18/2022
ms.service: virtual-wan
ms.topic: include
---

1. Open the virtual WAN that you created.

1. Select a virtual hub associated to the virtual WAN to open the hub page.

1. Delete all gateway entities following the below order for each gateway type. This can take 30 minutes to complete.

   **VPN:**  
   * Disconnect VPN sites  
   * Delete VPN connections  
   * Delete VPN gateways  

   **ExpressRoute:**  
   * Delete ExpressRoute connections  
   * Delete ExpressRoute gateways

1. Repeat for all hubs associated to the virtual WAN.

1. You can either delete the hubs at this point, or delete the hubs later when you delete the resource group.

1. Navigate to the resource group in the Azure portal.

1. Select **Delete resource group**. This deletes the other resources in the resource group, including the hubs and the virtual WAN.