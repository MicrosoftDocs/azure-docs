---
title: Azure Government developer guide | Microsoft Docs
description: This article compares features and provides guidance on developing applications for Azure Government.
services: azure-government
cloud: gov
documentationcenter: ''
author: stevevi
ms.author: stevevi
ms.service: azure-government
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: azure-government
ms.date: 8/04/2021
---

# Azure Government developer guide

Azure Government is a separate instance of the Microsoft Azure service. It addresses the security and compliance needs of United States federal agencies, state and local governments, and their solution providers. Azure Government enforces physical isolation from non-US government infrastructure and relies on [screened US personnel](./documentation-government-plan-security.md#screening) for operations.

Microsoft provides various tools to help you create and deploy cloud applications on global Azure and Azure Government.

When you create and deploy applications to Azure Government services, as opposed to global Azure, you need to know the key differences between the two cloud environments. The specific areas to understand are: 

- Setting up and configuring your programming environment
- Configuring endpoints
- Writing applications
- Deploying applications as services to Azure Government

The information in this document summarizes the differences between the two cloud environments. It supplements the information that's available through the following sources:

- [Azure Government](https://azure.microsoft.com/global-infrastructure/government/) site 
- [Microsoft Trust Center](https://www.microsoft.com/trust-center/product-overview)
- [Azure Documentation Center](../index.yml)
- [Azure Blogs](https://azure.microsoft.com/blog/)

This content is intended for partners and developers who are deploying to Azure Government.

## Guidance for developers

Most of the currently available technical content assumes that applications are being developed on global Azure rather than on Azure Government. For this reason, it’s important to be aware of two key differences in applications that you develop for hosting in Azure Government.

- Certain services and features that are in specific regions of global Azure might not be available in Azure Government.
- Feature configurations in Azure Government might differ from those in global Azure.

Therefore, it's important to review your sample code, configurations, and steps to ensure that you are building and executing within the Azure Government cloud services environment.

For current Azure Government regions and available services, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=all&regions=non-regional,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia).

### Quickstarts

Navigate through the links below to get started using Azure Government:

- [Login to Azure Government portal](./documentation-government-get-started-connect-with-portal.md)
- [Connect with PowerShell](./documentation-government-get-started-connect-with-ps.md)
- [Connect with CLI](./documentation-government-get-started-connect-with-cli.md)
- [Connect with Visual Studio](./documentation-government-connect-vs.md)
- [Connect to Azure Storage](./documentation-government-get-started-connect-to-storage.md)
- [Connect with Azure SDK for Python](/azure/developer/python/azure-sdk-sovereign-domain)

### Azure Government Video Library 

The [Azure Government video library](https://aka.ms/AzureGovVideos) contains many helpful videos to get you up and running with Azure Government. 

## Compliance

For more information on Azure Government Compliance, refer to the [compliance documentation](./documentation-government-plan-compliance.md) and watch this [video](https://channel9.msdn.com/blogs/Azure-Government/Compliance-on-Azure-Government). 

### Azure Blueprints

[Azure Blueprints](../governance/blueprints/overview.md) is a service that helps you deploy and update cloud environments in a repeatable manner using composable artifacts such as Azure Resource Manager templates to provision resources, role-based access controls, and policies. Resources provisioned through Azure Blueprints adhere to an organization’s standards, patterns, and compliance requirements. The overarching goal of Azure Blueprints is to help automate compliance and cybersecurity risk management in cloud environments. To help you deploy a core set of policies for any Azure-based architecture that requires compliance with certain US government compliance requirements, see [Azure Blueprint samples](../governance/blueprints/samples/index.md).

## Endpoint mapping

Service endpoints in Azure Government are different than in Azure. For a mapping between Azure and Azure Government endpoints, see [Compare Azure Government and global Azure](./compare-azure-government-global-azure.md#guidance-for-developers).

## Next steps

For more information about Azure Government, see the following resources:

- [Sign up for a trial](https://azure.microsoft.com/global-infrastructure/government/request/?ReqType=Trial)
- [Acquiring and accessing Azure Government](https://azure.microsoft.com/offers/azure-government/)
- [Ask questions via the azure-gov tag in StackOverflow](https://stackoverflow.com/tags/azure-gov)
- [Azure Government Overview](./documentation-government-welcome.md)
- [Azure Government Blog](https://blogs.msdn.microsoft.com/azuregov/)
- [Azure Compliance](../compliance/index.yml)