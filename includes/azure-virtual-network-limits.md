---
 title: include file
 description: include file
 services: networking
 author: jimdial
 ms.service: networking
 ms.topic: include
 ms.date: 08/16/2018
 ms.author: jdial
 ms.custom: include file

---

<a name="virtual-networking-limits-classic"></a>The following limits apply only for networking resources managed through the classic deployment model per subscription. Learn how to [view your current resource usage against your subscription limits](../articles/networking/check-usage-against-limits.md).

| Resource | Default limit | Maximum limit |
| --- | --- | --- |
| Virtual networks |50 |100 |
| Local network sites |20 |contact support |
| DNS Servers per virtual network |20 |100 |
| Private IP Addresses per virtual network |4096 |4096 |
| Concurrent TCP or UDP flows per NIC of a virtual machine or role instance |500K |500K |
| Network Security Groups (NSG) |100 |200 |
| NSG rules per NSG |200 |1000 |
| User defined route tables |100 |200 |
| User defined routes per route table |100 |400 |
| Public IP addresses (dynamic) |5 |contact support |
| Reserved public IP addresses |20 |contact support |
| Public VIP per deployment |5 |contact support |
| Private VIP (ILB) per deployment |1 |1 |
| Endpoint Access Control Lists (ACLs) |50 |50 |

#### <a name="azure-resource-manager-virtual-networking-limits"></a>Networking Limits - Azure Resource Manager
The following limits apply only for networking resources managed through Azure Resource Manager per region per subscription. Learn how to [view your current resource usage against your subscription limits](../articles/networking/check-usage-against-limits.md).

> [!NOTE]
> We recently increased all default limits to their maximum limits. If there is no **Maximum Limit** column, then the resource doesn't have adjustable limits. If you have had these limits increased by support in the past and do not see updated limits as below, you can [open an online customer support request at no charge](../articles/azure-resource-manager/resource-manager-quota-errors.md)

| Resource | Default limit | 
| --- | --- |
| Virtual networks |1000 |
| Subnets per virtual network |3000 |
| Virtual network peerings per Virtual Network |100 |
| DNS Servers per virtual network |25 |
| Private IP Addresses per virtual network |65536 |
| Private IP Addresses per network interface |256 |
| Concurrent TCP or UDP flows per NIC of a virtual machine or role instance |500K |
| Network Interfaces (NIC) |24000 |
| Network Security Groups (NSG) |5000 |
| NSG rules per NSG |1000 |
| IP addresses and ranges specified for source or destination in a security group |4000 |
| Application security groups |3000 |
| Application security groups per IP configuration, per NIC |20 |
| IP configurations per application security group |4000 |
| Application security groups that can be specified within all security rules of a network security group |100 |
| User defined route tables |200 |
| User defined routes per route table |400 |
| Point-to-Site Root Certificates per VPN Gateway |20 |
| Virtual network TAPs |100 |
| Network interface TAP configurations per virtual network TAP |100 |

#### <a name="publicip-address"></a>Public IP address limits

| Resource | Default limit | Maximum Limit |
| --- | --- | --- |
| Public IP addresses - dynamic |(Basic) 200 |contact support |
| Public IP addresses - static |(Basic) 200 |contact support |
| Public IP addresses - static |(Standard) 200 |contact support |

#### <a name="load-balancer"></a>Load Balancer limits
The following limits apply only for networking resources managed through Azure Resource Manager per region per subscription. Learn how to [view your current resource usage against your subscription limits](../articles/networking/check-usage-against-limits.md)

| Resource | Default limit | Maximum Limit |
| --- | --- | --- |
| Load Balancers | 100 | 1000 |
| Rules per resource, Basic | 250 | 250 |
| Rules per resource, Standard | 1500 | 1500 |
| Rules per IP configuration | 299 |299 |
| Frontend IP configurations, Basic | 10 | 200 |
| Frontend IP configurations, Standard | 10 | 600 |
| Backend pool, Basic | 100, single Availability Set | 100, single Availability Set |
| Backend pool, Standard | 1000, single VNet | 1000, single VNet |
| Backend resources per Load Balancer, Standard * | 150 | 150 |
| HA Ports, Standard | 1 per internal frontend | 1 per internal frontend |

** Up to 150 resources, any combination of standalone virtual machines, availability sets, and virtual machine scale sets.

[Contact support](../articles/azure-supportability/resource-manager-core-quotas-request.md ) in case you need to increase limits from default.

