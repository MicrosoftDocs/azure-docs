<properties 
	pageTitle="What is Azure App Service | Microsoft Azure" 
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

*App Service* is a [platform-as-a-service](https://en.wikipedia.org/wiki/Platform_as_a_service) (PaaS) offering of Microsoft Azure that enables you to create web and mobile apps for any platform or device. You can easily integrate your apps with SaaS solutions (such as Office 365, Dynamics CRM, Salesforce, Twilio), easily connect with on-premises applications (such as SAP, Oracle, Siebel), and easily automate business processes while meeting stringent security, reliability, and scalability needs. 

App Service includes the web and mobile capabilities that we previously delivered separately as Azure Websites and Azure Mobile Services.  It also includes new capabilities for automating business processes and hosting cloud APIs.

## App types in App Service

App Service offers the following app types for running your application code or workflow processes.

- [**Web Apps**](../app-service-web/app-service-web-overview.md) - For hosting websites and web applications.

- [**Mobile Apps**](../app-service-mobile/app-service-mobile-value-prop.md) For hosting mobile app back ends.
   
- [**API Apps**](../app-service-api/app-service-api-apps-why-best-platform.md) - For hosting cloud APIs. 
 
- [**Logic Apps**](../app-service-logic/app-service-logic-what-are-logic-apps.md) - For automating the access and use of data across clouds without writing code.

As a single integrated service, App Service makes it easy to compose multiple app types into a single solution.

## App Service Plans and Environments

[App Service Plans](azure-web-sites-web-hosting-plans-in-depth-overview.md) represent the compute resources that your apps run on. At lower pricing tiers, your apps run on shared virtual machines (VMs). At higher tiers, your apps run on dedicated VMs. You have a choice of several VM sizes, and you can change your pricing tier with no downtime. If you need more scalability and network isolation, you can run your apps in an [App Service Environment](../app-service-web/app-service-app-service-environment-intro.md).

## Why use App Service?

Here are some key features and capabilities of App Service: 

- **Fully managed platform** - Automatic OS and framework patching, built-in support for backup and disaster recovery. 

- **Use your existing skills** - Code in your favorite language, framework, and development environment. App Service supports .NET, Node.js, Java, PHP, and Python. 

- **Fast deployment** - Provision new apps and deploy code to them in seconds.

- **Continuous Integration** - Set up [continuous integration and deployment](../app-service-web/app-service-continous-deployment.md) with Visual Studio Team Services, GitHub, or BitBucket.

- **Staging and test environments** - Implement [staged deployment](../app-service-web/web-sites-staged-publishing.md) to verify your code in a preproduction environment that is identical to your production environment. When you're ready, release a new version of your app with zero downtime by performing a swap operation. 

- **Testing in Production** - Take staged deployments to the next level and [perform A/B testing](../app-service-web/app-service-web-test-in-production-get-start.md) to verify your new code with a configurable fraction of your live traffic. 

- **Authentication and authorization** - Protect an app from unauthenticated access with no changes to your code. Built-in authentication services secure your apps for access by users, by clients representing users, or by services. Supported identity providers include Azure Active Directory, Facebook, Twitter, Google, and Microsoft Account. For more information, see [Authentication and authorization in Azure App Service](app-service-authentication-overview.md).

- **Connect to any service** - Connect your app to enterprise systems or software-as-a-service (SaaS) platforms in minutes with built-in [connectors](../connectors/apis-list.md). Choose from more than 50 connectors for enterprise systems such as SAP, Siebel, and Oracle, popular enterprise SaaS services like Salesforce and Office 365, and popular internet services such as Facebook, Twitter, and Dropbox.

- **Global scale** - Scale [up](../app-service/app-service-scale.md) or [out](../azure-portal/insights-how-to-scale.md) to handle any incoming customer load. Manually select the number and size of VMs or set up auto-scaling based on load or schedule. Microsoft's global datacenter infrastructure hosts your apps and makes it easy to replicate data and hosting services in multiple locations. 

- **Enterprise-grade** - App Service is designed for building and hosting secure mission-critical applications. Build Active Directory integrated business apps that connect securely to on-premises resources, then host them on a secure cloud platform that is [ISO](https://www.microsoft.com/TrustCenter/Compliance/ISO-IEC-27001), [SOC](https://www.microsoft.com/TrustCenter/Compliance/SOC), and [PCI](https://www.microsoft.com/TrustCenter/Compliance/pci) compliant. All with an enterprise-level [SLA](https://azure.microsoft.com/support/legal/sla/app-service/).

- **Azure Marketplace** - Select from an ever-growing [list of application templates](https://azure.microsoft.com/marketplace/). Leverage the best of the OSS app community with one-click installation of packages such as WordPress, Joomla and Drupal.

- **WebJobs** - [Run any program or script](../app-service-web/web-sites-create-web-jobs.md) on App Service VMs. Run jobs continuously, on a schedule, or triggered by events. The Azure [WebJobs SDK](../app-service-web/websites-dotnet-webjobs-sdk-get-started.md) simplifies the code you write to integrate with other Azure and third-party services.

- **Hybrid connections** - Access on-premises data using [hybrid connections](../biztalk-services/integration-hybrid-connection-overview.md) and [VNET](../app-service-web/web-sites-integrate-with-vnet.md).

- **Visual Studio integration** - Dedicated tools in Visual Studio streamline the work of creating, deploying, consuming, debugging, and managing web apps, mobile apps, and API apps.

## Get Started with App Service

[Create a temporary web app, mobile app, or logic app](http://go.microsoft.com/fwlink/?LinkId=523751) right away for free, with no credit card required, no commitments, no hassles.

Or open a [free Azure account](https://azure.microsoft.com/pricing/free-trial/), and try one of our getting-started tutorials:

* [Web Apps](https://azure.microsoft.com/documentation/services/app-service/web/)
* [Mobile Apps](https://azure.microsoft.com/documentation/services/app-service/mobile/)
* [API Apps](https://azure.microsoft.com/documentation/services/app-service/api/)
* [Logic Apps](https://azure.microsoft.com/documentation/services/app-service/logic/)
