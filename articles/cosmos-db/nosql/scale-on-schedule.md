---
title: Scale Azure Cosmos DB on a schedule by using Azure Functions timer
description: Learn how to scale changes in throughput in Azure Cosmos DB using PowerShell and Azure Functions.
author: seesharprun
ms.service: cosmos-db
ms.subservice: nosql
ms.custom: ignite-2022
ms.topic: how-to
ms.date: 01/13/2020
ms.author: sidandrews
ms.reviewer: mjbrown
---

# Scale Azure Cosmos DB throughput by using Azure Functions Timer trigger
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

The performance of an Azure Cosmos DB account is based on the amount of provisioned throughput expressed in Request Units per second (RU/s). The provisioning is at a second granularity and is billed based upon the highest RU/s per hour. This provisioned capacity model enables the service to provide a predictable and consistent throughput, guaranteed low latency, and high availability. Most production workloads these features. However, in development and testing environments where Azure Cosmos DB is only used during working hours, you can scale up the throughput in the morning and scale back down in the evening after working hours.

You can set the throughput via [Azure Resource Manager Templates](./samples-resource-manager-templates.md), [Azure CLI](cli-samples.md), and [PowerShell](powershell-samples.md), for API for NoSQL accounts, or by using the language-specific Azure Cosmos DB SDKs. The benefit of using Resource Manager Templates, Azure CLI or PowerShell is that they support all Azure Cosmos DB model APIs.

## Throughput scheduler sample project

To simplify the process to scale Azure Cosmos DB on a schedule we've created a sample project called [Azure Cosmos DB throughput scheduler](https://github.com/Azure-Samples/azure-cosmos-throughput-scheduler). This project is an Azure Functions app with two timer triggers- "ScaleUpTrigger" and "ScaleDownTrigger". The triggers run a PowerShell script that sets the throughput on each resource as defined in the `resources.json` file in each trigger. The ScaleUpTrigger is configured to run at 8 AM UTC and the ScaleDownTrigger is configured to run at 6 PM UTC and these times can be easily updated within the `function.json` file for each trigger.

You can clone this project locally, modify it to specify the Azure Cosmos DB resources to scale up and down and the schedule to run. Later you can deploy it in an Azure subscription and secure it using managed service identity with [Azure role-based access control (Azure RBAC)](../role-based-access-control.md) permissions with the "Azure Cosmos DB operator" role to set throughput on your Azure Cosmos DB accounts.

## Next Steps

- Learn more and download the sample from [Azure Cosmos DB throughput scheduler](https://github.com/Azure-Samples/azure-cosmos-throughput-scheduler).
