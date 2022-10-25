---
title: Private mobile network design requirements
titleSuffix: Azure Private 5G Core Preview
description: Learn how to design a private mobile network for Azure Private 5G Core Preview.
author: b-branco
ms.author: biancabranco
ms.service: private-5g-core
ms.topic: conceptual 
ms.date: 10/25/2022
ms.custom: template-concept 
---

# Private mobile network design requirements

This article will help you design and implement a private 4G or 5G network, based on Azure Private 5G technology. After reading this document, you should understand how such networks are constructed, the decisions that you will need to make as you plan a network, and where to go for further information. It is intended for system integrators and other advanced partners that have a good understanding of enterprise IP networking and a grounding in Azure fundamentals.

## Azure Private MEC and Azure Private 5G Core

Azure private multi-access edge compute (MEC) is a solution that combines Microsoft compute, networking, and application services onto a deployment at the enterprise premises (edge). These deployments are managed centrally from the cloud. Azure Private 5G Core is an Azure service, within Azure private MEC, that provides 4G and 5G core network functions at the enterprise edge. At the enterprise edge site, devices attach across a cellular radio access network (RAN) and are connected via the Azure Private 5G Core service to upstream networks, applications, and resources. Optionally, devices may exploit the local compute capability provided by Azure private MEC to process data streams at very low latency, all under the control of the enterprise.

<!-- TODO: add image
:::image type="content" source="media/key-components-of-a-private-mobile-network/site-physical-components.png" alt-text="Diagram displaying the components of a private network solution. UEs, RANs and sites are at the edge, while Azure region management is in the cloud."::: -->

## Elements of a private 5G network

In order that a user’s device or equipment (‘UE’) can attach to a private cellular network, the following capabilities must be present:

- The UE must be compatible with the protocol being spoken, and the wireless spectrum band used, by the radio access network (RAN).
- The UE must have an identity on the network. In cellular networks this means the device contains a subscriber identity module (SIM), a cryptographic element, that stores the identity of the device.
- There must be a RAN, sending and receiving the cellular signal, to all parts of the enterprise site that contain UEs needing service.
- A packet core (Azure Private 5G Core) is required, connected to the RAN and to an upstream network. The packet core is responsible for authenticating the UEs (SIMs) as they connect across the RAN and request service from the network. It applies policy to the resulting data flows to and from the UEs, for example to set a quality of service.
- The RAN, packet core, and upstream network infrastructure must be connected (Ethernet), so that they can pass IP traffic to one another.

## Implementing a private 5G network

Your design choices around the private 5G network will directly affect your implementation.

1. You may have existing IP networks at the enterprise site that the private cellular network will have to integrate with. This might mean, for example,

- selecting IP subnets and IP addresses for the Azure Private 5G Core that match existing subnets without clashing addresses
- segregating the new network via IP routers or using private RFC1918 address space for subnets
- assigning a special pool of IP addresses specifically for use by UEs when they attach to the network
- using network address and port translation (NAPT), either on the packet core itself, or on an upstream network device such as a border router
- optimizing the network for performance, by choosing an MTU that minimizes fragmentation.

**What you need to do**

Document the IP subnets (IPv4) that will be used for the deployment with the enterprise, agreeing the IP addresses to use for each element in the solution, as well as the addresses that will be allocated to UEs when they attach. Plan to deploy (or configure existing) routers and firewalls at the enterprise site to permit traffic. You should also agree how and where in the network any NAPT or MTU changes are required and plan the associated router/firewall configuration. For additional information, refer to: [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md).

2. Your design must reflect the enterprise’s rules on what networks and assets should be reachable by the RAN and UEs on the private 5G network. For example, they might be permitted to access local DNS/DHCP, the Internet, or Azure, but not a factory operations LAN. Conversely, as the system integrator, you may need to arrange for remote access to the network so that you can troubleshoot issues without requiring a site visit. You also need to consider how the enterprise site will be connected to upstream networks such as Azure, for management and/or for access to other resources and applications outside of the enterprise site.

**What you need to do**

Confirm the IP subnets and addresses that will be allowed to communicate with each other with the enterprise team. Then, create a routing plan and/or ACL configuration that implements this plan on the local IP infrastructure. You may also use VLANs to partition elements at layer 2 (although the Azure Private 5G Core does not tag VLAN traffic itself). As the system integrator, you may also agree with the enterprise to set up an access mechanism, such as a VPN, that allows your support personnel to remotely connect to the management interface of each element in the solution. In any case you will need an IP link between Azure Private 5G Core and Azure for management and telemetry.

3. The RAN that you select to broadcast the signal across the enterprise site must comply with local regulations, which could mean, for example:

- The RAN units have completed the process of homologation and received regulatory approval for their use on a certain frequency band in a country.
- You have received permission for the RAN to broadcast using spectrum in a certain location, for example, by grant from a telecom operator, regulatory authority or via a technological solution such as a Spectrum Access System.
- The RAN units in a site have access to high-precision timing sources, such as PTP, and GPS location services.

**What you need to do**

Ask your RAN partner for the countries and frequency bands they are approved for use in. You may find that you will need to use multiple RAN partners to cover the countries in which you provide your solution. Although RAN, UE and packet core all speak standard protocols, Microsoft recommends that you perform interoperability testing for the specific 4G LTE or 5G SA protocol between Azure Private 5G Core, UEs and the RAN prior to any deployment at an enterprise customer.

Your RAN will transmit an identifier, known as a PLMN ID, to all UEs, on the frequency band it is configured to use. You should define the PLMN ID and confirm your access to spectrum. In some countries spectrum must be obtained from the national regulator, or incumbent telco operator. In the United States, you may be using CBRS (band n48) spectrum, in which case you may need to work with your RAN partner to deploy a SAS domain proxy on the enterprise site so that the RAN can continuously check that it is authorized to broadcast.

4. The UEs must be able to communicate with the RAN, from any location at the site. This means that the signals must propagate effectively in the environment, including accounting for obstructions and equipment, to support UEs moving around the site, for example between indoor and outdoor areas.

**What you need to do**

Perform a site survey with your RAN partner and the enterprise to make sure that the coverage is adequate. Make sure that you understand the RAN units’ capabilities in different environments (e.g., outdoors) and any limits, e.g., on the number of attached UEs that a single unit can support. If your UEs are going to move around the site, you should also confirm that the RAN supports X2 (4G) or Xn (5G) handover, which allows for the UE to transition seamlessly between the coverage provided by two RAN units. However, note that UEs cannot use these handover techniques to roam between a private enterprise network and the public cellular network offered by a telco operator.

5. Every UE must present an identity to the network, encoded in a subscriber identify module, or ‘SIM’. SIMs are available in different physical form factors as well as in software-only format (‘eSIM’). The data encoded on the SIM must match the configuration of the RAN and of the provisioned identity data in the Azure Private 5G Core.

**What you need to do**

Obtain SIMs in factors compatible with the UEs and programmed with the PLMN ID and keys that you want to use for the deployment. Physical SIMs are widely available on the open market at relatively low cost; if you prefer to use eSIMs, you will need to deploy the necessary eSIM configuration and provisioning infrastructure so that UEs can configure themselves before they attach to the cellular network. Use the provisioning data you receive from your SIM partner to provision matching entries in Azure Private 5G Core. Because SIM data must be kept secure, the cryptographic keys used to provision SIMs are not readable in Azure Private 5G Core once set, so consider how you might store them in case you ever need to re-provision the data in Azure Private 5G Core.

6. As a system integrator, being able to build enterprise networks using automation and other programmatic techniques saves time, reduces errors, and produces better customer outcomes. Such techniques also provide a recovery path in the event of a site failure that necessitates rebuilding the network.

**What you need to do**

Consider adopting a programmatic, “infrastructure as code” approach to your deployments. Use templates or the Azure REST API to build your deployment using parameters as inputs with values that you have collected during the design phase of the project. Save provisioning information such as SIM data, switch/router configuration, and network policies in machine-readable format so that in the event of a failure, you can re-apply the configuration in the same way as you originally did. You may also wish to deploy a spare Azure Stack Edge server to minimize recovery time if the first unit fails. For additional information, refer to: [Quickstart: Deploy a private mobile network and site - ARM template](deploy-private-mobile-network-with-site-arm-template.md).

You must also consider how you will integrate other Azure products and services with the private enterprise network. Notable among these are Azure Active Directory and Role-Based Access Control (RBAC), where you must consider how tenants, subscriptions and resource permissions will align with the business model that exists between you and the enterprise and your own approach to customer system management. You might use, for example, Azure Blueprints to set up the subscriptions and resource group model that works best for your organization.

## Next steps

- [Learn more about the key components of a private mobile network](key-components-of-a-private-mobile-network.md)
- [Learn more about the prerequisites for deploying a private mobile network](complete-private-mobile-network-prerequisites.md)
