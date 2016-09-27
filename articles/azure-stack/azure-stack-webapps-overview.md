<properties
	pageTitle="Azure Stack Web Apps Overview | Microsoft Azure"
	description="Overview of Web Apps in Azure Stack"
	services="azure-stack"
	documentationCenter=""
	authors="apwestgarth"
	manager="stefsch"
	editor=""/>

<tags
	ms.service="azure-stack"
	ms.workload="app-service"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/25/2016"
	ms.author="anwestg"/>
	
# Azure Stack Web Apps Overview
    
Azure Stack Web Apps is the first element of the Azure App Service offering brought to Azure Stack. The Azure Stack Web Apps installer will create an instance of each of the five required role types and will also create a file server. Although you can add more instances for each of the role types, remember that there is not much space for VMs in Technical Preview 1. The current capabilities for Azure Stack Web Apps are primarily foundation capabilities that are needed to manage the system and host web apps.

![Azure Stack App Service Web Apps in the Azure Stack Portal][1]

## Limitations of the Technical Preview

There is no support for the Azure Stack App Service preview releases. Don't put production workloads on this preview release. There is also no upgrade between Azure Stack App Service preview releases. The primary purposes of these preview releases are to show what we are providing and to obtain feedback. 

## What is an App Service Plan?

The Azure Stack Web Apps resource provider uses the same code that the Azure Web Apps feature in the Azure App Service uses. As a result, some common concepts are worth describing. In Web Apps, the pricing container for web apps is called the App Service plan. It represents the set of dedicated virtual machines used to hold your apps. Within a given subscription, you can have multiple App Service plans. This is also true in Azure Stack Web Apps. 

In Azure, there are shared and dedicated workers. A shared worker supports high-density multitenant web app hosting and there is only one set of shared workers. Dedicated servers are only used by one tenant and come in three sizes: small, medium, and large. The needs of on-premises customers can't always be described by using those terms. In Azure Stack Web Apps, resource provider administrators can define the worker tiers they want to make available such that they have multiple sets of shared workers or different sets of dedicated workers based on their unique web hosting needs. Using those worker tier definitions, they can then define their own pricing SKUs.

## Portal Features

As is also true with the back end, Azure Stack Web Apps uses the same UI that Azure Web Apps uses. Some features are disabled and aren't yet functional in Azure Stack. This is because Azure-specific expectations or services that those features require aren't yet available in Azure Stack. 

## Next steps

- [Before you get started with Azure Stack Web Apps](azure-stack-webapps-before-you-get-started.md)
- [Install the Web Apps Resource Provider](azure-stack-webapps-deploy.md)

You can also try out other [platform as a service (PaaS) services](azure-stack-tools-paas-services.md), like the [SQL Server resource provider](azure-stack-sqlrp-deploy.md) and [MySQL resource provider](azure-stack-mysqlrp-deploy.md).

<!--Image references-->
[1]: ./media/azure-stack-webapps-overview/AppService_Portal.png
