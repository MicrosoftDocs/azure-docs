---
title: Azure Extended Zones for Azure Virtual Desktop
description: Learn about using Azure Virtual Desktop on Azure Extended Zones. 
ms.topic: conceptual
author: sipastak
ms.author: sipastak
ms.date: 08/08/2024
---

# Azure Virtual Desktop on Azure Extended Zones

> [!IMPORTANT]
> Using Azure Virtual Desktop on Azure Extended Zones is currently in preview. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

[Azure Extended Zones](/azure/extended-zones/overview) are small-footprint extensions of Azure placed in metros, industry centers, or a specific jurisdiction to serve low latency and/or data residency workloads. Azure Extended Zones is supported for Azure Virtual Desktop and can run latency-sensitive and throughput-intensive applications close to end users and within approved data residency boundaries. Azure Extended Zones are part of the Microsoft global network that provides secure, reliable, high-bandwidth connectivity between applications that run at an Azure Extended Zone close to the user.

## How Azure Extended Zones works

When you deploy Azure Virtual Desktop with an Azure Extended Zone, only the session host virtual machines are deployed in the Azure Extended Zone. All of the Azure Virtual Desktop metadata objects you create, such as host post pools, workspaces, and application groups remain in the main Azure region you select. The control plane components, such as the web service, broker service, gateway service, diagnostics, and extensibility components, are also only available in the main Azure regions. For more information, see [Azure Virtual Desktop service architecture and resilience](service-architecture-resilience.md).

Due to the proximity of the end user to the session host, you can benefit from reduced latency using Azure Extended Zones. Azure Extended Zones uses [RDP Shortpath](rdp-shortpath.md), which establishes a direct UDP-based transport between a supported Windows Remote Desktop client and session host. The removal of extra relay points reduces round-trip time, which improves connection reliability and user experience with latency-sensitive applications and input methods. 

[Azure Private Link](private-link-overview.md) can also be used with Azure Extended Zones. Azure Private Link can help with reducing latency and improving security. By creating a [private endpoint](../private-link/private-endpoint-overview.md), traffic between your virtual network and the service remains on the Microsoft network, so you no longer need to expose your service to the public internet. 

Unlike Azure regions, Azure Extended Zones doesn't have any default outbound connectivity. An existing Azure Load Balancer is needed on the virtual network that the session hosts are being deployed to. You need to use one or more frontend IP addresses of the load balancer for outbound connectivity to the internet in order for the session hosts to join a host pool. For more information, see [Azure's outbound connectivity methods](../load-balancer/load-balancer-outbound-connections.md#scenarios).

## Gaining access to an Azure Extended Zone 

To deploy Azure Virtual Desktop in Azure Extended Zone locations, you need to explicitly register your subscription with the respective Azure Extended Zone using an account that is a subscription owner. By default, this capability isn't enabled. Registration of an Azure Extended Zone is always scoped to a specific subscription, ensuring control and management over the resources deployed in these locations. Once a subscription is registered with the Azure Extended Zone, you can deploy and manage your desktops and applications within that specific Azure Extended Zone.

For more information, see [Request access to an Azure Extended Zone](/azure/extended-zones/request-access).

## Limitations

Azure Virtual Desktop on Azure Extended Zones has the following limitations:

- With Azure Extended Zones, there's no default outbound internet access. The default outbound route is being retired across all Azure regions in September 2025, so Azure Extended Zones begins without this default outbound internet route. For more information, see [Default outbound access for VMs in Azure will be retired— transition to a new method of internet access.](https://azure.microsoft.com/updates/default-outbound-access-for-vms-in-azure-will-be-retired-transition-to-a-new-method-of-internet-access/)

- Azure Extended Zones don't support NAT Gateways. You need to use an Azure Load Balancer with outbound rules enabled for outbound connectivity.

- There's a reduced set of supported virtual machine SKUs you can use as session hosts. For more information, see [Service offerings for Azure Extended Zones](/azure/extended-zones/overview#service-offerings-for-azure-extended-zones).

## Next step

To learn how to deploy Azure Virtual Desktop in an Azure Extended Zone, see [Deploy Azure Virtual Desktop](deploy-azure-virtual-desktop.md).
