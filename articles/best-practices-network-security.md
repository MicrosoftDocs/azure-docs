<properties
   pageTitle="Microsoft cloud services and network security | Microsoft Azure"
   description="Learn some of the key features available in Azure to help create secure network environments"
   services="virtual-network"
   documentationCenter="na"
   authors="tracsman"
   manager="rossort"
   editor=""/>

<tags
   ms.service="virtual-network"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="03/14/2016"
   ms.author="jonor;sivae"/>

# Microsoft cloud services and network security

Microsoft cloud services deliver hyperscale services and infrastructure, enterprise-grade capabilities, and many choices for hybrid connectivity. Customers can choose to access these services either via the Internet or with Azure ExpressRoute, which provides private network connectivity. The Microsoft Azure platform allows customers to seamlessly extend their infrastructure into the cloud and build multitier architectures. Additionally, third parties can enable enhanced capabilities by offering security services and virtual appliances. This white paper provides an overview of security and architectural issues that customers should consider when using Microsoft cloud services accessed via ExpressRoute. It also covers creating more secure services in Azure virtual networks.

## Fast start
The following logic chart can direct you to a specific example of the many security techniques available with the Azure platform. For quick reference, find the example that best fits your case. For more complete explanations, continue reading through the paper.
![Security options flowchart][0]

[Example 1: Build a perimeter network (also known as DMZ, demilitarized zone, and screened subnet) to help protect applications with network security groups (NSGs).](#example-1-build-a-simple-dmz-with-nsgs)</br>
[Example 2: Build a perimeter network to help protect applications with a firewall and NSGs.](#example-2-build-a-dmz-to-protect-applications-with-a-firewall-and-nsgs)</br>
[Example 3: Build a perimeter network to help protect networks with a firewall, user-defined route (UDR), and NSG.](#example-3-build-a-dmz-to-protect-networks-with-a-firewall-udr-and-nsg)</br>
[Example 4: Add a hybrid connection with a site-to-site, virtual appliance virtual private network (VPN).](#example-4-adding-a-hybrid-connection-with-a-site-to-site-virtual-appliance-vpn)</br>
[Example 5: Add a hybrid connection with a site-to-site, Azure gateway VPN.](#example-5-adding-a-hybrid-connection-with-a-site-to-site-azure-gateway-vpn)</br>
[Example 6: Add a hybrid connection with ExpressRoute.](#example-6-adding-a-hybrid-connection-with-expressroute)</br>
Examples for adding connections between virtual networks, high availability, and service chaining will be added to this document over the next few months.

## Microsoft compliance and infrastructure protection
Microsoft has taken a leadership position supporting compliance initiatives required by enterprise customers. The following are some of the compliance certifications for Azure:
![Azure compliance badges][1]

For more details, see the compliance information on the [Microsoft Trust Center](https://azure.microsoft.com/support/trust-center/compliance/).

Microsoft has a comprehensive approach to protect cloud infrastructure needed to run hyperscale global services. Microsoft cloud infrastructure includes hardware, software, networks, and administrative and operations staff, in addition to the physical datacenters.

![Azure security features][2]

This approach provides a more secure foundation for customers to deploy their services in the Microsoft cloud. The next step is for customers to design and create a security architecture to protect these services.

## Traditional security architectures and perimeter networks
Although Microsoft invests heavily in protecting the cloud infrastructure, customers must also protect their cloud services and resource groups. A multilayered approach to security provides the best defense. A perimeter network security zone protects internal network resources from an untrusted network. A perimeter network refers to the edges or parts of the network that sit between the Internet and the protected enterprise IT infrastructure.

In typical enterprise networks, the core infrastructure is heavily fortified at the perimeters, with multiple layers of security devices. The boundary of each layer consists of devices and policy enforcement points. Devices could include the following: firewalls, Distributed Denial of Service (DDoS) prevention, Intrusion Detection or Protection Systems (IDS/IPS), and VPN devices. Policy enforcement can take the form of firewall policies, access control lists (ACLs), or specific routing. The first line of defense in the network, directly accepting incoming traffic from the Internet, is a combination of these mechanisms to block attacks and harmful traffic while allowing legitimate requests further into the network. This traffic routes directly to resources in the perimeter network. That resource may then “talk” to resources deeper in the network, transiting the next boundary for validation first. The outermost layer is called the perimeter network because this part of the network is exposed to the Internet, usually with some form of protection on both sides. The following figure shows an example of a single subnet perimeter network in a corporate network, with two security boundaries.

![A perimeter network in a corporate network][3]

There are many architectures used to implement a perimeter network, from a simple load balancer in front of a web farm, to a multiple subnet perimeter network with varied mechanisms at each boundary to block traffic and protect the deeper layers of the corporate network. How the perimeter network is built depends on the specific needs of the organization and its overall risk tolerance.

As customers move their workloads to public clouds, it is critical to support similar capabilities for perimeter network architecture in Azure to meet compliance and security requirements. This document provides guidelines on how customers can build a secure network environment in Azure. It focuses on the perimeter network, but also includes a comprehensive discussion of many aspects of network security. The following questions inform this discussion:

- How can a perimeter network in Azure be built?
- What are some of the Azure features available to build the perimeter network?
- How can back-end workloads be protected?
- How are Internet communications controlled to the workloads in Azure?
- How can the on-premises networks be protected from deployments in Azure?
- When should native Azure security features be used versus third-party appliances or services?

The following diagram shows various layers of security Azure provides to customers. These layers are both native in the Azure platform itself and customer-defined features:

![Azure security architecture][4]

Inbound from the Internet, Azure DDoS helps protect against large-scale attacks against Azure. The next layer is customer-defined public endpoints, which are used to determine which traffic can pass through the cloud service to the virtual network. Native Azure virtual network isolation ensures complete isolation from all other networks, and that traffic only flows through user configured paths and methods. These paths and methods are the next layer, where NSGs, UDR, and network virtual appliances can be used to create security boundaries to protect the application deployments in the protected network.

The next section provides an overview of Azure virtual networks. These virtual networks are created by customers, and are what their deployed workloads are connected to. Virtual networks are the basis of all the network security features required to establish a perimeter network to protect customer deployments in Azure.

## Overview of Azure virtual networks
Before Internet traffic can get to the Azure virtual networks, there are two layers of security inherent to the Azure platform:

1.	**DDoS protection**: DDoS protection is a layer of the Azure physical network that protects the Azure platform itself from large-scale Internet-based attacks. These attacks use multiple “bot” nodes in an attempt to overwhelm an Internet service. Azure has a robust DDoS protection mesh on all inbound Internet connectivity. This DDoS protection layer has no user configurable attributes and is not accessible to customer. This protects Azure as a platform from large-scale attacks, but will not directly protect individual customer application. Additional layers of resilience can be configured by the customer against a localized attack. For example, if customer A was attacked with a large-scale DDoS attack on a public endpoint, Azure blocks connections to that service. Customer A could fail over to another virtual network or service endpoint not involved with the attack to restore service. It should be noted that although customer A might be affected on that endpoint, no other services outside that endpoint would be affected. In addition, other customers and services would see no impact from that attack.
2.	**Service endpoints**: Endpoints allow cloud services or resource groups to have public Internet IP addresses and ports exposed. The endpoint will use Network Address Translation (NAT) to route traffic to the internal address and port on the Azure virtual network. This is the primary path for external traffic to pass into the virtual network. The service endpoints are user configurable to determine which traffic is passed in, and how and where it's translated to on the virtual network.

Once traffic reaches the virtual network, there are many features that come into play. Azure virtual networks are the foundation for customers to attach their workloads and where basic network-level security applies. It is a private network (a virtual network overlay) in Azure for customers with the following features and characteristics:

- **Traffic isolation**: A virtual network is the traffic isolation boundary on the Azure platform. Virtual machines (VMs) in one virtual network cannot communicate directly to VMs in a different virtual network, even if both virtual networks are created by the same customer. This is a critical property that ensures customer VMs and communication remains private within a virtual network.
- **Multitier topology**: Virtual networks allow customers to define multitier topology by allocating subnets and designating separate address spaces for different elements or “tiers” of their workloads. These logical groupings and topologies enable customers to define different access policy based on the workload types, and also control traffic flows between the tiers.
- **Cross-premises connectivity**: Customers can establish cross-premises connectivity between a virtual network and multiple on-premises sites or other virtual networks in Azure. To do this, customers can use Azure VPN Gateways or third-party network virtual appliances. Azure supports site-to-site (S2S) VPNs using standard IPsec/IKE protocols and ExpressRoute private connectivity.
- **NSG** allows customers to create rules (ACLs) at the desired level of granularity: network interfaces, individual VMs, or virtual subnets. Customers can control access by permitting or denying communication between the workloads within a virtual network, from systems on customer’s networks via cross-premises connectivity, or direct Internet communication.
- **UDR** and **IP Forwarding** allow customers to define the communication paths between different tiers within a virtual network. Customers can deploy a firewall, IDS/IPS, and other virtual appliances, and route network traffic through these security appliances for security boundary policy enforcement, auditing, and inspection.
- **Network virtual appliances** in the Azure Marketplace: Security appliances such as firewalls, load balancers, and IDS/IPS are available in the Azure Marketplace and the VM Image Gallery. Customers can deploy these appliances into their virtual networks, and specifically, at their security boundaries (including the perimeter network subnets) to complete a multitiered secure network environment.

With these features and capabilities, one example of how a perimeter network architecture could be constructed in Azure is the following:

![A perimeter network in an Azure virtual network][5]

## Perimeter network characteristics and requirements
The perimeter network is designed to be the front end of the network, directly interfacing communication from the Internet. The incoming packets should flow through the security appliances, such as the firewall, IDS, and IPS, before reaching the back-end servers. Internet-bound packets from the workloads can also flow through the security appliances in the perimeter network for policy enforcement, inspection, and auditing purposes, before leaving the network. Additionally, the perimeter network can host cross-premises VPN gateways between customer virtual networks and on-premises networks.

### Perimeter network characteristics
Referencing the previous figure, some of the characteristics of a good perimeter network are as follows:

- Internet-facing:
    - The perimeter network subnet itself is Internet-facing, directly communicating with the Internet.
    - Public IPs, VIPs, and/or service endpoints pass Internet traffic to the front-end network and devices.
    - Inbound traffic from the Internet passes through security devices before other resources on the front-end network.
    - If outbound security is enabled, traffic passes through security devices, as the final step, before passing to the Internet.
- Protected network:
    - There is no direct path from the Internet to the core infrastructure.
    - Channels to the core infrastructure must traverse through security devices such as NSGs, firewalls, or VPN devices.
    - Other devices must not bridge Internet and the core infrastructure.
    - Security devices on both the Internet-facing and the protected network facing boundaries of the perimeter network (for example, the two firewall icons shown in the previous figure) may actually be a single virtual appliance with differentiated rules or interfaces for each boundary. (That is, one device, logically separated, handling the load for both boundaries of the perimeter network.)
- Other common practices and constraints:
    - Workloads must not store business critical information.
    - Access and updates to perimeter network configurations and deployments are limited to only authorized administrators.

### Perimeter network requirements
To enable these characteristics, follow these guidelines on virtual network requirements to implement a successful perimeter network:

- **Subnet architecture:** Specify the virtual network such that an entire subnet is dedicated as the perimeter network, separated from other subnets in the same virtual network. This ensures the traffic between the perimeter network and other internal or private subnet tiers flows through a firewall or IDS/IPS virtual appliance on the subnet boundaries with user-defined routes.
- **NSG:** The perimeter network subnet itself should be open to allow communication with the Internet, but that does not mean customers should be bypassing NSGs. Follow common security practices to minimize the network surfaces exposed to the Internet. Lock down the remote address ranges allowed to access the deployments or the specific application protocols and ports that are open. There may be circumstances, however, in which this is not always possible. For example, if customers have an external website in Azure, the perimeter network should allow the incoming web requests from any public IP addresses, but should only open the web application ports: TCP:80 and TCP:443.
- **Routing table:** The perimeter network subnet itself should be able to communicate to the Internet directly, but should not allow direct communication to and from the back end or on-premises networks without going through a firewall or security appliance.
- **Security appliance configuration:** In order to route and inspect packets between the perimeter network and the rest of the protected networks, the security appliances such as firewall, IDS, and IPS devices may be multi-homed. They may have separate NICs for the perimeter network and the back-end subnets. The NICs in the perimeter network communicate directly to and from the Internet, with the corresponding NSGs and the perimeter network routing table. The NICs connecting to the back-end subnets have more restricted NSGs and routing tables of the corresponding back-end subnets.
- **Security appliance functionality:** The security appliances deployed in the perimeter network typically perform the following functionality:
    - Firewall: Enforcing firewall rules or access control policies for the incoming requests.
    - Threat detection and prevention: Detecting and mitigating malicious attacks from the Internet.
    - Auditing and logging: Maintaining detailed logs for auditing and analysis.
    - Reverse proxy: Redirecting the incoming requests to the corresponding back-end servers. This involves mapping and translating the destination addresses on the front-end devices, typically firewalls, to the back-end server addresses.
    - Forward proxy: Providing NAT and performing auditing for communication initiated from within the virtual network to the Internet.
    - Router: Forwarding incoming and cross-subnet traffic inside the virtual network.
    - VPN device: Acting as the cross-premises VPN gateways for cross-premises VPN connectivity between customer on-premises networks and Azure virtual networks.
    - VPN server: Accepting VPN clients connecting to Azure virtual networks.

>[AZURE.TIP] Keep the following two groups separate: the individuals authorized to access the perimeter network security gear and the individuals authorized as application development, deployment, or operations administrators. Keeping these groups separate allows for a segregation of duties and prevents a single person from bypassing both applications security and network security controls.

### Questions to be asked when building network boundaries
In this section, unless specifically mentioned, the term "networks" refers to private Azure virtual networks created by a subscription administrator. The term doesn't refer to the underlying physical networks within Azure.

Also, Azure virtual networks are often used to extend traditional on-premises networks. It is possible to incorporate either site-to-site or ExpressRoute hybrid networking solutions with perimeter network architectures. This is an important consideration in building network security boundaries.

The following three questions are critical to answer when you're building a network with a perimeter network and multiple security boundaries.

#### 1) How many boundaries are needed?
The first decision point is to decide how many security boundaries are needed in a given scenario:

- A single boundary: One on the front-end perimeter network, between the virtual network and the Internet.
- Two boundaries: One on the Internet side of the perimeter network, and another between the perimeter network subnet and the back-end subnets in the Azure virtual networks.
- Three boundaries: One on the Internet side of the perimeter network, one between the perimeter network and back-end subnets, and one between the back-end subnets and the on-premises network.
- N boundaries: A variable number. Depending on security requirements, there is really any number of security boundaries that can be applied in a given network.

The number and type of boundaries needed will vary based on a company’s risk tolerance and the specific scenario being implemented. This is often a joint decision made by multiple groups within an organization, often including a risk and compliance team, a network and platform team, and an application development team. People with knowledge of security, the data involved, and the technologies being used should have a say in this decision to ensure the appropriate security stance for each implementation.

>[AZURE.TIP] Use the smallest number of boundaries that satisfy the security requirements for a given situation. With more boundaries the more difficult operations and troubleshooting can be, as well as the management overhead involved with managing the multiple boundary policies over time. However, insufficient boundaries increase risk. Finding the balance is critical.

![Hybrid network with three security boundaries][6]

The preceding figure shows a high-level view of a three security boundary network. The boundaries are between the perimeter network and the Internet, the Azure front-end and back-end private subnets, and the Azure back-end subnet and the on-premises corporate network.

#### 2) Where are the boundaries located?
Once the number of boundaries are decided, where to implement them is the next decision point. There are generally three choices:
- Using an Internet-based intermediary service (for example, a cloud-based Web application firewall, which is not discussed in this document)
- Using native features and/or network virtual appliances in Azure
- Using physical devices on the on-premises network

On purely Azure networks, the options are native Azure features (for example, Azure Load Balancers) or network virtual appliances from the rich partner ecosystem of Azure (for example, Check Point firewalls).

If a boundary is needed between Azure and an on-premises network, the security devices can reside on either side of the connection (or both sides). Thus a decision must be made on the location to place security gear.

In the previous figure, the Internet-to-perimeter network and the front-to-back-end boundaries are entirely contained within Azure, and must be either native Azure features or network virtual appliances. Security devices on the boundary between Azure (back-end subnet) and the corporate network could be either on the Azure side or the on-premises side, or even a combination of devices on both sides. There can be significant advantages and disadvantages to either option that must be seriously considered.

For example, using existing physical security gear on the on-premises network side has the advantage that no new gear is needed. It just needs reconfiguration. The disadvantage, however, is that all traffic must come back from Azure to the on-premises network to be seen by the security gear. Thus Azure-to-Azure traffic could incur significant latency, and affect application performance and user experience, if it was forced back to the on-premises network for security policy enforcement.

#### 3) How are the boundaries implemented?
Each security boundary will likely have different capability requirements (for example,  IDS and firewall rules on the Internet side of the perimeter network, but only ACLs between the perimeter network and back-end subnet). Deciding which devices to use depends on the scenario and security requirements. In the following section, examples 1, 2, and 3 discuss some options that could be used. Reviewing the Azure native network features and the devices available in Azure from the partner ecosystem shows the myriad options available to solve virtually any scenario.

Another key implementation decision point is how to connect the on-premises network with Azure. Should you use the Azure virtual gateway or a network virtual appliance? These options are discussed in greater detail in the following section (examples 4, 5, and 6).

Additionally, traffic between virtual networks within Azure may be needed. These scenarios will be added at a later date.

Once you know the answers to the previous questions, the [Fast Start](#fast-start) section can help identify which examples are most appropriate for a given scenario.

## Examples: Building security boundaries with Azure virtual networks
### Example 1: Build a perimeter network to help protect applications with NSGs
[Back to Fast start](#fast-start) | [Detailed build instructions for this example][Example1]

![Inbound perimeter network with NSG][7]

#### Environment description
In this example, there is a subscription that contains the following:

- Two cloud services: “FrontEnd001” and “BackEnd001”
- A virtual network, “CorpNetwork”, with two subnets: “FrontEnd” and “BackEnd”
- A Network Security Group that is applied to both subnets
- A Windows server that represents an application web server (“IIS01”)
- Two Windows servers that represent application back-end servers (“AppVM01”, “AppVM02”)
- A Windows server that represents a DNS server (“DNS01”)

For scripts and an Azure Resource Manager template, see the [detailed build instructions][Example1].

#### NSG description
In this example, an NSG group is built and then loaded with six rules.

>[AZURE.TIP] Generally speaking, you should create your specific “Allow” rules first, followed by the more generic “Deny” rules. The given priority dictates which rules are evaluated first. Once traffic is found to apply to a specific rule, no further rules are evaluated. NSG rules can apply in either the inbound or outbound direction (from the perspective of the subnet).

Declaratively, the following rules are being built for inbound traffic:

1.	Internal DNS traffic (port 53) is allowed.
2.	RDP traffic (port 3389) from the Internet to any Virtual Machine is allowed.
3.	HTTP traffic (port 80) from the Internet to web server (IIS01) is allowed.
4.	Any traffic (all ports) from IIS01 to AppVM1 is allowed.
5.	Any traffic (all ports) from the Internet to the entire virtual network (both subnets) is denied.
6.	Any traffic (all ports) from the front-end subnet to the back-end subnet is denied.

With these rules bound to each subnet, if an HTTP request was inbound from the Internet to the web server, both rules 3 (allow) and 5 (deny) would apply. But because rule 3 has a higher priority, only it would apply, and rule 5 would not come into play. Thus the HTTP request would be allowed to the web server. If that same traffic was trying to reach the DNS01 server, rule 5 (deny) would be the first to apply, and the traffic would not be allowed to pass to the server. Rule 6 (deny) blocks the front-end subnet from talking to the back-end subnet (except for allowed traffic in rules 1 and 4). This protects the back-end network in case an attacker compromises the web application on the front end. The attacker would have limited access to the back-end “protected” network (only to resources exposed on the AppVM01 server).

There is a default outbound rule that allows traffic out to the Internet. For this example, we’re allowing outbound traffic and not modifying any outbound rules. To lock down traffic in both directions, user-defined routing is required (see example 3).

#### Conclusion
This is a relatively simple and straightforward way of isolating the back-end subnet from inbound traffic. For more information, see the [detailed build instructions][Example1]. These instructions include:

- How to build this perimeter network with PowerShell scripts.
- How to build this perimeter network with an Azure Resource Manager template.
- Detailed descriptions of each NSG command.
- Detailed traffic flow scenarios, showing how traffic is allowed or denied in each layer.


 ### Example 2: Build a perimeter network to help protect applications with a firewall and NSGs
[Back to Fast start](#fast-start) | [Detailed build instructions for this example][Example2]

![Inbound perimeter network with NVA and NSG][8]

#### Environment description
In this example, there is a subscription that contains the following:

- Two cloud services: “FrontEnd001” and “BackEnd001”
- A virtual network, “CorpNetwork”, with two subnets: “FrontEnd” and “BackEnd”
- A Network Security Group that is applied to both subnets
- A network virtual appliance, in this case a firewall, connected to the front-end subnet
- A Windows server that represents an application web server (“IIS01”)
- Two Windows servers that represent application back-end servers (“AppVM01”, “AppVM02”)
- A Windows server that represents a DNS server (“DNS01”)

For scripts and an Azure Resource Manager template, see the [detailed build instructions][Example2].

#### NSG description
In this example, an NSG group is built and then loaded with six rules.

>[AZURE.TIP] Generally speaking, you should create your specific “Allow” rules first, followed by the more generic “Deny” rules. The given priority dictates which rules are evaluated first. Once traffic is found to apply to a specific rule, no further rules are evaluated. NSG rules can apply in either the inbound or outbound direction (from the perspective of the subnet).

Declaratively, the following rules are being built for inbound traffic:

1.	Internal DNS traffic (port 53) is allowed.
2.	RDP traffic (port 3389) from the Internet to any Virtual Machine is allowed.
3.	Any Internet traffic (all ports) to the network virtual appliance (firewall) is allowed.
4.	Any traffic (all ports) from IIS01 to AppVM1 is allowed.
5.	Any traffic (all ports) from the Internet to the entire virtual network (both subnets) is denied.
6.	Any traffic (all ports) from the front-end subnet to the back-end subnet is denied.

With these rules bound to each subnet, if an HTTP request was inbound from the Internet to the firewall, both rules 3 (allow) and 5 (deny) would apply. But because rule 3 has a higher priority, only it would apply, and rule 5 would not come into play. Thus the HTTP request would be allowed to the firewall. If that same traffic was trying to reach the IIS01 server, even though it’s on the front-end subnet, rule 5 (deny) would apply, and the traffic would not be allowed to pass to the server. Rule 6 (deny) blocks the front-end subnet from talking to the back-end subnet (except for allowed traffic in rules 1 and 4). This protects the back-end network in case an attacker compromises the web application on the front end. The attacker would have limited access to the back-end “protected” network (only to resources exposed on the AppVM01 server).

There is a default outbound rule that allows traffic out to the Internet. For this example, we’re allowing outbound traffic and not modifying any outbound rules. To lock down traffic in both directions, user-defined routing is required (see example 3).

#### Firewall rule description
On the firewall, forwarding rules should be created. Since this example only routes Internet traffic in-bound to the firewall and then to the web server, only one forwarding network address translation (NAT) rule is needed.

The forwarding rule accepts any inbound source address that hits the firewall trying to reach HTTP (port 80 or 443 for HTTPS). It's sent out of the firewall’s local interface and redirected to the web server with the IP Address of 10.0.1.5.

#### Conclusion
This is a relatively straightforward way of protecting your application with a firewall and isolating the back-end subnet from inbound traffic. For more information, see the [detailed build instructions][Example2]. These instructions include:

- How to build this perimeter network with PowerShell scripts.
- How to build this example with an Azure Resource Manager template.
- Detailed descriptions of each NSG command and firewall rule.
- Detailed traffic flow scenarios, showing how traffic is allowed or denied in each layer.

### Example 3 – Build a DMZ to Protect Networks with a Firewall, UDR, and NSG
[Back to Fast Start](#fast-start) | [Detailed Build Instructions For This Example][Example3]

![Bi-directional DMZ with NVA, NSG, and UDR][9]

#### Environment Setup
In this example there is a subscription that contains the following:

- Three cloud services: “SecSvc001”, “FrontEnd001”, and “BackEnd001”
- A Virtual Network, “CorpNetwork”, with three subnets; “SecNet”, “FrontEnd”, and “BackEnd”
- A network virtual appliance, in this example a firewall, connected to the SecNet subnet
- A Windows Server that represents an application web server (“IIS01”)
- Two windows servers that represent application back end servers (“AppVM01”, “AppVM02”)
- A Windows server that represents a DNS server (“DNS01”)

There are further details to build this example (it provides both scripts and an ARM template) located at the  [detailed build instructions][Example3] page.

#### User Defined Routing (UDR) Description
By default, the following system routes are defined as:

        Effective routes :
         Address Prefix    Next hop type    Next hop IP address Status   Source     
         --------------    -------------    ------------------- ------   ------     
         {10.0.0.0/16}     VNETLocal                            Active   Default    
         {0.0.0.0/0}       Internet                             Active   Default    
         {10.0.0.0/8}      Null                                 Active   Default    
         {100.64.0.0/10}   Null                                 Active   Default    
         {172.16.0.0/12}   Null                                 Active   Default    
         {192.168.0.0/16}  Null                                 Active   Default

The VNETLocal is always the defined address prefix(es) of the VNet for that specific network (ie it will change from VNet to VNet depending on how each specific VNet is defined). The remaining system routes are static and default as above.

In this example, two routing tables are created, one each for the Frontend and Backend subnets. Each table is loaded with static routes appropriate for the given subnet. For the purpose of this example, each table has three routes that direct all traffic (0.0.0.0/0) through the Firewall (Next hop = Virtual Appliance IP address):

1. Local subnet traffic with no Next Hop defined to allow local subnet traffic to bypass the firewall
2. Virtual Network traffic with a Next Hop defined as firewall, this overrides the default rule that allows local VNet traffic to route directly
3. All remaining traffic (0/0) with a Next Hop defined as the firewall

Once the routing tables are created they are bound to their subnets. For the Frontend subnet routing table, once created and bound to the subnet would look like this:

        Effective routes :
         Address Prefix    Next hop type    Next hop IP address Status   Source     
         --------------    -------------    ------------------- ------   ------     
         {10.0.1.0/24}     VNETLocal                            Active
		 {10.0.0.0/16}     VirtualAppliance 10.0.0.4            Active    
         {0.0.0.0/0}       VirtualAppliance 10.0.0.4            Active

>[AZURE.NOTE] There are certain restrictions when using User Defined Routing (UDR) with ExpressRoute due to the complexity of dynamic routing used in the Azure Virtual Gateway. These are listed below:
>
> 1. UDR should not be applied to the gateway subnet on which the ExpressRoute linked Azure Virtual Gateway is connected.
> 2. The ExpressRoute linked Azure Virtual Gateway cannot be the NextHop device for other UDR bound subnets.
>
>The ability to fully integrate UDR and ExpressRoute will be enabled in a future Azure release, examples of how to enable your DMZ with ExpressRoute or Site-to-Site networking are discussed below in Examples 3 and 4.


#### IP Forwarding Description
A companion feature to UDR, is IP Forwarding. This is a setting on a Virtual Appliance that allows it to receive traffic not specifically addressed to the appliance and then forward that traffic to its ultimate destination.

As an example, if traffic from AppVM01 makes a request to the DNS01 server, UDR would route this to the firewall. With IP Forwarding enabled, the traffic for the DNS01 destination (10.0.2.4) will be accepted by the appliance (10.0.0.4) and then forwarded to its ultimate destination (10.0.2.4). Without IP Forwarding enabled on the Firewall, traffic would not be accepted by the appliance even though the route table has the firewall as the next hop. To use a virtual appliance, it’s critical to remember to enable IP Forwarding in conjunction with User Defined Routing.

#### Network Security Group (NSG) Description
In this example, a NSG group is built and then loaded with a single rule. This group is then bound only to the Frontend and Backend subnets (not the SecNet). Declaratively the following rule is being built:

1.	Any traffic (all ports) from the Internet to the entire VNet (all subnets) is Denied

Although NSGs are used in this example, it’s main purpose is as a secondary layer of defense against manual misconfiguration. We want to block all inbound traffic from the internet to either the Frontend or Backend subnets, traffic should only flow through the SecNet subnet to the firewall (and then if appropriate on to the Frontend or Backend subnets). Plus, with the UDR rules in place, any traffic that did make it into the Frontend or Backend subnets would be directed out to the firewall (thanks to UDR). The firewall would see this as an asymmetric flow and would drop the outbound traffic. Thus there are three layers of security protecting the Frontend and Backend subnets; 1) no open endpoints on the FrontEnd001 and BackEnd001 cloud services, 2) NSGs denying traffic from the Internet, 3) the firewall dropping asymmetric traffic.

One interesting point regarding the Network Security Group in this example is that it contains only one rule, which is to deny internet traffic to the entire virtual network which would include the Security subnet. However, since the NSG is only bound to the Frontend and Backend subnets, the rule isn’t processed on traffic inbound to the Security subnet. As a result, even though the NSG rule says no Internet traffic to any address on the VNet, because the NSG was never bound to the Security subnet, traffic will flow to the Security subnet.

#### Firewall Rules
On the firewall, forwarding rules will need to be created. Since the firewall is blocking or forwarding all inbound, outbound, and intra-VNet traffic many firewall rules are needed. Also, all inbound traffic will hit the Security Service public IP address (on different ports), to be processed by the firewall. A best practice is to diagram the logical flows before setting up the subnets and firewall rules to avoid rework later. The following figure is a logical view of the firewall rules for this example:

![Logical View of the Firewall Rules][10]

>[AZURE.NOTE] Based on the Network Virtual Appliance used, the management ports will vary. In this example a Barracuda NextGen Firewall is referenced which uses ports 22, 801, and 807. Please consult the appliance vendor documentation to find the exact ports used for management of the device being used.

#### Firewall Rules Description
In the logical diagram above, the security subnet is not shown since the firewall is the only resource on that subnet, and this diagram is showing the firewall rules and how they logically allow or deny traffic flows and not the actual routed path. Also, the external ports selected for the RDP traffic are higher ranged ports (8014 – 8026) and were selected to somewhat align with the last two octets of the local IP address for easier readability (e.g. local server address 10.0.1.4 is associated with external port 8014), however any higher non-conflicting ports could be used.

For this example, we need 7 types of rules, these rule types are described as follows:

- External Rules (for inbound traffic):
  1.	Firewall Management Rule: This App Redirect rule allows traffic to pass to the management ports of the network virtual appliance.
  2.	RDP Rules (for each windows server): These four rules (one for each server) will allow management of the individual servers via RDP. This could also be bundled into one rule depending on the capabilities of the Network Virtual Appliance being used.
  3.	Application Traffic Rules: There are two Application Traffic Rules, the first for the front end web traffic, and the second for the back end traffic (eg web server to data tier). The configuration of these rules will depend on the network architecture (where your servers are placed) and traffic flows (which direction the traffic flows, and which ports are used).
      - The first rule will allow the actual application traffic to reach the application server. While the other rules allow for security, management, etc., Application Rules are what allow external users or services to access the application(s). For this example, there is a single web server on port 80, thus a single firewall application rule will redirect inbound traffic to the external IP, to the web servers internal IP address. The redirected traffic session would be NAT’d to the internal server.
      - The second Application Traffic Rule is the back end rule to allow the Web Server to talk to the AppVM01 server (but not AppVM02) via any port.
- Internal Rules (for intra-VNet traffic)
  4.	Outbound to Internet Rule: This rule will allow traffic from any network to pass to the selected networks. This rule is usually a default rule already on the firewall, but in a disabled state. This rule should be enabled for this example.
  5.	DNS Rule: This rule allows only DNS (port 53) traffic to pass to the DNS server. For this environment most traffic from the Frontend to the Backend is blocked, this rule specifically allows DNS from any local subnet.
  6.	Subnet to Subnet Rule: This rule is to allow any server on the back end subnet to connect to any server on the front end subnet (but not the reverse).
- Fail-safe Rule (for traffic that doesn’t meet any of the above):
  7.	Deny All Traffic Rule: This should always be the final rule (in terms of priority), and as such if a traffic flows fails to match any of the preceding rules it will be dropped by this rule. This is a default rule and usually activated, no modifications are generally needed.

>[AZURE.TIP] On the second application traffic rule, any port is allowed for easy of this example, in a real scenario the most specific port and address ranges should be used to reduce the attack surface of this rule.

Once all of the above rules are created, it’s important to review the priority of each rule to ensure traffic will be allowed or denied as desired. For this example, the rules are in priority order.

#### Conclusion
This is a more complex but more complete way of protecting and isolating the network (Example 2 was protecting just the application and Example 1 was just isolating subnets). This design allows for monitoring traffic in both direction and protects not just the inbound application server but enforces network security policy for all servers on this network. Also, depending on the appliance used, full traffic auditing and awareness can be achieved. More information on this example such as the following:

- How to build this example DMZ with PowerShell scripts
- How to build this example with an ARM template
- Detailed descriptions of each UDR, NSG command, and Firewall rule
- Detailed traffic flow scenarios, showing how traffic is allowed or denied in each layer

can be found at the [detailed build instructions][Example3] page.

### Example 4 – Adding a Hybrid Connection with a Site-to-Site, Virtual Appliance VPN
[Back to Fast Start](#fast-start) | Detailed Build Instructions Will be Available Soon

![DMZ with NVA connected hybrid network][11]

#### Environment Setup
Hybrid networking using a Network Virtual Appliance (NVA) can be added to any of the DMZ types described in Example 1, 2, or 3.

As shown in the figure above, a VPN connection over the Internet (Site-to-Site) is used to connect an on-premise network to an Azure Virtual Network via a Network Virtual Appliance.

>[AZURE.NOTE] If you use ExpressRoute with the Azure Public Peering option enabled, a static route will need to be created to route to the NVA VPN IP address out your corporate Internet edge and not via the ExpressRoute WAN edge. This is due to the NAT required on the ExpressRoute Azure Public Peering option that will most likely break the VPN session (IPSec generally doesn't like NATs).

Once the VPN is in-place, the NVA becomes the central “hub” for all networks and subnets. The firewall forwarding rules determine which traffic flows are allowed, are NAT’d, are redirected, or are dropped (even for traffic flows between the on-premise network and Azure if the flows as designed that way).

Traffic flows should be considered carefully as they can be optimized or degraded by this design pattern depending on the specific use case.

Using the environment built in Example 3, "Build a DMZ to Protect Networks with a Firewall, UDR, and NSG", and then adding a Site-to-Site VPN hybrid network connection would produce the following design:

![DMZ with NVA connected using a Site-to-Site VPN][12]

In the above design, The on-premise router, or any other network device that is compatible with your Network Virtual Appliance for VPN, would be the VPN client. This physical device would be responsible for initiating and maintaining the VPN connection with your Network Virtual Appliance.

Logically to the NVA, the network looks like four separate “security zones” with the rules on the NVA being the primary director of traffic between these zones. This would look logically as:

![Logical Network from NVA perspective][13]

#### Conclusion
The addition of a Site-to-Site VPN hybrid network connection to an Azure Virtual Network, can extend the on-premise network into Azure in a secure manner. In using a VPN connection your traffic is encrypted and routes via the internet. Using the NVA, as was done in this example, provides a central location to enforce and manage the security policy. More information on this example such as the following:

- How to build this example DMZ with PowerShell scripts
- How to build this example with an ARM template
- Detailed traffic flow scenarios, showing how traffic flows through this design

will be available soon and linked from this page.

### Example 5 – Adding a Hybrid Connection with a Site-to-Site, Azure Gateway VPN
[Back to Fast Start](#fast-start) | Detailed Build Instructions Will be Available Soon

![DMZ with Gateway connected hybrid network][14]

#### Environment Setup
Hybrid networking using an Azure VPN Gateway can be added to either DMZ type described in Example 1 and 2.

As shown in the figure above, a VPN connection over the Internet (Site-to-Site) is used to connect an on-premise network to an Azure Virtual Network via an Azure VPN Gateway.

>[AZURE.NOTE] If you use ExpressRoute with the Azure Public Peering option enabled, a static route will need to be created to route to the Azure VPN Gateway IP address out your corporate Internet edge and not via the ExpressRoute WAN edge. This is due to the NAT required on the ExpressRoute Azure Public Peering option that will most likely break the VPN session (IPSec generally doesn't like NATs).

As shown below, with this option the environment now has two network edges. On the first edge, the NVA and NSGs control traffic flows for intra-Azure networks and between Azure and the internet, while the second edge is the Azure VPN Gateway which is a completely separate and isolated network edge between on-premises and Azure.

Traffic flows should be considered carefully as they can be optimized or degraded by this design pattern depending on the specific use case.

Using the environment built in Example 1, "Build a DMZ to protect applications with NSGs", and then adding a Site-to-Site VPN hybrid network connection would produce the following design:

![DMZ with Gateway connected using an ExpressRoute connection][15]

#### Conclusion
The addition of a Site-to-Site VPN hybrid network connection to an Azure Virtual Network, can extend the on-premise network into Azure in a secure manner. Using the native Azure VPN Gateway your traffic is IPSec encrypted and routes via the internet. Also, using the Azure VPN Gateway can provides a lower cost option (no additional licensing cost as with third party Network Virtual Appliances). This is most economical in Example 1 where no network virtual appliance is used. More information on this example such as the following:

- How to build this example DMZ with PowerShell scripts
- How to build this example with an ARM template
- Detailed traffic flow scenarios, showing how traffic flows through this design

will be available soon and linked from this page.

### Example 6 – Adding a Hybrid Connection with ExpressRoute
[Back to Fast Start](#fast-start) | Detailed Build Instructions Will be Available Soon

![DMZ with Gateway connected hybrid network][16]

#### Environment Setup
Hybrid networking using an ExpressRoute private peering connection can be added to either DMZ type described in Example 1 or 2.

As shown in the figure above, ExpressRoute private peering provides a direct connection between your on-premise network and the Azure Virtual Network. Traffic transits only the service provider network and the Microsoft/Azure network, never touching the internet.

>[AZURE.NOTE] There are certain restrictions when using User Defined Routing (UDR) with ExpressRoute due to the complexity of dynamic routing used in the Azure Virtual Gateway. These are listed below:
>
> 1. UDR should not be applied to the gateway subnet on which the ExpressRoute linked Azure Virtual Gateway is connected.
> 2. The ExpressRoute linked Azure Virtual Gateway cannot be the NextHop device for other UDR bound subnets.
>
>The ability to fully integrate UDR and ExpressRoute will be enabled in a future Azure release.

<br />

>[AZURE.TIP] Using ExpressRoute keeps corporate network traffic off of the internet for better security, significantly increased performance, and allows for SLAs from your ExpressRoute provider. As it relates to ExpressRoute performance, the Azure Gateway can pass up to 2Gbps with ExpressRoute, whereas with Site-to-Site VPNs the Azure Gateway maximum throughput is 200Mbps.

As seen in the diagram below, with this option the environment now has two network edges, the NVA and NSG control traffic flows for intra-Azure networks and between Azure and the internet, while the gateway is a completely separate and isolated network edge between on-premise and Azure.

Traffic flows should be considered carefully as they can be optimized or degraded by this design pattern depending on the specific use case.

Using the environment built in Example 1, "Build a Simple DMZ with NSGs", and then adding an ExpressRoute hybrid network connection would produce the following design:

![DMZ with Gateway connected using an ExpressRoute connection][17]

#### Conclusion
The addition of an ExpressRoute Private Peering network connection can extend the on-premise network into Azure in a secure, lower latency, higher performing manner. Also, using the native Azure Gateway, as was done in this example, provides a lower cost option (no additional licensing as with third party Network Virtual Appliances). More information on this example such as the following:

- How to build this example DMZ with PowerShell scripts
- How to build this example with an ARM template
- Detailed traffic flow scenarios, showing how traffic flows through this design

will be available soon and linked from this page.

## References
### Helpful Websites and Documentation
- Access Azure with ARM:
- Accessing Azure with PowerShell: [https://azure.microsoft.com/documentation/articles/powershell-install-configure/](./powershell-install-configure.md)
- Virtual Networking Documentation: [https://azure.microsoft.com/documentation/services/virtual-network/](https://azure.microsoft.com/documentation/services/virtual-network/)
- Network Security Group Documentation: [https://azure.microsoft.com/documentation/articles/virtual-networks-nsg/](./virtual-network/virtual-networks-nsg.md)
- User Defined Routing Documentation: [https://azure.microsoft.com/documentation/articles/virtual-networks-udr-overview/](./virtual-network/virtual-networks-udr-overview.md)
- Azure Virtual Gateways: [https://azure.microsoft.com/documentation/services/vpn-gateway/](https://azure.microsoft.com/documentation/services/vpn-gateway/)
- Site-to-Site VPNs: [https://azure.microsoft.com/documentation/articles/vpn-gateway-create-site-to-site-rm-powershell](./vpn-gateway/vpn-gateway-create-site-to-site-rm-powershell.md)
- ExpressRoute Documentation (be sure to check out the “Getting Started” and “How To” sections): [https://azure.microsoft.com/documentation/services/expressroute/](https://azure.microsoft.com/documentation/services/expressroute/)

<!--Image References-->
[0]: ./media/best-practices-network-security/flowchart.png "Security Options Flowchart"
[1]: ./media/best-practices-network-security/compliancebadges.png "Azure Compliance Badges"
[2]: ./media/best-practices-network-security/azuresecurityfeatures.png "Azure Security Features"
[3]: ./media/best-practices-network-security/dmzcorporate.png "A DMZ in a Corporate network"
[4]: ./media/best-practices-network-security/azuresecurityarchitecture.png "Azure Security Architecture"
[5]: ./media/best-practices-network-security/dmzazure.png "A DMZ in an Azure Virtual Network"
[6]: ./media/best-practices-network-security/dmzhybrid.png "Hybrid Network with Three Security Boundaries"
[7]: ./media/best-practices-network-security/example1design.png "Inbound DMZ with NSG"
[8]: ./media/best-practices-network-security/example2design.png "Inbound DMZ with NVA and NSG"
[9]: ./media/best-practices-network-security/example3design.png "Bi-directional DMZ with NVA, NSG, and UDR"
[10]: ./media/best-practices-network-security/example3firewalllogical.png "Logical View of the Firewall Rules"
[11]: ./media/best-practices-network-security/example4designoptions.png "DMZ with NVA Connected Hybrid Network"
[12]: ./media/best-practices-network-security/example4designs2s.png "DMZ with NVA Connected Using a Site-to-Site VPN"
[13]: ./media/best-practices-network-security/example4networklogical.png "Logical Network from NVA Perspective"
[14]: ./media/best-practices-network-security/example5designoptions.png "DMZ with Azure Gateway Connected Site-to-Site Hybrid Network"
[15]: ./media/best-practices-network-security/example5designs2s.png "DMZ with Azure Gateway Using Site-to-Site VPN"
[16]: ./media/best-practices-network-security/example6designoptions.png "DMZ with Azure Gateway Connected ExpressRoute Hybrid Network"
[17]: ./media/best-practices-network-security/example6designexpressroute.png "DMZ with Azure Gateway Using an ExpressRoute Connection"

<!--Link References-->
[Example1]: ./virtual-network/virtual-networks-dmz-nsg-asm.md
[Example2]: ./virtual-network/virtual-networks-dmz-nsg-fw-asm.md
[Example3]: ./virtual-network/virtual-networks-dmz-nsg-fw-udr-asm.md
[Example4]: ./virtual-network/virtual-networks-hybrid-s2s-nva-asm.md
[Example5]: ./virtual-network/virtual-networks-hybrid-s2s-agw-asm.md
[Example6]: ./virtual-network/virtual-networks-hybrid-expressroute-asm.md
[Example7]: ./virtual-network/virtual-networks-vnet2vnet-direct-asm.md
[Example8]: ./virtual-network/virtual-networks-vnet2vnet-transit-asm.md
