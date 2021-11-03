---
author: cherylmc
ms.author: cherylmc
ms.date: 10/15/2021
ms.service: virtual-wan
ms.topic: include
---

1. Open the virtual WAN that you created.

1. Select a virtual hub associated to the virtual WAN to open the hub page.

1. Delete all gateway entities following the below order for the gateway type. This can take 30 minutes to complete.

    **VPN:**  
   1. Disconnect VPN Sites  
   1. Delete VPN connections  
   1. Delete VPN Gateways  

    **ExpressRoute:**  
   1. Delete ExpressRoute Connections  
   1. Delete ExpressRoute Gateways  

1. You can either delete the hub at this point, or delete it later when you delete the resource group.

1. Repeat for all hubs associated to the virtual WAN.

1. Navigate to the resource group in the Azure portal.

1. Select **Delete resource group**. This deletes everything in the resource group, including the hubs and the virtual WAN.