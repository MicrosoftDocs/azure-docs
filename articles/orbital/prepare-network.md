---
title: Prepare network to send and receive data - Azure Orbital
description: Learn how to deliver and receive data from  Azure Orbital.
author: hrshelar
ms.service: orbital
ms.topic: how-to
ms.custom: ga
ms.date: 07/12/2022
ms.author: hrshelar
---

# Prepare the network for Azure Orbital Ground Station integration

The Azure Orbital Ground Station platform interfaces with your resources using VNET injection, which is used in both uplink and downlink directions. This page describes how to ensure your Subnet and Orbital ground station objects are configured correctly.

Ensure the objects comply with the recommendations in this article. Note, these steps don't have to be followed in order.

## Prepare subnet for VNET injection

Prerequisites:
- An entire subnet with no existing IPs allocated or in use that can be dedicated to Orbital GSaaS in your virtual network in your resource group.

Steps:
1. Delegate a subnet to service named: Microsoft.Orbital/orbitalGateways. Follow instructions here: [Add or remove a subnet delegation in an Azure virtual network](../virtual-network/manage-subnet-delegation.md).

> [!NOTE]
>  Address range needs to be at least /24 (example 10.0.0.0/23)

Here is an example of a typical VNET setup with a subnet delegated to Azure Orbital Ground Station.

:::image type="content" source="media/azure-ground-station-subnet-example.png" alt-text="Screenshot of subnet configuration with Orbital delegated subnet." lightbox="media/azure-ground-station-subnet-example.png":::

## Prepare endpoints

Set the MTU of all desired endpoints to at least 3650.

## Setting up the contact profile

Prerequisites:
- The subnet/vnet is in the same region as the contact profile

Make sure the contact profile properties are set as follows:

1. subnetId (under networkConfiguration): The full ID to the delegated subnet, which can be found inside the VNET's JSON view
1. For each link
    1. ipAddress: Enter an IP here for TCP/UDP server mode. Leave blank for TCP/UDP client mode. See section below for a detailed explanation on configuring this property.
    1. port: Needs to be within 49152 and 65535 range and need to be unique across all links in the contact profile.

> [!NOTE]
> You can have multiple links/channels in a contact profile, and you can have multiple IPs. But the combination of port/protocol needs to be unique. You can't have two identical ports, even if you have two different destination IPs. 

## Scheduling the contact

The platform pre-reserves IPs in the subnet when the contact is scheduled. These IPs represent the platform side endpoints for each link. IPs will be unique between contacts, and if multiple concurrent contacts are using the same subnet, we guarantee those IPs to be distinct. The service will fail to schedule the contact and an error will be returned if the service runs out of IPs or can't allocate an IP.

When you create a contact, you can find these IPs by viewing the contact properties. Select JSON view in the portal or use the GET contact API call to view the contact properties. Make sure to use the current API version of 2022-03-01. The parameters of interest are below:

| Parameter                          | Usage                                                                      |
|------------------------------------|----------------------------------------------------------------------------|
| antennaConfiguration.destinationIP | Connect to this IP when you configure the link as tcp/udp client.          |
| antennaConfiguration.sourceIps     | Data will come from this IP when you configure the link as tcp/udp server. |

You can use this information to set up network policies or to distinguish between simultaneous contacts to the same endpoint.

:::image type="content" source="media/azure-ground-station-contact-ips-example.png" alt-text="Screenshot of contact object with source and destination IPs." lightbox="media/azure-ground-station-contact-ips-example.png":::

> [!NOTE]
> - The source and destination IPs are always taken from the subnet address range.
> - Only one destination IP is present. Any link in client mode should connect to this IP and the links are differentiated based on port.
> - Many source IPs can be present. Links in server mode will connect to your specified IP address in the contact profile. The flows will originate from the source IPs present in this field and target the port as per the link details in the contact profile. There is no fixed assignment of link to source IP so please make sure to allow all IPs in any networking setup or firewalls. 


## Client/Server, TCP/UDP, and link direction

Here's how to set up the link flows based on direction on tcp or udp preference. 

### Uplink

| Setting                        | TCP Client                 | TCP Server                           | UDP Client                 | UDP Server                           |
|--------------------------------|----------------------------|--------------------------------------|----------------------------|--------------------------------------|
| Contact Profile Link ipAddress | Blank                      | Routable IP from delegated subnet    | Blank                      | Not applicable                       |
| Contact Profile Link port      | Unique port in 49152-65535 | Unique port in 49152-65535           | Unique port in 49152-65535 | Not applicable                       |
| **Output**                     |                            |                                      |                            |                                      |
| Contact Object destinationIP   | Connect to this IP         | Not applicable                       | Connect to this IP         | Not applicable                       |
| Contact Object sourceIP        | Not applicable             | Link will come from one of these IPs | Not applicable             | Not applicable                       |



### Downlink

| Setting                        | TCP Client                 | TCP Server                           | UDP Client                 | UDP Server                           |
|--------------------------------|----------------------------|--------------------------------------|----------------------------|--------------------------------------|
| Contact Profile Link ipAddress | Blank                      | Routable IP from delegated subnet    | Not applicable             | Routable IP from delegated subnet    |
| Contact Profile Link port      | Unique port in 49152-65535 | Unique port in 49152-65535           | Not applicable             | Unique port in 49152-65535           |
| **Output**                     |                            |                                      |                            |                                      |
| Contact Object destinationIP   | Connect to this IP         | Not applicable                       | Not applicable             | Not applicable                       |
| Contact Object sourceIP        | Not applicable             | Link will come from one of these IPs | Not applicable             | Link will come from one of these IPs |

## Next steps

- [Register Spacecraft](register-spacecraft.md)
- [Configure the modem chain](modem-chain.md)
- [Schedule a contact](schedule-contact.md)
