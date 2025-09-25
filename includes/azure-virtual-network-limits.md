---
 title: include file
 description: include file
 services: networking
 author: rdhillon
 ms.service: networking
 ms.topic: include
 ms.date: 07/22/2025
 ms.author: rdhillon
 ms.custom: include file

---
### <a name="azure-resource-manager-virtual-networking-limits"></a>Networking limits - Azure Resource Manager
The following limits apply only for networking resources managed through **Azure Resource Manager** per region per subscription. Learn how to [view your current resource usage against your subscription limits](../articles/networking/check-usage-against-limits.md).

> [!NOTE]
> We have increased all default limits to their maximum limits. If there's no maximum limit column, the resource doesn't have adjustable limits. If you had these limits manually increased by support in the past and are currently seeing limits lower than what is listed in the following tables, [open an online customer support request at no charge](../articles/azure-resource-manager/templates/error-resource-quota.md)

| Resource | Limit | 
| --- | --- |
| Virtual networks |1,000 |
| Subnets per virtual network |3,000 |
| Virtual network peerings per virtual network |500 |
| [Virtual network gateways (VPN gateways) per virtual network](../articles/vpn-gateway/about-gateway-skus.md#benchmark) |1 |
| [Virtual network gateways (ExpressRoute gateways) per virtual network](../articles/expressroute/expressroute-about-virtual-network-gateways.md#gwsku) |1 |
| DNS servers per virtual network |20 |
| DNS servers per network interface |20 |
| Private IP addresses per virtual network |65,536 |
| Total Private Addresses for a group of Peered Virtual networks | 128,000 |
| Private IP addresses per network interface |256 |
| Private IP addresses per virtual machine |256 * N (N is number of NICs on VM) |
| Public IP addresses per network interface |256 |
| Public IP addresses per virtual machine |256 |
| [Concurrent TCP or UDP flows per NIC of a virtual machine or role instance](../articles/virtual-network/virtual-machine-network-throughput.md#flow-limits-and-active-connections-recommendations) |500,000 |
| Network interface cards |65,536 |
| Network Security Groups |5,000 |
| NSG rules per NSG |1,000 |
| IP addresses and ranges specified for source or destination in a security group (The limit applies separately to source and destination) |4,000 |
| Application security groups |3,000 |
| Application security groups per IP configuration, per NIC | 20 |
| Application security groups referenced as source/destination per NSG rule | 10 |
| IP configurations per application security group |4,000 |
| Application security groups that can be specified within all security rules of a network security group |100 |
| User-defined route tables |200 |
| User-defined routes per route table |600<sup>1</sup> |
| Routes with service tag per route table | 25 |
| Point-to-site root certificates per Azure VPN Gateway |20 |
| Point-to-site revoked client certificates per Azure VPN Gateway |300 |
| Virtual network TAPs |100 |
| Network interface TAP configurations per virtual network TAP |100 |

<sup>1</sup>Support for user-defined route per subscription higher than 600 is available via [Azure Virtual Network Manager](../articles/virtual-network-manager/overview.md). 

#### <a name="publicip-address"></a>Public IP address limits
| Resource | Default limit | Maximum limit |
| --- | --- | --- |
| Basic Public IPv4, IPv6 addresses<sup>1,2</sup> | 10 | Contact support |
| Standard Public IPv4, IPv6 addresses<sup>1</sup> | 10 | Contact support |
| Global Tier Public IPv4, IPv6 addresses<sup>1</sup> | 10 | Contact support |
| Routing Preference Internet Public IPv4, IPv6 addresses<sup>1</sup> | 10 | Contact support |
| Public IP prefixes | limited by number of Standard Public IPs in a subscription | Contact support |
| Public IP prefix length | /28 | Contact support |
| Custom IP prefixes | 5 | Contact support |

<sup>1</sup>Default limits for Public IPv4/v6 addresses vary by offer category type, such as Free Trial, pay-as-you-go, CSP. For example, the default for Enterprise Agreement subscriptions is 1000 and the default for pay-as-you-go is 20. The majority of offers start at 10.  There's also an overall maximum number of Public IP addresses per subscription.

<sup>2</sup>Basic Public IP addresses are deprecated and will be retired as of September 30, 2025.  See [here](https://azure.microsoft.com/updates?id=upgrade-to-standard-sku-public-ip-addresses-in-azure-by-30-september-2025-basic-sku-will-be-retired) for additional details.

<a name="virtual-networking-limits-classic"></a>The following limits apply only for networking resources managed through the **classic** deployment model per subscription. Learn how to [view your current resource usage against your subscription limits](../articles/networking/check-usage-against-limits.md).

| Resource | Default limit | Maximum limit |
| --- | --- | --- |
| Virtual networks |100 |100 |
| Local network sites |20 |50 |
| DNS servers per virtual network |20 |20 |
| Private IP addresses per virtual network |4,096 |4,096 |
| Concurrent TCP or UDP flows per NIC of a virtual machine or role instance |500,000, up to 1,000,000 for two or more NICs. |500,000, up to 1,000,000 for two or more NICs. |
| Network Security Groups (NSGs) |200 |200 |
| NSG rules per NSG |200 |1,000 |
| User-defined route tables |200 |200 |
| User-defined routes per route table |400 |400 |
| Public IP addresses (dynamic) |500 |500 |
| Reserved public IP addresses |500 |500 |
| Public IP per deployment |5 |Contact support |
| Private IP (internal load balancing) per deployment |1 |1 |
| Endpoint access control lists (ACLs) |50 |50 |
