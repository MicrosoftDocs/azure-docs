---
title: Overview of Stream Analytics Dedicated
description: Learn about single tenant dedicated offering of Stream Analytics
author: sidramadoss
ms.author: sidram
ms.reviewer: mamccrea
ms.service: stream-analytics
ms.topic: overview
ms.custom: mvc
ms.date: 09/22/2020
---

# Overview of Stream Analytics Dedicated

Azure Stream Analytics (ASA) cluster offers a single-tenant deployment for customers with complex, demanding streaming use cases. At full scale, Stream Analytics cluster can process more than 200 MB/second in real time. Stream Analytics jobs running on dedicated clusters can leverage all the features in the Standard offering and also includes support for private link connectivity to your inputs and outputs. 

Stream Analytics clusters are billed by Streaming Units (SUs) which represents the amount of CPU and memory resources allocated to your cluster. A Streaming Unit is the same across Standard and Dedicated offerings. You can purchase 36, 72, 108, 144, 180 or 216 SUs for each cluster. A Stream Analytics cluster can serve as the streaming platform for your organization and can be shared by different teams working on various use cases. 

### Benefits
The core of this offering is the same engine that powers Stream Analytics jobs running in a multi-tenant environment. The single tenant, dedicated cluster provides the following benefits:
* Single tenant hosting with no noise from other tenants - your resources are truly “isolated” and perform better to handle any burst in traffic
* Scale your cluster between 36 to 216 SUs as your streaming usage increases over time
* VNet support that allows your Stream Analytics jobs to connect to your resources securely using private endpoints
* Ability to author C# user-defined functions and custom deserializers in any region of your choice
* Zero maintenance cost allowing you to focus your effort on building real time analytics solutions
* Attractive reservation pricing discounts for 1 or 3 year commitments 

### How to onboard
You can [create a Stream Analytics cluster](stream-analytics-create-cluster.md) through the [Azure portal](https://aka.ms/asaclustercreateportal). If you have any questions or need help with onboarding, you can contact the [Stream Analytics team](mailto:askasa@microsoft.com).

### FAQs
#### **How do I choose between Stream Analytics cluster vs Stream Analytics job?**
The easiest way to get started is to create and develop a Stream Analytics job to become familiar with the service and see how it can meet your analytics requirements.

However, If your inputs or outputs are secured behind a firewall or a Azure Virtual Network (VNET), you have the following 2 options as ASA jobs by itself does not support VNET.
1. If your local machine has access to the input and output resources secured by a VNET (e.g., Azure Event Hubs, Azure SQL Database), you can [install ASA tools for Visual Studio](https://docs.microsoft.com/azure/stream-analytics/stream-analytics-tools-for-visual-studio-install) on you local machine. This will allow you to develop and [test ASA jobs locally](https://docs.microsoft.com/azure/stream-analytics/stream-analytics-live-data-local-testing) on your device without incurring any cost. Once you are ready to use ASA in your architecture, you can then create a Stream Analytics cluster, configure private endpoints and run your jobs at scale.
2. You can create the Stream Analytics cluster, get it setup with the private endpoints needed for your pipeline and run your ASA jobs.

#### **What performance can I expect?**
A Streaming Unit (SU) is the same across the Standard and Dedicated offering. A single job utilizing a full 36 SU cluster can achieve approximately 36 MB/second throughput with millisecond latency. The exact number depends of the format of events and the type of analytics. Stream Analytics cluster offers more reliable performance guarantees as there is no noisy neighbor problem. All the jobs running on the cluster belongs only to you.

#### **Can I scale up or down my cluster?**
Yes. You can easily configure the capacity of your cluster allowing you to [scale up or down](stream-analytics-scale-cluster.md) as needed to meet your changing demand.

#### **Can I run my existing jobs on these new clusters I have created?**
Yes. You can link your existing jobs to your newly created Stream Analytics cluster and run it as usual. This way you don’t have to re-create your existing Stream Analytics jobs from scratch.

#### **How much will these clusters cost me?**
Your Stream Analytics clusters are charged based on the chosen Streaming Unit (SU) capacity. Clusters are billing hourly and there are no additional charges per job running in these clusters. In the future, you will incur additional charges by using Azure Private endpoints (aligned with the Azure Private link pricing model).

You can contact your account team or the [Stream Analytics team](mailto:askasa@microsoft.com) to learn about attractive [reservation pricing](https://aka.ms/asaclusterpricing) discounts for 1 and 3 year commitments. Reservation pricing will be made available on the Azure Portal in the coming months.

#### **Which inputs and outputs can I privately connect to from my Stream Analytics cluster?**
Stream Analytics supports various input and output types out of the box. Any of these services that supports Azure Private Links can connect to your jobs privately. You can [create private endpoints](stream-analytics-privateendpoints.md) in your cluster that allows jobs to access these input and output resources. 

## Next steps

You now have an overview of Azure Stream Analytics cluster. Next, you can create your cluster and run your Stream Analytics job:

* [Create a Stream Analytics cluster](stream-analytics-create-cluster.md).
* [Manage private endpoints](stream-analytics-privateendpoints.md).
* [Managing Stream Analytics jobs in a Stream Analytics cluster](stream-analytics-manage-jobs-cluster.md).
* [Create a Stream Analytics job](stream-analytics-quick-create-portal.md).