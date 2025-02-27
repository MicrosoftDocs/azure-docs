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

## Architectural best practices

The following architectural guidance helps ensure the reliability of your Azure Load Balancer deployment. It includes best practices for deploying with zone-redundancy, redundancy in your backend pool, and deploying a global load balancer. Along with reliability for Gateway Load Balancer, which is recommended when using NVAs instead of a dual load balancer set-up.

### Reliability best practices

The following best practices are recommended to ensure the reliability of your Azure Load Balancer deployment.

#### Deploy with zone-redundancy

Zone-redundancy provides the best resiliency by protecting the data path from zone failure. The load balancer's availability zone selection is synonymous with its frontend IP's zone selection. For public load balancers, if the public IP in the load balancer's frontend is zone redundant then the load balancer is also zone-redundant.
- Deploy load balancer in a region that supports availability zones and enable Zone-redundant when creating a new Public IP address used for the Frontend IP configuration.
- Public IP addresses can't be changed to zone redundant but we're updating all non-zonal Standard Public IPs to be zone redundant by default. For more information, visit the following Microsoft Azure Blog [Azure Public IPs are now zone-redundant by default | Microsoft Azure Blog](https://azure.microsoft.com/blog/azure-public-ips-are-now-zone-redundant-by-default/?msockid=028aa4446a5a601f37ecb0076b7761c7). To see the most updated list of regions that support zone redundant Standard Public IPs by default, see [Public IP addresses in Azure](../virtual-network/ip-services/public-ip-addresses.md)
- If you can't deploy as zone-redundant, the next option is to have a zonal load balancer deployment.
- A Zonal frontend is recommended when the backend is concentrated in a particular zone. Though we recommend deploying backend pool members across multiple zones to benefit from zone redundancy.
- Refer to the following the doc if you want to migrate existing deployments to zonal or zone-redundant [Migrate Load Balancer to availability zone support](../reliability/migrate-load-balancer.md).

#### Redundancy in your backend pool

Ensure that the backend pool contains at least two instances. If your backend pool only has one instance and it's unhealthy, all traffic sent to the backend pool fails due to lack of redundancy. The Standard Load Balancer SLA is also only supported when there are at least 2 healthy backend pool instances per backend pool. Visit the [SLA documentation](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services?lang=1) for more information.    

#### Deploy a global load balancer

Standard Load Balancer supports cross-region load balancing enabling regional redundancy through linking a global load balancer to your existing regional load balancers. With a global load balancer, if one region fails, the traffic is routed to the next closest healthy regional load balancer. For more details, visit the [Global Load Balancer documentation](cross-region-overview.md).

For more information, see [Azure Load Balancer Reliability documentation](../reliability/reliability-load-balancer.md).

### Reliability with Gateway Load Balancer

The following best practices are recommended to ensure the reliability of your Gateway Load Balancer deployment.

#### Chain your Gateway Load Balancer to a Standard Public Load Balancer

Chaining your Gateway Load Balancer to a Standard Public Load Balancer is recommended. This configuration provides high availability and redundancy on both the NVA and application layer. For more information, see [Tutorial: Create a gateway load balancer](./tutorial-gateway-portal.md)

#### Use a Gateway load balancer when using NVAs instead of a dual load balancer set-up.

We recommend using a Gateway load balancer in north-south traffic scenarios with partner Network Virtual Appliances (NVAs). It's easier to deploy because Gateway load balancers don’t require extra configuration such as user-defined routes (UDRs) because it maintains flow stickiness and flow symmetry. It's also easier to manage because NVAs can be easily added and removed. For more information, see the [Gateway Load Balancer documentation](gateway-overview.md).

## Configuration guidance

The following configuration guidance are best practices for configuring your Azure Load Balancer deployments. 

### Create Network Security Groups (NSGs)

To explicitly permit allowed inbound traffic, you should create Network Security Groups (NSGs). NSGs must be created on the subnet or network interface card (NIC) of your VM, otherwise there will be no inbound connectivity to your Standard external load balancers. For more information, see [Create, change, or delete an Azure network security group](../virtual-network/manage-network-security-group.md).

### Unblock 168.63.129.16 IP address

Ensure 168.63.129.16 IP address isn't blocked by any Azure network security groups and local firewall policies. This IP address enables health probes from Azure Load Balancer to determine the health state of the VM. If it isn't allowed, the health probe fails as it is unable to reach your instance and it marks your instance as down. For more information, see [Azure Load Balancer health probe](load-balancer-custom-probe-overview.md) and [What is IP address 168.63.129.16?](../virtual-network/what-is-ip-address-168-63-129-16.md)s.

### Use outbound rules with manual port allocation

Use outbound rules with manual port allocation instead of default port allocation to prevent SNAT exhaustion or connection failures. Default port allocation automatically assigns a conservative number of ports which can cause a higher risk of SNAT port exhaustion. Manual port allocation can help maximize the number of SNAT ports made available for each of the instances in your backend pool which can help prevent your connections from being impacted due to port reallocation. 
There are two options for manual port allocation, “ports per instance” or “maximum number of backend instances”. To understand the considerations of both, see [Source Network Address Translation (SNAT) for outbound connections](load-balancer-outbound-connections.md).

### Check your distribution mode

Azure Load Balancer uses a 5-tuple hash based distribution mode by default and also offers session persistence using a 2-tuple or 3-tuple hash. Consider whether your deployment could benefit from session persistence (also known as session affinity) where connections from the same client IP or same client IP and protocol go to the same backend instance within the backend pool. Also consider that enabling session affinity can cause uneven load distribution as most connections come from the same client IP or same client IP and protocol will be sent to the same backend VM.
For more information about Azure Load Balancers distribution modes, see [Azure Load Balancer distribution modes](distribution-mode-concepts.md).

### Enable TCP resets

Enabling TCP resets on your Load Balancer sends bidirectional TCP resets packets to both client and server endpoints on idle time-out to inform your application endpoints that the connection timed out and is no longer usable. Without enabling TCP reset, the Load Balancer silently drops flows when the idle time-out of a flow is reached. It can also be beneficial to increase idle time-out and/or use a TCP keep-alive if you’re seeing connections time out.
For more information on TCP resets, idle time-outs, and TCP keepalive, visit [Load Balancer TCP Reset and idle time-out in Azure](load-balancer-tcp-reset.md).

### Configure loop back interface when setting up floating IP

If you enable floating IP, ensure you have a loopback interface within guest OS that is configured with the frontend IP address of the load balancer. Floating IP needs to be enabled it you want to reuse the backend port across multiple rules. Some example use cases of port reuse include clustering for high availability and network virtual appliances. For more information, see [Azure Load Balancer Floating IP configuration](load-balancer-floating-ip.md#floating-ip-guest-os-configuration).

### Implement Gateway Load Balancer configuration best practices

Separate your trusted and untrusted traffic on two different tunnel interfaces; use the tunnel interface type external for untrusted/not yet inspected or managed traffic and use the tunnel interface type internal for trusted/inspected traffic. As a security best practice, this ensures isolation of trusted and untrusted traffic and can allow for more granular traffic control and troubleshooting. 

Ensure your NVAs MTU limit is increased to at least 1550, or up to the recommended limit of 4000 for scenarios where jumbo frames are used. Without increasing the MTU limit, you can experience packet drops due to the larger packet size from other packets generated by the VXLAN headers.

## Retirement announcements

Along with new improvements and updates to Azure Load Balancer, there are also deprecations to functionalities. It's critical to stay updated and ensure you're making the necessary changes to avoid any potential service disruptions. For a complete list of retirement announcements, see the [Azure Updates page](https://azure.microsoft.com/updates?filters=%5B%22Load+Balancer%22%2C%22Retirements%22%5D) and filter for “Load Balancer” under “Products” and “Retirements” under “Update Type”.

### Use or upgrade to Standard Load Balancer

[Basic Load Balancer will be retired September 30, 2025](https://azure.microsoft.com/updates?id=azure-basic-load-balancer-will-be-retired-on-30-september-2025-upgrade-to-standard-load-balancer) and customers should upgrade from Basic Load Balancer to Standard Load Balancer by then. Standard Load Balancer provides significant improvements including high performance, ultra-low latency, security by default, and SLA of 99.99% availability. 

### Don't use default outbound access

Moving forward, don't use [default outbound access](../virtual-network/ip-services/default-outbound-access.md) and ensure all VMs have a defined explicit outbound method. This is recommended for better security and greater control over how your VMs connect to the internet. Default outbound access will [retire September 30, 2025](https://azure.microsoft.com/updates?id=default-outbound-access-for-vms-in-azure-will-be-retired-transition-to-a-new-method-of-internet-access) and VMs created after this date must use one of the following outbound solutions to communicate to the internet:
- Associate a NAT GW to the subnet
- Use one or more frontend IPs of a Load Balancer for outbound via outbound rules
- Assign an instance-level public IP address to the VM 

## Next steps

> [!div class="nextstepaction"]
> [Azure Load Balancer overview](load-balancer-overview.md)