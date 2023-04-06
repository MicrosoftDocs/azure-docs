---
title: Azure Service Manager Retirement
description: Azure Service Manager Retirement documentation for all classic compute, networking and storage resources
author: surbhijain
ms.topic: overview
ms.date: 03/24/2023
ms.author: surbhijain
ms.service: reliability

---

# Azure Service Manager Retirement

Azure Service Manager (ASM) is the old control plane of Azure responsible for creating, managing, deleting VMs and performing other control plane operations, and has been in use since 2011. However, ASM is retiring in August 2024, and customers can now migrate to [Azure Resource Manager (ARM)](/azure/azure-resource-manager/management/overview). ARM provides a management layer that enables you to create, update, and delete resources in your Azure account. You can use management features like access control, locks, and tags to secure and organize your resources after deployment

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
Here is a list of classic resources being retired and their retirement dates: 

| Classic Resource |  Retirement Date | 
|---|---|
|[VM (classic)](https://azure.microsoft.com/updates/classicvmretirment) | Sep 23 |
|[Azure Batch Cloud Service Pools](https://azure.microsoft.com/updates/azure-batch-cloudserviceconfiguration-pools-will-be-retired-on-29-february-2024) | Feb 24 |
|[Cloud Services (classic)](https://azure.microsoft.com/updates/cloud-services-retirement-announcement) | Aug 24 |
|[App Service Environment v1/v2](https://azure.microsoft.com/updates/app-service-environment-v1-and-v2-retirement-announcement) | Aug 24 |
|[Classic Resource Providers](https://azure.microsoft.com/updates/azure-classic-resource-providers-will-be-retired-on-31-august-2024/) | Aug 24 |
|[Integration Services Environment](https://azure.microsoft.com/updates/integration-services-environment-will-be-retired-on-31-august-2024-transition-to-logic-apps-standard/) | Aug 24 |
|[Classic Storage](https://azure.microsoft.com/updates/classic-azure-storage-accounts-will-be-retired-on-31-august-2024/) | Aug 24 |
|[Classic Virtual Network](https://azure.microsoft.com/updates/five-azure-classic-networking-services-will-be-retired-on-31-august-2024/) | Aug 24 |
|[Classic Application Gateway](https://azure.microsoft.com/updates/five-azure-classic-networking-services-will-be-retired-on-31-august-2024/) | Aug 24 |
|[Classic Reserved IP addresses](https://azure.microsoft.com/updates/five-azure-classic-networking-services-will-be-retired-on-31-august-2024/) |Aug 24| 
|[Classic ExpressRoute Gateway](https://azure.microsoft.com/updates/five-azure-classic-networking-services-will-be-retired-on-31-august-2024/) |Aug 24 |
|[Classic VPN gateway](https://azure.microsoft.com/updates/five-azure-classic-networking-services-will-be-retired-on-31-august-2024/) | Aug 24 |
|[API Management](/azure/api-management/breaking-changes/stv1-platform-retirement-august-2024) | Aug 24 |
|[Azure Redis cache](/azure/azure-cache-for-redis/cache-faq#caches-with-a-dependency-on-cloud-services-(classic)) | Aug 24 |
|[Virtual WAN](/azure/virtual-wan/virtual-wan-faq#update-router) | Aug 24 |
|[Microsoft HPC Pack](/powershell/high-performance-computing/burst-to-cloud-services-retirement-guide) |Aug 24|
|[Azure Active Directory Domain Services](/azure/active-directory-domain-services/migrate-from-classic-vnet) | Mar 23 |

## Support
We understand that you may have questions or concerns about this change, and we are here to help. If you have any questions or require further information, please do not hesitate to reach out to our [customer support team](https://azure.microsoft.com/support)


