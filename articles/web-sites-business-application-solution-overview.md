<properties 
	pageTitle="Create a Line-of-Business Application on Azure Websites" 
	description="This guide provides a technical overview of how to use Azure Websites to create intranet, line-of-business applications. This includes authentication strategies, service bus relay, and monitoring." 
	editor="jimbe" 
	manager="wpickett" 
	authors="cephalin" 
	services="web-sites" 
	documentationCenter=""/>

<tags 
	ms.service="web-sites" 
	ms.workload="web" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="02/02/2015" 
	ms.author="cephalin"/>



# Create a Line-of-Business Application on Azure Websites

[Azure Websites] is a great choice for line-of-business applications. These applications are intranet applications that should be secured for internal business use. They usually require authentication, typically against a corporate directory, and some access to or integration with on-premises data and services. 

There are major benefits of moving line-of-business applications to the Azure Websites, such as:

-  scale up and down with dynamic workloads, such as an application that handles annual performance reviews. During the review period, traffic would spike to high levels for a large company. Azure provides scaling options that enable the company to scale out to handle the load during the high-traffic review period while saving money by scaling back for the rest of the year. 
-  focus more on application development and less on infrastructure acquisition and management
-  greater support for employees and partners to use the application from anywhere. Users do not need to be connected to the corporate network through in order to use the application, and the IT group avoids complex reverse proxy solutions. There are several authentication options to make sure that access to company applications are protected.

Below is an example of a line-of-business application running on Azure Websites. It demonstrates what you can do simply by composing Azure Websites together with other services with minimal technical investments. **Click on an element in the topography to read more about it.** 

<object type="image/svg+xml" data="https://sidneyhcontent.blob.core.windows.net/documentation/web-app-notitle.svg" width="100%" height="100%"></object>

> [AZURE.NOTE]
> This guide presents some of the most common areas and tasks that are aligned with line-of-business applications. However, there are other capabilities of Azure Websites that you can use in your specific implementation. To review these capabilities, also see the other guides on [Global Web Presence](../web-sites-global-web-presence-solution-overview/) and [Digital Marketing Campaigns](../web-sites-digital-marketing-application-solution-overview/).

## Bring existing assets

Bring your existing web assets to Azure Websites from a variety of languages and frameworks.

Your existing web assets can run on Azure Websites, whether they are .NET, PHP, Java, Node.js, or Python. You can move them to Azure Websites using your familiar [FTP] tools or your source control management system. Azure Websites supports direct publishing from popular source control options, such as [Visual Studio], [Visual Studio Online], and [Git] (local, GitHub, BitBucket, DropBox, Mercurial, etc.).

## Secure your assets

Secure assets by encryption, authenticate corporate users whether they are on-site or remote, and authorize their use of assets. 

Protect internal assets against eavesdroppers with [HTTPS]. The **\*.azurewebsites.net** domain name already comes with an SSL certificate, and if you use your custom domain, you can bring your SSL certificate for it to Azure Websites. There is a monthly charge (prorated hourly) associated with each SSL certificate. For more information, see [Websites Pricing Details].

[Authenticate users] against the corporate directory. Azure Websites can authenticate users with on-premises identity providers, such as Active Directory Federation Services (AD FS), or with an Azure Active Directory tenant that has been synchronized with your corporate Active Directory deployment. Users can access your web properties in Azure Websites through single sign-on when they are on-site and when they are in the field. Existing services, such as Office 365 or Windows Intune, already use Azure Active Directory. Through [Easy Auth], turning on authentication with the same Azure Active Directory tenant for your website is very easy. 

[Authorize users] for their use of web properties. With minimal additional code, you can bring the same on-premises ASP.NET coding pattern to Azure Websites using the `[Authorize]` decoration, for example. You retain the same flexibility for fine-grain access control as the applications you maintain on-premises.

## Connect to on-premises resources ##

Connect to your website data or resources, whether it's in the cloud for performance or on-premises for compliance. For more information on keeping data in Azure, see [Azure Trust Center]. 

You can choose from various database backends in Azure to meet the needs of your website, including [Azure SQL Database] and [MySQL]. Keeping your data securely in Azure makes data close to your website geographically and optimizes its performance.

However, your business may require its data to be kept on-premises. Azure Websites lets you easily set up a [hybrid connection] to your on-premise resource such as a database backend. If you want unified management of your on-premises connections, you integrate many Azure Websites with one [Azure Virtual Network] that has a site-to-site VPN. You can then access on-premises resources as if your Azure websites are on-premises. [Enterprise Pizza - Connecting Web Sites to On-premise Using Service Bus][enterprisepizza]

## Optimize

Optimize your line-of-business application by scaling automatically with Autoscale, caching with Azure Redis Cache, running background tasks with WebJobs, and maintaining high availability with Azure Traffic Manager.

Azure Websites' ability to [scale up and out] meets the need of your line-of-business application, regardless of the size of your workload. Scale out your website manually through the [Azure Management Portal], programmatically through the [Service Management API] or [PowerShell scripting], or automatically through the Autoscale feature. In **Standard** hosting plan, Autoscale enables you to scale out a website automatically based on CPU utilization. For best practices, see [Troy Hunt]'s [10 things I learned about rapidly scaling websites with Azure].

Make your website more responsive with the [Azure Redis Cache]. Use it to cache data from backend databases and other things such as the [ASP.NET session state] and [output cache].

Maintain high availability of your website using [Azure Traffic Manager]. Using the **Failover** method, Traffic Manager automatically routes traffic to a secondary site if there is a problem on the primary site.

## Monitor and analyze

Stay up-to-date on your website's performance with Azure or third-party tools. Receive alerts on critical website events. Gain user insight easily with Application Insight or with web log analytics from HDInsight. 

Get a [quick glance] of the website's current performance metrics and resource quotas in the Azure Websites dashboard. For a 360° view of your application across availability, performance and usage, use [Azure Application Insights] to give you fast & powerful troubleshooting, diagnostics and usage insights. Or, use a third-party tool like [New Relic] to provide advanced monitoring data for your websites.

In the **Standard** hosting plan, monitor site responsiveness receive email notifications whenever your site becomes unresponsive. For more information, see [How to: Receive Alert Notifications and Manage Alert Rules in Azure].

## More Resources

- [Azure Websites Documentation](/documentation/services/websites/)
- [Learning map for Azure Websites](../websites-learning-map/)
- [Azure Web Blog](/blog/topics/web/)



[Azure Websites]:/services/websites/

[FTP]:../web-sites-deploy/#ftp
[Visual Studio]:../web-sites-dotnet-get-started/
[Visual Studio Online]:../cloud-services-continuous-delivery-use-vso/
[Git]:../web-sites-publish-source-control/

[HTTPS]:../web-sites-configure-ssl-certificate/
[Websites Pricing Details]:/pricing/details/web-sites/#service-ssl
[Authenticate users]:../web-sites-authentication-authorization/
[Easy Auth]:/blog/2014/11/13/azure-websites-authentication-authorization/
[Authorize users]:../web-sites-authentication-authorization/

[Azure Trust Center]:/support/trust-center/
[MySQL]:../web-sites-php-mysql-deploy-use-git/
[Azure SQL Database]:../web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database/
[hybrid connection]:../web-sites-hybrid-connection-get-started/
[Azure Virtual Network]:../web-sites-integrate-with-vnet/

[scale up and out]:../web-sites-scale/
[Azure Management Portal]:http://manage.windowsazure.com/
[Service Management API]:http://msdn.microsoft.com/library/windowsazure/ee460799.aspx
[PowerShell scripting]:http://msdn.microsoft.com/library/windowsazure/jj152841.aspx
[Troy Hunt]:https://twitter.com/troyhunt
[10 things I learned about rapidly scaling websites with Azure]:http://www.troyhunt.com/2014/09/10-things-i-learned-about-rapidly.html
[Azure Redis Cache]:/blog/2014/06/05/mvc-movie-app-with-azure-redis-cache-in-15-minutes/
[ASP.NET session state]:https://msdn.microsoft.com/library/azure/dn690522.aspx
[output cache]:https://msdn.microsoft.com/library/azure/dn798898.aspx

[quick glance]:../web-sites-monitor/
[Azure Application Insights]:http://blogs.msdn.com/b/visualstudioalm/archive/2015/01/07/application-insights-and-azure-websites.aspx
[New Relic]:../store-new-relic-cloud-services-dotnet-application-performance-management/
[How to: Receive Alert Notifications and Manage Alert Rules in Azure]:http://msdn.microsoft.com/library/windowsazure/dn306638.aspx

