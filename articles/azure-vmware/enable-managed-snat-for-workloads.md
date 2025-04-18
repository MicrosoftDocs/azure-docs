---
title: Turn on Managed SNAT for Azure VMware Solution workloads 
description: Learn how to turn on Managed SNAT for Azure VMware Solution workloads.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 3/22/2024
ms.custom: engagement-fy23
---

# Turn on Managed SNAT for Azure VMware Solution workloads

In this article, learn how to turn on Source Network Address Translation (SNAT) via the Azure VMware Solution Managed SNAT service to connect to outbound internet.

A SNAT service translates from an RFC 1918 space to the public internet for simple outbound internet access. Internet Control Message Protocol (ICMP) is turned off by design so that users can't ping an internet host. The SNAT service doesn't work when you have a default route from Azure.  

The Managed SNAT service in Azure VMware Solution gives you:

- A basic SNAT service with outbound internet connectivity from your Azure VMware Solution private cloud.
- A limit of 128,000 concurrent connections.

By using the Managed SNAT service, you *don't* have:

- Control of outbound SNAT rules.
- Control of the public IP address that's used.
- The ability to terminate inbound-initiated internet traffic.
- The ability to view connection logs.

## Reference architecture

The following figure shows internet access that's outbound from your Azure VMware Solution private cloud via the Managed SNAT service in Azure VMware Solution.

:::image type="content" source="media/public-ip-nsx-edge/architecture-internet-access-avs-public-ip-snat.png" alt-text="Diagram that shows the architecture of internet access to and from your Azure VMware Solution private cloud via public IP address directly to the SNAT edge." border="false" lightbox="media/public-ip-nsx-edge/architecture-internet-access-avs-public-ip-snat-expanded.png":::

## Set up outbound internet access by using the Managed SNAT service

To set up outbound internet access via Managed SNAT, use the Azure portal:

1. Sign in to the Azure portal.
1. Search for **Azure VMware Solution**, and then select it in the search results.
1. Select your Azure VMware Solution private cloud.
1. On the resource menu under **Workload networking**, select **Internet connectivity**.
1. Select **Connect using SNAT**, and then select **Save**.

## Related content

- [Internet connectivity design considerations](architecture-design-public-internet-access.md)
- [Turn on public IP addresses to an NSX-T Edge node for NSX-T Data Center](enable-public-ip-nsx-edge.md)
- [Set a default internet route or disable internet access](disable-internet-access.md)
