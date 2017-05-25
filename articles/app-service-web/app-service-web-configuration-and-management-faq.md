---
title: Configuration and management issues for Azure Web Apps FAQ| Microsoft Docs
description: This article lists the frequently asked questions about configuration and management in Azure Web Apps.
services: app-service\web
documentationcenter: ''
author: simonxjx
manager: cshepard
editor: ''
tags: top-support-issue

ms.assetid: 2fa5ee6b-51a6-4237-805f-518e6c57d11b
ms.service: app-service-webf
ms.workload: web
ms.tgt_pltfrm: ibiza
ms.devlang: na
ms.topic: article
ms.date: 5/16/2017
ms.author: v-six

---
# Configuration and management issues for Azure Web Apps: Frequently asked questions (FAQs)
This article includes frequently asked questions about configuration and management issues for [Azure Web Apps](https://azure.microsoft.com/services/app-service/web/).

[!INCLUDE [support-disclaimer](../../includes/support-disclaimer.md)]

## What are some resource move limitations I should be aware of when moving Azure App Services
There are a few limitations we need to be aware of for Azure App Service Resource Move operations as discussed in [App Service limitations](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-move-resources#app-service-limitations).

## How can I use a custom domain name for my web app
Several frequently asked questions are answered in our 7 minute screencast via [here](https://channel9.msdn.com/blogs/Azure-App-Service-Self-Help/Add-a-Custom-Domain-Name). We provide a walkthrough of how to add a custom domain name so that you can use your own URL instead of the AzureWebSites.net URL with your App Service.
In addition, our documentation also provides a detailed walkthrough on [mapping a custom domain name](https://docs.microsoft.com/azure/app-service-web/web-sites-custom-domain-name).


## How can I purchase a custom domain for my Web App
The article  ([Buy and Configure a custom domain name in Azure App Service](https://docs.microsoft.com/azure/app-service-web/custom-dns-web-site-buydomains-web-app/)) explains how to buy and configure a custom domain with App Service Web Apps.

## How can I upload and configure an SSL certificate
The steps to upload and configure a custom SSL certificate can be found [here](https://docs.microsoft.com/azure/app-service-web/web-sites-configure-ssl-certificate/#step-2-upload-and-bind-the-custom-ssl-certificate).


## How to buy and configure an SSL certificate in Azure for my Azure App Service
[This article](https://docs.microsoft.com/azure/app-service-web/web-sites-purchase-ssl-web-site/) explains how to buy and configure an SSL certificate in Azure for your Azure App Service in simple steps.


## I am trying to move Application Insights resources
Application Insights does not currently enable the move operation. So if your original resource group also includes an Application Insights resource, you cannot move that resource. If you include the Application Insights resource when moving App Service apps, the entire move operation fails. However, the Application Insights and App Service plan do not need to reside in the same resource group as the app for the app to function correctly.
To understand how you can approach this scenario, please review the guidance via [App Service limitations](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-move-resources#app-service-limitations).

## Guidance checklist and other considerations for Resource Move operations
The documentation in the link below shows you how to move resources to either a new subscription or a new resource group in the same subscription. You can find information about the resource move checklist, which services enable move and which services don't, App Service limitations and several other useful topics in good detail.
See [https://docs.microsoft.com/en-gb/azure/azure-resource-manager/resource-group-move-resources#app-service-limitations](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-move-resources#app-service-limitations) for more information.

## How do I set the server Timezone for my web app?

1. In the Azure Portal, open the Application settings menu of your Azure App Service.
2. In the 'Application Settings' menu, scroll down to find 'App settings' and add a setting as shown below:
    * Key = WEBSITE_TIME_ZONE
    * Value = *Desired Time Zone*
3. Save Changes.

## Why do my continuous WebJobs fail sometimes?

By default, web apps are unloaded if they are idle for some period of time. This lets the system conserve resources. In Basic or Standard mode, you can enable Always On to keep the web app loaded all the time. If your web app runs continuous WebJobs, you should enable Always On, or the webjobs may not run reliably. See [Create a continuously running WebJob](https://docs.microsoft.com/azure/app-service-web/web-sites-create-web-jobs/#CreateContinuous) for more information.

## How to get the outbound IP address for my web app?

Follow these steps to get the list of outbound IP addresses for your web app.
1. In Azure Portal, Open the Properties menu of your web app.
2. Search for OUTBOUND IP ADDRESSES.
You will see the list of Outbound IP addresses listed here.

If your site is hosted on **Application Service Environment**, see [Outbound Network Addresses](https://docs.microsoft.com/azure/app-service-web/app-service-app-service-environment-network-architecture-overview/#outbound-network-addresses) for instructions to get Outbound IP Address.

## How can I get reserved or dedicated Inbound IP Address for my Azure App Service?

If you need to configure a dedicated\reserved IP address for inbound calls made to the azure web app site, you will need to install and configure an IP based SSL certificate.

Please note that in order to do this your App Service Plan should be in Basic or higher pricing tier.

## Can I export my App Service certificatefor use outside of Azure, such as for a website hosted elsewhere? 
App Service certificates are to be considered Azure resources and are not intended for use outside of your Azure services. You cannot export them for use outside of Azure. For more details please see [here](https://social.msdn.microsoft.com/Forums/azure/f3e6faeb-5ed4-435a-adaa-987d5db43b80/faq-on-app-service-certificates-and-custom-domains?forum=windowsazurewebsitespreview).

## Can I export my App Service certificate for use with other Azure services such as Cloud Services?

While the portal provides first class experience for deploying App Service Certificate through Key Vault to App Service Apps, we have been receiving customer requests where they would like to use these certificates outside of App Service platform, say with Azure Virtual Machines. In the blogpost at this [link](https://blogs.msdn.microsoft.com/appserviceteam/2017/02/24/creating-a-local-pfx-copy-of-app-service-certificate/), you can find how to create a local PFX copy of App Service Certificate so that you can use with other Azure resources.

See [FAQ on App Service Certificates and Custom Domains](https://social.msdn.microsoft.com/Forums/azure/f3e6faeb-5ed4-435a-adaa-987d5db43b80/faq-on-app-service-certificates-and-custom-domains?forum=windowsazurewebsitespreview) for more information.


## Why am I seeing 'Partially Succeeded' when I try to perform backup of my web app?

One of the frequent causes for this is that some of your files are in use by the application and hence these files are locked while you performed the backup. This prevents these files from being backed up which results in the 'Partially Succeeded' status. You can potentially prevent this from excluding files from the backup process and choosing to backup only what is needed as explained via [Backup just the important parts of your site with Azure web apps](http://www.zainrizvi.io/2015/06/05/creating-partial-backups-of-your-site-with-azure-web-apps/).

## How can I remove a header from the HTTP Response?

In order to remove the headers, you need to update your site’s web.config file.

See [Removing standard server headers on Windows Azure Web Sites](https://azure.microsoft.com/blog/removing-standard-server-headers-on-windows-azure-web-sites/) for more information.

## Is Azure App Service compliant with PCI Standards 3.0 and 3.1?

The Azure App Service Web App is currently in compliance with PCI DSS version 3.0 Level 1. PCI version 3.1 is on our roadmap and planning is already underway on how adoption will proceed.

PCI DSS version 3.1 certification requires disabling TLS 1.0, which is currently not an option for most App Service Plans. However, If you are using App Service Environments or are willing to migrate your workload to App Service Environments, you can get greater control of your environment including disabling TLS 1.0 by contacting Azure Support. In the near future, we will make these settings configurable.

For more information, see [Microsoft Web App Azure App Service Compliance with PCI Standards 3.0 and 3.1](https://support.microsoft.com/help/3124528).

## How do I use staging environment and configure deployment slots?

When you deploy your web app to App Service, you can deploy to a separate deployment slot instead of the default production slot when running in the **Standard** or **Premium** App Service plan mode. Deployment slots are actually live web apps with their own hostnames. Web app content and configurations elements can be swapped between two deployment slots, including the production slot.

Please review this detailed document ([Set up staging environments in Azure App Service](https://docs.microsoft.com/azure/app-service-web/web-sites-staged-publishing/)) on creating, configuring, using and managing deployment slots.

## How can I access and review WebJob Logs?

Follow these steps to review webjob logs:
1. Login to KUDU website https://*yourwebsitename*.scm.AzureWebsites.net/azurejobs/#/jobs/.
2. Select the webjob.
3. Click on the Toggle Output button.
4. Click on the download link to download the output file.
5. For individual runs, click on the Individual Invoke.
6. Click on the Toggle Output button.
7. Click on the download link.

## Why am I getting a Hybrid Connection error with SQL Server with a System.OverflowException: 'Arithmetic operation resulted in an overflow'?

If you are trying to use Azure Hybrid Connections to access SQL Server, an update on May 10, 2016 to .NET may cause connections to fail.

When it fails you will see errors that look like this:

```
Exception: System.Data.Entity.Core.EntityException: The underlying provider failed on Open. —> System.OverflowException: Arithmetic operation resulted in an overflow. or (64 bit Web app) System.OverflowException: Array dimensions exceeded supported range, at System.Data.SqlClient.TdsParser.ConsumePreLoginHandshake
```
### Resolution
We are working to update the Hybrid Connection Manager to fix this issue. In the mean time, please review this article ([Hybrid Connection error with SQL Server: System.OverflowException: Arithmetic operation resulted in an overflow](https://blogs.msdn.microsoft.com/waws/2016/05/17/hybrid-connection-error-with-sql-server-system-overflowexception-arithmetic-operation-resulted-in-an-overflow/)) for workarounds.

## How can I add or edit a URL Rewrite rule?

Here are the steps to add/edit URL Rewrite rule.
1. Configure IIS Manager to connect to your Azure App Service web app using the steps provided via [Remote Administration of Windows Azure Websites using IIS Manager](https://azure.microsoft.com/blog/remote-administration-of-windows-azure-websites-using-iis-manager/).
2. Then, Add / Edit URL Rewrite rule using IIS Manager using the steps provided via [Creating Rewrite Rules for the URL Rewrite Module](https://www.iis.net/learn/extensions/url-rewrite-module/creating-rewrite-rules-for-the-url-rewrite-module).

## How can I control inbound traffic to my App service?

At site level, we have two options:
* You can enable Dynamic IP restrictions, see [IP and Domain Restrictions for Windows Azure Web Sites](https://azure.microsoft.com/blog/ip-and-domain-restrictions-for-windows-azure-web-sites/) for more details.
* You can enable Module Security, see [ModSecurity Web Application Firewall on Azure Websites](https://azure.microsoft.com/blog/modsecurity-for-azure-websites/) for more details.

If you are using App Service Environment, you can use [Barracuda firewall](https://azure.microsoft.com/blog/configuring-barracuda-web-application-firewall-for-azure-app-service-environment/).

## How do I block ports in an Azure App Service web app?

In the Azure App Services shared tenant environment, it is not possible to block specific ports due the nature of the infrastructure.  Also note that TCP ports 4016, 4018 and 4020 may be open for Visual Studio Remote debugging.

In App Service Environment (ASE), you have full control over Inbound / Outbound traffic and you can use NSG (Network Security groups) to restrict / block specific ports. For more information on ASE, see [Introducing App Service Environment](https://azure.microsoft.com/blog/introducing-app-service-environment/).

## How do I capture F12 traces?

### F12 HTTP Trace

1. In Internet Explorer, go to your website. Note: It is important to log in before doing the next steps, otherwise the F12 trace will capture sensitive login data.
2. Press F12, verify that the Network tab is selected, and then click the green Play button.
3. Do the steps that reproduce the issue.
4. Click the red Stop button.
5. Click the Save button (disk icon), and save the HAR file (in Internet Explorer and Edge).
6. Right click and select Save as HAR with content (in Chrome).

### F12 Console output

1. Click the Console tab.
2. For each tab that contains more than zero items, select the tab (Errors, Warnings, and Information) Note: if the tab isn’t selected, its icon will become grey/black when you move the cursor away from it.
3. Right-click in the message area of the pane, click Copy all, and paste & save these into a file.

To view HAR file, you can use this [website](http://www.softwareishard.com/har/viewer/).

## Error when trying to connect an Azure App Service Web App to a VNET that is connected to ExpressRoute.

When trying to connect an Azure App Service Web App to a VNET that's connected to ExpressRoute it will fail with the following error:

"Gateway is not a VPN gateway"

This scenario is currently not supported. You cannot enable point-to-site VPN connections to the same VNet that is connected to ExpressRoute. Point-to-site VPN and ExpressRoute cannot coexist for the same VNet. For more information please click [here](https://docs.microsoft.com/azure/expressroute/expressroute-howto-coexist-classic/#limits-and-limitations).

## How can I connect an Azure App Service Web App to a VNET with a static routing (policy based) gateway?

Currently connecting an Azure App Service Web App to a VNET that has an Static routing (policy based) gateway is not supported.If your target virtual network already exists, it must have point-to-site VPN enabled with a Dynamic routing gateway before it can be connected to an app. You cannot enable point-to-site Virtual Private Network (VPN) if your gateway is configured with Static routing. 
For more information, please click [here](https://docs.microsoft.com/azure/app-service-web/web-sites-integrate-with-vnet/#getting-started).

## In an App Service Environment (ASE) why can I only create one App Service Plan (ASP) even though I have 2 workers available?

In order to provide fault tolerance, an App Service Environment (ASE) requires that for each worker pool you have at least one additional compute resource allocated.

Each worker pool needs at least one additional compute resource which cannot be assigned workload.
For more information, see [How to Create an App Service Environment](https://docs.microsoft.com/azure/app-service-web/app-service-web-how-to-create-an-app-service-environment/#compute-resource-pools).

## Why am I seeing timeouts when trying to create an App Service Environment?

Sometimes creating an App Service Environment (ASE) will fail with the following error in the Activity logs:
```
ResourceID: /subscriptions/{SubscriptionID}/resourceGroups/Default-Networking/providers/Microsoft.Web/hostingEnvironments/{ASEname}
Error:{"error":{"code":"ResourceDeploymentFailure","message":"The resource provision operation did not complete within the allowed timeout period.”}}
```
Make sure that NONE of the following are true:
* Subnet is too small.
* Subnet is not empty.
* ExpressRoute not allowing network connectivity requirements of an ASE.
* Bad Network Security Group (NSG) not allowing network connectivity requirements of an ASE.
* Forced Tunneling enabled.

For more information, please see [Most frequent issues when deploying (creating) a new Azure App Service Environment (ASE)](https://blogs.msdn.microsoft.com/waws/2016/05/13/most-frequent-issues-when-deploying-creating-a-new-azure-app-service-environment-ase/).

## Why am I not able to delete my App Service Plan?

A common cause for this issue is that there are App Services associated with the App Service Plan you are trying to delete.

First remove all the associated App Services from the App Service Plan. This should allow you to delete the App Service Plan.

## How do I schedule a Webjob?

You can create a scheduled Webjob using CRON expressions:
1. Create a settings.job file.
2. In this JSON file include a schedule property with a CRON expression as shown below:
```
{ "schedule": "{second}
{minute} {hour} {day}
{month} {day of the week}" }
```
For more information on scheduled WebJobs, please see [Create a scheduled WebJob using a CRON expression](https://docs.microsoft.com/azure/app-service-web/web-sites-create-web-jobs/#CreateScheduledCRON).

## How can I perform penetration testing for my Azure App Service?

To perform penetration testing, you will need to submit a request. Click [here](https://security-forms.azure.com/penetration-testing/terms) to submit a request.

## How do I configure a custom domain name for a web app in Azure App Service that uses Traffic Manager?

The article ([Configuring a custom domain name for a web app in Azure App Service using Traffic Manager](https://docs.microsoft.com/azure/app-service-web/web-sites-traffic-manager-custom-domain-name/)) provides instructions for using a custom domain name with Azure App Service that use Traffic Manager for load balancing.


## My App Service Certificate is flagged for fraud. How can I take care of this?

During the Domain verification of an App Service Certificate purchase users might see the following error:

“Your certificate has been flagged for possible fraud. The request is currently under review. If the certificate does not become usable within 24 hours, please contact Azure Support.”

As the message indicates, this fraud verification process may take up to 24 hours to complete and during this time user will continue to see this message.

If your App Service Certificate continues to show this message after 24 hours of wait time then, please run the following PowerShell script to contact [certificate provider](https://www.godaddy.com/) directly to resolve this issue.
```
Login-AzureRmAccount
Set-AzureRmContext -SubscriptionId <subId>
$actionProperties = @{
    "Name"= "<Customer Email Address>"
    };
Invoke-AzureRmResourceAction -ResourceGroupName "<App Service Certificate Resource Group Name>" -ResourceType Microsoft.CertificateRegistration/certificateOrders -ResourceName "<App Service Certificate Resource Name>" -Action resendRequestEmails -Parameters $actionProperties -ApiVersion 2015-08-01 -Force   
```

## How does Authentication\Authorization work in App Service ?

We have detailed documentation on authentication and authorization via [here](https://docs.microsoft.com/azure/app-service/app-service-security-readme) which also has information on configuring with various Identify providers as seen below:
* [How to configure your app to use Azure Active Directory login](https://docs.microsoft.com/azure/app-service-mobile/app-service-mobile-how-to-configure-active-directory-authentication)
* [How to configure your app to use Facebook login](https://docs.microsoft.com/azure/app-service-mobile/app-service-mobile-how-to-configure-facebook-authentication)
* [How to configure your app to use Google login](https://docs.microsoft.com/azure/app-service-mobile/app-service-mobile-how-to-configure-google-authentication)
* [How to configure your app to use Microsoft Account login](https://docs.microsoft.com/azure/app-service-mobile/app-service-mobile-how-to-configure-microsoft-authentication)
* [How to configure your app to use Twitter login](https://docs.microsoft.com/azure/app-service-mobile/app-service-mobile-how-to-configure-twitter-authentication)

## How can I redirect the default *.azurewebsites.net domain to my custom domain on Azure Web Apps?

When you create a new website using Azure Web Apps you get a default *sitename*.azurewebsites.net domain assigned to your site. If you add a custom host name to your site and don’t want users to be able to access your default *.azurewebsites.net domain anymore, the post at the following link explains how to redirect all traffic aimed at your site’s default domain to your custom domain instead.

http://www.zainrizvi.io/2016/04/07/block-default-azure-websites-domain/

## How to determine the installed .NET version in Azure App Services?
The quickest way to find this is through the Kudu console. for your Azure App Service.  You can access the kudu console  from the portal or by using the URL of your Azure App Service. Step-by-Step instructions can be found [here](https://blogs.msdn.microsoft.com/waws/2016/11/02/how-to-determine-the-installed-net-version-in-azure-app-services/).

## Why is Autoscale not working as expected?
If you have noticed that Autoscale has not scaled-in or scaled-out the web app instances as you expected, you may be running into a scenario where we intentionally choose not to scale to avoid an infinite loop due to flapping. This usually happens when there isn't adequate margin between the scale-out and scale-in thresholds. How to avoid flapping and other Autoscale best practices are explained in good detail at this [link](https://docs.microsoft.com/azure/monitoring-and-diagnostics/insights-autoscale-best-practices/#autoscale-best-practices).

## How can I enable HTTP compression for my content?
You can turn on compression for both static and dynamic content types with the following configuration in application-level web.config:

```
<system.webServer>
<urlCompression doStaticCompression="true" doDynamicCompression="true" />
< /system.webServer>
```

You can also specify the specific dynamic and static MIME types that you would like to be compressed. More detail can be found in our response to a forum [httpCompression settings on a simple Azure Website](https://social.msdn.microsoft.com/Forums/azure/890b6d25-f7dd-4272-8970-da7798bcf25d/httpcompression-settings-on-a-simple-azure-website?forum=windowsazurewebsitespreview).


## Why is Autoscale not working as expected? It appears to be scaling only partially.
Autoscale is triggered when metrics swing outside the preconfigured boundaries. Sometimes you may notice that the capacity is only partially filled compared to what you expected.  This is because, when desired number of instances are not available, Autoscale partially fills in with the available number of instances. It then runs the rebalance logic to get more capacity and allocates the remaining instances. Please note that this may take a few minutes.

If you still do not see expected number of instances after giving a few minutes,  it could be because the partial refill was good enough to bring the metrics within the boundaries OR Autoscale scaled down because it hit the lower metrics boundary.

If none of these conditions apply and the problem persists, please go ahead and open a support ticket.

## How can I migrate from a on-premise environment to Azure App Services?

The **Azure App Service** Migration tool can be utilized to migrate sites from Windows and Linux web servers to Azure App Service. As part of the migration, the tool creates Web Apps and databases on Azure as needed, publishes content and creates the database. For more details refer to https://www.movemetothecloud.net/.
