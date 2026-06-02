---
author: flapinski
ms.author: flapinski
ms.date: 05/26/2026
ms.service: azure-vpn-gateway
ms.topic: include
---

The process for updating your gateway and Linux client are as follows:

1. Update your P2S gateway configuration to support the tunnel type required by your chosen alternative (IKEv2 for strongSwan, OpenVPN for the OpenVPN client). 
2. Generate new VPN client profile configuration files from the gateway.
3. Install and configure the replacement VPN client on each Linux device.
4. Test connectivity and roll out to your user base.
5. Uninstall the Azure VPN Client for Linux.