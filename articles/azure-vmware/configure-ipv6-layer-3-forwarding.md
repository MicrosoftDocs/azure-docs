---
title: Configure IPv6 Layer 3 forwarding in Azure VMware Solution 
description: Learn how to use NSX Layer 3 forwarding in Azure VMware Solution
ms.topic: reference
ms.service: azure-vmware
ms.date: 8/10/2026
ms.custom: engagement-fy27

# Customer intent: This article describes NSX IPv6 Layer 3 forwarding in Azure VMware Solution and outlines the scope of IPv6 feature support on Azure VMware Solution.

---

# Configure IPv6 Layer 3 forwarding in Azure VMware Solution

By default, Azure VMware Solution supports IPv6 communication between workloads on the same NSX segment through Layer 2 switching. Routing between NSX segments is not enabled by default.
To enable IPv6 Layer 3 forwarding within a private cloud, submit a support request to Microsoft. After the feature is enabled, IPv6 traffic can flow between workloads on different NSX segments that are connected to the same or different Tier-1 gateways.
This configuration enables IPv6 Layer 3 forwarding only within the Azure VMware Solution private cloud. It does not enable IPv6 Layer 3 forwarding to networks outside the private cloud. For configuration details, see [Configure IPv6 Layer 3 Forwarding](https://techdocs.broadcom.com/us/en/vmware-cis/nsx/vmware-nsx/4-2/administration-guide/tier-0-gateways/configure-ipv6-layer-3-forwarding.html) in the Broadcom documentation.

 >[!NOTE]
> Broadcom HCX may offer limited feature support for IPv6-only and dual-stack workloads compared with IPv4 workloads. Before migrating these workloads with HCX, consult your Microsoft account team to confirm support and requirements.

## Configure IPv6 Layer 3 forwarding from private cloud to other private cloud or on-premises

To connect IPv6 workloads in an Azure VMware Solution private cloud to workloads in another private cloud or in an on-premises environment, use a standard policy-based IPv6-to-IPv4 VPN connection. 
Configure an NSX Tier-1 VPN in the Azure VMware Solution private cloud and apply a matching configuration at the remote endpoint. Depending on the connectivity scenario, the VPN connects the NSX Tier-1 gateway to either an on-premises VPN gateway or a Tier-1 gateway in another Azure VMware Solution private cloud.
For configuration guidance, see the [Broadcom NSX VPN documentation](https://techdocs.broadcom.com/us/en/vmware-cis/nsx/vmware-nsx/4-2/administration-guide/virtual-private-network-vpn.html).
