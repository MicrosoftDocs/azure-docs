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
	ms.date="05/25/2016"
	ms.author="rachelap"/>

# Web Apps overview

*App Service Web Apps* is a fully managed compute platform that is optimized for hosting websites and web applications. This [platform-as-a-service](https://en.wikipedia.org/wiki/Platform_as_a_service) (PaaS) offering of Microsoft Azure lets you focus on your business logic while Azure takes care of the infrastructure to run and scale your apps.

The following 5-minute video introduces Azure App Service Web Apps.

[AZURE.VIDEO azure-app-service-web-apps-with-yochay-kiriaty]

## What is a web app in App Service?

In App Service, a *web app* is the compute resources that Azure provides for hosting a website or web application.  

The compute resources may be on shared or dedicated virtual machines (VMs), depending on the pricing tier that you choose. Your application code runs in a managed VM that is isolated from other customers.

Your code can be in any language or framework that is supported by [Azure App Service](../app-service/app-service-value-prop-what-is.md), such as ASP.NET, Node.js, Java, PHP, or Python. You can also run scripts that use [PowerShell and other scripting languages](web-sites-create-web-jobs.md#acceptablefiles) in a web app.

For examples of typical application scenarios that you can use Web Apps for, see [Web app scenarios](https://azure.microsoft.com/documentation/scenarios/web-app/) and the **Scenarios and recommendations** section of [Azure App Service, Virtual Machines, Service Fabric, and Cloud Services comparison](choose-web-site-cloud-service-vm.md#scenarios).

## Why use Web Apps?

Here are some key features of App Service that apply to Web Apps:

- **Multiple languages and frameworks** - App Service has first-class support for ASP.NET, Node.js, Java, PHP, and Python. You can also run [PowerShell and other scripts or executables](../app-service-web/web-sites-create-web-jobs.md) on App Service VMs.

- **DevOps optimization** - Set up [continuous integration and deployment](../app-service-web/app-service-continuous-deployment.md) with Visual Studio Team Services, GitHub, or BitBucket. Promote updates through [test and staging environments](../app-service-web/web-sites-staged-publishing.md). Perform [A/B testing](../app-service-web/app-service-web-test-in-production-get-start.md). Manage your apps in App Service by using [Azure PowerShell](../powershell-install-configure.md) or the [cross-platform command-line interface (CLI)](../xplat-cli-install.md).
 
- **Global scale with high availability** - Scale [up](../app-service-web/web-sites-scale.md) or [out](../azure-portal/insights-how-to-scale.md) manually or automatically. Host your apps anywhere in Microsoft's global datacenter infrastructure, and the App Service [SLA](https://azure.microsoft.com/support/legal/sla/app-service/) promises high availability.

- **Connections to SaaS platforms and on-premises data** - Choose from more than 50 [connectors](../connectors/apis-list.md) for enterprise systems (such as SAP, Siebel, and Oracle), SaaS services (such as Salesforce and Office 365), and internet services (such as Facebook and Twitter). Access on-premises data using [Hybrid Connections](../biztalk-services/integration-hybrid-connection-overview.md) and [Azure Virtual Networks](../app-service-web/web-sites-integrate-with-vnet.md).

- **Security and compliance** - App Service is [ISO, SOC, and PCI compliant](https://www.microsoft.com/TrustCenter/).

- **Application templates** - Choose from an extensive list of application templates in the [Azure Marketplace](https://azure.microsoft.com/marketplace/) that let you use a wizard to install popular open-source software such as WordPress, Joomla, and Drupal.

- **Visual Studio integration** - Dedicated tools in Visual Studio streamline the work of creating, deploying, and debugging.

In addition, a web app can take advantage of features offered by [API Apps](../app-service-api/app-service-api-apps-why-best-platform.md) (such as CORS support) and [Mobile Apps](../app-service-mobile/app-service-mobile-value-prop.md) (such as push notifications). For more information about app types in App Service, see [Azure App Service overview](../app-service/app-service-value-prop-what-is.md).

Besides Web Apps in App Service, Azure offers other services that can be used for hosting websites and web applications. For most scenarios, Web Apps is the best choice.  For microservice architecture, consider [Service Fabric](https://azure.microsoft.com/documentation/services/service-fabric), and if you need more control over the VMs that your code runs on, consider [Azure Virtual Machines](https://azure.microsoft.com/documentation/services/virtual-machines/). For more information about how to choose between these Azure services, see [Azure App Service, Virtual Machines, Service Fabric, and Cloud Services comparison](choose-web-site-cloud-service-vm.md).

## Getting started

To get started by deploying sample code to a new web app in App Service, follow the [Deploy your first web app to Azure in 5 minutes](app-service-web-get-started.md) tutorial. You'll need a free Azure account.

If you want to get started with Azure App Service before signing up for an Azure account, go to [Try App Service](http://go.microsoft.com/fwlink/?LinkId=523751), where you can immediately create a short-lived starter web app in App Service. No credit cards required; no commitments.
