<properties
	pageTitle="Auto scale a cloud service in the portal | Microsoft Azure"
	description="(classic) Learn how to use the classic portal to configure auto scale rules for a cloud service web role or worker role in Azure."
	services="cloud-services"
	documentationCenter=""
	authors="Thraka"
	manager="timlt"
	editor=""/>

<tags
	ms.service="cloud-services"
	ms.workload="tbd"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="06/22/2016"
	ms.author="adegeo"/>


# How to auto scale a cloud service

> [AZURE.SELECTOR]
- [Azure portal](cloud-services-how-to-scale-portal.md)
- [Azure classic portal](cloud-services-how-to-scale.md)

On the Scale page of the Azure classic portal, you can manually scale your web role or worker role, or you can enable automatic scaling based on CPU load or a message queue.

>[AZURE.NOTE] This article focuses on Cloud Service web and worker roles. When you create a virtual machine (classic) directly, it is hosted in a cloud service. Some of this information applies to these types of virtual machines. Scaling an availability set of virtual machines is really just shutting them on and off based on the scale rules you configure. For more information about Virtual Machines and availability sets, see [Manage the Availability of Virtual Machines](../virtual-machines/virtual-machines-windows-classic-configure-availability.md)

You should consider the following information before you configure scaling for your application:

- Scaling is affected by core usage. Larger role instances use more cores. You can scale an application only within the limit of cores for your subscription. For example, if your subscription has a limit of twenty cores and you run an application with two medium sized cloud services (a total of four cores), you can only scale up other cloud service deployments in your subscription by sixteen cores. See [Cloud Service Sizes](cloud-services-sizes-specs.md) for more information about sizes.

- You must create a queue and associate it with a role before you can scale an application based on a message threshold. For more information, see [How to use the Queue Storage Service](../storage/storage-dotnet-how-to-use-queues.md).

- You can scale resources that are linked to your cloud service. For more information about linking resources, see [How to: Link a resource to a cloud service](cloud-services-how-to-manage.md#how-to-link-a-resource-to-a-cloud-service).

- To enable high availability of your application, you should ensure that it is deployed with two or more role instances. For more information, see [Service Level Agreements](https://azure.microsoft.com/support/legal/sla/).



## Schedule scaling

By default, all roles do not follow a specific schedule. Therefore, any settings changed apply to all times and all days throughout the year. If you want, you can setup manual or automatic scaling for:

- Weekdays
- Weekends
- Week nights
- Week mornings
- Specific dates
- Specific date ranges

This is conigured in the [Azure classic portal](https://manage.windowsazure.com/) on the  
**Cloud Services** > **\[Your cloud service\]** > **Scale** > **\[Production or Staging\]** page.

Click the **set up schedule times** button for each role you want to change.

![Cloud service automatic scaling based on a schedule][scale_schedules]



## Manual scale

On the **Scale** page, you can manually increase or decrease the number of running instances in a cloud service. This is configured for each schedule you've created or to all time if you have not created a schedule.

1. In the [Azure classic portal](https://manage.windowsazure.com/), click **Cloud Services**, and then click the name of the cloud service to open the dashboard.

    > [AZURE.TIP] If you don't see your cloud service, you may need to change from **Production** to **Staging** or vice versa.

2. Click **Scale**.

3. Select the schedule you want to change scaling options for. Defaults to *No scheduled times* if you have no schedules defined.

4. Find the **Scale by metric** section and select **NONE**. This is the default setting for all roles.

5. Each role in the cloud service has a slider for changing the number of instances to use.

    ![Manually scale a cloud service role][manual_scale]

    If you need more instances, you may need to change the [cloud service virtual machine size](cloud-services-sizes-specs.md).

6. Click **Save**.  
Role instances will be added or removed based on your selections.

>[AZURE.TIP] Whenever you see ![][tip_icon] move your mouse to it and you can get help about what a specific setting does.


## Automatic scale - CPU

This scales if the average percentage of CPU usage goes above or below specified thresholds; role instances are created or deleted.

1. In the [Azure classic portal](https://manage.windowsazure.com/), click **Cloud Services**, and then click the name of the cloud service to open the dashboard.

    > [AZURE.TIP] If you don't see your cloud service, you may need to change from **Production** to **Staging** or vice versa.

2. Click **Scale**.

3. Select the schedule you want to change scaling options for. Defaults to *No scheduled times* if you have no schedules defined.

4. Find the **Scale by metric** section and select **CPU**.

5. Now you can configure a minimum and maximum range of roles instances, the target CPU usage (to trigger a scale up), and how many instances to scale up and down by.

![Scale a cloud service role by cpu load][cpu_scale]

>[AZURE.TIP] Whenever you see ![][tip_icon] move your mouse to it and you can get help about what a specific setting does.





## Automatic scale - Queue

This automatically scales if the number of messages in a queue goes above or below a specified threshold; role instances are created or deleted.

1. In the [Azure classic portal](https://manage.windowsazure.com/), click **Cloud Services**, and then click the name of the cloud service to open the dashboard.

    > [AZURE.TIP] If you don't see your cloud service, you may need to change from **Production** to **Staging** or vice versa.

2. Click **Scale**.

3. Find the **Scale by metric** section and select **CPU**.

4. Now you can configure a minimum and maximum range of roles instances, the queue and amount of queue messages to process for each instance, and how many instances to scale up and down by.

![Scale a cloud service role by a message queue][queue_scale]

>[AZURE.TIP] Whenever you see ![][tip_icon] move your mouse to it and you can get help about what a specific setting does.


## Scale linked resources

Often when you scale a role, it's beneficial to scale the database that the application is using also. If you link the database to the cloud service, you can access the scaling settings for that resource by clicking on the appropriate link.

1. In the [Azure classic portal](https://manage.windowsazure.com/), click **Cloud Services**, and then click the name of the cloud service to open the dashboard.

    > [AZURE.TIP] If you don't see your cloud service, you may need to change from **Production** to **Staging** or vice versa.

2. Click **Scale**.

3. Find the **linked resources** section and clicked on **Manage scale for this database**.

    > [AZURE.NOTE] If you don't see a **linked resources** section, you probably do not have any linked resources.

![][linked_resource]


[manual_scale]: ./media/cloud-services-how-to-scale/manual-scale.png
[queue_scale]: ./media/cloud-services-how-to-scale/queue-scale.png
[cpu_scale]: ./media/cloud-services-how-to-scale/cpu-scale.png
[tip_icon]: ./media/cloud-services-how-to-scale/tip.png
[scale_schedules]: ./media/cloud-services-how-to-scale/schedules.png
[scale_popup]: ./media/cloud-services-how-to-scale/schedules-dialog.png
[linked_resource]: ./media/cloud-services-how-to-scale/linked-resources.png
