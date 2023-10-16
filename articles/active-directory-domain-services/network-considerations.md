---
title: Network planning and connections for Microsoft Entra Domain Services | Microsoft Docs
description: Learn about some of the virtual network design considerations and resources used for connectivity when you run Microsoft Entra Domain Services.
services: active-directory-ds
author: justinha
manager: amycolannino

ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.topic: conceptual
ms.date: 09/15/2023
ms.author: justinha
ms.reviewer: xyuan

---
# Virtual network design considerations and configuration options for Microsoft Entra Domain Services

Microsoft Entra Domain Services provides authentication and management services to other applications and workloads. Network connectivity is a key component. Without correctly configured virtual network resources, applications and workloads can't communicate with and use the features provided by Domain Services. Plan your virtual network requirements to make sure that Domain Services can serve your applications and workloads as needed.

This article outlines design considerations and requirements for an Azure virtual network to support Domain Services.

## Azure virtual network design

To provide network connectivity and allow applications and services to authenticate against a Domain Services managed domain, you use an Azure virtual network and subnet. Ideally, the managed domain should be deployed into its own virtual network.

You can include a separate application subnet in the same virtual network to host your management VM or light application workloads. A separate virtual network for larger or complex application workloads, peered to the Domain Services virtual network, is usually the most appropriate design.

Other designs choices are valid, provided you meet the requirements outlined in the following sections for the virtual network and subnet.

As you design the virtual network for Domain Services, the following considerations apply:

* Domain Services must be deployed into the same Azure region as your virtual network.
    * At this time, you can only deploy one managed domain per Microsoft Entra tenant. The managed domain is deployed to single region. Make sure that you create or select a virtual network in a [region that supports Domain Services](https://azure.microsoft.com/global-infrastructure/services/?products=active-directory-ds&regions=all).
* Consider the proximity of other Azure regions and the virtual networks that host your application workloads.
    * To minimize latency, keep your core applications close to, or in the same region as, the virtual network subnet for your managed domain. You can use virtual network peering or virtual private network (VPN) connections between Azure virtual networks. These connection options are discussed in a following section.
* The virtual network can't rely on DNS services other than those services provided by the managed domain.
    * Domain Services provides its own DNS service. The virtual network must be configured to use these DNS service addresses. Name resolution for additional namespaces can be accomplished using conditional forwarders.
    * You can't use custom DNS server settings to direct queries from other DNS servers, including on VMs. Resources in the virtual network must use the DNS service provided by the managed domain.

> [!IMPORTANT]
> You can't move Domain Services to a different virtual network after you've enabled the service.

A managed domain connects to a subnet in an Azure virtual network. Design this subnet for Domain Services with the following considerations:

* A managed domain must be deployed in its own subnet. Using an existing subnet, gateway subnet, or remote gateways settings in the virtual network peering is unsupported.
* A network security group is created during the deployment of a managed domain. This network security group contains the required rules for correct service communication.
    * Don't create or use an existing network security group with your own custom rules.
* A managed domain requires 3-5 IP addresses. Make sure that your subnet IP address range can provide this number of addresses.
    * Restricting the available IP addresses can prevent the managed domain from maintaining two domain controllers.

  >[!NOTE]
  >You shouldn't use public IP addresses for virtual networks and their subnets due to the following issues:
  >
  >- **Scarcity of the IP address**: IPv4 public IP addresses are limited, and their demand often exceeds the available supply. Also, there are potentially overlapping IPs with public endpoints.
  >- **Security risks**: Using public IPs for virtual networks exposes your devices directly to the internet, increasing the risk of unauthorized access and potential attacks. Without proper security measures, your devices may become vulnerable to various threats.
  >
  >- **Complexity**: Managing a virtual network with public IPs can be more complex than using private IPs, as it requires dealing with external IP ranges and ensuring proper network segmentation and security.
  >
  >It is strongly recommended to use private IP addresses. If you use a public IP, ensure you are the owner/dedicated user of the chosen IPs in the public range you chose.

The following example diagram outlines a valid design where the managed domain has its own subnet, there's a gateway subnet for external connectivity, and application workloads are in a connected subnet within the virtual network:

![Recommended subnet design](./media/active-directory-domain-services-design-guide/vnet-subnet-design.png)

<a name='connections-to-the-azure-ad-ds-virtual-network'></a>

## Connections to the Domain Services virtual network

As noted in the previous section, you can only create a managed domain in a single virtual network in Azure, and only one managed domain can be created per Microsoft Entra tenant. Based on this architecture, you may need to connect one or more virtual networks that host your application workloads to your managed domain's virtual network.

You can connect application workloads hosted in other Azure virtual networks using one of the following methods:

* Virtual network peering
* Virtual private networking (VPN)

### Virtual network peering

Virtual network peering is a mechanism that connects two virtual networks in the same region through the Azure backbone network. Global virtual network peering can connect virtual network across Azure regions. Once peered, the two virtual networks let resources, such as VMs, communicate with each other directly using private IP addresses. Using virtual network peering lets you deploy a managed domain with your application workloads deployed in other virtual networks.

![Virtual network connectivity using peering](./media/active-directory-domain-services-design-guide/vnet-peering.png)

For more information, see [Azure virtual network peering overview](/azure/virtual-network/virtual-network-peering-overview).

### Virtual Private Networking (VPN)

You can connect a virtual network to another virtual network (VNet-to-VNet) in the same way that you can configure a virtual network to an on-premises site location. Both connections use a VPN gateway to create a secure tunnel using IPsec/IKE. This connection model lets you deploy the managed domain into an Azure virtual network and then connect on-premises locations or other clouds.

![Virtual network connectivity using a VPN Gateway](./media/active-directory-domain-services-design-guide/vnet-connection-vpn-gateway.jpg)

For more information on using virtual private networking, read [Configure a VNet-to-VNet VPN gateway connection by using the Microsoft Entra admin center](/azure/vpn-gateway/vpn-gateway-howto-vnet-vnet-resource-manager-portal).

## Name resolution when connecting virtual networks

Virtual networks connected to the managed domain's virtual network typically have their own DNS settings. When you connect virtual networks, it doesn't automatically configure name resolution for the connecting virtual network to resolve services provided by the managed domain. Name resolution on the connecting virtual networks must be configured to enable application workloads to locate the managed domain.

You can enable name resolution using conditional DNS forwarders on the DNS server supporting the connecting virtual networks, or by using the same DNS IP addresses from the managed domain's virtual network.

<a name='network-resources-used-by-azure-ad-ds'></a>

## Network resources used by Domain Services

A managed domain creates some networking resources during deployment. These resources are needed for successful operation and management of the managed domain, and shouldn't be manually configured. 

Don't lock the networking resources used by Domain Services. If networking resources get locked, they can't be deleted. When domain controllers need to be rebuilt in that case, new networking resources with different IP addresses need to be created. 

| Azure resource                          | Description |
|:----------------------------------------|:---|
| Network interface card                  | Domain Services hosts the managed domain on two domain controllers (DCs) that run on Windows Server as Azure VMs. Each VM has a virtual network interface that connects to your virtual network subnet. |
| Dynamic standard public IP address      | Domain Services communicates with the synchronization and management service using a Standard SKU public IP address. For more information about public IP addresses, see [IP address types and allocation methods in Azure](/azure/virtual-network/ip-services/public-ip-addresses). |
| Azure standard load balancer            | Domain Services uses a Standard SKU load balancer for network address translation (NAT) and load balancing (when used with secure LDAP). For more information about Azure load balancers, see [What is Azure Load Balancer?](/azure/load-balancer/load-balancer-overview) |
| Network address translation (NAT) rules | Domain Services creates and uses two Inbound NAT rules on the load balancer for secure PowerShell remoting. If a Standard SKU load balancer is used, it will have an Outbound NAT Rule too. For the Basic SKU load balancer, no Outbound NAT rule is required. |
| Load balancer rules                     | When a managed domain is configured for secure LDAP on TCP port 636, three rules are created and used on a load balancer to distribute the traffic. |

> [!WARNING]
> Don't delete or modify any of the network resource created by Domain Services, such as manually configuring the load balancer or rules. If you delete or modify any of the network resources, a Domain Services service outage may occur.

## Network security groups and required ports

A [network security group (NSG)](/azure/virtual-network/network-security-groups-overview) contains a list of rules that allow or deny network traffic in an Azure virtual network. When you deploy a managed domain, a network security group is created with a set of rules that let the service provide authentication and management functions. This default network security group is associated with the virtual network subnet your managed domain is deployed into.

The following sections cover network security groups and Inbound and Outbound port requirements.

### Inbound connectivity

The following network security group Inbound rules are required for the managed domain to provide authentication and management services. Don't edit or delete these network security group rules for the virtual network subnet for your managed domain.

| Source      | Source service tag                 | Source port ranges |  Destination  | Service | Destination port ranges | Protocol | Action | Required | Purpose |
|:-----------:|:----------------------------------:|:------------------:|:-------------:|:-------:|:-----------------------:|:--------:|:------:|:--------:|:--------|
| Service tag | AzureActiveDirectoryDomainServices | *                  | Any           | WinRM   | 5986            | TCP | Allow | Yes | Management of your domain. |
| Service tag | CorpNetSaw                         | *                  | Any           | RDP     | 3389            | TCP | Allow | Optional | Debugging for support |


Note that the **CorpNetSaw** service tag isn't available by using the Microsoft Entra admin center, and the network security group rule for **CorpNetSaw** has to be added by using [PowerShell](powershell-create-instance.md#create-a-network-security-group).

Domain Services also relies on the Default Security rules AllowVnetInBound and AllowAzureLoadBalancerInBound.

:::image type="content" border="true" source="./media/network-considerations/nsg.png" alt-text="Screenshot of network security group rules.":::

The AllowVnetInBound rule allows all traffic within the VNet which allows the DCs to properly communicate and replicate as well as allow domain join and other domain services to domain members. For more information about required ports for Windows, see [Service overview and network port requirements for Windows](/troubleshoot/windows-server/networking/service-overview-and-network-port-requirements).


The AllowAzureLoadBalancerInBound rule is also required so that the service can properly communicate over the loadbalancer to manage the DCs. This network security group secures Domain Services and is required for the managed domain to work correctly. Don't delete this network security group. The load balancer won't work correctly without it. 

If needed, you can [create the required network security group and rules using Azure PowerShell](powershell-create-instance.md#create-a-network-security-group).

> [!WARNING]
> When you associate a misconfigured network security group or a user defined route table with the subnet in which the managed domain is deployed, you may disrupt Microsoft's ability to service and manage the domain. Synchronization between your Microsoft Entra tenant and your managed domain is also disrupted. Follow all listed requirements to avoid an unsupported configuration that could break sync, patching, or management.
>
> If you use secure LDAP, you can add the required TCP port 636 rule to allow external traffic if needed. Adding this rule doesn't place your network security group rules in an unsupported state. For more information, see [Lock down secure LDAP access over the internet](tutorial-configure-ldaps.md#lock-down-secure-ldap-access-over-the-internet)
>
> The Azure SLA doesn't apply to deployments that are blocked from updates or management by an improperly configured network security group or user defined route table. A broken network configuration can also prevent security patches from being applied.

### Outbound connectivity

For Outbound connectivity, you can either keep **AllowVnetOutbound** and **AllowInternetOutBound** or restrict Outbound traffic by using ServiceTags listed in the following table. The ServiceTag for AzureUpdateDelivery must be added via [PowerShell](powershell-create-instance.md). Make sure no other NSG with higher priority denies the Outbound connectivity. If Outbound connectivity is denied, replication won't work between replica sets. 


| Outbound port number | Protocol | Source | Destination   | Action | Required | Purpose |
|:--------------------:|:--------:|:------:|:-------------:|:------:|:--------:|:-------:|
| 443 | TCP	  | Any    | AzureActiveDirectoryDomainServices| Allow  | Yes      | Communication with the Microsoft Entra Domain Services management service. |
| 443 | TCP   | Any    | AzureMonitor                      | Allow  | Yes      | Monitoring of the virtual machines. |
| 443 | TCP	  | Any	   | Storage                           | Allow  | Yes      | Communication with Azure Storage.   | 
| 443 | TCP	  | Any	   | Microsoft Entra ID              | Allow  | Yes      | Communication with Microsoft Entra ID.  |
| 443 | TCP	  | Any	   | AzureUpdateDelivery               | Allow  | Yes      | Communication with Windows Update.  | 
| 80  | TCP	  | Any	   | AzureFrontDoor.FirstParty         | Allow  | Yes      | Download of patches from Windows Update.    |
| 443 | TCP	  | Any	   | GuestAndHybridManagement          | Allow  | Yes      | Automated management of security patches.   |


### Port 5986 - management using PowerShell remoting

* Used to perform management tasks using PowerShell remoting in your managed domain.
* Without access to this port, your managed domain can't be updated, configured, backed-up, or monitored.
* You can restrict inbound access to this port to the *AzureActiveDirectoryDomainServices* service tag.

### Port 3389 - management using remote desktop

* Used for remote desktop connections to domain controllers in your managed domain.
* The default network security group rule uses the *CorpNetSaw* service tag to further restrict traffic.
    * This service tag permits only secure access workstations on the Microsoft corporate network to use remote desktop to the managed domain.
    * Access is only allowed with business justification, such as for management or troubleshooting scenarios.
* This rule can be set to *Deny*, and only set to *Allow* when required. Most management and monitoring tasks are performed using PowerShell remoting. RDP is only used in the rare event that Microsoft needs to connect remotely to your managed domain for advanced troubleshooting.


You can't manually select the *CorpNetSaw* service tag from the portal if you try to edit this network security group rule. You must use Azure PowerShell or the Azure CLI to manually configure a rule that uses the *CorpNetSaw* service tag.

For example, you can use the following script to create a rule allowing RDP: 

```powershell
Get-AzNetworkSecurityGroup -Name "nsg-name" -ResourceGroupName "resource-group-name" | Add-AzNetworkSecurityRuleConfig -Name "new-rule-name" -Access "Allow" -Protocol "TCP" -Direction "Inbound" -Priority "priority-number" -SourceAddressPrefix "CorpNetSaw" -SourcePortRange "*" -DestinationPortRange "3389" -DestinationAddressPrefix "*" | Set-AzNetworkSecurityGroup
```

## User-defined routes

User-defined routes aren't created by default, and aren't needed for Domain Services to work correctly. If you're required to use route tables, avoid making any changes to the *0.0.0.0* route. Changes to this route disrupt Domain Services and puts the managed domain in an unsupported state.

You must also route inbound traffic from the IP addresses included in the respective Azure service tags to the managed domain's subnet. For more information on service tags and their associated IP address from, see [Azure IP Ranges and Service Tags - Public Cloud](https://www.microsoft.com/en-us/download/details.aspx?id=56519).

> [!CAUTION]
> These Azure datacenter IP ranges can change without notice. Ensure you have processes to validate you have the latest IP addresses.

## Next steps

For more information about some of the network resources and connection options used by Domain Services, see the following articles:

* [Azure virtual network peering](/azure/virtual-network/virtual-network-peering-overview)
* [Azure VPN gateways](/azure/vpn-gateway/vpn-gateway-about-vpn-gateway-settings)
* [Azure network security groups](/azure/virtual-network/network-security-groups-overview)
