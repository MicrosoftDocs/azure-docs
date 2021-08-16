---
title: Use an App Service Environment
description: Learn how to use your App Service Environment to host isolated applications.
author: ccompy
ms.assetid: 377fce0b-7dea-474a-b64b-7fbe78380554
ms.topic: article
ms.date: 07/06/2021
ms.author: ccompy
ms.custom: seodec18
---
# Using an App Service Environment

> [!NOTE]
> This article is about the App Service Environment v3 which is used with Isolated v2 App Service plans
> 

The App Service Environment (ASE) is a single tenant deployment of the Azure App Service that injects directly into an Azure Virtual Network (VNet) of your choosing. It's a system that is only used by one customer. Apps deployed into the ASE are subject to the networking features that are applied to the ASE subnet. There aren't any additional features that need to be enabled on your apps to be subject to those networking features. 

## Create an app in an ASE

To create an app in an ASE, you use the same process as when you normally create an app, but with a few small differences. When you create a new App Service plan:

- Instead of choosing a geographic location in which to deploy your app, you choose an ASE as your location.
- All App Service plans created in an ASE can only be in an Isolated v2 pricing tier.

If you don't have an ASE, you can create one by following the instructions in [Create an App Service Environment][MakeASE].
To create an app in an ASE:

1. Select **Create a resource** > **Web + Mobile** > **Web App**.
1. Select a subscription.
1. Enter a name for a new resource group, or select **Use existing** and select one from the drop-down list.
1. Enter a name for the app. If you already selected an App Service plan in an ASE, the domain name for the app reflects the domain name of the ASE:
![create an app in an ASE][1]
1. Select your Publish type, Stack, and Operating System.
1. Select region. Here you need to select a pre-existing App Service Environment v3.  You can't make an ASEv3 during app creation 
1. Select an existing App Service plan in your ASE, or create a new one. If creating a new app, select the size that you want for your App Service plan. The only SKU you can select for your app is an Isolated v2 pricing SKU. Making a new App Service plan will normally take less than 20 minutes. 
![Isolated v2 pricing tiers][2]
1. Select **Next: Monitoring**  If you want to enable App Insights with your app, you can do it here during the creation flow. 
1.  Select **Next: Tags** Add any tags you want to the app  
1. Select **Review + create**, make sure the information is correct, and then select **Create**.

Windows and Linux apps can be in the same ASE but cannot be in the same App Service plan.

## How scale works

Every App Service app runs in an App Service plan. App Service Environments hold App Service plans, and App Service plans hold apps. When you scale an app, you also scale the App Service plan and all the apps in that same plan.

When you scale an App Service plan, the needed infrastructure is added automatically. There's a time delay to scale operations while the infrastructure is being added. When you scale an App Service plan, any other scale operations requested of the same OS and size will wait until the first one completes. After the blocking scale operation completes, all of the queued requests are processed at the same time. A scale operation on one size and OS won't block scaling of the other combinations of size and OS. For example, if you scaled a Windows I2v2 App Service plan then, any other requests to scale Windows I2v2 in that ASE will be queued until that completes. Scaling will normally take less than 20 minutes. 

In the multitenant App Service, scaling is immediate because a pool of resources is readily available to support it. In an ASE, there's no such buffer, and resources are allocated based on need.

## App access

In an ASE with an internal VIP, the domain suffix used for app creation is *.&lt;asename&gt;.appserviceenvironment.net*. If your ASE is named _my-ase_ and you host an app called _contoso_ in that ASE, you reach it at these URLs:

- contoso.my-ase.appserviceenvironment.net
- contoso.scm.my-ase.appserviceenvironment.net

The apps that are hosted on an ASE that uses an internal VIP will only be accessible if you are in the same virtual network as the ASE or are connected somehow to that virtual network. Publishing is also restricted to being only possible if you are in the same virtual network or are connected somehow to that virtual network. 

In an ASE with an external VIP, the domain suffix used for app creation is *.&lt;asename&gt;.p.azurewebsites.net*. If your ASE is named _my-ase_ and you host an app called _contoso_ in that ASE, you reach it at these URLs:

- contoso.my-ase.p.azurewebsites.net
- contoso.scm.my-ase.p.azurewebsites.net

For information about how to create an ASE, see [Create an App Service Environment][MakeASE].

The SCM URL is used to access the Kudu console or for publishing your app by using Web Deploy. For information on the Kudu console, see [Kudu console for Azure App Service][Kudu]. The Kudu console gives you a web UI for debugging, uploading files, editing files, and much more.

### DNS configuration 

If your ASE is made with an external VIP, your apps are automatically put into public DNS. If your ASE is made with an internal VIP, you may need to configure DNS for it. If you selected having Azure DNS private zones configured automatically during ASE creation then DNS is configured in your ASE VNet. If you selected Manually configuring DNS, you need to either use your own DNS server or configure Azure DNS private zones. To find the inbound address of your ASE, go to the **ASE portal > IP Addresses** UI. 

![IP addresses UI][6]

If you want to use your own DNS server, you need to add the following records:

1. create a zone for &lt;ASE name&gt;.appserviceenvironment.net
1. create an A record in that zone that points * to the inbound IP address used by your ASE
1. create an A record in that zone that points @ to the inbound IP address used by your ASE
1. create a zone in &lt;ASE name&gt;.appserviceenvironment.net named scm
1. create an A record in the scm zone that points * to the inbound address used by your ASE

To configure DNS in Azure DNS Private zones:

1. create an Azure DNS private zone named &lt;ASE name&gt;.appserviceenvironment.net
1. create an A record in that zone that points * to the inbound IP address
1. create an A record in that zone that points @ to the inbound IP address
1. create an A record in that zone that points *.scm to the inbound IP address

The DNS settings for your ASE default domain suffix don't restrict your apps to only being accessible by those names. You can set a custom domain name without any validation on your apps in an ASE. If you then want to create a zone named *contoso.net*, you could do so and point it to the inbound IP address. The custom domain name works for app requests but doesn't for the scm site. The scm site is only available at *&lt;appname&gt;.scm.&lt;asename&gt;.appserviceenvironment.net*. 

## Publishing

In an ASE, as with the multitenant App Service, you can publish by these methods:

- Web deployment
- Continuous integration (CI)
- Drag and drop in the Kudu console
- An IDE, such as Visual Studio, Eclipse, or IntelliJ IDEA

With an internal VIP ASE, the publishing endpoints are only available through the inbound address. If you don't have network access to the inbound address, you can't publish any apps on that ASE.  Your IDEs must also have network access to the inbound address on the ASE to publish directly to it.

Without additional changes, internet-based CI systems like GitHub and Azure DevOps don't work with an internal VIP ASE because the publishing endpoint isn't internet accessible. You can enable publishing to an internal VIP ASE from Azure DevOps by installing a self-hosted release agent in the virtual network that contains the ASE. 

## Storage

An ASE has 1 TB of storage for all the apps in the ASE. An App Service plan in the Isolated pricing SKU has a limit of 250 GB. In an ASE, 250 GB of storage is added per App Service plan up to the 1 TB limit. You can have more App Service plans than just four, but there is no more storage added beyond the 1 TB limit.

## Logging

You can integrate your ASE with Azure Monitor to send logs about the ASE to Azure Storage, Azure Event Hubs, or Log Analytics. These items are logged today:

|Situation |Message |
|----------|--------|
|ASE subnet is almost out of space | The specified ASE is in a subnet that is almost out of space. There are {0} remaining addresses. Once these addresses are exhausted, the ASE will not be able to scale.  |
|ASE is approaching total instance limit | The specified ASE is approaching the total instance limit of the ASE. It currently contains {0} App Service Plan instances of a maximum 200 instances. |
|ASE is suspended | The specified ASE is suspended. The ASE suspension may be due to an account shortfall or an invalid virtual network configuration. Resolve the root cause and resume the ASE to continue serving traffic. |
|ASE upgrade has started | A platform upgrade to the specified ASE has begun. Expect delays in scaling operations. |
|ASE upgrade has completed | A platform upgrade to the specified ASE has finished. |
|App Service plan creation has started | An App Service plan ({0}) creation has started. Desired state: {1} I{2}v2 workers.
|Scale operations have completed | An App Service plan ({0}) creation has finished. Current state: {1} I{2}v2 workers. |
|Scale operations have failed | An App Service plan ({0}) creation has failed. This may be due to the ASE operating at peak number of instances, or run out of subnet addresses. |
|Scale operations have started | An App Service plan ({0}) has begun scaling. Current state: {1} I(2)v2. Desired state: {3} I{4}v2 workers.|
|Scale operations have completed | An App Service plan ({0}) has finished scaling. Current state: {1} I{2}v2 workers. |
|Scale operations were interrupted | An App Service plan ({0}) was interrupted while scaling. Previous desired state: {1} I{2}v2 workers. New desired state: {3} I{4}v2 workers. |
|Scale operations have failed | An App Service plan ({0}) has failed to scale. Current state: {1} I{2}v2 workers. |

To enable logging on your ASE:

1. In the portal, go to **Diagnostics settings**.
1. Select **Add diagnostic setting**.
1. Provide a name for the log integration.
1. Select and configure the log destinations that you want.
1. Select **AppServiceEnvironmentPlatformLogs**.
![ASE diagnostic log settings][4]

If you integrate with Log Analytics, you can see the logs by selecting **Logs** from the ASE portal and creating a query against **AppServiceEnvironmentPlatformLogs**. Logs are only emitted when your ASE has an event that will trigger it. If your ASE doesn't have such an event, there won't be any logs. To quickly see an example of logs in your Log Analytics workspace, perform a scale operation with an App Service plan in your ASE. You can then run a query against **AppServiceEnvironmentPlatformLogs** to see those logs. 

### Creating an alert

To create an alert against your logs, follow the instructions in [Create, view, and manage log alerts using Azure Monitor](../../azure-monitor/alerts/alerts-log.md). In brief:

* Open the Alerts page in your ASE portal
* Select **New alert rule**
* Select your Resource to be your Log Analytics workspace
* Set your condition with a custom log search to use a query like, "AppServiceEnvironmentPlatformLogs | where ResultDescription contains "has begun scaling" or whatever you want. Set the threshold as appropriate. 
* Add or create an action group as desired. The action group is where you define the response to the alert such as sending an email or an SMS message
* Name your alert and save it.

## Internal Encryption

The App Service Environment operates as a black box system where you cannot see the internal components or the communication within the system. To enable higher throughput, encryption is not enabled by default between internal components. The system is secure as the traffic is inaccessible to being monitored or accessed. If you have a compliance requirement though that requires complete encryption of the data path from end to end encryption, you can enable this in the ASE **Configuration** UI.

![Enable internal encryption][5]

This will encrypt internal network traffic in your ASE between the front ends and workers, encrypt the pagefile and also encrypt the worker disks. After the InternalEncryption clusterSetting is enabled, there can be an impact to your system performance. When you make the change to enable InternalEncryption, your ASE will be in an unstable state until the change is fully propagated. Complete propagation of the change can take a few hours to complete, depending on how many instances you have in your ASE. We highly recommend that you do not enable this on an ASE while it is in use. If you need to enable this on an actively used ASE, we highly recommend that you divert traffic to a backup environment until the operation completes.

## Upgrade preference

If you have multiple ASEs, you might want some ASEs to be upgraded before others. Within the ASE **HostingEnvironment Resource Manager** object, you can set a value for **upgradePreference**. The **upgradePreference** setting can be configured by using a template, ARMClient, or https://resources.azure.com. The three possible values are:

- **None**: Azure will upgrade your ASE in no particular batch. This value is the default.
- **Early**: Your ASE will be upgraded in the first half of the App Service upgrades.
- **Late**: Your ASE will be upgraded in the second half of the App Service upgrades.

To configure your upgrade preference, go to the ASE **Configuration** UI. 
The **upgradePreferences** feature makes the most sense when you have multiple ASEs because your "Early" ASEs will be upgraded before your "Late" ASEs. When you have multiple ASEs, you should set your development and test ASEs to be "Early" and your production ASEs to be "Late".

## Delete an ASE

To delete an ASE:

1. Select **Delete** at the top of the **App Service Environment** pane.
1. Enter the name of your ASE to confirm that you want to delete it. When you delete an ASE, you also delete all the content within it.
![ASE deletion][3]
1. Select **OK**.

<!--Image references-->

[1]: ./media/using/using-appcreate.png
[2]: ./media/using/using-appcreate-skus.png
[3]: ./media/using/using-delete.png
[4]: ./media/using/using-logsetup.png
[4]: ./media/using/using-logs.png
[5]: ./media/using/using-configuration.png
[6]: ./media/using/using-ip-addresses.png

<!--Links-->

[Intro]: ./overview.md
[MakeASE]: ./creation.md
[ASENetwork]: ./networking.md
[UsingASE]: ./using.md
[UDRs]: ../../virtual-network/virtual-networks-udr-overview.md
[NSGs]: ../../virtual-network/network-security-groups-overview.md
[Pricing]: https://azure.microsoft.com/pricing/details/app-service/
[ARMOverview]: ../../azure-resource-manager/management/overview.md
[ConfigureSSL]: ../configure-ssl-certificate.md
[Kudu]: https://azure.microsoft.com/resources/videos/super-secret-kudu-debug-console-for-azure-web-sites/
[AppDeploy]: ../deploy-local-git.md
[ASEWAF]: app-service-app-service-environment-web-application-firewall.md
[AppGW]: ../../web-application-firewall/ag/ag-overview.md
[logalerts]: ../../azure-monitor/alerts/alerts-log.md
