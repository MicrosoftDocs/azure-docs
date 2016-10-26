<properties
   pageTitle="Protecting the cloud boundary in Azure | Microsoft Azure"
   description="Explains and compares the different methods available for protecting applications and components running in Azure as part of a hybrid system from unauthorized intrusion."
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
   ms.date="10/26/2016"
   ms.author="telmosampaio"/>
   
# Protecting the Cloud Boundary in Azure

Hybrid systems comprise elements running on-premises and in the cloud. You can connect the on-premises network to a VNet in the cloud by using an Azure VPN gateway. The network boundary between these two environments can expose areas of weakness in terms of security, and it is necessary to protect this boundary to block unauthorized requests. Cloud applications that are exposed to the public Internet require similar protection.

This article describes some common options for meeting the challenges posed by these scenarios.

## Using a DMZ between Azure and on-premises datacenters

You can create a DMZ (also known as a *perimeter network*) to filter traffic that crosses the cloud boundary as it attempts to access components and applications running in Azure. A DMZ consists of a set of highly available network virtual appliances (NVAs) that can perform tasks such as acting as a firewall, inspecting network packets, and denying access to suspicious requests. These NVAs are typically implemented as Azure VMs. Traffic enters the NVA from a network interface exposed as part of the *inbound NVA subnet*, and filtered traffic exits to the application through another network interface on the *outbound NVA subnet*. 

You can additionally implement user-defined routing (*forced tunnelling*) to direct outbound traffic from the cloud intended for the Internet back through the on-premises network. You can then audit and log all Internet-bound traffic, which is a regulatory requirement of many commercial systems, and can help to prevent public disclosure of private information.

The following diagram illustrates the main features of this architecture:

[![0]][0]

Benefits of implementing a DMZ between Azure and an on-premises datacenter include:

- The ability to reuse security appliances commonly used by on-premises networks.

- Being able to secure access to Azure at the point of the VPN gateway.

Points to consider when creating a DMZ for this scenario:

- An internal load balancer only provides high available for traffic ingress.

- Egress from the VNet is not highly available.

For detailed information, read [Implementing a secure hybrid network architecture in Azure][secure-hybrid-network-architecture].

## Using a DMZ between Azure and the public Internet

If your Azure web applications are open to the Internet, you must ensure that all public access is protected. In this scenario, you can implement a DMZ that filters traffic received via a load balancer from a public IP address rather than the VPN gateway, as shown below: 

[![1]][1]

Benefits of using a DMZ between Azure and the public Internet include:

- The ability to reuse security appliances commonly used by on-premises networks.

- Securing access to Azure at the load balancer endpoint.

Considerations for using a DMZ for public access:

- An external load balancer only provides high available for traffic ingress to the VNet.

- Egress from the VNet is not highly available.

For information on how to configure this architecture, see [Implementing a DMZ between Azure and the Internet][dmz-azure-internet].

## Next steps

The resources below explain how to implement the architectures described in this article.

- [Implementing a secure hybrid network architecture in Azure][secure-hybrid-network-architecture]

- [Implementing a DMZ between Azure and the Internet][dmz-azure-internet]

<!-- Links -->
[0]: ./media/security/figure1.png "Secure hybrid network architecture with on-premises access"
[1]: ./media/security/figure2.png "Secure hybrid network architecture with Internet access"
[secure-hybrid-network-architecture]: ./guidance-iaas-ra-secure-vnet-hybrid.md
[implementing-aad]: ./guidance-identity-aad.md
[dmz-azure-internet]: ./guidance-iaas-ra-secure-vnet-dmz.md 
