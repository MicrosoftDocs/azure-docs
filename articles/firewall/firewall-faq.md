---
title: Azure Firewall FAQ
description: FAQ for Azure Firewall
services: firewall
author: vhorne
ms.service: firewall
ms.topic: conceptual
ms.date: 6/21/2019
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
* *NAT rules*: Configure DNAT rules to allow incoming connections.

## Does Azure Firewall support inbound traffic filtering?

Azure Firewall supports inbound and outbound filtering. Inbound protection is for non-HTTP/S protocols. For example RDP, SSH, and FTP protocols.

## Which logging and analytics services are supported by the Azure Firewall?

Azure Firewall is integrated with Azure Monitor for viewing and analyzing firewall logs. Logs can be sent to Log Analytics, Azure Storage, or Event Hubs. They can be analyzed in Log Analytics or by different tools such as Excel and Power BI. For more information, see [Tutorial: Monitor Azure Firewall logs](tutorial-diagnostics.md).

## How does Azure Firewall work differently from existing services such as NVAs in the marketplace?

Azure Firewall is a basic firewall service that can address certain customer scenarios. It's expected that you'll have a mix of third-party NVAs and Azure Firewall. Working better together is a core priority.

## What is the difference between Application Gateway WAF and Azure Firewall?

The Web Application Firewall (WAF) is a feature of Application Gateway that provides centralized inbound protection of your web applications from common exploits and vulnerabilities. Azure Firewall provides inbound protection for non-HTTP/S protocols (for example, RDP, SSH, FTP), outbound network-level protection for all ports and protocols, and application-level protection for outbound HTTP/S.

## What is the difference between Network Security Groups (NSGs) and Azure Firewall?

The Azure Firewall service complements network security group functionality. Together, they provide better "defense-in-depth" network security. Network security groups provide distributed network layer traffic filtering to limit traffic to resources within virtual networks in each subscription. Azure Firewall is a fully stateful, centralized network firewall as-a-service, which provides network- and application-level protection across different subscriptions and virtual networks.

## Are Network Security Groups (NSGs) supported on the Azure Firewall subnet?

Azure Firewall is a managed service with multiple protection layers, including platform protection with NIC level NSGs (not viewable).  Subnet level NSGs aren't required on the Azure Firewall subnet, and are disabled to ensure no service interruption.

## How do I set up Azure Firewall with my service endpoints?

For secure access to PaaS services, we recommend service endpoints. You can choose to enable service endpoints in the Azure Firewall subnet and disable them on the connected spoke virtual networks. This way you benefit from both features-- service endpoint security and central logging for all traffic.

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

For Azure Firewall service limits, see [Azure subscription and service limits, quotas, and constraints](../azure-subscription-service-limits.md#azure-firewall-limits).

## Can Azure Firewall in a hub virtual network forward and filter network traffic between two spoke virtual networks?

Yes, you can use Azure Firewall in a hub virtual network to route and filter traffic between two spoke virtual network. Subnets in each of the spoke virtual networks must have UDR pointing to the Azure Firewall as a default gateway for this scenario to work properly.

## Can Azure Firewall forward and filter network traffic between subnets in the same virtual network or peered virtual networks?

Yes. However, configuring the UDRs to redirect traffic between subnets in the same VNET requires additional attention. While using the VNET address range as a target prefix for the UDR is sufficient, this also routes all traffic from one machine to another machine in the same subnet through the Azure Firewall instance. To avoid this, include a route for the subnet in the UDR with a next hop type of **VNET**. Managing these routes might be cumbersome and prone to error. The recommended method for internal network segmentation is to use Network Security Groups, which don’t require UDRs.

## Does Azure Firewall outbound SNAT between private networks?

Azure Firewall doesn’t SNAT when the destination IP address is a private IP range per [IANA RFC 1918](https://tools.ietf.org/html/rfc1918). If your organization uses a public IP address range for private networks, Azure Firewall SNATs the traffic to one of the firewall private IP addresses in AzureFirewallSubnet.

## Is forced tunneling/chaining to a Network Virtual Appliance supported?

Forced tunneling isn't supported by default, but it can be enabled with help from Support.

Azure Firewall must have direct Internet connectivity. If your AzureFirewallSubnet learns a default route to your on-premises network via BGP, you must override this with a 0.0.0.0/0 UDR with the **NextHopType** value set as **Internet** to maintain direct Internet connectivity. By default, Azure Firewall doesn't support forced tunneling to an on-premises network.

However, if your configuration requires forced tunneling to an on-premises network, Microsoft will support it on a case by case basis. Contact Support so that we can review your case. If accepted, we'll allow your subscription and ensure the required firewall Internet connectivity is maintained.

## Are there any firewall resource group restrictions?

Yes. The firewall, subnet, VNet, and the public IP address all must be in the same resource group.

## When configuring DNAT for inbound network traffic, do I also need to configure a corresponding network rule to allow that traffic?

No. NAT rules implicitly add a corresponding network rule to allow the translated traffic. You can override this behavior by explicitly adding a network rule collection with deny rules that match the translated traffic. To learn more about Azure Firewall rule processing logic, see [Azure Firewall rule processing logic](rule-processing.md).

## How do wildcards work in an application rule target FQDN?

If you configure ***.contoso.com**, it allows *anyvalue*.contoso.com, but not contoso.com (the domain apex). If you want to allow the domain apex, you must explicitly configure it as a target FQDN.

## What does *Provisioning state: Failed* mean?

Whenever a configuration change is applied, Azure Firewall attempts to update all its underlying backend instances. In rare cases, one of these backend instances may fail to update with the new configuration and the update process  stops with a failed provisioning state. Your Azure Firewall is still operational, but the applied configuration may be in an inconsistent state, where some instances have the previous configuration where others have the updated rule set. If this happens, try updating your configuration one more time until the operation succeeds and your Firewall is in a *Succeeded* provisioning state.
