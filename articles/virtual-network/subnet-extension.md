---
title: Subnet extension in Azure
titleSuffix: Azure Virtual Network
description: Learn about subnet extension in Azure.
author: asudbring
ms.service: virtual-network
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 04/06/2023
ms.author: allensu
---

# Subnet extension

Workload migration to the public cloud requires careful planning and coordination. One of the key considerations can be the ability to retain your IP addresses. Which can be important especially if your applications have IP address dependency or you have compliance requirements to use specific IP addresses. Azure Virtual Network solves this problem for you by allowing you to create virtual networks and subnets using an IP address range of your choice.

Migrations can get a bit challenging when the above requirement is coupled with an extra requirement to keep some applications on-premises. In such as a situation, you have to split the applications between Azure and on-premises, without renumbering the IP addresses on either side. Additionally, you have to allow the applications to communicate as if they are in the same network.

One solution to the above problem is subnet extension. Extending a network allows applications to talk over the same broadcast domain when they exist at different physical locations, removing the need to rearchitect your network topology. 

While extending your network isn't a good practice in general, the following use cases can make it necessary.

- **Phased Migration**: The most common scenario is that you want to phase your migration. You want to bring a few applications first and over time migrate rest of the applications to Azure.

- **Latency**: Low latency requirements can be another reason for you to keep some applications on-premises to ensure that they're as close as possible to your datacenter.

- **Compliance**: Another use case is that you might have compliance requirements to keep some of your applications on-premises.
 
> [!NOTE] 
> You should not extend your subnets unless it is necessary. In the cases where you do extend your subnets, you should try to make it an intermediate step. With time, you should try re-number applications in your on-premises network and migrate them to Azure.

In the next section, we'll discuss how you can extend your subnets into Azure.

## Extend your subnet to Azure

 You can extend your on-premises subnets to Azure using a layer-3 overlay network based solution. Most solutions use an overlay technology such as VXLAN to extend the layer-2 network using an layer-3 overlay network. The following diagram shows a generalized solution. In this solution, the same subnet exists on both sides that is, Azure and on-premises. 

:::image type="content" source="./media/subnet-extension/subnet-extension.png" alt-text="Diagram of Subnet Extension example.":::

The IP addresses from the subnet are assigned to VMs on Azure and on-premises. Both Azure and on-premises have an NVA inserted in their networks. When a VM in Azure tries to talk to a VM in on-premises network, the Azure NVA captures the packet, encapsulates it, and sends it over VPN/Express Route to the on-premises network. The on-premises NVA receives the packet, decapsulates it and forwards it to the intended recipient in its network. The return traffic uses a similar path and logic.

In the above example, the Azure NVA and the on-premises NVA communicate and learn about IP addresses behind each other. More complex networks can also have a mapping service, which maintains the mapping between the NVAs and the IP addresses behind them. When an NVA receives a packet, it queries the mapping service to find out the address of the NVA that has the destination IP address behind it.

In the next section, you'll find details on subnet extension solutions we've tested on Azure.

## Next steps 
[Extend your on-premises subnets into Azure using Azure Extended Network](/windows-server/manage/windows-admin-center/azure/azure-extended-network).