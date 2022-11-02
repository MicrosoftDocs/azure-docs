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

This article will help you design and prepare for implementing a private 4G or 5G network based on the Azure Private 5G technology. It aims to provide an understanding of how these networks are constructed and the decisions that you'll need to make as you plan your network. It is intended for system integrators and other advanced partners that have a good understanding of enterprise IP networking and a grounding in Azure fundamentals.

## Azure Private MEC and Azure Private 5G Core

[Azure private multi-access edge compute (MEC)](../private-multi-access-edge-compute-mec/overview.md) is a solution that combines Microsoft compute, networking, and application services onto a deployment at the enterprise premises (edge). These deployments are managed centrally from the cloud. Azure Private 5G Core is an Azure service within Azure private MEC that provides 4G and 5G core network functions at the enterprise edge. At the enterprise edge site, devices attach across a cellular radio access network (RAN) and are connected via the Azure Private 5G Core service to upstream networks, applications, and resources. Optionally, devices may leverage the local compute capability provided by Azure private MEC to process data streams at very low latency, all under the control of the enterprise.

:::image type="content" source="media/private-5g-elements.png" alt-text="Diagram displaying the components of a private network solution. UEs, RANs and sites are at the edge, while Azure region management is in the cloud.":::

## Requirements for a private mobile network

The following capabilities must be present to allow user equipment (UEs) to attach to a private cellular network:

- The UE must be compatible with the protocol and the wireless spectrum band used by the radio access network (RAN).
- The UE must contain a subscriber identity module (SIM). This is a cryptographic element that stores the identity of the device.
- There must be a RAN, sending and receiving the cellular signal, to all parts of the enterprise site that contain UEs needing service.
- A packet core instance connected to the RAN and to an upstream network is required. The packet core is responsible for authenticating the UE's SIMs as they connect across the RAN and request service from the network. It applies policy to the resulting data flows to and from the UEs, for example, to set a quality of service.
- The RAN, packet core, and upstream network infrastructure must be connected via Ethernet so that they can pass IP traffic to one another.

## Designing a private mobile network

The following sections describe elements of the network you'll need to consider and the design decisions you'll need to make in preparation for deploying the network.

### Subnets and IP addresses

You may have existing IP networks at the enterprise site that the private cellular network will have to integrate with. This might mean, for example:

- Selecting IP subnets and IP addresses for the Azure Private 5G Core that match existing subnets without clashing addresses.
- Segregating the new network via IP routers or using the private RFC1918 address space for subnets.
- Assigning a special pool of IP addresses specifically for use by UEs when they attach to the network.
- Using network address and port translation (NAPT), either on the packet core itself, or on an upstream network device such as a border router.
- Optimizing the network for performance by choosing a maximum transmission unit (MTU) that minimizes fragmentation.

You'll need to document the IPv4 subnets that will be used for the deployment and agree on the IP addresses to use for each element in the solution, as well as on the IP addresses that will be allocated to UEs when they attach. You'll need to deploy (or configure existing) routers and firewalls at the enterprise site to permit traffic. You should also agree how and where in the network any NAPT or MTU changes are required and plan the associated router/firewall configuration. For more information, see [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md).

### Network access

Your design must reflect the enterprise’s rules on what networks and assets should be reachable by the RAN and UEs on the private 5G network. For example, they might be permitted to access local Domain Name System (DNS), Dynamic Host Configuration Protocol (DHCP), the internet, or Azure, but not a factory operations local area network (LAN). You may need to arrange for remote access to the network so that you can troubleshoot issues without requiring a site visit. You also need to consider how the enterprise site will be connected to upstream networks such as Azure, for management and/or for access to other resources and applications outside of the enterprise site.

You'll need to agree with the enterprise team which IP subnets and addresses will be allowed to communicate with each other. Then, create a routing plan and/or access control list (ACL) configuration that implements this agreement on the local IP infrastructure. You may also use virtual local area networks (VLANs) to partition elements at layer 2, configuring your switch fabric to assign connected ports to specific VLANs (for example, to put the Azure Stack Edge port used for RAN access into the same VLAN as the RAN units connected to the Ethernet switch). You should also agree with the enterprise to set up an access mechanism, such as a virtual private network (VPN), that allows your support personnel to remotely connect to the management interface of each element in the solution. You'll also need an IP link between Azure Private 5G Core and Azure for management and telemetry.

### RAN compliance

The RAN that you'll use to broadcast the signal across the enterprise site must comply with local regulations. For example, this could mean:

- The RAN units have completed the process of homologation and received regulatory approval for their use on a certain frequency band in a country.
- You have received permission for the RAN to broadcast using spectrum in a certain location, for example, by grant from a telecom operator, regulatory authority or via a technological solution such as a Spectrum Access System (SAS).
- The RAN units in a site have access to high-precision timing sources, such as Precision Time Protocol (PTP) and GPS location services.

You should ask your RAN partner for the countries and frequency bands for which the RAN is approved. You may find that you'll need to use multiple RAN partners to cover the countries in which you provide your solution. Although the RAN, UE and packet core all communicate using standard protocols, Microsoft recommends that you perform interoperability testing for the specific 4G Long-Term Evolution (LTE) or 5G standalone (SA) protocol between Azure Private 5G Core, UEs and the RAN prior to any deployment at an enterprise customer.

Your RAN will transmit a Public Land Mobile Network Identity (PLMN ID) to all UEs on the frequency band it is configured to use. You should define the PLMN ID and confirm your access to spectrum. In some countries, spectrum must be obtained from the national regulator or incumbent telecommunications operator. For example, if you're using the band 48 Citizens Broadband Radio Service (CBRS) spectrum, you may need to work with your RAN partner to deploy a Spectrum Access System (SAS) domain proxy on the enterprise site so that the RAN can continuously check that it is authorized to broadcast.

#### Maximum Transmission Units (MTUs)

The Maximum Transmission Unit (MTU) is a property of an IP link, and it is configured on the interfaces at each end of the link. Packets that exceed an interface's configured MTU are split into smaller packets via IPv4 fragmentation prior to sending and are then reassembled at their destination. However, if an interface's configured MTU is higher than the link's supported MTU, the packet will fail to be transmitted correctly.

To avoid transmission issues caused by IPv4 fragmentation, a 4G or 5G packet core instructs UEs what MTU they should use. However, UEs do not always respect the MTU signalled by the packet core.

IP packets from UEs are tunnelled through from the RAN, which adds overhead from encapsulation. Due to this, the MTU value for the UE should be smaller than the MTU value used between the RAN and the Packet Core to avoid transmission issues.

RANs typically come pre-configured with an MTU of 1500. The Packet Core’s default UE MTU is 1300 bytes to allow for encapsulation overhead. These values maximize RAN interoperability, but risk that certain UEs will not observe the default MTU and will generate larger packets that require IPv4 fragmentation that may be dropped by the network.

If you are affected by this issue, it is strongly recommended to configure the RAN to use an MTU of 1560 or higher which allows a sufficient overhead for the encapsulation and avoids fragmentation with a UE using a standard MTU of 1500.

### Signal coverage

The UEs must be able to communicate with the RAN from any location at the site. This means that the signals must propagate effectively in the environment, including accounting for obstructions and equipment, to support UEs moving around the site (for example, between indoor and outdoor areas).

You should perform a site survey with your RAN partner and the enterprise to make sure that the coverage is adequate. Make sure that you understand the RAN units’ capabilities in different environments and any limits (for example, on the number of attached UEs that a single unit can support). If your UEs are going to move around the site, you should also confirm that the RAN supports X2 (4G) or Xn (5G) handover, which allows for the UE to transition seamlessly between the coverage provided by two RAN units. Note that UEs cannot use these handover techniques to roam between a private enterprise network and the public cellular network offered by a telecommunications operator.

### SIMs

Every UE must present an identity to the network, encoded in a subscriber identity module (SIM). SIMs are available in different physical form factors as well as in software-only format (eSIM). The data encoded on the SIM must match the configuration of the RAN and of the provisioned identity data in the Azure Private 5G Core.

Obtain SIMs in factors compatible with the UEs and programmed with the PLMN ID and keys that you want to use for the deployment. Physical SIMs are widely available on the open market at relatively low cost. If you prefer to use eSIMs, you'll need to deploy the necessary eSIM configuration and provisioning infrastructure so that UEs can configure themselves before they attach to the cellular network. You can use the provisioning data you receive from your SIM partner to provision matching entries in Azure Private 5G Core. Because SIM data must be kept secure, the cryptographic keys used to provision SIMs are not readable in Azure Private 5G Core once set, so you must consider how you'll store them in case you ever need to reprovision the data in Azure Private 5G Core.

### Automation and integration

Being able to build enterprise networks using automation and other programmatic techniques saves time, reduces errors, and produces better customer outcomes. Such techniques also provide a recovery path in the event of a site failure that requires rebuilding the network.

You should adopt a programmatic, *infrastructure as code* approach to your deployments. You can use templates or the Azure REST API to build your deployment using parameters as inputs with values that you have collected during the design phase of the project. You should save provisioning information such as SIM data, switch/router configuration, and network policies in machine-readable format so that, in the event of a failure, you can reapply the configuration in the same way as you originally did. Another best practice to recover from failure is to deploy a spare Azure Stack Edge server to minimize recovery time if the first unit fails; you can then use your saved templates and inputs to quickly recreate the deployment. For more information on deploying a network using templates, refer to [Quickstart: Deploy a private mobile network and site - ARM template](deploy-private-mobile-network-with-site-arm-template.md).

You must also consider how you'll integrate other Azure products and services with the private enterprise network. These products include [Azure Active Directory](/azure/active-directory/fundamentals/active-directory-whatis) and [role-based access control (RBAC)](/azure/role-based-access-control/overview), where you must consider how tenants, subscriptions and resource permissions will align with the business model that exists between you and the enterprise, as well as your own approach to customer system management. For example, you might use [Azure Blueprints](/azure/governance/blueprints/overview) to set up the subscriptions and resource group model that works best for your organization.

## Next steps

- [Learn more about the key components of a private mobile network](key-components-of-a-private-mobile-network.md)
- [Learn more about the prerequisites for deploying a private mobile network](complete-private-mobile-network-prerequisites.md)
