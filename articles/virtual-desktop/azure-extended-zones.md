---
title: Azure Extended Zones for Azure Virtual Desktop
description: Learn about using Azure Virtual Desktop with Azure Extended Zones. 
ms.topic: conceptual
author: sipastak
ms.author: sipastak
ms.date: 04/11/2024
---

# Azure Virtual Desktop with Azure Extended Zones

Azure Extended Zones are small-footprint extensions of Azure placed in metros, industry centers, or a specific jurisdiction to serve low latency and/or data residency workloads. Azure Extended Zones is supported for Azure Virtual Desktop and can run latency-sensitive and throughput-intensive applications close to end users and within approved data residency boundaries. Azure Extended Zones are part of the Microsoft global network that provides secure, reliable, high-bandwidth connectivity between applications that run at an Azure Extended Zone close to the user.


## Benefits

By deploying Azure Virtual Desktop in an Azure Extended Zone, you can:

- Ease low latency and/or data regulation needs for users.

- Meet data locality requirements. If data residency needs the data to be in a specific location, Azure Extended Zones can guarantee that location. 

## Prerequisites

Before you can use Azure Virtual Desktop with Azure Extended Zones, you need:

- An active Azure subscription.

- [Access](#gaining-access-to-an-azure-extended-zone) to an Azure Extended Zone.

- An existing [Azure Load Balancer](../load-balancer/load-balancer-outbound-connections.md) on the virtual network that the session hosts are being deployed to. You will need to use the frontend IP address(es) of a load balancer for outbound connectivity to the internet in order for the session hosts to join a host pool.  

## Gaining access to an Azure Extended Zone 

To deploy Azure Virtual Desktop in Azure Extended Zone locations, you will need to explicitly register your subscription with the respective Azure Extended Zone using an account that is a subscription owner. By default, this capability is not enabled. Registration of an Azure Extended Zone is always scoped to a specific subscription, ensuring control and management over the resources deployed in these locations. Once the subscription is registered with the Azure Extended Zone, you can deploy and manage your virtual desktop and applications within that specific Azure Extended Zone.

For more information, see ....


## Limitations

Azure Virtual Desktop with Azure Extended Zones has the following limitations:

- With Azure Extended Zones, there is no default outbound internet access, as the default outbound route is being retired in September 2025. For more information, see [Default outbound access for VMs in Azure will be retired— transition to a new method of internet access.](https://azure.microsoft.com/updates/default-outbound-access-for-vms-in-azure-will-be-retired-transition-to-a-new-method-of-internet-access/)

- Azure Extended Zones do not support NAT Gateways. You will need to use an Azure Load Balancer with outbound rules enabled for outbound connectivity.

- There is a reduced set of supported VM SKUs (list to be provided, or will need to inform customers to check availability before deploying).


## Next steps


