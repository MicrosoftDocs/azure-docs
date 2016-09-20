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

## Key Vault
- [Azure Key Vault](azure-stack-intro-key-vault.md) provides secure management of your keys and passwords for cloud apps.
- You can audit and monitor key usage by apps and VMs.

## Network   
   - [Azure-provided DNS](azure-stack-what-is-idns.md) provides internal network name registration and Domain Name System (DNS) resolution without additional DNS infrastructure.
   - [Virtual network gateways](azure-stack-virtual-network-gateways.md) provide VPN connectivity options to Azure or on-premises resources.
   - User-defined routes can route network traffic through firewalls, security, other appliances, and other services.
   - You can create network resources from the Microsoft Azure Marketplace.   

## Storage
   - [Azure Queue](https://msdn.microsoft.com/library/dd179353.aspx) storage enables reliable and persistent service messaging.
   - [Azure Storage Analytics](https://msdn.microsoft.com/library/azure/hh343270.aspx) captures storage performance data. You can use this data to trace requests, analyze usage trends, and diagnose issues with your storage account.
   - Azure Storage supports common tools and SDKs, such as the Azure command-line interface (CLI), PowerShell, .NET, Python, and Java SDK.
   - [Azure storage account shared access signature](https://msdn.microsoft.com/library/azure/mt584140.aspx) enables granular delegation of access to Storage without having to share your full account key.  
   - Storage now uses [Group Managed Service Accounts](https://technet.microsoft.com/library/hh831477(v=ws.11)).aspx#BKMK_group_managed_sa) for strong security with low management overhead.

## VMs and Resource Manager
 - You can deallocate and capture virtual machines, redeploy virtual machine extensions, and resize virtual machine disks.  
 - You can export Azure Resource Manager templates from the Azure portal.

## Billing and usage
 - Billing and consumption APIs expose data about how your services are consumed.  
 - You can capture plans and offers in Resource Manager templates.
 - Delegated providers enable resellers to offer Azure Stack to their customers.
 - You can reclaim unused tenant resources on demand.

## Monitoring and health
 - Azure Stack Regions are a logical unit of scale and management within Azure Stack. In this preview, you can view consumption of network resources, storage resources, and compute resources by region.
 - New monitoring capabilities available in the portal and APIs allow you to proactively view and manage alerts on your environment.  
 - System health tests automatically test your fabric to ensure that services are working as expected.  

## Next steps
- [Understand Azure Stack POC Architecture](azure-stack-architecture.md)      
- [Understand deployment prerequisites](azure-stack-deploy.md)
- [Deploy Azure Stack](azure-stack-run-powershell-script.md)

  
