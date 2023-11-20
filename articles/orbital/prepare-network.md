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

Azure Orbital Ground Station interfaces with your Azure resources using virtual network (VNET) injection, which is used in both uplink and downlink directions. This page describes how to ensure your subnet and Azure Orbital Ground Station resources are configured correctly.

In this how-to guide, you'll learn how to:

> [!div class="checklist"]
> * Prepare the subnet for VNET injection
> * Prepare endpoints
> * Verify the contact profile
> * Find IPs of scheduled contacts

Ensure the objects comply with the recommendations in this article. Note that these steps don't have to be followed in order.

## Create and prepare subnet for VNET injection

Prerequisites:
- An entire subnet with no existing IPs allocated or in use that can be dedicated to the Azure Orbital Ground Station service, in your virtual network within your resource group. If you need to make a new subnet, follow instructions to [add a subnet](../virtual-network/virtual-network-manage-subnet.md?tabs=azure-portal#add-a-subnet).

Follow instructions to [add a subnet delegation](../virtual-network/manage-subnet-delegation.md#delegate-a-subnet-to-an-azure-service) in your virtual network. Delegate your subnet to the service named: **Microsoft.Orbital/orbitalGateways**.

> [!NOTE]
>  Address range needs to be at least /24 (e.g., 10.0.0.0/23)

The following is an example of a typical VNET setup with a subnet delegated to Azure Orbital Ground Station:

:::image type="content" source="media/azure-ground-station-subnet-example.png" alt-text="Screenshot of subnet configuration with Azure Orbital Ground Station delegated subnet." lightbox="media/azure-ground-station-subnet-example.png":::

## Prepare endpoints

Set the MTU of all desired endpoints to at least **3650** by sending appropriate commands to your virtual machine within your resource group. 

## Verify the contact profile

Ensure the contact profile properties are set as follows:

### Region
The VNET/subnet must be in the same region as the contact profile.

### Subnet ID
1. Go to overview page of your contact profile and select **JSON view**. Find the **networkConfigurations** section, then identify the "**subnetId**".
2. Go to overview page of your virtual network and select **JSON view**. Find the section for your **delegated subnet**, then identify the "**id**".
3. Verify that these IDs are identical.

### Link flows: IP Address and Port

The links/channels must be set up in the following manner, based on direction and TCP or UDP preference.

> [!NOTE]
> These settings are for managed modems only.

#### Uplink

| Setting                                      | TCP Client                 | TCP Server                           | UDP Client                 | UDP Server     |
|:---------------------------------------------|:---------------------------|:-------------------------------------|:---------------------------|:---------------|
| Contact Profile: Link/Channel **IP Address** | Blank                      | Routable IP from delegated subnet    | Blank                      | Not applicable |
| Contact Profile: Link/Channel **Port**       | Unique port in 49152-65535 | Unique port in 49152-65535           | Unique port in 49152-65535 | Not applicable |
| **Output**                                   |                            |                                      |                            |                |
| Contact Resource: **destinationIP**          | Connect to this IP         | Not applicable                       | Connect to this IP         | Not applicable |
| Contact Resource: **sourceIP**               | Not applicable             | Link comes from one of these IPs     | Not applicable             | Not applicable |

#### Downlink

| Setting                                      | TCP Client                 | TCP Server                        | UDP Client     | UDP Server                        |
|:---------------------------------------------|:---------------------------|:----------------------------------|:---------------|:----------------------------------|
| Contact Profile: Link/Channel **IP Address** | Blank                      | Routable IP from delegated subnet | Not applicable | Routable IP from delegated subnet |
| Contact Profile: Link/Channel **Port**       | Unique port in 49152-65535 | Unique port in 49152-65535        | Not applicable | Unique port in 49152-65535        |
| **Output**                                   |                            |                                   |                |                                   |
| Contact Resource: **destinationIP**          | Connect to this IP         | Not applicable                    | Not applicable | Not applicable                    |
| Contact Resource: **sourceIP**               | Not applicable             | Link comes from one of these IPs  | Not applicable | Link comes from one of these IPs  |

> [!NOTE]
> You can have multiple links/channels in a contact profile, and you can have multiple IPs. However the combination of port/protocol must be unique. You can't have two identical ports, even if you have two different destination IPs. 

For more information, learn about [contact profiles](/azure/orbital/concepts-contact-profile) and [how to configure a contact profile](/azure/orbital/contact-profile).

## Find IPs of a scheduled contact

The Azure Orbital Ground Station platform prereserves IPs in the subnet when a contact is scheduled. These IPs represent the platform-side endpoints for each link. IPs are unique between contacts, and if multiple concurrent contacts are using the same subnet, Microsoft guarantees those IPs to be distinct. The service fails to schedule the contact and an error is returned if the service runs out of IPs or can't allocate an IP.

When you create a contact, you can find these IPs by viewing the contact properties. 
To view the contact properties, go to the contact resource overview page and select **JSON view** in the portal or use the **GET contact** API call. Make sure to use the current API version of 2022-11-01. The parameters of interest are below:

| **Parameter**                      | **Usage**                                                                      |
|------------------------------------|--------------------------------------------------------------------------------|
| antennaConfiguration.destinationIp | Connect to this IP when you configure the link as **tcp/udp client**.          |
| antennaConfiguration.sourceIps     | Data comes from this IP when you configure the link as **tcp/udp server**. |

You can use this information to set up network policies or to distinguish between simultaneous contacts to the same endpoint.

:::image type="content" source="media/azure-ground-station-contact-ips-example.png" alt-text="Screenshot of contact object with source and destination IPs." lightbox="media/azure-ground-station-contact-ips-example.png":::

> [!NOTE]
> - The source and destination IPs are always taken from the subnet address range.
> - Only one destination IP is present. Any link in client mode should connect to this IP and the links are differentiated based on port.
> - Many source IPs can be present. Links in server mode will connect to your specified IP address in the contact profile. The flows will originate from the source IPs present in this field and target the port as per the link details in the contact profile. There is no fixed assignment of link to source IP so please make sure to allow all IPs in any networking setup or firewalls. 

For more information, learn about [contacts](/azure/orbital/concepts-contact) and [how to schedule a contact](/azure/orbital/schedule-contact).

## Next steps

- [Register Spacecraft](register-spacecraft.md)
- [Configure the modem chain](modem-chain.md)
- [Schedule a contact](schedule-contact.md)
