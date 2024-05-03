---
title: Rearchitect the event-driven workflow (EDW) workload for Azure
description: Learn about architectural differences for replicating the AWS EKS Scaling with KEDA and Karpenter event driven workflow (EDW) workload in Azure.
ms.topic: how-to
ms.date: 05/01/2024
author: JnHs
ms.author: jenhayes
---

# Rearchitect the event-driven workflow (EDW) workload for Azure

Now that you understand some key platform differences between AWS and Azure, let' take a look at the workflow architecture and how it changes for Azure.

## Understand the AWS workload architecture

The AWS workload is a basic example of the [Competing Consumers design pattern](/azure/architecture/patterns/competing-consumers). The AWS implementation is a reference architecture for managing scale and cost for event-driven workflows using [Kubernetes](https://kubernetes.io/), [KEDA (Kubernetes Event-driven Autoscaling)](https://keda.sh/), and [Karpenter](https://karpenter.sh/). A producer simulation script is used to generate load via messages to a queue. These messages are then processed by a consumer running in a Kubernetes pod, with the result written to a database. KEDA is used to managed pod autoscaling via a declarative binding to the producer queue, and Karpenter is used to manage node autoscaling with just enough compute to optimize for cost. Authentication to the queue uses basic authentication via a shared key, and OAuth to the database uses [service account token volume](https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/#serviceaccount-token-volume-projection) projection.

Within the workload, an AWS EKS cluster is set up for orchestration with an Amazon Simple Queue Service (SQS) for consumers to find work and an AWS DynamoDB for producers to store results. A producer script generates messages and enqueues them to the AWS SQS. These messages are then processed by Python code that utilizes KEDA to dynamically scale the number of EKS pods, which in turn store the processed data in a DynamoDB table.

The architecture of the EDW workload in AWS is represented in the following diagram:

:::image type="content" source="media/eks-edw-rearchitect/edw-architecture-aws.png" alt-text="Architecture diagram of the EDW workload in AWS.":::

## Map AWS services to Azure services

To recreate the AWS workload in Azure with minimal changes, use an Azure equivalent for each AWS service and keep authentication methods similar to the original. In this case, you can use [Azure Queue Storage](/azure/storage/queues/storage-queues-introduction) to queue up work, as this example doesn't require the [advanced features](/azure/service-bus-messaging/service-bus-azure-and-service-bus-queues-compared-contrasted) of Azure Service Bus or Event Hub, and [Azure CosmosDB for Table](/azure/cosmos-db/table/introduction) to store results.

The following table summarizes the service mapping:

| **Service mapping** |       **AWS service**      |     **Azure service**    |
|:--------------------|:---------------------------|:-------------------------|
| Queuing             | Simple Queue Service       | [Azure Queue Storage](/azure/storage/queues/storage-queues-introduction)     |
| Persistance         | DynamoDB (No SQL)          | [Azure CosmosDB for Table](/azure/cosmos-db/table/introduction) (No SQL)        |
| Orchestration       | Elastic Kubernetes Service | [Azure Kubernetes Service](/azure/aks/) |
| Identity | AWS IAM | [Microsoft Entra](/entra) |

## Understand the Azure workload architecture

Using the service mapping described in this article, the architecture for the Azure version of the EDW workload is represented in the following diagram:

:::image type="content" source="media/eks-edw-rearchitect/edw-architecture-azure.png" alt-text="Architecture diagram of the EDW workload in Azure.":::

## Understand compute options

Depending on cost considerations and resilience to possible node eviction, users can choose different types of compute. In AWS, users can choose between on-demand compute (more expensive but no eviction risk) or Spot instances (cheaper but with eviction risk). Azure offers similar compute options for Azure Kubernetes Service (AKS) users, who can select either an [on-demand node pool](/azure/aks/create-node-pools) or a [Spot node pool](/azure/aks/spot-node-pool) according to the workload needs.

The next step after creating an equivalent infrastructure architecture for Azure is to start looking into the code and authentication changes that are required for the app to work on Azure.

## Next step

- [Refactor your application code](eks-edw-refactor.md) for Azure.
