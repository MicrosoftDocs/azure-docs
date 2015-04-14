<properties 
	pageTitle="How to scale a cloud service | Azure" 
	description="Learn how to scale a cloud service and linked resources in Azure." 
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
	ms.date="03/02/2015" 
	ms.author="adegeo"/>





# How to Scale an Application

On the Scale page of the Azure Management Portal, you can manually scale your application or you can set parameters to automatically scale it. You can scale applications that are running Web Roles, Worker Roles, or Virtual Machines. To scale an application that is running instances of Web Roles or Worker Roles, you add or remove role instances to accommodate the work load.

When you scale an application up or down that is running Virtual Machines, new machines are not created or deleted, but are turned on or turned off from an availability set of previously created machines. You can specify scaling based on average percentage of CPU usage or based on the number of messages in a queue.

You should consider the following information before you configure scaling for your application:

- You must add Virtual Machines that you create to an availability set to scale an application that uses them. The Virtual Machines that you add can be initially turned on or turned off, but they will be turned on in a scale-up action and turned off in a scale-down action. For more information about Virtual Machines and availability sets, see [Manage the Availability of Virtual Machines](virtual-machines-manage-availability.md).

- Scaling is affected by core usage. Larger role instances or Virtual Machines use more cores. You can only scale an application within the limit of cores for your subscription. For example, if your subscription has a limit of twenty cores and you run an application with two medium sized Virtual Machines (a total of four cores), you can only scale up other cloud service deployments in your subscription by sixteen cores. All Virtual Machines in an availability set that are used in scaling an application must be the same size. For more information about core usage and machine sizes, see [Virtual Machine and Cloud Service Sizes for Azure](http://msdn.microsoft.com/library/dn197896.aspx).

- You must create a queue and associate it with a role or availability set before you can scale an application based on a message threshold. For more information, see [How to use the Queue Storage Service](http://www.windowsazure.com/develop/net/how-to-guides/queue-service).

- You can scale resources that are linked to your cloud service. For more information about linking resources, see [How to: Link a resource to a cloud service](http://www.windowsazure.com/manage/services/cloud-services/how-to-manage-a-cloud-service/#linkresources).

- To enable high availability of your application, you should ensure that it is deployed with two or more role instances or Virtual Machines. For more information, see [Service Level Agreements](https://www.windowsazure.com/support/legal/sla/).


## Manually scale an application running Web Roles or Worker Roles

On the Scale page, you can manually increase or decrease the number of running instances in a cloud service.

1. In the [Management Portal](https://manage.windowsazure.com/), click **Cloud Services**, and then click the name of the cloud service to open the dashboard.

2. Click **Scale**. Automatic scaling is disabled by default for all roles, which means that you can manually change the number of instances that are used by your application.

  ![Scale page][manual_scale]

3. Each role in the cloud service has a slider for changing the number of instances to use. To add a role instance, drag the bar right. To remove an instance, drag the bar left.

  ![Scale role][slider_role] 


  You can only increase the number of instances that are used if the appropriate number of cores are available to support the instances. The colors of the slider represent the used and available cores in your subscription:

  - Blue represents the cores that are used by the selected role

  - Dark grey represents the cores that are used by all roles and Virtual Machines in the subscription

  - Light grey represents the cores that are available to use for scaling

  - Pink represents a change made that has not been saved

4. Click **Save**. Role instances will be added or removed based on your selections.

## Automatically scale an application running Web Roles, Worker Roles, or Virtual Machines

On the Scale page, you can configure your cloud service to automatically increase or decrease the number of instances or Virtual Machines that are used by your application. You can configure scaling based on the following parameters:

- [Average CPU usage](#averagecpu) - If the average percentage of CPU usage goes above or below specified thresholds, role instances are created or deleted, or Virtual Machines are are turned on or turned off from an availability set.
- [Queue messages](#queuemessages) - If the number of messages in a queue goes above or below a specified threshold, role instances are created or deleted, or Virtual Machines are are turned on or turned off from an availability set.

## Average CPU usage

1. In the [Management Portal](https://manage.windowsazure.com/), click **Cloud Services**, and then click the name of the cloud service to open the dashboard.

2. Click **Scale**.

3. Scroll to the section for the role or availability set, and then click **CPU**. This enables automatic scaling of your application based on the average percentage of CPU resources that it uses.

  ![Autoscale on][autoscale_on]

4. Each role or availability set has a slider for changing the number of instances that can be used. To set the maximum number of instances that can be used, drag the bar on the right to the right. To set the minimum number of instances that can be used, drag the bar on the left to the left.

  **Note:** On the Scale page, **Instance** represents either a role instance or an instance of a Virtual Machine.

  ![Instance range][instance_range]

  The maximum number of instances is limited by the cores that are available in the subscription. The colors of the slider represent the used and available cores in your subscription:

  - Blue represents the maximum number of cores that the role can use.

  - Dark grey represents the cores that are used by all roles and Virtual Machines in the subscription. When this value overlaps the cores used by the role, the color turns to dark blue.

  - Light grey represents the cores that are available to use for scaling.

  - Pink represents a change has been made that has not been saved.

5. A slider is used for specifying the range of average percentage of CPU usage. When the average percentage of CPU usage goes above the maximum setting, more role instances are created or Virtual Machines are turned on. When the average percentage of CPU usage goes below the minimum setting, role instances are deleted or Virtual Machines are turned off. To set the maximum average CPU percentage, drag the bar on the right to the right. To set the minimum average CPU percentage, drag the bar on the left to the left.

  ![Target cpu][target_cpu]

6. You can specify the number of instances to add or turn on each time your application is scaled up. To increase the number of instances that are created or turned on when your application is scaled up, drag the bar right. To decrease the number, drag the bar left.

  ![Scale cpu up][scale_cpuup]

7. Set the number of minutes to wait between the last scaling action and the next scale-up action. The last scaling action can be either scale-up or scale-down.

  ![Up time][scale_uptime]

  All instances are included when calculating the average percentage of CPU usage and the average is based on use over the previous hour. Depending on the number of instances that your application is using, it can take longer than the specified wait time for the scale action to occur if the wait time is set very low. The minimum time between scaling actions is five minutes. Scaling actions cannot occur if any of the instances are in a transitioning state.

8. You can also specify the number of instances to delete or turn off when your application is scaled down.  To increase the number of instances that are deleted or turned off when your application is scaled down, drag the bar right. To decrease the number, drag the bar left.

	![Scale cpu down][scale_cpudown]

	If your application can have sudden increases in CPU usage, you must make sure that you have a sufficient minimum number of instances to handle them.

9. Set the number of minutes to wait between the last scaling action and the next scale-down action. The last scaling action can be either scale-up or scale-down.

	![Down time][scale_downtime]

10. Click **Save**. The scaling action can take up to five minutes to finish.

## Queue messages

1. In the [Management Portal](https://manage.windowsazure.com/), click **Cloud Services**, and then click the name of the cloud service to open the dashboard.
2. Click **Scale**.
3. Scroll to the section for the role or availability set, and then click **Queue**. This enables automatic scaling of your application based on a target number of queue messages.

	![Scale queue][scale_queue]

4. Each role or availability set in the cloud service has a slider for changing the number of instances that can be used. To set the maximum number of instances that can be used, drag the bar on the right to the right. To set the minimum number of instances that can be used, drag the bar on the left to the left.

	![Queue range][queue_range]

	**Note:** On the Scale page, **Instance** represents either a role instance or an instance of a Virtual Machine.
	
	The maximum number of instances is limited by the cores that are available in the subscription. The colors of the slider represent the used and available cores in your subscription:
	- Blue represents the maximum number of cores that the role can use.
	- Dark grey represents the cores that are used by all roles and Virtual Machines in the subscription. When this value overlaps the cores used by the role, the color turns to dark blue.
	- Light grey represents the cores that are available to use for scaling.
	- Pink represents a change has been made that has not been saved.

5. Select the storage account that is associated with the queue that you want to use.

	![Storage name][storage_name]	

6. Select the queue.

	![Queue name][queue_name]

7. Specify the number of messages that you expect each instance to support. Instances will scale based on the total number of messages divided by the target number of messages per machine.

	![Message number][message_number]

8. You can specify the number of instances to add or turn on each time your application is scaled up. To increase the number of instances that are added or turned on when your application is scaled up, drag the bar right. To decrease the number, drag the bar left.

	![Scale cpu up][scale_cpuup]

9. Set the number of minutes to wait between the last scaling action and the next scale-up action. The last scaling action can be either scale-up or scale-down.

	![Up time][scale_uptime]

	The minimum time between scaling actions is five minutes. Scaling actions cannot occur if any of the instances are in a transitioning state.

10. You can also specify the number of instances to delete or not use when your application is scaled down.  A slider is used to specify the scaling increment. To increase the number of instances that are deleted or not used when your application is scaled down, drag the bar right. To decrease the number, drag the bar left.

	![Scale cpu down][scale_cpudown]

11.	Set the number of minutes to wait between the last scaling action and the next scale-down action. The last scaling action can be either scale-up or scale-down.

	![Down time][scale_downtime]

12. Click **Save**. The scaling action can take up to five minutes to finish.

## Scale linked resources

Often when you scale a role, it's beneficial to scale the database that the application is using also. If you link the database to the cloud service, you change the SQL Database edition and resize the database on the Scale page.

1. In the [Management Portal](https://manage.windowsazure.com/), click **Cloud Services**, and then click the name of the cloud service to open the dashboard.
2. Click **Scale**.
3. In the Linked Resources section, select the edition to use for the database.

	![Linked resources][linked_resources]

4. Select the size of the database.
5. Click **Save** to update the linked resources.

## Schedule the scaling of your application

You can schedule automatic scaling of your application by configuring schedules for different times. The following options are available to you for automatic scaling:

- **No schedule** - This is the default option and enables your application to be automatically scaled the same way at all times.

- **Day and night** - This option enables you to specify scaling for specific times of day and night.

**Note:** Schedules are currently not available for applications that use Virtual Machines.

1. In the [Management Portal](https://manage.windowsazure.com/), click **Cloud Services**, and then click the name of the cloud service to open the dashboard.
2. Click **Scale**.
3. On the Scale page, click **set up schedule times**.

	![Schedule scaling][scale_schedule]

4. Select the type of scaling schedule that you want to set up.

5. Specify the times that the day starts and ends and set the time zone. For day and night scheduling, the times represent the start and end of the day with the remaining time representing night.

6. Click the check mark at the bottom of the page to save the schedules.

7. After you save the schedules, they will appear in the list. You can select the time schedule that you want to use and then modify your scale settings. The scale settings will only apply during the schedule that you selected. You can edit the schedules by clicking **set up schedule times**.

[manual_scale]: ./media/cloud-services-how-to-scale/CloudServices_ManualScaleRoles.png
[slider_role]: ./media/cloud-services-how-to-scale/CloudServices_SliderRole.png
[autoscale_on]: ./media/cloud-services-how-to-scale/CloudServices_AutoscaleOn.png
[instance_range]: ./media/cloud-services-how-to-scale/CloudServices_InstanceRange.png
[target_cpu]: ./media/cloud-services-how-to-scale/CloudServices_TargetCPURange.png
[scale_cpuup]: ./media/cloud-services-how-to-scale/CloudServices_ScaleUpBy.png
[scale_uptime]: ./media/cloud-services-how-to-scale/CloudServices_ScaleUpWaitTime.png
[scale_cpudown]: ./media/cloud-services-how-to-scale/CloudServices_ScaleDownBy.png
[scale_downtime]: ./media/cloud-services-how-to-scale/CloudServices_ScaleDownWaitTime.png
[scale_queue]: ./media/cloud-services-how-to-scale/CloudServices_QueueScale.png
[queue_range]: ./media/cloud-services-how-to-scale/CloudServices_QueueRange.png
[storage_name]: ./media/cloud-services-how-to-scale/CloudServices_StorageAccountName.png
[queue_name]: ./media/cloud-services-how-to-scale/CloudServices_QueueName.png
[message_number]: ./media/cloud-services-how-to-scale/CloudServices_TargetMessageNumber.png
[linked_resources]: ./media/cloud-services-how-to-scale/CloudServices_ScaleLinkedResources.png
[scale_schedule]: ./media/cloud-services-how-to-scale/CloudServices_SetUpSchedule.png
