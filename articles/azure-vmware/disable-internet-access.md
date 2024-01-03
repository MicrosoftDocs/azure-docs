---
title: Turn off internet access or turn on a default route 
description: Learn how to turn off internet access for Azure VMware Solution or turn on a default route for Azure VMware Solution.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 12/11/2023
ms.custom: engagement-fy23
---

# Turn off internet access or turn on a default route

In this article, learn how to disable internet access or turn on a default route for your Azure VMware Solution private cloud.

You have multiple options to set up a default route. You can use a virtual WAN hub, a network virtual appliance (NVA)in a virtual network, or use a default route from on-premises. If you don't set up a default route, you have no internet access to your Azure VMware Solution private cloud.

With a default route setup, you can achieve the following tasks:

- Turn off internet access to your Azure VMware Solution private cloud.

  > [!NOTE]
  > Ensure that a default route is not advertised from on-premises or Azure. An advertised default route overrides this setup.

- Turn on internet access by generating a default route from Azure Firewall or from a third-party NVA.

## Prerequisites

- An Azure VMware Solution private cloud.
- If internet access is required, a default route must be advertised from an instance of Azure Firewall, an NVA, or a virtual WAN hub.

## Turn off internet access or turn on a default route in the Azure portal

1. Sign in to the Azure portal.
1. Search for **Azure VMware Solution**, and then select it in the search results.
1. Find and select your Azure VMware Solution private cloud.  
1. On the resource menu under **Workload networking**, select **Internet connectivity**.
1. Select the **Don't connect or connect using default route from Azure** button, and then select **Save**.

If you don't have a default route from on-premises or from Azure, by completing the preceding steps, you successfully disabled internet connectivity to your Azure VMware Solution private cloud.

## Related content

- [Internet connectivity design considerations (preview)](concepts-design-public-internet-access.md)
- [Turn on Managed SNAT for Azure VMware Solution workloads](enable-managed-snat-for-workloads.md)
- [Turn on public IP to the NSX Edge gateway for Azure VMware Solution](enable-public-ip-nsx-edge.md)
