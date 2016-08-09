<properties
   pageTitle="Implementing Azure Active Directory | Microsoft Azure"
   description="How to implement a secure hybrid network architecture Azure Active Directory."
   services="guidance,virtual-network,active-directory"
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
   ms.date="08/31/2016"
   ms.author="telmos"/>

# Implementing Azure Active Directory

[AZURE.INCLUDE [pnp-RA-branding](../../includes/guidance-pnp-header-include.md)]

This article describes best practices for 

> [AZURE.NOTE] Azure has two different deployment models: [Resource Manager][resource-manager-overview] and classic. This reference architecture uses Resource Manager, which Microsoft recommends for new deployments.

You use AD DS to authenticate identities. These identities can belong to users, computers, applications, or other resources that form part of a security domain. You can host AD DS on-premises, but in a hybrid scenario where elements of an application are located in Azure it can be more efficient to replicate this functionality and the AD repository to the cloud. This approach can help  reduce the latency caused by sending authentication and local authorization requests from the cloud back to AD DS running on-premises. 

There are two ways to host your directory services in Azure:

1. You can use [Azure Active Directory (AAD)][azure-active-directory] to create a new AD domain in the cloud and link it to an on-premises AD domain. Then setup [Azure AD Connect][azure-ad-connect] on-promises to replicate identities held in the the on-premises repository to the cloud. Note that the directory in the cloud is **not** an extension of the on-premises system, rather it's a copy that contains the same identities. Changes made to these identities on-premises will be copied to the cloud, but changes made in the cloud **will not** be replicated back to the on-premises domain. For example, password resets must be performed on-premises and use Azure AD Connect to copy the change to the cloud. Also, note that the same instance of AAD can be linked to more than one instance of AD DS; AAD will contain the identities of each AD repository to which it is linked.

	AAD is useful for situations where the on-premises network and Azure virtual network hosting the cloud resources are not directly linked by using a VPN tunnel or ExpressRoute circuit. Although this solution is simple, it might not be suitable for systems where components could migrate across the on-premises/cloud boundary as this could require reconfiguration of AAD. Also, AAD only handles user authentication rather than computer authentication. Some applications and services, such as SQL Server, may require computer authentication in which case this solution is not appropriate.

2. You can deploy a VM running AD DS as a domain controller in Azure, extending your existing AD infrastructure from your on-premises datacenter. This approach is more common for scenarios where the on-premises network and Azure virtual network are connected by a VPN and/or ExpressRoute connection. This solution also supports bi-directional replication enabling you make changes in the cloud and on-premises, wherever it is most appropriate. Depending on your security requirements, the AD installation in the cloud can be:
	- part of the same domain as that held on-premises
	- a new domain within a shared forest
	- a separate forest

This architecture focuses on solution 1.

Typical use cases for this architecture include:



## Architecture diagram

The following diagram highlights the important components in this architecture (*click to zoom in*). For more information about the grayed-out elements, read [Implementing a secure hybrid network architecture in Azure][implementing-a-secure-hybrid-network-architecture] and [Implementing a secure hybrid network architecture with Internet access in Azure][implementing-a-secure-hybrid-network-architecture-with-internet-access]:



## Recommendations

This section summarizes recommendations for implementing AD DS in Azure, covering:

- VM recommendations.

- Networking recommendations.

- Security recommendations. 

>[AZURE.NOTE] The document [Guidelines for Deploying Windows Server Active Directory on Azure Virtual Machines][ad-azure-guidelines] contains more detailed information on many of these points.

### VM recommendations


### Networking recommendations


### Security recommendations


## Availability considerations


## Security considerations


## Scalability considerations


## Management considerations


## Monitoring considerations

## Solution components


## Deployment


## Next steps

<!-- links -->