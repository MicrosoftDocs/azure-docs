---
title: Azure Government developer guide
description: Provides guidance on developing applications for Azure Government
ms.service: azure-government
ms.topic: article
ms.workload: azure-government
ms.author: EliotSeattle
author: eliotgra
recommendations: false
ms.date: 03/07/2022
---

# Azure Government developer guide

Azure Government is a separate instance of the Microsoft Azure service. It addresses the security and compliance needs of United States federal agencies, state and local governments, and their solution providers. Azure Government enforces physical isolation from non-US government infrastructure and relies on [screened US personnel](./documentation-government-plan-security.md#screening) for operations.

Microsoft provides various tools to help you create and deploy cloud applications on global Azure and Azure Government.

When you create and deploy applications on Azure Government, you need to know the key differences between Azure Government and global Azure. The specific areas to understand are: 

- Setting up and configuring your programming environment
- Configuring endpoints
- Writing applications
- Deploying applications as services to Azure Government

The information in this document summarizes the differences between the two cloud environments. It supplements the information that's available through the following sources:

- [Azure Government](https://azure.microsoft.com/global-infrastructure/government/) site 
- [Microsoft Trust Center](https://www.microsoft.com/trust-center/product-overview)
- [Azure documentation center](../index.yml)
- [Azure Blogs](https://azure.microsoft.com/blog/)

This content is intended for Microsoft partners and developers who are deploying to Azure Government.

## Guidance for developers

Most of the currently available technical content assumes that applications are being developed on global Azure rather than on Azure Government. For this reason, it’s important to be aware of two key differences in applications that you develop for hosting in Azure Government.

- Certain services and features that are in specific regions of global Azure might not be available in Azure Government.
- Feature configurations in Azure Government might differ from those in global Azure.

Therefore, it's important to review your sample code and configurations to ensure that you are building within the Azure Government cloud services environment.

### Endpoint mapping

Service endpoints in Azure Government are different than in Azure. For a mapping between Azure and Azure Government endpoints, see [Compare Azure Government and global Azure](./compare-azure-government-global-azure.md#guidance-for-developers).

### Feature variations

For current Azure Government regions and available services, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=all&regions=non-regional,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia&rar=true). Services available in Azure Government are listed by category and whether they are Generally Available or available through Preview. In general, service availability in Azure Government implies that all corresponding service features are available to you. Variations to this approach and other applicable limitations are tracked and explained in [Compare Azure Government and global Azure](./compare-azure-government-global-azure.md#service-availability).

### Quickstarts

Navigate through the following links to get started using Azure Government:

- [Login to Azure Government portal](./documentation-government-get-started-connect-with-portal.md)
- [Connect with PowerShell](./documentation-government-get-started-connect-with-ps.md)
- [Connect with CLI](./documentation-government-get-started-connect-with-cli.md)
- [Connect with Visual Studio](./documentation-government-connect-vs.md)
- [Connect to Azure Storage](./documentation-government-get-started-connect-to-storage.md)
- [Connect with Azure SDK for Python](/azure/developer/python/sdk/azure-sdk-sovereign-domain)

### Azure Government Video Library 

The [Azure Government video library](https://aka.ms/AzureGovVideos) contains many helpful videos to get you up and running with Azure Government. 

## Compliance

For more information about Azure Government compliance assurances, see [Azure Government compliance](./documentation-government-plan-compliance.md) documentation.

## Next steps

For more information about Azure Government, see the following resources:

- [Sign up for a trial](https://azure.microsoft.com/global-infrastructure/government/request/?ReqType=Trial)
- [Acquiring and accessing Azure Government](https://azure.microsoft.com/offers/azure-government/)
- [Ask questions via the azure-gov tag in StackOverflow](https://stackoverflow.com/tags/azure-gov)
- [Azure Government blog](https://devblogs.microsoft.com/azuregov/)
- [Azure Government overview](./documentation-government-welcome.md)
- [Azure Government security](./documentation-government-plan-security.md)
- [Compare Azure Government and global Azure](./compare-azure-government-global-azure.md)
- [Azure Government compliance](./documentation-government-plan-compliance.md)
- [Azure compliance](../compliance/index.yml)
