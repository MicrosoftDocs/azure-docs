---
title: Use the Dedicated SKU for Azure Functions Durable Task Scheduler (preview)
description: Learn about how the Dedicated SKU in Azure Functions Durable Task Scheduler.
ms.topic: conceptual
ms.date: 05/06/2025
---

# Use the Dedicated SKU for Azure Functions Durable Task Scheduler (preview)

Durable Task Scheduler currently offers the Dedicated SKU only. In this article, you'll learn:
- What the Dedicated SKU provides
- How you're billed
- Relevant concepts such as *capacity unit* and *work item*

## Dedicated SKU concepts 

You're billed based on the number of "Capacity Units (CUs)" purchased. In the Durable Task Scheduler context:

- **A Capacity Unit (CU)** is a measure of the resources allocated to your scheduler resource. Each CU represents a preallocated amount of CPU, memory, and storage resources. A single CU guarantees the dispatch of a number of *work items* and provides a defined amount of storage. If extra performance and/or storage is needed, more CUs can be purchased.
- **Work item** is a message dispatched by the Durable Task Scheduler to an application, triggering the execution of orchestrator, activity, or entity functions. The number of work items that can be dispatched per second is determined by the CUs allocated to the scheduler.

The following table explains the minimum cost and features provided with each CU.

| Number of CUs | Features |
| ------------- | -------- |
| One CU        | - Single tenant with dedicated resources​</br>- Up to 2,000 work items dispatched per second​</br>- 50 GB of orchestration data storage​ |

## Pricing

Find the price of a capacity unit in a given region on the [Azure Functions pricing page](https://azure.microsoft.com/pricing/details/functions/). 

## Rate limit

For scheduling new orchestrations, a limit of 200 requests per second per capacity unit applies for the *scheduler* globally, across all task hubs. 

If the rate limit is exceeded, the gRPC status code `RESOURCE_EXHAUSTED` is returned. This code is similar to HTTP `429 (Too many requests)`.

## Determine the number of Capacity Units needed

> [!NOTE]
> Durable Task Scheduler supports purchasing only **one capacity unit** at the moment.  

To determine whether one unit is sufficient for your workload, follow these steps:

1. **Understand how to identify the number of work items per orchestration**
   - Starting an orchestration consumes a single work item.
   - Each schedule of an activity run consumes another work item.
   - Each response sent back to the Durable Task Scheduler consumes another work item.
     
1. **Estimate monthly orchestrations**  
    Calculate the total number of orchestrations you need to run per month. 

1. **Calculate total work items per second**  
    Multiply the number of orchestrations by the number of work items each orchestration consumes.

1. **Convert to work items per second**  
    Divide the total work items per month by the number of seconds in a month (approximately 2,628,000 seconds).

1. **Determine required CUs**  
    If one CU allows for up to 2,000 work items per second, divide the required work items per second by the capacity of one CU to determine the number of CUs needed.

For example, if you run 100 million orchestrations per month and each orchestration consumes seven work items, you need 700 million work items per month. Dividing this by 2,628,000 results in approximately 266 work items per second. If one CU supports 2,000 work items per second, you need one CU to handle this workload.

## Next steps

Try out the [Durable Functions quickstart sample](quickstart-durable-task-scheduler.md).