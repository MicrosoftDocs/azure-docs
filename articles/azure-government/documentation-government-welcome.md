---
title: Azure Government Overview
description: Overview of Azure Government capabilities
ms.service: azure-government
ms.topic: overview
ms.workload: azure-government
ms.custom: references_regions
ms.author: eliotgra
author: EliotSeattle
recommendations: false
ms.date: 03/07/2022
---

# What is Azure Government?

US government agencies or their partners interested in cloud services that meet government security and compliance requirements, can be confident that [Microsoft Azure Government](https://azure.microsoft.com/global-infrastructure/government/) provides world-class security and compliance. Azure Government delivers a dedicated cloud enabling government agencies and their partners to transform mission-critical workloads to the cloud. Azure Government services can accommodate data that is subject to various [US government regulations and requirements](./documentation-government-plan-compliance.md).

To provide you with the highest level of security and compliance, Azure Government uses physically isolated datacenters and networks located in the US only. Compared to Azure global, Azure Government provides an extra layer of protection to customers through contractual commitments regarding storage of customer data in the US and limiting potential access to systems processing customer data to [screened US persons](./documentation-government-plan-security.md#screening).

Azure Government customers (US federal, state, and local government or their partners) are subject to validation of eligibility. If there's a question about eligibility for Azure Government, you should consult your account team. To sign up for trial, request your [trial subscription](https://azure.microsoft.com/global-infrastructure/government/request/?ReqType=Trial).

The following video provides a good introduction to Azure Government:

</br>

> [!VIDEO https://learn.microsoft.com/Shows/Azure-Friday/Enable-government-missions-in-the-cloud-with-Azure-Government/player]

## Compare Azure Government and global Azure

Azure Government offers [Infrastructure-as-a-Service (IaaS)](https://azure.microsoft.com/overview/what-is-iaas/), [Platform-as-a-Service (PaaS)](https://azure.microsoft.com/overview/what-is-paas/), and [Software-as-a-Service (SaaS)](https://azure.microsoft.com/overview/what-is-saas/) cloud service models based on the same underlying technologies as global Azure. For service availability in Azure Government, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=all&regions=non-regional,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia&rar=true). Services available in Azure Government are listed by category and whether they're Generally Available or available through Preview.

There are some key differences that developers working on applications hosted in Azure Government must be aware of. For detailed information, see [Guidance for developers](./documentation-government-developer-guide.md). As a developer, you must know how to connect to Azure Government and once you connect you'll mostly have the same experience as in global Azure. To see feature variations and usage limitations between Azure Government and global Azure, see [Compare Azure Government and global Azure](./compare-azure-government-global-azure.md) and click on individual service.

## Region pairing

Azure relies on [paired regions](../availability-zones/cross-region-replication-azure.md) to deliver [geo-redundant storage](../storage/common/storage-redundancy.md). The following table shows the primary and secondary region pairings in Azure Government.

|Geography|Regional Pair A|Regional Pair B|
|---------|---------------|---------------|
|US Government|US Gov Arizona|US Gov Texas|
|US Government|US Gov Virginia|US Gov Texas|

## Get started

To start using Azure Government, first check out [Guidance for developers](./documentation-government-developer-guide.md). Then, use one of the following guides that show you how to connect to Azure Government:

- [Connect with Azure Government portal](./documentation-government-get-started-connect-with-portal.md)
- [Connect with Azure CLI](./documentation-government-get-started-connect-with-cli.md)
- [Connect with PowerShell](./documentation-government-get-started-connect-with-ps.md)
- [Deploy with Azure DevOps Services](./connect-with-azure-pipelines.md)
- [Develop with SQL Server Management Studio](./documentation-government-connect-ssms.md)
- [Develop with Storage API on Azure Government](./documentation-government-get-started-connect-to-storage.md)

## Next steps

- [Acquiring and accessing Azure Government](https://azure.microsoft.com/offers/azure-government/)
- [Azure Government security](./documentation-government-plan-security.md)
- [Azure Government compliance](./documentation-government-plan-compliance.md)
- [Azure compliance](../compliance/index.yml)
- View [YouTube videos](https://www.youtube.com/playlist?list=PLLasX02E8BPA5IgCPjqWms5ne5h4briK7)
