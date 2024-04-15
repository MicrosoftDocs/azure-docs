---
title: Azure Extended Zones for Azure Virtual Desktop
description: Learn about using Azure Virtual Desktop with Azure Extended Zones. 
ms.topic: conceptual
author: sipastak
ms.author: sipastak
ms.date: 04/11/2024
---

# Azure Virtual Desktop with Azure Extended Zones

Azure Extended Zones are small-footprint extensions of Azure placed in metros, industry centers, or a specific jurisdiction to serve low latency and/or data residency workloads. Azure Extended Zones is supported for Azure Virtual Desktop and can run latency-sensitive and throughput-intensive applications close to end users and within approved data residency boundaries. This eases low latency and/or data regulation needs for users, when applicable in their situation. Azure Extended Zones are part of the Microsoft global network that provides secure, reliable, high-bandwidth connectivity between applications that run at an Azure Extended Zone close to the user.


## Benefits

Using Azure Virtual Desktop with Azure Extended Zones, you can:


## Gaining access to an Azure Extended Zone 

To deploy Azure Virtual Desktop in Azure Extended Zone locations, you will need to explicitly register your subscription with the respective Azure Extended Zone using an account that is a subscription owner. By default, this capability is not enabled. Registration of an Azure Extended Zone is always scoped to a specific subscription, ensuring control and management over the resources deployed in these locations. Once the subscription is registered with the Azure Extended Zone, you can deploy and manage your virtual desktop and applications within that specific Azure Extended Zone.

For more information, see ....


## Configuration

- Announcement of the default outbound route for Azure being retired: https://azure.microsoft.com/en-us/updates/default-outbound-access-for-vms-in-azure-will-be-retired-updates-and-more-information/, we need this as Extended Zones are starting off without the outbound route. Which means we need a way to get to the internet.

- There are a number of options to get to the internet and we are going to use option 1: Use the frontend IP address(es) of a load balancer for outbound via outbound rules - in this overview doc: https://learn.microsoft.com/en-us/azure/load-balancer/load-balancer-outbound-connections
And this detailed doc: https://learn.microsoft.com/en-us/azure/load-balancer/outbound-rules

- An Azure Load Balancer would need to exist already on the vnet that the Session hosts are being deployed to in order for all of those session hosts to get to the internet and join a host pool. Without this the deployment will fail.



## Licensing and pricing



## Limitations



## Next steps


