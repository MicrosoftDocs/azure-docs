---
title: Network planning and connections for Azure AD Domain Services | Microsoft Docs
description: Learn about some of the virtual network design considerations and resources used for connectivity when you run Azure Active Directory Domain Services.
services: active-directory-ds
author: iainfoulds
manager: daveba

ms.assetid: 23a857a5-2720-400a-ab9b-1ba61e7b145a
ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.topic: conceptual
ms.date: 01/21/2020
ms.author: iainfou

---
# Virtual network design considerations and configuration options for Azure AD Domain Services

As Azure Active Directory Domain Services (AD DS) provides authentication and management services to other applications and workloads, network connectivity is a key component. Without correctly configured virtual network resources, applications and workloads can't communicate with and use the features provided by Azure AD DS. Plan your virtual network requirements to make sure that Azure AD DS can serve your applications and workloads as needed.

This article outlines design considerations and requirements for an Azure virtual network to support Azure AD DS.

## Azure virtual network design

To provide network connectivity and allow applications and services to authenticate against Azure AD DS, you use an Azure virtual network and subnet. Ideally, Azure AD DS should be deployed into its own virtual network. You can include a separate application subnet in the same virtual network to host your management VM or light application workloads. A separate virtual network for larger or complex application workloads, peered to the Azure AD DS virtual network, is usually the most appropriate design. Other designs choices are valid, provided you meet the requirements outlined in the following sections for the virtual network and subnet.

As you design the virtual network for Azure AD DS, the following considerations apply:

* Azure AD DS must be deployed into the same Azure region as your virtual network.
    * At this time, you can only deploy one Azure AD DS managed domain per Azure AD tenant. The Azure AD DS managed domain is deployed to single region. Make sure that you create or select a virtual network in a [region that supports Azure AD DS](https://azure.microsoft.com/global-infrastructure/services/?products=active-directory-ds&regions=all).
* Consider the proximity of other Azure regions and the virtual networks that host your application workloads.
    * To minimize latency, keep your core applications close to, or in the same region as, the virtual network subnet for your Azure AD DS managed domain. You can use virtual network peering or virtual private network (VPN) connections between Azure virtual networks. These connection options are discussed in a following section.
* The virtual network can't rely on DNS services other than those provided by Azure AD DS.
    * Azure AD DS provides its own DNS service. The virtual network must be configured to use these DNS service addresses. Name resolution for additional namespaces can be accomplished using conditional forwarders.
    * You can't use custom DNS server settings to direct queries from other DNS servers, including on VMs. Resources in the virtual network must use the DNS service provided by Azure AD DS.

> [!IMPORTANT]
> You can't move Azure AD DS to a different virtual network after you've enabled the service.

An Azure AD DS managed domain connects to a subnet in an Azure virtual network. Design this subnet for Azure AD DS with the following considerations:

* Azure AD DS must be deployed in its own subnet. Don't use an existing subnet or a gateway subnet.
* A network security group is created during the deployment of an Azure AD DS managed domain. This network security group contains the required rules for correct service communication.
    * Don't create or use an existing network security group with your own custom rules.
* Azure AD DS requires 3-5 IP addresses. Make sure that your subnet IP address range can provide this number of addresses.
    * Restricting the available IP addresses can prevent Azure AD Domain Services from maintaining two domain controllers.

The following example diagram outlines a valid design where Azure AD DS has its own subnet, there's a gateway subnet for external connectivity, and application workloads are in a connected subnet within the virtual network:

![Recommended subnet design](./media/active-directory-domain-services-design-guide/vnet-subnet-design.png)

## Connections to the Azure AD DS virtual network

As noted in the previous section, you can only create an Azure AD Domain Services managed domain in a single virtual network in Azure, and only one managed domain can be created per Azure AD tenant. Based on this architecture, you may need to connect one or more virtual networks that host your application workloads to your Azure AD DS virtual network.

You can connect application workloads hosted in other Azure virtual networks using one of the following methods:

* Virtual network peering
* Virtual private networking (VPN)

### Virtual network peering

Virtual network peering is a mechanism that connects two virtual networks in the same region through the Azure backbone network. Global virtual network peering can connect virtual network across Azure regions. Once peered, the two virtual networks let resources, such as VMs, communicate with each other directly using private IP addresses. Using virtual network peering lets you deploy an Azure AD DS managed domain with your application workloads deployed in other virtual networks.

![Virtual network connectivity using peering](./media/active-directory-domain-services-design-guide/vnet-peering.png)

For more information, see [Azure virtual network peering overview](../virtual-network/virtual-network-peering-overview.md).

### Virtual Private Networking (VPN)

You can connect a virtual network to another virtual network (VNet-to-VNet) in the same way that you can configure a virtual network to an on-premises site location. Both connections use a VPN gateway to create a secure tunnel using IPsec/IKE. This connection model lets you deploy Azure AD DS into an Azure virtual network and then connect on-premises locations or other clouds.

![Virtual network connectivity using a VPN Gateway](./media/active-directory-domain-services-design-guide/vnet-connection-vpn-gateway.jpg)

For more information on using virtual private networking, read [Configure a VNet-to-VNet VPN gateway connection by using the Azure portal](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-howto-vnet-vnet-resource-manager-portal).

## Name resolution when connecting virtual networks

Virtual networks connected to the Azure AD Domain Services virtual network typically have their own DNS settings. When you connect virtual networks, it doesn't automatically configure name resolution for the connecting virtual network to resolve services provided by the Azure AD DS managed domain. Name resolution on the connecting virtual networks must be configured to enable application workloads to locate Azure AD Domain Services.

You can enable name resolution using conditional DNS forwarders on the DNS server supporting the connecting virtual networks, or by using the same DNS IP addresses from the Azure AD Domain Service virtual network.

## Network resources used by Azure AD DS

An Azure AD DS managed domain creates some networking resources during deployment. These resources are needed for successful operation and management of the Azure AD DS managed domain, and shouldn't be manually configured.

| Azure resource                          | Description |
|:----------------------------------------|:---|
| Network interface card                  | Azure AD DS hosts the managed domain on two domain controllers (DCs) that run on Windows Server as Azure VMs. Each VM has a virtual network interface that connects to your virtual network subnet. |
| Dynamic standard public IP address      | Azure AD DS communicates with the synchronization and management service using a standard SKU public IP address. For more information about public IP addresses, see [IP address types and allocation methods in Azure](../virtual-network/virtual-network-ip-addresses-overview-arm.md). |
| Azure standard load balancer            | Azure AD DS uses a standard SKU load balancer for network address translation (NAT) and load balancing (when used with secure LDAP). For more information about Azure load balancers, see [What is Azure Load Balancer?](../load-balancer/load-balancer-overview.md) |
| Network address translation (NAT) rules | Azure AD DS creates and uses three NAT rules on the load balancer - one rule for secure HTTP traffic, and two rules for secure PowerShell remoting. |
| Load balancer rules                     | When an Azure AD DS managed domain is configured for secure LDAP on TCP port 636, three rules are created and used on a load balancer to distribute the traffic. |

> [!WARNING]
> Don't delete any of the network resource created by Azure AD DS. If you delete any of the network resources, an Azure AD DS service outage occurs.

## Network security groups and required ports

A [network security group (NSG)](https://docs.microsoft.com/azure/virtual-network/virtual-networks-nsg) contains a list of rules that allow or deny network traffic to traffic in an Azure virtual network. A network security group is created when you deploy Azure AD DS that contains a set of rules that let the service provide authentication and management functions. This default network security group is associated with the virtual network subnet your Azure AD DS managed domain is deployed into.

The following network security group rules are required for Azure AD DS to provide authentication and management services. Don't edit or delete these network security group rules for the virtual network subnet your Azure AD DS managed domain is deployed into.

| Port number | Protocol | Source                             | Destination | Action | Required | Purpose |
|:-----------:|:--------:|:----------------------------------:|:-----------:|:------:|:--------:|:--------|
| 443         | TCP      | AzureActiveDirectoryDomainServices | Any         | Allow  | Yes      | Synchronization with your Azure AD tenant. |
| 3389        | TCP      | CorpNetSaw                         | Any         | Allow  | Yes      | Management of your domain. |
| 5986        | TCP      | AzureActiveDirectoryDomainServices | Any         | Allow  | Yes      | Management of your domain. |
| 636         | TCP      | Any                                | Any         | Allow  | No       | Only enabled when you configure secure LDAP (LDAPS). |

> [!WARNING]
> Don't manually edit these network resources and configurations. When you associate a misconfigured network security group or a user defined route table with the subnet in which Azure AD DS is deployed, you may disrupt Microsoft's ability to service and manage the domain. Synchronization between your Azure AD tenant and your Azure AD DS managed domain is also disrupted.
>
> Default rules for *AllowVnetInBound*, *AllowAzureLoadBalancerInBound*, *DenyAllInBound*, *AllowVnetOutBound*, *AllowInternetOutBound*, and *DenyAllOutBound* also exist for the network security group. Don't edit or delete these default rules.
>
> The Azure SLA doesn't apply to deployments where an improperly configured network security group and/or user defined route tables have been applied that blocks Azure AD DS from updating and managing your domain.

### Port 443 - synchronization with Azure AD

* Used to synchronize your Azure AD tenant with your Azure AD DS managed domain.
* Without access to this port, your Azure AD DS managed domain can't sync with your Azure AD tenant. Users may not be able to sign in as changes to their passwords wouldn't be synchronized to your Azure AD DS managed domain.
* Inbound access to this port to IP addresses is restricted by default using the **AzureActiveDirectoryDomainServices** service tag.
* Do not restrict outbound access from this port.

### Port 3389 - management using remote desktop

* Used for remote desktop connections to domain controllers in your Azure AD DS managed domain.
* The default network security group rule uses the *CorpNetSaw* service tag to further restrict traffic.
    * This service tag permits only secure access workstations on the Microsoft corporate network to use remote desktop to the Azure AD DS managed domain.
    * Access is only allowed with business justification, such as for management or troubleshooting scenarios.
* This rule can be set to *Deny*, and only set to *Allow* when required. Most management and monitoring tasks are performed using PowerShell remoting. RDP is only used in the rare event that Microsoft needs to connect remotely to your managed domain for advanced troubleshooting.

> [!NOTE]
> You can't manually select the *CorpNetSaw* service tag from the portal if you try to edit this network security group rule. You must use Azure PowerShell or the Azure CLI to manually configure a rule that uses the *CorpNetSaw* service tag.

### Port 5986 - management using PowerShell remoting

* Used to perform management tasks using PowerShell remoting in your Azure AD DS managed domain.
* Without access to this port, your Azure AD DS managed domain can't be updated, configured, backed-up, or monitored.
* For Azure AD DS managed domains that use a Resource Manager-based virtual network, you can restrict inbound access to this port to the *AzureActiveDirectoryDomainServices* service tag.
    * For legacy Azure AD DS managed domains using a Classic-based virtual network, you can restrict inbound access to this port to the following source IP addresses: *52.180.183.8*, *23.101.0.70*, *52.225.184.198*, *52.179.126.223*, *13.74.249.156*, *52.187.117.83*, *52.161.13.95*, *104.40.156.18*, and *104.40.87.209*.

## User-defined routes

User-defined routes aren't created by default, and aren't needed for Azure AD DS to work correctly. If you're required to use route tables, avoid making any changes to the *0.0.0.0* route. Changes to this route can disrupt Azure AD Domain Services.

You must also route inbound traffic from the IP addresses included in the respective Azure service tags to the Azure AD Domain Services subnet. For more information on service tags and their associated IP address from, see [Azure IP Ranges and Service Tags - Public Cloud](https://www.microsoft.com/en-us/download/details.aspx?id=56519).

> [!CAUTION]
> These Azure datacenter IP ranges can change without notice. Ensure you have processes to validate you have the latest IP addresses.

## Next steps

For more information about some of the network resources and connection options used by Azure AD DS, see the following articles:

* [Azure virtual network peering](../virtual-network/virtual-network-peering-overview.md)
* [Azure VPN gateways](../vpn-gateway/vpn-gateway-about-vpn-gateway-settings.md)
* [Azure network security groups](../virtual-network/security-overview.md)
