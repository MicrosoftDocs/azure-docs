<properties
   pageTitle="Deploying virtual appliances in high availability | Microsoft Azure"
   description="How to deploy network virtual appliances in high availability."
   services=""
   documentationCenter="na"
   authors="telmosampaio"
   manager="christb"
   editor=""
   tags=""/>

<tags
   ms.service="guidance"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="09/21/2016"
   ms.author="telmos"/>

# Deploying virtual appliances in high availability

[AZURE.INCLUDE [pnp-header](../../includes/guidance-pnp-header-include.md)]

This article outlines a set of practices for deploying network virtual appliances (NVAs) in a highly available manner. Before continuing, make sure you understand how [user-defined routes (UDR)][udr-overview] and [load balancer][lb-overview] work in Azure.

You can use different NVAs available in the Azure marketplace to extend the functionality of Azure in the same way you use appliances in your on-premises datacenter. The following figure shows a sample deployment of a [single NVA][nva-scenario] as a firewall appliance. 

![[0]][0]

Although the preceding deployment works, it introduces a single point of failure. If the virtual appliance fails, no traffic flows. To solve that problem, you need to use multiple NVAs. However, that also requires other settings and resources to be used depending on your requirements.

You can use one of the following solutions to deploy a highly available NVA environment.

|Solution|Benefits|Considerations|
|---|---|---|
|Ingress with layer 7 virtual appliances|All nodes are active|Requires an NVA that can terminate connections and use SNAT<br/>Requires a separate set of NVAs for traffic coming from the Internet and from Azure<br/>Can only be used for traffic originating outside Azure|
|Ingress-Egress with layer 7 virtual appliances|All nodes are active<br/>Able to handle traffic originated in Azure |Requires an NVA that can terminate connections and use SNAT<br/>Requires a separate set of NVAs for traffic coming from the Internet and from Azure|
|PIP-UDR switch|Single set of NVAs for all traffic<br/>Can handle all traffic (no limit on port rules)|Active-passive<br/>Requires a failover process|

## Ingress with layer 7 virtual appliances
You can use a set of NVAs behind an Azure load balancer to provide connectivity to Azure workloads behind a small set of server-side ports (such as HTTP and HTTPS). The following figure highlights how to provide high availability in this scenario at the NVA level.

![[1]][1]

In this scenario, the network virtual appliance used must terminate all connections, and pass them to the workload subnet. The workload virtual machines (VMs) respond to the NVA they received a request from, and traffic flows without issues. 

## Ingress-egress with layer 7 virtual appliances
You can extend the preceding architecture and add another set of NVAs to handle traffic originating from Azure to be handled by NVAs, as shown in the following figure:

![[2]][2]

In this scenario, all traffic originating in Azure is routed to an internal load balancer that distributes load between a different set of NVAs. These NVAs direct traffic to the Internet using their individual public IP addresses. 

## PIP-UDR switch
You can avoid creating multiple NVA stacks by using two NVAs in active-passive mode. In this scenario, you can switch the public IP address (PIP) and user-defined routes (UDRs) when the active node stops.  

![[3]][3]

This scenario is similar to the single NVA scenario. The only difference is that the PIP and UDRs must be changed to switch traffic between the NVAs. These changes can be done manually, or you can also automate them. To automate, you can deploy an application to both NVAs that checks for the health of the active node. Once the active node is down, your application can change the PIP and UDRs to link to the passive node.

A possible implementation of this solution is to use a [ZooKeeper][zookeeper] daemon on the NVAs to handle leader election (deciding which node is the active node). Once a leader is elected, it calls to the Azure REST API to remove the PIP from the failed node and attach it to the leader. It should also change UDRs to point to the new leader's private IP address.

## Next steps

- Learn how to [implement a DMZ between Azure and your on-premises datacenter][dmz-on-prem] using layer-7 NVAs.
- Learn how to [implement a DMZ between Azure and the Internet][dmz-internet] using layer-7 NVAs.

<!-- links -->
[udr-overview]: ../virtual-network/virtual-networks-udr-overview.md
[lb-overview]: ../load-balancer/load-balancer-overview.md
[zookeeper]: https://zookeeper.apache.org/
[nva-scenario]: ../virtual-network/virtual-network-scenario-udr-gw-nva.md
[dmz-on-prem]: guidance-iaas-ra-secure-vnet-hybrid.md
[dmz-internet]: guidance-iaas-ra-secure-vnet-dmz.md

<!-- images -->
[0]: ./media/guidance-nva-ha/single-nva.png "Single NVA architecture"
[1]: ./media/guidance-nva-ha/l7-ingress.png "Layer 7 ingress"
[2]: ./media/guidance-nva-ha/l7-ingress-egress.png "Layer 7 ingress and egress"
[3]: ./media/guidance-nva-ha/active-passive.png "Active-Passive cluster"