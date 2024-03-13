---
title: 'Overview: Target-based scaling'
description: Learn how target-based scaling works in single-tenant Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: conceptual
ms.date: 01/29/2024
---

# Target-based scaling for Standard workflows in single-tenant Azure Logic Apps

[!INCLUDE [logic-apps-sku-standard](../../includes/logic-apps-sku-standard.md)]

Single-tenant Azure Logic Apps gives you the option to select your preferred compute resources and set up your Standard logic app resources and workflows to dynamically scale based on varying workload demands. In cloud computing, scalability is how quickly and easily you can increase or decrease the size or power of an IT solution or resource. While scalability can refer to the capability of any system to handle a growing amount of work, the terms *scale out* and *scale up* often refer to databases and data.

For example, suppose you have a new app that takes off, so demand grows from a small group of customers to millions worldwide. The ability to efficiently scale is one of most important abilities to help you keep pace with demand and minimize downtime.

## How does scaling out differ from scaling up?

Scaling out versus scaling up focuses on the ways that scalability helps you adapt and handle the volume and array of data, 
changing data volumes, and shifting workload patterns. *Horizontal scaling*, which is scaling out or in, refers to when you add more databases or divide large database into smaller nodes by using a data partitioning approach called *sharding*, which you can manage faster and more easily across servers. *Vertical scaling*, which is scaling up or down, refers to when you increase or decrease computing power or databases as needed - either by changing performance levels or by using elastic database pools to automatically adjust to your workload demands. For more overview information about scalability, see [Scaling up vs. scaling out](https://azure.microsoft.com/resources/cloud-computing-dictionary/scaling-out-vs-scaling-up).

## Scaling out and in at runtime

Single-tenant Azure Logic Apps currently uses a *target-based scaling* model to scale out or in, [similar to Azure Functions](../azure-functions/functions-target-based-scaling.md). This model is based on the target number of worker instances that you want to specify and provides a faster, simpler, and more intuitive scaling mechanism.

The following diagram shows the components in the runtime scaling architecture for single-tenant Azure Logic Apps:

:::image type="content" source="media/target-based-scaling-overview/runtime-scaling-architecture.png" alt-text="Architecture diagram shows runtime scaling components in Standard logic apps." lightbox="media/target-based-scaling-overview/runtime-scaling-architecture.png":::

Previously, Azure Logic Apps used an *incremental scaling model* that added or removed a maximum of one worker instance for each [new instance rate](../azure-functions/event-driven-scaling.md#understanding-scaling-behaviors) and also involved complex decisions that determined when to scale. The Azure Logic Apps scale monitor voted to scale up, scale down, or keep the current number of worker instances for your logic app, based on [*workflow job execution delays*](#workflow-job-execution-delay).

<a name="workflow-job-execution-delay"></a>

> [!NOTE]
>
> At runtime, Azure Logic Apps divides workflow actions into individual jobs, puts these jobs 
> into a queue, and schedules them for execution. Dispatchers regularly poll the job queue to 
> retrieve and execute these jobs. However, if compute capacity is insufficient to pick up 
> these jobs, they stay in the queue for a longer time, resulting in increased execution delays. 
> The scale monitor makes scaling decisions to keep the execution delays under control. For more 
> information about the runtime schedules and runs jobs, see [Azure Logic Apps Running Anywhere](https://techcommunity.microsoft.com/t5/azure-integration-services-blog/azure-logic-apps-running-anywhere-runtime-deep-dive/ba-p/1835564).

By comparison, target-based scaling lets you scale up to four worker instances at a time. The scale monitor calculates the desired number of worker instances required to process jobs across the job queues and returns this number to the scale controller, which helps make decisions about scaling. Also, the target-based scaling model also includes host settings that you can use to fine-tune the model's underlying dynamic scaling mechanism, which can result in faster scale-out and scale-in times. This capability lets you achieve higher throughput and reduced latency for fluctuating Standard logic app workloads.

The following diagram shows the sequence for how the scaling components interact in target-based scaling:

:::image type="content" source="media/target-based-scaling-overview/runtime-scaling-sequence.png" alt-text="Sequence diagram shows scaling process for Standard logic apps." lightbox="media/target-based-scaling-overview/runtime-scaling-architecture.png":::

The Azure Functions host controller gets the desired number of instances from the Azure Logic Apps scale monitor and uses this number to determine the demand for compute resources. The process then passes the result to the scale controller, which then makes the final decision on whether to scale out or scale in and the number of instances to add or remove. The worker instance allocator allocates or deallocates the required number of worker instances for your logic app.

The scaling calculation uses the following target-based equation:

**Target instances** = **Target scaling factor** **x** (**Job queue length** / **Target executions per instance**)

| Term | Definition |
|------|------------|
| **Target scaling factor** | A numerical value between 0.05 and 1.0 that determines the degree of scaling intensity. A higher value results in more aggressive scaling, while a lower number results in more conservative scaling. You can change the default value by using the **Runtime.TargetScaler.TargetScalingFactor** host setting as described in [Target-based scaling](edit-app-settings-host-settings.md#scaling). |
| **Job queue length** | A numerical value calculated by the Azure Logic Apps runtime extension. If you have multiple storage accounts, the equation uses the sum across the job queues. |
| **Target executions per instance** | A numerical value for the maximum number of jobs that you expect a compute instance to process at any given time. This value is calculated differently, based on whether your Standard logic app is using dynamic concurrency or static concurrency execution mode: <br><br>- [**Dynamic concurrency**](#dynamic-concurrency): Azure Logic Apps determines the value during runtime and adjusts the number of dispatcher worker instances, based on workflow's behavior and its current job processing status. <br><br>-[**Static concurrency**](#static-concurrency): The value is a fixed number that you set using the logic app resource's **Runtime.TargetScaler.TargetConcurrency** host setting as described in [Target-based scaling](edit-app-settings-host-settings.md#scaling). |

<a name="dynamic-concurrency"></a>

### Dynamic concurrency execution mode

In single-tenant Azure Logic Apps, the dynamic scaling capability intelligently adapts to the nature of the tasks at hand. For example, during compute-intensive workloads, a limit might exist on the number of concurrent jobs per instance, as opposed to scenarios where less compute-intensive tasks allow for a higher number of concurrent jobs. In scenarios where both types of tasks are processed, to ensure optimal scaling performance, the dynamic scaling capability can seamlessly adapt and automatically adjust to determine the appropriate level of concurrency, based on the current types of jobs processed.

In dynamic concurrency execution mode, the Azure Logic Apps runtime extension automatically calculates the value for the **target executions per instance** using the following equation:

**Target executions per instance** = **Job concurrency** **x** (**Target CPU utilization**/**Actual CPU utilization**)

| Term | Definition |
|------|------------|
| **Job concurrency** | The number of jobs processed by a single worker instance at sampling time. |
| **Actual CPU utilization** | The processor usage percentage of the worker instance at sampling time. |
| **Target CPU utilization** | The maximum processor usage percentage that's expected at target concurrency. You can change the default value by using the **Runtime.TargetScaler.TargetScalingCPU** host setting as described in [Target-based scaling](edit-app-settings-host-settings.md#scaling). |

<a name="static-concurrency"></a>

### Static concurrency execution mode

While dynamic concurrency is designed for allowing worker instances to process as much work as they can, while keeping each worker instance healthy and latencies low, some scenarios can exist where dynamic concurrency execution isn't suitable for specific workload needs. For these scenarios, single-tenant Azure Logic Apps also supports host-level static concurrency execution, which you can set up to override dynamic concurrency.

For these scenarios, the **Runtime.TargetScaler.TargetConcurrency** host setting governs the value for **target executions per instance**. You can set the value for the targeted maximum concurrent job polling by using the **Runtime.TargetScaler.TargetConcurrency** host setting as described in [Target-based scaling](edit-app-settings-host-settings.md#scaling).

While static concurrency can give you control over the scaling behavior in your logic apps, determining the optimal values for the **Runtime.TargetScaler.TargetConcurrency** host setting can prove difficult. Generally, you have to determine the acceptable values through a trial-and-error process of load testing your logic app workflows. Even when you determine a value that works for a particular load profile, the number of incoming trigger requests might change daily. This variability might cause your logic app to run with a suboptimal scaling configuration.

## See also

- [Target-based scaling](edit-app-settings-host-settings.md#scaling)
- [Target-based scaling support in single-tenant Azure Logic Apps](https://techcommunity.microsoft.com/t5/azure-integration-services-blog/announcement-target-based-scaling-support-in-azure-logic-apps/ba-p/3998712)
- [Single-tenant Azure Logic Apps target-based scaling performance benchmark - Burst workloads](https://techcommunity.microsoft.com/t5/azure-integration-services-blog/logic-apps-standard-target-based-scaling-performance-benchmark/ba-p/3998807)
