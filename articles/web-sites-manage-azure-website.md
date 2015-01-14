<properties title="" pageTitle="Manage an Azure website" description="Links to resources for managing a Microsoft Azure website." services="web-sites" solutions="web" documentationCenter="" authors="MikeWasson" videoId="" scriptId="" manager="wpickett" editor="" metaKeywords=""/>

<tags ms.service="web-sites" ms.workload="web" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="09/16/2014" ms.author="mwasson" />

# Manage an Azure website

This topic contains links to resources for managing an Azure website. Management includes all of the tasks that keep your website running smoothly. 

Over the lifetime of a site, you will perform different management tasks, as you move from initial deployment to normal operation, maintenance, and updates.

- [Before you deploy your site to production]
- [While your website is running]
- [When you update your website]

Many website management tasks can be performed in the Azure portal. For more information, see [Manage websites through the Azure Management Portal](http://azure.microsoft.com/en-us/documentation/articles/web-sites-manage/).

## Before you deploy your site to production

### Choose a tier

Azure Websites is offered in four tiers: Free, Shared, Basic and Standard. For information about the features and pricing for each tier, see [Pricing details](http://azure.microsoft.com/en-us/pricing/details/websites/). 

- [Web Hosting Plans](http://azure.microsoft.com/en-us/documentation/articles/azure-web-sites-web-hosting-plans-in-depth-overview) let you group multiple websites under the same tier.
- You can always [switch tiers](http://azure.microsoft.com/en-us/documentation/articles/web-sites-scale/) after you create your website.

### Configuration

Use the [Azure Management Portal](https://manage.windowsazure.com/) to set various configuration options. For details, see [How to Configure Websites](http://azure.microsoft.com/en-us/documentation/articles/web-sites-configure/). Here is a quick checklist:

- Select **runtime versions** for .NET, PHP, Java, or Python, if needed.
- Enable **WebSockets** if your website uses the WebSocket protocol. (This includes apps that use [ASP.NET SignalR](http://www.asp.net/signalr) or [socket.io](http://azure.microsoft.com/en-us/documentation/articles/web-sites-nodejs-chat-app-socketio/).)
- Are you running continuous web jobs? If so, enable **Always On**.
- Set the **default document**, such as index.html.

In addition to these basic configuration settings, you may want to configure the following:

- **Secure Socket Layer (SSL)** encryption. To use SSL with a custom domain name, you must get an SSL certificate and configure your website to use it. See [Enable HTTPS for an Azure website](http://azure.microsoft.com/en-us/documentation/articles/web-sites-configure-ssl-certificate/).
- **Custom domain name.** Your website automatically has a subdomain under azurewebsites.net. You can associate a custom domain name, such as contoso.com. See [Configure a custom domain name](http://azure.microsoft.com/en-us/documentation/articles/web-sites-custom-domain-name/).

Language-specific configuration:

- **PHP**: [How to configure PHP in Azure Websites](http://azure.microsoft.com/en-us/documentation/articles/web-sites-php-configure/).
- **Python**: [Configuring Python with Azure Websites](http://azure.microsoft.com/en-us/documentation/articles/web-sites-python-configure/)


## While your website is running

While your site is running, you want to make sure it is available, and that it scales to meet user traffic. You may also need to troubleshoot errors.

### Monitoring

- Through the Management Portal, you can [add performance metrics](http://azure.microsoft.com/en-us/documentation/articles/web-sites-monitor) such as CPU usage and number of client requests.
- For deeper insight, use New Relic to monitor and manage performance. See [New Relic Application Performance Management on Azure Websites](http://azure.microsoft.com/en-us/documentation/articles/store-new-relic-web-sites-dotnet-application-performance-management/).
- [Scale your website](http://azure.microsoft.com/en-us/documentation/articles/web-sites-scale/) in response to traffic. Depending on your tier, you can scale the number of VMs and/or the size of the VM instances. In the Standard Plan, you can also set up autoscaling, so your site scales automatically, either on a fixed schedule, or in response to load.  
 
### Backups

- Set [automatic backups](http://azure.microsoft.com/en-us/documentation/articles/web-sites-backup/) of your website. Learn more about backups in [this video](http://azure.microsoft.com/en-us/documentation/videos/azure-websites-automatic-and-easy-backup/).
- Learn about the options for [database recovery](http://msdn.microsoft.com/en-us/library/azure/hh852669.aspx) in Azure SQL Database.

### Troubleshooting

- If something goes wrong, you can [troubleshoot in Visual Studio](http://azure.microsoft.com/en-us/documentation/articles/web-sites-dotnet-troubleshoot-visual-studio/#remotedebug), using diagnostic logs and live debugging in the cloud. 
- Outside of Visual Studio, there are various ways to collect diagnostic logs. See [Enable diagnostic logging for Azure Websites](http://azure.microsoft.com/en-us/documentation/articles/web-sites-enable-diagnostic-log/).
- For Node.js applications, see [How to debug a Node.js application in Azure Websites](http://azure.microsoft.com/en-us/documentation/articles/web-sites-nodejs-debug/).

### Restoring Data

- [Restore](http://azure.microsoft.com/en-us/documentation/articles/web-sites-restore/) a website that was previously backed up.


## When you update your website

If you have not enabled automatic backups, you can create a [manual backup](http://azure.microsoft.com/en-us/documentation/articles/web-sites-backup/).

Consider using [staged deployment](http://azure.microsoft.com/en-us/documentation/articles/web-sites-staged-publishing/). This option lets you publish updates to a staging deployment that runs side-by-side with your production deployment. 

If you use Visual Studio Online, you can set up continuous deployment from source control:

- [Using Team Foundation Version Control (TFVC)](http://azure.microsoft.com/en-us/documentation/articles/cloud-services-continuous-delivery-use-vso/) 
- [Using Git](http://azure.microsoft.com/en-us/documentation/articles/cloud-services-continuous-delivery-use-vso-git/)
 

 
<!-- Anchors. -->


[Before you deploy your site to production]: #before-you-deploy-your-site-to-production
[While your website is running]: #while-your-website-is-running
[When you update your website]: #when-you-update-your-website

 