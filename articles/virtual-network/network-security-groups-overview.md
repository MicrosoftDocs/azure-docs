---
title: Azure network security groups overview
titlesuffix: Azure Virtual Network
description: Learn about network security groups. Network security groups help you filter network traffic between Azure resources.
services: virtual-network
author: asudbring
ms.service: azure-virtual-network
ms.topic: concept-article
ms.date: 07/15/2025
ms.author: allensu
ms.reviewer: kumud
ms.custom: FY23 content-maintenance
#customer intent: As a network administrator, I want to configure network security groups to filter traffic between Azure resources, so that I can control access and enhance security across our virtual network.
---

# Azure network security groups overview
<a name="network-security-groups"></a>

You can use an Azure network security group to filter network traffic between Azure resources in Azure virtual networks. A network security group contains [security rules](#security-rules) that allow or deny inbound network traffic to, or outbound network traffic from, several types of Azure resources.

This article explains the properties of a network security group rule and the [default security rules](#default-security-rules) applied by Azure. It also describes how to modify rule properties to create an [augmented security rule](#augmented-security-rules).

## <a name="security-rules"></a> Security rules

A network security group contains network security rules as desired, within Azure subscription [limits](../azure-resource-manager/management/azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits). Each rule specifies the following properties:

|Property    |Explanation    |
|---------|---------|
|Name    | A unique name within the network security group. The name can be up to 80 characters long. It must begin with a word character, and it must end with a word character or with `_`. The name can contain word characters, `.`, `-`, or `\_`.    |
|Priority    | A number between 100 and 4096. Rules are processed in priority order, with lower numbers processed before higher numbers because lower numbers have higher priority. Once traffic matches a rule, processing stops. As a result, any rules that exist with lower priorities (higher numbers) that have the same attributes as rules with higher priorities aren't processed.</br> **Azure default security rules are given the lowest priority (highest number) to ensure your custom rules are always processed first.**    |
|Source or destination    | You can specify Any, an individual IP address, a CIDR block (for example, 10.0.0.0/24), a [service tag](#service-tags), or an [application security group](#application-security-groups). To specify a particular Azure resource, use the private IP address assigned to the resource. For inbound traffic, network security groups process traffic after Azure translates public IP addresses to private IP addresses. For outbound traffic, network security groups process traffic before translating private IP addresses to public IP addresses.</br> Enter a range, service tag, or application security group to reduce the number of security rules needed. Augmented security rules allow specifying multiple individual IP addresses and ranges in a single rule. However, you can't specify multiple service tags or application groups in a single rule. Augmented security rules are only available in network security groups created through the Resource Manager deployment model. In the classic deployment model, multiple IP addresses and ranges can't be specified in a single rule.</br> For example, if the source is subnet 10.0.1.0/24 (where VM1 is located) and the destination is subnet 10.0.2.0/24 (where VM2 is located), the network security group filters traffic for VM2. This behavior occurs because the NSG is associated with VM2's network interface.|
|Protocol    | TCP, UDP, ICMP, ESP, AH, or Any. The ESP and AH protocols aren't currently available via the Azure portal but can be used via ARM templates.    |
|Direction    | Whether the rule applies to inbound or outbound traffic.    |
|Port range    | You can specify an individual port or ranges of ports. For example, you could specify 80 or 10000-10005; or for a mix of individual ports and ranges, you can separate them with commas, such as 80, 10000-10005. Specifying ranges and comma separation empowers you to create fewer security rules. Augmented security rules can only be created in network security groups created through the Resource Manager deployment model. You can't specify multiple ports or port ranges in the same security rule in network security groups created through the classic deployment model.    |
|Action     | Allow or deny your specified traffic.    |

Security rules are evaluated and applied based on the five-tuple information of source, source port, destination, destination port, and protocol. You can't create two security rules with the same priority and direction. Two security rules with the same priority and direction can introduce a conflict in how the system processes traffic. A flow record is created for existing connections. Communication is allowed or denied based on the connection state of the flow record. The flow record allows a network security group to be stateful. If you specify an outbound security rule to any address over port 80, for example, it's not necessary to specify an inbound security rule for the response to the outbound traffic. You only need to specify an inbound security rule if communication is initiated externally. The opposite is true. If inbound traffic is allowed over a port, it's not necessary to specify an outbound security rule to respond to traffic over the port.

When you remove a security rule that allowed a connection, existing connections remain uninterrupted. Network security group rules only affect new connections. New or updated rules in a network security group apply exclusively to new connections, leaving existing connections unaffected by the changes. For example, if you have an active SSH session to a virtual machine and then remove the security rule allowing that SSH traffic, your current SSH session remains connected and functional. However, if you try to establish a new SSH connection after the security rule removal, that new connection attempt will be blocked. 

There are limits to the number of security rules you can create in a network security group and other properties of the network security group. For details, see [Azure limits](../azure-resource-manager/management/azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits).

### <a name="default-security-rules"></a> Default security rules

Azure creates the following default rules in each network security group that you create:

#### Inbound

##### AllowVNetInBound

|Priority|Source|Source ports|Destination|Destination ports|Protocol|Access|
|---|---|---|---|---|---|---|
|65000|VirtualNetwork|0-65535|VirtualNetwork|0-65535|Any|Allow|

##### AllowAzureLoadBalancerInBound

|Priority|Source|Source ports|Destination|Destination ports|Protocol|Access|
|---|---|---|---|---|---|---|
|65001|AzureLoadBalancer|0-65535|0.0.0.0/0|0-65535|Any|Allow|

##### DenyAllInbound

|Priority|Source|Source ports|Destination|Destination ports|Protocol|Access|
|---|---|---|---|---|---|---|
|65500|0.0.0.0/0|0-65535|0.0.0.0/0|0-65535|Any|Deny|

#### Outbound

##### AllowVnetOutBound

|Priority|Source|Source ports| Destination | Destination ports | Protocol | Access |
|---|---|---|---|---|---|---|
| 65000 | VirtualNetwork | 0-65535 | VirtualNetwork | 0-65535 | Any | Allow |

##### AllowInternetOutBound

|Priority|Source|Source ports| Destination | Destination ports | Protocol | Access |
|---|---|---|---|---|---|---|
| 65001 | 0.0.0.0/0 | 0-65535 | Internet | 0-65535 | Any | Allow |

##### DenyAllOutBound

|Priority|Source|Source ports| Destination | Destination ports | Protocol | Access |
|---|---|---|---|---|---|---|
| 65500 | 0.0.0.0/0 | 0-65535 | 0.0.0.0/0 | 0-65535 | Any | Deny |

In the **Source** and **Destination** columns, *VirtualNetwork*, *AzureLoadBalancer*, and *Internet* are [service tags](service-tags-overview.md) rather than IP addresses. In the **Protocol** column, *Any* encompasses TCP, UDP, and ICMP. When creating a rule, you can specify TCP, UDP, ICMP, or Any. *0.0.0.0/0* in the **Source** and **Destination** columns represents all IP addresses. Clients like the Azure portal, Azure CLI, or PowerShell can use * or Any for this expression.
 
You can't remove the default rules, but you can override them by creating rules with higher priorities.

### <a name="augmented-security-rules"></a> Augmented security rules

Augmented security rules simplify the security definition for virtual networks, allowing you to define larger and complex network security policies with fewer rules. You can combine multiple ports and multiple explicit IP addresses and ranges into a single, easily understood security rule. Use augmented rules in the source, destination, and port fields of a rule. To simplify maintenance of your security rule definition, combine augmented security rules with [service tags](service-tags-overview.md) or [application security groups](#application-security-groups). There are limits to the number of addresses, ranges, and ports that you can specify in a security rule. For details, see [Azure limits](../azure-resource-manager/management/azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits).

#### Service tags

A service tag represents a group of IP address prefixes from a given Azure service. It helps minimize the complexity of frequent updates on network security rules.

For more information, see [Azure service tags](service-tags-overview.md). For an example on how to use the Storage service tag to restrict network access, see [Restrict network access to PaaS resources](tutorial-restrict-network-access-to-resources.md).

#### Application security groups

Application security groups enable you to configure network security as a natural extension of an application's structure, allowing you to group virtual machines and define network security policies based on those groups. You can reuse your security policy at scale without manual maintenance of explicit IP addresses. To learn more, see [Application security groups](application-security-groups.md).

### <a name="security-admin-rules"></a> Security admin rules

Security admin rules are global network security rules that enforce security policies onto virtual networks. Security admin rules originate from Azure Virtual Network Manager, a management service that enables network administrators to group, configure, deploy, and manage virtual networks globally across subscriptions.

Security admin rules always have a higher priority than network security group rules and thus are evaluated first. "Allow" security admin rules continue for evaluation by matching network security group rules. "Always allow" and "Deny" security admin rules, however, terminate traffic evaluation after the security admin rule is processed. "Always allow" security admin rules send traffic directly to the resource, bypassing potentially conflicting network security group rules. "Deny" security admin rules block the traffic without delivering it to the destination. These rules enforce baseline security policy without risk of network security group conflict, misconfiguration, or introduction of security gaps. These security admin rule action types can be useful for enforcing traffic delivery and preventing conflicting or unintended behavior by downstream network security group rules.

This behavior is important to understand, as traffic matching security admin rules of "Always allow" or "Deny" action types don't reach network security group rules for further evaluation. To learn more, see [Security admin rules](../virtual-network-manager/concept-security-admins.md).

## Flow timeout

[!INCLUDE [NSG flow logs retirement](../../includes/network-watcher-nsg-flow-logs-retirement.md)]

Flow timeout settings determine how long a flow record remains active before expiring. You can configure this setting using the Azure portal or through the command line. For more information, see [NSG flow logs overview](../network-watcher/nsg-flow-logs-overview.md?tabs=Americas#non-default-inbound-tcp-rules).

## Azure platform considerations

- **Virtual IP of the host node**: Basic infrastructure services like DHCP, DNS, IMDS, and health monitoring are provided through the virtualized host IP addresses 168.63.129.16 and 169.254.169.254. These IP addresses belong to Microsoft and are the only virtualized IP addresses used in all regions for this purpose. By default, these services aren't subject to the configured network security groups unless targeted by [service tags](service-tags-overview.md) specific to each service. To override this basic infrastructure communication, you can create a security rule to deny traffic by using the following service tags on your Network Security Group rules: AzurePlatformDNS, AzurePlatformIMDS, AzurePlatformLKM. Learn how to [diagnose network traffic filtering](diagnose-network-traffic-filter-problem.md) and [diagnose network routing](diagnose-network-routing-problem.md).

- **Licensing (Key Management Service)**: Windows images running in virtual machines must be licensed. To ensure licensing, the system sends a request to the Key Management Service host servers that handle such queries. The request is made outbound through port 1688. For deployments using [default route 0.0.0.0/0](virtual-networks-udr-overview.md#default-route) configuration, this platform rule is disabled.

- **Virtual machines in load-balanced pools**: The source port and address range applied are from the originating computer, not the load balancer. The destination port and address range are for the destination computer, not the load balancer.

- **Azure service instances**: Instances of several Azure services, such as HDInsight, Application Service Environments, and Virtual Machine Scale Sets, are deployed in virtual network subnets. See a complete list of [services you can deploy into virtual networks](virtual-network-for-azure-services.md#services-that-can-be-deployed-into-a-virtual-network). Before applying a network security group to the subnet, familiarize yourself with the port requirements for each service. If you deny ports required by the service, the service doesn't function properly.

- **Sending outbound email**: Microsoft recommends that you utilize authenticated SMTP relay services (typically connected via TCP port 587, but often others, as well) to send email from Azure Virtual Machines. SMTP relay services specialize in sender reputation, to minimize the possibility that partner email providers reject messages. Such SMTP relay services include, but aren't limited to, Exchange Online Protection and SendGrid. Use of SMTP relay services is in no way restricted in Azure, regardless of your subscription type. 

  If you created your Azure subscription before November 15, 2017, in addition to being able to use SMTP relay services, you can send email directly over TCP port 25. If you created your subscription after November 15, 2017, you might not be able to send email directly over port 25. The behavior of outbound communication over port 25 depends on the type of subscription you have, as follows:

   - **Enterprise Agreement**: For VMs that are deployed in standard Enterprise Agreement subscriptions, the outbound SMTP connections on TCP port 25 aren't blocked. However, there's no guarantee that external domains accept the incoming emails from the VMs. If external domains reject or filter emails, contact the email service providers of the external domains to resolve the problems. These problems aren't covered by Azure support.

      For Enterprise Dev/Test subscriptions, port 25 is blocked by default. It's possible to have this block removed. To request to have the block removed, go to the **Can't send email (SMTP-Port 25)** section of the **Diagnose and Solve** settings page for the Azure Virtual Network resource in the Azure portal and run the diagnostic. This procedure exempts the qualified enterprise dev/test subscriptions automatically.

      After the subscription is exempted from this block and the VMs are stopped and restarted, all VMs in that subscription are exempted going forward. The exemption applies only to the subscription requested and only to VM traffic that routes directly to the internet.

   - **Pay-as-you-go:** Outbound port 25 communication is blocked from all resources. No requests to remove the restriction can be made, because requests aren't granted. If you need to send email from your virtual machine, you have to use an SMTP relay service.

   - **MSDN, Azure Pass, Azure in Open, Education, and Free trial**: Outbound port 25 communication is blocked from all resources. No requests to remove the restriction can be made, because requests aren't granted. If you need to send email from your virtual machine, you have to use an SMTP relay service.

   - **Cloud service provider**: Outbound port 25 communication is blocked from all resources. No requests to remove the restriction can be made, because requests aren't granted. If you need to send email from your virtual machine, you have to use an SMTP relay service.

## Next steps

* Learn which Azure resources you can deploy into a virtual network. See [Virtual network integration for Azure services](virtual-network-for-azure-services.md) to understand how network security groups can be associated with them.

* To learn how network security groups evaluate traffic, see [How network security groups work](network-security-group-how-it-works.md).

* Create a network security group by following this quick [tutorial](tutorial-filter-network-traffic.md).

* If you're familiar with network security groups and need to manage them, see [Manage a network security group](manage-network-security-group.md). 

* If you're having communication problems and need to troubleshoot network security groups, see [Diagnose a virtual machine network traffic filter problem](diagnose-network-traffic-filter-problem.md).
 
* Learn how to enable [virtual network flow logs](../network-watcher/vnet-flow-logs-overview.md) to analyze network traffic flowing through a virtual network that might match an associated network security group.
