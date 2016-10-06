<properties 
	pageTitle="Introduction to App Service on Linux | Microsoft Azure" 
	description="Learn about App Service on Linux." 
	keywords="azure app service, linux, oss"
	services="app-service" 
	documentationCenter="" 
	authors="naziml" 
	manager="wpickett" 
	editor=""/>

<tags 
	ms.service="app-service" 
	ms.workload="na" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="10/10/2016" 
	ms.author="naziml"/>

# Introduction to App Service on Linux
App Service on Linux is currently in Public Preview and supports running web apps natively on Linux. 

## Overview ##
Customers can use App Service on Linux to host web apps natively on Linux for supported application stacks. The following features section lists the currently supported application stacks.

## Features ##
App Service on Linux currently supports the following application stacks

- Node.js
- PHP

Customers can deploy their applications using

- FTP.
- Local Git.
- GitHub or BitBucket.

For application scaling


- Customers can scale their web app up and down by changing the tier in their App Service Plan. 
- Customers can scale out their applications out and run their app across multiple instances within the confines of their SKU.

For Kudu some of the basic functionality will work

- Environment.
- Deployments.
- Basic console.

## Limitations ##

The Azure management portal will only show currently supported features for App Service on Linux and hide the rest. As our team enabling more features we will keep reflecting this on the management portal. Some features like VNET integration and AAD / third-party authentication or Kudu site extensions do not currently work. But as we get these working we will update our documentation and blog about changes.

This public preview is currently only available in the following regions

-	West US.
-	West Europe.
-	Southeast Asia.

Web app on Linux is only supported in Dedicated App Service Plans and does not have a Free or Shared tier. Also, app service plans for regular and Linux web apps are mutually exclusive, so you cannot create a Linux web app in a non-Linux app service plan.

Due to the lack of overlapped recycling of the web apps, customers should expect a small downtime in the event of a web app got restarted. 

## Next Steps ##

Follow the following links to get started with App Service on Linux. Please post questions and concerns on [our forum](https://social.msdn.microsoft.com/forums/azure/home?forum=windowsazurewebsitespreview).

* [Creating Web Apps in App Service on Linux](./app-service-linux-how-to-create-a-web-app.md)
* [Using PM2 Configuration for Node.js in Web Apps on Linux](./app-service-linux-using-nodejs-pm2.md)

