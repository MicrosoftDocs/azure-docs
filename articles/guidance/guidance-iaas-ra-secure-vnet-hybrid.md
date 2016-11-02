<properties
   pageTitle="Implementing a secure hybrid network architecture in Azure | Microsoft Azure"
   description="How to implement a secure hybrid network architecture in Azure."
   services="guidance,vpn-gateway,expressroute,load-balancer,virtual-network"
   documentationCenter="na"
   authors="telmosampaio"
   manager="christb"
   editor=""
   tags="azure-resource-manager"/>

<tags
   ms.service="guidance"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="10/24/2016"
   ms.author="telmos"/>

# Implementing a DMZ between Azure and your on-premises datacenter

[AZURE.INCLUDE [pnp-RA-branding](../../includes/guidance-pnp-header-include.md)]

This article describes best practices for implementing a secure hybrid network that extends an on-premises network to Azure. This reference architecture implements a DMZ between an on-premises network and an Azure virtual network using user defined routes (UDRs). The DMZ includes highly available network virtual appliances (NVAs) that implement security functionality such as firewalls and packet inspection. All outgoing traffic from the VNet is force-tunneled to the Internet through the on-premises network so it can be audited.

This architecture requires a connection to your on-premises datacenter implemented using either a [VPN gateway][ra-vpn], or an [ExpressRoute][ra-expressroute] connection.

> [AZURE.NOTE] Azure has two different deployment models: [Resource Manager](../azure-resource-manager/resource-group-overview.md) and classic. This reference architecture uses Resource Manager, which Microsoft recommends for new deployments.

Typical use cases for this architecture include:

- Hybrid applications where workloads run partly on-premises and partly in Azure.

- Azure infrastructure that routes incoming traffic from on-premises and the internet.

- Applications required to audit outgoing traffic. This is often a regulatory requirement of many commercial systems and can help to prevent public disclosure of private information.

## Architecture diagram

The following diagram highlights the important components in this architecture:

> A Visio document that includes this architecture diagram is available for download at the [Microsoft download center][visio-download]. This diagram is on the "DMZ - Private" page.

[![0]][0]

- **On-premises network.** This is a network of computers and devices connected through a private local-area network implemented in an organization.

- **Azure virtual network (VNet).** The VNet hosts the application and other resources running in the cloud.

- **Gateway.** The gateway provides connectivity between the routers in the on-premises network and the VNet.

- **Network virtual appliance (NVA).** NVA is a generic term that describes a VM performing tasks such as allowing or denying access as a firewall, optimizing WAN operations (including network compression), custom routing, or other network functionality.

- **Web tier, business tier, and data tier subnets.** These are subnets hosting the VMs and services that implement an example 3-tier application running in the cloud. See [Running Windows VMs for an N-tier architecture on Azure][ra-n-tier] for more information.

- **User defined routes (UDR).** [User defined routes][udr-overview] define the flow of IP traffic within Azure VNets.

> [AZURE.NOTE] Depending on the requirements of your VPN connection, you can configure Border Gateway Protocol (BGP) routes as an alternative to to using UDRs to implement the forwarding rules that direct traffic back through the on-premises network.

- **Management subnet.** This subnet contains VMs that implement management and monitoring capabilities for the components running in the VNet.

## Recommendations

Azure offers many different resources and resource types, so this reference architecture can be provisioned many different ways. We have provided an Azure Resource Manager template to install the reference architecture that follows these recommendations. If you choose to create your own reference architecture you should follow these recommendations unless you have a specific requirement that a recommendation does not fit.

### RBAC recommendations

Create several RBAC roles to manage the resources in your application. Consider creating a DevOps [custom role][rbac-custom-roles] with permissions to administer the infrastructure for the application. Consider creating a centralized IT administrator [custom role][rbac-custom-roles] to manage network resources, and a separate security IT administrator [custom role][rbac-custom-roles] to manage secure network resources such as the NVAs.

The DevOps role should include permissions to deploy the application components as well as monitor and restart VMs. The centralized IT administrator role should include permissions to monitor network resources. Neither of these roles should have access to the NVA resources as this should be restricted to the security IT administrator role.

### Resource group recommendations

Azure resources such as VMs, VNets, and load balancers can be easily managed by grouping them together into resource groups. You can then assign the roles above to each resource group to restrict access.

We recommend the creation of the following:

- A resource group containing the subnets (excluding the VMs), NSGs, and the gateway resources for connecting to the on-premises network. Assign the centralized IT administrator role to this resource group.

- A resource group containing the VMs for the NVAs (including the load balancer), the jump box and other management VMs, and the UDR for the gateway subnet that forces all traffic through the NVAs. Assign the security IT administrator role to this resource group.

- Separate resource groups for each application tier that contain the load balancer and VMs. Note that this resource group shouldn't include the subnets for each tier. Assign the DevOps role to this resource group.

### Virtual network gateway recommendations

On-premises traffic passes to the VNet through a virtual network gateway. We recommend an [Azure VPN gateway][guidance-vpn-gateway] or an [Azure ExpressRoute gateway][guidance-expressroute].

### NVA recommendations

NVAs provide different services for managing and monitoring network traffic. The Azure Marketplace offers several third-party vendor NVAs, including:

- [Barracuda Web Application Firewall][barracuda-waf] and [Barracuda NextGen Firewall][barracuda-nf]

- [Cohesive Networks VNS3 Firewall/Router/VPN][vns3]

- [Fortinet FortiGate-VM][fortinet]

- [SecureSphere Web Application Firewall][securesphere]

- [DenyAll Web Application Firewall][denyall]

- [Check Point vSEC][checkpoint]

If none of these third-party NVAs meet your requirements, you can create a custom NVA using VMs. For an example of creating custom NVAs, see the DMZ in this reference architecture that implements the following functionality:

- Traffic is routed using [IP forwarding][ip-forwarding] on the NVA NICs.

- Traffic is permitted to pass through the NVA only if it is appropriate to do so. Each NVA VM in the reference architecture is a simple Linux router with inbound traffic arriving on network interface *eth0*, and outbound traffic matching rules defined by custom scripts dispatched through network interface *eth1*.

- Traffic routed to the management subnet does not pass through the NVAs and the NVAs can only be configured from the management subnet. If traffic to the management subnet is required to be routed through the NVAs, there is no route to the management subnet to fix the NVAs if they should fail.  

- The VMs for the NVA are included in an availability set behind a load balancer. The UDR in the gateway subnet directs NVA requests to the load balancer.

Another recommendation to consider is connecting multiple NVAs in series with each NVA performing a specialized security task. This allows each security function to be managed on a per-NVA basis. For example, an NVA implementing a firewall could be placed in series with an NVA running identity services. The tradeoff for ease of management is the addition of extra network hops that may increase latency, so ensure that this doesn't affect your application's performance.

### NSG recommendations

The VPN gateway exposes a public IP address for the connection to the on-premises network. We recommend creating a network security group (NSG) for the inbound NVA subnet implementing rules to block all traffic not originating from the on-premises network.

We also recommend that you implement NSGs for each subnet to provide a second level of protection against inbound traffic bypassing an incorrectly configured or disabled NVA. For example, the web tier subnet in the reference architecture implements an NSG with a rule to ignore all requests other than those received from the on-premises network (192.168.0.0/16) or the VNet, and another rule that ignores all requests not made on port 80.

### Internet access recommendations

[Force-tunnel][azure-forced-tunneling] all outbound internet traffic through your on-premises network using the site-to-site VPN tunnel and route to the internet using network address tranlation (NAT). This will both prevent accidental leakage of any confidential information stored in your data tier and also allow inspection and auditing of all outgoing traffic.

> [AZURE.NOTE] Don't completely block Internet traffic from the web, business and application tiers. If these tiers use Azure PaaS services they rely on public IP addresses for VM diagnostics logging, download of VM extensions, and other functionality. Azure diagnostics also requires that components can read and write to an internet-dependent Azure storage account.

We further recommend that you verify outbound internet traffic is force-tunneled correctly. If you're using a VPN connection with the [routing and remote access service][routing-and-remote-access-service] on an on-premises server, use a tool such as [WireShark][wireshark] or [Microsoft Message Analyzer](https://www.microsoft.com/en-us/download/details.aspx?id=44226).

### Management subnet recommendations

The management subnet contains a jump box that executes management and monitoring functionality. Implement the following recommendations for the jump box:
- Do not create a public IP address for the jump box.
- Create one route to access the jump box through the incoming gateway and implement an NSG in the management subnet to only respond to requests from the allowed route.
- Restrict execution of all secure management tasks to the jump box.

### NVA recommendations

Include a layer 7 NVA to terminate application connections at the NVA level and maintain affinity with the backend tiers. This guarantees symmetric connectivity in which response traffic from the backend tiers returns through the NVA.

## Scalability considerations

The reference architecture implements a load balancer directing on-premises network traffic to a pool of NVA devices. As discussed earlier, the NVA devices are VMs executing network traffic routing rules and are deployed into an [availability set][availability-set]. This design allows you to monitor the throughput of the NVAs over time and add NVA devices in response to increases in load.

The standard SKU VPN gateway supports sustained throughput of up to 100 Mbps. The High Performance SKU provides up to 200 Mbps. For higher bandwidths, consider upgrading to an ExpressRoute gateway. ExpressRoute provides up to 10 Gbps bandwidth with lower latency than a VPN connection.

> [AZURE.NOTE] The articles [Implementing a Hybrid Network Architecture with Azure and On-premises VPN][guidance-vpn-gateway] and [Implementing a hybrid network architecture with Azure ExpressRoute][guidance-expressroute] describe issues surrounding the scalability of Azure gateways.

## Availability considerations

The reference architecture implements a load balancer distributing requests from on-premises to a pool of NVA devices in Azure. The NVA devices are VMs executing network traffic routing rules and are deployed into an [availability set][availability-set]. The load balancer regularly queries a health probe implemented on each NVA and will remove any unresponsive NVAs from the pool.

If you're using Azure ExpressRoute to provide connectivity between the VNet and on-premises network, [configure a VPN gateway to provide failover][guidance-vpn-failover] if the ExpressRoute connection becomes unavailable.

For specific information on maintaining availability for VPN and ExpressRoute connections, see the articles [Implementing a Hybrid Network Architecture with Azure and On-premises VPN][guidance-vpn-gateway] and [Implementing a hybrid network architecture with Azure ExpressRoute][guidance-expressroute].

## Manageability considerations

All application and resource monitoring should be performed by the jump box in the management subnet. Depending on your application requirements, you may need to add additional monitoring resources in the management subnet, but again any of these additional resources should be accessed via the jump box.

If gateway connectivity from your on-premises network to Azure is down, you can still reach the jump box by deploying a PIP, adding it to the jump box, and remoting in from the internet.

Each tier's subnet in the reference architecture is protected by NSG rules, and it may be necessary to create a rule to open port 3389 for RDP access on Windows VMs or port 22 for SSH access on Linux VMs. Other management and monitoring tools may require rules to open additional ports.

If you're using ExpressRoute to provide the connectivity between your on-premises datacenter and Azure, use the [Azure Connectivity Toolkit (AzureCT)][azurect] to monitor and troubleshoot connection issues.

> [AZURE.NOTE] You can find additional information specifically aimed at monitoring and managing VPN and ExpressRoute connections in the articles [Implementing a Hybrid Network Architecture with Azure and On-premises VPN][guidance-vpn-gateway] and [Implementing a hybrid network architecture with Azure ExpressRoute][guidance-expressroute].

## Security considerations

This reference architecture implements multiple levels of security:

### Routing all on-premises user requests through the NVA

The UDR in the gateway subnet blocks all user requests other than those received from on-premises. The UDR passes allowed requests to the NVAs in the private DMZ subnet, and these requests are passed on to the application if they are allowed by the NVA rules. Other routes can be added to the UDR, but ensure they don't inadvertently bypass the NVAs or block administrative traffic intended for the management subnet.

The load balancer in front of the NVAs also acts as a security device by ignoring traffic on ports that are not open in the load balancing rules. The load balancers in the reference architecture only listen for HTTP requests on port 80 and HTTPS requests on port 443. Any additional rules added to the load balancers must be documented and the traffic should be monitored to ensure there are no security issues.

### Using NSGs to block/pass traffic between application tiers

Each of the web, business, and data tiers restrict traffic between them using NSGs. That is, the business tier uses an NSG to block all traffic that doesn't originate in the web tier, and the data tier uses an NSG to block all traffic that doesn't originate in the business tier. If you have a requirement to expand the NSG rules to allow broader access to these tiers, weigh these requirements against the security risks. Each new inbound pathway represents an opportunity for accidental or purposeful data leakage or application damage.

### DevOps access

Restrict the operations that DevOps can perform on each tier using [RBAC][rbac] to manage permissions. When granting permissions, use the [principle of least privilege][security-principle-of-least-privilege]. Log all administrative operations and perform regular audits to ensure any configuration changes were planned.

> [AZURE.NOTE] For more extensive information, examples, and scenarios about managing network security with Azure, see [Microsoft cloud services and network security][cloud-services-network-security]. For detailed information about protecting resources in the cloud, see [Getting started with Microsoft Azure security][getting-started-with-azure-security]. For additional details on addressing security concerns across an Azure gateway connection, see [Implementing a Hybrid Network Architecture with Azure and On-premises VPN][guidance-vpn-gateway] and [Implementing a hybrid network architecture with Azure ExpressRoute][guidance-expressroute].

## Solution deployment

A deployment for a reference architecture that implements these recommendations is available on Github. This reference architecture includes a virtual network (VNet), network security group (NSG), load balancer, and two virtual machines (VMs).

The reference architecture can be deployed either with Windows or Linux VMs by following the directions below:

1. Right click the button below and select either "Open link in new tab" or "Open link in new window":  
[![Deploy to Azure](./media/blueprints/deploybutton.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fmspnp%2Freference-architectures%2Fmaster%2Fguidance-hybrid-network-secure-vnet%2Fazuredeploy.json)

2. Once the link has opened in the Azure portal, you must enter values for some of the settings:
    - The **Resource group** name is already defined in the parameter file, so select **Create New** and enter `ra-private-dmz-rg` in the text box.
    - Select the region from the **Location** drop down box.
    - Do not edit the **Template Root Uri** or the **Parameter Root Uri** text boxes.
    - Review the terms and conditions, then click the **I agree to the terms and conditions stated above** checkbox.
    - Click on the **Purchase** button.

3. Wait for the deployment to complete.

4. The parameter files include hard-coded administrator user name and password for all VMs, and it is strongly recommended that you immediately change both. For each VM in the deployment, select it in the Azure portal and then click on **Reset password** in the **Support + troubleshooting** blade. Select **Reset password** in the **Mode** dropdown box, then select a new **User name** and **Password**. Click the **Update** button to persist.

## Next steps

- Learn how to implement a [DMZ between Azure and the Internet](./guidance-iaas-ra-secure-vnet-dmz.md).
- Learn how to implement a [highly available hybrid network architecture](./guidance-hybrid-network-expressroute-vpn-failover.md).

<!-- links -->

[availability-set]: ../virtual-machines/virtual-machines-windows-create-availability-set.md
[azurect]: https://github.com/Azure/NetworkMonitoring/tree/master/AzureCT
[azure-forced-tunneling]: https://azure.microsoft.com/en-gb/documentation/articles/vpn-gateway-forced-tunneling-rm/
[barracuda-nf]: https://azure.microsoft.com/marketplace/partners/barracudanetworks/barracuda-ng-firewall/
[barracuda-waf]: https://azure.microsoft.com/marketplace/partners/barracudanetworks/waf/
[checkpoint]: https://azure.microsoft.com/marketplace/partners/checkpoint/check-point-r77-10/
[cloud-services-network-security]: https://azure.microsoft.com/documentation/articles/best-practices-network-security/
[denyall]: https://azure.microsoft.com/marketplace/partners/denyall/denyall-web-application-firewall/
[fortinet]: https://azure.microsoft.com/marketplace/partners/fortinet/fortinet-fortigate-singlevmfortigate-singlevm/
[getting-started-with-azure-security]: ./../security/azure-security-getting-started.md
[guidance-expressroute]: ./guidance-hybrid-network-expressroute.md
[guidance-vpn-failover]: ./guidance-hybrid-network-expressroute-vpn-failover.md
[guidance-vpn-gateway]: ./guidance-hybrid-network-vpn.md
[ip-forwarding]: ../virtual-network/virtual-networks-udr-overview.md#IP-forwarding
[ra-expressroute]: ./guidance-hybrid-network-expressroute.md
[ra-n-tier]: ./guidance-compute-n-tier-vm.md
[ra-vpn]: ./guidance-hybrid-network-vpn.md
[ra-vpn-failover]: ./guidance-hybrid-network-expressroute-vpn-failover.md
[rbac]: ../active-directory/role-based-access-control-configure.md
[rbac-custom-roles]: ../active-directory/role-based-access-control-custom-roles.md
[resource-manager-overview]: ../azure-resource-manager/resource-group-overview.md
[routing-and-remote-access-service]: https://technet.microsoft.com/library/dd469790(v=ws.11).aspx
[securesphere]: https://azure.microsoft.com/marketplace/partners/imperva/securesphere-waf-for-azr/
[security-principle-of-least-privilege]: https://msdn.microsoft.com/library/hdb58b2f(v=vs.110).aspx#Anchor_1
[udr-overview]: ../virtual-network/virtual-networks-udr-overview.md
[visio-download]: http://download.microsoft.com/download/1/5/6/1569703C-0A82-4A9C-8334-F13D0DF2F472/RAs.vsdx
[vns3]: https://azure.microsoft.com/marketplace/partners/cohesive/cohesiveft-vns3-for-azure/
[wireshark]: https://www.wireshark.org/
[0]: ./media/blueprints/hybrid-network-secure-vnet.png "Secure hybrid network architecture"
