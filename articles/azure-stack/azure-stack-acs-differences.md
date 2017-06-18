---
title: 'Azure-consistent storage: differences and considerations'
description: Understand the differences from Azure Storage and other Azure-consistent storage deployment considerations.
services: azure-stack
documentationcenter: ''
author: MChadalapaka
manager: siroy
editor: ''

ms.assetid:
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 09/26/2016
ms.author: mchad

---
# Azure-consistent storage: differences and considerations
Azure-consistent storage is the set of storage cloud services in
Microsoft Azure Stack. Azure-consistent storage provides blob, table, queue, and account
management functionality with Azure-consistent semantics. This article
summarizes the known Azure-consistent storage differences with Azure Storage. It also summarizes other
considerations to keep in mind when you deploy the currently publicly available preview
version of Microsoft Azure Stack.

<span id="Concepts" class="anchor"><span id="_Toc386544169" class="anchor"><span id="_Toc389466742" class="anchor"><span id="_Ref428966996" class="anchor"><span id="_Toc433223853" class="anchor"></span></span></span></span></span>

## Known differences
This Technical Preview version of Azure-consistent storage
does not have 100% feature parity with Azure Storage for the API
versions that are supported. Known feature differences include the following:

* Certain storage account types are not yet available, for example,
  Standard\_RAGRS and Standard\_GRS.
* Premium\_LRS storage accounts can be provisioned. However, there are currently no performance limits or guarantees.
* Azure Files functionality is not yet available.
* The Get Page Ranges API does not support the retrieval of pages that differ between snapshots of page blobs.
* The Get Page Ranges API returns pages that have 4 KB of granularity.
* Partition Key and Row Key in the Azure-consistent storage Table implementation are each limited to 400 characters (that is, 800 bytes) in size.
* Blob names in the Azure-consistent storage Blob service implementation are limited to 880 characters (that is, 1760 bytes) in size.
* The Azure-consistent storage implementation of tenant storage usage data reporting provides storage usage meters that are identical to those in Azure, with the same semantics and units. Currently, however, the Storage Transactions usage meter does not include IaaS transactions, and the Data Transfer usage meter does not differentiate the bandwidth usage by internal or external network traffic to an Azure Stack region.
* Certain differences exist in the scope of functionality for storage manageability. For example, you can't change the account type or have custom domains. In addition, only API-level consistency is offered for the Premium\_LRS storage account type.

## Deployment considerations
* **Test only.** Do not deploy Azure-consistent storage in production environments that use the current Microsoft Azure Stack Technical Preview release. This version is meant only for evaluation purposes in a test lab environment.
* **Performance**. The Microsoft Azure Stack Technical Preview version
  of Azure-consistent storage is not fully performance-optimized.
* **Scalability.** The Microsoft Azure Stack Technical Preview version of Azure-consistent storage is not optimized for scalability.

## Version support considerations
The following versions are supported with this preview release of Azure-consistent storage:

> Azure Storage Client Library: [Microsoft Azure Storage 6.x .NET
> SDK](http://www.nuget.org/packages/WindowsAzure.Storage/6.2.0)
> 
> Azure Storage data services: [2015-04-05 REST API
> version](https://msdn.microsoft.com/library/azure/mt705637.aspx)
> 
> Azure Storage management services:
> [2015-05-01-preview](https://msdn.microsoft.com/library/azure/mt163683.aspx)
> [2015-06-15](https://msdn.microsoft.com/library/azure/mt163683.aspx)
> 
> ## Next steps
> 

* [Introduction to Azure-consistent storage](azure-stack-storage-overview.md)

