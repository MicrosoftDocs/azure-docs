---
title: Configuration FAQs for Azure web apps | Microsoft Docs
description: Get answers to frequently asked questions about configuration and management issues for the Web Apps feature of Azure App Service.
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
# Configuration and management FAQs for App Service web apps

This article has answers to frequently asked questions (FAQs) about configuration and management issues for the [Web Apps feature of Azure App Service](https://azure.microsoft.com/services/app-service/web/).

[!INCLUDE [support-disclaimer](../../includes/support-disclaimer.md)]

## Are there limitations I should be aware of if I want to move App Services resources?

If you want to move App Services resources to a new resource group or subscription, there are a few limitations to be aware of. For details, see [App Service limitations](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-move-resources#app-service-limitations).

## How do I use a custom domain name for my web app?

You can get answers to several FAQs about using a custom domain name for your Azure web app in our 7-minute screencast [Add a custom domain name](https://channel9.msdn.com/blogs/Azure-App-Service-Self-Help/Add-a-Custom-Domain-Name). The screencast offers a walkthrough of how to add a custom domain name. It describes how to use your own URL instead of the AzureWebSites.net URL with your App Service web app. You also can see a detailed walkthrough of [mapping a custom domain name](https://docs.microsoft.com/azure/app-service-web/web-sites-custom-domain-name).


## How do I purchase a custom domain for my web app?

To learn how to purchase and set up a custom domain for your App Service web app, see [Buy and configure a custom domain name in App Service](https://docs.microsoft.com/azure/app-service-web/custom-dns-web-site-buydomains-web-app/) .


## How do I upload and configure an SSL certificate?

To learn how to upload and configure a custom SSL certificate, see [Bind an existing custom SSL certificate to an Azure web app](app-service-web-tutorial-custom-ssl.md#upload).


## How do I purchase and configure an SSL certificate in Azure for my App Service web app?

To learn how to purchase and set up an SSL certificate for your App Service web app, see [Add an SSL certificate to your App Service app](web-sites-purchase-ssl-web-site.md).


## How do I move Application Insights resources?

Currently, Azure Application Insights doesn't support the move operation. If your original resource group  includes an Application Insights resource, you cannot move that resource. If you include the Application Insights resource when you move an App Service app, the entire move operation fails. However, the Application Insights and App Service plan do not need to reside in the same resource group as the app for the app to function correctly.

To learn more about this scenario, see [App Service limitations](../azure-resource-manager/resource-group-move-resources.md#app-service-limitations).

## Where can I find a guidance checklist and learn more about Resource Move operations?

[App Service limitations](../azure-resource-manager/resource-group-move-resources.md#app-service-limitations) shows you how to move resources to either a new subscription or to a new resource group in the same subscription. You can get information about the resource move checklist, learn which services support the move operation, and learn more about App Service limitations and other useful topics.

## How do I set the server time zone for my web app?

1. In the Azure portal, in your App Service subscription, go to the **Application settings** menu.
2. Under **App settings**, add this setting:
    * Key = WEBSITE_TIME_ZONE
    * Value = *Desired Time Zone*
3. Select **Save**.

## Why do my continuous WebJobs sometimes fail?

By default, web apps are unloaded if they are idle for a set period of time. This lets the system conserve resources. In Basic or Standard mode, you can turn on the **Always On** setting to keep the web app loaded all the time. If your web app runs continuous WebJobs, you should turn on **Always On**, or the WebJobs may not run reliably. For more information, see [Create a continuously running WebJob](https://docs.microsoft.com/azure/app-service-web/web-sites-create-web-jobs/#CreateContinuous).

## How do I get the outbound IP address for my web app?

To get the list of outbound IP addresses for your web app:

1. In the Azure oortal, open the **Properties** menu of your web app.
2. Search for **outbound ip addresses**.

The list of outbound IP addresses is shown.

If your site is hosted on **Application Service Environment**, see [Outbound Network Addresses](app-service-app-service-environment-network-architecture-overview.md#outbound-network-addresses) for instructions to get Outbound IP Address.

## How do I get reserved or dedicated Inbound IP Address for my Azure App Service?

If you need to configure a dedicated\reserved IP address for inbound calls made to the azure web app site, you will need to install and configure an IP based SSL certificate.

Please note that in order to do this your App Service Plan should be in Basic or higher pricing tier.

## Can I export my App Service certificatefor use outside of Azure, such as for a website hosted elsewhere? 
App Service certificates are to be considered Azure resources and are not intended for use outside of your Azure services. You cannot export them for use outside of Azure. For more details please see [here](https://social.msdn.microsoft.com/Forums/azure/f3e6faeb-5ed4-435a-adaa-987d5db43b80/faq-on-app-service-certificates-and-custom-domains?forum=windowsazurewebsitespreview).

## Can I export my App Service certificate for use with other Azure services such as Cloud Services?

While the portal provides first class experience for deploying App Service Certificate through Key Vault to App Service Apps, we have been receiving customer requests where they would like to use these certificates outside of App Service platform, say with Azure Virtual Machines. In the blogpost at this [link](https://blogs.msdn.microsoft.com/appserviceteam/2017/02/24/creating-a-local-pfx-copy-of-app-service-certificate/), you can find how to create a local PFX copy of App Service Certificate so that you can use with other Azure resources.

See [FAQ on App Service Certificates and Custom Domains](https://social.msdn.microsoft.com/Forums/azure/f3e6faeb-5ed4-435a-adaa-987d5db43b80/faq-on-app-service-certificates-and-custom-domains?forum=windowsazurewebsitespreview) for more information.


## Why am I seeing 'Partially Succeeded' when I try to perform backup of my web app?

One of the frequent causes for this is that some of your files are in use by the application and hence these files are locked while you performed the backup. This prevents these files from being backed up which results in the 'Partially Succeeded' status. You can potentially prevent this from excluding files from the backup process and choosing to backup only what is needed as explained via [Backup just the important parts of your site with Azure web apps](http://www.zainrizvi.io/2015/06/05/creating-partial-backups-of-your-site-with-azure-web-apps/).

## How do I remove a header from the HTTP response?

To remove the headers, you need to update your site’s web.config file.

For more information, see [Remove standard server headers on your Azure websites](https://azure.microsoft.com/blog/removing-standard-server-headers-on-windows-azure-web-sites/).

## Is App Service compliant with PCI Standards 3.0 and 3.1?

Currently, the Web Apps feature of Azure App Service is in compliance with PCI Data Security Standard (DSS) version 3.0 Level 1. PCI DSS version 3.1 is on our roadmap. Planning is already underway for how adoption of the latest standard will proceed.

PCI DSS version 3.1 certification requires disabling Transport Layer Security (TLS) 1.0. Currently, disabling TLS 1.0 is not an option for most App Service plans. However, If you use App Service Environment for PowerApps or are willing to migrate your workload to App Service Environment, you can get greater control of your environment. This includes disabling TLS 1.0 by contacting Azure Support. In the near future, we plan to make these settings accessible to users.

For more information, see [Microsoft Azure App Service web app compliance with PCI Standards 3.0 and 3.1](https://support.microsoft.com/help/3124528).

## How do I use the staging environment and configure deployment slots?

In the Standard or Premium App Service plan mode, when you deploy your web app to App Service, you can deploy to a separate deployment slot instead of to the default production slot. Deployment slots are live web apps that have their own hostnames. Web app content and configurations elements can be swapped between two deployment slots, including the production slot.

For more information about using deployment slots, see [Set up a staging environment in App Service](web-sites-staged-publishing.md).

## How do I access and review WebJob logs?

To review WebJob logs:

1. Sign in to the [Kudu website](https://*yourwebsitename*.scm.azurewebsites.net).
2. Select the WebJob.
3. Select the **Toggle Output** button.
4. To download the output file, select the **Download** link.
5. For individual runs, select **Individual Invoke**.
6. Select the **Toggle Output** button.
7. Select the download link.

## I'm trying to use Hybrid Connections with SQL Server. Why do I see the error "System.OverflowException: Arithmetic operation resulted in an overflow?"

If you are trying to use Hybrid Connections to access SQL Server, a Microsoft .NET update on May 10, 2016, might cause connections to fail. The message looks like this:

```
Exception: System.Data.Entity.Core.EntityException: The underlying provider failed on Open. —> System.OverflowException: Arithmetic operation resulted in an overflow. or (64 bit Web app) System.OverflowException: Array dimensions exceeded supported range, at System.Data.SqlClient.TdsParser.ConsumePreLoginHandshake
```
### Resolution

We are working to update Hybrid Connection Manager to fix this issue. In the meantime, for workarounds, see [Hybrid Connections error with SQL Server: System.OverflowException: Arithmetic operation resulted in an overflow](https://blogs.msdn.microsoft.com/waws/2016/05/17/hybrid-connection-error-with-sql-server-system-overflowexception-arithmetic-operation-resulted-in-an-overflow/).

## How do I add or edit a URL rewrite rule?

To add or edit a URL rewrite rule:

1. Set up Internet Information Services (IIS) Manager so that it connects to your App Service web app. To learn how to connect IIS Manager to App Service, see [Remote administration of Azure websites by using IIS Manager](https://azure.microsoft.com/blog/remote-administration-of-windows-azure-websites-using-iis-manager/).
2. In IIS Manager, add or edit a URL rewrite rule. For more information, see [Create rewrite rules for the URL rewrite module](https://www.iis.net/learn/extensions/url-rewrite-module/creating-rewrite-rules-for-the-url-rewrite-module).

## How do I control inbound traffic to App Service?

At the site level, you have two options:

* Turn on Dynamic IP restrictions. To learn how to turn on Dynamic IP restrictions, see [IP and domain restrictions for Azure websites](https://azure.microsoft.com/blog/ip-and-domain-restrictions-for-windows-azure-web-sites/) for more details.
* Turn on Module Security. To learn how to turn on Module Security, see [ModSecurity web application firewall on Azure websites](https://azure.microsoft.com/blog/modsecurity-for-azure-websites/).

If you are using App Service Environment, you can use [Barracuda firewall](https://azure.microsoft.com/blog/configuring-barracuda-web-application-firewall-for-azure-app-service-environment/).

## How do I block ports in an App Service web app?

In the App Services shared tenant environment, it is not possible to block specific ports due to the nature of the infrastructure. TCP ports 4016, 4018, and 4020 also might be open for Visual Studio remote debugging.

In App Service Environment, you have full control over inbound  and outbound traffic. In App Service Environment, you can use Network Security Groups to restrict or block specific ports. For more information about App Service Environment, see [Introducing App Service Environment](https://azure.microsoft.com/blog/introducing-app-service-environment/).

## How do I capture F12 traces?

You have two options for capturing an F12 trace:

* F12 HTTP trace
* F12 console trace

### F12 HTTP trace

1. In Internet Explorer, go to your website. It is important to sign in before you do the next steps. Otherwise the F12 trace will capture sensitive sign-in data.
2. Press F12.
3. Verify that the **Network** tab is selected, and then click the green **Play** button.
4. Do the steps that reproduce the issue.
5. Select the red **Stop** button.
6. Select the **Save** button (disk icon), and save the HAR file (in Internet Explorer and Edge) *or* right-click the HAR file, and then select **Save as HAR with content** (in Chrome).

### F12 console output

1. Select the **Console** tab.
2. For each tab that contains more than zero items, select the tab (**Errors, Warnings, and Information**) If the tab isn’t selected, the tab icon will become gray or black when you move the cursor away from it.
3. Right-click in the message area of the pane, and then select **Copy all**.
4. Paste the copied text in a file, and then save the file.

To view an HAR file, you can use an [HAR viewer](http://www.softwareishard.com/har/viewer/).

## Why do I get an error when I try to connect an App Service web app to a virtual network that is connected to ExpressRoute?

If you try to connect an Azure web app to a virtual network that's connected to Azure ExpressRoute, it fails. The following message appears: "Gateway is not a VPN gateway".

Currently, this scenario is not available. You cannot have point-to-site VPN connections to the same virtual network that is connected to ExpressRoute. A point-to-site VPN and ExpressRoute cannot coexist for the same virtual network. For more information, see [ExpressRoute and site-to-site VPN connections limits and limitations](../expressroute/expressroute-howto-coexist-classic.md#limits-and-limitations).

## How do I connect an App Service web app to a virtual network that has a static routing (policy-based) gateway?

Currently, connecting an App Service web app to a virtual network that has a static routing (policy-based) gateway is not available. If your target virtual network already exists, it must have point-to-site VPN enabled, with a dynamic routing gateway, before it can be connected to an app. You cannot enable a point-to-site VPN if your gateway is set to static routing. 
For more information, see [Integrate an app with an Azure virtual network](web-sites-integrate-with-vnet.md#getting-started).

## In App Service Environments, why can I create only one App Service plan, even though I have two workers available?

To provide fault tolerance, Azure App Service Environment requires that for each worker pool you have at least one additional compute resource allocated.

Each worker pool needs at least one additional compute resource, which cannot be assigned workload.
For more information, see [How to create an App Service Environment](https://docs.microsoft.com/azure/app-service-web/app-service-web-how-to-create-an-app-service-environment/#compute-resource-pools).

## Why do I see timeouts when I try to create an App Service Environment?

Sometimes, creating an App Service Environment fails. You'll see the following error in the Activity logs:
```
ResourceID: /subscriptions/{SubscriptionID}/resourceGroups/Default-Networking/providers/Microsoft.Web/hostingEnvironments/{ASEname}
Error:{"error":{"code":"ResourceDeploymentFailure","message":"The resource provision operation did not complete within the allowed timeout period.”}}
```
Make sure that none of the following is true:
* The subnet is too small.
* The subnet is not empty.
* ExpressRoute does not allow the network connectivity requirements of an App Service Environment.
* A bad Network Security Group (NSG) does not allow the network connectivity requirements of an App Service Environment.
* Forced tunneling is turned on.

For more information, see [Most frequent issues when deploying (creating) a new Azure App Service Environment](https://blogs.msdn.microsoft.com/waws/2016/05/13/most-frequent-issues-when-deploying-creating-a-new-azure-app-service-environment-ase/).

## Why can't I delete my App Service plan?

You can't delete an App Service plan if any App Service apps are associated with the App Service plan.

Before you delete an App Service plan, remove all associated App Service apps from the App Service plan.

## How do I schedule a WebJob?

You can create a scheduled WebJob by using Cron expressions:

1. Create a settings.job file.
2. In this JSON file, include a schedule property by using a Cron expression: 
```
{ "schedule": "{second}
{minute} {hour} {day}
{month} {day of the week}" }
```
For more information about scheduled WebJobs, see [Create a scheduled WebJob using a Cron expression](https://docs.microsoft.com/azure/app-service-web/web-sites-create-web-jobs/#CreateScheduledCRON).

## How do I perform penetration testing for my App Service app?

To perform penetration testing, [submit a request](https://security-forms.azure.com/penetration-testing/terms).

## How do I configure a custom domain name for an App Service web app that uses Traffic Manager?

To learn how to use a custom domain name with an App Service app that use Azure Traffic Manager for load balancing, see [Configuring a custom domain name for a web app in Azure App Service using Traffic Manager](https://docs.microsoft.com/azure/app-service-web/web-sites-traffic-manager-custom-domain-name/).


## My App Service Certificate is flagged for fraud. How do I take care of this?

During the domain verification of an App Service Certificate purchase, you might see the following error:

“Your certificate has been flagged for possible fraud. The request is currently under review. If the certificate does not become usable within 24 hours, please contact Azure Support.”

As the message indicates, this fraud verification process may take up to 24 hours to complete. During this time, the user will continue to see the message.

If your App Service Certificate continues to show this message after 24 hours, please run the following PowerShell script. The script contacts the [certificate provider](https://www.godaddy.com/) directly to resolve the issue.

```
Login-AzureRmAccount
Set-AzureRmContext -SubscriptionId <subId>
$actionProperties = @{
    "Name"= "<Customer Email Address>"
    };
Invoke-AzureRmResourceAction -ResourceGroupName "<App Service Certificate Resource Group Name>" -ResourceType Microsoft.CertificateRegistration/certificateOrders -ResourceName "<App Service Certificate Resource Name>" -Action resendRequestEmails -Parameters $actionProperties -ApiVersion 2015-08-01 -Force   
```

## How do authentication and authorization work in App Service?

For detailed documentation on authentication and authorization, see [App Service security](../app-service/app-service-security-readme.md). The documentation also has information about setting up App Service to use various identify provider sign-ins:
* [Azure Active Directory](https://docs.microsoft.com/azure/app-service-mobile/app-service-mobile-how-to-configure-active-directory-authentication)
* [Facebook](https://docs.microsoft.com/azure/app-service-mobile/app-service-mobile-how-to-configure-facebook-authentication)
* [Google](https://docs.microsoft.com/azure/app-service-mobile/app-service-mobile-how-to-configure-google-authentication)
* [Microsoft Account](https://docs.microsoft.com/azure/app-service-mobile/app-service-mobile-how-to-configure-microsoft-authentication)
* [Twitter](https://docs.microsoft.com/azure/app-service-mobile/app-service-mobile-how-to-configure-twitter-authentication)

## How do I redirect the default *.azurewebsites.net domain to my Azure web app's custom domain?

When you create a new website by using Web Apps, a default *sitename*.azurewebsites.net domain is assigned to your site. If you add a custom host name to your site and don’t want users to be able to access your default *.azurewebsites.net domain, the post at the following link explains how to redirect all traffic aimed at your site’s default domain to your custom domain instead.

http://www.zainrizvi.io/2016/04/07/block-default-azure-websites-domain/

## How do I determine which version of Microsoft .NET version is installed in App Service?

The quickest way to find the version of .NET that installed in App Service is by using the Kudu console. You can access the Kudu console from the portal or by using the URL of your App Service app. For detailed instructions, see [Determine the installed .NET version in App Services](https://blogs.msdn.microsoft.com/waws/2016/11/02/how-to-determine-the-installed-net-version-in-azure-app-services/).

## Why isn't Autoscale working as expected?

If you have noticed that Azure Autoscale hasn't scaled in or scaled out the web app instances as you expected, you might be running into a scenario where we intentionally choose not to scale to avoid an infinite loop due to flapping. This usually happens when there isn't an adequate margin between the scale-out and scale-in thresholds. To learn how to avoid flapping and other Autoscale best practices, see [Autoscale best practices](../monitoring-and-diagnostics/insights-autoscale-best-practices.md#autoscale-best-practices).

## How do I turn on HTTP compression for my content?

To turn on compression for both static and dynamic content types, add the following code to application-level web.config:

```
<system.webServer>
<urlCompression doStaticCompression="true" doDynamicCompression="true" />
< /system.webServer>
```

You also can specify the specific dynamic and static MIME types that you want to compress. For details, see our response to a forum question in [httpCompression settings on a simple Azure website](https://social.msdn.microsoft.com/Forums/azure/890b6d25-f7dd-4272-8970-da7798bcf25d/httpcompression-settings-on-a-simple-azure-website?forum=windowsazurewebsitespreview).


## Why is Autoscale scaling only partially?

Azure Autoscale is triggered when metrics swing outside preconfigured boundaries. Sometimes, you might notice that the capacity is only partially filled compared to what you expected. This might occur when the number of instances you want are not available. In that scenario, Autoscale partially fills in with the available number of instances. Autuscale then runs the rebalance logic to get more capacity. It allocates the remaining instances. Note that this might take a few minutes.

If you don't see the expected number of instances after a few minutes,  it could be because the partial refill was enough to bring the metrics within the boundaries **or** Autoscale scaled down because it hit the lower metrics boundary.

If none of these conditions apply and the problem persists, open a support ticket.

## How do I migrate from an on-premises environment to App Services?

To migrate sites from Windows and Linux web servers to App Service, you can use **Azure App Service Migration Assistant**. The migration tool creates web apps and databases in Azure as needed, and then publishes content. For details, see [Azure App Service Migration Assistant](https://www.movemetothecloud.net/).
