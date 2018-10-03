---
title: Scale up an app in Azure | Microsoft Docs
description: Learn how to scale up an app in Azure App Service to add capacity and features.
services: app-service
documentationcenter: ''
author: cephalin
manager: erikre
editor: mollybos

ms.assetid: f7091b25-b2b6-48da-8d4a-dcf9b7baccab
ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/05/2016
ms.author: cephalin

---
# Scale up an app in Azure

> [!NOTE]
> The new **PremiumV2** tier gives you faster CPUs, SSD storage, and doubles the memory-to-core ratio of the existing pricing tiers. With the performance advantage, you could save money by running your apps on fewer instances. To scale up to **PremiumV2** tier, see [Configure PremiumV2 tier for App Service](app-service-configure-premium-tier.md).
>

This article shows you how to scale your app in Azure App Service. There are two workflows for scaling, scale up and scale out, and this article explains the scale up workflow.

* [Scale up](https://en.wikipedia.org/wiki/Scalability#Horizontal_and_vertical_scaling): Get more CPU, memory, disk space, and extra features
  like dedicated virtual machines (VMs), custom domains and certificates, staging slots, autoscaling, and more. You scale up by changing the pricing tier of the
  App Service plan that your app belongs to.
* [Scale out](https://en.wikipedia.org/wiki/Scalability#Horizontal_and_vertical_scaling): Increase the number of VM instances that run your app.
  You can scale out to as many as 20 instances, depending on your pricing tier. [App Service Environments](environment/intro.md)
  in **Isolated** tier further increases your scale-out count to 100 instances. For more information about scaling out, see
  [Scale instance count manually or automatically](../monitoring-and-diagnostics/insights-how-to-scale.md). There, you find out how
  to use autoscaling, which is to scale instance count automatically based on predefined rules and schedules.

The scale settings take only seconds to apply and affect all apps in your [App Service plan](../app-service/azure-web-sites-web-hosting-plans-in-depth-overview.md).
They don't require you to change your code or redeploy your application.

For information about the pricing and features of individual App Service plans, see [App Service Pricing Details](https://azure.microsoft.com/pricing/details/web-sites/).  

> [!NOTE]
> Before you switch an App Service plan from the **Free** tier, you must first remove the [spending limits](https://azure.microsoft.com/pricing/spending-limits/) in place for your Azure subscription. To view or change options for your Microsoft Azure App Service subscription, see [Microsoft Azure Subscriptions][azuresubscriptions].
> 
> 

<a name="scalingsharedorbasic"></a>
<a name="scalingstandard"></a>

## Scale up your pricing tier
1. In your browser, open the [Azure portal][portal].
2. In your App Service app page, click **All settings**, and then click **Scale Up**.
   
    ![Navigate to scale up your Azure app.][ChooseWHP]
3. Choose your tier, and then click **Apply**.
   
    The **Notifications** tab will flash a green **SUCCESS** after the operation is complete.

<a name="ScalingSQLServer"></a>

## Scale related resources
If your app depends on other services, such as Azure SQL Database or Azure Storage, you can scale up these resources separately. These resources aren't managed by the App Service plan.

1. In **Essentials**, click the **Resource group** link.
   
    ![Scale up your Azure app's related resources](./media/web-sites-scale/RGEssentialsLink.png)
2. In the **Summary** part of the **Resource group** page, click a resource that you want to scale. The following screenshot
   shows a SQL Database resource and an Azure Storage resource.
   
    ![Navigate to resource group page to scale up your Azure app](./media/web-sites-scale/ResourceGroup.png)
3. For a SQL Database resource, click **Settings** > **Pricing tier** to scale the pricing tier.
   
    ![Scale up the SQL Database backend for your Azure app](./media/web-sites-scale/ScaleDatabase.png)
   
    You can also turn on [geo-replication](../sql-database/sql-database-geo-replication-overview.md) for your SQL Database instance.
   
    For an Azure Storage resource, click **Settings** > **Configuration** to scale up your storage options.
   
    ![Scale up the Azure Storage account used by your Azure app](./media/web-sites-scale/ScaleStorage.png)

<a name="OtherFeatures"></a>
<a name="devfeatures"></a>

## Compare pricing tiers
For detailed information, such as VM sizes for each pricing tier, see [App Service Pricing Details](https://azure.microsoft.com/pricing/details/web-sites/).
For a table of service limits, quotas, and constraints, and supported features in each tier, see [App Service limits](../azure-subscription-service-limits.md#app-service-limits).

<a name="Next Steps"></a>

## Next steps
* For information about pricing, support, and SLA, visit the following links:
  
    [Data Transfers Pricing Details](https://azure.microsoft.com/pricing/details/data-transfers/)
  
    [Microsoft Azure Support Plans](https://azure.microsoft.com/support/plans/)
  
    [Service Level Agreements](https://azure.microsoft.com/support/legal/sla/)
  
    [SQL Database Pricing Details](https://azure.microsoft.com/pricing/details/sql-database/)
  
    [Virtual Machine and Cloud Service Sizes for Microsoft Azure][vmsizes]
  
* For information about Azure App Service best practices, including building a scalable and resilient architecture, see [Best Practices: Azure App Service Web Apps](https://azure.microsoft.com/blog/best-practices-windows-azure-websites-waws/).
* For videos about scaling App Service apps, see the following resources:
  
  * [When to Scale Azure Websites - with Stefan Schackow](https://azure.microsoft.com/resources/videos/azure-web-sites-free-vs-standard-scaling/)
  * [Auto Scaling Azure Websites, CPU or Scheduled - with Stefan Schackow](https://azure.microsoft.com/resources/videos/auto-scaling-azure-web-sites/)
  * [How Azure Websites Scale - with Stefan Schackow](https://azure.microsoft.com/resources/videos/how-azure-web-sites-scale/)

<!-- LINKS -->
[vmsizes]:https://azure.microsoft.com/pricing/details/app-service/
[SQLaccountsbilling]:http://go.microsoft.com/fwlink/?LinkId=234930
[azuresubscriptions]:https://account.windowsazure.com/subscriptions
[portal]: https://portal.azure.com/

<!-- IMAGES -->
[ChooseWHP]: ./media/web-sites-scale/scale1ChooseWHP.png
[ResourceGroup]: ./media/web-sites-scale/scale10ResourceGroup.png
[ScaleDatabase]: ./media/web-sites-scale/scale11SQLScale.png
[GeoReplication]: ./media/web-sites-scale/scale12SQLGeoReplication.png
