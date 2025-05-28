---
title: Internet Configuration for Azure VMware Solution Generation 2 Private Clouds
description: Learn about Azure VMware Solution in an Azure Virtual Network Internet connectivity configuration.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 4/21/2025
ms.custom: engagement-fy25
---

# Connect to Internet

After you deploy an Azure VMware Solution Generation 2 (Gen 2) private cloud, you may require network connectivity between the private cloud and other networks you have in an Azure Virtual Network, on-premises, other Azure VMware Solution private clouds, or the internet. In this article, you learn to connect Azure VMware Solution on an Azure Virtual Network private cloud to the internet.

## Prerequisites
- Gen 2 private cloud deployed successfully.
- Azure Firewall or a third-party Network Virtual Appliance (NVA) deployed in the virtual network which will be used as an internet ingress/egress appliance.
- Azure route table with a default route pointing to the Azure Firewall or Network Virtual Appliance.

## Connect Azure VMware Solution Generation 2 Private Cloud to the Internet

Azure VMware Solution provides necessary internet connectivity to SDDC appliances like vCenter, NSX Manager, and HCX Manager for management functions. This private cloud relies on the internet connectivity configured on the Virtual Network it's deployed in. The customer workload can connect to the internet through either virtual WAN, Azure Firewall, or third-party Network Virtual Appliances. The standard Azure Supported topology for virtual WAN, Azure Firewall, and third-party Network Virtual Appliances are supported.

:::image type="content" source="./media/native-connectivity/native-connect-private-cloud-internet.png" alt-text="Diagram showing an Azure VMware Solution Gen 2 connection to internet via Azure Firewall." lightbox="media/native-connectivity/native-connect-private-cloud-internet.png":::

Internet connectivity using Azure Firewall is similar to the way Azure virtual network internet connectivity is achieved, which is described in more detail in the Azure Firewall documentation. The only thing specific to the Azure VMware Solution Gen 2 private cloud is the subnets which need to be associated with a user-defined route table (UDR) to point to Azure Firewall or third-party Network Virtual Appliance for internet connectivity.

## Steps:

1. Have or create Azure Firewall or a third-party Network Virtual Appliance in the virtual network local to the private cloud or in the peered virtual network.
2. Define an Azure route table with a 0.0.0.0/0 route pointing to the next-hop type Virtual Appliance with the next-hop IP address of the Azure Firewall private IP or IP of the Network Virtual Appliance.
3. Associate the route table to the Azure VMware Solution specific virtual network subnets named “esx-lrnsxuplink” and “esx-lrnsxuplink-1”, which are part of the virtual network associated with private cloud.
    >[!Note] 
    >The Azure route tables (UDR), associated with private cloud uplink subnets, and private cloud VNet need to be in the same Azure resource group.
4. Have necessary firewall rules to allow traffic to and from the internet.

Related topics
- [Connectivity to an Azure Virtual Network](native-network-connectivity.md)
- [Connect to on-premises environment](native-connect-on-premises.md)
- [Connect multiple Gen 2 private clouds](native-connect-multiple-private-clouds.md)
- [Connect Gen 2 private clouds to Gen 1 private clouds](native-connect-private-cloud-previous-edition.md)
- [Public and Private DNS forward lookup zone configuration](native-dns-forward-lookup-zone.md)
