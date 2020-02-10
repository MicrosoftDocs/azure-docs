---
title: Use and manage ASE
description: How to create, publish, and scale apps in an Azure App Service environment. Find the common tasks in one document.
author: ccompy

ms.assetid: a22450c4-9b8b-41d4-9568-c4646f4cf66b
ms.topic: article
ms.date: 01/01/2020
ms.author: ccompy
ms.custom: seodec18
---
# Use an App Service environment #

Azure App Service Environment is a deployment of Azure App Service into a subnet in a customer’s Azure virtual network. It consists of:

- **Front ends**: The front ends are where HTTP/HTTPS terminates in an App Service environment (ASE).
- **Workers**: The workers are the resources that host your apps.
- **Database**: The database holds information that defines the environment.
- **Storage**: The storage is used to host the customer-published apps.

You can deploy an ASE with an external or internal VIP for app access. The deployment with an external VIP is commonly called an External ASE. The internal version is called the ILB ASE because it uses an internal load balancer (ILB). To learn more about the ILB ASE, see [Create and use an ILB ASE][MakeILBASE].

## Create an app in an ASE ##

To create an app in an ASE, you use the same process as when you create it normally, but with a few small differences. When you create a new App Service plan (ASP):

- Instead of choosing a geographic location in which to deploy your app, you choose an ASE as your location.
- All App Service plans created in an ASE can only be in an Isolated pricing tier.

If you don't have an ASE, you can create one by following the instructions in [Create an App Service environment][MakeExternalASE].

To create an app in an ASE:

1. Select **Create a resource** > **Web + Mobile** > **Web App**.

2. Enter a name for the app. If you already selected an App Service plan in an ASE, the domain name for the app reflects the domain name of the ASE.

	![App name selection][1]

1. Select a subscription.

1. Enter a name for a new resource group, or select **Use existing** and select one from the drop-down list.

1. Select your OS. 

1. Select an existing App Service plan in your ASE, or create a new one by following these steps:

	a. From the Azure portal left side menu, select **Create a resource > Web App**.

	b. Select the subscription.
	,
	c. Select or create the resource group.
	
	d. Provide the name of your web app.
	
	e. Select Code or DockerContainer.
	
	f. Select Runtime stack.
	
	g. Select Linux or Windows. 
	
	h. Select your ASE in the **Region** drop-down list. 
	
	i. Select or create a new App Service plan. If creating a new App Service plan, select the appropriate **Isolated** SKU size.
	
	![Isolated pricing tiers][2]

	> [!NOTE]
	> Linux apps and Windows apps cannot be in the same App Service Plan, but can be in the same App Service Environment. 
	>

2. Select **Review + create** then select **Create** if the information is correct.

## How scale works ##

Every App Service app runs in an App Service plan. App Service Environments hold App Service plans, and App Service plans hold apps. When you scale an app, you scale the App Service plan and thus scale all the apps in the same plan.

When you scale an App Service plan, the needed infrastructure is automatically added. There is a time delay to scale operations while the infrastructure is added. If you perform several scale operations in sequence, the first infrastructure scale request is acted on and the others queue up. When the first scale operation completes, the other infrastructure requests all operate together. When the infrastructure is added, the App Service plans are assigned as appropriate. Creating a new App Service plan is itself a scale operation as it requests additional hardware. 

In the multitenant App Service, scaling is immediate because a pool of resources is readily available to support it. In an ASE, there is no such buffer, and resources are allocated upon need.

In an ASE, you can scale an App Service plan up to 100 instances. An ASE can have up to 201 total instances across all of the App Service plans that are in the ASE. 

## IP addresses ##

App Service has the ability to allocate a dedicated IP address to an app. The capability to allocate a dedicated IP to an app is available after you configure an IP-based SSL, as described in [Bind an existing custom SSL certificate to Azure App Service][ConfigureSSL]. In an ILB ASE, you can't add additional IP addresses to be used for an IP-based SSL.

With an external ASE, you can configure IP-based SSL for your app in the same manner that you do in the multitenant App Service. There is always one spare address in the ASE up to 30 IP addresses. Each time you use one, another is added so that an address is always readily available for use. A time delay is required to allocate another IP address, which prevents adding IP addresses in quick succession.

## Front end scaling ##

When you scale out your App Service plans, workers are automatically added to support them. Every ASE is created with two front ends. The front ends automatically scale out at a rate of one front end for every total 15 instances in your App Service plans. For example, if you have three App Service plans of five instances each, you would have a total of 15 instances and three front ends. If you scale to a total of 30 instances, then you have four front ends, and so on. 

The number of front ends that are allocated by default are good for a moderate load. You can change the ratio to as low as one front end for every five instances. You can also change the size of the front ends. By default they are single core. You can change the size of the front ends in the portal to two or four core sizes instead. There is a charge for changing the ratio or the front end sizes. For more information, see [Azure App Service pricing][Pricing]. If you are looking to improve the load capacity of your ASE, you will get more improvement by first scaling to two core front ends before adjusting the scale ratio. Changing the core size of your front ends will cause an upgrade of your ASE and should be performed outside of regular business hours.

Front end resources are the HTTP/HTTPS endpoint for the ASE. With the default front end configuration, memory usage per front end is consistently around 60 percent. Customer workloads don't run on a front end. The key factor for a front end with respect to scale is the CPU, which is driven primarily by HTTPS traffic.

## App access ##

In an External ASE, the domain suffix used for app creation is *.&lt;asename&gt;.p.azurewebsites.net*. For example, if your ASE is named _external-ase_ and you host an app called _contoso_ in that ASE, you reach it at the following URLs:

- contoso.external-ase.p.azurewebsites.net
- contoso.scm.external-ase.p.azurewebsites.net

For more information on how to create an External ASE, see [Create an App Service environment][MakeExternalASE]

In an ILB ASE, the domain suffix used for app creation is *.&lt;asename&gt;.appserviceenvironment.net*. For example, if your ASE is named _ilb-ase_ and you host an app called _contoso_ in that ASE, you reach it at the following URLs:

- contoso.ilb-ase.appserviceenvironment.net
- contoso.scm.ilb-ase.appserviceenvironment.net

For more information on how to create an ILB ASE, see [Create and use an ILB ASE][MakeILBASE]. 

The scm URL is used to access the Kudu console or for publishing your app by using web deploy. For information on the Kudu console, see [Kudu console for Azure App Service][Kudu]. The Kudu console gives you a web UI for debugging, uploading files, editing files, and much more.

## Publishing ##

As with the multitenant App Service, in an ASE you can publish with:

- Web deployment.
- FTP.
- Continuous integration.
- Drag and drop in the Kudu console.
- An IDE, such as Visual Studio, Eclipse, or IntelliJ IDEA.

With an External ASE, these publishing options all behave the same. For more information, see [Deployment in Azure App Service][AppDeploy]. 

The major difference with publishing is with respect to an ILB ASE. With an ILB ASE, the publishing endpoints are all available only through the ILB. The ILB is on a private IP in the ASE subnet in the virtual network. If you don’t have network access to the ILB, you can't publish any apps on that ASE. As noted in [Create and use an ILB ASE][MakeILBASE], you need to configure DNS for the apps in the system. That includes the SCM endpoint. If they're not defined properly, you can't publish. Your IDEs also need to have network access to the ILB in order to publish directly to it.

Out of the box, Internet-based CI systems, such as GitHub and Azure DevOps, don't work with an ILB ASE because the publishing endpoint is not Internet accessible. For Azure DevOps, you can work around the problem by installing a self-hosted release agent in your internal network where it can reach the ILB. Alternatively, you can also use a CI system that uses a pull model, such as Dropbox.

The publishing endpoints for apps in an ILB ASE use the domain that the ILB ASE was created with. You can see it in the app's publishing profile and in the app's portal blade (in **Overview** > **Essentials** and also in **Properties**). 

## Storage

An ASE has 1 TB of storage for all of the apps within the ASE. An Isolated SKU App Service plan has a limit of 250 GB by default. If you have 5 or more App Service plans, you need to be careful that you do not exceed the 1 TB limit of the ASE. If you require more than the 250 GB limit in one App Service plan, contact support to adjust the App Service plan limit to a maximum of 1 TB. When the plan limit is adjusted, there is still a limit of 1 TB across all of the App Service plans in the ASE. 

## Logging ##

You can integrate your ASE with Azure Monitor to send logs about the ASE to Storage, Event Hub, or Log Analytics. The items that are logged today are:

| Situation | Message |
|---------|----------|
| ASE is unhealthy | The specified ASE is unhealthy due to an invalid virtual network configuration. The ASE will be suspended if the unhealthy state continues. Ensure the guidelines defined here are followed: https://docs.microsoft.com/azure/app-service/environment/network-info |
| ASE subnet is almost out of space | The specified ASE is in a subnet that is almost out of space. There are {0} remaining addresses. Once these addresses are exhausted, the ASE will not be able to scale  |
| ASE is approaching total instance limit | The specified ASE is approaching the total instance limit of the ASE. It currently contains {0} App Service Plan instances of a maximum 201 instances. |
| ASE is unable to reach a dependency | The specified ASE is not able to reach {0}.  Ensure the guidelines defined here are followed: https://docs.microsoft.com/azure/app-service/environment/network-info |
| ASE is suspended | The specified ASE is suspended. The ASE suspension may be due to an account shortfall or an invalid virtual network configuration. Resolve the root cause and resume the ASE to continue serving traffic |
| ASE upgrade has started | A platform upgrade to the specified ASE has begun. Expect delays in scaling operations |
| ASE upgrade has completed | A platform upgrade to the specified ASE has finished |
| Scale operations have started | An App Service plan ({0}) has begun scaling. Desired state: {1} I{2} workers 
| Scale operations have completed | An App Service plan ({0}) has finished scaling. Current state: {1} I{2} workers |
| Scale operations have failed | An App Service plan ({0}) has failed to scale. Current state: {1} I{2} workers |

To enable logging on your ASE: 

1. Go to Diagnostic settings in the portal.  
1. Select Add diagnostic setting.
1. Provide a name for the log integration
1. Check and configure the desired log destinations. 
1. Check AppServiceEnvironmentPlatformLogs

![ASE diagnostic log settings][4]

If you integrate with Log Analytics, you can see the logs by selecting Logs from the ASE portal and creating a query against the AppServiceEnvironmentPlatformLogs. 

## Upgrade preference ##

If you have multiple ASEs, you may want to have some ASEs get upgraded before others. Within the ASE HostingEnvironment Resource Manager object, you can set a value for UpgradePreference. The upgradePreference setting can be configured through template, ARMClient, or https://resources.azure.com.  The three value choices are:

* None - None is the default and means that Azure will upgrade your ASE in no particular batch
* Early - Early means that your ASE will be upgraded in the first half of the App Service upgrades
* Late - Late means that your ASE will be upgraded in the second half of the App Service upgrades

If you are using https://resources.azure.com, you can set the upgradePreferences value by:

1. Going to resources.azure.com and signing in with your Azure account
1. Navigate through subscriptions\/\[subscription name\]\/resourceGroups\/\[resource group name\]\/providers\/Microsoft.Web\/hostingEnvironments\/\[ASE name\]
1. Selecting Read/Write at the top
1. Select Edit
1. Change the value for upgradePreference to whatever is desired from the three choices.
1. Select Patch

![resources azure com display][5]

The upgradePreferences feature really makes the most sense when you have multiple ASEs as your "Early" upgraded ASEs will be upgraded before your "Late" ASEs. When you have multiple ASEs, you should have your dev/test ASEs set to be "Early" and your production ASEs to be set as "Late".

## Pricing ##

The pricing SKU called **Isolated** is only for use with ASE. All App Service plans that are hosted in the ASE are in the Isolated pricing SKU. Isolated App Service plan rates can vary per region. 

In addition to the price for your App Service plans, there is a flat rate for ASE itself. The flat rate doesn't change with the size of your ASE and pays for the ASE infrastructure at a default scaling rate of 1 additional front end for every 15 App Service plan instances.  

If the default scale rate of one front end for every 15 App Service plan instances is not fast enough, you can adjust the ratio at which front ends are added or the size of the front ends.  When you adjust the ratio or size, you pay for the front end cores that would not be added by default.  

For example, if you adjust the scale ratio to 10, a front end is added for every 10 instances in your App Service plans. The flat fee covers a scale rate of one front end for every 15 instances. With a scale ratio of 10, you pay a fee for the third front end that's added for the 10 App Service plan instances. You don't need to pay for it when you reach 15 instances because it was added automatically.

If you adjusted the size of the front ends to two cores but do not adjust the ratio, then you pay for the extra cores.  An ASE is created with two front ends, so even below the automatic scaling threshold you would pay for two extra cores if you increased the size to two core front ends.

For more information, see [Azure App Service pricing][Pricing].

## Delete an ASE ##

To delete an ASE: 

1. Use **Delete** at the top of the **App Service Environment** blade. 

1. Enter the name of your ASE to confirm that you want to delete it. When you delete an ASE, you delete all of the content within it as well. 

	![ASE deletion][3]

<!--Image references-->
[1]: ./media/using_an_app_service_environment/usingase-appcreate.png
[2]: ./media/using_an_app_service_environment/usingase-pricingtiers.png
[3]: ./media/using_an_app_service_environment/usingase-delete.png
[4]: ./media/using_an_app_service_environment/usingase-logsetup.png
[4]: ./media/using_an_app_service_environment/usingase-logs.png
[5]: ./media/using_an_app_service_environment/usingase-upgradepref.png


<!--Links-->
[Intro]: ./intro.md
[MakeExternalASE]: ./create-external-ase.md
[MakeASEfromTemplate]: ./create-from-template.md
[MakeILBASE]: ./create-ilb-ase.md
[ASENetwork]: ./network-info.md
[UsingASE]: ./using-an-ase.md
[UDRs]: ../../virtual-network/virtual-networks-udr-overview.md
[NSGs]: ../../virtual-network/security-overview.md
[ConfigureASEv1]: app-service-web-configure-an-app-service-environment.md
[ASEv1Intro]: app-service-app-service-environment-intro.md
[Functions]: ../../azure-functions/index.yml
[Pricing]: https://azure.microsoft.com/pricing/details/app-service/
[ARMOverview]: ../../azure-resource-manager/resource-group-overview.md
[ConfigureSSL]: ../configure-ssl-certificate.md
[Kudu]: https://azure.microsoft.com/resources/videos/super-secret-kudu-debug-console-for-azure-web-sites/
[AppDeploy]: ../deploy-local-git.md
[ASEWAF]: app-service-app-service-environment-web-application-firewall.md
[AppGW]: ../../application-gateway/application-gateway-web-application-firewall-overview.md
