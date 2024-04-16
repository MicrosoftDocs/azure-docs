---
author: abell
ms.service: ddos-protection
ms.topic: include
ms.date: 11/28/2023
ms.author: abell
---
>[!NOTE]
> You cannot move a virtual network to another resource group or subscription when DDoS Protection is enabled for the virtual network. If you need to move a virtual network with DDoS Protection enabled, disable DDoS Protection first, move the virtual network, and then enable DDoS Protection. After the move, the auto-tuned policy thresholds for all the protected public IP addresses in the virtual network are reset.