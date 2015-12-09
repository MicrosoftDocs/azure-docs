<properties
	pageTitle="Migrate from Mobile Services to an App Service Mobile App"
	description="Learn how to easily migrate your Mobile Services application to an App Service Mobile App"
	services="app-service\mobile"
	documentationCenter=""
	authors="adrianhall"
	manager="dwrede"
	editor=""/>

<tags
	ms.service="app-service-mobile"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile"
	ms.devlang="na"
	ms.topic="article"
	ms.date="12/9/2015"
	ms.author="adrianhall"/>

# Migrate your existing Azure Mobile Service to Azure App Service

With the [general availability of Azure App Service], Azure Mobile Services sites can be easily migrated in-place to take advantage of all the
features of the Azure App Service.  This document explains what to expect when migrating your site from Azure Mobile Services to Azure App Service.

## What does migration do to your site

Migration of your Azure Mobile Service will turn your Mobile Service into an [Azure App Service] without affecting the code in any way.  Your Notification
Hubs, SQL data connection, authentication settings and scheduled jobs, domain name will remain unchanged.  Mobile clients using your Azure Mobile Service
will continue to operate normally.  Migration will restart your service once it is transferred to Azure App Service.

[AZURE.INCLUDE [app-service-mobile-migrate-vs-upgrade](../../includes/app-service-mobile-migrate-vs-upgrade.md)]

## Why you should migrate your site

Microsoft is recommending that you migrate your Azure Mobile Service to take advantage of the features of Azure App Service, including:

  *  New host features, including [WebJobs] and [custom domain names].
  *  Connectivity to your on-premise resources using [VNet] in addition to [Hybrid Connections].
  *  Monitoring and troubleshooting with New Relic or [Application Insights].
  *  Built-in DevOps tooling, including [staging slots], roll-back and in-production testing.
  *  [Auto-scale], load balancing and [performance monitoring].

For more information on the benefits of Azure App Service, see the [Mobile Services vs. App Service] topic.

## Why you should not migrate your site

There are a few reasons why you should not migrate your Azure Mobile Services now:

  *  You are currently in a busy period and cannot afford a site restart at this time.
  *  You do not wish to affect your production site before testing the migration process.
  *  You have multiple sites in the Free or Basic pricing tiers and do not want to migrate all sites at the same time.
  *  You have scheduled jobs configured as on demand that you wish to migrate.

In you are in a busy period, then please plan to migrate during a scheduled maintenance window.  The migration process restarts your
site as part of the process and your users may notice this momentary availability disruption.

There are workarounds for most of the items in this list.  Please refer to the [Before you begin] section below for details.

## Before you begin

You should follow the following steps before migrating your site:

  *  Raise the Mobile Service tier to Standard
  *  Optionally convert your On-demand Scheduled Jobs to WebJobs.  This can be done post-migration as well.

In addition, Microsoft recommends that you [prepare for disaster recovery] by backing up your mobile service scripts and SQL database if you
have not done so already.

If you wish to test the migration process before migrating your production site, duplicate your production Azure Mobile Service (complete
with a copy of the data source) and test the migration against the new URL.  You will have to have a test client implementation to properly
test the migrated site.

### (Optional) Raise the Mobile Service tier to Standard

All Mobile Services sites that share a hosting plan are migrated at once.  Mobile Services in the Free or Basic pricing tiers share
a hosting plan with other services in the same pricing tier and [Azure Region]. If your Mobile Service is operating on the Standard pricing
tier, it is located in its own hosting plan.  If you wish to individually migrate sites in the Free or Basic pricing tiers, temporarily
upgrade the Mobile Service pricing tier to Standard.  You can do this in the SCALE menu for your Mobile Service.

  1.  Log onto the [Azure Classic Portal].
  2.  Select your Mobile Service.
  3.  Select the **SCALE** tab.
  4.  Under **Mobile Service Tier**, click on the **STANDARD** tier.  Click on the **SAVE** icon at the bottom of the page.

Remember to set the pricing tier to an appropriate setting after migration.

### (Optional) Deal with On-demand Scheduled Jobs

Scheduled jobs are found in the SCHEDULE tab of your Mobile Service.  Any job with a defined schedule will be migrated to a Scheduler Collection.
On-demand jobs will be migrated but are triggered manually by sending a web request.  We recommend that you transition On-demand Scheduled Jobs to
[WebJobs].

You can convert your on-demand scheduled jobs either before or after the migration.

## Migrating your site

To migrate your site:

  1.  Log onto the [Azure Classic Portal].
  2.  Select your Mobile Service.
  3.  Click on the **Migrate to App Service** button.

    ![The Migrate Button][0]

  4.  Read the Migrate to App Service dialog.
  5.  Enter the name of your Mobile Service in the box provided.  For example, if your domain name is contoso.azure-mobile.net, then enter _contoso_ in the box provided.
  6.  Click on the tick button.

If you are migrating a Mobile Service in the Free or Basic pricing tiers, all Mobile Services in that pricing tier will be migrated at the same time.  You
can monitor the status of the migration in the activity monitor and your site will be listed as *migrating* in the [Azure Classic Portal].

  ![Migration Activity Monitor][1]

Each migration can take anywhere from 30 seconds to 15 minutes or more, depending on the number of Mobile Services being migrated.  Your site will remain
available during the migration but will be restarted at the end of the migration process.

## Finalizing the Migration

You should plan to test your site from a mobile client at the conclusion of the migration process.  Ensure you can perform all common client actions
without changes to the mobile client.  In addition, you should ensure that the changes you made to effect the migration (such as changing the pricing
tier or enabling scheduled jobs) are reverted if necessary.

Please note the following specific management tasks:

### Select an appropriate App Service pricing tier

You have more flexibility in pricing after you migrate to Azure App Service.

  1.  Log into the [Azure Portal].
  2.  Select **All resources** or **App Services** then click on the name of your migrated Mobile Service.
  3.  The Settings blade will open by default - if it doesn't, click on **Settings**.
  4.  Click on **App Service Plan** in the Settings menu.
  5.  Click on the **Pricing Tier** tile.
  6.  Click on the tile appropriate to your requirements, then click on **Select**.  You may need to click on **View all** to see the available pricing tiers.

As a starting point, we recommend the following:

| Mobile Service Pricing Tier | App Service Pricing Tier |
| Free | F1 Free |
| Basic | B1 Basic |
| Standard | S1 Standard |

Note that there is considerable flexibility in choosing the right pricing tier for your application.  Refer to [App Service Pricing] for
full details on the pricing of your new App Service.

### TODO: Review the Migrated Scheduler Jobs

Scheduler Jobs will not be visible until approximately 30 minutes after migration.  Any scheduled jobs will continue to run in the background.
To view your scheduled jobs:

  1.  Log into the [Azure Portal].
  2.  Select **Browse>**, enter **Schedule** in the _Filter_ box, then select **Scheduler Collections**.

There are a limited number of free scheduler jobs available post-migration.  You should review your usage and the [Azure Scheduler Plans].

### Configure CORS if needed

[Cross-origin resource sharing] (also known as CORS) is a technique to allow a website to access a Web API on a different domain.  If you were using
Azure Mobile Services with an associated website then you will need to configure CORS as part of the migration.  If you were accessing Azure Mobile
Services exclusively from mobile devices, then CORS does not need to be configured except in rare cases.

CORS is handled within the App Service settings.  To configure CORS:

  1.  Log into the [Azure Portal].
  2.  Select **All resources** or **App Services** then click on the name of your migrated Mobile Service.
  3.  The Settings blade will open by default - if it doesn't, click on **Settings**.
  4.  Click on **CORS** in the API menu.
  5.  Enter any Allowed Origins in the box provided, pressing Enter after each one.
  6.  Once your list of Allowed Origins is correct, click on the Save button.

> [AZURE.TIP]  One of the advantages of using an Azure App Service is that you can run your web site and mobile service on the same site.  See
> the [next steps] section for more information.

## Working with your site post-migration

You will start working with your new App Service in the [Azure Portal] post-migration.  The following are some notes on specific operations that
you used to perform in the [Azure Classic Portal], together with their App Service equivalent.

### Downloading and Publishing your migrated site

Your site is available via git or ftp.  The deployment credentials are migrated with the rest of your site.  If you did not set your deployment
credentials or you do not remember them, you can reset them:

  1. Log into the [Azure Portal].
  2. Select **All resources** or **App Services** then click on the name of your migrated Mobile Service.
  3. The Settings blade will open by default - if it doesn't, click on **Settings**.
  4. Click on **Deployment credentials** in the PUBLISHING menu.
  5. Enter the new deployment credentials in the boxes provided, then click on the Save button.

You can use these credentials to clone the site with git or set up automated deployments from GitHub, TFS or Mercurial.  For more
information, see the [Azure App Service deployment documentation].

> [AZURE.NOTE] TODO: INCLUDE SOMETHING ABOUT THE PUBLISHING PROFILE UPDATE HERE

### Authentication

All authentication settings are available as App Settings in your migrated site.  To update your authentication settings, you must alter the
appropriate app settings.  The following table shows the appropriate app settings for your authentication provider:

| Provider | Client ID | Client Secret | Other Settings
| Microsoft Account | **MS_MicrosoftClientID** | **MS_MicrosoftClientSecret** | **MS_MicrosoftPackageSID** |
| Facebook | **MS_FacebookAppID** | **MS_FacebookAppSecret** | |
| Twitter | **MS_TwitterConsumerKey** | **MS_TwitterConsumerSecret** | |
| Google | **MS_GoogleClientID** | **MS_GoogleClientSecret** | |
| Azure AD | ** MS_AadClientID** | | **MS_AadTenants** |

Note: **MS_AadTenants** is stored as a comma-separated list of tenant domains (the "Allowed Tenants" fields in the Mobile Services portal).

> [AZURE.WARNING] Azure App Service provides a separate "no-code" Authentication and Authorization system under the _Authentication / Authorization_
> Settings menu and a deprecated _Mobile Authentication_ option under the Settings menu.  These options are incompatible with a migrated Azure
> Mobile Service.  **DO NOT USE THE AUTHENTICATION MECHANISMS IN THE SETTINGS MENU**.  You must [upgrade your site] to take advantage of the Azure
> App Service authentication

To set an App Setting on your App Service:

  1. Log into the [Azure Portal].
  2. Select **All resources** or **App Services** then click on the name of your migrated Mobile Service.
  3. The Settings blade will open by default - if it doesn't, click on **Settings**.
  4. Click on **Application settings** in the GENERAL menu.
  5. Scroll to the App Settings section and find your app setting.
  6. Click on the value of the app setting to edit the value.  Click on **Save** to save the value.

You can update multiple app settings at the same time.

> [AZURE.TIP]  You will notice that there are two Application Settings with the same value.  For example, you may see _ApplicationKey_ and
> _MS_ApplicationKey_.  You only need to alter the app setting prefixed by **MS_**. However, it is a good idea to update both app settings at
> the same time.

### Data

The _Data_ tab has been replaced by _Easy Tables_ within the Azure Portal.  To access Easy Tables:

  1. Log into the [Azure Portal].
  2. Select **All resources** or **App Services** then click on the name of your migrated Mobile Service.
  3. The Settings blade will open by default - if it doesn't, click on **Settings**.
  4. Click on **Easy tables** in the MOBILE menu.

You can add a new table by clicking on the **Add** button or access your existing tables by clicking on a table name.  There are a variety of operations
you can do from this blade, including:

  * Changing table permissions
  * Editing the operational scripts
  * Managing the table schema
  * Deleting the table
  * Clearing the table contents
  * Deleting specific rows of the table

### API

The _API_ tab has been replaced by _Easy APIs_ within the Azure Portal.  To access Easy APIs:

  1. Log into the [Azure Portal].
  2. Select **All resources** or **App Services** then click on the name of your migrated Mobile Service.
  3. The Settings blade will open by default - if it doesn't, click on **Settings**.
  4. Click on **Easy APIs** in the MOBILE menu.

Your migrated APIs will already be listed in the blade.  You can also add a new API from this blade.  To manage a specific API, click on the API.
From the new blade, you can adjust the permissions and edit the scripts for the API.

### On-Demand Jobs

On-demand Jobs are triggered through a web request.  We recommend using [Postman] or [Fiddler] for this.  If your site is called 'contoso' then you will have an
endpoint https://contoso.azure-mobile.net/jobs/_yourjobname_ that you can use to trigger the on-demand job.  You will need to submit an additional
header **X-ZUMO-MASTER** with your master key.

The master key can be obtained as follows:

  1. Log into the [Azure Portal].
  2. Select **All resources** or **App Services** then click on the name of your migrated Mobile Service.
  3. The Settings blade will open by default - if it doesn't, click on **Settings**.
  4. Click on **Application settings** in the GENERAL menu.
  5. Look for the **MS_MasterKey** application setting.

You can cut-and-paste the master key into your Postman session.  Here is an example of triggering an on-demand job in a migrated mobile service:

  ![Trigger an On-demand Job with Postman][2]

Note the settings:

  * Method: **POST**
  * URL: https://_yoursite_.azure-mobile.net/jobs/_yourjobname_
  * Headers: X-ZUMO-MASTER: _your-master-key_

Alternatively you can use [curl] to trigger the on-demand job on a command line:

    curl -H 'X-ZUMO-MASTER: yourmasterkey' --data-ascii '' https://yoursite.azure-mobile.net/jobs/yourjob

Your on-demand jobs are located in App_Data/config/scripts/scheduler post-migration.  We recommend that you convert all on-demand jobs to [WebJobs].

### Notification Hubs

Notification Hubs are managed in the Notification Hub section of the portal.  If you wish to update the settings of your Notification Hub:

  1. Log into the [Azure Portal].
  2. Select **All resources** or **Notification Hubs** then click on the name of your migrated Notification Hub.
  3. The Settings blade will open by default - if it doesn't, click on **Settings**.

Most individual Push Notification Service settings are under _Notification Services_.  The Connection Strings are available under _Access Policies_.  The
notification hub is associated with your migrated Mobile Service through an app setting.  If you wish to change the association, review the [Notification
Hubs Overview] documentation for information.

### App Settings

The following additional app settings are migrated from your Mobile Service and available under *Settings* > *App Settings*:

| Application Setting | Description |
| **MS_MobileServiceName** | The name of your app |
| **MS_MobileServiceDomainSuffix** | The domain prefix. i.e azure-mobile.net |
| **MS_ApplicationKey** | Your application key |
| **MS_MasterKey** | Your app master key |
| **ApplicationMasterKey** | Your app master key |

The application key and master key should be identical to the Application Keys from your original Mobile Service.  In particular, the Application Key is
sent by mobile clients to validate their use of the mobile API.

### Diagnostics and Logging

Diagnostic Logging is normally disabled in an Azure App Service.  To enable diagnostic logging:

  1. Log into the [Azure Portal].
  2. Select **All resources** or **App Services** then click on the name of your migrated Mobile Service.
  3. The Settings blade will open by default - if it doesn't, click on **Settings**.
  4. Select **Diagnostic Logs** under the FEATURES menu.
  5. Click **ON** for the following logs:
    a. Application Logging (Filesystem)
    b. Detailed error messages
    c. Failed request tracing
  6. Click **File System** for Web server logging
  7. Click on **Save**

To view the logs:

  1. Log into the [Azure Portal].
  2. Select **All resources** or **App Services** then click on the name of your migrated Mobile Service.
  3. Click on the **Tools** button
  4. Select **Log Stream** under the OBSERVE menu.

Logs will stream into the window provided as they are generated.  You can also download the logs for later analysis using your deployment credentials.  See
the [Logging] documentation for more information.

## Next Steps

We hope that this is not the end of your journey into the Azure App Service platform.  More features are available.  Here are links to some of our
favorites:

  * Deployment [staging slots] allow you to stage changes to your site and perform A/B testing
  * [WebJobs] provide a replacement for On-demand scheduled jobs
  * You can [continuously deploy] your site by linking your site to GitHub, TFS or Mercurial
  * You can use [Application Insights] to monitor your site

### Upgrading your Mobile Services site to Azure Mobile Apps v2.0

[AZURE.INCLUDE [app-service-mobile-migrate-vs-upgrade](../../includes/app-service-mobile-migrate-vs-upgrade.md)]

  * For Node.js-based server projects, the new [Mobile Apps Node.js SDK] provides a number of new features. For instance, you can now do local development and debugging, use any Node.js version above 0.10, and customize with any Express.js middleware.

  * For .NET-based server projects, the new [Mobile Apps SDK NuGet packages](https://www.nuget.org/packages/Microsoft.Azure.Mobile.Server/) has more flexibility on NuGet dependencies, supports the new App Service authentication features, and composes with any ASP.NET project, including MVC. To learn more about upgrading, see [Upgrade your existing .NET Mobile Service to App Service](app-service-mobile-net-upgrading-from-mobile-services.md).

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
[Azure Portal]: https://portal.azure.com
[Azure Region]: https://azure.microsoft.com/en-us/regions/
[Azure Scheduler Plans]: ../scheduler/scheduler-plans-billing.md
[continuously deploy]: ../app-service-web/web-sites-publish-source-control.md
[curl]: http://curl.haxx.se/
[custom domain names]: ../app-service-web/web-sites-custom-domain-name.md
[Fiddler]: http://www.telerik.com/fiddler
[general availability of Azure App Service]: /blog/announcing-general-availability-of-app-service-mobile-apps/
[Hybrid Connections]: ../app-service-web/web-sites-hybrid-connection-get-started.md
[Logging]: ../app-service-web/web-sites-enable-diagnostic-log.md
[Mobile Apps Node.js SDK]: https://github.com/azure/azure-mobile-apps-node
[Mobile Services vs. App Service]: app-service-mobile-value-prop-migration-from-mobile-services-preview.md
[Notification Hubs Overview]: ../notification-hubs/notification-hubs-overview.md
[performance monitoring]: ../app-service-web/web-sites-monitor.md
[Postman]: http://www.getpostman.com/
[prepare for disaster recovery]: ../mobile-services/mobile-services-disaster-recovery.md
[staging slots]: ../app-service-web/web-sites-staged-publishing.md
[VNet]: ../app-service-web/web-sites-integrate-with-vnet.md
[WebJobs]: ../app-service-web/websites-webjobs-resources.md
