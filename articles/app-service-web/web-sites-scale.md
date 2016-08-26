<properties 
	pageTitle="Scale up an app in Azure" 
	description="Learn how to scale up an app in Azure App Service to add capacity and features." 
	services="app-service" 
	documentationCenter="" 
	authors="cephalin" 
	manager="wpickett" 
	editor="mollybos"/>

<tags 
	ms.service="app-service" 
	ms.workload="na" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="07/05/2016" 
	ms.author="cephalin"/>

# Scale up an app in Azure #

This article shows you how to scale your app in Azure App Service. There are two workflows for scaling, and this article covers the 
first workflow (scaling up):

- [Scale up](https://en.wikipedia.org/wiki/Scalability#Horizontal_and_vertical_scaling): Get more CPU, memory, disk space, and extra features
like dedicated VMs, custom domains and certificates, staging slots, autoscaling, and more. You scale out by changing the pricing tier of the 
App Service plan your app belongs to.
- [Scale out](https://en.wikipedia.org/wiki/Scalability#Horizontal_and_vertical_scaling): Increasing the number VM instances that run your app.
You can scale out to as many as 20 instances, depending on your pricing tier. Using [App Service Environments](../app-service/app-service-app-service-environments-readme.md) 
in **Premium** tier will further increase your scale-out count to 50 instances. For more information on scaling out, see
[Scale instance count manually or automatically](../azure-portal/insights-how-to-scale.md). There you will find out how
to use autoscaling, which is to scale instance count automatically based on predefined rules and schedules. 

The scale settings take only seconds to apply and affect all apps in your [App Service plan](../app-service/azure-web-sites-web-hosting-plans-in-depth-overview.md). 
They do not require you to change your code or redeploy your application.

For information the pricing and features of individual App Service plans, see [App Service Pricing Details](/pricing/details/web-sites/).  

> [AZURE.NOTE] Before switching an App Service plan from the **Free** tier, you must first remove the [spending limits](/pricing/spending-limits/) in place for your Azure subscription. To view or change options for your Microsoft Azure App Service subscription, see [Microsoft Azure Subscriptions][azuresubscriptions].

<a name="scalingsharedorbasic"></a>
<a name="scalingstandard"></a>

## Scale up your pricing tier

1. In your browser, open the [Azure Portal][portal].
	
2. In your app's blade, click **All settings**, then click **Scale Up**.
	
	![Navigate to scale up your Azure app.][ChooseWHP]
	
4. Scroll and choose your tier, then click **Select**.

	The **Notifications** tab will flash a green **SUCCESS** once the operation is complete.
	
<a name="ScalingSQLServer"></a>
##Scaling related resources
If your app depends on other services, such as Azure SQL Database or Azure Storage, you can also scale up those resources 
based on your needs. These resources are not scaled with the App Service plan and must be scaled separately.

1. In the **Essentials**, click the **Resource group** link.

	![Scale up your Azure app's related resources](./media/web-sites-scale/RGEssentialsLink.png)

2. Then, in the **Summary** part of the resource group blade, clicked one of the resource you want to scale. The screenshot below 
shows a SQL Database resource and an Azure Storage resource.

	![Navigate to resource group blade to scale up your Azure app](./media/web-sites-scale/ResourceGroup.png)

3. For a SQL Database resource, click **Settings** > **Pricing tier** to scale the pricing tier.

	![Scale up the SQL Database backend for your Azure app](./media/web-sites-scale/ScaleDatabase.png)

	You can also turn on [geo replication](../sql-database/sql-database-geo-replication-overview.md) for your SQL Database.

    For an Azure Storage resource, click **Settings** > **Configuration** to scale up your storage options.

    ![Scale up the Azure Storage account used by your Azure app](./media/web-sites-scale/ScaleStorage.png)

<a name="devfeatures"></a>
## Developer Features
Depending on the pricing tier, the following developer-oriented features are available:

### Bitness ###

- The **Basic**, **Standard**, and **Premium** tiers support 64-bit and 32-bit applications.
- The **Free** and **Shared** plan tier support 32-bit applications only.

### Debugger Support ###

- Debugger support is available for the **Free**, **Shared**, and **Basic** modes at 1 concurrent connection per App Service plan.
- Debugger support is available for the **Standard** and **Premium** modes at 5 concurrent connections per App Service plan.

<a name="OtherFeatures"></a>
## Other Features

- For detailed information about all of the remaining features in the App Service plans, including pricing and features of interest to all users (including developers), see [App Service Pricing Details](/pricing/details/web-sites/).

>[AZURE.NOTE] If you want to get started with Azure App Service before signing up for an Azure account, go to [Try App Service](http://go.microsoft.com/fwlink/?LinkId=523751), where you can immediately create a short-lived starter web app in App Service. No credit cards required; no commitments.

<a name="Next Steps"></a>
## Next Steps

- To get started with Azure, see [Microsoft Azure Free Trial](/pricing/free-trial/).
- For information on pricing, support, and SLA, visit the following links.

	[Data Transfers Pricing Details](/pricing/details/data-transfers/)

	[Microsoft Azure Support Plans](/support/plans/)

	[Service Level Agreements](/support/legal/sla/)

	[SQL Database Pricing Details](/pricing/details/sql-database/)

	[Virtual Machine and Cloud Service Sizes for Microsoft Azure][vmsizes]

	[App Service Pricing Details](/pricing/details/app-service/)

	[App Service Pricing Details - SSL Connections](/pricing/details/web-sites/#ssl-connections)

- For information on Azure App Service best practices, including building a scalable and resilient architecture, see [Best Practices: Azure App Service Web Apps](http://blogs.msdn.com/b/windowsazure/archive/2014/02/10/best-practices-windows-azure-websites-waws.aspx).

- Videos on scaling App Service apps:

	- [When to Scale Azure Websites - with Stefan Schackow](/documentation/videos/azure-web-sites-free-vs-standard-scaling/)
	- [Auto Scaling Azure Websites, CPU or Scheduled - with Stefan Schackow](/documentation/videos/auto-scaling-azure-web-sites/)
	- [How Azure Websites Scale - with Stefan Schackow](/documentation/videos/how-azure-web-sites-scale/)


<!-- LINKS -->
[vmsizes]:/pricing/details/app-service/
[SQLaccountsbilling]:http://go.microsoft.com/fwlink/?LinkId=234930
[azuresubscriptions]:http://go.microsoft.com/fwlink/?LinkID=235288
[portal]: https://portal.azure.com/

<!-- IMAGES -->
[ChooseWHP]: ./media/web-sites-scale/scale1ChooseWHP.png
[ChooseBasicInstances]: ./media/web-sites-scale/scale2InstancesBasic.png
[SaveButton]: ./media/web-sites-scale/05SaveButton.png
[BasicComplete]: ./media/web-sites-scale/06BasicComplete.png
[ScaleStandard]: ./media/web-sites-scale/scale3InstancesStandard.png
[Autoscale]: ./media/web-sites-scale/scale4AutoScale.png
[SetTargetMetrics]: ./media/web-sites-scale/scale5AutoScaleTargetMetrics.png
[SetFirstRule]: ./media/web-sites-scale/scale6AutoScaleFirstRule.png
[SetSecondRule]: ./media/web-sites-scale/scale7AutoScaleSecondRule.png
[SetThirdRule]: ./media/web-sites-scale/scale8AutoScaleThirdRule.png
[SetRulesFinal]: ./media/web-sites-scale/scale9AutoScaleFinal.png
[ResourceGroup]: ./media/web-sites-scale/scale10ResourceGroup.png
[ScaleDatabase]: ./media/web-sites-scale/scale11SQLScale.png
[GeoReplication]: ./media/web-sites-scale/scale12SQLGeoReplication.png
 
