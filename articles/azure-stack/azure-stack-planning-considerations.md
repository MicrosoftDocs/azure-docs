---
title: Planning considerations for Azure Stack integrated systems | Microsoft Docs
description: Learn what you can do to plan now and prepare for multi-node Azure Stack.
services: azure-stack
documentationcenter: ''
author: twooley
manager: byronr
editor: ''

ms.assetid: 90f8fa1a-cace-4bfa-852b-5abe2b307615
ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/16/2017
ms.author: twooley

---
# Planning considerations for Azure Stack integrated systems

*Applies to: Azure Stack integrated systems*

If you’re interested in an Azure Stack integrated system, you’ll want to understand some of the major planning considerations around deployment and how the system fits into your datacenter. This topic provides a high-level overview of these considerations.

If you decide to purchase an integrated system, your original equipment manufacturer (OEM) hardware vendor helps guide you through much of the planning process in more detail. They will also perform the actual deployment.

## Management considerations

Azure Stack is a sealed system, where the infrastructure is locked down both from a permissions and network perspective. Network access control lists (ACLs) are applied to block all unauthorized incoming traffic and all unnecessary communications between infrastructure components. This makes it difficult for unauthorized users to access the system.

For daily management and operations, there is no unrestricted administrator access to the infrastructure. Azure Stack operators must manage the system through the administrator portal or through Azure Resource Manager (via PowerShell or the REST API). There is no access to the system by other management tools such as Hyper-V Manager or Failover Cluster Manager. To help protect the system, third-party software (for example, agents) can't be installed inside the components of the Azure Stack infrastructure. Interoperability with external management and security software occurs via PowerShell or the REST API.

When a higher level of access is needed for troubleshooting issues that aren’t resolved through alert mediation steps, you must work with Support. Through Support, there is a method to provide temporary full administrator access to the system to perform more advanced operations. 

## Deploy connected or disconnected
 
You can choose to deploy Azure Stack either connected to the internet (and to Azure) or disconnected. To get the most benefit from Azure Stack, including hybrid scenarios between Azure Stack and Azure, you'd want to deploy connected to Azure. The following table helps summarize the major differences between deployment modes.

| Area | Connected mode | Disconnected mode |
| -------- | ------------- | ----------|
| Identity provider | Azure Active Directory (Azure AD) or Active Directory Federation Services (AD FS) | AD FS only |
| Marketplace syndication | Download items directly from the Azure Marketplace to the marketplace in Azure Stack | Requires manual management of the marketplace in Azure Stack |
| Licensing model | Pay-as-you-use or capacity-based | Capacity-based only|
| Patch and update  | Download update packages directly to Azure Stack | Requires removable media and a separate connected device |
| | | |

You can’t change the deployment mode later without full system redeployment.

## Identity considerations

### Choose identity provider

You'll need to consider which identity provider you want to use for Azure Stack deployment, either Azure AD or AD FS. You can’t switch identity providers after deployment without full system redeployment.

Your identity provider choice has no bearing on tenant virtual machines, the identity system, and accounts they use, whether they can join an Active Directory domain, etc. This is separate.

**Reasons to consider using Azure AD**

- You already have existing investments in Azure AD (like Azure or Office 365).
- You want to use the same identity across Azure and Azure Stack clouds.
- You want to support multi-tenancy scenarios, where you can host different organizations on the same Azure Stack instance.
- You want to use REST-based directory management through Azure AD Graph to provision users, groups, etc. through APIs.

> [!NOTE]
> You can't connect an Azure Stack deployment to both an Azure AD instance and an existing AD FS instance at the same time. If you deploy with Azure AD, and you’d like to use an existing AD FS instance, you can federate your on-premises AD FS instance with Azure AD.

**Reasons to consider using AD FS**

- There is no or only partial internet connectivity.
- There are regulatory/sovereignty requirements.
- You want to use your own identity system (such as your corporate Active Directory) for operator and user accounts. To do this, you can federate with an existing AD FS instance (on Windows Server 2012, 2012 R2, or 2016) that's backed by Active Directory.
- You have no existing Azure investments, and you don’t want to use Azure AD.

> [!NOTE]
> You can federate Azure Stack only with another AD FS instance that's backed by Active Directory. Other identity providers are not supported. If you have other identity providers that you’d like to use with Azure Stack, consider using Azure AD-based deployment instead.

### AD FS and Graph integration

If you choose to deploy Azure Stack using AD FS as the identity provider, you must integrate the AD FS instance on Azure Stack with an existing AD FS instance through a federation trust. This allows identities in an existing Active Directory forest to authenticate with resources in Azure Stack.

You can also integrate the Graph service in Azure Stack with the existing Active Directory. This enables you to manage Role-Based Access Control (RBAC) in Azure Stack. When access to a resource is delegated, the Graph component looks up the user account in the existing Active Directory forest using the LDAP protocol.

The following diagram shows integrated AD FS and Graph traffic flow.
![Diagram showing AD FS and Graph traffic flow](media/azure-stack-planning-considerations/ADFSIntegration.PNG)

## Licensing model

You must decide which licensing model you want to use. For a connected deployment, you can choose either pay-as-you-use or capacity-based licensing. Pay-as-you-use requires a connection to Azure to report usage, which is then billed through Azure commerce. Only capacity-based licensing is supported if you deploy disconnected from the internet. For more information about the licensing models, see [Microsoft Azure Stack packaging and pricing](https://azure.microsoft.com/mediahandler/files/resourcefiles/5bc3f30c-cd57-4513-989e-056325eb95e1/Azure-Stack-packaging-and-pricing-datasheet.pdf).

## Naming decisions

You’ll need to think about how you want to plan your Azure Stack namespace, especially the region name, and external domain name. The fully qualified domain name (FQDN) of your Azure Stack deployment for public-facing endpoints is the combination of these two names, &lt;*region*&gt;&lt;*external_FQDN*&gt;, for example, *east.cloud.fabrikam.com*. In this example, the Azure Stack portals would be available at the following URLs:

- https://portal.east.cloud.fabrikam.com
- https://adminportal.east.cloud.fabrikam.com

The following table summarizes these domain naming decisions.

| Name | Description | 
| -------- | ------------- | 
|Region name | The name of your first Azure Stack region. This name is used as part of the FQDN for the public virtual IP addresses (VIPs) that Azure Stack manages. Typically, the region name would be a physical location identifier such as a datacenter location. | 
| External domain name | The name of the Domain Name System (DNS) zone for endpoints with external-facing VIPs. Used in the FQDN for these public VIPs. | 
| Private (internal) domain name | The name of the domain (and internal DNS zone) created on Azure Stack for infrastructure management. 
| | |

## Certificate requirements

For deployment, you’ll need to provide Secure Sockets Layer (SSL) certificates for public-facing endpoints. At a high level, certificates have the following requirements:

> [!IMPORTANT]
> The certificate information in this article is provided only as general guidance. Before you acquire any certificates for Azure Stack, work with your OEM hardware partner. They will provide more detailed certificate guidance and requirements.

- You can use a single wildcard certificate or you can use a set of dedicated certificates, and use wildcards only for endpoints such as storage and Key Vault.
- Certificates must be issued by a public trusted certificate authority (CA) or a customer-managed CA.
 
The following table shows the services and number of public-facing endpoints that require certificates for initial Azure Stack deployment. 

| Used For | Endpoint 
| -------- | ------------- | 
| Azure Resource Manager (administrator) | adminmanagment.[region].[external_domain] |
| Azure Resource Manager (user) | management.[region].[external_domain] |
| Portal (administrator) | adminportal.[region].[external_domain] |
| Portal (user) | portal. [region].[external_domain] |
| Key Vault (user) | &#42;.vault.[region].[external_domain] |
| Key Vault (administrator) | &#42;.adminvault.[region].[external_domain] |
| Storage | &#42;.blob.[region].[external_domain]<br>&#42;.table.[region].[external_domain]<br>&#42;.queue.[region].[external_domain]  |
| Graph** | graph.[region].[external_domain] |
| AD FS** | adfs.[region].[external_domain] |
| | |

**Certificates for Graph and AD FS endpoints are only needed for AD FS deployments.

If you want to use a single wildcard certificate, you need a total of six Subject Alternative Names (SANs) for initial Azure Stack deployment. These SANs are: 

- &#42;.[region].[external_domain]
- &#42;.vault.[region].[external_domain]
- &#42;.adminvault.[region].[external_domain]
- &#42;.blob.[region].[external_domain]
- &#42;.table.[region].[external_domain] 
- &#42;.queue.[region].[external_domain]

## Time synchronization

You must synchronize the Azure Stack time server with an external time server that's resolvable via IP address. A time server on the corporate network is required for a disconnected deployment.

## Network connectivity

### DNS integration

To resolve external DNS names from Azure Stack (for example, www.bing.com), you’ll need to provide DNS servers that Azure Stack can use to forward DNS requests for which Azure Stack is not authoritative. As deployment inputs, you must provide at least two servers to use as DNS forwarders for fault tolerance.

To resolve DNS names of Azure Stack endpoints from outside Azure Stack (for example, from the corporate forest), you must integrate the DNS servers that host the external DNS zone for Azure Stack with the DNS servers that host the parent zone you want to use. This requires DNS name resolution between Azure Stack and existing DNS zones in the datacenter. To accomplish this, you’ll use methods such as conditional forwarding or zone delegation. We recommend conditional forwarding if you have direct control over the DNS servers that host the parent zone for your Azure Stack external DNS namespace. (If your external Azure Stack DNS zone appears as a child domain of your corporate domain name (for example, azurestack.contoso.com and contoso.com), you must use zone delegation instead.

### Network infrastructure

The network infrastructure for Azure Stack consists of several logical networks that are configured on the switches. The following diagram shows these logical networks, and how they integrate with the top-of-rack (TOR), baseboard management controller (BMC), and border (customer network) switches.

![Logical network diagram and switch connections](media/azure-stack-planning-considerations/NetworkDiagram.png)

The following table shows the logical networks and associated IPv4 subnet ranges that you must plan for.

| Logical Network | Description | Size | 
| -------- | ------------- | ------------ | 
| Public VIP | Public IP addresses for a small set of Azure Stack services, with the rest used by tenant virtual machines. The Azure Stack infrastructure uses 32 addresses from this network. If you plan to use App Service and the SQL resource providers, this uses 7 more. | /26 (62 hosts) - /22 (1022 hosts)<br><br>Recommended = /24 (254 hosts) | 
| Switch infrastructure | Point-to-point IP addresses for routing purposes, dedicated switch management interfaces, and loopback addresses assigned to the switch. | /26 | 
| Infrastructure | Used for Azure Stack internal components to communicate. | /24 |
| Private | Used for the storage network and private VIPs. | /24 | 
| BMC | Used to communicate with the BMCs on the physical hosts. | /27 | 
| | | |

### Uplink to border switches

You'll need an uplink configured to the border switches in your datacenter. You can route this Layer 3 traffic from the top-of-rack (TOR) switches that are part of an Azure Stack integrated system using either of the following methods:

- Border Gateway Protocol (BGP) 
- static routing

We recommend BGP because it enables the automatic update of routes that are published by the Software Load Balancing Multiplexer (SLB MUX) to external networks. This is important if you add public IP address ranges after deployment. If you do BGP peering from the TOR switches to the aggregate switch that the TOR switches are connected to, public IP address ranges that you add post-deployment are automatically advertised to the aggregate switch without manual intervention. If you use static routing, you must manually update the routes for the new ranges every time you add a public IP address block.

### Proxy server

Azure Stack supports only transparent proxy servers. A transparent proxy intercepts requests at the network layer without requiring any special client configuration.

### Publish Azure Stack services

You'll need to make Azure Stack services available to users from outside Azure Stack. Azure Stack sets up various endpoints for its infrastructure roles. These endpoints are assigned VIPs from the public IP address pool. A DNS entry is created for each endpoint in the external DNS zone, which was specified at deployment time. For example, the user portal is assigned the DNS host entry of "portal.<*region*>.<*external_FQDN*>." 

#### Ports and URLs

To make Azure Stack services (such as the portals, Azure Resource Manager, DNS, etc.) available to external networks, you must allow inbound traffic to these endpoints for specific URLs, ports, and protocols.
 
In a deployment where a transparent proxy uplink to a traditional proxy server, you must allow specific ports and URLs for outbound communication. These include ports and URLs for identity, marketplace syndication, patch and update, registration, and usage data.

For more information, see:
- [Inbound ports and protocols](https://docs.microsoft.com/azure/azure-stack/azure-stack-integrate-endpoints#ports-and-protocols-inbound)
- [Outbound ports and URLs](https://docs.microsoft.com/azure/azure-stack/azure-stack-integrate-endpoints#ports-and-urls-outbound)

### Connect Azure Stack to Azure

For hybrid cloud scenarios, you’ll need to plan how you want to connect Azure Stack to Azure. There are two supported methods to connect virtual networks in Azure Stack to virtual networks in Azure: 
- **Site-to-site**. A virtual private network (VPN) connection over IPsec (IKE v1 and IKE v2). This type of connection requires a VPN device or Routing and Remote Access Service (RRAS). For more information about VPN gateways in Azure, see [About VPN Gateway](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-about-vpngateways). The communication over this tunnel is encrypted and is secure. However, bandwidth is limited by the maximum throughput of the tunnel (100-200 Mbps).
- **Outbound NAT**. By default, all virtual machines in Azure Stack will have connectivity to external networks via outbound NAT. Each virtual network that is created in Azure Stack gets a public IP address assigned to it. Whether the virtual machine is directly assigned a public IP address, or is behind a load balancer with a public IP address, it will have outbound access via outbound NAT using the VIP of the virtual network. This works only for communication that is initiated by the virtual machine and destined for external networks (either internet or intranet). It can’t be used to communicate with the virtual machine from outside.

#### Hybrid connectivity options

For hybrid connectivity, it’s important to consider what kind of deployment you want to offer and where it will be deployed. You’ll need to consider whether you need to isolate network traffic per tenant, and whether you’ll have an intranet or internet deployment.

- **Single-tenant Azure Stack**. An Azure Stack deployment that looks, at least from a networking perspective, as if it’s one tenant. There can be many tenant subscriptions, but like any intranet service, all traffic travels over the same networks. Network traffic from one subscription travels over the same network connection as another subscription and doesn’t need to be isolated via an encrypted tunnel.

- **Multi-tenant Azure Stack**. An Azure Stack deployment where each tenant subscription’s traffic that's bound for networks that are external to Azure Stack must be isolated from other tenants’ network traffic.
 
- **Intranet deployment**. An Azure Stack deployment that sits on a corporate intranet, typically on private IP address space and behind one or more firewalls. The public IP addresses are not truly public, as they can’t be routed directly over the public internet.

- **Internet deployment**. An Azure Stack deployment that’s connected to the public internet and uses internet-routable public IP addresses for the public VIP range. The deployment can still sit behind a firewall, but the public VIP range is directly reachable from the public internet and Azure.
 
The following table summarizes the hybrid connectivity scenarios, with the pros, cons, and use cases.

| Scenario | Connectivity Method | Pros | Cons | Good For |
| -- | -- | --| -- | --|
| Single tenant Azure Stack, intranet deployment | Outbound NAT | Better bandwidth for faster transfers. Simple to implement; no gateways required. | Traffic not encrypted; no isolation or encryption beyond the TOR. | Enterprise deployments where all tenants are equally trusted.<br><br>Enterprises that have an Azure ExpressRoute circuit to Azure. |
| Multi-tenant Azure Stack, intranet deployment | Site-to-site VPN | Traffic from the tenant VNet to destination is secure. | Bandwidth is limited by site-to-site VPN tunnel.<br><br>Requires a gateway in the virtual network and a VPN device on the destination network. | Enterprise deployments where some tenant traffic must be secured from other tenants. |
| Single tenant Azure Stack, internet deployment | Outbound NAT | Better bandwidth for faster transfers. | Traffic not encrypted; no isolation or encryption beyond the TOR. | Hosting scenarios where the tenant gets their own Azure Stack deployment and a dedicated circuit to the Azure Stack environment. For example, ExpressRoute and Multiprotocol Label Switching (MPLS).
| Multi-tenant Azure Stack, internet deployment | Site-to-site VPN | Traffic from the tenant VNet to destination is secure. | Bandwidth is limited by site-to-site VPN tunnel.<br><br>Requires a gateway in the virtual network and a VPN device on the destination network. | Hosting scenarios where the provider wants to offer a multi-tenant cloud, where the tenants don’t trust each other and traffic must be encrypted.
|  |  |  |  |  |

#### Using ExpressRoute

You can connect Azure Stack to Azure via [ExpressRoute](https://docs.microsoft.com/azure/expressroute/expressroute-introduction) for both single-tenant intranet and multi-tenant scenarios. You'll need a provisioned ExpressRoute circuit through [a connectivity provider](https://docs.microsoft.com/azure/expressroute/expressroute-locations).

The following diagram shows ExpressRoute for a single-tenant scenario (where "Customer's connection" is the ExpressRoute circuit).

![Diagram showing single-tenant ExpressRoute scenario](media/azure-stack-planning-considerations/ExpressRouteSingleTenant.PNG)

The following diagram shows ExpressRoute for a multi-tenant scenario.

![Diagram showing multi-tenant ExpressRoute scenario](media/azure-stack-planning-considerations/ExpressRouteMultiTenant.PNG)

## External monitoring
To get a single view of all alerts from your Azure Stack deployment and devices, and to integrate alerts into existing IT service management workflows for ticketing, you can integrate Azure Stack with external datacenter monitoring solutions.

Included with the Azure Stack solution, the hardware lifecycle host is a computer outside Azure Stack that runs OEM vendor-provided management tools for hardware. You can use these tools or other solutions that directly integrate with existing monitoring solutions in your datacenter.

The following table summarizes the list of currently available options.

| Area | External Monitoring Solution |
| -- | -- |
| Azure Stack software | - [Azure Stack Management Pack for Operations Manager](https://azure.microsoft.com/blog/management-pack-for-microsoft-azure-stack-now-available/)<br>- [Nagios plug-in](https://exchange.nagios.org/directory/Plugins/Cloud/Monitoring-AzureStack-Alerts/details)<br>- REST-based API calls | 
| Physical servers (BMCs via IPMI) | - Operations Manager vendor management pack<br>- OEM hardware vendor-provided solution<br>- Hardware vendor Nagios plug-ins | OEM partner-supported monitoring solution (included) | 
| Network devices (SNMP) | - Operations Manager network device discovery<br>- OEM hardware vendor-provided solution<br>- Nagios switch plug-in |
| Tenant subscription health monitoring | - [System Center Management Pack for Windows Azure](https://www.microsoft.com/download/details.aspx?id=50013) | 
|  |  | 

Note the following requirements:
- The solution you use must be agentless. You can't install third-party agents inside Azure Stack components. 
- If you want to use System Center Operations Manager, this requires Operations Manager 2012 R2 or Operations Manager 2016.

## Backup and disaster recovery

Planning for backup and disaster recovery involves planning for both the underlying Azure Stack infrastructure that hosts IaaS virtual machines and PaaS services, and for tenant applications and data. You must plan for these separately.

### Protect infrastructure components

Azure Stack backs up infrastructure components to a share that you specify.

- You’ll need an external SMB file share on an existing Windows-based file server or a third-party device.
- You should use this same share for the backup of network switches and the hardware lifecycle host. Your OEM hardware vendor will help provide guidance for backup and restore of these components as these are external to Azure Stack. You're responsible for running the backup workflows based on the OEM vendor’s recommendation.

If catastrophic data loss occurs, you can use the infrastructure backup to reseed deployment data such as deployment inputs and identifiers, service accounts, CA root certificate, federated resources (in disconnected deployments), plans, offers, subscriptions, quotas, RBAC policy and role assignments, and Key Vault secrets.
 
### Protect tenant applications on IaaS virtual machines

Azure Stack does not back up tenant applications and data. You must plan for backup and disaster recovery protection to a target external to Azure Stack. Tenant protection is a tenant-driven activity. For IaaS virtual machines, tenants can use in-guest technologies to protect file folders, application data, and system state. However, as an enterprise or service provider, you may want to offer a backup and recovery solution in the same datacenter or externally in a cloud.

To back up Linux or Windows IaaS virtual machines, you must use backup products with access to the guest operating system to protect file, folder, operating system state, and application data. You can use Azure Backup, System Center Data Center Protection Manager, or supported third-party products.

To replicate data to a secondary location and orchestrate application failover if a disaster occurs, you can use Azure Site Recovery, or supported third-party products. (At the initial release of integrated systems, Azure Site Recovery won’t support failback. However, you can achieve failback through a manual process.) Also, applications that support native replication (like Microsoft SQL Server) can replicate data to another location where the application is running.

> [!IMPORTANT]
> At the initial release of integrated systems, we’ll support protection technologies that work at the guest level of an IaaS virtual machine. You can’t install agents on underlying infrastructure servers.

## Next steps

- For information about use cases, purchasing, partners, and OEM hardware vendors, see the [Azure Stack](https://azure.microsoft.com/overview/azure-stack/) product page.
- For information about the roadmap and geo-availability for Azure Stack integrated systems, see the white paper: [Azure Stack: An extension of Azure](https://azure.microsoft.com/resources/azure-stack-an-extension-of-azure/). 
