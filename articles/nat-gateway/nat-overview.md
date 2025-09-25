---

title: What is Azure NAT Gateway?
titlesuffix: Azure NAT Gateway
description: Overview of Azure NAT Gateway features, resources, architecture, and implementation. Learn about what NAT Gateway is and how to use it.
author: asudbring
ms.service: azure-nat-gateway
ms.topic: overview
ms.date: 08/12/2024
ms.author: allensu
ms.custom: sfi-image-nochange
#Customer intent: I want to understand what Azure NAT Gateway is and how to use it.
# Customer intent: As a cloud architect, I want to implement Azure NAT Gateway for outbound connectivity, so that I can ensure secure and scalable internet access for private resources without exposing them to unsolicited inbound connections.
---

# What is Azure NAT Gateway?

Azure NAT Gateway is a fully managed and highly resilient Network Address Translation (NAT) service. You can use Azure NAT Gateway to let all instances in a private subnet connect outbound to the internet while remaining fully private. Unsolicited inbound connections from the internet aren't permitted through a NAT Gateway. Only packets arriving as response packets to an outbound connection can pass through a NAT Gateway.

NAT Gateway provides dynamic SNAT port functionality to automatically scale outbound connectivity and reduce the risk of SNAT port exhaustion. 

:::image type="content" source="./media/nat-overview/flow-map.png" alt-text="Figure shows a NAT receiving traffic from internal subnets and directing it to a public IP address." lightbox="./media/nat-overview/flow-map.png":::

*Figure: Azure NAT Gateway*

Azure NAT Gateway provides outbound connectivity for many Azure resources, including: 

* Azure virtual machines or virtual machine scale sets in a private subnet.

* [Azure Kubernetes Services (AKS) clusters](/azure/aks/nat-gateway).

* [Azure Container group](/azure/container-instances/container-instances-nat-gateway).

* [Azure Function Apps](/azure/azure-functions/functions-how-to-use-nat-gateway).

* [Azure Firewall subnet](/azure/firewall/integrate-with-nat-gateway).

* [Azure App Services instances](/azure/app-service/networking/nat-gateway-integration) (web applications, REST APIs, and mobile backends) through [virtual network integration](/azure/app-service/overview-vnet-integration).

* [Azure Databricks](/azure/databricks/security/network/secure-cluster-connectivity#egress-with-default-managed-vnet) or with [virtual network injection](/azure/databricks/security/network/secure-cluster-connectivity#egress-with-vnet-injection).
* [Azure HDInsight](/azure/hdinsight/load-balancer-migration-guidelines#new-cluster-creation).

## Azure NAT Gateway benefits

### Simple Setup

Deployments are intentionally made simple with NAT Gateway. Attach NAT Gateway to a subnet and public IP address and start connecting outbound to the internet right away. There's zero maintenance and routing configurations required. More public IPs or subnets can be added later without effect to your existing configuration. 

The following steps are an example of how to set up a NAT Gateway:

* Create a non-zonal or zonal NAT Gateway.

* Assign a public IP address or public IP prefix.

* Configure a virtual network subnet to use a NAT Gateway.

If necessary, modify Transmission Control Protocol (TCP) idle timeout (optional). Review [timers](/azure/nat-gateway/nat-gateway-resource#idle-timeout-timers) before you change the default. 

### Security

NAT Gateway is built on the Zero Trust network security model and is secure by default. With NAT Gateway, private instances within a subnet don't need public IP addresses to reach the internet. Private resources can reach external sources outside the virtual network by source network address translating (SNAT) to NAT Gateway's static public IP addresses or prefixes. You can provide a contiguous set of IPs for outbound connectivity by using a public IP prefix. Destination firewall rules can be configured based on this predictable IP list.

### Resiliency 

Azure NAT Gateway is a fully managed and distributed service. It doesn't depend on individual compute instances such as virtual machines or a single physical gateway device. A NAT Gateway always has multiple fault domains and can sustain multiple failures without service outage. Software-defined networking makes a NAT Gateway highly resilient. 

### Scalability

NAT Gateway is scaled out from creation. There isn't a ramp-up or scale-out operation required. Azure manages the operation of NAT Gateway for you. 

Attach NAT Gateway to a subnet to provide outbound connectivity for all private resources in that subnet. All subnets in a virtual network can use the same NAT Gateway resource. Outbound connectivity can be scaled out by assigning up to 16 public IP addresses or a /28 size public IP prefix to NAT Gateway. When a NAT Gateway is associated to a public IP prefix, it automatically scales to the number of IP addresses needed for outbound.

### Performance

Azure NAT Gateway is a software-defined networking service. Each NAT Gateway can process up to 50 Gbps of data for both outbound and return traffic. 

A NAT Gateway doesn't affect the network bandwidth of your compute resources. Learn more about [NAT Gateway's performance](nat-gateway-resource.md#performance).

## Azure NAT Gateway basics

### Outbound connectivity

* NAT Gateway is the recommended method for outbound connectivity.

   * To migrate outbound access to a NAT Gateway from default outbound access or Load Balancer outbound rules, see [Migrate outbound access to Azure NAT Gateway](./tutorial-migrate-outbound-nat.md).

>[!NOTE]
>On September 30, 2025, new virtual networks will default to using private subnets, meaning that [default outbound access](/azure/virtual-network/ip-services/default-outbound-access#when-is-default-outbound-access-provided) will no longer be provided by default, and that explicit outbound method must be enabled in order to reach public endpoints on the Internet and within Microsoft. It's recommended to use an explicit form of outbound connectivity instead, like NAT Gateway. 

* NAT Gateway provides outbound connectivity at a subnet level. NAT Gateway replaces the default Internet destination of a subnet to provide outbound connectivity.

* NAT Gateway doesn't require any routing configurations on a subnet route table. After NAT Gateway is attached to a subnet, it provides outbound connectivity right away.

* NAT Gateway allows flows to be created from the virtual network to the services outside your virtual network. Return traffic from the internet is only allowed in response to an active flow. Services outside your virtual network can’t initiate an inbound connection through NAT Gateway.

* NAT Gateway takes precedence over other outbound connectivity methods, including a Load Balancer, instance-level public IP addresses, and Azure Firewall.

* NAT Gateway takes priority over other explicit outbound methods configured in a virtual network for all new connections. There are no drops in traffic flow for existing connections using other explicit methods of outbound connectivity. 
  
* NAT Gateway doesn't have the same limitations of SNAT port exhaustion as does [default outbound access](../virtual-network/ip-services/default-outbound-access.md) and [outbound rules of a Load Balancer](../load-balancer/outbound-rules.md).

* NAT Gateway supports TCP and User Datagram Protocol (UDP) protocols only. Internet Control Message Protocol (ICMP) isn't supported.

### Traffic routes

* The subnet has a [system default route](/azure/virtual-network/virtual-networks-udr-overview#default) that routes traffic with destination 0.0.0.0/0 to the internet automatically. After NAT Gateway is configured to the subnet, virtual machines in the subnet communicate to the internet using the public IP of the NAT Gateway.

* When you create a user defined route (UDR) in your subnet route table for 0.0.0.0/0 traffic, the default internet path for this traffic is overridden. A UDR that sends 0.0.0.0/0 traffic to a virtual appliance or a virtual network gateway (VPN Gateway and ExpressRoute) as the next hop type instead overrides NAT Gateway connectivity to the internet.

* Outbound connectivity follows this order of precedence among different routing and outbound connectivity methods:

    * UDR to next hop Virtual appliance or virtual network gateway >> NAT Gateway >> Instance-level public IP address on a virtual machine >> Load Balancer outbound rules >> default system route to the internet.

### NAT Gateway configurations

* Multiple subnets within the same virtual network can either use different NAT Gateways or the same NAT Gateway.

* Multiple NAT Gateways can’t be attached to a single subnet.

* A NAT Gateway can’t span multiple virtual networks. However, NAT Gateway can be used to provide outbound connectivity in a hub and spoke model. For more information, see the [NAT Gateway hub and spoke tutorial](/azure/nat-gateway/tutorial-hub-spoke-route-nat).

* A NAT Gateway can’t be deployed in a [gateway subnet](../vpn-gateway/vpn-gateway-about-vpn-gateway-settings.md#gwsub).

* A NAT Gateway resource can use up to 16 IP addresses in any combination of the following types:

  * Public IP addresses.

  * Public IP prefixes.

  * Public IP addresses and prefixes derived from custom IP prefixes (BYOIP), to learn more, see [Custom IP address prefix (BYOIP)](../virtual-network/ip-services/custom-ip-address-prefix.md).

* NAT Gateway can’t be associated to an IPv6 public IP address or IPv6 public IP prefix.

* NAT Gateway can be used with Load Balancer using outbound rules to provide dual-stack outbound connectivity. See [dual stack outbound connectivity with NAT Gateway and Load Balancer](/azure/virtual-network/nat-gateway/tutorial-dual-stack-outbound-nat-load-balancer?tabs=dual-stack-outbound-portal).

* NAT Gateway works with any virtual machine network interface or IP configuration. NAT Gateway can SNAT multiple IP configurations on a network interface.

* NAT Gateway can be associated to an Azure Firewall subnet in a hub virtual network and provide outbound connectivity from spoke virtual networks peered to the hub. To learn more, see [Azure Firewall integration with NAT Gateway](../firewall/integrate-with-nat-gateway.md).

### Availability zones

* A NAT Gateway can be created in a specific availability zone or placed in **no zone**. 

* NAT Gateway can be isolated in a specific zone when you create [zone isolation scenarios](./nat-availability-zones.md). After NAT Gateway is deployed, the zone selection can't be changed.

* NAT Gateway is placed in **no zone** by default. A [nonzonal NAT Gateway](./nat-availability-zones.md#nonzonal) is placed in a zone for you by Azure.

### NAT Gateway and basic resources

* NAT Gateway is compatible with standard public IP addresses or public IP prefixes or a combination of both.

* NAT Gateway can't be used with subnets where basic resources exist. Basic SKU resources, such as basic Load Balancer or basic public IPs aren't compatible with NAT Gateway. Basic Load Balancer and basic public IP can be upgraded to standard to work with a NAT Gateway.
  
    * For more information about upgrading a Load Balancer from basic to standard, see [Upgrade a public basic Azure Load Balancer](/azure/load-balancer/upgrade-basic-standard-with-powershell).

    * For more information about upgrading a public IP from basic to standard, see [Upgrade a public IP address](../virtual-network/ip-services/public-ip-upgrade-portal.md).

    * For more information about upgrading a basic public IP attached to a virtual machine from basic to standard, see [Upgrade a basic public IP attached to a virtual machine](/azure/virtual-network/ip-services/public-ip-upgrade-vm).  

### Connection timeouts and timers

* NAT Gateway sends a TCP Reset (RST) packet for any connection flow that it doesn't recognize as an existing connection. The connection flow no longer exists if the NAT Gateway idle timeout was reached or the connection was closed earlier. 

* When the sender of traffic on the nonexisting connection flow receives the NAT Gateway TCP RST packet, the connection is no longer usable.

* SNAT ports aren't readily available for reuse to the same destination endpoint after a connection closes. NAT Gateway places SNAT ports in a cool down state before they can be reused to connect to the same destination endpoint. 

* SNAT port reuse (cool down) timer durations vary for TCP traffic depending on how the connection closes. To learn more, see [Port Reuse Timers](./nat-gateway-resource.md#port-reuse-timers).

* A default TCP idle timeout of 4 minutes is used and can be increased to up to 120 minutes. Any activity on a flow can also reset the idle timer, including TCP keepalives. To learn more, see [Idle Timeout Timers](./nat-gateway-resource.md#idle-timeout-timers).

* UDP traffic has an idle timeout timer of 4 minutes that can't be changed.
 
* UDP traffic has a port reuse timer of 65 seconds for which a port is in hold down before it's available for reuse to the same destination endpoint.

## Pricing and Service Level Agreement (SLA)

For Azure NAT Gateway pricing, see [NAT Gateway pricing](https://azure.microsoft.com/pricing/details/azure-nat-gateway/).

For information on the SLA, see [SLA for Azure NAT Gateway](https://azure.microsoft.com/support/legal/sla/virtual-network-nat/v1_0/).

## Next steps

* For more information about creating and validating a NAT Gateway, see [Quickstart: Create a NAT Gateway using the Azure portal](quickstart-create-nat-gateway-portal.md).

* To view a video on more information about Azure NAT Gateway, see [How to get better outbound connectivity using an Azure NAT Gateway](https://www.youtube.com/watch?v=2Ng_uM0ZaB4).

* For more information about the NAT Gateway resource, see [NAT Gateway resource](./nat-gateway-resource.md).

* Learn more about Azure NAT Gateway in the following module:

   * [Learn module: Introduction to Azure NAT Gateway](/training/modules/intro-to-azure-virtual-network-nat).

* For more information about architecture options for Azure NAT Gateway, see [Azure Well-Architected Framework review of an Azure NAT Gateway](/azure/architecture/networking/guide/well-architected-network-address-translation-gateway).

