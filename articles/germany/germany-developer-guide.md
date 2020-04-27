---
title: Azure Germany developer guide | Microsoft Docs
description: This article compares features and provides guidance on developing applications for Azure Germany.
services: germany
cloud: na
documentationcenter: na
author: gitralf
manager: rainerst

ms.assetid: na
ms.service: germany
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/12/2019
ms.author: ralfwi

---
# Azure Germany developer guide

> [!IMPORTANT]
> Since [August 2018](https://news.microsoft.com/europe/2018/08/31/microsoft-to-deliver-cloud-services-from-new-datacentres-in-germany-in-2019-to-meet-evolving-customer-needs/), we have not been accepting new customers or deploying any new features and services into the original Microsoft Cloud Germany locations.
>
> Based on the evolution in customers' needs, we recently [launched](https://azure.microsoft.com/blog/microsoft-azure-available-from-new-cloud-regions-in-germany/) two new datacenter regions in Germany, offering customer data residency, full connectivity to Microsoft's global cloud network, as well as market competitive pricing. 
>
> Take advantage of the breadth of functionality, enterprise-grade security, and comprehensive features available in our new German datacenter regions by [migrating](germany-migration-main.md) today.

The Azure Germany environment is an instance of Microsoft Azure that is separate from the rest of the Microsoft network. This guide discusses the differences that application developers and administrators must understand to interact and work with separate regions of Azure.

## Overview
Microsoft provides various tools to help developers create and deploy cloud applications to the global Microsoft Azure services ("global Azure") and Microsoft Azure Germany services. Azure Germany addresses the security and compliance needs of customers to follow German data privacy regulations. Azure Germany offers physical and network isolation from global Azure deployments and provides a data trustee acting under German law.

When developers create and deploy applications to Azure Germany, as opposed to global Azure, they need to know the differences between the two sets of services. The specific areas to understand are: setting up and configuring their programming environment, configuring endpoints, writing applications, and deploying the applications as services to Azure Germany.

The information in this guide summarizes these differences. It supplements the information that's available on the [Azure Germany](https://azure.microsoft.com/overview/clouds/germany/ "Azure Germany") site and the [Azure Documentation Center](https://azure.microsoft.com/documentation/). 

Official information might also be available in other locations, such as:
* [Microsoft Azure Trust Center](https://azure.microsoft.com/support/trust-center/ "Microsoft Azure Trust Center") 
* [Azure blog](https://azure.microsoft.com/blog/ "Azure blog")
* [Azure Germany blog](https://blogs.msdn.microsoft.com/azuregermany/ "Azure Germany blog")

## Guidance for developers
Most of the currently available technical content assumes that applications are being developed for global Azure rather than for Azure Germany. For this reason, it's important to be aware of two key differences in applications that you develop for hosting in Azure Germany:

* Certain services and features that are in specific regions of global Azure might not be available in Azure Germany.
* Feature configurations in Azure Germany might differ from those in global Azure. It's important to review your sample code, configurations, and steps to ensure that you are building and executing within the Azure Germany Cloud Services environment.

Currently, Germany Central and Germany Northeast are the regions that are available in Azure Germany. For regions and available services, see [Products available by region](https://azure.microsoft.com/regions/services).


## Endpoint mapping
To learn about mapping global Azure and Azure SQL Database endpoints to Azure Germany-specific endpoints, see the following table:

| Name | Azure Germany endpoint |
| --- | --- |
| ActiveDirectoryServiceEndpointResourceId | `https://management.core.cloudapi.de/` |
| GalleryUrl                               | `https://gallery.cloudapi.de/` |
| ManagementPortalUrl                      | `https://portal.microsoftazure.de/` |
| ServiceManagementUrl                     | `https://management.core.cloudapi.de/` |
| PublishSettingsFileUrl                   | `https://manage.microsoftazure.de/publishsettings/index` |
| ResourceManagerUrl                       | `https://management.microsoftazure.de/` |
| SqlDatabaseDnsSuffix                     | `.database.cloudapi.de` |
| StorageEndpointSuffix                    | `core.cloudapi.de` |
| ActiveDirectoryAuthority                 | `https://login.microsoftonline.de/` |
| GraphUrl                                 | `https://graph.cloudapi.de/` |
| TrafficManagerDnsSuffix                  | `azuretrafficmanager.de` |
| AzureKeyVaultDnsSuffix                   | `vault.microsoftazure.de` |
| AzureKeyVaultServiceEndpointResourceId   | `https://vault.microsoftazure.de` |
| Service Bus Suffix                       | `servicebus.cloudapi.de` |


## Next steps
For more information about Azure Germany, see the following resources:

* [Sign up for a trial](https://azure.microsoft.com/free/germany/)
* [Acquiring Azure Germany](https://azure.microsoft.com/overview/clouds/germany/)
* [Sign-in page](https://portal.microsoftazure.de/) if you already have an Azure Germany account
* [Azure Germany overview](./germany-welcome.md)
* [Azure Germany blog](https://blogs.msdn.microsoft.com/azuregermany/)
* [Azure compliance](https://www.microsoft.com/en-us/trustcenter/compliance/complianceofferings)

