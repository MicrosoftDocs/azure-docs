---
title: Collect information for a site
titlesuffix: Azure Private 5G Core Preview
description: Learn about the information you'll need to create a site in an existing private mobile network using the Azure portal.
author: djrmetaswitch
ms.author: drichards
ms.service: private-5g-core
ms.topic: how-to 
ms.date: 02/07/2022
ms.custom: template-how-to
---

# Collect the required information for a site

Azure Private 5G Core private mobile networks include one or more sites. Each site represents a physical enterprise location (for example, Contoso Corporation's Chicago factory) containing an Azure Stack Edge device that hosts a packet core instance. This how-to guide takes you through the process of collecting the information you'll need to create a new site. You'll use this information to complete the steps in [Create a site](create-an-additional-site.md).

## Prerequisites

You must have completed all of the steps in [Allocate subnets and IP addresses](complete-private-mobile-network-prerequisites.md#allocate-subnets-and-ip-addresses) and [Order and set up your Azure Stack Edge Pro device(s)](complete-private-mobile-network-prerequisites.md#order-and-set-up-your-azure-stack-edge-pro-devices) for your new site.

## Collect site resource values

Collect all the values in the following table for the site you want to create.

   |Value  |Field name in Azure portal  |
   |---------|---------|
   |The Azure subscription to use to create the site resource. You must use the same subscription for all resources in your private mobile network deployment.                  |**Project details: Subscription**|
   |The Azure resource group in which to create the site resource. We recommend that you use the same resource group that already contains your private mobile network.                |**Project details: Resource group**|
   |The name for the site.           |**Instance details: Name**|
   |The region in which you’re creating the site. We recommend that you use the East US region.                         |**Instance details: Region**|
   |The private mobile network resource representing the network to which you’re adding the site. |**Instance details: Mobile network**|

## Collect custom location information

Collect the name of the custom location that targets the Azure Kubernetes Service on Azure Stack HCI (AKS-HCI) cluster on the Azure Stack Edge Pro device in the site. You commissioned the AKS-HCI cluster as part of the steps in [Order and set up your Azure Stack Edge Pro device(s)](complete-private-mobile-network-prerequisites.md#order-and-set-up-your-azure-stack-edge-pro-devices).


## Collect access network values

Collect all the values in the following table to define the packet core instance's connection to the access network over the N2 and N3 interfaces.

> [!IMPORTANT]
> Where noted, you must use the same values you used when deploying the Azure Kubernetes Service on Azure Stack HCI (AKS-HCI) cluster on the Azure Stack Edge Pro device for this site. You did this as part of the steps in [Order and set up your Azure Stack Edge Pro device(s)](complete-private-mobile-network-prerequisites.md#order-and-set-up-your-azure-stack-edge-pro-devices).

   |Value  |Field name in Azure portal  |
   |---------|---------|
   |<p>The IP address for the packet core instance N2 signaling interface.</p><p>You identified this in [Allocate subnets and IP addresses](complete-private-mobile-network-prerequisites.md#allocate-subnets-and-ip-addresses) and it must match the value you used when deploying the AKS-HCI cluster.</p>                 |**N2 address (signaling)**
   |<p>The IP address for the packet core instance N3 interface.</p><p>You identified this in [Allocate subnets and IP addresses](complete-private-mobile-network-prerequisites.md#allocate-subnets-and-ip-addresses) and it must match the value you used when deploying the AKS-HCI cluster.</p>                |**N3 address**|
   |<p>The network address of the access subnet in Classless Inter-Domain Routing (CIDR) notation.</p><p>You identified this in [Allocate subnets and IP addresses](complete-private-mobile-network-prerequisites.md#allocate-subnets-and-ip-addresses) and it must match the value you used when deploying the AKS-HCI cluster.</p>          |**N2 subnet** and **N3 subnet**|
   |<p>The access subnet default gateway.</p><p>You identified this in [Allocate subnets and IP addresses](complete-private-mobile-network-prerequisites.md#allocate-subnets-and-ip-addresses) and it must match the value you used when deploying the AKS-HCI cluster.</p>                        |**N2 gateway** and **N3 gateway**|
   |The Tracking Area Codes the packet core instance must support, given as a comma-separated list. For example, *0001,0002*.    |**Tracking area codes**|

## Collect data network values

Collect all the values in the following table to define the packet core instance's connection to the data network over the N6 interface.

> [!IMPORTANT]
> Where noted, you must use the same values you used when deploying the AKS-HCI cluster on your Azure Stack Edge Pro device. You did this as part of the steps in [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md).

   |Value  |Field name in Azure portal  |
   |---------|---------|
   |The name of the data network.                  |**Data network**|
   |<p>The IP address for the packet core instance N6 interface.</p><p>You identified this in [Allocate subnets and IP addresses](complete-private-mobile-network-prerequisites.md#allocate-subnets-and-ip-addresses) and it must match the value you used when deploying the AKS-HCI cluster.</p>                      |**N6 address**|
   |<p>The network address of the data subnet in CIDR notation.</p><p>You identified this in [Allocate subnets and IP addresses](complete-private-mobile-network-prerequisites.md#allocate-subnets-and-ip-addresses) and it must match the value you used when deploying the AKS-HCI cluster.</p>                  |**N6 subnet**|
   |<p>The data subnet default gateway.</p><p>You identified this in [Allocate subnets and IP addresses](complete-private-mobile-network-prerequisites.md#allocate-subnets-and-ip-addresses) and it must match the value you used when deploying the AKS-HCI cluster.</p>                                |**N6 gateway**|
   |<p>The network address of the subnet from which IP addresses must be allocated to User Equipment (UEs), given in CIDR notation. You identified this in [Allocate subnets and IP addresses](complete-private-mobile-network-prerequisites.md#allocate-subnets-and-ip-addresses).</p><p> The following example shows the network address format.</p><p>`198.51.100.0/24`</p><p>Note that the UE subnets aren't related to the access subnet.</p>    |**UE IP subnet**|
   |Whether Network Address and Port Translation (NAPT) should be enabled for this data network. NAPT allows you to translate a large pool of private IP addresses for UEs to a small number of public IP addresses. The translation is performed at the point where traffic enters the core network, maximizing the utility of a limited supply of public IP addresses.    |**NAPT**|

## Next steps

You can now use the information you've collected to create the site.

- [Create a site](create-an-additional-site.md)