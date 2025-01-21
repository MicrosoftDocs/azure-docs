---
title: Azure Load Balancer Best Practices
titleSuffix: Azure Load Balancer
description: Learn about the best practices for deploying and configuring Azure Load Balancer.
services: load-balancer
author: cozhang8
ms.service: azure-load-balancer
ms.topic: troubleshooting
ms.date: 01/13/2024
ms.author: mbender
---

# Azure Load Balancer Best Practices
<!-- Before Publishing: -->
<!-- Verify TOC entry is added to TOC.yml -->

This article discusses a collection of Azure best practices for your load balancer deployment. These best practices are derived from our experience with Azure networking and the experiences of customers like yourself.  

For each best practice, this article explains: 

- What the best practice is
- Why you want to enable that best practice
- What might happen if you fail to enable the best practice
- How you can learn to enable this best practice 

These best practices are based on a consensus opinion, and Azure platform capability and features sets, as they exist at the time this article was written. 

<!-- Comment: Let's rethink the headers. The current draft goes a bit deep (level 4). I think we can get away with 2 levels. Since all of the items under Architectural Guidance are under Reliability Best Practices, do we need Reliability Best Practices? -->
## Architectural Guidance
### Reliability Best Practices
#### Deploy with zone-redundancy 
Zone-redundancy provides the best resiliency by protecting the data path from zone failure. The load balancer's availability zone selection is synonymous with its frontend IP's zone selection. For public load balancers, if the public IP in the load balancer's frontend is zone redundant then the load balancer is also zone-redundant.
- Deploy load balancer in a region that supports availability zones and enable Zone-redundant when creating a new Public IP address used for the Frontend IP configuration.
- Public IP addresses cannot be changed to zone redundant but we are updating all non-zonal Standard Public IPs to be zone redundant by default. For more information, visit the following Microsoft Azure Blog [Azure Public IPs are now zone-redundant by default | Microsoft Azure Blog] [https://azure.microsoft.com/en-us/blog/azure-public-ips-are-now-zone-redundant-by-default/?msockid=028aa4446a5a601f37ecb0076b7761c7]. To see the most updated list of regions that support zone redundant Standard Public IPs by default, please refer to [Public IP addresses in Azure - Azure Virtual Network | Microsoft Learn.][https://learn.microsoft.com/en-us/azure/virtual-network/ip-services/public-ip-addresses#availability-zone]
- If you cannot deploy as zone-redundant, the next option is to have a zonal load balancer deployment.
- Zonal frontend is recommended when the backend is concentrated in a particular zone, but we recommend deploying backend pool members across multiple zones to benefit from zone redundancy.
- Refer to the following the doc if you want to migrate existing deployments to zonal or zone-redundant [Migrate Load Balancer to availability zone support | Microsoft Learn][https://learn.microsoft.com/en-us/azure/reliability/migrate-load-balancer].

#### Redundancy in your backend pool

Ensure that the backend pool contains at least 2 instances. If your backend pool only has 1 instance and it is unhealthy, there is no redundancy, and the traffic sent to the backend pool will fail.  

<!--- When adding additional content, add 1 section at a time. Use the appropriate header level (denoted by hashes). Re-create all bullet lists -->

#### Deploy a global load balancer

Standard Load Balancer supports cross-region load balancing enabling regional redundancy through linking a global load balancer to your existing regional load balancers. If you have a zone redundant deployment and that region fails, your deployment will be impacted. With a global load balancer, there will be no impact because the traffic would be routed to the next closest healthy regional load balancer.

For more information, visit the [Azure Load Balancer Reliability documentation] [https://learn.microsoft.com/en-us/azure/reliability/reliability-load-balancer].

#### Reliability with Gateway Load Balancer
Chain your Gateway Load Balancer to a Standard Public Load Balancer to get high availability and redundancy on both the NVA and application layer. 

#### Use Gateway LB when using NVAs instead of a dual load balancer set-up.

We recommend using a Gateway load balancer in north-south traffic scenarios with third-party Network Virtual Appliances (NVAs). It is easier to deploy because Gateway load balancers don’t require additional configuration such as UDRs because it maintains flow stickiness and flow symmetry. It is also easier to manage because NVAs can be easily added and removed. For more information, check out the [Gateway Load Balancer documentation][https://learn.microsoft.com/en-us/azure/load-balancer/gateway-overview].

## Configuration Guidance

#### Create NSGs

Create Network Security Groups (NSGs) to explicitly permit allowed inbound traffic. NSGs must be created on the subnet or network interface card (NIC) of your VM, otherwise there will be no inbound connectivity to your Standard external load balancers. For more information, see [Create, change, or delete an Azure network security group | Microsoft Learn][https://learn.microsoft.com/en-us/azure/virtual-network/manage-network-security-group?tabs=network-security-group-portal]

#### Unblock 168.63.129.16 IP address

Ensure 168.63.129.16 IP address is not blocked by any Azure network security groups and local firewall policies. This IP address enables health probes from Azure Load Balancer to determine the health state of the VM. If it is not allowed, the health probe fails as it is unable to reach your instance and it will mark your instance as down. For more information, visit [Azure Load Balancer health probes | Microsoft Learn and What is IP address 168.63.129.16? | Microsoft Learn][https://learn.microsoft.com/en-us/azure/virtual-network/what-is-ip-address-168-63-129-16]

#### Use outbound rules with manual port allocation.

Use outbound rules with manual port allocation instead of default port allocation to prevent SNAT exhaustion or connection failures. Default port allocation automatically assigns a conservative number of ports which can cause a higher risk of SNAT port exhaustion. Manual port allocation can help maximize the number of SNAT ports made available for each of the instances in your backend pool which can help prevent your connections from being impacted due to port reallocation. 
There are two options for manual port allocation, “ports per instance” or “maximum number of backend instances”. To understand the considerations of both, visit [Source Network Address Translation (SNAT) for outbound connections - Azure Load Balancer | Microsoft Learn] [https://learn.microsoft.com/en-us/azure/load-balancer/load-balancer-outbound-connections#outboundrules] 

#### Check your distribution mode

Azure Load Balancer uses a 5-tuple hash based distribution mode by default and also offers session persistence using a 2-tuple or 3-tuple hash.  Consider whether your deployment could benefit from session persistence (also known as session affinity) where connections from the same client IP or same client IP and protocol go to the same backend instance within the backend pool. Also consider that enabling session affinity can cause uneven load distribution is majority of connections are coming from the same client IP or same client IP and protocol.
For more information about Azure Load Balancers distribution modes, visit [Azure Load Balancer distribution modes | Microsoft Learn] [https://learn.microsoft.com/en-us/azure/load-balancer/distribution-mode-concepts].

#### Enable TCP resets

Enabling TCP resets on your Load Balancer sends bidirectional TCP resets packets to both client and server endpoints on idle timeout to inform your application endpoints that the connection timed out and is no longer usable. Without enabling TCP reset, the Load Balancer will silently drop flows when the idle timeout of a flow is reached. It may also be beneficial to increase idle timeout and/or use a TCP keep-alive if you’re seeing connections time out.
For more information on TCP resets, idle timeouts, and TCP keep-alives, visit [Load Balancer TCP Reset and idle timeout in Azure - Azure Load Balancer | Microsoft Learn][https://learn.microsoft.com/en-us/azure/load-balancer/load-balancer-tcp-reset].

#### Configure loop back interface when setting up floating IP

If you enable floating IP, ensure you have a loopback interface within guest OS that is configured with the frontend IP address of the load balancer. Please refer to [Azure Load Balancer Floating IP configuration | Microsoft Learn] [https://learn.microsoft.com/en-us/azure/load-balancer/load-balancer-floating-ip#floating-ip-guest-os-configuration] for more information.

#### Implement Gateway Load Balancer configuration best practices

Separate your trusted and untrusted traffic on two different tunnel interfaces; use the tunnel interface type external for untrusted/not yet inspected or managed traffic and use the tunnel interface type internal for trusted/inspected traffic. As a security best practice, doing so will ensure isolation of trusted and untrusted traffic and can allow for more granular traffic control and troubleshooting. 

Ensure your NVAs MTU limit has been increased to at least 1550, or up to the recommended limit of 4000 in the case of any scenarios where jumboframes may be used. Without increasing the MTU limit, you may experience packet drops due to the larger packet size from additional packets generated by the VXLAN headers.

## Retirement Announcements

Along with new improvements and updates to Azure Load Balancer, there are also deprecations to functionalities. It is critical to stay updated and ensure you are making the necessary changes to avoid any potential service disruptions. Please note that this is not the complete list of retirement announcements, visit the [Azure Updates page] [https://azure.microsoft.com/en-us/updates?filters=%5B%22Load+Balancer%22%2C%22Retirements%22%5D] and filter for “Load Balancer” under “Products” and “Retirements” under “Update Type”.

#### Use or upgrade to Standard Load Balancer.

[Basic Load Balancer will be retired September 30, 2025] [https://azure.microsoft.com/en-us/updates?id=azure-basic-load-balancer-will-be-retired-on-30-september-2025-upgrade-to-standard-load-balancer] and customers should upgrade from Basic Load Balancer to Standard Load Balancer by then. Standard Load Balancer provides significant improvements including high performance, ultra-low latency, security by default, and SLA of 99.99% availability. 

#### Do not use default outbound access
Do not use [default outbound access[https://learn.microsoft.com/en-us/azure/virtual-network/ip-services/default-outbound-access]] and ensure all VMs have a defined explicit outbound method. This is recommended for better security and greater control over how your VMs connect to the internet. Default outbound access will [retire September 30, 2025][https://azure.microsoft.com/en-us/updates?id=default-outbound-access-for-vms-in-azure-will-be-retired-transition-to-a-new-method-of-internet-access] and VMs created after this date must use one of the following outbound solutions to communicate to the internet:
- Associate a NAT GW to the subnet
- Use the frontend IP(s) of a Load Balancer for outbound via outbound rules
- Assign a public IP (aka instance level public IP address) to the VM 
