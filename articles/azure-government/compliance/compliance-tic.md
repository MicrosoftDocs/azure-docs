---
title: Trusted Internet Connections guidance
description: Learn about Trusted Internet Connections (TIC) guidance for Azure IaaS and PaaS services
author: anaharris-ms
ms.author: anaharris 
ms.service: azure-government
ms.topic: article
recommendations: false
ms.date: 06/28/2022
---

# Trusted Internet Connections guidance

This article explains how you can use security features in Azure cloud services to help achieve compliance with the Trusted Internet Connections (TIC) initiative. It applies to both Azure and Azure Government cloud service environments, and covers TIC implications for Azure infrastructure as a service (IaaS) and Azure platform as a service (PaaS) cloud service models.

## Trusted Internet Connections overview

The purpose of the TIC initiative is to enhance network security across the US federal government. This objective was initially realized by consolidating external connections and routing all network traffic through approved devices at TIC access points. In the intervening years, cloud computing became well established, paving the way for modern security architectures and a shift away from the primary focus on perimeter security. Accordingly, the TIC initiative evolved to provide federal agencies with increased flexibility to use modern security capabilities.

### TIC 2.0 guidance

The TIC initiative was originally outlined in the Office of Management and Budget (OMB) [Memorandum M-08-05](https://georgewbush-whitehouse.archives.gov/omb/memoranda/fy2008/m08-05.pdf) released in November 2007, and referred to in this article as TIC 2.0 guidance. The TIC program was envisioned to improve federal network perimeter security and incident response functions. TIC was originally designed to perform network analysis of all inbound and outbound .gov traffic. The goal was to identify specific patterns in network data flows and uncover behavioral anomalies, such as botnet activity. Agencies were mandated to consolidate their external network connections and route all traffic through intrusion detection and prevention devices known as EINSTEIN. The devices are hosted at a limited number of network endpoints, which are referred to as *trusted internet connections*.

The objective of TIC is for agencies to know:

- Who is on my network (authorized or unauthorized)?
- When is my network accessed and why?
- What resources are accessed?

Under TIC 2.0, all agency external connections must route through an OMB-approved TIC. Federal agencies are required to participate in the TIC program as a TIC Access Provider (TICAP), or by contracting services with one of the major Tier 1 internet service providers. These providers are referred to as Managed Trusted Internet Protocol Service (MTIPS) providers. TIC 2.0 includes mandatory critical capabilities that are performed by the agency and MTIPS provider. In TIC 2.0, the EINSTEIN version 2 intrusion detection and EINSTEIN version 3 accelerated (3A) intrusion prevention devices are deployed at each TICAP and MTIPS. The agency establishes a *Memorandum of Understanding* with the Department of Homeland Security (DHS) to deploy EINSTEIN capabilities to federal systems.

As part of its responsibility to protect the .gov network, DHS requires the raw data feeds of agency net flow data to correlate incidents across the federal enterprise and perform analyses by using specialized tools. DHS routers enable collection of IP network traffic as it enters or exits an interface. Network administrators can analyze the net flow data to determine the source and destination of traffic, the class of service, and other parameters. Net flow data is considered to be "non-content data" similar to the header, source IP, destination IP, and so on. Non-content data allows DHS to learn about the content: who was doing what and for how long.

The TIC 2.0 initiative also includes security policies, guidelines, and frameworks that assume an on-premises infrastructure. Government agencies move to the cloud to achieve cost savings, operational efficiency, and innovation. However, the implementation requirements of TIC 2.0 can slow down network traffic. The speed and agility with which government users can access their cloud-based data is limited as a result.

### TIC 3.0 guidance

In September 2019, OMB released [Memorandum M-19-26](https://www.whitehouse.gov/wp-content/uploads/2019/09/M-19-26.pdf) that rescinded prior TIC-related memorandums and introduced [TIC 3.0 guidance](https://www.cisa.gov/resources-tools/programs/trusted-internet-connections-tic). The previous OMB memorandums required agency traffic to flow through a physical TIC access point, which has proven to be an obstacle to the adoption of cloud-based infrastructure. For example, TIC 2.0 focused exclusively on perimeter security by channeling all incoming and outgoing agency data through a TIC access point. In contrast, TIC 3.0 recognizes the need to account for multiple and diverse security architectures rather than a single perimeter security approach. This flexibility allows agencies to choose how to implement security capabilities in a way that fits best into their overall network architecture, risk management approach, and more.

To enable this flexibility, the Cybersecurity & Infrastructure Security Agency (CISA) works with federal agencies to conduct pilots in diverse agency environments, which result in the development of TIC 3.0 use cases. For TIC 3.0 implementations, CISA encourages agencies to use [TIC 3.0 Core Guidance Documents](https://www.cisa.gov/publication/tic-30-core-guidance-documents) with the National Institute of Standards and Technology (NIST) [Cybersecurity Framework](https://www.nist.gov/cyberframework) (CSF) and [NIST SP 800-53](https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final) *Security and Privacy Controls for Federal Information Systems and Organizations*. These documents can help agencies design a secure network architecture and determine appropriate requirements from cloud service providers.

TIC 3.0 complements other federal initiatives focused on cloud adoption such as the Federal Risk and Authorization Management Program (FedRAMP), which is based on the NIST SP 800-53 standard augmented by FedRAMP controls and control enhancements. Agencies can use existing Azure and Azure Government [FedRAMP High](/azure/compliance/offerings/offering-fedramp) provisional authorizations to operate (P-ATO) issued by the FedRAMP Joint Authorization Board. They can also use Azure and Azure Government support for the [NIST CSF](/azure/compliance/offerings/offering-nist-csf). To assist agencies with TIC 3.0 implementation when selecting cloud-based security capabilities, CISA has mapped TIC capabilities to the NIST CSF and NIST SP 800-53. For example, TIC 3.0 security objectives can be mapped to the five functions of the NIST CSF, including Identify, Protect, Detect, Respond, and Recover. The TIC security capabilities are mapped to the NIST CSF in the TIC 3.0 Security Capabilities Catalog available from [TIC 3.0 Core Guidance Documents](https://www.cisa.gov/publication/tic-30-core-guidance-documents).

TIC 3.0 is a non-prescriptive cybersecurity guidance developed to provide agencies with flexibility to implement security capabilities that match their specific risk tolerance levels. While the guidance requires agencies to comply with all applicable telemetry requirements such as the National Cybersecurity Protection System (NCPS) and Continuous Diagnosis and Mitigation (CDM), TIC 3.0 currently only requires agencies to self-attest on their adherence to the TIC guidance.

With TIC 3.0, agencies can maintain the legacy TIC 2.0 implementation that uses TIC access points while adopting TIC 3.0 capabilities. CISA provided guidance on how to implement the traditional TIC model in TIC 3.0, known as the [Traditional TIC Use Case](https://www.cisa.gov/publication/tic-30-core-guidance-documents).

The rest of this article provides guidance that is pertinent to Azure capabilities needed for legacy TIC 2.0 implementations; however, some of this guidance is also useful for TIC 3.0 requirements.

## Azure networking options

There are four main options to connect to Azure services:

- **Direct internet connection** – Connect to Azure services directly through an open internet connection. The medium and the connection are public. Application and transport-level encryption are relied on to ensure data protection. Bandwidth is limited by a site's connectivity to the internet. Use more than one active provider to ensure resiliency.
- **Virtual Private Network (VPN)** – Connect to your Azure virtual network privately by using a VPN gateway. The medium is public because it traverses a site's standard internet connection, but the connection is encrypted in a tunnel to ensure data protection. Bandwidth is limited depending on the VPN devices and the configuration you choose. Azure point-to-site connections usually are limited to 100 Mbps. Site-to-site connections range from 100 Mbps to 10 Gbps.
- **Azure ExpressRoute** – ExpressRoute is a direct connection to Microsoft services. ExpressRoute uses a provider at a peering location to connect to Microsoft Enterprise edge routers. ExpressRoute uses different peering types for IaaS and PaaS/SaaS services, private peering and Microsoft peering. Bandwidth ranges from 50 Mbps to 10 Gbps.
- **Azure ExpressRoute Direct** – ExpressRoute Direct allows for direct fiber connections from your edge to the Microsoft Enterprise edge routers at the peering location. ExpressRoute Direct removes a third-party connectivity provider from the required hops. Bandwidth ranges from 10 Gbps to 100 Gbps. 

To enable the connection from the *agency* to Azure or Microsoft 365, without routing traffic through the agency TIC, the agency must use:

- An encrypted tunnel, or
- A dedicated connection to the cloud service provider (CSP).

The CSP services can ensure that connectivity to the agency cloud assets isn't offered via the public Internet for direct agency personnel access.

For Azure only, the second option (VPN) and third option (ExpressRoute) can meet these requirements when they're used with services that limit access to the Internet.

Microsoft 365 is compliant with TIC guidance by using either [ExpressRoute with Microsoft Peering](../../expressroute/expressroute-circuit-peerings.md) enabled or an Internet connection that encrypts all traffic by using the Transport Layer Security (TLS) 1.2. Agency end users on the agency network can connect via their agency network and TIC infrastructure through the Internet. All remote Internet access to Microsoft 365 is blocked and routes through the agency.

:::image type="content" source="./media/tic-diagram-a.png" alt-text="Azure networking options for TIC compliance" border="false":::

## Azure IaaS offerings

Compliance with TIC policy by using Azure IaaS is relatively simple because Azure customers manage their own virtual network routing.

The main requirement to help assure compliance with the TIC 2.0 reference architecture is to ensure your virtual network is a private extension of the agency network. To be a *private* extension, the policy requires that no traffic is allowed to leave your network except via the on-premises TIC network connection. This process is known as *forced tunneling*. For TIC 2.0 compliance, the process routes all traffic from any system in the CSP environment through an on-premises gateway on an organization's network out to the Internet through the TIC.

Azure IaaS TIC compliance is divided into two major steps:

- Step 1: Configuration
- Step 2: Auditing

### Azure IaaS TIC compliance: Configuration

To configure a TIC-compliant architecture with Azure, you must first prevent direct Internet access to your virtual network, and then force Internet traffic through the on-premises network.

#### Prevent direct Internet access

Azure IaaS networking is conducted via virtual networks that are composed of subnets to which the network interface cards (NICs) of virtual machines are associated.

The simplest scenario to support TIC compliance is to assure that a virtual machine, or a collection of virtual machines, can't connect to any external resources. You can assure the disconnection from external networks by using network security groups. Use network security groups to control traffic to one or more NICs or subnets in your virtual network. A network security group contains access control rules that allow or deny traffic based on traffic direction, protocol, source address and port, and destination address and port. You can change the rules of a network security group at any time, and changes are applied to all associated instances. To learn more about how to create a network security group, see [Filter network traffic with a network security group](../../virtual-network/tutorial-filter-network-traffic.md).

#### Force Internet traffic through an on-premises network

Azure automatically creates system routes and assigns the routes to each subnet in a virtual network. You can't create or remove system routes, but you can override system routes with custom routes. Azure creates default system routes for each subnet. Azure adds optional default routes to specific subnets, or every subnet, when you use specific Azure capabilities. This type of routing ensures:

- Traffic that's destined within the virtual network stays within the virtual network.
- Internet Assigned Numbers Authority (IANA)-designated private address spaces like 10.0.0.0/8 are dropped, unless they're included in the virtual network address space.
- *Last-resort* routing of 0.0.0.0/0 to the virtual network Internet endpoint.

:::image type="content" source="./media/tic-diagram-c.png" alt-text="TIC force tunneling" border="false":::

All traffic that leaves the virtual network needs to route through the on-premises connection, to ensure that all traffic traverses the agency TIC. You create custom routes by creating user-defined routes, or by exchanging Border Gateway Protocol (BGP) routes between your on-premises network gateway and an Azure VPN gateway.

- For more information about user-defined routes, see [Virtual network traffic routing: User-defined routes](../../virtual-network/virtual-networks-udr-overview.md#user-defined).
- For more information about the BGP, see [Virtual network traffic routing: Border Gateway Protocol](../../virtual-network/virtual-networks-udr-overview.md#border-gateway-protocol).

#### Add user-defined routes

If you use a route-based virtual network gateway, you can use forced tunneling in Azure. Add a user-defined route that sets 0.0.0.0/0 traffic to route to a **next hop** of your virtual network gateway. Azure prioritizes user-defined routes over system-defined routes. All non-virtual network traffic is sent to your virtual network gateway, which can then route the traffic to on-premises. After you define the user-defined route, associate the route with existing subnets or new subnets within all virtual networks in your Azure environment.

:::image type="content" source="./media/tic-diagram-d.png" alt-text="User-defined routes and TIC" border="false":::

#### Use the Border Gateway Protocol

If you use ExpressRoute or a BGP-enabled virtual network gateway, BGP is the preferred mechanism for advertising routes. For a BGP advertised route of 0.0.0.0/0, ExpressRoute and BGP-aware virtual network gateways ensure the default route applies to all subnets within your virtual networks.

### Azure IaaS TIC compliance: Auditing

Azure offers several ways to audit TIC compliance.

#### View effective routes

Confirm your default route propagation by observing the *effective routes* for a particular virtual machine, a specific NIC, or a user-defined route table in the [Azure portal](../../virtual-network/diagnose-network-routing-problem.md#diagnose-using-azure-portal) or in [Azure PowerShell](../../virtual-network/diagnose-network-routing-problem.md#diagnose-using-powershell). The **Effective Routes** show the relevant user-defined routes, BGP advertised routes, and system routes that apply to the relevant entity, as shown in the following figure:

:::image type="content" source="./media/tic-screen-1.png" alt-text="Effective routes" border="false":::

> [!NOTE]
> You can't view the effective routes for a NIC, unless the NIC is associated with a running virtual machine.

#### Use Azure Network Watcher

Network Watcher offers several tools to audit TIC compliance. For more information, see [Azure Network Watcher overview](../../network-watcher/network-watcher-monitoring-overview.md).

##### Capture network security group flow logs 

Use Network Watcher to capture network flow logs that indicate the metadata that surrounds IP traffic. The network flow logs contain the source and destination addresses of targets, and other data. You can use this data with logs from the virtual network gateway, on-premises edge devices, or the TIC, to monitor that all traffic routes on-premises. 

## Azure PaaS offerings

Azure PaaS services, such as Azure Storage, are accessible through an internet-reachable URL. Anyone with approved credentials can access the resource, such as a storage account, from any location without traversing a TIC. For this reason, many government customers incorrectly conclude that Azure PaaS services aren't compliant with TIC 2.0 policies. However, many Azure PaaS services can be compliant with TIC 2.0 policy. A service is compliant when the architecture is the same as the TIC-compliant IaaS environment ([as previously described](#azure-iaas-offerings)) and the service is attached to an Azure virtual network.

When Azure PaaS services are integrated with a virtual network, the service is privately accessible from that virtual network. You can apply custom routing for 0.0.0.0/0 via user-defined routes or BGP. Custom routing ensures that all Internet-bound traffic routes on-premises to traverse the TIC. Integrate Azure services into virtual networks by using the following patterns:

- **Deploy a dedicated instance of a service** – An increasing number of PaaS services are deployable as dedicated instances with virtual network-attached endpoints, sometimes called *VNet injection*. You can deploy an App Service Environment in *isolated mode* to allow the network endpoint to be constrained to a virtual network. The App Service Environment can then host many Azure PaaS services, such as Web Apps, API Management, and Functions. For more information, see [Deploy dedicated Azure services into virtual networks](../../virtual-network/virtual-network-for-azure-services.md).
- **Use virtual network service endpoints** – An increasing number of PaaS services allow the option to move their endpoint to a virtual network private IP instead of a public address. For more information, see [Virtual Network service endpoints](../../virtual-network/virtual-network-service-endpoints-overview.md).
- **Use Azure Private Link** – Provide a shared service with a private endpoint in your virtual network. Traffic between your virtual network and the service travels across the Microsoft backbone network and doesn't traverse the public Internet. For more information, see [Azure Private Link](../../private-link/private-link-overview.md).

### Virtual network integration details

The following diagram shows the general network flow for access to Azure PaaS services. Access is shown from both virtual network injection and virtual network service tunneling. For more information about network service gateways, virtual networks, and service tags, see [Virtual network service tags](../../virtual-network/service-tags-overview.md).

:::image type="content" source="./media/tic-diagram-e.png" alt-text="PaaS connectivity options for TIC" border="false":::

1. A private connection is made to Azure by using ExpressRoute. ExpressRoute private peering with forced tunneling is used to force all customer virtual network traffic over ExpressRoute and back to on-premises. Microsoft Peering isn't required.
2. Azure VPN Gateway, when used with ExpressRoute and Microsoft Peering, can overlay end-to-end IPSec encryption between the customer virtual network and the on-premises edge. 
3. Network connectivity to the customer virtual network is controlled by using network security groups that allow customers to permit/deny traffic based on IP, port, and protocol.
4. Traffic to and from the customer private virtual network is monitored through Azure Network Watcher and data is analyzed using Log Analytics and Microsoft Defender for Cloud.
5. The customer virtual network extends to the PaaS service by creating a service endpoint for the customer's service.
6. The PaaS service endpoint is secured to **default deny all** and to only allow access from specified subnets within the customer virtual network. Securing service resources to a virtual network provides improved security by fully removing public Internet access to resources and allowing traffic only from your virtual network.
7. Other Azure services that need to access resources within the customer virtual network should either be:  
   - Deployed directly into the virtual network, or
   - Allowed selectively based on the guidance from the respective Azure service.

#### Option A: Deploy a dedicated instance of a service (virtual network injection)

Virtual network injection enables customers to selectively deploy dedicated instances of a given Azure service, such as HDInsight, into their own virtual network. Service instances are deployed into a dedicated subnet in a customer's virtual network. Virtual network injection allows access to service resources through the non-internet routable addresses. On-premises instances use ExpressRoute or a site-to-site VPN to directly access service instances via virtual network address space, instead of opening a firewall to public internet address space. When a dedicated instance is attached to an endpoint, you can use the same strategies as for IaaS TIC compliance. Default routing ensures Internet-bound traffic is redirected to a virtual network gateway that's bound for on-premises. You can further control inbound and outbound access through network security groups for the given subnet.

:::image type="content" source="./media/tic-diagram-f.png" alt-text="Virtual network injection overview" border="false":::

#### Option B: Use virtual network service endpoints (service tunnel)

An increasing number of Azure multi-tenant services offer *service endpoints*. Service endpoints are an alternate method for integrating to Azure virtual networks. Virtual network service endpoints extend your virtual network IP address space and the identity of your virtual network to the service over a direct connection. Traffic from the virtual network to the Azure service always stays within the Azure backbone network. 

After you enable a service endpoint for a service, use policies exposed by the service to restrict connections for the service to that virtual network. Access checks are enforced in the platform by the Azure service. Access to a locked resource is granted only if the request originates from the allowed virtual network or subnet, or from the two IPs that are used to identify your on-premises traffic if you use ExpressRoute. Use this method to effectively prevent inbound/outbound traffic from directly leaving the PaaS service.

:::image type="content" source="./media/tic-diagram-g.png" alt-text="Service endpoints overview" border="false":::

#### Option C: Use Azure Private Link

You can use [Azure Private Link](../../private-link/private-link-overview.md) to access Azure PaaS services and Azure-hosted customer or partner services over a [private endpoint](../../private-link/private-endpoint-overview.md) in your virtual network, ensuring that traffic between your virtual network and the service travels across the Microsoft global backbone network. This approach eliminates the need to expose the service to the public Internet. You can also create your own [private link service](../../private-link/private-link-service-overview.md) in your own virtual network and deliver it to your customers.

Azure private endpoint is a network interface that connects you privately and securely to a service powered by Azure Private Link. Private endpoint uses a private IP address from your virtual network, effectively bringing the service into your virtual network.

## Tools for network situational awareness

Azure provides cloud-native tools to help ensure that you have the situational awareness that's required to understand the traffic flows of your network. The tools aren't required for compliance with TIC policy. However, the tools can vastly improve your security capabilities.

### Azure Policy

[Azure Policy](../../governance/policy/overview.md) is an Azure service that provides your organization with better ability to audit and enforce compliance initiatives. You can plan and test your Azure Policy rules now to assure future TIC compliance.

Azure Policy is targeted at the subscription level. The service provides a centralized interface where you can perform compliance tasks, including:

- Manage initiatives
- Configure policy definitions
- Audit compliance
- Enforce compliance
- Manage exceptions

Along with many [built-in policy definitions](../../governance/policy/samples/built-in-policies.md), administrators can define their own custom definitions by using simple JSON templates. Microsoft recommends the prioritization of auditing over enforcement, where possible.

### Network Watcher traffic analytics

Network Watcher [traffic analytics](../../network-watcher/traffic-analytics.md) consume flow log data and other logs to provide a high-level overview of network traffic. The data is useful for auditing TIC compliance and identifying trouble spots. You can use the high-level dashboard to rapidly screen the virtual machines that are communicating with the Internet and get a focused list for TIC routing.

:::image type="content" source="./media/tic-traffic-analytics-1.png" alt-text="Network Watcher traffic analytics" border="false":::

Use the **Geo Map** to quickly identify the probable physical destinations of Internet traffic for your virtual machines. You can identify and triage suspicious locations or pattern changes:

:::image type="content" source="./media/tic-traffic-analytics-2.png" alt-text="Geo map" border="false":::

Use the **Virtual Networks Topology** to rapidly survey existing virtual networks:

:::image type="content" source="./media/tic-traffic-analytics-3.png" alt-text="Network topology map" border="false":::

### Network Watcher next hop tests

Networks in regions that are monitored by Network Watcher can conduct next hop tests. In the Azure portal, you can enter a source and destination for a sample network flow for Network Watcher to resolve the next hop destination. Run this test against virtual machines and sample Internet addresses to ensure the next hop destination is the expected network virtual gateway.

:::image type="content" source="./media/tic-network-watcher.png" alt-text="Next hop tests" border="false":::

## Conclusions

You can easily configure network access to help comply with TIC 2.0 guidance and use Azure support for the NIST CSF and NIST SP 800-53 to address TIC 3.0 requirements.

## Next steps

- [Acquiring and accessing Azure Government](https://azure.microsoft.com/offers/azure-government/)
- [Azure Government overview](../documentation-government-welcome.md)
- [Azure Government security](../documentation-government-plan-security.md)
- [Azure Government compliance](../documentation-government-plan-compliance.md)
- [FedRAMP High](/azure/compliance/offerings/offering-fedramp)
- [DoD Impact Level 4](/azure/compliance/offerings/offering-dod-il4)
- [DoD Impact Level 5](/azure/compliance/offerings/offering-dod-il5)
- [Azure Government isolation guidelines for Impact Level 5 workloads](../documentation-government-impact-level-5.md)
- [Secure Azure Computing Architecture](./secure-azure-computing-architecture.md)
- [Azure guidance for secure isolation](../azure-secure-isolation-guidance.md)
- [Azure Policy overview](../../governance/policy/overview.md)
- [Azure Policy regulatory compliance built-in initiatives](../../governance/policy/samples/index.md#regulatory-compliance)
