---
title: Azure VMware Solution pre-deployment checklist
description: Use this checklist as part of the pre-deployment planning process.
ms.topic: how-to
ms.date: 10/02/2020
---

# Azure VMware Solution pre-deployment checklist
You'll use this pre-deployment checklist during the [planning phase](production-ready-deployment-steps.md).

## Success criteria
Define what tests you are going to run and the expected outcome.

| Fundamental information needed | Your response |
| ----------- | ------------- |
| Deploy SDDC | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |
| Create virtual network | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |
| Create jump box | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |
| Create virtual network gateway | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |
| Connect ExpressRoute Global Reach | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | 
| Log into NSX Manager and vCenter | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |



| Primary information needed | Your response |
| --------| --------------|
| Create DHCP server | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |
| Create network segments | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |
| Scale (add or delete nodes) | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |
| Deploy VMware HCX | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |
| Create virtual machines (VMs) | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
| Enable internet | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |
| VM migration from on-premises to private cloud | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |



| Additional information needed | Your response |
| --------| --------------|
| VM snapshot operations | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | 
| Deploy NSX-T load balancer | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |
| Azure integration<br><ul><li>Shared content library</li><li>Security integration</li><li>Upload ISO</li><li>Build from ISO</li><li>Azure Backup</li></ul> | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |
| Micro segmentation | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |
| Routing | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |




## Azure VMware Solution information

#### Azure subscription
Provide the subscription name and subscription ID for Azure VMware Solution. The subscription can be new or existing subscription. Do not use a Dev/Test Subscription.

| Information needed  | Your response |
| ------------| ------------- |
| Subscription and ID | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |
| Subscription with an EA | ☐ Yes &nbsp;&nbsp;☐ No  |
| Resource Group name | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |
| Location | ☒ East US |
| Azure admin<br><br>Provide the name and contact of the admin<br>assigned to enable the service from marketplace.<br>Contributor is the minimum role required to <br>[register the Azure VMware Solution resource provider](tutorial-create-private-cloud.md#register-the-resource-provider). | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |



## On-premises VMware information

| Information needed  | Your response |
| ------------| --------------|
| vSphere version | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |
| vCenter version | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | 
| vCenter admin | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |
| L2 extension<br><br>If extending L2 networks with VMware HCX,<br>provide the on-premises network you will extend. | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | 
| vSwitch<br><br>Provide the type of vSwitch used throughout the environment. | ☐ Standard &nbsp;&nbsp;☐ Distributed<br><br>If using Standard, then VMware HCX is not available. |
| DNS and DHCP<br><br>A proper DNS and DHCP infrastructure is required. <br>It is recommended to use the DHCP service built into <br>NSX or use a local DHCP server in the private cloud <br>rather than routing broadcast DHCP traffic over the <br>WAN back to on-premises. For more information, <br>see [How to create and manage DHCP in Azure VMWare Solution](manage-dhcp.md). | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |


 

## Networking - Azure VMware Solution infrastructure 
The data needed is to help you meet the Azure VMware Solution networking needs for stand-up and initial network testing. 

| Information needed | Your response |
| ----------- | ------------- |
|Azure VMware Solution CIDR<br><br>Required for vSphere hosts, vSAN, and management <br>networks in Azure VMware Solution. For more <br>information, see [Routing and subnet considerations](tutorial-network-checklist.md#routing-and-subnet-considerations). | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |
| Azure VMware Solution workload CIDR (optional)<br><br>Assign a network to be used in Azure VMware<br>Solution for initial testing. Virtual machines<br>will be deployed to validate network connectivity <br>from/to Azure VMware Solution. | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |



## Networking - connect Azure VMware Solution to Azure Virtual Network
The data needed for after the Azure VMware Solution cluster is stood up it can be connected to Azure via an ExpressRoute circuit, which is part of the Azure VMware Solution service.

| Information needed | Your response |
| ------------------ | ------------- |
| Jump box - Windows Server | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |
| Create virtual network | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |
| Create gateway subnet | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |
| Create virtual network gateway<br><br>For more information, see [Create the virtual network gateway](../expressroute/expressroute-howto-add-gateway-portal-resource-manager.md#create-the-virtual-network-gateway). | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |


 

## Networking - connect Azure VMware Solution to an on-premises datacenter

| Information needed | Your response |
| ------------------ | ------------- |
| ExpressRoute peering CIDR<br><br>The `/29` CIDR address block. | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |
| ExpressRoute authorization key and resource ID<br><br>Provide an authorization key and resource ID, <br>which is generated from the current ExpressRoute <br>circuit that connects to the on-premises datacenter.  | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |
| Direction of default route<br><br>Should the virtual machines in Azure VMware Solution <br>access the internet via Azure VMware Solution provided <br>internet, or come back across the ExpressRoute circuit to <br>on-premises for the default route? | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |
| Network ports required to communicate with the service<br><br>For more information, see [Required network ports](tutorial-network-checklist.md#required-network-ports). | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |



## Networking - VMware HCX

| Information needed | Your response |
| ------------------ | ------------- |
| Network ports<br><br>If there is a firewall, make sure the required network ports <br>are opened between on-premises and Azure VMware Solution. | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |
| DNS<br><br>For information on configuring DNS, <br>see [Networking - Azure VMware Solution infrastructure](#networking---azure-vmware-solution-infrastructure). | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |
| VMware HCX CIDRs<br><br>You require two `/29` CIDR blocks, which are used for <br>the VMware HCX infrastructure components on-premises.  | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |

