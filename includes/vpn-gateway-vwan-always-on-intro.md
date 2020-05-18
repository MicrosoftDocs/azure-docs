---
 title: include file
 description: include file
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 03/12/2020
 ms.author: cherylmc
 ms.custom: include file

 # this file is used for both virtual wan and vpn gateway. When modifying, make sure that your changes work for both environments.
---

A new feature of the Windows 10 VPN client, Always On, is the ability to maintain a VPN connection. With Always On, the active VPN profile can connect automatically and remain connected based on triggers, such as user sign-in, network state change, or device screen active.

You can use gateways with Windows 10 Always On to establish persistent user tunnels and device tunnels to Azure. This article helps you configure an Always On VPN user tunnel.

Always On VPN connections include either of two types of tunnels:

* **Device tunnel**: Connects to specified VPN servers before users sign in to the device. Pre-sign-in connectivity scenarios and device management use a device tunnel.

* **User tunnel**: Connects only after users sign in to the device. By using user tunnels, you can access organization resources through VPN servers.

Device tunnels and user tunnels operate independent of their VPN profiles. They can be connected at the same time, and they can use different authentication methods and other VPN configuration settings, as appropriate.
