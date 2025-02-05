---
title: Durable Task Scheduler storage provider for Durable Functions (preview)
description: Learn about the characteristics of the Durable Functions Durable Task Scheduler storage provider.
ms.topic: conceptual
ms.date: 02/05/2025
ms.author: azfuncdf
author: hhunter-ms
ms.subservice: durable-functions
---

# Durable Task Scheduler storage provider for Durable Functions (preview)

Todo

> [!NOTE]
> For more information on the supported storage providers for Durable Functions and how they compare, see the [Durable Functions storage providers](durable-functions-storage-providers.md) documentation.

## Pricing model

The Durable Task Scheduler is a managed backend for Durable Functions, providing high performance, reliability, and an easy monitoring experience for stateful orchestration. The Durable Task Scheduler operates as a single tenant with dedicated resources measured as Capacity Units (CUs) and providing up to 2,000 work items dispatched per second. In this context:

- **A Capacity Unit (CU)** is a measure of the resources allocated to your Durable Task Scheduler. Each CU represents a pre-allocated amount of CPU, memory, and storage resources. A single CU guarantees the dispatch of a certain number of work items and provides a defined amount of storage. If additional performance and storage are needed, more CUs can be purchased.

- **Work item** is a message dispatched by the Durable Task Scheduler to a customer's application, triggering the execution of orchestrator, activity, or entity functions. The number of work items that can be dispatched per second is determined by the CUs allocated to the Durable Task Scheduler.

| Number of CUs | Price per CU | Features |
| ------------- | ------------ | -------- |
| 1 CU          | $500/month   | - Single tenant with dedicated resources​</br>- Up to 2,000 work items* dispatched per second​</br>- 50GB of orchestration data storage​</br>- Dashboard for monitoring and managing orchestrations​</br>- Authentication and role-based access control with Managed Identity |

The following table outlines the supported regions and their current rates for Durable Task Scheduler.

| Availability region | Regional uplift | Current rate per month |
| ------------------- | --------------- | ---------------------- |
| AU East             | 45%             | $725                   |
| EU North            | 20%             | $600                   |
| SE Central          | 30%             | $650                   |
| UK South            | 25%             | $625                   |
| US North Central    | 20%             | $600                   |
| US West 2           | 0%              | $500                   |

### Determining the number of Capacity Units needed

To determine how many Capacity Units (CUs) you require, follow these steps:

1. **Understand how to identify the number of work items per orchestration**
   - Starting an orchestration consumes a single work item.
   - Each schedule of an activity run consumes an additional work item.
   - Each response sent back to the Durable Task Scheduler consumes another work item.
     
   The below example consists of 7 work items: 1 orchestration start, 3 activities scheduled, 3 activity responses sent back to the Durable Task Scheduler.

1. **Estimate monthly orchestrations**  
    Calculate the total number of orchestrations you need to run per month. 

1. **Calculate total work items per second**  
    Multiply the number of orchestrations by the number of work items each orchestration consumes.

1. **Convert to work items per second**  
    Divide the total work items per month by the number of seconds in a month (approximately 2,628,000 seconds).

1. **Determine required CUs**  
    If 1 CU allows for up to 2,000 work items per second, divide the required work items per second by the capacity of one CU to determine the number of CUs needed.

For example, if run 100 million orchestrations per month and each orchestration consumes 7 work items, you'll need 700 million work items per month. Dividing this by 2,628,000 seconds results in approximately 266 work items per second. If 1 CU supports 2,000 work items per second, you'll need 1 CU to handle this workload.

## Next steps
