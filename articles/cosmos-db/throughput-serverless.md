---
title: How to choose between provisioned throughput and serverless on Azure Cosmos DB
description: Learn about how to choose between provisioned throughput and serverless for your workload. 
author: ThomasWeiss
ms.author: thweiss
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 08/19/2020
---

# How to choose between provisioned throughput and serverless

Azure Cosmos DB is available in two different capacity modes: [provisioned throughput](set-throughput.md) and [serverless](serverless.md). You can perform the exact same database operations in both modes, but the way you get billed for these operations is radically different. The following video explains the core differences between these modes and how they fit different types of workloads:

> [!VIDEO https://www.youtube.com/embed/CgYQo6uHyt0]

> [!NOTE]
> Serverless is currently supported on the Azure Cosmos DB Core (SQL) API only.

## Detailed comparison

| Criteria | Provisioned throughput | Serverless |
| --- | --- | --- |
| Status | Generally available | In preview |
| Best suited for | Mission-critical workloads requiring predictable performance | Small-to-medium non-critical workloads with light traffic |
| How it works | For each of your containers, you provision some amount of throughput expressed in [Request Units](request-units.md) per second. Every second, this amount of Request Units is available for your database operations. Provisioned throughput can be updated manually or adjusted automatically with [autoscale](provision-throughput-autoscale.md). | You run your database operations against your containers without having to provision any capacity. |
| Limitations per account | Maximum number of Azure regions: unlimited | Maximum number of Azure regions: 1 |
| Limitations per container | Maximum throughput: unlimited<br>Maximum storage: unlimited | Maximum throughput: 5,000 RU/s<br>Maximum storage: 50 GB |
| Performance | 99.99% to 99.999% availability covered by SLA<br>< 10 ms latency for point-reads and writes covered by SLA<br>99.99% guaranteed throughput covered by SLA | 99.9% to 99.99% availability covered by SLA<br>< 10 ms latency for point-reads and < 30 ms for writes covered by SLO<br>95% burstability covered by SLO |
| Billing model | Billing is done on a per-hour basis for the RU/s provisioned, regardless of how many RUs were consumed. | Billing is done on a per-hour basis for the amount of RUs consumed by your database operations. |

> [!IMPORTANT]
> Some of the serverless limitations may be eased or removed when serverless becomes generally available and **your feedback** will help us decide! Reach out and tell us more about your serverless experience: [azurecosmosdbserverless@service.microsoft.com](mailto:azurecosmosdbserverless@service.microsoft.com).

## Burstability and expected consumption

In some situations, it may be unclear whether provisioned throughput or serverless should be chosen for a given workload. To help with this decision, you can estimate:

- Your workload's **burstability** requirement, that is what's the maximum amount of RUs you may need to consume in one second
- Your overall **expected consumption**, that is what's the total number of RUs you may consume over a month (you can estimate this with the help of the table shown [here](plan-manage-costs.md#estimating-serverless-costs))

If your workload requires to burst above 5,000 RU per second, provisioned throughput should be chosen because serverless containers can't burst above this limit. If not, you can compare the cost of both modes based on your expected consumption.

**Example 1**: a workload is expected to burst to a maximum of 10,000 RU/s and consume a total of 20,000,000 RUs over a month.

- Only provisioned throughput mode can deliver a throughput of 10,000 RU/s

**Example 2**: a workload is expected to burst to a maximum of 500 RU/s and consume a total of 20,000,000 RUs over a month.

- In provisioned throughput mode, you would provision a container with 500 RU/s for a monthly cost of: $0.008 * 5 * 730 = **$29.20**
- In serverless mode, you would pay for the consumed RUs: $0.25 * 20 = **$5.00**

**Example 3**: a workload is expected to burst to a maximum of 500 RU/s and consume a total of 250,000,000 RUs over a month.

- In provisioned throughput mode, you would provision a container with 500 RU/s for a monthly cost of: $0.008 * 5 * 730 = **$29.20**
- In serverless mode, you would pay for the consumed RUs: $0.25 * 250 = **$62.50**

(these examples are not accounting for the storage cost, which is the same between the two modes)

> [!NOTE]
> The costs shown in the previous example are for demonstration purposes only. See the [pricing page](https://azure.microsoft.com/pricing/details/cosmos-db/) for the latest pricing information.

## Next steps

- Read more about [provisioning throughput on Azure Cosmos DB](set-throughput.md)
- Read more about [Azure Cosmos DB serverless](serverless.md)
- Get familiar with the concept of [Request Units](request-units.md)
