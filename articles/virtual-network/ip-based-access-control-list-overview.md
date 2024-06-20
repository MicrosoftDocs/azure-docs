---
title: "What is an IP based access control list (ACL)?"
titleSuffix: Azure Virtual Network
description: Learn about IP based access control lists in Azure Virtual Network.
author: asudbring
ms.author: allensu
ms.service: virtual-network
ms.topic: overview
ms.date: 05/02/2024

#customer intent: As a network administrator, I want to learn about IP based access control lists in Azure Virtual Network so that I can control network traffic to and from my resources.

---

# What is an IP based access control list (ACL)?

Azure Service Tags were introduced in 2018 to simplify network security management in Azure. A service tag represents groups of IP address prefixes associated with specific Azure services and can be used in Network Security Groups (NSGs), Azure Firewall, and User-Defined Routes (UDR). While the intent of Service Tags is to simplify enabling IP-based ACLs, it shouldn't be the only security measures implemented.

For more information about Service Tags in Azure, see [Service Tags](/azure/virtual-network/service-tags-overview).

## Background

One of the recommendations and standard procedures is to use an Access Control List (ACL) to protect an environment from harmful traffic. Access lists are a statement of criteria and actions. The criteria define the pattern to be matched such as an IP Address. The actions indicate what the expected operation is that should be performed, such as a **permit** or **deny**. These criteria and actions can be established on network traffic based on the port and IP. TCP (Transmission Control Protocol) conversations based on port and IP are identified with a **five-tuple**.

The tuple has five elements: 

* Protocol (TCP)

* Source IP address (which IP sent the packet) 

* Source port (port that was used to send the packet) 

* Target IP address (where the packet should go)

* Target port 

When you set up IP ACLs, you're setting up a list of IP Addresses that you want to allow to traverse the network and blocking all others. In addition, you're applying these policies not just on the IP address but also on the port.

IP based ACLs can be set up at different levels of a network from the network device to firewalls. IP ACLs are useful for reducing network security risks, such as blocking denial of service attacks and defining applications and ports that can receive traffic. For example, to secure a web service, an ACL can be created to only allow web traffic and block all other traffic.

## Azure and Service Tags

IP addresses within Azure have protections enabled by default to build extra layers of protections against security threats. These protections include integrated DDoS protection and protections at the edge such as enablement of Resource Public Key Infrastructure (RPKI). RPKI is a framework designed to improve the security for the internet routing infrastructure by enabling cryptographic trust. RPKI protects Microsoft networks to ensure no one else tries to announce the Microsoft IP space on the Internet.

Many customers enable Service Tags as part of their strategy of defense. Service Tags are labels that identify Azure services by their IP ranges. The value of Service Tags is the list of prefixes are managed automatically. The automatic management reduces the need to manually maintain and track individual IP addresses. Automated maintenance of a service tags ensures that as services enhance their offerings to provide redundancy and improved security capabilities, you're immediately benefiting. Service tags reduce the number of manual touches that are required and ensure that the traffic for a service is always accurate. Enabling a service tag as part of an NSG or UDR is enabling IP based ACLs by specifying which service tag is allowed to send traffic to you.

## Limitations

One challenge with relying only on IP based ACLs is that IP addresses can be faked if RPKI isn't implemented. Azure automatically applies RPKI and DDoS protections to mitigate IP spoofing. IP spoofing is a category of malicious activity where the IP that you think you can trust is no longer an IP you should trust. By using an IP address to pretend to be a trusted source, that traffic gains access to your computer, device, or network.

A known IP Address doesn't necessarily mean it's safe or trustworthy. IP Spoofing can occur not just at a network layer but also within applications. Vulnerabilities in HTTP headers allow hackers to inject payloads leading to security events. Layers of validation need to occur from not just the network but also within applications. Building a philosophy of trust but verify is necessary with the advancements that are occurring in cyber-attacks.

## Moving forward

Every service documents the role and meaning of the IP prefixes in their service tag. Service Tags alone aren't sufficient to secure traffic without considering the nature of the service and the traffic it sends.

The IP prefixes and Service Tag for a Service might have traffic and users beyond the service itself. If an Azure service permits Customer Controllable Destinations, the customer is inadvertently allowing traffic controlled by other users of the same Azure service. Understanding the meaning of each Service Tag that you want to utilize helps you understand your risk and identify extra layers of protection that are required.

It's always a best practice to implement authentication/authorization for traffic rather than relying on IP addresses alone. Validations of client-provided data, including headers, add that next level of protection against spoofing. Azure Front Door (AFD) includes extended protections by evaluating the header and ensures that it matches your application and your identifier. For more information about Azure Front Door's extended protections, see [Secure traffic to Azure Front Door origins](/azure/frontdoor/origin-security?tabs=app-service-functions&pivots=front-door-standard-premium).

## Summary

IP based ACLs such as service tags are a good security defense by restricting network traffic, but they shouldn't be the only layer of defense against malicious traffic. Implementing technologies available to you in Azure such as Private Link and Virtual Network Injection in addition to service tags improve your security posture. For more information about Private Link and Virtual Network Injection, see [Azure Private Link](/azure/private-link/private-link-overview) and [Deploy dedicated Azure services into virtual networks](/azure/virtual-network/virtual-network-for-azure-services).


