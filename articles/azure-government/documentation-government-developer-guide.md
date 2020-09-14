---
title: Azure Government developer guide | Microsoft Docs
description: This article compares features and provides guidance on developing applications for Azure Government.
services: azure-government
cloud: gov
documentationcenter: ''

ms.service: azure-government
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: azure-government
ms.date: 10/10/2020

---

# Azure Government developer guide
Azure Government is a separate instance of the Microsoft Azure service. It addresses the security and compliance needs of United States federal agencies, state and local governments, and their solution providers. Azure Government offers physical isolation from non-US government deployments and provides screened US personnel.

Microsoft provides various tools to help developers create and deploy cloud applications to the global Microsoft Azure service (“global service”) and Microsoft Azure Government services.

When developers create and deploy applications to Azure Government services, as opposed to the global service, they need to know the key differences between the two services. 
The specific areas to understand are: 

* Setting up and configuring their programming environment
* Configuring endpoints
* Writing applications
* Deploying applications as services to Azure Government

The information in this document summarizes the differences between the two services. 
It supplements the information that's available through the following sources:

* [Azure Government](https://www.azure.com/gov "Azure Government") site 
* [Microsoft Azure Trust Center](https://www.microsoft.com/trust-center/product-overview "Microsoft Azure Trust Center")
* [Azure Documentation Center](https://docs.microsoft.com/azure/)
* [Azure Blogs](https://azure.microsoft.com/blog/ "Azure Blogs")

This content is intended for partners and developers who are deploying to Microsoft Azure Government.

## Guidance for developers
Most of the currently available technical content assumes that applications are being developed for the global service rather than for Azure Government. For this reason, it’s important to be aware of two key differences in applications that you develop for hosting in Azure Government.

* Certain services and features that are in specific regions of the global service might not be available in Azure Government.
* Feature configurations in Azure Government might differ from those in the global service. 
    -   Therefore, it's important to review your sample code, configurations, and steps to ensure that you are building and executing within the Azure Government Cloud Services environment.

Currently, US DoD Central, US DoD East, US Gov Arizona, US Gov Texas, and US Gov Virginia are the regions that support Azure Government. For current regions and available services, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=all&regions=non-regional,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia).

### Quickstarts
Navigate through the links below to get started using Azure Government.

* [Login to Azure Government Portal](documentation-government-get-started-connect-with-portal.md)
* [Connect with PowerShell](documentation-government-get-started-connect-with-ps.md)
* [Connect with CLI](documentation-government-get-started-connect-with-cli.md)
* [Connect with Visual Studio](documentation-government-connect-vs.md)
* [Connect to Azure Storage](documentation-government-get-started-connect-to-storage.md)
* [Connect with Azure SDK for Python](/azure/python/python-sdk-azure-multi-cloud)

### Azure Government Video Library 
The [Azure Government video library](https://channel9.msdn.com/blogs/Azure-Government) contains many helpful videos to get you up and running with Azure Government. 

## Compliance - Azure Blueprint
The [Azure Blueprint](https://docs.microsoft.com/azure/governance/blueprints/overview) program is designed to facilitate the secure and compliant use of Azure for government agencies and third-party providers building on behalf of government. 

For more information on Azure Government Compliance, refer to the [compliance documentation](https://docs.microsoft.com/azure/azure-government/documentation-government-plan-compliance) and watch this [video](https://channel9.msdn.com/blogs/Azure-Government/Compliance-on-Azure-Government). 

## Endpoint mapping
Service endpoints in Azure Government are different than in Azure.  For a mapping between Azure and Azure Government endpoints, see [Compare Azure Government and global Azure](compare-azure-government-global-azure.md#guidance-for-developers).

## Next steps
For more information about Azure Government, see the following resources:

* [Sign up for a trial](https://azure.microsoft.com/global-infrastructure/government/request/?ReqType=Trial)
* [Acquiring and accessing Azure Government](https://azure.com/gov)
* [Ask questions via the azure-gov tag in StackOverflow](https://stackoverflow.com/tags/azure-gov)
* [Azure Government Overview](documentation-government-welcome.md)
* [Azure Government Blog](https://blogs.msdn.microsoft.com/azuregov/)
* [Azure Compliance](https://www.microsoft.com/en-us/trustcenter/compliance/complianceofferings)
