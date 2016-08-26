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
This document covers key new features and capabilities in this preview release of Azure Stack.

## Cloud Tenant
Azure Stack TP2 introduces new tenant capabilities and services for consumers of Azure Stack services, including:
 - [Key Vault](azure-stack-intro-key-vault.md) allows secure storage and handling of cryptographic keys and other secrets such as passwords with built-in auditing and monitoring of key use.
 - Updated App Service Resource Provider and administration capabilities for new Platform-as-a-Service services:
   - New resource provider features such scale-up and scale-out, source control integration, and deployment slots. 
   - API App Service allows you to bring your existing APIs and apply enterprise security, access control, and scale for consumption in other services.
   - Web App updates enable new features such as WebJobs and PHP 7 support.
   - Mobile Apps service provides API and table storage services for cross-platform mobile apps.  
 - New Infrastructure-as-a-Service capabilities, including:
   - Deallocate and capture virtual machines
   - Redeploy virtual machine extensions
   - Resize virtual machine disks
   - [iDNS](azure-stack-what-is-idns.md) for internal network name registration and DNS resolution
   - [Virtual Network Gateways](azure-stack-virtual-network-gateways.md) provide new VPN connectivity options to other resources
   - Create network resources from the marketplace
 - Addition of new storage services and features, including: 
   - [Azure Queues](https://msdn.microsoft.com/library/dd179353.aspx) 
   - [Storage analytics](https://msdn.microsoft.com/en-us/library/azure/hh343270.aspx) 
   - [Append Blob](https://msdn.microsoft.com/en-us/library/azure/mt427365.aspx) 
   - Validation with common tools and SDKs, such as Azure CLI, PowerShell, .NET, Python, and Java SDK 
   - Premium storage account API support
   - Support for [Storage Account Shared Access Signature](https://msdn.microsoft.com/en-us/library/azure/mt584140.aspx)
   - ACS virtualized cloud services can scale out behind software load balancer
   - Strong security via [Group Managed Service Account](https://technet.microsoft.com/en-us/library/hh831477(v=ws.11).aspx#BKMK_group_managed_sa) identity for inter-service authentication and authorization
  - You can now export ARM templates from portal

## Cloud Service Administrator
Azure Stack TP2 brings new concepts and capabilities for service providers and enterprises offering Azure Stack services to tenants, including:
 - Billing and usage APIs enable integration with your billing and consumption systems
 - Capture plan and offer details in ARM templates for redeployment to your tenants
 - Azure Stack regions preview support
   - View a list of all Azure Stack regions
   - Navigate to storage, computer, and network providers per region and view resource consumption
 - Delegated Providers enable downstream resellers to offer your Azure Stack services to their tenants
 - On-demand reclamation of unused tenant resource capacity
 - New monitoring capabilities
  - View details of monitoring alerts by region
  - Health Resource Provider enables retrieval of monitoring data via REST
 - TiP tests have been renamed to System Health Tests to better reflect purpose


## Next steps
- [Understand Azure Stack POC Architecture](azure-stack-architecture.md)      
- [Understand deployment prerequisites](azure-stack-deploy.md)
- [Deploy Azure Stack](azure-stack-run-powershell-script.md)
 
    
  

  


