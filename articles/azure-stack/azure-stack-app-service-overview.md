---
title: 'App Service overview: Azure Stack | Microsoft Docs'
description: Overview of App Service on Azure Stack
services: azure-stack
documentationcenter: ''
author: brenduns
manager: femila
editor: ''

ms.assetid:
ms.service: azure-stack
ms.workload: app-service
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/28/2018
ms.author: brenduns
ms.reviewer: anwestg

---

# App Service on Azure Stack overview

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

Azure App Service on Azure Stack is a platform-as-a-service (PaaS) offering of Microsoft Azure available to Azure Stack. The service lets your customers - internal or external - create web, API, and Azure Functions applications for any platform or device. They can integrate your apps with on-premises applications and automate their business processes. Azure Stack cloud operators can run customer apps on fully managed virtual machines (VMs), with their choice of shared VM resources or dedicated VMs.

Azure App Service enables you to automate business processes and hosting cloud APIs. As a single integrated service, Azure App Service lets you combine various components -- websites, RESTful APIs, and business processes -- into a single solution.

## Why offer Azure App Service on Azure Stack?

Here are some key features and capabilities of App Service:

- **Multiple languages and frameworks**: App Service has first-class support for ASP.NET, Node.js, Java, PHP, and Python. You can also run Windows PowerShell and other scripts or executables on App Service VMs.
- **DevOps optimization**: Set up continuous integration and deployment with GitHub, local Git, or BitBucket. Promote updates through test and staging environments. Manage your apps in App Service by using Azure PowerShell or the cross-platform command-line interface (CLI).
- **Visual Studio integration**: Dedicated tools in Visual Studio streamline the work of creating and deploying applications.

## App types in App Service

App Service offers several app types, each of which is intended to host a specific workload:

- [Web Apps](https://docs.microsoft.com/azure/app-service-web/app-service-web-overview) for hosting websites and web applications.
- [API Apps](https://docs.microsoft.com/azure/app-service-api/app-service-api-apps-why-best-platform) for hosting RESTful APIs.
- Azure Functions for hosting event driven, serverless workloads.

The word app here refers to the hosting resources dedicated to running a workload. Taking “web app” as an example, you’re probably accustomed to thinking of a web app as both the compute resources and application code that together deliver functionality to a browser. But in App Service a web app is the compute resources that Azure Stack provides for hosting your application code.

Your application can be composed of multiple App Service apps of different kinds. For example, if your application is composed of a web front end and a RESTful API back end, you can:

- Deploy both (front end and api) to a single web app
- Deploy your front-end code to a web app and your back-end code to an API app.

   ![App Service overview with monitoring data](media/azure-stack-app-service-overview/image01.png)

## What is an App Service plan?

The App Service resource provider uses the same code that Azure App Service uses. As a result, some common concepts are worth describing. In App Service, the pricing container for applications is called the App Service plan. It represents the set of dedicated virtual machines used to hold your apps. Within a given subscription, you can have multiple App Service plans.

In Azure, there are shared and dedicated workers. A shared worker supports high-density multi-tenant app hosting, and there's only one set of shared workers. Dedicated servers are used by only one tenant and come in three sizes: small, medium, and large. The needs of on-premises customers can't always be described by using those terms. In App Service on Azure Stack, resource provider administrators can define the worker tiers they want to make available. Based on your unique hosting needs, you can define multiple sets of shared workers or different sets of dedicated workers. By using those worker-tier definitions, they can then define their own pricing SKUs.

## Portal features

App Service on Azure Stack uses the same UI that Azure App Service uses, the same is true with the back end. However, some features are disabled and aren't functional in Azure Stack. The Azure-specific expectations or services that those features require aren't currently available in Azure Stack.

## Next steps

- [Before you get started with App Service on Azure Stack](azure-stack-app-service-before-you-get-started.md)
- [Install the App Service resource provider](azure-stack-app-service-deploy.md)

You can also try out other [platform as a service (PaaS) services](azure-stack-tools-paas-services.md), such as the [SQL Server resource provider](azure-stack-sql-resource-provider-deploy.md) and the [MySQL resource provider](azure-stack-mysql-resource-provider-deploy.md).
