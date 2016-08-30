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
In this article, we'll cover the new features of Technical Preview 2. This release includes a number of new features for both Cloud Tenants and Cloud Administrators.  Cloud tenants will see new security, networking, storage, and application platform capabilities.  Cloud Administrators have access to billing and usage information, monitoring and health data, and the ability to preview Azure Stack regions.

## Cloud Tenant
### Services
  
Keep your secrets safe with [Key Vault](azure-stack-intro-key-vault.md), which provides secure management of your key and password assets with built-in auditing and monitoring.

Build your apps on the latest platform with an updated App Service Resource Provider:
   - Now you can enable scale-up and scale-out, source control integration, and deployment slots.
   - API App Service allows you to bring your existing APIs and apply enterprise security, access control, and scale.
   - Mobile Apps service provides API and table storage services - allowing you to build the cross-platform mobile apps.
   - Web App updates enable new features such as WebJobs and PHP 7 support.

### IaaS
Get connected with new network features:   
   - [iDNS](azure-stack-what-is-idns.md) provides internal network name registration and DNS resolution without additional DNS infrastructure.
   - [Virtual Network Gateways](azure-stack-virtual-network-gateways.md) provide new VPN connectivity options to other resources, including Azure and other physical locations.
   - User Defined Routes allow you to route network traffic through firewall, security, or other appliances and services.
   - Now you can create network resources from the marketplace.   

New capabilities for storage and control access: 
   - [Azure Queues](https://msdn.microsoft.com/library/dd179353.aspx) enable reliable and persistent service messaging
   - [Storage analytics](https://msdn.microsoft.com/en-us/library/azure/hh343270.aspx) capture storage performance data. You can use this data to trace requests, analyze usage trends, and diagnose issues with your storage account.
   - Storage service validation with common tools and SDKs, such as Azure CLI, PowerShell, .NET, Python, and Java SDK 
   - [Storage Account Shared Access Signature](https://msdn.microsoft.com/en-us/library/azure/mt584140.aspx) enable granular delegation of access to your storage services without having to share your full account key.  
   - Storage services now use [Group Managed Service Accounts](https://technet.microsoft.com/en-us/library/hh831477(v=ws.11).aspx#BKMK_group_managed_sa) for strong security with low management overhead

You can now deallocate and capture virtual machines, redeploy virtual machine extensions, and resize virtual machine disks.  Additionally, you can now export Resource Manager templates from portal, allowing you to save time and ensure deployment consistency.

## Cloud Administrator

Billing and consumption APIs expose data on how your services are consumed.  These new metrics and APIs allow for integration either with a customer billing system, or chargeback/showback systems for enterprise IT.  Additionally, you can capture plans and offers in Resource Manager templates.
 
Azure Stack Regions are new to this release, and represent a logical unit of scale and management within Azure Stack. In this release, you can view resource consumption of fabric controller resources like network, storage, and compute by region.

Delegated Providers enable downstream resellers to offer your Azure Stack services to their tenants.

This release enables you to provide the most efficient allocation of resources, with on-demand reclamation of unused tenant capacity now available.

New monitoring capabilities available via the portal and APIs allow you to proactively see and manage alerts on your environment.  

System Health Tests automatically test your fabric to ensure services are working as expected.  

## Next steps
- [Understand Azure Stack POC Architecture](azure-stack-architecture.md)      
- [Understand deployment prerequisites](azure-stack-deploy.md)
- [Deploy Azure Stack](azure-stack-run-powershell-script.md)
 
    
  

  


