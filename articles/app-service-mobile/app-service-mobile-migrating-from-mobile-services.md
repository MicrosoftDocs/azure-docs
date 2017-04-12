---
title: Migrate from Mobile Services to an App Service Mobile App
description: Learn how to easily migrate your Mobile Services application to an App Service Mobile App
services: app-service\mobile
documentationcenter: ''
author: adrianhall
manager: adrianha
editor: ''

ms.assetid: 07507ea2-690f-4f79-8776-3375e2adeb9e
ms.service: app-service-mobile
ms.workload: mobile
ms.tgt_pltfrm: mobile
ms.devlang: na
ms.topic: article
ms.date: 10/03/2016
ms.author: adrianha

---
# <a name="article-top"></a>Migrate your existing Azure Mobile Service to Azure App Service
With the [general availability of Azure App Service], Azure Mobile Services sites can be easily migrated in-place to take advantage of all the
features of the Azure App Service.  This document explains what to expect when migrating your site from Azure Mobile Services to Azure App Service.

## <a name="what-does-migration-do"></a>What does migration do to your site
Migration of your Azure Mobile Service turns your Mobile Service into an [Azure App Service] app without affecting the code.  Your Notification
Hubs, SQL data connection, authentication settings, scheduled jobs, and domain name remain unchanged.  Mobile clients using your Azure Mobile Service
continue to operate normally.  Migration restarts your service once it is transferred to Azure App Service.

[!INCLUDE [app-service-mobile-migrate-vs-upgrade](../../includes/app-service-mobile-migrate-vs-upgrade.md)]

## <a name="why-migrate"></a>Why you should migrate your site
Microsoft is recommending that you migrate your Azure Mobile Service to take advantage of the features of Azure App Service, including:

* New host features, including [WebJobs] and [custom domain names].
* Connectivity to your on-premise resources using [VNet] in addition to [Hybrid Connections].
* Monitoring and troubleshooting with New Relic or [Application Insights].
* Built-in DevOps tooling, including [staging slots], roll-back, and in-production testing.
* [Auto-scale], load balancing, and [performance monitoring].

For more information on the benefits of Azure App Service, see the [Mobile Services vs. App Service] topic.

## <a name="before-you-begin"></a>Before you begin
Before beginning any major work on your site, you should back up your Mobile Service scripts and SQL database.

## <a name="migrating-site"></a>Migrating your sites
The migration process migrates all sites within a single Azure Region.

To migrate your site:

1. Log in to the [Azure Classic Portal].
2. Select a Mobile Service in the region you wish to migrate.
3. Click the **Migrate to App Service** button.
   
   ![The Migrate Button][0]
4. Read the Migrate to App Service dialog.
5. Enter the name of your Mobile Service in the box provided.  For example, if your domain name is contoso.azure-mobile.net, then enter *contoso* in the box provided.
6. Click the tick button.

Monitor the status of the migration in the activity monitor. Your site is listed as *migrating* in the Azure Classic Portal.

  ![Migration Activity Monitor][1]

Each migration can take anywhere from 3 to 15 minutes per mobile service being migrated.  Your site remains available during the migration.
Your site is restarted at the end of the migration process.  The site is unavailable during the restart process, which may last a couple of seconds.

## <a name="finalizing-migration"></a>Finalizing the Migration
Plan to test your site from a mobile client at the conclusion of the migration process.  Ensure you can perform all common client actions
without changes to the mobile client.  

### <a name="update-app-service-tier"></a>Select an appropriate App Service pricing tier
You have more flexibility in pricing after you migrate to Azure App Service.

1. Log in to the [Azure portal].
2. Select **All resources** or **App Services** then click the name of your migrated Mobile Service.
3. The Settings blade opens by default.
4. Click **App Service Plan** in the Settings menu.
5. Click the **Pricing Tier** tile.
6. Click the tile appropriate to your requirements, then Click **Select**.  You may need to Click **View all** to see the available pricing tiers.

As a starting point, we recommend the following tiers:

| Mobile Service Pricing Tier | App Service Pricing Tier |
|:--- |:--- |
| Free |F1 Free |
| Basic |B1 Basic |
| Standard |S1 Standard |

There is considerable flexibility in choosing the right pricing tier for your application.  Refer to [App Service Pricing] for
full details on the pricing of your new App Service.

> [!TIP]
> The App Service Standard tier contains access to many features that you may want to use, including [staging slots],
> automatic backups, and auto-scaling.  Check out the new capabilities while you are there!
> 
> 

### <a name="review-migration-scheduler-jobs"></a>Review the Migrated Scheduler Jobs
Scheduler Jobs will not be visible until approximately 30 minutes after migration.  Scheduled jobs continue to run in the background.
To view your scheduled jobs after they are visible again:

1. Log in to the [Azure portal].
2. Select **Browse>**, enter **Schedule** in the *Filter* box, then select **Scheduler Collections**.

There are a limited number of free scheduler jobs available post-migration.  Review your usage and the [Azure Scheduler Plans].

### <a name="configure-cors"></a>Configure CORS if needed
Cross-origin resource sharing is a technique to allow a website to access a Web API on a different domain.  If you are using Azure Mobile
Services with an associated website, then you need to configure CORS as part of the migration.  If you are accessing Azure Mobile
Services exclusively from mobile devices, then CORS does not need to be configured except in rare cases.

Your migrated CORS settings are available as the **MS_CrossDomainWhitelist** App Setting.  To migrate your site to the App Service CORS facility:

1. Log in to the [Azure portal].
2. Select **All resources** or **App Services** then click the name of your migrated Mobile Service.
3. The Settings blade opens by default.
4. Click **CORS** in the API menu.
5. Enter any Allowed Origins in the box provided, pressing Enter after each one.
6. Once your list of Allowed Origins is correct, click the Save button.

> [!TIP]
> One of the advantages of using an Azure App Service is that you can run your web site and mobile service on the same site.  For more
> information, see the [next steps](#next-steps) section.
> 
> 

### <a name="download-publish-profile"></a>Download a new Publishing Profile
The publishing profile of your site is changed when migrating to Azure App Service.  If you intend to publish
your site from within Visual Studio, you need a new publishing profile.  To download the new publishing profile:

1. Log in to the [Azure portal].
2. Select **All resources** or **App Services** then click the name of your migrated Mobile Service.
3. Click **Get publish profile**.

The PublishSettings file is downloaded to your computer.  It is normally called *sitename*.PublishSettings.  Import
the publish settings into your existing project:

1. Open Visual Studio and your Azure Mobile Service project.
2. Right-Click your project in the **Solution Explorer** and select **Publish...**
3. Click **Import**
4. Click **Browse** and select your downloaded publish settings file.  Click **OK**
5. Click **Validate Connection** to ensure the publish settings work.
6. Click **Publish** to publish your site.

## <a name="working-with-your-site"></a>Working with your site post-migration
Start working with your new App Service in the [Azure portal] post-migration.  The following are some notes on specific operations that
you used to perform in the [Azure Classic Portal], together with their App Service equivalent.

### <a name="publishing-your-site"></a>Downloading and Publishing your migrated site
Your site is available via git or ftp and can be republished with various different mechanisms, including WebDeploy, TFS, Mercurial, GitHub,
and FTP.  The deployment credentials are migrated with the rest of your site.  If you did not set your deployment credentials or you do not remember
them, you can reset them:

1. Log in to the [Azure portal].
2. Select **All resources** or **App Services** then click the name of your migrated Mobile Service.
3. The Settings blade opens by default.
4. Click **Deployment credentials** in the PUBLISHING menu.
5. Enter the new deployment credentials in the boxes provided, then click the Save button.

You can use these credentials to clone the site with git or set up automated deployments from GitHub, TFS, or Mercurial.  For more
information, see the [Azure App Service deployment documentation].

### <a name="appsettings"></a>Application Settings
Most settings for a migrated mobile service are available via App Settings.  You can get a list of the app settings from the [Azure portal].
To view or change your app settings:

1. Log in to the [Azure portal].
2. Select **All resources** or **App Services** then click the name of your migrated Mobile Service.
3. The Settings blade opens by default.
4. Click **Application settings** in the GENERAL menu.
5. Scroll to the App Settings section and find your app setting.
6. Click the value of the app setting to edit the value.  Click **Save** to save the value.

You can update multiple app settings at the same time.

> [!TIP]
> There are two Application Settings with the same value.  For example, you may see *ApplicationKey* and
> *MS\_ApplicationKey*.  Update both application settings at the same time.
> 
> 

### <a name="authentication"></a>Authentication
All authentication settings are available as App Settings in your migrated site.  To update your authentication settings, you must alter the
appropriate app settings.  The following table shows the appropriate app settings for your authentication provider:

| Provider | Client ID | Client Secret | Other Settings |
|:--- |:--- |:--- |:--- |
| Microsoft Account |**MS\_MicrosoftClientID** |**MS\_MicrosoftClientSecret** |**MS\_MicrosoftPackageSID** |
| Facebook |**MS\_FacebookAppID** |**MS\_FacebookAppSecret** | |
| Twitter |**MS\_TwitterConsumerKey** |**MS\_TwitterConsumerSecret** | |
| Google |**MS\_GoogleClientID** |**MS\_GoogleClientSecret** | |
| Azure AD |**MS\_AadClientID** | |**MS\_AadTenants** |

Note: **MS\_AadTenants** is stored as a comma-separated list of tenant domains (the "Allowed Tenants" fields in the Mobile Services portal).

> [!WARNING]
> **Do not use the authentication mechanisms in the Settings menu**
> 
> Azure App Service provides a separate "no-code" Authentication and Authorization system under the *Authentication / Authorization*
> Settings menu and the (deprecated) *Mobile Authentication* option under the Settings menu.  These options are incompatible with a migrated Azure
> Mobile Service.  You can [upgrade your site](app-service-mobile-net-upgrading-from-mobile-services.md) to take advantage of the Azure App Service authentication.
> 
> 

### <a name="easytables"></a>Data
The *Data* tab in Mobile Services has been replaced by *Easy Tables* within the Azure portal.  To access Easy Tables:

1. Log in to the [Azure portal].
2. Select **All resources** or **App Services** then click the name of your migrated Mobile Service.
3. The Settings blade opens by default.
4. Click **Easy tables** in the MOBILE menu.

You can add a table by clicking the **Add** button or access your existing tables by clicking a table name.  There are various operations
you can do from this blade, including:

* Changing table permissions
* Editing the operational scripts
* Managing the table schema
* Deleting the table
* Clearing the table contents
* Deleting specific rows of the table

### <a name="easyapis"></a>API
The *API* tab in Mobile Services has been replaced by *Easy APIs* within the Azure portal.  To access Easy APIs:

1. Log in to the [Azure portal].
2. Select **All resources** or **App Services** then click the name of your migrated Mobile Service.
3. The Settings blade opens by default.
4. Click **Easy APIs** in the MOBILE menu.

Your migrated APIs are already listed in the blade.  You can also add an API from this blade.  To manage a specific API, click the API.
From the new blade, you can adjust the permissions and edit the scripts for the API.

### <a name="on-demand-jobs"></a>Scheduler Jobs
All scheduler jobs are available through the Scheduler Job Collections section.  To access your scheduler jobs:

1. Log in to the [Azure portal].
2. Select **Browse>**, enter **Schedule** in the *Filter* box, then select **Scheduler Collections**.
3. Select the Job Collection for your site.  It is named *sitename*-Jobs.
4. Click **Settings**.
5. Click **Scheduler Jobs** under MANAGE.

Scheduled jobs are listed with the frequency you specified before migration.  On-demand jobs are disabled.  To run an on-demand job:

1. Select the job you wish to run.
2. If necessary, click **Enable** to enable the job.
3. Click **Settings**, then **Schedule**.
4. Select a Recurrence of **Once**, then Click **Save**

Your on-demand jobs are located in `App_Data/config/scripts/scheduler post-migration`.  We recommend that you convert all on-demand jobs to [WebJobs]
or [Functions].  Write new scheduler jobs as [WebJobs] or [Functions].

### <a name="notification-hubs"></a>Notification Hubs
Mobile Services uses Notification Hubs for push notifications.  The following App Settings are used to link the Notification Hub to your Mobile Service
after migration:

| Application Setting | Description |
|:--- |:--- |
| **MS\_PushEntityNamespace** |The Notification Hub Namespace |
| **MS\_NotificationHubName** |The Notification Hub Name |
| **MS\_NotificationHubConnectionString** |The Notification Hub Connection String |
| **MS\_NamespaceName** |An alias for MS_PushEntityNamespace |

Your Notification Hub is managed through the [Azure portal].  Note the Notification Hub name (you can find this using the App Settings):

1. Log in to the [Azure portal].
2. Select **Browse**>, then select **Notification Hubs**
3. Click the Notification Hub name associated with the mobile service.

> [!NOTE]
> If your Notification HUb is a "Mixed" type, it is not visible.  "Mixed" type notification hubs utilize both Notification Hubs and
> legacy Service Bus features.  [Convert your Mixed namespaces] before continuing.  Once the conversion is complete, your notification hub
> appears in the [Azure portal].
> 
> 

For more information, review the [Notification Hubs] documentation.

> [!TIP]
> Notification Hubs management features in the [Azure portal] are still in preview.  The [Azure Classic Portal] remains available for
> managing all your Notification Hubs.
> 
> 

### <a name="legacy-push"></a>Legacy Push Settings
If you configured Push on your mobile service before the introduction on Notification Hubs, you are using *legacy push*.  If you are using Push and
you do not see a Notification Hub listed in your configuration, then it is likely you are using *legacy push*.  This feature is migrated with all the
other features.  However, we recommend that you upgrade to Notification Hubs soon after the migration is complete.

In the interim, all the legacy push settings (with the notable exception of the APNS certificate) are available in App Settings.  Update the APNS certificate
by replacing the appropriate file on the filesystem.

### <a name="app-settings"></a>Other App Settings
The following additional app settings are migrated from your Mobile Service and available under *Settings* > *App Settings*:

| Application Setting | Description |
|:--- |:--- |
| **MS\_MobileServiceName** |The name of your app |
| **MS\_MobileServiceDomainSuffix** |The domain prefix. i.e azure-mobile.net |
| **MS\_ApplicationKey** |Your application key |
| **MS\_MasterKey** |Your app master key |

The application key and master key are identical to the Application Keys from your original Mobile Service.  In particular, the Application Key is
sent by mobile clients to validate their use of the mobile API.

### <a name="cliequivalents"></a>Command-Line Equivalents
You can longer use the *azure mobile* command to manage your Azure Mobile Services site.  Instead, many functions have been replaced
with the *azure site* command.  Use the following table to find equivalents for common commands:

| *Azure Mobile* Command | Equivalent *Azure Site* command |
|:--- |:--- |
| mobile locations |site location list |
| mobile list |site list |
| mobile show *name* |site show *name* |
| mobile restart *name* |site restart *name* |
| mobile redeploy *name* |site deployment redeploy *commitId* *name* |
| mobile key set *name* *type* *value* |site appsetting delete *key* *name* <br/> site appsetting add *key*=*value* *name* |
| mobile config list *name* |site appsetting list *name* |
| mobile config get *name* *key* |site appsetting show *key* *name* |
| mobile config set *name* *key* |site appsetting delete *key* *name* <br/> site appsetting add *key*=*value* *name* |
| mobile domain list *name* |site domain list *name* |
| mobile domain add *name* *domain* |site domain add *domain* *name* |
| mobile domain delete *name* |site domain delete *domain* *name* |
| mobile scale show *name* |site show *name* |
| mobile scale change *name* |site scale mode *mode* *name* <br /> site scale instances *instances* *name* |
| mobile appsetting list *name* |site appsetting list *name* |
| mobile appsetting add *name* *key* *value* |site appsetting add *key*=*value* *name* |
| mobile appsetting delete *name* *key* |site appsetting delete *key* *name* |
| mobile appsetting show *name* *key* |site appsetting delete *key* *name* |

Update authentication or push notification settings by updating the appropriate Application Setting.
Edit files and publish your site via ftp or git.

### <a name="diagnostics"></a>Diagnostics and Logging
Diagnostic Logging is normally disabled in an Azure App Service.  To enable diagnostic logging:

1. Log in to the [Azure portal].
2. Select **All resources** or **App Services** then click the name of your migrated Mobile Service.
3. The Settings blade opens by default.
4. Select **Diagnostic Logs** under the FEATURES menu.
5. Click **ON** for the following logs: **Application Logging (Filesystem)**, **Detailed error messages**, and **Failed request tracing**
6. Click **File System** for Web server logging
7. Click **Save**

To view the logs:

1. Log in to the [Azure portal].
2. Select **All resources** or **App Services** then click the name of your migrated Mobile Service.
3. Click the **Tools** button
4. Select **Log Stream** under the OBSERVE menu.

Logs are displayed in the window as they are generated.  You can also download the logs for later analysis using your deployment credentials. For
more information, see the [Logging] documentation.

## <a name="known-issues"></a>Known Issues
### Deleting a Migrated Mobile App Clone causes a site outage
If you clone your migrated mobile service using Azure PowerShell, then delete the clone, the DNS entry for your production service is
removed.  Your site is no longer be accessible from the Internet.  

Resolution: If you wish to clone your site, do so through the portal.

### Changing Web.config does not work
If you have an ASP.NET site, changes to the `Web.config` file do not get applied.  The Azure App Service builds a suitable `Web.config` file
during startup to support the Mobile Services runtime.  You can override certain settings (such as custom headers) by using an XML transform
file.  Create a file in called `applicationHost.xdt` - this file must end up in the `D:\home\site` directory on the Azure Service.  Upload the
`applicationHost.xdt` file via a custom deployment script or directly using Kudu.  The following shows an example document:

```
<?xml version="1.0" encoding="utf-8"?>
<configuration xmlns:xdt="http://schemas.microsoft.com/XML-Document-Transform">
  <system.webServer>
    <httpProtocol>
      <customHeaders>
        <add name="X-Frame-Options" value="DENY" xdt:Transform="Replace" />
        <remove name="X-Powered-By" xdt:Transform="Insert" />
      </customHeaders>
    </httpProtocol>
    <security>
      <requestFiltering removeServerHeader="true" xdt:Transform="SetAttributes(removeServerHeader)" />
    </security>
  </system.webServer>
</configuration>
```

For more information, see the [XDT Transform Samples] documentation on GitHub.

### Migrated Mobile Services cannot be added to Traffic Manager
When you create a Traffic Manager profile, you cannot directly choose a migrated mobile service to the profile.  Use an "external endpoint."  The
external endpoint can only be added through PowerShell.  For more information, see the
[Traffic Manager tutorial](https://azure.microsoft.com/blog/azure-traffic-manager-external-endpoints-and-weighted-round-robin-via-powershell/).

## <a name="next-steps"></a>Next Steps
Now that your application is migrated to App Service, there are even more features you can use:

* Deployment [staging slots] allow you to stage changes to your site and perform A/B testing.
* [WebJobs] provide a replacement for On-demand scheduled jobs.
* You can [continuously deploy] your site by linking your site to GitHub, TFS, or Mercurial.
* You can use [Application Insights] to monitor your site.
* Serve a website and a Mobile API from the same code.

### <a name="upgrading-your-site"></a>Upgrading your Mobile Services site to Azure Mobile Apps SDK
* For Node.js-based server projects, the new [Mobile Apps Node.js SDK] provides several new features. For instance, you can now do local
  development and debugging, use any Node.js version above 0.10, and customize with any Express.js middleware.
* For .NET-based server projects, the new [Mobile Apps SDK NuGet packages](https://www.nuget.org/packages/Microsoft.Azure.Mobile.Server/) have more
  flexibility on NuGet dependencies.  These packages support the new App Service authentication, and compose with any ASP.NET project. To
  learn more about upgrading, see [Upgrade your existing .NET Mobile Service to App Service](app-service-mobile-net-upgrading-from-mobile-services.md).

<!-- Images -->
[0]: ./media/app-service-mobile-migrating-from-mobile-services/migrate-to-app-service-button.PNG
[1]: ./media/app-service-mobile-migrating-from-mobile-services/migration-activity-monitor.png
[2]: ./media/app-service-mobile-migrating-from-mobile-services/triggering-job-with-postman.png

<!-- Links -->
[App Service pricing]: https://azure.microsoft.com/en-us/pricing/details/app-service/
[Application Insights]: ../application-insights/app-insights-overview.md
[Auto-scale]: ../app-service-web/web-sites-scale.md
[Azure App Service]: ../app-service/app-service-value-prop-what-is.md
[Azure App Service deployment documentation]: ../app-service-web/web-sites-deploy.md
[Azure Classic Portal]: https://manage.windowsazure.com
[Azure portal]: https://portal.azure.com
[Azure Region]: https://azure.microsoft.com/en-us/regions/
[Azure Scheduler Plans]: ../scheduler/scheduler-plans-billing.md
[continuously deploy]: ../app-service-web/app-service-continuous-deployment.md
[Convert your Mixed namespaces]: https://azure.microsoft.com/en-us/blog/updates-from-notification-hubs-independent-nuget-installation-model-pmt-and-more/
[curl]: http://curl.haxx.se/
[custom domain names]: ../app-service-web/web-sites-custom-domain-name.md
[Fiddler]: http://www.telerik.com/fiddler
[general availability of Azure App Service]: https://azure.microsoft.com/blog/announcing-general-availability-of-app-service-mobile-apps/
[Hybrid Connections]: ../app-service-web/web-sites-hybrid-connection-get-started.md
[Logging]: ../app-service-web/web-sites-enable-diagnostic-log.md
[Mobile Apps Node.js SDK]: https://github.com/azure/azure-mobile-apps-node
[Mobile Services vs. App Service]: app-service-mobile-value-prop-migration-from-mobile-services.md
[Notification Hubs]: ../notification-hubs/notification-hubs-push-notification-overview.md
[performance monitoring]: ../app-service-web/web-sites-monitor.md
[Postman]: http://www.getpostman.com/
[staging slots]: ../app-service-web/web-sites-staged-publishing.md
[VNet]: ../app-service-web/web-sites-integrate-with-vnet.md
[WebJobs]: ../app-service-web/websites-webjobs-resources.md
[XDT Transform Samples]: https://github.com/projectkudu/kudu/wiki/Xdt-transform-samples
[Functions]: ../azure-functions/functions-overview.md
