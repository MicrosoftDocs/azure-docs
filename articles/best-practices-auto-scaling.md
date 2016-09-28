<properties
   pageTitle="Autoscaling guidance | Microsoft Azure"
   description="Guidance on how to autoscale to dynamically allocate resources required by an application."
   services=""
   documentationCenter="na"
   authors="dragon119"
   manager="christb"
   editor=""
   tags=""/>

<tags
   ms.service="best-practice"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="07/13/2016"
   ms.author="masashin"/>

# Autoscaling guidance

[AZURE.INCLUDE [pnp-header](../includes/guidance-pnp-header-include.md)]

## Overview
Autoscaling is the process of dynamically allocating the resources required by an application to match performance requirements and satisfy service-level agreements (SLAs), while minimizing runtime costs. As the volume of work grows, an application may require additional resources to enable it to perform its tasks in a timely manner. As demand slackens, resources can be de-allocated to minimize costs, while still maintaining adequate performance and meeting SLAs.
Autoscaling takes advantage of the elasticity of cloud-hosted environments while easing management overhead. It does so by reducing the need for an operator to continually monitor the performance of a system and make decisions about adding or removing resources.
>[AZURE.NOTE] Autoscaling applies to all of the resources used by an application, not just the compute resources. For example, if your system uses message queues to send and receive information, it could create additional queues as it scales.

## Types of scaling
Scaling typically takes one of the following two forms:

- **Vertical** (often referred to as _scaling up and down_). This form requires that you modify the hardware (expand or reduce its capacity and performance), or redeploy the solution using alternative hardware that has the appropriate capacity and performance. In a cloud environment, the hardware platform is typically a virtualized environment. Unless the original hardware was substantially overprovisioned, with the consequent upfront capital expense, vertically scaling up in this environment involves provisioning more powerful resources, and then moving the system onto these new resources. Vertical scaling is often a disruptive process that requires making the system temporarily unavailable while it is being redeployed. It may be possible to keep the original system running while the new hardware is provisioned and brought online, but there will likely be some interruption while the processing transitions from the old environment to the new one. It is uncommon to use autoscaling to implement a vertical scaling strategy.
- **Horizontal** (often referred to as _scaling out and in_). This form requires deploying the solution on additional or fewer resources, which are typically commodity resources rather than high-powered systems. The solution can continue running without interruption while these resources are provisioned. When the provisioning process is complete, copies of the elements that comprise the solution can be deployed on these additional resources and made available. If demand drops, the additional resources can be reclaimed after the elements using them have been shut down cleanly. Many cloud-based systems, including Microsoft Azure, support automation of this form of scaling.

## Implement an autoscaling strategy
Implementing an autoscaling strategy typically involves the following components and processes:

- Instrumentation and monitoring systems at the application, service, and infrastructure levels. These systems capture key metrics, such as response times, queue lengths, CPU utilization, and memory usage.
- Decision-making logic that can evaluate the monitored scaling factors against predefined system thresholds or schedules, and make decisions regarding whether to scale or not.
- Components that are responsible for carrying out tasks associated with scaling the system, such as provisioning or de-provisioning resources.
- Testing, monitoring, and tuning of the autoscaling strategy to ensure that it functions as expected.

Most cloud-based environments, such as Azure, provide built-in autoscaling mechanisms that address common scenarios. If the environment or service you use doesn't provide the necessary automated scaling functionality, or if you have extreme autoscaling requirements beyond its capabilities, a custom implementation may be necessary. Use this customized implementation to collect operational and system metrics, analyze them to identify relevant data, and then scale resources accordingly.


## Configure autoscaling for an Azure solution
There are several options for configuring autoscaling for your Azure solutions:

- **Azure Autoscale** supports the most common scaling scenarios based on a schedule and, optionally, triggered scaling operations based on runtime metrics (such as processor utilization, queue length, or built-in and custom counters). You can configure simple autoscaling policies for a solution quickly and easily by using the Azure portal. For more detailed control, you can make use of the [Azure Service Management REST API](https://msdn.microsoft.com/library/azure/ee460799.aspx) or the [Azure Resource Manager REST API](https://msdn.microsoft.com//library/azure/dn790568.aspx). The [Azure Monitoring Service Management Library](http://www.nuget.org/packages/Microsoft.WindowsAzure.Management.Monitoring) and the [Microsoft Insights Library](https://www.nuget.org/packages/Microsoft.Azure.Insights/) (in preview) are SDKs that allow collecting metrics from different resources, and perform autoscaling by making use of the REST APIs. For resources where Azure Resource Manager support isn't available, or if you are using Azure Cloud Services, the Service Management REST API can be used for autoscaling. In all other cases, use Azure Resource Manager.
- **A custom solution**, based on your instrumentation on the application, and management features of Azure, can be useful. For example, you could use Azure diagnostics or other methods of instrumentation in your application, along with custom code to continually monitor and export metrics of the application. You could have custom rules that work on these metrics, and make use of the Service Management or Resource Manager REST API's to trigger autoscaling. The metrics for triggering a scaling operation can be any built-in or custom counter, or other instrumentation you implement within the application. However, a custom solution is not simple to implement, and should be considered only if none of the previous approaches can fulfill your requirements. The [Autoscaling Application Block](http://msdn.microsoft.com/library/hh680892%28v=pandp.50%29.aspx) makes use of this approach.
- **Third-party services**, such as [Paraleap AzureWatch](http://www.paraleap.com/AzureWatch), enable you to scale a solution based on schedules, service load and system performance indicators, custom rules, and combinations of different types of rules.

When choosing which autoscaling solution to adopt, consider the following points:

- Use the built-in autoscaling features of the platform, if they can meet your requirements. If not, carefully consider whether you really do need more complex scaling features. Some examples of additional requirements may include more granularity of control, different ways to detect trigger events for scaling, scaling across subscriptions, and scaling other types of resources.
- Consider if you can predict the load on the application with sufficient accuracy to depend only on scheduled autoscaling (adding and removing instances to meet anticipated peaks in demand). Where this isn't possible, use reactive autoscaling based on metrics collected at runtime, to allow the application to handle unpredictable changes in demand. Typically, you can combine these approaches. For example, create a strategy that adds resources such as compute, storage, and queues, based on a schedule of the times when you know the application is most busy. This helps to ensure that capacity is available when required, without the delay encountered when starting new instances. In addition, for each scheduled rule, define metrics that allow reactive autoscaling during that period to ensure that the application can handle sustained but unpredictable peaks in demand.
- It's often difficult to understand the relationship between metrics and capacity requirements, especially when an application is initially deployed. Prefer to provision a little extra capacity at the beginning, and then monitor and tune the autoscaling rules to bring the capacity closer to the actual load.

### Use Azure Autoscale
Autoscale enables you to configure scale out and scale in options for a solution. Autoscale can automatically add and remove instances of Azure Cloud Services web and worker roles, Azure Mobile Services, and Web Apps feature in Azure App Service. It can also enable automatic scaling by starting and stopping instances of Azure Virtual Machines. An Azure autoscaling strategy includes two sets of factors:

- Schedule-based autoscaling that can ensure additional instances are available to coincide with an expected peak in usage, and can scale in once the peak time has passed. This enables you to ensure that you have sufficient instances already running, without waiting for the system to react to the load.
- Metrics-based autoscaling that reacts to factors such as average CPU utilization over the last hour, or the backlog of messages that the solution is processing in an Azure storage or Azure Service Bus queue. This allows the application to react separately from the scheduled autoscaling rules to accommodate unplanned or unforeseen changes in demand.

Consider the following points when using Autoscale:

- Your autoscaling strategy combines both scheduled and metrics-based scaling. You can specify both types of rules for a service.
- You should configure the autoscaling rules, and then monitor the performance of your application over time. Use the results of this monitoring to adjust the way in which the system scales if necessary. However, keep in mind that autoscaling is not an instantaneous process. It takes time to react to a metric such as average CPU utilization exceeding (or falling below) a specified threshold.
- Autoscaling rules that use a detection mechanism based on a measured trigger attribute (such as CPU usage or queue length) use an aggregated value over time, rather than instantaneous values, to trigger an autoscaling action. By default, the aggregate is an average of the values. This prevents the system from reacting too quickly, or causing rapid oscillation. It also allows time for new instances that are auto-started to settle into running mode, preventing additional autoscaling actions from occurring while the new instances are starting up. For Azure Cloud Services and Azure Virtual Machines, the default period for the aggregation is 45 minutes, so it can take up to this period of time for the metric to trigger autoscaling in response to spikes in demand. You can change the aggregation period by using the SDK, but be aware that periods of fewer than 25 minutes may cause unpredictable results (for more information, see [Auto Scaling Cloud Services on CPU Percentage with the Azure Monitoring Services Management Library](http://rickrainey.com/2013/12/15/auto-scaling-cloud-services-on-cpu-percentage-with-the-windows-azure-monitoring-services-management-library/)). For Web Apps, the averaging period is much shorter, allowing new instances to be available in about five minutes after a change to the average trigger measure.
- If you configure autoscaling using the SDK rather than the web portal, you can specify a more detailed schedule during which the rules are active. You can also create your own metrics and use them with or without any of the existing ones in your autoscaling rules. For example, you may wish to use alternative counters, such as the number of requests per second or the average memory availability, or use custom counters that measure specific business processes.
- When autoscaling Azure Virtual Machines, you must deploy a number of instances of the virtual machine that is equal to the maximum number you will allow autoscaling to start. These instances must be part of the same availability set. The Virtual Machines autoscaling mechanism does not create or delete instances of the virtual machine; instead, the autoscaling rules you configure will start and stop an appropriate number of these instances. For more information, see [Automatically scale an application running Web Roles, Worker Roles, or Virtual Machines](./cloud-services/cloud-services-how-to-scale.md).
- If new instances cannot be started, perhaps because the maximum for a subscription has been reached or an error occurs during startup, the portal may show that an autoscaling operation succeeded. However, subsequent **ChangeDeploymentConfiguration** events displayed in the portal will show only that a service startup was requested, and there will be no event to indicate it was successfully completed.
- You can use the web portal UI to link resources such as SQL Database instances and queues to a compute service instance. This allows you to more easily access the separate manual and automatic scaling configuration options for each of the linked resources. For more information, see [How to: Link a resource to a cloud service](cloud-services-how-to-manage.md#linkresources) and [How to Scale an Application](./cloud-services/cloud-services-how-to-scale.md).
- When you configure multiple policies and rules, they could conflict with each other. Autoscale uses the following conflict resolution rules to ensure that there is always a sufficient number of instances running:
  - Scale out operations always take precedence over scale in operations.
  - When scale out operations conflict, the rule that initiates the largest increase in the number of instances takes precedence.
  - When scale in operations conflict, the rule that initiates the smallest decrease in the number of instances takes precedence.

<a name="the-azure-monitoring-services-management-library"></a>

## Application design considerations for implementing autoscaling
Autoscaling isn't an instant solution. Simply adding resources to a system or running more instances of a process doesn't guarantee that the performance of the system will improve. Consider the following points when designing an autoscaling strategy:

- The system must be designed to be horizontally scalable. Avoid making assumptions about instance affinity; do not design solutions that require that the code is always running in a specific instance of a process. When scaling a cloud service or web site horizontally, don't assume that a series of requests from the same source will always be routed to the same instance. For the same reason, design services to be stateless to avoid requiring a series of requests from an application to always be routed to the same instance of a service. When designing a service that reads messages from a queue and processes them, don't make any assumptions about which instance of the service handles a specific message. Autoscaling could start additional instances of a service as the queue length grows. The [Competing Consumers Pattern](http://msdn.microsoft.com/library/dn568101.aspx) describes how to handle this scenario.
- If the solution implements a long-running task, design this task to support both scaling out and scaling in. Without due care, such a task could prevent an instance of a process from being shut down cleanly when the system scales in, or it could lose data if the process is forcibly terminated. Ideally, refactor a long-running task and break up the processing that it performs into smaller, discrete chunks. The [Pipes and Filters Pattern](http://msdn.microsoft.com/library/dn568100.aspx) provides an example of how you can achieve this.
- Alternatively, you can implement a checkpoint mechanism that records state information about the task at regular intervals, and save this state in durable storage that can be accessed by any instance of the process running the task. In this way, if the process is shutdown, the work that it was performing can be resumed from the last checkpoint by using another instance.
- When background tasks run on separate compute instances, such as in worker roles of a cloud services hosted application, you may need to scale different parts of the application using different scaling policies. For example, you may need to deploy additional user interface (UI) compute instances without increasing the number of background compute instances, or the opposite of this. If you offer different levels of service (such as basic and premium service packages), you may need to scale out the compute resources for premium service packages more aggressively than those for basic service packages in order to meet SLAs.
- Consider using the length of the queue over which UI and background compute instances communicate as a criterion for your autoscaling strategy. This is the best indicator of an imbalance or difference between the current load and the processing capacity of the background task.
- If you base your autoscaling strategy on counters that measure business processes, such as the number of orders placed per hour or the average execution time of a complex transaction, ensure that you fully understand the relationship between the results from these types of counters and the actual compute capacity requirements. It may be necessary to scale more than one component or compute unit in response to changes in business process counters.  
- To prevent a system from attempting to scale out excessively, and to avoid the costs associated with running many thousands of instances, consider limiting the maximum number of instances that can be automatically added. Most autoscaling mechanisms allow you to specify the minimum and maximum number of instances for a rule. In addition, consider gracefully degrading the functionality that the system provides if the maximum number of instances have been deployed, and the system is still overloaded.
- Keep in mind that autoscaling might not be the most appropriate mechanism to handle a sudden burst in workload. It takes time to provision and start new instances of a service or add resources to a system, and the peak demand may have passed by the time these additional resources have been made available. In this scenario, it may be better to throttle the service. For more information, see the [Throttling Pattern](http://msdn.microsoft.com/library/dn589798.aspx).
- Conversely, if you do need the capacity to process all requests when the volume fluctuates rapidly, and cost isn't a major contributing factor, consider using an aggressive autoscaling strategy that starts additional instances more quickly. You can also use a scheduled policy that starts a sufficient number of instances to meet the maximum load before that load is expected.
- The autoscaling mechanism should monitor the autoscaling process, and log the details of each autoscaling event (what triggered it, what resources were added or removed, and when). If you create a custom autoscaling mechanism, ensure that it incorporates this capability. Analyze the information to help measure the effectiveness of the autoscaling strategy, and tune it if necessary. You can tune both in the short term, as the usage patterns become more obvious, and over the long term, as the business expands or the requirements of the application evolve. If an application reaches the upper limit defined for autoscaling, the mechanism might also alert an operator who could manually start additional resources if necessary. Note that, under these circumstances, the operator may also be responsible for manually removing these resources after the workload eases.

## Related patterns and guidance
The following patterns and guidance may also be relevant to your scenario when implementing autoscaling:

- [Throttling Pattern](http://msdn.microsoft.com/library/dn589798.aspx). This pattern describes how an application can continue to function and meet SLAs when an increase in demand places an extreme load on resources. Throttling can be used with autoscaling to prevent a system from being overwhelmed while the system scales out.
- [Competing Consumers Pattern](http://msdn.microsoft.com/library/dn568101.aspx). This pattern describes how to implement a pool of service instances that can handle messages from any application instance. Autoscaling can be used to start and stop service instances to match the anticipated workload. This approach enables a system to process multiple messages concurrently to optimize throughput, improve scalability and availability, and balance the workload.
- [Instrumentation and Telemetry Guidance](http://msdn.microsoft.com/library/dn589775.aspx). Instrumentation and telemetry are vital for gathering the information that can drive the autoscaling process.

## More information
- [How to Scale an Application](./cloud-services/cloud-services-how-to-scale.md)
- [Automatically scale an application running Web Roles, Worker Roles, or Virtual Machines](cloud-services-how-to-manage.md#linkresources)
- [How to: Link a resource to a cloud service](cloud-services-how-to-manage.md#linkresources)
- [Scale linked resources](./cloud-services/cloud-services-how-to-scale.md#scale-link-resources)
- [Azure Monitoring Services Management Library](http://www.nuget.org/packages/Microsoft.WindowsAzure.Management.Monitoring)
- [Azure Service Management REST API](http://msdn.microsoft.com/library/azure/ee460799.aspx)
- [Azure Resource Manager REST API](https://msdn.microsoft.com/library/azure/dn790568.aspx)
- [Microsoft Insights library](https://www.nuget.org/packages/Microsoft.Azure.Insights/)
- [Operations on Autoscaling](http://msdn.microsoft.com/library/azure/dn510374.aspx)
- [Microsoft.WindowsAzure.Management.Monitoring.Autoscale Namespace](http://msdn.microsoft.com/library/azure/microsoft.windowsazure.management.monitoring.autoscale.aspx)
