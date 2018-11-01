---
title: General datacenter integration considerations for Azure Stack integrated systems | Microsoft Docs
description: Learn what you can do to plan now and prepare for datacenter integration with multi-node Azure Stack.
services: azure-stack
documentationcenter: ''
author: jeffgilb
manager: femila
editor: ''

ms.assetid: 
ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/12/2018
ms.author: jeffgilb
ms.reviewer: wfayed
---
 
# Datacenter integration considerations for Azure Stack integrated systems
If you’re interested in an Azure Stack integrated system, you should understand some of the major planning considerations around deployment and how the system fits into your datacenter. This article provides a high-level overview of these considerations to help you make important infrastructure decisions for your Azure Stack multi-node system. An understanding of these considerations helps when working with your OEM hardware vendor as they deploy Azure Stack to your datacenter.  

> [!NOTE]
> Azure Stack multi-node systems can only be purchased from authorized hardware vendors. 

To deploy Azure Stack, you need to provide planning information to your solution provider before deployment starts to help the process go quickly and smoothly. The information required ranges across networking, security, and identity information with many important decisions that may require knowledge from many different areas and decision makers. Therefore, you might have to pull in people from multiple teams in your organization to ensure that you have all required information ready before deployment begins. It can help to talk to your hardware vendor while collecting this information, as they might have advice helpful to making your decisions.

While researching and collecting the required information, you might need to make some pre-deployment configuration changes to your network environment. This could include reserving IP address spaces for the Azure Stack solution, configuring your routers, switches and firewalls to prepare for the connectivity to the new Azure Stack solution switches. Make sure to have the subject area expert lined up to help you with your planning.

## Capacity planning considerations
When evaluating an Azure Stack Solution for acquisition, hardware configuration choices must be made which have a direct impact on the overall capacity of their Azure Stack solution. These include the classic choices of CPU, memory density, storage configuration, and overall solution scale (e.g. number of servers). Unlike a traditional virtualization solution, the simple arithmetic of these components to determine usable capacity does not apply. The first reason is that Azure Stack is architected to host the infrastructure or management components within the solution itself. The second reason is that some of the solution’s capacity is reserved in support of resiliency; the updating of the solution’s software in a way that minimizes disruption of tenant workloads. 

The [Azure Stack capacity planner spreadsheet](https://aka.ms/azstackcapacityplanner) helps you make informed decisions with respect to planning capacity in two ways: either the by selecting a hardware offering and attempting to fit a combination of resources or by defining the workload that Azure Stack is intended to run to view the available hardware SKUs that can support it. Finally, the spreadsheet is intended as a guide to help in making decisions related to Azure Stack planning and configuration. 

The spreadsheet is not intended to serve as a substitute for your own investigation and analysis.  Microsoft makes no representations or warranties, express or implied, with respect to the information provided within the spreadsheet.



## Management considerations
Azure Stack is a sealed system, where the infrastructure is locked down both from a permissions and network perspective. Network access control lists (ACLs) are applied to block all unauthorized incoming traffic and all unnecessary communications between infrastructure components. This makes it difficult for unauthorized users to access the system.

For daily management and operations, there is no unrestricted administrator access to the infrastructure. Azure Stack operators must manage the system through the administrator portal or through Azure Resource Manager (via PowerShell or the REST API). There is no access to the system by other management tools such as Hyper-V Manager or Failover Cluster Manager. To help protect the system, third-party software (for example, agents) can't be installed inside the components of the Azure Stack infrastructure. Interoperability with external management and security software occurs via PowerShell or the REST API.

When a higher level of access is needed for troubleshooting issues that aren’t resolved through alert mediation steps, you must work with Microsoft Support. Through support, there is a method to provide temporary full administrator access to the system to perform more advanced operations. 

## Identity considerations

### Choose identity provider
You'll need to consider which identity provider you want to use for Azure Stack deployment, either Azure AD or AD FS. You can’t switch identity providers after deployment without full system redeployment. If you do not own the Azure AD account and are using an account provided to you by your Cloud Service Provider, and if you decide to switch provider and use a different Azure AD account, at this point you will have to contact your solution provider to redeploy the solution for you at your cost.



Your identity provider choice has no bearing on tenant virtual machines, the identity system, and accounts they use, whether they can join an Active Directory domain, etc. This is separate.

You can learn more about choosing an identity provider in the [Azure Stack integrated systems connection models article](.\azure-stack-connection-models.md).

### AD FS and Graph integration
If you choose to deploy Azure Stack using AD FS as the identity provider, you must integrate the AD FS instance on Azure Stack with an existing AD FS instance through a federation trust. This allows identities in an existing Active Directory forest to authenticate with resources in Azure Stack.

You can also integrate the Graph service in Azure Stack with the existing Active Directory. This enables you to manage Role-Based Access Control (RBAC) in Azure Stack. When access to a resource is delegated, the Graph component looks up the user account in the existing Active Directory forest using the LDAP protocol.

The following diagram shows integrated AD FS and Graph traffic flow.
![Diagram showing AD FS and Graph traffic flow](media/azure-stack-datacenter-integration/ADFSIntegration.PNG)

## Licensing model
You must decide which licensing model you want to use. The available options depend on whether or not you deploy Azure Stack connected to the internet:
- For a [connected deployment](azure-stack-connected-deployment.md), you can choose either pay-as-you-use or capacity-based licensing. Pay-as-you-use requires a connection to Azure to report usage, which is then billed through Azure commerce. 
- Only capacity-based licensing is supported if you [deploy disconnected](azure-stack-disconnected-deployment.md) from the internet. 

For more information about the licensing models, see [Microsoft Azure Stack packaging and pricing](https://azure.microsoft.com/mediahandler/files/resourcefiles/5bc3f30c-cd57-4513-989e-056325eb95e1/Azure-Stack-packaging-and-pricing-datasheet.pdf).


## Naming decisions

You’ll need to think about how you want to plan your Azure Stack namespace, especially the region name and external domain name. The external fully qualified domain name (FQDN) of your Azure Stack deployment for public-facing endpoints is the combination of these two names: &lt;*region*&gt;.&lt;*fqdn*&gt;. For example, *east.cloud.fabrikam.com*. In this example, the Azure Stack portals would be available at the following URLs:

- https://portal.east.cloud.fabrikam.com
- https://adminportal.east.cloud.fabrikam.com

> [!IMPORTANT]
> The region name you choose for your Azure Stack deployment must be unique and will appear in the portal addresses. 

The following table summarizes these domain naming decisions.

| Name | Description | 
| -------- | ------------- | 
|Region name | The name of your first Azure Stack region. This name is used as part of the FQDN for the public virtual IP addresses (VIPs) that Azure Stack manages. Typically, the region name would be a physical location identifier such as a datacenter location.<br><br>The region name must consist of only letters and numbers between 0-9. No special characters like “-“ or “#”, etc. are allowed.| 
| External domain name | The name of the Domain Name System (DNS) zone for endpoints with external-facing VIPs. Used in the FQDN for these public VIPs. | 
| Private (internal) domain name | The name of the domain (and internal DNS zone) created on Azure Stack for infrastructure management. 
| | |

## Certificate requirements

For deployment, you’ll need to provide Secure Sockets Layer (SSL) certificates for public-facing endpoints. At a high level, certificates have the following requirements:

- You can use a single wildcard certificate or you can use a set of dedicated certificates, and use wildcards only for endpoints such as storage and Key Vault.
- Certificates can be issued by a public trusted certificate authority (CA) or a customer-managed CA.

For more information  about what PKI certificates are required to deploy Azure Stack, and how to obtain them, see, [Azure Stack Public Key Infrastructure certificate requirements](azure-stack-pki-certs.md).  


> [!IMPORTANT]
> The provided PKI certificate information should be used as general guidance. Before you acquire any PKI certificates for Azure Stack, work with your OEM hardware partner. They will provide more detailed certificate guidance and requirements.


## Time synchronization
You must choose a specific time server with is used to synchronize Azure Stack.  Time symbolization is critical to Azure Stack and its Infrastructure Roles, as it is used to generate Kerberos tickets which are used to authenticate internal services with each other.

You must specify an IP for the time synchronization server, although most of the components in the infrastructure can resolve an URL, some can only support IP addresses. If you’re are using the Disconnected deployment option, you must specify a time server on your corporate network that you are sure can be reached from the infrastructure network in Azure Stack.

## Connect Azure Stack to Azure

For hybrid cloud scenarios, you’ll need to plan how you want to connect Azure Stack to Azure. There are two supported methods to connect virtual networks in Azure Stack to virtual networks in Azure: 
- **Site-to-site**. A virtual private network (VPN) connection over IPsec (IKE v1 and IKE v2). This type of connection requires a VPN device or Routing and Remote Access Service (RRAS). For more information about VPN gateways in Azure, see [About VPN Gateway](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-about-vpngateways). The communication over this tunnel is encrypted and is secure. However, bandwidth is limited by the maximum throughput of the tunnel (100-200 Mbps).
- **Outbound NAT**. By default, all virtual machines in Azure Stack will have connectivity to external networks via outbound NAT. Each virtual network that is created in Azure Stack gets a public IP address assigned to it. Whether the virtual machine is directly assigned a public IP address, or is behind a load balancer with a public IP address, it will have outbound access via outbound NAT using the VIP of the virtual network. This works only for communication that is initiated by the virtual machine and destined for external networks (either internet or intranet). It can’t be used to communicate with the virtual machine from outside.

### Hybrid connectivity options

For hybrid connectivity, it’s important to consider what kind of deployment you want to offer and where it will be deployed. You’ll need to consider whether you need to isolate network traffic per tenant, and whether you’ll have an intranet or internet deployment.

- **Single-tenant Azure Stack**. An Azure Stack deployment that looks, at least from a networking perspective, as if it’s one tenant. There can be many tenant subscriptions, but like any intranet service, all traffic travels over the same networks. Network traffic from one subscription travels over the same network connection as another subscription and doesn’t need to be isolated via an encrypted tunnel.

- **Multi-tenant Azure Stack**. An Azure Stack deployment where each tenant subscription’s traffic that's bound for networks that are external to Azure Stack must be isolated from other tenants’ network traffic.
 
- **Intranet deployment**. An Azure Stack deployment that sits on a corporate intranet, typically on private IP address space and behind one or more firewalls. The public IP addresses are not truly public, as they can’t be routed directly over the public internet.

- **Internet deployment**. An Azure Stack deployment that’s connected to the public internet and uses internet-routable public IP addresses for the public VIP range. The deployment can still sit behind a firewall, but the public VIP range is directly reachable from the public internet and Azure.
 
The following table summarizes the hybrid connectivity scenarios, with the pros, cons, and use cases.

| Scenario | Connectivity Method | Pros | Cons | Good For |
| -- | -- | --| -- | --|
| Single tenant Azure Stack, intranet deployment | Outbound NAT | Better bandwidth for faster transfers. Simple to implement; no gateways required. | Traffic not encrypted; no isolation or encryption outside the stack. | Enterprise deployments where all tenants are equally trusted.<br><br>Enterprises that have an Azure ExpressRoute circuit to Azure. |
| Multi-tenant Azure Stack, intranet deployment | Site-to-site VPN | Traffic from the tenant VNet to destination is secure. | Bandwidth is limited by site-to-site VPN tunnel.<br><br>Requires a gateway in the virtual network and a VPN device on the destination network. | Enterprise deployments where some tenant traffic must be secured from other tenants. |
| Single tenant Azure Stack, internet deployment | Outbound NAT | Better bandwidth for faster transfers. | Traffic not encrypted; no isolation or encryption outside the stack. | Hosting scenarios where the tenant gets their own Azure Stack deployment and a dedicated circuit to the Azure Stack environment. For example, ExpressRoute and Multiprotocol Label Switching (MPLS).
| Multi-tenant Azure Stack, internet deployment | Site-to-site VPN | Traffic from the tenant VNet to destination is secure. | Bandwidth is limited by site-to-site VPN tunnel.<br><br>Requires a gateway in the virtual network and a VPN device on the destination network. | Hosting scenarios where the provider wants to offer a multi-tenant cloud, where the tenants don’t trust each other and traffic must be encrypted.
|  |  |  |  |  |

### Using ExpressRoute

You can connect Azure Stack to Azure via [ExpressRoute](https://docs.microsoft.com/azure/expressroute/expressroute-introduction) for both single-tenant intranet and multi-tenant scenarios. You'll need a provisioned ExpressRoute circuit through [a connectivity provider](https://docs.microsoft.com/azure/expressroute/expressroute-locations).

The following diagram shows ExpressRoute for a single-tenant scenario (where "Customer's connection" is the ExpressRoute circuit).

![Diagram showing single-tenant ExpressRoute scenario](media/azure-stack-datacenter-integration/ExpressRouteSingleTenant.PNG)

The following diagram shows ExpressRoute for a multi-tenant scenario.

![Diagram showing multi-tenant ExpressRoute scenario](media/azure-stack-datacenter-integration/ExpressRouteMultiTenant.PNG)

## External monitoring
To get a single view of all alerts from your Azure Stack deployment and devices, and to integrate alerts into existing IT service management workflows for ticketing, you can [integrate Azure Stack with external datacenter monitoring solutions](azure-stack-integrate-monitor.md).

Included with the Azure Stack solution, the hardware lifecycle host is a computer outside Azure Stack that runs OEM vendor-provided management tools for hardware. You can use these tools or other solutions that directly integrate with existing monitoring solutions in your datacenter.

The following table summarizes the list of currently available options.

| Area | External Monitoring Solution |
| -- | -- |
| Azure Stack software | [Azure Stack Management Pack for Operations Manager](https://azure.microsoft.com/blog/management-pack-for-microsoft-azure-stack-now-available/)<br>[Nagios plug-in](https://exchange.nagios.org/directory/Plugins/Cloud/Monitoring-AzureStack-Alerts/details)<br>REST-based API calls | 
| Physical servers (BMCs via IPMI) | OEM hardware - Operations Manager vendor management pack<br>OEM hardware vendor-provided solution<br>Hardware vendor Nagios plug-ins | OEM partner-supported monitoring solution (included) | 
| Network devices (SNMP) | Operations Manager network device discovery<br>OEM hardware vendor-provided solution<br>Nagios switch plug-in |
| Tenant subscription health monitoring | [System Center Management Pack for Windows Azure](https://www.microsoft.com/download/details.aspx?id=50013) | 
|  |  | 

Note the following requirements:
- The solution you use must be agentless. You can't install third-party agents inside Azure Stack components. 
- If you want to use System Center Operations Manager, Operations Manager 2012 R2 or Operations Manager 2016 is required.

## Backup and disaster recovery

Planning for backup and disaster recovery involves planning for both the underlying Azure Stack infrastructure that hosts IaaS virtual machines and PaaS services, and for tenant applications and data. You must plan for these separately.

### Protect infrastructure components

You can [back up Azure Stack](azure-stack-backup-back-up-azure-stack.md) infrastructure components to an SMB share that you specify:

- You’ll need an external SMB file share on an existing Windows-based file server or a third-party device.
- You should use this same share for the backup of network switches and the hardware lifecycle host. Your OEM hardware vendor will help provide guidance for backup and restore of these components as these are external to Azure Stack. You're responsible for running the backup workflows based on the OEM vendor’s recommendation.

If catastrophic data loss occurs, you can use the infrastructure backup to reseed deployment data such as deployment inputs and identifiers, service accounts, CA root certificate, federated resources (in disconnected deployments), plans, offers, subscriptions, quotas, RBAC policy and role assignments, and Key Vault secrets.
 
### Protect tenant applications on IaaS virtual machines

Azure Stack does not back up tenant applications and data. You must plan for backup and disaster recovery protection to a target external to Azure Stack. Tenant protection is a tenant-driven activity. For IaaS virtual machines, tenants can use in-guest technologies to protect file folders, application data, and system state. However, as an enterprise or service provider, you may want to offer a backup and recovery solution in the same datacenter or externally in a cloud.

To back up Linux or Windows IaaS virtual machines, you must use backup products with access to the guest operating system to protect file, folder, operating system state, and application data. You can use Azure Backup, System Center Data Center Protection Manager, or supported third-party products.

To replicate data to a secondary location and orchestrate application failover if a disaster occurs, you can use Azure Site Recovery, or supported third-party products. Also, applications that support native replication, like Microsoft SQL Server, can replicate data to another location where the application is running.

## Learn more

- For information about use cases, purchasing, partners, and OEM hardware vendors, see the [Azure Stack](https://azure.microsoft.com/overview/azure-stack/) product page.
- For information about the roadmap and geo-availability for Azure Stack integrated systems, see the white paper: [Azure Stack: An extension of Azure](https://azure.microsoft.com/resources/azure-stack-an-extension-of-azure/). 

## Next steps
[Azure Stack deployment connection models](azure-stack-connection-models.md)
