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
	ms.date="09/26/2016"
	ms.author="helaw"/>

# What's new in Azure Stack Technical Preview 2
This release provides new features for both tenants and administrators.

## App Services
Build your apps on the latest platform with an updated App Service Resource Provider:
   - Enable scale-up and scale-out, source control integration, and deployment slots.
   - API App Service allows you to bring your APIs and apply enterprise security, access control, and scale.
   - Mobile Apps service provides scalable API services — allowing you to build the cross-platform mobile apps.
   - Web App updates enable new features like WebJobs and PHP 7 support.

## Key Vault 
[Key Vault](azure-stack-intro-key-vault.md) provides secure management of your keys and passwords with auditing and monitoring.

## Network   
   - [iDNS](azure-stack-what-is-idns.md) provides internal network name registration and DNS resolution without additional DNS infrastructure.
   - [Virtual Network Gateways](azure-stack-virtual-network-gateways.md) provide VPN connectivity options to Azure or other on-premises resources.
   - User Defined Routes allow you to route network traffic through firewall, security, or other appliances and services.
   - You can create network resources from the marketplace.   

## Storage
   - [Azure Queues](https://msdn.microsoft.com/library/dd179353.aspx) enable reliable and persistent service messaging.
   - [Storage analytics](https://msdn.microsoft.com/en-us/library/azure/hh343270.aspx) capture storage performance data. You can use this data to trace requests, analyze usage trends, and diagnose issues with your storage account.
   - Storage service support for common tools and SDKs, such as Azure CLI, PowerShell, .NET, Python, and Java SDK 
   - [Storage Account Shared Access Signature](https://msdn.microsoft.com/en-us/library/azure/mt584140.aspx) enable granular delegation of access to your storage services without having to share your full account key.  
   - Storage services now use [Group Managed Service Accounts](https://technet.microsoft.com/en-us/library/hh831477(v=ws.11).aspx#BKMK_group_managed_sa) for strong security with low management overhead

## VMs and Resource Manager
 - You can deallocate and capture virtual machines, redeploy virtual machine extensions, and resize virtual machine disks.  
 - Export Resource Manager templates from portal.

## Billing and Usage
 - Billing and consumption APIs expose data on how your services are consumed.  
 - You can capture plans and offers in Resource Manager templates.
 - Delegated Providers enable resellers to offer your Azure Stack services to their customers.
 - Reclaim unused tenant resources on-demand.

## Monitoring and Health
 - Azure Stack Regions represent a logical unit of scale and management within Azure Stack. In this preview, you can view resource consumption of network, storage, and compute resources by region.
 - New monitoring capabilities available in the portal and APIs allow you to proactively view and manage alerts on your environment.  
 - System Health Tests automatically test your fabric to ensure services are working as expected.  

## Next steps
- [Understand Azure Stack POC Architecture](azure-stack-architecture.md)      
- [Understand deployment prerequisites](azure-stack-deploy.md)
- [Deploy Azure Stack](azure-stack-run-powershell-script.md)
 
    
  

  


