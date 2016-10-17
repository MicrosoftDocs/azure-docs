<properties
	pageTitle="How Azure App Service Works"
	description="Learn how App Service work"
	keywords="app service, azure app service, scale, scalable, app service plan, app service cost"
	services="app-service"
	documentationCenter=""
	authors="yochay"
	manager="wpickett"
	editor=""/>

<tags
	ms.service="app-service"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="hero-article"
	ms.date="02/10/2016"
	ms.author="yochay"/>

# How App Service Works

Azure App Service is a cloud service that's designed to solve the practical problems that face engineers today.
App Service is focused on providing superior developer productivity without compromising on the need to deliver applications at cloud scale.

App Service also provides the features and frameworks necessary to compose enterprise Line-of-Business applications while supporting developers with the most popular development languages (.NET, Java, PHP, Node.JS and Python).
With App Service developers can:

* Build highly scalable web apps
* Quickly build Mobile App back ends with a set of easy-to-use mobile capabilities such as data back ends, user authentication, and push notifications with Mobile Apps.
* Implement, deploy, and publish APIs with API Apps.
* Tie business applications together into workflows and transform data with Logic Apps.

>[AZURE.INCLUDE [app-service-linux](../../includes/app-service-linux.md)]

All app types rely on the scalable and flexible Web App platform, which enables developers to have an optimized full lifecycle experience from app design to app maintenance. The lifecycle capabilities enable the following:

- **Quick app creation**--Start from scratch or pick an OSS package from the Azure Marketplace.
- **Continuous deployment**--Automatically deploy new code from popular source control solutions such as TFS, GitHub, and BitBucket, and sync content from online storage services such as OneDrive and DropBox.
- **Test in production**--Smoothly create pre-production environments and manage the amount of traffic that's going to them. Debug in the cloud when needed, and roll back if issues are found.
- **Running asynchronous tasks and batch jobs**--Run code in a background process or activate your code based on events (such as messages landing in an Azure Storage queue) and scheduled times (CRON).
- **Scaling the app**--Use one of many options to scale your service horizontally and vertically automatically based on traffic and resource utilization. Configure private environments that are dedicated to your apps.   
- **Maintaining the app**--Leverage many of the debugging and diagnostics features to stay ahead of problems and to efficiently resolve them either in real time (with features such as auto-healing and live debugging) or after the fact by analyzing logs and memory dumps.

As a whole, App Service capabilities enable developers to focus on their code and reach a stable, highly scalable production state quickly. With the API and Logic App features, developers can build real-world enterprise applications that bridge barriers between business solutions as well as on premise to cloud integration.  

[AZURE.INCLUDE [app-service-blueprint-how-app-service-works](../../includes/app-service-blueprint-how-app-service-works.md)]
