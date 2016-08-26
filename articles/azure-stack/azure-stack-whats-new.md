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
	ms.date="08/26/2016"
	ms.author="helaw"/>

# What's new in Azure Stack Technical Preview 2

This document covers key new features and capabilities in this release of Azure Stack as part of Technical Preview 2.   

## Cloud Tenant
Azure Stack TP2 introduces new tenant capabilities and services for consumers of Azure Stack services, including:
 - [Key Vault](azure-stack-intro-key-vault.md)
   - Create and manage [Key Vaults](azure-stack-create-key-vault.md)
   - Store and deploy secrets and keys
 - Updated App Service Resource Provider and administration capabilities for new Platform-as-a-Service services:
   - Web Apps
   - Mobile Apps
   - API Apps
 - New Infrastructure-as-a-Service capabilities, including:
   - Deallocation and capture of virtual machines
   - Redeploy virtual machine extensions
   - Resize virtual machine Disks
   - [iDNS](azure-stack-what-is-idns.md) for internal network name registration and DNS resolution
   - [Virtual Network Gateways](azure-stack-virtual-network-gateways.md) provide new VPN connectivity options to other resources
   - Create new network resources from the marketplace
 - Storage
   - [Azure Queues](https://msdn.microsoft.com/library/dd179353.aspx) 
   - [Storage analytics](https://msdn.microsoft.com/en-us/library/azure/hh343270.aspx) 
   - [Append Blob](https://msdn.microsoft.com/en-us/library/azure/mt427365.aspx) 
   - Validation with common tools and SDKs, such as Azure CLI, PowerShell, .NET, Python and Java SDK 
   - Premium storage account API support
   - [Account Shared Access Signature](https://msdn.microsoft.com/en-us/library/azure/mt584140.aspx)
   - ACS virtualized cloud services can scale out behind software load balancer
   - Strong security via [Group Managed Service Account](https://technet.microsoft.com/en-us/library/hh831477(v=ws.11).aspx#BKMK_group_managed_sa) identity for inter-service authentication and authorization
  - Export ARM templates from portal for redeployment 

## Cloud Service Administrator
Azure Stack TP2 brings new concepts and capabilities for service providers and enterprises offering Azure Stack services to tenants, including:
 - Billing and usage APIs allow providers to integrate with billing and consumption services
 - Ability to capture plan and offer details in ARM templates for redeployment
 - Azure Stack regions preview support
   - View a list of all Azure Stack regions
   - Navigate to storage, computer, and network providers per region and view resource consumption
 - Delegated Providers enable downstream resellers to offer Azure Stack services to consumers
 - On-demand reclamation of unused tenant resource capacity
- New monitoring capabilities
  - View details of monitoring alerts by region
  - Health Resource Provider enables retrieval of monitoring data via REST

- TiP tests renamed to System Health Tests


## Next steps
- [Understand Azure Stack POC Architecture](azure-stack-architecture.md)      
- [Understand deployment prerequisites](azure-stack-deploy.md)
- [Deploy Azure Stack](azure-stack-run-powershell-script.md)
 
    
  

  


