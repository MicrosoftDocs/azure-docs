---
title: Azure Service Manager retirement
description: Azure Service Manager retirement documentation for all classic compute, networking and storage resources
author: surbhijain
ms.topic: overview
ms.date: 03/24/2023
ms.author: surbhijain
ms.service: azure-asm

---

# Azure Service Manager retirement

Azure Service Manager (ASM) is the old control plane of Azure responsible for creating, managing, deleting VMs and performing other control plane operations, and has been in use since 2011. ASM is retiring in August 2024, and customers can now migrate to [Azure Resource Manager (ARM)](/azure/azure-resource-manager/management/overview). ARM provides a management layer that enables you to create, update, and delete resources in your Azure account. You can use management features like access control, locks, and tags to secure and organize your resources after deployment.

## Benefits of migrating to ARM 
Migrating from the classic resource model to ARM offers several benefits, including:  

- Manage your infrastructure through declarative templates rather than scripts. 

- Deploy, manage, and monitor all the resources for your solution as a group, rather than handling these resources individually. 

- Redeploy your solution throughout the development lifecycle and have confidence your resources are deployed in a consistent state. 

- Define the dependencies between resources so they're deployed in the correct order. 

- Apply access control to all services because Azure role-based access control (Azure RBAC) is natively integrated into the management platform. 

- Apply tags to resources to logically organize all the resources in your subscription. 

- Clarify your organization's billing by viewing costs for a group of resources sharing the same tag. 

There are many service-related benefits which can be found in the migration guides. 

## Services being retired 
To help with this transition, we are providing a range of resources and tools, including documentation and migration guides. We encourage you to begin planning your migration to ARM as soon as possible to ensure that you can continue to take advantage of the latest Azure features and capabilities. 

Below is a list of classic resources being retired, their retirement dates, and a link to migration to ARM guidance :

| Classic resource |  Retirement date | Migration documentation |
|---|---|---|
|[VM (classic)](https://azure.microsoft.com/updates/classicvmretirment) | Sep 23 | [Migrate VM (classic) to ARM](/azure/virtual-machines/classic-vm-deprecation?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|[Azure Active Directory Domain Services](/azure/active-directory-domain-services/migrate-from-classic-vnet?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) | Mar 23 | [Migrate Azure Active Directory Domain Services to ARM](/azure/active-directory-domain-services/migrate-from-classic-vnet?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|[Azure Batch Cloud Service Pools](https://azure.microsoft.com/updates/azure-batch-cloudserviceconfiguration-pools-will-be-retired-on-29-february-2024) | Feb 24 |[Migrate Azure Batch Cloud Service Pools to ARM](/azure/batch/batch-pool-cloud-service-to-virtual-machine-configuration?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|[Cloud Services (classic)](https://azure.microsoft.com/updates/cloud-services-retirement-announcement) | Aug 24 |[Migrate Cloud Services (classic) to ARM](/azure/cloud-services-extended-support/in-place-migration-overview?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|[App Service Environment v1/v2](https://azure.microsoft.com/updates/app-service-environment-v1-and-v2-retirement-announcement) | Aug 24 |[Migrate App Service Environment v1/v2 to ARM](/azure/app-service/environment/migrate?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |
|[API Management](/azure/api-management/breaking-changes/stv1-platform-retirement-august-2024?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) | Aug 24 |[Migrate API Management to ARM](/azure/api-management/compute-infrastructure?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#how-do-i-migrate-to-the-stv2-platform) 
|[Azure Redis Cache](/azure/azure-cache-for-redis/cache-faq?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#caches-with-a-dependency-on-cloud-services-(classic)) | Aug 24 |[Migrate Azure Redis Cache to ARM](/azure/azure-cache-for-redis/cache-faq?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#caches-with-a-dependency-on-cloud-services--classic) 
|[Classic Resource Providers](https://azure.microsoft.com/updates/azure-classic-resource-providers-will-be-retired-on-31-august-2024/) | Aug 24 |[Migrate Classic Resource Providers to ARM](/azure/azure-resource-manager/management/deployment-models?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |
|[Integration Services Environment](https://azure.microsoft.com/updates/integration-services-environment-will-be-retired-on-31-august-2024-transition-to-logic-apps-standard/) | Aug 24 |[Migrate Integration Services Environment to ARM](/azure/logic-apps/export-from-ise-to-standard-logic-app?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |
|[Microsoft HPC Pack](/powershell/high-performance-computing/burst-to-cloud-services-retirement-guide?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |Aug 24| [Migrate Microsoft HPC Pack to ARM](/powershell/high-performance-computing/burst-to-cloud-services-retirement-guide)|
|[Virtual WAN](/azure/virtual-wan/virtual-wan-faq#update-router?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) | Aug 24 | [Migrate Virtual WAN to ARM](/azure/virtual-wan/virtual-wan-faq?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#update-router) |
|[Classic Storage](https://azure.microsoft.com/updates/classic-azure-storage-accounts-will-be-retired-on-31-august-2024/) | Aug 24 | [Migrate Classic Storage to ARM](/azure/storage/common/classic-account-migration-overview?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|[Classic Virtual Network](https://azure.microsoft.com/updates/five-azure-classic-networking-services-will-be-retired-on-31-august-2024/) | Aug 24 | [Migrate Classic Virtual Network to ARM]( /azure/virtual-network/migrate-classic-vnet-powershell?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|[Classic Application Gateway](https://azure.microsoft.com/updates/five-azure-classic-networking-services-will-be-retired-on-31-august-2024/) | Aug 24 | [Migrate Classic Application Gateway to ARM](/azure/application-gateway/classic-to-resource-manager?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |
|[Classic Reserved IP addresses](https://azure.microsoft.com/updates/five-azure-classic-networking-services-will-be-retired-on-31-august-2024/) |Aug 24| [Migrate Classic Reserved IP addresses to ARM](/azure/virtual-network/ip-services/public-ip-upgrade-classic?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|[Classic ExpressRoute Gateway](https://azure.microsoft.com/updates/five-azure-classic-networking-services-will-be-retired-on-31-august-2024/) |Aug 24 | [Migrate Classic ExpressRoute Gateway to ARM](/azure/expressroute/expressroute-migration-classic-resource-manager?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|[Classic VPN gateway](https://azure.microsoft.com/updates/five-azure-classic-networking-services-will-be-retired-on-31-august-2024/) | Aug 24 | [Migrate Classic VPN gateway to ARM]( /azure/vpn-gateway/vpn-gateway-classic-resource-manager-migration?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|

## Support
We understand that you may have questions or concerns about this change, and we are here to help. If you have any questions or require further information, please do not hesitate to reach out to our [customer support team](https://azure.microsoft.com/support)


