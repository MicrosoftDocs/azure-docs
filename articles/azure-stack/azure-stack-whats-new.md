<properties
	pageTitle="What's new in Azure Stack | Microsoft Azure"
	description="What's new in Azure Stack"
	services="azure-stack"
	documentationCenter=""
	authors="HeathL17"
	manager="byronr"
	editor=""/>

<tags
	ms.service="azure-stack"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/10/2016"
	ms.author="helaw"/>

# What's new in Azure Stack Technical Preview 2


This document covers new features and capabilities in each release of Azure Stack.

## Workloads
 - Key Vault
   - Create and manage Key Vaults
   - Store and deploy secrets and keys
 - Preview support for workloads:
   - Docker
   - Mesos
   - SQL
 - Updated App Service Resource Provider
 
## Administrative and Portal
 - Billing and Usage APIs 
 - Ability to capture plan and offer details in ARM templates for redeployment
 - Export ARM Templates from GUI
 -  Delegated Providers enable resale of Azure Stack services by resellers
 - Introduces Azure Stack regions with the ability to:
   - view a list of all Azure Stack regions
   - view alerts by regions
   - navigate to storage, computer, and network providers per regions
   - view updates available in specific regions
- New monitoring capabilities
  - View details on Azure Stack alerts by regions
  - Health Resource Provider enables retrieval of monitoring data via REST

## Networking
 - iDNS allows for name resolution within virtual networks
 - VPN Site-To-Site gateways
 - Provider now canview the state of networking resources via the portal, including virtual networks, load balancers, and IP allocation and consumption information
 - Providers can implement quotas within the Network Resource Provider

## Storage
Azure-consistent Storage (ACS) provides storage blob, table, queue and account management. Further, ACS also offers an administration service to facilitate service provider administration of Azure-consistent Storage services. 
- Broadening Azure consistency against 2015-04-05 version of Storage *data* path API 
  - [Azure Queues](https://msdn.microsoft.com/library/dd179353.aspx) 
  - [Storage analytics](https://msdn.microsoft.com/en-us/library/azure/hh343270.aspx) 
  - [Append Blob](https://msdn.microsoft.com/en-us/library/azure/mt427365.aspx) 
  - Validation with common tools and SDKs 
- Broadening Azure consistency against 2015-06-15 version of Storage *management* path API 
  - Premium storage account API support
  - [Account SAS](https://msdn.microsoft.com/en-us/library/azure/mt584140.aspx) 
- Delivering new cloud administrator functionality and experiences 
  - Reclamation of unused tenant capacity on-demand  
  - Ability to configure undelete account retention period 
  - Storage Offer and Plan definition now based on new quota functionality
- Functional improvements to improve resiliency, performance and security 
  - ACS virtualized cloud services can scale out behind software load balancer 
  - Strong security via [Group Managed Service Account](https://technet.microsoft.com/en-us/library/hh831477(v=ws.11).aspx#BKMK_group_managed_sa) identity for inter-service authentication and authorization  
  

  


