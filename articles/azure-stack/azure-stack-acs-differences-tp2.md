
<properties
	pageTitle="Azure-consistent Storage: Differences and Considerations | Microsoft Azure"
	description="Understand the differences against Azure Storage and other ACS deployment considerations."
	services="azure-stack"
	documentationCenter=""
	authors="MChadalapaka"
	manager="siroy"
	editor=""/>

<tags
	ms.service="azure-stack"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="08/17/2016"
	ms.author="mchad"/>

# Azure-consistent Storage: Differences and Considerations

## Summary

Azure-consistent Storage (ACS) is the set of storage cloud services in
Microsoft Azure Stack. ACS provides blob, table, queue, and account
management functionality with Azure-consistent semantics. This article
summarizes the known ACS differences against Azure Storage and other
considerations when deploying the currently publicly available preview
version of Microsoft Azure Stack.

<span id="Concepts" class="anchor"><span id="_Toc386544169" class="anchor"><span id="_Toc389466742" class="anchor"><span id="_Ref428966996" class="anchor"><span id="_Toc433223853" class="anchor"></span></span></span></span></span>
## Known Differences

This Technical Preview version of Microsoft Azure Stack ACS is known to
be not at 100% feature parity with Azure Storage for the API
versions supported. Known feature shortcomings include the following:

-   Certain Azure storage account types are not yet available, for example,
    Standard\_RAGRS, and Standard\_GRS.

-   Azure Files functionality is not yet available

-   Get Page Ranges API does not support retrieving the pages that
    differ between snapshots of page blobs

-   Get Page Ranges API returns pages in 4 KB granularity

-   Partition Key and Row Key in ACS Table implementation is each
    limited to 400 characters, that is, 800 bytes in size

-   Blob name in ACS Blob service implementation is limited to 880
    characters, that is, 1760 bytes in size

-   ACS implementation of tenant storage usage data reporting provides
    identical storage usage meters with the same semantics and units as
    in Azure. Currently however, Storage Transactions usage meter
    does not include IaaS transactions and Data Transfer usage meter
    does not differentiate the bandwidth usage by network traffic
    internal vs external to an Azure Stack region.

-   Certain differences in storage manageability scope of functionality
    exist, for example, changing the account type is not supported; custom
    domains are not supported; only API-level consistency is offered for
    Premium\_LRS storage account type.

## Deployment Considerations

-   **Test only.** Do not deploy ACS in production environments
    using the current Microsoft Azure Stack Technical Preview release.
    This version is meant only for evaluation purposes in a test
    lab environment.

-   **Performance**. The Microsoft Azure Stack Technical Preview version
    of ACS is not fully performance-optimized.

-   **Scalability.** The Microsoft Azure Stack Technical Preview version
    of ACS is not optimized for scalability.

## Version Support Considerations

The following versions are supported with this preview release of ACS:

> Azure Storage Client Library: [Microsoft Azure Storage 6.x .NET
> SDK](http://www.nuget.org/packages/WindowsAzure.Storage/6.2.0)
>
> Azure Storage data services: [2015-04-05 REST API
> version](https://msdn.microsoft.com/en-us/library/azure/mt705637.aspx)
>
> Azure Storage management services:
> [2015-05-01-preview](https://msdn.microsoft.com/en-us/library/azure/mt163683.aspx)
> and
> [2015-06-15](https://microsoft.sharepoint.com/teams/AzureStack/Azure%20Stack%20Shared/Customer/msdn.microsoft.com/en-us/library/azure/mt163683.aspx)

## Next Steps

-   [Introduction to Azure-consistent Storage](azure-stack-architecture.md)
