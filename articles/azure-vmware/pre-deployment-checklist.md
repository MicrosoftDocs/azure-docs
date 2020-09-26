---
title: Azure VMware Solution pre-deployment checklist
description: Use this checklist as part of the pre-deployment planning process.
ms.topic: how-to
ms.date: 09/28/2020
ms.author: tredavis 
---

# Azure VMware Solution pre-deployment checklist
You'll use this pre-deployment checklist during the [planning phase](production-ready-deployment-steps.md).

## Success criteria
Define what tests you are going to run and the expected outcome.

#### Fundamental

##### Deploy SDDC

:::image type="content" source="media/blank-space-line.png" alt-text="Blank space for entering information such as an Azure subscription name or ID." border="false":::

##### Create virtual network

:::image type="content" source="media/blank-space-line.png" alt-text="Blank space for entering information such as an Azure subscription name or ID." border="false":::

##### Create jump box

:::image type="content" source="media/blank-space-line.png" alt-text="Blank space for entering information such as an Azure subscription name or ID." border="false":::

##### Create virtual network gateway

:::image type="content" source="media/blank-space-line.png" alt-text="Blank space for entering information such as an Azure subscription name or ID." border="false":::

##### Connect ExpressRoute Global Reach

:::image type="content" source="media/blank-space-line.png" alt-text="Blank space for entering information such as an Azure subscription name or ID." border="false":::

##### Log into NSX Manager and vCenter

:::image type="content" source="media/blank-space-line.png" alt-text="Blank space for entering information such as an Azure subscription name or ID." border="false":::

#### Primary

##### Create DHCP server

:::image type="content" source="media/blank-space-line.png" alt-text="Blank space for entering information such as an Azure subscription name or ID." border="false":::

##### Create network segments 

:::image type="content" source="media/blank-space-line.png" alt-text="Blank space for entering information such as an Azure subscription name or ID." border="false":::

##### Scale (add or delete nodes)

:::image type="content" source="media/blank-space-line.png" alt-text="Blank space for entering information such as an Azure subscription name or ID." border="false":::

##### Deploy VMware HCX

:::image type="content" source="media/blank-space-line.png" alt-text="Blank space for entering information such as an Azure subscription name or ID." border="false":::

##### Create virtual machines (VMs)

:::image type="content" source="media/blank-space-line.png" alt-text="Blank space for entering information such as an Azure subscription name or ID." border="false":::

##### Enable internet 

:::image type="content" source="media/blank-space-line.png" alt-text="Blank space for entering information such as an Azure subscription name or ID." border="false":::

##### VM migration from on-premises to private cloud

:::image type="content" source="media/blank-space-line.png" alt-text="Blank space for entering information such as an Azure subscription name or ID." border="false":::

#### Additional 

##### VM snapshot operations

:::image type="content" source="media/blank-space-line.png" alt-text="Blank space for entering information such as an Azure subscription name or ID." border="false":::

##### Deploy NSX-T load balancer 

:::image type="content" source="media/blank-space-line.png" alt-text="Blank space for entering information such as an Azure subscription name or ID." border="false":::

##### Azure integration

- Shared content library
- Security integration
- Upload ISO
- Build from ISO
- Azure Backup

:::image type="content" source="media/blank-space-line.png" alt-text="Blank space for entering information such as an Azure subscription name or ID." border="false":::

##### Micro segmentation

:::image type="content" source="media/blank-space-line.png" alt-text="Blank space for entering information such as an Azure subscription name or ID." border="false":::

##### Routing 

:::image type="content" source="media/blank-space-line.png" alt-text="Blank space for entering information such as an Azure subscription name or ID." border="false":::

--- 

## Azure VMware Solution information

#### Azure subscription
Provide the subscription name and subscription ID for Azure VMware Solution. The subscription can be new or existing subscription. Do not use a Dev/Test Subscription.

##### Subscription and and ID

:::image type="content" source="media/blank-space-line.png" alt-text="Blank space for entering information such as an Azure subscription name or ID." border="false":::

##### Subscription with an EA

Is the subscription going to be used for Azure VMware Solution assigned to an EA? 
<br>
☐ Yes ☐ No 

#### Resource Group name
Provide the resource group name that you will use for the Azure VMware Solution deployment. The resource group can be new or existing. 

:::image type="content" source="media/blank-space-line.png" alt-text="Blank space for entering information such as an Azure subscription name or ID." border="false":::

#### Location for Azure VMware Solution
Provide the Azure location where you will deploy Azure VMware Solution.
<br>
☒ East US

#### Azure admin
Provide the name and contact of the admin assigned to enable the service from marketplace. Contributor is the minimum role required to [register the Azure VMware Solution resource provider](tutorial-create-private-cloud.md#register-the-resource-provider).

:::image type="content" source="media/blank-space-line.png" alt-text="Blank space for entering information such as an Azure subscription name or ID." border="false":::

---

## On-premises VMware information

#### vSphere version

:::image type="content" source="media/blank-space-line.png" alt-text="Blank space for entering information such as an Azure subscription name or ID." border="false":::

#### vCenter version

:::image type="content" source="media/blank-space-line.png" alt-text="Blank space for entering information such as an Azure subscription name or ID." border="false":::

#### vCenter admin

Provide the person who has admin access to vCenter on-premises.

:::image type="content" source="media/blank-space-line.png" alt-text="Blank space for entering information such as an Azure subscription name or ID." border="false":::

#### L2 extension
If extending L2 networks with VMware HCX, provide the on-premises networks you will extend.

:::image type="content" source="media/blank-space-line.png" alt-text="Blank space for entering information such as an Azure subscription name or ID." border="false":::

#### vSwitch
Provide the type of vSwitch used throughout the environment.
<br>
☐ Standard ☐ Distributed

>[!NOTE]
>If using Standard, then VMware HCX is not available. 

#### DNS and DHCP
A proper DNS and DHCP infrastructure is required.  It is recommended to use the DHCP service built into NSX or use a local DHCP server in the private cloud rather than routing broadcast DHCP traffic over the WAN back to on-premises. For more information, see [How to create and manage DHCP in Azure VMWare Solution](manage-dhcp.md).

:::image type="content" source="media/blank-space-line.png" alt-text="Blank space for entering information such as an Azure subscription name or ID." border="false":::

---  

## Networking - Azure VMware Solution infrastructure 
The data needed is to help you meet the Azure VMware Solution networking needs for stand-up and initial network testing. 

#### Azure VMware Solution CIDR 
Required for vSphere hosts, vSAN, and management networks in Azure VMware Solution. For more information, see [Routing and subnet considerations](tutorial-network-checklist.md#routing-and-subnet-considerations). 

:::image type="content" source="media/blank-space-line.png" alt-text="Blank space for entering information such as an Azure subscription name or ID." border="false":::

#### Azure VMware Solution Workload CIDR (optional)
Assign a network to be used in Azure VMware Solution for initial testing. Virtual machines will be deployed to validate network connectivity from/to Azure VMware Solution.

:::image type="content" source="media/blank-space-line.png" alt-text="Blank space for entering information such as an Azure subscription name or ID." border="false":::

## Networking - connect Azure VMware Solution to Azure Virtual Network
The data needed for after the Azure VMware Solution cluster is stood up it can be connected to Azure via an ExpressRoute circuit, which is part of the Azure VMware Solution service.

#### Jump box – Windows Server

:::image type="content" source="media/blank-space-line.png" alt-text="Blank space for entering information such as an Azure subscription name or ID." border="false":::


#### Create virtual network
For more information, see [Create a virtual network](../virtual-network/quick-create-portal.md). 

:::image type="content" source="media/blank-space-line.png" alt-text="Blank space for entering information such as an Azure subscription name or ID." border="false":::

#### Create gateway subnet
For more information, see [Create the gateway subnet](../expressroute/expressroute-howto-add-gateway-portal-resource-manager.md#create-the-gateway-subnet). 

:::image type="content" source="media/blank-space-line.png" alt-text="Blank space for entering information such as an Azure subscription name or ID." border="false":::

#### Create virtual network gateway
For more information, see [Create the virtual network gateway](../expressroute/expressroute-howto-add-gateway-portal-resource-manager.md#create-the-virtual-network-gateway). 

:::image type="content" source="media/blank-space-line.png" alt-text="Blank space for entering information such as an Azure subscription name or ID." border="false":::

--- 

## Networking - connect Azure VMware Solution to an on-premises datacenter

#### ExpressRoute peering CIDR
The `/29` CIDR address block required.

:::image type="content" source="media/blank-space-line.png" alt-text="Blank space for entering information such as an Azure subscription name or ID." border="false":::

#### ExpressRoute authorization key and resource ID
Provide an authorization key and resource ID, which is generated from the current ExpressRoute circuit that connects to the on-premises datacenter. 

:::image type="content" source="media/blank-space-line.png" alt-text="Blank space for entering information such as an Azure subscription name or ID." border="false":::

#### Direction of default route
Should the virtual machines in Azure VMware Solution access the internet via Azure VMware Solution provided internet, or come back across the ExpressRoute circuit to on-premises for the default route?

:::image type="content" source="media/blank-space-line.png" alt-text="Blank space for entering information such as an Azure subscription name or ID." border="false":::

#### Network ports required to communicate with the service

For more information, see [Required network ports](tutorial-network-checklist.md#required-network-ports). 

:::image type="content" source="media/blank-space-line.png" alt-text="Blank space for entering information such as an Azure subscription name or ID." border="false":::

--- 

## Networking - VMware HCX

#### Network ports
If there is a firewall, make sure the required network ports are opened between on-premises and Azure VMware Solution. 

:::image type="content" source="media/blank-space-line.png" alt-text="Blank space for entering information such as an Azure subscription name or ID." border="false":::

#### DNS 
For information on configuring DNS, see [Networking - Azure VMware Solution infrastructure](#networking---azure-vmware-solution-infrastructure). 

:::image type="content" source="media/blank-space-line.png" alt-text="Blank space for entering information such as an Azure subscription name or ID." border="false":::

#### VMware HCX CIDRs
You require two `/29` CIDR blocks, which are used for the VMware HCX infrastructure components on-premises. 

:::image type="content" source="media/blank-space-line.png" alt-text="Blank space for entering information such as an Azure subscription name or ID." border="false":::