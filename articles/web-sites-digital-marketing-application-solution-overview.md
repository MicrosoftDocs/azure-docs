<properties 
	pageTitle="Create a Digital Marketing Campaign on Azure Websites" 
	description="This guide provides a technical overview of how to use Azure Websites to create digital marketing campaigns. This includes deployment, social media integration, scaling strategies, and monitoring." 
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
	ms.date="02/02/2014" 
	ms.author="cephalin"/>

# Digital Marketing Campaigns on Azure Websites
[Azure Websites] is a great choice for digital marketing campaigns. Digital marketing campaigns are typically short-lived and are meant to drive short-term marketing goals. There are two main scenarios to consider. In the first scenario, a third-party marketing firm creates and manages the campaign for their customer for the duration of the promotion. A second scenario involves the marketing firm creating and then transferring ownership of the digital marketing campaign resources to their customer. The customer then runs and manages the digital marketing campaign on their own. is a good match for both scenarios. 

> [AZURE.NOTE] If you want to get started with Azure Websites before signing up for an account, go to <a href="https://trywebsites.azurewebsites.net/">https://trywebsites.azurewebsites.net</a>, where you can immediately create a short-lived ASP.NET starter site in Azure Websites for free. No credit card required, no commitments.

Below is an example of a global, multi-channel digital marketing campaign using Azure Websites. It demonstrates what you can do simply by composing Azure Websites together with other services with minimal technical investments. **Click on an element in the topography to read more about it.** 

<object type="image/svg+xml" data="https://sidneyhcontent.blob.core.windows.net/documentation/digital-marketing-notitle.svg" width="100%" height="100%"></object>

> [WACOM.NOTE]
> This guide presents some of the most common areas and tasks that are aligned with running a digital marketing campaign in Azure Websites. However, there are other common solutions that you can implement in Azure Websites. To review these solutions, see the other guides on <a href="http://www.windowsazure.com/en-us/manage/services/web-sites/global-web-presence-solution-overview/">Global Web Presence</a> and <a href="http://www.windowsazure.com/en-us/manage/services/web-sites/business-application-solution-overview">Business Applications</a>.

### Create from scratch or bring existing assets

Quickly create new sites from a popular CMS in the gallery or bring your existing web assets to Azure Websites from a variety of languages and frameworks.

The Azure gallery provides templates from the popular website content management systems (CMS), such as [Orchard], [Umbraco], [Drupal], and [WordPress]. You can create a website using your favorite CMS flavor. You can choose from various database backends to meet your needs, including [Azure SQL Database] and [MySQL].

Your existing web assets can run on Azure Websites, whether they are .NET, PHP, Java, Node.js, or Python. You can move them to Azure Websites using your familiar [FTP] tools. If you frequently create digital marketing campaigns, it is possible that you have existing web assets in a source control management system. You can deploy to Azure Websites directly from popular source control options, such as [Visual Studio], [Visual Studio Online], and [Git] (local, GitHub, BitBucket, DropBox, Mercurial, etc.).

### Stay agile

Stay agile by continuously publishing directly from your existing source control and run A/B tests in Azure Websites. 

During the planning, prototyping, and early development of a site, you and your customer can look at real working versions of the campaign site before it goes live by [deploying to a staging slot] of your Azure Website. By integrating source control with Azure Websites, you can [continuously publish] to a staging slot, and swap it into production with no downtime when it is ready. 

Also, when planning changes to a live website, you can easily [run A/B tests] on the proposed updates using the Test in Production feature in and analyze real user behavior to help you make informed decisions on site design.


### Go social

Your digital marketing campaign in Azure Websites can integrate with social media by authenticating with popular providers like Facebook and Twitter. For an example of this approach with an ASP.NET application, see [Deploy a Secure ASP.NET MVC app with Membership, OAuth, and SQL Database to an Azure Web Site]. 

Furthermore, each social media site typically provides information on other ways to integrate with it from .NET and many other frameworks.

### Use rich media and reach all devices

Enrich your digital marketing campaign with other Azure services, such as:

-  Upload and stream videos globally with [Azure Media Services]
-  Send emails to users with [SendGrid service in Azure Marketplace]
-  Establish presence on Windows, iOS, and Android devices with [Mobile Services]
-  Send push notification to millions of devices with [Notification Hub]

### Go global

Go global by serving regional sites with Azure Traffic Manager and delivering content lightning fast with Azure CDN.

To serve global customers in their respective regions, use [Azure Traffic Manager] to route site visitors to a regional site that provides the best performance. Alternatively, you can spread the site load evenly across multiple copies of your website hosted in multiple regions.

Deliver your static content lightning fast to users globally by [integrating your website with Azure CDN]. Azure CDN caches static content in the [CDN node] closest to the user, which minimizes latency and connections to your website.

### Optimize

Optimize your site by scaling automatically with Autoscale, caching with Azure Redis Cache, running background tasks with WebJobs, and maintaining high availability with Azure Traffic Manager.

Azure Websites' ability to [scale up and out] is perfect for unpredictable workloads, which is the case with digital marketing campaigns. Scale out your website manually through the [Azure Management Portal], programmatically through the [Service Management API] or [PowerShell scripting], or automatically through the Autoscale feature. In **Standard** hosting plan, Autoscale enables you to scale out a website automatically based on CPU utilization. This feature helps you maximize agility and minimize cost at the same time by scaling out the website only when needed based on user activity. For best practices, see [Troy Hunt]'s [10 things I learned about rapidly scaling websites with Azure].

Make your website more responsive with the [Azure Redis Cache]. Use it to cache data from backend databases and other things such as the [ASP.NET session state] and [output cache].

Maintain high availability of your website using [Azure Traffic Manager]. Using the **Failover** method, Traffic Manager automatically routes traffic to a secondary site if there is a problem on the primary site.

### Monitor and analyze

Stay up-to-date on your website's performance with Azure or third-party tools. Receive alerts on critical website events. Gain user insight easily with Application Insight or with web log analytics from HDInsight. 

Get a [quick glance] of the website's current performance metrics and resource quotas in the Azure Websites dashboard. For a 360° view of your application across availability, performance and usage, use [Azure Application Insights] to give you fast & powerful troubleshooting, diagnostics and usage insights. Or, use a third-party tool like [New Relic] to provide advanced monitoring data for your websites.

In the **Standard** hosting plan, monitor site responsiveness receive email notifications whenever your site becomes unresponsive. For more information, see [How to: Receive Alert Notifications and Manage Alert Rules in Azure].

## More Resources

- [Azure Websites Documentation](/en-us/documentation/services/websites/)
- [Learning map for Azure Websites](/en-us/documentation/articles/websites-learning-map/)
- [Azure Web Blog](/blog/topics/web/)


[Azure Websites]:/en-us/services/websites/

[Orchard]:/en-us/documentation/articles/web-sites-dotnet-orchard-cms-gallery/
[Umbraco]:/en-us/documentation/articles/web-sites-gallery-umbraco/
[Drupal]:/en-us/documentation/articles/web-sites-php-migrate-drupal/
[WordPress]:/en-us/documentation/articles/web-sites-php-web-site-gallery/
  
[MySQL]:/en-us/documentation/articles/web-sites-php-mysql-deploy-use-git/
[Azure SQL Database]:/en-us/documentation/articles/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database/
[FTP]:/en-us/documentation/articles/web-sites-deploy/#ftp
[Visual Studio]:/en-us/documentation/articles/web-sites-dotnet-get-started/
[Visual Studio Online]:/en-us/documentation/articles/cloud-services-continuous-delivery-use-vso/
[Git]:/en-us/documentation/articles/web-sites-publish-source-control/

[deploying to a staging slot]:/en-us/documentation/articles/web-sites-staged-publishing/ 
[continuously publish]:http://rickrainey.com/2014/01/21/continuous-deployment-github-with-azure-web-sites-and-staged-publishing/
[run A/B tests]:http://blogs.msdn.com/b/tomholl/archive/2014/11/10/a-b-testing-with-azure-websites.aspx

[Deploy a Secure ASP.NET MVC app with Membership, OAuth, and SQL Database to an Azure Web Site]:/en-us/develop/net/tutorials/web-site-with-sql-database/

[Azure Media Services]:http://blogs.technet.com/b/cbernier/archive/2013/09/03/windows-azure-media-services-and-web-sites.aspx
[SendGrid service in Azure Marketplace]:/en-us/documentation/articles/sendgrid-dotnet-how-to-send-email/
[Mobile Services]:/en-us/documentation/articles/mobile-services-dotnet-backend-windows-store-dotnet-push-notifications-app-users/
[Notification Hub]:/en-us/documentation/articles/mobile-services-dotnet-backend-windows-store-dotnet-push-notifications-app-users/

[Azure Traffic Manager]:http://www.hanselman.com/blog/CloudPowerHowToScaleAzureWebsitesGloballyWithTrafficManager.aspx
[integrating your website with Azure CDN]:/en-us/documentation/articles/cdn-websites-with-cdn/ 
[CDN node]:https://msdn.microsoft.com/library/azure/gg680302.aspx

[scale up and out]:/en-us/manage/services/web-sites/how-to-scale-websites/
[Azure Management Portal]:http://manage.windowsazure.com/
[Service Management API]:http://msdn.microsoft.com/en-us/library/windowsazure/ee460799.aspx
[PowerShell scripting]:http://msdn.microsoft.com/en-us/library/windowsazure/jj152841.aspx
[Troy Hunt]:https://twitter.com/troyhunt
[10 things I learned about rapidly scaling websites with Azure]:http://www.troyhunt.com/2014/09/10-things-i-learned-about-rapidly.html
[Azure Redis Cache]:/blog/2014/06/05/mvc-movie-app-with-azure-redis-cache-in-15-minutes/
[ASP.NET session state]:https://msdn.microsoft.com/en-us/library/azure/dn690522.aspx
[output cache]:https://msdn.microsoft.com/en-us/library/azure/dn798898.aspx

[quick glance]:/en-us/manage/services/web-sites/how-to-monitor-websites/
[Azure Application Insights]:http://blogs.msdn.com/b/visualstudioalm/archive/2015/01/07/application-insights-and-azure-websites.aspx
[New Relic]:/en-us/develop/net/how-to-guides/new-relic/
[How to: Receive Alert Notifications and Manage Alert Rules in Azure]:http://msdn.microsoft.com/library/windowsazure/dn306638.aspx

  
  [gitstaging]:http://www.bradygaster.com/post/multiple-environments-with-windows-azure-web-sites  
