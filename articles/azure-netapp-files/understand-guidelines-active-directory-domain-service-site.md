---
title: Understand guidelines for Active Directory Domain Services site design and planning
description: Proper Active Directory Domain Services (AD DS) design and planning are key to solution architectures that use Azure NetApp Files volumes.
services: azure-netapp-files
documentationcenter: ''
author: b-ahibbard
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.date: 02/21/2023
ms.author: anfdocs
---
# Understand guidelines for Active Directory Domain Services site design and planning for Azure NetApp Files

Proper Active Directory Domain Services (AD DS) design and planning are key to solution architectures that use Azure NetApp Files volumes. Azure NetApp Files features such as [SMB volumes](azure-netapp-files-create-volumes-smb.md), [dual-protocol volumes](create-volumes-dual-protocol.md), and [NFSv4.1 Kerberos volumes](configure-kerberos-encryption.md) are designed to be used with AD DS.  

This article provides recommendations to help you develop an AD DS deployment strategy for Azure NetApp Files. Before reading this article, you need to have a good understanding about how AD DS works on a functional level.  

## <a name="ad-ds-requirements"></a> Identify AD DS requirements for Azure NetApp Files

Before you deploy Azure NetApp Files volumes, you must identify the AD DS integration requirements for Azure NetApp Files to ensure that Azure NetApp Files is well connected to AD DS. _Incorrect or incomplete AD DS integration with Azure NetApp Files might cause client access interruptions or outages for SMB, dual-protocol, or Kerberos NFSv4.1 volumes_.  

### Supported authentication scenarios

Azure NetApp Files supports identity-based authentication over SMB through the following methods.   

* **AD DS authentication**:  AD DS-joined Windows machines can access Azure NetApp Files shares with Active Directory credentials over SMB. Your client must have line of sight to your AD DS. If you already have AD DS set up on-premises or on a VM in Azure where your devices are domain-joined to your AD DS, you should use AD DS for Azure NetApp Files file share authentication.
* **Microsoft Entra Domain Services authentication**: Cloud-based, Microsoft Entra Domain Services-joined Windows VMs can access Azure NetApp Files file shares with Microsoft Entra Domain Services credentials. In this solution, Microsoft Entra Domain Services runs a traditional Windows Server AD domain on behalf of the customer.
* **Microsoft Entra Kerberos for hybrid identities**: Using Microsoft Entra ID for authenticating [hybrid user identities](../active-directory/hybrid/whatis-hybrid-identity.md) allows Microsoft Entra users to access Azure NetApp Files file shares using Kerberos authentication. This means your end users can access Azure NetApp Files file shares without requiring a line-of-sight to domain controllers from Microsoft Entra hybrid joined and Microsoft Entra joined Windows or Linux virtual machines. *Cloud-only identities aren't currently supported.*
* **AD Kerberos authentication for Linux clients**: Linux clients can use Kerberos authentication over SMB for Azure NetApp Files using AD DS.


### <a name="network-requirements"></a>Network requirements 

Azure NetApp Files SMB, dual-protocol, and Kerberos NFSv4.1 volumes require reliable and low-latency network connectivity (less than 10 ms RTT) to AD DS domain controllers. Poor network connectivity or high network latency between Azure NetApp Files and AD DS domain controllers can cause client access interruptions or client timeouts.

Ensure that you meet the following requirements about network topology and configurations:

* Ensure that a [supported network topology for Azure NetApp Files](azure-netapp-files-network-topologies.md) is used.
* Ensure that AD DS domain controllers have network connectivity from the Azure NetApp Files delegated subnet hosting the Azure NetApp Files volumes.
    * Peered virtual network topologies with AD DS domain controllers must have peering configured correctly to support Azure NetApp Files to AD DS domain controller network connectivity.
* Network Security Groups (NSGs) and AD DS domain controller firewalls must have appropriately configured rules to support Azure NetApp Files connectivity to AD DS and DNS.
* Ensure that the latency is less than 10 ms RTT between Azure NetApp Files and AD DS domain controllers.

The required network ports are as follows:

| Service | Port | Protocol |
| -- | - | - |
|AD Web Services | 9389 | TCP |
| DNS* | 53 | TCP |
| DNS* | 53 | UDP |
| ICMPv4 | N/A | Echo Reply |
| Kerberos | 464 | TCP |
| Kerberos | 464 | UDP |
| Kerberos | 88 | TCP |
| Kerberos | 88 | UDP |
| LDAP | 389 | TCP |
| LDAP | 389 | UDP |
| LDAP | 3268 | TCP |
| NetBIOS name | 138 | UDP |
| SAM/LSA | 445 | TCP |
| SAM/LSA | 445 | UDP |

*DNS running on AD DS domain controller

### DNS requirements 

Azure NetApp Files SMB, dual-protocol, and Kerberos NFSv4.1 volumes require reliable access to Domain Name System (DNS) services and up-to-date DNS records. Poor network connectivity between Azure NetApp Files and DNS servers can cause client access interruptions or client timeouts. Incomplete or incorrect DNS records for AD DS or Azure NetApp Files can cause client access interruptions or client timeouts.

Azure NetApp Files supports the use of [Active Directory integrated DNS](/windows-server/identity/ad-ds/plan/active-directory-integrated-dns-zones) or standalone DNS servers.    

Ensure that you meet the following requirements about the DNS configurations:
* If you're using standalone DNS servers: 
    * Ensure that DNS servers have network connectivity to the Azure NetApp Files delegated subnet hosting the Azure NetApp Files volumes.
    * Ensure that network ports UDP 53 and TCP 53 are not blocked by firewalls or NSGs.
* Ensure that [the SRV records registered by the AD DS Net Logon service](https://social.technet.microsoft.com/wiki/contents/articles/7608.srv-records-registered-by-net-logon.aspx) have been created on the DNS servers.
* Ensure that the PTR records for the AD DS domain controllers used by Azure NetApp Files have been created on the DNS servers.
* Azure NetApp Files doesn’t automatically delete pointer records (PTR) associated with DNS entries when a volume is deleted. PTR records are used for reverse DNS lookups, which map IP addresses to hostnames. They are typically managed by the DNS server's administrator.
When you create a volume in Azure NetApp Files, you can associate it with a DNS name. However, the management of DNS records, including PTR records, is outside the scope of Azure NetApp Files. Azure NetApp Files provides the option to associate a volume with a DNS name for easier access, but it doesn't manage the DNS records associated with that name. 
If you delete a volume in Azure NetApp Files, the associated DNS records (such as the A records for forwarding DNS lookups) need to be managed and deleted from the DNS server or the DNS service you are using.
* Azure NetApp Files supports standard and secure dynamic DNS updates. If you require secure dynamic DNS updates, ensure that secure updates are configured on the DNS servers.
* If dynamic DNS updates are not used, you need to manually create an A record and a PTR record for the AD DS computer account(s) created in the AD DS **Organizational Unit** (specified in the Azure NetApp Files AD connection) to support Azure NetApp Files LDAP Signing, LDAP over TLS, SMB, dual-protocol, or Kerberos NFSv4.1 volumes.
* For complex or large AD DS topologies, [DNS Policies or DNS subnet prioritization may be required to support LDAP enabled NFS volumes](#ad-ds-ldap-discover).  

### Time source requirements 

Azure NetApp Files uses **time.windows.com** as the time source. Ensure that the domain controllers used by Azure NetApp Files are configured to use time.windows.com or another accurate, stable root (stratum 1) time source. If there's more than a five-minute skew between Azure NetApp Files and your client or AS DS domain controllers, authentication will fail; access to Azure NetApp Files volumes might also fail.

## Decide which AD DS to use with Azure NetApp Files

Azure NetApp Files supports both Active Directory Domain Services (AD DS) and Microsoft Entra Domain Services for AD connections. Before you create an AD connection, you need to decide whether to use AD DS or Microsoft Entra Domain Services.

For more information, see [Compare self-managed Active Directory Domain Services, Microsoft Entra ID, and managed Microsoft Entra Domain Services](../active-directory-domain-services/compare-identity-solutions.md).

### Active Directory Domain Services considerations

You should use Active Directory Domain Services (AD DS) in the following scenarios:

* You have AD DS users hosted in an on-premises AD DS domain that need access to Azure NetApp Files resources.
* You have applications hosted partially on-premises and partially in Azure that need access to Azure NetApp Files resources.
* You don’t need Microsoft Entra Domain Services integration with a Microsoft Entra tenant in your subscription, or Microsoft Entra Domain Services is incompatible with your technical requirements.

> [!NOTE]
> Azure NetApp Files doesn't support the use of AD DS Read-only Domain Controllers (RODC).

If you choose to use AD DS with Azure NetApp Files, follow the guidance in [Extend AD DS into Azure Architecture Guide](/azure/architecture/reference-architectures/identity/adds-extend-domain) and ensure that you meet the Azure NetApp Files [network](#network-requirements) and [DNS requirements](#ad-ds-requirements) for AD DS.

<a name='azure-active-directory-domain-services-considerations'></a>

### Microsoft Entra Domain Services considerations

[Microsoft Entra Domain Services](../active-directory-domain-services/overview.md) is a managed AD DS domain that is synchronized with your Microsoft Entra tenant. The main benefits to using Microsoft Entra Domain Services are as follows:

* Microsoft Entra Domain Services is a standalone domain. As such, there's no need to set up network connectivity between on-premises and Azure.
* Provides simplified deployment and management experience.

You should use Microsoft Entra Domain Services in the following scenarios:

* There’s no need to extend AD DS from on-premises into Azure to provide access to Azure NetApp Files resources.
* Your security policies do not allow the extension of on-premises AD DS into Azure.
* You don’t have strong knowledge of AD DS. Microsoft Entra Domain Services can improve the likelihood of good outcomes with Azure NetApp Files.

If you choose to use Microsoft Entra Domain Services with Azure NetApp Files, see [Microsoft Entra Domain Services documentation](../active-directory-domain-services/overview.md) for [architecture](../active-directory-domain-services/scenarios.md), deployment, and management guidance. Ensure that you also meet the Azure NetApp Files [Network](#network-requirements) and [DNS requirements](#ad-ds-requirements).

## Design AD DS site topology for use with Azure NetApp Files

A proper design for the AD DS site topology is critical for any solution architecture that involves Azure NetApp Files SMB, dual-protocol, or NFSv4.1 Kerberos volumes. 

Incorrect AD DS site topology or configuration can result in the following behaviors:
* Failure to create Azure NetApp Files [SMB](azure-netapp-files-create-volumes-smb.md), [dual-protocol](create-volumes-dual-protocol.md), or [NFSv4.1 Kerberos](configure-kerberos-encryption.md) volumes
* Failure to [modify ANF AD connection configuration](modify-active-directory-connections.md) 
* Poor LDAP client query performance
* Authentication problems

An AD DS site topology for Azure NetApp Files is a logical representation of the [Azure NetApp Files network](#network-requirements). Designing an AD DS site topology for Azure NetApp Files involves planning for domain controller placement, designing sites, DNS infrastructure, and network subnets to ensure good connectivity among the Azure NetApp Files service, Azure NetApp Files storage clients, and AD DS domain controllers.

In addition to multiple domain controllers assigned to the AD DS site configured in the Azure NetApp Files AD Site Name, the Azure NetApp Files AD DS site can have one or more subnets assigned to it. 

>[!NOTE]
>It's essential that all the domain controllers and subnets assigned to the Azure NetApp Files AD DS site must be well connected (less than 10ms RTT latency) and reachable by the network interfaces used by the Azure NetApp Files volumes. 
>
>If you're using Standard network features, you should ensure that any User Defined Routes (UDRs) or Network Security Group (NSG) rules do not block Azure NetApp Files network communication with AD DS domain controllers assigned to the Azure NetApp Files AD DS site. 
>
>If you're using Network Virtual Appliances or firewalls (such as Palo Alto Networks or Fortinet firewalls), they must be configured to not block network traffic between Azure NetApp Files and the AD DS domain controllers and subnets assigned to the Azure NetApp Files AD DS site.

### How Azure NetApp Files uses AD DS site information

Azure NetApp Files uses the **AD Site Name** configured in the [Active Directory connections](create-active-directory-connections.md#create-an-active-directory-connection) to discover which domain controllers are present to support authentication, domain join, LDAP queries, and Kerberos ticket operations. 

#### AD DS domain controller discovery

Azure NetApp Files initiates domain controller discovery every four hours. Azure NetApp Files queries the site-specific DNS service (SRV) resource record to determine which domain controllers are in the AD DS site specified in the **AD Site Name** field of the Azure NetApp Files AD connection. Azure NetApp Files domain controller server discovery checks the status of the services hosted on the domain controllers (such as Kerberos, LDAP, Net Logon, and LSA) and selects the optimal domain controller for authentication requests.

The DNS service (SRV) resource records for the AD DS site specified in the AD Site name field of the Azure NetApp Files AD connection must contain the list of IP addresses for the AD DS domain controllers that will be used by Azure NetApp Files. You can check the validity of the DNS (SRV) resource record by using the `nslookup` utility. 

> [!NOTE]
> If you make changes to the domain controllers in the AD DS site that is used by Azure NetApp Files, wait at least four hours between deploying new AD DS domain controllers and retiring existing AD DS domain controllers. This wait time enables Azure NetApp Files to discover the new AD DS domain controllers.

Ensure that stale DNS records associated with the retired AD DS domain controller are removed from DNS. Doing so ensures that Azure NetApp Files will not attempt to communicate with the retired domain controller.  

#### <a name="ad-ds-ldap-discover"></a> AD DS LDAP server discovery

A separate discovery process for AD DS LDAP servers occurs when LDAP is enabled for an Azure NetApp Files NFS volume. When the LDAP client is created on Azure NetApp Files, Azure NetApp Files queries the AD DS domain service (SRV) resource record for a list of all AD DS LDAP servers in the domain and not the AD DS LDAP servers assigned to the AD DS site specified in the AD connection.

In large or complex AD DS topologies, you might need to implement [DNS Policies](/windows-server/networking/dns/deploy/dns-policies-overview) or [DNS subnet prioritization](/previous-versions/windows/it-pro/windows-2000-server/cc961422(v=technet.10)?redirectedfrom=MSDN) to ensure that the AD DS LDAP servers assigned to the AD DS site specified in the AD connection are returned.

Alternatively, the AD DS LDAP server discovery process can be overridden by specifying up to two [preferred AD servers for the LDAP client](create-active-directory-connections.md#preferred-server-ldap). 

> [!IMPORTANT]
> If Azure NetApp Files cannot reach a discovered AD DS LDAP server during the creation of the Azure NetApp Files LDAP client, the creation of the LDAP enabled volume will fail.

### Consequences of incorrect or incomplete AD Site Name configuration

Incorrect or incomplete AD DS site topology or configuration can result in volume creation failures, problems with client queries, authentication failures, and failures to modify Azure NetApp Files AD connections.

>[!IMPORTANT]
>The AD Site Name field is required to create an Azure NetApp Files AD connection. The AD DS site defined must exist and be properly configured.

Azure NetApp Files uses the AD DS Site to discover the domain controllers and subnets assigned to the AD DS Site defined in the AD Site Name. All domain controllers assigned to the AD DS Site must have good network connectivity from the Azure virtual network interfaces used by ANF and be reachable. AD DS domain controller VMs assigned to the AD DS Site that are used by Azure NetApp Files must be excluded from cost management policies that shut down VMs.

If Azure NetApp Files is not able to reach any domain controllers assigned to the AD DS site, the domain controller discovery process will query the AD DS domain for a list of all domain controllers. The list of domain controllers returned from this query is an unordered list. As a result, Azure NetApp Files may try to use domain controllers that are not reachable or well-connected, which can cause volume creation failures, problems with client queries, authentication failures, and failures to modify Azure NetApp Files AD connections.

You must update the AD DS Site configuration whenever new domain controllers are deployed into a subnet assigned to the AD DS site that is used by the Azure NetApp Files AD Connection. Ensure that the DNS SRV records for the site reflect any changes to the domain controllers assigned to the AD DS Site used by Azure NetApp Files. You can check the validity of the DNS (SRV) resource record by using the `nslookup` utility.

> [!NOTE]
> Azure NetApp Files doesn't support the use of AD DS Read-only Domain Controllers (RODC). To prevent Azure NetApp Files from using an RODC, do not configure the **AD Site Name** field of the AD connections with an RODC.

### Sample AD DS site topology configuration for Azure NetApp Files

An AD DS site topology is a logical representation of the network where Azure NetApp Files is deployed. In this section, the sample configuration scenario for AD DS site topology intends to show a _basic_ AD DS site design for Azure NetApp Files. It is not the only way to design network or AD site topology for Azure NetApp Files. 

> [!IMPORTANT]
> For scenarios that involve complex AD DS or complex network topologies, you should have a Microsoft Azure CSA review the Azure NetApp Files networking and AD Site design.  

The following diagram shows a sample network topology:
sample-network-topology.png
:::image type="content" source="../media/azure-netapp-files/sample-network-topology.png" alt-text="Diagram illustrating network topology." lightbox="../media/azure-netapp-files/sample-network-topology.png":::

In the sample network topology, an on-premises AD DS domain (`anf.local`) is extended into an Azure virtual network. The on-premises network is connected to the Azure virtual network using an Azure ExpressRoute circuit. 

The Azure virtual network has four subnets: Gateway Subnet, Azure Bastion Subnet, AD DS Subnet, and an Azure NetApp Files Delegated Subnet. Redundant AD DS domain controllers joined to the `anf.local` domain is deployed into the AD DS subnet. The AD DS subnet is assigned the IP address range 10.0.0.0/24.

Azure NetApp Files can only use one AD DS site to determine which domain controllers will be used for authentication, LDAP queries, and Kerberos. In the sample scenario, two subnet objects are created and assigned to a site called `ANF` using the Active Directory Sites and Services utility. One subnet object is mapped to the AD DS subnet, 10.0.0.0/24, and the other subnet object is mapped to the ANF delegated subnet, 10.0.2.0/24.

In the Active Directory Sites and Services tool, verify that the AD DS domain controllers deployed into the AD DS subnet are assigned to the `ANF` site: 

:::image type="content" source="../media/azure-netapp-files/active-directory-servers.png" alt-text="Screenshot of the Active Directory Sites and Services window with a red box drawing attention to the ANF > Servers directory." lightbox="../media/azure-netapp-files/active-directory-servers.png":::

To create the subnet object that maps to the AD DS subnet in the Azure virtual network, right-click the **Subnets** container in the **Active Directory Sites and Services** utility and select **New Subnet...**.
 
In the **New Object - Subnet** dialog, the 10.0.0.0/24 IP address range for the AD DS Subnet is entered in the **Prefix** field. Select `ANF` as the site object for the subnet. Select **OK** to create the subnet object and assign it to the `ANF` site.

:::image type="content" source="../media/azure-netapp-files/new-object-subnet-menu.png" alt-text="Screenshot of the New Object – Subnet menu." lightbox="../media/azure-netapp-files/new-object-subnet-menu.png":::

To verify that the new subnet object is assigned to the correct site, right-click the 10.0.0.0/24 subnet object and select **Properties**. The **Site** field should show the `ANF` site object:

:::image type="content" source="../media/azure-netapp-files/properties-menu.png" alt-text="Screenshot of the properties menu with a red box surrounding the site field that reads 'ANF'." lightbox="../media/azure-netapp-files/properties-menu.png":::

To create the subnet object that maps to the Azure NetApp Files delegated subnet in the Azure virtual network, right-click the **Subnets** container in the **Active Directory Sites and Services** utility and select **New Subnet...**.

### Cross-region replication considerations

[Azure NetApp Files cross-region replication](cross-region-replication-introduction.md) enables you to replicate Azure NetApp Files volumes from one region to another region to support business continuance and disaster recovery (BC/DR) requirements.

Azure NetApp Files SMB, dual-protocol, and NFSv4.1 Kerberos volumes support cross-region replication. Replication of these volumes requires:

* A NetApp account created in both the source and destination regions.
* An Azure NetApp Files Active Directory connection in the NetApp account created in the source and destination regions.
* AD DS domain controllers are deployed and running in the destination region.
* Proper Azure NetApp Files network, DNS, and AD DS site design must be deployed in the destination region to enable good network communication of Azure NetApp Files with the AD DS domain controllers in the destination region.
* The Active Directory connection in the destination region must be configured to use the DNS and AD Site resources in the destination region.

## Next steps 
* [Create and manage Active Directory connections](create-active-directory-connections.md)
* [Modify Active Directory connections](modify-active-directory-connections.md)
* [Enable AD DS LDAP authentication for NFS volumes](configure-ldap-over-tls.md)
* [Create an SMB volume](azure-netapp-files-create-volumes-smb.md)
* [Create a dual-protocol volume](create-volumes-dual-protocol.md)
* [Errors for SMB and dual-protocol volumes](troubleshoot-volumes.md#errors-for-smb-and-dual-protocol-volumes)
* [Access SMB volumes from Microsoft Entra joined Windows virtual machines](access-smb-volume-from-windows-client.md)
