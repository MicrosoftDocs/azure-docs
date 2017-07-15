---
title: Auto scale a cloud service in the classic portal | Microsoft Docs
description: (classic) Learn how to use the classic portal to configure auto scale rules for a cloud service web role or worker role in Azure.
services: cloud-services
documentationcenter: ''
author: Thraka
manager: timlt
editor: ''

ms.assetid: eb167d70-4eba-42a4-b157-d8d0688abf4b
ms.service: cloud-services
ms.workload: tbd
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/18/2017
ms.author: adegeo
---

# How to configure auto scaling for a Cloud Service in the classic portal
> [!div class="op_single_selector"]
> * [Azure portal](cloud-services-how-to-scale-portal.md)
> * [Azure classic portal](cloud-services-how-to-scale.md)

On the Scale page of the Azure classic portal, you can configure automatic scale settings for your web role or worker role. Alternatively, you can configure manual scaling instead of rules-based automatic scaling.

> [!NOTE]
> This article focuses on Cloud Service web and worker roles. When you create a virtual machine (classic) directly, it is hosted in a cloud service. Some of this information applies to these types of virtual machines. Scaling an availability set of virtual machines is just shutting them on and off based on the scale rules you configure. For more information about Virtual Machines and availability sets, see [Manage the Availability of Virtual Machines](../virtual-machines/windows/classic/configure-availability.md?toc=%2fazure%2fvirtual-machines%2fwindows%2fclassic%2ftoc.json)

You should consider the following information before you configure scaling for your application:

* Scaling is affected by core usage.

    Larger role instances use more cores. You can scale an application only within the limit of cores for your subscription. For example, say your subscription has a limit of 20 cores. If you run an application with two medium-sized cloud services (a total of 4 cores), you can only scale up other cloud service deployments in your subscription by the remaining 16 cores. For more information about sizes, see [Cloud Service Sizes](cloud-services-sizes-specs.md).

* You must create a queue and associate it with a role before you can scale an application based on a message threshold. For more information, see [How to use the Queue Storage Service](../storage/storage-dotnet-how-to-use-queues.md).

* You can scale resources that are linked to your cloud service. For more information about linking resources, see [How to: Link a resource to a cloud service](cloud-services-how-to-manage.md#how-to-link-a-resource-to-a-cloud-service).

* To enable high availability of your application, you should ensure that it is deployed with two or more role instances. For more information, see [Service Level Agreements](https://azure.microsoft.com/support/legal/sla/).

## Schedule scaling
By default, all roles do not follow a specific schedule. Therefore, any settings changed apply to all times and all days throughout the year. If you want, you can setup manual or automatic scaling for one of the following modes:

* Weekdays
* Weekends
* Week nights
* Week mornings
* Specific dates
* Specific date ranges

The schedule setting is configured in the [Azure classic portal](https://manage.windowsazure.com/) on the  
**Cloud Services** > **\[Your cloud service\]** > **Scale** > **\[Production or Staging\]** page.

Click the **set up schedule times** button for each role you want to change.

![Cloud service automatic scaling based on a schedule][scale_schedules]

## Manual scale
On the **Scale** page, you can manually increase or decrease the number of running instances in a cloud service. This setting is configured for each schedule you've created or to all time if you have not created a schedule.

1. In the [Azure classic portal](https://manage.windowsazure.com/), click **Cloud Services**, and then click the name of the cloud service to open the dashboard.
   
   > [!TIP]
   > If you don't see your cloud service, you may need to change from **Production** to **Staging** or vice versa.

2. Click **Scale**.
3. Select the schedule you want to change scaling options for. *No scheduled times* is the default if you have no schedules defined.
4. Find the **Scale by metric** section and select **NONE**. This setting is the default for all roles.
5. Each role in the cloud service has a slider for changing the number of instances to use.
   
    ![Manually scale a cloud service role][manual_scale]
   
    If you need more instances, you may need to change the [cloud service virtual machine size](cloud-services-sizes-specs.md).
6. Click **Save**.  
   Role instances are added or removed based on your selections.

> [!TIP]
> Whenever you see ![][tip_icon] move your mouse to it and you can get help about what a specific setting does.

## Automatic scale - CPU
This mode scales if the average percentage of CPU usage goes above or below specified thresholds. Role instances are created or deleted when this happens.

1. In the [Azure classic portal](https://manage.windowsazure.com/), click **Cloud Services**, and then click the name of the cloud service to open the dashboard.
   
   > [!TIP]
   > If you don't see your cloud service, you may need to change from **Production** to **Staging** or vice versa.

2. Click **Scale**.
3. Select the schedule you want to change scaling options for. *No scheduled times* is the default if you have no schedules defined.
4. Find the **Scale by metric** section and select **CPU**.
5. Now you can configure a minimum and maximum range of roles instances, the target CPU usage (to trigger a scale up), and how many instances to scale up and down by.

![Scale a cloud service role by cpu load][cpu_scale]

> [!TIP]
> Whenever you see ![][tip_icon] move your mouse to it and you can get help about what a specific setting does.

## Automatic scale - Queue
This mode automatically scales if the number of messages in a queue goes above or below a specified threshold. Role instances are created or deleted when this happens.

1. In the [Azure classic portal](https://manage.windowsazure.com/), click **Cloud Services**, and then click the name of the cloud service to open the dashboard.
   
   > [!TIP]
   > If you don't see your cloud service, you may need to change from **Production** to **Staging** or vice versa.

2. Click **Scale**.
3. Find the **Scale by metric** section and select **QUEUE**.
4. Now you can configure a minimum and maximum range of roles instances, the queue and number of queue messages to process for each instance, and how many instances to scale up and down by.

![Scale a cloud service role by a message queue][queue_scale]

> [!TIP]
> Whenever you see ![][tip_icon] move your mouse to it and you can get help about what a specific setting does.

## Scale linked resources
Often when you scale a role, it's beneficial to scale the database that the application is using also. If you link the database to the cloud service, you can access the scaling settings for that resource by clicking the appropriate link.

1. In the [Azure classic portal](https://manage.windowsazure.com/), click **Cloud Services**, and then click the name of the cloud service to open the dashboard.
   
   > [!TIP]
   > If you don't see your cloud service, you may need to change from **Production** to **Staging** or vice versa.

2. Click **Scale**.
3. Find the **linked resources** section and click **Manage scale for this database**.
   
   > [!NOTE]
   > If you don't see a **linked resources** section, you probably do not have any linked resources.

![][linked_resource]

[manual_scale]: ./media/cloud-services-how-to-scale/manual-scale.png
[queue_scale]: ./media/cloud-services-how-to-scale/queue-scale.png
[cpu_scale]: ./media/cloud-services-how-to-scale/cpu-scale.png
[tip_icon]: ./media/cloud-services-how-to-scale/tip.png
[scale_schedules]: ./media/cloud-services-how-to-scale/schedules.png
[scale_popup]: ./media/cloud-services-how-to-scale/schedules-dialog.png
[linked_resource]: ./media/cloud-services-how-to-scale/linked-resources.png
