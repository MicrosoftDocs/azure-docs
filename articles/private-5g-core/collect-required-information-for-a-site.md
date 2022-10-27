---
title: Collect information for a site
titleSuffix: Azure Private 5G Core Preview
description: Learn about the information you'll need to create a site in an existing private mobile network.
author: djrmetaswitch
ms.author: drichards
ms.service: private-5g-core
ms.topic: how-to 
ms.date: 02/07/2022
ms.custom: template-how-to
---

# Collect the required information for a site

Azure Private 5G Core Preview private mobile networks include one or more sites. Each site represents a physical enterprise location (for example, Contoso Corporation's Chicago factory) containing an Azure Stack Edge device that hosts a packet core instance. This how-to guide takes you through the process of collecting the information you'll need to create a new site. 

You can use this information to create a site in an existing private mobile network using the [Azure portal](create-a-site.md). You can also use it as part of an ARM template to [deploy a new private mobile network and site](deploy-private-mobile-network-with-site-arm-template.md), or [add a new site to an existing private mobile network](create-site-arm-template.md).

## Prerequisites

You must have completed the steps in [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md).

## Collect mobile network site resource values

Collect all the values in the following table for the mobile network site resource that will represent your site.

   |Value  |Field name in Azure portal  |
   |---------|---------|
   |The Azure subscription to use to create the mobile network site resource. You must use the same subscription for all resources in your private mobile network deployment.                  |**Project details: Subscription**|
   |The Azure resource group in which to create the mobile network site resource. We recommend that you use the same resource group that already contains your private mobile network.                |**Project details: Resource group**|
   |The name for the site.           |**Instance details: Name**|
   |The region in which you’re creating the mobile network site resource. We recommend that you use the East US region.                         |**Instance details: Region**|
   |The mobile network resource representing the private mobile network to which you’re adding the site. |**Instance details: Mobile network**|
   |The billing plan for the site that you are creating. The available plans have the following allowances:</br></br> G1 - 1 Gbps per site and 100 devices per network. </br> G2 - 2 Gbps per site and 200 devices per network. </br> G3 - 3 Gbps per site and 300 devices per network. </br> G4 - 4 Gbps per site and 400 devices per network. </br> G5 - 5 Gbps per site and 500 devices per network.|**Instance details: Site plan**|

## Collect packet core configuration values

Collect all the values in the following table for the packet core instance that will run in the site.

   |Value  |Field name in Azure portal  |
   |---------|---------|
   |The core technology type the packet core instance should support (5G or 4G). |**Technology type**|
   | The Azure Stack Edge resource representing the Azure Stack Edge Pro device in the site. You created this resource as part of the steps in [Order and set up your Azure Stack Edge Pro device(s)](complete-private-mobile-network-prerequisites.md#order-and-set-up-your-azure-stack-edge-pro-devices).</br></br> If you're going to create your site using the Azure portal, collect the name of the Azure Stack Edge resource.</br></br> If you're going to create your site using an ARM template, collect the full resource ID of the Azure Stack Edge resource. You can do this by navigating to the Azure Stack Edge resource, selecting **JSON View** and copying the contents of the **Resource ID** field. | **Azure Stack Edge device** |
   |The custom location that targets the Azure Kubernetes Service on Azure Stack HCI (AKS-HCI) cluster on the Azure Stack Edge Pro device in the site. You commissioned the AKS-HCI cluster as part of the steps in [Order and set up your Azure Stack Edge Pro device(s)](complete-private-mobile-network-prerequisites.md#order-and-set-up-your-azure-stack-edge-pro-devices).</br></br> If you're going to create your site using the Azure portal, collect the name of the custom location.</br></br> If you're going to create your site using an ARM template, collect the full resource ID of the custom location. You can do this by navigating to the Custom location resource, selecting **JSON View** and copying the contents of the **Resource ID** field.|**Custom location**|

## Collect access network values

Collect all the values in the following table to define the packet core instance's connection to the access network over the control plane and user plane interfaces. The field name displayed in the Azure portal will depend on the value you have chosen for **Technology type**, as described in [Collect packet core configuration values](#collect-packet-core-configuration-values).

   |Value  |Field name in Azure portal  |
   |---------|---------|
   | The IP address for the control plane interface on the access network. For 5G, this interface is the N2 interface; for 4G, it's the S1-MME interface. You identified this address in [Allocate subnets and IP addresses](complete-private-mobile-network-prerequisites.md#allocate-subnets-and-ip-addresses). </br></br> This IP address must match the value you used when deploying the AKS-HCI cluster on your Azure Stack Edge Pro device. You did this as part of the steps in [Order and set up your Azure Stack Edge Pro device(s)](complete-private-mobile-network-prerequisites.md#order-and-set-up-your-azure-stack-edge-pro-devices). |**N2 address (Signaling)** (for 5G) or **S1-MME address** (for 4G). |
   | The virtual network name on port 5 on your Azure Stack Edge Pro device corresponding to the control plane interface on the access network. For 5G, this interface is the N2 interface; for 4G, it's the S1-MME interface. | **ASE N2 virtual subnet** (for 5G) or **ASE S1-MME virtual subnet** (for 4G). |
   | The virtual network name on port 5 on your Azure Stack Edge Pro device corresponding to the user plane interface on the access network. For 5G, this interface is the N3 interface; for 4G, it's the S1-U interface. | **ASE N3 virtual subnet** (for 5G) or **ASE S1-U virtual subnet** (for 4G). |

## Collect data network values

Collect all the values in the following table to define the packet core instance's connection to the data network over the user plane interface.

   |Value  |Field name in Azure portal  |
   |---------|---------|
   | The name of the data network.                  |**Data network name**|
   | The virtual network name on port 6 on your Azure Stack Edge Pro device corresponding to the user plane interface on the data network. For 5G, this interface is the N6 interface; for 4G, it's the SGi interface. | **ASE N6 virtual subnet** (for 5G) or **ASE SGi virtual subnet** (for 4G). |
   | The network address of the subnet from which dynamic IP addresses must be allocated to user equipment (UEs), given in CIDR notation. You won't need this address if you don't want to support dynamic IP address allocation for this site. You identified this in [Allocate user equipment (UE) IP address pools](complete-private-mobile-network-prerequisites.md#allocate-user-equipment-ue-ip-address-pools). The following example shows the network address format. </br></br>`198.51.100.0/24` </br></br>Note that the UE subnets aren't related to the access subnet.    |**Dynamic UE IP pool prefixes**|
   | The network address of the subnet from which static IP addresses must be allocated to user equipment (UEs), given in CIDR notation. You won't need this address if you don't want to support static IP address allocation for this site. You identified this in [Allocate user equipment (UE) IP address pools](complete-private-mobile-network-prerequisites.md#allocate-user-equipment-ue-ip-address-pools). The following example shows the network address format. </br></br>`198.51.100.0/24` </br></br>Note that the UE subnets aren't related to the access subnet.    |**Static UE IP pool prefixes**|
   | The Domain Name System (DNS) server addresses to be provided to the UEs connected to this data network. You identified this in [Allocate subnets and IP addresses](complete-private-mobile-network-prerequisites.md#allocate-subnets-and-ip-addresses). </br></br>This value may be an empty list if you don't want to configure a DNS server for the data network. In this case, UEs in this data network will be unable to resolve domain names. | **DNS Addresses** |
   |Whether Network Address and Port Translation (NAPT) should be enabled for this data network. NAPT allows you to translate a large pool of private IP addresses for UEs to a small number of public IP addresses. The translation is performed at the point where traffic enters the data network, maximizing the utility of a limited supply of public IP addresses.</br></br>If you want to use [UE-to-UE traffic](private-5g-core-overview.md#ue-to-ue-traffic) in this data network, keep NAPT disabled.  |**NAPT**|

## Next steps

You can now use the information you've collected to create the site.

- [Create a site - Azure portal](create-a-site.md)
- [Create a site - ARM template](create-site-arm-template.md)