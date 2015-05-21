<properties 
	pageTitle="Create a line-of-business web app on Azure App Service" 
	description="This guide provides a technical overview of how to use Azure App Service Web Apps to create intranet, line-of-business applications. This includes authentication strategies, service bus relay, and monitoring." 
	editor="jimbe" 
	manager="wpickett" 
	authors="cephalin" 
	services="app-service\web" 
	documentationCenter=""/>

<tags 
	ms.service="app-service-web" 
	ms.workload="web" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/08/2015" 
	ms.author="cephalin"/>



# Create a line-of-business web app on Azure App Service

[Azure App Service](http://go.microsoft.com/fwlink/?LinkId=529714) Web Apps is a great choice for line-of-business applications. These applications are intranet applications that should be secured for internal business use. They usually require authentication, typically against a corporate directory, and some access to or integration with on-premises data and services. 

There are major benefits of moving line-of-business applications to App Service Web Apps, such as:

-  scale up and down with dynamic workloads, such as an application that handles annual performance reviews. During the review period, traffic would spike to high levels for a large company. Azure provides scaling options that enable the company to scale out to handle the load during the high-traffic review period while saving money by scaling back for the rest of the year. 
-  focus more on application development and less on infrastructure acquisition and management
-  greater support for employees and partners to use the application from anywhere. Users do not need to be connected to the corporate network through in order to use the application, and the IT group avoids complex reverse proxy solutions. There are several authentication options to make sure that access to company applications are protected.

Below is an example of a line-of-business application running on App Service Web Apps. It demonstrates what you can do simply by composing Web Apps together with other services with minimal technical investments. **Click on an element in the topography to read more about it.** 

<object type="image/svg+xml" data="https://sidneyhcontent.blob.core.windows.net/documentation/web-app-notitle.svg" width="100%" height="100%"></object>

> [AZURE.NOTE]
> This guide presents some of the most common areas and tasks that are aligned with line-of-business applications. However, there are other capabilities of Azure App Service Web Apps that you can use in your specific implementation. To review these capabilities, also see the other guides on [Global Web Presence](web-sites-global-web-presence-solution-overview.md) and [Digital Marketing Campaigns](web-sites-digital-marketing-application-solution-overview.md).

## Bring existing assets

Bring your existing web assets to App Service Web Apps from a variety of languages and frameworks.

Your existing web assets can run on App Service Web Apps, whether they are .NET, PHP, Java, Node.js, or Python. You can move them to Web Apps using your familiar [FTP] tools or your source control management system. Web Apps supports direct publishing from popular source control options, such as [Visual Studio], [Visual Studio Online], and [Git] (local, GitHub, BitBucket, DropBox, Mercurial, etc.).

## Secure your assets

Secure assets by encryption, authenticate corporate users whether they are on-site or remote, and authorize their use of assets. 

Protect internal assets against eavesdroppers with [HTTPS]. The **\*.azurewebsites.net** domain name already comes with an SSL certificate, and if you use your custom domain, you can bring your SSL certificate for it to App Service Web Apps. There is a monthly charge (prorated hourly) associated with each SSL certificate. For more information, see [App Service Pricing Details].

[Authenticate users] against the corporate directory. App Service Web Apps can authenticate users with on-premises identity providers, such as Active Directory Federation Services (AD FS), or with an Azure Active Directory tenant that has been synchronized with your corporate Active Directory deployment. Users can access your web properties in Web Apps through single sign-on when they are on-site and when they are in the field. Existing services, such as Office 365 or Windows Intune, already use Azure Active Directory. Through [Easy Auth], turning on authentication with the same Azure Active Directory tenant for your web app is very easy. 

[Authorize users] for their use of web properties. With minimal additional code, you can bring the same on-premises ASP.NET coding pattern to App Service Web Apps using the `[Authorize]` decoration, for example. You retain the same flexibility for fine-grain access control as the applications you maintain on-premises.

## Connect to on-premises resources ##

Connect to your web app data or resources, whether it's in the cloud for performance or on-premises for compliance. For more information on keeping data in Azure, see [Azure Trust Center]. 

You can choose from various database backends in Azure to meet the needs of your web app, including [Azure SQL Database] and [MySQL]. Keeping your data securely in Azure makes data close to your web app geographically and optimizes its performance.

However, your business may require its data to be kept on-premises. App Service Web Apps lets you easily set up a [hybrid connection] to your on-premise resource such as a database backend. If you want unified management of your on-premises connections, you integrate many web apps with one [Azure Virtual Network] that has a site-to-site VPN. You can then access on-premises resources as if your web apps are on-premises.

## Optimize

Optimize your line-of-business application by scaling automatically with Autoscale, caching with Azure Redis Cache, running background tasks with WebJobs, and maintaining high availability with Azure Traffic Manager.

The ability of App Service Web Apps to [scale up and out] meets the need of your line-of-business application, regardless of the size of your workload. Scale out your web app manually through the [Azure Management Portal], programmatically through the [Service Management API] or [PowerShell scripting], or automatically through the Autoscale feature. In the **Standard** tier, Autoscale enables you to scale out a web app automatically based on CPU utilization. For best practices, see [Troy Hunt]'s [10 things I learned about rapidly scaling web apps with Azure].

Make your web app more responsive with the [Azure Redis Cache]. Use it to cache data from backend databases and other things such as the [ASP.NET session state] and [output cache].

Maintain high availability of your web app using [Azure Traffic Manager]. Using the **Failover** method, Traffic Manager automatically routes traffic to a secondary site if there is a problem on the primary site.

## Monitor and analyze

Stay up-to-date on your web app's performance with Azure or third-party tools. Receive alerts on critical web app events. Gain user insight easily with Application Insight or with web log analytics from HDInsight. 

Get a [quick glance] of the web app's current performance metrics and resource quotas in the web app's blade in the [Azure preview portal](http://go.microsoft.com/fwlink/?LinkId=529715). For a 360° view of your application across availability, performance and usage, use [Azure Application Insights] to give you fast & powerful troubleshooting, diagnostics and usage insights. Or, use a third-party tool like [New Relic] to provide advanced monitoring data for your web apps.

In the **Standard** tier, monitor app responsiveness receive email notifications whenever your app becomes unresponsive. For more information, see [How to: Receive Alert Notifications and Manage Alert Rules in Azure].

## More Resources

- [App Service Web Apps Documentation](/services/app-service/web/)
- [Learning Map for Azure App Service Web Apps](websites-learning-map.md)
- [Azure Web Blog](/blog/topics/web/)

>[AZURE.NOTE] If you want to get started with Azure App Service before signing up for an Azure account, go to [Try App Service](http://go.microsoft.com/fwlink/?LinkId=523751), where you can immediately create a short-lived starter web app in App Service. No credit cards required; no commitments.

[AZURE.INCLUDE [app-service-web-whats-changed](../includes/app-service-web-whats-changed.md)]



[Azure App Service]: /services/app-service/web/

[FTP]:web-sites-deploy.md#ftp
[Visual Studio]:web-sites-dotnet-get-started.md
[Visual Studio Online]:cloud-services-continuous-delivery-use-vso.md
[Git]:web-sites-publish-source-control.md

[HTTPS]:web-sites-configure-ssl-certificate.md
[App Service Pricing Details]: /pricing/details/app-service/#ssl-connections
[Authenticate users]:web-sites-authentication-authorization.md
[Easy Auth]:/blog/2014/11/13/azure-websites-authentication-authorization/
[Authorize users]:web-sites-authentication-authorization.md

[Azure Trust Center]:/support/trust-center/
[MySQL]:web-sites-php-mysql-deploy-use-git.md
[Azure SQL Database]:web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database.md
[hybrid connection]:web-sites-hybrid-connection-get-started.md
[Azure Virtual Network]:web-sites-integrate-with-vnet.md

[scale up and out]:web-sites-scale.md
[Azure Management Portal]:http://manage.windowsazure.com/
[Service Management API]:http://msdn.microsoft.com/library/windowsazure/ee460799.aspx
[PowerShell scripting]:http://msdn.microsoft.com/library/windowsazure/jj152841.aspx
[Troy Hunt]:https://twitter.com/troyhunt
[10 things I learned about rapidly scaling web apps with Azure]:http://www.troyhunt.com/2014/09/10-things-i-learned-about-rapidly.html
[Azure Redis Cache]:/blog/2014/06/05/mvc-movie-app-with-azure-redis-cache-in-15-minutes/
[ASP.NET session state]:https://msdn.microsoft.com/library/azure/dn690522.aspx
[output cache]:https://msdn.microsoft.com/library/azure/dn798898.aspx

[quick glance]:web-sites-monitor.md
[Azure Application Insights]:http://blogs.msdn.com/b/visualstudioalm/archive/2015/01/07/application-insights-and-azure-websites.aspx
[New Relic]:store-new-relic-cloud-services-dotnet-application-performance-management.md
[How to: Receive Alert Notifications and Manage Alert Rules in Azure]:http://msdn.microsoft.com/library/windowsazure/dn306638.aspx

