<properties
   pageTitle="Creating an Active Directory Domain Services (AD DS) resource forest in Azure | Microsoft Azure"
   description="How to create a trusted Active Directory domain in Azure."
   services="guidance,vpn-gateway,expressroute,load-balancer,virtual-network,active-directory"
   documentationCenter="na"
   authors="telmosampaio"
   manager="christb"
   editor=""
   tags="azure-resource-manager"/>

<tags
   ms.service="guidance"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="10/27/2016"
   ms.author="telmos"/>

# Creating an Active Directory Domain Services (AD DS) resource forest in Azure

[AZURE.INCLUDE [pnp-RA-branding](../../includes/guidance-pnp-header-include.md)]

This article describes how to create an Active Directory domain in Azure that is separate from, but trusted by, domains in your on-premises forest.

> [AZURE.NOTE] Azure has two different deployment models: [Resource Manager][resource-manager-overview] and classic. This reference architecture uses Resource Manager, which Microsoft recommends for new deployments.

Active Directory Domain Services (AD DS) is a distributed database service that stores identity information about users, devices, and other resources in a hierarchical structure. The top node the hierarchical structure is known as a forest. A forest contains domains, and domains contain other types of objects.

AD DS supports the creation of trust relationships between top level forest objects to provide interoperability between domains. That is, logons in one domain can be trusted in other domains to provide access to resources.

This reference architecture demonstrates how to create an AD DS forest in Azure with a one-way outgoing trust relationship with on-premises Azure. The forest in Azure contains a domain that does not exist on-premises, but due to the trust relationship, logons made against on-premises domains can be trusted for access to resources in the separate Azure domain.  

Typical use cases for this architecture include maintaining security separation for objects and identities held in the cloud, and migrating individual domains from on-premises to the cloud.

## Architecture diagram

The following diagram demonstrates the reference architecture discussed in this document. This document focuses on the scenario of extending an AD forest to Azure, and does not discuss the other elements in the figure. For more information on the other elements, see [Implementing a secure hybrid network architecture in Azure][implementing-a-secure-hybrid-network-architecture] and [Implementing a secure hybrid network architecture with Internet access in Azure][implementing-a-secure-hybrid-network-architecture-with-internet-access].  

> A Visio document that includes this architecture diagram is available for download at the [Microsoft download center][visio-download]. This diagram is on the "Identity - AADS (resource forest)" page.

[![0]][0]

- **On-premises network.** The on-premises network contains its own AD forest and domains.

- **AD Servers.** These are domain controllers implementing directory services (AD DS) running as VMs in the cloud. These servers host a forest containing one or more domains, separate from those located on-premises.

- **One-way trust relationship.** The example in the diagram shows a one-way trust from the domain in the cloud to the on-premises domain. This relationship enables on-premises users to access resources in the domain in the cloud, but not the other way around. It is possible to create a two-way trust if cloud users also require access to on-premises resources.

- **Active Directory subnet.** The AD DS servers are hosted in a separate subnet. NSG rules protect the AD DS servers and provide a firewall against traffic from unexpected sources.

- **Web tier subnet**, **Business tier subnet**, and **Data tier subnet**. These subnets host the servers and components that run applications in the cloud. For more information, see [Running VMs for an N-tier architecture on Azure][running-VMs-for-an-N-tier-architecture-on-Azure]. The resources and VMs in this subnet are contained within the cloud domain.

- **Azure Gateway**. The Azure gateway provides a connection between the on-premises network and the Azure VNet. This can be a [VPN connection][azure-vpn-gateway] or [Azure ExpressRoute][azure-expressroute]. For more information, see [Implementing a secure hybrid network architecture in Azure][implementing-a-secure-hybrid-network-architecture].

## Recommendations

This section provides a list of recommendations based on the essential components required to implement the basic architecture. These recommendations cover:

- ADDS settings, and

- Trust relationship configuration.

You might have additional or differing requirements from those described here. You can use the items in this section as a starting point for considering how to customize the architecture for your own system.

### ADDS recommendations

For specific recommendations on implementing Active Directory in the cloud, refer to the document [Extending Active Directory to Azure][extending-ad-to-azure]. The article [Guidelines for Deploying Windows Server Active Directory on Azure Virtual Machines][ad-azure-guidelines] contains additional detailed information.

### Trust recommendations

The on-premises domains are contained within a different forest from the domains in the cloud. To enable authentication of on-premises users in the cloud, the domains in the cloud must trust the logon domain in the on-premises forest. Similarly, if the cloud provides a logon domain for external users, it may be necessary for the on-premises forest to trust the cloud domain.

You can establish trusts at the forest level by [creating forest trusts][creating-forest-trusts], or at the domain level by [creating external trusts][creating-external-trusts]. A forest level trust creates a relationship between all domains in two forests. An external domain level trust only creates a relationship between two specified domains. You should only create external domain level trusts between domains in different forests.

Trusts can be unidirectional (one-way) or bidirectional (two-way):

- A one-way trust enables users in one domain or forest (known as the *incoming* domain or forest) to access the resources held in another (the *outgoing* domain or forest).

- A two-way trust enables users in either domain or forest to access resources held in the other.

The following table summarizes trust configurations for some simple scenarios:

| Scenario | On-premises trust | Cloud trust |
|----------|-------------------|-------------|
| On-premises users require access to resources in the cloud, but not vice versa | One-way, incoming | One-way, outgoing |
| Users in the cloud require access to resources located on-premises, but not vice versa | One-way, outgoing | One-way, incoming |
| Users in the cloud and on-premises both requires access to resources held in the cloud and on-premises | Two-way, incoming and outgoing | Two-way, incoming and outgoing |

## Scalability considerations

AD is automatically scalable for domain controllers that are part of the same domain. Requests are distributed across all controllers within a domain. You can add another domain controller, and it synchronizes automatically with the domain. Do not configure a separate load balancer to direct traffic to controllers within the domain. Ensure that all domain controllers have sufficient memory and storage resources to handle the domain database. Make all domain controller VMs the same size.

## Availability considerations

Implement at least two domain controllers for each domain. This enables automatic replication between servers. Create an availability set for the VMs acting as AD servers handling each domain. Ensure that there are at least two servers in the set.

Also, consider designating one or more servers in each domain as [standby operations masters][standby-operations-masters] in case connectivity to a server acting as an FSMO role fails.

## Manageability considerations

For information about management and monitoring considerations, see the equivalent sections in [Extending Active Directory to Azure][extending-ad-to-azure].

For additional information, see [Monitoring Active Directory][monitoring_ad]. You can install tools such as [Microsoft Systems Center][microsoft_systems_center] on a monitoring server in the management subnet to help perform these tasks.

## Security considerations

Forest level trusts are transitive. If you establish a forest level trust between an on-premises forest and a forest in the cloud, this trust is extended to other new domains created in either forest. If you use domains to provide separation for security purposes, consider creating trusts at the domain level only. Domain level trusts are non-transitive.

For AD-specific security considerations, see the *Security considerations* section in [Extending Active Directory to Azure][extending-ad-to-azure].

## Solution deployment


## Next steps

- Learn the best practices for [extending your on-premises ADDS domain to Azure][adds-extend-domain]

- Learn the best practices for [creating an ADFS infrastructure][adfs] in Azure.

<!-- links -->


[ad-azure-guidelines]: https://msdn.microsoft.com/library/azure/jj156090.aspx
[adds-extend-domain]: ./guidance-identity-adds-extend-domain.md
[adfs]: ./guidance-identity-adfs.md
[azure-expressroute]: https://azure.microsoft.com/documentation/articles/expressroute-introduction/
[azure-vpn-gateway]: https://azure.microsoft.com/documentation/articles/vpn-gateway-about-vpngateways/
[creating-external-trusts]: https://technet.microsoft.com/library/cc816837(v=ws.10).aspx
[creating-forest-trusts]: https://technet.microsoft.com/library/cc816810(v=ws.10).aspx
[extending-ad-to-azure]: ./guidance-identity-adds-extend-domain.md
[implementing-a-secure-hybrid-network-architecture]: ./guidance-iaas-ra-secure-vnet-hybrid.md
[implementing-a-secure-hybrid-network-architecture-with-internet-access]: ./guidance-iaas-ra-secure-vnet-dmz.md
[microsoft_systems_center]: https://www.microsoft.com/server-cloud/products/system-center-2016/
[monitoring_ad]: https://msdn.microsoft.com/library/bb727046.aspx
[resource-manager-overview]: ../azure-resource-manager/resource-group-overview.md
[running-VMs-for-an-N-tier-architecture-on-Azure]: ./guidance-compute-n-tier-vm.md
[standby-operations-masters]: https://technet.microsoft.com/library/cc794737(v=ws.10).aspx
[visio-download]: http://download.microsoft.com/download/1/5/6/1569703C-0A82-4A9C-8334-F13D0DF2F472/RAs.vsdx
[0]: ./media/guidance-identity-aad-resource-forest/figure1.png "Secure hybrid network architecture with separate AD domains"
