---
title: Azure Extended Zones for Azure Virtual Desktop
description: Learn about using Azure Virtual Desktop with Azure Extended Zones. 
ms.topic: conceptual
author: sipastak
ms.author: sipastak
ms.date: 04/11/2024
---

# Azure Virtual Desktop with Azure Extended Zones

> [!IMPORTANT]
> Using Azure Virtual Desktop with Azure Extended Zones is currently in preview. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.


Azure Extended Zones are small-footprint extensions of Azure placed in metros, industry centers, or a specific jurisdiction to serve low latency and/or data residency workloads. Azure Extended Zones is supported for Azure Virtual Desktop and can run latency-sensitive and throughput-intensive applications close to end users and within approved data residency boundaries. Azure Extended Zones are part of the Microsoft global network that provides secure, reliable, high-bandwidth connectivity between applications that run at an Azure Extended Zone close to the user.


## How Azure Extended Zones works

When deploying Azure Virtual Desktop in an Azure Extended Zone, all of the Azure Virtual Desktop metadata objects you create, such as host post pools, workspaces and application groups remain in the main Azure regions. The control plane components, such as the web service, broker service, gateway service, diagnostics, and extensibility components, are also only available in the main Azure regions. Only the session host virtual machines are deployed in the Azure Extended Zone. 

Due to the proximity from the end user to the session host, you can benefit from reduced latency using Azure Extended Zones. Azure Extended Zones uses [RDP Shortpath](rdp-shortpath.md), which establishes a direct UDP-based transport between a supported Windows Remote Desktop client and session host. The removal of extra relay points reduces round-trip time, which improves connection reliability and user experience with latency-sensitive applications and input methods. 

[Azure Private Link](private-link-overview.md) can be used with Azure Extended Zones. Azure Private Link can help with reducing latency and improving security. By creating a [private endpoint](../private-link/private-endpoint-overview.md), traffic between your virtual network and the service remains on the Microsoft network, so you no longer need to expose your service to the public internet. 

Unlike Azure regions, Azure Extended Zones doesn't have any default outbound connectivity. An existing Azure Load Balancer is needed on the virtual network that the session hosts are being deployed to. You'll need to use the frontend IP address(es) of the load balancer for outbound connectivity to the internet in order for the session hosts to join a host pool. See [Azure's outbound connectivity methods](../load-balancer/load-balancer-outbound-connections.md#scenarios) for more information. 


## Gaining access to an Azure Extended Zone 

To deploy Azure Virtual Desktop in Azure Extended Zone locations, you'll need to explicitly register your subscription with the respective Azure Extended Zone using an account that is a subscription owner. By default, this capability isn't enabled. Registration of an Azure Extended Zone is always scoped to a specific subscription, ensuring control and management over the resources deployed in these locations. Once the subscription is registered with the Azure Extended Zone, you can deploy and manage your virtual desktop and applications within that specific Azure Extended Zone.

For more information, see....


## Limitations

Azure Virtual Desktop with Azure Extended Zones has the following limitations:

- With Azure Extended Zones, there's no default outbound internet access. The default outbound route is being retired across all Azure regions in September 2025. As Azure Extended Zones will become generally available shortly prior to this date, they'll start without this default outbound internet route. For more information, see [Default outbound access for VMs in Azure will be retired— transition to a new method of internet access.](https://azure.microsoft.com/updates/default-outbound-access-for-vms-in-azure-will-be-retired-transition-to-a-new-method-of-internet-access/)

- Azure Extended Zones don't support NAT Gateways. You'll need to use an Azure Load Balancer with outbound rules enabled for outbound connectivity.

- There's a reduced set of supported virtual machine SKUs.


## Next steps

To learn how to deploy Azure Virtual Desktop in an Azure Extended Zone, see [Deploy Azure Virtual Desktop](deploy-azure-virtual-desktop.md).

