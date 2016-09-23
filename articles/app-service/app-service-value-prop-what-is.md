<properties 
	pageTitle="Azure App Service for web apps and mobile apps | Microsoft Azure" 
	description="Learn how Azure App Service helps you develop, deploy, and manage web and mobile apps." 
	keywords="app service, azure app service, app service cost, scale, scalable, app deployment, azure app deployment, paas, platform-as-a-service"
	services="app-service" 
	documentationCenter="" 
	authors="omarkmsft" 
	manager="dwrede" 
	editor="jimbe"/>

<tags 
	ms.service="app-service" 
	ms.workload="na" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="get-started-article" 
	ms.date="05/25/2016" 
	ms.author="omark"/>

# What is Azure App Service?

*App Service* is a [platform-as-a-service](https://en.wikipedia.org/wiki/Platform_as_a_service) (PaaS) offering of Microsoft Azure. Create web and mobile apps for any platform or device. Integrate your apps with SaaS solutions, connect with on-premises applications, and automate your business processes. Azure runs your apps on fully managed virtual machines (VMs), with your choice of shared VM resources or dedicated VMs. 

App Service includes the web and mobile capabilities that we previously delivered separately as Azure Websites and Azure Mobile Services.  It also includes new capabilities for automating business processes and hosting cloud APIs. As a single integrated service, App Service lets you compose various components -- websites, mobile app back ends, RESTful APIs, and business processes -- into a single solution.

The following 4-minute video provides a brief explanation of how App Service relates to earlier Azure offerings and what's new in it.

+[AZURE.VIDEO app-service-history-lesson] 

## Why use App Service?

Here are some key features and capabilities of App Service: 

- **Multiple languages and frameworks** - App Service has first-class support for ASP.NET, Node.js, Java, PHP, and Python. You can also run [Windows PowerShell and other scripts or executables](../app-service-web/web-sites-create-web-jobs.md) on App Service VMs.

- **DevOps optimization** - Set up [continuous integration and deployment](../app-service-web/app-service-continuous-deployment.md) with Visual Studio Team Services, GitHub, or BitBucket. Promote updates through [test and staging environments](../app-service-web/web-sites-staged-publishing.md). Perform [A/B testing](../app-service-web/app-service-web-test-in-production-get-start.md). Manage your apps in App Service by using [Azure PowerShell](../powershell-install-configure.md) or the [cross-platform command-line interface (CLI)](../xplat-cli-install.md).
 
- **Global scale with high availability** - Scale [up](../app-service-web/web-sites-scale.md) or [out](../azure-portal/insights-how-to-scale.md) manually or automatically. Host your apps anywhere in Microsoft's global datacenter infrastructure, and the App Service [SLA](https://azure.microsoft.com/support/legal/sla/app-service/) promises high availability.

- **Connections to SaaS platforms and on-premises data** - Choose from more than 50 [connectors](../connectors/apis-list.md) for enterprise systems (such as SAP, Siebel, and Oracle), SaaS services (such as Salesforce and Office 365), and internet services (such as Facebook and Twitter). Access on-premises data using [Hybrid Connections](../biztalk-services/integration-hybrid-connection-overview.md) and [Azure Virtual Networks](../app-service-web/web-sites-integrate-with-vnet.md).

- **Security and compliance** - App Service is [ISO, SOC, and PCI compliant](https://www.microsoft.com/TrustCenter/).

- **Application templates** - Choose from an extensive list of application templates in the [Azure Marketplace](https://azure.microsoft.com/marketplace/) that let you use a wizard to install popular open-source software such as WordPress, Joomla, and Drupal.

- **Visual Studio integration** - Dedicated tools in Visual Studio streamline the work of creating, deploying, and debugging.

## App types in App Service

App Service offers several *app types*, each of which is  intended to host a specific kind of workload:

- [**Web Apps**](../app-service-web/app-service-web-overview.md) - For hosting websites and web applications.

- [**Mobile Apps**](../app-service-mobile/app-service-mobile-value-prop.md) For hosting mobile app back ends.
   
- [**API Apps**](../app-service-api/app-service-api-apps-why-best-platform.md) - For hosting cloud APIs. 
 
- [**Logic Apps**](../app-service-logic/app-service-logic-what-are-logic-apps.md) - For automating the access and use of data across clouds without writing code.

The word *app* here refers to the hosting resources dedicated to running a workload. Taking “web app” as an example, you’re probably accustomed to thinking of a web app as both the compute resources and application code that together deliver functionality to a browser. But in App Service a *web app* is the compute resources that Azure provides for hosting your application code. If your application is composed of a web front-end and a RESTful API back end, you could deploy both to a web app or you could deploy your front-end code to a web app and your back end code to an API app. Your application may be composed of multiple App Service apps of different kinds.

## App Service Plans

[App Service Plans](azure-web-sites-web-hosting-plans-in-depth-overview.md) specify the kind of compute resources that your apps run on. If you expect light traffic loads, you can use shared virtual machines (VMs). For higher loads, you can choose from several sizes of dedicated VMs. Multiple App Service apps can share the same plan, and they scale up and down together with the plan.

If you need more scalability and network isolation, you can run your apps in an [App Service Environment](../app-service-web/app-service-app-service-environment-intro.md). 

## Pricing

For information about how much App Service costs, see [App Service Pricing](https://azure.microsoft.com/pricing/details/app-service/). 

## Get Started with App Service

[Create a temporary web app, mobile app, or logic app](http://go.microsoft.com/fwlink/?LinkId=523751) right away for free, with no credit card required, no commitments, no hassles.

Or open a [free Azure account](https://azure.microsoft.com/pricing/free-trial/), and try one of our getting-started tutorials:

* [Tutorial: Create a web app](../app-service-web/app-service-web-get-started.md)
* [Tutorial: Create a mobile app](../app-service-mobile/app-service-mobile-android-get-started.md)
* [Tutorial: Create an API app](../app-service-api/app-service-api-dotnet-get-started.md)
* [Tutorial: Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md)
