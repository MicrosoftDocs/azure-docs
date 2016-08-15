<properties
   pageTitle="Basic web application | Azure reference architecture | Microsoft Azure"
   description="Recommended architecture for a basic web application running in Microsoft Azure."
   services="app-service,app-service\web,sql-database"
   documentationCenter="na"
   authors="mikewasson"
   manager="roshar"
   editor=""
   tags=""/>

<tags
   ms.service="guidance"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="07/21/2016"
   ms.author="mikewasson"/>

# Azure reference architecture: Basic web application

[AZURE.INCLUDE [pnp-RA-branding](../../includes/guidance-pnp-header-include.md)]

This article shows a recommended architecture for a basic web application in Microsoft Azure. 
The architecture implements a web front end using [Azure App Service][app-service], with [Azure SQL Database][sql-db] on the database. Later articles in this series build on this basic architecture, adding components such as cache and CDN. 

> [AZURE.NOTE] This article is not focused on application development, and doesn't assume any particular application framework. Instead, the goal is to understand how the various Azure services fit together within this application architecture.

## Architecture diagram

![[0]][0]

The architecture has the following components:

- **Resource group**. A [resource group][resource-group] is a logical container for Azure resources. 

- **App Service app**. [Azure App Service][app-service] is a fully managed platform for creating and deploying cloud applications.     

- **App Service plan**. An [App Service plan][app-service-plans] provides the managed virtual machines (VMs) that host your app. All apps associated with a plan run on the same VM instances. 

- **Deployment slots.**  A [deployment slot][deployment-slots] lets you stage a deployment and then swap it with the production deployment. That way, you avoid deploying directly into production. See the [Manageability](#manageability-considerations) section for specific recommendations.   

- **IP address.** The App Service app has a public IP address and a domain name. The domain name is a subdomain of `azurewebsites.net`, such as `contoso.azurewebsites.net`. To use a custom domain name, such as `contoso.com`, create DNS records that map the custom domain name to the IP address. For more information, see [Configure a custom domain name in Azure App Service][custom-domain-name].

- **Azure SQL Database**. [SQL Database][sql-db] is a relational database-as-a-service in the cloud. 

- **Logical server.** In Azure SQL Database, a logical server hosts your databases. You can create multiple databases per logical server. 

- **Azure Storage.** Create an Azure storage account with a blob container to store diagnostic logs. 

- **Azure Active Directory** (Azure AD). Use Azure AD or another identity provider for authentication.

## Recommendations

### App Service plan

Use the Standard or Premium tiers, because they support scale out, autoscale, and SSL, among other features. Each tier supports several *instance sizes*, which differ by number of cores and memory. You can change the tier or instance size after you create a plan. For more information about app service plans, see [App Service Pricing][app-service-plans-tiers].

You are charged for the instances in the App Service plan, even if the app is stopped. Make sure to delete plans that you aren't using (for example, test deployments).

### SQL Database

Use the [V12 version][sql-db-v12] of SQL Database. SQL Database supports Basic, Standard, and Premium [service tiers][sql-db-service-tiers], with multiple performance levels within each tier, measured in [Database Transaction Units (DTUs)][sql-dtu]. Do capacity planning and choose a tier and performance level that meets your requirements.

### Region

Provision the App Service plan and the SQL Database in the same region, to minimize network latency. Generally, choose a region closest to your users. 

The resource group also has a region, which specifies where deployment metadata is stored. Put the resource group and its resources in the same region. This can improve availability during deployment, if there is problem in some Azure datacenters.  


## Scalability considerations

### Scaling the App Service app

There are two ways to scale an App Service app:

- *Scale up*, which means changing the instance size. The instance size determines the memory, number of cores, and storage on each VM instance. You can scale up manually by changing the instance size or the plan tier.  

- *Scale out*, which means adding instances to handle increased load. Each pricing tier has a maximum number of instances. You can scale out manually by changing the instance count, or use [autoscaling][web-app-autoscale] to have Azure automatically add or remove instances, based on a schedule and/or performance metrics.

    - An autoscale profile defines the minimum and maximum number of instances. Profiles can be scheduled. For example, you can create separate profiles for weekdays and weekends. 

    - Optionally, a profile has rules for when to add or remove instances, within the minimum and mazimum range defined by the profile. For example: Add two instances if CPU usage is above 70% for 5 minutes. Each scale operation happens quickly &mdash; typically within seconds.
    
    - Autoscale rules include a *cool-down* period, which is the interval to wait after a scale action before performing another scale action. The cool-down period lets the system stabilize before scaling again.
 
Here are our recommendations for scaling a web app:

- As much as possible, avoid scaling up and down, because it may trigger an application restart. Select a tier and size that meet your performance requirements under typical load, and then scale out the instances to handle changes in traffic volume.    

- Enable autoscaling. If your application has a predictable, regular workload, create profiles to schedule the instance counts ahead of time. If the workload is not predictable, use rule-based autoscaling to react to changes in load as they occur. You can combine both approaches. 

- CPU is generally a good metric for autoscale rules. However, you should load test your application, identify potential bottlenecks, and base your autoscale rules on that data.  

- Set a shorter cool-down period for adding instances, and a longer cool-down period for removing instances. For example, set 5 minutes to add an instance, but 60 minutes to remove an instance. Under sudden load, it's better to add new instances quickly, to handle the traffic, and then gradually scale back.
    
### Scaling SQL Database

If you need a higher service tier or performance level for SQL Database, you can scale up individual databases, with no application downtime. For details, see [Change the service tier and performance level of a SQL database][sql-db-scale]. 

## Availability considerations

At the time of writing, the SLA for App Service is 99.95%, and the SLA for SQL Database is 99.99% for Basic, Standard, and Premium tiers. 

> [AZURE.NOTE] The App Service SLA applies to both single and multiple instances.  

### Backups

SQL Database provides point-in-time restore and geo-restore. These features are available in all tiers and are automatically enabled. You don't need to schedule or manage the backups. 

- Use point-in-time restore to [recover from human error][sql-human-error]. It returns your database to an earlier point in time.

- Use geo-restore to [recover from a service outage][sql-outage-recovery]. It restores a database from a geo-redundant backup.

For more information about these options, see [Cloud business continuity and database disaster recovery with SQL Database][sql-backup]. 

App Service provides a [backup and restore][web-app-backup] feature. However, be aware that the backed-up files include app settings in plain text. These may include secrets, such as connection strings. Avoid using the App Service backup feature to back up your SQL databases, because it exports the database to a SQL .bacpac file, which uses [DTUs][sql-dtu]. Instead, use SQL Database point-in-time restore, described above. 

## Manageability considerations

Create separate resource groups for production, development, and test environments. This makes it easier to manage deployments, delete test deployments, and assign access rights.

When assigning resources to resource groups, consider the following:

- Lifecycle. In general, put resources with the same lifecycle into the same resource group. 

- Access. You can use [role-based access control][rbac] (RBAC) to apply access policies to the resources in a group.

- Billing. You can view the rolled-up costs for the an resource group.  

For more information, see [Azure Resource Manager overview][resource-group].

### Deployment

Deployment involves two steps:

- Provisioning the Azure resources. We recommend that you use [Azure Resoure Manager templates][arm-template] for this step. Templates make it easier to automate deployments via PowerShell or the Azure CLI. 

- Deploying the application (code, binaries, and content files). You have several options, including deploying from a local Git repository, using Visual Studio, or continuous deployment from cloud-based source control. See [Deploy your app to Azure App Service][deploy].  
 
An App Service app always has one deployment slot named `production`, which represents the live production site. We recommend creating a staging slot for deploying updates. The benefits of using a staging slot include:

- You can verify the deployment succeeded, before swapping it into production.

- Deploying to a staging slot ensures that all instances are warmed up before being swapped into production. Many applications have a significant warmup and cold-start time. 

We also recommend creating a third slot to hold the last-known-good deployment. After you swap staging and production, move the previous production deployment (which is now in staging) into the last-known-good slot. That way, if you discover a problem later, you can quickly revert to the last-known-good version. 

![[1]][1]

If you revert to a previous version, make sure any database schema changes are backward compatible.

Don't use slots on your production deployment for testing, because all apps within the same App Service plan share the same VM instances. For example, load tests might degrade the live production site. Instead, create separate App Service plans for production and test. By putting test deployments into a separate plan, you isolate them from the production version. 

### Configuration

Store configuration settings as [app settings][app-settings]. Define the app settings in your Resource Manager templates, or by using PowerShell. At runtime, app settings are available to the application as environment variables. 

Never check passwords, access keys, or connection strings into source control. Instead, pass these as parameters to a deployment script that stores these values as app settings. 

When you swap a deployment slot, the app settings are swapped by default. If you need different settings for production and staging, you can create app settings that "stick" to a slot and don't get swapped. 

### Diagnostics and monitoring

Enable [diagnostics logging][diagnostic-logs], including application logging and web server logging. Configure logging to use blob storage. For performance reasons, create a separate storage account for diagnostic logs. Don't use the same storage account for logs and application data. For more detailed guidance on logging, see [Monitoring and diagnostics guidance][monitoring-guidance]. 

Use a service such as [New Relic][new-relic] or [Application Insights][app-insights] to monitor application performance and behavior under load. Be aware of the [data rate limits][app-insights-data-rate] for Application Insights.

Perform load testing, using a tool such as [Visual Studio Team Services][vsts]. For a general overview of performance analysis in cloud applications, see [Performance Analysis Primer][perf-analysis].

Tips for troubleshooting your application:

- Use the [Troubleshoot blade][troubleshoot-blade] in the Azure portal to identity solutions to common problems.

- Enable [log streaming][web-app-log-stream] to see logging information in near-real time. 

- The [Kudu dashboard][kudu] has several tools for monitoring and debugging your application. For more information, see [Azure Websites online tools you should know about][kudu] (blog post). You can reach the Kudu dashboard from the Azure Portal. Open the blade for your app and click **Tools**, then click **Kudu**.

- If you use Visual Studio, see the article [Troubleshoot a web app in Azure App Service using Visual Studio][troubleshoot-web-app] for debugging and troubleshooting tips.


## Security considerations

> [AZURE.NOTE] This section points out some security considerations that are specific to the Azure services described in this article. It's not a complete list of security best practices. For some additional security considerations, see [Secure an app in Azure App Service][app-service-security].

**SQL Database auditing**. Auditing can help you maintain regulatory compliance, and get insight into discrepancies and anomalies that could indicate business concerns or suspected security violations. See [Get started with SQL database auditing][sql-audit].

**Deployment slots**. Each deployment slot has a public IP address. Secure the non-production slots using [Azure Active Directory login][aad-auth], so that only members of your development and DevOps teams can reach those endpoints. 

**Logging**. Logs should never record users' passwords or other information that might be used to commit identity fraud. Scrub those details from the data before storing it.   

**SSL**. An App Service app includes an SSL endpoint on a subdomain of `azurewebsites.net` at no additional cost, with a wildcard certificate for the `*.azurewebsites.net` domain.     If you use a custom domain name, you must provide a certificate that matches the custom domain. The simplest approach is to buy a certificate directly through the Azure Portal. You can also import certificates  from other certificate authorities. For more information, see [Buy and Configure an SSL Certificate for your Azure App Service][ssl-cert]. 

As a security best practice, your app should enforce HTTPS, by redirecting HTTP requests. You can implement this inside your application, or use a URL rewrite rule as described in [Enable HTTPS for an app in Azure App Service][ssl-redirect].

### Authentication

We recommend authenticating through an identity provider (IDP), such as Azure AD, Facebook, Google, or Twitter, using OAuth 2 or OpenID Connect (OIDC) for the authentication flow. 

Azure AD gives you the ability to manage users and groups, create application roles, integrate your on-premises identities, and consume backend services such as Office 365 and Skype for Business.

Avoid having the application manage user logins and credentials directly, as it creates a large potential attack surface. At a minimum, you would need to have email confirmation, password recovery, and multi-factor authentication; validate password strength; and store password hashes securely. The large identity providers handle all of those things for you, and are constantly monitoring and improving their security practices. 

Consider using [App Service Authentication][app-service-auth] to implement the OAuth/OIDC authentication flow. The benefits of App Service Authentication include:

- Easy to configure.
    
- For simple authentication scenarios, no code is required.
    
- Supports delegated authorization; that is, using OAuth access tokens to consume resources on behalf of the user.
    
- Provides a built-in token cache.

Some limitations of App Service Authentication:  

- Limited customization options. 

- Delegated authorization is restricted to one backend resource per login session.
    
- If you use more than one IDP, there is no built-in mechanism for home realm discovery.

- For multi-tenant scenarios, the application must implement the logic to validate the token issuer.



## Deploying the sample solution

An example Resoure Manager template for this architecture is available on GitHub. Download it [here][paas-basic-arm-template].

To deploy the template using PowerShell, run the following commands:

```
New-AzureRmResourceGroup -Name <resource-group-name> -Location "West US"

$parameters = @{"appName"="<app-name>";"environment"="dev";"locationShort"="uw";"databaseName"="app-db";"administratorLogin"="<admin>";"administratorLoginPassword"="<password>"}
    
New-AzureRmResourceGroupDeployment -Name <deployment-name> -ResourceGroupName <resource-group-name> -TemplateFile .\PaaS-Basic.json -TemplateParameterObject  $parameters
```

For more information, see [Deploy resources with Azure Resource Manager templates][deploy-arm-template].


## Next steps

- You can improve scalability and performance by adding features such as caching, CDN, and background processing for long-running tasks. See [Web application with improved scalability](guidance-web-apps-scalability.md).

<!-- links -->

[aad-auth]: ../app-service-mobile/app-service-mobile-how-to-configure-active-directory-authentication.md
[app-insights]: ../application-insights/app-insights-overview.md
[app-insights-data-rate]: ../application-insights/app-insights-pricing.md
[app-service]: https://azure.microsoft.com/en-us/documentation/services/app-service/
[app-service-auth]: ../app-service-api/app-service-api-authentication.md
[app-service-plans]: ../app-service/azure-web-sites-web-hosting-plans-in-depth-overview.md
[app-service-plans-tiers]: https://azure.microsoft.com/en-us/pricing/details/app-service/
[app-service-security]: ../app-service-web/web-sites-security.md
[app-settings]: ../app-service-web/web-sites-configure.md
[arm-template]: ../resource-group-overview.md
[custom-domain-name]: ../app-service-web/web-sites-custom-domain-name.md
[deploy]: ../app-service-web/web-sites-deploy.md
[deploy-arm-template]: ../resource-group-template-deploy.md
[deployment-slots]: ../app-service-web/web-sites-staged-publishing.md
[diagnostic-logs]: ../app-service-web/web-sites-enable-diagnostic-log.md
[kudu]: https://azure.microsoft.com/en-us/blog/windows-azure-websites-online-tools-you-should-know-about/
[monitoring-guidance]: ../best-practices-monitoring.md
[new-relic]: http://newrelic.com/
[paas-basic-arm-template]: https://github.com/mspnp/blueprints/tree/master/paas-basic/Paas-Basic/Templates
[perf-analysis]: https://github.com/mspnp/performance-optimization/blob/master/Performance-Analysis-Primer.md
[rbac]: ../active-directory/role-based-access-control-what-is.md
[resource-group]: ../resource-group-overview.md
[sla]: https://azure.microsoft.com/en-us/support/legal/sla/
[sql-audit]: ../sql-database/sql-database-auditing-get-started.md
[sql-backup]: ../sql-database/sql-database-business-continuity.md
[sql-db]: https://azure.microsoft.com/en-us/documentation/services/sql-database/
[sql-db-scale]: ../sql-database/sql-database-scale-up-powershell.md
[sql-db-service-tiers]: ../sql-database/sql-database-service-tiers.md
[sql-db-v12]: ../sql-database/sql-database-v12-whats-new.md
[sql-dtu]: ../sql-database/sql-database-service-tiers.md#understanding-dtus
[sql-human-error]: ../sql-database/sql-database-business-continuity.md#recover-a-database-after-a-user-or-application-error
[sql-outage-recovery]: ../sql-database/sql-database-business-continuity.md#recover-a-database-to-another-region-from-an-azure-regional-data-center-outage
[ssl-redirect]: ../app-service-web/web-sites-configure-ssl-certificate.md#4-enforce-https-on-your-app
[sql-resource-limits]: ../sql-database/sql-database-resource-limits.md
[ssl-cert]: ../app-service-web/web-sites-purchase-ssl-web-site.md
[troubleshoot-blade]: https://azure.microsoft.com/en-us/updates/self-service-troubleshooting-for-app-service-web-apps-customers/
[troubleshoot-web-app]: ../app-service-web/web-sites-dotnet-troubleshoot-visual-studio.md
[vsts]: https://www.visualstudio.com/en-us/features/vso-cloud-load-testing-vs.aspx
[web-app-autoscale]: ../app-service-web/web-sites-scale.md#scaling-to-standard-or-premium-mode
[web-app-backup]: ../app-service-web/web-sites-backup.md
[web-app-log-stream]: ../app-service-web/web-sites-enable-diagnostic-log.md#streamlogs
[0]: ./media/blueprints/paas-basic-web-app.png "Architecture of a basic Azure web application"
[1]: ./media/blueprints/paas-basic-web-app-staging-slots.png "Swapping slots for production and staging deployments"