<properties urlDisplayName="Resources" pageTitle="Create a Digital Marketing Campaign on Azure Websites" metaKeywords="" description="This guide provides a technical overview of how to use Azure Websites to create digital marketing campaigns. This includes deployment, social media integration, scaling strategies, and monitoring." metaCanonical="" services="" documentationCenter="" title="Create a Digital Marketing Campaign on Azure Websites" authors="jroth" solutions="" manager="wpickett" editor="mollybos" />

<tags ms.service="web-sites" ms.workload="web" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="08/01/2014" ms.author="jroth" />

# Create a Digital Marketing Campaign on Azure Websites
This guide provides a technical overview of how to use Azure Websites to create digital marketing campaigns. A digital marketing campaign is typically a short-lived entity that is meant to drive a short-term marketing goal. There are two main scenarios to consider. In the first scenario, a third-party marketing firm creates and manages the campaign for their customer for the duration of the promotion. A second scenario involves the marketing firm creating and then transferring ownership of the digital marketing campaign resources to their customer. The customer then runs and manages the digital marketing campaign on their own. 

[Azure Web Sites][websitesoverview] is a good match for both scenarios. It provides fast creation, supports multiple frameworks and languages, scales to meet user demand, and accommodates many deployment and source control systems. By using Azure, you also have access to other Azure services, such as Media Services, which can enhance a marketing campaign.

> [WACOM.NOTE]
> If you want to get started with Azure Websites before signing up for an account, go to <a href="https://trywebsites.azurewebsites.net">https://trywebsites.azurewebsites.net</a>, where you can immediately create a short-lived ASP.NET starter site in Azure Websites for free. No credit card required, no commitments.

Although it is possible to use [Azure Cloud Services][csoverview] or [Azure Virtual Machines][vmoverview] to host websites, it is not the ideal choice for this scenario unless there is a required feature that Azure Websites does not provide. To understand the options, see [Azure Web Sites, Cloud Services, and VMs: When to use which?][chooseservice].

The following areas are addressed in this guide:

- [Deploy Existing Web Sites](#deployexisting)
- [Integrate with Social Media](#socialmedia)
- [Scale with User Demand](#scale)
- [Integrate with Other Services](#integrate)
- [Monitor the Campaign](#monitor)

<div class="dev-callout">
<strong>Note</strong>
<p>This guide presents some of the most common areas and tasks that are aligned with public-facing .COM site development. However, there are other capabilities of Azure Websites that you can use in your specific implementation. To review these capabilities, also see the other guides on <a href="http://www.windowsazure.com/en-us/manage/services/web-sites/global-web-presence-solution-overview/">Global Web Presence</a> and <a href="http://www.windowsazure.com/en-us/manage/services/web-sites/business-application-solution-overview">Business Applications</a>.</p>
</div>

##<a name="deployexisting"></a>Deploy Existing Websites
In the Global Web Presence scenario, we discussed various options for creating and deploying a new website. If you are new to Azure Websites, it is a good idea to [review that information][scenarioglobalweb]. If you frequently create digital marketing campaigns, it is possible that you have existing web assets that you customize for different promotions. In this section, we'll look closer at the options for deploying various types of websites from source control.

If you are reusing web assets for multiple purposes, you should strongly consider a source control management system, if you don't already use one. This allows you to store templates of common web solutions that can be branched and customized for specific customers. Websites provides the option to synchronize with many different source code repositories. On the **Dashboard** tab, select the **Set up deployment from source control** link.

![DigitalMarketingDeploy1][DigitalMarketingDeploy1]

This brings up a dialog with multiple source code control options. These include full-featured source control systems such as TFS as well as simple deployment solutions such as Dropbox.

![DigitalMarketingDeploy2][DigitalMarketingDeploy2]

You can use various source control techniques to manage the new project that is based on an existing baseline. For example, you can copy a baseline repository that was previously saved to begin work on the new project, or you can create a new branch to track the customizations for the current project. For a good example of the use of branches in managing different deployments from the same source control repository, see [Multiple Environments with Azure Web Sites][gitstaging]. This post demonstrates how to use git branching to manage staging and production environments.

Once you've connected your Website to source control, you can configure and track deployments from the portal. For more information on using source control with Websites, see [Publishing from Source Control to Azure Web Sites][publishingwithgit].

When using existing web assets, it is also important to have flexibility to host many different types of websites. On the **Configure** tab, you can select both .NET and PHP support for your website. 

![DigitalMarketingFrameworkVersions][DigitalMarketingFrameworkVersions]

In addition to these configuration options, Websites automatically provides support for Python 2.7 and Node.js. The default Node.js version is 0.10.5.

One additional advantage of Azure Websites is the speed of deploying staged sites to the web. During the planning, prototyping, and early development of a site, the agency and their customer can look at real working versions of the campaign site before it goes live. Once the site is ready for production, the agency can either manage the production deployment for the customer or provide the web assets to the customer to deploy and manage.

##<a name="socialmedia"></a>Integrate with Social Media
Most digital marketing campaigns make use of social media sites, such as Facebook or Twitter. One integration point is to use the social media identities for authentication. For an example of this approach with an ASP.NET application, see [Deploy a Secure ASP.NET MVC app with Membership, OAuth, and SQL Database to an Azure Web Site][deploysecurewebsite].

However, many digital marketing campaigns go beyond authentication and use social media integration as a key part of their strategy. Social media sites typically have a developers section that explains different ways for applications to integrate with their services. Services that provide a REST API can be used from almost any web framework. However, there is often information that is specific to your language of choice. For example, Twitter provides [a list of available libraries that support the Twitter API][twitter], including ones for .NET, Node.js, and PHP. This is one example, and you should look for similar developer guidance directly from each social media site that you choose to target.

For ASP.NET developer targeting Facebook, Visual Studio provides a template for an MVC 4 Facebook Application.  

![DigitalMarketingFacebook][DigitalMarketingFacebook]

For a quick walkthrough of using this template with Websites, see [Creating a Facebook app using ASP.NET MVC Facebook Templates and hosting them for free on Azure Websites][fbtutorial]. For a more detailed tutorial and example application, see [ASP.NET MVC Facebook Birthday App][fbbirthdayapp] and [The new Facebook application template and library for ASP.NET MVC][fbvstemplate].

If you are an ASP.NET developer, it is important to realize that your integration with social media is not limited by templates that Visual Studio provides. A template just helps to make the process simpler. But, as stated earlier, each social media site typically provides information on other ways to connect from .NET and from many other languages and frameworks.

##<a name="scale"></a>Scale with User Demand
Cloud computing is useful for unpredictable workloads. Digital marketing campaigns fall into this category. It is difficult to predict the popularity of a relatively short-lived marketing site, because a lot depends on capturing user interest and the related social media interactions that drive more traffic to the site. Azure provides several options for scaling both websites and cloud services.

- Manual scaling through the [Azure Management Portal][managementportal].
- Programmatic scaling through the [Service Management API][servicemanagementapi] or [PowerShell scripting][powershell].
- Automatic scaling through the Autoscale (Preview) feature.

In the Management Portal, go to the **Scale** tab for your website. There are several options for scaling. The first option determines the website mode, which is set to **Free**, **Shared**, or **Standard**. 

![DigitalMarketingScale][DigitalMarketingScale]

Scalability features and options increase with each tier. For example, **Free** mode sites cannot be scaled out to multiple instances, but **Shared** sites can be scaled out to 6 instances. You also have the option to scale up by selecting **Standard** mode. This mode runs your site on dedicated virtual machines and provides machine sizing options of small, medium, and large. After deciding the size of the virtual machine, you also have the option of scaling out to multiple instances. In **Standard** mode, you can scale out to 10 instances. A full list of the differences between each mode can be found in [the pricing guidelines for Web Sites][pricing].

When you select **Standard** mode, you have the additional option of enabling the Autoscale (Preview) feature. This enables you to scale based on CPU. The **Target CPU** percent is a range of processor utilization that Azure targets for your website instances. If the average CPU is lower than this target, Azure lowers the instance count, because the same load on fewer instances will result in increased utilization on the remaining instances. However, it cannot lower the instance count below the minimum **Instance Count** value. In the same way, if the average CPU is higher than the **Target CPU**, Azure increases the number of instances. The same load spread across additional machines has the effect of lowering the CPU utilization on each machine. The number of instances added is limited by the maximum **Instance Count** value.

![DigitalMarketingAutoScale][DigitalMarketingAutoScale]

Automatic scaling makes much more efficient use of resources. For example, it is possible that digital marketing campaign is most active during nights and weekends. This also effectively handles a scenario where the popularity of a campaign unexpectedly increases. Automatic scaling helps to efficiently handle increased load and then decreases instances (and cost) when the load decreases. 

For more information about scaling websites, see [How to Scale Web Sites][scalewebsite]. This subject is also closely tied with monitoring. For more information, see the section in this guide on [monitoring your campaign](#monitor).

<div class="dev-callout">
<strong>Note</strong>
<p>For web applications that choose to use cloud services and web roles, there is an additional option to scale based on the length of items in a queue. In a cloud service, roles that process backend queues are a common architecture pattern. For more information on cloud service scaling, see <a href="http://www.windowsazure.com/en-us/manage/services/cloud-services/how-to-scale-a-cloud-service/">How to Scale a Cloud Service</a>.</p>
</div>

##<a name="integrate"></a>Integrate with Other Services
A digital marketing site will often incorporate rich media, such as video streaming. Hosting these sites in Azure provides close integration to related Azure services. For example, you can use Azure Media Services to encode and stream video for your website. For more information on Media Services, see [Introduction to Azure Media Services Concepts and Scenarios][mediaservices].

Other Azure services can be used to create a more robust application. For example, Websites can use distributed caching provided by the new [Azure Cache Service (Preview)][caching]. Or you can use Azure Storage Services to store application data and resources. For example, graphics, videos, and other large files can be durably stored in blobs. Database services, such as Azure SQL Database and MySQL, are also available for relational data requirements.

##<a name="monitor"></a>Monitor the Campaign
The **Monitor** tab contains metrics that can help you to evaluate the success and performance of your digital marketing site.

![DigitalMarketingMonitor][DigitalMarketingMonitor]

For example, you can look at usage patterns and levels by looking at metrics such s **CPU Time**, **Requests**, and **Data Out**. All of these metrics will increase as the marketing campaign becomes more popular. Information about usage can be used to decide when to scale out or up. For more information, see [How to Monitor Web Sites][monitoring].

For **Free** and **Shared** modes, you also should be aware of resource quotas. On the **Dashboard** tab, the portal shows the current usage statistics of several quotas and when these quotas will be reset. These usage statistics vary depending on your selected mode. The following screenshot shows the statistics displayed for **Free** mode. In **Shared** mode, you do not have a quota for **Data Out**. In **Standard** mode, it displays only **File System Storage** and **Size**.

![DigitalMarketingUsageOverview][DigitalMarketingUsageOverview]

If you find that you're getting close to exhausting these quotas, consider moving from **Free** to **Shared** or from **Shared** to **Standard**. In **Standard** mode, you have dedicated resources on one or more small, medium, or large virtual machines. 

In addition to using the Management Portal for this information, there are a number of third-party tools that provide advanced monitoring data for your websites. For example, you can install a New Relic add-on from the Azure Store. For a walkthrough on using New Relic for monitoring, see [New Relic Application Performance Management on Azure][newrelic]. 

Finally, Standard mode websites can enable endpoint monitoring and alerting. An endpoint monitor regularly attempts to reach your website and then reports on response time. Alerts provide email notifications if the response time exceeds a specified threshold. For more information, see the monitoring section of the [Global Web Presence][scenarioglobalweb] scenario and the topic, [How to: Receive Alert Notifications and Manage Alert Rules in Azure][receivealerts].

##<a name="summary"></a>Summary
Azure Websites are a good choice for reusable web content that is customized for individual marketing campaigns. Websites supports many of the popular languages, frameworks, and source control systems, making it easier to migrate to these assets and workflows to the Cloud. The ASP.NET Facebook Application template makes it easier to create Facebook applications, but you can use almost any third-party social media integration that supports web interfaces. Azure Media Services and other related services on Azure provide additional tools to construct a well-designed campaign site. And the multiple manual and automatic scaling options are useful to handle user demand, which can be hard to predict. For more information, see the following technical articles.

<table cellspacing="0" border="1">
<tr>
   <th align="left" valign="top">Area</th>
   <th align="left" valign="top">Resources</th>
</tr>
<tr>
   <td valign="middle"><strong>Plan</strong></td>
   <td valign="top">- <a href="http://www.windowsazure.com/en-us/manage/services/web-sites/choose-web-app-service">Azure Websites, Cloud Services, and VMs: When to use which?</a></td>
</tr>
<tr>
   <td valign="middle"><strong>Create</strong></td>
   <td valign="top">- <a href="http://www.windowsazure.com/en-us/manage/services/web-sites/how-to-create-websites/">How to Create and Deploy a Website</a></td>
</tr>
<tr>
   <td valign="middle"><strong>Deploy</strong></td>
   <td valign="top">- <a href="http://azure.microsoft.com/en-us/documentation/articles/web-sites-deploy/">How to Deploy an Azure Website</a><br/>- <a href="http://www.windowsazure.com/en-us/develop/net/common-tasks/publishing-with-git/">Publishing from Source Control to Azure Websites</a></td>
</tr>
<tr>
   <td valign="middle"><strong>Social Media</strong></td>
   <td valign="top">- <a href="http://www.windowsazure.com/en-us/develop/net/tutorials/web-site-with-sql-database/">Deploy a Secure ASP.NET MVC app with Membership, OAuth, and SQL Database</a><br/>- <a href="http://blogs.msdn.com/b/africaapps/archive/2013/02/20/creating-a-facebook-app-using-asp-net-mvc-facebook-templates-and-hosting-them-for-free-on-windows-azure-websites.aspx">Create a Facebook app using ASP.NET MVC Facebook Templates</a><br/>- <a href="http://blogs.msdn.com/b/webdev/archive/2012/12/13/the-new-facebook-application-template-and-library-for-asp.net-mvc.aspx">Facebook application template and library for ASP.NET MVC</a></td>
</tr>
<tr>
   <td valign="middle"><strong>Scale</strong></td>
   <td valign="top">- <a href="http://www.windowsazure.com/en-us/manage/services/web-sites/how-to-scale-websites/">How to Scale Websites</a></td>
</tr>
<tr>
   <td valign="middle"><strong>Rich Media</strong></td>
   <td valign="top">- <a href="http://msdn.microsoft.com/en-us/library/windowsazure/dn223282.aspx">Introduction to Azure Media Services Concepts and Scenarios</a></td>
</tr>
<tr>
   <td valign="middle"><strong>Monitor</strong></td>
   <td valign="top">- <a href="http://www.windowsazure.com/en-us/manage/services/web-sites/how-to-monitor-websites/">How to Monitor Websites</a><br/>- <a href="http://msdn.microsoft.com/library/windowsazure/dn306638.aspx">How to: Receive Alert Notifications and Manage Alert Rules in Azure</a></td>
</tr>
</table>

  [websitesoverview]:/en-us/documentation/services/web-sites/
  [csoverview]:/en-us/documentation/services/cloud-services/
  [vmoverview]:/en-us/documentation/services/virtual-machines/
  [chooseservice]:/en-us/manage/services/web-sites/choose-web-app-service
  [scenarioglobalweb]:/en-us/manage/services/web-sites/global-web-presence-solution-overview/
  
  
  [publishingwithgit]:/en-us/develop/net/common-tasks/publishing-with-git/
  [gitstaging]:http://www.bradygaster.com/post/multiple-environments-with-windows-azure-web-sites
  [deploysecurewebsite]:/en-us/develop/net/tutorials/web-site-with-sql-database/
  [twitter]:https://dev.twitter.com/docs/twitter-libraries#dotnet
  [fbtutorial]:http://blogs.msdn.com/b/africaapps/archive/2013/02/20/creating-a-facebook-app-using-asp-net-mvc-facebook-templates-and-hosting-them-for-free-on-windows-azure-websites.aspx
  [fbbirthdayapp]:http://www.asp.net/mvc/tutorials/mvc-4/aspnet-mvc-facebook-birthday-app
  [fbvstemplate]:http://blogs.msdn.com/b/webdev/archive/2012/12/13/the-new-facebook-application-template-and-library-for-asp.net-mvc.aspx
  [managementportal]:http://manage.windowsazure.com/
  [servicemanagementapi]:http://msdn.microsoft.com/en-us/library/windowsazure/ee460799.aspx
  [powershell]:http://msdn.microsoft.com/en-us/library/windowsazure/jj152841.aspx
  [pricing]:https://www.windowsazure.com/en-us/pricing/details/web-sites/
  [scalewebsite]:/en-us/manage/services/web-sites/how-to-scale-websites/
  
  [mediaservices]:http://msdn.microsoft.com/en-us/library/windowsazure/dn223282.aspx
  [caching]:http://msdn.microsoft.com/en-us/library/windowsazure/dn386094.aspx
  [monitoring]:/en-us/manage/services/web-sites/how-to-monitor-websites/
  [newrelic]:/en-us/develop/net/how-to-guides/new-relic/
  [receivealerts]:http://msdn.microsoft.com/library/windowsazure/dn306638.aspx
  
  
  
   [DigitalMarketingDeploy1]: ./media/web-sites-digital-marketing-application-solution-overview/DigitalMarketing_Deploy1.png
  [DigitalMarketingDeploy2]: ./media/web-sites-digital-marketing-application-solution-overview/DigitalMarketing_Deploy2.png
  [DigitalMarketingFrameworkVersions]: ./media/web-sites-digital-marketing-application-solution-overview/DigitalMarketing_FrameworkVersions.png
  [DigitalMarketingFacebook]: ./media/web-sites-digital-marketing-application-solution-overview/DigitalMarketing_Facebook.png
  [DigitalMarketingScale]: ./media/web-sites-digital-marketing-application-solution-overview/DigitalMarketing_Scale.png
  [DigitalMarketingAutoScale]: ./media/web-sites-digital-marketing-application-solution-overview/DigitalMarketing_AutoScale.png
  [DigitalMarketingMonitor]: ./media/web-sites-digital-marketing-application-solution-overview/DigitalMarketing_Monitor.png
  [DigitalMarketingUsageOverview]: ./media/web-sites-digital-marketing-application-solution-overview/DigitalMarketing_UsageOverview.png
  
  
  
  
  
