<properties 
	pageTitle="Azure App Service and its impact on existing Azure services" 
	description="Explains how the new Azure App Service and its features impact existing services in Azure." 
	authors="yochayk" 
	writer="yochayk" 
	editor="yochayk" 
	manager="nirma" 
	services="app-service\web" 
	documentationCenter=""/>

<tags 
	ms.service="app-service-web" 
	ms.workload="web" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="03/24/2015" 
	ms.author="yochayk"/>


# Azure App Service and existing Azure services

This article outlines the changes to existing Azure services as part of the change to bring together several Azure services into [Azure App Service](http://azure.microsoft.com/services/app-service/), a new integrated offering.

## Overview 

[Azure App Service](http://azure.microsoft.com/services/app-service/) is a new and unique cloud service that enables developers to create web and mobile apps for any platform and any device. App Service is an integrated solution designed to streamline repeated coding functions, integrate with enterprise and SaaS systems, and automate business processes while meeting your needs for security, reliability, and scalability.

App Service brings together the following existing Azure services - [Websites](http://azure.microsoft.com/services/websites/), [Mobile Services](http://azure.microsoft.com/services/mobile-services/), and [Biztalk Services](http://azure.microsoft.com/services/biztalk-services/) into a single combined service, while adding powerful new capabilities.  App Service allows you to host the following app types: 

-   Web Apps
-   Mobile Apps
-   API Apps
-   Logic Apps

The following table explains how existing Azure services map to App Service and the app types available within it.

<table>
<thead>
<tr class="header">
<th align="left", style="width:10%">Existing Azure Service</th>
<th align="left", style="width:10%">Azure App Service</th>
<th align="left", style="width:80%">What changed</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td align="left">Azure Websites</td>
<td align="left">Web Apps</td>
<td align="left"><li>For Azure Websites, App Service is strictly limited to changing the name  Websites to Web Apps.
<p><li>All your existing instances of Websites are now Web Apps in App Service.</p>
<p><li>You can access your existing websites via the <a href="http://go.microsoft.com/fwlink/?LinkId=529715">Azure Portal</a>, where you will find all your existing sites under <em>Web Apps</em>.</p>
<p><li><em>Web Hosting Plan</em> is now <em>App Service Plan</em>. An <em>App Service Plan</em> can host any app type of App Service, such as Web, Mobile, Logic, or API apps.</p>
<p><li>Azure App Service Web Apps is in General Availability.</p>
<p><li><a href="http://azure.microsoft.com/services/app-service/web/">Learn more about Web Apps</a>.</p></td>
</tr>
<tr class="even">
<td align="left">Azure Mobile Services</td>
<td align="left">Mobile Apps</td>
<td align="left"><p><li>Mobile Services continue to be available as a standalone service and remain fully supported.</p>
<p><li>Mobile Apps is a new app type in App Service, which integrates all of the functionality of Mobile Services and more. Mobile Apps is in public preview.</p>
<p><li>It is easy to <a href="http://azure.microsoft.com/documentation/articles/app-service-mobile-dotnet-backend-migrating-from-mobile-services-preview/">migrate from Mobile Services to Mobile Apps</a>. Since Mobile Apps are still in preview it is not yet recommended for running production apps.</p>
<p><li>As part of App Service, Mobile Apps get new capabilities beyond Mobile Services, such as  integration with on-premises and SaaS systems, staging slots, WebJobs, better scaling options, and more.</p>
<p><li><a href="http://azure.microsoft.com/services/app-service/mobile/">Learn more about Mobile Apps</a>.</p>
</tr>
<tr class="odd">
<td align="left"></td>
<td align="left">API Apps</td>
<td align="left">
<p><li>API Apps is a new app type in App Service that lets you easily build and consume APIs in the cloud.</p>
<p><li><a href="http://azure.microsoft.com/services/app-service/api/">Learn more about API Apps</a>.</p></td>
</tr>
<tr class="even">
<td align="left"></td>
<td align="left">Logic Apps</td>
<td align="left">
<p><li>Logic Apps is a new app type in App Service that lets you easily automate business process.</p>
<p><li><a href="http://azure.microsoft.com/services/app-service/logic/">Learn more about Logic Apps</a>.</p></td>
</tr>
<tr class="odd">
<td align="left">Azure BizTalk Services</td>
<td align="left">BizTalk API Apps</td>
<td align="left">
<li><p>BizTalk Services continue to be available as a standalone service and remain fully supported.</p>
<li><p>All the capabilities of BizTalk Services are integrated into App Service as API Apps enabling users to perform enterprise application integration and B2B integration scenarios with any of the app types in App Service</p>
<li><p>With Logic Apps you can now automate business processes using a visual design experience to create workflows</p></td>
</tr>
</tbody>
</table>

To learn more, please visit [App Service documentation](http://azure.microsoft.com/documentation/services/app-service/).
