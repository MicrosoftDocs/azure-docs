---
 title: include file
 author: cherylmc
 ms.service: azure-vpn-gateway
 ms.topic: include
 ms.date: 08/11/2023
 ms.author: cherylmc

 # this file is used for both virtual wan and vpn gateway. When modifying, make sure that your changes work for both environments.
---

The Always On feature was introduced in the Windows 10 VPN client (this feature is also supported for [macOS](../articles/vpn-gateway/vpn-gateway-howto-always-on-device-tunnel-macos.md)). Always On is the ability to maintain a VPN connection. With Always On, the active VPN profile can connect automatically and remain connected based on triggers, such as:
- **Network transitions** - Switching between Wi-Fi networks or moving from Wi-Fi to a cellular hotspot can cause the VPN tunnel to drop silently.
- **Sleep/wake cycles** - When macOS enters sleep mode, the VPN session may time out and not automatically re-establish when the device wakes.
- **Temporary network interruptions** - Brief network outages, such as signal loss or router restarts, terminate the VPN connection and require manual reconnection.
- **Idle session timeouts** - If no traffic passes through the tunnel for a period, the VPN gateway may tear down the idle session.
- **Device restarts and user sign-out** - After a restart or sign-out, the VPN connection isn't restored unless the user manually reconnects.

These gaps leave the device unprotected and without access to corporate resources. Enabling Always On ensures the VPN client automatically reconnects after any disruption, maintaining a persistent and secure tunnel without user intervention.

You can use gateways with Always On to establish persistent user tunnels and device tunnels to Azure.

Always On VPN connections include either of two types of tunnels:

* **Device tunnel**: Connects to specified VPN servers before users sign in to the device. Pre-sign-in connectivity scenarios and device management use a device tunnel.

* **User tunnel**: Connects only after users sign in to the device. By using user tunnels, you can access organization resources through VPN servers.

Device tunnels and user tunnels operate independent of their VPN profiles. They can be connected at the same time, and they can use different authentication methods and other VPN configuration settings, as appropriate.