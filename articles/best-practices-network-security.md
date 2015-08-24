# Microsoft Cloud Services and Network Security
## Overview
Microsoft Cloud services deliver hyper-scale services and infrastructure, enterprise grade capabilities, and many choices for hybrid connectivity. Customers can choose to access these services either via the Internet or with ExpressRoute, which provides private network connectivity. The Microsoft Azure platform allows customers to seamlessly extend their infrastructure into the cloud and build multi-tier architectures. To complement Microsoft’s services, third parties can enable enhanced capabilities by offering security services and virtual appliances. This white paper provides an overview of security and architectural issues that customers should consider when using Microsoft Cloud services accessed via ExpressRoute as well as creating secure services in Microsoft Azure’s Virtual Network.

# Microsoft Compliance and Infrastructure Protection
Microsoft has taken a leadership position supporting compliance initiatives required by enterprise customers. The following are some of the compliance certifications for Azure:
![Azure Compliance Badges][1]

More details can be found at: [http://azure.microsoft.com/en-us/support/trust-center/compliance/](http://azure.microsoft.com/en-us/support/trust-center/compliance/)

Microsoft has a comprehensive approach to protect cloud infrastructure needed to run hyper-scale global services. Microsoft cloud infrastructure includes hardware, software, networks, administrative and operations staff, as well as the physical data centers.

![Azure Security Features][2]

The above approach provides a secure foundation for customers to deploy their services in Microsoft’s Cloud. The next step is for customers to design and create a security architecture to protect these services.

## Traditional Security Architectures and Demilitarized Zones (DMZs)
Although Microsoft invests heavily in protecting the cloud infrastructure, customers must also protect their cloud services and resource groups. A multi-layered approach to security provides the best defense. A network security demilitarized zone (DMZ) protects internal network resources from an untrusted network. DMZ is a well-known concept in enterprise IT network security architecture, referring to the edges or parts of the network that sit between the Internet and the protected enterprise IT infrastructure.

In typical enterprise networks, the core infrastructure is heavily fortified at the perimeters, with multiple layers of security devices. The boundary of each layer will consist of devices and policy enforcement points. Devices could include; firewalls, DDoS (Distributed Denial of Service) prevention, IDS/IPS (Intrusion Detection or Protection Systems), VPN (Virtual Private Networks) devices, etc. Policy enforcement can take the form of firewall policies, ACLs, or specific routing. The first line of defense in the network, directly accepting incoming traffic from the Internet, will be a combination of these mechanisms to block attacks and harmful traffic while passing through legitimate requests further into the network. This traffic will route directly to resources in the DMZ. That resource may then “talk” to resources deeper in the network, transiting the next boundary for validation before routing deeper into the network. The outermost layer is called the DMZ because this part of the network is exposed to the Internet, usually with some form of protection on both sides of the DMZ. The figure below shows an example of a single subnet DMZ in a corporate network with two security boundaries (DMZ-Internet and DMZ-Back end VLAN). 

![A DMZ in a Corporate network][3]

There are many architectures used to implement a DMZ, from a simple load balancer in front of a web farm to a multiple subnet DMZ with varied mechanisms at each boundary to block traffic and protect the deeper layers of the corporate network. How the DMZ is built depends on the specific needs of the organization and the associated risk tolerance.

As customers move their workloads to public clouds, it is critical to support similar capabilities for DMZ architecture in Azure to meet compliance and security requirements. This document provides guidelines on how customers can build a secure network environment in Azure, focusing on the DMZ but encompassing a comprehensive discussion on many aspects of network security started with but not limited to the following questions:

1.	How can a DMZ in Azure be built?
2.	What are some of the Azure features available to build the DMZ?
3.	How can backend workloads be protected?
4.	How are Internet communications controlled to the workloads in Azure?
5.	How can the on-premises networks be protected from deployments in Azure?
6.	When should native Azure security features be used versus third party appliances or services?

The following diagram shows various layers of security Azure provides to customers both native in the Azure platform itself and through customer defined features:

![Azure Security Architecture][4]

Inbound from the Internet there is Azure DDoS protection watching for large scale attacks against Azure. Passing this would reach the customer defined public endpoints which are used to determine which traffic can pass through the Cloud Service to the virtual network. Native Azure Virtual Network isolation ensures complete isolation from all other networks and that traffic only flows through user configured paths and methods. These paths and methods are the next layer where Network Security Groups (NSG), User Defined Routing (UDR), and Network Virtual Appliances can be used to create security boundaries, including DMZs, to protect the application deployments in the protected network.

The next section provides an overview of Azure Virtual Networks. Azure Virtual Networks are created by customers and are to what their deployed workloads are connected. Virtual Networks are the basis of all the network security features required to establish a DMZ to protect customer deployments in Azure.

## Overview of Azure Virtual Networks
Before Internet traffic can get to the Azure Virtual Networks, there are two layers of security inherent to the Azure platform:

1.	**DDoS Protection**: Distributed Denial of Service Protection (DDoS) is a layer of the Azure physical network that protects the Azure platform itself from large scale internet based attacks where attackers use multiple “bot” nodes in an attempt to overwhelm an Internet service. Azure has a robust DDoS protection mesh on all inbound internet connectivity. This DDoS protection layer, has no user configurable attributes and is not accessible to customer. This protects Azure as a platform from large scale attacks, but will not directly protect individual customer application. Additional layers of resilience can be configured by the customer against a localized attack. For example; if customer A was attacked with a large scale DDoS attack on a public endpoint, Azure will block connections to that service. Customer A could failover to another Virtual Network or Service Endpoint not involved with the attack to restore service. It should be noted that while customer A could be affected on that endpoint, no other services outside of that endpoint would be affected. In addition, other customers and services would see no impact from that attack.
2.	**Service Endpoints**: endpoints allow Cloud Services or Resource Groups to have public (on the Internet) IP addresses and ports exposed, the endpoint will NAT traffic to the internal address and port on the Azure Virtual Network. This is the primary path for external traffic to pass into the Azure Virtual Network. The Service Endpoints are user configurable to determine which traffic is passed in, and how/where its translated to on the Virtual Network. 

Once traffic reaches the Virtual Network, there are many features that come into play as Azure Virtual Networks are the foundation for customers to attach their workloads and where basic network level security applies. It is a private network (a virtual network overlay) in Azure for customers with the following features and characteristics:
 
1.	**Traffic isolation**: A virtual network is the traffic isolation boundary on the Azure platform. VMs in one virtual network cannot communicate directly to VMs in a different virtual network, even if both virtual networks are created by the same customer. This is a critical property that ensures customer VMs and communication remains private within a virtual network. 
2.	**Multi-tier topology**: Virtual Networks allow customers to define multi-tier topology by allocating subnets and designating separate address spaces for different elements or “tiers” of their workloads. These logical groupings and topologies enable customers to define different access policy based on the workload types, and also control traffic flows between the tiers. 
3.	**Cross premises connectivity**: Customers can establish cross premises connectivity between a virtual network and multiple on-premises sites or other virtual networks in Azure through Azure VPN Gateways or 3rd party Network Virtual Appliances. Azure supports site-to-site (S2S) VPNs using standard IPsec/IKE protocols and ExpressRoute private connectivity. 
4.	**Network Security Group** (NSG) allows customers to create rules (ACLs) at the desired level of granularity: network interfaces, individual VMs, or virtual subnets. Customers can control access by permitting or denying communication between the workloads within a virtual network, from systems on customer’s networks via cross premises connectivity, or direct Internet communication. 
5.	**User-Defined Routes** (UDR) and **IP Forwarding** allows customers to define the communication paths between different tiers within a virtual network. Customers can deploy a firewall, IDS/IPS, and other virtual appliances and route network traffic through these security appliances for security boundary policy enforcement, auditing, and inspection.
6.	**Network Virtual Appliances** in the Azure Marketplace: Security appliances such as firewalls, load balancers, and IDS/IPS (Intrusion Detection/Prevention Services) are available in the Azure Marketplace and the VM Image Gallery. Customers can deploy these appliances into their virtual networks, and specifically, at their security boundaries (including the DMZ subnets) to complete a multi-tiered secure network environment.

With these features and capabilities, one example of how a DMZ architecture could be constructed in Azure is:

![A DMZ in an Azure Virtual Network][5]

## DMZ Characteristics and Requirements
This section describes the characteristics and requirements of a DMZ in Azure. As described earlier, the DMZ is designed to be the frontend of the network, directly interfacing communication from the Internet. The incoming packets should flow through the security appliances: firewall, IDS, IPS, etc. in the DMZ before reaching the backend servers. Internet-bound packets from the workloads can also flow through the security appliances in the DMZ for policy enforcement, inspection, and auditing purposes, before leaving the network. Additionally, the DMZ can also be used to host cross-premises VPN gateways between customer virtual networks and on premises networks.

### DMZ Characteristics
Referencing the above figure, A DMZ in an Azure Virtual Network, some of the characteristics of a good DMZ are as follows:

- DMZ Internet facing (frontend):
    - The DMZ subnet itself is Internet-facing, directly communicating with the Internet
    - Public IPs, VIPs, and/or Service Endpoints pass internet traffic to the front end network and devices
    - Inbound traffic from the internet passes through security devices before other resources on the front end network
    - If outbound security is enabled, traffic passes through security devices, as the final step, before passing to the internet
- “Protected Network” (Backend): toward the core infrastructure
    - No direct path from the Internet to the core infrastructure
    - Channels to the core infrastructure MUST traverse through security devices such as NSGs, firewalls, or VPN devices in the DMZ
    - Other devices in DMZ MUST NOT bridge Internet and the core infrastructure
    - Security devices on both the Internet facing and the protected network facing boundaries of the DMZ (e.g. the two firewall icons shown in Figure 4) may actually be a single virtual appliance with differentiated rules or interfaces for the internet boundary and the backend boundary (i.e. one device, logically separated, handling the load for both boundaries of the DMZ)
- Other common practices and constraints
    - Workloads in the DMZ MUST NOT store business critical information
    - Access and updates to DMZ configurations and deployments are limited to only authorized administrators

### DMZ Requirements
To enable these characteristics, the following list provides guidance on virtual network requirements to implement a successful DMZ:

- Subnet architecture: Specify the virtual network such that an entire subnet is dedicated as the DMZ, separated from other subnets in the same virtual network. This will ensure the traffic between the DMZ and other internal or private subnet tiers flow through a firewall or IDS/IPS virtual appliance on the subnet boundaries with User-Defined Routes.
- Network Security Group (NSG) for the DMZ – The DMZ subnet itself should be open to allow communication between the DMZ and the Internet, but that does not mean customers should be bypassing NSGs. Follow common security practices to minimize the network surfaces exposed to the Internet by locking down the remote address ranges allowed to access the deployments and/or the specific application protocols and ports that are open. Note though these may not always be possible. For example, if customers have an external web site in Azure, then the DMZ should allow the incoming web requests from any public IP addresses, but should only open the web application ports: TCP:80 and TCP:443.
- Routing Table for DMZ – The DMZ subnet itself should be able to communicate to the Internet directly, but should not allow direct communication to and from the backend or on premises networks without going through a firewall or security appliance.
- DMZ security appliance configuration – In order to route and inspect packets between the DMZ and the rest of the protected networks, the security appliances such as firewall, IDS, IPS devices in DMZ may be multi-homed, with separate NICs for the DMZ and the backend subnets. The NIC(s) in the DMZ will communicate directly to and from the Internet, with the corresponding NSGs and the DMZ routing table. The NICs connecting to the backend subnets will have more restricted NSGs and routing tables of the corresponding backend subnets.
- DMZ security appliance functionality – the security appliances deployed in the DMZ typically perform the following functionality:
    - Firewall – Enforcing firewall rules or access control policies for the incoming requests
    - Threat detection and prevention – Detect and mitigate malicious attacks from the Internet
    - Auditing & Logging – Maintain detailed logs for auditing and analysis
    - Reverse proxy – Redirect the incoming requests to the corresponding backend servers by mapping and translating the destination addresses on the DMZ frontend devices, typically firewalls, to the actual backend server addresses
    - Forward proxy – Provide NAT and also perform auditing for communication initiated from within the virtual network to the Internet
    - Router – Act as the router to forward incoming and cross subnet traffic inside the virtual network
    - VPN device – Act as the cross premises VPN gateways for cross premises VPN connectivity between customer on premises networks and Azure virtual networks
    - VPN server – Act as VPN servers to accept VPN clients connecting to Azure virtual networks

>[Azure.Best Practice] Maintain the individuals authorized to access the DMZ security gear completely different from the individuals authorized as application development/deployment/operations administrators. Keeping these groups separate allows for a segregation of duties and prevents a single person from bypassing both applications security and network security controls.

### Incorporating Hybrid Networks (On-Prem) with a DMZ architecture
Azure Virtual Networks are often used to extend traditional on-premise networks. It is possible to incorporate either Site-to-Site or ExpressRoute hybrid networking solutions with DMZ architectures.

When discussing “Azure Networks” in this section, unless specifically mentioned, all networks (networks, virtual networks, or subnets) are referencing private Azure Virtual Networks created by a subscription administrator and are not discussing the underlying physical networks within Azure.

When building a network with a DMZ and multiple security boundaries three critical questions must be answered.

#### How Many Boundaries are needed?
The first decision point is to decide how many security boundaries are needed in a given scenario:

- A single boundary - One on the front end DMZ between the virtual network and the internet.
- Two boundaries - One on the Internet side of the DMZ network, another between the DMZ subnet and the back end subnets in the Azure virtual networks
- Three boundaries – On the internet side of the DMZ, between the DMZ and back end subnets, and between the back end subnets and the on-premise network
- N boundaries – depending on the security requirements there is no end to the number of security boundaries that can be applied in a given network.

The number and type of boundaries needed will vary based on a company’s risk tolerance and the specific scenario being implemented. This is often a joint decision made by multiple groups within an organization, often a Risk & Compliance team, a network/platform team, and an application team. People with knowledge of security, the data involved, and the technologies being used should have a say in this decision to ensure the appropriate security stance for each implementation.

>[Azure.Best Practice] Use the smallest number of boundaries that satisfy the security requirements for a given situation. With more boundaries the more difficult operations and troubleshooting can be, as well as the management overhead involved with managing the multiple boundary policies over time. However, insufficient boundaries increase risk. Finding the balance is critical.

![Hybrid Network with Three Security Boundaries][6]

The figure above shows a high-level view of a three security boundary network, with a boundary between the DMZ and the Internet, between the Azure front end and back end private subnets, and between the Azure back end subnet and the on-premises corporate network.

#### Where are the Boundaries Located?
Once the number of boundaries are decided, where to implement them is the next decision point. There are generally three choices; 1) Using an Internet-based intermediary service (e.g. cloud based WAF, which is not discussed in this document), 2) Using native features and/or network virtual appliances in Azure, 3) using physical devices on the on-premise network.

On purely Azure networks, the options are native Azure features (e.g. Azure Load Balancers) or network virtual appliances from Azure’s rich partner ecosystem (e.g. Check Point firewalls).

If a boundary is needed between Azure and an on-premise network, the security devices can reside on either side of the connection (or both sides). Thus a decision must be made on the location to place security gear.

In the figure above, the Internet-to-DMZ and the Frontend-to-Backend boundaries are entirely contained within Azure, and must be either native Azure features or network virtual appliances. Security devices on the boundary between Azure (back end subnet) and the Corporate Network could be either on the Azure side or the on-premise side, or even a combination of devices on both sides. There can be significant advantages and disadvantages to either option that must be seriously considered.

For example, using existing physical security gear on the on-premise network side. Pro: no new gear is needed, just new configuration. Con: all traffic must come back from Azure to the on-premise network to be seen by the security gear. Thus Azure to Azure traffic could incur significant latency and affect application performance and user experience if it was forced back to the on-premise network for security policy enforcement.

#### How are the Boundaries Implemented?
Each security boundary will likely have different capability requirements (e.g. IDS and Firewall rules on the internet side of the DMZ, but only ACLs between the DMZ and back end subnet). Deciding which devices to use will depend on the scenario and security requirements. DMZ Examples 1 and 2 below discuss some options that could be used. Reviewing the Azure native network features and the devices available in Azure from the partner ecosystem will expose the myriad options available to solve virtually any scenario.

Another key implementation decision point is how to connect the on-premise network with Azure. Via the Azure Virtual Gateway or a network virtual appliance. These options are described and discussed in greater detail in Examples 3 and 4 below.

## Building a DMZ in Azure Virtual Network
### DMZ Example 1 – Protecting your web application with a Firewall and NSG’s for inbound traffic

![Inbound DMZ with NVA and NSG][7]

#### Environment Description
In this example there is a subscription that contains the following:

- Two cloud services: “FrontEnd001” and “BackEnd001”
- A Virtual Network, “CorpNetwork”, with two subnets; “FrontEnd” and “BackEnd”
- A single Network Security Group that is applied to both subnets
- A network virtual appliance, in this example a Barracuda NG firewall, connected to the Frontend subnet
- A Windows Server that represents an application web server (“IIS01”)
- Two windows servers that represent application back end servers (“AppVM01”, “AppVM02”)
- A Windows server that represents a DNS server (“DNS01”)

There are further details to build this example (it provides both scripts and an ARM template) located at: <span style="color:red;font-weight:bold;">[URL]</span>

#### Network Security Group (NSG) Description
In this example, a NSG group is built and then loaded with six rules. Generally speaking, you should create your specific “Allow” rules first and then the more generic “Deny” rules last. The given priority dictates which rules are evaluated first. Once traffic is found to apply to a specific rule, no further rules are evaluated. Declaratively the following rules are being built:

1.	Internal DNS traffic (port 53) is allowed
2.	RDP traffic (port 3389) from the Internet to any VM is allowed
3.	Any internet traffic (all ports) to the NVA (Firewall) is allowed
4.	Any traffic (all ports) from IIS01 to AppVM1 is allowed
5.	Any traffic (all ports) from the Internet to the entire VNet (both subnets) is Denied
6.	Any traffic (all ports) from the Frontend subnet to the Backend subnet is Denied

With these rules set, if an HTTP request was inbound from the Internet to the Firewall, both rules 3 (allow) and 5 (deny) would apply, but since rule 3 has a higher priority only it would apply and rule 5 would not come into play. Thus the HTTP request would be allowed to the firewall. If that same traffic was trying to reach the IIS01 server, even though it’s on the Frontend subnet, rule 5 (Deny) would apply and the traffic would not be allowed to pass to the server. Rule 6 (Deny) blocks the Frontend subnet from talking to the Backend subnet (except for allowed traffic in rules 1 and 4), this protects the Backend network in case an attacker compromises the web application on the Frontend, the attacker would have limited access to the Backend “protected” network (only to resources exposed on the AppVM01 server).

There is a default outbound rule that allows traffic out to the internet. For this example, we’re allowing outbound traffic and not modifying any outbound rules. To lock down traffic in both directions, User Defined Routing is required, this is explored in “DMZ Example 2” below.

#### Firewall Rule Description
On the firewall, forwarding rules will need to be created. Since this example only routes internet traffic in-bound to the firewall and then to the web server, only one forwarding NAT rule is needed.

The forwarding rule will accept any inbound source address that hits the Firewall trying to reach HTTP (port 80 or 443 for HTTPS) and will be sent out the Firewall’s local interface and redirected to the Web Server with the IP Address of 10.0.1.5.

#### Conclusion
This is a relatively simple and straight forward way of protecting your application from inbound traffic. More information on this example such as the following:

- How to build this example DMZ with PowerShell scripts
- How to build this example with an ARM template
- Detailed descriptions of each NSG command and Firewall rule
- Detailed traffic flow scenarios, showing how traffic is allowed or denied in each layer can be found at <span style="color:red;font-weight:bold;">[URL]</span>.

### DMZ Example 2 – Protecting your network with a Firewall, UDR and NSG for bi-directional traffic

![Bi-directional DMZ with NVA, NSG, and UDR][8]

#### Environment Setup
In this example there is a subscription that contains the following:

- Three cloud services: “SecSvc001”, “FrontEnd001”, and “BackEnd001”
- A Virtual Network, “CorpNetwork”, with three subnets; “SecNet”, “FrontEnd”, and “BackEnd”
- A network virtual appliance, in this example a Barracuda NG Firewall, connected to the SecNet subnet
- A Windows Server that represents an application web server (“IIS01”)
- Two windows servers that represent application back end servers (“AppVM01”, “AppVM02”)
- A Windows server that represents a DNS server (“DNS01”)

There are further details to build this example (it provides both scripts and an ARM template) located at: <span style="color:red;font-weight:bold;">[URL]</span>

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
In this example, two routing tables are created, one each for the Frontend and Backend subnets. Each table is loaded with static routes appropriate for the given subnets. For the purpose of this example, each table has one route that directs all traffic (0.0.0.0/0) through the Firewall (Next hop = Virtual Appliance IP address). Once the routing tables are created they are bound to their subnets. Where with NSG, we can use the same group with multiple subnets, with UDR a route table can only be assigned to one subnet. Once created and bound, the routing table would look as follows:


        Effective routes : 
         Address Prefix    Next hop type    Next hop IP address Status   Source     
         --------------    -------------    ------------------- ------   ------     
         {10.0.0.0/16}     VNETLocal                            Active   Default    
         {0.0.0.0/0}       VirtualAppliance 10.0.0.4            Active

>[AZURE.NOTE] There are current limitations with UDR and hybrid networks. This is being resolved in a future release, an example of how to enable your DMZ with ExpressRoute or Site-to-Site networking are discussed below in “DMZ Example 3 – DMZ with Hybrid Networks”

#### IP Forwarding Description
A companion feature to UDR, is IP Forwarding. This is a setting on a Virtual Appliance that allows it to receive traffic not specifically addressed to the appliance and then forward that traffic to its ultimate destination.

As an example, if traffic from AppVM01 makes a request to the DNS01 server, UDR would route this to the firewall. With IP Forwarding enabled, the traffic for the DNS01 destination (10.0.2.4) will be accepted by the appliance (10.0.0.4) and then forwarded to its ultimate destination (10.0.2.4). Without IP Forwarding enabled on the Firewall, traffic would not be accepted by the appliance even though the route table has the firewall as the next hop. To use a virtual appliance, it’s critical to remember to enable IP Forwarding in conjunction with User Defined Routing.

#### Network Security Group (NSG) Description
In this example, a NSG group is built and then loaded with a single rule. This group is then bound only to the Frontend and Backend subnets (not the SecNet). Declaratively the following rule is being built:

1.	Any traffic (all ports) from the Internet to the entire VNet (all subnets) is Denied

Although NSGs are used in this example, it’s main purpose is as a second layer of defense against manual misconfiguration. We want to block all inbound traffic from the internet to either the Frontend or Backend subnets, traffic should only flow through the SecNet subnet to the firewall (and then if appropriate on to the Frontend or Backend subnets). Plus, with the UDR rules in place, any traffic that did make it into the Frontend or Backend subnets would be directed out to the firewall (thanks to UDR). The firewall would see this as an asymmetric flow and would drop the outbound traffic. Thus there are three layers of security protecting the Frontend and Backend subnets; 1) no endpoints on the FrontEnd001 and BackEnd001 cloud services, 2) NSG’s denying traffic from the Internet, 3) the firewall dropping asymmetric traffic.

One interesting point regarding the Network Security Group in this example is that it contains only one rule, which is to deny internet traffic to the entire virtual network which would include the Security subnet. However, since the NSG is only bound to the Frontend and Backend subnets, the rule isn’t processed on traffic inbound to the Security subnet. As a result, even though the NSG rule says no Internet traffic to any address on the VNet, because the NSG was never bound to the Security subnet, traffic will flow to the Security subnet.

#### Firewall Rules
On the firewall, forwarding rules will need to be created. Since the firewall is blocking or forwarding all inbound, outbound, and intra-VNet traffic many firewall rules are needed. Also, all inbound traffic will hit the Security Service public IP address (on different ports), to be processed by the firewall. A best practice is to diagram the logical flows before setting up the subnets and firewall rules to avoid rework later. The following figure is a logical view of the firewall rules for this example:
 
![Logical View of the Firewall Rules][9]

>[AZURE.NOTE] Based on the Network Virtual Appliance used the management ports will vary. In this example a Barracuda Firewall is referenced which uses ports 22, 801, and 807. Please consult the appliance vendor documentation to find the exact ports used for management of the device being used.

#### Firewall Rules Description
In the logical diagram above, the security subnet is not shown since the firewall is the only resource on that subnet, and this diagram is showing the firewall rules and how they logically allow or deny traffic flows and not that actual routed path. Also, the external ports selected for the RDP traffic are higher ranged ports (8014 – 8026) and were selected to somewhat align with the last two octets of the local IP address for easier readability (e.g. local server address 10.0.1.4 is associated with external port 8014), however any higher non-conflicting ports could be used.

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
- Failsafe Rule (for traffic that doesn’t meet any of the above):
  7.	Deny All Traffic Rule: This should always be the final rule (in terms of priority), and as such if a traffic flows fails to match any of the preceding rules it will be dropped by this rule. This is a default rule and usually activated, no modifications are generally needed.

>[AZURE.Best Practice] On the second application traffic rule, any port is allowed for easy of this example, in a real scenario the most specific port and address ranges should be used to reduce the attack surface of this rule.

Once all of the above rules are created, it’s important to review the priority of each rule to ensure traffic will be allowed or denied as desired. For this example, the rules are in priority order.

#### Conclusion
This is a more complex but more complete way of protecting the network (the previous example was protecting just the application). This design allows for monitoring traffic in both direction and protects not just the inbound application server but enforces network security policy for all servers on this network. Also, depending on the appliance used, full traffic auditing and awareness can be achieved. More information on this example such as the following:

- How to build this example DMZ with PowerShell scripts
- How to build this example with an ARM template
- Detailed descriptions of each UDR, NSG command, and Firewall rule
- Detailed traffic flow scenarios, showing how traffic is allowed or denied in each layer can be found at <span style="color:red;font-weight:bold;">[URL]</span>.

### DMZ Example 3 – DMZ with Hybrid Networks and a Network Virtual Appliance

![DMZ with NVA connected hybrid network][10]

#### Environment Setup
Hybrid networking using a Network Virtual Appliance (NVA) can be added to either DMZ type described in Example 1 or 2.

As shown in the figure above, one of two options may be used to connect an on-premise network to an Azure Virtual Network via a Network Virtual Appliance:

1.	VPN connection over the Internet (Site-to-Site)
2.	VPN connection over a dedicated network (ExpressRoute Public Peering)

>[AZURE.Best Practice] Using the ExpressRoute option keeps the corporate network traffic off of the internet for better security and performance, and allows for SLAs from your ExpressRoute provider.

With this option the NVA becomes the central “hub” for all networks and subnets. The firewall forwarding rules determine which traffic flows are allowed, are NAT’d, are redirected, or are dropped (even for traffic flows between the on-premise network and Azure).

This should be considered carefully as traffic flows can be optimized or degraded by this design pattern depending on the specific use case.

Using the environment built in DMZ Example 2 – Protecting your network with a Firewall, UDR and NSG for bi-directional traffic, and then adding a hybrid network would produce the following design:

![DMZ with NVA connected using a Site-to-Site VPN][11]

Logically to the NVA, the network looks like four separate “security zones” with the rules on the NVA the primary director of traffic between these zones. This would look logically as:

![Logical Network from NVA perspective][12]
 
### DMZ Example 4 – DMZ with Hybrid Networks and a Virtual Gateway

![DMZ with Gateway connected hybrid network][13]

#### Environment Setup
Hybrid networking using an Azure Virtual Gateway can be added to either DMZ type described in Example 1 and 2.

>[AZURE.Note] There is a limitation using User Defined Routing (UDR) and ExpressRoute due to the complexity of dynamic routing used on the Azure Virtual Gateway. This capability will be enabled in a future Azure release.

As shown in the figure above, one of two options may be used to connect an on-premise network to an Azure Virtual Network via an Azure Virtual Gateway:

1.	A VPN connection over the Internet (Site-to-Site)
2.	A direct connection (ExpressRoute)

>[AZURE.Best Practice] Using the ExpressRoute option keeps the corporate network traffic off of the internet for better security and performance, and allows for SLAs from your ExpressRoute provider.

With this option the environment now has two network edges, the NVA controls traffic flows for intra-Azure networks and between Azure and the internet, while the gateway is a completely separate and isolated network edge between on-premises and Azure.

This should be considered carefully as traffic flows can be optimized or degraded by this design pattern depending on the specific use case.

Using the environment built in DMZ Example 1 – Protecting your web application with a Firewall and NSG’s for inbound traffic, and then adding an ExpressRoute hybrid network connection would produce the following design:

![DMZ with Gateway connected using an ExpressRoute connection][14]

## References
### Helpful Websites and Documentation
- Accessing Azure with PowerShell (the scripts in this document assume the certificate method is used): https://azure.microsoft.com/en-us/documentation/articles/powershell-install-configure/
- Virtual Networking Documentation: https://azure.microsoft.com/en-us/documentation/services/virtual-network/
- Network Security Group Documentation: https://azure.microsoft.com/en-us/documentation/articles/virtual-networks-nsg/
- User Defined Routing Documentation: https://azure.microsoft.com/en-us/documentation/articles/virtual-networks-udr-overview/
- Azure Virtual Gateways: https://azure.microsoft.com/en-us/documentation/services/vpn-gateway/
- Site-to-Site VPNs: https://azure.microsoft.com/en-us/documentation/articles/vpn-gateway-site-to-site-create/
- ExpressRoute Documentation (be sure to check out the “Getting Started” and “How To” sections): https://azure.microsoft.com/en-us/documentation/services/expressroute/ 

<!--Image Reference-->
[1]: ./media/best-practices-network-security/ComplianceBadges.png "Azure Compliance Badges"
[2]: ./media/best-practices-network-security/AzureSecurityFeatures.png "Azure Security Features"
[3]: ./media/best-practices-network-security/DMZCorporate.png "A DMZ in a Corporate network"
[4]: ./media/best-practices-network-security/AzureSecurityArchitecture.png "Azure Security Architecture"
[5]: ./media/best-practices-network-security/DMZAzure.png "A DMZ in an Azure Virtual Network"
[6]: ./media/best-practices-network-security/DMZHybrid.png "Hybrid Network with Three Security Boundaries"
[7]: ./media/best-practices-network-security/Example1Design.png "Inbound DMZ with NVA and NSG"
[8]: ./media/best-practices-network-security/Example2Design.png "Bi-directional DMZ with NVA, NSG, and UDR"
[9]: ./media/best-practices-network-security/Example2FirewallLogical.png "Logical View of the Firewall Rules"
[10]: ./media/best-practices-network-security/Example3DesignOptions.png "DMZ with NVA connected hybrid network"
[11]: ./media/best-practices-network-security/Example3DesignS2S.png "DMZ with NVA connected using a Site-to-Site VPN"
[12]: ./media/best-practices-network-security/Example3NetworkLogical.png "Logical Network from NVA perspective"
[13]: ./media/best-practices-network-security/Example4DesignOptions.png "DMZ with Gateway connected hybrid network"
[14]: ./media/best-practices-network-security/Example4DesignExpressRoute.png "DMZ with Gateway connected using an ExpressRoute connection"
