<properties 
	pageTitle="Scale a web app in Azure App Service" 
	description="Learn how to scale up and scale out a web app in Azure App Service, including autoscaling." 
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
	ms.date="02/25/2016" 
	ms.author="cephalin"/>

# Scale a web app in Azure App Service #

For increased performance and throughput for your web apps on Microsoft Azure, you can use the [Azure Portal](http://portal.azure.com) to scale your [App Service](http://go.microsoft.com/fwlink/?LinkId=529714) plan from **Free** mode to **Shared**, **Basic**, **Standard**, or **Premium** mode. 

[AZURE.INCLUDE [app-service-web-to-api-and-mobile](../../includes/app-service-web-to-api-and-mobile.md)]

Scaling up on Azure web apps involves two related actions: changing your App Service plan mode to a higher level of service, and configuring certain settings after you have switched to the higher level of service. Both topics are covered in this article. Higher service tiers like **Standard** and **Premium** modes offer greater robustness and flexibility in determining how your resources on Azure are used.

The scale settings take only seconds to apply and affect all web apps in your App Service plan. They do not require your code to be changed or your applications to be redeployed.

For information about App Service plans, see [What is an App Service Plan?](../app-service/app-service-how-works-readme.md) and [Azure App Service Plans In-Depth Overview](../app-service/azure-web-sites-web-hosting-plans-in-depth-overview.md). For information the pricing and features of individual App Service plans, see [App Service Pricing Details](/pricing/details/web-sites/).  

> [AZURE.NOTE] Before switching a web app from the **Free** mode to **Basic**, **Standard**, or **Premium** mode, you must first remove the spending caps in place for your Azure App Service subscription. To view or change options for your Microsoft Azure App Service subscription, see [Microsoft Azure Subscriptions][azuresubscriptions].

<a name="scalingsharedorbasic"></a>
<!-- ===================================== -->
## Scaling to Shared or Basic mode
<!-- ===================================== -->

1. In your browser, open the [Azure Portal][portal].
	
2. In your web app's blade, click **All settings**, then click **Scale Up**.
	
	![Choose Plan][ChooseWHP]
	
4. In the **Choose your pricing tier** blade, choose either **Shared** or a **Basic** mode, then click **Select**.
	
	The **Notifications** tab will flash a green **SUCCESS** once the operation is complete. 
	
5. In settings click on **Scale out**, select *instance count that I choose manually* in the drop down, slide the **Instance** bar from left to right to increase the number of instances, then click **Save** in the command bar. The instance size option is not available in **Shared** mode. For more information about these instance sizes, see [App Service Pricing][vmsizes].
	
	![Instance size for Basic mode][ChooseBasicInstances]
	
	The **Notifications** tab will flash a green **SUCCESS** once the operation is complete. 
	
<a name="scalingstandard"></a>
<!-- ================================= -->
## Scaling to Standard or Premium mode
<!-- ================================= -->

> [AZURE.NOTE] Before switching an App Service plan to **Standard** or **Premium** mode, you should remove spending caps in place for your Microsoft Azure App Service subscription. Otherwise, you risk your web app becoming unavailable if you reach your caps before the billing period ends. To view or change options for your Microsoft Azure App Service subscription, see [Microsoft Azure Subscriptions][azuresubscriptions].

1. To scale to **Standard** or **Premium** mode, follow the same initial steps as when scaling to **Shared** or **Basic**, and then choose a **Standard** or **Premium** mode in **Choose your pricing tier**, then click **Select**. 
	
	The **Notifications** tab will flash a green **SUCCESS** once the operation is complete, and **Autoscale** will be enabled.
	
	![Scale in Standard or Premium Mode][ScaleStandard]
	
	You can still slide the **Instance** bar to manually scale to more instances, just like in **Basic** mode as shown above. However, here you will learn how to autoscale your app. 
	
2. In **Scale by**, select **schedule and performance rules** to autoscale your app.
	
	![Autoscale Mode set to Performance][Autoscale]
	
3. In **Settings**, click on **Default, scale 1-1**, move the two sliders to define the minimum and maximum number of instances to scale automatically for the App Service plan. For this tutorial, move the maximum slider to **6** instances.
	
4. Click **OK**.
	
4. In **Settings**, click **CPU Percentage > 80(increase count by 1)** to configure autoscaling rules for the default metric.  
	
	![Set Target Metrics][SetTargetMetrics]
	
	You can configure autoscaling rules for different performance metrics, including CPU, memory, disk queue, HTTP queue, and data flow. Here, you will configure autoscaling for CPU percentage that does the following:
	
	- Scale up by 1 instance if CPU is above 80% in the last 10 minutes
	- Scale up by 3 instances if CPU is above 90% in the last 5 minutes
	- Scale down by 1 instance if CPU is below 50% in the last 30 minutes 
	
	
4. Leave **Metric name** dropdown as **CPU Percentage**.
	
5. In **Scale up rules**, configure the first rule by setting **Operator** to **Greater than**, **Threshold** to **70** (%), **Duration** to **10** (minutes), **Time aggregation** to Average, **Action** to **increase count by** to **1** (instance), and **Cool down** to **10** (minutes). 
	
	![Set First Autoscale Rule][SetFirstRule]
	
	>[AZURE.NOTE] The **Cool down** setting specifies how long this rule should wait after the previous scale action to scale again.
	
6. Click **Add Rule**, then configure the second rule by setting **Operator** to **Greater than**, **Threshold** to **90** (%), **Duration** to **1** (minutes), **Time aggregation** to Average, **Action** to **increase count by**, **Value** to **3** (instance), and **Cool down** to **1** (minutes).

7. Click **OK**.
	
	![Set Second Autoscale Rule][SetSecondRule]
	
5. In **Settings**, click on **Add rule** to configure the third rule by setting **Operator** to **Less than**, **Threshold** to **50** (%), **Duration** to **30** (minutes), **Time aggregation** to **Average**,  **Action** to **decrease count by**,**Value** to **1** (instance), and **Cool down** to **60** (minutes). 
	
	![Set Third Autoscale Rule][SetThirdRule]
	
7. Click **OK**. Your autoscale rule should now be reflected in the **Scale setting** blade. 
	
	![Set Autoscale Rule Result][SetRulesFinal]

<a name="ScalingSQLServer"></a>
##Scaling a SQL Server Database connected to your web app
If you have one or more SQL Server databases linked to your web app (regardless of App Service plan mode), you can quickly scale them based on your needs.

1. To scale one of the linked databases, open your web app's blade in the [Azure portal][portal]. In the **Essentials** collapsible dropdown, click the **Resource group** link. Then, in the **Summary** part of the resource group blade, clicked one of the linked databases.

	![Linked database][ResourceGroup]
	
2. In your linked SQL Database blade, click the **Settings** > **Pricing tier** part, select one of the tiers based on your performance requirement, and click **Select**. 
	
	![Scale your SQL Database][ScaleDatabase]
	
3. You can also set up geo-replication to increase the high availability and disaster recovery capabilities of your SQL Database. To do this, click the **Geo Replication** part.
	
	![Set up geo-replication for SQL Database][GeoReplication]

<a name="devfeatures"></a>
## Developer Features
Depending on the web app's mode, the following developer-oriented features are available:

### Bitness ###

- The **Basic**, **Standard**, and **Premium** modes support 64-bit and 32-bit applications.
- The **Free** and **Shared** plan modes support 32-bit applications only.

### Debugger Support ###

- Debugger support is available for the **Free**, **Shared**, and **Basic** modes at 1 concurrent connection per App Service plan.
- Debugger support is available for the **Standard** and **Premium** modes at 5 concurrent connections per App Service plan.

<a name="OtherFeatures"></a>
## Other Features

### Web Endpoint Monitoring ###

- Web endpoint monitoring is available in the **Basic**, **Standard**, and **Premium** modes. For more information about web endpoint monitoring, see [How to Monitor Web Apps](web-sites-monitor.md).

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
	
	[App Service Pricing Details](/pricing/details/web-sites/)
	
	[App Service Pricing Details - SSL Connections](/pricing/details/web-sites/#ssl-connections)

- For information on Azure App Service best practices, including building a scalable and resilient architecture, see [Best Practices: Azure App Service Web Apps](http://blogs.msdn.com/b/windowsazure/archive/2014/02/10/best-practices-windows-azure-websites-waws.aspx).

- Videos on scaling Web Apps:
	
	- [When to Scale Azure Websites - with Stefan Schackow](/documentation/videos/azure-web-sites-free-vs-standard-scaling/)
	- [Auto Scaling Azure Websites, CPU or Scheduled - with Stefan Schackow](/documentation/videos/auto-scaling-azure-web-sites/)
	- [How Azure Websites Scale - with Stefan Schackow](/documentation/videos/how-azure-web-sites-scale/)

## What's changed
* For a guide to the change from Websites to App Service see: [Azure App Service and Its Impact on Existing Azure Services](http://go.microsoft.com/fwlink/?LinkId=529714)

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
 
