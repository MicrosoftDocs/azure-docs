---
title: Configure Azure Private 5G Core network for accessing UE IP addresses
titleSuffix: Azure Private 5G Core
description: Learn how to configure your Azure Private 5G Core to access UE IP addresses.
author: robswain
ms.author: robswain
ms.service: private-5g-core
ms.topic: how-to 
ms.date: 10/02/2023
---

# Configure Azure Private 5G Core network for accessing UE IP addresses

Azure Private 5G Core (AP5GC) provides a secure and reliable network for your organization's communication needs. To access user equipment (UE) IP addresses from the data network (DN), you will need to configure appropriate firewall rules, routes, and other settings. This article will guide you through the steps and considerations required.

## Prerequisites

Before you begin, make sure you have the following:

- Access to your Azure Private 5G Core via the Azure Portal.
- Knowledge of your organization's network topology.
- An AP5GC with network address port translation (NAPT) disabled.  
    > [!IMPORTANT]
    > Using a deployment where NAPT is enabled will only work if the UE initiates the contact to the server and the server is capable of differentiating UE clients using a combination of IP address and port.  
    > If the server tries to make the initial contact or tries to contact a UE after the pinhole has timed out, the connection will fail.
- Access to any necessary network devices for configuration (e.g. routers, firewalls, switches, proxies).
- Ability to capture packet traces at different points in your network.

## Configure UE IP addresses access

1. Determine the IP addresses of the devices that you wish to access from the data network. These IP addresses will belong the the IP pool defined during site creation.  
You can see the IP addresses for devices by either
    - checking [distributed tracing](distributed-tracing.md),
    - checking [packet captures of the device attaching and creating a session](data-plane-packet-capture.md),
    - or using integrated tools for the UE (e.g. command line or UI).
1. Confirm that the client device you are using can reach the UE via the AP5GC N6 (in a 5G deployment) or SGi (in a 4G deployment) network.
    - If the client is on the same subnet as the AP5GC N6/SGi interface, the client device should have a route to the UE subnet and the next hop should be to the N6/SGi IP address belonging to the data network name (DNN) assigned to the UE.
    - Otherwise, if there is a router or firewall between the client and AP5GC, the route to the UE subnet should have the router or firewall as the next hop.
1. Ensure the client device traffic destined to the UE reaches the AP5GC N6 network interface.
    1. Check each firewall in between the N6 address and the client device IP address.
    1. Ensure that the type of traffic expected between client device and UE is allowed to pass through the firewall.
    1. Repeat for TCP/UDP ports, IP addresses and protocols required.
    1. Ensure the firewall has routes to forward the traffic destined to the UE IP address to the N6 interface IP address.
1. Configure appropriate routes in your routers to ensure that traffic from the data network is directed to the correct destination IP addresses in the RAN network.
1. Test the configuration to ensure that you can successfully access the UE IP addresses from the Data network.

## Example

- **UE:** A smart camera that can be accessed using HTTPS. The UE is using AP5GC to send information to an operator's managed server.
- **Network Topology:** The N6 network has a firewall separating it from the secure corporate network and from the internet.
- **Requirement:** From the operator's IT infrastructure be able to log in into the smart camera using HTTPS.

### Solution

1. Deploy AP5GC with NAPT disabled.
1. Add rules to the enterprise firewall to allow HTTPS traffic from the corporate network to the smart camera IP address.
1. Add routing configuration to the firewall. Forward traffic destined to the smart camera's IP address to the N6 IP address of the DN name assigned to the UE in the AP5GC deployment.
1. Verify the intended traffic flows for the N3 and N6 interfaces.
    1. Take packet captures on the N3 and N6 interface simultaneously.
    1. Check traffic on the N3 interface.
        1. Check the packet capture for expected traffic reaching the N3 interface from the UE.
        1. Check the packet capture for expected traffic leaving the N3 interface towards the UE.
    1. Check traffic on the N6 interface.
        1. Check the packet capture for expected traffic reaching the N6 interface from the UE.
        1. Check the packet capture for expected traffic leaving the N6 interface towards the UE.
1. Take packet captures to check that the firewall is both receiving and sending traffic destined to the smart camera and to the client device.

:::image type="content" source="media/private-mobile-network-design-requirements/access-ue-example.png" alt-text="Diagram showing a bi-directional user plan." lightbox="media/private-mobile-network-design-requirements/access-ue-example.png":::

## Result

Your Azure Private 5G Core network can access UE IP addresses from the Data network.
