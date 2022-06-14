---
title: Prepare resources for Orbital GSaaS integration
description: Learn how to deliver and receive data from Orbital
author: hrshelar
ms.service: orbital
ms.topic: concepts
ms.custom: ga
ms.date: 06/13/2022
ms.author: hrshelar, mablonde
---

# Prepare resources for Orbital GSaaS integration

The Orbital GSaaS platform interfaces with your resources using VNET injection which is used in both uplink and downlink directions. This page describes how to ensure your Subnet and Orbital GSaaS objects are configured correctly.

Please ensure the objects comply with the recommendations below. Note, these steps do not have to be conducted serially.

## Prepare Subnet for VNET Injection

Prerequisites:
1. An entire subnet that can be dedicated to Orbital GSaaS in your virtual network in your resource group.

Steps:
1. Delegate a subnet to service named: Microsoft.Orbital/orbitalGateways. Follow instructions here: [Add or remove a subnet delegation in an Azure virtual network](https://docs.microsoft.com/en-us/azure/virtual-network/manage-subnet-delegation).

Note:
1. Address range needs to be at least /24 (example 10.0.0.0/23)

## Setting up the Contact Profile

Prerequisites:
1. The subnet/vnet is in the same region as the contact profile

Make sure the following contact profile properties are set as follows:

1. subnetId (under networkConfiguration): The full id to the delegated subnet. This can be found inside the VNET's JSON view
1. For each link
    1. ipAddress: Enter an IP here for TCP/UDP server mode. Leave blank for TCP/UDP client mode. See section below for a detailed explanation on configuring this property.
    1. port: Needs to be within 49152 and 65535 range. Note that ports need be unique across links as well.

Note:

1. You can have multiple links/channels in a contact profile, and you can have multiple IPs. But the combination of port/protocol needs to be unique. You cannot have two identical ports, even if you have two different destination IPs. 

## Scheduling the Contact

The platform pre-reserves IPs in the subnet when the contact is scheduled and represent the platform side endpoints for each link. 
IPs will be unique for the duration of the contact (if multiple contacts are using the same subnet, and happen to overlap, we guarantee those IPs to be distinct). If we run out of IPs, we will fail to schedule the contact and an error will be returned.

Once a contact is created, these IPs can be found by viewing the JSON properties of the contact in the portal or querying the API for the contact body using the GET contact call. The parameters of interest are below:

* antennaConfiguration.destinationIP: This only applies when a link is a tcp/udp client. This is the IP you can connect to.
* antennaConfiguration.sourceIps:This only applies when a link is a tcp/udp server. This will be the source of the traffic directed at your endpoint. 

You can use this information to setup network policies or to distinguish between simultaneous contacts to the same endpoint.

Note:

1. The source and destination IPs are always taken from the subnet address range
1. Only one destination IP is present. Any link in client mode should connect to this IP and the links are differentiated based on port.
1. Many source IPs can be present. Links in server mode will connect to your specified IP address in the contact profile. The flows will originate from the source IPs present in this field and target the port as per the link details in the contact profile. There is no fixed assignment of link to source IP so please make sure to allow all IPs in any networking setup or firewalls. 


## Client/Server, TCP/UDP, and link direction

Here is how to appropriately setup the link flows. Note the scope of the platform assigned IP addresses are on a per contact basis.

### Uplink

| Setting                          | TCP Client                   | TCP Server                             | UDP Client                   | UDP Server                             |
|----------------------------------|------------------------------|----------------------------------------|------------------------------|----------------------------------------|
| Contact Profile Link ipAddress   | Blank                        | Routable IP from delegated subnet      | Blank                        | Routable IP from delegated subnet      |
| Contact Profile Link port        | Unique port in 49152-65535   | Unique port in 49152-65535             | Unique port in 49152-65535   | Unique port in 49152-65535             |
| **Output**                       |                              |                                        |                              |                                        |
| Contact Object destinationIP     | Connect to this IP           | NA                                     | Connect to this IP           | NA                                     |
| Contact Object sourceIP          | NA                           | Link will come from one of these IPs   | NA                           | Link will come from one of these IPs   |



### Downlink

| Setting                          | TCP Client                   | TCP Server                             | UDP Client                   | UDP Server                             |
| -------------------------------- | ---------------------------- | -------------------------------------- | ---------------------------- | -------------------------------------- |
| Contact Profile Link ipAddress   | Blank                        | Routable IP from delegated subnet      | Blank                        | Routable IP from delegated subnet      |
| Contact Profile Link port        | Unique port in 49152-65535   | Unique port in 49152-65535             | Unique port in 49152-65535   | Unique port in 49152-65535             |
| **Output**                       |                              |                                        |                              |                                        |
| Contact Object destinationIP     | Connect to this IP           | NA                                     | Connect to this IP           | NA                                     |
| Contact Object sourceIP          | NA                           | Link will come from one of these IPs   | NA                           | Link will come from one of these IPs   |