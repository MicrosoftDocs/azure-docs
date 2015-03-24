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


# Azure App Service and its impact on existing Azure services

This article outlines the changes to existing Azure
services as part of the move to consolidate several existing as well as new Azure services
under the App Service brand. It explains the change and impact of the new branding.

## Overview 

Azure App Service is a one-of-a-kind cloud service that enables you to create enterprise grade web and mobile apps for any platform or device, fast. App Service is an integrated solution designed to streamline repeated coding functions, integrate with enterprise and SaaS systems, and automate business processes while meeting your company’s requirements for security, reliability, and scalability. App Service provides an integrated cloud app platform that spans the diverse needs of modern
enterprise apps across both client and mobile devices. Azure App Service includes the following pieces:

-   Web Apps
-   Mobile Apps
-   API Apps
-   Logic Apps
-   BizTalk Connectors

Azure already offers Websites and Mobile Services. The following tables
explain how App Service impacts these existing services and adds new features.

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
<td align="left"><li>For Azure Websites, Azure App Service is strictly limited to changing the name Azure Websites to Azure App Service Web Apps.
<p><li>All your existing instances of Azure Websites are now Web Apps.</p>
<p><li>You can access your existing websites via the <a href="http://go.microsoft.com/fwlink/?LinkId=529715">Azure Portal</a>, where you will find all your existing sites under <em>Web Apps</em>.</p>
<p><li><em>Web Hosting Plan</em> is now <em>App Service Plan</em>. An <em>App Service Plan</em> can host any service type of App Service, such as Web, Mobile, Logic, or API apps.</p>
<p><li>Azure App Service Web Apps is in General Availability.</p>
<p><li>Learn more about Web Apps.</p></td>
</tr>
<tr class="even">
<td align="left">Azure Mobile Services</td>
<td align="left">Mobile Apps</td>
<td align="left"><p><li>The existing Mobile Services keeps working without any changes.</p>
<p><li>Mobile Apps is a new service in Azure as part of the App Service platform, and it is in Public Preview.</p>
<p><li>Migration from Mobile Services to Azure App Service Mobile Apps will be available when Mobile Apps become General Availability.</p>
<p><li>You can create and manage mobile apps in Azure App Service in the Azure Portal.</p>
<p><li>Mobile Apps can access more of the underlying App Service functionality, such as continuous integration and DevOps.</p>
<p><li>Mobile Apps can seamlessly integrate with other app types that are included in App Service</p>
<p><li>Learn more about Mobile Apps.</p>
<p><li>Learn more about Mobile Services vs. App Service Mobile Apps.</p></td>
</tr>
<tr class="odd">
<td align="left"></td>
<td align="left">API Apps</td>
<td align="left">API Apps is a new service in Azure as part of the App Service platform, and it is in Public Preview.</td>
</tr>
<tr class="even">
<td align="left"></td>
<td align="left">Logic Apps</td>
<td align="left">Logic Apps is a new service in Azure as part of the App Service platform, and it is in Public Preview.</td>
</tr>
<tr class="odd">
<td align="left">Azure BizTalk Services</td>
<td align="left">BizTalk Connectors</td>
<td align="left"><li><p>API Apps and Logic Apps will come bundled with an extensive set of BizTalk connectors allowing access to many standard enterprise on-premises and and software-as-a-service solutions.</p></td>
</tr>
</tbody>
</table>

[Learn more about App Service]: http://azure.microsoft.com/documentation/services/app-service/
[Azure Portal]: http://go.microsoft.com/fwlink/?LinkId=529715

## What's changed
* For a guide to the change from Websites to App Service see: [Azure App Service and Its Impact on Existing Azure Services](http://go.microsoft.com/fwlink/?LinkId=529714)
* For a guide to the change of the old portal to the new portal see: [Reference for navigating the preview portal](http://go.microsoft.com/fwlink/?LinkId=529715)
