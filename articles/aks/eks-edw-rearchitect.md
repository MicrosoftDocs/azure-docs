---
title: Rearchitect the event-driven workflow (EDW) workload for Azure Kubernetes Service (AKS)
description: Learn about architectural differences for replicating the AWS EKS scaling with KEDA and Karpenter event-driven workflow (EDW) workload in AKS.
ms.topic: how-to
ms.date: 06/20/2024
author: JnHs
ms.author: jenhayes
---

# Rearchitect the event-driven workflow (EDW) workload for Azure Kubernetes Service (AKS)

Now that you understand some key platform differences between AWS and Azure relevant to this workload, let's take a look at the workflow architecture and we can change it to work on AKS.

## AWS workload architecture

The AWS workload is a basic example of the [competing consumers design pattern][competing-consumers]. The AWS implementation is a reference architecture for managing scale and cost for event-driven workflows using [Kubernetes][kubernetes], [Kubernetes Event-driven Autoscaling (KEDA)][keda], and [Karpenter][karpenter].

A producer app generates load through sending messages to a queue, and a consumer app running in a Kubernetes pod processes the messages and writes the results to a database. KEDA manages pod autoscaling through a declarative binding to the producer queue, and Karpenter manages node autoscaling with just enough compute to optimize for cost. Authentication to the queue and the database uses OAuth-based [service account token volume projection][service-account-volume-projection].

The workload consists of an AWS EKS cluster to orchestrate consumers reading messages from an Amazon Simple Queue Service (SQS) and saving processed messages to an Amazon DynamoDB table. A producer app generates messages and queues them in the Amazon SQS queue. KEDA and Karpenter dynamically scale the number of EKS nodes and pods used for the consumers.

The following diagram represents the architecture of the EDW workload in AWS:

:::image type="content" source="media/eks-edw-rearchitect/edw-architecture-aws.png" alt-text="Architecture diagram of the EDW workload in AWS.":::

## Map AWS services to Azure services

To recreate the AWS workload in Azure with minimal changes, use an Azure equivalent for each AWS service and keep authentication methods similar to the original. This example doesn't require the [advanced features][advanced-features-service-bus-event-hub] of Azure Service Bus or Azure Event Hubs. Instead, you can use [Azure Queue Storage][azure-queue-storage] to queue up work, and [Azure Table storage][azure-table-storage] to store results.

The following table summarizes the service mapping:

| **Service mapping** |       **AWS service**      |     **Azure service**    |
|:--------------------|:---------------------------|:-------------------------|
| Queuing             | Simple Queue Service       | [Azure Queue Storage][azure-queue-storage]      |
| Persistence         | DynamoDB (No SQL)          | [Azure Table storage][azure-table-storage]      |
| Orchestration       | Elastic Kubernetes Service (EKS) | [Azure Kubernetes Service (AKS)][aks] |
| Identity | AWS IAM | [Microsoft Entra][microsoft-entra] |

### Azure workload architecture

The following diagram represents the architecture of the Azure EDW workload using the [AWS to Azure service mapping](#map-aws-services-to-azure-services):

:::image type="content" source="media/eks-edw-rearchitect/edw-architecture-azure.png" alt-text="Architecture diagram of the EDW workload in Azure.":::

## Compute options

Depending on cost considerations and resilience to possible node eviction, you can choose from different types of compute.

In AWS, you can choose between on-demand compute (more expensive but no eviction risk) or Spot instances (cheaper but with eviction risk). In AKS, you can choose an [on-demand node pool][on-demand-node-pool] or a [Spot node pool][spot-node-pool] depending on your workload's needs.

## Next steps

> [!div class="nextstepaction"]
> [Refactor application code for AKS][eks-edw-refactor]

## Contributors

*This article is maintained by Microsoft. It was originally written by the following contributors*:

- Ken Kilty | Principal TPM
- Russell de Pina | Principal TPM
- Jenny Hayes | Senior Content Developer
- Carol Smith | Senior Content Developer
- Erin Schaffer | Content Developer 2

<!-- LINKS -->
[competing-consumers]: /azure/architecture/patterns/competing-consumers
[kubernetes]: https://kubernetes.io/
[keda]: https://keda.sh/
[karpenter]: https://karpenter.sh/
[service-account-volume-projection]: https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/#serviceaccount-token-volume-projection
[advanced-features-service-bus-event-hub]: ../service-bus-messaging/service-bus-azure-and-service-bus-queues-compared-contrasted.md
[azure-queue-storage]: ../storage/queues/storage-queues-introduction.md
[azure-table-storage]: ../storage/tables/table-storage-overview.md
[aks]: ./what-is-aks.md
[microsoft-entra]: /entra/fundamentals/whatis
[on-demand-node-pool]: ./create-node-pools.md
[spot-node-pool]: ./spot-node-pool.md
[eks-edw-refactor]: ./eks-edw-refactor.md
