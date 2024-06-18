---
 title: include file
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 08/11/2023
 ms.author: cherylmc

 # this file is used for both virtual wan and vpn gateway. When modifying, make sure that your changes work for both environments.
---

The Always On feature was introduced in the Windows 10 VPN client. Always On is the ability to maintain a VPN connection. With Always On, the active VPN profile can connect automatically and remain connected based on triggers, such as user sign-in, network state change, or device screen active.

You can use gateways with Always On to establish persistent user tunnels and device tunnels to Azure.

Always On VPN connections include either of two types of tunnels:

* **Device tunnel**: Connects to specified VPN servers before users sign in to the device. Pre-sign-in connectivity scenarios and device management use a device tunnel.

* **User tunnel**: Connects only after users sign in to the device. By using user tunnels, you can access organization resources through VPN servers.

Device tunnels and user tunnels operate independent of their VPN profiles. They can be connected at the same time, and they can use different authentication methods and other VPN configuration settings, as appropriate.
