---
title: Set a default internet route or turn off internet access 
description: Learn how to set a default internet route or turn off internet access in your Azure VMware Solution private cloud.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 3/22/2024
ms.custom: engagement-fy23
---

# Set a default internet route or turn off internet access

In this article, learn how to set a default internet route or turn off internet access in your Azure VMware Solution private cloud.

You have multiple options to set up a default internet access route. You can use a virtual WAN hub or a network virtual appliance (NVA) in a virtual network, or you can use a default route from an on-premises environment. If you don't set a default route, your Azure VMware Solution private cloud has no internet access.

With a default route set, you can achieve the following tasks:

- Turn off internet access to your Azure VMware Solution private cloud.

  > [!NOTE]
  > Ensure that a default route is not advertised from on-premises or from Azure. An advertised default route overrides this setup.

- Turn on internet access by generating a default route from Azure Firewall or from a third-party NVA.

## Prerequisites

- An Azure VMware Solution private cloud.
- If internet access is required, a default route must be advertised from an instance of Azure Firewall, an NVA, or a virtual WAN hub.

## Set a default internet access route

To set a default internet access route or to turn off internet access, use the Azure portal:

1. Sign in to the Azure portal.
1. Search for **Azure VMware Solution**, and then select it in the search results.
1. Find and select your Azure VMware Solution private cloud.  
1. On the resource menu under **Workload networking**, select **Internet connectivity**.
1. Select the **Connect using default route from Azure** option or the **Don't connect using default route from Azure** option, and then select **Save**.

If you don't have a default route from on-premises or from Azure, by completing the preceding steps, you turned off internet connectivity to your Azure VMware Solution private cloud.

## Related content

- [Internet connectivity design considerations](architecture-design-public-internet-access.md)
- [Turn on Managed SNAT for Azure VMware Solution workloads](enable-managed-snat-for-workloads.md)
- [Turn on public IP addresses to an NSX-T Edge node for NSX-T Data Center](enable-public-ip-nsx-edge.md)
