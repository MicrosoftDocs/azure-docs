---
title: I use Mobile Services, how does App Service help?
description: Learn what advantages does App Service bring to your existing Mobile Services projects.
services: app-service\mobile
documentationcenter: ios
author: conceptdev
manager: crdun
editor: ''

ms.assetid: 26b68a11-8352-4f78-acd2-e4e0ec177781
ms.service: app-service-mobile
ms.workload: mobile
ms.tgt_pltfrm: mobile-multiple
ms.devlang: na
ms.topic: get-started-article
ms.date: 10/01/2016
ms.author: crdun

---
# <a name="getting-started"> </a>I use Mobile Services, how does App Service help?
## Overview
Your existing Mobile Service is safe and will remain supported. However, there are advantages that the *Azure App Service* platform provides for your mobile app
that are not available today with Mobile Services:

* Simpler, easier, and more cost effective offering for apps that include both web and mobile clients
* New host features including Web Jobs, custom CNames, better monitoring
* Integration with Traffic Manager
* Connectivity to your on-premises resources and VPNs using VNet in addition to Hybrid Connections
* Monitoring, alerting and  troubleshooting for your app using AppInsights
* Richer spectrum of the underlying compute resources and pricing
* Built-in auto scale, load balancing, and performance monitoring.
* Built-in staging, backup, roll-back, and testing-in-production capabilities

## New hosting features
In *Azure App Service*, the *Mobile App* backend code runs in the same container as Web App and API App. You can take advantage of all the features in
this container, including some that are not currently present in Mobile Services:

* Add continuously running backend logic via Web Jobs
* Ensure your backend code is always running
* Use custom CNames to provide friendly and stable names to your mobile backend endpoints
* Geo-scale your app with Traffic Manager
* Include any libraries and packages you want.
* (For .NET) Use any feature of ASP.NET, including MVC
* (For Node.js) Use any pure JavaScript library of the Node ecosystem, including common MVC libraries.

## Access on-premises data using VNet
With Mobile Services today, you can already use Hybrid Connections to access on-premises resources. However there are situations where a VPN
solution is preferred. With *Azure App Service*, you can use Azure VNet for your Mobile App backend code.

## Use your favorite backend language
*Azure App Service* offers broader and richer support for ASP.NET and Node.js platforms, including access to the latest runtimes.

## Set up automatic scale
With Mobile Services, all instances of your backend code were running on Small VMs. *Azure App Service* enables you to select the size of the
VMs from a much richer set of options. You can also  quickly scale up or out to handle any incoming customer load, based on various performance metrics.

## Be in the “know”
React to issues in real time with monitoring and alerts to automatically notify you and your team. Integrate advanced app analytics and monitoring
functionality from AppInsights to get insight into how your mobile app is performing. With *Azure App Service*, you can now
set up alerts based on variety of performance metrics, either programmatically and via the Azure portal.

## Keep your assets safe
Automatically back up your backend and database. Your code and data is secure from disaster and easily restored, allowing you to run your business with confidence.

## Ready, Stage, Go!
With *Azure App Service*, you can now create multiple private testing and staging environments for your mobile apps. Use them to perform testing
before you deploy. Swap to production with no downtime. Web apps are pre-loaded, ensuring the best customer experience.

You can start taking advantage of *App Service* for your existing Mobile Service by following this [tutorial](app-service-mobile-migrating-from-mobile-services.md).
