---
title: Network planning and connections for Azure AD Domain Services | Microsoft Docs
description: Learn about some of the virtual network design considerations and resources used for connectivity when you run Azure Active Directory Domain Services.
services: active-directory-ds
author: justinha
manager: daveba

ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.topic: conceptual
ms.date: 12/16/2020
ms.author: justinha

---
# Virtual network design considerations and configuration options for Azure Active Directory Domain Services

Azure Active Directory Domain Services (Azure AD DS) provides authentication and management services to other applications and workloads. Network connectivity is a key component. Without correctly configured virtual network resources, applications and workloads can't communicate with and use the features provided by Azure AD DS. Plan your virtual network requirements to make sure that Azure AD DS can serve your applications and workloads as needed.

This article outlines design considerations and requirements for an Azure virtual network to support Azure AD DS.

## Azure virtual network design

To provide network connectivity and allow applications and services to authenticate against an Azure AD DS managed domain, you use an Azure virtual network and subnet. Ideally, the managed domain should be deployed into its own virtual network.

You can include a separate application subnet in the same virtual network to host your management VM or light application workloads. A separate virtual network for larger or complex application workloads, peered to the Azure AD DS virtual network, is usually the most appropriate design.

Other designs choices are valid, provided you meet the requirements outlined in the following sections for the virtual network and subnet.

As you design the virtual network for Azure AD DS, the following considerations apply:

* Azure AD DS must be deployed into the same Azure region as your virtual network.
    * At this time, you can only deploy one managed domain per Azure AD tenant. The managed domain is deployed to single region. Make sure that you create or select a virtual network in a [region that supports Azure AD DS](https://azure.microsoft.com/global-infrastructure/services/?products=active-directory-ds&regions=all).
* Consider the proximity of other Azure regions and the virtual networks that host your application workloads.
    * To minimize latency, keep your core applications close to, or in the same region as, the virtual network subnet for your managed domain. You can use virtual network peering or virtual private network (VPN) connections between Azure virtual networks. These connection options are discussed in a following section.
* The virtual network can't rely on DNS services other than those services provided by the managed domain.
    * Azure AD DS provides its own DNS service. The virtual network must be configured to use these DNS service addresses. Name resolution for additional namespaces can be accomplished using conditional forwarders.
    * You can't use custom DNS server settings to direct queries from other DNS servers, including on VMs. Resources in the virtual network must use the DNS service provided by the managed domain.

> [!IMPORTANT]
> You can't move Azure AD DS to a different virtual network after you've enabled the service.

A managed domain connects to a subnet in an Azure virtual network. Design this subnet for Azure AD DS with the following considerations:

* A managed domain must be deployed in its own subnet. Don't use an existing subnet or a gateway subnet.
* A network security group is created during the deployment of a managed domain. This network security group contains the required rules for correct service communication.
    * Don't create or use an existing network security group with your own custom rules.
* A managed domain requires 3-5 IP addresses. Make sure that your subnet IP address range can provide this number of addresses.
    * Restricting the available IP addresses can prevent the managed domain from maintaining two domain controllers.

The following example diagram outlines a valid design where the managed domain has its own subnet, there's a gateway subnet for external connectivity, and application workloads are in a connected subnet within the virtual network:

![Recommended subnet design](./media/active-directory-domain-services-design-guide/vnet-subnet-design.png)

## Connections to the Azure AD DS virtual network

As noted in the previous section, you can only create a managed domain in a single virtual network in Azure, and only one managed domain can be created per Azure AD tenant. Based on this architecture, you may need to connect one or more virtual networks that host your application workloads to your managed domain's virtual network.

You can connect application workloads hosted in other Azure virtual networks using one of the following methods:

* Virtual network peering
* Virtual private networking (VPN)

### Virtual network peering

Virtual network peering is a mechanism that connects two virtual networks in the same region through the Azure backbone network. Global virtual network peering can connect virtual network across Azure regions. Once peered, the two virtual networks let resources, such as VMs, communicate with each other directly using private IP addresses. Using virtual network peering lets you deploy a managed domain with your application workloads deployed in other virtual networks.

![Virtual network connectivity using peering](./media/active-directory-domain-services-design-guide/vnet-peering.png)

For more information, see [Azure virtual network peering overview](../virtual-network/virtual-network-peering-overview.md).

### Virtual Private Networking (VPN)

You can connect a virtual network to another virtual network (VNet-to-VNet) in the same way that you can configure a virtual network to an on-premises site location. Both connections use a VPN gateway to create a secure tunnel using IPsec/IKE. This connection model lets you deploy the managed domain into an Azure virtual network and then connect on-premises locations or other clouds.

![Virtual network connectivity using a VPN Gateway](./media/active-directory-domain-services-design-guide/vnet-connection-vpn-gateway.jpg)

For more information on using virtual private networking, read [Configure a VNet-to-VNet VPN gateway connection by using the Azure portal](../vpn-gateway/vpn-gateway-howto-vnet-vnet-resource-manager-portal.md).

## Name resolution when connecting virtual networks

Virtual networks connected to the managed domain's virtual network typically have their own DNS settings. When you connect virtual networks, it doesn't automatically configure name resolution for the connecting virtual network to resolve services provided by the managed domain. Name resolution on the connecting virtual networks must be configured to enable application workloads to locate the managed domain.

You can enable name resolution using conditional DNS forwarders on the DNS server supporting the connecting virtual networks, or by using the same DNS IP addresses from the managed domain's virtual network.

## Network resources used by Azure AD DS

A managed domain creates some networking resources during deployment. These resources are needed for successful operation and management of the managed domain, and shouldn't be manually configured.

| Azure resource                          | Description |
|:----------------------------------------|:---|
| Network interface card                  | Azure AD DS hosts the managed domain on two domain controllers (DCs) that run on Windows Server as Azure VMs. Each VM has a virtual network interface that connects to your virtual network subnet. |
| Dynamic standard public IP address      | Azure AD DS communicates with the synchronization and management service using a standard SKU public IP address. For more information about public IP addresses, see [IP address types and allocation methods in Azure](../virtual-network/public-ip-addresses.md). |
| Azure standard load balancer            | Azure AD DS uses a standard SKU load balancer for network address translation (NAT) and load balancing (when used with secure LDAP). For more information about Azure load balancers, see [What is Azure Load Balancer?](../load-balancer/load-balancer-overview.md) |
| Network address translation (NAT) rules | Azure AD DS creates and uses three NAT rules on the load balancer - one rule for secure HTTP traffic, and two rules for secure PowerShell remoting. |
| Load balancer rules                     | When a managed domain is configured for secure LDAP on TCP port 636, three rules are created and used on a load balancer to distribute the traffic. |

> [!WARNING]
> Don't delete or modify any of the network resource created by Azure AD DS, such as manually configuring the load balancer or rules. If you delete or modify any of the network resources, an Azure AD DS service outage may occur.

## Network security groups and required ports

A [network security group (NSG)](../virtual-network/network-security-groups-overview.md) contains a list of rules that allow or deny network traffic to traffic in an Azure virtual network. A network security group is created when you deploy a managed domain that contains a set of rules that let the service provide authentication and management functions. This default network security group is associated with the virtual network subnet your managed domain is deployed into.

The following network security group rules are required for the managed domain to provide authentication and management services. Don't edit or delete these network security group rules for the virtual network subnet your managed domain is deployed into.

| Port number | Protocol | Source                             | Destination | Action | Required | Purpose |
|:-----------:|:--------:|:----------------------------------:|:-----------:|:------:|:--------:|:--------|
| 5986        | TCP      | AzureActiveDirectoryDomainServices | Any         | Allow  | Yes      | Management of your domain. |
| 3389        | TCP      | CorpNetSaw                         | Any         | Allow  | Optional      | Debugging for support. |

An Azure standard load balancer is created that requires these rules to be place. This network security group secures Azure AD DS and is required for the managed domain to work correctly. Don't delete this network security group. The load balancer won't work correctly without it.

If needed, you can [create the required network security group and rules using Azure PowerShell](powershell-create-instance.md#create-a-network-security-group).

> [!WARNING]
> Don't manually edit these network resources and configurations. When you associate a misconfigured network security group or a user defined route table with the subnet in which the managed domain is deployed, you may disrupt Microsoft's ability to service and manage the domain. Synchronization between your Azure AD tenant and your managed domain is also disrupted.
>
> If you use secure LDAP, you can add the required TCP port 636 rule to allow external traffic if needed. Adding this rule doesn't place your network security group rules in an unsupported state. For more information, see [Lock down secure LDAP access over the internet](tutorial-configure-ldaps.md#lock-down-secure-ldap-access-over-the-internet)
>
> Default rules for *AllowVnetInBound*, *AllowAzureLoadBalancerInBound*, *DenyAllInBound*, *AllowVnetOutBound*, *AllowInternetOutBound*, and *DenyAllOutBound* also exist for the network security group. Don't edit or delete these default rules.
>
> The Azure SLA doesn't apply to deployments where an improperly configured network security group and/or user defined route tables have been applied that blocks Azure AD DS from updating and managing your domain.

### Port 5986 - management using PowerShell remoting

* Used to perform management tasks using PowerShell remoting in your managed domain.
* Without access to this port, your managed domain can't be updated, configured, backed-up, or monitored.
* For managed domains that use a Resource Manager-based virtual network, you can restrict inbound access to this port to the *AzureActiveDirectoryDomainServices* service tag.
    * For legacy managed domains using a Classic-based virtual network, you can restrict inbound access to this port to the following source IP addresses: *52.180.183.8*, *23.101.0.70*, *52.225.184.198*, *52.179.126.223*, *13.74.249.156*, *52.187.117.83*, *52.161.13.95*, *104.40.156.18*, and *104.40.87.209*.

    > [!NOTE]
    > In 2017, Azure AD Domain Services became available to host in an Azure Resource Manager network. Since then, we have been able to build a more secure service using the Azure Resource Manager's modern capabilities. Because Azure Resource Manager deployments fully replace classic deployments, Azure AD DS classic virtual network deployments will be retired on March 1, 2023.
    >
    > For more information, see the [official deprecation notice](https://azure.microsoft.com/updates/we-are-retiring-azure-ad-domain-services-classic-vnet-support-on-march-1-2023/)

### Port 3389 - management using remote desktop

* Used for remote desktop connections to domain controllers in your managed domain.
* The default network security group rule uses the *CorpNetSaw* service tag to further restrict traffic.
    * This service tag permits only secure access workstations on the Microsoft corporate network to use remote desktop to the managed domain.
    * Access is only allowed with business justification, such as for management or troubleshooting scenarios.
* This rule can be set to *Deny*, and only set to *Allow* when required. Most management and monitoring tasks are performed using PowerShell remoting. RDP is only used in the rare event that Microsoft needs to connect remotely to your managed domain for advanced troubleshooting.

> [!NOTE]
> You can't manually select the *CorpNetSaw* service tag from the portal if you try to edit this network security group rule. You must use Azure PowerShell or the Azure CLI to manually configure a rule that uses the *CorpNetSaw* service tag.
>
> For example, you can use the following script to create a rule allowing RDP: 
>
> `Get-AzureRmNetworkSecurityGroup -Name "nsg-name" -ResourceGroupName "resource-group-name" | Add-AzureRmNetworkSecurityRuleConfig -Name "new-rule-name" -Access "Allow" -Protocol "TCP" -Direction "Inbound" -Priority "priority-number" -SourceAddressPrefix "CorpNetSaw" -SourcePortRange "" -DestinationPortRange "3389" -DestinationAddressPrefix "" | Set-AzureRmNetworkSecurityGroup`

## User-defined routes

User-defined routes aren't created by default, and aren't needed for Azure AD DS to work correctly. If you're required to use route tables, avoid making any changes to the *0.0.0.0* route. Changes to this route disrupt Azure AD DS and puts the managed domain in an unsupported state.

You must also route inbound traffic from the IP addresses included in the respective Azure service tags to the managed domain's subnet. For more information on service tags and their associated IP address from, see [Azure IP Ranges and Service Tags - Public Cloud](https://www.microsoft.com/en-us/download/details.aspx?id=56519).

> [!CAUTION]
> These Azure datacenter IP ranges can change without notice. Ensure you have processes to validate you have the latest IP addresses.

## Next steps

For more information about some of the network resources and connection options used by Azure AD DS, see the following articles:

* [Azure virtual network peering](../virtual-network/virtual-network-peering-overview.md)
* [Azure VPN gateways](../vpn-gateway/vpn-gateway-about-vpn-gateway-settings.md)
* [Azure network security groups](../virtual-network/network-security-groups-overview.md)