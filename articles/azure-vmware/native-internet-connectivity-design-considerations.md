---
title: Azure VMware Solution in an Azure Virtual Network Internet connectivity design consideration (Public preview)
description: Learn about Azure VMware Solution in an Azure Virtual Network Internet connectivity design consideration.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 3/28/2025
ms.custom: engagement-fy25
---

# Internet connectivity design considerations (Public preview)

In this article, you learn to connect Azure VMware Solution on an Azure Virtual Network private cloud to the internet. After you deploy Azure VMware Solution in an Azure Virtual Network, you may need to have network connectivity between the private cloud and other networks you have on Azure Virtual Network (virtual network), on-premises, other Azure VMware Solution private clouds, or the internet. This article focuses on how the Azure VMware Solution on native private cloud gets connectivity to the internet. 

## Prerequisites
- Have Azure VMware Solution on native and previous editions of private cloud deployed successfully.
- Have Azure Firewall or a third-party NVA deployed in the virtual network which will be used as an internet ingress/egress appliance.
- Have an Azure route table with a default route pointing to the Azure Firewall/NVA appliance.

## Connect Azure VMware Solution in an Azure Virtual Network private cloud to the Internet

Azure VMware Solution provides necessary internet connectivity to SDDC appliances like vCenter, NSX Manager, and HCX Manager for management functions. However, Azure VMware Solution on native’s customer workload internet connectivity relies on the internet connectivity configured on the virtual network it's deployed in. The customer workload can connect to the internet through either vWAN, Azure Firewall, or third-party NVA appliances. The standard Azure Supported topology for vWAN, Azure Firewall, and third-party NVA are supported.

:::image type="content" source="./media/native-connectivity/native-connect-private-cloud-internet.png" alt-text="Diagram showing an Azure VMware Solution connection to other virtual networks."::: 

Azure VMware Solution internet connectivity using Azure Firewall is similar to the way Azure virtual network internet connectivity is achieved, which is described in more detail in the Azure Firewall documentation. The only thing specific to the Azure VMware solution is the subnets which need to be associated with a user-defined route table (UDR) to point to Azure Firewall or third-party NVA for internet connectivity.

## Main steps:

1. Have or create Azure Firewall or a third-party NVA in the virtual network local to the AVS SDDC or in the peered virtual network.
2. Define an Azure route table with a 0.0.0.0/0 route pointing to the next-hop type Virtual Appliance with the next-hop IP address of the Azure Firewall private IP or IP of the NVA appliance.
3. Associate the route table to the Azure VMware Solution specific virtual network subnets named “esx-lrnsxuplink” and “esx-lrnsxuplink-1”, which are part of the virtual network associated with SDDC.
    >[!Note] 
    >The Azure route tables (UDR), associated with private cloud uplink subnets, and private cloud VNet need to be in the same Azure resource group.
4. Have necessary firewall rules to allow traffic to and from the internet.
