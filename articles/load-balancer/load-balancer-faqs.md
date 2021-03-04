---
title: Frequently asked questions - Azure Load Balancer
description: Answers to frequently asked questions about the Azure Load Balancer. 
services: load-balancer
author: erichrt
ms.service: load-balancer
ms.topic: article
ms.date: 04/22/2020
ms.author: errobin
---
# Load Balancer frequently asked questions

## What types of Load Balancer exist?
Internal load balancers which balance traffic within a VNET and external load balancers which balance traffic to and from an internet connected endpoint. For more information, see [Load Balancer Types](components.md#frontend-ip-configurations). 

For both these types, Azure offers a Basic SKU and Standard SKU that have different functional, performance, security and health tracking capabilities. These differences are explained in our [SKU Comparison](skus.md) article.

 ## How can I upgrade from a Basic to a Standard Load Balancer?
See the [upgrade from Basic to Standard](upgrade-basic-standard.md) article for an automated script and guidance on upgrading a Load Balancer SKU.

 ## What are the different load-balancing options in Azure?
See the [load balancer technology guide](/azure/architecture/guide/technology-choices/load-balancing-overview)  for the available load-balancing services and recommended uses for each.

## Where can I find Load Balancer ARM templates?
See the [list of Azure Load Balancer quickstart templates](/azure/templates/microsoft.network/loadbalancers#quickstart-templates) for ARM templates of common deployments.

## How are inbound NAT rules different from load-balancing rules?
NAT rules are used to specify a backend resource to route traffic to. For example, configuring a specific load balancer port to send RDP traffic to a specific VM. Load-balancing rules are used to specify a pool of backend resources to route traffic to, balancing the load across each instance. For example, a load balancer rule can route TCP packets on port 80 of the load balancer across a pool of web servers.

## What is IP 168.63.129.16?
The virtual IP address for the host tagged as the Azure infrastructure Load Balancer where the Azure Health Probes originate. When configuring backend instances, they must allow traffic from this IP address to successfully respond to health probes. This rule does not interact with access to your Load Balancer frontend. If you're not using the Azure Load Balancer, you can override this rule. You can learn more about service tags [here](../virtual-network/service-tags-overview.md#available-service-tags).

## Can I use Global VNet peering with Basic Load Balancer?
No. Basic Load Balancer does not support Global VNET peering. You can use a Standard Load Balancer instead. See the [upgrade from Basic to Standard](upgrade-basic-standard.md) article for seamless upgrade.

## How can I discover the public IP that an Azure VM uses?

There are many ways to determine the public source IP address of an outbound connection. OpenDNS provides a service that can show you the public IP address of your VM.
By using the nslookup command, you can send a DNS query for the name myip.opendns.com to the OpenDNS resolver. The service returns the source IP address that was used to send the query. When you run the following query from your VM, the response is the public IP used for that VM:

 ```nslookup myip.opendns.com resolver1.opendns.com```
 
## Can I add a VM from the same availability set to different backend pools of a Load Balancer?
No, this is not possible.

## What is the maximum data throughput that can be achieved via an Azure Load Balancer?
Since Azure LB is a pass-through network load balancer, throughput limitations are dictated by the type of virtual machine used in the backend pool. To learn about other network throughput related information refer to [Virtual Machine network throughput](../virtual-network/virtual-machine-network-throughput.md).

## How do connections to Azure Storage in the same region work?
Having outbound connectivity via the scenarios above is not necessary to connect to Storage in the same region as the VM. If you do not want this, use network security groups (NSGs) as explained above. For connectivity to Storage in other regions, outbound connectivity is required. Please note that when connecting to Storage from a VM in the same region, the source IP address in the Storage diagnostic logs will be an internal provider address, and not the public IP address of your VM. If you wish to restrict access to your Storage account to VMs in one or more Virtual Network subnets in the same region, use [Virtual Network service endpoints](../virtual-network/virtual-network-service-endpoints-overview.md) and not your public IP address when configuring your storage account firewall. Once service endpoints are configured, you will see your Virtual Network private IP address in your Storage diagnostic logs and not the internal provider address.

## Does Azure Load Balancer support TLS/SSL termination?
No, Azure Load Balancer doesn't currently support termination as it is a pass through network load balancer. Application Gateway could be a potential solution if your application requires this.

## What are best practises with respect to outbound connectivity?
Standard Load Balancer and Standard Public IP introduces abilities and different behaviors to outbound connectivity. They are not the same as Basic SKUs. If you want outbound connectivity when working with Standard SKUs, you must explicitly define it either with Standard Public IP addresses or Standard public Load Balancer. This includes creating outbound connectivity when using an internal Standard Load Balancer. We recommend you always use outbound rules on a Standard public Load Balancer. That means when an internal Standard Load Balancer is used, you need to take steps to create outbound connectivity for the VMs in the backend pool if outbound connectivity is desired. In the context of outbound connectivity,a single standalone VM, all the VM's in an Availability Set, all the instances in a VMSS behave as a group. This means, if a single VM in an Availability Set is associated with a Standard SKU, all VM instances within this Availability Set now behave by the same rules as if they are associated with Standard SKU, even if an individual instance is not directly associated with it. This behavior is also observed in the case of a standalone VM with multiple network interface cards attached to a load balancer. If one NIC is added as a standalone, it will have the same behavior. Carefully review this entire document to understand the overall concepts, review [Standard Load Balancer](./load-balancer-overview.md) for differences between SKUs, and review [outbound rules](load-balancer-outbound-connections.md#outboundrules).
 Using outbound rules allows you fine grained control over all aspects of outbound connectivity.
 
## Next Steps
If your question is not listed above, please send feedback about this page with your question. This will create a GitHub issue for the product team to ensure all of our valued customer questions are answered.
