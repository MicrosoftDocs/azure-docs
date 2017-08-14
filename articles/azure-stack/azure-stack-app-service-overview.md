---
title: 'App Service overview: Azure Stack | Microsoft Docs'
description: Overview of App Service on Azure Stack
services: azure-stack
documentationcenter: ''
author: apwestgarth
manager: stefsch
editor: ''

ms.assetid: 
ms.service: azure-stack
ms.workload: app-service
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 7/3/2017
ms.author: anwestg

---

# App Service on Azure Stack overview

Azure App Service on Azure Stack is the Azure offering brought to Azure Stack. The App Service on Azure Stack installer creates the following set of role instances:

*  Controller
*  Management (two instances are created)
*  FrontEnd
*  Publisher
*  Worker (in Shared mode)

In addition, the App Service on Azure Stack installer creates a file server.
	
## What's new in the first release candidate of App Service on Azure Stack?
![App Service in the Azure Stack portal][1]

The first release candidate of App Service on Azure Stack builds on top of the third preview and brings new capabilities and improvements:

* Azure Functions in Azure Stack environments based on Active Directory Federation Services 
* Single sign-on support for the Functions portal and the advanced developer tools (Kudu)
* Java support for web, mobile, and API applications
* Management of worker tiers by virtual machine scale sets to improve scale-out capabilities for service administrators
* Localization of the admin experience
* Increased stability of the service
* Tenant portal experience updates and installation process updates

## Limitations of the technical preview

There is no support for the App Service on Azure Stack preview releases, although we do monitor the Azure Stack MSDN Forum. Do not put production workloads on this preview release. There is also no upgrade between App Service on Azure Stack preview releases. The primary purposes of these preview releases are to show what we're providing and to obtain feedback. 

## What is an App Service plan?

The App Service resource provider uses the same code that Azure App Service uses. As a result, some common concepts are worth describing. In App Service, the pricing container for applications is called the App Service plan. It represents the set of dedicated virtual machines used to hold your apps. Within a given subscription, you can have multiple App Service plans. 

In Azure, there are shared and dedicated workers. A shared worker supports high-density multitenant app hosting, and there is only one set of shared workers. Dedicated servers are used by only one tenant and come in three sizes: small, medium, and large. The needs of on-premises customers can't always be described by using those terms. In App Service on Azure Stack, resource provider administrators can define the worker tiers they want to make available. Administrators can define multiple sets of shared workers or different sets of dedicated workers based on their unique hosting needs. By using those worker-tier definitions, they can then define their own pricing SKUs.

## Portal features

App Service on Azure Stack uses the same UI that Azure App Service uses, as is true with the back end. Some features are disabled and aren't functional in Azure Stack. The Azure-specific expectations or services that those features require aren't yet available in Azure Stack. 

## Next steps

- [Before you get started with App Service on Azure Stack](azure-stack-app-service-before-you-get-started.md)
- [Install the App Service resource provider](azure-stack-app-service-deploy.md)

You can also try out other [platform as a service (PaaS) services](azure-stack-tools-paas-services.md), like the [SQL Server resource provider](azure-stack-sql-resource-provider-deploy.md) and the [MySQL resource provider](azure-stack-mysql-resource-provider-deploy.md).

<!--Image references-->
[1]: ./media/azure-stack-app-service-overview/AppService_Portal.png
