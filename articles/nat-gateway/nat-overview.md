---

title: What is Azure NAT Gateway?
titlesuffix: Azure NAT Gateway
description: Overview of Azure NAT Gateway features, resources, architecture, and implementation. Learn about what NAT gateway is and how to use it.
author: asudbring
ms.service: azure-nat-gateway
ms.topic: overview
ms.date: 08/12/2024
ms.author: allensu
#Customer intent: I want to understand what Azure NAT Gateway is and how to use it.
---

# What is Azure NAT Gateway?

Azure NAT Gateway is a fully managed and highly resilient Network Address Translation (NAT) service. You can use Azure NAT Gateway to let all instances in a private subnet  connect outbound to the internet while remaining fully private. Unsolicited inbound connections from the internet aren't permitted through a NAT gateway. Only packets arriving as response packets to an outbound connection can pass through a NAT gateway.

NAT Gateway provides dynamic SNAT port functionality to automatically scale outbound connectivity and reduce the risk of SNAT port exhaustion. 

:::image type="content" source="./media/nat-overview/flow-map.png" alt-text="Figure shows a NAT receiving traffic from internal subnets and directing it to a public IP address." lightbox="./media/nat-overview/flow-map.png":::

*Figure: Azure NAT Gateway*

Azure NAT Gateway provides outbound connectivity for many Azure resources, including: 

* Azure virtual machines or virtual machine scale-sets in a private subnet.

* [Azure Kubernetes Services (AKS) clusters](/azure/aks/nat-gateway).

* [Azure Container group](/azure/container-instances/container-instances-nat-gateway).

* [Azure Function Apps](/azure/azure-functions/functions-how-to-use-nat-gateway).

* [Azure Firewall subnet](/azure/firewall/integrate-with-nat-gateway).

* [Azure App Services instances](/azure/app-service/networking/nat-gateway-integration) (web applications, REST APIs, and mobile backends) through [virtual network integration](/azure/app-service/overview-vnet-integration).

* [Azure Databricks](/azure/databricks/security/network/secure-cluster-connectivity#egress-with-default-managed-vnet) or with [virtual network injection](/azure/databricks/security/network/secure-cluster-connectivity#egress-with-vnet-injection).

## Azure NAT Gateway benefits

### Simple Setup

Deployments are intentionally made simple with NAT gateway. Attach NAT gateway to a subnet and public IP address and start connecting outbound to the internet right away. There's zero maintenance and routing configurations required. More public IPs or subnets can be added later without effect to your existing configuration. 

The following steps are an example of how to set up a NAT gateway:

* Create a nonzonal or zonal NAT gateway.

* Assign a public IP address or public IP prefix.

* Configure virtual network subnet to use a NAT gateway.

If necessary, modify Transmission Control Protocol (TCP) idle timeout (optional). Review [timers](/azure/nat-gateway/nat-gateway-resource#idle-timeout-timers) before you change the default. 

### Security

NAT Gateway is built on the zero trust network security model and is secure by default. With NAT gateway, private instances within a subnet don't need public IP addresses to reach the internet. Private resources can reach external sources outside the virtual network by source network address translating (SNAT) to NAT gateway's static public IP addresses or prefixes. You can provide a contiguous set of IPs for outbound connectivity by using a public IP prefix. Destination firewall rules can be configured based on this predictable IP list.

### Resiliency 

Azure NAT Gateway is a fully managed and distributed service. It doesn't depend on individual compute instances such as VMs or a single physical gateway device. A NAT gateway always has multiple fault domains and can sustain multiple failures without service outage. Software defined networking makes a NAT gateway highly resilient. 

### Scalability

NAT gateway is scaled out from creation. There isn't a ramp up or scale-out operation required. Azure manages the operation of NAT gateway for you. 

Attach NAT gateway to a subnet to provide outbound connectivity for all private resources in that subnet. All subnets in a virtual network can use the same NAT gateway resource. Outbound connectivity can be scaled out by assigning up to 16 public IP addresses or a /28 size public IP prefix to NAT gateway. When a NAT gateway is associated to a public IP prefix, it automatically scales to the number of IP addresses needed for outbound.

### Performance

Azure NAT Gateway is a software defined networking service. Each NAT gateway can process up to 50 Gbps of data for both outbound and return traffic. 

A NAT gateway doesn't affect the network bandwidth of your compute resources. Learn more about [NAT gateway's performance](nat-gateway-resource.md#performance).

## Azure NAT Gateway basics

### Outbound connectivity

* NAT gateway is the recommended method for outbound connectivity.

   * To migrate outbound access to a NAT gateway from default outbound access or load balancer outbound rules, see [Migrate outbound access to Azure NAT Gateway](./tutorial-migrate-outbound-nat.md).

>[!NOTE]
>On September 30th, 2025, [default outbound access](/azure/virtual-network/ip-services/default-outbound-access#when-is-default-outbound-access-provided) for new deployments will be retired. It is recommended to use an explicit form of outbound connectivity instead, like NAT gateway. 

* Egress is defined at a per subnet level with NAT gateway. NAT gateway replaces the default Internet destination of a subnet.

* Traffic routing configurations aren't required to use NAT gateway.

* NAT gateway allows flows to be created from the virtual network to the services outside your virtual network. Return traffic from the internet is only allowed in response to an active flow. Services outside your virtual network can’t initiate an inbound connection through NAT gateway.

* NAT gateway takes precedence over other outbound connectivity methods, including a load balancer, instance-level public IP addresses, and Azure Firewall.

* When NAT gateway is configured to a virtual network where a different outbound connectivity method already exists, NAT gateway takes over all outbound traffic moving forward. There are no drops in traffic flow for existing connections on Azure Load Balancer. All new connections use NAT gateway.  
  
* NAT gateway doesn't have the same limitations of SNAT port exhaustion as does [default outbound access](../virtual-network/ip-services/default-outbound-access.md) and [outbound rules of a load balancer](../load-balancer/outbound-rules.md).

* NAT gateway supports TCP and User Datagram Protocol (UDP) protocols only. Internet Control Message Protocol (ICMP) isn't supported.

### Traffic routes

* The subnet has a [system default route](/azure/virtual-network/virtual-networks-udr-overview#default) that routes traffic with destination 0.0.0.0/0 to the internet automatically. Once NAT gateway is configured to the subnet, communication from the virtual machines existing in the subnet to the internet will prioritize using the public IP of the NAT gateway.


* When you create a user defined route (UDR) in your subnet route table for 0.0.0.0/0 traffic, the default internet path for this traffic is overridden. A UDR that sends 0.0.0.0/0 traffic to a virtual appliance or a virtual network gateway (VPN Gateway and ExpressRoute) as the next hop type instead override NAT gateway connectivity to the internet.

* Outbound connectivity follows this order of precedence among different routing and outbound connectivity methods:

    * UDR to next hop Virtual appliance or virtual network gateway >> NAT gateway >> Instance-level public IP address on a virtual machine >> Load balancer outbound rules >> default system route to the internet.

### NAT gateway configurations

* Multiple subnets within the same virtual network can either use different NAT gateways or the same NAT gateway.

* Multiple NAT gateways can’t be attached to a single subnet.

* A NAT gateway can’t span multiple virtual networks. However, NAT Gateway can be used to provide outbound connectivity in a hub and spoke model. For more details, see the [NAT gateway hub and spoke tutorial](/azure/nat-gateway/tutorial-hub-spoke-route-nat).

* A NAT gateway can’t be deployed in a [gateway subnet](../vpn-gateway/vpn-gateway-about-vpn-gateway-settings.md#gwsub).

* A NAT gateway resource can use up to 16 IP addresses in any combination of the following types:

  * Public IP addresses.

  * Public IP prefixes.

  * Public IP addresses and prefixes derived from custom IP prefixes (BYOIP), to learn more, see [Custom IP address prefix (BYOIP)](../virtual-network/ip-services/custom-ip-address-prefix.md).

* NAT gateway can’t be associated to an IPv6 public IP address or IPv6 public IP prefix.

* NAT gateway can be used with Load balancer using outbound rules to provide dual-stack outbound connectivity. See [dual stack outbound connectivity with NAT gateway and Load balancer](/azure/virtual-network/nat-gateway/tutorial-dual-stack-outbound-nat-load-balancer?tabs=dual-stack-outbound-portal).

* NAT gateway works with any virtual machine network interface or IP configuration. NAT gateway can SNAT multiple IP configurations on a network interface.

* NAT gateway can be associated to an Azure Firewall subnet in a hub virtual network and provide outbound connectivity from spoke virtual networks peered to the hub. To learn more, see [Azure Firewall integration with NAT gateway](../firewall/integrate-with-nat-gateway.md).

### Availability zones

* A NAT gateway can be created in a specific availability zone or placed in **no zone**. 

* NAT gateway can be isolated in a specific zone when you create [zone isolation scenarios](./nat-availability-zones.md). This deployment is called a zonal deployment. After NAT gateway is deployed, the zone selection can't be changed.

* NAT gateway is placed in **no zone** by default. A [non-zonal NAT gateway](./nat-availability-zones.md#nonzonal) is placed in a zone for you by Azure.

### NAT gateway and basic resources

* NAT gateway is compatible with standard public IP addresses or public IP prefix resources or a combination of both.

* Basic resources, such as basic load balancer or basic public IPs aren't compatible with NAT gateway. NAT gateway can't be used with subnets where basic resources exist. Basic load balancer and basic public IP can be upgraded to standard to work with a NAT gateway.
  
    * For more information about upgrading a load balancer from basic to standard, see [Upgrade a public basic Azure Load Balancer](/azure/load-balancer/upgrade-basic-standard-with-powershell).

    * For more information about upgrading a public IP from basic to standard, see [Upgrade a public IP address](../virtual-network/ip-services/public-ip-upgrade-portal.md).

    * For more information about upgrading a basic public IP attached to a virtual machine from basic to standard, see [Upgrade a basic public IP attached to a virtual machine](/azure/virtual-network/ip-services/public-ip-upgrade-vm).  

### Connection timeouts and timers

* NAT gateway sends a TCP Reset (RST) packet for any connection flow that it doesn't recognize as an existing connection. The connection flow no longer exists if the NAT gateway idle timeout was reached or the connection was closed earlier. 

* When the sender of traffic on the nonexisting connection flow receives the NAT gateway TCP RST packet, the connection is no longer usable.

* SNAT ports aren't readily available for reuse to the same destination endpoint after a connection closes. NAT gateway places SNAT ports in a cool down state before they can be reused to connect to the same destination endpoint. 

* SNAT port reuse (cool down) timer durations vary for TCP traffic depending on how the connection closes. To learn more, see [Port Reuse Timers](./nat-gateway-resource.md#port-reuse-timers).

* A default TCP idle timeout of 4 minutes is used and can be increased to up to 120 minutes. Any activity on a flow can also reset the idle timer, including TCP keepalives. To learn more, see [Idle Timeout Timers](./nat-gateway-resource.md#idle-timeout-timers).

* UDP traffic has an idle timeout timer of 4 minutes that can't be changed.
 
* UDP traffic has a port reuse timer of 65 seconds for which a port is in hold down before it's available for reuse to the same destination endpoint.

## Pricing and Service Level Agreement (SLA)

For Azure NAT Gateway pricing, see [NAT gateway pricing](https://azure.microsoft.com/pricing/details/azure-nat-gateway/).

For information on the SLA, see [SLA for Azure NAT Gateway](https://azure.microsoft.com/support/legal/sla/virtual-network-nat/v1_0/).

## Next steps

* For more information about creating and validating a NAT gateway, see [Quickstart: Create a NAT gateway using the Azure portal](quickstart-create-nat-gateway-portal.md).

* To view a video on more information about Azure NAT Gateway, see [How to get better outbound connectivity using an Azure NAT gateway](https://www.youtube.com/watch?v=2Ng_uM0ZaB4).

* For more information about the NAT gateway resource, see [NAT gateway resource](./nat-gateway-resource.md).

* Learn more about Azure NAT Gateway in the following module:

   * [Learn module: Introduction to Azure NAT Gateway](/training/modules/intro-to-azure-virtual-network-nat).

* For more information about architecture options for Azure NAT Gateway, see [Azure Well-Architected Framework review of an Azure NAT gateway](/azure/architecture/networking/guide/well-architected-network-address-translation-gateway).

