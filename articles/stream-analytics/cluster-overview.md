---
title: Overview of Azure Stream Analytics Clusters
description: Learn about single tenant dedicated offering of Stream Analytics Cluster.
author: ahartoon
ms.author: anboisve
ms.service: azure-stream-analytics
ms.topic: overview
ms.custom: mvc
ms.date: 03/05/2025
---

# Overview of Azure Stream Analytics Cluster

Azure Stream Analytics Cluster offers a single-tenant deployment for complex and demanding streaming scenarios. At full scale, Stream Analytics clusters can process more than 400 MB/second in real time. Stream Analytics jobs running on dedicated clusters can leverage all the features in the Standard offering and includes support for private link connectivity to your inputs and outputs.

Stream Analytics clusters are billed by Streaming Units (SUs) which represent the amount of CPU and memory resources allocated to your cluster. A Streaming Unit is the same across Standard and Dedicated offerings and Azure Stream Analytics supports two streaming unit structures: SU V1(to be deprecated) and SU V2(recommended) [learn more](./stream-analytics-streaming-unit-consumption.md).

When you create a cluster on the portal, a **Dedicated V2** cluster is created by default.  Dedicated V2 clusters support 12 to 66 SU V2s, and can be scaled in increments of 12 (12, 24, 48...). Dedicated V1 clusters are ASA's original offering and still supported, they require a minimum of 36 SUs. 

The underlying compute power for V1 and V2 streaming units is as follows:

![SU V1 and SU V2 mapping.](./media/stream-analytics-scale-jobs/su-conversion-suv2.png)

For more information on dedicated cluster offerings and pricing, visit the [Azure Stream Analytics Pricing Page](https://azure.microsoft.com/pricing/details/stream-analytics/).

> [!Note]
> Jobs in a dedicated cluster created with SU V2 capacity can only support jobs with SU V2.  Meaning, you cannot run both V1 and V2 SUs in a dedicated cluster.  Mix and match is not supported due to capacity complications.

A Stream Analytics cluster can serve as the streaming platform for your organization and can be shared by different teams working on various use cases.

> [!Note] 
> Azure Stream Analytics also supports Virtual Network Integration.  VNET integration permits network isolation which is accomplished by deploying dedicated instances of Azure Stream Analytics into your virtual network.  A minimum of 6 SU V2s is required for VNET jobs [learn more](./run-job-in-virtual-network.md).

## What are Stream Analytics clusters

Stream Analytics clusters are powered by the same engine that powers Stream Analytics jobs running in a multi-tenant environment. The single tenant, dedicated cluster has the following features:

* Single tenant hosting with no noise from other tenants. Your resources are truly "isolated" and perform better when there are burst in traffic.

* Scale your cluster between 12 to 66 SU V2s as your streaming usage increases over time.

* VNet support that allows your Stream Analytics jobs to connect to other resources securely using private endpoints.

* Ability to author C# user-defined functions and custom deserializers in any region.

* Zero maintenance cost allowing you to focus your effort on building real-time analytics solutions.

## How to get started

You can [create a Stream Analytics cluster](create-cluster.md) through the [Azure portal](https://aka.ms/asaclustercreateportal). If you have any questions or need help with onboarding, you can contact the [Stream Analytics team](mailto:askasa@microsoft.com).

## Frequently asked questions

### How do I choose between a Stream Analytics cluster and a Stream Analytics job?

The easiest way to get started is to create and develop a Stream Analytics job to become familiar with the service and see how it can meet your analytics requirements.

Stream Analytics jobs alone don't support VNets. If your inputs or outputs are secured behind a firewall or an Azure Virtual Network, you have the following two options:

* If your local machine has access to the input and output resources secured by a VNet (for example, Azure Event Hubs or Azure SQL Database), you can [install Azure Stream Analytics tools for Visual Studio](stream-analytics-tools-for-visual-studio-install.md) on your local machine. You can develop and [test Stream Analytics jobs locally](stream-analytics-live-data-local-testing.md) on your device without incurring any cost. Once you're ready to use Stream Analytics in your architecture, you can then create a Stream Analytics cluster, configure private endpoints, and run your jobs at scale.

* You can create a Stream Analytics cluster, configure the cluster with the private endpoints needed for your pipeline, and run your Stream Analytics jobs on the cluster.

### What performance can I expect?

An SU is the same across the Standard and Dedicated offerings. A single job that utilizes a full 36 SU cluster can achieve approximately 36 MB/second throughput with millisecond latency. The exact number depends on the format of events and the type of analytics. Because it's dedicated, Stream Analytics cluster offers more reliable performance guarantees. All the jobs running on your cluster belong only to you.

### Can I scale my cluster?

Yes. You can easily configure the capacity of your cluster allowing you to [scale up or down](scale-cluster.md) as needed to meet your changing demand.

### Can I run my existing jobs on these new clusters I've created?

Yes. You can link your existing jobs to your newly created Stream Analytics cluster and run it as usual. You don’t have to re-create your existing Stream Analytics jobs from scratch.

### How much will these clusters cost me?

Your Stream Analytics clusters are charged based on the chosen SU capacity. Clusters are billed hourly and there are no additional charges per job running in these clusters. See the [Private Link Service pricing page](https://azure.microsoft.com/pricing/details/private-link/) for private endpoint billing updates.

### Which inputs and outputs can I privately connect to from my Stream Analytics cluster?

Stream Analytics supports various input and output types. You can [create private endpoints](private-endpoints.md) in your cluster that allow jobs to access the input and output resources. Currently Azure SQL Database, Azure Cosmos DB, Azure Storage, Azure Data Lake Storage Gen2, Azure Event Hubs, Azure IoT Hubs, Azure Function and Azure Service Bus are supported services for which you can create managed private endpoints. 

## Next steps

You now have an overview of Azure Stream Analytics cluster. Next, you can create your cluster and run your Stream Analytics job: 

* [Create a Stream Analytics cluster](create-cluster.md)
* [Manage private endpoints in an Azure Stream Analytics cluster](private-endpoints.md)
* [Managing Stream Analytics jobs in a Stream Analytics cluster](manage-jobs-cluster.md)
* [Create a Stream Analytics job](stream-analytics-quick-create-portal.md)
