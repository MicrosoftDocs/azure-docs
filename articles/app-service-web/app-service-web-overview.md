<properties
	pageTitle="Web Apps overview | Microsoft Azure"
	description="Learn how Azure App Service helps you develop and host web applications"
	services="app-service\web"
	documentationCenter=""
	authors="jaime-espinosa"
	manager="wpickett"
	editor=""/>

<tags
	ms.service="app-service-web"
	ms.workload="web"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="05/16/2016"
	ms.author="tdykstra"/>

# Web Apps overview

*App Service Web Apps* is a fully managed compute platform that is optimized for hosting websites and web applications. This [platform-as-a-service](https://en.wikipedia.org/wiki/Platform_as_a_service) (PaaS) offering of Microsoft Azure lets you focus on your business logic while Azure takes care of the infrastructure to run and scale your apps.

For a 5-minute video overview, see [Azure App Service Web Apps with Yochay Kiriaty](https://azure.microsoft.com/documentation/videos/azure-app-service-web-apps-with-yochay-kiriaty/).

## What is a web app in App Service?

In App Service, a *web app* is the compute resources that Azure provides for hosting a website or web application.  

The compute resources may be on shared or dedicated virtual machines (VMs), depending on the pricing tier that you choose. Your application code runs in a managed VM that is isolated from other customers.

Your code can be in any language or framework that is supported by [Azure App Service](../app-service/app-service-value-prop-what-is.md), such as ASP.NET, Node.js, Java, PHP, or Python. You can also run scripts that use [PowerShell and other scripting languages](web-sites-create-web-jobs.md#acceptablefiles) in a web app.

For examples of typical application scenarios that you can use Web Apps for, see [Web app scenarios](https://azure.microsoft.com/documentation/scenarios/web-app/). 

## Why use Web Apps?

Here are some key features of Web Apps:

- **Familiar and fast** - Use your existing skills to code in your favorite language, framework, and integrated development environment (IDE). Provision new web apps and deploy code to them in seconds.

- **Enterprise-grade** - Web Apps is designed for building and hosting secure mission-critical applications. Build Active Directory integrated business apps that connect securely to on-premises resources, then host them on a secure cloud platform that is [ISO](https://www.microsoft.com/TrustCenter/Compliance/ISO-IEC-27001), [SOC](https://www.microsoft.com/TrustCenter/Compliance/SOC), and [PCI](https://www.microsoft.com/TrustCenter/Compliance/pci) compliant. All with an enterprise-level [SLA](https://azure.microsoft.com/support/legal/sla/app-service/).

- **Global scale** - Web Apps enables you to quickly scale [up](../app-service/app-service-scale.md) or [out](../azure-portal/insights-how-to-scale.md) to handle any incoming customer load. Manually select the number and size of VMs or set up auto-scaling based on load or schedule. Microsoft's global datacenter infrastructure hosts your web apps and makes it easy to replicate data and hosting services in multiple locations.  

- **Azure Marketplace** - Select from an ever-growing [list of web application templates](https://azure.microsoft.com/marketplace/). Leverage the best of the OSS app community with one-click installation of packages such as Wordpress, Joomla and Drupal.

- **Continuous Integration** - Set up [continuous integration and deployment](app-service-continous-deployment.md) workflows with Visual Studio Team Services, GitHub, or BitBucket.  Automatically build, test, and deploy your web app on each successful code check-in or integration tests.

- **Staging and test environments** - Implement [staged deployment](web-sites-staged-publishing.md) to verify your code in a preproduction environment that is identical to your production environment. When you're ready, release a new version of your app with zero downtime by performing a swap operation. 

- **Testing in Production** - Take staged deployments to the next level and [perform A/B testing](app-service-web-test-in-production-get-start.md) to verify your new code with a configurable fraction of your live traffic. 

- **WebJobs** - [Run any program or script](web-sites-create-web-jobs.md) on Web Apps VMs. Run jobs continuously, on a schedule, or triggered by events. The Azure [WebJobs SDK](websites-dotnet-webjobs-sdk-get-started.md) simplifies the code you write to integrate with other Azure services such as Storage queues, blobs, and tables, and Service Bus queues and topics.

- **Hybrid connections** - Access on-premises data using [hybrid connections](../biztalk-services/integration-hybrid-connection-overview.md) and [VNET](../app-service-web/web-sites-integrate-with-vnet.md).

- **Visual Studio integration** - Dedicated tools in Visual Studio streamline the work of creating, deploying, consuming, debugging, and managing web apps. For more information, see [Announcing the Azure SDK 2.8.1 for .NET](https://azure.microsoft.com/blog/announcing-azure-sdk-2-8-1-for-net/).

In addition, a web app can take advantage of features offered by [API Apps](../app-service-api/app-service-api-apps-why-best-platform.md) (such as CORS support) and [Mobile Apps](../app-service-mobile/app-service-mobile-value-prop.md) (such as push notifications). The reverse is also true: you can use an API app or mobile app to host a web application and take advantage of Web Apps features such as auto scaling and staged deployment. The only difference between these three app types (API, web, mobile) is the name and icon used for them in the Azure portal. For more information about app types in App Service, see [Azure App Service overview](../app-service/app-service-value-prop-what-is.md).

## Getting started

To get started by deploying sample code to a new web app in App Service, follow the [Deploy your first web app to Azure in 5 minutes](app-service-web-get-started.md) tutorial. You'll need a free Azure account.

If you want to get started with Azure App Service before signing up for an Azure account, go to [Try App Service](http://go.microsoft.com/fwlink/?LinkId=523751), where you can immediately create a short-lived starter web app in App Service. No credit cards required; no commitments.
