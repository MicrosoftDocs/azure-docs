---
title: Developers guide to Azure Government
description: This article compares features and provides guidance on developing applications for Azure Government.
services: ''
cloud: gov
documentationcenter: ''
author: Joharve2
manager: Chrisnie
editor: ''

ms.assetid: 6e04e9aa-1a73-442c-a46c-2e4ff87e58d5
ms.service: multiple
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: azure-government
ms.date: 10/29/2015
ms.author: jharve

---
# Developers guide to Azure Government
<p> The Azure Government environment is a physical instance that is separate from the rest of the Microsoft network. This guide discusses the differences that application developers and administrators must understand to interact and work with separate regions of Azure.

## In this topic
* [Overview](#Overview)
* [Guidance for developers](#Guidance)
* [Available features in Azure Government](#Features)
* [Endpoint mapping](#Endpoint)
* [Next steps](#next)

## <a name="Overview"></a>Overview
Azure Government is a separate instance of the Microsoft Azure service. It addresses the security and compliance needs of United States federal agencies, state and local governments, and their solutions providers. Azure Government offers physical and network isolation from non-US government deployments and provides screened US personnel.

Microsoft provides a number of tools to help developers create and deploy cloud applications to the global Microsoft Azure service (“Global Service”) and Microsoft Azure Government services.

When developers create and deploy applications to Azure Government Services, as opposed to the Global Service, they need to know the key differences between the two services. The specific areas to understand are: setting up and configuring their programming environment, configuring endpoints, writing applications, and deploying the applications as services to Azure Government.

The information in this document summarizes the differences between the two services, and it supplements the information that's available on the [Azure Government](http://www.azure.com/gov "Azure Government") site and the [Microsoft Azure Technical Library](http://msdn.microsoft.com/cloud-app-development-msdn "MSDN") on MSDN. Official information might also be available in many other locations, such as the [Microsoft Azure Trust Center](https://azure.microsoft.com/support/trust-center/ "Microsoft Azure Trust Center"/), [Azure Documentation Center](https://azure.microsoft.com/documentation/), and [Azure Blogs](https://azure.microsoft.com/blog/ "Azure Blogs"/).

This content is intended for partners and developers who are deploying to Microsoft Azure Government.

## <a name="Guidance"></a>Guidance for developers
Because most of the currently available technical content assumes that applications are being developed for the Global Service rather than for Azure Government, it’s important to be aware of two key differences in applications that you develop to be hosted in Azure Government.

* Certain services and features that are in specific regions of the Global Service might not be available in Azure Government.
* Feature configurations in Azure Government might differ from those in Global Service. Therefore, it's important to review your sample code, configurations, and steps to ensure that you are building and executing within the Azure Government Cloud Services environment.

## <a name="Features"></a> Available features in Azure Government
The following Azure Government services are available in both the US GOV IOWA and US GOV VIRGINIA regions:

* Virtual Machines
* Virtual Machine Scale Sets
* Container Service
* Batch accounts
* Remote App collections
* Availability Sets
* Virtual Networks
* Load Balancer
* Application Gateways
* Virtual Network Gateway
* Local network gateways
* Route tables
* Traffic Manager profiles
* ExpressRoute circuits
* Network Security groups
* Network interfaces
* Public IP addresses
* Connections
* Storage accounts
* StorSimple managers
* App Service
* Media Services
* SQL Database
* SQL Data Warehouse
* SQL Server Stretch Database
* Redis Cache
* SQL Database elastic pools
* SQL Server
* Log Analytics
* Event Hubs
* Service Bus namespaces
* Azure Active Directory
* Multi-Factor Authentication
* Rights Management
* Automation accounts
* Marketplace

Other services are available, and more services will be added continually. For the most current list of services, see [Products available by region](https://azure.microsoft.com/regions/#services) which highlights each available region and its services.

Currently, US GOV Iowa and US GOV Virginia are the data centers that support Azure Government. For current data centers and available services, see [Products available by region](https://azure.microsoft.com/regions/#services).

## <a name="Endpoint"></a>Endpoint mapping
To learn about mapping public Azure and SQL Database endpoints to Azure Government-specific endpoints, see the following table:

| Name | Azure Government endpoint |
| --- | --- |
| ActiveDirectoryServiceEndpointResourceId  | https://management.core.usgovcloudapi.net/ |
| GalleryUrl | https://gallery.usgovcloudapi.net/ |
| ManagementPortalUrl | https://manage.windowsazure.us |
| ServiceManagementUrl | https://management.core.usgovcloudapi.net/ |
| PublishSettingsFileUrl | https://manage.windowsazure.us/publishsettings/index |
| ResourceManagerUrl | https://management.usgovcloudapi.net/ |
| SqlDatabaseDnsSuffix | .database.usgovcloudapi.net |
| StorageEndpointSuffix | core.usgovcloudapi.net |
| ActiveDirectoryAuthority | https://login-us.microsoftonline.com/ |
| GraphUrl | https://graph.windows.net/ |
| GraphEndpointResourceId | https://graph.windows.net/ |
| TrafficManagerDnsSuffix | usgovtrafficmanager.net |
| AzureKeyVaultDnsSuffix | vault.usgovcloudapi.net |
| AzureKeyVaultServiceEndpointResourceId | https://vault.usgovcloudapi.net |

For Azure Resource Manager authentication through Azure Active Directory, see [Authenticating Azure Resource Manager Requests](https://msdn.microsoft.com/library/azure/dn790557.aspx).

## <a name="next"></a>Next steps
For more information about Azure Government, see the following resources:

* [Sign up for a trial](https://azuregov.microsoft.com/trial/azuregovtrial)
* [Acquiring and accessing Azure Government](http://azure.com/gov)
* [Azure Government Overview](/azure-government-overview)
* [Azure Government Blog](http://blogs.msdn.com/b/azuregov/)
* [Azure Compliance](https://azure.microsoft.com/support/trust-center/compliance/)
