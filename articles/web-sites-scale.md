<properties 
	pageTitle="How to Scale Websites" 
	description="required" 
	services="web-sites" 
	documentationCenter="" 
	authors="cephalin" 
	manager="wpickett" 
	editor="mollybos"/>

<tags 
	ms.service="web-sites" 
	ms.workload="web" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="2/20/2015" 
	ms.author="cephalin"/>

# How to Scale Websites #

For increased performance and throughput for your websites on Microsoft Azure, you can use the Azure Management Portal to scale your Web Hosting Plan mode from Free to Shared, Basic, or Standard. 

Scaling up on Azure Websites involves two related actions: changing your Web Hosting Plan mode to a higher level of service, and configuring certain settings after you have switched to the higher level of service. Both topics are covered in this article. Higher service tiers like Standard mode offer greater robustness and flexibility in determining how your resources on Azure are used.

Changing modes and configuring them is easily done in the Scale tab of the management portal. You can scale up or down as required. These changes take only seconds to apply and affect all websites in your Web Hosting Plan. They do not require your code to be changed or your applications to be redeployed.

For information about Web Hosting Plans, see [What is a Web Hosting Plan?](../web-sites-web-hosting-plan-overview/) and [Azure Websites Web Hosting Plans In-Depth Overview](../azure-web-sites-web-hosting-plans-in-depth-overview/). For information the pricing and features of individual Web Hosting Plans, see [Websites Pricing Details](/pricing/details/websites/).  

> [AZURE.NOTE] Before switching a website from a **Free** Web Hosting Plan mode to **Basic** or **Standard** Web Hosting Plan mode, you must first remove the spending caps in place for your Azure Websites subscription. To view or change options for your Microsoft Azure Websites subscription, see [Microsoft Azure Subscriptions][azuresubscriptions].

<a name="scalingsharedorbasic"></a>
<!-- ===================================== -->
## Scaling to Shared or Basic Plan mode
<!-- ===================================== -->

1. In your browser, open the [Management Portal][portal].
	
2. In the **Websites** tab, select your website.
	
	![Selecting a website][SelectWebsite]
	
3. Click the **Scale** tab.
	
	![The scale tab][SelectScaleTab]
	
4. In the **Web Hosting Plan Mode** section, choose either **SHARED** or **BASIC**. The example in the image chooses Basic.
	
	![Choose Web Hosting Plan][ChooseWHP]
	
	The **Web Hosting Plan Sites** section shows a short list of sites in the current plan. All sites in the current plan will be changed to the Web Hosting Plan Mode that you select.
	
5. In the **Capacity** section, choose the **Instance Size**. The available options are **Small**, **Medium** or **Large**. The instance size option is not available in Shared mode. For more information about these instance sizes, see [Virtual Machine and Cloud Service Sizes for Microsoft Azure][vmsizes].
	
	![Instance size for Basic mode][ChooseBasicInstanceSize]
	
6. Use the slider to choose the **Instance Count** that you want.
	
	![Instance count for Basic mode][ChooseBasicInstanceCount]
	
7. In the command bar, choose **Save**. 
	
	![Save button][SaveButton]
 	
	> [AZURE.NOTE] You can configure and save the **Web Hosting Plan**, **Instance Size**, and **Instance Count** settings separately if you wish.
	
8. A confirmation message reminds you that sites in the same Web Hosting Plan as the current website will also change to the new mode. Choose **Yes** to complete the change. 
	
	In the example, the plan mode has been changed to **Basic**:
	
	![Plan change complete][BasicComplete]
	
<a name="scalingstandard"></a>
<!-- ================================= -->
## Scaling to Standard Plan Mode
<!-- ================================= -->

> [AZURE.NOTE] Before switching a Web Hosting Plan to Standard mode, you should remove spending caps in place for your Microsoft Azure Websites subscription. Otherwise, you risk your site becoming unavailable if you reach your caps before the billing period ends. To view or change options for your Microsoft Azure Websites subscription, see [Microsoft Azure Subscriptions][azuresubscriptions].

1. To scale to Standard, follow the same initial steps as when scaling to Shared or Basic, and then choose **Standard** for **Web Hosting Plan Mode**. 
	
	![Choose Standard Plan][ChooseStandard]
	
	As before, the **Web Hosting Plan Sites** section shows a short list of sites in the current plan. In this case, all sites in the current plan will be changed to Standard mode.
	
2. Selecting **Standard** expands the **Capacity** section to reveal the **Instance Size** and **Instance Count** options, which are also available in Basic mode. The **Edit Scale Settings for Schedule** and **Scale by Metric** options are available only in Standard mode.
	
	![Capacity section in Standard][CapacitySectionStandard]
	
3. Configure the **Instance Size**. The available options are **Small**, **Medium** or **Large**.
	
	![Choose instance size][ChooseInstanceSize]
	
	For more information about these instance sizes, see [Virtual Machine and Cloud Service Sizes for Microsoft Azure][vmsizes].
	
4. If you want to automatically scale (autoscale) resources based on daytime versus nighttime,  weekday versus weekend, and/or specific dates and times, choose **Set up schedule times** in the **Edit Scale Settings for Schedule** option.
	
	![Set up schedule times][SetUpScheduleTimesButton]
	
5. The **Set up schedule times** dialog provides a number of useful configuration choices.
	
	![SetUpScheduleTimesDialog][SetUpScheduleTimesDialog]
	
6. Under **Recurring Schedules**, select **Differing scale between Day and Night** and/or **Differing Scale between Weekday and Weekend** to scale resources based on separate daytime and nighttime schedules and/or separate weekday and weekend schedules.
	
	> [AZURE.NOTE] For the purposes of this feature, the weekend starts at the end of day Friday (8:00 PM by default), and ends at the beginning of the day on Monday (8:00 AM by default). The weekend profile uses the same day start and end that you will define in the **Time** setting.
	
7. Under **Time**, choose a start and end time for the day in half-hour increments, and a time zone. By default, the day starts at 8:00 AM and ends at 8:00 PM. Daylight Savings Time is respected for the time zone that you select. 
	
8. Under **Specific Dates**, you can create one or more named time frames for which you want to scale resources. For example, you may want to provide additional resources for a sales or launch event during which you might have large peaks in web traffic.
	
9. After you have made your choices, click **OK** to close the **Schedule Times** dialog box.
	
10.   The **Edit Scale Settings for Schedule** box now displays configurable schedules or events based on the changes you made. Select one of the recurring schedules or specific dates to configure it. 
	
	![Edit scale settings for schedule][EditScaleSettingsForSchedule]
	
	You can now use the **Scale by Metric** and the **Instance Count** features to fine tune the scaling of resources for each schedule that you choose. 
	
11.  To dynamically adjust the number of instances that your website uses if its load changes, enable the **Scale by Metric** option by choosing **CPU**.
	
	![Scale By Metric][ScaleByMetric]
	
	The graph shows the number of instances that have been used over the past week. You can use the graph to monitor scaling activity.
	
12. **Scale by Metric** modifies the **Instance Count** feature so that you can set the minimum and maximum number of virtual machines to be used for automatic scaling. Azure will never go above or below the limits that you set.
	
	![Instance count][InstanceCount]
	
13. **Scale by Metric** also enables the **Target CPU** option so that you can specify a target range for CPU usage. This range represents average CPU usage for your website. Windows Azure will add or remove Standard instances to keep your website in this range.
	
	![Target CPU][TargetCPU]
	
	**Note**: When **Scale by Metric** is enabled, Microsoft Azure checks the CPU of your website once every five minutes and adds instances as needed at that point in time. If CPU usage is low, Microsoft Azure will remove instances once every two hours to ensure that your website remains performant. Generally, putting the minimum instance count at 1 is appropriate. However, if you have sudden usage spikes on your website, be sure that you have a sufficient minimum number of instances to handle the load. For example, if you have a sudden spike of traffic during the 5 minute interval before Microsoft Azure checks your CPU usage, your site might not be responsive during that time. If you expect sudden, large amounts of traffic, set the minimum instance count higher to anticipate these bursts. 
	
14. After you have finished making changes to the items in the **Edit Scale Settings for Schedule** list, click the **Save** icon in the command bar at the bottom of the page to save all schedule settings at once (you do not have to save each schedule individually).

> [AZURE.NOTE] In the [Azure Preview Portal](https://portal.azure.com/), you can scale not only on CPU percentage, but also on the additional metrics of Memory Percentage, Disk Queue Length, HTTP Queue Length, Data In, and Data Out. You can also create one or more Scale up and Scale down rules that give you even more custom control over scaling. For more information, see [How to Scale a Website](../insights-how-to-scale/) in the Azure Preview Portal documentation.

<a name="ScalingSQLServer"></a>
## Scaling a SQL Database connected to your site	
If you have one or more SQL Databases linked to your website (regardless of web hosting plan mode), they will be listed in the **Linked Resources** page.

1. To scale one of the databases, in the **Linked Resources** section, click the name of the database to manage it.
	
2. The link takes you to the SQL Databases tab of the Azure Management Portal, where you can scale the linked SQL Database in the **Scale** page.
	
	![Scale your SQL Server database][ScaleDatabase]
	
	For **Edition**, choose **BASIC**, **STANDARD**, or **PREMIUM** depending on the storage capacity that you require. For the future of the **Web** and **BUSINESS** editions, see [Web and Business Edition Sunset FAQ](http://msdn.microsoft.com/library/azure/dn741330.aspx).
	
	The value you choose for **Max Size** specifies an upper limit for the database. Database charges are based on the amount of data that you actually store, so changing the **Max Size** property does not by itself affect your database charges. For more information, see [Accounts and Billing in Microsoft Azure SQL Database][SQLaccountsbilling].

<a name="devfeatures"></a>
## Developer Features
Depending on the web hosting plan mode, the following developer-oriented features are available:

**Bitness**

- The Basic and Standard plan modes support 64-bit and 32-bit applications.
- The Free and Shared plan modes support 32-bit applications only.

**Debugger Support**

- Debugger support is available for the Free, Shared, and Basic web hosting plan modes at 1 concurrent connection per application.
- Debugger support is available for the Standard web hosting plan mode at 5 concurrent connections per application.

<a name="OtherFeatures"></a>
## Other Features

**Web Endpoint Monitoring**

- Web endpoint monitoring is available in the Basic and Standard web hosting plan modes. For more information about web endpoint monitoring, see [How to Monitor Websites](../web-sites-monitor/).

- For detailed information about all of the remaining features in the web hosting plans, including pricing and features of interest to all users (including developers), see [Websites Pricing Details](/pricing/details/websites/).

<a name="Next Steps"></a>	
## Next Steps

- To get started with Azure, see [Microsoft Azure Free Trial](/pricing/free-trial/).
- For information on pricing, support, and SLA, visit the following links.
	- [Data Transfers Pricing Details](/pricing/details/data-transfers/)
	- [Microsoft Azure Support Plans](/support/plans/)
	- [Service Level Agreements](/support/legal/sla/)
	- [SQL Database Pricing Details](/pricing/details/sql-database/)
	- [Virtual Machine and Cloud Service Sizes for Microsoft Azure][vmsizes]
	- [Websites Pricing Details](/pricing/details/websites/)
	- [Websites Pricing Details - SSL Connections](/pricing/details/websites/#ssl-connections)

- For information on Azure Websites best practices, including building a scalable and resilient architecture, see [Best Practices: Windows Azure Websites (WAWS)](http://blogs.msdn.com/b/windowsazure/archive/2014/02/10/best-practices-windows-azure-websites-waws.aspx).
- Videos on scaling Azure Websites:
	
	- [When to Scale Azure Websites - with Stefan Schackow](/documentation/videos/azure-web-sites-free-vs-standard-scaling/)
	- [Auto Scaling Azure Websites, CPU or Scheduled - with Stefan Schackow](/documentation/videos/auto-scaling-azure-web-sites/)
	- [How Azure Websites Scale - with Stefan Schackow](/documentation/videos/how-azure-web-sites-scale/)



<!-- LINKS -->
[vmsizes]:http://go.microsoft.com/fwlink/?LinkId=309169
[SQLaccountsbilling]:http://go.microsoft.com/fwlink/?LinkId=234930
[azuresubscriptions]:https://account.windowsazure.com/subscriptions
[portal]: https://manage.windowsazure.com/

<!-- IMAGES -->
[SelectWebsite]: ./media/web-sites-scale/01SelectWebSite.png
[SelectScaleTab]: ./media/web-sites-scale/02SelectScaleTab.png

[ChooseWHP]: ./media/web-sites-scale/03aChooseWHP.png
[ChooseBasicInstanceSize]: ./media/web-sites-scale/03bChooseBasicInstanceSize.png
[ChooseBasicInstanceCount]: ./media/web-sites-scale/04ChooseBasicInstanceCount.png
[SaveButton]: ./media/web-sites-scale/05SaveButton.png
[BasicComplete]: ./media/web-sites-scale/06BasicComplete.png
[ChooseStandard]: ./media/web-sites-scale/07ChooseStandard.png
[CapacitySectionStandard]: ./media/web-sites-scale/08CapacitySectionStandard.png
[ChooseInstanceSize]: ./media/web-sites-scale/09ChooseInstanceSize.png
[SetUpScheduleTimesButton]: ./media/web-sites-scale/10SetUpScheduleTimesButton.png
[SetUpScheduleTimesDialog]: ./media/web-sites-scale/11SetUpScheduleTimesDialog.png
[EditScaleSettingsForSchedule]: ./media/web-sites-scale/12EditScaleSettingsForSchedule.png
[ScaleByMetric]: ./media/web-sites-scale/13ScaleByMetric.png
[InstanceCount]: ./media/web-sites-scale/14InstanceCount.png
[TargetCPU]: ./media/web-sites-scale/15TargetCPU.png
[LinkedResources]: ./media/web-sites-scale/16LinkedResources.png
[ScaleDatabase]: ./media/web-sites-scale/17ScaleDatabase.png
