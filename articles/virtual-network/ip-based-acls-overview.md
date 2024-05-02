---
title: "What is IP based access control lists (ACLs)?"
titleSuffix: Azure Virtual Network
description: Learn about IP based access control lists (ACLs) in Azure Virtual Network.
author: asudbring
ms.author: allensu
ms.service: virtual-network
ms.topic: overview
ms.date: 05/02/2024

#customer intent: As a network administrator, I want to learn about IP based access control lists (ACLs) in Azure Virtual Network so that I can control network traffic to and from my resources.

---

# What is IP based access control lists (ACls)?

Azure Service Tags were introduced in 2018 to simplify network security management in Azure. A service tag represents groups of IP address prefixes associated with specific Azure services and can be used in Network Security Groups (NSGs), Azure Firewall, and User-Defined Routes (UDR). While the intent of Service Tags is to simplify enabling IP-based ACLs, it should not be the only security measures implemented.

For more information about Service Tags in Azure, see [Service Tags](/azure/virtual-network/service-tags-overview).

## Background

One of the recommendations and standard procedures has historically been to use an Access Control List (ACL) to protect an environment from harmful traffic. Access lists are a statement of criteria and actions. The criteria define the pattern to be matched such as an IP Address. The actions indicate what the expected operation is that should be performed, such as a **permit** or **deny**. These criteria and actions can be established on network traffic based on the port and IP. TCP conversations based on port and IP are identified with a **five-tuple**.

The tuple has 5 elements: 

* Protocol (TCP)

* Source IP address (which IP sent the packet) 

* Source port (port that was used to send the packet) 

* Target IP address (where the packet should go)

* Target port 

When you set up IP ACLs, you are setting up a list of IP Addresses that you want to allow to traverse the network and blocking all others. In addition, you are applying these polices not just on the IP address but also on the port.

IP based ACLs can be set up at different levels of a network from the network device to firewalls. IP ACLs are very useful for reducing network security risks, such as blocking denial of service attacks and defining applications and ports that can receive traffic. For example, to secure a web service, an ACL can be created to only allow web traffic and block all other traffic.

## Azure and Service Tags

IP addresses within Azure have protections enabled by default to build additional layers of protections against security threats. This includes integrated DDoS protection as well as protections at the edge such as enablement of Resource Public Key Infrastructure (RPKI). RPKI is a framework designed to improve the security for the internet routing

infrastructure by enabling cryptographic trust. RPKI protects Microsoft networks to ensure no one else tries to announce the Microsoft IP space on the Internet.

Many customers have enabled Service Tags as part of their strategy of defense. Service Tags are labels that identify Azure services by their IP ranges. The value of Service Tags is the list of prefixes are managed automatically which reduces the need to manually maintain and track individual IP addresses. This automated maintenance of a service tag ensures that as services enhance their offerings to provide redundancy and improved security capabilities, you are immediately benefiting. Service tags reduce the number of manual touches that are required and ensure that the traffic for a service is always accurate. Enabling a service tag as part of an NSG or UDR is enabling IP based ACLs by specifying which service tag is allowed to send traffic to you.

## Limitations

One challenge with relying only on IP based ACLs is that IP addresses can be faked if RPKI is not implemented. IP spoofing is a category of malicious activity where the IP that you think you can trust is no longer an IP you should trust. By using an IP address to pretend to be a trusted source, that traffic gains access to your computer, device, or network.

This means a known IP Address does not necessarily mean it is safe or trustworthy. IP Spoofing can occur not just at a network layer but also within applications. Vulnerabilities in HTTP headers allow hackers to inject payloads leading to security events. Layers of validation need to occur from not just the network but also within applications. Building a philosophy of trust but verify is necessary with the advancements that are occurring in cyber-attacks.

## Moving forward

Every service has documented the role and meaning of the IP prefixes in their service tag. Service Tags alone are not sufficient to secure traffic without considering the nature of the service and the traffic it may send.

The IP prefixes and Service Tag for a Service may have traffic and users beyond the service itself. If an Azure service permits Customer Controllable Destinations, the customer is inadvertently allowing traffic that can then be controlled by other users of the same Azure service. Understanding the meaning of each Service Tag that you want to utilize will help you to understand your risk and identify additional layers of protection that may be required.

It's always a best practice to implement authentication/authorization for traffic rather than relying on IP addresses alone. Implementing validations of client-provided data, including headers, adds that next level of protection against spoofing. AzureFrontDoor (AFD) includes extended protections by evaluating the header and ensures that it matches your application and your identifier. For more information about Azure Front Door's extended protections, see [Secure traffic to Azure Front Door origins](/azure/frontdoor/origin-security?tabs=app-service-functions&pivots=front-door-standard-premium).

## Summary

IP based ACLs such as service tags are a good security defense by restricting network traffic, but they should not be the only layer of defense against malicious traffic. Implementing technologies available to you in Azure such as Private Link and Virtual Network Injection in addition to service tags will improve your security posture.


