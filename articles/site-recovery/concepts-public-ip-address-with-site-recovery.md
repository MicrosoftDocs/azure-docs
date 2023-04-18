---
title: Assign public IP addresses after failover with Azure Site Recovery 
description: Describes how to set up public IP addresses with Azure Site Recovery and Azure Traffic Manager for disaster recovery and migration
services: site-recovery
author: ankitaduttaMSFT
manager: rochakm
ms.service: site-recovery
ms.topic: conceptual
ms.date: 04/08/2019
ms.author: ankitadutta

---
# Set up public IP addresses after failover

Public IP addresses allow Internet resources to communicate inbound to Azure resources. Public IP addresses also enable Azure resources to communicate outbound to Internet and public-facing Azure services with an IP address assigned to the resource.
- Inbound communication from the Internet to the resource, such as Azure Virtual Machines (VM), Azure Application Gateways, Azure Load Balancers, Azure VPN Gateways, and others. You can still communicate with some resources, such as VMs, from the Internet, if a VM doesn't have a public IP address assigned to it, as long as the VM is part of a load balancer back-end pool, and the load balancer is assigned a public IP address.
- Outbound connectivity to the Internet using a predictable IP address. For example, a virtual machine can communicate outbound to the Internet without a public IP address assigned to it, but its address is network address translated by Azure to an unpredictable public address, by default. Assigning a public IP address to a resource enables you to know which IP address is used for the outbound connection. Though predictable, the address can change, depending on the assignment method chosen. For more information, see [Create a public IP address](../virtual-network/ip-services/virtual-network-public-ip-address.md#create-a-public-ip-address). To learn more about outbound connections from Azure resources, see [Understand outbound connections](../load-balancer/load-balancer-outbound-connections.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

In Azure Resource Manager, a Public IP address is a resource that has its own properties. Some of the resources you can associate a public IP address resource with are:

* Virtual machine network interfaces
* Internet-facing load balancers
* VPN gateways
* Application gateways

This article describes how you can use Public IP addresses with Site Recovery.

## Public IP address assignment using Recovery Plan

Public IP address of the production application **cannot be retained on failover**. Workloads brought up as part of failover process must be assigned an Azure Public IP resource available in the target region. This step can be done either manually or is automated with recovery plans. A recovery plan gathers machines into recovery groups. It helps you to define a systematic recovery process. You can use a recovery plan to impose order, and automate the actions needed at each step, using Azure Automation runbooks for failover to Azure, or scripts.

The setup is as follows:
- Create a [recovery plan](../site-recovery/site-recovery-create-recovery-plans.md#create-a-recovery-plan) and group your workloads as necessary into the plan.
- Customize the plan by adding a step to attach a public IP address  using [Azure Automation runbooks](../site-recovery/site-recovery-runbook-automation.md#customize-the-recovery-plan) scripts to the failed over VM.

 
## Public endpoint switching with DNS level Routing

Azure Traffic Manager enables DNS level routing between endpoints and can assist with [driving down your RTOs](../site-recovery/concepts-traffic-manager-with-site-recovery.md#recovery-time-objective-rto-considerations) for a DR scenario. 

Read more about failover scenarios with Traffic Manager:
1. [On-premises to Azure failover](../site-recovery/concepts-traffic-manager-with-site-recovery.md#on-premises-to-azure-failover) with Traffic Manager 
2. [Azure to Azure failover](../site-recovery/concepts-traffic-manager-with-site-recovery.md#azure-to-azure-failover) with Traffic Manager 

The setup is as follows:
- Create a [Traffic Manager profile](../traffic-manager/quickstart-create-traffic-manager-profile.md).
- Utilizing the **Priority** routing method, create two endpoints – **Primary** for source and **Failover** for Azure. **Primary** is assigned Priority 1 and **Failover** is assigned Priority 2.
- The **Primary** endpoint can be [Azure](../traffic-manager/traffic-manager-endpoint-types.md#azure-endpoints) or [External](../traffic-manager/traffic-manager-endpoint-types.md#external-endpoints) depending on whether your source environment is inside or outside Azure.
- The **Failover** endpoint is created as an **Azure** endpoint. Use a **static public IP address** as this will be external facing endpoint for Traffic Manager in the disaster event.

## Next steps
- Learn more about [Traffic Manager with Azure Site Recovery](../site-recovery/concepts-traffic-manager-with-site-recovery.md)
- Learn more about Traffic Manager [routing methods](../traffic-manager/traffic-manager-routing-methods.md).
- Learn more about [recovery plans](site-recovery-create-recovery-plans.md) to automate application failover.