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
ms.date: 10/15/2019

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
* [Microsoft Azure Technical Library](https://msdn.microsoft.com/cloud-app-development-msdn "MSDN") on MSDN
* [Microsoft Azure Trust Center](https://azure.microsoft.com/support/trust-center/ "Microsoft Azure Trust Center")
* [Azure Documentation Center](https://azure.microsoft.com/documentation/)
* [Azure Blogs](https://azure.microsoft.com/blog/ "Azure Blogs")

This content is intended for partners and developers who are deploying to Microsoft Azure Government.

## Guidance for developers
Most of the currently available technical content assumes that applications are being developed for the global service rather than for Azure Government. For this reason, it’s important to be aware of two key differences in applications that you develop for hosting in Azure Government.

* Certain services and features that are in specific regions of the global service might not be available in Azure Government.
* Feature configurations in Azure Government might differ from those in the global service. 
    -   Therefore, it's important to review your sample code, configurations, and steps to ensure that you are building and executing within the Azure Government Cloud Services environment.

Currently, US DoD East, US DoD Central, US Gov Virginia, US Gov Arizona, US Gov Texas and US Gov Iowa are the datacenters that support Azure Government. For current datacenters and available services, see [Products available by region](https://azure.microsoft.com/regions/services).

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

The Azure Blueprint program is designed to facilitate the secure and compliant use of Azure for government agencies and third-party providers building on behalf of government. 

For more information on Azure Government Compliance, refer to the [compliance documentation](https://docs.microsoft.com/azure/azure-government/documentation-government-plan-compliance) and watch this [video](https://channel9.msdn.com/blogs/Azure-Government/Compliance-on-Azure-Government). 

## Endpoint mapping

The following table shows the mapping between some Azure services and Azure Government endpoints.

| Name | Azure Government endpoint | Azure Commercial endpoint |
| --- | --- | --- |
| Portal | https:\//portal.azure.us | https:\//portal.azure.com |
| Azure Cloud Shell |  https:\//portal.azure.us | https:\//portal.azure.com |
| Active Directory Endpoint and Authority | https:\//login.microsoftonline.us | https:\//login.microsoftonline.com <br/> https:\//login.windows.net |
| Active Directory tenant names | [yourtenantname].onmicrosoft.com | [yourtenantname].onmicrosoft.com |
| Microsoft Graph API | https:\//graph.microsoft.us/ | https:\//graph.microsoft.com/ |
| Azure API | https:\//management.usgovcloudapi.net/ | https:\//management.azure.com/ |
| SQL Database DNS Suffix | \*.database.usgovcloudapi.net | \*.database.windows.net |
| Storage DNS Suffix | \*.core.usgovcloudapi.net | \*.core.windows.net |
| Traffic Manager DNS Suffix | \*.usgovtrafficmanager.net | \*.trafficmanager.net |
| Key Vault DNS Suffix | \*.vault.usgovcloudapi.net | \*.vault.azure.net |
| Service Bus DNS Suffix | \*.servicebus.usgovcloudapi.net | \*.servicebus.windows.net |
| API Management | \*.azure-api.us | \*.azure-api.net |
| Azure Service Fabric cluster | \*.cloudapp.usgovcloudapi.net | \*.cloudapp.azure.com |
| Container Registry Suffix | \*.azurecr.us | \*.azurecr.io |
| Gallery Url | https:\//gallery.azure.us/ | https:\//gallery.azure.com/ |
| Classic Deployment Model Url | https:\//management.core.usgovcloudapi.net/ | https:\//management.core.windows.net/ |
| Publish Settings File Url | https:\//portal.azure.us#blade/Microsoft_Azure_ClassicResources/PublishingProfileBlade | https:\//portal.azure.com/#blade/Microsoft_Azure_ClassicResources/PublishingProfileBlade |
| LUIS Portal | https:\//luis.azure.us | https:\//www.luis.ai/home

## Next steps
For more information about Azure Government, see the following resources:

* [Sign up for a trial](https://azure.microsoft.com/global-infrastructure/government/request/?ReqType=Trial)
* [Acquiring and accessing Azure Government](https://azure.com/gov)
* [Ask questions via the azure-gov tag in StackOverflow](https://stackoverflow.com/tags/azure-gov)
* [Azure Government Overview](documentation-government-welcome.md)
* [Azure Government Blog](https://blogs.msdn.microsoft.com/azuregov/)
* [Azure Compliance](https://www.microsoft.com/en-us/trustcenter/compliance/complianceofferings)
