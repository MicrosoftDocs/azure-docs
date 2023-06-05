---
author: abell
ms.service: ddos-protection
ms.topic: include
ms.date: 04/12/2022
ms.author: abell
---
>[!NOTE]
> You cannot move a virtual network to another resource group or subscription when DDoS Standard is enabled for the virtual network. If you need to move a virtual network with DDoS Standard enabled, disable DDoS Standard first, move the virtual network, and then enable DDoS standard. After the move, the auto-tuned policy thresholds for all the protected public IP addresses in the virtual network are reset.