---
title: Azure Firewall FAQ
description: FAQ for Azure Firewall. A managed, cloud-based network security service that protects your Azure Virtual Network resources.
services: firewall
author: vhorne
ms.service: firewall
ms.topic: conceptual
ms.date: 06/08/2020
ms.author: victorh
---

# Azure Firewall FAQ

## What is Azure Firewall?

Azure Firewall is a managed, cloud-based network security service that protects your Azure Virtual Network resources. It's a fully stateful firewall-as-a-service with built-in high availability and unrestricted cloud scalability. You can centrally create, enforce, and log application and network connectivity policies across subscriptions and virtual networks.

## What capabilities are supported in Azure Firewall?

* Stateful firewall as a service
* Built-in high availability with unrestricted cloud scalability
* FQDN filtering
* FQDN tags
* Network traffic filtering rules
* Outbound SNAT support
* Inbound DNAT support
* Centrally create, enforce, and log application and network connectivity policies across Azure subscriptions and VNETs
* Fully integrated with Azure Monitor for logging and analytics

## What is the typical deployment model for Azure Firewall?

You can deploy Azure Firewall on any virtual network, but customers typically deploy it on a central virtual network and peer other virtual networks to it in a hub-and-spoke model. You can then set the default route from the peered virtual networks to point to this central firewall virtual network. Global VNet peering is supported, but it isn't recommended because of potential performance and latency issues across regions. For best performance, deploy one firewall per region.

The advantage of this model is the ability to centrally exert control on multiple spoke VNETs across different subscriptions. There are also cost savings as you don't need to deploy a firewall in each VNet separately. The cost savings should be measured versus the associate peering cost based on the customer traffic patterns.

## How can I install the Azure Firewall?

You can set up Azure Firewall by using the Azure portal, PowerShell, REST API, or by using templates. See [Tutorial: Deploy and configure Azure Firewall using the Azure portal](tutorial-firewall-deploy-portal.md) for step-by-step instructions.

## What are some Azure Firewall concepts?

Azure Firewall supports rules and rule collections. A rule collection is a set of rules that share the same order and priority. Rule collections are executed in order of their priority. Network rule collections are higher priority than application rule collections, and all rules are terminating.

There are three types of rule collections:

* *Application rules*: Configure fully qualified domain names (FQDNs) that can be accessed from a subnet.
* *Network rules*: Configure rules that contain source addresses, protocols, destination ports, and destination addresses.
* *NAT rules*: Configure DNAT rules to allow incoming Internet connections.

## Does Azure Firewall support inbound traffic filtering?

Azure Firewall supports inbound and outbound filtering. Inbound protection is typically used for non-HTTP/S protocols. For example RDP, SSH, and FTP protocols. For best inbound HTTP/S protection, use a web application firewall such as [Azure Web Application Firewall (WAF)](../web-application-firewall/overview.md).

## Which logging and analytics services are supported by the Azure Firewall?

Azure Firewall is integrated with Azure Monitor for viewing and analyzing firewall logs. Logs can be sent to Log Analytics, Azure Storage, or Event Hubs. They can be analyzed in Log Analytics or by different tools such as Excel and Power BI. For more information, see [Tutorial: Monitor Azure Firewall logs](tutorial-diagnostics.md).

## How does Azure Firewall work differently from existing services such as NVAs in the marketplace?

Azure Firewall is a basic firewall service that can address certain customer scenarios. It's expected that you'll have a mix of third-party NVAs and Azure Firewall. Working better together is a core priority.

## What is the difference between Application Gateway WAF and Azure Firewall?

The Web Application Firewall (WAF) is a feature of Application Gateway that provides centralized inbound protection of your web applications from common exploits and vulnerabilities. Azure Firewall provides inbound protection for non-HTTP/S protocols (for example, RDP, SSH, FTP), outbound network-level protection for all ports and protocols, and application-level protection for outbound HTTP/S.

## What is the difference between Network Security Groups (NSGs) and Azure Firewall?

The Azure Firewall service complements network security group functionality. Together, they provide better "defense-in-depth" network security. Network security groups provide distributed network layer traffic filtering to limit traffic to resources within virtual networks in each subscription. Azure Firewall is a fully stateful, centralized network firewall as-a-service, which provides network- and application-level protection across different subscriptions and virtual networks.

## Are Network Security Groups (NSGs) supported on the AzureFirewallSubnet?

Azure Firewall is a managed service with multiple protection layers, including platform protection with NIC level NSGs (not viewable).  Subnet level NSGs aren't required on the AzureFirewallSubnet, and are disabled to ensure no service interruption.

## How do I set up Azure Firewall with my service endpoints?

For secure access to PaaS services, we recommend service endpoints. You can choose to enable service endpoints in the Azure Firewall subnet and disable them on the connected spoke virtual networks. This way you benefit from both features: service endpoint security and central logging for all traffic.

## What is the pricing for Azure Firewall?

See [Azure Firewall Pricing](https://azure.microsoft.com/pricing/details/azure-firewall/).

## How can I stop and start Azure Firewall?

You can use Azure PowerShell *deallocate* and *allocate* methods.

For example:

```azurepowershell
# Stop an existing firewall

$azfw = Get-AzFirewall -Name "FW Name" -ResourceGroupName "RG Name"
$azfw.Deallocate()
Set-AzFirewall -AzureFirewall $azfw
```

```azurepowershell
# Start a firewall

$azfw = Get-AzFirewall -Name "FW Name" -ResourceGroupName "RG Name"
$vnet = Get-AzVirtualNetwork -ResourceGroupName "RG Name" -Name "VNet Name"
$publicip = Get-AzPublicIpAddress -Name "Public IP Name" -ResourceGroupName " RG Name"
$azfw.Allocate($vnet,$publicip)
Set-AzFirewall -AzureFirewall $azfw
```

> [!NOTE]
> You must reallocate a firewall and public IP to the original resource group and subscription.

## What are the known service limits?

For Azure Firewall service limits, see [Azure subscription and service limits, quotas, and constraints](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-firewall-limits).

## Can Azure Firewall in a hub virtual network forward and filter network traffic between two spoke virtual networks?

Yes, you can use Azure Firewall in a hub virtual network to route and filter traffic between two spoke virtual network. Subnets in each of the spoke virtual networks must have a UDR pointing to the Azure Firewall as a default gateway for this scenario to work properly.

## Can Azure Firewall forward and filter network traffic between subnets in the same virtual network or peered virtual networks?

Yes. However, configuring the UDRs to redirect traffic between subnets in the same VNET requires additional attention. While using the VNET address range as a target prefix for the UDR is sufficient, this also routes all traffic from one machine to another machine in the same subnet through the Azure Firewall instance. To avoid this, include a route for the subnet in the UDR with a next hop type of **VNET**. Managing these routes might be cumbersome and prone to error. The recommended method for internal network segmentation is to use Network Security Groups, which don't require UDRs.

## Does Azure Firewall outbound SNAT between private networks?

Azure Firewall doesn't SNAT when the destination IP address is a private IP range per [IANA RFC 1918](https://tools.ietf.org/html/rfc1918). If your organization uses a public IP address range for private networks, Azure Firewall SNATs the traffic to one of the firewall private IP addresses in AzureFirewallSubnet. You can configure Azure Firewall to **not** SNAT your public IP address range. For more information, see [Azure Firewall SNAT private IP address ranges](snat-private-range.md).

## Is forced tunneling/chaining to a Network Virtual Appliance supported?

Forced tunneling is supported when you create a new firewall. You can't configure an existing firewall for forced tunneling. For more information, see [Azure Firewall forced tunneling](forced-tunneling.md). 

Azure Firewall must have direct Internet connectivity. If your AzureFirewallSubnet learns a default route to your on-premises network via BGP, you must override this with a 0.0.0.0/0 UDR with the **NextHopType** value set as **Internet** to maintain direct Internet connectivity.

If your configuration requires forced tunneling to an on-premises network and you can determine the target IP prefixes for your Internet destinations, you can configure these ranges with the on-premises network as the next hop via a user defined route on the AzureFirewallSubnet. Or, you can use BGP to define these routes.

## Are there any firewall resource group restrictions?

Yes. The firewall, VNet, and the public IP address all must be in the same resource group.

## When configuring DNAT for inbound Internet network traffic, do I also need to configure a corresponding network rule to allow that traffic?

No. NAT rules implicitly add a corresponding network rule to allow the translated traffic. You can override this behavior by explicitly adding a network rule collection with deny rules that match the translated traffic. To learn more about Azure Firewall rule processing logic, see [Azure Firewall rule processing logic](rule-processing.md).

## How do wildcards work in an application rule target FQDN?

If you configure ***.contoso.com**, it allows *anyvalue*.contoso.com, but not contoso.com (the domain apex). If you want to allow the domain apex, you must explicitly configure it as a target FQDN.

## What does *Provisioning state: Failed* mean?

Whenever a configuration change is applied, Azure Firewall attempts to update all its underlying backend instances. In rare cases, one of these backend instances may fail to update with the new configuration and the update process  stops with a failed provisioning state. Your Azure Firewall is still operational, but the applied configuration may be in an inconsistent state, where some instances have the previous configuration where others have the updated rule set. If this happens, try updating your configuration one more time until the operation succeeds and your Firewall is in a *Succeeded* provisioning state.

## How does Azure Firewall handle planned maintenance and unplanned failures?
Azure Firewall consists of several backend nodes in an active-active configuration.  For any planned maintenance, we have connection draining logic to gracefully update nodes.  Updates are planned during non-business hours for each of the Azure regions to further limit risk of disruption.  For unplanned issues, we instantiate a new node to replace the failed node.  Connectivity to the new node is typically reestablished within 10 seconds from the time of the failure.

## How does connection draining work?

For any planned maintenance, connection draining logic gracefully updates backend nodes. Azure Firewall waits 90 seconds for existing connections to close. If needed, clients can automatically re-establish connectivity to another backend node.

## Is there a character limit for a firewall name?

Yes. There's a 50 character limit for a firewall name.

## Why does Azure Firewall need a /26 subnet size?

Azure Firewall must provision more virtual machine instances as it scales. A /26 address space ensures that the firewall has enough IP addresses available to accommodate the scaling.

## Does the firewall subnet size need to change as the service scales?

No. Azure Firewall doesn't need a subnet bigger than /26.

## How can I increase my firewall throughput?

Azure Firewall's initial throughput capacity is 2.5 - 3 Gbps and it scales out to 30 Gbps. It scales out automatically based on CPU usage and throughput.

## How long does it take for Azure Firewall to scale out?

Azure Firewall gradually scales when average throughput or CPU consumption is at 60%. Scale out takes five to seven minutes. When performance testing, make sure you test for at least 10 to 15 minutes, and start new connections to take advantage of newly created Firewall nodes.

## Does Azure Firewall allow access to Active Directory by default?

No. Azure Firewall blocks Active Directory access by default. To allow access, configure the AzureActiveDirectory service tag. For more information, see [Azure Firewall service tags](service-tags.md).

## Can I exclude a FQDN or an IP address from Azure Firewall Threat Intelligence based filtering?

Yes, you can use Azure PowerShell to do it:

```azurepowershell
# Add a Threat Intelligence Whitelist to an Existing Azure Firewall

## Create the Whitelist with both FQDN and IPAddresses

$fw = Get-AzFirewall -Name "Name_of_Firewall" -ResourceGroupName "Name_of_ResourceGroup"
$fw.ThreatIntelWhitelist = New-AzFirewallThreatIntelWhitelist `
   -FQDN @("fqdn1", "fqdn2", …) -IpAddress @("ip1", "ip2", …)

## Or Update FQDNs and IpAddresses separately

$fw = Get-AzFirewall -Name "Name_of_Firewall" -ResourceGroupName "Name_of_ResourceGroup"
$fw.ThreatIntelWhitelist.FQDNs = @("fqdn1", "fqdn2", …)
$fw.ThreatIntelWhitelist.IpAddress = @("ip1", "ip2", …)

Set-AzFirewall -AzureFirewall $fw
```

## Why can a TCP ping and similar tools successfully connect to a target FQDN even when no rule on Azure Firewall allows that traffic?

A TCP ping isn't actually connecting  to the target FQDN. This happens because Azure Firewall's transparent proxy listens on port 80/443 for outbound traffic. The TCP ping establishes a connection with the firewall, which then drops the packet and logs the connection. This behavior doesn't have any security impact. However, to avoid confusion we're investigating potential changes to this behavior.

## Are there limits for the number of IP addresses supported by IP Groups?

Yes. For more information, see [Azure subscription and service limits, quotas, and constraints](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-firewall-limits)

## Can I move an IP Group to another resource group?

No, moving an IP Group to another resource group isn't currently supported.

## What is the TCP Idle Timeout for Azure Firewall?

A standard behavior of a network firewall is to ensure TCP connections are kept alive and to promptly close them if there's no activity. Azure Firewall TCP Idle Timeout is four minutes. This setting isn't configurable. If a period of inactivity is longer than the timeout value, there's no guarantee that the TCP or HTTP session is maintained. A common practice is to use a TCP keep-alive. This practice keeps the connection active for a longer period. For more information, see the [.NET examples](https://docs.microsoft.com/dotnet/api/system.net.servicepoint.settcpkeepalive?redirectedfrom=MSDN&view=netcore-3.1#System_Net_ServicePoint_SetTcpKeepAlive_System_Boolean_System_Int32_System_Int32_).